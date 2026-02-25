import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";

// ─────────────────────────────────────────────────────────────────────────────
// ⚙️  CONFIGURACIÓN — Reemplazá con los datos de tu proyecto Supabase
//     supabase.com → tu proyecto → Settings → API
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = "https://wzaipvpjnfmjzrptwplr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PbXEf4b23PsAyeVK-Kkjrg_OXNNrePi";
// ─────────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --rose:       #e8a0b4;
    --rose-light: #f5d0de;
    --rose-dark:  #c2627e;
    --rose-deep:  #9b3a58;
    --lilac:      #b590c8;
    --lilac-light:#e4d4f0;
    --lilac-dark: #7e4fa0;
    --lilac-deep: #5c2d7a;
    --blush:      #fdf0f5;
    --white:      #ffffff;
    --ink:        #2d1a24;
    --muted:      #8a7080;
    --border:     rgba(181,144,200,0.25);
    --shadow:     rgba(156,90,130,0.1);
    --r:          8px;
    --r-lg:       14px;
  }

  body {
    font-family: 'Nunito', sans-serif;
    background: var(--blush);
    color: var(--ink);
    min-height: 100vh;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--lilac-light); }
  ::-webkit-scrollbar-thumb { background: var(--lilac); border-radius: 3px; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── LOGIN ─────────────────────────────────────────────────────── */
  .login-screen {
    min-height: 100vh;
    display: flex;
    background: linear-gradient(135deg, #2d1a24 0%, #4a1a38 40%, #2a0d3a 100%);
    position: relative; overflow: hidden;
  }
  .login-bg {
    position: absolute; inset: 0; overflow: hidden;
  }
  /* Círculos decorativos de fondo */
  .login-bg::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(181,144,200,0.15) 0%, transparent 70%);
    top: -200px; right: -100px;
  }
  .login-bg::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(232,160,180,0.12) 0%, transparent 70%);
    bottom: -100px; left: -80px;
  }
  /* Patrón de líneas finas */
  .login-pattern {
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle at 1px 1px, rgba(181,144,200,0.08) 1px, transparent 0);
    background-size: 32px 32px;
  }
  .login-card {
    position: relative; z-index: 2;
    margin: auto;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(181,144,200,0.3);
    border-radius: var(--r-lg);
    padding: 52px 48px;
    width: 100%; max-width: 440px;
    box-shadow:
      0 40px 80px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255,255,255,0.1) inset;
  }
  /* Escudo / logo en el login */
  .login-shield {
    text-align: center; margin-bottom: 32px;
  }
  .shield-icon {
    width: 90px; height: 90px;
    margin: 0 auto 16px;
    background: linear-gradient(145deg, var(--lilac-deep), var(--rose-deep));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow:
      0 8px 32px rgba(156,58,120,0.35),
      0 0 0 6px rgba(181,144,200,0.15);
    position: relative;
  }
  .shield-icon::before {
    content: '';
    position: absolute; inset: 6px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.2);
  }
  .shield-icon span { font-size: 38px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
  .login-shield h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 700;
    color: var(--lilac-deep);
    letter-spacing: 0.5px;
  }
  .login-shield p {
    font-size: 12px; font-weight: 600; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--muted); margin-top: 4px;
  }
  /* Línea decorativa */
  .orndivider {
    display: flex; align-items: center; gap: 10px;
    margin: 24px 0;
  }
  .orndivider span { flex: 1; height: 1px; background: var(--border); }
  .orndivider em {
    font-style: normal; font-size: 18px;
    background: linear-gradient(135deg, var(--lilac), var(--rose));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* ── FIELDS ─────────────────────────────────────────────────────── */
  .field { margin-bottom: 18px; }
  .field label {
    display: block; font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--lilac-dark); margin-bottom: 6px;
  }
  .field input, .field select, .field textarea {
    width: 100%; padding: 12px 16px;
    background: white; color: var(--ink);
    border: 1.5px solid var(--border);
    border-radius: var(--r);
    font-family: 'Nunito', sans-serif; font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s; outline: none;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: var(--lilac);
    box-shadow: 0 0 0 3px rgba(181,144,200,0.2);
  }
  .field textarea { resize: vertical; min-height: 80px; }

  /* ── BUTTONS ─────────────────────────────────────────────────────── */ 
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 11px 22px; border: none; border-radius: var(--r);
    font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.3px; cursor: pointer; transition: all 0.18s;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--lilac-dark), var(--rose-dark));
    color: white;
    box-shadow: 0 4px 16px rgba(126,79,160,0.35);
  }
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(126,79,160,0.4);
  }
  .btn-secondary {
    background: white; color: var(--lilac-dark);
    border: 1.5px solid var(--border);
  }
  .btn-secondary:hover { background: var(--lilac-light); border-color: var(--lilac); }
  .btn-danger { background: #ff6b8a; color: white; }
  .btn-danger:hover { background: #e8536f; }
  .btn-pdf { background: linear-gradient(135deg, #e8a0b4, #c2627e); color: white; }
  .btn-pdf:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(194,98,126,0.4); }
  .btn-ghost { background: transparent; color: var(--muted); }
  .btn-ghost:hover { color: var(--ink); background: var(--lilac-light); border-radius: var(--r); }
  .btn-full { width: 100%; justify-content: center; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* ── NAVBAR ──────────────────────────────────────────────────────── */
  .navbar {
    background: linear-gradient(135deg, var(--lilac-deep) 0%, var(--rose-deep) 100%);
    padding: 0 24px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 4px 20px rgba(92,45,122,0.3);
  }
  .navbar-brand { display: flex; align-items: center; gap: 12px; }
  .nav-logo {
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .navbar-brand h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px; font-weight: 700; color: white;
    text-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
  .navbar-brand p {
    font-size: 11px; font-weight: 500; letter-spacing: 2px;
    text-transform: uppercase; color: rgba(255,255,255,0.6);
    margin-top: -1px;
  }
  .navbar-right { display: flex; align-items: center; gap: 12px; }
  .user-pill {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 600;
    padding: 5px 14px; border-radius: 20px;
    max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .btn-signout {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600;
    padding: 6px 14px; border-radius: var(--r); cursor: pointer;
    transition: all 0.18s; font-family: 'Nunito', sans-serif;
  }
  .btn-signout:hover { background: rgba(255,255,255,0.22); color: white; }

  /* ── MAIN ─────────────────────────────────────────────────────────── */
  .main { flex: 1; padding: 28px 24px; max-width: 1400px; margin: 0 auto; width: 100%; }

  /* ── STATS ───────────────────────────────────────────────────────── */
  .stats-bar { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: white; border-radius: var(--r-lg);
    padding: 18px 20px; display: flex; align-items: center; gap: 14px;
    box-shadow: 0 2px 12px var(--shadow);
    border: 1px solid var(--border);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--shadow); }
  .stat-card.c-lilac::before { background: linear-gradient(90deg, var(--lilac-dark), var(--lilac)); }
  .stat-card.c-rose::before  { background: linear-gradient(90deg, var(--rose-dark), var(--rose)); }
  .stat-card.c-sage::before  { background: linear-gradient(90deg, #7eb09a, #a8d5c5); }
  .stat-card.c-muted::before { background: linear-gradient(90deg, #b0a0b8, #d4c8dc); }
  .stat-ico {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
    flex-shrink: 0;
  }
  .c-lilac .stat-ico { background: var(--lilac-light); }
  .c-rose  .stat-ico { background: var(--rose-light); }
  .c-sage  .stat-ico { background: #e0f2ec; }
  .c-muted .stat-ico { background: #ede8f0; }
  .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 700; line-height: 1; color: var(--ink); }
  .stat-label { font-size: 11px; color: var(--muted); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

  /* ── TOOLBAR ─────────────────────────────────────────────────────── */
  .toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
  .toolbar h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 700; flex: 1; min-width: 120px;
    color: var(--lilac-deep);
  }
  .search-wrap { position: relative; }
  .search-wrap input {
    padding: 10px 14px 10px 38px; border: 1.5px solid var(--border);
    border-radius: var(--r); font-size: 13px; width: 220px;
    background: white; outline: none; transition: border-color 0.2s;
    font-family: 'Nunito', sans-serif;
  }
  .search-wrap input:focus { border-color: var(--lilac); box-shadow: 0 0 0 3px rgba(181,144,200,0.15); }
  .search-ico { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 15px; pointer-events: none; }
  .filter-sel {
    padding: 10px 12px; border: 1.5px solid var(--border); border-radius: var(--r);
    font-size: 13px; background: white; outline: none; cursor: pointer;
    font-family: 'Nunito', sans-serif; color: var(--ink);
    transition: border-color 0.2s;
  }
  .filter-sel:focus { border-color: var(--lilac); }

  /* ── TABLE ───────────────────────────────────────────────────────── */
  .table-wrap {
    background: white; border-radius: var(--r-lg);
    border: 1px solid var(--border); overflow: hidden;
    box-shadow: 0 2px 16px var(--shadow);
  }
  table { width: 100%; border-collapse: collapse; }
  thead tr {
    background: linear-gradient(135deg, #f7edf5 0%, #ede8f5 100%);
    border-bottom: 2px solid var(--border);
  }
  thead th {
    text-align: left; padding: 13px 16px;
    font-size: 10px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--lilac-dark); white-space: nowrap;
  }
  tbody tr { border-bottom: 1px solid #f5eef8; transition: background 0.15s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: #fdf5ff; }
  tbody td { padding: 13px 16px; font-size: 13px; vertical-align: middle; }
  .td-main { font-weight: 700; color: var(--ink); }
  .td-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .truncate { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .actions { display: flex; gap: 5px; flex-wrap: wrap; }

  /* ── BADGES ──────────────────────────────────────────────────────── */
  .badge {
    display: inline-flex; align-items: center;
    padding: 4px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700; white-space: nowrap;
  }
  .b-aprehension { background: #fff0e6; color: #c45000; }
  .b-arresto     { background: #ffe4ec; color: #b71c4a; }
  .b-detencion   { background: #ede8f5; color: var(--lilac-deep); }
  .b-activa      { background: #e8f5e9; color: #2e7d32; }
  .b-cerrada     { background: #fce4ec; color: #880e4f; }
  .b-archivada   { background: #f3f0f7; color: #6a5a7a; }

  /* ── MODAL ───────────────────────────────────────────────────────── */
  .overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(45,26,36,0.65);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 24px 16px; overflow-y: auto;
    backdrop-filter: blur(6px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: white; border-radius: var(--r-lg);
    border: 1px solid var(--border);
    width: 100%; max-width: 760px;
    box-shadow: 0 40px 80px rgba(92,45,122,0.25);
    animation: slideUp 0.22s ease; margin: auto;
    overflow: hidden;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
  .modal-head {
    padding: 22px 28px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(135deg, var(--lilac-deep) 0%, var(--rose-deep) 100%);
  }
  .modal-head h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 700; color: white;
  }
  .modal-head p { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .modal-x {
    background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
    color: white; font-size: 18px; cursor: pointer;
    padding: 4px 10px; border-radius: 6px; transition: background 0.18s;
    line-height: 1;
  }
  .modal-x:hover { background: rgba(255,255,255,0.25); }
  .modal-body { padding: 26px 28px; max-height: 72vh; overflow-y: auto; background: white; }
  .modal-foot {
    padding: 16px 28px; border-top: 1px solid var(--border);
    display: flex; justify-content: flex-end; gap: 10px;
    background: #fdf5ff;
  }

  /* ── FORM GRID ───────────────────────────────────────────────────── */
  .fg { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .fg .full { grid-column: 1 / -1; }
  .sec {
    font-size: 10px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: var(--lilac-dark);
    padding: 16px 0 8px; border-bottom: 1.5px solid var(--lilac-light);
    margin-bottom: 2px; grid-column: 1 / -1;
    display: flex; align-items: center; gap: 8px;
  }
  .sec::after { content: ''; flex: 1; height: 1px; }

  /* Tipo de privación */
  .tipo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .tipo-opt input { display: none; }
  .tipo-lbl {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 6px; padding: 14px 10px;
    border: 2px solid var(--border); border-radius: var(--r);
    font-size: 12px; font-weight: 700; cursor: pointer;
    transition: all 0.18s; background: #fdf5ff; text-align: center;
    color: var(--muted);
  }
  .tipo-lbl .tipo-ico { font-size: 22px; }
  .tipo-opt input:checked + .tipo-lbl {
    border-color: var(--lilac-dark);
    background: var(--lilac-light);
    color: var(--lilac-deep);
    box-shadow: 0 2px 12px rgba(126,79,160,0.2);
  }
  .tipo-lbl:hover { border-color: var(--lilac); background: var(--lilac-light); }

  /* ── DETALLE ─────────────────────────────────────────────────────── */
  .dsec { margin-bottom: 24px; }
  .dsec h3 {
    font-size: 10px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: var(--lilac-dark);
    padding-bottom: 8px; border-bottom: 2px solid var(--lilac-light);
    margin-bottom: 14px; display: flex; align-items: center; gap: 7px;
  }
  .dgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .dgrid .full { grid-column: 1 / -1; }
  .di-wrap {
    background: var(--blush); border-radius: var(--r);
    padding: 12px 14px; border: 1px solid var(--border);
  }
  .di-label { font-size: 11px; color: var(--muted); font-weight: 600; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 1px; }
  .di-value { font-size: 14px; font-weight: 500; color: var(--ink); white-space: pre-wrap; word-break: break-word; }
  .di-empty { color: #ccc; font-style: italic; font-size: 13px; }

  /* ── EMPTY / LOADING ─────────────────────────────────────────────── */
  .empty { text-align: center; padding: 72px 20px; }
  .empty .eico { font-size: 52px; margin-bottom: 14px; }
  .empty h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--lilac); margin-bottom: 8px; }
  .empty p { font-size: 14px; color: var(--muted); margin-bottom: 22px; }
  .loader { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 200px; color: var(--lilac-dark); font-size: 14px; font-weight: 600; }
  .spin { width: 22px; height: 22px; border: 2.5px solid var(--border); border-top-color: var(--lilac); border-radius: 50%; animation: rot 0.8s linear infinite; }
  @keyframes rot { to { transform: rotate(360deg); } }

  /* ── TOAST ───────────────────────────────────────────────────────── */
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    background: linear-gradient(135deg, var(--lilac-deep), var(--rose-deep));
    color: white; padding: 13px 20px; border-radius: var(--r);
    font-size: 13px; font-weight: 600;
    box-shadow: 0 8px 30px rgba(92,45,122,0.35);
    animation: toastIn 0.3s ease; max-width: 320px;
    display: flex; align-items: center; gap: 8px;
  }
  .toast.err { background: linear-gradient(135deg, #c0392b, #e74c3c); }
  @keyframes toastIn { from { transform: translateX(100px); opacity: 0; } to { transform: none; opacity: 1; } }

  /* ── ALERT ───────────────────────────────────────────────────────── */
  .alert { padding: 11px 16px; border-radius: var(--r); margin-bottom: 16px; font-size: 13px; font-weight: 500; }
  .alert-err { background: #fff0f3; border: 1.5px solid #ffb3c6; color: #b71c4a; }
  .alert-ok  { background: #f0faf2; border: 1.5px solid #b2dfdb; color: #1b5e20; }

  /* ── FOOTER ──────────────────────────────────────────────────────── */
  .table-footer {
    padding: 12px 16px; border-top: 1px solid var(--border);
    font-size: 12px; color: var(--muted); text-align: right;
    background: #fdf5ff;
  }

  /* ── RESPONSIVE ──────────────────────────────────────────────────── */
  @media (max-width: 960px) { .stats-bar { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 640px) {
    .main { padding: 16px 12px; }
    .stats-bar { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .stat-card { padding: 12px 14px; }
    .stat-value { font-size: 24px; }
    .fg { grid-template-columns: 1fr; }
    .fg .full, .sec { grid-column: 1; }
    .tipo-grid { grid-template-columns: 1fr; }
    .dgrid { grid-template-columns: 1fr; }
    .dgrid .full { grid-column: 1; }
    .search-wrap input { width: 150px; }
    .toolbar { gap: 8px; }
    .modal-body { padding: 18px; }
    .modal-head { padding: 16px 18px; }
    .modal-foot { padding: 14px 18px; }
    .login-card { padding: 32px 22px; }
    .navbar-brand p { display: none; }
    .user-pill { display: none; }
    thead { display: none; }
    tbody tr { display: block; padding: 14px 16px; border-radius: 8px; margin: 8px; border: 1px solid var(--border); }
    tbody td { display: block; padding: 3px 0; border: none; }
    tbody td::before {
      content: attr(data-label);
      font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; color: var(--lilac-dark);
      display: block; margin-bottom: 1px;
    }
    .actions { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
  }
  @media (max-width: 400px) { .stats-bar { grid-template-columns: 1fr; } }
`;

// ── CONSTANTES ────────────────────────────────────────────────────────────────
const TIPOS = {
  aprehension: { label: 'Aprehensión', ico: '🔒' },
  arresto:     { label: 'Arresto',     ico: '⛓️' },
  detencion:   { label: 'Detención',   ico: '🚨' },
};
const ESTADOS = { activa: 'Activa', cerrada: 'Cerrada', archivada: 'Archivada' };
const EMPTY = {
  numero_expediente: '', victima: '', sindicado: '', delito: '',
  tipo_privacion: 'aprehension', fecha_privacion: '', fecha_liberacion: '',
  inspeccion_ocular: '', camara: '', testigos: '', peritos: '',
  comision: '', testimonios: '', informacion_adicional: '', estado: 'activa'
};

const fmtDate = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null;

// ── EXPORTAR PDF ──────────────────────────────────────────────────────────────
function exportarPDF(causa) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, mg = 18, lh = 7;
  let y = 20;

  const addLine = (text, x = mg, size = 11, style = 'normal', color = [45, 26, 36]) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - mg * 2);
    lines.forEach(l => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(l, x, y);
      y += lh;
    });
  };

  const addField = (label, value) => {
    if (!value) return;
    addLine(label.toUpperCase(), mg, 8, 'bold', [126, 79, 160]);
    addLine(value || '—', mg, 10, 'normal', [45, 26, 36]);
    y += 2;
  };

  const addSection = (title) => {
    y += 4;
    doc.setFillColor(237, 226, 245);
    doc.roundedRect(mg - 2, y - 5, W - mg * 2 + 4, 8, 2, 2, 'F');
    addLine(title.toUpperCase(), mg, 9, 'bold', [94, 45, 122]);
    y += 2;
  };

  // ── Encabezado ──
  doc.setFillColor(92, 45, 122);
  doc.rect(0, 0, W, 38, 'F');
  doc.setFillColor(194, 98, 126);
  doc.rect(0, 32, W, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('⚖  ALDANA CATIVA', mg, 16);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 195, 240);
  doc.text('CAUSAS JUDICIALES', mg, 24);

  y = 50;

  // Número y estado
  const nro = causa.numero_expediente ? `Expediente N° ${causa.numero_expediente}` : 'Expediente sin número';
  addLine(nro, mg, 16, 'bold', [92, 45, 122]);
  y += 2;

  const estadoLabel = ESTADOS[causa.estado] || '';
  doc.setFillColor(causa.estado === 'activa' ? 46 : causa.estado === 'cerrada' ? 183 : 106,
                   causa.estado === 'activa' ? 125 : causa.estado === 'cerrada' ? 28 : 90,
                   causa.estado === 'activa' ? 50  : causa.estado === 'cerrada' ? 74  : 122);
  doc.roundedRect(mg, y, 30, 7, 2, 2, 'F');
  doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(255,255,255);
  doc.text(estadoLabel.toUpperCase(), mg + 3, y + 5);
  y += 12;

  // ── Partes ──
  addSection('Partes Involucradas');
  addField('Víctima', causa.victima);
  addField('Sindicado', causa.sindicado);
  addField('Delito', causa.delito);

  // ── Privación ──
  addSection('Privación de Libertad');
  addField('Tipo', TIPOS[causa.tipo_privacion]?.label);
  addField('Fecha de Privación', fmtDate(causa.fecha_privacion));
  addField('Fecha de Liberación', fmtDate(causa.fecha_liberacion));

  // ── Evidencia ──
  addSection('Evidencia y Pruebas');
  addField('Inspección Ocular', causa.inspeccion_ocular);
  addField('Cámara / Filmación', causa.camara);
  addField('Testigos', causa.testigos);
  addField('Peritos', causa.peritos);
  addField('Comisión', causa.comision);
  addField('Testimonios', causa.testimonios);

  // ── Adicional ──
  if (causa.informacion_adicional) {
    addSection('Información Adicional');
    addField('Notas', causa.informacion_adicional);
  }

  // ── Pie ──
  const pag = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pag; i++) {
    doc.setPage(i);
    doc.setFillColor(245, 240, 250);
    doc.rect(0, 285, W, 15, 'F');
    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(150, 120, 170);
    doc.text(`Generado: ${new Date().toLocaleString('es-AR')}`, mg, 292);
    doc.text(`Página ${i} de ${pag}`, W - mg, 292, { align: 'right' });
  }

  const filename = `expediente-${causa.numero_expediente || causa.id.slice(0,8)}-${causa.victima.replace(/\s+/g,'-')}.pdf`;
  doc.save(filename);
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast${type === 'error' ? ' err' : ''}`}>{type === 'error' ? '⚠️' : '✅'} {msg}</div>;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [mode, setMode]     = useState('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]       = useState(null);

  const submit = async e => {
    e.preventDefault(); setLoading(true); setMsg(null);
    try {
      const { error } = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password: pass })
        : await supabase.auth.signUp({ email, password: pass });
      if (error) throw error;
      if (mode === 'register') setMsg({ type: 'ok', text: '¡Cuenta creada! Verificá tu email antes de ingresar.' });
    } catch (err) { setMsg({ type: 'err', text: err.message }); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-screen">
      <div className="login-bg" />
      <div className="login-pattern" />
      <div className="login-card">
        {/* Escudo / Logo */}
        <div className="login-shield">
          <div className="shield-icon"><span>⚖️</span></div>
          <h1>Dra Aldana Cativa</h1>
          <p>Causas Judiciales</p>
        </div>
        <div className="orndivider"><span /><em>✦</em><span /></div>

        {msg && <div className={`alert alert-${msg.type === 'ok' ? 'ok' : 'err'}`}>{msg.text}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Correo Electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? '⏳ Procesando...' : mode === 'login' ? '🔐 Ingresar al Sistema' : '✨ Crear Cuenta'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setMsg(null); }} style={{ fontSize: 13 }}>
            {mode === 'login' ? 'Crear nueva cuenta' : '← Volver al login'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL FORMULARIO ──────────────────────────────────────────────────────────
function FormModal({ causa, onClose, onSave }) {
  const [f, setF]       = useState(causa ? { ...EMPTY, ...causa } : { ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [err, setErr]   = useState('');
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.victima.trim() || !f.sindicado.trim() || !f.delito.trim()) {
      setErr('Víctima, Sindicado y Delito son campos obligatorios.'); return;
    }
    setLoading(true); setErr('');
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      ...f, user_id: user.id, updated_at: new Date().toISOString(),
      fecha_privacion:  f.fecha_privacion  || null,
      fecha_liberacion: f.fecha_liberacion || null,
      numero_expediente: f.numero_expediente || null,
    };
    const { error } = causa?.id
      ? await supabase.from('causas').update(payload).eq('id', causa.id)
      : await supabase.from('causas').insert(payload);
    setLoading(false);
    if (error) { setErr('Error: ' + error.message); return; }
    onSave();
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h2>{causa ? '✏️ Editar Expediente' : '📋 Nuevo Expediente'}</h2>
            <p>Complete los campos del expediente judicial</p>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {err && <div className="alert alert-err">{err}</div>}
          <div className="fg">
            <div className="sec">📌 Identificación</div>
            <div className="field">
              <label>N° Expediente</label>
              <input value={f.numero_expediente || ''} onChange={e => set('numero_expediente', e.target.value)} placeholder="Ej: 2024-001" />
            </div>
            <div className="field">
              <label>Estado</label>
              <select value={f.estado} onChange={e => set('estado', e.target.value)}>
                <option value="activa">Activa</option>
                <option value="cerrada">Cerrada</option>
                <option value="archivada">Archivada</option>
              </select>
            </div>

            <div className="sec">👥 Partes Involucradas</div>
            <div className="field">
              <label>Víctima *</label>
              <input value={f.victima} onChange={e => set('victima', e.target.value)} placeholder="Nombre completo" />
            </div>
            <div className="field">
              <label>Sindicado *</label>
              <input value={f.sindicado} onChange={e => set('sindicado', e.target.value)} placeholder="Nombre completo" />
            </div>
            <div className="field full">
              <label>Delito *</label>
              <input value={f.delito} onChange={e => set('delito', e.target.value)} placeholder="Descripción del delito imputado" />
            </div>

            <div className="sec">🔒 Tipo de Privación de Libertad</div>
            <div className="full">
              <div className="tipo-grid">
                {Object.entries(TIPOS).map(([val, { label, ico }]) => (
                  <label className="tipo-opt" key={val}>
                    <input type="radio" name="tipo" value={val} checked={f.tipo_privacion === val} onChange={() => set('tipo_privacion', val)} />
                    <div className="tipo-lbl">
                      <span className="tipo-ico">{ico}</span>
                      {label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Fecha de Privación</label>
              <input type="date" value={f.fecha_privacion || ''} onChange={e => set('fecha_privacion', e.target.value)} />
            </div>
            <div className="field">
              <label>Fecha de Liberación</label>
              <input type="date" value={f.fecha_liberacion || ''} onChange={e => set('fecha_liberacion', e.target.value)} />
            </div>

            <div className="sec">🔍 Evidencia y Pruebas</div>
            <div className="field">
              <label>Inspección Ocular</label>
              <textarea value={f.inspeccion_ocular || ''} onChange={e => set('inspeccion_ocular', e.target.value)} placeholder="Detalles de la inspección..." />
            </div>
            <div className="field">
              <label>Cámara / Filmación</label>
              <textarea value={f.camara || ''} onChange={e => set('camara', e.target.value)} placeholder="Referencias a cámaras o filmaciones..." />
            </div>
            <div className="field">
              <label>Testigos</label>
              <textarea value={f.testigos || ''} onChange={e => set('testigos', e.target.value)} placeholder="Nombres y datos de los testigos..." />
            </div>
            <div className="field">
              <label>Peritos</label>
              <textarea value={f.peritos || ''} onChange={e => set('peritos', e.target.value)} placeholder="Peritos intervinientes..." />
            </div>
            <div className="field">
              <label>Comisión</label>
              <textarea value={f.comision || ''} onChange={e => set('comision', e.target.value)} placeholder="Comisión interviniente..." />
            </div>
            <div className="field">
              <label>Testimonios</label>
              <textarea value={f.testimonios || ''} onChange={e => set('testimonios', e.target.value)} placeholder="Resumen de testimonios..." />
            </div>

            <div className="sec">📝 Notas</div>
            <div className="field full">
              <label>Información Adicional</label>
              <textarea value={f.informacion_adicional || ''} onChange={e => set('informacion_adicional', e.target.value)} placeholder="Observaciones o cualquier dato relevante..." style={{ minHeight: 100 }} />
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={loading}>
            {loading ? '⏳ Guardando...' : '💾 Guardar Expediente'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL DETALLE ─────────────────────────────────────────────────────────────
function DetailModal({ causa, onClose, onEdit }) {
  const DI = ({ label, value, full }) => (
    <div className={`di-wrap${full ? ' full' : ''}`}>
      <div className="di-label">{label}</div>
      <div className="di-value">{value || <span className="di-empty">Sin datos</span>}</div>
    </div>
  );
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h2>📁 {causa.numero_expediente ? `Exp. ${causa.numero_expediente}` : 'Expediente'}</h2>
            <p>{causa.delito}</p>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="dsec">
            <h3>👥 Partes</h3>
            <div className="dgrid">
              <DI label="Víctima" value={causa.victima} />
              <DI label="Sindicado" value={causa.sindicado} />
              <DI label="Delito" value={causa.delito} full />
            </div>
          </div>
          <div className="dsec">
            <h3>🔒 Privación de Libertad</h3>
            <div className="dgrid">
              <DI label="Tipo" value={`${TIPOS[causa.tipo_privacion]?.ico} ${TIPOS[causa.tipo_privacion]?.label}`} />
              <DI label="Estado" value={ESTADOS[causa.estado]} />
              <DI label="Fecha de Privación"  value={fmtDate(causa.fecha_privacion)} />
              <DI label="Fecha de Liberación" value={fmtDate(causa.fecha_liberacion)} />
            </div>
          </div>
          <div className="dsec">
            <h3>🔍 Evidencia y Pruebas</h3>
            <div className="dgrid">
              <DI label="Inspección Ocular" value={causa.inspeccion_ocular} />
              <DI label="Cámara / Filmación" value={causa.camara} />
              <DI label="Testigos"  value={causa.testigos} />
              <DI label="Peritos"   value={causa.peritos} />
              <DI label="Comisión"  value={causa.comision} />
              <DI label="Testimonios" value={causa.testimonios} full />
            </div>
          </div>
          {causa.informacion_adicional && (
            <div className="dsec">
              <h3>📝 Información Adicional</h3>
              <div className="di-wrap">
                <div className="di-value" style={{ lineHeight: 1.7 }}>{causa.informacion_adicional}</div>
              </div>
            </div>
          )}
          <div style={{ fontSize: 11, color: '#c8b0d4', textAlign: 'right', marginTop: 8 }}>
            Creado: {new Date(causa.created_at).toLocaleString('es-AR')}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button className="btn btn-pdf" onClick={() => exportarPDF(causa)}>📄 Exportar PDF</button>
          <button className="btn btn-primary" onClick={() => { onClose(); onEdit(causa); }}>✏️ Editar</button>
        </div>
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
export default function App() {
  const [session,      setSession]      = useState(null);
  const [authReady,    setAuthReady]    = useState(false);
  const [causas,       setCausas]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo,   setFilterTipo]   = useState('');
  const [modal,        setModal]        = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [toast,        setToast]        = useState(null);

  const notify = (msg, type = 'success') => setToast({ msg, type });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase.from('causas').select('*').order('created_at', { ascending: false });
    if (!error) setCausas(data || []);
    setLoading(false);
  }, [session]);

  useEffect(() => { load(); }, [load]);

  const del = async id => {
    if (!confirm('¿Eliminar este expediente? Esta acción no se puede deshacer.')) return;
    const { error } = await supabase.from('causas').delete().eq('id', id);
    if (error) { notify('Error al eliminar', 'error'); return; }
    notify('Expediente eliminado'); load();
  };

  const filtered = causas.filter(c => {
    const q = search.toLowerCase();
    const mQ = !q || [c.victima, c.sindicado, c.delito, c.numero_expediente].some(v => v?.toLowerCase().includes(q));
    return mQ && (!filterEstado || c.estado === filterEstado) && (!filterTipo || c.tipo_privacion === filterTipo);
  });

  const stats = {
    total:     causas.length,
    activas:   causas.filter(c => c.estado === 'activa').length,
    cerradas:  causas.filter(c => c.estado === 'cerrada').length,
    archivadas:causas.filter(c => c.estado === 'archivada').length,
  };

  // Inyectar CSS
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  if (!authReady) return <div className="loader"><div className="spin" /><span>Cargando...</span></div>;
  if (!session)   return <Login />;

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="nav-logo">⚖️</div>
          <div>
            <h2>Dra Aldana Cativa</h2>
            <p>Causas Judiciales</p>
          </div>
        </div>
        <div className="navbar-right">
          <span className="user-pill">👩‍⚖️ {session.user.email}</span>
          <button className="btn-signout" onClick={() => supabase.auth.signOut()}>Salir</button>
        </div>
      </nav>

      <main className="main">
        {/* STATS */}
        <div className="stats-bar">
          {[
            { cls:'c-lilac', ico:'📁', val: stats.total,      lbl:'Total Causas' },
            { cls:'c-rose',  ico:'🟢', val: stats.activas,    lbl:'Activas' },
            { cls:'c-sage',  ico:'🔴', val: stats.cerradas,   lbl:'Cerradas' },
            { cls:'c-muted', ico:'📦', val: stats.archivadas, lbl:'Archivadas' },
          ].map(s => (
            <div key={s.lbl} className={`stat-card ${s.cls}`}>
              <div className="stat-ico">{s.ico}</div>
              <div>
                <div className="stat-value">{s.val}</div>
                <div className="stat-label">{s.lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="toolbar">
          <h1>Expedientes</h1>
          <div className="search-wrap">
            <span className="search-ico">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." />
          </div>
          <select className="filter-sel" value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="cerrada">Cerrada</option>
            <option value="archivada">Archivada</option>
          </select>
          <select className="filter-sel" value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="aprehension">Aprehensión</option>
            <option value="arresto">Arresto</option>
            <option value="detencion">Detención</option>
          </select>
          <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('new'); }}>
            ＋ Nueva Causa
          </button>
        </div>

        {/* TABLA */}
        <div className="table-wrap">
          {loading ? (
            <div className="loader"><div className="spin" /><span>Cargando expedientes...</span></div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <div className="eico">📂</div>
              <h3>{search || filterEstado || filterTipo ? 'Sin resultados' : 'Sin expedientes'}</h3>
              <p>{search || filterEstado || filterTipo ? 'Probá con otros filtros de búsqueda.' : 'Todavía no hay causas registradas.'}</p>
              {!search && !filterEstado && !filterTipo && (
                <button className="btn btn-primary" onClick={() => { setSelected(null); setModal('new'); }}>Crear primera causa</button>
              )}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Expediente</th>
                  <th>Víctima</th>
                  <th>Sindicado</th>
                  <th>Delito</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td data-label="Expediente"><span className="td-main">{c.numero_expediente || '—'}</span></td>
                    <td data-label="Víctima"><span className="td-main">{c.victima}</span></td>
                    <td data-label="Sindicado">{c.sindicado}</td>
                    <td data-label="Delito"><div className="truncate">{c.delito}</div></td>
                    <td data-label="Tipo">
                      <span className={`badge b-${c.tipo_privacion}`}>
                        {TIPOS[c.tipo_privacion]?.ico} {TIPOS[c.tipo_privacion]?.label}
                      </span>
                    </td>
                    <td data-label="Fecha">{fmtDate(c.fecha_privacion) || '—'}</td>
                    <td data-label="Estado">
                      <span className={`badge b-${c.estado}`}>{ESTADOS[c.estado]}</span>
                    </td>
                    <td data-label="Acciones">
                      <div className="actions">
                        <button className="btn btn-secondary btn-sm" title="Ver detalle"   onClick={() => { setSelected(c); setModal('detail'); }}>👁</button>
                        <button className="btn btn-secondary btn-sm" title="Editar"        onClick={() => { setSelected(c); setModal('edit'); }}>✏️</button>
                        <button className="btn btn-pdf      btn-sm" title="Exportar PDF"  onClick={() => exportarPDF(c)}>📄</button>
                        <button className="btn btn-danger   btn-sm" title="Eliminar"      onClick={() => del(c.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="table-footer">
            {filtered.length} de {causas.length} expediente{causas.length !== 1 ? 's' : ''}
          </div>
        </div>
      </main>

      {/* MODALES */}
      {(modal === 'new' || modal === 'edit') && (
        <FormModal
          causa={modal === 'edit' ? selected : null}
          onClose={() => setModal(null)}
          onSave={() => {
            setModal(null); load();
            notify(modal === 'edit' ? 'Expediente actualizado' : 'Expediente creado exitosamente');
          }}
        />
      )}
      {modal === 'detail' && selected && (
        <DetailModal
          causa={selected}
          onClose={() => setModal(null)}
          onEdit={c => { setSelected(c); setModal('edit'); }}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
