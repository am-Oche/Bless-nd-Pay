/* Bless nd Pay — UI primitives */
const { useState, useEffect, useRef, useMemo, useCallback, useContext, createContext, useLayoutEffect } = React;

/* ---------------- icons (original line set, 1.6 stroke) ---------------- */
const ICONS = {
  home: 'M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z',
  wallet: 'M4 7.5A2.5 2.5 0 0 1 6.5 5H17a1 1 0 0 1 1 1v2M4 7.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 1 4 7.5zM16 13.5h1',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  send: 'M20 4 10 14M20 4l-6 16-4-6-6-4z',
  card: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M7 15h3',
  bolt: 'M13 3 5 13.5h6L10 21l8-10.5h-6z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0',
  plus: 'M12 5v14M5 12h14',
  bills: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 14.5h2',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18v2',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18M10.6 6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.7M6.3 6.9A17 17 0 0 0 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1M9.9 9.9a3 3 0 0 0 4.2 4.2',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  chevRight: 'M9 6l6 6-6 6',
  chevDown: 'M6 9l6 6 6-6',
  chevLeft: 'M15 6l-6 6 6 6',
  close: 'M6 6l12 12M18 6 6 18',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  shield: 'M12 3 4.5 6v5.5c0 4.5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5 7.5-9.5V6z',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  logout: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  wifi: 'M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01',
  tv: 'M3 6h18v12H3zM8 21h8M12 3l-3-1M12 3l3-1',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  cup: 'M5 8h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2',
  bag: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
  car: 'M5 16V12l2-5h10l2 5v4M5 16h14M5 16v2M19 16v2M7.5 13.5h.01M16.5 13.5h.01',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  refresh: 'M20 11a8 8 0 0 0-14.8-3.5L4 9M4 4v5h5M4 13a8 8 0 0 0 14.8 3.5L20 15M20 20v-5h-5',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  share: 'M12 3v12M7 8l5-5 5 5M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  check: 'M5 12.5 10 17.5 19 7',
  backspace: 'M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7zM12 9l6 6M18 9l-6 6',
  filter: 'M4 5h16l-6 8v6l-4-2v-4z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  device: 'M3 5h18v11H3zM8 20h8M12 16v4',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01',
  bank: 'M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18',
  hash: 'M5 9h14M5 15h14M10 4 8 20M16 4l-2 16',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16',
  split: 'M7 4v6a5 5 0 0 0 5 5 5 5 0 0 1 5 5M17 4v6a5 5 0 0 1-2 4M4 7l3-3 3 3M14 7l3-3 3 3',
  pot: 'M5 9h14v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3zM9 9V7a3 3 0 0 1 6 0v2',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  contactless: 'M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 4a12 12 0 0 1 0 16',
  menu: 'M4 7h16M4 12h16M4 17h16',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  fingerprint: 'M7 10a5 5 0 0 1 10 0v1M12 10v5c0 2 1 4 2 5M9.5 11v3c0 2.5 1 5 2 6.5M14.5 12v2.5M5 13c0 2 .5 4 1.5 5.5M17 14c0 2-.5 3.5-1 5',
};
function Icon({ name, size = 20, stroke = 1.6, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style} className={className} aria-hidden="true">
      <path d={ICONS[name] || ICONS.info} />
    </svg>
  );
}

/* ---------------- brand ---------------- */
function LogoMark({ size = 34, dark = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill={dark ? '#fff' : 'var(--navy-900)'} />
      <path d="M15 29V13.5c0-3 1.8-4.8 4-4.8 2.3 0 3.6 1.6 3.6 3.6 0 3.2-3.4 4.4-6.4 6.6 1.6-1 3.4-1.6 5.2-1.6 3.4 0 5.6 2.4 5.6 5.6 0 3.6-2.8 6.1-6.3 6.1-2.6 0-4.4-1.2-5.7-3"
        fill="none" stroke={dark ? 'var(--navy-900)' : '#fff'} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Wordmark({ size = 20, color, mark = true, dark = false }) {
  const [a, b, c] = window.BP.brand.wordmark;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.45, color: color || (dark ? '#fff' : 'var(--navy-900)'), lineHeight: 1 }}
      aria-label={window.BP.brand.name}>
      {mark && <LogoMark size={size * 1.6} dark={dark} />}
      <span style={{ fontSize: size, fontWeight: 400, letterSpacing: '-0.03em' }}>
        {a}<span className="serif" style={{ fontSize: size * 1.12, margin: '0 .06em', opacity: .85 }}>{b}</span>{c}
      </span>
    </span>
  );
}

/* ---------------- money ---------------- */
const BPCtx = createContext(null);
function curOf(code) { return window.BP.currencies.find(c => c.code === code) || window.BP.currencies[0]; }
function convert(ngn, code) { return ngn / window.BP.rates[code]; }
function fmtMoney(amount, code = 'NGN', opts = {}) {
  const n = new Intl.NumberFormat('en-US', { minimumFractionDigits: opts.dp ?? 2, maximumFractionDigits: opts.dp ?? 2 }).format(Math.abs(amount));
  const sign = opts.sign ? (amount > 0 ? '+' : amount < 0 ? '-' : '') : (amount < 0 ? '-' : '');
  return sign + curOf(code).symbol + n;
}
function compact(amount, code = 'NGN') {
  const a = Math.abs(amount); const s = curOf(code).symbol;
  if (a >= 1e6) return s + (a / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (a >= 1e3) return s + (a / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return s + a.toFixed(0);
}
/* big light numerals, decimals lighter */
function Amount({ value, code = 'NGN', size = 40, hidden = false, sign = false, color, decColor }) {
  const str = fmtMoney(value, code, { sign });
  const [int, dec] = str.split('.');
  return (
    <span className="tnum" style={{ fontSize: size, fontWeight: 300, letterSpacing: '-0.035em', color: color || 'var(--ink)', lineHeight: 1, display: 'inline-flex', alignItems: 'baseline', transition: 'filter .35s var(--ease)', filter: hidden ? 'blur(10px)' : 'none' }}>
      {int}<span style={{ color: decColor || 'var(--slate-2)' }}>.{dec}</span>
    </span>
  );
}
function useCountUp(target, dur = 1200, start = true) {
  const [v, setV] = useState(start ? 0 : target);
  useEffect(() => {
    if (!start) return;
    let raf, t0;
    const step = (t) => { if (!t0) t0 = t; const p = Math.min(1, (t - t0) / dur); setV(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    const fb = setTimeout(() => setV(target), dur + 150); // fallback when rAF is throttled
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [target, start]);
  return v;
}

/* ---------------- avatar (initials placeholder — demo avatars) ---------------- */
function Avatar({ name = '?', hue = 215, size = 40, ring = false }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('');
  return (
    <span style={{
      width: size, height: size, borderRadius: 999, flex: 'none', display: 'inline-grid', placeItems: 'center',
      background: `linear-gradient(140deg, oklch(0.9 0.05 ${hue}), oklch(0.72 0.08 ${hue}))`,
      color: `oklch(0.32 0.07 ${hue})`, fontSize: size * 0.36, fontWeight: 500, letterSpacing: '-0.02em',
      boxShadow: ring ? '0 0 0 2px var(--white)' : 'none',
    }}>{initials}</span>
  );
}
function TxIcon({ t, size = 40 }) {
  if (t.kind === 'person') return <Avatar name={t.name} hue={t.hue} size={size} />;
  return (
    <span style={{ width: size, height: size, borderRadius: 999, flex: 'none', display: 'grid', placeItems: 'center', background: 'var(--glass-strong)', border: '1px solid var(--line)', color: 'var(--navy-800)' }}>
      <Icon name={t.icon || 'card'} size={size * 0.45} />
    </span>
  );
}
function Flag({ code, size = 20 }) {
  const s = { width: size, height: size, borderRadius: 999, overflow: 'hidden', flex: 'none', display: 'inline-block', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' };
  if (code === 'ng') return <svg style={s} viewBox="0 0 3 3"><rect width="1" height="3" fill="#118a4e" /><rect x="1" width="1" height="3" fill="#fff" /><rect x="2" width="1" height="3" fill="#118a4e" /></svg>;
  if (code === 'us') return <svg style={s} viewBox="0 0 14 14"><rect width="14" height="14" fill="#fff" />{[0, 2, 4, 6, 8, 10, 12].map(y => <rect key={y} y={y} width="14" height="1" fill="#c8323a" />)}<rect width="7" height="7" fill="#2e3f7a" /></svg>;
  if (code === 'eu') return <svg style={s} viewBox="0 0 14 14"><rect width="14" height="14" fill="#2b46a0" />{Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={7 + 4 * Math.cos(i * Math.PI / 6)} cy={7 + 4 * Math.sin(i * Math.PI / 6)} r=".6" fill="#f5cb3c" />)}</svg>;
  if (code === 'gb') return <svg style={s} viewBox="0 0 14 14"><rect width="14" height="14" fill="#2a3f86" /><path d="M0 0 14 14M14 0 0 14" stroke="#fff" strokeWidth="2.4" /><path d="M0 0 14 14M14 0 0 14" stroke="#c8323a" strokeWidth=".9" /><path d="M7 0v14M0 7h14" stroke="#fff" strokeWidth="3.6" /><path d="M7 0v14M0 7h14" stroke="#c8323a" strokeWidth="2" /></svg>;
  return <span style={{ ...s, background: 'var(--line)' }} />;
}

/* ---------------- segmented tabs (sliding pill, ARIA tablist, arrow keys) ---------------- */
function Segmented({ options, value, onChange, light = false, size, full = false, label }) {
  const ref = useRef(null);
  const [pill, setPill] = useState({ left: 4, width: 0 });
  const opts = options.map(o => typeof o === 'string' ? { value: o, label: o } : o);
  const measure = () => {
    const el = ref.current?.querySelector(`[data-v="${CSS.escape(String(value))}"]`);
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  };
  useLayoutEffect(measure, [value, options.length]);
  useEffect(() => {
    const ro = new ResizeObserver(measure); if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [value]);
  const onKey = (e) => {
    const i = opts.findIndex(o => o.value === value);
    if (e.key === 'ArrowRight') { e.preventDefault(); onChange(opts[(i + 1) % opts.length].value); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); onChange(opts[(i - 1 + opts.length) % opts.length].value); }
  };
  return (
    <div ref={ref} className={'seg' + (light ? ' light' : '')} role="tablist" aria-label={label} onKeyDown={onKey}
      style={full ? { display: 'flex', width: '100%' } : null}>
      <span className="seg-pill" style={{ left: pill.left, width: pill.width }} />
      {opts.map(o => (
        <button key={o.value} data-v={o.value} role="tab" aria-selected={o.value === value} tabIndex={o.value === value ? 0 : -1}
          className="seg-btn" onClick={() => onChange(o.value)}
          style={{ ...(full ? { flex: 1 } : null), ...(size === 'lg' ? { height: 38, padding: '0 18px', fontSize: 14 } : null) }}>{o.label}</button>
      ))}
    </div>
  );
}

/* ---------------- toggle ---------------- */
function Toggle({ on, onChange, label }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      style={{ width: 46, height: 28, borderRadius: 999, padding: 3, background: on ? 'var(--navy-800)' : 'var(--mist)', transition: 'background .25s', flex: 'none' }}>
      <span style={{ display: 'block', width: 22, height: 22, borderRadius: 999, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.18)', transform: `translateX(${on ? 18 : 0}px)`, transition: 'transform .35s var(--spring)' }} />
    </button>
  );
}

/* ---------------- payment card (CSS 3D-ready) ---------------- */
const CARD_TONES = {
  sky: 'linear-gradient(150deg, #3e5a8c 0%, #6f8fbf 38%, #b9cde6 74%, #eef3fa 100%)',
  navy: 'linear-gradient(150deg, #1d2c57 0%, #33508d 55%, #7b9ccc 100%)',
  ink: 'linear-gradient(150deg, #151c33 0%, #2b3656 60%, #56688f 100%)',
};
function PayCard({ card, width = 320, reveal = false, style, vertical = false }) {
  const h = width * 0.63;
  const k = width / 320;
  const frozen = card.frozen;
  return (
    <div style={{
      width, height: h, borderRadius: 22 * k, position: 'relative', overflow: 'hidden', color: '#fff', flex: 'none',
      background: CARD_TONES[card.tone] || CARD_TONES.sky,
      boxShadow: '0 1px 0 rgba(255,255,255,.4) inset, 0 20px 40px -12px rgba(38,56,106,.45)',
      filter: frozen ? 'saturate(.3) brightness(1.05)' : 'none', transition: 'filter .4s', ...style,
    }}>
      {/* swoosh mark */}
      <svg viewBox="0 0 320 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .14 }}>
        <path d="M60 230C90 120 140 30 200 30c40 0 60 30 60 60 0 50-60 70-120 110" fill="none" stroke="#fff" strokeWidth="34" strokeLinecap="round" />
      </svg>
      {/* grain */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 90% 110%, rgba(255,255,255,.45), transparent 55%)' }} />
      {/* chip */}
      <div style={{ position: 'absolute', left: 22 * k, top: 26 * k, width: 38 * k, height: 28 * k, borderRadius: 6 * k, background: 'linear-gradient(135deg,#f4f6fb,#c9d2e3)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }}>
        <svg viewBox="0 0 38 28" width="100%" height="100%"><path d="M0 9h12M0 19h12M26 9h12M26 19h12M12 0v28M26 0v28M12 14h14" stroke="#9aa7c0" strokeWidth="1" fill="none" /></svg>
      </div>
      <Icon name="contactless" size={20 * k} style={{ position: 'absolute', left: 70 * k, top: 30 * k, opacity: .85 }} />
      <div style={{ position: 'absolute', right: 22 * k, top: 24 * k, textAlign: 'right' }}>
        <div style={{ fontSize: 15 * k, fontWeight: 600, letterSpacing: '.02em', fontStyle: 'italic' }}>debit</div>
        <div style={{ fontSize: 9 * k, opacity: .8, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2 }}>{card.type}</div>
      </div>
      <div className="tnum" style={{ position: 'absolute', left: 22 * k, bottom: 46 * k, fontSize: 16 * k, letterSpacing: '.12em', fontWeight: 400, textShadow: '0 1px 2px rgba(0,0,0,.12)' }}>
        {reveal ? card.number : `•••• •••• •••• ${card.last4}`}
      </div>
      <div style={{ position: 'absolute', left: 22 * k, bottom: 20 * k, display: 'flex', gap: 18 * k, fontSize: 10 * k, opacity: .9 }}>
        <span>{card.label}</span><span className="tnum">{card.exp}</span>{reveal && <span className="tnum">CVV {card.cvv}</span>}
      </div>
      <div style={{ position: 'absolute', right: 20 * k, bottom: 16 * k, color: 'rgba(28,40,78,.55)', fontSize: 15 * k }}>
        <Wordmark size={13 * k} mark={false} color="rgba(255,255,255,.85)" />
      </div>
      {frozen && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(230,238,250,.25)', backdropFilter: 'blur(1.5px)' }}>
          <span className="chip" style={{ background: 'rgba(255,255,255,.85)', color: 'var(--navy-900)' }}><Icon name="snow" size={14} /> Frozen</span>
        </div>
      )}
    </div>
  );
}

/* ---------------- charts ---------------- */
function WeekBars({ data, labels, selected, onSelect, height = 120, hatch = true, showValue = true, code = 'NGN', compactBars = false }) {
  const max = Math.max(...data) * 1.05;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: compactBars ? 6 : 10, height: height + 24 }}>
      {data.map((v, i) => {
        const on = i === selected;
        const h = Math.max(14, (v / max) * height);
        return (
          <button key={i} onClick={() => onSelect && onSelect(i)} aria-label={`${labels[i]}: ${compact(v, code)}`}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', minWidth: 0 }}>
            {on && showValue && <span className="tnum" style={{ position: 'absolute', bottom: h + 32, fontSize: 10, padding: '3px 7px', borderRadius: 999, background: 'var(--white)', boxShadow: 'var(--shadow-1)', color: 'var(--navy-900)', whiteSpace: 'nowrap', animation: 'popIn .3s var(--ease)' }}>{compact(v, code)}</span>}
            <span style={{
              width: compactBars ? 10 : '100%', maxWidth: compactBars ? 10 : 30, height: h, borderRadius: 999, transformOrigin: 'bottom',
              animation: `barGrow .7s ${i * 0.05}s var(--ease) both`, position: 'relative', overflow: 'hidden',
              background: on ? 'var(--navy-800)' : 'rgba(64,88,129,.10)',
              border: on ? 'none' : '1px solid rgba(64,88,129,.12)',
              transition: 'background .3s',
            }}>
              {!on && hatch && <span className="hatch" style={{ position: 'absolute', inset: 0, opacity: .14 }} />}
              {on && <span style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: 9, background: '#fff' }} />}
            </span>
            <span style={{ fontSize: 11, color: on ? 'var(--navy-900)' : 'var(--slate)', fontWeight: on ? 500 : 400 }}>{labels[i]}</span>
          </button>
        );
      })}
    </div>
  );
}
function Donut({ segments, size = 150, stroke = 16, center }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let off = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={stroke} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c - 4;
          const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${Math.max(0, len)} ${c}`} strokeDashoffset={-off} style={{ transition: 'stroke-dasharray .8s var(--ease)' }} />;
          off += (s.value / total) * c;
          return el;
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>{center}</div>
    </div>
  );
}
function Sparkline({ points, w = 220, h = 70, color = 'var(--navy-800)' }) {
  const min = Math.min(...points), max = Math.max(...points);
  const xy = points.map((p, i) => [i / (points.length - 1) * w, h - 6 - ((p - min) / (max - min || 1)) * (h - 12)]);
  const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', height: h }}>
      <defs><linearGradient id="spk" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8db4e3" stopOpacity=".45" /><stop offset="1" stopColor="#8db4e3" stopOpacity="0" /></linearGradient></defs>
      <path d={d + ` L${w} ${h} L0 ${h} Z`} fill="url(#spk)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
function HatchProgress({ pct, label }) {
  return (
    <div style={{ position: 'relative', height: 18, borderRadius: 999, background: 'var(--line-2)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 999, overflow: 'hidden', transition: 'width .8s var(--ease)' }}>
        <div className="hatch" style={{ position: 'absolute', inset: 0, opacity: .55 }} />
      </div>
      <span className="tnum" style={{ position: 'absolute', top: '50%', left: `calc(${pct}% - 18px)`, transform: 'translateY(-50%)', height: 26, minWidth: 36, padding: '0 6px', borderRadius: 999, background: 'var(--white)', boxShadow: 'var(--shadow-1)', fontSize: 10, display: 'grid', placeItems: 'center', transition: 'left .8s var(--ease)' }}>{label ?? `${Math.round(pct)}%`}</span>
    </div>
  );
}

/* ---------------- numpad ---------------- */
function Numpad({ onKey }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
      {keys.map(k => (
        <button key={k} className="press" onClick={() => onKey(k)} aria-label={k === 'del' ? 'Delete' : k}
          style={{ height: 48, borderRadius: 14, background: 'rgba(255,255,255,.22)', color: '#fff', fontSize: 20, fontWeight: 300, display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,.18)' }}>
          {k === 'del' ? <Icon name="backspace" size={20} /> : k}
        </button>
      ))}
    </div>
  );
}

/* ---------------- success check + confetti ---------------- */
function SuccessCheck({ size = 72 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--pos-bg)', animation: 'ring 1.4s .2s var(--ease) both' }} />
      <svg width={size} height={size} viewBox="0 0 72 72" style={{ position: 'relative' }}>
        <circle cx="36" cy="36" r="34" fill="var(--pos-bg)" />
        <circle cx="36" cy="36" r="24" fill="var(--pos)" />
        <path d="M25 37l7 7 15-16" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40" style={{ animation: 'drawCheck .5s .25s var(--ease) forwards' }} />
      </svg>
    </div>
  );
}
function Confetti({ n = 26 }) {
  const bits = useMemo(() => Array.from({ length: n }).map((_, i) => ({
    dx: (Math.random() - .5) * 320 + 'px', dy: (Math.random() * -180 - 60) + 'px', rot: Math.random() * 720 + 'deg',
    c: ['#26386a', '#8db4e3', '#b4d1f1', '#1f9d63', '#405881'][i % 5], d: Math.random() * .2, w: 5 + Math.random() * 5,
  })), []);
  return (
    <div style={{ position: 'absolute', left: '50%', top: '38%', pointerEvents: 'none' }}>
      {bits.map((b, i) => <span key={i} style={{ position: 'absolute', width: b.w, height: b.w * .5, background: b.c, borderRadius: 2, '--dx': b.dx, '--dy': b.dy, '--rot': b.rot, animation: `confetti 1.3s ${b.d}s cubic-bezier(.15,.7,.4,1) forwards` }} />)}
    </div>
  );
}

/* ---------------- demo badge ---------------- */
function DemoBadge({ style }) {
  if (!window.BP.brand.showDemoBadge) return null;
  return <span className="chip" style={{ height: 22, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', ...style }}><span style={{ width: 6, height: 6, borderRadius: 9, background: 'var(--warn)' }} />Demo</span>;
}

Object.assign(window, {
  Icon, LogoMark, Wordmark, BPCtx, curOf, convert, fmtMoney, compact, Amount, useCountUp, Avatar, TxIcon, Flag,
  Segmented, Toggle, PayCard, CARD_TONES, WeekBars, Donut, Sparkline, HatchProgress, Numpad, SuccessCheck, Confetti, DemoBadge,
});
