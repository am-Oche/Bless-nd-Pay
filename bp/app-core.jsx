/* Bless nd Pay — app store, layout shell, sheets, toasts */

/* ---------------- store ---------------- */
function initialState(persistKey) {
  const D = window.BP;
  const base = {
    route: { name: 'home', params: {} }, stack: [],
    hidden: false, theme: 'light', cur: 'NGN',
    cards: D.cards, wallets: D.wallets, txns: D.txns, notifications: D.notifications,
    recipients: D.recipients, authed: true, sheet: null, toast: null, selectedTx: D.txns[0].id,
  };
  if (!persistKey) return base;
  try {
    const s = JSON.parse(localStorage.getItem(persistKey) || 'null');
    if (s) return { ...base, ...s, sheet: null, toast: null };
  } catch (e) {}
  return base;
}
function reducer(s, a) {
  switch (a.type) {
    case 'nav': {
      if (s.route.name === a.name && JSON.stringify(s.route.params) === JSON.stringify(a.params || {})) return s;
      const root = ['home', 'wallet', 'cards', 'profile', 'transactions', 'analytics', 'send', 'bills'].includes(a.name) && a.root;
      return { ...s, route: { name: a.name, params: a.params || {} }, stack: root ? [] : [...s.stack, s.route].slice(-12), sheet: null };
    }
    case 'back': {
      if (!s.stack.length) return { ...s, route: { name: 'home', params: {} } };
      const stack = s.stack.slice(0, -1);
      return { ...s, route: s.stack[s.stack.length - 1], stack, sheet: null };
    }
    case 'set': return { ...s, ...a.patch };
    case 'sheet': return { ...s, sheet: a.sheet };
    case 'toast': return { ...s, toast: { msg: a.msg, id: Date.now(), icon: a.icon } };
    case 'card': return { ...s, cards: s.cards.map(c => c.id === a.id ? { ...c, ...a.patch } : c) };
    case 'addCard': return { ...s, cards: [...s.cards, a.card] };
    case 'tx': {
      const wallets = { ...s.wallets, NGN: s.wallets.NGN + a.tx.amount };
      return { ...s, txns: [a.tx, ...s.txns], wallets, selectedTx: a.tx.id };
    }
    case 'convert': {
      const w = { ...s.wallets }; w[a.from] -= a.amount; w[a.to] += a.amount * window.BP.rates[a.from] / window.BP.rates[a.to];
      return { ...s, wallets: w };
    }
    case 'readAll': return { ...s, notifications: s.notifications.map(n => ({ ...n, unread: false })) };
    default: return s;
  }
}
function useBPStore(persistKey) {
  const [s, dispatch] = React.useReducer(reducer, persistKey, initialState);
  useEffect(() => {
    if (!persistKey) return;
    const { sheet, toast, ...rest } = s;
    try { localStorage.setItem(persistKey, JSON.stringify(rest)); } catch (e) {}
  }, [s]);
  useEffect(() => { if (s.toast) { const t = setTimeout(() => dispatch({ type: 'set', patch: { toast: null } }), 2600); return () => clearTimeout(t); } }, [s.toast]);
  const api = useMemo(() => ({
    nav: (name, params, root) => dispatch({ type: 'nav', name, params, root }),
    back: () => dispatch({ type: 'back' }),
    set: (patch) => dispatch({ type: 'set', patch }),
    sheet: (type, props) => dispatch({ type: 'sheet', sheet: type ? { type, props: props || {} } : null }),
    toast: (msg, icon) => dispatch({ type: 'toast', msg, icon }),
    card: (id, patch) => dispatch({ type: 'card', id, patch }),
    addCard: (card) => dispatch({ type: 'addCard', card }),
    tx: (tx) => dispatch({ type: 'tx', tx }),
    convert: (from, to, amount) => dispatch({ type: 'convert', from, to, amount }),
    readAll: () => dispatch({ type: 'readAll' }),
  }), []);
  return [s, api];
}
function useBP() { return useContext(BPCtx); }
/* display money in selected display currency */
function useMoney() {
  const { s } = useBP();
  return {
    cur: s.cur,
    v: (ngn) => convert(ngn, s.cur),
    f: (ngn, o) => fmtMoney(convert(ngn, s.cur), s.cur, o),
    c: (ngn) => compact(convert(ngn, s.cur), s.cur),
  };
}

/* ---------------- date helpers ---------------- */
function relDay(iso) {
  const d = new Date(iso), n = window.BP.now;
  const days = Math.floor((new Date(n.toDateString()) - new Date(d.toDateString())) / 864e5);
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + time;
}

/* ---------------- layout detection ---------------- */
function useLayout(ref, force) {
  const [w, setW] = useState(1200);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current); setW(ref.current.offsetWidth);
    return () => ro.disconnect();
  }, []);
  if (force) return force;
  return w < 640 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop';
}

/* ---------------- shared screen chrome ---------------- */
function ScreenHeader({ title, back = true, right, sub }) {
  const { api, layout } = useBP();
  const mobile = layout === 'mobile';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: mobile ? '6px 0 14px' : '0 0 18px', minHeight: 44 }}>
      {back && mobile ? <button className="icon-btn" onClick={api.back} aria-label="Back"><Icon name="chevLeft" size={18} /></button> : null}
      <div style={{ flex: 1, textAlign: mobile && back ? 'center' : 'left', minWidth: 0 }}>
        <div style={{ fontSize: mobile ? 19 : 26, fontWeight: 400, letterSpacing: '-0.025em', color: 'var(--ink)' }}>{title}</div>
        {sub && <div className="label" style={{ marginTop: 3 }}>{sub}</div>}
      </div>
      {right || (back && mobile ? <span style={{ width: 40 }} /> : null)}
    </div>
  );
}
function Section({ title, action, onAction, children, style }) {
  return (
    <div style={{ marginTop: 22, ...style }}>
      {(title || action) && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 14, color: 'var(--ink)' }}>{title}</span>
        {action && <button onClick={onAction} style={{ fontSize: 12, color: 'var(--slate)' }}>{action}</button>}
      </div>}
      {children}
    </div>
  );
}
function GlassCard({ children, style, pad = 18, onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'div';
  return <Tag onClick={onClick} className={'glass ' + className} style={{ borderRadius: 24, padding: pad, display: 'block', width: onClick ? '100%' : undefined, textAlign: 'left', ...style }}>{children}</Tag>;
}

/* ---------------- bottom sheet / modal ---------------- */
function Sheet({ children, onClose, title, layout }) {
  const [drag, setDrag] = useState(0);
  const [closing, setClosing] = useState(false);
  const start = useRef(null);
  const close = () => { setClosing(true); setTimeout(onClose, 260); };
  useEffect(() => { const k = (e) => e.key === 'Escape' && close(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  const mobile = layout === 'mobile';
  const onDown = (e) => { start.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => { if (start.current != null) setDrag(Math.max(0, e.clientY - start.current)); };
  const onUp = () => { if (drag > 110) close(); else setDrag(0); start.current = null; };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: mobile ? 'flex-end' : 'center', justifyContent: 'center' }} role="dialog" aria-modal="true" aria-label={title}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(20,30,60,.28)', backdropFilter: 'blur(3px)', animation: 'fadeIn .25s both', opacity: closing ? 0 : 1, transition: 'opacity .25s' }} />
      <div style={{
        position: 'relative', width: mobile ? '100%' : 440, maxHeight: mobile ? '88%' : '86%', display: 'flex', flexDirection: 'column',
        background: 'var(--glass-strong)', backdropFilter: 'blur(24px) saturate(1.4)', WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        border: '1px solid var(--glass-border)', borderRadius: mobile ? '28px 28px 0 0' : 28, boxShadow: 'var(--shadow-2)',
        transform: mobile ? `translateY(${closing ? '100%' : drag + 'px'})` : (closing ? 'scale(.96)' : 'none'),
        opacity: !mobile && closing ? 0 : 1,
        transition: start.current != null ? 'none' : 'transform .32s var(--ease), opacity .25s',
        animation: mobile ? 'slideUp .42s var(--ease) both' : 'popIn .35s var(--ease) both',
      }}>
        <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} style={{ padding: '10px 20px 4px', cursor: mobile ? 'grab' : 'default', touchAction: 'none' }}>
          {mobile && <div style={{ width: 40, height: 4, borderRadius: 9, background: 'var(--mist)', margin: '0 auto 10px' }} />}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 17, letterSpacing: '-0.02em' }}>{title}</span>
            <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={close} aria-label="Close"><Icon name="close" size={16} /></button>
          </div>
        </div>
        <div className="scroll-y" style={{ padding: '10px 20px 22px', flex: 1 }}>{typeof children === 'function' ? children(close) : children}</div>
      </div>
    </div>
  );
}

function Toast() {
  const { s } = useBP();
  if (!s.toast) return null;
  return (
    <div key={s.toast.id} style={{ position: 'absolute', top: 16, left: '50%', zIndex: 80, animation: 'toastIn .4s var(--ease) both', transform: 'translateX(-50%)' }}>
      <div className="glass" style={{ borderRadius: 999, padding: '10px 16px 10px 10px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, whiteSpace: 'nowrap', background: 'var(--glass-strong)' }}>
        <span style={{ width: 26, height: 26, borderRadius: 99, background: 'var(--navy-900)', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon name={s.toast.icon || 'check'} size={14} /></span>
        {s.toast.msg}
      </div>
    </div>
  );
}

/* ---------------- navigation chrome ---------------- */
const NAV_ACTIVE = { home: 'home', wallet: 'wallet', cards: 'cards', cardDetail: 'cards', profile: 'profile', settings: 'profile', transactions: 'transactions', txDetail: 'transactions', send: 'send', analytics: 'analytics', bills: 'bills', addfunds: 'home', qr: 'home', notifications: 'home', recipients: 'send' };

function BottomTabs() {
  const { s, api } = useBP();
  const items = window.BP.nav.app.filter(i => i.tabs);
  const active = NAV_ACTIVE[s.route.name];
  const half = Math.ceil(items.length / 2);
  const Tab = ({ it }) => {
    const on = active === it.id;
    return (
      <button onClick={() => api.nav(it.id, {}, true)} aria-label={it.label} aria-current={on ? 'page' : undefined}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: on ? 'var(--navy-900)' : 'var(--slate)', fontSize: 10, height: 52, justifyContent: 'center', transition: 'color .2s' }}>
        <Icon name={it.icon} size={20} stroke={on ? 1.9 : 1.6} />
        <span style={{ fontWeight: on ? 500 : 400 }}>{it.label}</span>
      </button>
    );
  };
  return (
    <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, zIndex: 20 }}>
      <div className="glass" style={{ borderRadius: 999, height: 64, display: 'flex', alignItems: 'center', padding: '0 6px', background: 'var(--glass-strong)' }}>
        {items.slice(0, half).map(it => <Tab key={it.id} it={it} />)}
        <div style={{ width: 70, display: 'grid', placeItems: 'center' }}>
          <button className="press" onClick={() => api.sheet('quick')} aria-label="New action"
            style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--navy-900)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 10px 22px rgba(38,56,106,.35), inset 0 0 0 4px rgba(255,255,255,.12)' }}>
            <Icon name="plus" size={22} stroke={1.8} />
          </button>
        </div>
        {items.slice(half).map(it => <Tab key={it.id} it={it} />)}
      </div>
    </div>
  );
}
function Rail() {
  const { s, api } = useBP();
  const items = window.BP.nav.app.filter(i => i.rail);
  const active = NAV_ACTIVE[s.route.name];
  return (
    <div style={{ width: 76, flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 8 }}>
      <LogoMark size={40} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 26 }}>
        {items.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => api.nav(it.id, {}, true)} title={it.label} aria-label={it.label} aria-current={on ? 'page' : undefined}
              className="press" style={{ width: 46, height: 46, borderRadius: 999, display: 'grid', placeItems: 'center', background: on ? 'var(--navy-900)' : 'var(--glass-strong)', color: on ? '#fff' : 'var(--navy-800)', border: on ? 'none' : '1px solid var(--line)', boxShadow: on ? '0 8px 18px rgba(38,56,106,.28)' : 'none' }}>
              <Icon name={it.icon} size={19} />
            </button>
          );
        })}
      </div>
      <button className="icon-btn" onClick={() => api.nav('settings')} aria-label="Settings"><Icon name="settings" size={18} /></button>
    </div>
  );
}
function Sidebar() {
  const { s, api } = useBP();
  const items = window.BP.nav.app.filter(i => i.side);
  const active = NAV_ACTIVE[s.route.name];
  return (
    <div style={{ width: 236, flex: 'none', display: 'flex', flexDirection: 'column', padding: '24px 16px', borderRight: '1px solid var(--line-2)' }}>
      <div style={{ padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Wordmark size={19} /></div>
      <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div className="label" style={{ padding: '0 12px 8px' }}>Menu</div>
        {items.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => api.nav(it.id, {}, true)} aria-current={on ? 'page' : undefined}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, height: 44, padding: '0 12px', borderRadius: 14, fontSize: 14, color: on ? 'var(--navy-900)' : 'var(--slate)', background: on ? 'var(--glass-strong)' : 'transparent', boxShadow: on ? 'var(--shadow-1)' : 'none', transition: 'background .2s, color .2s' }}>
              <span style={{ width: 30, height: 30, borderRadius: 99, display: 'grid', placeItems: 'center', background: on ? 'var(--navy-900)' : 'transparent', color: on ? '#fff' : 'inherit' }}><Icon name={it.icon} size={17} /></span>
              {it.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <GlassCard pad={16} style={{ borderRadius: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="shield" size={16} style={{ color: 'var(--navy-800)' }} /><span style={{ fontSize: 13 }}>Demo environment</span></div>
        <div className="label" style={{ marginTop: 6, lineHeight: 1.45 }}>No real money moves. {window.BP.brand.partnerLine}</div>
      </GlassCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 12 }}>
        <button onClick={() => api.nav('settings')} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40, padding: '0 12px', fontSize: 14, color: 'var(--slate)' }}><Icon name="settings" size={17} />Settings</button>
        <button onClick={() => api.nav('support')} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40, padding: '0 12px', fontSize: 14, color: 'var(--slate)' }}><Icon name="help" size={17} />Support</button>
      </div>
    </div>
  );
}
function TopBar() {
  const { s, api } = useBP();
  const u = window.BP.user;
  const searchRef = useRef(null);
  const [q, setQ] = useState('');
  useEffect(() => {
    const k = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); api.nav('send', {}, true); }
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  const unread = s.notifications.filter(n => n.unread).length;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 0 22px' }}>
      <div style={{ flex: 1 }}>
        <div className="label">Welcome back 👋</div>
        <div style={{ fontSize: 22, letterSpacing: '-0.025em', marginTop: 2 }}>{u.first} {u.last}</div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); api.nav('transactions', { q }, true); }} className="field" style={{ height: 44, width: 300, borderRadius: 999 }}>
        <Icon name="search" size={17} style={{ color: 'var(--slate)' }} />
        <input ref={searchRef} value={q} onChange={e => setQ(e.target.value)} placeholder='Search "last week Uber"' aria-label="Search transactions" />
        <kbd style={{ fontSize: 11, color: 'var(--slate)', border: '1px solid var(--line)', borderRadius: 6, padding: '1px 6px' }}>/</kbd>
      </form>
      <DemoBadge />
      <button className="icon-btn" onClick={() => api.set({ theme: s.theme === 'dark' ? 'light' : 'dark' })} aria-label="Toggle theme"><Icon name={s.theme === 'dark' ? 'sun' : 'moon'} size={17} /></button>
      <button className="icon-btn" style={{ position: 'relative' }} onClick={() => api.nav('notifications')} aria-label="Notifications">
        <Icon name="bell" size={18} />{unread > 0 && <span style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 9, background: 'var(--neg)', boxShadow: '0 0 0 2px var(--white)' }} />}
      </button>
      <button onClick={() => api.nav('profile', {}, true)} aria-label="Profile"><Avatar name={`${u.first} ${u.last}`} hue={25} size={42} ring /></button>
    </div>
  );
}

/* ---------------- quick action sheet (FAB) ---------------- */
function QuickSheet({ close }) {
  const { api } = useBP();
  const items = [
    ['send', 'Send money', 'send', 'To a saved or new recipient'],
    ['addfunds', 'Add funds', 'plus', 'Card, bank transfer or USSD'],
    ['bills', 'Pay a bill', 'bills', 'Electricity, airtime, TV, internet'],
    ['qr', 'Scan or show QR', 'qr', 'Pay in store or get paid'],
    ['request', 'Request via link', 'link', 'Share a payment link'],
    ['split', 'Split a bill', 'split', 'Request from friends'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {items.map(([id, label, icon, sub]) => (
        <button key={id} className="press glass" onClick={() => { if (id === 'request' || id === 'split') { api.sheet('request', { split: id === 'split' }); } else { api.nav(id); } }}
          style={{ borderRadius: 20, padding: 14, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--white)' }}>
          <span style={{ width: 38, height: 38, borderRadius: 99, background: 'var(--sky-1)', color: 'var(--navy-900)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={18} /></span>
          <span><span style={{ fontSize: 14, display: 'block' }}>{label}</span><span className="label" style={{ display: 'block', marginTop: 3, lineHeight: 1.35 }}>{sub}</span></span>
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { useBPStore, useBP, useMoney, relDay, useLayout, ScreenHeader, Section, GlassCard, Sheet, Toast, BottomTabs, Rail, Sidebar, TopBar, QuickSheet, NAV_ACTIVE });
