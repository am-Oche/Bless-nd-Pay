/* Bless nd Pay — App root: one store, three layouts */

const SCREENS = {
  home: HomeScreen, wallet: WalletScreen, cards: CardsScreen, cardDetail: CardDetailScreen,
  transactions: TransactionsScreen, txDetail: TxDetailScreen, send: SendScreen, addfunds: AddFundsScreen,
  bills: BillsScreen, qr: QRScreen, analytics: AnalyticsScreen, notifications: NotificationsScreen,
  recipients: RecipientsScreen, profile: ProfileScreen, settings: SettingsScreen, support: SupportScreen,
};
const SHEETS = {
  quick: { title: 'Quick actions', C: QuickSheet },
  confirm: { title: 'Confirm transfer', C: ConfirmSheet },
  pickRecipient: { title: 'Choose recipient', C: PickRecipientSheet },
  reveal: { title: 'Card details', C: RevealSheet },
  addCard: { title: 'New virtual card', C: AddCardSheet },
  request: { title: 'Request money', C: RequestSheet },
};

function StatusBar({ dark }) {
  return (
    <div style={{ height: 44, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px 0 30px', fontSize: 14, fontWeight: 600, color: 'var(--ink)', position: 'relative', zIndex: 5 }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" /><rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" /><rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" /></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x=".5" y=".5" width="21" height="10" rx="3" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="16" height="7" rx="1.6" fill="currentColor" /></svg>
      </span>
    </div>
  );
}

function BPApp({ force, persistKey = 'bnp-app-v1', phone = false, initialRoute, onLayout }) {
  const rootRef = useRef(null);
  const [s, api] = useBPStore(persistKey);
  const layout = useLayout(rootRef, force);
  useEffect(() => { if (initialRoute) api.nav(initialRoute, {}, true); }, [initialRoute]);
  useEffect(() => { onLayout && onLayout(layout); }, [layout]);
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current && (scrollRef.current.scrollTop = 0); }, [s.route.name, JSON.stringify(s.route.params)]);
  const ctx = useMemo(() => ({ s, api, layout }), [s, layout]);
  const Screen = SCREENS[s.route.name] || HomeScreen;
  const sheet = s.sheet && SHEETS[s.sheet.type];
  const routeKey = s.route.name + JSON.stringify(s.route.params);
  const showTabs = layout === 'mobile' && ['home', 'wallet', 'cards', 'profile', 'transactions', 'analytics'].includes(s.route.name);

  const sky = (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--app-bg)' }} />
      <div style={{ position: 'absolute', top: '-20%', left: layout === 'mobile' ? '20%' : '30%', width: '70%', height: '55%', borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(64,88,129,.32), transparent)', filter: 'blur(30px)' }} />
    </div>
  );

  return (
    <BPCtx.Provider value={ctx}>
      <div ref={rootRef} data-theme={s.theme} data-layout={layout}
        style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', color: 'var(--ink)', fontFamily: 'var(--sans)', display: 'flex', flexDirection: 'column' }}>
        {sky}
        {phone && <StatusBar />}
        <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex' }}>
          {layout === 'tablet' && <Rail />}
          {layout === 'desktop' && <Sidebar />}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            {layout === 'desktop' && <div style={{ padding: '0 28px' }}><TopBar /></div>}
            {layout === 'tablet' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 22px 4px 4px' }}>
                <div style={{ flex: 1 }} />
                <DemoBadge />
                <button className="icon-btn" onClick={() => api.set({ theme: s.theme === 'dark' ? 'light' : 'dark' })} aria-label="Toggle theme"><Icon name={s.theme === 'dark' ? 'sun' : 'moon'} size={17} /></button>
                <button className="icon-btn" onClick={() => api.nav('notifications')} aria-label="Notifications"><Icon name="bell" size={18} /></button>
                <button className="btn btn-primary btn-sm" onClick={() => api.sheet('quick')}><Icon name="plus" size={14} />New</button>
              </div>
            )}
            <div ref={scrollRef} className="scroll-y" style={{ flex: 1, minHeight: 0, padding: layout === 'mobile' ? `${phone ? 4 : 18}px 16px ${showTabs ? 100 : 28}px` : layout === 'tablet' ? '10px 22px 28px 4px' : '0 28px 28px' }}>
              {layout !== 'desktop' && layout !== 'tablet' && !phone && s.route.name === 'home' && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}><DemoBadge /></div>}
              <div key={routeKey} style={{ animation: 'rise .45s var(--ease) both', minHeight: '100%' }}>
                <Screen />
              </div>
            </div>
          </div>
        </div>
        {showTabs && <BottomTabs />}
        {sheet && <Sheet title={sheet.title} layout={layout} onClose={() => api.sheet(null)}>{(close) => <sheet.C props={s.sheet.props} close={close} />}</Sheet>}
        <Toast />
        {phone && <div style={{ position: 'absolute', bottom: 7, left: '50%', transform: 'translateX(-50%)', width: 128, height: 5, borderRadius: 9, background: 'var(--ink)', opacity: .85, zIndex: 90 }} />}
      </div>
    </BPCtx.Provider>
  );
}

/* live phone frame used in marketing hero */
function PhoneFrame({ width = 330, children, tilt }) {
  const h = width * 2.06;
  return (
    <div style={{ width, height: h, borderRadius: width * 0.16, padding: width * 0.032, background: 'linear-gradient(145deg,#2a2f3a,#0f1218 60%,#3a404d)', boxShadow: '0 0 0 1.5px #4b5260 inset, 0 40px 80px -20px rgba(20,32,70,.45), 0 18px 40px -18px rgba(20,32,70,.4)', position: 'relative', transform: tilt, transition: 'transform .5s var(--ease)' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: width * 0.13, overflow: 'hidden', position: 'relative', background: '#fff', isolation: 'isolate' }}>
        {children}
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: width * 0.3, height: 28, borderRadius: 20, background: '#000', zIndex: 100 }} />
      </div>
    </div>
  );
}

Object.assign(window, { BPApp, PhoneFrame, StatusBar, SCREENS });
