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
  /* Pessoas: "Pedidos de acesso" (cadastro pelo site) e selos na lista */
  .dmp .sec-title .badge { margin-left: 8px; vertical-align: middle; }
  .dmp .cell .badge { margin-left: 6px; color: var(--navy); font-size: 11px; vertical-align: 1px; }
  .dmp .req-when { font-size: 12px; color: var(--ink-2); }
  /* Configurações: cartão "Cadastro de pessoas" (link, aprovação automática e setores) */
  .dmp .cad-link { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 8px 12px; }
  .dmp .cad-link .field { flex: 1 1 320px; min-width: 0; }
  .dmp .cad-link .field input { color: var(--navy); }
  .dmp .set-list { display: grid; margin: 0; padding: 0; list-style: none; }
  .dmp .set-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(150px, 1fr) 64px 84px minmax(170px, auto); align-items: center; gap: 8px 12px; }
  .dmp .set-head { padding: 0 0 8px; border-bottom: 1px solid var(--hair); font-family: var(--font-title); font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-2); }
  .dmp .set-row { padding: 10px 0; border-bottom: 1px solid var(--hair); }
  .dmp .set-row.dirty { box-shadow: inset 3px 0 0 var(--sky); padding-left: 10px; }
  .dmp .set-row .set-lbl { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .dmp .set-row.off .set-name input { color: var(--ink-2); }
  .dmp .set-ativo { display: flex; align-items: center; gap: 8px; }
  .dmp .set-save { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; }
  .dmp .set-msg { font-size: 12px; color: var(--ink-2); }
  .dmp .set-add { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(150px, 1fr) auto; align-items: end; gap: 8px 12px; padding: 14px; border-radius: 14px; background: var(--light); }

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

  /* ---------- Produtos: base de produtos (planilha mestre) e marcação automática ---------- */
  .dmp .imp-card h2 { font-size: 18px; }
  .dmp .imp-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; }
  .dmp .imp-state { font-size: 13px; color: var(--ink-2); }
  .dmp .imp-state b { color: var(--navy); }
  .dmp .drop.sm { padding: 14px 18px; }
  .dmp .drop.sm .drop-ico { width: 40px; height: 40px; }
  .dmp .drop.sm .drop-ico svg { width: 20px; height: 20px; }
  .dmp .imp-map { display: grid; gap: 10px; max-height: 44vh; overflow: auto; padding-right: 4px; }
  .dmp .imp-map .field { grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); align-items: center; }
  .dmp .imp-map .field-label { font-size: 13px; }
  .dmp .imp-map select { height: 38px; }
  .dmp .imp-sum { display: grid; gap: 8px; }
  .dmp .imp-sum > details { border: 1px solid var(--hair); border-radius: 12px; background: var(--white); }
  .dmp .imp-sum > details > summary { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 12px; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--navy); list-style: none; }
  .dmp .imp-sum > details > summary::-webkit-details-marker { display: none; }
  .dmp .imp-sum > details[open] > summary { border-bottom: 1px solid var(--hair); }
  .dmp .imp-n { font-family: var(--font-title); font-weight: 700; font-variant-numeric: tabular-nums; }
  .dmp .imp-list { display: grid; gap: 6px; margin: 0; padding: 10px 12px; max-height: 240px; overflow: auto; list-style: none; font-size: 12px; }
  .dmp .imp-list li { padding: 6px 8px; border-radius: 8px; background: var(--light); overflow-wrap: anywhere; }
  .dmp .imp-list b { color: var(--navy); }
  .dmp .imp-dif { display: block; color: var(--ink-2); }
  .dmp .imp-list select.input { margin-top: 6px; height: 36px; padding: 0 10px; font-size: 13px; }
  .dmp .scan-groups { display: grid; gap: 14px; max-height: 460px; overflow: auto; padding-right: 2px; }
  .dmp .scan-cat { min-width: 0; margin: 0; padding: 0; border: 0; }
  .dmp .scan-cat > legend { padding: 0 0 6px; font-family: var(--font-title); font-size: 13px; font-weight: 700; color: var(--navy); }
  .dmp .scan-list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
  .dmp .scan-it { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 3px 10px; padding: 10px 12px; border: 1px solid var(--hair); border-radius: 12px; background: var(--white); }
  .dmp .scan-it > input { width: 16px; height: 16px; margin: 3px 0 0; accent-color: var(--navy); grid-row: span 3; }
  .dmp .scan-t { font-size: 13px; font-weight: 600; color: var(--navy); overflow-wrap: anywhere; }
  .dmp .scan-s { font-size: 12px; color: var(--ink-2); overflow-wrap: anywhere; }
  .dmp .scan-s mark { background: rgba(139, 184, 232, .55); color: var(--navy); border-radius: 3px; padding: 0 2px; }
  .dmp .scan-conf { display: inline-block; margin-left: 6px; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; vertical-align: 1px; }
  .dmp .scan-conf.alta { background: var(--sky); color: var(--navy); }
  .dmp .scan-conf.media { background: var(--light); color: var(--ink-2); border: 1px solid var(--silver); }
  .dmp .scan-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }

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
    .dmp .set-head { display: none; }
    .dmp .set-row.set-grid { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "name name" "papel papel" "ativo order" "save save"; }
    .dmp .set-name { grid-area: name; }
    .dmp .set-papel { grid-area: papel; }
    .dmp .set-ativo { grid-area: ativo; }
    .dmp .set-order { grid-area: order; }
    .dmp .set-save { grid-area: save; }
    .dmp .set-row .set-lbl { position: static; width: auto; height: auto; overflow: visible; clip-path: none; }
    .dmp .set-add { grid-template-columns: minmax(0, 1fr); }
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
    .dmp .imp-map .field { grid-template-columns: minmax(0, 1fr); }
    .dmp .scan-groups { max-height: none; }
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
    <input type="file" id="pn-xlsInput" accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" hidden>
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
  const hasSpotsIn = (d, id) => (d.hotspots || []).some((h) => h.catalogId === id) || (d.pageLinks || []).some((l) => l.catalogId === id) || Object.values(d.products || {}).some((p) => p.image && p.image.catalogId === id);
  // Tira as áreas, as ligações sem área (pageLinks) e as imagens de produto de um catálogo: todas (maxPage 0) ou só as das páginas acima de maxPage. Devolve quantas saíram.
  function dropCatalogSpots(d, id, maxPage) {
    withProd(d);
    const out = (r) => r.catalogId === id && r.page > maxPage;
    const before = d.hotspots.length + (d.pageLinks || []).length;
    d.hotspots = d.hotspots.filter((h) => !out(h));
    if (d.pageLinks) d.pageLinks = d.pageLinks.filter((l) => !out(l));
    if (d.descartes) d.descartes = d.descartes.filter((k) => { const [c, pg] = k.split('|'); return !(c === id && +pg > maxPage); });
    for (const p of Object.values(d.products)) if (p.image && out(p.image)) delete p.image;
    return before - d.hotspots.length - (d.pageLinks || []).length;
  }
  // Ligação produto ↔ página sem área: P.validPageLink (protocolo) ou, se ainda não existir, a mesma conferência aqui
  const linkOk = (l) => (typeof P.validPageLink === 'function' ? P.validPageLink(l)
    : !!l && typeof l.catalogId === 'string' && !!l.catalogId && Number.isInteger(l.page) && l.page >= 1 && typeof l.product === 'string' && !!l.product);
  const linkKey = (r) => `${r.catalogId}|${r.page}|${r.product}`;
  // A ligação cabe nos dados: catálogo e página existem, o produto existe e não há área do mesmo produto na mesma página
  function linkFits(d, l) {
    const c = d.catalogs.find((x) => x.id === l.catalogId);
    return !!c && l.page <= (c.pages || 0) && !!(d.products || {})[l.product] && linkOk(l)
      && !(d.hotspots || []).some((h) => h.catalogId === l.catalogId && h.page === l.page && h.product === l.product);
  }
  // produtos.bin (chave-raiz): todos os produtos (sem a imagem de catálogos ocultos) e só as áreas válidas dos catálogos visíveis
  async function produtosBin(d, root, visible) {
    const pages = new Map(visible.map((c) => [c.id, c.pages || 0]));
    const onPage = (r) => pages.has(r.catalogId) && r.page <= pages.get(r.catalogId);
    const products = {};
    for (const p of Object.values(d.products || {})) {
      const o = { sku: p.sku, name: p.name, category: p.category || '', benefit: p.benefit || '', capacity: p.capacity || '', description: p.description || '', url: p.url || '' };
      if (p.image && onPage(p.image) && P.validHotspot({ ...p.image, product: p.sku })) o.image = boxOf(p.image);
      const fi = P.cleanFicha(p.ficha); // ficha técnica da planilha mestre (o site mostra na ficha do produto)
      if (fi) o.ficha = fi;
      products[p.sku] = o;
    }
    const hotspots = (d.hotspots || []).filter((h) => products[h.product] && onPage(h) && P.validHotspot(h))
      .map((h) => ({ id: h.id, catalogId: h.catalogId, page: h.page, product: h.product, x: h.x, y: h.y, width: h.width, height: h.height }));
    // Produtos na página sem área: sem repetir e sem duplicar uma área do mesmo produto na mesma página
    const seen = new Set(hotspots.map(linkKey)), pageLinks = [];
    for (const l of d.pageLinks || []) {
      const k = linkKey(l);
      if (seen.has(k) || !products[l.product] || !onPage(l) || !linkOk(l)) continue;
      seen.add(k); pageLinks.push({ catalogId: l.catalogId, page: l.page, product: l.product, auto: !!l.auto });
    }
    const com = (d.settings || {}).comercial || {};
    const comercial = { whatsapp: com.whatsapp || '', email: com.email || '', mensagem: com.mensagem || MSG_COMERCIAL };
    return P.sealProdutos(root, { v: 1, comercial, products: sortKeys(products), hotspots, pageLinks });
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
  // Planilha mestre: produtos a gravar por SKU ({ sku, name, category, ficha }) e sugestões de marcação descartadas ("catálogo|página|SKU")
  const stagedProds = new Map(), stagedDrops = new Set();
  // Produto ligado à página SEM área (pageLinks): "catálogo|página|SKU" → ligação nova, ou null = removida
  const stagedLinks = new Map();
  let spotLost = 0;               // operações ignoradas na última aplicação (catálogo, página ou produto sumiram)
  function applyStaged(d, onlyCatalogs) {
    for (const [k, val] of stagedFlags) { const [id, f] = k.split('|'); const c = d.catalogs.find((x) => x.id === id); if (c) c[f] = val; }
    if (stagedOrder) {
      const rest = d.catalogs.filter((c) => !stagedOrder.includes(c.id)).sort((a, b) => a.order - b.order);
      [...stagedOrder.map((id) => d.catalogs.find((c) => c.id === id)).filter(Boolean), ...rest].forEach((c, i) => { c.order = i + 1; });
    }
    if (!onlyCatalogs) { applyProdStaged(d); applySpotStaged(d); applyLinkStaged(d); applyDropStaged(d); }
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
    const vd = viewData(), prods = vd.products, spots = vault.hotspots || []; // produtos da planilha ainda na barra também valem
    let lost = 0;
    for (const [id, h] of [...stagedSpots]) {
      const cur = spots.find((x) => x.id === id);
      if (h && !spotFits(vd, h)) { stagedSpots.delete(id); lost++; }
      else if (h ? cur && sameSpot(cur, h) : !cur) stagedSpots.delete(id);
    }
    for (const [sku, im] of [...stagedImages]) {
      const p = prods[sku];
      if (!p || (im && !spotFits(vd, { ...im, product: sku }))) { stagedImages.delete(sku); if (im) lost++; }
      else if (im ? p.image && sameBox(p.image, im) : !p.image) stagedImages.delete(sku);
    }
    lost += pruneLinkOps(vd);
    if (lost) toast(`${plural(lost, 'área de produto não publicada foi descartada', 'áreas de produto não publicadas foram descartadas')}: o catálogo, a página ou o produto não existem mais.`);
  }
  // Tira as operações preparadas que combinam com o teste (usado quando um produto ou catálogo é removido)
  function dropStaged(test) {
    for (const [id, h] of [...stagedSpots]) if (h && test(h)) stagedSpots.delete(id);
    for (const [sku, im] of [...stagedImages]) if (im && test({ ...im, product: sku })) stagedImages.delete(sku);
    for (const [k, l] of [...stagedLinks]) if (l && test(l)) stagedLinks.delete(k);
    for (const k of [...stagedDrops]) { const [catalogId, page, product] = k.split('|'); if (test({ catalogId, page: +page, product })) stagedDrops.delete(k); }
    for (const sku of [...stagedProds.keys()]) if (test({ product: sku, catalogId: '', page: 0, onlyProduct: true })) stagedProds.delete(sku);
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
    pruneProdOps();
    pruneSpotOps();
    return stagedFlags.size + (stagedOrder ? 1 : 0) + stagedSpots.size + stagedImages.size + stagedProds.size + stagedLinks.size + stagedDrops.size;
  }
  function refreshStage() {
    const n = stageCount(), cats = stagedFlags.size + (stagedOrder ? 1 : 0);
    const parts = [cats && plural(cats, 'alteração nos catálogos', 'alterações nos catálogos'), stagedProds.size && plural(stagedProds.size, 'ficha de produto da planilha', 'fichas de produtos da planilha'),
      stagedSpots.size && plural(stagedSpots.size, 'área de produto', 'áreas de produto'),
      stagedLinks.size && plural(stagedLinks.size, 'ligação de produto à página (sem área)', 'ligações de produtos às páginas (sem área)'),
      stagedDrops.size && plural(stagedDrops.size, 'sugestão descartada', 'sugestões descartadas'),
      stagedImages.size && plural(stagedImages.size, 'imagem de produto', 'imagens de produto')].filter(Boolean);
    const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} e ${parts[parts.length - 1]}` : parts[0];
    $('#pn-stageBar').hidden = !n || !vault;
    $('#pn-wrap').classList.toggle('has-bar', !!n && !!vault); // espaço no fim do conteúdo para a barra (host.bar)
    $('#pn-stageText').textContent = n ? `${list} ${n === 1 ? 'não publicada' : 'não publicadas'}` : '';
    $('#pn-stagePublish').disabled = busy;
    paintNav();
  }
  function clearStage() { stagedFlags.clear(); stagedOrder = null; stagedSpots.clear(); stagedImages.clear(); stagedProds.clear(); stagedLinks.clear(); stagedDrops.clear(); refreshStage(); }
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
    dropImageCache(); resetEditor(); resetImportState();
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
      await reloadVault(); if (sb) cadReset(); setTab(tab); toast('Dados atualizados.'); refreshStage(); // por último: o aviso de áreas descartadas tem prioridade
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
    if (sb) { sbSyncKey(); loadPendingCount(); } else sbFromAuth(); // acesso unificado: sessão já conferida (e contagem dos pedidos de acesso no menu); emergência: usa a sessão do aparelho (se for admin)
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
    put('pessoas', vault && sb && pendN ? pendN : 0); // pedidos de acesso pendentes (cadastro pelo site)
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
  const searchCache = new Map(); // `${id}:${v}:${início da chave}` → Promise<[texto de cada página]> (busca.bin decifrado, só na memória)
  const revokeAll = (p) => p.then((urls) => urls.forEach((u) => URL.revokeObjectURL(u)), () => {});
  // Único ponto que revoga as imagens decifradas (capas, páginas e miniaturas): ao recarregar o cofre e ao sair
  function dropImageCache() {
    coverUrls.forEach((p) => p.then((u) => u && URL.revokeObjectURL(u))); coverUrls.clear();
    pageCache.forEach(revokeAll); pageCache.clear();
    searchCache.clear(); // texto das páginas decifrado para a marcação automática
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
    const n = viewSpots().filter((h) => h.catalogId === id).length, nl = viewLinks().filter((l) => l.catalogId === id).length;
    return (n ? `<p>${plural(n, 'área de produto marcada', 'áreas de produto marcadas')} neste catálogo também ${n === 1 ? 'será apagada' : 'serão apagadas'}.</p>` : '')
      + (nl ? `<p>${plural(nl, 'produto ligado a página (sem área) também sai', 'produtos ligados a páginas (sem área) também saem')}.</p>` : '');
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
      keepTexts(c0, conv.texts); // a marcação automática usa o texto já extraído, sem baixar o busca.bin
      toast(opts.hidden ?'Catálogo publicado oculto. Ligue “No site” quando estiver pronto.' : 'Catálogo publicado. O site atualiza em 1 a 3 minutos.');
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
      keepTexts(cNew, conv.texts);
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
      return { pages: n, ratio, files, th: Math.ceil(n / P.THUMB_CHUNK), odd, texts };
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
  // Cadastro pelo site (05-cadastro.sql): pedidos pendentes (contagem do menu), setores, aprovação automática.
  // cadMissing: as tabelas/colunas do cadastro ainda não existem no Supabase (os blocos mostram MSG_CAD_SQL; o resto de Pessoas segue normal)
  let pendN = null, pendJob = null, pendAt = 0;
  let setores = null, setoresErr = '', setoresJob = null;
  let cadAuto = null, cadAutoErr = '', cadAutoJob = null, cadMissing = false;
  const sbAuthErr = (msg) => { const e = userErr(msg); e.status = 401; return e; };
  const MSG_SESSION = 'A sessão terminou. Entre com e-mail e senha em Configurações → Acesso unificado.';
  function cadReset() {
    setores = null; setoresErr = ''; setoresJob = null;
    cadAuto = null; cadAutoErr = ''; cadAutoJob = null; cadMissing = false;
  }
  // Fim do estado da sessão no painel (não mexe na sessão do aparelho)
  function sbEnd() {
    sbGen++; peopleSeq++;
    sb = null; secretsInfo = null; secretsJob = null;
    people = null; peopleErr = ''; peopleJob = null;
    pendN = null; pendJob = null; cadReset();
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
      const cad = $('#pn-cfgCad');
      if (cad && (cad.dataset.on !== String(!!sb) || (sb && cadMissing && !$('[data-cad="reload"]', cad)))) paintCadCard(); // entrou/saiu da sessão ou o cadastro não existe
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
    // Com as colunas do cadastro; se ainda não existem (05-cadastro.sql não rodou), a lista vem só com as colunas de antes
    peopleJob = sbCall(async (t) => {
      try { return { rows: await P.supa.select(t, 'perfis', `select=${PERSON_COLS},${CAD_COLS}&order=nome.asc`), cad: true }; }
      catch (e) { if (!cadMissingErr(e)) throw e; console.warn(e); return { rows: await P.supa.select(t, 'perfis', `select=${PERSON_COLS}&order=nome.asc`), cad: false }; }
    })
      .then((r) => {
        if (seq !== peopleSeq) return;
        people = Array.isArray(r.rows) ? r.rows : [];
        cadMissing = !r.cad;
        pendN = r.cad ? requestsOf(people).length : 0;
      })
      .catch((e) => { console.error(e); if (seq === peopleSeq) { peopleErr = sbErrText(e); if (people) toast(peopleErr); } })
      .finally(() => { if (seq === peopleSeq) peopleJob = null; });
    return peopleJob;
  }

  /* ---------- cadastro pelo site: pedidos de acesso, setores e aprovação automática (05-cadastro.sql) ----------
     perfis.origem 'convite' | 'cadastro', perfis.situacao 'pendente' | 'aprovado' | 'recusado'; RPCs admin_aprovar_cadastro / admin_recusar_cadastro;
     função "avisos" { tipo: 'decisao', id } manda o e-mail da decisão ({ ok: true } | { ok: false, motivo: 'smtp' }). */
  const PERSON_COLS = 'id,email,nome,empresa,papel,ativo,criado_em';
  const CAD_COLS = 'whatsapp,setor_id,origem,situacao,motivo_recusa';
  const CAD_LINK = 'https://mktdellamed26.github.io/catalogos/#/cadastro';
  const MSG_CAD_SQL = 'Rode o script 05-cadastro.sql no Supabase para ativar o cadastro.';
  const SETOR_ROLES = ['cliente', 'representante', 'interno']; // setores nunca sugerem "admin"
  const PEND_EVERY = 5 * 60 * 1000;
  // Tabela, coluna ou função do cadastro ainda não criada no Supabase
  const cadMissingErr = (e) => !!e && (e.status === 404 || ['42P01', '42703', '42883', 'PGRST202', 'PGRST204', 'PGRST205'].includes(String(e.code || ''))
    || (e.status === 400 && /column|does not exist|schema cache/i.test(e.message || '')));
  const cadErrText = (e) => (e && e.userMessage ? e.userMessage : isNotAdminErr(e) ? MSG_NOT_ADMIN : cadMissingErr(e) ? MSG_CAD_SQL : sbErrText(e));
  const setorErrText = (e) => (e && (e.status === 409 || e.code === '23505') ? 'Já existe um setor com esse nome.' : cadErrText(e));
  const isRequest = (p) => p.origem === 'cadastro' && p.situacao === 'pendente';
  const requestsOf = (list) => (list || []).filter(isRequest).sort((a, b) => String(b.criado_em || '').localeCompare(String(a.criado_em || '')));
  const setorOf = (id) => (id == null ? null : (setores || []).find((s) => s.id === id) || null);
  const sortSetores = () => { if (setores) setores.sort((a, b) => (a.ordem || 0) - (b.ordem || 0) || String(a.nome).localeCompare(String(b.nome), 'pt-BR')); };
  // WhatsApp guardado só com números → +55 (54) 99999-9999
  function fmtWhats(v) {
    const d = String(v || '').replace(/\D/g, '');
    if (!d) return '';
    const cc = (d.length === 12 || d.length === 13) && d.startsWith('55') ? '+55 ' : '';
    const r = cc ? d.slice(2) : d;
    return r.length === 10 || r.length === 11 ? `${cc}(${r.slice(0, 2)}) ${r.slice(2, -4)}-${r.slice(-4)}` : d;
  }
  const agoText = (iso) => {
    const t = Date.parse(iso || ''); if (!t) return '';
    const days = Math.floor((Date.now() - t) / 86400000);
    return days <= 0 ? 'hoje' : days === 1 ? 'há 1 dia' : `há ${days.toLocaleString('pt-BR')} dias`;
  };
  // Contagem leve dos pedidos pendentes (menu do site): ao abrir a gestão, a cada 5 minutos e quando a janela volta ao foco
  function loadPendingCount() {
    if (!sb || !vault) return Promise.resolve();
    if (pendJob) return pendJob;
    const gen = sbGen;
    pendAt = Date.now();
    const job = sbCall((t) => P.supa.select(t, 'perfis', 'select=id&situacao=eq.pendente&origem=eq.cadastro'))
      .then((rows) => {
        if (gen !== sbGen) return;
        const n = Array.isArray(rows) ? rows.length : 0;
        pendN = n;
        // A lista de Pessoas já carregada ficou diferente (pedido novo, decisão de outro administrador ou o script acabou de rodar): recarrega
        if (people && !peopleJob && (cadMissing || requestsOf(people).length !== n)) loadPeople().then(sbRepaint);
        else paintNav();
      })
      .catch((e) => {
        if (gen !== sbGen) return;
        if (cadMissingErr(e)) { pendN = 0; cadMissing = true; paintNav(); } else console.error(e);
      })
      .finally(() => { if (pendJob === job) pendJob = null; });
    pendJob = job;
    return job;
  }
  setInterval(() => { if (vault && sb && document.visibilityState !== 'hidden') loadPendingCount(); }, PEND_EVERY);
  window.addEventListener('focus', () => { if (vault && sb && Date.now() - pendAt > 30000) loadPendingCount(); });
  function loadSetores() {
    if (!sb) return Promise.resolve();
    if (setoresJob) return setoresJob;
    const gen = sbGen;
    setoresErr = '';
    const job = sbCall((t) => P.supa.select(t, 'setores', 'select=id,nome,papel,ordem,ativo&order=ordem.asc,nome.asc'))
      .then((rows) => { if (gen === sbGen) { setores = Array.isArray(rows) ? rows : []; sortSetores(); } })
      .catch((e) => { console.error(e); if (gen === sbGen) { if (cadMissingErr(e)) cadMissing = true; setoresErr = cadErrText(e); } })
      .finally(() => { if (setoresJob === job) setoresJob = null; });
    setoresJob = job;
    return job;
  }
  function loadCadAuto() {
    if (!sb) return Promise.resolve();
    if (cadAutoJob) return cadAutoJob;
    const gen = sbGen;
    cadAutoErr = '';
    const job = sbCall((t) => P.supa.select(t, 'ajustes_cadastro', 'id=eq.1&select=aprovacao_automatica'))
      .then((rows) => { if (gen === sbGen) cadAuto = !!(Array.isArray(rows) && rows[0] && rows[0].aprovacao_automatica); })
      .catch((e) => { console.error(e); if (gen === sbGen) { if (cadMissingErr(e)) cadMissing = true; cadAutoErr = cadErrText(e); } })
      .finally(() => { if (cadAutoJob === job) cadAutoJob = null; });
    cadAutoJob = job;
    return job;
  }
  // E-mail da decisão (função "avisos"): true = enviado; 'smtp' = e-mail não configurado; false = não enviado
  async function notifyDecision(id) {
    try {
      const r = await sbCall((t) => P.supa.fn(t, 'avisos', { tipo: 'decisao', id }));
      if (r && r.ok === true) return true;
      return r && r.motivo === 'smtp' ? 'smtp' : false;
    } catch (e) { console.error(e); return false; }
  }
  const decisionToast = (lead, sent) => toast(sent === true ? `${lead} Avisamos por e-mail.`
    : sent === 'smtp' ? `${lead} O e-mail de aviso não foi enviado (e-mail não configurado).`
    : `${lead} O e-mail de aviso não foi enviado.`, sent === true ? 'ok' : undefined);

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
  // Lista "Pessoas" sem os pedidos pendentes (esses ficam no bloco "Pedidos de acesso")
  const visiblePeople = () => { const hit = matcher(); return (people || []).filter((p) => !isRequest(p) && hit(`${p.nome || ''} ${p.email || ''} ${p.empresa || ''}`)); };
  function renderUsers() {
    const box = $('#pn-tabUsers'); if (!vault) return;
    box.innerHTML = `${pageHead('users', '<button class="btn primary" id="pn-inviteBtn" type="button">+ Convidar pessoa</button>')}
      <div data-sb-warn-slot hidden></div>
      <div id="pn-sbConnectSlot" hidden></div>
      <section class="stack" id="pn-uReq" aria-labelledby="pn-uReqH" hidden><h2 class="sec-title" id="pn-uReqH">Pedidos de acesso<span class="badge" id="pn-uReqN" hidden></span></h2><div id="pn-uReqList"></div></section>
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
    const refused = p.situacao === 'recusado', st = setorOf(p.setor_id);
    const motivo = refused && p.motivo_recusa ? `Motivo: ${p.motivo_recusa}` : '';
    const status = refused ? `<span class="status off"${motivo ? ` title="${esc(motivo)}"` : ''}>Recusado</span>${motivo ? `<br><span class="muted">${esc(motivo)}</span>` : ''}`
      : p.ativo ? '<span class="status on">Ativo</span>' : '<span class="status off">Bloqueado</span>';
    // Recusado: "Aprovar mesmo assim" no lugar de Bloquear/Desbloquear e sem "Reenviar acesso"
    const middle = refused
      ? '<button class="btn primary sm" type="button" data-k="approve" data-sb-act="approve">Aprovar mesmo assim</button>'
      : `<button class="btn ghost sm" type="button" data-k="block" data-sb-act="${p.ativo ? 'block' : 'unblock'}"${off}>${p.ativo ? 'Bloquear' : 'Desbloquear'}</button><button class="btn ghost sm" type="button" data-k="resend" data-sb-act="resend">Reenviar acesso</button>`;
    return `<li class="rw sb-grid" data-row="sb:${esc(p.id)}">
      <div class="u-who cell"><span class="avatar" aria-hidden="true">${esc(initials(name))}</span><div><b>${esc(name)}${me ? ' (você)' : ''}${p.origem === 'cadastro' ? '<span class="badge" title="Pediu acesso pelo cadastro do site">Cadastro</span>' : ''}</b><span>${esc(p.email)}</span></div></div>
      <div class="u-comp"><span class="cell-l">Empresa:</span> ${esc(p.empresa || '—')}${st ? `<br><span class="muted">Setor: ${esc(st.nome)}</span>` : ''}</div>
      <div class="u-role"><span class="chip-role">${esc(ROLE[p.papel] || p.papel || '—')}</span></div>
      <div class="u-status">${status}</div>
      <div class="rw-acts"><button class="btn ghost sm" type="button" data-k="edit" data-sb-act="edit">Editar</button>${middle}<button class="btn ghost sm" type="button" data-k="remove" data-sb-act="remove"${off}>Remover</button></div>
    </li>`;
  }
  // Pedido de acesso pendente (bloco "Pedidos de acesso"): setor, WhatsApp, perfil sugerido pelo setor e há quanto tempo pediu
  function requestRowHtml(p) {
    const name = p.nome || p.email, st = setorOf(p.setor_id), whats = fmtWhats(p.whatsapp);
    const papel = (st && st.papel) || p.papel;
    return `<li class="rw sb-grid" data-row="sb:${esc(p.id)}">
      <div class="u-who cell"><span class="avatar" aria-hidden="true">${esc(initials(name))}</span><div><b>${esc(name)}</b><span>${esc(p.email)}</span></div></div>
      <div class="u-comp"><span class="cell-l">Setor:</span> ${esc(st ? st.nome : p.setor_id == null ? '—' : setores ? 'setor removido' : '…')}${whats ? `<br><span class="cell-l">WhatsApp:</span> <span class="muted">${esc(whats)}</span>` : ''}</div>
      <div class="u-role"><span class="cell-l">Sugerido:</span> <span class="chip-role">${esc(ROLE[papel] || papel || '—')}</span></div>
      <div class="u-status"><span class="status wait"${p.criado_em ? ` title="Pedido em ${esc(fmtDateTime(p.criado_em))}"` : ''}>Aguardando</span>${p.criado_em ? `<br><span class="req-when">${esc(agoText(p.criado_em))}</span>` : ''}</div>
      <div class="rw-acts"><button class="btn primary sm" type="button" data-k="approve" data-sb-act="approve">Aprovar</button><button class="btn ghost sm" type="button" data-k="refuse" data-sb-act="refuse">Recusar</button></div>
    </li>`;
  }
  function renderRequests() {
    const box = $('#pn-uReq'), list = $('#pn-uReqList'); if (!box || !list) return;
    box.hidden = !sb;
    const n = $('#pn-uReqN'), reqs = people && !cadMissing ? requestsOf(people) : [];
    n.hidden = !reqs.length; n.textContent = reqs.length.toLocaleString('pt-BR');
    if (!sb) { list.innerHTML = ''; return; }
    keepFocus(() => {
      list.innerHTML = !people
        ? `<div class="empty">${peopleErr ? esc(peopleErr) : 'Carregando os pedidos…'}</div>`
        : cadMissing ? `<div class="alert warn" role="status">${esc(MSG_CAD_SQL)}</div>`
        : reqs.length ? `<div class="list-card">
          <div class="rows-head sb-grid" aria-hidden="true"><span>Pessoa</span><span>Setor e WhatsApp</span><span>Perfil sugerido</span><span>Pedido</span></div>
          <ul class="rows" aria-label="Pedidos de acesso">${reqs.map(requestRowHtml).join('')}</ul></div>`
        : '<div class="empty">Nenhum pedido pendente.</div>';
    });
  }
  // Atualiza aviso, cartão de conexão, blocos, contagem e as duas listas (o campo de busca não é recriado)
  function renderUserRows() {
    const wrap = $('#pn-uTable'); if (!wrap || !vault) return;
    const all = vault.users, list = visibleUsers(), ppl = (people || []).filter((p) => !isRequest(p)), shown = visiblePeople();
    const loaded = !!(sb && people), blocked = ppl.filter((p) => !p.ativo).length, q = userQ.trim();
    for (const uid of [...selected]) if (!all.some((u) => u.uid === uid)) selected.delete(uid);
    paintSbWarn();
    const slot = $('#pn-sbConnectSlot');
    if (slot.dataset.on !== String(!!sb)) { slot.dataset.on = String(!!sb); slot.hidden = !!sb; slot.innerHTML = sb ? '' : sbConnectCardHtml(); }
    $('#pn-uPeople').hidden = !sb;
    renderRequests();
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
    const moved = new Set((people || []).map((p) => P.normEmail(p.email)));
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
    if (sb && !cadMissing && !setores && !setoresJob && !setoresErr) loadSetores().then(sbRepaint); // nomes dos setores (pedidos, lista e edição)
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
  // Setor no formulário da pessoa: setores ativos + o atual (mesmo desativado)
  const setorOptions = (cur) => `<option value="">Sem setor</option>${(setores || []).filter((s) => s.ativo || s.id === cur)
    .map((s) => `<option value="${s.id}" ${s.id === cur ? 'selected' : ''}>${esc(s.nome)}${s.ativo ? '' : ' (desativado)'}</option>`).join('')}`;
  function editPersonDialog(p) {
    const cad = !cadMissing && 'situacao' in p; // colunas do cadastro presentes nesta lista
    const origin = cad && p.origem === 'cadastro'
      ? `<p class="muted">Pediu acesso pelo cadastro do site${p.situacao === 'recusado' ? ` · recusado${p.motivo_recusa ? `: ${esc(p.motivo_recusa)}` : ''}` : p.situacao === 'pendente' ? ' · aguardando aprovação' : ''}.</p>` : '';
    const cadFields = cad ? `
      <label class="field" id="pn-fWhats"><span class="field-label">WhatsApp (com DDD; só números)</span><input id="pn-nWhats" inputmode="numeric" autocomplete="off" maxlength="20" value="${esc(p.whatsapp || '')}" placeholder="5554999999999"><em class="err" hidden></em></label>
      <label class="field"><span class="field-label">Setor</span><select id="pn-nSetor">${setorOptions(p.setor_id)}</select></label>` : '';
    openDialog({
      title: 'Editar pessoa',
      body: `<p class="muted">${esc(p.email)} · o e-mail é o login da pessoa e não muda aqui.</p>${origin}${personFields({ name: p.nome, company: p.empresa, role: p.papel }, true)}${cadFields}`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Salvar', kind: 'primary',
        onClick: async () => {
          const f = readPerson(null, true); if (!f) return false;
          const patch = { nome: f.name, empresa: f.company, papel: f.role };
          if (cad) {
            const w = $('#pn-nWhats').value.replace(/\D/g, ''), wp = w && (w.length < 10 || w.length > 13) ? 'Informe DDD e número (com ou sem o DDI 55), por exemplo 5554999999999.' : '';
            setFieldErr($('#pn-fWhats'), wp);
            if (wp) return false;
            const sv = $('#pn-nSetor').value;
            patch.whatsapp = w; patch.setor_id = sv ? Number(sv) : null;
          }
          if (sb && p.id === sb.uid && f.role !== 'admin') { dlgErr('Você não pode tirar o perfil de administrador da própria conta.'); return false; }
          let rows;
          try { rows = await sbCall((t) => P.supa.update(t, 'perfis', `id=eq.${encodeURIComponent(p.id)}`, patch)); }
          catch (e) { console.error(e); dlgErr(cadErrText(e)); return false; }
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
    const withSetores = (fn) => { // abre o diálogo com os nomes dos setores já carregados (quando o cadastro existe)
      if (!sb || cadMissing || setores) { fn(p); return; }
      btn.disabled = true;
      loadSetores().then(() => { if (btn.isConnected) btn.disabled = false; fn(p); });
    };
    if (act === 'edit') withSetores(editPersonDialog);
    else if (act === 'approve') withSetores(approveDialog);
    else if (act === 'refuse') refuseDialog(p);
    else if (act === 'block' || act === 'unblock') setBlocked(p, act === 'block');
    else if (act === 'resend') resendAccess(p, btn);
    else if (act === 'remove') removeSbPerson(p);
  }
  // Aprovar pedido de acesso (ou "Aprovar mesmo assim" para quem foi recusado): perfil sugerido pelo setor, com aviso para Administrador
  function approveDialog(p) {
    const name = p.nome || p.email, st = setorOf(p.setor_id), refused = p.situacao === 'recusado';
    const def = st && ROLE[st.papel] ? st.papel : ROLE[p.papel] && p.papel !== 'admin' ? p.papel : 'cliente';
    openDialog({
      title: refused ? `Aprovar ${name} mesmo assim` : `Aprovar ${name}`,
      body: `<p class="muted">${esc(p.email)}${st ? ` · Setor: ${esc(st.nome)}` : ''}${p.whatsapp ? ` · WhatsApp: ${esc(fmtWhats(p.whatsapp))}` : ''}</p>
        ${refused ? `<p class="muted">Este pedido foi recusado${p.motivo_recusa ? `. Motivo: ${esc(p.motivo_recusa)}` : ''}.</p>` : ''}
        <label class="field"><span class="field-label">Perfil de acesso</span><select id="pn-apRole">${Object.entries(ROLE).map(([k, l]) => `<option value="${k}" ${k === def ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        ${st ? `<p class="muted">Sugerido pelo setor: ${esc(ROLE[st.papel] || st.papel)}.</p>` : ''}
        <div class="alert error" id="pn-apAdminWarn" role="alert" hidden><b>Atenção:</b> o perfil Administrador dá acesso total à gestão (catálogos, produtos, pessoas, configurações e os segredos do acesso unificado). Escolha só para quem cuida da Prateleira.</div>
        <p class="muted">A pessoa passa a entrar na Prateleira e recebe um e-mail avisando.</p>`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Aprovar', kind: 'primary',
        onClick: async () => {
          const role = $('#pn-apRole').value;
          if (!ROLE[role]) return false;
          try { await sbCall((t) => P.supa.rpc(t, 'admin_aprovar_cadastro', { p_id: p.id, p_papel: role })); }
          catch (e) { console.error(e); dlgErr(cadErrText(e)); return false; }
          decisionToast('Acesso liberado.', await notifyDecision(p.id));
          loadPeople().then(sbRepaint);
          return true;
        }
      }]
    });
    const sel = $('#pn-apRole'), warn = $('#pn-apAdminWarn');
    const paint = () => { warn.hidden = sel.value !== 'admin'; };
    sel.addEventListener('change', paint); paint();
  }
  // Recusar pedido de acesso: motivo opcional (até 300 caracteres, com contador)
  function refuseDialog(p) {
    const name = p.nome || p.email, MAX = 300;
    openDialog({
      title: `Recusar ${name}`,
      body: `<p class="muted">${esc(p.email)}. A pessoa não entra na Prateleira e recebe um e-mail avisando da decisão. Dá para aprovar depois, se precisar.</p>
        <label class="field" id="pn-fRcMotivo"><span class="field-label">Motivo (opcional)</span><textarea id="pn-rcMotivo" rows="3" maxlength="${MAX}" aria-describedby="pn-rcCount"></textarea><em class="err" hidden></em></label>
        <p class="muted" id="pn-rcCount">0/${MAX}</p>`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Recusar', kind: 'danger',
        onClick: async () => {
          const motivo = $('#pn-rcMotivo').value.trim().slice(0, MAX);
          try { await sbCall((t) => P.supa.rpc(t, 'admin_recusar_cadastro', { p_id: p.id, p_motivo: motivo })); }
          catch (e) { console.error(e); dlgErr(cadErrText(e)); return false; }
          decisionToast('Pedido recusado.', await notifyDecision(p.id));
          loadPeople().then(sbRepaint);
          return true;
        }
      }]
    });
    const ta = $('#pn-rcMotivo'), count = $('#pn-rcCount');
    ta.addEventListener('input', () => { count.textContent = `${ta.value.length.toLocaleString('pt-BR')}/${MAX}`; });
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
  function resetEditor() { ed.sel = ''; ed.draft = null; ed.drag = null; ed.pendLink = null; ed.seq++; }
  const focusStage = () => { const st = $('#pn-hsStage'); if (st) st.focus(); };
  const prodName = (sku) => { const p = viewProducts()[sku]; return p ? p.name : `${sku} (produto removido)`; };
  const prodList = (q) => { q = norm(q); return Object.values(viewProducts()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).filter((p) => !q || norm(`${p.sku} ${p.name} ${p.category}`).includes(q)); };
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
      ${baseCardHtml()}
      <div class="toolbar">
        <div class="search"><span class="ico">${ICO.search}</span><input class="input" id="pn-pq" type="search" placeholder="Buscar SKU, nome ou categoria" value="${esc(prodQ)}" aria-label="Buscar produtos" aria-describedby="pn-pCount"></div>
        <p class="count"><span id="pn-pCount" aria-live="polite"></span></p>
      </div>
      <div id="pn-pTable"></div>
      ${scanCardHtml()}
      <div class="card stack hs-card" id="pn-hsEd"></div>`;
    let t = null;
    $('#pn-pq').addEventListener('input', (e) => { clearTimeout(t); const v = e.target.value; t = setTimeout(() => { prodQ = v; renderProdRows(); }, 200); });
    $('#pn-addProd').addEventListener('click', () => productDialog(null));
    $('#pn-pTable').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const sku = b.closest('[data-row]').dataset.row;
      if (stagedNew(sku)) { toast('Este produto veio da planilha e ainda não foi publicado. Publique as alterações para editar ou remover.'); return; }
      const p = (vault.products || {})[sku]; if (!p) return;
      if (b.dataset.act === 'edit') productDialog(p); else removeProduct(p);
    });
    bindBaseCard(); bindScanCard();
    const rv = $('#pn-hsReview');
    if (rv) rv.addEventListener('click', (e) => { const b = e.target.closest('[data-review]'); if (b) openCatalog(b.dataset.review); });
    renderProdRows(); renderEditor();
  }
  // Atualiza só a tabela e a contagem (o campo de busca não é recriado)
  function renderProdRows() {
    const wrap = $('#pn-pTable'); if (!wrap || !vault) return;
    const all = Object.keys(viewProducts()).length, list = prodList(prodQ);
    const spots = viewSpots(), cats = viewCatalogs(), links = viewLinks();
    const nLinks = new Map(); for (const l of links) nLinks.set(l.product, (nLinks.get(l.product) || 0) + 1);
    const count = new Map(); for (const h of spots) count.set(h.product, (count.get(h.product) || 0) + 1);
    $('#pn-pCount').textContent = prodQ.trim() ? `${plural(list.length, 'produto encontrado', 'produtos encontrados')} de ${all}` : plural(all, 'produto', 'produtos');
    // Blocos de resumo: áreas contadas como vão ficar depois de publicar (publicadas + preparadas)
    const withSpots = new Set(spots.filter((h) => cats.some((c) => c.id === h.catalogId)).map((h) => h.catalogId)).size;
    const review = cats.filter((c) => c.reviewHotspots).length;
    $('#pn-pTiles').innerHTML = tileHtml('Produtos', all, 'cadastrados') + tileHtml('Áreas marcadas', spots.length, 'nas páginas dos catálogos')
      + tileHtml('Na página (sem área)', links.length, 'produtos ligados a páginas, esperando a área')
      + tileHtml('Catálogos com áreas', withSpots, `de ${plural(cats.length, 'catálogo', 'catálogos')}`)
      + tileHtml('<span class="badge">Conferir</span>', review, review ? 'catálogos com o número de páginas alterado' : 'nada para conferir', review ? 'navy' : '');
    keepFocus(() => {
      wrap.innerHTML = list.length ? `<div class="list-card">
        <div class="rows-head prod-grid" aria-hidden="true"><span>SKU</span><span>Produto</span><span>Categoria</span><span>Áreas marcadas</span><span></span></div>
        <ul class="rows" aria-label="Produtos">${list.map((p) => `<li class="rw prod-grid" data-row="${esc(p.sku)}">
          <div class="p-sku"><code>${esc(p.sku)}</code></div>
          <div class="p-name"><p class="rw-title">${esc(p.name)}</p>${prodMeta(p)}</div>
          <div class="p-cat"><span class="cell-l">Categoria:</span> ${esc(p.category || '—')}</div>
          <div class="p-areas">${plural(count.get(p.sku) || 0, 'área', 'áreas')}${nLinks.get(p.sku) ? `<br><span class="rw-meta">${plural(nLinks.get(p.sku), 'página sem área', 'páginas sem área')}</span>` : ''}</div>
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
    const nl = viewLinks().filter((l) => l.product === p.sku).length;
    const areas = (n ? ` ${plural(n, 'área marcada', 'áreas marcadas')} nas páginas dos catálogos também ${n === 1 ? 'sai' : 'saem'}.` : '')
      + (nl ? ` ${plural(nl, 'ligação a página (sem área) também sai', 'ligações a páginas (sem área) também saem')}.` : '');
    if (!(await confirmBox(`Remover “${p.name}”?`, `<p>O produto sai da busca do site.${areas}</p><p>Esta ação não pode ser desfeita.</p>`, 'Remover produto', true))) return;
    const ok = await publish('Removendo o produto', (d) => {
      withProd(d);
      delete d.products[p.sku];
      d.hotspots = d.hotspots.filter((h) => h.product !== p.sku);
      if (d.pageLinks) d.pageLinks = d.pageLinks.filter((l) => l.product !== p.sku);
      if (d.descartes) d.descartes = d.descartes.filter((k) => k.split('|')[2] !== p.sku);
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
    if (ed.pendLink && (ed.pendLink.catalogId !== c.id || ed.pendLink.page !== page)) ed.pendLink = null;
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
    const has = new Set([...viewSpots(), ...viewLinks()].filter((h) => h.catalogId === ed.cat).map((h) => h.page));
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
    const links = pageLinksHere();
    keepFocus(() => {
      list.innerHTML = linksHtml(links) + (spots.length ? spots.map((h) => `<li class="${h.id === ed.sel ? 'sel' : ''}" data-row="${esc(h.id)}">
        <button type="button" class="hs-pick" data-k="sel" data-sa="sel" aria-pressed="${h.id === ed.sel}"><b>${esc(prodName(h.product))}</b><span>${esc(h.product)}${isImage(h) ? ' · imagem do produto' : ''}${stagedSpots.has(h.id) ? ' · não publicada' : ''}</span></button>
        <div class="actions"><button class="btn ghost sm" type="button" data-k="del" data-sa="del" aria-label="Remover a área de ${esc(prodName(h.product))}">Remover área</button></div>
        <details class="hs-menu"><summary>Mais opções</summary><div class="actions">
          <button class="btn ghost sm" type="button" data-k="prod" data-sa="prod">Trocar produto</button>
          <button class="btn ghost sm" type="button" data-k="img" data-sa="img" ${isImage(h) ? 'disabled' : ''}>Usar esta área como imagem do produto</button>
        </div></details>
      </li>`).join('') : links.length ? '' : '<li class="muted">Nenhuma área nesta página. Arraste sobre a página para marcar a primeira.</li>');
    });
    const s = ed.sel && spots.find((h) => h.id === ed.sel);
    $('#pn-hsStatus').textContent = ed.pendLink ? `Arraste sobre a foto de “${prodName(ed.pendLink.product)}” para marcar a área (Esc cancela).`
      : s ? `Selecionada: ${prodName(s.product)} · posição ${pct(s.x)}% × ${pct(s.y)}% · tamanho ${pct(s.width)}% × ${pct(s.height)}%`
      : plural(spots.length, 'área nesta página', 'áreas nesta página') + (links.length ? ` · ${plural(links.length, 'produto sem área', 'produtos sem área')}` : '');
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
    if (e.key === 'Escape' && ed.pendLink) { ed.pendLink = null; paintSpots(); return; }
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
    const lb = e.target.closest('[data-la]');
    if (lb) { onLinkAction(lb.dataset.la, lb.closest('[data-link]').dataset.link); return; }
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
    // "Desenhar área" de um produto que já está na página (sem área): a área é dele, sem perguntar
    const pl = ed.pendLink;
    if (pl && pl.catalogId === ed.cat && pl.page === ed.page && ed.draft) {
      const h = { id: P.randHex(6), catalogId: ed.cat, page: ed.page, product: pl.product, ...ed.draft };
      ed.draft = null; ed.pendLink = null;
      saveSpot(h, true); focusStage();
      toast(`Área de “${prodName(h.product)}” marcada. Ela substitui a ligação sem área.`);
      return;
    }
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
    // Área do mesmo produto na mesma página: a ligação sem área (pageLink) sai
    if (h && viewLinks().some((l) => linkKey(l) === linkKey(h))) { stagedLinks.set(linkKey(h), null); recount = true; }
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

  /* ================= base de produtos (planilha mestre) e marcação automática =================
     A planilha é lida 100% neste computador: o .xlsx é descompactado aqui (diretório central do ZIP + DecompressionStream)
     e nada é enviado para fora; os dados só saem cifrados, na publicação normal (produtos.bin / cofre).
     Cofre: products[SKU].ficha (P.cleanFicha), pageLinks [{ catalogId, page, product, auto }] e descartes ["catálogo|página|SKU"]
     (sugestões recusadas; só no cofre, não vão para produtos.bin). */
  const XLS_MAX = 8 * 1048576;          // acima disso, erro amigável (a leitura é toda na memória)
  const ROWS_MAX = 20000;               // planilhas com mais linhas não são aceitas
  const DROPS_MAX = 5000;               // sugestões descartadas guardadas no cofre
  const MAPKEY = 'dm.admin.planilha';   // mapeamento de colunas escolhido na última importação (só os títulos das colunas, neste computador)
  // Campos da planilha: [chave, rótulo, títulos de coluna reconhecidos (sem acento, sem espaço, minúsculas)]
  const IMP_FIELDS = [
    ['grupo', 'Grupo (linha)', ['grupo', 'linha', 'categoria', 'familia']],
    ['sap', 'Código SAP', ['codigosap', 'codsap', 'sap', 'codigo', 'codigodoproduto']],
    ['nome', 'Nome do produto', ['nomedoproduto', 'nome', 'produto', 'descricaodoproduto', 'descricao']],
    ['med', 'Medidas da caixa unitária', ['medidascxunitaria', 'medidascaixaunitaria', 'medidasunitaria', 'medidas']],
    ['peso', 'Peso bruto (kg)', ['pesobruto', 'peso']],
    ['ean', 'EAN do produto', ['eanproduto', 'eanunitario', 'ean', 'gtin', 'codigodebarras']],
    ['cxUn', 'Caixa master (unidades)', ['cxmasterunid', 'caixamasterunid', 'unidadesporcaixa', 'cxmaster', 'caixamaster']],
    ['medCx', 'Medidas da caixa master', ['medidascxmaster', 'medidascaixamaster', 'medidasmaster']],
    ['cubagem', 'Cubagem da caixa master (m³)', ['cubagemcxmaster', 'cubagemcaixamaster', 'cubagem', 'volumem']],
    ['m1', 'Medida 1 (cm, para calcular a cubagem)', ['medida1', 'comprimento']],
    ['m2', 'Medida 2 (cm)', ['medida2', 'largura']],
    ['m3', 'Medida 3 (cm)', ['medida3', 'altura']],
    ['pesoCx', 'Peso da caixa master (kg)', ['pesocxmaster', 'pesocaixamaster', 'pesomaster']],
    ['eanCx', 'EAN da caixa master', ['eancxmaster', 'eancaixamaster', 'eanmaster', 'dun14', 'dun']],
    ['inmetro', 'INMETRO', ['inmetro']],
    ['anvisa', 'ANVISA', ['anvisa', 'registroanvisa', 'registromsanvisa']],
    ['ncm', 'NCM', ['ncm']]
  ];
  // Rótulos da ficha no painel: o SAP entra explicitamente (o site não mostra o SAP, então ele não está em P.FICHA_CAMPOS)
  const FICHA_LBL = new Map([['sap', 'Código SAP'], ...P.FICHA_CAMPOS.map(([k, l, u]) => [k, u ? `${l} (${u})` : l])]);
  const impKey = (s) => norm(s).replace(/[^a-z0-9]+/g, '');
  const isNA = (v) => /^(na|nao|naoaplicavel|naoseaplica|isento|semregistro)$/.test(impKey(v));
  let lastImport = null;    // { em, arquivo, problemas: [texto] } — "Ver problemas" (só nesta sessão)
  const scan = { props: [], ran: false, info: '' }; // sugestões da última varredura
  function resetImportState() { lastImport = null; scan.props = []; scan.ran = false; scan.info = ''; }

  /* ---------- produtos, ligações sem área e descartes: como vão ficar depois de publicar ---------- */
  function viewProducts() {
    const base = (vault && vault.products) || {};
    if (!stagedProds.size) return base;
    const out = { ...base };
    for (const [sku, rec] of stagedProds) { const cur = out[sku] || {}; out[sku] = { ...cur, sku, name: rec.name, category: rec.category || cur.category || '', ficha: rec.ficha || cur.ficha }; }
    return out;
  }
  const stagedNew = (sku) => stagedProds.has(sku) && !((vault && vault.products) || {})[sku];
  const viewData = () => ({ catalogs: vault.catalogs, products: viewProducts(), hotspots: vault.hotspots || [] });
  function viewLinks() {
    const out = ((vault && vault.pageLinks) || []).filter((l) => !stagedLinks.has(linkKey(l)));
    for (const l of stagedLinks.values()) if (l) out.push(l);
    return out;
  }
  const viewDrops = () => new Set([...((vault && vault.descartes) || []), ...stagedDrops]);
  function applyProdStaged(d) {
    if (!stagedProds.size) return;
    withProd(d);
    for (const [sku, rec] of stagedProds) {
      const cur = d.products[sku] || {};
      const p = { ...cur, sku, name: rec.name, category: rec.category || cur.category || '' }; // benefit, capacity, description, url e image ficam como estão
      if (rec.ficha) p.ficha = rec.ficha;
      d.products[sku] = p;
    }
    d.products = sortKeys(d.products);
  }
  function applyLinkStaged(d) {
    if (!stagedLinks.size) return;
    let list = Array.isArray(d.pageLinks) ? d.pageLinks : [];
    for (const [k, l] of stagedLinks) {
      list = list.filter((x) => linkKey(x) !== k);
      if (l && linkFits(d, l)) list.push({ catalogId: l.catalogId, page: l.page, product: l.product, auto: !!l.auto });
      else if (l) spotLost++;
    }
    d.pageLinks = list;
  }
  function applyDropStaged(d) {
    if (!stagedDrops.size) return;
    const all = new Set(Array.isArray(d.descartes) ? d.descartes : []);
    for (const k of stagedDrops) all.add(k);
    d.descartes = [...all].slice(-DROPS_MAX);
  }
  // Tira da barra o que não muda nada: produto igual ao publicado, ligação que já existe (ou já saiu) e descarte já guardado
  function pruneProdOps() {
    const prods = vault.products || {};
    for (const [sku, rec] of [...stagedProds]) { const cur = prods[sku]; if (cur && !diffProduct(cur, rec).length) stagedProds.delete(sku); }
    const saved = new Set(vault.descartes || []);
    for (const k of [...stagedDrops]) if (saved.has(k)) stagedDrops.delete(k);
  }
  function pruneLinkOps(vd) {
    const pub = new Set((vault.pageLinks || []).map(linkKey)), spots = new Set(viewSpots().map(linkKey));
    let lost = 0;
    for (const [k, l] of [...stagedLinks]) {
      if (l && (!linkFits(vd, l) || spots.has(k))) { stagedLinks.delete(k); if (!spots.has(k)) lost++; }
      else if (l ? pub.has(k) : !pub.has(k)) stagedLinks.delete(k);
    }
    return lost;
  }
  // Diferenças campo a campo (o dia da importação, "em", não conta)
  function diffProduct(cur, rec) {
    const out = [];
    if ((cur.name || '') !== (rec.name || '')) out.push(['Nome', cur.name || '', rec.name || '']);
    if ((cur.category || '') !== (rec.category || '') && rec.category) out.push(['Categoria', cur.category || '', rec.category]);
    const a = cur.ficha || {}, b = rec.ficha || {};
    const keys = [...new Set([...FICHA_LBL.keys(), ...Object.keys(a), ...Object.keys(b)])].filter((k) => k !== 'em');
    for (const k of keys) {
      const va = a[k] == null ? '' : String(a[k]), vb = b[k] == null ? '' : String(b[k]);
      if (va !== vb) out.push([FICHA_LBL.get(k) || k, va, vb]);
    }
    return out;
  }
  function prodMeta(p) {
    const parts = [viewImage(p.sku) && 'com imagem', p.ficha && 'com ficha técnica', stagedNew(p.sku) ? 'da planilha · não publicado' : stagedProds.has(p.sku) && 'ficha atualizada · não publicada'].filter(Boolean);
    return parts.length ? `<p class="rw-meta">${parts.join(' · ')}</p>` : '';
  }

  /* ---------- leitura do arquivo: ZIP (.xlsx) sem biblioteca e CSV ---------- */
  function zipDir(buf) {
    const u = new Uint8Array(buf), dv = new DataView(u.buffer, u.byteOffset, u.byteLength);
    let eo = -1;
    for (let i = u.length - 22; i >= 0 && i >= u.length - 22 - 65535; i--) if (dv.getUint32(i, true) === 0x06054b50) { eo = i; break; }
    if (eo < 0) throw userErr('Este arquivo não parece uma planilha .xlsx. Abra no Excel e salve como “Pasta de Trabalho do Excel (.xlsx)”.');
    const n = dv.getUint16(eo + 10, true);
    let off = dv.getUint32(eo + 16, true);
    if (off === 0xffffffff || n === 0xffff) throw userErr('Esta planilha usa um formato ZIP que não conseguimos ler aqui. Salve de novo como .xlsx ou como .csv.');
    const files = new Map();
    for (let i = 0; i < n && off + 46 <= u.length; i++) {
      if (dv.getUint32(off, true) !== 0x02014b50) break;
      const nl = dv.getUint16(off + 28, true), el = dv.getUint16(off + 30, true), cl = dv.getUint16(off + 32, true);
      files.set(td.decode(u.subarray(off + 46, off + 46 + nl)), { method: dv.getUint16(off + 10, true), csize: dv.getUint32(off + 20, true), lho: dv.getUint32(off + 42, true) });
      off += 46 + nl + el + cl;
    }
    return { u, dv, files };
  }
  async function zipText(z, name) {
    const e = z.files.get(name); if (!e) return '';
    const { u, dv } = z;
    if (e.lho + 30 > u.length || dv.getUint32(e.lho, true) !== 0x04034b50) throw userErr('A planilha parece danificada (não foi possível ler o conteúdo). Salve de novo no Excel e tente outra vez.');
    const start = e.lho + 30 + dv.getUint16(e.lho + 26, true) + dv.getUint16(e.lho + 28, true);
    const data = u.subarray(start, start + e.csize);
    if (e.method === 0) return td.decode(data);
    if (e.method !== 8) throw userErr('Esta planilha usa uma compressão que não conseguimos ler aqui. Salve de novo como .xlsx ou como .csv.');
    if (typeof DecompressionStream !== 'function') throw userErr('Este navegador não consegue abrir arquivos .xlsx. Atualize o navegador (Chrome, Edge ou Firefox recentes) ou salve a planilha como .csv.');
    const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return td.decode(new Uint8Array(await new Response(stream).arrayBuffer()));
  }
  function xmlDoc(text) {
    const d = new DOMParser().parseFromString(text, 'application/xml');
    if (d.getElementsByTagName('parsererror').length) throw userErr('A planilha tem um conteúdo que não conseguimos ler. Salve de novo no Excel e tente outra vez.');
    return d;
  }
  const tags = (el, name) => Array.from(el.getElementsByTagName(name));
  // Texto de uma célula/string compartilhada: todos os <t>, menos os de pronúncia (<rPh>)
  const runText = (el) => tags(el, 't').filter((t) => !t.parentNode || t.parentNode.nodeName !== 'rPh').map((t) => t.textContent).join('');
  // "AB12" → 27 (coluna, a partir de 0)
  const colIndex = (ref) => { let n = 0; for (const ch of String(ref)) { const c = ch.toUpperCase().charCodeAt(0); if (c < 65 || c > 90) break; n = n * 26 + c - 64; } return n - 1; };
  async function readXlsx(buf) {
    const z = zipDir(buf);
    let sheet = '';
    try { // primeira aba do workbook → arquivo da planilha (workbook.xml.rels)
      const first = xmlDoc(await zipText(z, 'xl/workbook.xml')).getElementsByTagName('sheet')[0];
      const rid = first && (first.getAttribute('r:id') || first.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id'));
      for (const r of tags(xmlDoc(await zipText(z, 'xl/_rels/workbook.xml.rels')), 'Relationship')) {
        if (rid && r.getAttribute('Id') === rid) { const t = r.getAttribute('Target') || ''; sheet = t.startsWith('/') ? t.slice(1) : 'xl/' + t.replace(/^\.\//, ''); }
      }
    } catch (e) { if (e.userMessage && !/danificada/.test(e.userMessage)) throw e; }
    if (!z.files.has(sheet)) sheet = [...z.files.keys()].filter((k) => /^xl\/worksheets\/[^/]+\.xml$/.test(k)).sort()[0] || '';
    if (!sheet) throw userErr('Não encontramos nenhuma aba com dados nesta planilha.');
    const shared = z.files.has('xl/sharedStrings.xml') ? tags(xmlDoc(await zipText(z, 'xl/sharedStrings.xml')), 'si').map(runText) : [];
    const rowsEl = tags(xmlDoc(await zipText(z, sheet)), 'row');
    if (rowsEl.length > ROWS_MAX) throw userErr(`Esta planilha tem ${plural(rowsEl.length, 'linha', 'linhas')}; o limite é ${ROWS_MAX.toLocaleString('pt-BR')}. Deixe só os produtos e tente de novo.`);
    const rows = [];
    for (const r of rowsEl) {
      const at = +r.getAttribute('r'), line = [];
      for (const c of tags(r, 'c')) {
        const ref = c.getAttribute('r'), i = ref ? colIndex(ref) : line.length, t = c.getAttribute('t');
        let v = '';
        if (t === 'inlineStr') { const is = c.getElementsByTagName('is')[0]; v = is ? runText(is) : ''; }
        else {
          const ve = c.getElementsByTagName('v')[0];
          v = ve ? ve.textContent : '';
          if (t === 's') v = shared[+v] || '';
          else if (t === 'e') v = ''; // #N/D, #REF!…
        }
        if (i < 0 || i > 16383) continue;
        while (line.length < i) line.push('');
        line[i] = String(v).trim();
      }
      // linhas puladas (atributo r): mantém a numeração da planilha para as mensagens
      if (at > 0) while (rows.length < at - 1) rows.push([]);
      rows.push(line);
    }
    return rows;
  }
  // CSV: UTF-8 (com ou sem BOM) ou, se vier do Excel antigo, Windows-1252; separador ; , ou tabulação
  function decodeText(buf) {
    const txt = new TextDecoder('utf-8').decode(buf);
    if (txt.indexOf(String.fromCharCode(65533)) < 0) return txt.charCodeAt(0) === 65279 ? txt.slice(1) : txt;
    try { return new TextDecoder('windows-1252').decode(buf); } catch (e) { return txt; }
  }
  function readCsv(text) {
    const first = text.slice(0, text.indexOf('\n') < 0 ? text.length : text.indexOf('\n'));
    const sep = [';', ',', '\t'].map((s) => [s, first.split(s).length]).sort((a, b) => b[1] - a[1])[0][0];
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
      if (ch === '"' && !cell.trim()) { q = true; continue; }
      if (ch === sep) { row.push(cell.trim()); cell = ''; continue; }
      if (ch === '\n') {
        row.push(cell.trim()); rows.push(row); row = []; cell = '';
        if (rows.length > ROWS_MAX) throw userErr(`Esta planilha tem mais de ${ROWS_MAX.toLocaleString('pt-BR')} linhas. Deixe só os produtos e tente de novo.`);
        continue;
      }
      if (ch !== '\r') cell += ch;
    }
    if (cell.trim() || row.length) { row.push(cell.trim()); rows.push(row); }
    return rows;
  }

  /* ---------- cabeçalho e mapeamento das colunas ---------- */
  function autoMap(head) {
    const keys = head.map(impKey), pairs = [];
    IMP_FIELDS.forEach(([f, , cands], fi) => keys.forEach((k, ci) => {
      if (!k) return;
      let best = 0;
      cands.forEach((c, i) => {
        const s = k === c ? 100 - i : c.length >= 4 && k.startsWith(c) ? 80 - i : c.length >= 4 && k.length >= 4 && c.startsWith(k) ? 70 - i : c.length >= 5 && k.includes(c) ? 60 - i : 0;
        if (s > best) best = s;
      });
      if (best) pairs.push({ f, fi, ci, s: best });
    }));
    pairs.sort((a, b) => b.s - a.s || a.ci - b.ci || a.fi - b.fi); // empate: a primeira coluna (ex.: duas colunas "NCM")
    const map = {}, used = new Set();
    for (const p of pairs) if (map[p.f] === undefined && !used.has(p.ci)) { map[p.f] = p.ci; used.add(p.ci); }
    return map;
  }
  // Linha de títulos: a que reconhece mais campos entre as 15 primeiras (nome e código contam mais)
  function findHead(rows) {
    let best = null;
    for (let i = 0; i < Math.min(rows.length, 15); i++) {
      const map = autoMap(rows[i] || []);
      const n = Object.keys(map).length + (map.nome !== undefined ? 2 : 0) + (map.sap !== undefined ? 1 : 0);
      if (n >= 4 && (!best || n > best.n)) best = { i, map, n };
    }
    return best;
  }
  // Mapeamento lembrado: título da coluna escolhida para cada campo ('' = não usar). Só vale se o título existir nesta planilha.
  function savedMap(head, map) {
    let s = null; try { s = JSON.parse(localStorage.getItem(MAPKEY) || 'null'); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') return map;
    const keys = head.map(impKey), out = { ...map };
    for (const [f] of IMP_FIELDS) {
      if (!(f in s)) continue;
      if (s[f] === '') { out[f] = -1; continue; }
      const i = keys.indexOf(s[f]); if (i >= 0) out[f] = i;
    }
    return out;
  }
  function saveMap(head, map) {
    const o = {}; for (const [f] of IMP_FIELDS) o[f] = map[f] >= 0 ? impKey(head[map[f]]) : '';
    try { localStorage.setItem(MAPKEY, JSON.stringify(o)); } catch (e) { /* sem armazenamento: só não lembra */ }
  }

  /* ---------- linha → ficha ---------- */
  // Número em formato brasileiro, com unidade junto: "15,5 kg", "0,160056 m³", "1.234,5", "22.4", "5.9E-2" (célula numérica do Excel).
  // Peso em gramas ("800 gr", "95 g") vira kg.
  function numBr(v) {
    let s = String(v == null ? '' : v).trim();
    if (!s || isNA(s)) return null;
    if (/^-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(s)) return Number(s);
    const g = /\d\s*(g|gr|grs|grama|gramas)\.?$/i.test(s) ? 1000 : 1;
    s = s.replace(/[^\d,.-]/g, '');
    if (!/\d/.test(s)) return null;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, '');
    const n = Number(s) / g;
    return isFinite(n) ? n : null;
  }
  // EAN: um ou mais códigos separados por barra; "Não aplicável" fica como texto (o site mostra a linha sem selo)
  function eanValue(raw, max) {
    const s = String(raw || '').trim();
    if (!s || /^-+$/.test(s)) return { v: '', bad: false };
    if (isNA(s)) return { v: s.slice(0, max), bad: false };
    const parts = s.split(/[/;|]+/).map((x) => x.replace(/\D/g, '')).filter(Boolean);
    if (parts.length && parts.every((x) => P.eanOk(x))) { const j = parts.join(' / '); return { v: j.length <= max ? j : parts[0], bad: false }; }
    return { v: '', bad: true, raw: s };
  }
  function rowFicha(get, hoje) {
    const ean = eanValue(get('ean'), 20), eanCx = eanValue(get('eanCx'), 40);
    const dims = [numBr(get('m1')), numBr(get('m2')), numBr(get('m3'))], fromDims = dims.every((x) => x > 0) ? dims[0] * dims[1] * dims[2] / 1e6 : 0; // cm → m³
    let cub = numBr(get('cubagem')), calc = false;
    if (!(cub > 0) && fromDims) { cub = Math.round(fromDims * 1e6) / 1e6; calc = true; }
    const f = P.cleanFicha({
      grupo: get('grupo'), sap: get('sap'), ean: ean.v, eanCx: eanCx.v, med: get('med'), medCx: get('medCx'),
      cxUn: numBr(get('cxUn')), peso: numBr(get('peso')), pesoCx: numBr(get('pesoCx')), cubagem: cub,
      inmetro: get('inmetro'), anvisa: get('anvisa'), ncm: get('ncm'), em: hoje
    });
    const diverge = !calc && cub > 0 && fromDims > 0 && Math.abs(cub - fromDims) / fromDims > 0.1;
    return { f, calc, ean, eanCx, diverge, cub, fromDims };
  }
  // Planilha + mapeamento → novos, atualizados, inalterados, linhas ignoradas e problemas (nada é gravado aqui)
  function analyseSheet(rows, headIdx, map) {
    const hoje = localDate(), prods = viewProducts();
    const bySap = new Map(), byEan = new Map(), byName = new Map();
    for (const p of Object.values(prods)) {
      const fi = p.ficha || {};
      for (const k of [P.skuKey(fi.sap), P.skuKey(p.sku)]) if (k && !bySap.has(k)) bySap.set(k, p.sku);
      const e = String(fi.ean || '').split('/')[0].replace(/\D/g, '');
      if (P.eanOk(e) && !byEan.has(e)) byEan.set(e, p.sku);
      const n = P.skuKey(p.name); if (n && !byName.has(n)) byName.set(n, p.sku);
    }
    const r = { novos: [], atualizados: [], inalterados: [], ignoradas: [], problemas: [], calculadas: 0, recs: new Map() };
    const seenSap = new Map(), seenSku = new Map();
    for (let i = headIdx + 1; i < rows.length; i++) {
      const row = rows[i] || [], ln = i + 1;
      const get = (f) => (map[f] >= 0 ? String(row[map[f]] == null ? '' : row[map[f]]).trim() : '');
      const sap = get('sap').replace(/\s+/g, ' '), nome = get('nome').replace(/\s+/g, ' ').slice(0, 120);
      if (!sap && !nome) {
        if (row.some((v) => String(v || '').trim())) r.ignoradas.push(`Linha ${ln}: ${get('grupo') ? `título do grupo “${get('grupo')}”` : 'sem código e sem nome'}`);
        continue;
      }
      if (!nome) { r.problemas.push(`Linha ${ln}: sem nome do produto (código ${sap}). A linha não foi importada.`); continue; }
      const x = rowFicha(get, hoje);
      const eanDig = x.ean.v.split('/')[0].replace(/\D/g, '');
      const sk = P.skuKey(sap);
      if (sk && seenSap.has(sk)) { r.problemas.push(`Linha ${ln}: código SAP ${sap} repetido (já está na linha ${seenSap.get(sk)}). Só a primeira linha foi importada.`); continue; }
      if (sk) seenSap.set(sk, ln);
      let sku = sk && bySap.get(sk) || (P.eanOk(eanDig) && byEan.get(eanDig)) || byName.get(P.skuKey(nome)) || '';
      const novo = !sku;
      if (novo) {
        if (!sk) { r.problemas.push(`Linha ${ln}: “${nome}” sem código SAP e sem produto cadastrado com o mesmo EAN ou nome. A linha não foi importada.`); continue; }
        sku = sap.slice(0, 40);
      }
      if (seenSku.has(sku)) { r.problemas.push(`Linha ${ln}: “${nome}” corresponde ao mesmo produto da linha ${seenSku.get(sku)} (${sku}). Só a primeira linha foi importada.`); continue; }
      seenSku.set(sku, ln);
      if (x.ean.bad) r.problemas.push(`Linha ${ln}: EAN do produto inválido (“${x.ean.raw}”) em “${nome}”. O EAN ficou de fora.`);
      if (x.eanCx.bad) r.problemas.push(`Linha ${ln}: EAN da caixa master inválido (“${x.eanCx.raw}”) em “${nome}”. Ficou de fora.`);
      if (x.diverge) r.problemas.push(`Linha ${ln}: cubagem de “${nome}” (${x.cub.toLocaleString('pt-BR')} m³) difere mais de 10% das medidas (${(Math.round(x.fromDims * 1e6) / 1e6).toLocaleString('pt-BR')} m³).`);
      if (x.calc) r.calculadas++;
      const rec = { sku, name: nome, category: get('grupo').slice(0, 60), ficha: x.f, ln, calc: x.calc };
      const cur = prods[sku];
      if (novo) { rec.orig = nome; rec.name = readableName(nome); rec.mk = modelTokens(nome); r.novos.push(rec); r.recs.set(sku, rec); continue; }
      // Produto que já existia: nome e categoria cuidados no painel prevalecem; a planilha só preenche o que estiver vazio e a ficha
      rec.name = String(cur.name || '').trim() || rec.name;
      rec.category = String(cur.category || '').trim() || rec.category;
      const dif = diffProduct(cur, rec);
      if (dif.length) { r.atualizados.push({ rec, dif }); r.recs.set(sku, rec); } else r.inalterados.push(rec);
    }
    r.pares = modelPairs(prods, seenSku, r.novos);
    return r;
  }
  /* Casamento por MODELO (depois de SAP, EAN e nome; antes de criar produto novo).
     Tokens de modelo: palavras com dígito (d40, d100, t40…) e as que vêm logo depois e mudam o modelo (pop, light, g, m…).
     Candidato: produto do painel SEM ficha.sap, ainda não casado nesta importação, cujos tokens batem exatamente com os da linha.
     Sem nenhum exato: linhas que contêm todos os tokens do produto ("D100" → D100 POP, D100 LIGHT), sem nada marcado. */
  const MODEL_MOD = new Set(['pop', 'light', 'lite', 'plus', 'max', 'pro', 'slim', 'mini', 'top', 'flex', 'premium', 'basic', 'manual', 'eletrica', 'eletrico', 'digital',
    'infantil', 'adulto', 'g', 'gg', 'm', 'p', 'pp', 'xg', 'xgg', 'eg', 'egg', 'u', 'pm', 'gm']);
  function modelTokens(name) {
    const w = foldTerm(name).split(' ').filter(Boolean), out = [];
    for (let i = 0; i < w.length; i++) {
      if (!/\d/.test(w[i])) continue;
      out.push(w[i]);
      for (let j = i + 1; j < w.length && !/\d/.test(w[j]) && MODEL_MOD.has(w[j]); j++) out.push(w[j]);
    }
    return [...new Set(out)].sort();
  }
  function modelPairs(prods, seenSku, novos) {
    const pares = [];
    for (const p of Object.values(prods)) {
      if ((p.ficha && p.ficha.sap) || seenSku.has(p.sku)) continue;
      const mk = modelTokens(p.name); if (!mk.length) continue;
      const key = mk.join(' ');
      let cands = novos.filter((x) => x.mk.join(' ') === key), exact = true;
      if (!cands.length) { cands = novos.filter((x) => mk.every((t) => x.mk.includes(t))); exact = false; }
      if (cands.length) pares.push({ p, cands: cands.slice(0, 20), exact });
    }
    // Vem marcado só quando é exato, único e a linha não é candidata de outro produto
    const uses = new Map(); for (const pr of pares) for (const c of pr.cands) uses.set(c.ln, (uses.get(c.ln) || 0) + 1);
    for (const pr of pares) pr.pre = pr.exact && pr.cands.length === 1 && uses.get(pr.cands[0].ln) === 1 ? pr.cands[0].ln : 0;
    return pares;
  }
  // Nome em MAIÚSCULAS → legível ("COLAR CERVICAL - G" → "Colar Cervical - G"); tokens com dígito, siglas e tamanhos ficam como estão
  const SIGLAS = new Set(['POP', 'LED', 'USB', 'PVC', 'EVA', 'LCD', 'TENS', 'ABS', 'PU', 'UV', 'DC', 'AC', 'PP', 'P', 'M', 'G', 'GG', 'XG', 'XGG', 'EG', 'EGG', 'U', 'PM', 'GM', 'EVA', 'SMS', 'TNT', 'ANVISA', 'INMETRO', 'II', 'III', 'IV']);
  const MINUSC = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'com', 'para', 'em', 'a', 'o', 'as', 'os', 'sem', 'por', 'na', 'no', 'ao']);
  function readableName(s) {
    s = String(s || '').trim();
    if (!s || /[a-zà-ÿ]/.test(s)) return s; // já tem minúsculas: fica como está
    let first = true;
    return s.replace(/[\p{L}\p{N}]+/gu, (w) => {
      const low = w.toLocaleLowerCase('pt-BR'), was = first; first = false;
      if (/\d/.test(w) || SIGLAS.has(w)) return w;
      if (!was && MINUSC.has(low)) return low;
      return low.charAt(0).toLocaleUpperCase('pt-BR') + low.slice(1);
    });
  }

  /* ---------- fluxo: arquivo → conferência do mapeamento → resumo → barra de alterações ---------- */
  async function importFile(file) {
    if (!vault || !file) return;
    if (busy) { toast('Espere a publicação terminar.'); return; }
    const name = file.name || 'planilha';
    const isX = /\.xlsx$/i.test(name) || /spreadsheetml/.test(file.type || ''), isCsv = !isX && (/\.csv$/i.test(name) || /csv/.test(file.type || ''));
    if (!isX && !isCsv) { alertBox('Formato não aceito', 'Escolha a planilha em .xlsx (Excel) ou .csv. Arquivos .xls antigos: abra no Excel e salve como .xlsx.'); return; }
    if (file.size > XLS_MAX) { alertBox('Planilha grande demais', `Este arquivo tem ${mb(file.size)} MB e o limite é 8 MB. Salve só a aba de produtos (sem imagens) e tente de novo.`); return; }
    let rows;
    try { const buf = await file.arrayBuffer(); rows = isX ? await readXlsx(buf) : readCsv(decodeText(buf)); }
    catch (e) { console.error(e); alertBox('Não foi possível ler a planilha', e.userMessage || 'Confira se o arquivo abre normalmente no Excel e tente de novo.'); return; }
    if (!vault) return;
    const head = findHead(rows);
    if (!head) { alertBox('Cabeçalho não encontrado', 'Não achamos a linha com os títulos das colunas (por exemplo “Código SAP” e “Nome do Produto”) nas primeiras linhas da planilha.'); return; }
    mapDialog(name, rows, head.i, savedMap(rows[head.i], head.map));
  }
  function mapDialog(name, rows, hi, map) {
    const head = rows[hi], nData = rows.slice(hi + 1).filter((r) => r.some((v) => String(v || '').trim())).length;
    const colName = (h, i) => `${h ? h : '(sem título)'} · coluna ${i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26))}`;
    const opts = (sel) => `<option value="-1"${!(sel >= 0) ? ' selected' : ''}>não usar</option>` + head.map((h, i) => (h ? `<option value="${i}"${sel === i ? ' selected' : ''}>${esc(colName(h, i))}</option>` : '')).join('');
    openDialog({
      title: 'Conferir as colunas da planilha',
      body: `<p class="muted"><b>${esc(name)}</b> · títulos na linha ${hi + 1} · ${plural(nData, 'linha de dados', 'linhas de dados')}. A leitura foi feita neste computador; nada foi enviado.</p>
        <p class="muted">Confira de qual coluna vem cada campo e corrija se precisar. “Não usar” deixa o campo de fora. Sua escolha fica lembrada para a próxima importação.</p>
        <div class="imp-map" id="pn-impMap">${IMP_FIELDS.map(([f, label]) => `<label class="field"><span class="field-label">${esc(label)}</span><select data-imp="${f}">${opts(map[f])}</select></label>`).join('')}</div>`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Ver o resumo', kind: 'primary',
        onClick: () => {
          const m = {}; $$('#pn-impMap select', dlg).forEach((s) => { m[s.dataset.imp] = +s.value; });
          if (!(m.nome >= 0)) { dlgErr('Escolha a coluna do nome do produto.'); return false; }
          if (!(m.sap >= 0)) { dlgErr('Escolha a coluna do código SAP (ele identifica cada produto).'); return false; }
          saveMap(head, m);
          summaryDialog(name, analyseSheet(rows, hi, m));
          return true;
        }
      }]
    });
  }
  const impList = (arr, fn) => `<ul class="imp-list">${arr.slice(0, 500).map(fn).join('')}${arr.length > 500 ? `<li>… e mais ${(arr.length - 500).toLocaleString('pt-BR')}.</li>` : ''}</ul>`;
  const impSec = (title, arr, fn, open) => (arr.length ? `<details${open ? ' open' : ''}><summary><span>${title}</span><span class="imp-n">${arr.length.toLocaleString('pt-BR')}</span></summary>${impList(arr, fn)}</details>` : '');
  const shortVal = (v) => esc(v === '' ? '—' : v.length > 60 ? v.slice(0, 60) + '…' : v);
  // Um par "Produto do painel ↔ linha da planilha": seletor com "São diferentes" e "É o mesmo produto" (uma opção por linha candidata)
  const rowLabel = (c) => `linha ${c.ln} · ${c.orig || c.name} · SAP ${c.sku}`;
  function pairHtml(pr, i) {
    const one = pr.cands.length === 1;
    return `<li><b>${esc(pr.p.name)}</b> · SKU ${esc(pr.p.sku)} (no painel)${one ? `<span class="imp-dif">↔ ${esc(rowLabel(pr.cands[0]))}</span>` : `<span class="imp-dif">↔ ${plural(pr.cands.length, 'linha parecida', 'linhas parecidas')} na planilha: escolha a certa</span>`}
      <select class="input" data-par="${i}" aria-label="${esc(pr.p.name)}: é o mesmo produto da planilha?">
        <option value="0"${pr.pre ? '' : ' selected'}>São diferentes</option>
        ${pr.cands.map((c) => `<option value="${c.ln}"${pr.pre === c.ln ? ' selected' : ''}>${one ? 'É o mesmo produto' : `É o mesmo produto: ${esc(rowLabel(c))}`}</option>`).join('')}
      </select></li>`;
  }
  function summaryDialog(name, r) {
    const nWrite = r.novos.length + r.atualizados.length;
    const candLn = new Set(r.pares.flatMap((pr) => pr.cands.map((c) => c.ln)));
    openDialog({
      title: 'Resumo da importação',
      body: `<p class="muted"><b>${esc(name)}</b>: ${plural(r.novos.length, 'produto novo', 'produtos novos')}, ${plural(r.atualizados.length, 'atualizado', 'atualizados')}, ${plural(r.inalterados.length, 'sem mudança', 'sem mudança')}, ${plural(r.ignoradas.length, 'linha ignorada', 'linhas ignoradas')} e ${plural(r.problemas.length, 'problema', 'problemas')}.${r.calculadas ? ` ${plural(r.calculadas, 'cubagem foi calculada', 'cubagens foram calculadas')} pelas medidas 1, 2 e 3.` : ''}${r.pares.length ? ` <b>Confira ${plural(r.pares.length, 'possível correspondência', 'possíveis correspondências')}</b>: o que for “o mesmo produto” atualiza o produto do painel em vez de criar outro.` : ''}</p>
        <div class="imp-sum" id="pn-impSum">
          ${impSec('Possíveis correspondências', r.pares, pairHtml, true)}
          ${impSec('Produtos novos', r.novos, (x) => `<li><b>${esc(x.name)}</b> · SKU ${esc(x.sku)}${x.category ? ` · ${esc(x.category)}` : ''}${x.calc ? ' · cubagem calculada' : ''}${candLn.has(x.ln) ? ' · possível correspondência (acima)' : ''}${x.orig && x.orig !== x.name ? `<span class="imp-dif">Na planilha: ${esc(x.orig)}</span>` : ''}</li>`, !r.atualizados.length && !r.pares.length)}
          ${impSec('Atualizados', r.atualizados, (x) => `<li><b>${esc(x.rec.name)}</b> · SKU ${esc(x.rec.sku)}${x.dif.map(([k, a, b]) => `<span class="imp-dif">${esc(k)}: ${shortVal(a)} → ${shortVal(b)}</span>`).join('')}</li>`, true)}
          ${impSec('Sem mudança', r.inalterados, (x) => `<li>${esc(x.name)} · SKU ${esc(x.sku)}</li>`)}
          ${impSec('Linhas ignoradas', r.ignoradas, (t) => `<li>${esc(t)}</li>`)}
          ${impSec('Problemas', r.problemas, (t) => `<li>${esc(t)}</li>`, r.problemas.length > 0 && !nWrite)}
        </div>
        <p class="muted">${nWrite ? 'Ao confirmar, os produtos entram na barra de alterações e vão para o site quando você publicar. Benefício, capacidade, descrição, URL, imagem e áreas marcadas continuam como estão.' : 'Nada muda: a planilha é igual ao que já está cadastrado.'}</p>`,
      actions: [{ label: 'Cancelar', kind: 'ghost' }, {
        label: 'Confirmar importação', kind: 'primary',
        onClick: () => {
          // "É o mesmo produto": a linha atualiza o produto do painel (sku, nome, categoria, áreas e textos ficam; entra a ficha com o SAP)
          const joins = [], used = new Map();
          for (const s of $$('#pn-impSum select[data-par]', dlg)) {
            const ln = +s.value; if (!ln) continue;
            const pr = r.pares[+s.dataset.par], c = pr.cands.find((x) => x.ln === ln); if (!c) continue;
            if (used.has(ln)) { dlgErr(`A linha ${ln} foi escolhida para dois produtos (“${used.get(ln)}” e “${pr.p.name}”). Deixe só um.`); return false; }
            used.set(ln, pr.p.name); joins.push({ p: pr.p, c });
          }
          for (const { p, c } of joins) {
            r.recs.delete(c.sku);
            stagedProds.set(p.sku, { sku: p.sku, name: p.name, category: p.category || c.category, ficha: c.ficha });
          }
          for (const [sku, rec] of r.recs) stagedProds.set(sku, { sku, name: rec.name, category: rec.category, ficha: rec.ficha });
          lastImport = { em: new Date().toISOString(), arquivo: name, problemas: r.problemas.slice() };
          refreshStage();
          if (tab === 'prods') renderProds();
          const n = r.recs.size + joins.length;
          toast(n ? `${plural(n, 'produto entrou', 'produtos entraram')} na barra de alterações${joins.length ? ` (${plural(joins.length, 'unido a produto do painel', 'unidos a produtos do painel')})` : ''}. Publique para levar ao site.` : 'Nada para importar: a planilha é igual ao cadastro.');
          return true;
        }
      }]
    });
  }
  function problemsDialog() {
    const pr = (lastImport && lastImport.problemas) || [];
    openDialog({
      title: 'Pendências da última importação',
      body: `<p class="muted">${esc(lastImport ? lastImport.arquivo : '')} · ${fmtDateTime(lastImport ? lastImport.em : new Date().toISOString())}. Corrija na planilha e importe de novo.</p>${pr.length ? impList(pr, (t) => `<li>${esc(t)}</li>`) : '<p class="muted">Nenhum problema.</p>'}`,
      actions: [{ label: 'Fechar', kind: 'primary' }]
    });
  }
  function baseCardHtml() {
    const withF = Object.values(viewProducts()).filter((p) => p.ficha && typeof p.ficha === 'object');
    const last = withF.map((p) => p.ficha.em || '').filter(Boolean).sort().pop() || '';
    const nPr = lastImport ? lastImport.problemas.length : 0;
    return `<section class="card stack imp-card" id="pn-baseCard" aria-labelledby="pn-baseH">
      <div class="imp-head"><h2 id="pn-baseH">Base de produtos</h2>
        <p class="imp-state" id="pn-baseInfo">${withF.length ? `Base de produtos: <b>${plural(withF.length, 'item', 'itens')}</b>${last ? ` · atualizada em ${fmtDate(last).slice(0, 5)}` : ''}` : 'Nenhuma planilha importada ainda.'}</p></div>
      <p class="muted">Importe a planilha mestre (.xlsx ou .csv) para criar os produtos e preencher a ficha técnica de cada um. A leitura é feita neste computador; nada é enviado antes de você conferir e publicar.</p>
      <div class="drop sm" id="pn-xlsDrop" role="button" tabindex="0" aria-label="Importar a planilha de produtos (.xlsx ou .csv)">
        <span class="drop-ico" aria-hidden="true">${ICO.upload}</span><b>Arraste a planilha aqui</b><span class="muted">ou clique para escolher o arquivo .xlsx (ou .csv), até 8 MB.</span>
      </div>
      ${nPr ? `<div class="row"><button class="btn ghost sm" type="button" id="pn-baseProblems">Ver problemas (${nPr.toLocaleString('pt-BR')})</button></div>` : ''}
    </section>`;
  }
  function pickSheet() { if (busy) return; $('#pn-xlsInput').value = ''; $('#pn-xlsInput').click(); }
  $('#pn-xlsInput').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) importFile(f); });
  function bindBaseCard() {
    const drop = $('#pn-xlsDrop'); if (!drop) return;
    drop.addEventListener('click', pickSheet);
    drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickSheet(); } });
    drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('over'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault(); e.stopPropagation(); drop.classList.remove('over');
      const f = [...((e.dataTransfer && e.dataTransfer.files) || [])][0];
      if (f) importFile(f);
    });
    const pb = $('#pn-baseProblems'); if (pb) pb.addEventListener('click', problemsDialog);
  }

  /* ---------- marcação automática: procura SAP, EAN e nome no texto das páginas ---------- */
  // Texto das páginas (busca.bin do catálogo, ou o texto que ficou na memória depois de converter o PDF)
  const searchKey = (c) => `${c.id}:${c.v || 1}:${catKeyB64(c).slice(0, 12)}`;
  function keepTexts(c, texts) { if (c && Array.isArray(texts)) searchCache.set(searchKey(c), Promise.resolve(texts)); }
  function searchPages(c) {
    if (Array.isArray(c.texts)) return Promise.resolve(c.texts); // catálogo antigo: texto ainda dentro do cofre
    const k = searchKey(c);
    if (!searchCache.has(k)) {
      const p = (async () => {
        const enc = await repo.read(P.path.search(c.id));
        if (!enc || !vault) return null;
        return P.openSearch(await P.aesKey(P.b64d(catKeyB64(c)), ['decrypt']), c, enc);
      })();
      p.catch(() => { if (searchCache.get(k) === p) searchCache.delete(k); });
      searchCache.set(k, p);
    }
    return searchCache.get(k);
  }
  // Texto simplificado (sem acento, minúsculas, pontuação vira espaço, espaços juntos) com a posição de cada letra no original
  const foldCache = new Map();
  function foldChar(ch) {
    const c = ch.charCodeAt(0);
    if ((c >= 97 && c <= 122) || (c >= 48 && c <= 57)) return ch;
    if (c >= 65 && c <= 90) return String.fromCharCode(c + 32);
    if (c < 128) return ' ';
    let v = foldCache.get(ch);
    if (v === undefined) { const b = ch.normalize('NFD').charAt(0).toLowerCase(), bc = b.charCodeAt(0); v = (bc >= 97 && bc <= 122) || (bc >= 48 && bc <= 57) ? b : ' '; foldCache.set(ch, v); }
    return v;
  }
  function foldMap(raw) {
    let s = ' ', sp = true; const idx = [-1];
    for (let i = 0; i < raw.length; i++) {
      const ch = foldChar(raw[i]);
      if (ch === ' ') { if (sp) continue; sp = true; } else sp = false;
      s += ch; idx.push(i);
    }
    if (!sp) { s += ' '; idx.push(raw.length); }
    return { s, idx };
  }
  const foldTerm = (t) => foldMap(String(t || '')).s.trim();
  // Termos de cada produto: código SAP e EAN (confiança alta) e o nome completo com 6+ letras (confiança média)
  function scanTerms(prods) {
    const codes = [], names = [];
    for (const p of prods) {
      const f = p.ficha || {};
      const sap = foldTerm(f.sap);
      if (sap && /\d/.test(sap) && sap.replace(/ /g, '').length >= 5) codes.push({ sku: p.sku, t: sap, why: `código SAP ${f.sap}` });
      for (const e of String(f.ean || '').split('/').map((x) => x.replace(/\D/g, '')).filter((x) => P.eanOk(x))) {
        codes.push({ sku: p.sku, t: e, why: `EAN ${e}`, ean: true });
        if (e.length === 13) codes.push({ sku: p.sku, t: `${e[0]} ${e.slice(1, 7)} ${e.slice(7)}`, why: `EAN ${e}` }); // como aparece sob o código de barras
      }
      const nm = foldTerm(p.name);
      if (nm.replace(/ /g, '').length >= 6) names.push({ sku: p.sku, t: nm, why: 'nome completo' });
    }
    return { codes, names };
  }
  const allAt = (s, t, max = 30) => { const out = []; let i = s.indexOf(t); while (i >= 0 && out.length < max) { out.push(i); i = s.indexOf(t, i + 1); } return out; };
  function snippetHtml(raw, a, b) {
    const x = Math.max(0, a - 50), y = Math.min(raw.length, b + 50), sq = (s) => esc(s.replace(/\s+/g, ' '));
    return `${x > 0 ? '…' : ''}${sq(raw.slice(x, a))}<mark>${sq(raw.slice(a, b))}</mark>${sq(raw.slice(b, y))}${y < raw.length ? '…' : ''}`;
  }
  // Uma página: códigos primeiro; nome só se nenhum código do produto bateu e se não estiver dentro do nome mais longo de outro produto
  // (ex.: “Cadeira de rodas D100” não conta onde está escrito “Cadeira de rodas D100 Light”)
  function pageMatches(raw, terms) {
    const { s, idx } = foldMap(raw), found = new Map();
    const hit = (t, conf, at, map) => ({ sku: t.sku, conf, why: t.why, a: map[at + 1], b: map[at + t.t.length] + 1 });
    // Mesmo texto com os números que o PDF quebrou com espaço juntados ("79086073107 08" → "7908607310708"), só para os EAN
    let sd = null, idd = null;
    const joined = () => {
      if (sd === null) {
        sd = ''; idd = [];
        for (let i = 0; i < s.length; i++) {
          const dg = (k) => k >= 0 && k < s.length && s.charCodeAt(k) >= 48 && s.charCodeAt(k) <= 57;
          if (s[i] === ' ' && dg(i - 1) && dg(i + 1)) continue;
          sd += s[i]; idd.push(idx[i]);
        }
      }
      return sd;
    };
    for (const t of terms.codes) {
      if (found.has(t.sku)) continue;
      const at = s.indexOf(' ' + t.t + ' ');
      if (at >= 0) { found.set(t.sku, hit(t, 'alta', at, idx)); continue; }
      if (t.ean) { const aj = joined().indexOf(' ' + t.t + ' '); if (aj >= 0) found.set(t.sku, hit(t, 'alta', aj, idd)); }
    }
    // Nomes: todos entram na conferência de "nome dentro de nome mais longo", mesmo os de produtos já achados pelo código
    const occ = [];
    for (const t of terms.names) { const pos = allAt(s, ' ' + t.t + ' '); if (pos.length) occ.push({ t, pos }); }
    for (const o of occ) {
      if (found.has(o.t.sku)) continue;
      const free = o.pos.find((p) => !occ.some((q) => q !== o && q.t.t.length > o.t.t.length && q.pos.some((r) => r <= p && r + q.t.t.length >= p + o.t.t.length)));
      if (free !== undefined) found.set(o.t.sku, hit(o.t, 'media', free, idx));
    }
    return [...found.values()];
  }
  async function runScan() {
    if (!vault || busy) return;
    const prods = Object.values(viewProducts()), cats = viewCatalogs();
    if (!prods.length) { alertBox('Nenhum produto cadastrado', 'Importe a planilha de produtos (ou cadastre os produtos) antes de procurar nas páginas.'); return; }
    if (!cats.length) { alertBox('Nenhum catálogo', 'Adicione um catálogo antes de procurar os produtos nas páginas.'); return; }
    const terms = scanTerms(prods), names = new Map(prods.map((p) => [p.sku, p.name]));
    const skip = new Set([...viewSpots().map(linkKey), ...viewLinks().map(linkKey), ...viewDrops()]); // já marcado, já ligado ou descartado
    const pg = progressDialog('Procurando produtos nas páginas', true);
    const props = [], semTexto = []; let pages = 0, jaTem = 0;
    try {
      for (let ci = 0; ci < cats.length && !pg.cancelled; ci++) {
        const c = cats[ci];
        pg.set(`Catálogo ${ci + 1} de ${cats.length} · ${c.title} · abrindo o texto das páginas…`, ci / cats.length);
        let texts = null;
        try { texts = await searchPages(c); } catch (e) { console.error(e); }
        if (!vault) throw cancelErr();
        if (!Array.isArray(texts) || !texts.some((x) => String(x || '').trim())) { semTexto.push(c.title); continue; }
        const n = Math.min(texts.length, c.pages || texts.length);
        for (let i = 0; i < n; i++) {
          if (i % 8 === 0) { // devolve a vez à tela a cada 8 páginas
            pg.set(`Catálogo ${ci + 1} de ${cats.length} · ${c.title} · página ${i + 1} de ${n}`, (ci + i / n) / cats.length);
            await sleep(0);
            if (pg.cancelled) break;
            if (!vault) throw cancelErr();
          }
          const raw = String(texts[i] || ''); if (!raw.trim()) continue;
          pages++;
          for (const m of pageMatches(raw, terms)) {
            const key = linkKey({ catalogId: c.id, page: i + 1, product: m.sku });
            if (skip.has(key)) { jaTem++; continue; }
            props.push({ key, catalogId: c.id, cat: c.title, page: i + 1, sku: m.sku, name: names.get(m.sku) || m.sku, conf: m.conf, why: m.why, html: snippetHtml(raw, m.a, m.b) });
          }
        }
      }
    } catch (e) {
      if (!e.cancelled) { console.error(e); alertBox('Não foi possível terminar a procura', 'Confira a internet, clique em “Atualizar dados” e tente de novo.'); }
      pg.close(); return;
    }
    const cancelled = pg.cancelled;
    pg.close();
    scan.props = props; scan.ran = true;
    const nA = props.filter((p) => p.conf === 'alta').length;
    scan.info = `${cancelled ? 'Procura cancelada. ' : ''}${plural(pages, 'página lida', 'páginas lidas')} · ${plural(props.length, 'sugestão', 'sugestões')} (${nA.toLocaleString('pt-BR')} de confiança alta, ${(props.length - nA).toLocaleString('pt-BR')} média)${jaTem ? ` · ${plural(jaTem, 'já estava marcada ou descartada', 'já estavam marcadas ou descartadas')}` : ''}${semTexto.length ? ` · sem texto para ler: ${semTexto.join(', ')}` : ''}.`;
    if (tab === 'prods') renderScanBox();
  }
  function scanCardHtml() {
    return `<section class="card stack imp-card" id="pn-scanCard" aria-labelledby="pn-scanH">
      <div class="imp-head"><h2 id="pn-scanH">Marcação automática</h2><button class="btn ghost sm" type="button" id="pn-scanBtn">Encontrar produtos nas páginas</button></div>
      <p class="muted">Procura o código SAP, o EAN e o nome completo de cada produto no texto das páginas dos catálogos e sugere em quais páginas cada um aparece. Ao aceitar, o produto fica ligado à página sem área (o site mostra “N produtos nesta página”); depois, se quiser, desenhe a área sobre a foto no editor abaixo.</p>
      <div id="pn-scanBox"></div>
    </section>`;
  }
  function renderScanBox() {
    const box = $('#pn-scanBox'); if (!box) return;
    if (!scan.ran) { box.innerHTML = ''; return; }
    const props = scan.props, groups = new Map();
    for (const p of props) { if (!groups.has(p.catalogId)) groups.set(p.catalogId, []); groups.get(p.catalogId).push(p); }
    box.innerHTML = `<p class="muted" role="status">${esc(scan.info)}</p>${props.length ? `
      <div class="scan-acts"><button class="link" type="button" data-scan="all">Selecionar todas</button><button class="link" type="button" data-scan="high">Só as de confiança alta</button><button class="link" type="button" data-scan="none">Nenhuma</button></div>
      <div class="scan-groups" id="pn-scanList">${[...groups.values()].map((g) => `<fieldset class="scan-cat"><legend>${esc(g[0].cat)} · ${plural(g.length, 'sugestão', 'sugestões')}</legend><ul class="scan-list">
        ${g.sort((a, b) => a.page - b.page || a.name.localeCompare(b.name, 'pt-BR')).map((p) => `<li><label class="scan-it" data-key="${esc(p.key)}"><input type="checkbox" value="${esc(p.key)}" ${p.conf === 'alta' ? 'checked' : ''}>
          <span class="scan-t">Página ${p.page} · ${esc(p.name)} <span class="scan-conf ${p.conf}">${p.conf === 'alta' ? 'confiança alta' : 'confiança média'}</span></span>
          <span class="scan-s">SKU ${esc(p.sku)} · pelo ${esc(p.why)}</span>
          <span class="scan-s">${p.html}</span></label></li>`).join('')}
      </ul></fieldset>`).join('')}</div>
      <div class="scan-acts"><button class="btn primary sm" type="button" id="pn-scanAccept">Aceitar selecionadas</button><button class="btn ghost sm" type="button" id="pn-scanDrop">Descartar selecionadas</button><span class="muted" id="pn-scanSel" aria-live="polite"></span></div>` : ''}`;
    paintScanSel();
  }
  const scanChecked = () => $$('#pn-scanList input[type="checkbox"]:checked').map((i) => i.value);
  function paintScanSel() { const el = $('#pn-scanSel'); if (el) el.textContent = `${plural(scanChecked().length, 'selecionada', 'selecionadas')} de ${scan.props.length.toLocaleString('pt-BR')}`; }
  function bindScanCard() {
    const card = $('#pn-scanCard'); if (!card) return;
    $('#pn-scanBtn').addEventListener('click', runScan);
    card.addEventListener('change', (e) => { if (e.target.matches('#pn-scanList input')) paintScanSel(); });
    card.addEventListener('click', (e) => {
      const b = e.target.closest('[data-scan], #pn-scanAccept, #pn-scanDrop'); if (!b) return;
      if (b.dataset.scan) { $$('#pn-scanList input').forEach((i) => { const p = scan.props.find((x) => x.key === i.value); i.checked = b.dataset.scan === 'all' || (b.dataset.scan === 'high' && p && p.conf === 'alta'); }); paintScanSel(); return; }
      const keys = scanChecked();
      if (!keys.length) { toast('Selecione pelo menos uma sugestão.'); return; }
      if (b.id === 'pn-scanAccept') acceptScan(keys); else dropScan(keys);
    });
    renderScanBox();
  }
  // Aceitar: produto ligado à página SEM área (pageLink), na barra de alterações. Nada de retângulo automático.
  function acceptScan(keys) {
    const vd = { ...viewData(), hotspots: viewSpots() }, have = new Set(viewLinks().map(linkKey));
    let n = 0, first = null;
    for (const k of keys) {
      const p = scan.props.find((x) => x.key === k); if (!p) continue;
      const l = { catalogId: p.catalogId, page: p.page, product: p.sku, auto: true };
      if (!have.has(k) && linkFits(vd, l)) { stagedLinks.set(k, l); have.add(k); n++; if (!first) first = l; }
    }
    scan.props = scan.props.filter((x) => !keys.includes(x.key));
    refreshStage(); renderProdRows(); renderScanBox();
    if (first && $('#pn-hsEd')) { ed.cat = first.catalogId; ed.page = first.page; ed.sel = ''; ed.draft = null; renderEditor(); } // editor na primeira página aceita
    toast(n ? `${plural(n, 'produto ligado', 'produtos ligados')} às páginas (sem área), na barra de alterações.` : 'Essas sugestões já estavam ligadas às páginas.');
  }
  function dropScan(keys) {
    for (const k of keys) stagedDrops.add(k);
    scan.props = scan.props.filter((x) => !keys.includes(x.key));
    refreshStage(); renderScanBox();
    toast(`${plural(keys.length, 'sugestão descartada', 'sugestões descartadas')}: não ${keys.length === 1 ? 'será proposta' : 'serão propostas'} de novo depois de publicar.`);
  }

  /* ---------- produtos na página sem área, no editor: "Na página (sem área)" ---------- */
  const pageLinksHere = () => viewLinks().filter((l) => l.catalogId === ed.cat && l.page === ed.page);
  const linksHtml = (links) => links.map((l) => `<li data-link="${esc(linkKey(l))}"${ed.pendLink && linkKey(ed.pendLink) === linkKey(l) ? ' class="sel"' : ''}>
      <p class="hs-pick"><b>${esc(prodName(l.product))}</b><span>${esc(l.product)} · Na página (sem área)${stagedLinks.has(linkKey(l)) ? ' · não publicado' : ''}</span></p>
      <div class="actions"><button class="btn ghost sm" type="button" data-k="ldraw" data-la="draw">Desenhar área</button><button class="btn ghost sm" type="button" data-k="ldel" data-la="del" aria-label="Remover ${esc(prodName(l.product))} desta página">Remover</button></div>
    </li>`).join('');
  function onLinkAction(act, key) {
    const l = viewLinks().find((x) => linkKey(x) === key); if (!l) return;
    if (act === 'draw') { drawLink(l); return; }
    if ((vault.pageLinks || []).some((x) => linkKey(x) === key)) stagedLinks.set(key, null); else stagedLinks.delete(key);
    stagedDrops.add(key); // não volta a ser sugerido pela marcação automática
    if (ed.pendLink && linkKey(ed.pendLink) === key) ed.pendLink = null;
    refreshStage(); paintSpots(); renderProdRows(); focusStage();
    toast(`“${prodName(l.product)}” saiu desta página.`);
  }
  // "Desenhar área": editor na página certa, esperando o arraste; ao salvar, a área substitui a ligação (saveSpot)
  function drawLink(l) {
    const same = ed.cat === l.catalogId;
    ed.cat = l.catalogId; ed.page = l.page; ed.sel = ''; ed.draft = null; ed.pendLink = l;
    if (same && $('#pn-hsStage')) goPage(l.page); else renderEditor();
    ed.pendLink = l; paintSpots();
    const st = $('#pn-hsStage'); if (st) { st.scrollIntoView({ block: 'center' }); st.focus({ preventScroll: true }); }
    toast(`Arraste sobre a foto de “${prodName(l.product)}” para marcar a área.`);
  }

  /* ================= configurações ================= */
  function renderCfg() {
    const box = $('#pn-tabCfg'); if (!vault) return;
    const st = vault.settings || {}, hasR = !!(slots && slots.r), com = st.comercial || {};
    box.innerHTML = `${pageHead('cfg')}
      <div data-sb-warn-slot hidden></div>
      <div class="cfg-grid">
          <section class="card stack span2" id="pn-cfgUnify" aria-labelledby="pn-cfgUnifyH">${unifyCardHtml()}</section>
          <section class="card stack span2" id="pn-cfgCad" aria-labelledby="pn-cfgCadH"></section>
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
    bindCadCard($('#pn-cfgCad'));
    paintCadCard();
    paintSbWarn();
    if (sb && !secretsInfo) loadSecretsInfo();
  }

  /* ---------- Configurações: cartão "Cadastro de pessoas" (link do cadastro, aprovação automática e setores) ----------
     Cada setor salva sozinho (nome, perfil sugerido, ativo); a ordem é gravada na hora ao subir/descer. Setores não são apagados: desative. */
  const setorRoleOptions = (cur) => SETOR_ROLES.map((k) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${ROLE[k]}</option>`).join('');
  function setorRowHtml(s, i, n) {
    const id = esc(s.id), nm = esc(s.nome);
    return `<li class="set-row set-grid${s.ativo ? '' : ' off'}" data-set="${id}" data-row="set:${id}">
      <label class="field set-name"><span class="field-label set-lbl">Nome do setor</span><input data-f="nome" data-k="nome" maxlength="60" autocomplete="off" value="${nm}"></label>
      <label class="field set-papel"><span class="field-label set-lbl">Perfil sugerido</span><select data-f="papel" data-k="papel">${setorRoleOptions(s.papel)}</select></label>
      <div class="set-ativo"><span class="field-label set-lbl" aria-hidden="true">Ativo</span><label class="switch"><input type="checkbox" role="switch" data-f="ativo" data-k="ativo" aria-label="Setor ${nm} ativo no cadastro" ${s.ativo ? 'checked' : ''}><span></span></label></div>
      <div class="order set-order"><button class="mini" type="button" data-cad="up" data-k="up" aria-label="Subir ${nm}" ${i === 0 ? 'disabled' : ''}>${ICO.up}</button><button class="mini" type="button" data-cad="down" data-k="down" aria-label="Descer ${nm}" ${i === n - 1 ? 'disabled' : ''}>${ICO.down}</button></div>
      <div class="set-save"><button class="btn ghost sm" type="button" data-cad="save" data-k="save" disabled>Salvar</button><span class="set-msg" role="status"></span></div>
    </li>`;
  }
  function cadCardHtml() {
    const head = `<div class="card-head"><span class="card-ico" aria-hidden="true">${ICO.users}</span><h2 id="pn-cfgCadH">Cadastro de pessoas</h2></div>
      <p class="muted">Quem tem e-mail @dellamed.com.br pode pedir acesso pelo site. Os pedidos aparecem em Pessoas → Pedidos de acesso.</p>
      <div class="cad-link"><label class="field"><span class="field-label">Link do cadastro no site</span><input id="pn-cadLink" readonly value="${esc(CAD_LINK)}"></label><button class="btn ghost" type="button" id="pn-cadCopy" data-cad="copy">Copiar link</button></div>`;
    if (!sb) return `${head}<p class="muted">Entre com e-mail e senha (cartão “Acesso unificado”) para ver a aprovação automática e os setores.</p>`;
    if (cadMissing) return `${head}<div class="alert warn" role="status">${esc(MSG_CAD_SQL)}<div class="row"><button class="btn ghost sm" type="button" data-cad="reload">Tentar de novo</button></div></div>`;
    const retry = '<div class="row"><button class="btn ghost sm" type="button" data-cad="reload">Tentar de novo</button></div>';
    const auto = cadAuto === null
      ? (cadAutoErr ? `<div class="alert error" role="alert">${esc(cadAutoErr)}${retry}</div>` : '<p class="muted">Carregando…</p>')
      : `<div class="row"><span class="muted" id="pn-cadAutoState">${cadAuto ? 'Ligada' : 'Desligada'}</span><label class="switch"><input type="checkbox" role="switch" id="pn-cadAuto" aria-labelledby="pn-cadAutoH" aria-describedby="pn-cadAutoD" ${cadAuto ? 'checked' : ''}><span></span></label></div>`;
    const list = !setores
      ? (setoresErr ? `<div class="alert error" role="alert">${esc(setoresErr)}${retry}</div>` : '<p class="muted">Carregando os setores…</p>')
      : `${setores.length ? `<div class="set-head set-grid" aria-hidden="true"><span>Setor</span><span>Perfil sugerido</span><span>Ativo</span><span>Ordem</span><span></span></div>
        <ul class="set-list" id="pn-setList" aria-label="Setores">${setores.map((s, i) => setorRowHtml(s, i, setores.length)).join('')}</ul>` : '<div class="empty">Nenhum setor ainda. Adicione o primeiro abaixo.</div>'}
        <form class="set-add" id="pn-setAdd" novalidate>
          <label class="field" id="pn-fSetNew"><span class="field-label">Novo setor</span><input id="pn-setNewName" maxlength="60" autocomplete="off" placeholder="Ex.: Compras"><em class="err" hidden></em></label>
          <label class="field"><span class="field-label">Perfil sugerido</span><select id="pn-setNewPapel">${setorRoleOptions('interno')}</select></label>
          <button class="btn primary" type="submit" id="pn-setAddBtn">Adicionar setor</button>
        </form>`;
    return `${head}
      <ul class="sec-list"><li class="sec-row"><div><h3 id="pn-cadAutoH">Aprovação automática</h3><p class="muted" id="pn-cadAutoD">E-mails @dellamed.com.br confirmados entram sem aprovação, com o papel do setor. Recomendado deixar desligado.</p></div>${auto}</li></ul>
      <div class="stack"><div><h3>Setores</h3><p class="muted">Aparecem na tela de cadastro, nesta ordem. Cada setor sugere um perfil (nunca Administrador). Para tirar um setor do cadastro, desative: quem já está nele continua igual.</p></div>${list}</div>`;
  }
  // Redesenha o cartão sem perder o que foi digitado nos setores (linhas alteradas e o "Novo setor")
  function paintCadCard() {
    const card = $('#pn-cfgCad'); if (!card) return;
    card.dataset.on = String(!!sb);
    const drafts = $$('.set-row.dirty', card).map((li) => ({ id: li.dataset.set, nome: $('[data-f="nome"]', li).value, papel: $('[data-f="papel"]', li).value, ativo: $('[data-f="ativo"]', li).checked }));
    const newName = $('#pn-setNewName', card) ? $('#pn-setNewName', card).value : '', newPapel = $('#pn-setNewPapel', card) ? $('#pn-setNewPapel', card).value : '';
    keepFocus(() => { card.innerHTML = cadCardHtml(); });
    for (const d of drafts) {
      const li = $(`.set-row[data-set="${CSS.escape(d.id)}"]`, card); if (!li) continue;
      $('[data-f="nome"]', li).value = d.nome; $('[data-f="papel"]', li).value = d.papel; $('[data-f="ativo"]', li).checked = d.ativo;
      li.classList.add('dirty'); $('[data-cad="save"]', li).disabled = false;
    }
    if (newName && $('#pn-setNewName', card)) $('#pn-setNewName', card).value = newName;
    if (newPapel && $('#pn-setNewPapel', card)) $('#pn-setNewPapel', card).value = newPapel;
    if (sb && !cadMissing && ((cadAuto === null && !cadAutoErr && !cadAutoJob) || (!setores && !setoresErr && !setoresJob))) {
      Promise.all([loadCadAuto(), loadSetores()]).then(() => { if (tab === 'cfg') paintCadCard(); });
    }
  }
  function bindCadCard(card) {
    if (!card) return;
    card.addEventListener('click', (e) => {
      const b = e.target.closest('[data-cad]'); if (!b || b.disabled) return;
      const a = b.dataset.cad, li = b.closest('.set-row');
      if (a === 'copy') copyText($('#pn-cadLink'));
      else if (a === 'reload') { cadReset(); paintCadCard(); if (people) loadPeople().then(sbRepaint); }
      else if (a === 'save' && li) saveSetor(li, b);
      else if ((a === 'up' || a === 'down') && li) moveSetor(Number(li.dataset.set), a === 'up' ? -1 : 1);
    });
    const dirty = (e) => {
      const li = e.target.closest('.set-row'); if (!li || !e.target.dataset.f) return;
      li.classList.add('dirty'); $('[data-cad="save"]', li).disabled = false; $('.set-msg', li).textContent = '';
    };
    card.addEventListener('input', dirty);
    card.addEventListener('change', (e) => { if (e.target.matches('#pn-cadAuto')) saveCadAuto(e.target); else dirty(e); });
    card.addEventListener('submit', (e) => { if (e.target.matches('#pn-setAdd')) { e.preventDefault(); addSetor(); } });
  }
  async function saveCadAuto(input) {
    const on = input.checked;
    if (on && !(await confirmBox('Ligar a aprovação automática?', '<p>Quem se cadastrar com e-mail @dellamed.com.br e confirmar o e-mail entra na Prateleira sem passar pela sua aprovação, com o perfil sugerido pelo setor.</p><p>O recomendado é deixar desligado e aprovar cada pedido.</p>', 'Ligar'))) { input.checked = false; return; }
    input.disabled = true;
    try {
      const rows = await sbCall((t) => P.supa.update(t, 'ajustes_cadastro', 'id=eq.1', { aprovacao_automatica: on, atualizado_em: new Date().toISOString() }));
      if (!Array.isArray(rows) || !rows.length) throw userErr('Nada foi salvo: esta conta não pode alterar os ajustes do cadastro.');
      cadAuto = !!rows[0].aprovacao_automatica;
      toast(cadAuto ? 'Aprovação automática ligada.' : 'Aprovação automática desligada.');
    } catch (e) {
      console.error(e);
      input.checked = !on;
      if (cadMissingErr(e)) { cadMissing = true; paintCadCard(); }
      alertBox('Não foi possível salvar', cadErrText(e));
    } finally {
      if (input.isConnected) { input.disabled = false; const s = $('#pn-cadAutoState'); if (s) s.textContent = input.checked ? 'Ligada' : 'Desligada'; }
    }
  }
  const setorNameProblem = (nome, exceptId) => (nome.length < 2 ? 'Informe o nome do setor.'
    : (setores || []).some((x) => x.id !== exceptId && norm(x.nome) === norm(nome)) ? 'Já existe um setor com esse nome.' : '');
  async function saveSetor(li, btn) {
    const id = Number(li.dataset.set), s = (setores || []).find((x) => x.id === id); if (!s) return;
    const nome = $('[data-f="nome"]', li).value.trim().replace(/\s+/g, ' '), papel = $('[data-f="papel"]', li).value, ativo = $('[data-f="ativo"]', li).checked;
    const msg = $('.set-msg', li), prob = setorNameProblem(nome, id) || (SETOR_ROLES.includes(papel) ? '' : 'Escolha o perfil sugerido.');
    if (prob) { msg.textContent = prob; $('[data-f="nome"]', li).focus(); return; }
    btn.disabled = true; msg.textContent = 'Salvando…';
    try {
      const rows = await sbCall((t) => P.supa.update(t, 'setores', `id=eq.${id}`, { nome, papel, ativo }));
      if (!Array.isArray(rows) || !rows.length) throw userErr('Nada foi salvo: o setor não foi encontrado ou esta conta não pode alterar setores.');
      Object.assign(s, rows[0]);
    } catch (e) {
      console.error(e);
      if (li.isConnected) { btn.disabled = false; msg.textContent = setorErrText(e); }
      return;
    }
    if (!li.isConnected) return;
    li.classList.remove('dirty'); li.classList.toggle('off', !s.ativo);
    $('[data-f="nome"]', li).value = s.nome;
    msg.textContent = 'Salvo.';
    toast(`Setor “${s.nome}” salvo.`);
    if (tab === 'users') sbRepaint();
  }
  let setoresMoving = false;
  async function moveSetor(id, dir) {
    if (setoresMoving || !setores) return;
    const list = setores.slice(), i = list.findIndex((x) => x.id === id), j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    // Ordem em passos de 10; só grava os setores cuja ordem muda (normalmente os dois trocados)
    const changes = list.map((s, k) => ({ s, ordem: (k + 1) * 10 })).filter((c) => c.s.ordem !== c.ordem);
    setoresMoving = true;
    $$('#pn-setList [data-cad="up"], #pn-setList [data-cad="down"]').forEach((b) => { b.disabled = true; });
    try {
      for (const c of changes) {
        const rows = await sbCall((t) => P.supa.update(t, 'setores', `id=eq.${c.s.id}`, { ordem: c.ordem }));
        if (!Array.isArray(rows) || !rows.length) throw userErr('A ordem não foi salva: o setor não foi encontrado ou esta conta não pode alterar setores.');
        c.s.ordem = c.ordem;
      }
      toast('Ordem dos setores salva.');
    } catch (e) { console.error(e); alertBox('Não foi possível mudar a ordem', setorErrText(e)); }
    finally {
      setoresMoving = false;
      sortSetores();
      paintCadCard();
      const row = $(`#pn-setList [data-set="${id}"]`);
      if (row && !row.contains(document.activeElement)) { const b = $(`[data-cad="${dir < 0 ? 'up' : 'down'}"]:not(:disabled)`, row) || $('[data-cad]:not(:disabled)', row); if (b) b.focus(); }
    }
  }
  async function addSetor() {
    const f = $('#pn-fSetNew'), input = $('#pn-setNewName'), btn = $('#pn-setAddBtn');
    const nome = input.value.trim().replace(/\s+/g, ' '), papel = $('#pn-setNewPapel').value;
    const prob = setorNameProblem(nome, null);
    setFieldErr(f, prob);
    if (prob || !SETOR_ROLES.includes(papel)) { input.focus(); return; }
    const ordem = (setores || []).reduce((m, s) => Math.max(m, s.ordem || 0), 0) + 10;
    btn.disabled = true;
    let rows;
    try { rows = await sbCall((t) => P.supa.upsert(t, 'setores', { nome, papel, ordem, ativo: true }, 'nome')); }
    catch (e) { console.error(e); if (btn.isConnected) { btn.disabled = false; setFieldErr(f, setorErrText(e)); } return; }
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) { if (btn.isConnected) { btn.disabled = false; setFieldErr(f, 'Nada foi salvo: esta conta não pode criar setores.'); } return; }
    setores = (setores || []).filter((s) => s.id !== row.id).concat(row);
    sortSetores();
    if (input.isConnected) input.value = '';
    paintCadCard();
    toast(`Setor “${row.nome}” adicionado.`);
    const ni = $(`#pn-setList [data-set="${row.id}"] [data-f="nome"]`); if (ni) ni.focus();
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
