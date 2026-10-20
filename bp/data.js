/* Bless nd Pay — config + demo seed data.  All data is DEMO. */
(function () {
  // ---------- config/brand ----------
  const brand = {
    name: 'Bless nd Pay',
    wordmark: ['bless', 'nd', 'pay'],          // middle part is set in the italic serif accent
    tagline: 'Every payment, blessed with clarity.',
    domain: 'blessndpay.com',
    email: 'hello@blessndpay.com',
    showDemoBadge: true,
    storeBadgesPublished: false,               // flip when the app is live in the stores
    partnerLine: 'Payments processed by licensed partners (client to name).',
  };

  // ---------- config/navigation ----------
  const nav = {
    marketing: [
      { label: 'Home', href: '#top' },
      { label: 'Features', href: '#features' },
      { label: 'Cards', href: '#cards' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
    cta: { label: 'Open the app', href: 'Bless nd Pay App.html' },
    footer: [
      { title: 'Product', items: ['Features', 'Cards', 'Transfers', 'Pricing', 'Security', 'Business'] },
      { title: 'Company', items: ['About', 'Blog', 'Careers', 'Contact'] },
      { title: 'Resources', items: ['FAQ', 'Download', 'Status', 'Help centre'] },
      { title: 'Legal', items: ['Terms', 'Privacy', 'Cookies', 'Disclosures'] },
    ],
    // app navigation — tabs = mobile bottom bar, rail = tablet, sidebar = desktop
    app: [
      { id: 'home', label: 'Home', icon: 'home', tabs: true, rail: true, side: true },
      { id: 'wallet', label: 'Wallet', icon: 'wallet', tabs: true, rail: true, side: true },
      { id: 'transactions', label: 'Transactions', icon: 'list', rail: true, side: true },
      { id: 'send', label: 'Send', icon: 'send', rail: true, side: true },
      { id: 'cards', label: 'Cards', icon: 'card', tabs: true, rail: true, side: true },
      { id: 'bills', label: 'Pay bills', icon: 'bolt', side: true },
      { id: 'analytics', label: 'Analytics', icon: 'chart', rail: true, side: true },
      { id: 'profile', label: 'Profile', icon: 'user', tabs: true, rail: true, side: true },
    ],
    quickActions: [
      { id: 'send', label: 'Send', icon: 'send' },
      { id: 'addfunds', label: 'Add Funds', icon: 'plus' },
      { id: 'bills', label: 'Pay Bills', icon: 'bills' },
      { id: 'qr', label: 'QR', icon: 'qr' },
    ],
  };

  // ---------- money ----------
  // amounts are stored in NGN; USD view converts with rates.USD
  const rates = { NGN: 1, USD: 1540.25, EUR: 1676.4, GBP: 1991.1 };
  const currencies = [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: 'ng' },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'us' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: 'eu' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: 'gb' },
  ];

  const user = { first: 'Amara', last: 'Okonkwo', email: 'amara@demo.blessndpay.com', phone: '+234 803 ••• 4125', tier: 'Pro (demo)' };

  const wallets = { NGN: 2184320.5, USD: 1240.0, EUR: 380.25, GBP: 155.8 };

  const cards = [
    { id: 'c1', label: 'Everyday', type: 'Physical', last4: '4125', number: '5399 2810 7731 4125', exp: '09/29', cvv: '317', tone: 'sky', frozen: false, limit: 750000, spent: 412300 },
    { id: 'c2', label: 'Online', type: 'Virtual', last4: '8842', number: '4187 6620 0193 8842', exp: '03/28', cvv: '904', tone: 'navy', frozen: false, limit: 200000, spent: 61800 },
    { id: 'c3', label: 'Studio Ltd', type: 'Business', last4: '0716', number: '5061 3305 2290 0716', exp: '11/30', cvv: '552', tone: 'ink', frozen: true, limit: 2500000, spent: 980000 },
  ];

  const recipients = [
    { id: 'r1', name: 'Courtney Henry', nick: 'Courtney', bank: 'GTBank', acct: '0122 •••• 6012', hue: 18 },
    { id: 'r2', name: 'Tunde Bakare', nick: 'Tunde', bank: 'Access Bank', acct: '0691 •••• 2283', hue: 210 },
    { id: 'r3', name: 'Chioma Eze', nick: 'Mum', bank: 'Zenith Bank', acct: '2087 •••• 5531', hue: 330 },
    { id: 'r4', name: 'Ibrahim Musa', nick: 'Ibrahim', bank: 'UBA', acct: '1024 •••• 7710', hue: 150 },
    { id: 'r5', name: 'Kemi Adeyemi', nick: 'Kemi', bank: 'Kuda', acct: '2001 •••• 4419', hue: 270 },
    { id: 'r6', name: 'Emeka Nwosu', nick: 'Landlord', bank: 'First Bank', acct: '3051 •••• 0098', hue: 40 },
    { id: 'r7', name: 'Zainab Bello', nick: 'Zee', bank: 'Opay', acct: '8130 •••• 6634', hue: 190 },
    { id: 'r8', name: 'Femi Ogunleye', nick: 'Femi', bank: 'Moniepoint', acct: '6004 •••• 1127', hue: 100 },
  ];

  // ---------- transactions (deterministic generator) ----------
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const merchants = [
    { name: 'Cafe Neo', cat: 'Food & Drink', min: 2500, max: 9000, icon: 'cup' },
    { name: 'Shoprite', cat: 'Groceries', min: 8000, max: 62000, icon: 'bag' },
    { name: 'Bolt', cat: 'Transport', min: 1800, max: 9500, icon: 'car' },
    { name: 'Uber', cat: 'Transport', min: 2200, max: 11000, icon: 'car' },
    { name: 'Netflix', cat: 'Entertainment', min: 4400, max: 7000, icon: 'tv' },
    { name: 'Spotify', cat: 'Entertainment', min: 1300, max: 1900, icon: 'music' },
    { name: 'Jumia', cat: 'Shopping', min: 9000, max: 85000, icon: 'bag' },
    { name: 'Chicken Republic', cat: 'Food & Drink', min: 3000, max: 12000, icon: 'cup' },
    { name: 'MTN Airtime', cat: 'Bills', min: 1000, max: 5000, icon: 'phone' },
    { name: 'Ikeja Electric', cat: 'Bills', min: 15000, max: 45000, icon: 'bolt' },
    { name: 'Spectranet', cat: 'Bills', min: 18000, max: 25000, icon: 'wifi' },
  ];
  const statuses = ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'pending', 'completed', 'failed', 'completed'];
  const now = new Date('2026-10-20T17:32:00');
  const txns = [];
  for (let i = 0; i < 40; i++) {
    const hoursAgo = Math.floor(i * 13 + rnd() * 11);
    const d = new Date(now.getTime() - hoursAgo * 3600e3);
    const r = rnd();
    let t;
    if (r < 0.28) {
      const p = recipients[Math.floor(rnd() * recipients.length)];
      const incoming = rnd() < 0.5;
      t = { name: p.name, rid: p.id, kind: 'person', cat: incoming ? 'Transfer in' : 'Transfer out', amount: Math.round((incoming ? 1 : -1) * (5000 + rnd() * 120000)), hue: p.hue };
    } else if (r < 0.36) {
      t = { name: 'Salary · Kora Studio', kind: 'income', cat: 'Income', amount: Math.round(380000 + rnd() * 90000), icon: 'briefcase' };
      if (txns.some(x => x.kind === 'income')) t = { name: 'Refund · Jumia', kind: 'merchant', cat: 'Refund', amount: Math.round(4000 + rnd() * 20000), icon: 'refresh' };
    } else {
      const m = merchants[Math.floor(rnd() * merchants.length)];
      t = { name: m.name, kind: 'merchant', cat: m.cat, amount: -Math.round(m.min + rnd() * (m.max - m.min)), icon: m.icon };
    }
    t.id = 'TX' + (204815 - i * 37);
    t.ref = '#BNP-' + (204815 - i * 37);
    t.date = d.toISOString();
    t.status = i < 2 ? 'completed' : statuses[Math.floor(rnd() * statuses.length)];
    t.method = rnd() < 0.6 ? 'Everyday •• 4125' : 'Wallet balance';
    t.fee = 0;
    txns.push(t);
  }

  const billCategories = [
    { id: 'electricity', label: 'Electricity', icon: 'bolt' },
    { id: 'airtime', label: 'Airtime', icon: 'phone' },
    { id: 'internet', label: 'Internet', icon: 'wifi' },
    { id: 'tv', label: 'TV', icon: 'tv' },
    { id: 'water', label: 'Water', icon: 'drop' },
  ];
  const billers = [
    { id: 'b1', cat: 'electricity', name: 'Ikeja Electric', field: 'Meter number' },
    { id: 'b2', cat: 'electricity', name: 'Eko Electric', field: 'Meter number' },
    { id: 'b3', cat: 'electricity', name: 'Abuja Electric (AEDC)', field: 'Meter number' },
    { id: 'b4', cat: 'airtime', name: 'MTN', field: 'Phone number' },
    { id: 'b5', cat: 'airtime', name: 'Airtel', field: 'Phone number' },
    { id: 'b6', cat: 'airtime', name: 'Glo', field: 'Phone number' },
    { id: 'b7', cat: 'internet', name: 'Spectranet', field: 'Customer ID' },
    { id: 'b8', cat: 'internet', name: 'Smile', field: 'Customer ID' },
    { id: 'b9', cat: 'tv', name: 'DStv', field: 'Smartcard number' },
    { id: 'b10', cat: 'tv', name: 'GOtv', field: 'IUC number' },
    { id: 'b11', cat: 'tv', name: 'StarTimes', field: 'Smartcard number' },
    { id: 'b12', cat: 'water', name: 'Lagos Water Corporation', field: 'Account number' },
  ];
  const upcoming = [
    { name: 'Electricity Bill', sub: 'Ikeja Electric · Prepaid', amount: 32000, due: 'Due tomorrow', icon: 'bolt' },
    { name: 'Internet Bill', sub: 'Spectranet · Monthly plan', amount: 22500, due: 'Due in 3 days', icon: 'wifi' },
    { name: 'TV Subscription', sub: 'DStv Compact', amount: 15700, due: 'Due in 5 days', icon: 'tv' },
    { name: 'Rent instalment', sub: 'Scheduled to Landlord', amount: 250000, due: 'Due in 10 days', icon: 'home' },
  ];

  const notifications = [
    { id: 'n1', title: 'You received ₦80,890.00', body: 'From Tunde Bakare · Transfer in', time: '2h', unread: true, icon: 'arrowDown' },
    { id: 'n2', title: 'Electricity bill due tomorrow', body: 'Ikeja Electric · ₦32,000.00', time: '5h', unread: true, icon: 'bolt' },
    { id: 'n3', title: 'New device signed in', body: 'Chrome on macOS · Lagos, NG', time: '1d', unread: false, icon: 'shield' },
    { id: 'n4', title: 'Card limit updated', body: 'Everyday •• 4125 → ₦750,000/day', time: '3d', unread: false, icon: 'card' },
  ];

  // ---------- content/pricing (client to confirm) ----------
  const pricing = {
    currency: '$', annualDiscount: 0.4, status: 'client to confirm',
    plans: [
      { id: 'basic', name: 'Basic', price: 0, blurb: 'For everyday personal spending.', features: ['1 virtual card', 'Local transfers', 'Bill payments', 'Spending insights'] },
      { id: 'pro', name: 'Pro', price: 12, popular: true, blurb: 'More cards, more control, multi-currency.', features: ['3 cards incl. physical', 'Multi-currency wallet', 'Savings pots & budgets', 'Scheduled transfers', 'Priority support'] },
      { id: 'business', name: 'Business', price: 29, blurb: 'For teams, freelancers and small shops.', features: ['Unlimited virtual cards', 'Team spend controls', 'Bulk payouts', 'Accounting export', 'Dedicated manager'] },
    ],
  };

  // ---------- content/claims ----------
  const claims = {
    deliveryTime: { value: 'Instant – 10 min', status: 'client to confirm' },
    transferFee: { value: 'No transfer fee on local transfers', status: 'client to confirm' },
    dailyLimit: { value: '₦5,000,000 per day', status: 'client to confirm' },
  };

  const faq = {
    'Getting started': [
      ['What is Bless nd Pay?', 'A single place to pay, send, track and control your money and cards. This build is a software demo — no real money moves.'],
      ['How do I open an account?', 'Sign up with your phone or email, verify your identity, and your wallet is ready. Identity checks are run by a licensed partner.'],
      ['Which countries are supported?', 'Launching first in Nigeria, with multi-currency wallets in USD, EUR and GBP. Final coverage is client to confirm.'],
      ['Is there a minimum balance?', 'No minimum balance on the Basic plan.'],
    ],
    Transfers: [
      ['How fast are transfers?', 'Most local transfers land instantly; some can take up to 10 minutes (client to confirm).'],
      ['Are there transfer fees?', 'Local transfers are free on all plans. International fees are shown before you confirm.'],
      ['Can I schedule a transfer?', 'Yes — set a one-off date or a recurring schedule from the Send screen.'],
      ['Can I cancel a transfer?', 'Pending transfers can be cancelled from the transaction detail until they complete.'],
      ['What is a payment link?', 'A shareable link anyone can use to pay you, with a set or open amount.'],
    ],
    Cards: [
      ['How do I freeze a card?', 'Open Cards, choose the card and tap Freeze. Unfreeze any time.'],
      ['Can I create virtual cards?', 'Yes, instantly from Cards → Add virtual card.'],
      ['How do spending limits work?', 'Set a daily limit per card. Payments above it are declined until you raise it.'],
      ['Is my card number visible?', 'Card details are hidden until you confirm with your PIN or biometrics.'],
    ],
    Security: [
      ['Is my money safe?', 'Funds are held by licensed banking partners. Bless nd Pay is the software layer (client to name partners).'],
      ['Do you support 2FA?', 'Yes — app PIN, biometrics and one-time codes for new devices.'],
      ['What if I lose my phone?', 'Sign in on the web, freeze your cards and remove the device under Security.'],
      ['Do you sell my data?', 'No. See the Privacy policy (draft, pending legal review).'],
    ],
    Billing: [
      ['Can I change plans?', 'Upgrade or downgrade any time; changes apply from the next billing date.'],
      ['Is there an annual discount?', 'Yes, paying annually is cheaper — see Pricing.'],
      ['How do I cancel?', 'From Profile → Plan. You keep access until the end of the period.'],
    ],
    Business: [
      ['Can my team have cards?', 'On the Business plan you can issue cards to team members with individual limits.'],
      ['Do you export to accounting tools?', 'CSV export is included; integrations are on the roadmap.'],
      ['Can I do bulk payouts?', 'Yes, upload a CSV of recipients and approve in one step.'],
      ['Do you offer invoicing?', 'Payment links cover simple invoicing today.'],
      ['Is there an API?', 'A partner API is planned (client to confirm).'],
    ],
  };

  const testimonials = [
    { quote: 'Paying rent, splitting dinner and topping up airtime all happen in the same three taps.', name: 'Placeholder name', role: 'Client to supply quote' },
    { quote: 'Seeing every card and every naira in one place finally made budgeting stick.', name: 'Placeholder name', role: 'Client to supply quote' },
    { quote: 'Freezing a card from my laptop while my phone was missing — that sold me.', name: 'Placeholder name', role: 'Client to supply quote' },
    { quote: 'Bulk payouts for my team used to take an afternoon. Now it is a CSV and a tap.', name: 'Placeholder name', role: 'Client to supply quote' },
  ];

  window.BP = { brand, nav, rates, currencies, user, wallets, cards, recipients, txns, billCategories, billers, upcoming, notifications, pricing, claims, faq, testimonials, now };
})();
