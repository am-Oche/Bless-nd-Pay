/* Bless nd Pay — Cards, Wallet, Analytics, Add funds, Bills, QR, Profile, Settings, misc */

/* ---------------- CARDS ---------------- */
function CardControls({ card }) {
  const { api } = useBP();
  const ctrls = [
    ['snow', card.frozen ? 'Unfreeze' : 'Freeze', () => { api.card(card.id, { frozen: !card.frozen }); api.toast(card.frozen ? 'Card unfrozen' : 'Card frozen', 'snow'); }],
    ['eye', 'Details', () => api.sheet('reveal', { id: card.id })],
    ['chart', 'Limits', () => api.nav('cardDetail', { id: card.id })],
    ['settings', 'Settings', () => api.nav('cardDetail', { id: card.id })],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
      {ctrls.map(([ic, l, fn]) => (
        <button key={l} className="press" onClick={fn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 50, height: 50, borderRadius: 99, display: 'grid', placeItems: 'center', background: ic === 'snow' && card.frozen ? 'var(--navy-900)' : 'var(--glass-strong)', color: ic === 'snow' && card.frozen ? '#fff' : 'var(--navy-900)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-1)', transition: 'background .25s, color .25s' }}><Icon name={ic} size={19} /></span>
          <span style={{ fontSize: 12, color: 'var(--navy-800)' }}>{l}</span>
        </button>
      ))}
    </div>
  );
}
function CardCarousel({ idx, setIdx, width }) {
  const { s } = useBP();
  const ref = useRef(null);
  const onScroll = () => { const el = ref.current; const i = Math.round(el.scrollLeft / (width + 14)); if (i !== idx) setIdx(i); };
  useEffect(() => { const el = ref.current; if (el && Math.round(el.scrollLeft / (width + 14)) !== idx) el.scrollTo({ left: idx * (width + 14), behavior: 'smooth' }); }, [idx]);
  return (
    <div>
      <div ref={ref} onScroll={onScroll} className="scroll-x" style={{ display: 'flex', gap: 14, scrollSnapType: 'x mandatory', padding: '6px 0 18px' }}>
        {s.cards.map((c, i) => (
          <div key={c.id} style={{ scrollSnapAlign: 'center', flex: 'none', transform: i === idx ? 'none' : 'scale(.94)', opacity: i === idx ? 1 : .6, transition: 'transform .4s var(--ease), opacity .4s' }}><PayCard card={c} width={width} /></div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {s.cards.map((c, i) => <button key={c.id} onClick={() => setIdx(i)} aria-label={`Card ${i + 1}`} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 9, background: i === idx ? 'var(--navy-800)' : 'var(--mist)', transition: 'width .3s var(--ease)' }} />)}
      </div>
    </div>
  );
}
function CardsScreen() {
  const { s, api, layout } = useBP();
  const [idx, setIdx] = useState(0);
  const card = s.cards[Math.min(idx, s.cards.length - 1)];
  const mobile = layout === 'mobile';
  const wrap = useRef(null); const [w, setW] = useState(320);
  useLayoutEffect(() => { const ro = new ResizeObserver(([e]) => setW(e.contentRect.width)); ro.observe(wrap.current); return () => ro.disconnect(); }, []);
  const cw = Math.min(380, w - (mobile ? 30 : 0));
  const spend = s.txns.filter(t => t.amount < 0 && t.method.includes(card.last4)).slice(0, 5);
  return (
    <div ref={wrap}>
      <ScreenHeader title="Cards" back={mobile && s.stack.length > 0} right={<button className="icon-btn" onClick={() => api.sheet('addCard')} aria-label="Add virtual card"><Icon name="plus" size={18} /></button>} />
      <div style={{ display: mobile ? 'block' : 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 22, alignItems: 'start' }}>
        <div>
          <CardCarousel idx={idx} setIdx={setIdx} width={cw} />
          <div style={{ marginTop: 22 }}><CardControls card={card} /></div>
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: 18 }} onClick={() => api.nav('cardDetail', { id: card.id })}>Card Details</button>
        </div>
        <div style={{ marginTop: mobile ? 22 : 0 }}>
          <GlassCard pad={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label" style={{ fontSize: 13 }}>Daily limit · {card.label}</span><span className="label tnum">{fmtMoney(card.spent, 'NGN', { dp: 0 })} / {fmtMoney(card.limit, 'NGN', { dp: 0 })}</span></div>
            <div style={{ marginTop: 22 }}><HatchProgress pct={Math.min(100, card.spent / card.limit * 100)} /></div>
          </GlassCard>
          <Section title="Recent card spend">
            <GlassCard pad={8}>{spend.length ? spend.map(t => <TxRow key={t.id} t={t} onClick={() => mobile ? api.nav('txDetail', { id: t.id }) : (api.set({ selectedTx: t.id }), api.nav('transactions', {}, true))} />) : <div className="label" style={{ padding: 20, textAlign: 'center' }}>No spend on this card yet.</div>}</GlassCard>
          </Section>
        </div>
      </div>
    </div>
  );
}
function CardDetailScreen() {
  const { s, api, layout } = useBP();
  const card = s.cards.find(c => c.id === s.route.params.id) || s.cards[0];
  const [limit, setLimit] = useState(card.limit);
  const [online, setOnline] = useState(true);
  const [intl, setIntl] = useState(false);
  const [atm, setAtm] = useState(true);
  const mobile = layout === 'mobile';
  return (
    <div>
      <ScreenHeader title={`${card.label} card`} sub={layout !== 'mobile' ? `${card.type} · •••• ${card.last4}` : null} />
      <div style={{ display: mobile ? 'block' : 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 22 }}>
        <div>
          <CardFit card={card} />
          <div style={{ marginTop: 20 }}><CardControls card={card} /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: mobile ? 20 : 0 }}>
          <GlassCard pad={18}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><span className="label" style={{ fontSize: 13 }}>Daily spending limit</span><span className="tnum" style={{ fontSize: 20, fontWeight: 300 }}>{fmtMoney(limit, 'NGN', { dp: 0 })}</span></div>
            <input type="range" min={50000} max={5000000} step={50000} value={limit} onChange={e => setLimit(+e.target.value)} aria-label="Daily limit" style={{ width: '100%', marginTop: 16, accentColor: 'var(--navy-800)' }} />
            <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}><span>₦50K</span><span>₦5M</span></div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} disabled={limit === card.limit} onClick={() => { api.card(card.id, { limit }); api.toast('Limit updated', 'check'); }}>Save limit</button>
          </GlassCard>
          <GlassCard pad={6}>
            {[['Online payments', online, setOnline, 'globe'], ['International payments', intl, setIntl, 'send'], ['ATM withdrawals', atm, setAtm, 'bank'], ['Freeze card', card.frozen, (v) => api.card(card.id, { frozen: v }), 'snow']].map(([l, v, fn, ic]) => (
              <div key={l} className="row" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span style={{ width: 34, height: 34, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name={ic} size={16} /></span><span className="row-title">{l}</span></span>
                <Toggle on={v} onChange={fn} label={l} />
              </div>
            ))}
          </GlassCard>
          <button className="btn btn-ghost" onClick={() => api.sheet('reveal', { id: card.id })}><Icon name="lock" size={16} />Show card number</button>
        </div>
      </div>
    </div>
  );
}
function RevealSheet({ props }) {
  const { s } = useBP();
  const card = s.cards.find(c => c.id === props.id);
  const [ok, setOk] = useState(false);
  const [scanning, setScanning] = useState(false);
  return (
    <div style={{ textAlign: 'center' }}>
      {!ok ? (
        <div style={{ padding: '6px 0 4px' }}>
          <button className="press" onClick={() => { setScanning(true); setTimeout(() => setOk(true), 1000); }} aria-label="Confirm with biometrics (demo)"
            style={{ width: 92, height: 92, borderRadius: 99, display: 'grid', placeItems: 'center', margin: '0 auto', background: 'var(--sky-1)', color: 'var(--navy-900)', position: 'relative' }}>
            {scanning && <span style={{ position: 'absolute', inset: 0, borderRadius: 99, border: '2px solid var(--navy-800)', animation: 'ring 1s infinite' }} />}
            <Icon name="fingerprint" size={40} stroke={1.3} />
          </button>
          <div style={{ marginTop: 14, fontSize: 15 }}>Confirm it's you</div>
          <div className="label" style={{ marginTop: 4 }}>Biometric check is a demo mock — tap to continue.</div>
        </div>
      ) : (
        <div style={{ animation: 'rise .45s var(--ease) both' }}>
          <div style={{ display: 'grid', placeItems: 'center' }}><PayCard card={card} width={320} reveal /></div>
          <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={() => navigator.clipboard?.writeText(card.number)}><Icon name="copy" size={15} />Copy number</button>
          <div className="label" style={{ marginTop: 8 }}>Auto-hides when you close this sheet.</div>
        </div>
      )}
    </div>
  );
}
function AddCardSheet({ close }) {
  const { s, api } = useBP();
  const [label, setLabel] = useState('Subscriptions');
  const [tone, setTone] = useState('navy');
  const [limit, setLimit] = useState(100000);
  const preview = { id: 'new', label, type: 'Virtual', last4: '••••', number: '', exp: '10/29', cvv: '', tone, frozen: false };
  return (
    <div>
      <div style={{ display: 'grid', placeItems: 'center', marginBottom: 16 }}><PayCard card={preview} width={300} /></div>
      <label className="field" style={{ marginBottom: 10 }}><input value={label} onChange={e => setLabel(e.target.value)} placeholder="Card name" aria-label="Card name" /></label>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 12px' }}><span className="label">Colour</span><Segmented light options={[{ value: 'sky', label: 'Sky' }, { value: 'navy', label: 'Navy' }, { value: 'ink', label: 'Ink' }]} value={tone} onChange={setTone} /></div>
      <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Monthly limit</span><span className="tnum" style={{ color: 'var(--ink)' }}>{fmtMoney(limit, 'NGN', { dp: 0 })}</span></div>
      <input type="range" min={10000} max={1000000} step={10000} value={limit} onChange={e => setLimit(+e.target.value)} style={{ width: '100%', accentColor: 'var(--navy-800)' }} aria-label="Monthly limit" />
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={() => {
        const last4 = String(1000 + Math.floor(Math.random() * 8999));
        api.addCard({ ...preview, id: 'c' + Date.now(), last4, number: `4187 6620 ${last4.slice(0, 2)}93 ${last4}`, cvv: '238', limit, spent: 0 });
        api.toast('Virtual card created', 'card'); close(); api.nav('cards', {}, true);
      }}>Create virtual card</button>
    </div>
  );
}

/* ---------------- WALLET ---------------- */
function WalletScreen() {
  const { s, api, layout } = useBP();
  const [cur, setCur] = useState('NGN');
  const [from, setFrom] = useState('NGN'); const [to, setTo] = useState('USD'); const [amt, setAmt] = useState('50000');
  const [range, setRange] = useState('1M');
  const mobile = layout === 'mobile';
  const pts = useMemo(() => { let v = window.BP.rates.USD; const n = { '1W': 7, '1M': 30, '3M': 90, '1Y': 52 }[range]; return Array.from({ length: n }).map((_, i) => (v = v * (1 + Math.sin(i * 1.7 + n) * 0.004 + (i % 5 === 0 ? -0.003 : 0.0015)))); }, [range]);
  const c = curOf(cur);
  const out = (+amt || 0) * window.BP.rates[from] / window.BP.rates[to];
  const pots = [{ name: 'Rent fund', saved: 820000, goal: 1500000 }, { name: 'Japa savings', saved: 2400000, goal: 6000000 }, { name: 'December', saved: 145000, goal: 400000 }];
  return (
    <div>
      <ScreenHeader title="My Wallet" back={mobile && s.stack.length > 0} right={!mobile ? <button className="btn btn-primary btn-sm" onClick={() => api.nav('addfunds')}><Icon name="plus" size={14} />Add funds</button> : null} />
      <div className="scroll-x" style={{ marginBottom: 14 }}><Segmented options={window.BP.currencies.map(x => ({ value: x.code, label: x.code }))} value={cur} onChange={setCur} label="Wallet currency" /></div>
      <div style={{ display: mobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 14 }}>
        <GlassCard pad={20}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Flag code={c.flag} size={26} /><span className="label" style={{ fontSize: 13 }}>{c.name} balance</span></div>
          <div key={cur} style={{ marginTop: 26, animation: 'rise .4s var(--ease) both' }}><Amount value={s.wallets[cur]} code={cur} size={40} hidden={s.hidden} /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <button className="btn btn-primary btn-sm" onClick={() => api.nav('addfunds')}>Add funds</button>
            <button className="btn btn-ghost btn-sm" onClick={() => api.nav('send')}>Send</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setFrom(cur)}>Convert</button>
          </div>
        </GlassCard>
        <GlassCard pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="label" style={{ fontSize: 13 }}>USD / NGN</span><Segmented light options={['1W', '1M', '3M', '1Y']} value={range} onChange={setRange} label="Rate range" /></div>
          <div className="tnum" style={{ fontSize: 26, fontWeight: 300, marginTop: 10, letterSpacing: '-0.03em' }}>₦{pts[pts.length - 1].toFixed(2)} <span className="pos" style={{ fontSize: 12 }}>+{((pts[pts.length - 1] / pts[0] - 1) * 100).toFixed(2)}%</span></div>
          <div style={{ marginTop: 8 }}><Sparkline points={pts} h={80} /></div>
          <div className="label">Indicative demo rates</div>
        </GlassCard>
        <GlassCard pad={20}>
          <div style={{ fontSize: 14, marginBottom: 14 }}>Convert currency</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
            <div className="field" style={{ height: 60 }}><span className="label" style={{ width: 40 }}>From</span><input className="tnum" value={amt} onChange={e => setAmt(e.target.value.replace(/[^\d.]/g, ''))} aria-label="Amount to convert" style={{ fontSize: 20, fontWeight: 300 }} /><CurrencyPicker value={from} onChange={setFrom} /></div>
            <button className="icon-btn navy press" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 34, height: 34, zIndex: 2 }} onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap currencies"><Icon name="refresh" size={15} /></button>
            <div className="field" style={{ height: 60 }}><span className="label" style={{ width: 40 }}>To</span><span className="tnum" style={{ flex: 1, fontSize: 20, fontWeight: 300 }}>{out.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span><CurrencyPicker value={to} onChange={setTo} /></div>
          </div>
          <div className="label" style={{ marginTop: 10 }}>1 {from} = {(window.BP.rates[from] / window.BP.rates[to]).toFixed(4)} {to} · no conversion fee (client to confirm)</div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!+amt || from === to || +amt > s.wallets[from]} onClick={() => { api.convert(from, to, +amt); api.toast(`Converted to ${to}`, 'refresh'); }}>Convert</button>
        </GlassCard>
        <GlassCard pad={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={{ fontSize: 14 }}>Savings pots</span><button className="label" onClick={() => api.toast('New pot created (demo)', 'pot')}>+ New pot</button></div>
          {pots.map(p => (
            <div key={p.name} style={{ padding: '10px 0', borderTop: '1px dashed var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}><span>{p.name}</span><span className="tnum muted">{compact(p.saved)} / {compact(p.goal)}</span></div>
              <HatchProgress pct={p.saved / p.goal * 100} />
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

/* ---------------- ANALYTICS / EARNINGS ---------------- */
function AnalyticsScreen() {
  const { s, layout } = useBP();
  const m = useMoney();
  const [range, setRange] = useState('Week');
  const [sel, setSel] = useState(3);
  const mobile = layout === 'mobile';
  const sets = {
    Day: { d: [12, 8, 22, 31, 18, 26, 14].map(x => x * 1000), l: ['6a', '9a', '12p', '3p', '6p', '9p', '12a'] },
    Week: { d: WEEK, l: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] },
    Month: { d: [820, 1120, 940, 1260].map(x => x * 1000), l: ['W1', 'W2', 'W3', 'W4'] },
    Year: { d: [3.1, 2.8, 3.6, 4.1, 3.3, 3.9, 4.4, 5.2, 3.8, 4.6, 4.0, 4.9].map(x => x * 1e6), l: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] },
  }[range];
  const cats = [{ label: 'Food & Drink', value: 34, color: '#26386a' }, { label: 'Transport', value: 22, color: '#405881' }, { label: 'Bills', value: 20, color: '#8db4e3' }, { label: 'Shopping', value: 14, color: '#b3bcd0' }, { label: 'Other', value: 10, color: '#e6e9ef' }];
  const cnt = useCountUp(56.75, 1000);
  return (
    <div>
      <ScreenHeader title="Earning" back={mobile && s.stack.length > 0} />
      <div style={{ display: 'flex', justifyContent: mobile ? 'center' : 'flex-start', marginBottom: 14 }}><Segmented options={['Day', 'Week', 'Month', 'Year']} value={range} onChange={(v) => { setRange(v); setSel(0); }} label="Analytics range" /></div>
      <div style={{ display: mobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 14 }}>
        <GlassCard pad={20}>
          <div style={{ textAlign: mobile ? 'center' : 'left' }}>
            <div className="label">Total Profit (demo)</div>
            <div className="tnum" style={{ fontSize: 52, fontWeight: 300, letterSpacing: '-0.045em', marginTop: 8, display: 'inline-flex', alignItems: 'baseline' }}>
              ${Math.floor(cnt)}<span style={{ color: 'var(--pos)' }}>.{String(Math.round((cnt % 1) * 100)).padStart(2, '0')}</span><Icon name="arrowUpRight" size={22} style={{ color: 'var(--pos)', marginLeft: 4 }} />
            </div>
            <div className="label" style={{ marginTop: 6 }}>Total spend {m.c(612000)} · Total profit {m.c(87400)}</div>
          </div>
          <div style={{ marginTop: 26 }}><WeekBars data={sets.d} labels={sets.l} selected={sel} onSelect={setSel} height={150} code={m.cur} /></div>
        </GlassCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatTile label="Total Revenue" value={m.c(1927056)} delta={4.2} />
            <StatTile label="Monthly Expense" value={m.c(714281)} delta={-2.1} />
          </div>
          <GlassCard pad={20}>
            <div style={{ fontSize: 14, marginBottom: 14 }}>Spending by category</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Donut segments={cats} size={130} stroke={14} center={<div><div className="label">This {range.toLowerCase()}</div><div className="tnum" style={{ fontSize: 18, fontWeight: 300 }}>{m.c(612000)}</div></div>} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cats.map(c => <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}><span style={{ width: 8, height: 8, borderRadius: 9, background: c.color, boxShadow: '0 0 0 1px var(--line)' }} /><span style={{ flex: 1 }}>{c.label}</span><span className="muted tnum">{c.value}%</span></div>)}
              </div>
            </div>
          </GlassCard>
          <GlassCard pad={20}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>Monthly budget</span><span className="tnum muted">{m.c(612000)} / {m.c(800000)}</span></div>
            <div style={{ marginTop: 16 }}><HatchProgress pct={76.5} /></div>
            <div className="label" style={{ marginTop: 10 }}>You're on track — ₦188K left with 11 days to go.</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ADD FUNDS ---------------- */
function AddFundsScreen() {
  const { s, api, layout } = useBP();
  const [method, setMethod] = useState('card');
  const [amt, setAmt] = useState(50000);
  const methods = [{ value: 'card', label: 'Card' }, { value: 'bank', label: 'Bank' }, { value: 'ussd', label: 'USSD' }];
  return (
    <div style={{ maxWidth: layout === 'mobile' ? 'none' : 560 }}>
      <ScreenHeader title="Add Funds" sub={layout !== 'mobile' ? 'Top up your NGN wallet — demo, no real charge' : null} />
      <Segmented full options={methods} value={method} onChange={setMethod} label="Funding method" size="lg" />
      <div key={method} style={{ marginTop: 16, animation: 'rise .4s var(--ease) both' }}>
        {method === 'card' && <GlassCard pad={16}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ width: 44, height: 44, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name="card" size={19} /></span><div style={{ flex: 1 }}><div className="row-title">Debit card •• 2231</div><div className="row-sub">Saved · GTBank Verve</div></div><span className="chip">Default</span></div></GlassCard>}
        {method === 'bank' && <GlassCard pad={16}>
          <div className="label">Transfer to your dedicated account</div>
          {[['Bank', 'Partner Bank (client to name)'], ['Account number', '9 012 448 715'], ['Account name', `${window.BP.user.first} ${window.BP.user.last} / BNP`]].map(([k, v]) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderTop: '1px dashed var(--line)', fontSize: 13, marginTop: 4 }}><span className="muted">{k}</span><span className="tnum">{v}</span></div>)}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => { navigator.clipboard?.writeText('9012448715'); api.toast('Account number copied', 'copy'); }}><Icon name="copy" size={14} />Copy details</button>
        </GlassCard>}
        {method === 'ussd' && <GlassCard pad={16}><div className="label">Dial from your registered phone</div><div className="tnum" style={{ fontSize: 30, fontWeight: 300, marginTop: 10, letterSpacing: '-0.02em' }}>*737*000*{amt}#</div><div className="label" style={{ marginTop: 6 }}>Demo code — replace with your partner's USSD string.</div></GlassCard>}
      </div>
      <div className="label" style={{ margin: '20px 0 10px' }}>Amount</div>
      <div style={{ textAlign: 'center', margin: '6px 0 16px' }}><Amount value={amt} code="NGN" size={44} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[10000, 25000, 50000, 100000].map(v => <button key={v} className="chip press" style={{ height: 40, justifyContent: 'center', background: amt === v ? 'var(--navy-900)' : 'var(--glass-strong)', color: amt === v ? '#fff' : 'var(--navy-800)', transition: 'background .2s' }} onClick={() => setAmt(v)}>{compact(v)}</button>)}
      </div>
      <input type="range" min={1000} max={500000} step={1000} value={amt} onChange={e => setAmt(+e.target.value)} style={{ width: '100%', marginTop: 16, accentColor: 'var(--navy-800)' }} aria-label="Amount" />
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={() => { api.tx({ id: 'TX' + Date.now(), ref: '#BNP-' + String(Date.now()).slice(-6), name: method === 'card' ? 'Top up · Card •• 2231' : method === 'bank' ? 'Top up · Bank transfer' : 'Top up · USSD', kind: 'merchant', icon: 'plus', cat: 'Top up', amount: amt, date: window.BP.now.toISOString(), status: 'completed', method: 'Wallet balance', fee: 0 }); api.toast(`${fmtMoney(amt)} added to wallet`, 'check'); api.back(); }}>Add {fmtMoney(amt)}</button>
    </div>
  );
}

/* ---------------- PAY BILLS ---------------- */
function BillsScreen() {
  const { s, api, layout } = useBP();
  const [cat, setCat] = useState('electricity');
  const [biller, setBiller] = useState(null);
  const [acct, setAcct] = useState('');
  const [amt, setAmt] = useState(15000);
  const [remind, setRemind] = useState(true);
  const [done, setDone] = useState(false);
  const billers = window.BP.billers.filter(b => b.cat === cat);
  const b = window.BP.billers.find(x => x.id === biller);
  const mobile = layout === 'mobile';
  const reset = () => { setBiller(null); setAcct(''); setDone(false); };
  const form = b && (
    <GlassCard pad={18} style={{ animation: 'rise .4s var(--ease) both' }}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ display: 'grid', placeItems: 'center' }}><SuccessCheck size={64} /></div>
          <div style={{ fontSize: 18, marginTop: 12 }}>Bill paid</div>
          <div className="label" style={{ marginTop: 4 }}>{b.name} · {fmtMoney(amt)}</div>
          {cat === 'electricity' && <div className="tnum" style={{ marginTop: 12, fontSize: 15, letterSpacing: '.08em' }}>Token: 4821 0937 5512 6604 2287</div>}
          <button className="btn btn-ghost" style={{ marginTop: 14 }} onClick={reset}>Pay another bill</button>
        </div>
      ) : (<>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{ width: 40, height: 40, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name={window.BP.billCategories.find(c => c.id === cat).icon} size={18} /></span>
          <div style={{ flex: 1 }}><div className="row-title">{b.name}</div><div className="row-sub">{window.BP.billCategories.find(c => c.id === cat).label}</div></div>
          <button className="chip" onClick={() => setBiller(null)}>Change</button>
        </div>
        <label className="field" style={{ marginBottom: 10 }}><Icon name="hash" size={16} style={{ color: 'var(--slate)' }} /><input value={acct} onChange={e => setAcct(e.target.value.replace(/\D/g, '').slice(0, 13))} placeholder={b.field} aria-label={b.field} inputMode="numeric" /></label>
        {acct.length >= 10 && <div className="label" style={{ marginBottom: 10, color: 'var(--pos)' }}>✓ Verified: {window.BP.user.first.toUpperCase()} {window.BP.user.last.toUpperCase()} (demo lookup)</div>}
        <div style={{ textAlign: 'center', margin: '10px 0' }}><Amount value={amt} code="NGN" size={36} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>{[2000, 5000, 15000, 30000].map(v => <button key={v} className="chip press" style={{ justifyContent: 'center', height: 36, background: amt === v ? 'var(--navy-900)' : 'var(--glass-strong)', color: amt === v ? '#fff' : 'var(--navy-800)' }} onClick={() => setAmt(v)}>{compact(v)}</button>)}</div>
        <div className="row" style={{ justifyContent: 'space-between', padding: '14px 2px 4px' }}><span className="label" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="info" size={13} />Bill reminder three days early</span><Toggle on={remind} onChange={setRemind} label="Bill reminder" /></div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 10 }} disabled={acct.length < 10} onClick={() => { api.tx({ id: 'TX' + Date.now(), ref: '#BNP-' + String(Date.now()).slice(-6), name: b.name, kind: 'merchant', icon: window.BP.billCategories.find(c => c.id === cat).icon, cat: 'Bills', amount: -amt, date: window.BP.now.toISOString(), status: 'completed', method: 'Wallet balance', fee: 0 }); setDone(true); }}>Pay {fmtMoney(amt)}</button>
      </>)}
    </GlassCard>
  );
  return (
    <div>
      <ScreenHeader title="Pay Bills" />
      <div className="scroll-x" style={{ display: 'flex', gap: 10, paddingBottom: 6 }}>
        {window.BP.billCategories.map(c => {
          const on = c.id === cat;
          return <button key={c.id} className="press" onClick={() => { setCat(c.id); reset(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 'none', width: 72 }}>
            <span style={{ width: 54, height: 54, borderRadius: 99, display: 'grid', placeItems: 'center', background: on ? 'var(--navy-900)' : 'var(--glass-strong)', color: on ? '#fff' : 'var(--navy-900)', border: '1px solid var(--glass-border)', boxShadow: on ? '0 8px 18px rgba(38,56,106,.28)' : 'var(--shadow-1)', transition: 'background .25s, color .25s' }}><Icon name={c.icon} size={20} /></span>
            <span style={{ fontSize: 12, color: on ? 'var(--ink)' : 'var(--slate)' }}>{c.label}</span>
          </button>;
        })}
      </div>
      <div style={{ display: mobile ? 'block' : 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 18, marginTop: 14, alignItems: 'start' }}>
        {(!mobile || !b) && <div>
          <div className="label" style={{ marginBottom: 10 }}>Providers</div>
          <GlassCard pad={8}>{billers.map(x => <button key={x.id} className="row" onClick={() => setBiller(x.id)} style={x.id === biller ? { background: 'var(--glass-strong)', boxShadow: 'var(--shadow-1)' } : null}><span style={{ width: 38, height: 38, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)', fontSize: 13, fontWeight: 500 }}>{x.name[0]}</span><div style={{ flex: 1 }}><div className="row-title">{x.name}</div><div className="row-sub">{x.field}</div></div><Icon name="chevRight" size={16} style={{ color: 'var(--slate)' }} /></button>)}</GlassCard>
          <Section title="Upcoming"><UpcomingList n={3} /></Section>
        </div>}
        <div>{form || (!mobile && <GlassCard pad={30} style={{ textAlign: 'center' }}><Icon name="bills" size={28} style={{ color: 'var(--mist)' }} /><div style={{ marginTop: 10 }}>Choose a provider</div><div className="label" style={{ marginTop: 4 }}>Saved billers appear here for one-tap payments.</div></GlassCard>)}</div>
      </div>
    </div>
  );
}

/* ---------------- QR ---------------- */
function FakeQR({ size = 200, seed = 3 }) {
  const n = 25; const cells = [];
  let x = seed * 9301 + 49297;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x = (x * 9301 + 49297) % 233280; const finder = (i < 7 && j < 7) || (i < 7 && j > n - 8) || (i > n - 8 && j < 7); if (!finder && x / 233280 > .52) cells.push([i, j]); }
  const F = ({ x, y }) => <g><rect x={x} y={y} width="7" height="7" rx="1.6" fill="var(--navy-900)" /><rect x={x + 1} y={y + 1} width="5" height="5" rx="1" fill="#fff" /><rect x={x + 2} y={y + 2} width="3" height="3" rx=".6" fill="var(--navy-900)" /></g>;
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} style={{ background: '#fff', borderRadius: 18 }}>
      {cells.map(([i, j]) => <rect key={i + '-' + j} x={j + .08} y={i + .08} width=".84" height=".84" rx=".25" fill="var(--navy-900)" />)}
      <F x={0} y={0} /><F x={n - 7} y={0} /><F x={0} y={n - 7} />
      <rect x={n / 2 - 2.5} y={n / 2 - 2.5} width="5" height="5" rx="2.5" fill="#fff" /><circle cx={n / 2} cy={n / 2} r="1.9" fill="var(--navy-900)" />
    </svg>
  );
}
function QRScreen() {
  const { s, api, layout } = useBP();
  const [tab, setTab] = useState('scan');
  const [cam, setCam] = useState('idle');
  const [found, setFound] = useState(false);
  const vid = useRef(null);
  const startCam = async () => {
    try { const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); if (vid.current) { vid.current.srcObject = st; vid.current.play(); } setCam('on'); setTimeout(() => setFound(true), 2600); }
    catch (e) { setCam('denied'); }
  };
  useEffect(() => () => { const st = vid.current?.srcObject; st && st.getTracks().forEach(t => t.stop()); }, []);
  return (
    <div style={{ maxWidth: layout === 'mobile' ? 'none' : 520 }}>
      <ScreenHeader title={tab === 'scan' ? 'QR Scan' : 'My Code'} />
      <Segmented full options={[{ value: 'scan', label: 'Scan to pay' }, { value: 'mine', label: 'My code' }]} value={tab} onChange={setTab} label="QR mode" size="lg" />
      <div key={tab} style={{ marginTop: 16, animation: 'rise .4s var(--ease) both' }}>
        {tab === 'scan' ? (
          <div>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(160deg,#405881,#1b2645)', display: 'grid', placeItems: 'center' }}>
              <video ref={vid} muted playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: cam === 'on' ? 1 : 0 }} />
              <div style={{ position: 'relative', width: '62%', aspectRatio: '1', borderRadius: 24, boxShadow: '0 0 0 2000px rgba(10,16,34,.35)' }}>
                {['0 0', '0 100%', '100% 0', '100% 100%'].map((p, i) => <span key={i} style={{ position: 'absolute', width: 34, height: 34, left: p.split(' ')[0] === '0' ? -2 : 'auto', right: p.split(' ')[0] !== '0' ? -2 : 'auto', top: p.split(' ')[1] === '0' ? -2 : 'auto', bottom: p.split(' ')[1] !== '0' ? -2 : 'auto', borderColor: '#fff', borderStyle: 'solid', borderWidth: `${p.split(' ')[1] === '0' ? 3 : 0}px ${p.split(' ')[0] !== '0' ? 3 : 0}px ${p.split(' ')[1] !== '0' ? 3 : 0}px ${p.split(' ')[0] === '0' ? 3 : 0}px`, borderRadius: 10 }} />)}
                {cam !== 'on' && <div style={{ position: 'absolute', inset: 12, display: 'grid', placeItems: 'center', opacity: .3 }}><FakeQR size={150} seed={8} /></div>}
                <span style={{ position: 'absolute', left: 8, right: 8, height: 2, background: 'linear-gradient(90deg,transparent,#8db4e3,transparent)', boxShadow: '0 0 12px #8db4e3', animation: 'scanLine 2.4s var(--ease) infinite' }} />
              </div>
              {cam === 'idle' && <button className="btn btn-ghost" style={{ position: 'absolute', bottom: 18 }} onClick={startCam}><Icon name="scan" size={16} />Enable camera</button>}
              {cam === 'denied' && <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, textAlign: 'center', color: '#fff', fontSize: 12 }}>Camera unavailable. <button style={{ textDecoration: 'underline' }} onClick={() => setFound(true)}>Use a demo code instead</button></div>}
            </div>
            {cam === 'idle' && <button className="btn" style={{ width: '100%', marginTop: 8, fontSize: 13, color: 'var(--slate)' }} onClick={() => setFound(true)}>Skip — simulate a scan</button>}
            {found && (
              <GlassCard pad={16} style={{ marginTop: 14, animation: 'popIn .4s var(--ease) both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name="cup" size={19} /></span>
                  <div style={{ flex: 1 }}><div className="row-title">Cafe Neo · Lekki</div><div className="row-sub">Coffee & Bakery</div></div>
                  <div style={{ textAlign: 'right' }}><div className="tnum" style={{ fontSize: 16 }}>₦4,800.00</div><div className="row-sub">#CAF-204815</div></div>
                </div>
                <div style={{ marginTop: 14 }}><SlideToSend label="Slide to pay ₦4,800" onDone={() => { api.tx({ id: 'TX' + Date.now(), ref: '#CAF-204815', name: 'Cafe Neo · Lekki', kind: 'merchant', icon: 'cup', cat: 'Food & Drink', amount: -4800, date: window.BP.now.toISOString(), status: 'completed', method: 'Wallet balance', fee: 0 }); api.toast('Paid Cafe Neo ₦4,800', 'check'); setFound(false); }} /></div>
              </GlassCard>
            )}
          </div>
        ) : (
          <GlassCard pad={24} style={{ textAlign: 'center' }}>
            <Avatar name={`${window.BP.user.first} ${window.BP.user.last}`} hue={25} size={52} />
            <div style={{ marginTop: 8 }}>{window.BP.user.first} {window.BP.user.last}</div>
            <div className="label">@amara.o · {window.BP.brand.name}</div>
            <div style={{ display: 'grid', placeItems: 'center', marginTop: 18 }}><div style={{ padding: 12, borderRadius: 24, background: '#fff', boxShadow: 'var(--shadow-1)' }}><FakeQR size={190} /></div></div>
            <div className="label" style={{ marginTop: 12 }}>Anyone can scan this to pay you</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={() => api.sheet('request', {})}><Icon name="link" size={15} />Payment link</button>
              <button className="btn btn-primary" onClick={() => { navigator.clipboard?.writeText(`https://${window.BP.brand.domain}/pay/amara.o`); api.toast('Link copied', 'share'); }}><Icon name="share" size={15} />Share</button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

/* ---------------- request / split link ---------------- */
function RequestSheet({ props, close }) {
  const { s, api } = useBP();
  const [amt, setAmt] = useState(props.split ? 36000 : 15000);
  const [people, setPeople] = useState(['r1', 'r2']);
  const [note, setNote] = useState(props.split ? 'Dinner at Terra Kulture' : '');
  const link = `${window.BP.brand.domain}/pay/amara.o?amt=${amt}`;
  return (
    <div>
      <div style={{ textAlign: 'center', margin: '4px 0 12px' }}><Amount value={amt} code="NGN" size={38} /></div>
      <input type="range" min={1000} max={200000} step={500} value={amt} onChange={e => setAmt(+e.target.value)} style={{ width: '100%', accentColor: 'var(--navy-800)' }} aria-label="Amount" />
      <label className="field" style={{ margin: '10px 0' }}><input value={note} onChange={e => setNote(e.target.value)} placeholder="What's it for?" aria-label="Note" /></label>
      {props.split && <>
        <div className="label" style={{ marginBottom: 8 }}>Split with · each pays <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{fmtMoney(amt / (people.length + 1))}</b></div>
        <div className="scroll-x" style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
          {s.recipients.map(r => { const on = people.includes(r.id); return <button key={r.id} onClick={() => setPeople(p => on ? p.filter(x => x !== r.id) : [...p, r.id])} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 'none', opacity: on ? 1 : .5, transition: 'opacity .2s' }}><span style={{ borderRadius: 99, padding: 2, boxShadow: on ? '0 0 0 2px var(--navy-800)' : 'none' }}><Avatar name={r.name} hue={r.hue} size={40} /></span><span style={{ fontSize: 11 }}>{r.nick}</span></button>; })}
        </div>
      </>}
      <div className="field" style={{ marginTop: 6 }}><Icon name="link" size={16} style={{ color: 'var(--slate)' }} /><span className="tnum" style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</span></div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={() => { navigator.clipboard?.writeText('https://' + link); api.toast(props.split ? `Split request sent to ${people.length}` : 'Payment link copied', 'link'); close(); }}>{props.split ? 'Send requests' : 'Copy link'}</button>
    </div>
  );
}

/* ---------------- notifications / recipients / profile / settings / support ---------------- */
function NotificationsScreen() {
  const { s, api } = useBP();
  return (
    <div style={{ maxWidth: 640 }}>
      <ScreenHeader title="Notifications" right={<button className="chip" onClick={api.readAll}>Mark all read</button>} />
      <GlassCard pad={8}>
        {s.notifications.map(n => (
          <div key={n.id} className="row" style={{ alignItems: 'flex-start' }}>
            <span style={{ width: 38, height: 38, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)', flex: 'none' }}><Icon name={n.icon} size={17} /></span>
            <div style={{ flex: 1 }}><div className="row-title">{n.title}</div><div className="row-sub">{n.body}</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}><span className="label">{n.time}</span>{n.unread && <span style={{ width: 7, height: 7, borderRadius: 9, background: 'var(--navy-800)' }} />}</div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
function RecipientsScreen() {
  const { s, api } = useBP();
  const [q, setQ] = useState('');
  const list = s.recipients.filter(r => (r.name + r.nick + r.bank).toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ maxWidth: 640 }}>
      <ScreenHeader title="Saved recipients" right={<button className="icon-btn" onClick={() => api.toast('Add recipient form (demo)', 'plus')} aria-label="Add recipient"><Icon name="plus" size={17} /></button>} />
      <div className="field" style={{ borderRadius: 999, height: 46, marginBottom: 12 }}><Icon name="search" size={16} style={{ color: 'var(--slate)' }} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, nickname or bank" aria-label="Search recipients" /></div>
      <GlassCard pad={8}>{list.map(r => <button key={r.id} className="row" onClick={() => api.nav('send', { rid: r.id })}><Avatar name={r.name} hue={r.hue} size={42} /><div style={{ flex: 1 }}><div className="row-title">{r.name} <span className="label">“{r.nick}”</span></div><div className="row-sub">{r.bank} · {r.acct}</div></div><span className="chip">Send</span></button>)}</GlassCard>
    </div>
  );
}
function ProfileScreen() {
  const { s, api, layout } = useBP();
  const u = window.BP.user;
  const items = [['user', 'Personal information', 'settings'], ['card', 'Payment sources', 'cards'], ['shield', 'Security', 'settings'], ['users', 'Saved recipients', 'recipients'], ['bell', 'Notifications', 'notifications'], ['chart', 'Earnings & analytics', 'analytics'], ['help', 'Support', 'support']];
  return (
    <div style={{ maxWidth: layout === 'mobile' ? 'none' : 620 }}>
      <ScreenHeader title="Profile" back={layout === 'mobile' && s.stack.length > 0} right={<button className="icon-btn" onClick={() => api.nav('settings')} aria-label="Settings"><Icon name="settings" size={17} /></button>} />
      <div style={{ textAlign: 'center' }}>
        <Avatar name={`${u.first} ${u.last}`} hue={25} size={84} ring />
        <div style={{ fontSize: 20, marginTop: 10, letterSpacing: '-0.02em' }}>{u.first} {u.last} <span style={{ color: 'var(--navy-800)', fontSize: 14 }}>✓</span></div>
        <div className="label">{u.email}</div>
      </div>
      <GlassCard pad={14} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}><div className="row-title">{u.tier}</div><div className="row-sub">Renews Nov 20 · demo plan</div></div>
        <div style={{ width: 90 }}><PayCard card={s.cards[0]} width={90} /></div>
      </GlassCard>
      <div className="label" style={{ margin: '20px 4px 8px' }}>Account settings</div>
      <GlassCard pad={6}>{items.map(([ic, l, to]) => <button key={l} className="row" onClick={() => api.nav(to)}><span style={{ width: 34, height: 34, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name={ic === 'users' ? 'user' : ic} size={16} /></span><span className="row-title" style={{ flex: 1 }}>{l}</span><Icon name="chevRight" size={16} style={{ color: 'var(--slate)' }} /></button>)}</GlassCard>
      <button className="btn" style={{ width: '100%', marginTop: 14, color: 'var(--neg)' }} onClick={() => api.toast('Signed out (demo)', 'logout')}><Icon name="logout" size={16} />Sign out</button>
    </div>
  );
}
function SettingsScreen() {
  const { s, api, layout } = useBP();
  const [sec, setSec] = useState('security');
  const [bio, setBio] = useState(true); const [twofa, setTwofa] = useState(true); const [lang, setLang] = useState('English');
  return (
    <div style={{ maxWidth: 680 }}>
      <ScreenHeader title="Settings" />
      <div className="scroll-x"><Segmented options={[{ value: 'security', label: 'Security' }, { value: 'limits', label: 'Limits' }, { value: 'devices', label: 'Devices' }, { value: 'prefs', label: 'Preferences' }]} value={sec} onChange={setSec} label="Settings section" /></div>
      <div key={sec} style={{ marginTop: 14, animation: 'rise .4s var(--ease) both' }}>
        {sec === 'security' && <GlassCard pad={6}>
          {[['Biometric sign-in (mock)', bio, setBio, 'fingerprint'], ['Two-factor authentication (mock)', twofa, setTwofa, 'shield']].map(([l, v, f, ic]) => <div key={l} className="row" style={{ justifyContent: 'space-between' }}><span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span style={{ width: 34, height: 34, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name={ic} size={16} /></span><span className="row-title">{l}</span></span><Toggle on={v} onChange={f} label={l} /></div>)}
          <button className="row" onClick={() => api.toast('PIN change flow (demo)', 'lock')}><span style={{ width: 34, height: 34, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name="lock" size={16} /></span><span className="row-title" style={{ flex: 1 }}>Change app PIN</span><Icon name="chevRight" size={16} /></button>
          <button className="row" onClick={() => { s.cards.forEach(c => api.card(c.id, { frozen: true })); api.toast('All cards frozen', 'snow'); }}><span style={{ width: 34, height: 34, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--neg-bg)', color: 'var(--neg)' }}><Icon name="snow" size={16} /></span><span className="row-title" style={{ flex: 1, color: 'var(--neg)' }}>Freeze all cards</span></button>
        </GlassCard>}
        {sec === 'limits' && <GlassCard pad={18}>{[['Daily transfer limit', window.BP.claims.dailyLimit.value], ['Single transfer', '₦1,000,000'], ['ATM withdrawal', '₦150,000 / day']].map(([k, v], i) => <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: i ? '1px dashed var(--line)' : 'none', fontSize: 14 }}><span>{k}</span><span className="tnum muted">{v}</span></div>)}<div className="label" style={{ marginTop: 8 }}>Limits are client to confirm and depend on KYC tier.</div></GlassCard>}
        {sec === 'devices' && <GlassCard pad={6}>{[['iPhone 15 · this device', 'Lagos, NG · Active now'], ['Chrome on macOS', 'Lagos, NG · 1 day ago'], ['Pixel 8', 'Abuja, NG · 12 days ago']].map(([d, m], i) => <div key={d} className="row"><span style={{ width: 34, height: 34, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name={i === 1 ? 'device' : 'phone'} size={16} /></span><div style={{ flex: 1 }}><div className="row-title">{d}</div><div className="row-sub">{m}</div></div>{i > 0 && <button className="chip" onClick={() => api.toast('Device removed', 'check')}>Remove</button>}</div>)}</GlassCard>}
        {sec === 'prefs' && <GlassCard pad={18} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span>Theme</span><Segmented light options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} value={s.theme} onChange={(v) => api.set({ theme: v })} label="Theme" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span>Display currency</span><Segmented light options={['NGN', 'USD']} value={s.cur === 'NGN' || s.cur === 'USD' ? s.cur : 'NGN'} onChange={(v) => api.set({ cur: v })} label="Currency" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><span>Language</span><Segmented light options={['English', 'Yorùbá', 'Hausa', 'Igbo']} value={lang} onChange={setLang} label="Language" /></div>
          <div className="label">Translations are placeholders until i18n strings are supplied.</div>
        </GlassCard>}
      </div>
    </div>
  );
}
function SupportScreen() {
  const [msgs, setMsgs] = useState([{ me: false, t: `Hi ${window.BP.user.first} 👋 I'm the ${window.BP.brand.name} demo assistant. How can I help?` }]);
  const [v, setV] = useState('');
  const [typing, setTyping] = useState(false);
  const end = useRef(null);
  useEffect(() => { end.current?.parentElement && (end.current.parentElement.scrollTop = 1e6); }, [msgs, typing]);
  const send = async (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { me: true, t: text }]); setV(''); setTyping(true);
    let reply = 'Thanks — a support agent will follow up shortly (demo).';
    try { if (window.genspark?.complete) reply = await window.genspark.complete(`You are a concise, friendly support agent for "${window.BP.brand.name}", a DEMO fintech payments app (no real money moves). Reply in under 50 words. User: ${text}`); } catch (e) {}
    setTyping(false); setMsgs(m => [...m, { me: false, t: reply }]);
  };
  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <ScreenHeader title="Support" sub="Demo chat" />
      <GlassCard pad={14} style={{ flex: 1, minHeight: 300, display: 'flex', flexDirection: 'column' }}>
        <div className="scroll-y" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420 }}>
          {msgs.map((m, i) => <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '10px 14px', borderRadius: 18, fontSize: 14, lineHeight: 1.45, background: m.me ? 'var(--navy-900)' : 'var(--white)', color: m.me ? '#fff' : 'var(--ink)', border: m.me ? 'none' : '1px solid var(--line)', animation: 'rise .3s var(--ease) both' }}>{m.t}</div>)}
          {typing && <div className="label" style={{ padding: 6 }}>typing…</div>}
          <span ref={end} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0' }}>{['How do I freeze my card?', 'Transfer is pending', 'Change my PIN'].map(q => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}</div>
        <form onSubmit={e => { e.preventDefault(); send(v); }} className="field" style={{ borderRadius: 999 }}><input value={v} onChange={e => setV(e.target.value)} placeholder="Type a message" aria-label="Message" /><button className="icon-btn navy" style={{ width: 34, height: 34 }} aria-label="Send"><Icon name="send" size={15} /></button></form>
      </GlassCard>
    </div>
  );
}

Object.assign(window, { CardsScreen, CardDetailScreen, RevealSheet, AddCardSheet, WalletScreen, AnalyticsScreen, AddFundsScreen, BillsScreen, QRScreen, FakeQR, RequestSheet, NotificationsScreen, RecipientsScreen, ProfileScreen, SettingsScreen, SupportScreen });
