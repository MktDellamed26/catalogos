/* ================= Dellamed — módulo de gestão da Prateleira (painel.js) =================
   Gerado a partir de seguro/admin.template.html (que fica como referência). Contrato: seguro/CONTRATO-painel.md.
   Script clássico carregado sob demanda pelo site (index.html), que é o host: o site faz o login, o menu, as rotas e os avisos;
   este módulo desenha a gestão (catálogos, produtos, pessoas e configurações) dentro de host.root, a barra de alterações em
   host.bar e os diálogos num <div class="dmp" id="pn-dialogs"> no body. Não contém o protocolo: usa host.P.
   Publica no GitHub pela API, com conteúdo criptografado. CSS injetado uma vez em <style id="dmp-style">, tudo sob .dmp.
   Sem manipuladores inline, sem eval/new Function, sem URLs javascript:. */
(function () {
  'use strict';
  if (window.DellamedPainel) return;

  const STYLE_ID = 'dmp-style';
  const IS_LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);

  /* ================= CSS (tokens do site: var(--navy), var(--line-ui)…; só o que é do painel é declarado em .dmp) ================= */
  const STYLE_TEXT = `
  .dmp {
    --glow: radial-gradient(120% 70% at 100% 0%, rgba(139, 184, 232, .3), rgba(139, 184, 232, 0) 62%), radial-gradient(90% 60% at 0% 100%, rgba(139, 184, 232, .16), rgba(139, 184, 232, 0) 66%);
    --warn: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23282727' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l10 18H2z'/%3E%3Cpath d='M12 10v5M12 18h.01'/%3E%3C/svg%3E");
    --c-order: 80px;
    color: var(--ink); font-family: var(--font-text); font-size: 14px; line-height: 1.5;
  }
  .dmp, .dmp *, .dmp *::before, .dmp *::after { box-sizing: border-box; }
  .dmp [hidden] { display: none !important; }
  .dmp h1, .dmp h2, .dmp h3 { margin: 0; font-family: var(--font-title); color: var(--navy); text-wrap: balance; }
  .dmp h1[tabindex="-1"]:focus, .dmp h2[tabindex="-1"]:focus, .dmp .dm-sec:focus { outline: none; }
  .dmp p { margin: 0; }
  .dmp b, .dmp strong { font-weight: 600; } /* Open Sans só até SemiBold; os títulos em Montserrat têm o 700 explícito */
  .dmp button, .dmp input, .dmp select, .dmp textarea { font: inherit; }
  /* Foco: azul-marinho nas superfícies claras; azul-claro só nas superfícies azul-marinho */
  .dmp :focus-visible { outline: 2px solid var(--navy); outline-offset: 2px; }
  .dmp .stagebar :focus-visible, .dmp .selbar.on :focus-visible, .dmp .tile.navy :focus-visible { outline-color: var(--sky); }
  .dmp .sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }
  .dmp code { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size: .92em; background: var(--light); padding: 2px 6px; border-radius: 6px; color: var(--navy); overflow-wrap: anywhere; }
  .dmp a { color: var(--navy); }
  .dmp .ico { display: inline-grid; place-items: center; flex: none; }
  .dmp .ico svg, .dmp .icon-btn svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; flex: none; }

  /* ---------- botões, campos e avisos (os mesmos do site) ---------- */
  .dmp .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 20px; border-radius: 999px; border: 1px solid transparent; font-weight: 600; font-size: 14px; white-space: nowrap; cursor: pointer; text-decoration: none; transition: background-color .15s, color .15s, border-color .15s, box-shadow .15s; }
  .dmp .btn svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex: none; }
  .dmp .btn.primary, .dmp .btn.danger { background: var(--navy); color: var(--white); }
  .dmp .btn.primary:hover, .dmp .btn.danger:hover { box-shadow: inset 0 0 0 999px rgba(255, 255, 255, .1); }
  .dmp .btn.ghost { background: transparent; color: var(--navy); border-color: var(--navy); }
  .dmp .btn.ghost:hover { background: rgba(30, 44, 79, .06); }
  .dmp .btn.ghost-w { background: transparent; color: var(--white); border-color: rgba(255, 255, 255, .6); }
  .dmp .btn.ghost-w:hover { background: rgba(255, 255, 255, .1); }
  .dmp .btn.sm { height: 32px; padding: 0 14px; font-size: 13px; }
  .dmp .btn.block { width: 100%; white-space: normal; height: auto; min-height: 42px; padding-block: 9px; line-height: 1.3; text-align: center; }
  .dmp .btn:disabled { opacity: .55; cursor: default; }
  .dmp .link { border: 0; background: none; padding: 0; color: var(--navy); font-weight: 600; font-size: 13px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; justify-self: start; }

  .dmp .card { padding: 22px 24px; border-radius: 18px; background: var(--white); box-shadow: var(--card-shadow); min-width: 0; }
  .dmp .card h2 { font-size: 18px; font-weight: 700; }
  .dmp .card h3 { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
  .dmp .card.stack > .btn { justify-self: start; }
  .dmp .muted { color: var(--ink-2); font-size: 13px; }
  .dmp .label-caps { font-family: var(--font-title); font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }
  .dmp .grid2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
  .dmp form.stack, .dmp .stack { display: grid; gap: 16px; }
  .dmp .stack > * { min-width: 0; }
  .dmp .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }

  .dmp .field { display: grid; gap: 6px; }
  .dmp .field-label { font-size: 13px; font-weight: 600; color: var(--navy); }
  .dmp .field input, .dmp .field select, .dmp .field textarea, .dmp .input { width: 100%; height: 44px; padding: 0 14px; border: 1px solid var(--line-ui); border-radius: 10px; background: var(--white); color: var(--ink); font-size: 14px; }
  .dmp .field textarea { height: auto; padding: 10px 14px; line-height: 1.5; resize: vertical; }
  .dmp .field input:focus, .dmp .field select:focus, .dmp .field textarea:focus, .dmp .input:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(30, 44, 79, .25); }
  .dmp .field.invalid input, .dmp .field.invalid textarea, .dmp .field.invalid select { border-color: var(--graphite); border-width: 2px; }
  .dmp .field .err { font-size: 12px; color: var(--graphite); font-style: normal; font-weight: 600; padding: 6px 10px 6px 30px; border-radius: 6px; background: var(--light) var(--warn) 10px center / 14px no-repeat; }
  .dmp .alert { padding: 12px 14px; border-radius: 10px; font-size: 13px; line-height: 1.5; border: 1px solid; }
  .dmp .alert.error { border-color: var(--line-ui); background: var(--light) var(--warn) 12px 13px / 16px no-repeat; color: var(--graphite); padding-left: 38px; }
  .dmp .alert.ok { border-color: var(--sky); background: rgba(139, 184, 232, .18); color: var(--navy); }
  .dmp .alert.warn { border-color: var(--silver); background: var(--light); color: var(--ink); }
  .dmp .alert .row { margin-top: 8px; }
  .dmp details.help { font-size: 13px; color: var(--ink-2); }
  .dmp details.help summary { cursor: pointer; color: var(--navy); font-weight: 600; }
  .dmp details.help ol { margin: 8px 0 0; padding-left: 20px; display: grid; gap: 4px; }
  .dmp .checks { display: flex; flex-wrap: wrap; gap: 8px 16px; }
  .dmp .check { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
  .dmp .check input { width: 16px; height: 16px; accent-color: var(--navy); }
  .dmp .banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 10px 12px 10px 16px; border-radius: 14px; background: rgba(139, 184, 232, .3); color: var(--navy); font-weight: 600; font-size: 13px; margin-bottom: 18px; }
  .dmp .unify-bar { margin-bottom: 18px; } /* aviso "acesso unificado desatualizado" acima das abas */
  .dmp .dm-sec { display: grid; gap: 18px; }
  .dmp .dm-sec > * { min-width: 0; }
  /* Cabeçalho de cada área: título no padrão da marca (primeira frase 700, o resto 300), descrição e ação principal */
  .dmp .page-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px 24px; }
  .dmp .ph-text { flex: 1 1 360px; min-width: 0; }
  .dmp .page-head h1 { font-size: 28px; font-weight: 300; line-height: 1.2; }
  .dmp .page-head h1 b { font-weight: 700; }
  .dmp .page-head p { margin-top: 6px; max-width: 72ch; color: var(--ink-2); font-size: 13px; }
  .dmp .ph-act { display: flex; flex-wrap: wrap; gap: 8px; }


  /* ---------- blocos (resumos), barra de busca e seleção ---------- */
  .dmp .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
  .dmp .tile { position: relative; min-width: 0; padding: 16px 20px; border-radius: 18px; background: var(--white); box-shadow: var(--card-shadow); }
  .dmp .tile .num { margin-top: 6px; font-family: var(--font-title); font-size: 30px; font-weight: 300; line-height: 1.1; color: var(--navy); font-variant-numeric: tabular-nums; }
  .dmp .tile .num b { font-weight: 700; }
  .dmp .tile .meta { margin-top: 2px; font-size: 12px; color: var(--ink-2); }
  .dmp .tile.navy { background: var(--glow), var(--navy); color: var(--white); box-shadow: none; }
  .dmp .tile.navy .label-caps { color: var(--sky); }
  .dmp .tile.navy .num { color: var(--white); }
  .dmp .tile.navy .meta { color: rgba(255, 255, 255, .78); }
  .dmp .tile.sky { background: rgba(139, 184, 232, .32); box-shadow: none; }
  .dmp .tile.sky .label-caps, .dmp .tile.sky .meta { color: var(--navy); }
  .dmp .toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 16px; }
  .dmp .search { position: relative; flex: 1 1 280px; max-width: 440px; min-width: 0; }
  .dmp .search > .ico { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ink-2); pointer-events: none; }
  .dmp .search .input { height: 44px; padding-left: 42px; border-color: transparent; border-radius: 14px; box-shadow: var(--card-shadow); }
  .dmp .search .input:focus { border-color: var(--navy); }
  .dmp .count { font-size: 13px; color: var(--ink-2); }
  .dmp .selbar { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 14px; padding: 5px 6px 5px 16px; border-radius: 999px; background: var(--white); box-shadow: var(--card-shadow); }
  .dmp .selbar.on { background: var(--glow), var(--navy); color: var(--white); }
  .dmp .selbar.on .check input { accent-color: var(--sky); }
  .dmp .selbar.on .btn.ghost { color: var(--white); border-color: rgba(255, 255, 255, .6); }
  .dmp .selbar.on .btn.ghost:hover { background: rgba(255, 255, 255, .12); }
  .dmp .badge { display: inline-block; padding: 1px 8px; border-radius: 999px; background: var(--sky); color: var(--navy); font-size: 11px; font-weight: 700; letter-spacing: 0; text-transform: none; }

  /* ---------- Catálogos: primeiros passos (blocos), área de soltar e linhas ---------- */
  .dmp .steps-card h2 { font-size: 18px; }
  .dmp .steps { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 14px 0 0; padding: 0; list-style: none; }
  .dmp .steps li { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; min-width: 0; padding: 14px 16px; border-radius: 14px; background: var(--light); }
  .dmp .st-n { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: var(--navy); color: var(--white); font-family: var(--font-title); font-size: 12px; font-weight: 700; }
  .dmp .steps li b { color: var(--navy); }
  .dmp .steps li .btn { margin-top: auto; }
  .dmp .steps li.done .st-n { background: var(--sky); color: var(--navy); }
  .dmp .steps li.done > span:not(.st-n) { opacity: .75; }
  .dmp .steps li.done b::after { content: " · feito"; font-weight: 400; color: var(--ink-2); }
  .dmp .drop { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 2px 18px; padding: 20px 24px; border: 2px dashed rgba(30, 44, 79, .45); border-radius: 18px; background: rgba(255, 255, 255, .65); cursor: pointer; transition: border-color .15s, background-color .15s; }
  .dmp .drop:hover, .dmp .drop.over { border-color: var(--navy); background: rgba(139, 184, 232, .16); }
  .dmp .drop-ico { grid-row: span 2; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 14px; background: rgba(139, 184, 232, .3); color: var(--navy); }
  .dmp .drop-ico svg { width: 26px; height: 26px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
  .dmp .drop b { font-family: var(--font-title); color: var(--navy); font-size: 16px; font-weight: 700; }

  /* Listas em linhas (catálogos, produtos e pessoas): cabeçalho visual + uma linha por item; cartões abaixo de 900 px */
  .dmp .list-card { overflow: hidden; border-radius: 18px; background: var(--white); box-shadow: var(--card-shadow); }
  .dmp .rows { margin: 0; padding: 0; list-style: none; }
  .dmp .rows-head { display: grid; align-items: center; gap: 16px; padding: 12px 18px; border-bottom: 1px solid var(--hair); font-family: var(--font-title); font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-2); }
  .dmp .rw { display: grid; align-items: center; gap: 6px 16px; padding: 14px 18px; border-bottom: 1px solid rgba(40, 39, 39, .07); }
  .dmp .rw:last-child { border-bottom: 0; }
  .dmp .rw:hover { background: rgba(240, 240, 240, .55); }
  .dmp .rw.changed { box-shadow: inset 4px 0 0 var(--sky); }
  .dmp .rw > * { min-width: 0; }
  .dmp .rw-title { color: var(--navy); font-weight: 600; font-size: 14px; line-height: 1.3; overflow-wrap: anywhere; }
  .dmp .rw-meta { font-size: 12px; color: var(--ink-2); }
  .dmp .rw-acts { display: flex; flex-wrap: wrap; gap: 6px; }
  .dmp .cell-l { display: none; font-size: 12px; font-weight: 600; color: var(--ink-2); }
  .dmp .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .dmp .tag { padding: 1px 8px; border: 1px solid rgba(30, 44, 79, .25); border-radius: 999px; font-size: 11px; font-weight: 600; color: var(--navy); white-space: nowrap; }
  .dmp .cat-grid { grid-template-columns: 48px minmax(0, 1fr) 76px 76px 128px var(--c-order); }
  .dmp .rows-head.cat-grid > :first-child { grid-column: 1 / 3; }
  .dmp .rw.cat-grid { grid-template-areas: "cover main site new valid order" "cover acts site new valid order"; }
  .dmp .c-cover { grid-area: cover; align-self: start; }
  .dmp .c-cover img { display: block; width: 48px; height: 64px; object-fit: cover; object-position: top; border-radius: 2px; background: var(--light); box-shadow: 0 6px 12px -6px rgba(20, 32, 60, .5); }
  .dmp .c-main { grid-area: main; align-self: end; }
  .dmp .c-site { grid-area: site; }
  .dmp .c-new { grid-area: new; }
  .dmp .c-valid { grid-area: valid; font-size: 13px; }
  .dmp .c-order { grid-area: order; }
  .dmp .rw.cat-grid > .rw-acts { grid-area: acts; align-self: start; margin-top: 4px; }
  .dmp .user-grid { grid-template-columns: 32px minmax(0, 1.5fr) minmax(0, 1fr) 140px minmax(170px, 1.1fr); }
  .dmp .rw.user-grid { grid-template-areas: "sel who comp role status" "sel acts acts acts status"; }
  .dmp .u-sel { grid-area: sel; align-self: start; }
  .dmp .u-who { grid-area: who; }
  .dmp .u-comp { grid-area: comp; font-size: 13px; overflow-wrap: anywhere; }
  .dmp .u-role { grid-area: role; }
  .dmp .u-status { grid-area: status; font-size: 12px; }
  .dmp .rw.user-grid > .rw-acts { grid-area: acts; margin-top: 4px; }
  /* Pessoas no Supabase: mesma linha das pessoas, sem a coluna de seleção */
  .dmp .sb-grid { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr) 140px minmax(130px, .8fr); }
  .dmp .rw.sb-grid { grid-template-areas: "who comp role status" "acts acts acts status"; }
  .dmp .rw.sb-grid > .rw-acts { grid-area: acts; margin-top: 4px; }
  .dmp .prod-grid { grid-template-columns: minmax(90px, .7fr) minmax(0, 1.6fr) minmax(0, 1fr) 110px 180px; }
  .dmp .rw.prod-grid { grid-template-areas: "sku name cat areas acts"; }
  .dmp .p-sku { grid-area: sku; }
  .dmp .p-name { grid-area: name; }
  .dmp .p-cat { grid-area: cat; font-size: 13px; overflow-wrap: anywhere; }
  .dmp .p-areas { grid-area: areas; font-size: 13px; }
  .dmp .rw.prod-grid > .rw-acts { grid-area: acts; justify-content: flex-end; }
  .dmp .cell { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .dmp .cell > div { min-width: 0; }
  .dmp .cell b { display: block; color: var(--navy); font-weight: 600; overflow-wrap: anywhere; }
  .dmp .cell span { font-size: 12px; color: var(--ink-2); overflow-wrap: anywhere; }
  .dmp .avatar { width: 36px; height: 36px; flex: none; display: grid; place-items: center; border-radius: 50%; background: var(--sky); color: var(--navy); font-family: var(--font-title); font-size: 12px; font-weight: 700; }
  .dmp .chip-role { display: inline-flex; align-items: center; min-height: 24px; padding: 1px 10px; border: 1px solid rgba(30, 44, 79, .3); border-radius: 999px; font-size: 12px; font-weight: 600; color: var(--navy); white-space: nowrap; }
  .dmp .sel-hit { position: relative; display: inline-grid; place-items: center; width: 24px; height: 36px; cursor: pointer; }
  .dmp .sel-hit input { width: 16px; height: 16px; margin: 0; accent-color: var(--navy); }
  .dmp .order { display: flex; gap: 4px; }
  .dmp .mini { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid var(--line-ui); border-radius: 10px; background: var(--white); color: var(--navy); cursor: pointer; }
  .dmp .mini:hover { background: rgba(139, 184, 232, .2); }
  .dmp .mini:disabled { opacity: .35; cursor: default; }
  .dmp .mini svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
  .dmp .switch { position: relative; display: inline-block; width: 40px; height: 22px; flex: none; vertical-align: middle; }
  .dmp .switch::before { content: ""; position: absolute; inset: -11px -4px; } /* área de toque de 44 px */
  .dmp .switch input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
  @media (max-width: 1199px) { .dmp .switch input { inset: -11px -2px; } } /* área de toque de 44 px sem mudar o desenho */
  .dmp .switch span { position: absolute; inset: 0; border-radius: 999px; background: var(--line-ui); transition: background-color .15s; pointer-events: none; }
  .dmp .switch span::after { content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--white); transition: transform .15s; }
  .dmp .switch input:checked + span { background: var(--navy); }
  .dmp .switch input:checked + span::after { transform: translateX(18px); }
  .dmp .switch input:focus-visible + span { outline: 2px solid var(--navy); outline-offset: 2px; }
  /* Situação: Ativo = azul-claro; Aguardando = cinza-claro com texto azul-marinho; Vencido / Sem acesso = contorno grafite com ícone */
  .dmp .status { display: inline-flex; align-items: center; gap: 6px; min-height: 24px; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }
  .dmp .status.on { background: var(--sky); color: var(--navy); }
  .dmp .status.wait { background: var(--light); color: var(--navy); border: 1px solid var(--silver); }
  .dmp .status.off { background: transparent var(--warn) 9px center / 13px no-repeat; color: var(--graphite); padding-left: 27px; border: 1px solid var(--graphite); }
  .dmp .sb-status { white-space: normal; overflow-wrap: anywhere; } /* "Conectado como <e-mail>" quebra em telas estreitas */
  .dmp .empty { padding: 40px 20px; border-radius: 18px; background: var(--white); box-shadow: var(--card-shadow); text-align: center; color: var(--ink-2); }
  .dmp .card .empty { padding: 28px 16px; background: var(--light); box-shadow: none; border-radius: 14px; }
  .dmp .empty .row { justify-content: center; margin-top: 12px; }
  /* Pessoas: título da seção do Supabase e seção "Acessos antigos" (recolhida por padrão) */
  .dmp .sec-title { font-size: 18px; font-weight: 700; }
  .dmp .legacy > summary { display: flex; align-items: center; gap: 10px; min-height: 32px; cursor: pointer; list-style: none; }
  .dmp .legacy > summary::-webkit-details-marker { display: none; }
  .dmp .legacy > summary::after { content: ""; width: 8px; height: 8px; margin: 0 6px 4px auto; border-right: 2px solid var(--navy); border-bottom: 2px solid var(--navy); transform: rotate(45deg); }
  .dmp .legacy[open] > summary::after { margin-bottom: -4px; transform: rotate(-135deg); }
  .dmp .legacy-body { margin-top: 14px; }
  .dmp .legacy .selbar { justify-self: start; }
  .dmp .legacy .list-card { box-shadow: 0 0 0 1px var(--hair); }

  /* ---------- Configurações: cartões ---------- */
  .dmp .cfg-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
  .dmp .cfg-grid > .span2 { grid-column: 1 / -1; }
  .dmp .card-head { display: flex; align-items: center; gap: 12px; }
  .dmp .card-ico { width: 40px; height: 40px; flex: none; display: grid; place-items: center; border-radius: 12px; background: rgba(139, 184, 232, .3); color: var(--navy); }
  .dmp .card-ico svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
  .dmp .sec-alert { margin-top: 14px; }
  .dmp .sec-list { display: grid; margin: 8px 0 0; padding: 0; list-style: none; }
  .dmp .sec-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 8px 24px; padding: 14px 0; border-top: 1px solid var(--hair); }
  .dmp .sec-row:first-child { border-top: 0; }
  .dmp .sec-row h3 { margin: 0 0 2px; font-size: 14px; }
  .dmp .sec-row .row { justify-content: flex-end; }

  /* ---------- Produtos: editor de áreas (estilo do leitor, lista no visual do painel "Nesta página") ---------- */
  .dmp .hs-card h2 { font-size: 18px; }
  .dmp .hs-tools { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; padding: 12px 14px; border-radius: 14px; background: var(--light); }
  .dmp .hs-tools .field { flex: 1 1 280px; max-width: 440px; }
  .dmp .hs-nav { display: flex; align-items: center; gap: 6px; min-height: 44px; }
  .dmp .hs-pg { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-2); white-space: nowrap; }
  .dmp .hs-pg .input { width: 76px; height: 36px; padding: 0 8px; text-align: center; }
  .dmp .hs-thumbs { display: flex; gap: 6px; overflow-x: auto; padding: 4px 2px 8px; }
  .dmp .hs-th { position: relative; flex: none; width: 58px; padding: 0; border: 2px solid transparent; border-radius: 6px; background: var(--light); cursor: pointer; }
  .dmp .hs-th img { display: block; width: 100%; border-radius: 4px; object-fit: cover; object-position: top; }
  .dmp .hs-th span { position: absolute; left: 3px; bottom: 3px; padding: 0 5px; border-radius: 999px; background: var(--white); color: var(--navy); font-size: 10px; font-weight: 700; }
  .dmp .hs-th[aria-current="page"] { border-color: var(--navy); }
  .dmp .hs-th.has::after { content: ""; position: absolute; top: 4px; right: 4px; width: 9px; height: 9px; border-radius: 50%; background: var(--sky); box-shadow: 0 0 0 2px var(--navy); }
  .dmp .hs-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 20px; align-items: start; }
  .dmp .hs-stage { position: relative; margin: 0 auto; max-width: 100%; background: var(--light); box-shadow: 0 18px 40px -16px rgba(20, 32, 60, .45); touch-action: none; user-select: none; -webkit-user-select: none; cursor: crosshair; }
  .dmp .hs-stage img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; -webkit-user-drag: none; }
  .dmp .hs-rects { position: absolute; inset: 0; }
  .dmp .hs-msg { position: absolute; inset: 0; display: grid; place-items: center; padding: 20px; text-align: center; color: var(--ink-2); font-size: 13px; }
  .dmp .hs-rect { position: absolute; border: 2px solid var(--navy); background: rgba(139, 184, 232, .15); cursor: move; }
  .dmp .hs-rect.changed, .dmp .hs-rect.is-new { border-style: dashed; }
  .dmp .hs-rect.sel { background: rgba(139, 184, 232, .35); box-shadow: 0 0 0 2px var(--white); z-index: 2; }
  .dmp .hs-tag { position: absolute; left: -2px; top: 0; transform: translateY(-100%); max-width: 240px; padding: 1px 6px; border-radius: 4px 4px 0 0; background: var(--navy); color: var(--white); font-size: 11px; font-weight: 600; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
  .dmp .hs-h { position: absolute; width: 12px; height: 12px; border: 2px solid var(--navy); border-radius: 2px; background: var(--white); }
  .dmp .hs-h.nw { left: -7px; top: -7px; cursor: nwse-resize; }
  .dmp .hs-h.ne { right: -7px; top: -7px; cursor: nesw-resize; }
  .dmp .hs-h.sw { left: -7px; bottom: -7px; cursor: nesw-resize; }
  .dmp .hs-h.se { right: -7px; bottom: -7px; cursor: nwse-resize; }
  .dmp .hs-side { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--hair); border-radius: 18px; background: var(--white); overflow: hidden; }
  .dmp .hs-head { display: grid; gap: 2px; padding: 14px 16px 12px; border-bottom: 1px solid var(--hair); }
  .dmp .hs-head h3 { margin: 0; font-size: 16px; font-weight: 700; }
  .dmp .hs-list { display: grid; gap: 10px; margin: 0; padding: 14px 16px; list-style: none; }
  .dmp .hs-list li { display: grid; gap: 8px; padding: 10px; border: 1px solid var(--hair); border-radius: 14px; background: var(--white); }
  .dmp .hs-list li.sel { border-color: var(--navy); box-shadow: 0 0 0 1px var(--navy); }
  .dmp .hs-list li.muted { padding: 12px 14px; border: 0; border-radius: 10px; background: var(--light); line-height: 1.55; }
  .dmp .hs-list .btn.sm { border-color: transparent; background: var(--light); color: var(--navy); font-size: 12px; }
  .dmp .hs-list .btn.sm:hover { background: rgba(139, 184, 232, .3); }
  .dmp .hs-pick { display: grid; gap: 2px; padding: 0; border: 0; border-radius: 10px; background: none; color: var(--navy); text-align: left; cursor: pointer; }
  .dmp .hs-pick b { font-weight: 600; font-size: 14px; line-height: 1.3; overflow-wrap: anywhere; }
  .dmp .hs-pick span { font-size: 12px; color: var(--ink-2); overflow-wrap: anywhere; }
  .dmp .hs-menu summary { cursor: pointer; font-size: 13px; font-weight: 600; color: var(--navy); }
  .dmp .hs-menu .actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .dmp .hs-help { padding: 12px 16px; border-top: 1px solid var(--hair); background: rgba(240, 240, 240, .6); font-size: 12px; }
  .dmp .hs-mobile { display: none; }
  .dmp .actions { display: flex; gap: 6px; flex-wrap: wrap; }
  .dmp .pp-list { display: grid; gap: 6px; max-height: 320px; overflow: auto; }
  .dmp .pp-item { display: grid; gap: 2px; padding: 10px 12px; border: 1px solid var(--hair); border-radius: 10px; background: var(--white); text-align: left; cursor: pointer; }
  .dmp .pp-item:hover, .dmp .pp-item:focus-visible { border-color: var(--navy); background: rgba(139, 184, 232, .12); }
  .dmp .pp-item b { color: var(--navy); font-weight: 600; }
  .dmp .pp-item span { font-size: 12px; color: var(--ink-2); }

  /* ---------- diálogos, progresso, avisos e barra de alterações ---------- */
  .dmp dialog { width: min(560px, calc(100vw - 32px)); max-width: calc(100vw - 32px); padding: 0; border: 0; border-radius: 18px; color: var(--ink); box-shadow: 0 30px 70px -20px rgba(20, 32, 60, .6); }
  .dmp dialog::backdrop { background: rgba(20, 32, 60, .55); }
  .dmp .dlg-body { padding: 22px 24px 14px; display: grid; gap: 14px; max-height: calc(100vh - 160px); max-height: calc(100dvh - 160px); overflow: auto; }
  .dmp .dlg-body > * { min-width: 0; }
  .dmp .dlg-body h2 { font-size: 20px; font-weight: 700; padding-bottom: 12px; border-bottom: 1px solid var(--hair); }
  .dmp .dlg-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; padding: 14px 24px 20px; border-top: 1px solid var(--hair); }
  .dmp #pn-pgDlg .dlg-actions:has(> #pn-pgCancel[hidden]) { display: none; } /* sem "Cancelar": sem rodapé vazio */
  .dmp .pbar { height: 8px; border-radius: 999px; background: var(--light); overflow: hidden; }
  .dmp .pbar i { display: block; height: 100%; width: 0; border-radius: inherit; background: var(--navy); transition: width .2s; }
  .dmp .secret { font-family: ui-monospace, "Cascadia Mono", Consolas, monospace; font-size: 22px; letter-spacing: .08em; color: var(--navy); background: var(--light); padding: 10px 14px; border-radius: 10px; user-select: all; overflow-wrap: anywhere; }
  .dmp .secret.long { width: 100%; border: 0; resize: none; font-size: 17px; letter-spacing: .04em; }

  /* =================== responsivo =================== */
  /* Tablet e celular (< 1200): alvos de toque maiores (o menu, a gaveta e a barra de abas são do site) */
  @media (max-width: 1199px) {
    .dmp { --c-order: 96px; }
    .dmp .steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .dmp .hs-grid { grid-template-columns: minmax(0, 1fr) 280px; }
    /* Alvos de toque ≥ 44 px */
    .dmp .btn, .dmp .btn.sm, .dmp .hs-nav { height: 44px; min-height: 44px; }
    .dmp .btn.block { height: auto; min-height: 44px; }
    .dmp .icon-btn, .dmp .mini { width: 44px; height: 44px; }
    .dmp .sel-hit { width: 44px; height: 44px; margin-left: -10px; }
    .dmp .sel-hit input, .dmp .check input { width: 20px; height: 20px; }
    .dmp .link { min-height: 44px; padding: 10px 6px; }
    .dmp .check { min-height: 44px; }
    .dmp .hs-th { min-height: 44px; }
    .dmp .hs-pg .input { height: 44px; }
    .dmp .hs-menu summary, .dmp details.help summary { display: flex; align-items: center; min-height: 44px; }
    .dmp .legacy > summary { min-height: 44px; }
    /* iOS: campos com menos de 16 px disparam zoom automático */
    .dmp input, .dmp select, .dmp textarea, .dmp .field input, .dmp .field select, .dmp .field textarea, .dmp .input { font-size: 16px; }
    .dmp .secret.long { font-size: 17px; }
  }
  @media (max-width: 899px) {
    .dmp .cfg-grid { grid-template-columns: minmax(0, 1fr); }
    .dmp .sec-row { grid-template-columns: minmax(0, 1fr); }
    .dmp .sec-row .row { justify-content: flex-start; }
    /* Linhas viram cartões empilhados: todos os controles continuam visíveis */
    .dmp .rows-head { display: none; }
    .dmp .list-card { overflow: visible; border-radius: 0; background: transparent; box-shadow: none; }
    .dmp .rows { display: grid; gap: 12px; }
    .dmp .rw { gap: 10px 12px; padding: 14px 16px; border: 0; border-radius: 14px; background: var(--white); box-shadow: var(--card-shadow); }
    .dmp .rw:last-child { border-bottom: 0; }
    .dmp .rw:hover { background: var(--white); }
    .dmp .cell-l { display: inline; }
    .dmp .rw-acts { padding-top: 10px; border-top: 1px solid var(--hair); }
    .dmp .rw.cat-grid { grid-template-columns: 44px minmax(0, 1fr) auto; grid-template-areas: "cover main main" "site site new" "valid valid order" "acts acts acts"; }
    .dmp .c-cover img { width: 44px; height: 58px; }
    .dmp .c-main { align-self: center; }
    .dmp .c-site, .dmp .c-new, .dmp .c-order { display: flex; align-items: center; gap: 10px; min-height: 44px; }
    .dmp .c-new, .dmp .c-order { justify-content: flex-end; }
    .dmp .rw.cat-grid > .rw-acts, .dmp .rw.user-grid > .rw-acts, .dmp .rw.sb-grid > .rw-acts { margin-top: 0; }
    .dmp .rw.user-grid { grid-template-columns: 32px minmax(0, 1fr) auto; grid-template-areas: "sel who who" ". comp role" ". status status" "acts acts acts"; }
    .dmp .rw.sb-grid { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "who who" "comp role" "status status" "acts acts"; }
    .dmp .legacy .list-card { box-shadow: none; }
    .dmp .u-sel { align-self: center; }
    .dmp .rw.prod-grid { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "sku areas" "name name" "cat cat" "acts acts"; }
    .dmp .rw.prod-grid > .rw-acts { justify-content: flex-start; }
    .dmp .p-areas { text-align: right; }
  }
  @media (max-width: 860px) { .dmp .hs-desk { display: none; } .dmp .hs-mobile { display: block; } }
  /* Celular (< 768): conteúdo em uma coluna; a barra de alterações ocupa a largura toda */
  @media (max-width: 767px) {
    .dmp .page-head h1 { font-size: 22px; }
    .dmp .ph-act { width: 100%; }
    .dmp .ph-act .btn { flex: 1 1 auto; }
    .dmp .tiles { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .dmp .tile { padding: 14px 16px; border-radius: 14px; }
    .dmp .tile .num { font-size: 24px; }
    .dmp .card { padding: 18px 16px; border-radius: 14px; }
    .dmp .card.stack > .btn { justify-self: stretch; }
    .dmp .drop { padding: 16px; border-radius: 14px; gap: 2px 14px; }
    .dmp .drop-ico { width: 44px; height: 44px; }
    .dmp .steps { grid-template-columns: minmax(0, 1fr); }
    .dmp .search { flex-basis: 100%; max-width: none; }
    .dmp .selbar { width: 100%; border-radius: 14px; justify-content: space-between; }
    .dmp dialog { width: calc(100vw - 16px); max-width: calc(100vw - 16px); }
    .dmp .dlg-body { padding: 18px 18px 12px; }
    .dmp .dlg-actions { flex-direction: column-reverse; padding: 12px 18px calc(16px + var(--safe-b)); }
    .dmp .dlg-actions .btn { width: 100%; height: auto; min-height: 44px; white-space: normal; }
    .dmp .grid2 { grid-template-columns: minmax(0, 1fr); }
    .dmp .secret { font-size: 18px; }
  }
  @media (max-width: 479px) {
    .dmp .rw-acts .btn { flex: 1 1 auto; }
    .dmp .tiles { gap: 10px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .dmp .btn, .dmp .drop, .dmp .switch span, .dmp .switch span::after, .dmp .pbar i { transition: none !important; }
  }

  /* ---------- módulo dentro do site: entrada/bloqueio, emergência, barra de ferramentas e barra de alterações ---------- */
  .dmp .pn-wrap { display: grid; gap: 18px; min-width: 0; }
  .dmp .pn-wrap.has-bar { padding-bottom: 88px; } /* a barra de alterações (host.bar) não cobre o fim da lista */
  .dmp .pn-main { display: grid; gap: 18px; min-width: 0; }
  .dmp .pn-main .banner, .dmp .pn-main .unify-bar { margin-bottom: 0; }
  .dmp .pn-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; font-size: 12px; color: var(--ink-2); }
  .dmp .pn-top p { min-width: 0; }
  .dmp .pn-top b { color: var(--navy); overflow-wrap: anywhere; }
  .dmp .pn-gate { display: grid; justify-items: center; align-content: start; gap: 16px; padding: 24px 0 48px; }
  .dmp .pn-card { width: 100%; max-width: 480px; padding: 30px 28px; border-radius: 18px; background: var(--white); box-shadow: var(--card-shadow), 0 24px 50px -34px rgba(20, 32, 60, .45); }
  .dmp .pn-card h2 { font-size: 24px; font-weight: 700; }
  .dmp .pn-foot { max-width: 480px; font-size: 12px; color: var(--ink-2); text-align: center; }
  /* Barra de alterações: pílula azul-marinho centralizada dentro de host.bar (o site posiciona o contêiner) */
  .dmp .stagebar { display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; width: max-content; max-width: calc(100% - 32px); margin: 0 auto; padding: 8px 8px 8px 20px; border-radius: 999px; background: var(--glow), var(--navy); color: var(--white); box-shadow: 0 18px 40px -14px rgba(20, 32, 60, .65); }
  .dmp .stagebar b { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; font-size: 13px; }
  .dmp .stagebar b::before { content: ""; width: 8px; height: 8px; flex: none; border-radius: 50%; background: var(--sky); box-shadow: 0 0 0 4px rgba(139, 184, 232, .25); }
  .dmp .stagebar .btn.ghost { color: var(--white); border-color: rgba(255, 255, 255, .6); }
  .dmp .stagebar .btn.ghost:hover { background: rgba(255, 255, 255, .12); }
  .dmp .stagebar .btn.primary { background: var(--white); color: var(--navy); }
  /* Regras do site para as mesmas classes que não combinam com a gestão */
  .dmp .alert.error { display: block; font-weight: 400; }
  .dmp .alert .btn { margin-top: 0; }
  .dmp .field .err { display: block; }
  .dmp .empty { margin-top: 0; }
  .dmp .search .input { padding-right: 14px; }
  @media (max-width: 1199px) {
    .dmp .stagebar { max-width: calc(100% - 24px); }
  }
  @media (max-width: 767px) {
    .dmp .pn-gate { padding: 8px 0 32px; }
    .dmp .pn-card { padding: 24px 18px; border-radius: 14px; }
    .dmp .pn-wrap.has-bar { padding-bottom: 150px; }
    .dmp .stagebar { width: auto; max-width: none; margin: 0 8px; padding: 10px 10px 10px 16px; border-radius: 18px; }
    .dmp .stagebar b { flex: 1 1 100%; }
    .dmp .stagebar .btn { flex: 1 1 auto; }
  }
  `;
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = STYLE_TEXT;
    document.head.appendChild(st);
  }

  /* ================= marcação (host.root, host.bar e diálogos) ================= */
  const RELOAD_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11A8 8 0 0 0 5.6 6.4L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.4 4.6L20 16"/><path d="M20 20v-4h-4"/></svg>';
  const ROOT_HTML = `
  <div class="pn-wrap" id="pn-wrap">
    <div class="pn-gate" id="pn-gate" hidden>
      <!-- Acesso unificado: abrindo, erros, "ainda não ativado" e bloqueio (senha da conta) -->
      <section class="pn-card stack" id="pn-uniCard" aria-labelledby="pn-uniTitle" hidden>
        <p class="label-caps">Gerenciar</p>
        <h2 id="pn-uniTitle" tabindex="-1">Abrindo a gestão</h2>
        <p class="muted" id="pn-uniBusy" role="status" hidden>Abrindo a gestão…</p>
        <div class="alert error" id="pn-uniMsg" role="alert" hidden></div>
        <form class="stack" id="pn-uniForm" novalidate hidden>
          <input class="sr-only" id="pn-uniUser" type="email" autocomplete="username" tabindex="-1" aria-hidden="true" readonly>
          <p class="muted">Conta: <b id="pn-uniMail"></b></p>
          <label class="field" id="pn-fUniPw"><span class="field-label">Senha</span><input id="pn-uniPw" type="password" autocomplete="current-password" spellcheck="false"><em class="err" hidden></em></label>
          <button class="btn primary block" type="submit" id="pn-uniBtn">Desbloquear</button>
        </form>
        <div class="row" id="pn-uniActs" hidden></div>
      </section>
      <!-- Emergência: senha mestra, token do GitHub e chave de recuperação (e a primeira configuração) -->
      <form class="pn-card stack" id="pn-loginForm" novalidate hidden>
        <p class="label-caps" id="pn-lgEyebrow">Acesso de emergência</p>
        <h2 id="pn-lgTitle">Entrar na gestão</h2>
        <p class="muted" id="pn-lgSub">Digite a senha mestra dos administradores.</p>
        <div class="alert error" id="pn-lgErr" role="alert" hidden></div>
        <label class="field"><span class="field-label" id="pn-lgPwLabel">Senha mestra</span><input id="pn-lgPw" type="password" autocomplete="current-password" spellcheck="false"></label>
        <button class="link" type="button" id="pn-lgGen" hidden>Gerar senha forte</button>
        <label class="field" id="pn-lgPw2Wrap" hidden><span class="field-label">Repita a senha mestra</span><input id="pn-lgPw2" type="password" autocomplete="new-password"></label>
        <div class="stack" id="pn-lgTokWrap" hidden>
          <label class="field"><span class="field-label">Token do GitHub deste administrador</span><input id="pn-lgTok" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></label>
          <details class="help">
            <summary>Como criar o token (uma vez por administrador)</summary>
            <ol>
              <li>No GitHub, clique na sua foto → <b>Settings → Developer settings → Personal access tokens → Fine-grained tokens</b> → <b>Generate new token</b>.</li>
              <li>Em <b>Repository access</b>, escolha <b>Only select repositories</b> e marque só o repositório da Prateleira.</li>
              <li>Em <b>Permissions → Repository permissions → Contents</b>, escolha <b>Read and write</b>.</li>
              <li>Gere o token, copie e cole aqui. Ele fica guardado neste computador, protegido pelo cofre dos administradores. Nunca envie o token por e-mail ou chat.</li>
            </ol>
          </details>
        </div>
        <p class="muted" id="pn-lgRepo"></p>
        <button class="btn primary block" type="submit" id="pn-lgBtn">Entrar</button>
        <button class="link" type="button" id="pn-lgNewTok">Informar outro token neste computador</button>
        <button class="link" type="button" id="pn-lgRecover">Entrar com a chave de recuperação</button>
      </form>
      <p class="pn-foot">Área restrita aos administradores da Dellamed. A gestão se bloqueia sozinha depois de 30 minutos sem uso.</p>
    </div>
    <div class="pn-main" id="pn-main" hidden>
      <div class="pn-top">
        <p>Repositório <b id="pn-repoLabel">não informado</b> · O site atualiza de 1 a 3 minutos depois de cada publicação.</p>
        <button class="btn ghost sm" type="button" id="pn-reloadBtn" data-reload>${RELOAD_SVG}Atualizar dados</button>
      </div>
      <div class="banner" id="pn-staleBar" role="status" hidden><span>Outro administrador publicou alterações.</span><button class="btn primary sm" type="button" id="pn-staleBtn">Atualizar</button></div>
      <div class="alert error unify-bar" id="pn-unifyBar" role="alert" hidden>O acesso unificado ficou desatualizado. Abra Configurações e clique em “Unificar acesso” (com a sessão de administrador).<div class="row"><button class="btn primary sm" type="button" id="pn-unifyBarBtn">Abrir Acesso unificado</button></div></div>
      <section class="dm-sec" id="pn-tabCats" data-section="catalogos" aria-label="Catálogos" tabindex="-1"></section>
      <section class="dm-sec" id="pn-tabProds" data-section="produtos" aria-label="Produtos" tabindex="-1" hidden></section>
      <section class="dm-sec" id="pn-tabUsers" data-section="pessoas" aria-label="Pessoas" tabindex="-1" hidden></section>
      <section class="dm-sec" id="pn-tabCfg" data-section="config" aria-label="Configurações" tabindex="-1" hidden></section>
    </div>
    <input type="file" id="pn-pdfInput" accept="application/pdf,.pdf" hidden>
  </div>`;
  const BAR_HTML = `
  <div class="stagebar" id="pn-stageBar" role="region" aria-label="Alterações não publicadas" hidden>
    <b id="pn-stageText" aria-live="polite"></b>
    <button class="btn ghost sm" type="button" id="pn-stageDiscard">Descartar</button>
    <button class="btn primary sm" type="button" id="pn-stagePublish">Publicar alterações</button>
  </div>`;
  const DIALOGS_HTML = `
  <dialog id="pn-dlg" aria-labelledby="pn-dlgTitle"></dialog>
  <dialog id="pn-pgDlg" aria-labelledby="pn-pgTitle">
    <div class="dlg-body">
      <h2 id="pn-pgTitle" tabindex="-1">Publicando</h2>
      <p class="muted" id="pn-pgText" aria-live="polite">Preparando…</p>
      <div class="pbar" id="pn-pgBar" role="progressbar" aria-labelledby="pn-pgTitle" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>
      <p class="muted">Não feche esta janela até terminar.</p>
    </div>
    <div class="dlg-actions"><button class="btn ghost" type="button" id="pn-pgCancel" hidden>Cancelar</button></div>
  </dialog>
  <dialog id="pn-cfDlg" aria-labelledby="pn-cfTitle"></dialog>`;
  // Monta a marcação uma vez (host.root e host.bar ficam com a classe dmp; os diálogos num contêiner próprio no body)
  function mount(host) {
    host.root.classList.add('dmp');
    host.root.innerHTML = ROOT_HTML;
    if (host.bar) { host.bar.classList.add('dmp'); host.bar.innerHTML = BAR_HTML; }
    let box = document.getElementById('pn-dialogs');
    if (!box) { box = document.createElement('div'); box.className = 'dmp'; box.id = 'pn-dialogs'; document.body.appendChild(box); }
    box.innerHTML = DIALOGS_HTML;
    if (!host.bar) { const b = document.createElement('div'); b.className = 'dmp'; b.innerHTML = BAR_HTML; box.appendChild(b); } // sem host.bar: a barra fica no contêiner dos diálogos
  }

  /* ================= pdf.js: carregado sob demanda (cdnjs 3.11.174, com SRI) ================= */
  const PDFJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_SRI = 'sha384-/1qUCSGwTur9vjf/z9lmu/eCUYbpOTgSjmpbMQZ1/CtX2v/WcAIKqRv+U1DUCG6e';
  let pdfJsJob = null;
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (!pdfJsJob) {
      pdfJsJob = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = PDFJS_SRC; s.integrity = PDFJS_SRI; s.crossOrigin = 'anonymous'; s.async = true;
        s.addEventListener('load', () => { if (window.pdfjsLib) resolve(window.pdfjsLib); else reject(new Error('pdfjsLib ausente')); });
        s.addEventListener('error', () => { s.remove(); reject(new Error('pdf.js não carregou')); });
        document.head.appendChild(s);
      });
      pdfJsJob.catch(() => { pdfJsJob = null; }); // falhou: tenta de novo na próxima conversão
    }
    return pdfJsJob;
  }

  /* ================= instância (criada no primeiro start) ================= */
  function boot(host) {
  let H = host;
  const P = host.P;
  mount(host);
  /* ================= utilidades ================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const te = P.te, td = P.td;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (iso) => { if (!iso) return ''; const [y, m, d] = String(iso).slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
  const fmtDateTime = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const localDate = (d = new Date()) => { const z = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; };
  const norm = (s) => P.normTxt(s);
  const initials = (name) => String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const plural = (n, one, many) => `${n.toLocaleString('pt-BR')} ${n === 1 ? one : many}`;
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  // WhatsApp (só números, com DDI e DDD): vazio é aceito; devolve o texto do erro ou ''
  const whatsProblem = (v) => (v && (v.length < 12 || v.length > 13) ? 'Informe com DDI e DDD, por exemplo 5554999999999.' : '');
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const round2 = (n) => Math.round(n * 100) / 100;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clone = (o) => { try { return structuredClone(o); } catch (e) { return JSON.parse(JSON.stringify(o)); } };
  const sortKeys = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  const mb = (bytes) => (bytes / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  const ICO = {
    up: '<svg viewBox="0 0 24 24"><path d="M6 14l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M6 10l6 6 6-6"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="M14 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="M10 6l6 6-6 6"/></svg>',
    upload: '<svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>',
    warn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5V6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8z"/><path d="M8.5 9.5h7M8.5 12.5h4"/></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l7 2.8v5.2c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6.3z"/><path d="M9 12l2 2 4-4"/></svg>'
  };
  const userErr = (msg) => { const e = new Error(msg); e.userMessage = msg; return e; };
  const cancelErr = () => { const e = new Error('cancelado'); e.cancelled = true; return e; };
  const conflictErr = () => { const e = new Error('conflict'); e.conflict = true; return e; };

  /* ================= constantes ================= */
  const VAULT = 'admin/cofre.json', TOKKEY = 'dm.admin.token', REPOKEY = 'dm.admin.repo';
  const LINES_ALL = ['Home Care', 'Health Care', 'Wellness', 'Ortho Care', 'Canal Farma'];
  const ROLE = { cliente: 'Cliente', representante: 'Representante', interno: 'Equipe Dellamed', admin: 'Administrador' }; // = perfis.papel no Supabase
  const CONTATO_PADRAO = 'Não recebeu o e-mail ou não tem acesso? Fale com o marketing da Dellamed.';
  const MSG_COMERCIAL = 'Olá! Gostaria de receber mais informações sobre estes produtos Dellamed:';
  const AUTHOR = { name: 'Prateleira', email: 'prateleira@users.noreply.github.com' };
  const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sem caracteres ambíguos (igual ao código provisório)
  const PDF_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const PDF_WORKER_SRI = 'sha384-SnzOobpRMLXZ52iJvZm/C0fYw0OQemTXzTjIsdsfMcrCtCEe9qgzxTd3RSklO5x2';
  const IDLE_MS = 30 * 60 * 1000;
  // Acesso unificado: bloqueio por inatividade nesta aba (não entra sozinho de novo) e aviso de segredos desatualizados neste computador
  const IDLEKEY = 'dm.admin.idle', UNIFY_STALE_KEY = 'dm.admin.unify.stale';
  // Seções do site (#/gerenciar/<seção>) ↔ abas internas do painel
  const SECTION_TAB = { catalogos: 'cats', produtos: 'prods', pessoas: 'users', config: 'cfg' };
  const TAB_SECTION = { cats: 'catalogos', prods: 'produtos', users: 'pessoas', cfg: 'config' };

  /* ================= repositório no GitHub (API REST) ================= */
  function detectRepo() {
    const m = /^([a-z0-9-]+)\.github\.io$/i.exec(location.hostname);
    if (!m) return { owner: '', repo: '', branch: 'main' };
    const parts = location.pathname.split('/').filter(Boolean);
    const first = parts[0] && !/\.html?$/i.test(parts[0]) ? parts[0] : '';
    return { owner: m[1], repo: first || `${m[1]}.github.io`, branch: 'main' };
  }
  let cfg = (() => { try { return JSON.parse(localStorage.getItem(REPOKEY)) || detectRepo(); } catch (e) { return detectRepo(); } })();
  let token = '';
  // Aviso de espera por limite do GitHub (o diálogo de progresso substitui este callback enquanto estiver aberto)
  let onRateWait = (s) => toast(`Aguardando o limite do GitHub… ${s} s`);

  // Pedidos que criam conteúdo (blobs, árvores, commits): depois de 20 no último minuto, no máximo 1 a cada 900 ms.
  const recentContent = []; let contentGate = Promise.resolve(), lastContentAt = 0;
  function contentSlot() {
    const run = contentGate.then(async () => {
      const now = Date.now();
      while (recentContent.length && recentContent[0] < now - 60000) recentContent.shift();
      if (recentContent.length >= 20) { const w = lastContentAt + 900 - Date.now(); if (w > 0) await sleep(w); }
      lastContentAt = Date.now(); recentContent.push(lastContentAt);
    });
    contentGate = run;
    return run;
  }
  async function rateLimitWait(r) {
    let msg = '';
    try { msg = (await r.clone().json()).message || ''; } catch (e) { /* noop */ }
    const ra = +r.headers.get('retry-after') || 0;
    const rem = r.headers.get('x-ratelimit-remaining'), reset = +r.headers.get('x-ratelimit-reset') || 0;
    const limited = ra > 0 || rem === '0' || /rate limit|secondary/i.test(msg);
    if (!limited) return 0;
    let ms = ra > 0 ? ra * 1000 : rem === '0' && reset ? reset * 1000 - Date.now() + 1000 : 60000;
    return Math.min(Math.max(ms, 1000), 3600e3);
  }
  async function gh(path, opts = {}, content = false) {
    const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(opts.headers || {}) };
    if (token) headers.Authorization = 'Bearer ' + token;
    for (let attempt = 0; ; attempt++) {
      if (content) await contentSlot();
      let r;
      try { r = await fetch('https://api.github.com' + path, { ...opts, headers, cache: 'no-store' }); }
      catch (e) { const x = new Error('network'); x.network = true; throw x; }
      if ((r.status === 403 || r.status === 429) && attempt < 6) {
        const ms = await rateLimitWait(r);
        if (ms) {
          for (let left = Math.ceil(ms / 1000); left > 0; left--) { onRateWait(left); await sleep(1000); }
          continue;
        }
      }
      return r;
    }
  }
  async function ghError(r) {
    let msg = '';
    try { msg = (await r.clone().json()).message || ''; } catch (e) { /* noop */ }
    const e = new Error(msg || 'HTTP ' + r.status);
    e.status = r.status; e.ghMsg = msg;
    e.sso = !!r.headers.get('x-github-sso');
    e.rateLimited = r.headers.get('x-ratelimit-remaining') === '0' || /rate limit|secondary/i.test(msg);
    return e;
  }
  async function ghJson(path, opts, content) { const r = await gh(path, opts, content); if (!r.ok) throw await ghError(r); return r.json(); }
  const RP = () => `/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}`;
  const REF = () => encodeURIComponent(cfg.branch || 'main');
  async function pool(items, n, fn) {
    let i = 0;
    await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; await fn(items[k], k); } }));
  }
  // Mensagem clara para cada tipo de erro do GitHub
  function errText(e) {
    if (!e) return 'Algo deu errado. Tente de novo.';
    if (e.userMessage) return e.userMessage;
    const after = e.maybeDone ? ' A publicação pode ter sido concluída: confira no site em alguns minutos antes de repetir.' : ' Nada foi alterado no site.';
    if (e.network) return 'Sem conexão com o GitHub. Verifique a internet e tente de novo.' + after;
    if (e.conflict || e.status === 409 || e.status === 422) return 'Outro administrador publicou ao mesmo tempo. Clique em “Atualizar dados” e repita a ação.' + (e.maybeDone ? after : '');
    if (e.status === 401) return 'O token do GitHub é inválido ou expirou. Clique em Sair e entre de novo informando um token novo.';
    if (e.status === 403 || e.status === 429) {
      if (e.rateLimited || e.status === 429) return 'O GitHub limitou a quantidade de envios. Espere alguns minutos e tente de novo.' + after;
      if (e.sso || /organization|approv|SAML|SSO/i.test(e.ghMsg || '')) return 'O token ainda está pendente de aprovação da organização no GitHub. Peça para um responsável pela organização aprovar o token.';
      return 'O token não tem permissão de escrita neste repositório. Confira no GitHub: Contents = Read and write.';
    }
    if (e.status === 404) return 'O token não inclui este repositório ou a branch não existe. Confira o repositório e o acesso do token.';
    if (e.status >= 500) return 'O GitHub está instável agora. Espere alguns minutos e tente de novo.' + after;
    return `Não foi possível falar com o GitHub (erro ${e.status || '?'}).` + after;
  }
  const githubRepo = {
    label: () => (cfg.owner && cfg.repo ? `${cfg.owner}/${cfg.repo}` : ''),
    async read(path) {
      const r = await gh(`${RP()}/contents/${path}?ref=${REF()}`, { headers: { Accept: 'application/vnd.github.raw' } });
      if (r.status === 404) return null;
      if (!r.ok) throw await ghError(r);
      return new Uint8Array(await r.arrayBuffer());
    },
    check: () => ghJson(RP()),
    async vaultSha() {
      const r = await gh(`${RP()}/contents/${VAULT}?ref=${REF()}`);
      if (r.status === 404) return null;
      if (!r.ok) throw await ghError(r);
      return (await r.json()).sha;
    },
    // Envia um arquivo já cifrado e devolve o sha (usado para enviar blocos à medida que ficam prontos)
    async putBlob(data) {
      const b = await ghJson(`${RP()}/git/blobs`, { method: 'POST', body: JSON.stringify({ content: P.b64e(typeof data === 'string' ? te.encode(data) : data), encoding: 'base64' }) }, true);
      return b.sha;
    },
    async commit({ files, deletes = [], message, onProgress, expectVaultSha }) {
      if (expectVaultSha !== undefined && (await this.vaultSha()) !== expectVaultSha) throw conflictErr();
      const head = (await ghJson(`${RP()}/git/ref/heads/${REF()}`)).object.sha;
      const baseTree = (await ghJson(`${RP()}/git/commits/${head}`)).tree.sha;
      let existing = null;
      if (deletes.length) {
        const t = await ghJson(`${RP()}/git/trees/${baseTree}?recursive=1`);
        existing = new Set(t.tree.map((x) => x.path));
      }
      const tree = []; let done = 0, vaultSha = null;
      await pool(files, 4, async (f) => {
        const sha = f.sha || (await this.putBlob(f.data));
        tree.push({ path: f.path, mode: '100644', type: 'blob', sha });
        if (f.path === VAULT) vaultSha = sha;
        if (onProgress) onProgress(++done, files.length);
      });
      const seen = new Set(tree.map((x) => x.path));
      for (const p of new Set(deletes)) if (existing.has(p) && !seen.has(p)) tree.push({ path: p, mode: '100644', type: 'blob', sha: null });
      const t = await ghJson(`${RP()}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: baseTree, tree }) }, true);
      const when = new Date().toISOString();
      const c = await ghJson(`${RP()}/git/commits`, { method: 'POST', body: JSON.stringify({ message, tree: t.sha, parents: [head], author: { ...AUTHOR, date: when }, committer: { ...AUTHOR, date: when } }) }, true);
      let u;
      try { u = await gh(`${RP()}/git/refs/heads/${REF()}`, { method: 'PATCH', body: JSON.stringify({ sha: c.sha, force: false }) }); }
      catch (e) { e.maybeDone = true; throw e; }
      if (!u.ok) { const e = await ghError(u); if (u.status === 422 || u.status === 409) e.conflict = true; if (u.status >= 500) e.maybeDone = true; throw e; }
      return { vaultSha };
    }
  };
  let repo = githubRepo;

  /* ================= cofre v2 (chave do cofre + compartimentos: senha mestra e chave de recuperação) =================
     admin/cofre.json = { v: 2, slots: { m: {s, it, w}, r?: {s, it, w} }, d }
     d = AES-GCM(chave do cofre, JSON, aad 'cofre'); w = AES-GCM(PBKDF2(segredo, s, it), chave do cofre, aad 'slot') */
  let vault = null, vk = null, slots = null, vaultSha = null, vaultFmt = 2, legacyKey = null, mode = 'login';
  async function newVk() { const raw = P.rand(32); return { raw, key: await P.aesKey(raw, ['encrypt', 'decrypt']) }; }
  async function importVk(raw) { return { raw: new Uint8Array(raw), key: await P.aesKey(raw, ['encrypt', 'decrypt']) }; }
  const slotKey = async (secret, s, it) => P.aesKey(await P.deriveBits(secret, P.b64d(s), P.iters(it)), ['encrypt', 'decrypt']);
  async function makeSlot(secret, raw) { const s = P.b64e(P.rand(16)), it = P.MIN_IT; return { s, it, w: P.b64e(await P.seal(await slotKey(secret, s, it), raw, 'slot')) }; }
  async function openSlot(secret, slot) { if (!slot) return null; try { return await P.open(await slotKey(secret, slot.s, slot.it), P.b64d(slot.w), 'slot'); } catch (e) { return null; } }
  async function encryptVault(v, k, sl) { return JSON.stringify({ v: 2, slots: sl, d: P.b64e(await P.seal(k.key, JSON.stringify(v), 'cofre')) }); }
  async function decryptVault(meta, k) { return JSON.parse(td.decode(await P.open(k.key, P.b64d(meta.d), 'cofre'))); }
  // Abre o cofre v2 com a chave do cofre já obtida (senha mestra, chave de recuperação ou acesso unificado) e vira o estado atual.
  // isCurrent(): falso quando o pedido ficou velho (painel bloqueado no meio) — nada muda. Falha ao decifrar: lança o erro.
  let openedBy = ''; // 'unified' | 'master' | 'recovery' | 'setup' ('' = cofre fechado)
  async function openVaultWithKey(meta, kraw, isCurrent = () => true) {
    const k = await importVk(kraw);
    const v = await decryptVault(meta, k);
    if (!isCurrent()) { k.raw.fill(0); throw cancelErr(); }
    forget(); vk = k; slots = meta.slots; vault = v; vaultFmt = 2;
  }

  // Token do GitHub neste computador: cifrado com uma chave derivada (HKDF) da chave do cofre — abre tanto pela senha mestra quanto pela chave de recuperação.
  async function tokenKey(k) {
    const base = await crypto.subtle.importKey('raw', k.raw, 'HKDF', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: te.encode('prateleira-token') }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  // Enquanto o cofre ainda é v1 (nada publicado com este painel), o token fica no formato antigo para não se perder
  async function storeToken(k = vk) {
    try {
      if (!token) return;
      if (vaultFmt === 1 && legacyKey) localStorage.setItem(TOKKEY, P.b64e(await P.seal(legacyKey, token)));
      else if (k) localStorage.setItem(TOKKEY, 'v2:' + P.b64e(await P.seal(await tokenKey(k), token, 'token')));
    } catch (e) { /* noop */ }
  }
  async function storedToken() {
    try {
      const s = localStorage.getItem(TOKKEY); if (!s) return '';
      if (s.startsWith('v2:')) return td.decode(await P.open(await tokenKey(vk), P.b64d(s.slice(3)), 'token'));
      return legacyKey ? td.decode(await P.open(legacyKey, P.b64d(s))) : '';
    } catch (e) { return ''; }
  }
  const hasStoredToken = () => { try { return !!localStorage.getItem(TOKKEY); } catch (e) { return false; } };

  /* ================= senha mestra e chave de recuperação ================= */
  function masterProblem(pw) {
    pw = String(pw || '');
    if (pw.length < 20) return 'Use pelo menos 20 caracteres.';
    if (/dellamed|prateleira|senha|admin/.test(P.normTxt(pw))) return 'Não use “Dellamed”, “Prateleira”, “senha” nem “admin” na senha mestra.';
    if (/(19|20)\d\d/.test(pw)) return 'Não use anos (como 1990 ou 2026) na senha mestra.';
    const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
    const words = pw.split(/[\s-]+/).filter(Boolean).length;
    if (classes >= 3 || (words >= 4 && pw.length >= 24)) return '';
    return 'Misture três tipos de caractere (maiúsculas, minúsculas, números ou símbolos) ou use uma frase com pelo menos 4 palavras e 24 caracteres.';
  }
  const pick = (set) => { for (;;) { const b = P.rand(1)[0]; if (b < 256 - (256 % set.length)) return set[b % set.length]; } };
  function genMaster() {
    const set = 'abcdefghjkmnpqrstuvwxyz' + ALPHA;
    for (;;) { const s = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => pick(set)).join('')).join('-'); if (!masterProblem(s) && /[a-z]/.test(s) && /[A-Z]/.test(s) && /\d/.test(s)) return s; }
  }
  // Chave de recuperação: 32 caracteres (≈ 158 bits) em 8 grupos de 4
  const genRecovery = () => Array.from({ length: 8 }, () => Array.from({ length: 4 }, () => pick(ALPHA)).join('')).join('-');
  const canonRecovery = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  /* ================= arquivos públicos gerados a partir do cofre ================= */
  // Identificador v3 (PBKDF2 100 mil): guardado no cofre e recalculado só quando o e-mail ou o sal do site mudam
  async function idOf(d, u) {
    const e = P.normEmail(u.email);
    if (!u.idv3 || u.idv3.salt !== d.siteSalt || u.idv3.e !== e) u.idv3 = { salt: d.siteSalt, e, id: await P.userId(d.siteSalt, u.email, 3) };
    return u.idv3.id;
  }
  const pendingOpen = (u) => !!(u.pending && Date.parse(u.pending.x) > Date.now());
  const isActive = (u) => !!(u.pub || u.kek);
  // Código provisório vencido sem acesso ativo (situação na lista "Acessos antigos")
  const expiredOf = (u) => !!u.pending && !pendingOpen(u) && !isActive(u);
  /* Produtos e áreas de produto no cofre (fonte da verdade):
     d.products = { "<SKU>": { sku, name, category, benefit, capacity, description, url, image?: { catalogId, page, x, y, width, height } } }
     d.hotspots = [ { id, catalogId, page, product: "<SKU>", x, y, width, height } ]   ← medidas em % da imagem da página (2 casas)
     d.settings.comercial = { whatsapp, email, mensagem }. Cofres antigos não têm esses campos: sempre usar withProd(d) antes de alterar. */
  const withProd = (d) => { d.products = d.products || {}; d.hotspots = d.hotspots || []; return d; };
  const BOX_KEYS = ['catalogId', 'page', 'x', 'y', 'width', 'height'];
  const boxOf = (r) => Object.fromEntries(BOX_KEYS.map((k) => [k, r[k]]));
  const sameBox = (a, b) => BOX_KEYS.every((k) => a[k] === b[k]);
  const sameSpot = (a, b) => a.product === b.product && sameBox(a, b);
  // A área cabe nos dados: o catálogo existe, a página existe, o produto existe e as medidas são válidas
  function spotFits(d, h) {
    const c = d.catalogs.find((x) => x.id === h.catalogId);
    return !!c && h.page <= (c.pages || 0) && !!(d.products || {})[h.product] && P.validHotspot(h);
  }
  const hasSpotsIn = (d, id) => (d.hotspots || []).some((h) => h.catalogId === id) || Object.values(d.products || {}).some((p) => p.image && p.image.catalogId === id);
  // Tira as áreas (e as imagens de produto) de um catálogo: todas (maxPage 0) ou só as das páginas acima de maxPage. Devolve quantas áreas saíram.
  function dropCatalogSpots(d, id, maxPage) {
    withProd(d);
    const out = (r) => r.catalogId === id && r.page > maxPage;
    const before = d.hotspots.length;
    d.hotspots = d.hotspots.filter((h) => !out(h));
    for (const p of Object.values(d.products)) if (p.image && out(p.image)) delete p.image;
    return before - d.hotspots.length;
  }
  // produtos.bin (chave-raiz): todos os produtos (sem a imagem de catálogos ocultos) e só as áreas válidas dos catálogos visíveis
  async function produtosBin(d, root, visible) {
    const pages = new Map(visible.map((c) => [c.id, c.pages || 0]));
    const onPage = (r) => pages.has(r.catalogId) && r.page <= pages.get(r.catalogId);
    const products = {};
    for (const p of Object.values(d.products || {})) {
      const o = { sku: p.sku, name: p.name, category: p.category || '', benefit: p.benefit || '', capacity: p.capacity || '', description: p.description || '', url: p.url || '' };
      if (p.image && onPage(p.image) && P.validHotspot({ ...p.image, product: p.sku })) o.image = boxOf(p.image);
      products[p.sku] = o;
    }
    const hotspots = (d.hotspots || []).filter((h) => products[h.product] && onPage(h) && P.validHotspot(h))
      .map((h) => ({ id: h.id, catalogId: h.catalogId, page: h.page, product: h.product, x: h.x, y: h.y, width: h.width, height: h.height }));
    const com = (d.settings || {}).comercial || {};
    const comercial = { whatsapp: com.whatsapp || '', email: com.email || '', mensagem: com.mensagem || MSG_COMERCIAL };
    return P.sealProdutos(root, { v: 1, comercial, products: sortKeys(products), hotspots });
  }
  async function coreFiles(d, k, sl, pg) {
    const root = await P.aesKey(P.b64d(d.contentKey), ['encrypt']);
    const visible = d.catalogs.filter((c) => c.visible !== false).sort((a, b) => a.order - b.order);
    const catalogs = visible.map((c) => ({
      id: c.id, title: c.title, kind: c.kind, version: c.version, pages: c.pages, ratio: c.ratio, updated: c.updated, lines: c.lines || [],
      order: c.order, isNew: !!c.isNew, validUntil: c.validUntil || '', desc: c.desc || '', v: c.v || 1,
      key: c.key || d.contentKey, aad: c.aad ? 1 : 0, th: c.th || 0, busca: !!c.busca
    }));
    const dados = await P.sealDados(root, { v: 2, gerado: new Date().toISOString(), catalogs });
    const produtos = await produtosBin(d, root, visible);
    const users = {}, pend = {}, now = Date.now();
    let i = 0;
    for (const u of d.users) {
      if (pg) pg.set(`Preparando os acessos… ${++i} de ${d.users.length}`, 0.8);
      const id = await idOf(d, u);
      const payload = { k: d.contentKey, u: u.uid, n: u.name, r: u.role, c: u.company, e: u.email };
      if (u.pub) users[id] = await P.makeEntry(id, u, payload);
      else if (u.kek) users[id] = await P.makeLegacyEntry(u, payload);
      if (u.pending && Date.parse(u.pending.x) > now) {
        const ek = `${u.pending.code}|${u.pending.x}|${id}`;
        if (!u.pending.entry || u.pending.ek !== ek) { u.pending.entry = await P.makePend(u.pending.code, id, u.pending.x); u.pending.ek = ek; }
        u.pending.ps = u.pending.entry.s;
        pend[id] = u.pending.entry;
      }
    }
    const nu = Object.keys(users).length, np = Object.keys(pend).length;
    for (let n = nu; n < P.padTo(nu, 25); n++) users[P.randHex(32)] = P.fakeEntry();
    for (let n = np; n < P.padTo(np, 5); n++) pend[P.randHex(32)] = P.fakePend();
    const st = d.settings || {};
    const acessos = JSON.stringify({
      v: 3, salt: d.siteSalt, kdf: { name: 'PBKDF2', hash: 'SHA-256', iterations: P.MIN_IT }, contato: st.contato || CONTATO_PADRAO,
      ativ: { email: st.ativEmail || '', whatsapp: st.ativWhats || '' }, users: sortKeys(users), pend: sortKeys(pend)
    });
    return [{ path: 'dados.bin', data: dados }, { path: 'produtos.bin', data: produtos }, { path: 'acessos.json', data: acessos }, { path: VAULT, data: await encryptVault(d, k, sl) }];
  }
  // Catálogos antigos com o texto da busca dentro do cofre: o texto vai para p/<id>/busca.bin (uma vez só)
  async function migrateTexts(d) {
    const files = [];
    for (const c of d.catalogs) {
      if (!Array.isArray(c.texts)) continue;
      const key = await P.aesKey(P.b64d(c.key || d.contentKey), ['encrypt']);
      files.push({ path: P.path.search(c.id), data: await P.sealSearch(key, c, c.texts) });
      c.busca = true; delete c.texts;
    }
    return files;
  }

  /* ================= publicação ================= */
  let busy = false, nojekyllOk = false;
  let deferredLock = null; // mensagem do bloqueio pedido pelo site enquanto publicava (null = nenhum)
  async function earlyConflict() { if ((await repo.vaultSha()) !== vaultSha) throw conflictErr(); }
  // Toda alteração é uma "transação": aplica num rascunho, publica em um único envio e só então vira o estado atual.
  // mutate(draft, pg) pode devolver { files, deletes, vk, slots }. Em conflito, recarrega o cofre e repete uma vez (opts.retry !== false).
  async function publish(title, mutate, opts = {}) {
    if (busy) return false;
    busy = true;
    const keyBefore = vault && vault.contentKey; // chave-raiz antes do envio: se mudar, vai para o Supabase no fim (sbKeyChanged)
    const revBefore = vault ? vault.keyRev || 1 : 0; // host.onPublished({ keysRotated }) quando a chave-raiz ou keyRev mudam
    const pg = progressDialog(title, !!opts.cancel);
    let retried = false;
    try {
      for (;;) {
        try {
          const draft = clone(vault);
          const x = (await mutate(draft, pg)) || {};
          if (pg.cancelled) throw cancelErr();
          pg.noCancel();
          const k = x.vk || vk, sl = x.slots || slots;
          const files = [...(x.files || []), ...(await migrateTexts(draft))];
          files.push(...(await coreFiles(draft, k, sl, pg)));
          if (!nojekyllOk) { if (!(await repo.read('.nojekyll'))) files.push({ path: '.nojekyll', data: '' }); nojekyllOk = true; }
          pg.set('Enviando para o GitHub…', 0.85);
          const res = await repo.commit({
            files, deletes: x.deletes || [], message: 'Atualização da Prateleira', expectVaultSha: vaultSha,
            onProgress: (dn, n) => pg.set(`Enviando para o GitHub… ${dn} de ${n} arquivos`, 0.85 + 0.15 * dn / n)
          });
          const keyChanged = !!x.vk || vaultFmt === 1;
          vault = draft; vaultSha = res.vaultSha; vk = k; slots = sl; vaultFmt = 2;
          if (keyChanged) await storeToken();
          if (opts.onDone) opts.onDone(); // depois do envio e antes de redesenhar a barra de alterações
          pg.close();
          if (vault.contentKey !== keyBefore) sbKeyChanged(); // toda troca da chave-raiz (remover pessoa, senha mestra, recriptografar, bloquear/remover no Supabase)
          if (keyChanged) syncSecrets({ key: true }); // chave do cofre nova (configurar, senha mestra, recuperação, cofre v1 → v2): acesso unificado
          // O site recarrega catálogos e busca; com chaves novas, refaz chave_conteudo → openWithRoot
          const keysRotated = vault.contentKey !== keyBefore || (vault.keyRev || 1) !== revBefore;
          try { if (H.onPublished) H.onPublished({ keysRotated }); } catch (err) { console.error(err); }
          return true;
        } catch (e) {
          if (e.conflict && !retried && opts.retry !== false && !e.maybeDone) {
            retried = true;
            pg.set('Outro administrador publicou agora há pouco. Atualizando os dados e tentando de novo…', 0.05);
            await reloadVault();
            continue;
          }
          throw e;
        }
      }
    } catch (e) {
      pg.close();
      if (e.cancelled) { toast('Cancelado. Nada foi publicado.'); return false; }
      console.error(e);
      if (e.locked) return false;
      const msg = errText(e);
      if (dlg.open && $('[data-err]', dlg)) dlgErr(msg);
      else alertBox('Não foi possível publicar', msg);
      if (e.conflict) showStale(true);
      return false;
    } finally {
      busy = false; refreshStage();
      // O site pediu lock() durante a publicação: bloqueia agora que o envio terminou
      if (deferredLock !== null) { const m = deferredLock; deferredLock = null; lock(m); }
    }
  }
  // Relê o cofre publicado e abre com a chave que já está na memória
  async function reloadVault() {
    const sha = await repo.vaultSha();
    const raw = await repo.read(VAULT);
    if (!raw) throw userErr('O cofre não foi encontrado no repositório.');
    const meta = JSON.parse(td.decode(raw));
    let v = null;
    if (meta.v === 2 && vk) { try { v = await decryptVault(meta, vk); } catch (e) { v = null; } }
    else if (meta.v !== 2 && legacyKey) { try { v = JSON.parse(td.decode(await P.open(legacyKey, P.b64d(meta.d)))); } catch (e) { v = null; } }
    if (!v) {
      const msg = 'O cofre foi alterado por outro administrador (por exemplo, a senha mestra mudou). Entre de novo.';
      const e = userErr(msg); e.locked = true; lock(msg); throw e;
    }
    vault = v; vaultSha = sha;
    if (meta.v === 2) { slots = meta.slots; vaultFmt = 2; legacyKey = null; }
    dropImageCache();
    showStale(false);
  }

  /* ================= alterações preparadas (publicadas juntas) ================= */
  const stagedFlags = new Map(); // `${id}|${campo}` → valor
  let stagedOrder = null;         // lista de ids na ordem desejada
  // Áreas de produto: operações por id da área (área nova ou alterada; null = removida) e imagem do produto por SKU (null = sem imagem)
  const stagedSpots = new Map(), stagedImages = new Map();
  let spotLost = 0;               // operações ignoradas na última aplicação (catálogo, página ou produto sumiram)
  function applyStaged(d, onlyCatalogs) {
    for (const [k, val] of stagedFlags) { const [id, f] = k.split('|'); const c = d.catalogs.find((x) => x.id === id); if (c) c[f] = val; }
    if (stagedOrder) {
      const rest = d.catalogs.filter((c) => !stagedOrder.includes(c.id)).sort((a, b) => a.order - b.order);
      [...stagedOrder.map((id) => d.catalogs.find((c) => c.id === id)).filter(Boolean), ...rest].forEach((c, i) => { c.order = i + 1; });
    }
    if (!onlyCatalogs) applySpotStaged(d);
    return d;
  }
  // Reaplica cada operação no rascunho conferindo de novo catálogo, página e produto (o rascunho pode ter vindo de outro administrador)
  function applySpotStaged(d) {
    spotLost = 0;
    if (!stagedSpots.size && !stagedImages.size) return;
    withProd(d);
    for (const [id, h] of stagedSpots) {
      d.hotspots = d.hotspots.filter((x) => x.id !== id);
      if (h && spotFits(d, h)) d.hotspots.push(clone(h)); else if (h) spotLost++;
    }
    for (const [sku, im] of stagedImages) {
      const p = d.products[sku];
      if (p && !im) delete p.image;
      else if (p && spotFits(d, { ...im, product: sku })) p.image = boxOf(im);
      else if (im) spotLost++;
    }
  }
  const viewCatalogs = () => applyStaged(clone({ catalogs: vault.catalogs }), true).catalogs.sort((a, b) => a.order - b.order);
  // Áreas como vão ficar depois de publicar (as publicadas mais as preparadas)
  function viewSpots() {
    const out = (vault.hotspots || []).filter((h) => !stagedSpots.has(h.id));
    for (const h of stagedSpots.values()) if (h) out.push(h);
    return out;
  }
  const viewImage = (sku) => (stagedImages.has(sku) ? stagedImages.get(sku) : ((vault.products || {})[sku] || {}).image || null);
  // Tira da barra o que já não muda nada (igual ao publicado) e, com aviso, o que não cabe mais nos dados
  function pruneSpotOps() {
    const prods = vault.products || {}, spots = vault.hotspots || [];
    let lost = 0;
    for (const [id, h] of [...stagedSpots]) {
      const cur = spots.find((x) => x.id === id);
      if (h && !spotFits(vault, h)) { stagedSpots.delete(id); lost++; }
      else if (h ? cur && sameSpot(cur, h) : !cur) stagedSpots.delete(id);
    }
    for (const [sku, im] of [...stagedImages]) {
      const p = prods[sku];
      if (!p || (im && !spotFits(vault, { ...im, product: sku }))) { stagedImages.delete(sku); if (im) lost++; }
      else if (im ? p.image && sameBox(p.image, im) : !p.image) stagedImages.delete(sku);
    }
    if (lost) toast(`${plural(lost, 'área de produto não publicada foi descartada', 'áreas de produto não publicadas foram descartadas')}: o catálogo, a página ou o produto não existem mais.`);
  }
  // Tira as operações preparadas que combinam com o teste (usado quando um produto ou catálogo é removido)
  function dropStaged(test) {
    for (const [id, h] of [...stagedSpots]) if (h && test(h)) stagedSpots.delete(id);
    for (const [sku, im] of [...stagedImages]) if (im && test({ ...im, product: sku })) stagedImages.delete(sku);
  }
  function stageCount() {
    if (!vault) return 0;
    for (const [k, val] of [...stagedFlags]) {
      const [id, f] = k.split('|'); const c = vault.catalogs.find((x) => x.id === id);
      const cur = f === 'visible' ? c && c.visible !== false : c && !!c[f];
      if (!c || cur === val) stagedFlags.delete(k);
    }
    if (stagedOrder) {
      const now = vault.catalogs.slice().sort((a, b) => a.order - b.order).map((c) => c.id).join();
      const want = viewCatalogs().map((c) => c.id).join();
      if (now === want) stagedOrder = null;
    }
    pruneSpotOps();
    return stagedFlags.size + (stagedOrder ? 1 : 0) + stagedSpots.size + stagedImages.size;
  }
  function refreshStage() {
    const n = stageCount(), cats = stagedFlags.size + (stagedOrder ? 1 : 0);
    const parts = [cats && plural(cats, 'alteração nos catálogos', 'alterações nos catálogos'), stagedSpots.size && plural(stagedSpots.size, 'área de produto', 'áreas de produto'),
      stagedImages.size && plural(stagedImages.size, 'imagem de produto', 'imagens de produto')].filter(Boolean);
    const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}` : parts[0];
    $('#pn-stageBar').hidden = !n || !vault;
    $('#pn-wrap').classList.toggle('has-bar', !!n && !!vault); // espaço no fim do conteúdo para a barra (host.bar)
    $('#pn-stageText').textContent = n ? `${list} ${n === 1 ? 'não publicada' : 'não publicadas'}` : '';
    $('#pn-stagePublish').disabled = busy;
    paintNav();
  }
  function clearStage() { stagedFlags.clear(); stagedOrder = null; stagedSpots.clear(); stagedImages.clear(); refreshStage(); }
  // Depois de publicar ou descartar, redesenha a aba que mostra alterações preparadas
  const renderStagedTab = () => { if (tab === 'cats') renderCats(); else if (tab === 'prods') renderProds(); };
  $('#pn-stageDiscard').addEventListener('click', () => { clearStage(); renderStagedTab(); toast('Alterações descartadas.'); });
  $('#pn-stagePublish').addEventListener('click', async () => {
    const ok = await publish('Publicando alterações', (d) => { applyStaged(d); });
    if (ok) { clearStage(); toast(spotLost ? `Publicado. ${plural(spotLost, 'área de produto foi ignorada', 'áreas de produto foram ignoradas')}: o catálogo, a página ou o produto não existem mais.` : 'Publicado. O site atualiza em 1 a 3 minutos.'); }
    renderStagedTab();
  });
  window.addEventListener('beforeunload', (e) => { if (busy || stageCount()) { e.preventDefault(); e.returnValue = ''; } });

  /* ================= diálogos e avisos ================= */
  // Avisos rápidos: o toast do site (kind: 'ok' | 'err' | undefined)
  function toast(msg, kind) { try { if (H.toast) H.toast(msg, kind); } catch (e) { console.error(e); } }
  const dlg = $('#pn-dlg'), cf = $('#pn-cfDlg'), pgd = $('#pn-pgDlg');
  const showModal = (d) => { if (!d.open) { try { d.showModal(); } catch (e) { d.setAttribute('open', ''); } } };
  const hideModal = (d) => { try { d.close(); } catch (e) { d.removeAttribute('open'); } };
  let dlgSeq = 0, dlgBusy = false;
  const btnHtml = (a, i) => `<button type="button" class="btn ${a.kind || 'ghost'}" data-i="${i}">${a.kind === 'danger' ? ICO.warn : ''}${esc(a.label)}</button>`;
  // Diálogo principal. Enquanto um onClick assíncrono roda, todos os botões ficam desativados.
  function openDialog({ title, body, actions = [], locked }) {
    const wasOpen = dlg.open, tok = String(++dlgSeq);
    dlg.innerHTML = `<div class="dlg-body"><h2 id="pn-dlgTitle" tabindex="-1">${esc(title)}</h2><div class="alert error" data-err role="alert" hidden></div>${body}</div>${actions.length ? `<div class="dlg-actions">${actions.map(btnHtml).join('')}</div>` : ''}`;
    dlg.dataset.tok = tok;
    dlg.oncancel = (e) => { if (locked || dlgBusy) e.preventDefault(); };
    const btns = $$('.dlg-actions button', dlg);
    btns.forEach((b) => b.addEventListener('click', async () => {
      if (dlgBusy) return;
      const a = actions[+b.dataset.i];
      let keep;
      if (a.onClick) {
        dlgBusy = true; btns.forEach((x) => { x.disabled = true; });
        try { keep = await a.onClick(); }
        catch (e) { console.error(e); dlgErr(errText(e)); keep = false; }
        finally { dlgBusy = false; if (dlg.dataset.tok === tok) btns.forEach((x) => { x.disabled = false; }); }
      }
      if (keep !== false && dlg.dataset.tok === tok) closeDialog();
    }));
    showModal(dlg);
    const f = !wasOpen && $('input:not([readonly]):not([type="checkbox"]):not([type="hidden"]), select, textarea:not([readonly])', dlg);
    (f || $('#pn-dlgTitle')).focus();
  }
  function closeDialog() { dlg.oncancel = null; hideModal(dlg); }
  function dlgErr(msg) {
    const box = $('[data-err]', dlg);
    if (!box || !dlg.open) { if (msg) alertBox('Atenção', msg); return; }
    box.textContent = msg || ''; box.hidden = !msg;
    if (msg) box.scrollIntoView({ block: 'nearest' });
  }
  // Confirmações e avisos usam um diálogo próprio, por cima do formulário (o formulário não se perde)
  // altLabel (opcional): terceiro botão; resolve 'alt' quando clicado (true = okLabel, false = Cancelar/Esc)
  const confirmBox = (title, html, okLabel, danger, altLabel) => new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (done) return; done = true; hideModal(cf); resolve(v); };
    cf.innerHTML = `<div class="dlg-body"><h2 id="pn-cfTitle" tabindex="-1">${esc(title)}</h2><div class="muted stack">${html}</div></div><div class="dlg-actions">${btnHtml({ label: 'Cancelar', kind: 'ghost' }, 0)}${altLabel ? btnHtml({ label: altLabel, kind: 'ghost' }, 2) : ''}${btnHtml({ label: okLabel, kind: danger ? 'danger' : 'primary' }, 1)}</div>`;
    $$('.dlg-actions button', cf).forEach((b) => b.addEventListener('click', () => finish(b.dataset.i === '1' ? true : b.dataset.i === '2' ? 'alt' : false)));
    cf.onclose = () => finish(false);
    showModal(cf); $('#pn-cfTitle').focus();
  });
  function alertBox(title, text) {
    cf.innerHTML = `<div class="dlg-body"><h2 id="pn-cfTitle" tabindex="-1">${esc(title)}</h2><p class="muted" role="alert">${esc(text)}</p></div><div class="dlg-actions"><button type="button" class="btn primary">Entendi</button></div>`;
    cf.onclose = null;
    $('.dlg-actions button', cf).addEventListener('click', () => hideModal(cf));
    showModal(cf); $('#pn-cfTitle').focus();
  }
  // Diálogo de progresso (fica por cima de tudo; Esc não fecha; opcionalmente com "Cancelar")
  pgd.addEventListener('cancel', (e) => e.preventDefault());
  let pgCtl = null;
  $('#pn-pgCancel').addEventListener('click', () => { if (pgCtl) { pgCtl.cancelled = true; $('#pn-pgText').textContent = 'Cancelando…'; $('#pn-pgCancel').disabled = true; } });
  function progressDialog(title, cancelable) {
    $('#pn-pgTitle').textContent = title; $('#pn-pgText').textContent = 'Preparando…';
    const bar = $('#pn-pgBar'); bar.setAttribute('aria-valuenow', '0'); $('i', bar).style.width = '0';
    const cb = $('#pn-pgCancel'); cb.hidden = !cancelable; cb.disabled = false;
    const ctl = {
      cancelled: false,
      set(text, frac) {
        if (text != null && !ctl.cancelled) $('#pn-pgText').textContent = text;
        if (frac != null) { const p = Math.round(Math.min(1, Math.max(0, frac)) * 100); $('i', bar).style.width = p + '%'; bar.setAttribute('aria-valuenow', String(p)); }
      },
      noCancel() { cb.hidden = true; },
      close() { pgCtl = null; onRateWait = (s) => toast(`Aguardando o limite do GitHub… ${s} s`); hideModal(pgd); }
    };
    pgCtl = ctl;
    onRateWait = (s) => { $('#pn-pgText').textContent = `Aguardando o limite do GitHub… ${s} s`; };
    showModal(pgd); $('#pn-pgTitle').focus();
    return ctl;
  }
  function setFieldErr(el, msg) { const em = $('.err', el); el.classList.toggle('invalid', !!msg); if (em) { em.hidden = !msg; em.textContent = msg || ''; } }
  async function copyText(ta) {
    try { await navigator.clipboard.writeText(ta.value); toast('Copiado.'); }
    catch (e) {
      ta.focus(); ta.select(); ta.setSelectionRange(0, 99999);
      try { document.execCommand('copy'); toast('Copiado.'); } catch (_) { toast('Selecione o texto e copie com Ctrl+C.'); }
    }
  }
  // Depois de redesenhar uma tabela, devolve o foco ao controle equivalente (mesma linha e mesmo controle)
  function keepFocus(fn) {
    const a = document.activeElement;
    const row = a && a.closest ? a.closest('[data-row]') : null;
    const k = a && a.dataset ? a.dataset.k : '';
    fn();
    if (row && k) { const el = $(`[data-row="${CSS.escape(row.dataset.row)}"] [data-k="${CSS.escape(k)}"]`, H.root); if (el && !el.disabled) el.focus(); }
  }
  function download(name, text, type = 'application/json') {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  /* ================= telas do módulo: entrada/bloqueio (#pn-gate) e gestão (#pn-main) =================
     O site é dono do login, do menu, das rotas e do "Sair". Aqui ficam só o formulário de emergência, os estados do acesso
     unificado (abrindo, erro, não ativado, sessão encerrada) e o bloqueio por inatividade. */
  let openedMode = ''; // host.mode com que o cofre foi aberto ('' = fechado)
  function screen(name) {
    $('#pn-gate').hidden = name !== 'gate';
    $('#pn-main').hidden = name !== 'main';
    if (name !== 'main') refreshStage();
  }
  // Nada de roubar o foco quando a gestão não está à vista (o site pode estar em outra rota)
  const moduleShown = () => H.root.getClientRects().length > 0;
  function lgMsg(msg, kind = 'error') { const e = $('#pn-lgErr'); e.className = 'alert ' + kind; e.textContent = msg || ''; e.hidden = !msg; }
  function clearLogin() { ['#pn-lgPw', '#pn-lgPw2', '#pn-lgTok'].forEach((s) => { $(s).value = ''; }); $('#pn-lgPw').type = mode === 'recovery' ? 'text' : 'password'; }
  function setMode(m, askToken) {
    mode = m;
    const setup = m === 'setup', rec = m === 'recovery';
    $('#pn-lgEyebrow').textContent = setup ? 'Primeira configuração' : 'Acesso de emergência';
    $('#pn-lgTitle').textContent = setup ? 'Configurar a Prateleira' : rec ? 'Entrar com a chave de recuperação' : 'Entrar na gestão';
    $('#pn-lgSub').textContent = setup
      ? 'Crie a senha mestra dos administradores (pelo menos 20 caracteres) e informe o token do GitHub. Sem a senha mestra ou a chave de recuperação não é possível abrir o cofre.'
      : rec ? 'Digite a chave de recuperação (8 grupos de 4 caracteres). Depois de entrar, você vai criar uma senha mestra nova.' : 'Digite a senha mestra dos administradores.';
    $('#pn-lgPwLabel').textContent = rec ? 'Chave de recuperação' : 'Senha mestra';
    $('#pn-lgPw').type = rec ? 'text' : 'password';
    $('#pn-lgPw').autocomplete = setup ? 'new-password' : rec ? 'off' : 'current-password';
    $('#pn-lgGen').hidden = !setup;
    $('#pn-lgPw2Wrap').hidden = !setup;
    $('#pn-lgTokWrap').hidden = !(setup || askToken || !hasStoredToken());
    $('#pn-lgNewTok').hidden = setup || !$('#pn-lgTokWrap').hidden;
    $('#pn-lgRecover').hidden = setup;
    $('#pn-lgRecover').textContent = rec ? 'Entrar com a senha mestra' : 'Entrar com a chave de recuperação';
    $('#pn-lgBtn').textContent = setup ? 'Configurar e publicar' : 'Entrar';
    $('#pn-lgRepo').innerHTML = repo.label() ? `Repositório: <code>${esc(repo.label())}</code> · <button class="link" type="button" id="pn-editRepo">alterar</button>` : `<button class="link" type="button" id="pn-editRepo">Informar o repositório do GitHub</button>`;
    $('#pn-editRepo').addEventListener('click', editRepoDialog);
  }
  function editRepoDialog() {
    openDialog({
      title: 'Repositório do GitHub',
      body: `<p class="muted">O painel detecta o repositório pelo endereço do site. Altere só se precisar.</p>
        <label class="field"><span class="field-label">Usuário ou organização</span><input id="pn-rOwner" value="${esc(cfg.owner)}"></label>
        <label class="field"><span class="field-label">Repositório</span><input id="pn-rRepo" value="${esc(cfg.repo)}"></label>
        <label class="field"><span class="field-label">Branch</span><input id="pn-rBranch" value="${esc(cfg.branch || 'main')}"></label>`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, { label: 'Salvar', kind: 'primary', onClick: () => {
        cfg = { owner: $('#pn-rOwner').value.trim(), repo: $('#pn-rRepo').value.trim(), branch: $('#pn-rBranch').value.trim() || 'main' };
        try { localStorage.setItem(REPOKEY, JSON.stringify(cfg)); } catch (e) { /* noop */ }
        nojekyllOk = false;
        detectMode();
        syncSecrets({ repo: true }); // acesso unificado: repositório novo
      } }]
    });
  }
  async function detectMode() {
    lgMsg('');
    if (!repo.label()) { setMode('login'); lgMsg('Abra o site pelo endereço do GitHub Pages ou informe o repositório.'); return; }
    try { setMode((await repo.read(VAULT)) ? 'login' : 'setup'); } // sem cofre: só a primeira configuração serve
    catch (e) { setMode('login', true); lgMsg(`Não consegui ler o repositório ${repo.label()}. Se ele for privado, informe o token; senão, confira o endereço e a internet.`); }
  }
  function forget() { vault = null; if (vk) vk.raw.fill(0); vk = null; slots = null; legacyKey = null; vaultSha = null; }
  $('#pn-lgNewTok').addEventListener('click', () => { $('#pn-lgTokWrap').hidden = false; $('#pn-lgNewTok').hidden = true; $('#pn-lgTok').focus(); });
  $('#pn-lgRecover').addEventListener('click', () => { lgMsg(''); setMode(mode === 'recovery' ? 'login' : 'recovery'); $('#pn-lgPw').value = ''; $('#pn-lgPw').focus(); });
  $('#pn-lgGen').addEventListener('click', () => {
    const s = genMaster();
    $('#pn-lgPw').type = 'text'; $('#pn-lgPw').value = s; $('#pn-lgPw2').value = s;
    lgMsg('Senha gerada. Anote-a num lugar seguro antes de continuar (ela aparece só aqui).', 'ok');
    $('#pn-lgPw').focus(); $('#pn-lgPw').select();
  });
  $('#pn-loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    lgMsg('');
    const pw = $('#pn-lgPw').value, pw2 = $('#pn-lgPw2').value, typed = $('#pn-lgTok').value.trim();
    const rec = mode === 'recovery';
    if (!pw) { lgMsg(rec ? 'Digite a chave de recuperação.' : 'Digite a senha mestra.'); return; }
    const btn = $('#pn-lgBtn'), label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Verificando…';
    try {
      if (typed) token = typed;
      const raw = await repo.read(VAULT);
      if (!raw && mode !== 'setup') { setMode('setup'); lgMsg('A Prateleira ainda não foi configurada neste repositório. Crie a senha mestra.'); return; }
      if (mode === 'setup') {
        if (raw) { setMode('login'); lgMsg('A Prateleira já está configurada neste repositório. Entre com a senha mestra.'); return; }
        const prob = masterProblem(pw);
        if (prob) { lgMsg(prob); return; }
        if (pw !== pw2) { lgMsg('As duas senhas não são iguais.'); return; }
        if (!typed) { lgMsg('Informe o token do GitHub.'); return; }
        const info = await repo.check();
        if (!info.permissions || !info.permissions.push) { lgMsg('Este token não tem permissão de escrita no repositório. Confira: Contents = Read and write.'); return; }
        const k = await newVk(), rk = genRecovery();
        const sl = { m: await makeSlot(pw, k.raw), r: await makeSlot(canonRecovery(rk), k.raw) };
        forget();
        vault = { v: 2, contentKey: P.b64e(P.rand(32)), keyRev: 1, siteSalt: P.b64e(P.rand(16)), users: [], catalogs: [], products: {}, hotspots: [], settings: { contato: CONTATO_PADRAO, comercial: { whatsapp: '', email: '', mensagem: MSG_COMERCIAL } } };
        if (!(await publish('Configurando a Prateleira', () => ({ vk: k, slots: sl }), { retry: false }))) { vault = null; return; }
        clearLogin();
        openedBy = 'setup';
        enterMain();
        syncSecrets({ token: true, repo: true }); // a chave do cofre já foi enviada por publish(); completa o acesso unificado
        showRecoveryKey(rk, 'Prateleira configurada. Agora guarde a chave de recuperação.');
        return;
      }
      const meta = JSON.parse(td.decode(raw));
      if (meta.v === 2) {
        const slot = meta.slots && (rec ? meta.slots.r : meta.slots.m);
        if (rec && !slot) { lgMsg('Este cofre ainda não tem chave de recuperação. Entre com a senha mestra.'); return; }
        const kraw = await openSlot(rec ? canonRecovery(pw) : pw, slot);
        if (!kraw) { lgMsg(rec ? 'Chave de recuperação incorreta.' : 'Senha mestra incorreta.'); return; }
        await openVaultWithKey(meta, kraw);
      } else {
        if (rec) { lgMsg('Este cofre ainda não tem chave de recuperação. Entre com a senha mestra.'); return; }
        const key = await P.aesKey(await P.deriveBits(pw, P.b64d(meta.s), P.iters(meta.it)), ['encrypt', 'decrypt']);
        let v;
        try { v = JSON.parse(td.decode(await P.open(key, P.b64d(meta.d)))); } catch (x) { lgMsg('Senha mestra incorreta.'); return; }
        // Cofre antigo (v1): já prepara a chave do cofre e o compartimento da senha mestra; vira v2 na próxima publicação
        forget(); vk = await newVk(); slots = { m: await makeSlot(pw, vk.raw) }; vault = v; vaultFmt = 1; legacyKey = key;
      }
      if (!typed) token = await storedToken();
      if (!token) { forget(); $('#pn-lgTokWrap').hidden = false; $('#pn-lgNewTok').hidden = true; lgMsg('Informe o token do GitHub deste computador.'); return; }
      const info = await repo.check();
      if (!info.permissions || !info.permissions.push) { forget(); token = ''; $('#pn-lgTokWrap').hidden = false; lgMsg('Este token não tem permissão de escrita no repositório. Confira: Contents = Read and write.'); return; }
      if (typed) await storeToken();
      vaultSha = await repo.vaultSha();
      const weak = !rec && !!masterProblem(pw);
      clearLogin();
      openedBy = rec ? 'recovery' : 'master';
      enterMain();
      if (typed) syncSecrets({ token: true }); // token novo neste computador: acesso unificado
      if (rec) changeMasterDialog('recovery');
      else if (weak) weakMasterDialog();
    } catch (x) {
      console.error(x);
      if (x.status === 401) { token = ''; $('#pn-lgTokWrap').hidden = false; lgMsg('O token do GitHub é inválido ou expirou. Informe um token novo.'); }
      else if (x.status === 403 || x.status === 404) lgMsg(errText(x).replace(' Nada foi alterado no site.', ''));
      else lgMsg(x.userMessage || 'Não foi possível entrar agora. Verifique a internet e tente de novo.');
    } finally { btn.disabled = false; btn.textContent = label; $('#pn-lgPw2').value = ''; }
  });
  function weakMasterDialog() {
    openDialog({
      title: 'Troque a senha mestra', locked: true,
      body: `<p>Troque a senha mestra por uma forte antes de continuar.</p>
        <p class="muted">A senha mestra agora precisa ter pelo menos 20 caracteres, sem “Dellamed”, “Prateleira”, “senha”, “admin” ou anos, misturando três tipos de caractere (ou uma frase com 4 palavras e 24 caracteres).</p>`,
      actions: [
        { label: 'Sair', kind: 'ghost', onClick: () => { lock(); } },
        { label: 'Trocar senha mestra', kind: 'primary', onClick: () => { changeMasterDialog('weak'); return false; } }
      ]
    });
  }
  // Emergência (#/emergencia): formulário de senha mestra / chave de recuperação / token / repositório / primeira configuração
  function startEmergency(msg) {
    unlockSeq++;
    screen('gate');
    $('#pn-uniCard').hidden = true; $('#pn-loginForm').hidden = false;
    clearLogin();
    detectMode().then(() => {
      if (msg && $('#pn-lgErr').hidden) lgMsg(msg, 'warn');
      if (!$('#pn-loginForm').hidden && moduleShown()) $('#pn-lgPw').focus();
    });
  }

  /* ================= acesso unificado: a sessão P.auth do site (e-mail e senha) abre o cofre =================
     start() → perfil admin → admin_segredos_ler { chave_cofre, token_github, repo } → cofre aberto com a chave do cofre → gestão.
     A senha mestra e a chave de recuperação continuam valendo só como emergência (host.goEmergency → #/emergencia). */
  let unlockSeq = 0, waitingSession = false;
  const MSG_NOT_ADMIN = 'Esta conta não é administradora.';
  const MSG_NOT_UNIFIED = 'O acesso unificado ainda não foi ativado. Entre uma vez com a senha mestra (emergência) e clique em “Unificar acesso” em Configurações.';
  const MSG_BAD_VK = 'A chave guardada no Supabase não abre o cofre atual. Entre com a senha mestra e clique em “Unificar acesso” de novo.';
  const MSG_OFFLINE = 'Sem conexão. Verifique a internet e tente de novo.';
  const MSG_SESSION_END = 'A sessão terminou. Entre de novo com e-mail e senha.';
  const idleLocked = () => { try { return sessionStorage.getItem(IDLEKEY) === '1'; } catch (e) { return false; } };
  const setIdleLocked = (on) => { try { if (on) sessionStorage.setItem(IDLEKEY, '1'); else sessionStorage.removeItem(IDLEKEY); } catch (e) { /* noop */ } };
  const uniEmail = () => (H.user && H.user.email) || ((P.auth.load() || {}).email) || '';
  // Cartão do acesso unificado: { title, msg, kind, busy (texto), form (senha da conta), acts: ['retry'|'emerg'|'session'|'signout'], retryLabel }
  function uniView(o) {
    screen('gate');
    $('#pn-loginForm').hidden = true; $('#pn-uniCard').hidden = false;
    $('#pn-uniTitle').textContent = o.title;
    const m = $('#pn-uniMsg');
    m.className = 'alert ' + (o.kind || 'error'); m.textContent = o.msg || ''; m.hidden = !o.msg;
    $('#pn-uniBusy').hidden = !o.busy;
    if (o.busy) $('#pn-uniBusy').textContent = o.busy;
    $('#pn-uniForm').hidden = !o.form;
    if (o.form) {
      const email = uniEmail();
      $('#pn-uniMail').textContent = email; $('#pn-uniUser').value = email; $('#pn-uniPw').value = '';
      setFieldErr($('#pn-fUniPw'), '');
    }
    const A = {
      retry: `<button class="btn primary" type="button" data-uni="retry">${esc(o.retryLabel || 'Tentar de novo')}</button>`,
      session: '<button class="btn primary" type="button" data-uni="session">Entrar com e-mail e senha</button>',
      emerg: '<button class="btn ghost" type="button" data-uni="emerg">Usar senha mestra (emergência)</button>',
      signout: '<button class="link" type="button" data-uni="signout">Sair e entrar com outra conta</button>'
    };
    const acts = (o.acts || []).map((k) => A[k]).join('');
    $('#pn-uniActs').innerHTML = acts; $('#pn-uniActs').hidden = !acts;
    if (o.form && moduleShown()) $('#pn-uniPw').focus();
  }
  $('#pn-uniActs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-uni]'); if (!b) return;
    const a = b.dataset.uni;
    if (a === 'retry') unifiedStart();
    else if (a === 'session') { waitingSession = true; H.onSessionNeeded(); }
    else if (a === 'emerg') H.goEmergency();
    else if (a === 'signout') H.signOut();
  });
  // Bloqueio por inatividade (acesso unificado): a senha da conta (e-mail fixo) reabre a gestão
  $('#pn-uniForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = $('#pn-uniPw').value, email = uniEmail();
    setFieldErr($('#pn-fUniPw'), pw ? '' : 'Digite a senha.');
    if (!pw) return;
    if (!email) { waitingSession = true; H.onSessionNeeded(); return; }
    const btn = $('#pn-uniBtn'), box = $('#pn-uniMsg');
    btn.disabled = true; btn.textContent = 'Verificando…';
    try { await P.auth.signIn(email, pw); }
    catch (x) { console.error(x); box.className = 'alert error'; box.textContent = authErrText(x); box.hidden = false; $('#pn-uniPw').value = ''; return; }
    finally { btn.disabled = false; btn.textContent = 'Desbloquear'; }
    $('#pn-uniPw').value = '';
    setIdleLocked(false); // digitou a senha: a entrada automática volta a valer nesta aba
    unifiedStart();
  });
  // Campos de e-mail e senha (cartão "Acesso unificado" e diálogo): um validador só. Devolve { email, pw } ou null.
  function readAuthFields(fMail, fPw, needPw = true) {
    const email = P.normEmail($('input', fMail).value), pw = fPw ? $('input', fPw).value : '';
    setFieldErr(fMail, !email ? 'Informe o e-mail.' : !emailOk(email) ? 'Confira o formato do e-mail.' : '');
    if (fPw) setFieldErr(fPw, needPw && !pw ? 'Digite a senha.' : '');
    if (!email || !emailOk(email) || (needPw && !pw)) return null;
    return { email, pw };
  }
  // Erro ao entrar com e-mail e senha (P.auth.signIn)
  function authErrText(e) {
    if (e && e.userMessage) return e.userMessage;
    if (!e || !e.status) return MSG_OFFLINE;
    if (e.code === 'email_not_confirmed') return 'Confirme o e-mail desta conta antes de entrar.';
    if (e.status === 400) return 'E-mail ou senha incorretos.';
    return sbErrText(e);
  }
  const isNotAdminErr = (e) => !!e && (e.code === '42501' || e.status === 403);
  const secretsComplete = (s) => !!(s && s.chave_cofre && s.token_github && s.repo);
  const readSecrets = async (t) => { const s = await P.supa.rpc(t, 'admin_segredos_ler', {}); return Array.isArray(s) ? s[0] || null : s; };
  function sessionNeeded() {
    uniView({ title: 'Entre de novo', msg: MSG_SESSION_END, kind: 'warn', acts: ['session'] });
    waitingSession = true;
    try { H.onSessionNeeded(); } catch (e) { console.error(e); }
  }

  // Modo unificado: abre a gestão pela sessão P.auth que o site já abriu
  async function unifiedStart() {
    if (H.mode !== 'unified' || vault) return;
    if (idleLocked()) { renderLocked('A gestão foi bloqueada depois de 30 minutos sem uso. Digite a senha de novo para continuar.', 'idle'); return; }
    const seq = ++unlockSeq, current = () => seq === unlockSeq && !vault;
    let stage = 'supa', entered = false;
    waitingSession = false;
    uniView({ title: 'Abrindo a gestão', busy: 'Abrindo a gestão…' });
    try {
      let t;
      try { t = await P.auth.token(); }
      catch (e) { if (e.status && !P.auth.load()) t = null; else throw e; } // refresh recusado: a sessão foi apagada
      const rec = P.auth.load();
      if (!current()) return;
      if (!t || !rec) { sessionNeeded(); return; }
      if (!(await sbIsAdmin(t, rec.uid))) { if (current()) uniView({ title: 'Sem acesso à gestão', msg: MSG_NOT_ADMIN }); return; }
      const s = await readSecrets(t);
      if (!current()) return;
      if (!secretsComplete(s)) { uniView({ title: 'Acesso unificado não ativado', msg: MSG_NOT_UNIFIED, kind: 'warn', acts: ['emerg'] }); return; }
      let r = null;
      try { r = JSON.parse(s.repo); } catch (e) { r = null; }
      if (!r || !r.owner || !r.repo) throw userErr('O repositório guardado no Supabase está incompleto. Entre com a senha mestra e clique em “Unificar acesso” de novo.');
      stage = 'github';
      cfg = { owner: String(r.owner), repo: String(r.repo), branch: String(r.branch || 'main') };
      try { localStorage.setItem(REPOKEY, JSON.stringify(cfg)); } catch (e) { /* noop */ }
      nojekyllOk = false;
      token = s.token_github;
      const raw = await repo.read(VAULT);
      if (!current()) return;
      if (!raw) throw userErr(`O cofre não foi encontrado no repositório ${repo.label()}. Entre com a senha mestra e clique em “Unificar acesso” de novo.`);
      stage = 'vault';
      const meta = JSON.parse(td.decode(raw));
      if (meta.v !== 2) throw userErr(MSG_BAD_VK);
      try { await openVaultWithKey(meta, P.b64d(s.chave_cofre), current); }
      catch (e) { if (e.cancelled) throw e; throw userErr(MSG_BAD_VK); }
      stage = 'github';
      const info = await repo.check();
      if (seq !== unlockSeq) return;
      if (!info.permissions || !info.permissions.push) throw userErr('O token do GitHub guardado no Supabase não tem permissão de escrita no repositório. Entre com a senha mestra, informe um token novo e clique em “Unificar acesso”.');
      vaultSha = await repo.vaultSha();
      if (seq !== unlockSeq) return;
      sbGen++; sb = { uid: rec.uid, email: rec.email };
      secretsInfo = { active: true, at: s.atualizado_em || '' };
      setUnifyStale(false); // os segredos guardados acabaram de abrir o cofre
      openedBy = 'unified'; entered = true;
      enterMain();
    } catch (e) {
      if (seq !== unlockSeq || e.cancelled) return;
      console.error(e);
      const fail = (msg, acts = ['retry', 'emerg']) => uniView({ title: 'Não foi possível abrir a gestão', msg, acts });
      if (e.userMessage) fail(e.userMessage);
      else if (stage === 'supa') {
        if (!e.status) fail(MSG_OFFLINE, ['retry']);
        else if (isNotAdminErr(e)) uniView({ title: 'Sem acesso à gestão', msg: MSG_NOT_ADMIN });
        else if (e.status === 401 || !P.auth.load()) sessionNeeded();
        else fail(sbErrText(e));
      } else if (e.network) fail(MSG_OFFLINE);
      else if (e.status === 401) fail('O token do GitHub guardado no Supabase é inválido ou expirou. Entre com a senha mestra, informe um token novo e clique em “Unificar acesso”.');
      else fail(errText(e).replace(' Nada foi alterado no site.', ''));
    } finally {
      // Não entrou: nada fica na memória (cofre aberto por esta tentativa e token vindo do Supabase)
      if (!entered && seq === unlockSeq) { if (vault && !openedBy) forget(); if (!vault) token = ''; }
    }
  }

  /* ================= bloqueio, inatividade e dados desatualizados ================= */
  // Fecha o cofre e limpa token e segredos da memória. Não encerra a sessão P.auth (quem encerra é o "Sair" do site).
  function closeVault() {
    unlockSeq++; authLost = false;
    clearStage(); forget(); token = ''; openedBy = ''; openedMode = '';
    sbEnd(); sbWarn = ''; // estado da sessão só na memória do painel; a sessão do aparelho (P.auth) continua
    dropImageCache(); resetEditor();
    Object.values(TABS).forEach((t) => { $(t.panel).innerHTML = ''; });
    closeDialog(); hideModal(cf); if (!busy) hideModal(pgd);
    showStale(false); paintUnify(); paintNav();
  }
  // Tela depois de bloquear: unificado → cartão "Gestão bloqueada" (inatividade: senha da conta); emergência → formulário de senha mestra
  function renderLocked(msg, why) {
    if (H.mode === 'emergency') { startEmergency(msg || ''); return; }
    if (why === 'idle') uniView({ title: 'Gestão bloqueada por inatividade', msg, kind: 'warn', form: true, acts: ['emerg', 'signout'] });
    else uniView({ title: 'Gestão bloqueada', msg, kind: 'warn', acts: ['retry', 'emerg'], retryLabel: 'Abrir a gestão de novo' });
  }
  function lock(msg, why) { closeVault(); renderLocked(msg || '', why); }
  // DellamedPainel.lock() (logout do site, sessão apagada em outra aba): durante uma publicação, bloqueia quando ela terminar
  function lockFromHost() {
    if (busy) { deferredLock = ''; return; }
    lock('');
  }
  let lastAct = Date.now();
  // Atividade conta só dentro da gestão (conteúdo, barra de alterações e diálogos): usar a prateleira não mantém o cofre aberto
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => window.addEventListener(ev, (e) => {
    const t = e.target;
    if (t && t.closest && t.closest('.dmp')) lastAct = Date.now();
  }, { passive: true, capture: true }));
  // Sessão do aparelho apagada (ou trocada por outra conta) em outra aba ou no site: o painel bloqueia assim que puder
  let authLost = false;
  function checkAuthLost() {
    if (!authLost || !vault || busy) return;
    lock('A sessão deste computador foi encerrada. Entre de novo para continuar.');
  }
  window.addEventListener('storage', (e) => {
    if (e.key !== P.auth.KEY && e.key !== null) return;
    const s = P.auth.load();
    if (!vault || (s && (!sb || s.uid === sb.uid))) return;
    authLost = true; checkAuthLost();
  });
  setInterval(() => {
    checkAuthLost();
    if (!vault || busy || Date.now() - lastAct < IDLE_MS) return;
    const lost = stageCount() ? ' As alterações não publicadas foram descartadas.' : '';
    setIdleLocked(true); // nesta aba, só volta digitando a senha (sem entrada automática)
    lock('A gestão foi bloqueada depois de 30 minutos sem uso.' + lost + (H.mode === 'emergency' ? ' Digite a senha mestra de novo para continuar.' : ' Digite a senha de novo para continuar.'), 'idle');
  }, 30000);
  function showStale(on) { $('#pn-staleBar').hidden = !on; }
  let staleAt = 0;
  async function checkStale() {
    if (!vault || busy || $('#pn-main').hidden || !moduleShown() || Date.now() - staleAt < 20000) return;
    staleAt = Date.now();
    try { const s = await repo.vaultSha(); if (vault && !busy && s !== vaultSha) showStale(true); } catch (e) { /* tenta na próxima vez */ }
  }
  window.addEventListener('focus', checkStale);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkStale(); });
  async function refreshData() {
    if (busy || !vault) return;
    const bs = $$('[data-reload]', H.root); bs.forEach((b) => { b.disabled = true; });
    try {
      await reloadVault(); setTab(tab); toast('Dados atualizados.'); refreshStage(); // por último: o aviso de áreas descartadas tem prioridade
      if (sb) { sbSyncKey(); loadPeople().then(sbRepaint); } // outro administrador pode ter trocado a chave ou as pessoas
    }
    catch (e) { if (!e.locked) alertBox('Não foi possível atualizar', errText(e).replace(' Nada foi alterado no site.', '')); }
    finally { bs.forEach((b) => { b.disabled = false; }); }
  }
  $('#pn-staleBtn').addEventListener('click', refreshData);
  $$('[data-reload]', H.root).forEach((b) => b.addEventListener('click', refreshData));

  /* ================= área principal (seções do site: catálogos, produtos, pessoas, configurações) ================= */
  let tab = 'cats';
  // Cada aba: painel e função que desenha, com o cabeçalho da área (título no padrão da marca, descrição)
  const TABS = {
    cats: { panel: '#pn-tabCats', render: renderCats, title: 'Catálogos', head: 'Catálogos.', sub: 'Publique e organize', desc: 'Arraste o PDF para publicar. “No site”, selo “Novo” e ordem entram na barra de alterações e vão para o site quando você publicar.' },
    prods: { panel: '#pn-tabProds', render: renderProds, title: 'Produtos', head: 'Produtos.', sub: 'Cadastre e marque nas páginas', desc: 'Os produtos aparecem na busca do site; as áreas marcadas ligam a foto na página do catálogo ao produto.' },
    users: { panel: '#pn-tabUsers', render: renderUsers, title: 'Pessoas', head: 'Pessoas.', sub: 'Convide e gerencie acessos', desc: 'Cada pessoa recebe um convite por e-mail e cria a própria senha pelo link; ninguém mais conhece a senha.' },
    cfg: { panel: '#pn-tabCfg', render: renderCfg, title: 'Configurações', head: 'Configurações.', sub: 'Contatos e segurança', desc: 'Acesso unificado dos administradores, contatos do marketing e comercial e a segurança do cofre.' }
  };
  // Cabeçalho da área (desenhado junto com a aba) e bloco de resumo com número
  const pageHead = (t, actions = '') => `<header class="page-head"><div class="ph-text"><h1 tabindex="-1"><b>${TABS[t].head}</b> ${TABS[t].sub}</h1><p>${TABS[t].desc}</p></div>${actions ? `<div class="ph-act">${actions}</div>` : ''}</header>`;
  const tileHtml = (labelHtml, n, note, cls = '') => `<div class="tile ${cls}"><p class="label-caps">${labelHtml}</p><p class="num"><b>${n.toLocaleString('pt-BR')}</b></p>${note ? `<p class="meta">${esc(note)}</p>` : ''}</div>`;
  function enterMain() {
    openedMode = H.mode;
    screen('main');
    $('#pn-repoLabel').textContent = repo.label() || 'não informado';
    lastAct = Date.now(); showStale(false); authLost = false;
    setTab(tab); refreshStage(); paintUnify();
    if (sb) sbSyncKey(); else sbFromAuth(); // acesso unificado: sessão já conferida; emergência: usa a sessão do aparelho (se for admin)
  }
  function setTab(t) {
    tab = t;
    for (const [k, x] of Object.entries(TABS)) $(x.panel).hidden = k !== t;
    if (!vault) return;
    TABS[t].render();
  }
  // DellamedPainel.show(section): o site já trocou a rota. A mesma seção já desenhada não é redesenhada (não perde foco nem digitação).
  function showSection(section) {
    const t = SECTION_TAB[section] || 'cats';
    if (!vault) {
      tab = t;
      for (const [k, x] of Object.entries(TABS)) $(x.panel).hidden = k !== t;
      if (waitingSession && H.mode === 'unified' && P.auth.load()) unifiedStart(); // voltou do login do site
      return;
    }
    if (t === tab && !$('#pn-main').hidden && $(TABS[t].panel).childElementCount) { $(TABS[t].panel).hidden = false; return; }
    screen('main');
    setTab(t);
  }
  // Navegação interna (primeiros passos, aviso do acesso unificado): desenha já e avisa o site para trocar a rota e o menu
  function goTab(t) {
    setTab(t);
    try { if (H.navigate) H.navigate(TAB_SECTION[t]); } catch (e) { console.error(e); }
  }
  // Contagens ao lado dos itens do menu do site (redesenhadas junto com a barra de alterações, que roda depois de cada publicação)
  const navCounts = {};
  function paintNav() {
    const put = (sec, n) => {
      if (navCounts[sec] === n) return;
      navCounts[sec] = n;
      try { if (H.setCount) H.setCount(sec, n); } catch (e) { console.error(e); }
    };
    put('catalogos', vault ? vault.catalogs.length : 0);
    put('produtos', vault ? Object.keys(vault.products || {}).length : 0);
    put('pessoas', vault ? vault.users.length + (sb && people ? people.length : 0) : 0); // acessos antigos + pessoas do Supabase (quando conectado)
  }
  // Primeiros passos: aparece enquanto faltar contato do marketing, catálogo ou pessoa (o passo 4 é opcional e não mantém o cartão aberto)
  function firstStepsHtml() {
    const st = vault.settings || {};
    // Pessoa: acesso antigo ou alguém no Supabase além do próprio administrador conectado
    const hasPeople = vault.users.length > 0 || !!(sb && people && people.some((p) => p.id !== sb.uid));
    const contacts = !!(st.ativEmail || st.ativWhats), cats = vault.catalogs.length > 0;
    if (contacts && cats && hasPeople) return '';
    const prods = Object.keys(vault.products || {}).length > 0 && (vault.hotspots || []).length > 0;
    const li = (done, n, title, text, step, label) => `<li class="${done ? 'done' : ''}"><span class="st-n" aria-hidden="true">${n}</span><span><b>${title}</b><br><span class="muted">${text}</span></span><button class="btn ${done ? 'ghost' : 'primary'} sm" type="button" data-step="${step}">${label}</button></li>`;
    return `<section class="card steps-card" aria-labelledby="pn-stepsH"><h2 id="pn-stepsH">Primeiros passos</h2><p class="muted">Siga esta ordem para colocar a Prateleira no ar.</p><ol class="steps">
      ${li(contacts, 1, 'Contatos do marketing', 'O e-mail ou WhatsApp do marketing que aparece nas telas de entrar e de ajuda do site.', 'cfg', 'Preencher contatos')}
      ${li(cats, 2, 'Catálogos', 'Arraste os PDFs. O painel converte, protege e publica.', 'cat', 'Adicionar catálogo')}
      ${li(hasPeople, 3, 'Pessoas', 'Convide as pessoas para entrar com e-mail e senha', 'user', sb ? 'Convidar pessoa' : 'Entrar com e-mail e senha')}
      ${li(prods, 4, 'Produtos e áreas (opcional)', 'Cadastre os produtos e marque nas páginas dos catálogos onde cada um aparece.', 'prods', 'Abrir Produtos')}
    </ol></section>`;
  }
  function runStep(step) {
    if (step === 'cfg') { goTab('cfg'); const f = $('#pn-ativEmail'); if (f) f.focus(); }
    else if (step === 'cat') pickPdf(null);
    else if (step === 'prods') goTab('prods');
    else { goTab('users'); inviteDialog(); } // sem sessão de administrador, o convite abre antes o "Entrar com e-mail e senha"
  }

  /* ================= catálogos ================= */
  const coverUrls = new Map();
  const catKeyB64 = (c) => c.key || vault.contentKey;
  // Páginas e miniaturas abertas no editor de áreas: cache pequeno (o mais recente fica no fim); o que sai do cache é revogado
  const pageCache = new Map(); // `${id}:${v}:${início da chave}:${arquivo}` → Promise<[blob URL de cada imagem do arquivo]>
  const PAGE_CACHE_MAX = 6;    // ≈ 4 blocos de páginas + as miniaturas
  const revokeAll = (p) => p.then((urls) => urls.forEach((u) => URL.revokeObjectURL(u)), () => {});
  // Único ponto que revoga as imagens decifradas (capas, páginas e miniaturas): ao recarregar o cofre e ao sair
  function dropImageCache() {
    coverUrls.forEach((p) => p.then((u) => u && URL.revokeObjectURL(u))); coverUrls.clear();
    pageCache.forEach(revokeAll); pageCache.clear();
  }
  function packedImages(c, p) {
    const kb = catKeyB64(c), k = `${c.id}:${c.v || 1}:${kb.slice(0, 12)}:${p}`;
    let hit = pageCache.get(k);
    if (hit) { pageCache.delete(k); pageCache.set(k, hit); return hit; }
    hit = (async () => {
      const enc = await repo.read(p);
      if (!enc || !vault) return [];
      const plain = await P.openFile(await P.aesKey(P.b64d(kb), ['decrypt']), c, p, enc);
      if (!vault) return [];
      return P.unpackImages(plain).map((b) => URL.createObjectURL(new Blob([b], { type: 'image/jpeg' })));
    })();
    hit.catch(() => { if (pageCache.get(k) === hit) pageCache.delete(k); }); // falhou: tenta de novo na próxima vez
    pageCache.set(k, hit);
    while (pageCache.size > PAGE_CACHE_MAX) { const [old, pr] = pageCache.entries().next().value; pageCache.delete(old); revokeAll(pr); }
    return hit;
  }
  const pageUrl = async (c, n) => (await packedImages(c, P.path.chunk(c.id, Math.floor((n - 1) / P.CHUNK))))[(n - 1) % P.CHUNK] || '';
  const thumbUrls = (c, g) => packedImages(c, P.path.thumbs(c.id, g));
  async function coverFor(c) {
    const k = `${c.id}:${c.v}:${catKeyB64(c).slice(0, 12)}`;
    if (!coverUrls.has(k)) {
      coverUrls.set(k, (async () => {
        try {
          const enc = await repo.read(P.path.cover(c.id));
          if (!enc || !vault) return '';
          const key = await P.aesKey(P.b64d(catKeyB64(c)), ['decrypt']);
          return URL.createObjectURL(new Blob([await P.openFile(key, c, P.path.cover(c.id), enc)], { type: 'image/jpeg' }));
        } catch (e) { return ''; }
      })());
    }
    return coverUrls.get(k);
  }
  const validText = (c) => (!c.validUntil ? '—' : c.validUntil < localDate() ? `<span class="status off">venceu em ${fmtDate(c.validUntil)}</span>` : `até ${fmtDate(c.validUntil)}`);
  function renderCats() {
    const box = $('#pn-tabCats'); if (!vault) return;
    const list = viewCatalogs();
    const orig = new Map(vault.catalogs.map((c) => [c.id, c]));
    const changed = (c) => { const o = orig.get(c.id); return o && ((o.visible !== false) !== (c.visible !== false) || !!o.isNew !== !!c.isNew || o.order !== c.order); };
    keepFocus(() => {
      box.innerHTML = `${pageHead('cats', `<button class="btn primary" type="button" data-step="cat">${ICO.upload}Adicionar catálogo</button>`)}
        ${firstStepsHtml()}
        <div class="drop" id="pn-drop" role="button" tabindex="0" aria-label="Adicionar catálogo em PDF">
          <span class="drop-ico" aria-hidden="true">${ICO.upload}</span><b>Arraste o PDF do catálogo aqui</b><span class="muted">ou clique para escolher o arquivo. Você também pode soltar o PDF em qualquer lugar desta aba.</span>
        </div>
        ${list.length ? `<div class="list-card">
          <div class="rows-head cat-grid" aria-hidden="true"><span>Catálogo</span><span>No site</span><span>Novo</span><span>Validade</span><span>Ordem</span></div>
          <ul class="rows" aria-label="Catálogos">${list.map((c, i) => `<li class="rw cat-grid${changed(c) ? ' changed' : ''}" data-row="${esc(c.id)}">
            <div class="c-cover"><img data-cover="${esc(c.id)}" alt=""></div>
            <div class="c-main"><p class="rw-title">${esc(c.title)}</p><p class="rw-meta">${plural(c.pages, 'página', 'páginas')} · ${esc(c.kind)}${c.version ? ` · ${esc(c.version)}` : ''} · ${fmtDate(c.updated)}</p>${(c.lines || []).length ? `<p class="tags">${c.lines.map((l) => `<span class="tag">${esc(l)}</span>`).join('')}</p>` : ''}</div>
            <div class="c-site"><span class="cell-l" aria-hidden="true">No site</span><label class="switch"><input type="checkbox" data-k="visible" ${c.visible !== false ? 'checked' : ''} aria-label="Mostrar ${esc(c.title)} no site"><span></span></label></div>
            <div class="c-new"><span class="cell-l" aria-hidden="true">Selo “Novo”</span><label class="switch"><input type="checkbox" data-k="isNew" ${c.isNew ? 'checked' : ''} aria-label="Selo Novo em ${esc(c.title)}"><span></span></label></div>
            <div class="c-valid"><span class="cell-l">Validade:</span> ${validText(c)}</div>
            <div class="c-order"><span class="cell-l" aria-hidden="true">Ordem</span><div class="order"><button class="mini" type="button" data-k="up" data-move="-1" aria-label="Subir ${esc(c.title)}" ${i === 0 ? 'disabled' : ''}>${ICO.up}</button><button class="mini" type="button" data-k="down" data-move="1" aria-label="Descer ${esc(c.title)}" ${i === list.length - 1 ? 'disabled' : ''}>${ICO.down}</button></div></div>
            <div class="rw-acts"><button class="btn ghost sm" type="button" data-k="edit" data-act="edit">Editar</button><button class="btn ghost sm" type="button" data-k="replace" data-act="replace">Nova versão</button><button class="btn ghost sm" type="button" data-k="remove" data-act="remove">Remover</button></div>
          </li>`).join('')}</ul></div>` : `<div class="empty">Nenhum catálogo ainda. Arraste o primeiro PDF acima.</div>`}`;
    });
    $$('img[data-cover]', box).forEach(async (im) => { const c = vault.catalogs.find((x) => x.id === im.dataset.cover); const u = c && (await coverFor(c)); if (u) im.src = u; });
    const drop = $('#pn-drop');
    drop.addEventListener('click', () => pickPdf(null));
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickPdf(null); } });
    // "No site" e "Novo" não publicam na hora: entram na barra de alterações
    box.onchange = (e) => {
      const tr = e.target.closest('[data-row]'), f = e.target.dataset.k;
      if (!tr || (f !== 'visible' && f !== 'isNew')) return;
      stagedFlags.set(`${tr.dataset.row}|${f}`, e.target.checked);
      refreshStage(); renderCats();
    };
    box.onclick = async (e) => {
      const step = e.target.closest('[data-step]');
      if (step) { runStep(step.dataset.step); return; }
      const mv = e.target.closest('[data-move]'), act = e.target.closest('[data-act]');
      if (!mv && !act) return;
      const id = e.target.closest('[data-row]').dataset.row;
      if (mv) {
        const ids = viewCatalogs().map((c) => c.id), i = ids.indexOf(id), j = i + (+mv.dataset.move);
        if (i < 0 || j < 0 || j >= ids.length) return;
        [ids[i], ids[j]] = [ids[j], ids[i]];
        stagedOrder = ids;
        refreshStage(); renderCats();
        return;
      }
      const c = vault.catalogs.find((x) => x.id === id); if (!c) return;
      if (act.dataset.act === 'edit') editCatalog(c);
      else if (act.dataset.act === 'replace') pickPdf(c);
      else if (await confirmBox(`Remover “${c.title}”?`, `<p>O catálogo sai do site e os arquivos dele são apagados do repositório. Esta ação não pode ser desfeita.</p>${spotsLostHtml(id)}`, 'Remover catálogo', true)) {
        const ok = await publish('Removendo o catálogo', (d) => {
          const t = d.catalogs.find((x) => x.id === id); if (!t) return {};
          d.catalogs = d.catalogs.filter((x) => x.id !== id);
          dropCatalogSpots(d, id, 0);
          return { deletes: catalogPaths(t) };
        }, { onDone: () => dropStaged((r) => r.catalogId === id) });
        if (ok) toast('Catálogo removido do site.');
        renderCats();
      }
    };
  }
  // Todos os arquivos de um catálogo no repositório
  function catalogPaths(c, { chunks = true } = {}) {
    const out = [P.path.cover(c.id), P.path.search(c.id)];
    if (chunks) for (let ci = 0; ci < Math.ceil((c.pages || 0) / P.CHUNK); ci++) out.push(P.path.chunk(c.id, ci));
    for (let ti = 0; ti < (c.th || 0); ti++) out.push(P.path.thumbs(c.id, ti));
    return out;
  }
  // Para a confirmação de remover catálogo: quantas áreas de produto (publicadas ou preparadas) se perdem junto
  function spotsLostHtml(id) {
    const n = viewSpots().filter((h) => h.catalogId === id).length;
    return n ? `<p>${plural(n, 'área de produto marcada', 'áreas de produto marcadas')} neste catálogo também ${n === 1 ? 'será apagada' : 'serão apagadas'}.</p>` : '';
  }
  // Arrastar e soltar: com a gestão à vista, evita que o navegador abra o PDF; aceita o arquivo em qualquer lugar da seção Catálogos.
  // Com a gestão escondida (outra rota do site), nada é interceptado.
  const mainShown = () => !!vault && !$('#pn-main').hidden && moduleShown();
  const canDropPdf = () => mainShown() && tab === 'cats' && !dlg.open && !pgd.open && !cf.open && !busy;
  window.addEventListener('dragover', (e) => { if (!mainShown()) return; e.preventDefault(); const d = $('#pn-drop'); if (d && canDropPdf()) d.classList.add('over'); });
  window.addEventListener('dragleave', (e) => { if (!e.relatedTarget) { const d = $('#pn-drop'); if (d) d.classList.remove('over'); } });
  window.addEventListener('drop', (e) => {
    const d = $('#pn-drop'); if (d) d.classList.remove('over');
    if (!mainShown()) return;
    e.preventDefault();
    if (!canDropPdf()) return;
    const files = [...((e.dataTransfer && e.dataTransfer.files) || [])];
    const f = files.find((x) => /\.pdf$/i.test(x.name) || x.type === 'application/pdf');
    if (f) newCatalogDialog(f); else if (files.length) toast('Solte um arquivo PDF.');
  });
  const catalogForm = (c, extra = '') => `
    <label class="field" id="pn-fTitle"><span class="field-label">Título</span><input id="pn-cTitle" value="${esc(c.title)}"><em class="err" hidden></em></label>
    <div class="grid2">
      <label class="field"><span class="field-label">Tipo</span><input id="pn-cKind" value="${esc(c.kind)}" placeholder="Catálogo, Tabela de preços…"></label>
      <label class="field"><span class="field-label">Versão</span><input id="pn-cVersion" value="${esc(c.version || '')}" placeholder="V1"></label>
    </div>
    <div class="grid2">
      <label class="field"><span class="field-label">Atualizado em</span><input id="pn-cUpdated" type="date" value="${esc(c.updated || localDate())}"></label>
      <label class="field" id="pn-fValid"><span class="field-label">Válido até (opcional)</span><input id="pn-cValid" type="date" value="${esc(c.validUntil || '')}"><em class="err" hidden></em></label>
    </div>
    <div class="field"><span class="field-label">Linhas</span><div class="checks">${LINES_ALL.map((l) => `<label class="check"><input type="checkbox" value="${l}" ${(c.lines || []).includes(l) ? 'checked' : ''}> ${l}</label>`).join('')}</div></div>
    <label class="field"><span class="field-label">Descrição curta</span><input id="pn-cDesc" value="${esc(c.desc || '')}"></label>${extra}`;
  const readCatalogForm = () => ({
    title: $('#pn-cTitle').value.trim(), kind: $('#pn-cKind').value.trim() || 'Catálogo', version: $('#pn-cVersion').value.trim(),
    updated: $('#pn-cUpdated').value || localDate(), validUntil: $('#pn-cValid').value || '',
    lines: $$('.checks input:checked', dlg).map((i) => i.value), desc: $('#pn-cDesc').value.trim()
  });
  // Valida o formulário; data de validade: ano entre o atual e +10; data passada pede confirmação
  async function catalogFormOk(m) {
    setFieldErr($('#pn-fTitle'), m.title ? '' : 'Informe o título.');
    if (!m.title) return false;
    setFieldErr($('#pn-fValid'), '');
    if (!m.validUntil) return true;
    const y = +m.validUntil.slice(0, 4), cy = new Date().getFullYear();
    if (!(y >= cy && y <= cy + 10)) { setFieldErr($('#pn-fValid'), `Informe uma data entre ${cy} e ${cy + 10}.`); return false; }
    if (m.validUntil < localDate()) return confirmBox('A data de validade já passou', `<p>${fmtDate(m.validUntil)} já passou. O catálogo vai aparecer como vencido no site. Salvar assim mesmo?</p>`, 'Salvar assim');
    return true;
  }
  function editCatalog(c) {
    openDialog({
      title: 'Editar catálogo', body: catalogForm(c),
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Salvar e publicar', kind: 'primary',
        onClick: async () => {
          const m = readCatalogForm();
          if (!(await catalogFormOk(m))) return false;
          const ok = await publish('Salvando', (d) => { const t = d.catalogs.find((x) => x.id === c.id); if (!t) throw userErr('Este catálogo foi removido por outro administrador.'); Object.assign(t, m); });
          if (!ok) return false;
          toast('Publicado. O site atualiza em 1 a 3 minutos.');
          renderCats();
          return true;
        }
      }]
    });
  }
  let pdfTarget = null;
  function pickPdf(target) { if (busy) return; pdfTarget = target; $('#pn-pdfInput').value = ''; $('#pn-pdfInput').click(); }
  $('#pn-pdfInput').addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') { toast('Escolha um arquivo PDF.'); return; }
    if (pdfTarget) replaceCatalog(pdfTarget, file); else newCatalogDialog(file);
  });
  function newCatalogDialog(file) {
    const base = { title: file.name.replace(/\.pdf$/i, '').replace(/[_]+/g, ' ').trim(), kind: 'Catálogo', version: '', updated: localDate(), lines: [], desc: '', validUntil: '' };
    openDialog({
      title: 'Adicionar catálogo',
      body: `<p class="muted">Arquivo: <b>${esc(file.name)}</b> · ${mb(file.size)} MB</p>${catalogForm(base, `<label class="check"><input type="checkbox" id="pn-cHidden"> Adicionar oculto (para revisar antes)</label>`)}`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Converter e publicar', kind: 'primary',
        onClick: async () => {
          const m = readCatalogForm();
          if (!(await catalogFormOk(m))) return false;
          return (await addCatalog(file, m, { hidden: $('#pn-cHidden').checked })) ? true : false;
        }
      }]
    });
  }
  // Avisos depois de converter: páginas com outro formato e, na nova versão, áreas de produto para conferir (num aviso só)
  function oddPagesNotice(odd, review) {
    const list = odd && odd.length ? odd.slice(0, 12).join(', ') + (odd.length > 12 ? '…' : '') : '';
    const oddText = list ? `As páginas ${list} têm proporção diferente da primeira página. Elas aparecem no site, mas podem ficar com margens ou menores. Se não for intencional, confira o PDF e publique uma nova versão.` : '';
    if (review) alertBox('Confira as áreas de produto deste catálogo', oddText ? `${review} ${oddText}` : review);
    else if (oddText) alertBox('Algumas páginas têm outro formato', oddText);
  }
  async function addCatalog(file, meta = {}, opts = {}) {
    const id = P.randHex(4);
    const c0 = { id, v: 1, aad: 1, key: P.b64e(P.rand(32)) };
    let conv = null;
    const ok = await publish('Adicionando o catálogo', async (d, pg) => {
      if (!conv) { await earlyConflict(); conv = await convertPdf(file, c0, pg); }
      const order = d.catalogs.reduce((a, c) => Math.max(a, c.order || 0), 0) + 1;
      d.catalogs.push({
        ...c0, title: meta.title || file.name.replace(/\.pdf$/i, ''), kind: meta.kind || 'Catálogo', version: meta.version || '', updated: meta.updated || localDate(),
        lines: meta.lines || [], desc: meta.desc || '', validUntil: meta.validUntil || '', pages: conv.pages, ratio: conv.ratio, th: conv.th, busca: true,
        order, isNew: true, visible: !opts.hidden
      });
      return { files: conv.files };
    }, { cancel: true });
    if (ok) {
      toast(opts.hidden ? 'Catálogo publicado oculto. Ligue “No site” quando estiver pronto.' : 'Catálogo publicado. O site atualiza em 1 a 3 minutos.');
      if (tab === 'cats') renderCats();
      oddPagesNotice(conv && conv.odd);
    }
    return ok;
  }
  // Nova versão: chave nova, v + 1, todos os arquivos reescritos e as sobras antigas apagadas
  async function replaceCatalog(c, file) {
    if (!(await confirmBox(`Nova versão de “${c.title}”?`, `<p>As páginas atuais serão trocadas pelas do arquivo <b>${esc(file.name)}</b> (${mb(file.size)} MB).</p>`, 'Converter e publicar'))) return;
    const cNew = { id: c.id, v: (c.v || 1) + 1, aad: 1, key: P.b64e(P.rand(32)) }, before = c.pages;
    let conv = null, review = false, lost = 0;
    const ok = await publish('Atualizando o catálogo', async (d, pg) => {
      const t = d.catalogs.find((x) => x.id === c.id);
      if (!t) throw userErr('Este catálogo foi removido por outro administrador.');
      if ((t.v || 1) + 1 !== cNew.v) throw userErr('Outro administrador publicou uma versão deste catálogo agora há pouco. Clique em “Atualizar dados” e tente de novo.');
      if (!conv) { await earlyConflict(); conv = await convertPdf(file, cNew, pg); }
      const keep = new Set(conv.files.map((f) => f.path));
      const deletes = catalogPaths(t).filter((p) => !keep.has(p));
      // Mudou o número de páginas: saem as áreas das páginas que não existem mais e o catálogo fica marcado para conferir (marca só do cofre)
      review = conv.pages !== t.pages && hasSpotsIn(d, c.id);
      lost = review ? dropCatalogSpots(d, c.id, conv.pages) : 0;
      Object.assign(t, { key: cNew.key, aad: 1, v: cNew.v, pages: conv.pages, ratio: conv.ratio, th: conv.th, busca: true, updated: localDate() });
      if (review) t.reviewHotspots = true;
      delete t.texts;
      return { files: conv.files, deletes };
    }, { cancel: true, onDone: () => dropStaged((r) => r.catalogId === c.id && r.page > conv.pages) });
    if (ok) {
      toast('Nova versão publicada.'); renderCats();
      const note = review ? `A nova versão tem ${plural(conv.pages, 'página', 'páginas')} (antes eram ${before}).${lost ? ` ${plural(lost, 'área de produto ficou', 'áreas de produto ficaram')} fora das páginas e ${lost === 1 ? 'foi removida' : 'foram removidas'}.` : ''} Abra este catálogo na aba Produtos e confira se as áreas continuam sobre os produtos certos.` : '';
      oddPagesNotice(conv && conv.odd, note);
    }
  }

  /* ================= conversão do PDF (enviada aos poucos) ================= */
  let pdfWorkerUrl = null;
  const PDF_FAIL = 'Não foi possível carregar o conversor de PDF. Verifique a internet e tente de novo.';
  // pdf.js é carregado só na primeira conversão (loadPdfJs, com SRI); o worker é baixado com verificação de integridade e roda numa thread própria (blob:)
  async function startPdfWorker() {
    try { await loadPdfJs(); } catch (e) { console.error(e); throw userErr(PDF_FAIL); }
    if (!window.pdfjsLib) throw userErr(PDF_FAIL);
    if (!pdfWorkerUrl) {
      try {
        const r = await fetch(PDF_WORKER, { integrity: PDF_WORKER_SRI, mode: 'cors' });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        pdfWorkerUrl = URL.createObjectURL(new Blob([await r.arrayBuffer()], { type: 'text/javascript' }));
      } catch (e) { console.error(e); throw userErr(PDF_FAIL); }
    }
    try { const w = new Worker(pdfWorkerUrl); window.pdfjsLib.GlobalWorkerOptions.workerPort = w; return w; }
    catch (e) { console.error(e); throw userErr(PDF_FAIL); }
  }
  const toJpeg = (cv, q) => new Promise((res, rej) => cv.toBlob((b) => (b ? res(b) : rej(userErr('A página é grande demais para converter neste computador.'))), 'image/jpeg', q));
  function scaled(src, w) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = Math.max(1, Math.round(src.height * w / src.width));
    const ctx = cv.getContext('2d', { alpha: false }); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(src, 0, 0, cv.width, cv.height);
    return cv;
  }
  async function makeCover(blob) {
    const bmp = await createImageBitmap(blob);
    const cv = scaled(bmp, 420); bmp.close();
    return new Uint8Array(await (await toJpeg(cv, 0.8)).arrayBuffer());
  }
  async function thumbFromJpeg(bytes) {
    const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }));
    const cv = scaled(bmp, P.THUMB_W); bmp.close();
    return toJpeg(cv, 0.7);
  }
  // Envia arquivos para o GitHub à medida que ficam prontos (no máximo `limit` ao mesmo tempo); guarda só { path, sha }
  function uploader(files, limit = 3) {
    const inflight = new Set(); let err = null;
    return {
      add(path, dataP) {
        let p;
        p = (async () => {
          try { const data = await dataP; if (!err) files.push({ path, sha: await repo.putBlob(data) }); }
          catch (e) { err = err || e; }
          finally { inflight.delete(p); }
        })();
        inflight.add(p);
      },
      async room() { if (err) throw err; while (inflight.size >= limit) { await Promise.race(inflight); if (err) throw err; } },
      async done() { while (inflight.size) await Promise.race(inflight); if (err) throw err; }
    };
  }
  // PDF → páginas JPEG (retrato 1300 px, paisagem 1840 px) → blocos de 4 páginas, miniaturas, capa e busca, cada um cifrado e enviado
  async function convertPdf(file, c, pg) {
    const worker = await startPdfWorker();
    let pdf = null;
    try {
      try { pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise; }
      catch (e) { throw userErr('Não foi possível abrir este PDF. Confira se o arquivo abre normalmente e não tem senha.'); }
      const n = pdf.numPages;
      if ((n > 150 || file.size > 80 * 1048576) && !(await confirmBox('PDF grande', `<p>Este PDF tem ${plural(n, 'página', 'páginas')} e ${mb(file.size)} MB. A conversão pode levar muitos minutos e usar bastante memória.</p><p>Use um computador, deixe esta aba aberta e continue só se o arquivo estiver certo.</p>`, 'Converter assim mesmo'))) throw cancelErr();
      const key = await P.aesKey(P.b64d(c.key), ['encrypt']);
      const files = [], texts = [], odd = [], up = uploader(files);
      let ratio = 0.707, group = [], thumbs = [];
      const pack = (p, parts) => up.add(p, (async () => P.sealFile(key, c, p, await P.packImages(parts)))());
      for (let i = 1; i <= n; i++) {
        if (pg.cancelled) throw cancelErr();
        await up.room();
        pg.set(`Convertendo a página ${i} de ${n}`, 0.78 * (i - 1) / n);
        const page = await pdf.getPage(i);
        const vp1 = page.getViewport({ scale: 1 });
        const r = vp1.width / vp1.height;
        if (i === 1) ratio = +r.toFixed(4); else if (Math.abs(r / ratio - 1) > 0.05) odd.push(i);
        const vp = page.getViewport({ scale: (vp1.width > vp1.height ? 1840 : 1300) / vp1.width });
        const cv = document.createElement('canvas');
        cv.width = Math.round(vp.width); cv.height = Math.round(vp.height);
        const ctx = cv.getContext('2d', { alpha: false });
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
        await page.render({ canvasContext: ctx, viewport: vp, intent: 'print' }).promise;
        const blob = await toJpeg(cv, 0.82);
        thumbs.push(await toJpeg(scaled(cv, P.THUMB_W), 0.7));
        cv.width = cv.height = 0;
        if (i === 1) { const cp = P.path.cover(c.id); up.add(cp, (async () => P.sealFile(key, c, cp, await makeCover(blob)))()); }
        group.push(blob);
        if (group.length === P.CHUNK || i === n) { pack(P.path.chunk(c.id, Math.floor((i - 1) / P.CHUNK)), group); group = []; }
        if (thumbs.length === P.THUMB_CHUNK || i === n) { pack(P.path.thumbs(c.id, Math.floor((i - 1) / P.THUMB_CHUNK)), thumbs); thumbs = []; }
        const tc = await page.getTextContent();
        texts.push(tc.items.map((it) => it.str + (it.hasEOL ? '\n' : ' ')).join('').replace(/[ \t]+/g, ' ').trim());
        page.cleanup();
      }
      up.add(P.path.search(c.id), P.sealSearch(key, c, texts));
      pg.set('Terminando o envio das páginas…', 0.8);
      await up.done();
      return { pages: n, ratio, files, th: Math.ceil(n / P.THUMB_CHUNK), odd };
    } finally {
      try { if (pdf) await pdf.destroy(); } catch (e) { /* noop */ }
      worker.terminate();
      window.pdfjsLib.GlobalWorkerOptions.workerPort = null;
    }
  }

  /* ================= troca de chaves (sem publicar pela metade: tudo vai num único envio) ================= */
  const rotationTargets = (d, all) => d.catalogs.filter((c) => all || !c.key);
  const rotationFileCount = (list) => list.reduce((a, c) => a + Math.ceil((c.pages || 0) / P.CHUNK) + 2 + (c.th || Math.ceil((c.pages || 0) / P.THUMB_CHUNK)), 0);
  const estimate = (n) => `cerca de ${plural(n, 'arquivo', 'arquivos')}, ~${Math.max(1, Math.ceil(n * 1.2 / 60))} min`;
  // Nova chave-raiz (dados.bin) e chaves novas para os catálogos antigos (all = false) ou para todos (all = true)
  async function rotateKeys(d, pg, all) {
    const oldRoot = d.contentKey;
    d.contentKey = P.b64e(P.rand(32)); d.keyRev = (d.keyRev || 1) + 1;
    const targets = rotationTargets(d, all);
    const total = Math.max(1, rotationFileCount(targets));
    const files = []; let done = 0;
    const tick = () => pg.set(`Protegendo os catálogos com chaves novas… ${Math.min(++done, total)} de ${total}`, 0.78 * Math.min(1, done / total));
    for (const c of targets) {
      if (pg.cancelled) throw cancelErr();
      const oldC = { id: c.id, v: c.v || 1, aad: c.aad ? 1 : 0 };
      const oldKey = await P.aesKey(P.b64d(c.key || oldRoot), ['decrypt']);
      const oldTh = c.th || 0, hadBusca = !!c.busca, texts = c.texts;
      c.key = P.b64e(P.rand(32)); c.aad = 1; c.v = (c.v || 1) + 1;
      const newKey = await P.aesKey(P.b64d(c.key), ['encrypt']);
      const readOpen = async (p) => {
        const enc = await repo.read(p);
        if (!enc) throw userErr(`O arquivo ${p} não foi encontrado no repositório. Nada foi alterado.`);
        return P.openFile(oldKey, oldC, p, enc);
      };
      const up = uploader(files);
      const reseal = (p) => { up.add(p, (async () => P.sealFile(newKey, c, p, await readOpen(p)))()); tick(); };
      reseal(P.path.cover(c.id));
      let thumbs = [], ti = 0;
      const flushThumbs = () => { const tp = P.path.thumbs(c.id, ti++), g = thumbs; thumbs = []; up.add(tp, (async () => P.sealFile(newKey, c, tp, await P.packImages(g)))()); tick(); };
      for (let ci = 0; ci < Math.ceil((c.pages || 0) / P.CHUNK); ci++) {
        if (pg.cancelled) throw cancelErr();
        await up.room();
        const p = P.path.chunk(c.id, ci);
        const plain = await readOpen(p);
        if (!oldTh) for (const img of P.unpackImages(plain)) { thumbs.push(await thumbFromJpeg(img)); if (thumbs.length === P.THUMB_CHUNK) flushThumbs(); }
        up.add(p, P.sealFile(newKey, c, p, plain)); tick();
      }
      if (!oldTh) { if (thumbs.length) flushThumbs(); c.th = ti; }
      else for (let t = 0; t < oldTh; t++) { await up.room(); reseal(P.path.thumbs(c.id, t)); }
      const sp = P.path.search(c.id);
      if (Array.isArray(texts)) { up.add(sp, P.sealSearch(newKey, c, texts)); delete c.texts; c.busca = true; }
      else if (hadBusca) {
        const enc = await repo.read(sp);
        if (enc) { const pages = await P.openSearch(oldKey, oldC, enc); up.add(sp, P.sealSearch(newKey, c, pages)); } else c.busca = false;
      }
      tick();
      await up.done();
    }
    return { files };
  }

  /* ================= Supabase: sessão do administrador (P.auth, a mesma do site neste computador) =================
     A sessão é a do aparelho (P.auth: "dm.auth"), compartilhada com o site. O painel só guarda na memória quem ela é depois de conferir
     o perfil (perfis.papel = admin e ativo): sb = { uid, email }. Todo token vem de P.auth.token() (renovação única com Web Locks).
     O "Sair" do painel encerra a sessão P.auth; o bloqueio automático só esquece sb. */
  let sb = null;                   // { uid, email } — sessão P.auth conferida como administradora
  let sbGen = 0;                   // muda a cada fim de sessão: respostas atrasadas de uma sessão anterior são ignoradas
  let sbWarn = '';                 // aviso persistente em Pessoas e Configurações (chave dos catálogos não sincronizada)
  let sbChain = Promise.resolve(); // sincronizações da chave, uma depois da outra
  let people = null, peopleErr = '', peopleJob = null, peopleSeq = 0; // perfis do Supabase (null = ainda não carregados)
  let secretsInfo = null, secretsJob = null; // situação do acesso unificado: { active, at } | { err } | null (não verificada)
  const sbAuthErr = (msg) => { const e = userErr(msg); e.status = 401; return e; };
  const MSG_SESSION = 'A sessão terminou. Entre com e-mail e senha em Configurações → Acesso unificado.';
  // Fim do estado da sessão no painel (não mexe na sessão do aparelho)
  function sbEnd() {
    sbGen++; peopleSeq++;
    sb = null; secretsInfo = null; secretsJob = null;
    people = null; peopleErr = ''; peopleJob = null;
    sbRepaint();
  }
  // Chamada autenticada. Sem sessão no aparelho ou token recusado (401): o painel esquece a sessão
  async function sbCall(fn) {
    const gen = sbGen;
    let t;
    try { t = await P.auth.token(); }
    catch (e) { if (e.status && !P.auth.load()) { if (sb && gen === sbGen) sbEnd(); throw sbAuthErr(MSG_SESSION); } throw e; }
    if (!t) { if (sb && gen === sbGen) sbEnd(); throw sbAuthErr(MSG_SESSION); }
    try { return await fn(t); }
    catch (e) { if (e.status === 401 && sb && gen === sbGen) sbEnd(); throw e; }
  }
  function sbErrText(e) {
    if (e && e.userMessage) return e.userMessage;
    if (!e || !e.status) return 'Sem conexão com o Supabase. Verifique a internet e tente de novo.';
    if (e.status === 401 || e.status === 403) return 'A sessão terminou ou esta conta não tem permissão de administrador. Entre com e-mail e senha em Configurações → Acesso unificado.';
    if (e.status === 429) return 'O Supabase limitou a quantidade de pedidos. Espere alguns minutos e tente de novo.';
    if (e.status >= 500) return 'O Supabase está instável agora. Espere alguns minutos e tente de novo.';
    const detail = e.message && !/^HTTP \d+$/.test(e.message) ? ` (${e.message})` : '';
    return `O Supabase recusou o pedido (erro ${e.status})${detail}.`;
  }
  // Erros da função "pessoas": vale o código HTTP (P.supa.fn não lê o campo "erro" da resposta)
  const sbFnErr = (e, acao) => (e && e.status === 409 && acao === 'convidar' ? 'Este e-mail já tem acesso. Use Reenviar acesso.'
    : e && e.status === 404 ? "A função 'pessoas' ainda não foi publicada no Supabase." : sbErrText(e));
  async function sbIsAdmin(t, uid) {
    const rows = await P.supa.select(t, 'perfis', `id=eq.${encodeURIComponent(uid || '')}&select=papel,ativo`);
    const r = Array.isArray(rows) ? rows[0] : null;
    return !!(r && r.papel === 'admin' && r.ativo === true);
  }
  function sbAdopt(rec) { sbGen++; sb = { uid: rec.uid, email: rec.email }; sbAfterConnect(); }
  // Entrar com e-mail e senha com o painel aberto (cartão "Acesso unificado" e diálogo): a sessão vale também para o site.
  // Conta que não é administradora: a sessão fica (a pessoa pode usar o site), mas o painel não a usa.
  async function sbConnect(email, password, keep) {
    const gen = sbGen;
    const rec = await P.auth.signIn(email, password, keep);
    setIdleLocked(false);
    if (!(await sbIsAdmin(rec.access_token, rec.uid))) throw userErr(MSG_NOT_ADMIN);
    if (gen !== sbGen || !vault) throw cancelErr(); // o painel foi bloqueado no meio
    sbAdopt(rec);
  }
  // Cofre aberto pela emergência: usa a sessão que já existe neste computador (por exemplo, a do site), se for de administrador
  async function sbFromAuth() {
    if (sb || !P.auth.load()) return;
    const gen = sbGen;
    try {
      const t = await P.auth.token(), rec = P.auth.load();
      if (!t || !rec) return;
      const ok = await sbIsAdmin(t, rec.uid);
      if (gen !== sbGen || !vault || sb || !ok) return;
      sbAdopt(rec);
    } catch (e) { console.error(e); }
  }
  function sbAfterConnect() {
    sbRepaint();
    sbSyncKey();
    loadPeople().then(sbRepaint);
    if (!secretsInfo) loadSecretsInfo();
  }

  /* ---------- chave dos catálogos no Supabase ----------
     Quem entra pelo Supabase recebe a chave-raiz (vault.contentKey) pela RPC chave_conteudo. O painel confere ao entrar, ao desbloquear
     o cofre com a sessão já conferida e em "Atualizar dados", e grava (definir_chave) depois de toda publicação que troca a chave-raiz (publish). */
  function sbSyncKey() {
    const run = sbChain.then(sbSyncOnce);
    sbChain = run.catch(() => {});
    return run;
  }
  async function sbSyncOnce() {
    if (!sb || !vault) return false;
    const want = vault.contentKey;
    try {
      const have = await sbCall((t) => P.supa.rpc(t, 'chave_conteudo', {}));
      if (have !== want) {
        await sbCall((t) => P.supa.rpc(t, 'definir_chave', { k: want }));
        toast('Chave dos catálogos sincronizada com o Supabase.');
      }
      sbSetWarn('');
      return true;
    } catch (e) {
      console.error(e);
      if (vault) sbSetWarn(`A chave dos catálogos não foi sincronizada com o Supabase. ${sbErrText(e)} Até sincronizar, quem usa o novo acesso pode ficar sem abrir os catálogos.`);
      return false;
    }
  }
  // Chamado por publish() quando a chave-raiz mudou
  function sbKeyChanged() {
    if (sb) sbSyncKey();
    else sbSetWarn('A chave dos catálogos mudou e o Supabase não foi atualizado. Entre com e-mail e senha para sincronizar: até lá, quem usa o novo acesso fica sem abrir os catálogos.');
  }
  // Antes de uma troca da chave-raiz sem sessão de administrador. true = seguir agora. "Entrar agora" abre o "Entrar com e-mail e senha" e
  // resume(entrou) roda quando esse diálogo termina (para repetir a ação).
  async function sbRotationGate(resume) {
    if (sb) return true;
    const r = await confirmBox('Entre com e-mail e senha antes', '<p>Entre com a sua conta de administrador antes de trocar as chaves. Sem isso, quem usa o novo acesso fica sem abrir os catálogos e o acesso unificado fica desatualizado até você entrar.</p>', 'Entrar agora', false, 'Continuar mesmo assim');
    if (r === 'alt') return true;
    if (r === true) sbConnectDialog(resume);
    return false;
  }
  const sbWarnHtml = () => `<div class="alert error" role="alert" data-sb-warn><b>Supabase:</b> ${esc(sbWarn)}<div class="row"><button class="btn primary sm" type="button" data-sb="retry">Tentar de novo</button></div></div>`;
  function paintSbWarn() {
    $$('[data-sb-warn-slot]', H.root).forEach((s) => {
      if (s.dataset.msg === sbWarn) return;
      s.dataset.msg = sbWarn; s.hidden = !sbWarn; s.innerHTML = sbWarn ? sbWarnHtml() : '';
    });
  }
  function sbSetWarn(msg) { sbWarn = msg; paintSbWarn(); }

  /* ---------- acesso unificado: segredos dos administradores no Supabase ----------
     admin_segredos_ler() → { chave_cofre, token_github, repo, atualizado_em }; admin_segredos_salvar(p_chave_cofre, p_token_github, p_repo)
     (null mantém o valor atual). Gravados por "Unificar acesso" e, sozinhos, depois de trocar a chave do cofre (publish), de informar um
     token novo (emergência) e de alterar o repositório. Sem sessão ou com erro: aviso #pn-unifyBar até unificar de novo. */
  const unifyStale = () => { try { return localStorage.getItem(UNIFY_STALE_KEY) === '1'; } catch (e) { return false; } };
  function setUnifyStale(on) {
    try { if (on) localStorage.setItem(UNIFY_STALE_KEY, '1'); else localStorage.removeItem(UNIFY_STALE_KEY); } catch (e) { /* noop */ }
    paintUnify();
  }
  function paintUnify() { $('#pn-unifyBar').hidden = !(vault && unifyStale()); }
  $('#pn-unifyBarBtn').addEventListener('click', () => { goTab('cfg'); const c = $('#pn-cfgUnify'); if (c) { c.scrollIntoView({ block: 'start' }); const f = $('input, button', c); if (f) f.focus(); } });
  let secretsChain = Promise.resolve();
  // what: { key, token, repo } (o que mudou). Os valores são lidos agora (o painel pode ser bloqueado antes do envio).
  // explicit ("Unificar acesso"): devolve o erro em vez de acender o aviso. Resolve { ok, err }.
  function syncSecrets(what) {
    const args = {
      p_chave_cofre: what.key && vk && vaultFmt === 2 ? P.b64e(vk.raw) : null,
      p_token_github: what.token && token ? token : null,
      p_repo: what.repo && cfg.owner && cfg.repo ? JSON.stringify({ owner: cfg.owner, repo: cfg.repo, branch: cfg.branch || 'main' }) : null
    };
    const all = !!(args.p_chave_cofre && args.p_token_github && args.p_repo);
    const run = secretsChain.then(async () => {
      if (!args.p_chave_cofre && !args.p_token_github && !args.p_repo) return { ok: false, err: userErr('Nada para salvar: abra o cofre e confira o token e o repositório.') };
      try {
        const t = await P.auth.token();
        if (!t) throw sbAuthErr(MSG_SESSION);
        await P.supa.rpc(t, 'admin_segredos_salvar', args);
      } catch (e) {
        console.error(e);
        if (!what.explicit) setUnifyStale(true);
        return { ok: false, err: e };
      }
      if (all) { secretsInfo = { active: true, at: new Date().toISOString() }; setUnifyStale(false); }
      else if (secretsInfo && !secretsInfo.err) secretsInfo = { active: secretsInfo.active, at: new Date().toISOString() };
      sbRepaint();
      return { ok: true };
    });
    secretsChain = run.catch(() => {});
    return run;
  }
  function loadSecretsInfo() {
    if (!sb || secretsJob) return secretsJob || Promise.resolve();
    const gen = sbGen;
    const job = sbCall(readSecrets)
      .then((s) => { if (gen === sbGen) secretsInfo = { active: secretsComplete(s), at: (s && s.atualizado_em) || '' }; })
      .catch((e) => { console.error(e); if (gen === sbGen) secretsInfo = { err: isNotAdminErr(e) ? MSG_NOT_ADMIN : sbErrText(e) }; })
      .finally(() => { if (secretsJob === job) secretsJob = null; if (gen === sbGen) sbRepaint(); });
    secretsJob = job;
    return job;
  }
  const fmtDayTime = (iso) => { const d = new Date(iso), z = (n) => String(n).padStart(2, '0'); return `${z(d.getDate())}/${z(d.getMonth() + 1)} às ${z(d.getHours())}:${z(d.getMinutes())}`; };
  // "Unificar acesso": grava a chave do cofre, o token do GitHub e o repositório de agora
  async function unifyNow(btn) {
    if (!vk || vaultFmt !== 2) { alertBox('Ainda não dá para unificar', 'O cofre ainda está no formato antigo. Publique qualquer alteração (por exemplo, “Salvar e publicar” em Contatos do marketing) e tente de novo.'); return; }
    if (!token) { alertBox('Ainda não dá para unificar', 'O token do GitHub não está aberto nesta sessão. Saia e entre com a senha mestra informando o token.'); return; }
    if (btn) btn.disabled = true;
    const r = await syncSecrets({ key: true, token: true, repo: true, explicit: true });
    if (btn && btn.isConnected) btn.disabled = false;
    if (r.ok) toast('Acesso unificado. Da próxima vez, entre só com e-mail e senha.');
    else alertBox('Não foi possível unificar o acesso', isNotAdminErr(r.err) ? MSG_NOT_ADMIN : sbErrText(r.err));
  }
  // Cartão "Acesso unificado" (Configurações)
  function unifyCardHtml() {
    const i = secretsInfo;
    const status = !sb ? '<span class="status off" id="pn-unifyStatus">Não verificado</span>'
      : !i ? '<span class="status wait" id="pn-unifyStatus">Verificando…</span>'
      : i.err ? `<span class="status off" id="pn-unifyStatus">Não verificado</span> <span class="muted">${esc(i.err)}</span> <button class="link" type="button" data-sb="secrets">Tentar de novo</button>`
      : i.active ? `<span class="status on" id="pn-unifyStatus">Ativo${i.at ? ` — atualizado em ${esc(fmtDayTime(i.at))}` : ''}</span>`
      : '<span class="status off" id="pn-unifyStatus">Não ativado</span>';
    const emergency = openedBy && openedBy !== 'unified';
    const who = sb ? `<p class="muted">Conectado como <b>${esc(sb.email)}</b>. A mesma sessão vale para o site neste computador.</p>` : '';
    const action = sb
      ? (emergency ? '<div class="row"><button class="btn primary" type="button" id="pn-unifyBtn" data-sb="unify">Unificar acesso</button></div>' : '')
      : `<form class="stack" id="pn-unifyLogin" novalidate>
          <p class="muted">Entre com a sua conta de administrador (e-mail e senha) para ver a situação${emergency ? ' e unificar o acesso' : ''}, convidar e gerenciar pessoas.</p>
          <div class="grid2">
            <label class="field" id="pn-fUnMail"><span class="field-label">E-mail</span><input id="pn-unMail" type="email" autocomplete="username" spellcheck="false"><em class="err" hidden></em></label>
            <label class="field" id="pn-fUnPw"><span class="field-label">Senha</span><input id="pn-unPw" type="password" autocomplete="current-password" spellcheck="false"><em class="err" hidden></em></label>
          </div>
          <label class="check"><input type="checkbox" id="pn-unKeep"> Manter conectado neste computador</label>
          <div class="alert error" id="pn-unErr" role="alert" hidden></div>
          <div class="row"><button class="btn primary" type="submit" id="pn-unBtn">Entrar</button></div>
        </form>`;
    return `<div class="card-head"><span class="card-ico" aria-hidden="true">${ICO.users}</span><h2 id="pn-cfgUnifyH">Acesso unificado</h2></div>
      <p class="muted">Os administradores entram no painel com o mesmo e-mail e senha do site. A chave do cofre, o token do GitHub e o repositório ficam guardados no Supabase, só para administradores. A senha mestra e a chave de recuperação continuam valendo para emergências.</p>
      <p>${status}</p>
      ${who}${action}
      <p class="muted">Recomendado: ative a verificação em duas etapas nas contas de administrador.</p>`;
  }
  const sbConnectCardHtml = () => `<section class="card stack" aria-labelledby="pn-sbConnH"><div class="card-head"><span class="card-ico" aria-hidden="true">${ICO.users}</span><h2 id="pn-sbConnH">Entre com e-mail e senha para convidar e gerenciar pessoas</h2></div>
    <p class="muted">Use a sua conta de administrador, a mesma do site. A sessão vale também para o site neste computador.</p>
    <button class="btn primary" type="button" data-sb="connect">Entrar com e-mail e senha</button></section>`;
  // Redesenha o que depende da sessão (contagem do menu e a aba aberta), sem recriar campos em edição
  function sbRepaint() {
    if (!vault) return;
    paintNav();
    if (tab === 'users') renderUserRows();
    else if (tab === 'cfg' && $('#pn-cfgUnify')) {
      const card = $('#pn-cfgUnify'), typing = card.contains(document.activeElement) && document.activeElement.matches('input');
      if (!(typing && !sb && $('#pn-unifyLogin', card))) card.innerHTML = unifyCardHtml(); // não apaga o que está sendo digitado
      paintSbWarn();
    }
  }
  // Botões [data-sb] das abas Pessoas e Configurações (um manipulador só)
  function onSbClick(e) {
    const b = e.target.closest('[data-sb]'); if (!b) return false;
    const a = b.dataset.sb;
    if (a === 'connect') sbConnectDialog();
    else if (a === 'unify') unifyNow(b);
    else if (a === 'secrets') { secretsInfo = null; loadSecretsInfo(); sbRepaint(); }
    else if (a === 'retry') {
      if (!sb) sbConnectDialog(); // ao entrar, a chave é sincronizada
      else { b.disabled = true; sbSyncKey().then((ok) => { b.disabled = false; if (ok) toast('Chave dos catálogos sincronizada com o Supabase.'); }); }
    } else if (a === 'reload') { const job = loadPeople(); sbRepaint(); job.then(sbRepaint); }
    return true;
  }
  // Entrar com e-mail e senha no cartão "Acesso unificado" (formulário #pn-unifyLogin)
  async function onUnifyLogin(e) {
    if (!e.target.matches('#pn-unifyLogin')) return;
    e.preventDefault();
    const f = readAuthFields($('#pn-fUnMail'), $('#pn-fUnPw')); if (!f) return;
    const btn = $('#pn-unBtn'), box = $('#pn-unErr');
    btn.disabled = true; box.hidden = true;
    try { await sbConnect(f.email, f.pw, $('#pn-unKeep').checked); }
    catch (x) {
      if (x.cancelled) return;
      console.error(x);
      if (btn.isConnected) { btn.disabled = false; box.textContent = authErrText(x); box.hidden = false; $('#pn-unPw').value = ''; }
      return;
    }
    toast(`Conectado como ${sb ? sb.email : f.email}.`);
  }
  // "Entrar com e-mail e senha" em diálogo (Pessoas, aviso antes de trocar chaves). then(entrou): opcional; roda quando o diálogo termina
  function sbConnectDialog(then) {
    let done = false;
    const fin = (ok) => { if (!done) { done = true; if (then) then(ok); } };
    openDialog({
      title: 'Entrar com e-mail e senha', locked: !!then,
      body: `<p class="muted">Use a sua conta de administrador, a mesma do site. A sessão vale também para o site neste computador.</p>
        <label class="field" id="pn-fSbMail"><span class="field-label">E-mail</span><input id="pn-sbMail" type="email" autocomplete="username" spellcheck="false"><em class="err" hidden></em></label>
        <label class="field" id="pn-fSbPw"><span class="field-label">Senha</span><input id="pn-sbPw" type="password" autocomplete="current-password" spellcheck="false"><em class="err" hidden></em></label>
        <label class="check"><input type="checkbox" id="pn-sbKeep"> Manter conectado neste computador</label>`,
      actions: [{ label: 'Cancelar', kind: 'ghost', onClick: () => { fin(false); } }, {
        label: 'Entrar', kind: 'primary',
        onClick: async () => {
          const f = readAuthFields($('#pn-fSbMail'), $('#pn-fSbPw')); if (!f) return false;
          dlgErr('');
          try { await sbConnect(f.email, f.pw, $('#pn-sbKeep').checked); }
          catch (e) {
            if (e.cancelled) return false;
            console.error(e);
            dlgErr(authErrText(e));
            $('#pn-sbPw').value = '';
            return false;
          }
          toast(`Conectado como ${sb.email || f.email}.`);
          fin(true);
          return true;
        }
      }]
    });
  }
  function loadPeople() {
    if (!sb) return Promise.resolve();
    const seq = ++peopleSeq;
    peopleErr = '';
    peopleJob = sbCall((t) => P.supa.select(t, 'perfis', 'select=id,email,nome,empresa,papel,ativo,criado_em&order=nome.asc'))
      .then((rows) => { if (seq === peopleSeq) people = Array.isArray(rows) ? rows : []; })
      .catch((e) => { console.error(e); if (seq === peopleSeq) { peopleErr = sbErrText(e); if (people) toast(peopleErr); } })
      .finally(() => { if (seq === peopleSeq) peopleJob = null; });
    return peopleJob;
  }

  /* ================= pessoas =================
     "Pessoas": perfis do Supabase (convidar, editar, bloquear, reenviar acesso, remover).
     "Acessos antigos": pessoas do cofre (vault.users) que ainda entram pelo acesso antigo: só leitura, "Convidar para o novo acesso" e
     "Remover". O acessos.json delas continua sendo gerado por coreFiles() enquanto existirem. */
  const pendingLabel = (u) => `código provisório até ${fmtDateTime(u.pending.x)}`;
  function statusOf(u) {
    if (isActive(u)) return `<span class="status on">Ativo</span>${u.pub ? '' : '<br><span class="muted">senha definida no painel</span>'}`;
    if (pendingOpen(u)) return `<span class="status wait">Não ativado</span><br><span class="muted">${esc(pendingLabel(u))}</span>`;
    return `<span class="status off">${expiredOf(u) ? 'Código vencido' : 'Sem acesso'}</span>`;
  }
  let userQ = '', legacyOpen = false; // "Acessos antigos" começa recolhido
  const selected = new Set();
  const matcher = () => { const q = norm(userQ); return (s) => !q || norm(s).includes(q); };
  const visibleUsers = () => { const hit = matcher(); return vault.users.slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).filter((u) => hit(`${u.name} ${u.email} ${u.company}`)); };
  const visiblePeople = () => { const hit = matcher(); return (people || []).filter((p) => hit(`${p.nome || ''} ${p.email || ''} ${p.empresa || ''}`)); };
  function renderUsers() {
    const box = $('#pn-tabUsers'); if (!vault) return;
    box.innerHTML = `${pageHead('users', '<button class="btn primary" id="pn-inviteBtn" type="button">+ Convidar pessoa</button>')}
      <div data-sb-warn-slot hidden></div>
      <div id="pn-sbConnectSlot" hidden></div>
      <div class="tiles" id="pn-uTiles"></div>
      <div class="toolbar">
        <div class="search"><span class="ico">${ICO.search}</span><input class="input" id="pn-uq" type="search" placeholder="Buscar nome, e-mail ou empresa" value="${esc(userQ)}" aria-label="Buscar pessoas" aria-describedby="pn-uCount"></div>
      </div>
      <p class="count"><span id="pn-uCount" aria-live="polite"></span></p>
      <section class="stack" id="pn-uPeople" aria-labelledby="pn-uPeopleH" hidden><h2 class="sec-title" id="pn-uPeopleH">Pessoas</h2><div id="pn-uTable"></div></section>
      <details class="card legacy" id="pn-uLegacyBox" ${legacyOpen ? 'open' : ''} hidden>
        <summary><h2 class="sec-title">Acessos antigos</h2><span class="badge" id="pn-uLegacyN"></span></summary>
        <div class="stack legacy-body">
          <p class="muted">Essas pessoas ainda entram pelo acesso antigo. Convide-as para o novo acesso; depois de entrarem, remova daqui.</p>
          <div class="selbar" id="pn-selBar"><label class="check"><input type="checkbox" data-selall> Selecionar todas da lista</label><button class="btn ghost sm" id="pn-removeSel" type="button" disabled></button></div>
          <div id="pn-uLegacy"></div>
        </div>
      </details>`;
    let t = null;
    $('#pn-uq').addEventListener('input', (e) => { clearTimeout(t); const v = e.target.value; t = setTimeout(() => { userQ = v; renderUserRows(); }, 200); });
    $('#pn-inviteBtn').addEventListener('click', () => inviteDialog());
    $('#pn-removeSel').addEventListener('click', () => removePeople([...selected]));
    $('#pn-uLegacyBox').addEventListener('toggle', (e) => { legacyOpen = e.currentTarget.open; });
    box.onchange = (e) => {
      if (e.target.matches('[data-selall]')) { visibleUsers().forEach((u) => { if (e.target.checked) selected.add(u.uid); else selected.delete(u.uid); }); renderUserRows(); return; }
      const tr = e.target.closest('[data-row]');
      if (tr && e.target.dataset.k === 'sel') { if (e.target.checked) selected.add(tr.dataset.row); else selected.delete(tr.dataset.row); paintSelection(); }
    };
    box.onclick = (e) => {
      if (onSbClick(e)) return;
      const b = e.target.closest('[data-sb-act], [data-act]'); if (!b || b.disabled) return;
      const row = b.closest('[data-row]'); if (!row) return;
      if (b.dataset.sbAct) { const p = (people || []).find((x) => `sb:${x.id}` === row.dataset.row); if (p) personAction(p, b.dataset.sbAct, b); return; }
      const u = vault.users.find((x) => x.uid === row.dataset.row); if (!u) return;
      if (b.dataset.act === 'invite') inviteDialog({ name: u.name, email: u.email, company: u.company, role: u.role });
      else if (b.dataset.act === 'remove') removePeople([u.uid]);
    };
    renderUserRows();
  }
  function paintSelection() {
    const b = $('#pn-removeSel'); if (!b) return;
    b.disabled = !selected.size;
    b.innerHTML = `${ICO.warn}Remover selecionadas${selected.size ? ` (${selected.size})` : ''}`;
    $('#pn-selBar').classList.toggle('on', selected.size > 0);
  }
  const SELF_TIP = 'Você não pode bloquear nem remover a própria conta.';
  function personRowHtml(p) {
    const me = !!sb && p.id === sb.uid, name = p.nome || p.email, off = me ? ` disabled title="${SELF_TIP}"` : '';
    return `<li class="rw sb-grid" data-row="sb:${esc(p.id)}">
      <div class="u-who cell"><span class="avatar" aria-hidden="true">${esc(initials(name))}</span><div><b>${esc(name)}${me ? ' (você)' : ''}</b><span>${esc(p.email)}</span></div></div>
      <div class="u-comp"><span class="cell-l">Empresa:</span> ${esc(p.empresa || '—')}</div>
      <div class="u-role"><span class="chip-role">${esc(ROLE[p.papel] || p.papel || '—')}</span></div>
      <div class="u-status">${p.ativo ? '<span class="status on">Ativo</span>' : '<span class="status off">Bloqueado</span>'}</div>
      <div class="rw-acts"><button class="btn ghost sm" type="button" data-k="edit" data-sb-act="edit">Editar</button><button class="btn ghost sm" type="button" data-k="block" data-sb-act="${p.ativo ? 'block' : 'unblock'}"${off}>${p.ativo ? 'Bloquear' : 'Desbloquear'}</button><button class="btn ghost sm" type="button" data-k="resend" data-sb-act="resend">Reenviar acesso</button><button class="btn ghost sm" type="button" data-k="remove" data-sb-act="remove"${off}>Remover</button></div>
    </li>`;
  }
  // Atualiza aviso, cartão de conexão, blocos, contagem e as duas listas (o campo de busca não é recriado)
  function renderUserRows() {
    const wrap = $('#pn-uTable'); if (!wrap || !vault) return;
    const all = vault.users, list = visibleUsers(), ppl = people || [], shown = visiblePeople();
    const loaded = !!(sb && people), blocked = ppl.filter((p) => !p.ativo).length, q = userQ.trim();
    for (const uid of [...selected]) if (!all.some((u) => u.uid === uid)) selected.delete(uid);
    paintSbWarn();
    const slot = $('#pn-sbConnectSlot');
    if (slot.dataset.on !== String(!!sb)) { slot.dataset.on = String(!!sb); slot.hidden = !!sb; slot.innerHTML = sb ? '' : sbConnectCardHtml(); }
    $('#pn-uPeople').hidden = !sb;
    $('#pn-uCount').textContent = [
      loaded && (q ? `${plural(shown.length, 'pessoa encontrada', 'pessoas encontradas')} de ${ppl.length}` : plural(ppl.length, 'pessoa', 'pessoas')),
      all.length > 0 && (q ? `${plural(list.length, 'acesso antigo encontrado', 'acessos antigos encontrados')} de ${all.length}` : plural(all.length, 'acesso antigo', 'acessos antigos'))
    ].filter(Boolean).join(' · ');
    $('#pn-uTiles').innerHTML = tileHtml('Pessoas ativas', loaded ? ppl.length - blocked : '—', loaded ? plural(ppl.length, 'pessoa no novo acesso', 'pessoas no novo acesso') : sb ? 'carregando…' : 'entre com e-mail e senha', 'navy')
      + tileHtml('Bloqueadas', loaded ? blocked : '—', loaded ? 'sem acesso até desbloquear' : '')
      + tileHtml('Acessos antigos', all.length, all.length ? 'convide para o novo acesso' : 'ninguém no acesso antigo', 'sky');
    if (sb) keepFocus(() => {
      wrap.innerHTML = !people
        ? `<div class="empty">${peopleErr ? `${esc(peopleErr)}<div class="row"><button class="btn ghost sm" type="button" data-sb="reload">Tentar de novo</button></div>` : 'Carregando as pessoas…'}</div>`
        : shown.length ? `<div class="list-card">
          <div class="rows-head sb-grid" aria-hidden="true"><span>Pessoa</span><span>Empresa</span><span>Perfil</span><span>Situação</span></div>
          <ul class="rows" aria-label="Pessoas">${shown.map(personRowHtml).join('')}</ul></div>`
        : `<div class="empty">${ppl.length ? 'Ninguém encontrado com essa busca.' : 'Ninguém no novo acesso ainda. Clique em “+ Convidar pessoa”.'}</div>`;
    });
    // Acessos antigos: quem já tem perfil no Supabase com o mesmo e-mail não mostra "Convidar"
    const moved = new Set(ppl.map((p) => P.normEmail(p.email)));
    $('#pn-uLegacyBox').hidden = !all.length;
    $('#pn-uLegacyN').textContent = all.length.toLocaleString('pt-BR');
    const sa = $('[data-selall]', $('#pn-selBar'));
    sa.checked = list.length > 0 && list.every((u) => selected.has(u.uid)); sa.disabled = !list.length;
    keepFocus(() => {
      $('#pn-uLegacy').innerHTML = list.length ? `<div class="list-card">
        <div class="rows-head user-grid" aria-hidden="true"><span></span><span>Pessoa</span><span>Empresa</span><span>Perfil</span><span>Situação</span></div>
        <ul class="rows" aria-label="Acessos antigos">${list.map((u) => { const inNew = loaded && moved.has(P.normEmail(u.email)); return `<li class="rw user-grid" data-row="${esc(u.uid)}">
          <label class="u-sel sel-hit"><input type="checkbox" data-k="sel" ${selected.has(u.uid) ? 'checked' : ''} aria-label="Selecionar ${esc(u.name)}"></label>
          <div class="u-who cell"><span class="avatar" aria-hidden="true">${esc(initials(u.name))}</span><div><b>${esc(u.name)}</b><span>${esc(u.email)}</span></div></div>
          <div class="u-comp"><span class="cell-l">Empresa:</span> ${esc(u.company || '—')}</div>
          <div class="u-role"><span class="chip-role">${esc(ROLE[u.role] || u.role)}</span></div>
          <div class="u-status">${statusOf(u)}${inNew ? '<br><span class="muted">já tem o novo acesso</span>' : ''}</div>
          <div class="rw-acts">${inNew ? '' : '<button class="btn primary sm" type="button" data-k="invite" data-act="invite">Convidar para o novo acesso</button>'}<button class="btn ghost sm" type="button" data-k="remove" data-act="remove">Remover</button></div>
        </li>`; }).join('')}</ul></div>` : '<div class="empty">Ninguém encontrado com essa busca.</div>';
    });
    paintSelection();
    if (sb && !people && !peopleJob && !peopleErr) loadPeople().then(sbRepaint); // primeira vez nesta sessão
  }
  // Formulário de pessoa (convite e edição). noMail: sem o campo de e-mail (no Supabase o e-mail é o login e não muda aqui)
  const personFields = (u, noMail) => `
    <label class="field" id="pn-fName"><span class="field-label">Nome</span><input id="pn-nName" autocomplete="off" value="${esc(u.name || '')}"><em class="err" hidden></em></label>
    ${noMail ? '' : `<label class="field" id="pn-fMail"><span class="field-label">E-mail</span><input id="pn-nMail" type="email" autocomplete="off" value="${esc(u.email || '')}"><em class="err" hidden></em></label>`}
    <label class="field"><span class="field-label">Empresa</span><input id="pn-nComp" autocomplete="off" value="${esc(u.company || '')}"></label>
    <label class="field"><span class="field-label">Perfil</span><select id="pn-nRole">${Object.entries(ROLE).map(([k, l]) => `<option value="${k}" ${u.role === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
  // Lê o formulário de pessoa. taken(e-mail) diz se o e-mail já tem acesso; noMail: formulário sem e-mail
  function readPerson(taken, noMail) {
    const name = $('#pn-nName').value.trim(), email = noMail ? '' : P.normEmail($('#pn-nMail').value);
    const mailErr = noMail ? '' : !email ? 'Informe o e-mail.' : !emailOk(email) ? 'Confira o formato do e-mail.' : taken(email) ? 'Este e-mail já tem acesso. Use Reenviar acesso.' : '';
    setFieldErr($('#pn-fName'), name ? '' : 'Informe o nome.');
    if (!noMail) setFieldErr($('#pn-fMail'), mailErr);
    if (!name || mailErr) return null;
    return { name, email, company: $('#pn-nComp').value.trim(), role: $('#pn-nRole').value };
  }
  // Convidar: a função "pessoas" cria a conta e o perfil e envia o e-mail com o link para a pessoa criar a própria senha
  function inviteDialog(pre) {
    if (!sb) { sbConnectDialog((ok) => { if (ok) inviteDialog(pre); }); return; }
    openDialog({
      title: 'Convidar pessoa',
      body: `<p class="muted">A pessoa recebe um e-mail com o link para criar a própria senha e entrar na Prateleira. Ninguém mais conhece a senha.</p>${personFields({ role: 'cliente', ...(pre || {}) })}`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Enviar convite', kind: 'primary',
        onClick: async () => {
          const f = readPerson((mail) => (people || []).some((p) => P.normEmail(p.email) === mail)); if (!f) return false;
          try { await sbCall((t) => P.supa.fn(t, 'pessoas', { acao: 'convidar', email: f.email, nome: f.name, empresa: f.company, papel: f.role })); }
          catch (e) { console.error(e); dlgErr(sbFnErr(e, 'convidar')); return false; }
          toast(`Convite enviado para ${f.email}. A pessoa cria a própria senha pelo link do e-mail.`);
          loadPeople().then(sbRepaint);
          return true;
        }
      }]
    });
  }
  function editPersonDialog(p) {
    openDialog({
      title: 'Editar pessoa',
      body: `<p class="muted">${esc(p.email)} · o e-mail é o login da pessoa e não muda aqui.</p>${personFields({ name: p.nome, company: p.empresa, role: p.papel }, true)}`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Salvar', kind: 'primary',
        onClick: async () => {
          const f = readPerson(null, true); if (!f) return false;
          if (sb && p.id === sb.uid && f.role !== 'admin') { dlgErr('Você não pode tirar o perfil de administrador da própria conta.'); return false; }
          let rows;
          try { rows = await sbCall((t) => P.supa.update(t, 'perfis', `id=eq.${encodeURIComponent(p.id)}`, { nome: f.name, empresa: f.company, papel: f.role })); }
          catch (e) { console.error(e); dlgErr(sbErrText(e)); return false; }
          if (!Array.isArray(rows) || !rows.length) { dlgErr('Nada foi salvo: a pessoa não foi encontrada ou esta conta não pode alterar perfis.'); return false; }
          toast('Pessoa atualizada.');
          loadPeople().then(sbRepaint);
          return true;
        }
      }]
    });
  }
  // Caixa "Trocar também as chaves dos catálogos" nas confirmações de bloquear e remover (lida em $('#pn-sbRot', cf) depois de confirmar)
  function rotationCheckHtml() {
    const legacy = rotationTargets(vault, false), n = rotationFileCount(legacy);
    return `<label class="check"><input type="checkbox" id="pn-sbRot" checked> Trocar também as chaves dos catálogos (recomendado)</label>
      <p>O que a pessoa já viu não pode ser desfeito; com a chave nova, as próximas versões ficam protegidas${n ? `. O painel também troca a chave de ${plural(legacy.length, 'catálogo antigo', 'catálogos antigos')} (${estimate(n)}): não feche a janela durante o envio` : ''}.</p>`;
  }
  // Troca da chave-raiz pelo mesmo caminho de removePeople (rotateKeys num único envio); publish() leva a chave nova ao Supabase no fim
  async function rotateRoot() {
    const n = rotationFileCount(rotationTargets(vault, false));
    const ok = await publish('Trocando as chaves dos catálogos', (d, pg) => rotateKeys(d, pg, false), { cancel: n > 0 });
    if (ok) toast('Chaves dos catálogos trocadas.');
    return ok;
  }
  function personAction(p, act, btn) {
    if (act === 'edit') editPersonDialog(p);
    else if (act === 'block' || act === 'unblock') setBlocked(p, act === 'block');
    else if (act === 'resend') resendAccess(p, btn);
    else if (act === 'remove') removeSbPerson(p);
  }
  async function setBlocked(p, block) {
    if (sb && p.id === sb.uid) return;
    const name = p.nome || p.email;
    let rotate = false;
    if (block) {
      if (!(await confirmBox(`Bloquear ${name}?`, `<p>${esc(name)} deixa de entrar na Prateleira. A conta continua cadastrada e pode ser desbloqueada depois.</p>${rotationCheckHtml()}`, 'Bloquear', true))) return;
      rotate = $('#pn-sbRot', cf).checked;
    }
    try {
      const rows = await sbCall((t) => P.supa.update(t, 'perfis', `id=eq.${encodeURIComponent(p.id)}`, { ativo: !block }));
      if (!Array.isArray(rows) || !rows.length) throw userErr('A pessoa não foi encontrada ou esta conta não pode alterar perfis.');
    } catch (e) { console.error(e); alertBox(block ? 'Não foi possível bloquear' : 'Não foi possível desbloquear', sbErrText(e)); return; }
    toast(block ? `Acesso de ${name} bloqueado.` : `Acesso de ${name} desbloqueado.`);
    await loadPeople(); sbRepaint();
    if (rotate) await rotateRoot();
  }
  async function resendAccess(p, btn) {
    btn.disabled = true;
    try { await sbCall((t) => P.supa.fn(t, 'pessoas', { acao: 'reenviar', email: p.email })); toast(`E-mail enviado para ${p.email}`); }
    catch (e) { console.error(e); alertBox('Não foi possível reenviar o acesso', sbFnErr(e, 'reenviar')); }
    finally { btn.disabled = false; }
  }
  async function removeSbPerson(p) {
    if (sb && p.id === sb.uid) return;
    const name = p.nome || p.email;
    if (!(await confirmBox(`Remover ${name}?`, `<p>A conta de ${esc(name)} é apagada do Supabase e a pessoa deixa de entrar. Para voltar, será preciso convidar de novo.</p>${rotationCheckHtml()}`, 'Remover', true))) return;
    const rotate = $('#pn-sbRot', cf).checked;
    try { await sbCall((t) => P.supa.fn(t, 'pessoas', { acao: 'remover', id: p.id })); }
    catch (e) { console.error(e); alertBox('Não foi possível remover', sbFnErr(e, 'remover')); return; }
    toast('Pessoa removida do novo acesso.');
    await loadPeople(); sbRepaint();
    if (rotate) await rotateRoot();
  }
  // Remover uma ou várias pessoas do acesso antigo: uma única troca da chave-raiz e um único envio
  async function removePeople(uids) {
    const list = vault.users.filter((u) => uids.includes(u.uid)); if (!list.length) return;
    const anyActive = list.some(isActive);
    if (anyActive && !(await sbRotationGate((ok) => { if (ok) removePeople(uids); }))) return;
    const legacy = rotationTargets(vault, false), n = rotationFileCount(legacy);
    const who = list.length === 1 ? list[0].name : plural(list.length, 'pessoa', 'pessoas');
    const text = anyActive
      ? `<p>O acesso é bloqueado na hora. O que a pessoa já viu não pode ser desfeito; versões novas dos catálogos ficam protegidas.</p>${n ? `<p>O painel também troca a chave de ${plural(legacy.length, 'catálogo antigo', 'catálogos antigos')} (${estimate(n)}). Não feche a janela durante o envio.</p>` : ''}`
      : '<p>O código provisório deixa de valer.</p>';
    if (!(await confirmBox(`Remover o acesso de ${who}?`, text, list.length === 1 ? 'Remover acesso' : 'Remover acessos', true))) return;
    const ok = await publish(anyActive ? 'Removendo o acesso e trocando a chave' : 'Removendo', async (d, pg) => {
      const gone = d.users.filter((x) => uids.includes(x.uid));
      d.users = d.users.filter((x) => !uids.includes(x.uid));
      if (!gone.some(isActive)) return {};
      return rotateKeys(d, pg, false);
    }, { cancel: anyActive && n > 0 });
    if (ok) { uids.forEach((x) => selected.delete(x)); toast(list.length === 1 ? 'Acesso removido.' : 'Acessos removidos.'); }
    renderUserRows();
  }

  /* ================= produtos e áreas de produto ================= */
  let prodQ = '';
  const ed = { cat: '', page: 1, sel: '', draft: null, drag: null, seq: 0 }; // estado do editor de áreas (sobrevive ao redesenho da aba)
  const MIN_BOX = 2; // tamanho mínimo de uma área (% da página)
  function resetEditor() { ed.sel = ''; ed.draft = null; ed.drag = null; ed.seq++; }
  const focusStage = () => { const st = $('#pn-hsStage'); if (st) st.focus(); };
  const prodName = (sku) => { const p = (vault.products || {})[sku]; return p ? p.name : `${sku} (produto removido)`; };
  const prodList = (q) => { q = norm(q); return Object.values(vault.products || {}).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).filter((p) => !q || norm(`${p.sku} ${p.name} ${p.category}`).includes(q)); };
  const skuTaken = (d, sku, except) => Object.values(d.products || {}).find((x) => x.sku !== except && P.skuKey(x.sku) === P.skuKey(sku));
  const httpsOk = (v) => { try { return new URL(v).protocol === 'https:'; } catch (e) { return false; } };
  const pct = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  // Posição da área pelo CSSOM (sem atributo style="" na marcação: funciona com CSP de estilo restrito)
  const placeBox = (el, b) => { if (el) Object.assign(el.style, { left: b.x + '%', top: b.y + '%', width: b.width + '%', height: b.height + '%' }); };
  // Arredonda (2 casas), garante o tamanho mínimo e mantém a área dentro da página
  function fixBox(b) {
    const w = round2(clamp(b.width, MIN_BOX, 100)), h = round2(clamp(b.height, MIN_BOX, 100));
    return { x: round2(clamp(b.x, 0, 100 - w)), y: round2(clamp(b.y, 0, 100 - h)), width: w, height: h };
  }
  function renderProds() {
    const box = $('#pn-tabProds'); if (!vault) return;
    const review = viewCatalogs().filter((c) => c.reviewHotspots);
    box.innerHTML = `${pageHead('prods', '<button class="btn primary" id="pn-addProd" type="button">+ Adicionar produto</button>')}
      ${review.length ? `<div class="alert warn" id="pn-hsReview" role="status"><span class="badge">Conferir</span> Uma nova versão mudou o número de páginas. Confira as áreas de produto ${review.length === 1 ? 'deste catálogo' : 'destes catálogos'}:
        <div class="row">${review.map((c) => `<button class="btn ghost sm" type="button" data-review="${esc(c.id)}">${esc(c.title)}</button>`).join('')}</div></div>` : ''}
      <div class="tiles" id="pn-pTiles"></div>
      <div class="toolbar">
        <div class="search"><span class="ico">${ICO.search}</span><input class="input" id="pn-pq" type="search" placeholder="Buscar SKU, nome ou categoria" value="${esc(prodQ)}" aria-label="Buscar produtos" aria-describedby="pn-pCount"></div>
        <p class="count"><span id="pn-pCount" aria-live="polite"></span></p>
      </div>
      <div id="pn-pTable"></div>
      <div class="card stack hs-card" id="pn-hsEd"></div>`;
    let t = null;
    $('#pn-pq').addEventListener('input', (e) => { clearTimeout(t); const v = e.target.value; t = setTimeout(() => { prodQ = v; renderProdRows(); }, 200); });
    $('#pn-addProd').addEventListener('click', () => productDialog(null));
    $('#pn-pTable').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const p = (vault.products || {})[b.closest('[data-row]').dataset.row]; if (!p) return;
      if (b.dataset.act === 'edit') productDialog(p); else removeProduct(p);
    });
    const rv = $('#pn-hsReview');
    if (rv) rv.addEventListener('click', (e) => { const b = e.target.closest('[data-review]'); if (b) openCatalog(b.dataset.review); });
    renderProdRows(); renderEditor();
  }
  // Atualiza só a tabela e a contagem (o campo de busca não é recriado)
  function renderProdRows() {
    const wrap = $('#pn-pTable'); if (!wrap || !vault) return;
    const all = Object.keys(vault.products || {}).length, list = prodList(prodQ);
    const spots = viewSpots(), cats = viewCatalogs();
    const count = new Map(); for (const h of spots) count.set(h.product, (count.get(h.product) || 0) + 1);
    $('#pn-pCount').textContent = prodQ.trim() ? `${plural(list.length, 'produto encontrado', 'produtos encontrados')} de ${all}` : plural(all, 'produto', 'produtos');
    // Blocos de resumo: áreas contadas como vão ficar depois de publicar (publicadas + preparadas)
    const withSpots = new Set(spots.filter((h) => cats.some((c) => c.id === h.catalogId)).map((h) => h.catalogId)).size;
    const review = cats.filter((c) => c.reviewHotspots).length;
    $('#pn-pTiles').innerHTML = tileHtml('Produtos', all, 'cadastrados') + tileHtml('Áreas marcadas', spots.length, 'nas páginas dos catálogos')
      + tileHtml('Catálogos com áreas', withSpots, `de ${plural(cats.length, 'catálogo', 'catálogos')}`)
      + tileHtml('<span class="badge">Conferir</span>', review, review ? 'catálogos com o número de páginas alterado' : 'nada para conferir', review ? 'navy' : '');
    keepFocus(() => {
      wrap.innerHTML = list.length ? `<div class="list-card">
        <div class="rows-head prod-grid" aria-hidden="true"><span>SKU</span><span>Produto</span><span>Categoria</span><span>Áreas marcadas</span><span></span></div>
        <ul class="rows" aria-label="Produtos">${list.map((p) => `<li class="rw prod-grid" data-row="${esc(p.sku)}">
          <div class="p-sku"><code>${esc(p.sku)}</code></div>
          <div class="p-name"><p class="rw-title">${esc(p.name)}</p>${viewImage(p.sku) ? '<p class="rw-meta">com imagem</p>' : ''}</div>
          <div class="p-cat"><span class="cell-l">Categoria:</span> ${esc(p.category || '—')}</div>
          <div class="p-areas">${plural(count.get(p.sku) || 0, 'área', 'áreas')}</div>
          <div class="rw-acts"><button class="btn ghost sm" type="button" data-k="edit" data-act="edit" aria-label="Editar ${esc(p.name)}">Editar</button><button class="btn ghost sm" type="button" data-k="remove" data-act="remove" aria-label="Remover ${esc(p.name)}">Remover</button></div>
        </li>`).join('')}</ul></div>` : `<div class="empty">${all ? 'Nenhum produto encontrado com essa busca.' : 'Nenhum produto cadastrado ainda. Adicione o primeiro produto.'}</div>`;
    });
  }
  const productFields = (p) => `
    <div class="grid2">
      <label class="field" id="pn-fSku"><span class="field-label">SKU</span><input id="pn-pSku" autocomplete="off" spellcheck="false" maxlength="40" value="${esc(p.sku || '')}" placeholder="D60"><em class="err" hidden></em></label>
      <label class="field"><span class="field-label">Categoria</span><input id="pn-pCat" autocomplete="off" maxlength="60" value="${esc(p.category || '')}" placeholder="Cadeira de banho"></label>
    </div>
    <label class="field" id="pn-fPName"><span class="field-label">Nome</span><input id="pn-pName" autocomplete="off" maxlength="120" value="${esc(p.name || '')}"><em class="err" hidden></em></label>
    <div class="grid2">
      <label class="field"><span class="field-label">Principal benefício</span><input id="pn-pBen" autocomplete="off" maxlength="120" value="${esc(p.benefit || '')}"></label>
      <label class="field"><span class="field-label">Capacidade</span><input id="pn-pCap" autocomplete="off" maxlength="60" value="${esc(p.capacity || '')}" placeholder="Até 150 kg"></label>
    </div>
    <label class="field" id="pn-fPDesc"><span class="field-label">Descrição curta (até 240 caracteres)</span><textarea id="pn-pDesc" rows="3" maxlength="240">${esc(p.description || '')}</textarea><em class="err" hidden></em></label>
    <label class="field" id="pn-fPUrl"><span class="field-label">URL do produto (opcional)</span><input id="pn-pUrl" type="url" inputmode="url" autocomplete="off" spellcheck="false" value="${esc(p.url || '')}" placeholder="https://www.dellamed.com.br/…"><em class="err" hidden></em></label>`;
  function readProduct(except) {
    const f = { sku: $('#pn-pSku').value.trim().replace(/\s+/g, ' '), name: $('#pn-pName').value.trim(), category: $('#pn-pCat').value.trim(), benefit: $('#pn-pBen').value.trim(),
      capacity: $('#pn-pCap').value.trim(), description: $('#pn-pDesc').value.trim(), url: $('#pn-pUrl').value.trim() };
    const dup = !!P.skuKey(f.sku) && skuTaken(vault, f.sku, except);
    const eSku = !f.sku ? 'Informe o SKU.' : !P.skuKey(f.sku) ? 'O SKU precisa ter letras ou números.' : dup ? `Este SKU já está cadastrado (${dup.name}).` : '';
    const eDesc = f.description.length > 240 ? `Use até 240 caracteres (agora são ${f.description.length}).` : '';
    const eUrl = f.url && !httpsOk(f.url) ? 'Use o endereço completo, começando com https://' : '';
    setFieldErr($('#pn-fSku'), eSku); setFieldErr($('#pn-fPName'), f.name ? '' : 'Informe o nome.'); setFieldErr($('#pn-fPDesc'), eDesc); setFieldErr($('#pn-fPUrl'), eUrl);
    if (eSku || !f.name || eDesc || eUrl) return null;
    if (f.url) f.url = new URL(f.url).href;
    return f;
  }
  // Adicionar ou editar produto (publica na hora). Trocar o SKU leva junto as áreas marcadas. onSaved(sku) roda depois de publicar.
  function productDialog(p, onSaved) {
    const old = p ? p.sku : '';
    openDialog({
      title: p ? 'Editar produto' : 'Adicionar produto',
      body: `${productFields(p || {})}${p ? '<p class="muted">Se trocar o SKU, as áreas marcadas continuam ligadas a este produto.</p>' : ''}`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Salvar e publicar', kind: 'primary',
        onClick: async () => {
          const f = readProduct(old); if (!f) return false;
          const ok = await publish('Salvando o produto', (d) => {
            withProd(d);
            const cur = old ? d.products[old] : null;
            if (old && !cur) throw userErr('Este produto foi removido por outro administrador.');
            if (skuTaken(d, f.sku, old)) throw userErr('Este SKU já está cadastrado (outro administrador acabou de cadastrá-lo).');
            if (old) delete d.products[old];
            d.products[f.sku] = { ...(cur || {}), ...f };
            if (old && old !== f.sku) for (const h of d.hotspots) if (h.product === old) h.product = f.sku;
            d.products = sortKeys(d.products);
          }, { onDone: () => { if (old && old !== f.sku) renameStaged(old, f.sku); } });
          if (!ok) return false;
          toast('Produto publicado.');
          renderProdRows(); paintSpots();
          if (onSaved) onSaved(f.sku);
          return true;
        }
      }]
    });
  }
  // SKU trocado: as operações preparadas passam a apontar para o SKU novo
  function renameStaged(old, sku) {
    for (const h of stagedSpots.values()) if (h && h.product === old) h.product = sku;
    if (stagedImages.has(old)) { stagedImages.set(sku, stagedImages.get(old)); stagedImages.delete(old); }
  }
  async function removeProduct(p) {
    const n = viewSpots().filter((h) => h.product === p.sku).length;
    const areas = n ? ` ${plural(n, 'área marcada', 'áreas marcadas')} nas páginas dos catálogos também ${n === 1 ? 'sai' : 'saem'}.` : '';
    if (!(await confirmBox(`Remover “${p.name}”?`, `<p>O produto sai da busca do site.${areas}</p><p>Esta ação não pode ser desfeita.</p>`, 'Remover produto', true))) return;
    const ok = await publish('Removendo o produto', (d) => {
      withProd(d);
      delete d.products[p.sku];
      d.hotspots = d.hotspots.filter((h) => h.product !== p.sku);
    }, { onDone: () => dropStaged((r) => r.product === p.sku) });
    if (ok) toast('Produto removido.');
    renderProdRows(); paintSpots();
  }
  // Escolher o produto de uma área: busca na lista e atalho para criar um produto novo. onCancel roda se o diálogo fechar sem escolha.
  function pickProduct(title, onPick, onCancel) {
    let picked = false;
    openDialog({
      title,
      body: `<input class="input" id="pn-ppq" type="search" placeholder="Buscar SKU, nome ou categoria" aria-label="Buscar produto" aria-describedby="pn-ppCount">
        <p class="muted" id="pn-ppCount" aria-live="polite"></p>
        <div class="pp-list" id="pn-ppList"></div>
        <button class="link" type="button" id="pn-ppNew">+ Criar produto novo</button>`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }]
    });
    dlg.addEventListener('close', () => { if (!picked && onCancel) onCancel(); }, { once: true });
    const draw = () => {
      const q = $('#pn-ppq').value, list = prodList(q), total = Object.keys(vault.products || {}).length;
      $('#pn-ppCount').textContent = q.trim() ? plural(list.length, 'produto encontrado', 'produtos encontrados') : plural(total, 'produto', 'produtos');
      $('#pn-ppList').innerHTML = list.slice(0, 80).map((p) => `<button type="button" class="pp-item" data-sku="${esc(p.sku)}"><b>${esc(p.name)}</b><span>${esc(p.sku)}${p.category ? ` · ${esc(p.category)}` : ''}</span></button>`).join('')
        || `<p class="muted">${total ? 'Nenhum produto encontrado. Crie um produto novo abaixo.' : 'Nenhum produto cadastrado ainda. Crie o primeiro abaixo.'}</p>`;
    };
    $('#pn-ppq').addEventListener('input', draw);
    $('#pn-ppList').addEventListener('click', (e) => { const b = e.target.closest('[data-sku]'); if (!b) return; picked = true; closeDialog(); onPick(b.dataset.sku); });
    $('#pn-ppNew').addEventListener('click', () => productDialog(null, (sku) => { picked = true; onPick(sku); }));
    draw();
  }

  /* ---------- editor de áreas (desenhar, mover e redimensionar sobre a página) ---------- */
  // Catálogo e página do editor (catálogos ocultos também aparecem; se o catálogo sumiu, volta para o primeiro)
  function edCat() {
    const list = viewCatalogs();
    const c = list.find((x) => x.id === ed.cat) || list[0] || null;
    if (c && c.id !== ed.cat) { ed.cat = c.id; ed.page = 1; ed.sel = ''; ed.draft = null; }
    if (c) ed.page = clamp(ed.page, 1, c.pages || 1);
    return c;
  }
  const pageSpots = () => viewSpots().filter((h) => h.catalogId === ed.cat && h.page === ed.page);
  const spotById = (id) => viewSpots().find((h) => h.id === id);
  const isImage = (h) => { const im = viewImage(h.product); return !!im && sameBox(im, h); };
  function openCatalog(id) {
    ed.cat = id; ed.page = 1; ed.sel = ''; ed.draft = null;
    const real = vault.catalogs.find((x) => x.id === id);
    if (real && real.reviewHotspots) delete real.reviewHotspots; // marca só do cofre: sai de vez na próxima publicação
    renderProds();
    const s = $('#pn-hsCat'); if (s) s.focus();
  }
  function renderEditor() {
    const box = $('#pn-hsEd'); if (!box || !vault) return;
    const c = edCat();
    const head = `<h2>Áreas de produto nas páginas</h2>
      <p class="muted">Escolha o catálogo e a página e arraste sobre a foto do produto para marcar a área. As áreas entram na barra de alterações e vão para o site quando você publicar.</p>
      <p class="alert warn hs-mobile">Use um computador para marcar as áreas.</p>`;
    if (!c) { box.innerHTML = `${head}<div class="empty">Adicione um catálogo para marcar as áreas dos produtos.</div>`; return; }
    box.innerHTML = `${head}
      <div class="hs-desk stack">
        <div class="hs-tools">
          <label class="field"><span class="field-label">Catálogo</span><select id="pn-hsCat">${viewCatalogs().map((x) => `<option value="${esc(x.id)}" ${x.id === c.id ? 'selected' : ''}>${esc(x.title)}${x.visible === false ? ' (oculto)' : ''}${x.reviewHotspots ? ' · conferir áreas' : ''}</option>`).join('')}</select></label>
          <div class="hs-nav" role="group" aria-label="Página">
            <button class="mini" type="button" id="pn-hsPrev" aria-label="Página anterior">${ICO.left}</button>
            <label class="hs-pg">Página <input class="input" id="pn-hsPage" type="number" min="1" max="${c.pages}" value="${ed.page}"> de ${c.pages}</label>
            <button class="mini" type="button" id="pn-hsNext" aria-label="Próxima página">${ICO.right}</button>
          </div>
          <button class="btn ghost sm" type="button" id="pn-hsAdd">Adicionar área</button>
        </div>
        ${c.th ? '<div class="hs-thumbs" id="pn-hsThumbs" role="group" aria-label="Miniaturas das páginas"></div>' : ''}
        <div class="hs-grid">
          <div class="hs-stage" id="pn-hsStage" tabindex="0" role="group" aria-describedby="pn-hsHelp">
            <img id="pn-hsImg" draggable="false" alt="" hidden><div class="hs-rects" id="pn-hsRects"></div><p class="hs-msg" id="pn-hsMsg">Carregando a página…</p>
          </div>
          <div class="hs-side">
            <div class="hs-head"><p class="label-caps">Nesta página</p><h3>Áreas desta página</h3><p class="muted" id="pn-hsStatus" aria-live="polite"></p></div>
            <ul class="hs-list" id="pn-hsList"></ul>
            <p class="muted hs-help" id="pn-hsHelp">Com uma área selecionada: as setas movem, Shift + setas mudam o tamanho, Delete remove e Esc tira a seleção. Sem mouse, use “Adicionar área”.</p>
          </div>
        </div>
      </div>`;
    const img = $('#pn-hsImg'), strip = $('#pn-hsThumbs');
    $('#pn-hsCat').addEventListener('change', (e) => openCatalog(e.target.value));
    $('#pn-hsPrev').addEventListener('click', () => goPage(ed.page - 1));
    $('#pn-hsNext').addEventListener('click', () => goPage(ed.page + 1));
    $('#pn-hsPage').addEventListener('change', (e) => goPage(e.target.value));
    $('#pn-hsAdd').addEventListener('click', () => { ed.sel = ''; ed.draft = { x: 40, y: 40, width: 20, height: 20 }; paintSpots(); askDraftProduct(); });
    if (strip) strip.addEventListener('click', (e) => { const b = e.target.closest('[data-page]'); if (b) goPage(b.dataset.page); });
    img.addEventListener('load', () => { setStageSize(img.naturalWidth / img.naturalHeight); img.hidden = false; $('#pn-hsMsg').hidden = true; });
    img.addEventListener('error', () => { $('#pn-hsMsg').textContent = 'Não foi possível mostrar esta página. Clique em “Atualizar dados” e tente de novo.'; });
    $('#pn-hsList').addEventListener('click', onSpotList);
    bindStage($('#pn-hsStage'));
    goPage(ed.page);
  }
  function goPage(n) {
    const c = edCat(), stage = $('#pn-hsStage'); if (!c || !stage) return;
    const page = clamp(Math.round(+n) || 1, 1, c.pages || 1);
    if (page !== ed.page) { ed.sel = ''; ed.draft = null; }
    ed.page = page;
    $('#pn-hsPage').value = page; $('#pn-hsPrev').disabled = page <= 1; $('#pn-hsNext').disabled = page >= c.pages;
    stage.setAttribute('aria-label', `Página ${page} de ${c.title}. Arraste sobre a página para marcar a área de um produto.`);
    loadPage(c); paintThumbs(c); paintSpots();
  }
  // O palco tem a proporção da página: as áreas (em %) ficam no mesmo lugar em qualquer tamanho de tela
  function setStageSize(r) {
    const st = $('#pn-hsStage'); if (!st || !(r > 0)) return;
    st.style.aspectRatio = String(r);
    st.style.width = `min(100%, calc(72vh * ${r.toFixed(4)}))`;
  }
  // Página decifrada (do cache pequeno); depois de cada espera confere se o painel continua aberto e se a página é a mesma
  async function loadPage(c) {
    const img = $('#pn-hsImg'), msg = $('#pn-hsMsg'), seq = ++ed.seq;
    img.hidden = true; msg.hidden = false; msg.textContent = 'Carregando a página…';
    img.alt = `Página ${ed.page} de ${c.title}`;
    setStageSize(c.ratio || 0.707);
    try {
      const u = await pageUrl(c, ed.page);
      if (!vault || seq !== ed.seq || !img.isConnected) return;
      if (!u) throw new Error('página não encontrada');
      if (img.getAttribute('src') === u && img.complete && img.naturalWidth) { img.hidden = false; msg.hidden = true; } else img.src = u; // mesma imagem: o load não se repete
    } catch (e) {
      console.error(e);
      if (seq === ed.seq && msg.isConnected) msg.textContent = 'Não foi possível carregar esta página. Clique em “Atualizar dados” e tente de novo.';
    }
  }
  // Miniaturas do grupo de 20 páginas da página atual (só quando o catálogo tem miniaturas)
  async function paintThumbs(c) {
    const strip = $('#pn-hsThumbs'); if (!strip) return;
    const g = Math.floor((ed.page - 1) / P.THUMB_CHUNK), key = `${c.id}:${g}`;
    if (strip.dataset.g === key) { markThumbs(); centerThumb(strip); return; }
    strip.dataset.g = key;
    const first = g * P.THUMB_CHUNK + 1, last = Math.min(c.pages, first + P.THUMB_CHUNK - 1);
    strip.innerHTML = Array.from({ length: last - first + 1 }, (_, i) => `<button type="button" class="hs-th" data-page="${first + i}"><img alt="" draggable="false"><span aria-hidden="true">${first + i}</span></button>`).join('');
    $$('img', strip).forEach((im) => { im.style.aspectRatio = String(c.ratio || 0.707); });
    markThumbs(); centerThumb(strip);
    try {
      const urls = await thumbUrls(c, g);
      if (!vault || strip.dataset.g !== key || !strip.isConnected) return;
      $$('img', strip).forEach((im, i) => { if (urls[i]) im.src = urls[i]; });
    } catch (e) { console.error(e); } // sem miniaturas: os números continuam funcionando
  }
  // Página atual e páginas com áreas na tira de miniaturas
  function markThumbs() {
    const strip = $('#pn-hsThumbs'); if (!strip || !vault) return;
    const has = new Set(viewSpots().filter((h) => h.catalogId === ed.cat).map((h) => h.page));
    $$('.hs-th', strip).forEach((b) => {
      const n = +b.dataset.page;
      b.classList.toggle('has', has.has(n));
      b.setAttribute('aria-label', `Página ${n}${has.has(n) ? ' (com áreas marcadas)' : ''}`);
      if (n === ed.page) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }
  // Rola só a tira (nunca a página) até a miniatura da página atual
  function centerThumb(strip) {
    const cur = $('[aria-current="page"]', strip); if (!cur) return;
    const r = cur.getBoundingClientRect(), s = strip.getBoundingClientRect();
    strip.scrollLeft += r.left - s.left - (s.width - r.width) / 2;
  }
  // Retângulos no palco e a lista acessível ao lado (sem recarregar a imagem)
  function paintSpots() {
    const rects = $('#pn-hsRects'), list = $('#pn-hsList'); if (!rects || !list || !vault) return;
    const spots = pageSpots();
    if (ed.sel && !spots.some((h) => h.id === ed.sel)) ed.sel = '';
    rects.innerHTML = spots.map((h) => {
      const sel = h.id === ed.sel, label = prodName(h.product) + (isImage(h) ? ' · imagem' : '');
      return `<div class="hs-rect${sel ? ' sel' : ''}${stagedSpots.has(h.id) ? ' changed' : ''}" data-id="${esc(h.id)}"><span class="hs-tag">${esc(label)}</span>${sel ? ['nw', 'ne', 'sw', 'se'].map((k) => `<i class="hs-h ${k}" data-h="${k}"></i>`).join('') : ''}</div>`;
    }).join('') + (ed.draft ? '<div class="hs-rect is-new sel"></div>' : '');
    $$('.hs-rect[data-id]', rects).forEach((el, i) => placeBox(el, spots[i]));
    if (ed.draft) placeBox($('.hs-rect.is-new', rects), ed.draft);
    keepFocus(() => {
      list.innerHTML = spots.length ? spots.map((h) => `<li class="${h.id === ed.sel ? 'sel' : ''}" data-row="${esc(h.id)}">
        <button type="button" class="hs-pick" data-k="sel" data-sa="sel" aria-pressed="${h.id === ed.sel}"><b>${esc(prodName(h.product))}</b><span>${esc(h.product)}${isImage(h) ? ' · imagem do produto' : ''}${stagedSpots.has(h.id) ? ' · não publicada' : ''}</span></button>
        <div class="actions"><button class="btn ghost sm" type="button" data-k="del" data-sa="del" aria-label="Remover a área de ${esc(prodName(h.product))}">Remover área</button></div>
        <details class="hs-menu"><summary>Mais opções</summary><div class="actions">
          <button class="btn ghost sm" type="button" data-k="prod" data-sa="prod">Trocar produto</button>
          <button class="btn ghost sm" type="button" data-k="img" data-sa="img" ${isImage(h) ? 'disabled' : ''}>Usar esta área como imagem do produto</button>
        </div></details>
      </li>`).join('') : '<li class="muted">Nenhuma área nesta página. Arraste sobre a página para marcar a primeira.</li>';
    });
    const s = ed.sel && spots.find((h) => h.id === ed.sel);
    $('#pn-hsStatus').textContent = s ? `Selecionada: ${prodName(s.product)} · posição ${pct(s.x)}% × ${pct(s.y)}% · tamanho ${pct(s.width)}% × ${pct(s.height)}%` : plural(spots.length, 'área nesta página', 'áreas nesta página');
    markThumbs();
  }
  // Nova caixa durante o arraste: desenhar, mover ou puxar um canto (o canto oposto fica parado)
  function dragBox(g, p) {
    const o = g.orig;
    if (g.mode === 'draw') return { x: Math.min(g.start.x, p.x), y: Math.min(g.start.y, p.y), width: Math.abs(p.x - g.start.x), height: Math.abs(p.y - g.start.y) };
    if (g.mode === 'move') return { x: clamp(o.x + p.x - g.start.x, 0, 100 - o.width), y: clamp(o.y + p.y - g.start.y, 0, 100 - o.height), width: o.width, height: o.height };
    const ax = g.mode.includes('w') ? o.x + o.width : o.x, ay = g.mode.includes('n') ? o.y + o.height : o.y;
    return { x: Math.min(ax, p.x), y: Math.min(ay, p.y), width: Math.abs(p.x - ax), height: Math.abs(p.y - ay) };
  }
  // Mouse, caneta ou toque: a posição vira % da imagem (0 a 100)
  function bindStage(stage) {
    const img = $('#pn-hsImg', stage);
    const at = (e) => { const b = img.getBoundingClientRect(); return { x: clamp((e.clientX - b.left) / b.width * 100, 0, 100), y: clamp((e.clientY - b.top) / b.height * 100, 0, 100) }; };
    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || img.hidden) return;
      const p = at(e), el = e.target.closest('.hs-rect[data-id]'), h = el && spotById(el.dataset.id), handle = e.target.closest('[data-h]');
      if (h) { ed.sel = h.id; ed.drag = { mode: handle ? handle.dataset.h : 'move', start: p, orig: h, box: boxOf(h) }; }
      else { ed.sel = ''; ed.draft = { x: p.x, y: p.y, width: 0, height: 0 }; ed.drag = { mode: 'draw', start: p, box: ed.draft }; }
      e.preventDefault();
      stage.setPointerCapture(e.pointerId);
      stage.focus({ preventScroll: true });
      paintSpots();
    });
    stage.addEventListener('pointermove', (e) => {
      const g = ed.drag; if (!g) return;
      const p = at(e);
      if (!g.moved && Math.abs(p.x - g.start.x) + Math.abs(p.y - g.start.y) < 0.4) return; // a tremida do clique não move a área
      g.moved = true; g.box = dragBox(g, p);
      if (g.mode === 'draw') ed.draft = g.box;
      const el = g.mode === 'draw' ? $('.hs-rect.is-new', stage) : $(`.hs-rect[data-id="${CSS.escape(g.orig.id)}"]`, stage);
      if (el) Object.assign(el.style, { left: g.box.x + '%', top: g.box.y + '%', width: g.box.width + '%', height: g.box.height + '%' });
    });
    const end = (e) => {
      const g = ed.drag; if (!g) return;
      ed.drag = null;
      if (g.mode === 'draw') {
        const big = e.type === 'pointerup' && g.box.width >= MIN_BOX && g.box.height >= MIN_BOX;
        ed.draft = big ? fixBox(g.box) : null; // um clique (ou área pequena demais) só tira a seleção
        paintSpots();
        if (big) askDraftProduct();
      } else if (g.moved && e.type === 'pointerup') saveSpot({ ...g.orig, ...fixBox(g.box) });
      else paintSpots();
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    stage.addEventListener('keydown', onStageKey);
  }
  // Teclado: setas movem 0,5%, Shift + setas mudam o tamanho, Delete remove, Esc tira a seleção
  function onStageKey(e) {
    const h = ed.sel && spotById(ed.sel); if (!h) return;
    if (e.key === 'Escape') { ed.sel = ''; paintSpots(); return; }
    const d = { ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, -0.5], ArrowDown: [0, 0.5] }[e.key];
    if (d) {
      e.preventDefault();
      const b = e.shiftKey ? { x: h.x, y: h.y, width: h.width + d[0], height: h.height + d[1] } : { x: h.x + d[0], y: h.y + d[1], width: h.width, height: h.height };
      saveSpot({ ...h, ...fixBox(b) });
    } else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeSpot(h); }
  }
  function onSpotList(e) {
    const b = e.target.closest('[data-sa]'); if (!b) return;
    const h = spotById(b.closest('[data-row]').dataset.row); if (!h) return;
    const a = b.dataset.sa;
    if (a === 'sel') { ed.sel = h.id; paintSpots(); focusStage(); }
    else if (a === 'prod') pickProduct('Trocar o produto desta área', (sku) => { const cur = spotById(h.id); if (cur) { saveSpot({ ...cur, product: sku }, true); focusStage(); } });
    else if (a === 'img') { useAsImage(h); focusStage(); }
    else removeSpot(h);
  }
  // Área nova (desenhada ou pelo botão): pergunta o produto; sem escolha, a área é descartada
  function askDraftProduct() {
    pickProduct('Qual produto está nesta área?', (sku) => {
      if (!ed.draft || !vault) return;
      const h = { id: P.randHex(6), catalogId: ed.cat, page: ed.page, product: sku, ...ed.draft };
      ed.draft = null;
      saveSpot(h, true); focusStage();
    }, () => { ed.draft = null; paintSpots(); });
  }
  // Toda mudança de área vai para a barra de alterações (publicada junto com o resto)
  function saveSpot(h, recount) {
    stagedSpots.set(h.id, h); ed.sel = h.id;
    refreshStage(); paintSpots();
    if (recount) renderProdRows();
  }
  function removeSpot(h) {
    stagedSpots.set(h.id, null);
    if (ed.sel === h.id) ed.sel = '';
    refreshStage(); paintSpots(); renderProdRows(); focusStage();
    toast('Área removida.');
  }
  function useAsImage(h) {
    const p = (vault.products || {})[h.product]; if (!p) return;
    stagedImages.set(h.product, boxOf(h));
    refreshStage(); paintSpots(); renderProdRows();
    toast(`Esta área vai ser a imagem de “${p.name}” no site depois de publicar.`);
  }

  /* ================= configurações ================= */
  function renderCfg() {
    const box = $('#pn-tabCfg'); if (!vault) return;
    const st = vault.settings || {}, hasR = !!(slots && slots.r), com = st.comercial || {};
    box.innerHTML = `${pageHead('cfg')}
      <div data-sb-warn-slot hidden></div>
      <div class="cfg-grid">
          <section class="card stack span2" id="pn-cfgUnify" aria-labelledby="pn-cfgUnifyH">${unifyCardHtml()}</section>
          <section class="card stack" aria-labelledby="pn-cfgAtivH">
            <div class="card-head"><span class="card-ico" aria-hidden="true">${ICO.mail}</span><h2 id="pn-cfgAtivH">Contatos do marketing</h2></div>
            <p class="muted">Aparecem nas telas de entrar e de ajuda do site, para quem precisa de ajuda com o acesso. O site mostra um botão para cada contato preenchido.</p>
            <label class="field" id="pn-fAE"><span class="field-label">E-mail do marketing</span><input id="pn-ativEmail" type="email" value="${esc(st.ativEmail || '')}" placeholder="marketing@empresa.com.br"><em class="err" hidden></em></label>
            <label class="field" id="pn-fAW"><span class="field-label">WhatsApp do marketing (com DDI e DDD, só números)</span><input id="pn-ativWhats" inputmode="numeric" value="${esc(st.ativWhats || '')}" placeholder="5554999999999"><em class="err" hidden></em></label>
            <label class="field"><span class="field-label">Texto de “Esqueci minha senha”</span><textarea id="pn-contato" rows="3">${esc(st.contato || CONTATO_PADRAO)}</textarea></label>
            <button class="btn primary" id="pn-saveAtiv" type="button">Salvar e publicar</button>
          </section>
          <section class="card stack" aria-labelledby="pn-cfgComH">
            <div class="card-head"><span class="card-ico" aria-hidden="true">${ICO.chat}</span><h2 id="pn-cfgComH">Contato comercial</h2></div>
            <p class="muted">Para onde a pessoa pede informações sobre os produtos marcados nos catálogos. Estes contatos ficam protegidos: só aparecem para quem entra na Prateleira.</p>
            <label class="field" id="pn-fCW"><span class="field-label">WhatsApp comercial (com DDI e DDD, só números)</span><input id="pn-comWhats" inputmode="numeric" value="${esc(com.whatsapp || '')}" placeholder="5554999999999"><em class="err" hidden></em></label>
            <label class="field" id="pn-fCE"><span class="field-label">E-mail comercial (opcional)</span><input id="pn-comEmail" type="email" value="${esc(com.email || '')}" placeholder="comercial@empresa.com.br"><em class="err" hidden></em></label>
            <label class="field"><span class="field-label">Mensagem padrão (opcional)</span><textarea id="pn-comMsg" rows="3" maxlength="300">${esc(com.mensagem || MSG_COMERCIAL)}</textarea></label>
            <button class="btn primary" id="pn-saveCom" type="button">Salvar e publicar</button>
          </section>
          <section class="card span2" aria-labelledby="pn-cfgSecH">
            <div class="card-head"><span class="card-ico" aria-hidden="true">${ICO.shield}</span><h2 id="pn-cfgSecH">Segurança</h2></div>
            ${hasR ? '' : '<div class="alert error sec-alert"><b>Crie a chave de recuperação.</b> Ela abre o painel se a senha mestra for esquecida. Sem ela e sem a senha mestra, todos os acessos precisam ser recriados.<div class="row"><button class="btn primary sm" type="button" data-cfg="recovery">Criar chave de recuperação</button></div></div>'}
            <ul class="sec-list">
              <li class="sec-row"><div><h3>Senha mestra</h3><p class="muted">Todos os administradores usam a mesma senha mestra. Troque quando alguém deixar de ser administrador.</p>${openedBy === 'unified' ? '<p class="muted" id="pn-masterNote">Agora a senha mestra serve só para emergências (o painel foi aberto com e-mail e senha). Se ela tiver menos de 20 caracteres, contiver “Dellamed”, “Prateleira”, “senha”, “admin” ou anos, ou não misturar três tipos de caractere, troque-a aqui.</p>' : ''}</div>
                <div class="row"><button class="btn ghost" type="button" data-cfg="master">Trocar senha mestra</button></div></li>
              ${hasR ? '<li class="sec-row"><div><h3>Chave de recuperação</h3><p class="muted">Abre o painel se a senha mestra for esquecida. Ao gerar uma nova, a atual deixa de valer.</p></div><div class="row"><button class="btn ghost" type="button" data-cfg="recovery">Gerar nova chave de recuperação</button></div></li>' : ''}
              <li class="sec-row"><div><h3>Backup do cofre</h3><p class="muted">O backup é o cofre exatamente como está no GitHub, criptografado. Ele só abre com a senha mestra ou com a chave de recuperação.</p></div>
                <div class="row"><button class="btn ghost" type="button" data-cfg="backup">Exportar backup</button></div></li>
              <li class="sec-row"><div><h3>Chaves dos catálogos</h3><p class="muted">Para trocar as chaves de todos os catálogos de uma vez (${estimate(rotationFileCount(vault.catalogs))}).</p></div>
                <div class="row"><button class="btn ghost" type="button" data-cfg="recrypt">Recriptografar todos os catálogos</button></div></li>
              <li class="sec-row"><div><h3>Token neste computador</h3><p class="muted">Repositório <code>${esc(repo.label())}</code>. O token do GitHub fica guardado aqui, protegido pelo cofre dos administradores. O painel se bloqueia sozinho depois de 30 minutos sem uso.</p></div>
                <div class="row"><button class="btn ghost" type="button" data-cfg="forget">Esquecer o token neste computador</button></div></li>
            </ul>
          </section>
      </div>`;
    $('#pn-saveAtiv').addEventListener('click', saveAtiv);
    $('#pn-saveCom').addEventListener('click', saveCom);
    box.onsubmit = onUnifyLogin; // entrar com e-mail e senha no cartão "Acesso unificado"
    box.onclick = (e) => {
      if (onSbClick(e)) return; // "Unificar acesso", situação do acesso unificado e "Tentar de novo" do aviso
      const b = e.target.closest('[data-cfg]'); if (!b) return;
      const a = b.dataset.cfg;
      if (a === 'recovery') createRecovery();
      else if (a === 'master') changeMasterDialog('');
      else if (a === 'backup') exportBackup();
      else if (a === 'recrypt') recryptAll();
      else forgetToken();
    };
    paintSbWarn();
    if (sb && !secretsInfo) loadSecretsInfo();
  }
  async function saveAtiv() {
    const email = $('#pn-ativEmail').value.trim(), whats = $('#pn-ativWhats').value.replace(/\D/g, ''), wp = whatsProblem(whats);
    setFieldErr($('#pn-fAE'), email && !emailOk(email) ? 'Confira o formato do e-mail.' : '');
    setFieldErr($('#pn-fAW'), wp);
    if ((email && !emailOk(email)) || wp) return;
    const s = { ativEmail: email, ativWhats: whats, contato: $('#pn-contato').value.trim() || CONTATO_PADRAO }; // settings.codeHours antigo fica como está (sem uso)
    const ok = await publish('Salvando', (d) => { d.settings = { ...(d.settings || {}), ...s }; });
    if (ok) { toast('Configurações publicadas.'); renderCfg(); }
  }
  // Contato comercial (vai só no produtos.bin, cifrado; nunca no acessos.json)
  async function saveCom() {
    const whats = $('#pn-comWhats').value.replace(/\D/g, ''), email = $('#pn-comEmail').value.trim();
    const wp = whatsProblem(whats), ep = email && !emailOk(email) ? 'Confira o formato do e-mail.' : '';
    setFieldErr($('#pn-fCW'), wp); setFieldErr($('#pn-fCE'), ep);
    if (wp || ep) return;
    const comercial = { whatsapp: whats, email, mensagem: $('#pn-comMsg').value.trim() || MSG_COMERCIAL };
    const ok = await publish('Salvando', (d) => { d.settings = { ...(d.settings || {}), comercial }; });
    if (ok) { toast('Contato comercial publicado.'); renderCfg(); }
  }
  function showRecoveryKey(rk, intro) {
    openDialog({
      title: 'Chave de recuperação', locked: true,
      body: `${intro ? `<p>${esc(intro)}</p>` : ''}
        <textarea id="pn-rkText" class="secret long" rows="2" readonly aria-label="Chave de recuperação">${esc(rk)}</textarea>
        <p><b>Imprima ou guarde num lugar seguro fora do computador.</b> Ela aparece só esta vez.</p>
        <p class="muted">Com ela, um administrador entra no painel se a senha mestra for esquecida (em “Entrar com a chave de recuperação”). Não envie por e-mail ou chat.</p>
        <label class="check"><input type="checkbox" id="pn-rkOk"> Guardei a chave de recuperação</label>`,
      actions: [
        { label: 'Copiar', kind: 'ghost', onClick: async () => { await copyText($('#pn-rkText')); return false; } },
        { label: 'Concluir', kind: 'primary', onClick: () => { if (!$('#pn-rkOk').checked) { dlgErr('Marque “Guardei a chave de recuperação” para continuar.'); return false; } return true; } }
      ]
    });
  }
  async function createRecovery() {
    if (slots && slots.r && !(await confirmBox('Gerar nova chave de recuperação?', '<p>A chave de recuperação atual deixa de funcionar.</p>', 'Gerar nova'))) return;
    const rk = genRecovery();
    let rSlot = null;
    const ok = await publish('Criando a chave de recuperação', async (d, pg) => {
      pg.set('Protegendo a chave de recuperação…', 0.3);
      if (!rSlot) rSlot = await makeSlot(canonRecovery(rk), vk.raw);
      return { slots: { ...slots, r: rSlot } };
    });
    if (ok) { if (tab === 'cfg') renderCfg(); showRecoveryKey(rk); }
  }
  // Trocar a senha mestra: chave do cofre nova, compartimento m novo, chave de recuperação nova e chave-raiz nova.
  // Tudo em variáveis locais; os valores globais só mudam depois de publicar com sucesso.
  // keep: { a, b, all } devolve o que foi digitado quando o diálogo reabre depois do "Entrar com e-mail e senha" (sbRotationGate)
  function changeMasterDialog(forced, keep) {
    const legacyN = rotationFileCount(rotationTargets(vault, false)), allN = rotationFileCount(vault.catalogs);
    openDialog({
      title: forced === 'recovery' ? 'Crie uma nova senha mestra' : 'Trocar senha mestra', locked: !!forced,
      body: `${forced === 'recovery' ? '<p>Você entrou com a chave de recuperação. Crie agora uma senha mestra nova.</p>' : forced === 'weak' ? '<p>Troque a senha mestra por uma forte antes de continuar.</p>' : ''}
        <label class="field" id="pn-fM1"><span class="field-label">Nova senha mestra (pelo menos 20 caracteres)</span><input id="pn-m1" type="password" autocomplete="new-password" spellcheck="false"><em class="err" hidden></em></label>
        <button class="link" type="button" id="pn-mGen">Gerar senha forte</button>
        <label class="field" id="pn-fM2"><span class="field-label">Repita a nova senha</span><input id="pn-m2" type="password" autocomplete="new-password"><em class="err" hidden></em></label>
        <label class="check"><input type="checkbox" id="pn-mAll" checked> Trocar também as chaves dos catálogos (recomendado quando alguém deixou de ser administrador)</label>
        <p class="muted" id="pn-mEst"></p>
        <p class="muted">No fim aparece uma chave de recuperação nova (a atual deixa de valer). Avise os outros administradores: cada um vai precisar da nova senha e, no primeiro acesso, do próprio token.</p>`,
      actions: [
        forced ? { label: 'Sair', kind: 'ghost', onClick: () => { lock(); } } : { label: 'Cancelar', kind: 'ghost' },
        {
          label: 'Trocar e publicar', kind: 'primary',
          onClick: async () => {
            const a = $('#pn-m1').value, b = $('#pn-m2').value, prob = masterProblem(a);
            setFieldErr($('#pn-fM1'), prob);
            setFieldErr($('#pn-fM2'), a === b ? '' : 'As duas senhas não são iguais.');
            if (prob || a !== b) return false;
            const all = $('#pn-mAll').checked, rk = genRecovery();
            if (!(await sbRotationGate(() => changeMasterDialog(forced, { a, b, all })))) return false; // a senha mestra sempre troca a chave-raiz
            let k = null, sl = null;
            const ok = await publish('Trocando a senha mestra', async (d, pg) => {
              if (!k) {
                pg.set('Protegendo o cofre com a nova senha…', 0.02);
                k = await newVk();
                sl = { m: await makeSlot(a, k.raw), r: await makeSlot(canonRecovery(rk), k.raw) };
              }
              const x = await rotateKeys(d, pg, all);
              return { ...x, vk: k, slots: sl };
            }, { cancel: true });
            if (!ok) return false;
            if (tab === 'cfg') renderCfg();
            toast('Senha mestra trocada.');
            showRecoveryKey(rk, 'Senha mestra trocada. Guarde a chave de recuperação nova: a anterior deixou de valer.');
            return true;
          }
        }
      ]
    });
    $('#pn-mGen').addEventListener('click', () => { const s = genMaster(); $('#pn-m1').type = 'text'; $('#pn-m1').value = s; $('#pn-m2').value = s; $('#pn-m1').focus(); $('#pn-m1').select(); toast('Senha gerada. Anote-a num lugar seguro.'); });
    const est = () => { $('#pn-mEst').textContent = $('#pn-mAll').checked ? `Troca de chaves: ${estimate(allN)}.` : `A chave da lista de catálogos também muda${legacyN ? ` (${estimate(legacyN)})` : ''}.`; };
    if (keep) { $('#pn-m1').value = keep.a; $('#pn-m2').value = keep.b; $('#pn-mAll').checked = keep.all; }
    est(); $('#pn-mAll').addEventListener('change', est);
  }
  async function exportBackup() {
    try {
      const raw = await repo.read(VAULT);
      if (!raw) throw userErr('O cofre não foi encontrado no repositório.');
      download(`prateleira-cofre-${localDate()}.json`, raw);
      toast('Backup baixado. Ele só abre com a senha mestra ou com a chave de recuperação.');
    } catch (e) { alertBox('Não foi possível exportar', errText(e).replace(' Nada foi alterado no site.', '')); }
  }
  async function recryptAll() {
    if (!(await sbRotationGate((ok) => { if (ok) recryptAll(); }))) return;
    const n = rotationFileCount(vault.catalogs);
    if (!(await confirmBox('Recriptografar todos os catálogos?', `<p>Todos os catálogos e a lista de catálogos ganham chaves novas (${estimate(n)}). Quem tem acesso continua entrando normalmente.</p><p>Tudo é publicado num único envio no fim: se algo falhar ou você cancelar, nada muda no site.</p>`, 'Recriptografar'))) return;
    const ok = await publish('Recriptografando os catálogos', (d, pg) => rotateKeys(d, pg, true), { cancel: true });
    if (ok) { toast('Catálogos protegidos com chaves novas.'); if (tab === 'cfg') renderCfg(); }
  }
  async function forgetToken() {
    if (!(await confirmBox('Esquecer o token?', '<p>Na próxima entrada neste computador, será preciso informar o token do GitHub de novo.</p>', 'Esquecer'))) return;
    try { localStorage.removeItem(TOKKEY); } catch (e) { /* noop */ }
    lock();
  }

  /* ================= início e API da instância ================= */
  // start(): abre conforme host.mode. Chamado de novo (por exemplo, o site trocou para #/emergencia): com o cofre aberto no mesmo modo
  // só mostra a gestão; em outro modo, fecha o cofre (sem publicação em andamento) e começa pelo modo novo.
  async function startMode() {
    if (vault && (openedMode === H.mode || busy)) { screen('main'); setTab(tab); refreshStage(); return; }
    if (vault) closeVault();
    if (H.mode === 'emergency') { startEmergency(''); return; }
    await unifiedStart();
  }
  // Site trocou o objeto host (mesmo elemento ou outro): move a marcação e passa a usar os callbacks novos
  function setHost(h) {
    if (h.root && h.root !== H.root) { h.root.classList.add('dmp'); while (H.root.firstChild) h.root.appendChild(H.root.firstChild); }
    if (h.bar && H.bar && h.bar !== H.bar) { h.bar.classList.add('dmp'); while (H.bar.firstChild) h.bar.appendChild(H.bar.firstChild); }
    H = Object.assign({}, h, { root: h.root || H.root, bar: H.bar && h.bar ? h.bar : H.bar });
  }
  return {
    setHost,
    start: startMode,
    show: showSection,
    hasPending: () => busy || stageCount() > 0,
    lock: lockFromHost,
    useRepo(a) { repo = a; nojekyllOk = false; if (H.mode === 'emergency' && !vault) detectMode(); }
  };
  }

  /* ================= API pública (CONTRATO-painel.md) ================= */
  let inst = null, pendingRepo = null, firstSection = '';
  window.DellamedPainel = {
    version: 1,
    async start(host) {
      if (!host || !host.P || !host.root) throw new Error('DellamedPainel.start: host incompleto.');
      injectStyle();
      if (!inst) {
        inst = boot(host);
        if (pendingRepo) { inst.useRepo(pendingRepo); pendingRepo = null; }
        if (firstSection) { inst.show(firstSection); firstSection = ''; }
      } else inst.setHost(host);
      return inst.start();
    },
    show(section) { if (inst) inst.show(section); else firstSection = section; },
    hasPending() { return inst ? inst.hasPending() : false; },
    lock() { if (inst) inst.lock(); },
    useRepo(adapter) {
      if (!IS_LOCAL) { console.warn('DellamedPainel.useRepo só funciona em localhost/127.0.0.1.'); return; }
      if (inst) inst.useRepo(adapter); else pendingRepo = adapter;
    }
  };
})();
