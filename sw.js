/* Prateleira Dellamed — trabalhador de segundo plano (service worker).
   Guarda o site e os arquivos dos catálogos para o app abrir sem internet.
   Tudo o que fica guardado já é público e criptografado: as chaves continuam só no aparelho (IndexedDB), nunca aqui.
   Nada do Supabase, do GitHub ou de qualquer envio (POST) é guardado.
   A versão muda a cada publicação: o cache antigo é apagado quando a nova versão assume. */
'use strict';
const VER = '2c90d848986d';
const SHELL = 'dm-site-' + VER;      // site (index.html, painel.js, ícones, manifesto)
const MEDIA = 'dm-catalogos';        // páginas, capas, miniaturas, busca e texto: NÃO leva a versão (senão o app baixaria tudo de novo a cada publicação)
const CDN = 'dm-cdn-' + VER;         // bibliotecas e fontes externas, para o leitor abrir offline
const MEUS = [SHELL, MEDIA, CDN];
const PRE = ['./', './index.html', './manifest.webmanifest', './app-192.png'];
// Externos que o leitor precisa (o navegador confere a integridade SRI de novo ao usar)
const CDN_OK = /^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
// Arquivos de catálogo: p/<id>/001.bin, capa.bin, m00.bin, busca.bin, texto.bin
const EH_MEDIA = (p) => /\/p\/[a-z0-9_-]+\/[a-z0-9]+\.bin$/i.test(p);
// Dados que mudam a cada publicação: sempre tenta a rede primeiro
const EH_DADOS = (p) => /\/(dados|produtos)\.bin$/.test(p) || /\/acessos\.json$/.test(p);

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    await Promise.all(PRE.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => null)));
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('dm-') && !MEUS.includes(k)) await caches.delete(k);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable().catch(() => null);
    await self.clients.claim();
  })());
});

/* Recados do site:
   'assumir'                          → a versão nova assume agora (botão "Atualizar")
   { tipo:'limpar', id:'<catálogo>' } → catálogo republicado: apaga o que estava guardado dele (os arquivos têm o mesmo nome)
   { tipo:'limpar' }                  → apaga tudo dos catálogos (troca de chaves, sair do acesso) */
self.addEventListener('message', (e) => {
  const d = e.data;
  if (d === 'assumir') { self.skipWaiting(); return; }
  if (!d || d.tipo !== 'limpar') return;
  e.waitUntil((async () => {
    const c = await caches.open(MEDIA);
    const alvo = d.id ? new RegExp('/p/' + String(d.id).replace(/[^a-z0-9_-]/gi, '') + '/') : /\/p\//;
    for (const req of await c.keys()) if (alvo.test(new URL(req.url).pathname)) await c.delete(req);
  })());
});

async function guardar(cache, req, res) {
  try { if (res && (res.ok || res.type === 'opaque')) await (await caches.open(cache)).put(req, res.clone()); } catch (err) { /* sem espaço: segue sem guardar */ }
  return res;
}
// Primeiro a rede; sem rede, o que estiver guardado
async function redeAntes(cache, req, ms) {
  const net = fetch(req).then((r) => guardar(cache, req, r));
  if (!ms) { try { return await net; } catch (e) { const c = await caches.match(req); if (c) return c; throw e; } }
  const tempo = new Promise((r) => setTimeout(() => r(null), ms));
  try {
    const r = await Promise.race([net.catch(() => null), tempo]);
    if (r) return r;
  } catch (e) { /* cai para o cache */ }
  const c = await caches.match(req);
  return c || net;
}
// Primeiro o guardado (abre na hora); a rede atualiza por baixo para a próxima vez
async function guardadoAntes(cache, req) {
  const c = await caches.match(req);
  const net = fetch(req).then((r) => guardar(cache, req, r)).catch(() => null);
  return c || (await net) || new Response('', { status: 504, statusText: 'offline' });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                                   // envios nunca são guardados
  let u;
  try { u = new URL(req.url); } catch (err) { return; }
  if (u.protocol !== 'https:' && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') return;
  const mesmoSite = u.origin === self.location.origin;
  if (!mesmoSite) { if (CDN_OK.test(u.href)) e.respondWith(guardadoAntes(CDN, req)); return; }   // Supabase e GitHub: nunca
  if (req.mode === 'navigate') {                                       // abrir o app: rede em até 3,5 s, senão offline
    e.respondWith((async () => {
      const pre = await e.preloadResponse.catch(() => null);
      if (pre) return guardar(SHELL, req, pre);
      try { return await redeAntes(SHELL, req, 3500); }
      catch (err) { return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error(); }
    })());
    return;
  }
  const p = u.pathname;
  if (EH_DADOS(p)) { e.respondWith(redeAntes(SHELL, req, 2500)); return; }
  if (EH_MEDIA(p)) { e.respondWith(guardadoAntes(MEDIA, req)); return; }
  if (/\.(js|css|png|webmanifest|ico|svg|jpg|jpeg|webp)$/i.test(p)) { e.respondWith(guardadoAntes(SHELL, req)); return; }
});
