<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Healthsoft — Care Command Centre</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--navy:#0E172A;--orange:#EC8D20;--orange-lt:#FDF3E7;--green:#1A7A4A;--green-lt:#EEF8F2;--red:#C0392B;--red-lt:#FDF0F0;--amber:#D68910;--amber-lt:#FDF6E3;--indigo:#4F46E5;--indigo-lt:#EEF2FF;--border:#E2E8F0;--muted:#64748B;--text:#1E293B;--bg:#F5F7FA;--surface:#fff}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);font-size:13px;height:100vh;overflow:hidden}
button{font-family:inherit;cursor:pointer}
.toggle{position:relative;width:34px;height:18px;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0}
.slider{position:absolute;inset:0;background:#CBD5E1;border-radius:18px;cursor:pointer;transition:.2s}
.slider::before{content:'';position:absolute;width:12px;height:12px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s}
input:checked+.slider{background:var(--green)}
input:checked+.slider::before{transform:translateX(16px)}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)}
.toggle-row:last-child{border-bottom:none}
.toggle-label{font-size:11px;font-weight:600;color:var(--text)}
.toggle-sub{font-size:10px;color:var(--muted);margin-top:1px}
.shell{display:grid;grid-template-rows:48px 1fr;height:100vh}
.topbar{background:var(--navy);display:flex;align-items:center;justify-content:space-between;padding:0 16px;gap:12px}
.brand{font-family:'Sora',sans-serif;font-size:14px;color:#fff;font-weight:700}
.tb-sub{font-size:9px;color:rgba(255,255,255,.35);letter-spacing:1.5px;text-transform:uppercase}
.sys-health{display:flex;align-items:center;gap:14px}
.sys-node{display:flex;align-items:center;gap:5px;cursor:pointer}
.sys-dot{width:7px;height:7px;border-radius:50%}
.sys-dot.ok{background:#22C55E;animation:pulse 2s infinite}
.sys-dot.warn{background:var(--amber);animation:pulse 1.2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.sys-lbl{font-size:10px;color:rgba(255,255,255,.6);font-weight:600}
.sys-div{width:1px;height:14px;background:rgba(255,255,255,.1)}
.clock{font-size:11px;color:rgba(255,255,255,.6);font-weight:700;font-variant-numeric:tabular-nums}
.agent-av{width:26px;height:26px;border-radius:50%;background:var(--orange);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;cursor:pointer}
.shift-pill{font-size:10px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.5);padding:3px 9px;border-radius:10px}
.main{display:grid;grid-template-columns:200px 1fr 280px;overflow:hidden}
.sidebar{background:var(--navy);display:flex;flex-direction:column;overflow-y:auto}
.sb-sec{padding:14px 14px 4px;font-size:9px;letter-spacing:1.8px;text-transform:uppercase;color:rgba(255,255,255,.28);font-weight:700}
.nav-item{display:flex;align-items:center;gap:8px;padding:9px 14px;cursor:pointer;color:rgba(255,255,255,.55);font-size:12px;font-weight:500;border-left:2px solid transparent;transition:.15s;user-select:none}
.nav-item:hover{background:rgba(255,255,255,.05);color:#fff}
.nav-item.active{background:rgba(236,141,32,.12);color:#fff;border-left-color:var(--orange)}
.nav-badge{margin-left:auto;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px}
.nb-r{background:var(--red);color:#fff}.nb-m{background:rgba(255,255,255,.12);color:rgba(255,255,255,.6)}
.centre{display:flex;flex-direction:column;overflow:hidden}
.tab-bar{background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 16px;gap:2px;height:38px;flex-shrink:0}
.ctab{font-size:11px;font-weight:700;color:var(--muted);padding:0 12px;height:38px;display:flex;align-items:center;cursor:pointer;border-bottom:2px solid transparent;transition:.15s;user-select:none}
.ctab.active{color:var(--navy);border-bottom-color:var(--orange)}
.tab-content{display:none;flex-direction:column;flex:1;overflow:hidden}
.tab-content.active{display:flex}
.ribbon{display:flex;align-items:center;gap:10px;padding:8px 16px;flex-shrink:0}
.ribbon.p1{background:var(--red)}.ribbon.ack{background:var(--amber)}.ribbon.off{display:none}
.rib-dot{width:7px;height:7px;border-radius:50%;background:#fff;animation:pulse 1s infinite;flex-shrink:0}
.rib-text{font-size:12px;color:#fff;font-weight:600;flex:1}
.rib-btn{background:rgba(255,255,255,.2);color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:5px;border:1px solid rgba(255,255,255,.3);transition:.15s}
.rib-btn:hover{background:rgba(255,255,255,.35)}
.stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:10px 14px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0}
.s-card{text-align:center;padding:7px 4px;border-radius:8px;background:var(--bg);cursor:pointer;transition:.15s}
.s-card:hover{background:#E8EBF0}
.s-val{font-size:18px;font-weight:800;font-family:'Sora',sans-serif;line-height:1}
.s-lbl{font-size:9px;color:var(--muted);margin-top:3px;font-weight:600}
.c-gr{color:var(--green)}.c-re{color:var(--red)}.c-or{color:var(--orange)}.c-na{color:var(--navy)}.c-in{color:var(--indigo)}.c-am{color:var(--amber)}
.tk-header{display:flex;align-items:center;justify-content:space-between;padding:8px 14px 6px;background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0}
.tk-title{font-size:12px;font-weight:700;color:var(--navy)}
.filter-pills{display:flex;gap:4px}
.fp{font-size:10px;padding:3px 9px;border-radius:10px;cursor:pointer;border:1px solid var(--border);color:var(--muted);font-weight:600;transition:.15s;user-select:none}
.fp.active{background:var(--navy);color:#fff;border-color:var(--navy)}
.fp:hover:not(.active){border-color:var(--navy);color:var(--navy)}
.tk-list{flex:1;overflow-y:auto;padding:8px 10px;display:flex;flex-direction:column;gap:5px}
.ticket{background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:9px 11px;cursor:pointer;transition:.15s}
.ticket:hover{border-color:#94A3B8}
.ticket.sel{border-color:var(--navy);box-shadow:0 0 0 2px rgba(14,23,42,.1)}
.ticket.p1{border-left:3px solid var(--red)}.ticket.p2{border-left:3px solid var(--amber)}.ticket.rv{border-left:3px solid var(--green);opacity:.65}
.tk-top{display:flex;align-items:flex-start;justify-content:space-between;gap:6px;margin-bottom:4px}
.tk-name{font-size:12px;font-weight:700;color:var(--navy)}
.tk-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:8px;white-space:nowrap}
.b-sos{background:var(--red-lt);color:var(--red)}.b-geo{background:var(--amber-lt);color:var(--amber)}.b-hr{background:#F3E8FF;color:#7C3AED}.b-dose{background:#E0F2FE;color:#0369A1}.b-ok{background:var(--green-lt);color:var(--green)}
.tk-loc{font-size:10px;color:var(--muted);margin-bottom:3px}
.tk-meta{display:flex;align-items:center;justify-content:space-between}
.tk-time{font-size:10px;color:var(--muted)}
.tk-agent{font-size:10px;background:var(--orange-lt);color:var(--orange);padding:1px 7px;border-radius:8px;font-weight:600}
.ft{font-size:9px;background:#F5F3FF;color:#7C3AED;border-radius:4px;padding:1px 5px;font-weight:700}
.dev-panel{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:10px}
.dev-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden}
.dev-card-head{display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border);background:var(--bg)}
.dev-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.dev-head-name{font-size:13px;font-weight:700;color:var(--navy)}
.dev-head-sub{font-size:10px;color:var(--muted);margin-top:1px}
.dsp{font-size:10px;font-weight:700;padding:3px 9px;border-radius:10px}
.dsp-ok{background:var(--green-lt);color:var(--green)}.dsp-warn{background:var(--amber-lt);color:var(--amber)}
.dev-body{padding:10px 14px}
.dev-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}
.dm-box{background:var(--bg);border-radius:7px;padding:8px 10px;text-align:center}
.dm-val{font-size:16px;font-weight:800;font-family:'Sora',sans-serif;line-height:1}
.dm-lbl{font-size:9px;color:var(--muted);margin-top:2px;font-weight:600}
.dev-tgl-title{font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;padding-top:8px;border-top:1px solid var(--border)}
.thr-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)}
.thr-row:last-child{border-bottom:none}
.thr-lbl{font-size:11px;font-weight:500}
.thr-input{width:68px;font-size:11px;font-weight:700;text-align:center;border:1px solid var(--border);border-radius:6px;padding:4px 6px;font-family:inherit;color:var(--navy);background:var(--bg)}
.thr-input:focus{outline:none;border-color:var(--navy)}
.save-btn{width:100%;margin-top:10px;padding:8px;background:var(--navy);color:#fff;border:none;border-radius:7px;font-size:11px;font-weight:700;transition:.15s}
.save-btn:hover{background:#1a2a4a}
.sys-panel{flex:1;overflow-y:auto;padding:12px 14px}
.flow-row{display:flex;align-items:center;gap:6px;margin-bottom:8px}
.flow-node{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:9px 12px;display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;transition:.15s}
.flow-node:hover{border-color:#94A3B8}
.flow-node.fok{border-left:3px solid var(--green)}.flow-node.fwarn{border-left:3px solid var(--amber)}
.flow-arrow{color:var(--muted);font-size:14px;flex-shrink:0}
.flow-icon{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.flow-name{font-size:11px;font-weight:700;color:var(--navy)}
.flow-stat{font-size:10px;color:var(--muted)}
.flow-ms{margin-left:auto;font-size:10px;font-weight:700;color:var(--green)}
.flow-ms.w{color:var(--amber)}
.right{background:var(--surface);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden}
.rp-tabs{display:flex;border-bottom:1px solid var(--border);background:var(--bg);flex-shrink:0}
.rp-tab{flex:1;font-size:10px;font-weight:700;color:var(--muted);padding:9px 4px;text-align:center;cursor:pointer;border-bottom:2px solid transparent;transition:.15s;user-select:none}
.rp-tab.active{color:var(--navy);border-bottom-color:var(--orange);background:var(--surface)}
.rp-scroll{flex:1;overflow-y:auto}
.rp-sec{padding:10px 14px;border-bottom:1px solid var(--border)}
.sec-lbl{font-size:10px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.4px;margin-bottom:7px;display:flex;align-items:center;justify-content:space-between;gap:6px}
.sc-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.sc-av{width:36px;height:36px;border-radius:50%;background:var(--orange);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
.sc-name{font-size:13px;font-weight:700;color:var(--navy)}
.sc-age{font-size:10px;color:var(--muted)}
.sf-row{display:flex;justify-content:space-between;gap:6px;padding:3px 0}
.sf-lbl{font-size:10px;color:var(--muted)}
.sf-val{font-size:11px;font-weight:600;text-align:right}
.map-box{background:#EBF3FB;border:1px solid var(--border);border-radius:8px;height:105px;position:relative;overflow:hidden;cursor:pointer}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(14,23,42,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(14,23,42,.05) 1px,transparent 1px);background-size:18px 18px}
.map-actions{display:flex;gap:6px;margin-top:5px}
.map-btn{flex:1;font-size:10px;padding:5px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--navy);font-weight:600;font-family:inherit;transition:.15s}
.map-btn:hover{background:var(--navy);color:#fff}
.map-coords{font-size:9px;color:var(--muted);text-align:center;margin-top:3px}
.d-row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)}
.d-row:last-child{border-bottom:none}
.d-left{display:flex;align-items:center;gap:7px}
.d-name{font-size:11px;font-weight:600}
.d-sub{font-size:9px;color:var(--muted)}
.d-right{display:flex;align-items:center;gap:6px}
.ddot{width:6px;height:6px;border-radius:50%}
.ddot.g{background:var(--green)}.ddot.a{background:var(--amber)}.ddot.r{background:var(--red)}.ddot.x{background:#CBD5E1}
.batt-bar{width:28px;height:4px;background:var(--border);border-radius:3px;overflow:hidden}
.batt-fill{height:100%;border-radius:3px}
.b-ok{background:var(--green)}.b-low{background:var(--amber)}.b-crit{background:var(--red)}
.d-val{font-size:10px;color:var(--muted);font-weight:600}
.cg-box{background:var(--bg);border-radius:8px;padding:9px 10px}
.cg-name{font-size:12px;font-weight:700;color:var(--navy)}
.cg-rel{font-size:10px;color:var(--muted);margin-bottom:6px}
.cg-btns{display:flex;gap:5px}
.cg-btn{flex:1;font-size:10px;padding:6px;border-radius:6px;border:1px solid var(--border);background:var(--surface);color:var(--navy);font-weight:700;font-family:inherit;transition:.15s}
.cg-btn:hover{background:var(--bg)}
.cg-btn.pri{background:var(--navy);color:#fff;border-color:var(--navy)}
.cg-btn.pri:hover{background:#1a2a4a}
.act-btn{width:100%;padding:8px 10px;border-radius:8px;border:none;font-size:11px;font-weight:700;margin-bottom:5px;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:5px;text-transform:uppercase;letter-spacing:.4px;transition:.2s}
.act-btn:last-child{margin-bottom:0}
.act-btn:disabled{opacity:.5;cursor:not-allowed}
.ab-red{background:var(--red);color:#fff}.ab-red:hover:not(:disabled){background:#A93226}
.ab-gr{background:var(--green);color:#fff}.ab-gr:hover:not(:disabled){background:#136038}
.ab-or{background:var(--orange);color:#fff}.ab-or:hover:not(:disabled){background:#D67D18}
.ab-in{background:var(--indigo);color:#fff}.ab-in:hover:not(:disabled){background:#3730A3}
.ab-gh{background:var(--bg);color:var(--navy);border:1px solid var(--border)}.ab-gh:hover:not(:disabled){background:#E8EBF0}
.feed-item{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)}
.feed-item:last-child{border-bottom:none}
.feed-time{font-size:9px;color:var(--muted);width:36px;flex-shrink:0;padding-top:1px;font-variant-numeric:tabular-nums}
.feed-text{font-size:10px;line-height:1.5}
.feed-text strong{color:var(--navy)}
.erp-row{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:11px}
.erp-row:last-child{border-bottom:none}
.erp-key{color:var(--muted);font-weight:500}
.erp-val{font-weight:700;color:var(--navy)}
.erp-val.act{color:var(--green)}.erp-val.pau{color:var(--amber)}
.erp-btn{width:100%;padding:7px;border-radius:7px;font-size:11px;font-weight:700;font-family:inherit;border:1px solid var(--border);background:var(--bg);color:var(--navy);margin-top:5px;transition:.15s}
.erp-btn:hover{background:var(--navy);color:#fff}
.erp-btn.dng{background:var(--red-lt);color:var(--red);border-color:var(--red)}
.erp-btn.dng:hover{background:var(--red);color:#fff}
.da-box{background:var(--bg);border-radius:7px;padding:8px 10px;margin-bottom:5px}
.da-name{font-size:11px;font-weight:700;color:var(--navy)}
.da-sn{font-size:10px;color:var(--muted)}
#toasts{position:fixed;bottom:16px;right:16px;z-index:9999;display:flex;flex-direction:column-reverse;gap:6px;pointer-events:none}
.toast{background:#1E293B;color:#fff;font-size:12px;font-weight:600;padding:10px 14px;border-radius:9px;opacity:0;transform:translateX(20px);transition:.25s;max-width:300px;border-left:3px solid var(--muted)}
.toast.vis{opacity:1;transform:translateX(0)}
.toast.ts{border-left-color:var(--green)}.toast.tw{border-left-color:var(--amber)}.toast.te{border-left-color:var(--red)}.toast.ti{border-left-color:var(--indigo)}
#modal{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9990;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(2px)}
#modal.h{display:none}
.mc{background:#fff;border-radius:14px;padding:24px;max-width:420px;width:calc(100% - 32px);box-shadow:0 20px 60px rgba(0,0,0,.3)}
.mt{font-size:16px;font-weight:800;color:var(--navy);margin-bottom:12px}
.mb{font-size:12px;color:var(--muted);line-height:1.6;margin-bottom:14px}
.mb strong{color:var(--text)}
.mh{background:var(--bg);border-radius:8px;padding:10px 12px;margin:8px 0;font-size:11px}
.mta{width:100%;border:1px solid var(--border);border-radius:7px;padding:8px 10px;font-size:12px;font-family:inherit;resize:none;color:var(--text);margin-bottom:8px}
.mta:focus{outline:none;border-color:var(--navy)}
.mf{display:flex;gap:8px;justify-content:flex-end}
.mbtn{padding:8px 18px;border-radius:7px;font-size:12px;font-weight:700;font-family:inherit;border:none;cursor:pointer;transition:.15s}
.mbtn.cn{background:var(--bg);color:var(--navy);border:1px solid var(--border)}.mbtn.cn:hover{background:#E8EBF0}
.mbtn.cd{background:var(--red);color:#fff}.mbtn.cd:hover{background:#A93226}
.mbtn.cs{background:var(--green);color:#fff}.mbtn.cs:hover{background:#136038}
.mbtn.cw{background:var(--amber);color:#fff}.mbtn.cw:hover{background:#B7770D}

/_ ── CRITICAL LOCKOUT OVERLAY ──────────────────────────────── _/
#crit-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;animation:critBlink 1s ease-in-out infinite}
#crit-overlay.hidden{display:none}
@keyframes critBlink{0%,100%{background:#6B0000}50%{background:#C0392B}}
.crit-inner{background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:40px 48px;text-align:center;max-width:500px;width:calc(100% - 32px);backdrop-filter:blur(6px)}
.crit-icon{font-size:58px;line-height:1;animation:critBounce .55s ease-in-out infinite}
@keyframes critBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
.crit-level{display:inline-block;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);color:rgba(255,255,255,.8);font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;padding:4px 14px;border-radius:20px;margin:14px 0 10px}
.crit-type{font-size:22px;font-weight:800;color:#fff;font-family:'Sora',sans-serif;line-height:1.2;margin-bottom:6px}
.crit-name{font-size:32px;font-weight:800;color:#fff;font-family:'Sora',sans-serif;line-height:1.1}
.crit-detail{font-size:12px;color:rgba(255,255,255,.65);margin:10px 0 2px}
.crit-ticket{font-size:11px;color:rgba(255,255,255,.4);font-weight:600}
.crit-timer{font-size:13px;font-weight:700;color:rgba(255,255,255,.55);margin:20px 0 0;font-variant-numeric:tabular-nums;letter-spacing:.3px}
.crit-timer.urgent{color:#FFD700;animation:urgentPulse .45s ease-in-out infinite}
.crit-timer.escalated{color:#FF6B6B}
@keyframes urgentPulse{0%,100%{opacity:1}50%{opacity:.3}}
.crit-ack{margin-top:18px;padding:15px 28px;background:#fff;color:#6B0000;border:none;border-radius:11px;font-size:13px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;transition:.15s;font-family:inherit;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.4)}
.crit-ack:hover{background:#FFE4E1;transform:translateY(-1px);box-shadow:0 6px 28px rgba(0,0,0,.5)}
.crit-ack:active{transform:translateY(0)}
.crit-sub{font-size:10px;color:rgba(255,255,255,.3);margin-top:14px;line-height:1.6}
</style>

</head>
<body>
<div class="shell">
<div class="topbar">
  <div style="display:flex;align-items:center;gap:9px">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect width="22" height="22" rx="5" fill="#EC8D20"/><path d="M11 4L14 8H17L13 12L15 18L11 15L7 18L9 12L5 8H8L11 4Z" fill="white" opacity=".9"/></svg>
    <div><div class="brand">Healthsoft</div><div class="tb-sub">Care Command Centre</div></div>
  </div>
  <div class="sys-health">
    <div class="sys-node" onclick="toast('AWS IoT Core · Lambda · DynamoDB — All healthy · 5ms latency','ti')"><div class="sys-dot ok"></div><span class="sys-lbl">AWS</span></div>
    <div class="sys-div"></div>
    <div class="sys-node" onclick="toast('Flespi GPS Platform · 47 pendants tracked · 8ms','ti')"><div class="sys-dot ok"></div><span class="sys-lbl">Flespi</span></div>
    <div class="sys-div"></div>
    <div class="sys-node" onclick="toast('ERP Database · Subscriptions & billing sync OK · 3ms','ti')"><div class="sys-dot ok"></div><span class="sys-lbl">ERP DB</span></div>
    <div class="sys-div"></div>
    <div class="sys-node" onclick="toast('FCM push — 2 caregiver devices offline · investigating','tw')"><div class="sys-dot warn"></div><span class="sys-lbl">App</span></div>
    <div class="sys-div"></div>
    <div class="sys-dot ok" style="animation:none"></div><span class="sys-lbl" id="live-ct">47 seniors live</span>
  </div>
  <div style="display:flex;align-items:center;gap:10px">
    <div class="shift-pill">Morning · 06:00–14:00</div>
    <span class="clock" id="clock">--:--:--</span>
    <div class="agent-av" onclick="toast('Priya Krishnamurthy · CCC-07 · Shift ends 14:00','ti')">PK</div>
    <span style="font-size:11px;color:rgba(255,255,255,.75)">Priya K.</span>
  </div>
</div>

<div class="main">
<div class="sidebar">
  <div class="sb-sec">Monitor</div>
  <div class="nav-item active" id="ni-dashboard" onclick="switchTab('dashboard')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".3"/></svg>
    Dashboard <span class="nav-badge nb-r" id="nb1">2</span>
  </div>
  <div class="nav-item" id="ni-seniors" onclick="switchTab('dashboard');filterBy('all')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M2 14c0-2.2 2.7-4 6-4s6 1.8 6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    Seniors <span class="nav-badge nb-m">47</span>
  </div>
  <div class="nav-item" id="ni-alerts" onclick="switchTab('dashboard');filterBy('sos')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
    Alerts <span class="nav-badge nb-r" id="nb2">2</span>
  </div>
  <div class="sb-sec">Devices</div>
  <div class="nav-item" id="ni-pendants" onclick="switchTab('devices')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><ellipse cx="8" cy="8" rx="5" ry="7" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="11" r="1.5" fill="currentColor"/></svg>
    Pendants <span class="nav-badge nb-m">47</span>
  </div>
  <div class="nav-item" id="ni-dispensers" onclick="switchTab('devices')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 7h6M5 10h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
    Dispensers <span class="nav-badge nb-m">38</span>
  </div>
  <div class="nav-item" id="ni-bands" onclick="switchTab('devices')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M4 5h8" stroke="currentColor" stroke-width="1"/></svg>
    Health Bands <span class="nav-badge nb-m">41</span>
  </div>
  <div class="sb-sec">Infrastructure</div>
  <div class="nav-item" id="ni-system" onclick="switchTab('system')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 7h6M8 5v6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
    System Health
  </div>
  <div class="nav-item" id="ni-erp" onclick="switchTab('system')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M4 8h8M4 5h5M4 11h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
    ERP / Billing
  </div>
  <div class="sb-sec">Reports</div>
  <div class="nav-item" onclick="toast('Analytics module loading...','ti')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M2 12L6 8L9 11L14 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Analytics
  </div>
  <div class="nav-item" onclick="toast('Generating SLA report...','ti')">
    <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M4 8h8M4 5h5M4 11h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
    SLA Report
  </div>
</div>

<div class="centre">
  <div class="tab-bar">
    <div class="ctab active" id="ct-dashboard" onclick="switchTab('dashboard')">Live Dashboard</div>
    <div class="ctab" id="ct-devices" onclick="switchTab('devices')">Device Controls</div>
    <div class="ctab" id="ct-system" onclick="switchTab('system')">System &amp; ERP</div>
  </div>

  <!-- DASHBOARD -->
  <div class="tab-content active" id="tab-dashboard">
    <div class="ribbon p1" id="ribbon">
      <div class="rib-dot"></div>
      <span class="rib-text" id="rib-text">P1 SOS Alert — Meenakshi Rajan · Fall detected · 2 mins ago</span>
      <button class="rib-btn" id="rib-ack" onclick="ackRibbon()">Acknowledge</button>
      <button class="rib-btn" onclick="snoozeRibbon()" style="margin-left:4px">Snooze 10m</button>
    </div>
    <div class="stats-row">
      <div class="s-card" onclick="filterBy('all')"><div class="s-val c-gr">47</div><div class="s-lbl">Seniors live</div></div>
      <div class="s-card" onclick="filterBy('open')"><div class="s-val c-re" id="st-open">2</div><div class="s-lbl">Open alerts</div></div>
      <div class="s-card" onclick="toast('Avg response: 1m 42s this shift','ti')"><div class="s-val c-or">1m 42s</div><div class="s-lbl">Avg response</div></div>
      <div class="s-card" onclick="filterBy('resolved')"><div class="s-val c-na" id="st-res">2</div><div class="s-lbl">Resolved today</div></div>
      <div class="s-card" onclick="toast('3 devices need charging — Meenakshi, Annamalai, Kamakshi','tw')"><div class="s-val c-in">3</div><div class="s-lbl">Low battery</div></div>
    </div>
    <div class="tk-header">
      <span class="tk-title">Active tickets</span>
      <div class="filter-pills">
        <div class="fp active" id="fp-all" onclick="filterBy('all')">All</div>
        <div class="fp" id="fp-sos" onclick="filterBy('sos')">SOS</div>
        <div class="fp" id="fp-geo" onclick="filterBy('geo')">Geo-fence</div>
        <div class="fp" id="fp-hr" onclick="filterBy('hr')">Wellness</div>
        <div class="fp" id="fp-dose" onclick="filterBy('dose')">Medication</div>
        <div class="fp" id="fp-resolved" onclick="filterBy('resolved')">Resolved</div>
        <div class="fp" id="fp-open" onclick="filterBy('open')" style="display:none">Open</div>
      </div>
    </div>
    <div class="tk-list" id="ticket-list"></div>
  </div>

  <!-- DEVICES -->
  <div class="tab-content" id="tab-devices">
    <div class="dev-panel">
      <div class="dev-card">
        <div class="dev-card-head">
          <div class="dev-icon" style="background:#EFF6FF">🔵</div>
          <div style="flex:1"><div class="dev-head-name">Pendant (EV-07B Guard Rail)</div><div class="dev-head-sub">47 units · GPS via Flespi · SIM-enabled · Fall detection</div></div>
          <div class="dsp dsp-ok">47 online</div>
        </div>
        <div class="dev-body">
          <div class="dev-metrics">
            <div class="dm-box"><div class="dm-val c-gr">47</div><div class="dm-lbl">Online</div></div>
            <div class="dm-box"><div class="dm-val c-am">3</div><div class="dm-lbl">Low battery</div></div>
            <div class="dm-box"><div class="dm-val c-na">0</div><div class="dm-lbl">Offline</div></div>
          </div>
          <div class="dev-tgl-title">Global controls — all pendants</div>
          <div class="toggle-row"><div><div class="toggle-label">Fall detection alerts</div><div class="toggle-sub">P1 ticket on fall.alarm.start from AWS IoT</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Fall detection alerts','pendant')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">SOS button alerts</div><div class="toggle-sub">P1 ticket on sos.press event</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'SOS button alerts','pendant')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">Geo-fence monitoring</div><div class="toggle-sub">Alert when pendant exits home zone (Flespi)</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Geo-fence monitoring','pendant')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">GPS tracking via Flespi</div><div class="toggle-sub">Live position updates every 30 seconds</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'GPS tracking (Flespi)','pendant')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">Low battery alerts</div><div class="toggle-sub">Notify when battery drops below 20%</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Low battery alerts','pendant')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">Offline alerts</div><div class="toggle-sub">Alert if pendant loses AWS connection 15+ min</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Offline alerts','pendant')"><span class="slider"></span></label></div>
        </div>
      </div>
      <div class="dev-card">
        <div class="dev-card-head">
          <div class="dev-icon" style="background:#F0FDF4">💊</div>
          <div style="flex:1"><div class="dev-head-name">Pill Dispenser (The Keeper)</div><div class="dev-head-sub">38 units · Wi-Fi · Direct AWS MQTT</div></div>
          <div class="dsp dsp-ok">38 online</div>
        </div>
        <div class="dev-body">
          <div class="dev-metrics">
            <div class="dm-box"><div class="dm-val c-gr">38</div><div class="dm-lbl">Online</div></div>
            <div class="dm-box"><div class="dm-val c-or">2</div><div class="dm-lbl">Missed today</div></div>
            <div class="dm-box"><div class="dm-val c-na">96%</div><div class="dm-lbl">Adherence</div></div>
          </div>
          <div class="dev-tgl-title">Global controls — all dispensers</div>
          <div class="toggle-row"><div><div class="toggle-label">Missed dose alerts</div><div class="toggle-sub">Ticket if dose not dispensed within window</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Missed dose alerts','dispenser')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">Dose confirmation push</div><div class="toggle-sub">App notification on each successful dispense</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Dose confirmation push','dispenser')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">Auto-refill reminders</div><div class="toggle-sub">Alert caregiver when pills &lt; 7-day supply</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Auto-refill reminders','dispenser')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">WhatsApp alerts</div><div class="toggle-sub">WhatsApp message to caregiver on missed dose</div></div><label class="toggle"><input type="checkbox" onchange="gToggle(this,'WhatsApp missed dose alerts','dispenser')"><span class="slider"></span></label></div>
        </div>
      </div>
      <div class="dev-card">
        <div class="dev-card-head">
          <div class="dev-icon" style="background:#FDF4FF">💜</div>
          <div style="flex:1"><div class="dev-head-name">Health Band (Health Guard)</div><div class="dev-head-sub">41 units · BLE → phone → AWS · ECG, SpO₂, HR</div></div>
          <div class="dsp dsp-warn">2 low battery</div>
        </div>
        <div class="dev-body">
          <div class="dev-metrics">
            <div class="dm-box"><div class="dm-val c-gr">41</div><div class="dm-lbl">Synced today</div></div>
            <div class="dm-box"><div class="dm-val c-am">2</div><div class="dm-lbl">Low battery</div></div>
            <div class="dm-box"><div class="dm-val c-in">1</div><div class="dm-lbl">HR alert</div></div>
          </div>
          <div class="dev-tgl-title">Global controls — all bands</div>
          <div class="toggle-row"><div><div class="toggle-label">Heart rate alerts</div><div class="toggle-sub">Alert if HR exceeds threshold or drops below 45</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Heart rate alerts','band')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">SpO₂ low alerts</div><div class="toggle-sub">Alert if blood oxygen drops below 90%</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'SpO₂ low alerts','band')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">ECG anomaly detection</div><div class="toggle-sub">Flag irregular ECG readings from AWS pipeline</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'ECG anomaly detection','band')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">Inactivity alerts</div><div class="toggle-sub">Alert if no movement for threshold hours (daytime)</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Inactivity alerts','band')"><span class="slider"></span></label></div>
          <div class="toggle-row"><div><div class="toggle-label">Weekly health summary</div><div class="toggle-sub">Email summary to caregiver every Sunday</div></div><label class="toggle"><input type="checkbox" checked onchange="gToggle(this,'Weekly health summary','band')"><span class="slider"></span></label></div>
        </div>
      </div>
      <div class="dev-card">
        <div class="dev-card-head">
          <div class="dev-icon" style="background:#FFF0F0;font-size:16px">⚡</div>
          <div style="flex:1"><div class="dev-head-name">Alert Thresholds</div><div class="dev-head-sub">Global defaults — overridable per senior in Controls tab</div></div>
        </div>
        <div class="dev-body">
          <div class="thr-row"><span class="thr-lbl">HR alert threshold (bpm)</span><input class="thr-input" type="number" value="130" onblur="toast('HR threshold saved ✓','ts')"></div>
          <div class="thr-row"><span class="thr-lbl">SpO₂ alert threshold (%)</span><input class="thr-input" type="number" value="90" onblur="toast('SpO₂ threshold saved ✓','ts')"></div>
          <div class="thr-row"><span class="thr-lbl">Low battery alert (%)</span><input class="thr-input" type="number" value="20" onblur="toast('Battery threshold saved ✓','ts')"></div>
          <div class="thr-row"><span class="thr-lbl">Geo-fence radius (m)</span><input class="thr-input" type="number" value="200" onblur="toast('Geo-fence radius saved ✓','ts')"></div>
          <div class="thr-row"><span class="thr-lbl">Inactivity timeout (hrs)</span><input class="thr-input" type="number" value="4" onblur="toast('Inactivity timeout saved ✓','ts')"></div>
          <div class="thr-row"><span class="thr-lbl">Missed dose window (min)</span><input class="thr-input" type="number" value="30" onblur="toast('Dose window saved ✓','ts')"></div>
          <button class="save-btn" onclick="toast('All thresholds saved and applied ✓','ts')">Save All Thresholds</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SYSTEM -->
  <div class="tab-content" id="tab-system">
    <div class="sys-panel">
      <div style="font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Live Data Pipeline</div>
      <div class="flow-row">
        <div class="flow-node fok" onclick="toast('47 EV-07B pendants · 44 GPS active · Avg battery 71%','ti')"><div class="flow-icon" style="background:#EFF6FF">🔵</div><div><div class="flow-name">Pendant (EV-07B)</div><div class="flow-stat">47 units · GPS via Flespi</div></div><span class="flow-ms">12ms</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node fok" onclick="toast('Flespi: ✓ Connected · 47 pendants · 47 msg/min · GPS acc: avg 8m','ti')"><div class="flow-icon" style="background:#F5F3FF">🟣</div><div><div class="flow-name">Flespi Platform</div><div class="flow-stat">GPS relay · geo-fence</div></div><span class="flow-ms">8ms</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node fok" onclick="toast('AWS IoT Core · Lambda · DynamoDB · SNS — All healthy','ti')"><div class="flow-icon" style="background:var(--orange-lt)">☁️</div><div><div class="flow-name">AWS IoT Core</div><div class="flow-stat">Rules engine · Lambda</div></div><span class="flow-ms">5ms</span></div>
      </div>
      <div class="flow-row">
        <div class="flow-node fok" onclick="toast('38 dispensers · 38 online · Adherence 96%','ti')"><div class="flow-icon" style="background:#F0FDF4">💊</div><div><div class="flow-name">Pill Dispenser</div><div class="flow-stat">38 units · MQTT direct</div></div><span class="flow-ms">18ms</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node fok" style="flex:2" onclick="toast('AWS: Central event bus · processing all device events','ti')"><div class="flow-icon" style="background:var(--orange-lt)">☁️</div><div><div class="flow-name">AWS</div><div class="flow-stat">Central event bus</div></div><span class="flow-ms">5ms</span></div>
      </div>
      <div class="flow-row">
        <div class="flow-node fok" onclick="toast('41 bands · 41 synced today · 2 low battery · 1 active HR alert','ti')"><div class="flow-icon" style="background:#FDF4FF">💜</div><div><div class="flow-name">Health Band</div><div class="flow-stat">41 units · BLE → phone</div></div><span class="flow-ms">22ms</span></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node fok" style="flex:2" onclick="toast('AWS health data pipeline · aggregation active','ti')"><div class="flow-icon" style="background:var(--orange-lt)">☁️</div><div><div class="flow-name">AWS</div><div class="flow-stat">Health data pipeline</div></div><span class="flow-ms">5ms</span></div>
      </div>
      <div class="flow-row">
        <div class="flow-node fok" style="flex:2" onclick="toast('AWS central processing — all pipelines healthy','ti')"><div class="flow-icon" style="background:var(--orange-lt)">☁️</div><div><div class="flow-name">AWS</div><div class="flow-stat">Central processing</div></div></div>
        <div class="flow-arrow">↔</div>
        <div class="flow-node fok" onclick="toast('ERP DB: ✓ Online · Last sync 3s ago · 47 active subscriptions','ti')"><div class="flow-icon" style="background:var(--orange-lt)">🗄️</div><div><div class="flow-name">ERP DB</div><div class="flow-stat">Subscriptions · billing</div></div><span class="flow-ms">3ms</span></div>
      </div>
      <div class="flow-row">
        <div class="flow-node fok" style="flex:2" onclick="toast('WebSocket to CCC — latency 2ms','ti')"><div class="flow-icon" style="background:var(--orange-lt)">☁️</div><div><div class="flow-name">AWS → CCC</div><div class="flow-stat">WebSocket · this panel</div></div></div>
        <div class="flow-arrow">→</div>
        <div class="flow-node fwarn" onclick="toast('FCM push: ⚠ 2 caregiver devices offline · iOS OK · Android 2 offline','tw')"><div class="flow-icon" style="background:#E0F2FE">📱</div><div><div class="flow-name">Mobile App</div><div class="flow-stat">FCM push · 2 offline</div></div><span class="flow-ms w">delayed</span></div>
      </div>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <div class="dev-card">
          <div class="dev-card-head"><div class="dev-icon" style="background:var(--orange-lt)">☁️</div><div style="flex:1"><div class="dev-head-name">AWS Services</div><div class="dev-head-sub">IoT Core · Lambda · SNS · DynamoDB</div></div><div class="dsp dsp-ok">All healthy</div></div>
          <div class="dev-body">
            <div class="toggle-row"><div><div class="toggle-label">IoT Core ingestion</div><div class="toggle-sub">Accept device telemetry from all sources</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'AWS IoT Core ingestion',true)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">SNS alert dispatch</div><div class="toggle-sub">Push SMS/email on SOS/fall to caregivers</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'SNS alert dispatch',true)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">Lambda rules engine</div><div class="toggle-sub">Auto-process events and route tickets</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'Lambda rules engine',true)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">ERP sync</div><div class="toggle-sub">Bidirectional subscription/device data sync</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'ERP sync',false)"><span class="slider"></span></label></div>
          </div>
        </div>
        <div class="dev-card">
          <div class="dev-card-head"><div class="dev-icon" style="background:#F5F3FF">🟣</div><div style="flex:1"><div class="dev-head-name">Flespi GPS Platform</div><div class="dev-head-sub">Pendant GPS relay · geo-fence engine</div></div><div class="dsp dsp-ok">Connected</div></div>
          <div class="dev-body">
            <div class="toggle-row"><div><div class="toggle-label">Live GPS relay to AWS</div><div class="toggle-sub">Stream pendant location every 30s</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'Flespi GPS relay',true)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">Geo-fence engine</div><div class="toggle-sub">Flespi evaluates zone boundaries, pushes breach event</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'Flespi geo-fence engine',true)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">Historical track logging</div><div class="toggle-sub">Store 30-day GPS history per pendant</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'GPS history logging',false)"><span class="slider"></span></label></div>
          </div>
        </div>
        <div class="dev-card">
          <div class="dev-card-head"><div class="dev-icon" style="background:#E0F2FE">📱</div><div style="flex:1"><div class="dev-head-name">Mobile App</div><div class="dev-head-sub">FCM push · caregiver &amp; senior</div></div><div class="dsp dsp-warn">2 offline</div></div>
          <div class="dev-body">
            <div class="toggle-row"><div><div class="toggle-label">SOS push notifications</div><div class="toggle-sub">Immediate push to caregiver app on SOS</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'SOS push notifications',true)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">Missed dose push</div><div class="toggle-sub">App notification on missed dispense</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'Missed dose push',false)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">Health alerts push</div><div class="toggle-sub">HR / SpO₂ abnormal → caregiver app</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'Health alerts push',false)"><span class="slider"></span></label></div>
            <div class="toggle-row"><div><div class="toggle-label">Weekly summary push</div><div class="toggle-sub">Sunday health report to caregiver</div></div><label class="toggle"><input type="checkbox" checked onchange="svcToggle(this,'Weekly summary push',false)"><span class="slider"></span></label></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- RIGHT PANEL -->
<div class="right">
  <div class="rp-tabs">
    <div class="rp-tab active" id="rpt-profile" onclick="switchRp('profile')">Profile</div>
    <div class="rp-tab" id="rpt-controls" onclick="switchRp('controls')">Controls</div>
    <div class="rp-tab" id="rpt-erp" onclick="switchRp('erp')">ERP</div>
    <div class="rp-tab" id="rpt-log" onclick="switchRp('log')">Log</div>
  </div>
  <div class="rp-scroll" id="rp"></div>
</div>
</div>
</div>

<div id="crit-overlay" class="hidden">
  <div class="crit-inner">
    <div class="crit-icon">🚨</div>
    <div class="crit-level">⚡ CRITICAL ALERT — IMMEDIATE ACTION REQUIRED</div>
    <div class="crit-type" id="crit-type">SOS — FALL DETECTED</div>
    <div class="crit-name" id="crit-name">—</div>
    <div class="crit-detail" id="crit-detail">—</div>
    <div class="crit-ticket" id="crit-ticket">—</div>
    <div class="crit-timer" id="crit-timer">Auto-escalating to supervisor in 60s</div>
    <button class="crit-ack" onclick="ackCritical()">⚡ &nbsp;I AM RESPONDING NOW</button>
    <div class="crit-sub">Dashboard is locked until you acknowledge this alert.<br>Every second counts — a senior needs help right now.</div>
  </div>
</div>

<div id="toasts"></div>
<div id="modal" class="h"><div class="mc"><div class="mt" id="m-title"></div><div class="mb" id="m-body"></div><div id="m-extra"></div><div class="mf"><button class="mbtn cn" onclick="closeModal(false)">Cancel</button><button class="mbtn" id="m-confirm" onclick="closeModal(true)">Confirm</button></div></div></div>

<script>
const SENIORS={MR:{initials:'MR',name:'Meenakshi Rajan',age:74,gender:'Female',hsId:'HS-CN-0142',address:'12, Luz Church Rd, Mylapore, Chennai 600004',medical:'Hypertension, Type 2 DM',subscribed:'March 2026',caregiver:{name:'Suresh Rajan',relation:'Son',location:'Fremont, CA, USA',phone:'+1 (510) 555-0142'},devices:{pendant:{online:true,battery:78,imei:'352625333142',sn:'EV07-0142'},dispenser:{online:true,model:'KP-20',sn:'KP20-0142'},band:{online:true,battery:22,hr:88,spo2:97,sn:'HG-0142'}},erp:{plan:'Complete Care',billing:'Annual',nextBilling:'01 Mar 2027',amount:'₹29,999/yr',status:'Active',invoices:1},gps:{lat:'13.0342°N',lng:'80.2685°E',place:'Luz Church Rd, Mylapore',cx:140,cy:53},toggles:{fall:true,sos:true,geo:true,missedDose:true,doseConfirm:true,hr:true,spo2:true,inactivity:true},log:[{time:'09:44',text:'App push → <strong>Suresh Rajan</strong>\'s iPhone'},{time:'09:44',text:'WhatsApp sent to <strong>Suresh Rajan</strong> (Fremont)'},{time:'09:43',text:'Outbound call to <strong>Meenakshi Rajan</strong> — Priya K.'},{time:'09:43',text:'<strong>Priya K.</strong> acknowledged · response 58s'},{time:'09:42',text:'Ticket <strong>TKT-2026-00847</strong> created · P1 SOS'},{time:'09:42',text:'GPS from <strong>Flespi</strong> — 13.0342°N, 80.2685°E · 8m acc'},{time:'09:42',text:'<strong>fall.alarm.start</strong> · pendant IMEI 352625333142'}]},RS:{initials:'RS',name:'Rajagopalan Subramaniam',age:81,gender:'Male',hsId:'HS-CN-0089',address:'4B, Venkataraman St, T. Nagar, Chennai 600017',medical:'Parkinson\'s (Stage 2), Arthritis',subscribed:'January 2026',caregiver:{name:'Ananya Subramaniam',relation:'Daughter',location:'Bangalore, KA',phone:'+91 98400 12345'},devices:{pendant:{online:true,battery:55,imei:'352625330089',sn:'EV07-0089'},dispenser:{online:true,model:'KP-20',sn:'KP20-0089'},band:{online:true,battery:71,hr:74,spo2:98,sn:'HG-0089'}},erp:{plan:'Essential',billing:'Monthly',nextBilling:'01 Jul 2026',amount:'₹2,499/mo',status:'Active',invoices:6},gps:{lat:'13.0418°N',lng:'80.2338°E',place:'Anna Salai, T. Nagar',cx:90,cy:65},toggles:{fall:true,sos:true,geo:true,missedDose:true,doseConfirm:true,hr:true,spo2:true,inactivity:true},log:[{time:'09:36',text:'<strong>Karthik M.</strong> acknowledged · 2m 10s response'},{time:'09:35',text:'Geo-fence breach · <strong>Flespi</strong> — 400m outside zone'},{time:'09:35',text:'<strong>geo.exit</strong> event · IMEI 352625330089'},{time:'09:00',text:'Morning check-in · all devices nominal'}]},KV:{initials:'KV',name:'Kamakshi Venkataraman',age:69,gender:'Female',hsId:'HS-CN-0211',address:'7, 3rd Avenue, Adyar, Chennai 600020',medical:'Atrial Fibrillation, Hypothyroidism',subscribed:'April 2026',caregiver:{name:'Ravi Venkataraman',relation:'Husband',location:'Adyar, Chennai',phone:'+91 98765 43210'},devices:{pendant:{online:true,battery:91,imei:'352625330211',sn:'EV07-0211'},dispenser:{online:false,model:'KP-20',sn:'KP20-0211'},band:{online:true,battery:64,hr:142,spo2:95,sn:'HG-0211'}},erp:{plan:'Complete Care',billing:'Annual',nextBilling:'01 Apr 2027',amount:'₹29,999/yr',status:'Active',invoices:2},gps:{lat:'12.9975°N',lng:'80.2565°E',place:'3rd Avenue, Adyar',cx:160,cy:75},toggles:{fall:true,sos:true,geo:true,missedDose:true,doseConfirm:false,hr:true,spo2:true,inactivity:false},log:[{time:'09:30',text:'Band: <strong>142 bpm</strong> — threshold exceeded (130)'},{time:'09:30',text:'Ticket <strong>TKT-2026-00848</strong> created · P2'},{time:'09:00',text:'Morning check-in · pendant & band online · dispenser offline'}]},DP:{initials:'DP',name:'Doraiswamy Pillai',age:77,gender:'Male',hsId:'HS-CN-0067',address:'23, Lake View Road, Velachery, Chennai 600042',medical:'Type 2 DM, Hypertension, CKD Stage 2',subscribed:'December 2025',caregiver:{name:'Malathi Pillai',relation:'Wife',location:'Velachery, Chennai',phone:'+91 98400 67890'},devices:{pendant:{online:true,battery:43,imei:'352625330067',sn:'EV07-0067'},dispenser:{online:true,model:'KP-20',sn:'KP20-0067'},band:{online:true,battery:88,hr:79,spo2:96,sn:'HG-0067'}},erp:{plan:'Complete Care',billing:'Annual',nextBilling:'01 Dec 2026',amount:'₹29,999/yr',status:'Active',invoices:7},gps:{lat:'12.9788°N',lng:'80.2209°E',place:'Velachery Main Rd',cx:120,cy:80},toggles:{fall:true,sos:true,geo:false,missedDose:true,doseConfirm:true,hr:true,spo2:true,inactivity:true},log:[{time:'09:02',text:'Missed dose: <strong>Metformin 500mg</strong> — 08:00 AM'},{time:'09:02',text:'Ticket <strong>TKT-2026-00849</strong> created · P2'},{time:'08:00',text:'Scheduled dispense: Metformin 500mg · Lisinopril 10mg'}]},SK:{initials:'SK',name:'Savithri Krishnamurthy',age:72,gender:'Female',hsId:'HS-CN-0155',address:'18, 4th Main Rd, Besant Nagar, Chennai 600090',medical:'Osteoporosis, Mild cognitive impairment',subscribed:'February 2026',caregiver:{name:'Pradeep Krishnamurthy',relation:'Son',location:'Dubai, UAE',phone:'+971 50 123 4567'},devices:{pendant:{online:true,battery:62,imei:'352625330155',sn:'EV07-0155'},dispenser:{online:true,model:'KP-20',sn:'KP20-0155'},band:{online:true,battery:77,hr:71,spo2:98,sn:'HG-0155'}},erp:{plan:'Complete Care',billing:'Annual',nextBilling:'01 Feb 2027',amount:'₹29,999/yr',status:'Active',invoices:4},gps:{lat:'13.0002°N',lng:'80.2707°E',place:'4th Main Rd, Besant Nagar',cx:155,cy:60},toggles:{fall:true,sos:true,geo:true,missedDose:true,doseConfirm:true,hr:true,spo2:true,inactivity:true},log:[{time:'08:15',text:'Ticket <strong>TKT-2026-00840</strong> resolved · Ranjini S.'},{time:'08:12',text:'Confirmed false alarm — senior safe via phone'},{time:'08:11',text:'SOS press detected · ticket created'}]},AG:{initials:'AG',name:'Annamalai Govindarajan',age:83,gender:'Male',hsId:'HS-CN-0034',address:'5, Karpagam Garden, Kodambakkam, Chennai 600024',medical:'COPD, Type 2 DM, Age-related macular degeneration',subscribed:'October 2025',caregiver:{name:'Vijayalakshmi G.',relation:'Daughter',location:'Coimbatore, TN',phone:'+91 98400 34567'},devices:{pendant:{online:true,battery:85,imei:'352625330034',sn:'EV07-0034'},dispenser:{online:true,model:'KP-20',sn:'KP20-0034'},band:{online:true,battery:55,hr:68,spo2:94,sn:'HG-0034'}},erp:{plan:'Essential',billing:'Annual',nextBilling:'01 Oct 2026',amount:'₹19,999/yr',status:'Active',invoices:9},gps:{lat:'13.0512°N',lng:'80.2175°E',place:'Karpagam Garden, Kodambakkam',cx:75,cy:45},toggles:{fall:true,sos:true,geo:true,missedDose:true,doseConfirm:true,hr:true,spo2:true,inactivity:true},log:[{time:'07:05',text:'Ticket <strong>TKT-2026-00835</strong> resolved · returned home'},{time:'07:00',text:'Geo-fence re-entry confirmed'},{time:'06:52',text:'Geo-fence breach · Kodambakkam market area'}]}};

const TICKETS=[{id:'TKT-2026-00847',sid:'MR',pri:'p1',type:'SOS — Fall detected',badge:'b-sos',loc:'Luz Church Road, Mylapore · 600004',time:'2 mins ago',agent:'Priya K.',extra:'Pendant 78% · <span class="ft">Flespi GPS</span>'},{id:'TKT-2026-00846',sid:'RS',pri:'p1',type:'Geo-fence breach',badge:'b-geo',loc:'T. Nagar · 600017 · 400m outside',time:'8 mins ago',agent:'Karthik M.',extra:'<span class="ft">Flespi GPS</span> · Anna Salai'},{id:'TKT-2026-00848',sid:'KV',pri:'p2',type:'Abnormal heart rate',badge:'b-hr',loc:'Adyar · 600020 · 142 bpm',time:'14 mins ago',agent:'Priya K.',extra:'Health Band alert'},{id:'TKT-2026-00849',sid:'DP',pri:'p2',type:'Missed dose',badge:'b-dose',loc:'Velachery · 600042 · Metformin 500mg — 8:00 AM',time:'28 mins ago',agent:'Karthik M.',extra:'Pill Dispenser (P20)'},{id:'TKT-2026-00840',sid:'SK',pri:'rv',type:'Resolved — SOS false alarm',badge:'b-ok',loc:'Besant Nagar · 600090',time:'1h 12m ago',agent:'Ranjini S.',extra:'Resolved in 3m 40s'},{id:'TKT-2026-00835',sid:'AG',pri:'rv',type:'Resolved — Geo-fence',badge:'b-ok',loc:'Kodambakkam · 600024',time:'2h 05m ago',agent:'Priya K.',extra:'Resolved in 6m 10s'}];

const S={tid:'TKT-2026-00847',sid:'MR',rpTab:'profile',filter:'all',ribbonAck:false,closed:new Set(),resolved:new Set(['TKT-2026-00840','TKT-2026-00835']),calling:false,callSec:0,callInt:null,dispatched:false};

// TOAST
function toast(msg,type='ti',dur=3000){const tc=document.getElementById('toasts');const el=document.createElement('div');el.className=`toast ${type}`;el.innerHTML=msg;tc.prepend(el);setTimeout(()=>el.classList.add('vis'),10);setTimeout(()=>{el.classList.remove('vis');setTimeout(()=>el.remove(),300)},dur)}

// MODAL
let _mr=null;
function showModal(title,body,confirmLabel,confirmClass,extra=''){document.getElementById('m-title').innerHTML=title;document.getElementById('m-body').innerHTML=body;document.getElementById('m-extra').innerHTML=extra;const cb=document.getElementById('m-confirm');cb.textContent=confirmLabel;cb.className=`mbtn ${confirmClass}`;document.getElementById('modal').classList.remove('h');return new Promise(r=>{_mr=r})}
function closeModal(ok){document.getElementById('modal').classList.add('h');if(_mr){_mr(ok);_mr=null}}

// CLOCK
setInterval(()=>{const n=new Date();document.getElementById('clock').textContent=[n.getHours(),n.getMinutes(),n.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':')},1000);

// CENTRE TABS
function switchTab(tab){S.centreTab=tab;['dashboard','devices','system'].forEach(t=>{document.getElementById('tab-'+t).classList.toggle('active',t===tab);document.getElementById('ct-'+t).classList.toggle('active',t===tab)});const navMap={dashboard:'ni-dashboard',devices:'ni-pendants',system:'ni-system'};document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));if(navMap[tab])document.getElementById(navMap[tab]).classList.add('active')}

// RP TABS
function switchRp(tab){S.rpTab=tab;document.querySelectorAll('.rp-tab').forEach(el=>el.classList.remove('active'));document.getElementById('rpt-'+tab).classList.add('active');renderRp()}

// FILTER
function filterBy(f){S.filter=f;['all','sos','geo','hr','dose','resolved','open'].forEach(k=>{const el=document.getElementById('fp-'+k);if(el)el.classList.toggle('active',k===f)});renderTickets()}

// TICKETS
function isResolved(t){return S.resolved.has(t.id)||t.pri==='rv'}
function renderTickets(){const list=document.getElementById('ticket-list');const f=S.filter;const vis=TICKETS.filter(t=>{if(S.closed.has(t.id))return false;const rv=isResolved(t);if(f==='all')return true;if(f==='open')return !rv;if(f==='resolved')return rv;if(f==='sos')return t.type.toLowerCase().includes('sos')||t.type.toLowerCase().includes('fall');if(f==='geo')return t.type.toLowerCase().includes('geo');if(f==='hr')return t.type.toLowerCase().includes('heart');if(f==='dose')return t.type.toLowerCase().includes('dose');return true});if(!vis.length){list.innerHTML='<div style="text-align:center;color:var(--muted);padding:24px;font-size:12px">No tickets match this filter</div>';return}list.innerHTML=vis.map(t=>`<div class="ticket ${isResolved(t)?'rv':t.pri} ${S.tid===t.id?'sel':''}" onclick="selectTicket('${t.id}','${t.sid}')"><div class="tk-top"><span class="tk-name">${SENIORS[t.sid].name}</span><span class="tk-badge ${t.badge}">${t.type}</span></div><div class="tk-loc">📍 ${t.loc}</div><div class="tk-meta"><span class="tk-time">${t.time} · ${t.extra}</span><span class="tk-agent">${t.agent}</span></div></div>`).join('')}

function selectTicket(tid,sid){S.tid=tid;S.sid=sid;S.calling=false;clearInterval(S.callInt);S.dispatched=false;renderTickets();renderRp()}

// STATS
function updateStats(){const open=TICKETS.filter(t=>!S.closed.has(t.id)&&!isResolved(t)).length;const res=TICKETS.filter(t=>isResolved(t)||S.resolved.has(t.id)).length;document.getElementById('st-open').textContent=open;document.getElementById('st-res').textContent=res;document.getElementById('nb1').textContent=open;document.getElementById('nb2').textContent=open}

// RIBBON
function ackRibbon(){S.ribbonAck=true;document.getElementById('ribbon').className='ribbon ack';document.getElementById('rib-text').textContent='Acknowledged — Meenakshi Rajan · Priya K. attending';document.getElementById('rib-ack').textContent='Escalate';document.getElementById('rib-ack').onclick=()=>{toast('Escalated to supervisor Ranjini S. ✓','te',4000);addLog(S.sid,'Alert <strong>escalated</strong> to supervisor')};addLog(S.sid,'Ribbon acknowledged by <strong>Priya K.</strong>');toast('Alert acknowledged','tw')}
function snoozeRibbon(){document.getElementById('ribbon').className='ribbon off';toast('Alert snoozed for 10 minutes','ti');setTimeout(()=>{if(!S.ribbonAck){document.getElementById('ribbon').className='ribbon p1';toast('⚠️ Snoozed alert back — Meenakshi Rajan','te')}},600000)}

// LOG
function addLog(sid,text){const n=new Date();const t=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;SENIORS[sid].log.unshift({time:t,text});if(S.rpTab==='log'&&S.sid===sid)renderRp()}

// TOGGLE HANDLERS
async function gToggle(el,label,device){const on=el.checked;const safety=['Fall detection alerts','SOS button alerts','GPS tracking (Flespi)','Heart rate alerts','SpO₂ low alerts'];if(!on&&safety.includes(label)){toast(`⚠️ WARNING: ${label} disabled for all ${device}s`,'te',5000)}else if(on){toast(`${label} enabled for all ${device}s ✓`,'ts')}else{toast(`${label} disabled for all ${device}s`,'tw')}}

async function svcToggle(el,label,critical){const on=el.checked;if(!on&&critical){const ok=await showModal(`⚠️ Disable ${label}?`,`Disabling <strong>${label}</strong> will affect all seniors. This is logged and may require supervisor approval.`,'Disable','cw');if(!ok){el.checked=true;return};toast(`⚠️ ${label} disabled — audit logged`,'te',5000)}else if(on){toast(`${label} re-enabled ✓`,'ts')}else{toast(`${label} disabled`,'tw')}}

// ACTIONS
async function dispatchAmbulance(){if(S.dispatched){toast('Ambulance already dispatched for this ticket','tw');return}const s=SENIORS[S.sid];const ok=await showModal('🚨 Dispatch Ambulance',`<div class="mh"><strong>${s.name}</strong><br>${s.address}<br>Ticket: ${S.tid}</div>Notifies emergency services and alerts <strong>${s.caregiver.name}</strong> (${s.caregiver.location}).<br><br>Add dispatch note:`,'🚨 Dispatch Now','cd','<textarea class="mta" id="dn" rows="2" placeholder="Optional note..."></textarea>');if(ok){S.dispatched=true;const note=(document.getElementById('dn')||{value:''}).value;addLog(S.sid,`🚨 <strong>Ambulance dispatched</strong> by Priya K.${note?' — '+note:''}`);toast('🚨 Ambulance dispatched · ETA 8 min · Caregiver notified','te',6000);renderRp()}}

function callSenior(){if(S.calling)return;S.calling=true;S.callSec=0;const s=SENIORS[S.sid];addLog(S.sid,`📞 Outbound call to <strong>${s.name}</strong> — Priya K.`);toast(`Calling ${s.name}...`,'ti');S.callInt=setInterval(()=>{S.callSec++;renderRp()},1000);renderRp()}
function endCall(){clearInterval(S.callInt);const dur=fmt(S.callSec);addLog(S.sid,`📞 Call ended · duration ${dur}`);toast(`Call ended · ${dur}`,'ts');S.calling=false;S.callSec=0;renderRp()}
function fmt(s){return`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`}

function alertFamily(){const s=SENIORS[S.sid];addLog(S.sid,`💬 WhatsApp to <strong>${s.caregiver.name}</strong> (${s.caregiver.location})`);toast(`WhatsApp sent to ${s.caregiver.name} ✓`,'ts')}

function addNote(){showModal('📋 Add Agent Note',`Note for <strong>${SENIORS[S.sid].name}</strong>:`,'Save Note','cs','<textarea class="mta" id="an" rows="3" placeholder="e.g. Spoke with senior — shaken but OK..."></textarea>').then(ok=>{if(ok){const note=(document.getElementById('an')||{value:''}).value.trim();if(note){addLog(S.sid,`📋 Agent note: ${note}`);toast('Note saved ✓','ts')}}})}

async function resolveTicket(){const t=TICKETS.find(t=>t.id===S.tid);if(!t||S.resolved.has(S.tid)||t.pri==='rv'){toast('Ticket already resolved','ti');return}const ok=await showModal('✓ Mark Resolved',`Mark <strong>${S.tid}</strong> as resolved?<br><br>Add resolution note:`,'Mark Resolved','cs','<textarea class="mta" id="rn" rows="2" placeholder="e.g. Confirmed safe — false alarm"></textarea>');if(ok){const note=(document.getElementById('rn')||{value:''}).value;S.resolved.add(S.tid);clearInterval(S.callInt);S.calling=false;S.callSec=0;S.dispatched=false;addLog(S.sid,`✓ Ticket <strong>${S.tid}</strong> resolved by Priya K.${note?' — '+note:''}`);toast(`Ticket resolved ✓`,'ts');updateStats();renderTickets();renderRp();if(!TICKETS.filter(t=>!S.closed.has(t.id)&&!isResolved(t)).length)document.getElementById('ribbon').className='ribbon off'}}

async function closeTicket(){const ok=await showModal('Close Ticket',`Archive <strong>${S.tid}</strong>? Record is not deleted.`,'Close Ticket','cw');if(ok){S.closed.add(S.tid);addLog(S.sid,`Ticket <strong>${S.tid}</strong> closed by Priya K.`);toast('Ticket closed and archived','ti');updateStats();renderTickets();const next=TICKETS.find(t=>!S.closed.has(t.id));if(next)selectTicket(next.id,next.sid);else renderRp()}}

function refreshGPS(){toast(`Refreshing GPS for ${SENIORS[S.sid].name}...`,'ti');setTimeout(()=>toast('GPS refreshed ✓ · accuracy 6m','ts'),1200)}
function navigateToSenior(){const s=SENIORS[S.sid];toast(`Opening ${s.gps.place} in Maps...`,'ti')}
function whatsappCg(){const s=SENIORS[S.sid];addLog(S.sid,`💬 WhatsApp to caregiver <strong>${s.caregiver.name}</strong>`);toast(`WhatsApp sent to ${s.caregiver.name} ✓`,'ts')}
function callCg(){const s=SENIORS[S.sid];toast(`Calling ${s.caregiver.name} (${s.caregiver.phone})...`,'ti',4000);addLog(S.sid,`📞 Call to caregiver <strong>${s.caregiver.name}</strong> initiated`)}
function viewInvoices(){toast(`Invoice history for ${SENIORS[S.sid].name} — ${SENIORS[S.sid].erp.invoices} invoice(s)`,'ti')}
async function pauseSub(){const s=SENIORS[S.sid];const ok=await showModal('⚠️ Pause Subscription',`Pause <strong>${s.erp.plan}</strong> for <strong>${s.name}</strong>?<br>All monitoring stops immediately.`,'Pause Subscription','cw');if(ok){s.erp.status='Paused';addLog(S.sid,'⚠️ Subscription <strong>paused</strong> by Priya K.');toast(`Subscription paused for ${s.name}`,'tw');renderRp()}}
function reassignDevice(){toast('Contact ops team: ops@healthsoft.in to reassign device','ti',5000)}

function perToggle(el,key,label){const s=SENIORS[S.sid];s.toggles[key]=el.checked;const on=el.checked;addLog(S.sid,`Toggle "${label}" set <strong>${on?'ON':'OFF'}</strong> by Priya K.`);toast(`${label}: ${on?'enabled ✓':'disabled ⚠️'} for ${s.name}`,on?'ts':'tw')}

// RENDER RIGHT PANEL
function renderRp(){const s=SENIORS[S.sid];const fns={profile:rpProfile,controls:rpControls,erp:rpERP,log:rpLog};document.getElementById('rp').innerHTML=fns[S.rpTab](s)}

function bc(b){return b>40?'b-ok':b>20?'b-low':'b-crit'}
function dc(b){return b>40?'g':b>20?'a':'r'}

function rpProfile(s){const rv=isResolved(TICKETS.find(t=>t.id===S.tid)||{});const clbl=S.calling?`⏹ End Call • ${fmt(S.callSec)}`:'📞 Call Senior';const cact=S.calling?'endCall()':'callSenior()';const d=s.devices;return`<div class="rp-sec"><div class="sc-top"><div class="sc-av">${s.initials}</div><div><div class="sc-name">${s.name}</div><div class="sc-age">${s.age} yrs · ${s.gender} · ${s.hsId}</div></div></div><div class="sf-row"><span class="sf-lbl">Address</span><span class="sf-val">${s.address.split(',').slice(0,2).join(',')}</span></div><div class="sf-row"><span class="sf-lbl">Medical</span><span class="sf-val">${s.medical}</span></div><div class="sf-row"><span class="sf-lbl">Subscribed</span><span class="sf-val">${s.subscribed}</span></div><div class="sf-row"><span class="sf-lbl">Ticket</span><span class="sf-val" style="color:${rv?'var(--green)':'var(--red)'}">${S.tid} · ${rv?'Resolved':'Active'}</span></div></div><div class="rp-sec"><div class="sec-lbl">Last location <span style="font-size:9px;background:#F5F3FF;color:#7C3AED;border-radius:4px;padding:1px 5px;font-weight:700;text-transform:none">Flespi</span></div><div class="map-box" onclick="navigateToSenior()"><div class="map-grid"></div><svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 280 105"><line x1="0" y1="52" x2="280" y2="52" stroke="rgba(255,255,255,.8)" stroke-width="1.5"/><line x1="140" y1="0" x2="140" y2="105" stroke="rgba(255,255,255,.8)" stroke-width="1.5"/><line x1="0" y1="26" x2="280" y2="26" stroke="rgba(255,255,255,.4)" stroke-width="1"/><line x1="0" y1="78" x2="280" y2="78" stroke="rgba(255,255,255,.4)" stroke-width="1"/><line x1="70" y1="0" x2="70" y2="105" stroke="rgba(255,255,255,.4)" stroke-width="1"/><line x1="210" y1="0" x2="210" y2="105" stroke="rgba(255,255,255,.4)" stroke-width="1"/><circle cx="${s.gps.cx}" cy="${s.gps.cy}" r="22" fill="rgba(192,57,43,.1)" stroke="#C0392B" stroke-width="1.5" stroke-dasharray="3,2"/><circle cx="${s.gps.cx}" cy="${s.gps.cy}" r="4" fill="#C0392B"/><circle cx="${s.gps.cx}" cy="${s.gps.cy}" r="8" fill="rgba(192,57,43,.25)"/><text x="${s.gps.cx+10}" y="${s.gps.cy-5}" fill="#C0392B" font-size="8" font-family="Plus Jakarta Sans,sans-serif" font-weight="700">${s.name.split(' ')[0]}</text><text x="${s.gps.cx+10}" y="${s.gps.cy+6}" fill="#64748B" font-size="7" font-family="Plus Jakarta Sans,sans-serif">${s.gps.place.split(',')[0]}</text></svg></div><div class="map-coords">${s.gps.lat}, ${s.gps.lng}</div><div class="map-actions"><button class="map-btn" onclick="refreshGPS()">🔄 Refresh</button><button class="map-btn" onclick="navigateToSenior()">📍 Navigate</button></div></div><div class="rp-sec"><div class="sec-lbl">Devices</div><div class="d-row"><div class="d-left"><span style="font-size:14px">🔵</span><div><div class="d-name">Pendant (EV-07B)</div><div class="d-sub">${d.pendant.sn} · IMEI …${d.pendant.imei.slice(-6)}</div></div></div><div class="d-right"><div class="ddot ${d.pendant.online?dc(d.pendant.battery):'x'}"></div><div class="batt-bar"><div class="batt-fill ${bc(d.pendant.battery)}" style="width:${d.pendant.battery}%"></div></div><span class="d-val">${d.pendant.battery}%</span></div></div><div class="d-row"><div class="d-left"><span style="font-size:14px">💊</span><div><div class="d-name">Pill Dispenser</div><div class="d-sub">${d.dispenser.sn}</div></div></div><div class="d-right"><div class="ddot ${d.dispenser.online?'g':'r'}"></div><span class="d-val">${d.dispenser.online?'Online':'Offline'}</span></div></div><div class="d-row"><div class="d-left"><span style="font-size:14px">💜</span><div><div class="d-name">Health Band</div><div class="d-sub">${d.band.sn} · ${d.band.hr}bpm · SpO₂${d.band.spo2}%</div></div></div><div class="d-right"><div class="ddot ${d.band.online?dc(d.band.battery):'x'}"></div><div class="batt-bar"><div class="batt-fill ${bc(d.band.battery)}" style="width:${d.band.battery}%"></div></div><span class="d-val">${d.band.battery}%</span></div></div></div><div class="rp-sec"><div class="sec-lbl">Caregiver</div><div class="cg-box"><div class="cg-name">${s.caregiver.name}</div><div class="cg-rel">${s.caregiver.relation} · ${s.caregiver.location}<br>${s.caregiver.phone}</div><div class="cg-btns"><button class="cg-btn" onclick="whatsappCg()">💬 WhatsApp</button><button class="cg-btn pri" onclick="callCg()">📞 Call Now</button></div></div></div><div class="rp-sec"><div class="sec-lbl">Actions</div><button class="act-btn ab-red" onclick="dispatchAmbulance()" ${S.dispatched?'disabled style="background:var(--green)"':''}>${S.dispatched?'🚨 Dispatched ✓':'🚨 Dispatch Ambulance'}</button><button class="act-btn ${S.calling?'ab-red':'ab-or'}" onclick="${cact}">${clbl}</button><button class="act-btn ab-or" onclick="alertFamily()">💬 Alert Family</button><button class="act-btn ab-in" onclick="addNote()">📋 Add Note</button><button class="act-btn ab-gr" onclick="resolveTicket()" ${rv?'disabled':''}>✓ Mark Resolved</button><button class="act-btn ab-gh" onclick="closeTicket()">✕ Close Ticket</button></div>`}

function tRow(key,label,sub,s){return`<div class="toggle-row"><div><div class="toggle-label">${label}</div><div class="toggle-sub">${sub}</div></div><label class="toggle"><input type="checkbox" ${s.toggles[key]?'checked':''} onchange="perToggle(this,'${key}','${label}')"><span class="slider"></span></label></div>`}

function rpControls(s){return`<div class="rp-sec"><div class="sec-lbl">🔵 Pendant — ${s.name.split(' ')[0]}</div>${tRow('fall','Fall detection alerts','P1 ticket on fall.alarm.start',s)}${tRow('sos','SOS button alerts','P1 ticket on sos.press',s)}${tRow('geo','Geo-fence monitoring','Alert if outside home zone (Flespi)',s)}</div><div class="rp-sec"><div class="sec-lbl">💊 Pill Dispenser — ${s.name.split(' ')[0]}</div>${tRow('missedDose','Missed dose alerts','Ticket if dose not dispensed in window',s)}${tRow('doseConfirm','Dose confirmation to app','Push on each successful dispense',s)}</div><div class="rp-sec"><div class="sec-lbl">💜 Health Band — ${s.name.split(' ')[0]}</div>${tRow('hr','Heart rate alerts','Alert if HR exceeds 130bpm threshold',s)}${tRow('spo2','SpO₂ low alerts','Alert if oxygen drops below 90%',s)}${tRow('inactivity','Inactivity alerts','Alert if no movement for 4+ hrs (daytime)',s)}</div><div class="rp-sec"><div class="sec-lbl">Quick Actions</div><button class="act-btn ab-gh" style="font-size:11px;padding:7px" onclick="toast('Geo-fence editor opened for ${s.name}','ti')">📍 Edit Geo-fence Boundary</button><button class="act-btn ab-gh" style="font-size:11px;padding:7px" onclick="toast('Medication schedule opened for ${s.name}','ti')">💊 Edit Medication Schedule</button><button class="act-btn ab-gh" style="font-size:11px;padding:7px" onclick="toast('Notification preferences opened','ti')">⚙️ Notification Preferences</button></div>`}

function rpERP(s){const sc=s.erp.status==='Active'?'act':s.erp.status==='Paused'?'pau':'';return`<div class="rp-sec"><div class="sec-lbl">Subscription</div><div class="erp-row"><span class="erp-key">Plan</span><span class="erp-val">${s.erp.plan}</span></div><div class="erp-row"><span class="erp-key">Status</span><span class="erp-val ${sc}">${s.erp.status}</span></div><div class="erp-row"><span class="erp-key">Billing</span><span class="erp-val">${s.erp.billing}</span></div><div class="erp-row"><span class="erp-key">Amount</span><span class="erp-val">${s.erp.amount}</span></div><div class="erp-row"><span class="erp-key">Next billing</span><span class="erp-val">${s.erp.nextBilling}</span></div><div class="erp-row"><span class="erp-key">Invoices</span><span class="erp-val">${s.erp.invoices} on file</span></div><button class="erp-btn" onclick="viewInvoices()">📄 View Invoices</button><button class="erp-btn" onclick="toast('Billing portal opened for ${s.name}','ti')">💳 Update Billing</button><button class="erp-btn dng" onclick="pauseSub()">⏸ Pause Subscription</button></div><div class="rp-sec"><div class="sec-lbl">Device Assignments</div><div class="da-box"><div class="da-name">🔵 Pendant (EV-07B)</div><div class="da-sn">S/N: ${s.devices.pendant.sn} · IMEI: ${s.devices.pendant.imei}</div></div><div class="da-box"><div class="da-name">💊 Pill Dispenser</div><div class="da-sn">S/N: ${s.devices.dispenser.sn} · ${s.devices.dispenser.model}</div></div><div class="da-box"><div class="da-name">💜 Health Band</div><div class="da-sn">S/N: ${s.devices.band.sn}</div></div><button class="erp-btn" onclick="reassignDevice()" style="margin-top:2px">🔄 Reassign Device</button></div><div class="rp-sec"><div class="sec-lbl">Account</div><div class="erp-row"><span class="erp-key">Senior ID</span><span class="erp-val">${s.hsId}</span></div><div class="erp-row"><span class="erp-key">Since</span><span class="erp-val">${s.subscribed}</span></div><div class="erp-row"><span class="erp-key">Primary contact</span><span class="erp-val">${s.caregiver.name}</span></div><button class="erp-btn" onclick="toast('Opening full ERP profile ${s.hsId}...','ti')">🔗 Open Full ERP Profile</button><button class="erp-btn" onclick="toast('PDF report generating for ${s.name}...','ti')">📥 Export PDF Report</button></div>`}

function rpLog(s){return`<div class="rp-sec" style="border-bottom:none"><div class="sec-lbl">Activity Log<button onclick="toast('Log exported as CSV ✓','ts')" style="font-size:9px;padding:2px 7px;border-radius:5px;border:1px solid var(--border);background:var(--bg);color:var(--navy);font-weight:700;font-family:inherit;cursor:pointer">Export</button></div>${s.log.map(e=>`<div class="feed-item"><span class="feed-time">${e.time}</span><span class="feed-text">${e.text}</span></div>`).join('')}</div>`}

// ── CRITICAL ALERT SYSTEM ─────────────────────────────────────
S.alarmCtx=null;S.alarmInt=null;S.critTimerInt=null;S.critSec=60;S.critTid=null;

function startAlarm(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    S.alarmCtx=ctx;let ph=0;
    S.alarmInt=setInterval(()=>{
      const osc=ctx.createOscillator();const g=ctx.createGain();
      osc.connect(g);g.connect(ctx.destination);
      osc.frequency.value=ph%2===0?960:700;
      g.gain.setValueAtTime(0.4,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.25);
      osc.start(ctx.currentTime);osc.stop(ctx.currentTime+0.25);ph++;
    },300);
  }catch(e){}
}

function stopAlarm(){
  clearInterval(S.alarmInt);
  if(S.alarmCtx){try{S.alarmCtx.close()}catch(e){}S.alarmCtx=null;}
}

function showCritical(ticket){
  const s=SENIORS[ticket.sid];
  S.critTid=ticket.id;S.critSec=60;
  document.getElementById('crit-type').textContent=ticket.type.toUpperCase();
  document.getElementById('crit-name').textContent=s.name;
  document.getElementById('crit-detail').textContent='📍 '+ticket.loc+' · '+ticket.time;
  document.getElementById('crit-ticket').textContent=ticket.id+' · Agent: '+ticket.agent;
  const overlay=document.getElementById('crit-overlay');
  overlay.classList.remove('hidden');
  startAlarm();
  S.critTimerInt=setInterval(()=>{
    S.critSec--;
    const el=document.getElementById('crit-timer');
    if(S.critSec>0){
      el.textContent='Auto-escalating to supervisor in '+S.critSec+'s';
      if(S.critSec<=15)el.classList.add('urgent');
    }else{
      clearInterval(S.critTimerInt);
      el.className='crit-timer escalated';
      el.textContent='⚠️ ESCALATED TO SUPERVISOR — ACKNOWLEDGE IMMEDIATELY';
      addLog(ticket.sid,'⚠️ Alert <strong>auto-escalated</strong> to supervisor — no response in 60s');
      toast('⚠️ No response for 60s — auto-escalated to supervisor','te',8000);
    }
  },1000);
}

function ackCritical(){
  clearInterval(S.critTimerInt);
  stopAlarm();
  document.getElementById('crit-overlay').classList.add('hidden');
  const t=TICKETS.find(t=>t.id===S.critTid);
  if(t){selectTicket(t.id,t.sid);if(!S.ribbonAck)ackRibbon();}
  toast('Critical alert acknowledged — take immediate action now','te',5000);
}

function checkCritOnLoad(){
  const t=TICKETS.find(t=>t.pri==='p1'&&!S.resolved.has(t.id)&&t.pri!=='rv');
  if(t)showCritical(t);
}

// INIT
renderTickets();renderRp();updateStats();checkCritOnLoad();
</script>
</body>
</html>
