/* Bless nd Pay — marketing home */

/* ---------- helpers ---------- */
function useInView(opts = { threshold: 0.2 }) {
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, opts);
    ref.current && io.observe(ref.current); return () => io.disconnect();
  }, []);
  return [ref, v];
}
function Reveal({ children, delay = 0, style, as = 'div' }) {
  const [ref, v] = useInView({ threshold: 0.12 });
  const Tag = as;
  return <Tag ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(24px)', filter: v ? 'none' : 'blur(6px)', transition: `opacity .9s ${delay}s var(--ease), transform .9s ${delay}s var(--ease), filter .9s ${delay}s var(--ease)`, ...style }}>{children}</Tag>;
}
function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => { const el = ref.current; if (!el) return; const r = el.getBoundingClientRect(); const total = r.height - innerHeight; setP(Math.min(1, Math.max(0, -r.top / (total || 1)))); };
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, []);
  return p;
}
function Eyebrow({ children, light }) {
  return <span className="chip" style={{ height: 30, padding: '0 14px', fontSize: 12, background: light ? 'rgba(255,255,255,.12)' : 'var(--white)', color: light ? '#fff' : 'var(--navy-800)', borderColor: light ? 'rgba(255,255,255,.2)' : 'var(--line)' }}>{children}</span>;
}
function H2({ children, style, light }) {
  return <h2 style={{ fontSize: 'clamp(34px, 4.6vw, 60px)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0, color: light ? '#fff' : 'var(--navy-700)', textWrap: 'balance', ...style }}>{children}</h2>;
}
function Acc({ children }) { return <span className="serif" style={{ color: 'var(--navy-900)', fontSize: '1.08em', letterSpacing: '-0.02em' }}>{children}</span>; }

/* cloud sky built from layered gradients (no photography) */
function Clouds({ dense = false, style }) {
  const puffs = useMemo(() => [
    [8, 72, 34, 16], [26, 80, 40, 18], [48, 76, 30, 14], [70, 82, 42, 20], [90, 74, 30, 16],
    [14, 30, 22, 9], [62, 22, 26, 10], [86, 38, 20, 8], [38, 46, 18, 7],
  ], []);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', ...style }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #a9cdf2 0%, #c6def6 38%, #e3effb 70%, #f6f9fd 100%)' }} />
      <div style={{ position: 'absolute', inset: '-10%', animation: 'drift 38s ease-in-out infinite alternate' }}>
        {puffs.slice(0, dense ? 9 : 7).map(([x, y, w, h], i) => (
          <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}vw`, height: `${h}vw`, transform: 'translate(-50%,-50%)' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,.55) 55%, rgba(255,255,255,0))', filter: 'blur(6px)' }} />
            <div style={{ position: 'absolute', left: '18%', top: '-22%', width: '52%', height: '90%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,.95), rgba(255,255,255,0))', filter: 'blur(4px)' }} />
            <div style={{ position: 'absolute', left: '46%', top: '-8%', width: '44%', height: '80%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,255,255,.9), rgba(255,255,255,0))', filter: 'blur(5px)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- nav ---------- */
function MNav() {
  const [sc, setSc] = useState(false);
  const [active, setActive] = useState('#top');
  const [open, setOpen] = useState(false);
  const items = window.BP.nav.marketing;
  const ref = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });
  useEffect(() => { const on = () => setSc(scrollY > 40); on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on); }, []);
  useEffect(() => {
    const ids = items.map(i => i.href.slice(1));
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive('#' + e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(id => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  useLayoutEffect(() => { const el = ref.current?.querySelector(`[data-h="${active}"]`); el && setPill({ left: el.offsetLeft, width: el.offsetWidth }); }, [active, sc]);
  const go = (e, href) => { e.preventDefault(); setOpen(false); const el = document.querySelector(href); el && window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); };
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'center', padding: sc ? '10px 16px' : '22px 16px', transition: 'padding .4s var(--ease)' }}>
      <div style={{ width: '100%', maxWidth: sc ? 1080 : 1320, display: 'flex', alignItems: 'center', gap: 16, padding: sc ? '8px 8px 8px 18px' : '0 4px', borderRadius: 999, background: sc ? 'rgba(255,255,255,.72)' : 'transparent', backdropFilter: sc ? 'blur(18px) saturate(1.4)' : 'none', WebkitBackdropFilter: sc ? 'blur(18px) saturate(1.4)' : 'none', boxShadow: sc ? 'var(--shadow-1)' : 'none', border: sc ? '1px solid rgba(255,255,255,.9)' : '1px solid transparent', transition: 'all .45s var(--ease)' }}>
        <a href="#top" onClick={e => go(e, '#top')} style={{ textDecoration: 'none' }}><Wordmark size={18} /></a>
        <nav className="m-desk" ref={ref} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', gap: 2, padding: 4, borderRadius: 999, background: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.8)' }}>
            <span style={{ position: 'absolute', top: 4, bottom: 4, left: pill.left, width: pill.width, borderRadius: 999, background: '#fff', boxShadow: 'var(--shadow-1)', transition: 'left .45s var(--ease), width .45s var(--ease)' }} />
            {items.map(i => <a key={i.href} data-h={i.href} href={i.href} onClick={e => go(e, i.href)} style={{ position: 'relative', padding: '8px 16px', fontSize: 13, color: active === i.href ? 'var(--navy-900)' : 'var(--navy-700)', textDecoration: 'none', borderRadius: 999, transition: 'color .3s' }}>{i.label}</a>)}
          </div>
        </nav>
        <span className="m-mob" style={{ flex: 1 }} />
        <a href={window.BP.nav.cta.href} className="btn btn-ghost m-desk" style={{ height: 42, textDecoration: 'none', background: '#fff' }}>{window.BP.nav.cta.label}</a>
        <button className="icon-btn m-mob" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}><Icon name={open ? 'close' : 'menu'} size={18} /></button>
      </div>
      {open && <div className="glass" style={{ position: 'absolute', top: 70, left: 16, right: 16, borderRadius: 24, padding: 10, background: 'rgba(255,255,255,.92)', animation: 'popIn .3s var(--ease)' }}>
        {items.map(i => <a key={i.href} href={i.href} onClick={e => go(e, i.href)} className="row" style={{ textDecoration: 'none', fontSize: 16 }}>{i.label}</a>)}
        <a href={window.BP.nav.cta.href} className="btn btn-primary" style={{ width: '100%', marginTop: 6, textDecoration: 'none' }}>{window.BP.nav.cta.label}</a>
      </div>}
    </header>
  );
}

/* ---------- 1. hero ---------- */
function FloatWidget({ children, style, delay = 0, depth = 1, mouse }) {
  return (
    <div style={{ position: 'absolute', zIndex: 3, transform: `translate(${mouse.x * 14 * depth}px, ${mouse.y * 10 * depth}px)`, transition: 'transform .8s var(--ease)', ...style }}>
      <div className="glass" style={{ borderRadius: 22, padding: 16, background: 'rgba(255,255,255,.82)', animation: `floatY ${6 + depth}s ${delay}s ease-in-out infinite, popIn .9s ${0.6 + delay}s var(--ease) both` }}>{children}</div>
    </div>
  );
}
function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [w, setW] = useState(innerWidth);
  useEffect(() => { const r = () => setW(innerWidth); addEventListener('resize', r); return () => removeEventListener('resize', r); }, []);
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); setMouse({ x: (e.clientX - r.left) / r.width - .5, y: (e.clientY - r.top) / r.height - .5 }); };
  const phoneW = w < 640 ? Math.min(310, w - 60) : 330;
  const small = w < 900;
  return (
    <section id="top" onMouseMove={onMove} style={{ position: 'relative', minHeight: small ? 'auto' : 980, padding: small ? '120px 20px 60px' : '150px 40px 80px', overflow: 'hidden' }}>
      <Clouds dense />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: small ? '1fr' : '1.2fr 1fr', gap: 30, alignItems: 'end' }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(48px, 7.4vw, 104px)', fontWeight: 300, letterSpacing: '-0.05em', lineHeight: .96, color: 'var(--navy-900)' }}>
          {['Smarter Banking', 'Everyday'].map((l, i) => (
            <span key={l} style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
              <span style={{ display: 'block', animation: `maskUp 1.1s ${0.1 + i * 0.12}s var(--ease) both` }}>{i === 1 ? <>Every<span className="serif" style={{ fontSize: '1.06em' }}>day</span></> : l}</span>
            </span>
          ))}
        </h1>
        <div style={{ justifySelf: small ? 'start' : 'end', maxWidth: 360, animation: 'rise 1s .5s var(--ease) both' }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: 'var(--navy-800)', textWrap: 'pretty' }}>One place to pay, send, track and control your money and cards — with clear numbers and no clutter.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
            <a href={window.BP.nav.cta.href} className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started</a>
            <a href="#features" onClick={e => { e.preventDefault(); const el = document.getElementById('features'); el && window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); }} className="btn btn-ghost" style={{ textDecoration: 'none', background: 'rgba(255,255,255,.7)' }}>See features</a>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2, display: 'grid', placeItems: 'center', marginTop: small ? 50 : 60 }}>
        <div style={{ position: 'relative', animation: 'phoneIn 1.2s .3s var(--ease) both' }}>
          <PhoneFrame width={phoneW} tilt={`perspective(1400px) rotateY(${mouse.x * 8}deg) rotateX(${-mouse.y * 6}deg)`}>
            <BPApp force="mobile" phone persistKey="bnp-hero-v1" />
          </PhoneFrame>
          <div style={{ position: 'absolute', left: '50%', bottom: -34, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }} className="label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 9, background: 'var(--pos)', boxShadow: '0 0 0 4px rgba(31,157,99,.18)' }} />Live demo — tap around</span>
          </div>
          {!small && <>
            <FloatWidget mouse={mouse} depth={1.4} delay={0} style={{ left: -300, top: 150, width: 250 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="label">Earning Activity</span><span className="label">This week ⌄</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 10 }}>
                <div><div className="tnum" style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-0.03em' }}>$7.3K</div><div style={{ fontSize: 11 }} className="pos">↗ +4.2%</div></div>
                <div style={{ flex: 1 }}><WeekBars data={[3, 5, 2, 7, 4, 2, 3]} labels={['S', 'M', 'T', 'W', 'T', 'F', 'S']} selected={3} height={38} compactBars showValue={false} /></div>
              </div>
            </FloatWidget>
            <FloatWidget mouse={mouse} depth={2} delay={.3} style={{ left: -250, top: 430, width: 230 }}>
              <div className="label">Transaction limit</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <span><span className="tnum" style={{ fontSize: 24, fontWeight: 300 }}>$15k</span> <span className="label">per day</span></span>
                <span style={{ display: 'flex' }}>{['Tunde', 'Kemi', 'Zee'].map((n, i) => <span key={n} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={n} hue={[210, 270, 190][i]} size={28} ring /></span>)}</span>
              </div>
            </FloatWidget>
            <FloatWidget mouse={mouse} depth={1.7} delay={.15} style={{ right: -320, top: 300, width: 270 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="label"><Icon name="wallet" size={13} /> Monthly Limit</span><span className="icon-btn navy" style={{ width: 28, height: 28 }}><Icon name="arrowUpRight" size={13} /></span></div>
              <div style={{ marginTop: 16 }}><Amount value={56750} code="USD" size={30} /></div>
              <div className="label" style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 8px' }}><span>Transaction limit</span><span className="tnum">$6,400 / $10,000</span></div>
              <HatchProgress pct={64} />
            </FloatWidget>
          </>}
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. finance made simple ---------- */
function FinanceSimple() {
  const [open, setOpen] = useState(0);
  const items = [
    ['See everything at a glance', 'Balances, cards, bills and recent activity on one calm home screen.'],
    ['Know where money goes', 'Spending sorted by category automatically, with weekly and monthly views.'],
    ['Stay ahead of bills', 'Saved billers and reminders three days early, so nothing slips.'],
    ['Grow with savings pots', 'Set goals, round up spare change and watch progress fill in.'],
  ];
  const [ref, v] = useInView();
  const n = useCountUp(56.75, 1400, v);
  return (
    <section id="features" style={{ padding: 'clamp(80px,10vw,140px) 20px', maxWidth: 1240, margin: '0 auto' }}>
      <div className="m-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(30px,6vw,90px)', alignItems: 'center' }}>
        <div>
          <Reveal><Eyebrow>Everyday finance</Eyebrow></Reveal>
          <Reveal delay={.05}><H2 style={{ marginTop: 18 }}>Finance made simple <Acc>for everyone.</Acc></H2></Reveal>
          <div style={{ marginTop: 34, borderTop: '1px solid var(--line)' }}>
            {items.map(([t, d], i) => (
              <div key={t} style={{ borderBottom: '1px solid var(--line)' }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', fontSize: 18, letterSpacing: '-0.02em', color: open === i ? 'var(--navy-900)' : 'var(--navy-700)', textAlign: 'left' }}>
                  <span style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}><span className="label tnum">0{i + 1}</span>{t}</span>
                  <span style={{ transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .35s var(--ease)' }}><Icon name="plus" size={18} /></span>
                </button>
                <div style={{ display: 'grid', gridTemplateRows: open === i ? '1fr' : '0fr', transition: 'grid-template-rows .45s var(--ease)' }}>
                  <div style={{ overflow: 'hidden' }}><p style={{ margin: '0 0 20px 34px', color: 'var(--slate)', lineHeight: 1.55, maxWidth: 420 }}>{d}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Reveal delay={.1}>
          <div ref={ref} style={{ position: 'relative', borderRadius: 36, overflow: 'hidden', padding: 'clamp(24px,4vw,44px)', minHeight: 520 }}>
            <Clouds />
            <div className="glass" style={{ position: 'relative', borderRadius: 28, padding: 24, maxWidth: 380, margin: '0 auto', background: 'rgba(255,255,255,.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Icon name="chevLeft" size={18} /><span style={{ fontSize: 17 }}>Earning</span><Icon name="settings" size={17} /></div>
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <div className="label">Total Profit</div>
                <div className="tnum" style={{ fontSize: 64, fontWeight: 300, letterSpacing: '-0.05em', marginTop: 4 }}>${Math.floor(n)}<span style={{ color: 'var(--pos)' }}>.{String(Math.round((n % 1) * 100)).padStart(2, '0')}</span><span className="pos" style={{ fontSize: 26 }}>↗</span></div>
                <div className="label">Total Spend $1,240 · Total Profit $56.75</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 24 }}>
                {[['Total Revenue', '$19,270.56', '+4.2%', true], ['Monthly Expense', '$7,142.81', '-2.1%', false]].map(([l, val, d, up]) => (
                  <div key={l} style={{ borderRadius: 18, padding: 14, background: 'rgba(255,255,255,.75)', border: '1px solid #fff' }}>
                    <div className="label" style={{ fontSize: 11 }}>{l}</div>
                    <div className="tnum" style={{ fontSize: 17, fontWeight: 300, marginTop: 10 }}>{val}</div>
                    <span className={'chip ' + (up ? 'chip-pos' : 'chip-neg')} style={{ height: 20, fontSize: 10, marginTop: 6 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 3. statement scroll reveal ---------- */
function Statement() {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  const words = 'Control your finances with secure payments, smart wallets, and effortless money management.'.split(' ');
  const accent = new Set(['Payments,', 'payments,', 'wallets,', 'management.']);
  return (
    <section ref={ref} style={{ height: '220vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', placeItems: 'center', padding: 20, overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', maxWidth: 1000 }}>
          <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 40px' }}>
            {[0, 1, 2].map(i => <span key={i} style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '1px solid rgba(141,180,227,.6)', animation: `ring 3s ${i}s ease-out infinite` }} />)}
            <span style={{ position: 'absolute', inset: 10, borderRadius: 999, background: 'radial-gradient(circle at 35% 30%, #fff, #b4d1f1 40%, #6f9be0 75%, #405881)', boxShadow: '0 20px 60px rgba(111,155,224,.5)', animation: 'pulseOrb 4s ease-in-out infinite' }} />
          </div>
          <p style={{ margin: 0, fontSize: 'clamp(30px, 4.4vw, 58px)', fontWeight: 300, letterSpacing: '-0.035em', lineHeight: 1.12, textWrap: 'balance' }}>
            {words.map((w, i) => {
              const on = p * 1.25 > i / words.length;
              return <span key={i} className={accent.has(w) ? 'serif' : ''} style={{ color: on ? 'var(--navy-900)' : '#c9d0dc', transition: 'color .35s', fontSize: accent.has(w) ? '1.06em' : undefined }}>{w} </span>;
            })}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. transfer widget ---------- */
function TransferDemo() {
  const R = window.BP.recipients;
  const [rid, setRid] = useState(0);
  const [amt, setAmt] = useState('250.00');
  const [cur, setCur] = useState('USD');
  const [card, setCard] = useState(0);
  const [sent, setSent] = useState(false);
  const v = parseFloat(amt) || 0;
  const eta = v === 0 ? '—' : v < 500 ? 'Instant' : v < 5000 ? 'Instant – 10 min' : 'Within 1 hour';
  const r = R[rid];
  const tiles = [['send', 'Instant Transfers', 'Most local transfers land in seconds.'], ['user', 'Saved Recipients', 'Nicknames and one-tap repeat payments.'], ['shield', 'Secure Transactions', 'PIN, biometrics and device checks on every send.'], ['sparkle', 'Low Transfer Fees', 'Fees shown up front before you confirm.']];
  return (
    <section style={{ padding: 'clamp(60px,8vw,120px) 20px', maxWidth: 1240, margin: '0 auto' }}>
      <div className="m-2col" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 'clamp(30px,5vw,70px)', alignItems: 'center' }}>
        <Reveal>
          <div style={{ position: 'relative', borderRadius: 36, overflow: 'hidden', padding: 'clamp(20px,3vw,34px)' }}>
            <Clouds />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ textAlign: 'center', marginBottom: 6 }}><div className="label">Get started</div><div style={{ fontSize: 22, letterSpacing: '-0.02em', marginTop: 4 }}>Your Money, Your Control</div></div>
              <div className="glass" style={{ borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.85)' }}>
                <Avatar name={r.name} hue={r.hue} size={42} />
                <div style={{ flex: 1 }}><div className="row-title">{r.name}</div><div className="row-sub">{r.bank} · {r.acct}</div></div>
                <button className="chip press" onClick={() => { setRid((rid + 1) % R.length); setSent(false); }}>Change</button>
              </div>
              <div className="glass" style={{ borderRadius: 20, padding: 16, background: 'rgba(255,255,255,.85)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span className="label">Enter Amount</span>
                  <select value={cur} onChange={e => setCur(e.target.value)} aria-label="Currency" className="chip" style={{ appearance: 'none', paddingRight: 12, background: '#fff' }}>{window.BP.currencies.map(c => <option key={c.code}>{c.code}</option>)}</select>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 10 }}>
                  <span style={{ fontSize: 42, fontWeight: 300, color: 'var(--slate-2)' }}>{curOf(cur).symbol}</span>
                  <input value={amt} onChange={e => { setAmt(e.target.value.replace(/[^\d.]/g, '')); setSent(false); }} aria-label="Amount" className="tnum" style={{ border: 0, outline: 0, background: 'transparent', fontSize: 42, fontWeight: 300, letterSpacing: '-0.04em', width: '100%', color: 'var(--ink)' }} />
                </div>
                <div style={{ height: 1, background: 'var(--line)', margin: '10px 0' }} />
                <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}><span><Icon name="clock" size={12} /> Estimated Delivery</span><span key={eta} style={{ color: 'var(--ink)', animation: 'rise .35s var(--ease)' }}>{eta}</span></div>
                {cur !== 'NGN' && v > 0 && <div className="label" style={{ marginTop: 6 }}>Recipient gets ≈ {fmtMoney(v * window.BP.rates[cur], 'NGN')}</div>}
              </div>
              <div className="glass" style={{ borderRadius: 20, padding: 14, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.85)' }}>
                <span style={{ width: 42, height: 42, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name="card" size={18} /></span>
                <div style={{ flex: 1 }}><div className="row-title">{window.BP.brand.name} Card</div><div className="row-sub">•••• {window.BP.cards[card].last4}</div></div>
                <button className="chip press" onClick={() => setCard((card + 1) % 2)}>Change</button>
              </div>
              <button className="btn btn-primary" disabled={!v} onClick={() => setSent(true)} style={{ marginTop: 4 }}>{sent ? <><Icon name="check" size={16} /> Sent (demo)</> : 'Continue'}</button>
            </div>
          </div>
        </Reveal>
        <div>
          <Reveal><Eyebrow>Transfers</Eyebrow></Reveal>
          <Reveal delay={.05}><H2 style={{ marginTop: 18 }}>Fast secure transfers <Acc>made simple today.</Acc></H2></Reveal>
          <Reveal delay={.1}><p style={{ color: 'var(--slate)', fontSize: 16, lineHeight: 1.6, maxWidth: 480, marginTop: 20 }}>Send to anyone with a bank account. Live rates, delivery estimates and fees are shown before you confirm. <span className="label">(Times and fees client to confirm.)</span></p></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 30 }}>
            {tiles.map(([ic, t, d], i) => (
              <Reveal key={t} delay={.1 + i * .06}>
                <div className="m-tile surface" style={{ borderRadius: 24, padding: 20, height: '100%' }}>
                  <span style={{ width: 42, height: 42, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-900)' }}><Icon name={ic} size={19} /></span>
                  <div style={{ fontSize: 17, marginTop: 16, letterSpacing: '-0.02em' }}>{t}</div>
                  <div className="label" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.5 }}>{d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. one dashboard tabs ---------- */
function DashboardTabs() {
  const tabs = [{ value: 'home', label: 'Manage' }, { value: 'send', label: 'Transfer' }, { value: 'addfunds', label: 'Add Fund' }, { value: 'bills', label: 'Pay Bills' }];
  const [tab, setTab] = useState('home');
  const [w, setW] = useState(innerWidth);
  useEffect(() => { const r = () => setW(innerWidth); addEventListener('resize', r); return () => removeEventListener('resize', r); }, []);
  const pw = w < 640 ? Math.min(290, w - 70) : 300;
  return (
    <section style={{ padding: 'clamp(60px,8vw,120px) 20px', background: 'linear-gradient(180deg, transparent, #eef3f9 30%, #eef3f9 70%, transparent)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="m-2col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, alignItems: 'end' }}>
          <Reveal><Eyebrow>Core banking</Eyebrow><H2 style={{ marginTop: 18 }}>One Dashboard, Every <Acc>Financial Move.</Acc></H2></Reveal>
          <Reveal delay={.1}><p style={{ color: 'var(--slate)', fontSize: 16, lineHeight: 1.6, margin: 0, maxWidth: 420, justifySelf: 'end' }}>From checking activity to sending money and adding funds, everything flows from one home screen — on your phone, tablet or laptop.</p></Reveal>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }} className="scroll-x"><Segmented size="lg" options={tabs} value={tab} onChange={setTab} label="Dashboard feature" /></div>
        <div style={{ display: 'grid', placeItems: 'center', marginTop: 40 }}>
          <div style={{ position: 'relative' }}>
            <PhoneFrame width={pw}>
              <div key={tab} style={{ position: 'absolute', inset: 0, animation: 'screenIn .6s var(--ease) both' }}>
                <BPApp force="mobile" phone persistKey={null} initialRoute={tab} />
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. pay send track ---------- */
function PaySendTrack() {
  const ref = useRef(null);
  const p = useScrollProgress(ref);
  const steps = [
    ['Pay', 'Tap your card or scan a QR at the counter. Receipts land instantly.', 'qr'],
    ['Send', 'Pick a saved recipient, type an amount, slide to send.', 'send'],
    ['Track', 'Every naira categorised. Budgets nudge you before you overspend.', 'chart'],
  ];
  const idx = Math.min(2, Math.floor(p * 3));
  const r = 120, c = 2 * Math.PI * r;
  return (
    <section ref={ref} style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', placeItems: 'center', padding: 20, overflow: 'hidden' }}>
        <div className="m-2col" style={{ maxWidth: 1100, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            {steps.map(([t], i) => (
              <div key={t} style={{ fontSize: 'clamp(60px, 10vw, 140px)', fontWeight: 300, letterSpacing: '-0.06em', lineHeight: .95, color: i === idx ? 'var(--navy-900)' : '#d3d9e3', transform: i === idx ? 'translateX(14px)' : 'none', transition: 'color .5s, transform .6s var(--ease)' }}>
                {i === 0 ? <span className="serif">{t}</span> : t}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <div style={{ position: 'relative', width: 280, height: 280 }}>
              <svg width="280" height="280" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="140" cy="140" r={r} fill="none" stroke="var(--line)" strokeWidth="2" />
                <circle cx="140" cy="140" r={r} fill="none" stroke="var(--navy-900)" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 40 }}>
                <div key={idx} style={{ animation: 'rise .5s var(--ease) both' }}>
                  <span style={{ width: 54, height: 54, borderRadius: 99, display: 'grid', placeItems: 'center', margin: '0 auto', background: 'var(--navy-900)', color: '#fff' }}><Icon name={steps[idx][2]} size={22} /></span>
                  <div className="label tnum" style={{ marginTop: 14 }}>0{idx + 1} / 03</div>
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--navy-800)', margin: '8px 0 0' }}>{steps[idx][1]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. cards ---------- */
function CardsSection() {
  const [m, setM] = useState({ x: 0, y: 0 });
  const [frozen, setFrozen] = useState(false);
  const [limit, setLimit] = useState(750000);
  const [virtual, setVirtual] = useState(false);
  const card = { ...window.BP.cards[virtual ? 1 : 0], frozen };
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); setM({ x: (e.clientX - r.left) / r.width - .5, y: (e.clientY - r.top) / r.height - .5 }); };
  return (
    <section id="cards" style={{ padding: 'clamp(60px,8vw,120px) 20px', maxWidth: 1240, margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center' }}><H2>{window.BP.brand.name} Simplifies <Acc>Card Management.</Acc></H2></Reveal>
      <Reveal delay={.05}><p style={{ textAlign: 'center', color: 'var(--slate)', fontSize: 16, lineHeight: 1.6, maxWidth: 520, margin: '20px auto 0' }}>Store, send, receive and spend. Manage your physical and virtual cards, all in one place.</p></Reveal>
      <div className="m-2col" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center', marginTop: 50 }}>
        <div onMouseMove={onMove} onMouseLeave={() => setM({ x: 0, y: 0 })} style={{ height: 460, display: 'grid', placeItems: 'center', perspective: 1200, position: 'relative' }}>
          <div style={{ position: 'absolute', width: '70%', height: 80, bottom: 50, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(64,88,129,.28), transparent)', filter: 'blur(10px)', transform: `translateX(${m.x * 30}px)` }} />
          <div style={{ transform: `rotateX(${48 - m.y * 18}deg) rotateZ(${-32 + m.x * 14}deg) rotateY(${m.x * 16}deg) translateY(-20px)`, transition: 'transform .6s var(--ease)', transformStyle: 'preserve-3d', animation: 'floatY 6s ease-in-out infinite' }}>
            <PayCard card={card} width={Math.min(400, innerWidth - 80)} />
          </div>
          <div className="glass m-desk" style={{ position: 'absolute', left: '6%', top: '18%', borderRadius: 16, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center', background: 'rgba(255,255,255,.85)' }}><Icon name="card" size={16} /><span style={{ fontSize: 12 }}>Keep track of every<br />payment.</span></div>
        </div>
        <div className="surface" style={{ borderRadius: 28, padding: 24 }}>
          <div style={{ fontSize: 18, letterSpacing: '-0.02em' }}>Try the controls</div>
          <div className="label" style={{ marginTop: 4 }}>Interactive demo</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="row" style={{ justifyContent: 'space-between', padding: '12px 0' }}><span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Icon name="snow" size={18} />Freeze card</span><Toggle on={frozen} onChange={setFrozen} label="Freeze card" /></div>
            <div className="row" style={{ justifyContent: 'space-between', padding: '12px 0', borderTop: '1px dashed var(--line)' }}><span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Icon name="globe" size={18} />Show virtual card</span><Toggle on={virtual} onChange={setVirtual} label="Virtual card" /></div>
            <div style={{ padding: '14px 0 4px', borderTop: '1px dashed var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Icon name="chart" size={18} />Daily limit</span><span className="tnum">{fmtMoney(limit, 'NGN', { dp: 0 })}</span></div>
              <input type="range" min={50000} max={2000000} step={50000} value={limit} onChange={e => setLimit(+e.target.value)} style={{ width: '100%', marginTop: 12, accentColor: 'var(--navy-800)' }} aria-label="Daily limit" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. pricing ---------- */
function Pricing() {
  const P = window.BP.pricing;
  const [annual, setAnnual] = useState(false);
  const [compare, setCompare] = useState(false);
  const allFeatures = [...new Set(P.plans.flatMap(p => p.features))];
  return (
    <section id="pricing" style={{ padding: 'clamp(60px,8vw,120px) 20px', background: 'linear-gradient(180deg, transparent, #eef3f9 25%, #eef3f9 75%, transparent)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <Reveal style={{ textAlign: 'center' }}><H2>Flexible Pricing Plans <Acc>Built for Everyone.</Acc></H2></Reveal>
        <Reveal delay={.05} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 28 }}>
          <Segmented size="lg" options={[{ value: 'm', label: 'Monthly' }, { value: 'a', label: 'Annual' }]} value={annual ? 'a' : 'm'} onChange={v => setAnnual(v === 'a')} label="Billing period" />
          <span className="chip chip-pos">Save {Math.round(P.annualDiscount * 100)}% annually</span>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 44, alignItems: 'stretch' }}>
          {P.plans.map((p, i) => {
            const price = annual ? p.price * (1 - P.annualDiscount) : p.price;
            const pop = p.popular;
            return (
              <Reveal key={p.id} delay={i * .08}>
                <div style={{ position: 'relative', height: '100%', borderRadius: 30, padding: pop ? 6 : 0, background: pop ? 'linear-gradient(180deg,#b4d1f1,#e3effb)' : 'transparent' }}>
                  {pop && <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--navy-900)', padding: '6px 0 8px' }}>Most Popular</div>}
                  <div className="surface m-tile" style={{ borderRadius: 26, padding: 26, height: pop ? 'calc(100% - 32px)' : '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 18 }}>{p.name}</span>{pop && annual && <span className="chip chip-pos">Best value</span>}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 18 }}>
                      <span key={price} className="tnum" style={{ fontSize: 48, fontWeight: 300, letterSpacing: '-0.04em', animation: 'rise .4s var(--ease)' }}>{P.currency}{price % 1 ? price.toFixed(2) : price}</span><span className="label">/ month</span>
                    </div>
                    <p className="label" style={{ fontSize: 13, lineHeight: 1.5, margin: '6px 0 20px' }}>{p.blurb}{annual && p.price > 0 ? ` Billed ${P.currency}${(price * 12).toFixed(0)} yearly.` : ''}</p>
                    <a href={window.BP.nav.cta.href} className={'btn ' + (pop ? 'btn-primary' : 'btn-ghost')} style={{ textDecoration: 'none' }}>Get Started</a>
                    <div className="label" style={{ margin: '22px 0 10px' }}>Features</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {p.features.map(f => <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14 }}><span style={{ width: 20, height: 20, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-900)', flex: 'none' }}><Icon name="check" size={12} stroke={2} /></span>{f}</li>)}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 26 }}><button className="btn btn-ghost" onClick={() => setCompare(!compare)} aria-expanded={compare}>{compare ? 'Hide' : 'Compare all'} features <Icon name="chevDown" size={15} style={{ transform: compare ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }} /></button></div>
        <div style={{ display: 'grid', gridTemplateRows: compare ? '1fr' : '0fr', transition: 'grid-template-rows .5s var(--ease)' }}>
          <div style={{ overflow: 'hidden' }}>
            <div className="surface scroll-x" style={{ borderRadius: 24, padding: 10, marginTop: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 520 }}>
                <thead><tr><th style={{ textAlign: 'left', padding: 14, fontWeight: 400 }} className="label">Feature</th>{P.plans.map(p => <th key={p.id} style={{ padding: 14, fontWeight: 400 }}>{p.name}</th>)}</tr></thead>
                <tbody>{allFeatures.map(f => <tr key={f} style={{ borderTop: '1px solid var(--line-2)' }}><td style={{ padding: 14 }}>{f}</td>{P.plans.map(p => <td key={p.id} style={{ textAlign: 'center', padding: 14, color: p.features.includes(f) ? 'var(--navy-900)' : 'var(--mist)' }}>{p.features.includes(f) ? <Icon name="check" size={16} stroke={2} /> : '—'}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
        <p className="label" style={{ textAlign: 'center', marginTop: 18 }}>Prices are placeholders — client to confirm.</p>
      </div>
    </section>
  );
}

/* ---------- 9. testimonials ---------- */
function Testimonials() {
  const T = window.BP.testimonials;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef(null);
  useEffect(() => { if (paused) return; const t = setInterval(() => setI(x => (x + 1) % T.length), 5000); return () => clearInterval(t); }, [paused]);
  return (
    <section style={{ padding: 'clamp(60px,8vw,120px) 20px', maxWidth: 1240, margin: '0 auto' }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="m-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'end' }}>
        <Reveal><H2>Trusted by smart investors <Acc>and everyday savers.</Acc></H2></Reveal>
        <div style={{ display: 'flex', gap: 10, justifySelf: 'end' }}>
          <button className="icon-btn" style={{ width: 48, height: 48 }} onClick={() => setI((i - 1 + T.length) % T.length)} aria-label="Previous"><Icon name="arrowLeft" size={18} /></button>
          <button className="icon-btn navy" style={{ width: 48, height: 48 }} onClick={() => setI((i + 1) % T.length)} aria-label="Next"><Icon name="arrowRight" size={18} /></button>
        </div>
      </div>
      <div style={{ overflow: 'hidden', marginTop: 40 }}
        onPointerDown={e => { drag.current = e.clientX; }} onPointerUp={e => { if (drag.current == null) return; const d = e.clientX - drag.current; if (Math.abs(d) > 50) setI(x => (x + (d < 0 ? 1 : -1) + T.length) % T.length); drag.current = null; }}>
        <div style={{ display: 'flex', gap: 16, transform: `translateX(calc(${-i} * (min(440px, 86vw) + 16px)))`, transition: 'transform .7s var(--ease)', cursor: 'grab', userSelect: 'none' }}>
          {[...T, ...T].map((t, k) => (
            <div key={k} className="surface" style={{ flex: 'none', width: 'min(440px, 86vw)', borderRadius: 28, padding: 28, opacity: k === i ? 1 : .55, transition: 'opacity .5s', position: 'relative' }}>
              <span className="serif" style={{ position: 'absolute', right: 24, top: 6, fontSize: 110, color: 'var(--line)', lineHeight: 1 }}>”</span>
              <p style={{ fontSize: 20, lineHeight: 1.45, letterSpacing: '-0.015em', margin: '20px 0 0', position: 'relative', textWrap: 'pretty' }}>“{t.quote}”</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28 }}>
                <span style={{ width: 44, height: 44, borderRadius: 99, background: 'repeating-linear-gradient(45deg, var(--line-2) 0 6px, var(--line) 6px 12px)', display: 'grid', placeItems: 'center', fontSize: 9, color: 'var(--slate)' }}>photo</span>
                <div><div style={{ fontSize: 14 }}>{t.name}</div><div className="label">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="label" style={{ marginTop: 18 }}>Testimonials are placeholders — publish only verified quotes supplied by the client.</p>
    </section>
  );
}

/* ---------- 10. CTA ---------- */
function CTA() {
  return (
    <section style={{ padding: '0 20px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ position: 'relative', borderRadius: 40, overflow: 'hidden', padding: 'clamp(50px,7vw,90px) clamp(24px,5vw,70px)', minHeight: 520 }}>
        <Clouds dense />
        <div className="m-2col" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <H2 style={{ color: 'var(--navy-900)' }}>Take full control of your <Acc>financial future.</Acc></H2>
            <p style={{ color: 'var(--navy-800)', fontSize: 16, lineHeight: 1.6, maxWidth: 420, marginTop: 20 }}>Open the live demo in your browser — it works on phone, tablet and desktop.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
              <a href={window.BP.nav.cta.href} className="btn btn-primary" style={{ textDecoration: 'none' }}>Open the web app</a>
              {window.BP.brand.storeBadgesPublished
                ? <a className="btn btn-ghost">App Store</a>
                : <span className="chip" style={{ height: 48, padding: '0 18px', background: 'rgba(255,255,255,.7)' }}>Mobile apps coming soon</span>}
            </div>
          </div>
          <div className="m-desk" style={{ display: 'grid', placeItems: 'center' }}>
            <div style={{ transform: 'rotate(-6deg)' }}>
              <PayCard card={window.BP.cards[0]} width={340} style={{ boxShadow: '0 40px 70px -20px rgba(38,56,106,.5)' }} />
            </div>
            <div className="glass" style={{ marginTop: -40, marginLeft: 120, borderRadius: 22, padding: 16, width: 250, background: 'rgba(255,255,255,.88)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 36, height: 36, borderRadius: 99, display: 'grid', placeItems: 'center', background: 'var(--sky-1)', color: 'var(--navy-800)' }}><Icon name="cup" size={16} /></span><div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>Cafe Neo</div><div className="label" style={{ fontSize: 11 }}>Coffee & Bakery</div></div><div style={{ textAlign: 'right' }}><div className="tnum" style={{ fontSize: 14 }}>₦4,800</div><div className="label" style={{ fontSize: 10 }}>#CAF-204815</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 11. FAQ + footer ---------- */
function FAQ() {
  const F = window.BP.faq;
  const cats = Object.keys(F);
  const [cat, setCat] = useState(cats[0]);
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" style={{ padding: 'clamp(80px,10vw,140px) 20px', maxWidth: 920, margin: '0 auto' }}>
      <Reveal style={{ textAlign: 'center' }}><Eyebrow>FAQ</Eyebrow><H2 style={{ marginTop: 18 }}>Questions, <Acc>answered.</Acc></H2></Reveal>
      <div className="scroll-x" style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}><Segmented options={cats} value={cat} onChange={(c) => { setCat(c); setOpen(0); }} label="FAQ category" /></div>
      <div key={cat} style={{ marginTop: 26, animation: 'rise .45s var(--ease) both' }}>
        {F[cat].map(([q, a], i) => (
          <div key={q} className="surface" style={{ borderRadius: 20, marginBottom: 10, overflow: 'hidden' }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '20px 22px', fontSize: 16, textAlign: 'left' }}>
              {q}<span style={{ width: 30, height: 30, borderRadius: 99, flex: 'none', display: 'grid', placeItems: 'center', background: open === i ? 'var(--navy-900)' : 'var(--sky-1)', color: open === i ? '#fff' : 'var(--navy-900)', transform: open === i ? 'rotate(45deg)' : 'none', transition: 'all .35s var(--ease)' }}><Icon name="plus" size={15} /></span>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: open === i ? '1fr' : '0fr', transition: 'grid-template-rows .4s var(--ease)' }}>
              <div style={{ overflow: 'hidden' }}><p style={{ margin: 0, padding: '0 22px 20px', color: 'var(--slate)', lineHeight: 1.6, fontSize: 15 }}>{a}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function Footer() {
  const B = window.BP.brand;
  const [email, setEmail] = useState(''); const [ok, setOk] = useState(false);
  return (
    <footer style={{ background: 'var(--navy-900)', color: '#fff', padding: 'clamp(50px,7vw,90px) 20px 30px', marginTop: 60, borderRadius: '40px 40px 0 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="m-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 50 }}>
          <div>
            <Wordmark size={22} dark />
            <p style={{ color: 'rgba(255,255,255,.65)', lineHeight: 1.6, maxWidth: 340, marginTop: 18 }}>{B.tagline}</p>
            <form onSubmit={e => { e.preventDefault(); if (/\S+@\S+\.\S+/.test(email)) setOk(true); }} style={{ display: 'flex', gap: 8, marginTop: 22, maxWidth: 380 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" aria-label="Email for newsletter" style={{ flex: 1, height: 46, borderRadius: 999, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.08)', padding: '0 18px', color: '#fff', outline: 0 }} />
              <button className="btn" style={{ background: '#fff', color: 'var(--navy-900)', height: 46 }}>{ok ? 'Subscribed ✓' : 'Subscribe'}</button>
            </form>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 24 }}>
            {window.BP.nav.footer.map(col => (
              <div key={col.title}><div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 14 }}>{col.title}</div>
                {col.items.map(it => <a key={it} href="#" onClick={e => e.preventDefault()} style={{ display: 'block', color: 'rgba(255,255,255,.88)', textDecoration: 'none', fontSize: 14, padding: '5px 0' }}>{it}</a>)}</div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 60, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.12)', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}>
          <span>© 2026 {B.name}. Software demo — {B.name} does not hold or move real money. {B.partnerLine}</span>
          <span style={{ display: 'flex', gap: 18 }}>{['X', 'LinkedIn', 'Instagram'].map(s => <a key={s} href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>{s}</a>)}</span>
        </div>
      </div>
    </footer>
  );
}

function Marketing() {
  return (
    <>
      <MNav />
      <main>
        <Hero />
        <FinanceSimple />
        <Statement />
        <TransferDemo />
        <DashboardTabs />
        <PaySendTrack />
        <CardsSection />
        <Pricing />
        <Testimonials />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
Object.assign(window, { Marketing });
