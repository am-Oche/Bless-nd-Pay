/* Bless nd Pay — Home, Transactions, Send flow */

/* ---------------- shared widgets ---------------- */
function BalanceCard({ big = false }) {
  const { s, api } = useBP();
  const m = useMoney();
  const total = s.wallets.NGN + s.wallets.USD * window.BP.rates.USD + s.wallets.EUR * window.BP.rates.EUR + s.wallets.GBP * window.BP.rates.GBP;
  const cnt = useCountUp(m.v(total), 1100);
  const limitLeft = s.cards[0].limit - s.cards[0].spent;
  return (
    <GlassCard pad={big ? 22 : 18} style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--white)', border: '1px solid var(--line)', color: 'var(--navy-800)' }}><Icon name="wallet" size={15} /></span>
        <span className="label" style={{ fontSize: 13 }}>Available Balance</span>
        <span style={{ flex: 1 }} />
        <button className="icon-btn navy press" style={{ width: 34, height: 34 }} onClick={() => api.nav('wallet', {}, true)} aria-label="Open wallet"><Icon name="arrowUpRight" size={16} /></button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: big ? 34 : 26 }}>
        <Amount value={cnt} code={s.cur} size={big ? 44 : 38} hidden={s.hidden} />
        <button onClick={() => api.set({ hidden: !s.hidden })} aria-label={s.hidden ? 'Show balance' : 'Hide balance'} style={{ color: 'var(--slate)', display: 'grid' }}>
          <Icon name={s.hidden ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </div>
      <button className="chip" style={{ marginTop: 14 }} onClick={() => api.nav('cardDetail', { id: s.cards[0].id })}>
        <Icon name="info" size={13} /> Available limit • <b style={{ fontWeight: 500, color: 'var(--ink)', filter: s.hidden ? 'blur(5px)' : 'none' }}>{m.c(limitLeft)} left</b> <Icon name="chevRight" size={12} />
      </button>
    </GlassCard>
  );
}
function QuickActions({ compactLabels }) {
  const { api } = useBP();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
      {window.BP.nav.quickActions.map(q => (
        <button key={q.id} className="press" onClick={() => api.nav(q.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 50, height: 50, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--glass-strong)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-1)', color: 'var(--navy-900)' }}><Icon name={q.icon} size={19} /></span>
          <span style={{ fontSize: 12, color: 'var(--navy-800)' }}>{q.label}</span>
        </button>
      ))}
    </div>
  );
}
function TxRow({ t, onClick, active }) {
  const { s } = useBP();
  const m = useMoney();
  return (
    <button className="row" onClick={onClick} style={active ? { background: 'var(--glass-strong)', boxShadow: 'var(--shadow-1)' } : null}>
      <TxIcon t={t} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
        <div className="row-sub">{relDay(t.date)}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="tnum" style={{ fontSize: 14, color: t.amount > 0 ? 'var(--pos)' : 'var(--ink)', filter: s.hidden ? 'blur(5px)' : 'none' }}>{m.f(t.amount, { sign: true })}</div>
        {t.status !== 'completed' && <div style={{ fontSize: 10, marginTop: 3, color: t.status === 'pending' ? 'var(--warn)' : 'var(--neg)', textTransform: 'capitalize' }}>{t.status}</div>}
      </div>
    </button>
  );
}
function RecentList({ n = 5, onPick, activeId }) {
  const { s, api, layout } = useBP();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '0 -6px' }}>
      {s.txns.slice(0, n).map(t => <TxRow key={t.id} t={t} active={activeId === t.id} onClick={() => onPick ? onPick(t) : (layout === 'mobile' ? api.nav('txDetail', { id: t.id }) : (api.set({ selectedTx: t.id }), api.nav('transactions', {}, true)))} />)}
    </div>
  );
}
function StatTile({ label, value, delta }) {
  const { s } = useBP();
  return (
    <GlassCard pad={16}>
      <div className="label">{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, gap: 6, flexWrap: 'wrap' }}>
        <span className="tnum" style={{ fontSize: 21, fontWeight: 300, letterSpacing: '-0.03em', filter: s.hidden ? 'blur(8px)' : 'none' }}>{value}</span>
        <span className={'chip ' + (delta >= 0 ? 'chip-pos' : 'chip-neg')} style={{ height: 22, fontSize: 11, padding: '0 8px' }}>{delta >= 0 ? '+' : ''}{delta}%</span>
      </div>
    </GlassCard>
  );
}
const WEEK = [182000, 264000, 141000, 308000, 216000, 98000, 154000];
function EarningCard({ compactBars }) {
  const m = useMoney();
  const [sel, setSel] = useState(3);
  const [range, setRange] = useState('Week');
  return (
    <GlassCard pad={18}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="label" style={{ fontSize: 13 }}>Earning Activity</span>
        <Segmented light options={['Week', 'Month']} value={range} onChange={setRange} label="Earning range" />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 14 }}>
        <div style={{ flex: 'none' }}>
          <div className="tnum" style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.035em' }}>{m.c(range === 'Week' ? 1363000 : 5120000)}</div>
          <div style={{ fontSize: 12, marginTop: 6 }} className="pos">↗ +4.2% <span className="muted">vs last {range.toLowerCase()}</span></div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <WeekBars data={WEEK} labels={['S', 'M', 'T', 'W', 'T', 'F', 'S']} selected={sel} onSelect={setSel} height={64} compactBars={compactBars} code={m.cur} />
        </div>
      </div>
    </GlassCard>
  );
}
function UpcomingList({ n = 4 }) {
  const { api } = useBP();
  const m = useMoney();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {window.BP.upcoming.slice(0, n).map((u, i) => (
        <button key={i} className="row glass press" onClick={() => api.nav('bills')} style={{ borderRadius: 18, background: 'var(--glass-strong)' }}>
          <span style={{ width: 38, height: 38, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name={u.icon} size={17} /></span>
          <div style={{ flex: 1, minWidth: 0 }}><div className="row-title">{u.name}</div><div className="row-sub">{u.sub}</div></div>
          <div style={{ textAlign: 'right' }}><div className="tnum" style={{ fontSize: 14 }}>{m.f(u.amount)}</div><div className="row-sub">{u.due}</div></div>
        </button>
      ))}
    </div>
  );
}

/* ---------------- HOME ---------------- */
function MobileHomeHeader() {
  const { s, api } = useBP();
  const u = window.BP.user;
  const unread = s.notifications.filter(n => n.unread).length;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
      <Avatar name={`${u.first} ${u.last}`} hue={25} size={44} ring />
      <div style={{ flex: 1 }}>
        <div className="label">Welcome Back 👋</div>
        <div style={{ fontSize: 17, letterSpacing: '-0.02em', marginTop: 2 }}>{u.first} {u.last}</div>
      </div>
      <button className="icon-btn" style={{ position: 'relative' }} onClick={() => api.nav('notifications')} aria-label="Notifications">
        <Icon name="bell" size={18} />{unread > 0 && <span style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 9, background: 'var(--neg)', boxShadow: '0 0 0 2px var(--white)' }} />}
      </button>
    </div>
  );
}
function PullToRefresh({ children }) {
  const { api } = useBP();
  const [pull, setPull] = useState(0);
  const [loading, setLoading] = useState(false);
  const st = useRef(null);
  const onDown = (e) => { const sc = e.currentTarget.closest('.scroll-y'); if (sc && sc.scrollTop <= 0 && e.pointerType !== 'mouse') st.current = e.clientY; };
  const onMove = (e) => { if (st.current != null) setPull(Math.min(80, Math.max(0, (e.clientY - st.current) * .5))); };
  const onUp = () => { if (pull > 60) { setLoading(true); setTimeout(() => { setLoading(false); api.toast('Balances up to date', 'refresh'); }, 900); } setPull(0); st.current = null; };
  return (
    <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div style={{ height: loading ? 40 : pull, overflow: 'hidden', display: 'grid', placeItems: 'center', transition: st.current ? 'none' : 'height .3s var(--ease)' }}>
        <Icon name="refresh" size={18} style={{ color: 'var(--slate)', transform: `rotate(${pull * 4}deg)`, animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
      </div>
      {children}
    </div>
  );
}
function HomeScreen() {
  const { s, api, layout } = useBP();
  if (layout === 'mobile') return (
    <PullToRefresh>
      <MobileHomeHeader />
      <BalanceCard />
      <Section title="Quick Actions"><QuickActions /></Section>
      <Section title="Recent transactions" action="See All" onAction={() => api.nav('transactions', {}, true)}>
        <GlassCard pad={8}><RecentList n={6} /></GlassCard>
      </Section>
    </PullToRefresh>
  );
  if (layout === 'tablet') return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 18 }}>
      <div>
        <BalanceCard big />
        <Section title="Quick Actions"><QuickActions /></Section>
        <Section title="Recent transactions" action="See All" onAction={() => api.nav('transactions', {}, true)}><GlassCard pad={8}><RecentList n={6} /></GlassCard></Section>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <EarningCard compactBars />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><StatTile label="Total Revenue" value={compact(convert(1927056, s.cur), s.cur)} delta={4.2} /><StatTile label="Monthly Expense" value={compact(convert(714281, s.cur), s.cur)} delta={-2.1} /></div>
        <Section title="Upcoming Payments" action="View all" onAction={() => api.nav('bills')} style={{ marginTop: 6 }}><UpcomingList n={3} /></Section>
      </div>
    </div>
  );
  // desktop dashboard grid
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BalanceCard big />
        <GlassCard pad={18}><div className="label" style={{ margin: '0 0 14px', fontSize: 13 }}>Quick Actions</div><QuickActions /></GlassCard>
        <GlassCard pad={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 8px' }}><span style={{ fontSize: 14 }}>Recent transactions</span><button className="label" onClick={() => api.nav('transactions', {}, true)}>View All</button></div>
          <RecentList n={6} />
        </GlassCard>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><StatTile label="Total Revenue" value={compact(convert(1927056, s.cur), s.cur)} delta={4.2} /><StatTile label="Monthly Expense" value={compact(convert(714281, s.cur), s.cur)} delta={-2.1} /></div>
        <EarningCard compactBars />
        <GlassCard pad={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 10px' }}><span style={{ fontSize: 14 }}>Upcoming Payments</span><button className="label" onClick={() => api.nav('bills', {}, true)}>View All</button></div>
          <UpcomingList n={4} />
        </GlassCard>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <QuickSendWidget />
        <GlassCard pad={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><span style={{ fontSize: 14 }}>Debit Card</span><button className="label" onClick={() => api.nav('cards', {}, true)}>Manage</button></div>
          <button onClick={() => api.nav('cardDetail', { id: s.cards[0].id })} style={{ display: 'block', width: '100%' }}><CardFit card={s.cards[0]} /></button>
        </GlassCard>
      </div>
    </div>
  );
}
function BalanceCardBare() {
  return <div style={{ borderRadius: 22 }}><BalanceCard big /></div>;
}
function CardFit({ card, reveal }) {
  const ref = useRef(null); const [w, setW] = useState(280);
  useLayoutEffect(() => { const ro = new ResizeObserver(([e]) => setW(e.contentRect.width)); ro.observe(ref.current); return () => ro.disconnect(); }, []);
  return <div ref={ref} style={{ width: '100%' }}><PayCard card={card} width={w} reveal={reveal} /></div>;
}
/* compact send widget for desktop dashboard */
function QuickSendWidget() {
  const { s, api } = useBP();
  const [rid, setRid] = useState(s.recipients[0].id);
  const [amt, setAmt] = useState('25000');
  const r = s.recipients.find(x => x.id === rid);
  return (
    <GlassCard pad={16}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><span style={{ fontSize: 14 }}>Send Money</span><button className="label" onClick={() => api.nav('send', {}, true)}>Open</button></div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }} className="scroll-x">
        {s.recipients.slice(0, 6).map(p => (
          <button key={p.id} onClick={() => setRid(p.id)} title={p.name} style={{ borderRadius: 99, padding: 2, boxShadow: p.id === rid ? '0 0 0 2px var(--navy-800)' : 'none', transition: 'box-shadow .2s', flex: 'none' }}><Avatar name={p.name} hue={p.hue} size={36} /></button>
        ))}
      </div>
      <div className="glass" style={{ borderRadius: 18, padding: 14, background: 'var(--white)' }}>
        <div className="label">To {r.name} · {r.bank}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 300, color: 'var(--slate-2)' }}>₦</span>
          <input value={amt} onChange={e => setAmt(e.target.value.replace(/[^\d.]/g, ''))} aria-label="Amount" className="tnum"
            style={{ border: 0, outline: 0, background: 'transparent', fontSize: 30, fontWeight: 300, letterSpacing: '-0.03em', width: '100%' }} />
        </div>
        <div className="label" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}><span><Icon name="clock" size={12} /> Estimated delivery</span><span>{window.BP.claims.deliveryTime.value}</span></div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!+amt}
        onClick={() => api.sheet('confirm', { rid, amount: +amt, card: s.cards[0].id, note: '' })}>Continue</button>
    </GlassCard>
  );
}

/* ---------------- TRANSACTIONS ---------------- */
function parseQuery(q) {
  const n = window.BP.now; let from = null, to = null;
  let words = q.toLowerCase();
  const day = 864e5;
  const startToday = new Date(n.toDateString()).getTime();
  if (/last week/.test(words)) { from = startToday - 14 * day; to = startToday - 7 * day + day; words = words.replace('last week', ''); }
  else if (/this week/.test(words)) { from = startToday - 7 * day; words = words.replace('this week', ''); }
  else if (/yesterday/.test(words)) { from = startToday - day; to = startToday; words = words.replace('yesterday', ''); }
  else if (/today/.test(words)) { from = startToday; words = words.replace('today', ''); }
  const terms = words.split(/\s+/).filter(Boolean);
  return { from, to, terms };
}
function useFilteredTx(filter, q) {
  const { s } = useBP();
  return useMemo(() => {
    const p = parseQuery(q || '');
    return s.txns.filter(t => {
      if (filter === 'Sent' && t.amount > 0) return false;
      if (filter === 'Received' && t.amount < 0) return false;
      if (filter === 'Pending' && t.status !== 'pending') return false;
      const ts = new Date(t.date).getTime();
      if (p.from && ts < p.from) return false;
      if (p.to && ts >= p.to) return false;
      return p.terms.every(w => (t.name + ' ' + t.cat + ' ' + t.ref).toLowerCase().includes(w));
    });
  }, [s.txns, filter, q]);
}
function TxDetailBody({ t }) {
  const { s, api } = useBP();
  const m = useMoney();
  if (!t) return <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Select a transaction</div>;
  const rows = [['Status', <span style={{ color: t.status === 'completed' ? 'var(--pos)' : t.status === 'pending' ? 'var(--warn)' : 'var(--neg)', textTransform: 'capitalize' }}>● {t.status}</span>],
    ['Category', t.cat], ['Date', new Date(t.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })], ['Payment method', t.method], ['Fee', m.f(t.fee)], ['Reference', t.ref]];
  return (
    <div key={t.id} style={{ animation: 'rise .45s var(--ease) both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '6px 0 20px' }}>
        <TxIcon t={t} size={58} />
        <div style={{ fontSize: 16, marginTop: 12 }}>{t.name}</div>
        <div style={{ marginTop: 12 }}><Amount value={m.v(t.amount)} code={s.cur} size={36} sign color={t.amount > 0 ? 'var(--pos)' : 'var(--ink)'} hidden={s.hidden} /></div>
      </div>
      <div className="glass" style={{ borderRadius: 20, padding: '4px 16px', background: 'var(--white)' }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '13px 0', borderTop: i ? '1px dashed var(--line)' : 'none', fontSize: 13 }}>
            <span className="muted">{k}</span><span style={{ textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <button className="btn btn-ghost" onClick={() => api.toast('Receipt PDF prepared (demo)', 'download')}><Icon name="download" size={16} />Receipt</button>
        <button className="btn btn-ghost" onClick={() => { navigator.clipboard?.writeText(`${t.name} ${m.f(t.amount)} ${t.ref}`); api.toast('Receipt link copied', 'share'); }}><Icon name="share" size={16} />Share</button>
      </div>
      {t.status === 'pending' && <button className="btn" style={{ width: '100%', marginTop: 10, color: 'var(--neg)' }} onClick={() => api.toast('Cancellation requested (demo)', 'close')}>Cancel transfer</button>}
      {t.kind === 'person' && t.amount < 0 && <button className="btn btn-primary" style={{ width: '100%', marginTop: 10 }} onClick={() => api.nav('send', { rid: t.rid })}>Send again</button>}
    </div>
  );
}
function TransactionsScreen() {
  const { s, api, layout } = useBP();
  const m = useMoney();
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState(s.route.params.q || '');
  useEffect(() => { if (s.route.params.q != null) setQ(s.route.params.q); }, [s.route.params.q]);
  const list = useFilteredTx(filter, q);
  const sel = s.txns.find(t => t.id === s.selectedTx);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="field" style={{ borderRadius: 999, height: 46 }}>
        <Icon name="search" size={17} style={{ color: 'var(--slate)' }} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder='Try "last week Uber" or "bills"' aria-label="Search transactions" />
        {q && <button onClick={() => setQ('')} aria-label="Clear search"><Icon name="close" size={15} /></button>}
      </div>
      <div className="scroll-x"><Segmented options={['All', 'Sent', 'Received', 'Pending']} value={filter} onChange={setFilter} label="Transaction filter" /></div>
    </div>
  );
  const empty = <div style={{ textAlign: 'center', padding: '40px 10px' }}><Icon name="search" size={26} style={{ color: 'var(--mist)' }} /><div style={{ marginTop: 10, fontSize: 14 }}>No transactions match</div><div className="label" style={{ marginTop: 4 }}>Try a different filter or search phrase.</div></div>;
  const skeleton = Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center' }}><span className="skel" style={{ width: 40, height: 40, borderRadius: 99 }} /><div style={{ flex: 1 }}><div className="skel" style={{ height: 12, width: '50%' }} /><div className="skel" style={{ height: 10, width: '30%', marginTop: 8 }} /></div><div className="skel" style={{ height: 12, width: 60 }} /></div>);
  const recents = (
    <div className="scroll-x" style={{ display: 'flex', gap: 14, paddingBottom: 4 }}>
      <button onClick={() => api.nav('recipients')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 'none' }}>
        <span style={{ width: 48, height: 48, borderRadius: 99, border: '1.5px dashed var(--mist)', display: 'grid', placeItems: 'center', color: 'var(--navy-800)' }}><Icon name="plus" size={18} /></span><span style={{ fontSize: 11 }} className="muted">Add New</span>
      </button>
      {s.recipients.map(p => <button key={p.id} onClick={() => api.nav('send', { rid: p.id })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 'none' }}><Avatar name={p.name} hue={p.hue} size={48} /><span style={{ fontSize: 11 }} className="muted">{p.nick}</span></button>)}
    </div>
  );

  if (layout === 'mobile') return (
    <div>
      <ScreenHeader title="Transactions" back={s.stack.length > 0} />
      <div className="label" style={{ marginBottom: 10 }}>Recent recipients</div>
      {recents}
      <div style={{ marginTop: 18 }}>{controls}</div>
      <GlassCard pad={8} style={{ marginTop: 14 }}>
        {loading ? skeleton : list.length ? list.map(t => <TxRow key={t.id} t={t} onClick={() => api.nav('txDetail', { id: t.id })} />) : empty}
      </GlassCard>
    </div>
  );
  if (layout === 'tablet') return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
      <div>
        <ScreenHeader title="Transactions" back={false} sub={`${list.length} results · demo data`} />
        {controls}
        <GlassCard pad={8} style={{ marginTop: 14 }}>{loading ? skeleton : list.length ? list.slice(0, 18).map(t => <TxRow key={t.id} t={t} active={t.id === s.selectedTx} onClick={() => api.set({ selectedTx: t.id })} />) : empty}</GlassCard>
      </div>
      <GlassCard pad={20} style={{ position: 'sticky', top: 0 }}><TxDetailBody t={sel} /></GlassCard>
    </div>
  );
  // desktop table
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 18, alignItems: 'start' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <ScreenHeader title="Transaction History" back={false} sub={`${list.length} transactions · demo data`} />
          <button className="btn btn-primary btn-sm" onClick={() => api.toast('CSV export prepared (demo)', 'download')}><Icon name="download" size={14} />Export CSV</button>
        </div>
        <GlassCard pad={16}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div className="field" style={{ borderRadius: 999, height: 42, flex: 1 }}>
              <Icon name="search" size={16} style={{ color: 'var(--slate)' }} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder='Natural language: "last week Uber", "today", "bills"' aria-label="Search" />
            </div>
            <Segmented options={['All', 'Sent', 'Received', 'Pending']} value={filter} onChange={setFilter} label="Transaction filter" />
          </div>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead><tr className="label" style={{ textAlign: 'left' }}>{['#', 'Date', 'Name', 'Category', 'Amount', 'Status'].map(h => <th key={h} style={{ fontWeight: 400, padding: '10px 10px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {(loading ? [] : list.slice(0, 14)).map((t, i) => {
                const on = t.id === s.selectedTx;
                return (
                  <tr key={t.id} onClick={() => api.set({ selectedTx: t.id })} style={{ cursor: 'pointer', background: on ? 'var(--glass-strong)' : 'transparent', transition: 'background .2s' }}>
                    <td style={{ padding: '10px', color: 'var(--slate)' }} className="tnum">{String(i + 1).padStart(2, '0')}</td>
                    <td style={{ padding: '10px', color: 'var(--slate)', whiteSpace: 'nowrap' }}>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ padding: '10px' }}><span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><TxIcon t={t} size={28} />{t.name}</span></td>
                    <td style={{ padding: '10px', color: 'var(--slate)' }}>{t.cat}</td>
                    <td style={{ padding: '10px', color: t.amount > 0 ? 'var(--pos)' : 'var(--neg)', filter: s.hidden ? 'blur(5px)' : 'none' }} className="tnum">{m.f(t.amount, { sign: true })}</td>
                    <td style={{ padding: '10px' }}><span style={{ fontSize: 12, textTransform: 'capitalize', color: t.status === 'completed' ? 'var(--pos)' : t.status === 'pending' ? 'var(--warn)' : 'var(--neg)' }}>● {t.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {loading && skeleton}
          {!loading && !list.length && empty}
        </GlassCard>
      </div>
      <GlassCard pad={20} style={{ position: 'sticky', top: 0 }}><TxDetailBody t={sel} /></GlassCard>
    </div>
  );
}
function TxDetailScreen() {
  const { s } = useBP();
  const t = s.txns.find(x => x.id === s.route.params.id);
  return <div><ScreenHeader title="Transaction" /><TxDetailBody t={t} /></div>;
}

/* ---------------- SEND MONEY ---------------- */
function SlideToSend({ onDone, label = 'Slide to send' }) {
  const track = useRef(null); const [x, setX] = useState(0); const [done, setDone] = useState(false);
  const st = useRef(null);
  const max = () => (track.current?.offsetWidth || 300) - 56;
  const down = (e) => { if (done) return; st.current = e.clientX - x; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (st.current == null) return; setX(Math.min(max(), Math.max(0, e.clientX - st.current))); };
  const up = () => { if (st.current == null) return; st.current = null; if (x > max() * .85) { setX(max()); setDone(true); setTimeout(onDone, 250); } else setX(0); };
  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setX(max()); setDone(true); setTimeout(onDone, 250); } };
  return (
    <div ref={track} style={{ position: 'relative', height: 56, borderRadius: 999, background: 'var(--navy-900)', overflow: 'hidden', userSelect: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.8)', fontSize: 14, opacity: 1 - x / 200 }}>{label} →</div>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: x + 56, background: 'rgba(255,255,255,.12)', borderRadius: 999 }} />
      <button onPointerDown={down} onPointerMove={move} onPointerUp={up} onKeyDown={onKey} aria-label={label}
        style={{ position: 'absolute', left: 4 + x, top: 4, width: 48, height: 48, borderRadius: 999, background: '#fff', color: 'var(--navy-900)', display: 'grid', placeItems: 'center', touchAction: 'none', cursor: 'grab', transition: st.current == null ? 'left .35s var(--spring)' : 'none', boxShadow: '0 4px 12px rgba(0,0,0,.18)' }}>
        <Icon name={done ? 'check' : 'arrowRight'} size={18} />
      </button>
    </div>
  );
}
function AmountDisplay({ value, cur, size = 46 }) {
  const c = curOf(cur);
  const [int, dec] = (value || '0').split('.');
  const intFmt = Number(int || 0).toLocaleString('en-US');
  return (
    <div className="tnum" style={{ fontSize: size, fontWeight: 300, letterSpacing: '-0.04em', display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
      <span style={{ color: 'var(--slate-2)', marginRight: 2 }}>{c.symbol}</span>
      {intFmt.split('').map((ch, i) => <span key={i + ch + intFmt.length} className="digit">{ch}</span>)}
      {value.includes('.') && <span style={{ color: 'var(--slate-2)' }}>.{dec}</span>}
      {!value.includes('.') && <span style={{ color: 'var(--mist)' }}>.00</span>}
      <span className="caret" />
    </div>
  );
}
function CurrencyPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const c = curOf(value);
  return (
    <div style={{ position: 'relative' }}>
      <button className="chip press" style={{ height: 32, background: 'var(--white)' }} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
        <Flag code={c.flag} size={16} />{c.code}<Icon name="chevDown" size={12} />
      </button>
      {open && <div className="glass" role="listbox" style={{ position: 'absolute', right: 0, top: 38, zIndex: 10, borderRadius: 16, padding: 6, background: 'var(--glass-strong)', minWidth: 170, animation: 'popIn .2s var(--ease)' }}>
        {window.BP.currencies.map(x => <button key={x.code} role="option" aria-selected={x.code === value} className="row" style={{ padding: '8px 10px' }} onClick={() => { onChange(x.code); setOpen(false); }}><Flag code={x.flag} size={18} /><span style={{ fontSize: 13, flex: 1 }}>{x.code}</span><span className="label">{x.symbol}</span></button>)}
      </div>}
    </div>
  );
}
function SendScreen() {
  const { s, api, layout } = useBP();
  const [rid, setRid] = useState(s.route.params.rid || s.recipients[0].id);
  const [amt, setAmt] = useState('250');
  const [cur, setCur] = useState('NGN');
  const [cardId, setCardId] = useState(s.cards.find(c => !c.frozen)?.id);
  const [note, setNote] = useState('');
  const [purpose, setPurpose] = useState('Family support');
  const [schedule, setSchedule] = useState('Now');
  const r = s.recipients.find(x => x.id === rid);
  const card = s.cards.find(c => c.id === cardId);
  const ngn = (+amt || 0) * window.BP.rates[cur];
  const press = (k) => setAmt(a => {
    if (k === 'del') return a.slice(0, -1);
    if (k === '.' && a.includes('.')) return a;
    if (a.includes('.') && a.split('.')[1].length >= 2) return a;
    if (a.replace('.', '').length >= 9) return a;
    return (a === '0' && k !== '.') ? k : a + k;
  });
  useEffect(() => {
    if (layout === 'mobile') return;
    const k = (e) => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return; if (/^[0-9.]$/.test(e.key)) press(e.key); if (e.key === 'Backspace') press('del'); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [layout]);
  const insufficient = ngn > s.wallets.NGN;
  const go = () => api.sheet('confirm', { rid, amount: ngn, origAmount: +amt, cur, card: cardId, note, purpose, schedule });

  const recipientCard = (
    <div className="glass" style={{ borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--glass-strong)' }}>
      <Avatar name={r.name} hue={r.hue} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}><div className="row-title">{r.name}</div><div className="row-sub">{r.bank} · {r.acct}</div></div>
      <button className="chip press" onClick={() => api.sheet('pickRecipient', { onPick: setRid })}>Change</button>
    </div>
  );
  const amountCard = (
    <div className="glass" style={{ borderRadius: 20, padding: 16, background: 'var(--glass-strong)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="label">Enter Amount</span><CurrencyPicker value={cur} onChange={setCur} /></div>
      <div style={{ marginTop: 12 }}><AmountDisplay value={amt} cur={cur} size={layout === 'mobile' ? 42 : 48} /></div>
      {cur !== 'NGN' && <div className="label" style={{ marginTop: 10 }}>1 {cur} = {fmtMoney(window.BP.rates[cur], 'NGN')} · recipient gets <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{fmtMoney(ngn, 'NGN')}</b></div>}
      <div style={{ height: 1, background: 'var(--line)', margin: '14px 0 10px' }} />
      <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="clock" size={13} />Estimated Delivery</span><span>{window.BP.claims.deliveryTime.value}</span></div>
      {insufficient && <div style={{ fontSize: 12, color: 'var(--neg)', marginTop: 8 }}>Amount exceeds your NGN wallet balance.</div>}
    </div>
  );
  const sourceCard = (
    <div className="glass" style={{ borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--glass-strong)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name="card" size={19} /></span>
      <div style={{ flex: 1 }}><div className="row-title">{window.BP.brand.name} Card</div><div className="row-sub">•••• •••• {card?.last4}</div></div>
      <button className="chip press" onClick={() => { const avail = s.cards.filter(c => !c.frozen); const i = avail.findIndex(c => c.id === cardId); setCardId(avail[(i + 1) % avail.length].id); }}>Change</button>
    </div>
  );
  const extras = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <label className="field"><Icon name="info" size={16} style={{ color: 'var(--slate)' }} /><input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note (optional)" aria-label="Note" /></label>
      <label className="field"><Icon name="hash" size={16} style={{ color: 'var(--slate)' }} />
        <select value={purpose} onChange={e => setPurpose(e.target.value)} aria-label="Purpose">{['Family support', 'Rent', 'Business', 'Gift', 'Bills', 'Other'].map(p => <option key={p}>{p}</option>)}</select></label>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="label">Schedule</span><Segmented light options={['Now', 'Later', 'Monthly']} value={schedule} onChange={setSchedule} label="Schedule" /></div>
    </div>
  );

  if (layout === 'mobile') return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Send Money" right={<button className="icon-btn" onClick={() => api.nav('recipients')} aria-label="Recipients"><Icon name="user" size={17} /></button>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{recipientCard}{amountCard}{sourceCard}</div>
      <button className="btn btn-primary" style={{ marginTop: 14 }} disabled={!+amt || insufficient} onClick={go}>Continue</button>
      <div style={{ marginTop: 14, padding: 10, borderRadius: 22, background: 'linear-gradient(180deg, rgba(64,88,129,.55), rgba(38,56,106,.85))' }}><Numpad onKey={press} /></div>
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: layout === 'desktop' ? 'minmax(0,1.1fr) minmax(0,.9fr)' : 'minmax(0,1fr) minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
      <div>
        <ScreenHeader title="Send Money" back={false} sub="Type an amount on your keyboard — press N anywhere to start a new transfer" />
        <div className="label" style={{ marginBottom: 10 }}>Recent recipients</div>
        <div className="scroll-x" style={{ display: 'flex', gap: 12, paddingBottom: 14 }}>
          {s.recipients.map(p => (
            <button key={p.id} onClick={() => setRid(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 'none' }}>
              <span style={{ borderRadius: 99, padding: 2, boxShadow: p.id === rid ? '0 0 0 2px var(--navy-800)' : 'none', transition: 'box-shadow .2s' }}><Avatar name={p.name} hue={p.hue} size={46} /></span>
              <span style={{ fontSize: 11, color: p.id === rid ? 'var(--ink)' : 'var(--slate)' }}>{p.nick}</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{recipientCard}{amountCard}{sourceCard}{extras}</div>
      </div>
      <GlassCard pad={20} style={{ position: 'sticky', top: 0 }}>
        <div style={{ fontSize: 15 }}>Live summary</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
          <Avatar name={`${window.BP.user.first} ${window.BP.user.last}`} hue={25} size={40} />
          <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, var(--mist) 0 6px, transparent 6px 10px)', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 26, height: 26, borderRadius: 99, background: 'var(--navy-900)', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon name="send" size={13} /></span>
          </div>
          <Avatar name={r.name} hue={r.hue} size={40} />
        </div>
        {[['You send', fmtMoney(+amt || 0, cur)], ['Recipient gets', fmtMoney(ngn, 'NGN')], ['Rate', cur === 'NGN' ? '—' : `1 ${cur} = ${fmtMoney(window.BP.rates[cur], 'NGN')}`], ['Fee', window.BP.claims.transferFee.value.split(' on')[0]], ['From', `Card •• ${card?.last4}`], ['Purpose', purpose], ['When', schedule === 'Now' ? 'Immediately' : schedule === 'Later' ? 'Tomorrow, 9:00 AM' : 'Monthly on the 20th']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px dashed var(--line)', fontSize: 13 }}><span className="muted">{k}</span><span className="tnum">{v}</span></div>
        ))}
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} disabled={!+amt || insufficient} onClick={go}>Continue</button>
        <div className="label" style={{ marginTop: 10, textAlign: 'center' }}>Demo — no real money moves</div>
      </GlassCard>
    </div>
  );
}

/* confirm transfer sheet — PIN or slide */
function ConfirmSheet({ props, close }) {
  const { s, api } = useBP();
  const [stage, setStage] = useState('review');
  const [pin, setPin] = useState('');
  const r = s.recipients.find(x => x.id === props.rid);
  const card = s.cards.find(c => c.id === props.card);
  const commit = () => {
    setStage('processing');
    setTimeout(() => {
      api.tx({ id: 'TX' + Date.now(), ref: '#BNP-' + String(Date.now()).slice(-6), name: r.name, rid: r.id, kind: 'person', hue: r.hue, cat: 'Transfer out', amount: -Math.round(props.amount), date: window.BP.now.toISOString(), status: props.schedule && props.schedule !== 'Now' ? 'pending' : 'completed', method: `${card ? 'Card •• ' + card.last4 : 'Wallet balance'}`, fee: 0 });
      setStage('done');
    }, 1100);
  };
  if (stage === 'done') return (
    <div style={{ textAlign: 'center', padding: '10px 0 4px', position: 'relative' }}>
      <Confetti />
      <div style={{ display: 'grid', placeItems: 'center' }}><SuccessCheck /></div>
      <div style={{ fontSize: 22, letterSpacing: '-0.02em', marginTop: 16 }}>Payment <span className="serif">successful</span></div>
      <div className="label" style={{ marginTop: 6 }}>{fmtMoney(props.amount, 'NGN')} sent to {r.name}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
        <button className="btn btn-ghost" onClick={() => { close(); api.nav('txDetail', { id: s.selectedTx }); }}>Get receipt</button>
        <button className="btn btn-primary" onClick={() => { close(); api.nav('home', {}, true); }}>Done</button>
      </div>
    </div>
  );
  return (
    <div>
      <div className="glass" style={{ borderRadius: 20, padding: 16, background: 'var(--white)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={`${window.BP.user.first} ${window.BP.user.last}`} hue={25} size={40} />
        <Icon name="arrowRight" size={16} style={{ color: 'var(--slate)' }} />
        <Avatar name={r.name} hue={r.hue} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}><div className="row-title">{r.name}</div><div className="row-sub">{r.bank} · {r.acct}</div></div>
      </div>
      <div style={{ textAlign: 'center', margin: '20px 0 14px' }}><Amount value={props.amount} code="NGN" size={40} /></div>
      {[['From', card ? `Card •• ${card.last4}` : 'Wallet'], ['Fee', fmtMoney(0)], ['Delivery', window.BP.claims.deliveryTime.value], ['Purpose', props.purpose || 'Transfer'], ['Total', fmtMoney(props.amount)]].map(([k, v], i) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 2px', borderTop: i ? '1px dashed var(--line)' : 'none', fontSize: 13 }}><span className="muted">{k}</span><span className="tnum" style={k === 'Total' ? { fontWeight: 500 } : null}>{v}</span></div>
      ))}
      <div style={{ marginTop: 16 }}>
        {stage === 'review' && <><SlideToSend onDone={commit} /><button className="btn" style={{ width: '100%', marginTop: 8, color: 'var(--slate)', fontSize: 13 }} onClick={() => setStage('pin')}>Use PIN instead</button></>}
        {stage === 'pin' && (
          <div>
            <div className="label" style={{ textAlign: 'center' }}>Enter your 4-digit PIN (demo: any 4 digits)</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '14px 0' }}>{[0, 1, 2, 3].map(i => <span key={i} style={{ width: 14, height: 14, borderRadius: 99, background: i < pin.length ? 'var(--navy-900)' : 'var(--line)', transition: 'background .2s, transform .2s', transform: i < pin.length ? 'scale(1.15)' : 'none' }} />)}</div>
            <div style={{ padding: 10, borderRadius: 20, background: 'linear-gradient(180deg, rgba(64,88,129,.6), rgba(38,56,106,.9))' }}>
              <Numpad onKey={(k) => { if (k === 'del') return setPin(p => p.slice(0, -1)); if (k === '.') return; const np = (pin + k).slice(0, 4); setPin(np); if (np.length === 4) setTimeout(commit, 200); }} />
            </div>
          </div>
        )}
        {stage === 'processing' && <div style={{ display: 'grid', placeItems: 'center', height: 56 }}><span style={{ width: 26, height: 26, borderRadius: 99, border: '2.5px solid var(--line)', borderTopColor: 'var(--navy-900)', animation: 'spin .8s linear infinite' }} /></div>}
      </div>
    </div>
  );
}
function PickRecipientSheet({ props, close }) {
  const { s } = useBP();
  const [q, setQ] = useState('');
  const list = s.recipients.filter(r => (r.name + r.nick + r.bank).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="field" style={{ borderRadius: 999, height: 44, marginBottom: 10 }}><Icon name="search" size={16} style={{ color: 'var(--slate)' }} /><input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search recipients" aria-label="Search recipients" /></div>
      {list.map(r => <button key={r.id} className="row" onClick={() => { props.onPick(r.id); close(); }}><Avatar name={r.name} hue={r.hue} size={40} /><div style={{ flex: 1 }}><div className="row-title">{r.name} <span className="label">· {r.nick}</span></div><div className="row-sub">{r.bank} · {r.acct}</div></div><Icon name="chevRight" size={16} style={{ color: 'var(--slate)' }} /></button>)}
    </div>
  );
}

Object.assign(window, { BalanceCard, QuickActions, TxRow, RecentList, StatTile, EarningCard, UpcomingList, HomeScreen, CardFit, QuickSendWidget, TransactionsScreen, TxDetailScreen, TxDetailBody, SendScreen, ConfirmSheet, PickRecipientSheet, SlideToSend, CurrencyPicker, AmountDisplay, WEEK });
