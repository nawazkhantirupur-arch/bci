// BCI EXPRESS - single-file backend for EdgeOne Pages (Edge Function)
// Route: /api/*   (file: edge-functions/api/[[default]].js)
// Needs: KV namespace bound with variable name  bci_kv
// Env vars (Project Settings > Environment Variables):
//   SESSION_SECRET (required), SETUP_KEY (required for first admin),
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET (wallet recharge),
//   DELHIVERY_TOKEN, DELHIVERY_CLIENT, DELHIVERY_PICKUP (optional: manifest/label/rate)

const DEFAULTS = {"zones":["N1","N2","E","NE","W1","W2","S1","S2","Central"],"zonedef":{"N1":"Delhi, UP, Haryana, Rajasthan","N2":"Chandigarh, Punjab, HP, Uttarakhand, J&K, Ladakh","E":"WB, Odisha, Bihar, Jharkhand","NE":"Assam, Meghalaya, Tripura, Arunachal Pradesh, Mizoram, Manipur, Nagaland, Sikkim","W1":"Gujarat, Daman & Diu, Dadra & Nagar Haveli","W2":"Maharashtra, Goa","S1":"AP, Telangana, Karnataka, Tamil Nadu, Puducherry","S2":"Kerala","Central":"Madhya Pradesh, Chhattisgarh"},"rates_std":{"N1":{"N1":8.47,"N2":8.47,"E":15.13,"NE":22.99,"W1":11.5,"W2":12.71,"S1":16.34,"S2":20.57,"Central":11.5},"N2":{"N1":8.47,"N2":8.47,"E":15.73,"NE":24.81,"W1":12.71,"W2":12.71,"S1":18.76,"S2":21.78,"Central":12.71},"E":{"N1":12.71,"N2":15.13,"E":8.47,"NE":13.92,"W1":12.71,"W2":15.13,"S1":12.71,"S2":16.34,"Central":11.5},"NE":{"N1":10.29,"N2":15.13,"E":10.89,"NE":8.47,"W1":13.31,"W2":15.13,"S1":15.13,"S2":20.57,"Central":12.71},"W1":{"N1":11.5,"N2":12.71,"E":18.76,"NE":29.04,"W1":8.47,"W2":8.47,"S1":13.92,"S2":16.94,"Central":11.5},"W2":{"N1":12.71,"N2":13.31,"E":16.34,"NE":26.02,"W1":8.47,"W2":8.47,"S1":11.5,"S2":15.13,"Central":11.5},"S1":{"N1":12.71,"N2":15.13,"E":15.13,"NE":22.39,"W1":12.71,"W2":12.71,"S1":8.47,"S2":11.5,"Central":11.5},"S2":{"N1":15.13,"N2":15.13,"E":15.13,"NE":27.83,"W1":12.71,"W2":12.71,"S1":8.47,"S2":8.47,"Central":11.5},"Central":{"N1":11.5,"N2":12.71,"E":15.13,"NE":22.39,"W1":8.47,"W2":11.5,"S1":13.31,"S2":16.34,"Central":8.47}},"b2b_zone":{"N1":{"N1":7,"N2":7,"E":12.5,"NE":19,"W1":9.5,"W2":10.5,"S1":13.5,"S2":17,"Central":9.5},"N2":{"N1":7,"N2":7,"E":13,"NE":20.5,"W1":10.5,"W2":10.5,"S1":15.5,"S2":18,"Central":10.5},"E":{"N1":10.5,"N2":12.5,"E":7,"NE":11.5,"W1":10.5,"W2":12.5,"S1":10.5,"S2":13.5,"Central":9.5},"NE":{"N1":8.5,"N2":12.5,"E":9,"NE":7,"W1":11,"W2":12.5,"S1":12.5,"S2":17,"Central":10.5},"W1":{"N1":9.5,"N2":10.5,"E":15.5,"NE":24,"W1":7,"W2":7,"S1":11.5,"S2":14,"Central":9.5},"W2":{"N1":10.5,"N2":11,"E":13.5,"NE":21.5,"W1":7,"W2":7,"S1":9.5,"S2":12.5,"Central":9.5},"S1":{"N1":10.5,"N2":12.5,"E":12.5,"NE":18.5,"W1":10.5,"W2":9.5,"S1":7,"S2":9.5,"Central":9.5},"S2":{"N1":12.5,"N2":12.5,"E":12.5,"NE":23,"W1":10.5,"W2":10.5,"S1":7,"S2":7,"Central":9.5},"Central":{"N1":9.5,"N2":10.5,"E":12.5,"NE":18.5,"W1":7,"W2":9.5,"S1":11,"S2":13.5,"Central":7}},"b2b_lanes":{"Ladakh":{"N1":57,"N2":57,"E":62.5,"NE":62.5,"W1":60.5,"W2":61,"S1":62.5,"S2":62.5,"Central":60.5},"Arunachal Pradesh":{"N1":34,"N2":35.5,"E":26.5,"NE":22,"W1":39,"W2":36.5,"S1":33.5,"S2":38,"Central":33.5},"Manipur":{"N1":34,"N2":35.5,"E":26.5,"NE":22,"W1":39,"W2":36.5,"S1":33.5,"S2":38,"Central":33.5},"Mizoram":{"N1":34,"N2":35.5,"E":26.5,"NE":22,"W1":39,"W2":36.5,"S1":33.5,"S2":38,"Central":33.5},"Tripura":{"N1":34,"N2":35.5,"E":26.5,"NE":22,"W1":39,"W2":36.5,"S1":33.5,"S2":38,"Central":33.5},"Meghalaya":{"N1":29,"N2":30.5,"E":21.5,"NE":17,"W1":34,"W2":31.5,"S1":28.5,"S2":33,"Central":28.5},"Nagaland":{"N1":29,"N2":30.5,"E":21.5,"NE":17,"W1":34,"W2":31.5,"S1":28.5,"S2":33,"Central":28.5},"Sikkim":{"N1":24,"N2":25.5,"E":16.5,"NE":12,"W1":29,"W2":26.5,"S1":23.5,"S2":28,"Central":23.5},"Assam":{"N1":24,"N2":25.5,"E":16.5,"NE":12,"W1":29,"W2":26.5,"S1":23.5,"S2":28,"Central":23.5},"Guwahati (Assam)":{"N1":19,"N2":20.5,"E":11.5,"NE":7,"W1":24,"W2":21.5,"S1":18.5,"S2":23,"Central":18.5},"Himachal Pradesh":{"N1":12,"N2":12,"E":17.5,"NE":17.5,"W1":15.5,"W2":16,"S1":17.5,"S2":17.5,"Central":15.5},"Jammu & Kashmir":{"N1":12,"N2":12,"E":17.5,"NE":17.5,"W1":15.5,"W2":16,"S1":17.5,"S2":17.5,"Central":15.5}},"b2b_cfg":{"markupPct":15,"docket":150,"fscPct":20,"fovPct":0.1,"fovMin":150,"volDivisor":4500,"minWt":20,"minFreight":350,"handlingWt":400,"handlingPerKg":3,"odaPerKg":4,"odaMin":750,"apptPerKg":4,"apptMin":750,"csdPerKg":4,"csdMin":750,"demPerKg":1,"demMin":100,"freeStorageDays":4,"dieselPeg":90.54,"dieselStep":3,"dieselPct":2,"topay":100,"codFee":300,"cashPct":2,"cashMin":300,"greenPerKg":0.5,"greenMin":100,"maxLiability":5000},"cc_partners":[{"id":"dfr","name":"Delhivery FR","sub":"Standard Delivery","baseKg":2,"base":[89,129,135,151,184],"add":[45,65,67,76,92],"codFlat":51,"codPct":0,"on":true},{"id":"dex","name":"Delhivery Express","sub":"Faster Delivery","baseKg":2,"base":[102,145,154,181,222],"add":[52,70,78,87,101],"codFlat":55,"codPct":0,"on":true},{"id":"dsf","name":"Delhivery (By Surface)","sub":"Economical Delivery","baseKg":5,"base":[134,171,231,255,320],"add":[28,34,44,50,63],"codFlat":49,"codPct":0,"on":true},{"id":"dsb","name":"Delhivery (By Surface)","sub":"Bulk Shipment","baseKg":10,"base":[223,279,323,374,465],"add":[21,26,30,35,63],"codFlat":49,"codPct":0,"on":true},{"id":"xbs","name":"Xpressbees (By Surface)","sub":"","baseKg":5,"base":[236,236,236,236,236],"add":[48,48,48,48,48],"codFlat":45,"codPct":0,"on":true},{"id":"xz1","name":"Xpressbees Z1 Kg","sub":"","baseKg":1,"base":[62,62,79,101,123],"add":[36,42,52,64,74],"codFlat":30.25,"codPct":1.82,"on":true},{"id":"xz2","name":"Xpressbees Z2 Kg","sub":"","baseKg":2,"base":[89,96,107,116,141],"add":[27,32,36,42,48],"codFlat":30.25,"codPct":1.82,"on":true},{"id":"xz5","name":"Xpressbees Z5 Kg","sub":"","baseKg":5,"base":[135,162,202,234,268],"add":[24,29,36,42,48],"codFlat":30.25,"codPct":1.82,"on":true},{"id":"xz10","name":"Xpressbees Z10 Kg","sub":"","baseKg":10,"base":[202,242,282,342,403],"add":[21,27,32,37,43],"codFlat":30.25,"codPct":1.82,"on":true},{"id":"bds","name":"BlueDart Surface 15 Kg","sub":"","baseKg":15,"base":[1036,1068,1105,1188,1450],"add":[54,61,67,72,88],"codFlat":50,"codPct":2,"on":true}],"cc_cfg":{"marginPct":15,"volDivisor":5000,"specialStates":"Jammu & Kashmir,Ladakh,Himachal Pradesh,Assam,Meghalaya,Tripura,Arunachal Pradesh,Mizoram,Manipur,Nagaland,Sikkim,Andaman & Nicobar,Lakshadweep"},"state_zone":{"Delhi":"N1","Uttar Pradesh":"N1","Haryana":"N1","Rajasthan":"N1","Chandigarh":"N2","Punjab":"N2","Himachal Pradesh":"N2","Uttarakhand":"N2","Jammu & Kashmir":"N2","Ladakh":"N2","West Bengal":"E","Odisha":"E","Bihar":"E","Jharkhand":"E","Assam":"NE","Meghalaya":"NE","Tripura":"NE","Arunachal Pradesh":"NE","Mizoram":"NE","Manipur":"NE","Nagaland":"NE","Sikkim":"NE","Gujarat":"W1","Daman & Diu":"W1","Dadra & Nagar Haveli":"W1","Maharashtra":"W2","Goa":"W2","Andhra Pradesh":"S1","Telangana":"S1","Karnataka":"S1","Tamil Nadu":"S1","Puducherry":"S1","Kerala":"S2","Madhya Pradesh":"Central","Chhattisgarh":"Central","Andaman & Nicobar":"","Lakshadweep":""}};
const enc = new TextEncoder();
const PBKDF2_ITER = 30000;
const SESSION_SECONDS = 30 * 24 * 3600;

class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const fail = (status, msg) => { throw new HttpError(status, msg); };
const num = (x) => { const n = Number(x); return isFinite(n) ? n : 0; };
const rnd2 = (x) => Math.round((Number(x) + Number.EPSILON) * 100) / 100;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

function resp(data, status, headers) {
  const h = new Headers({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  if (headers) { for (const k of Object.keys(headers)) { h.append(k, headers[k]); } }
  return new Response(JSON.stringify(data), { status: status || 200, headers: h });
}
function istNow() {
  const d = new Date(Date.now() + 5.5 * 3600 * 1000);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// ---------- crypto ----------
const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
function b64uEnc(str) { return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function b64uDec(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) { s += '='; } return decodeURIComponent(escape(atob(s))); }
async function hmacHex(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}
async function sha256Hex(s) { return toHex(await crypto.subtle.digest('SHA-256', enc.encode(s))); }
function safeEq(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) { return false; }
  let r = 0; for (let i = 0; i < a.length; i++) { r |= a.charCodeAt(i) ^ b.charCodeAt(i); }
  return r === 0;
}
async function pbkdf2Hex(password, saltHex, iter) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  return toHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt, iterations: iter, hash: 'SHA-256' }, key, 256));
}
async function hashPassword(pw) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  return 'pbkdf2$' + PBKDF2_ITER + '$' + salt + '$' + (await pbkdf2Hex(pw, salt, PBKDF2_ITER));
}
async function verifyPassword(pw, stored) {
  const p = String(stored || '').split('$');
  if (p[0] !== 'pbkdf2' || p.length !== 4) { return false; }
  return safeEq(await pbkdf2Hex(pw, p[2], parseInt(p[1], 10)), p[3]);
}
function randId(n) { return toHex(crypto.getRandomValues(new Uint8Array(n || 6))); }

// ---------- KV ----------
function KV() {
  if (typeof bci_kv === 'undefined') { fail(500, 'KV namespace is not bound. In EdgeOne project settings bind a KV namespace with the variable name  bci_kv'); }
  return bci_kv;
}
async function kget(key) {
  // EdgeOne KV may hand back an empty string / empty object for a missing key - always normalise that to null
  let v;
  try { v = await KV().get(key, { type: 'json' }); } catch (e) { if (e instanceof HttpError) { throw e; } v = null; }
  if (typeof v === 'string') {
    if (v === '' || v === 'null') { return null; }
    try { v = JSON.parse(v); } catch (e) { /* a plain string value - keep it */ }
  }
  if (v === undefined || v === null || v === '') { return null; }
  if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) { return null; }
  return v;
}
async function kput(key, val) { await KV().put(key, JSON.stringify(val)); }
async function kdel(key) { await KV().delete(key); }
async function klist(prefix) {
  const out = []; let cursor = null;
  for (let i = 0; i < 20; i++) {
    const opt = { prefix: prefix, limit: 256 };
    if (cursor) { opt.cursor = cursor; }
    const r = await KV().list(opt);
    const ks = (r && r.keys) || [];
    ks.forEach((k) => out.push(typeof k === 'string' ? k : (k && k.key)));
    if (!r || r.complete === true || !r.cursor) { break; }
    cursor = r.cursor;
  }
  return out.filter(Boolean);
}
// users are tracked in an explicit index too, so the admin list never depends on KV list() alone
async function userNames() {
  const idx = await kget('idx_users');
  const set = new Set(Array.isArray(idx) ? idx : []);
  try { (await klist('usr_')).forEach((k) => { if (String(k).indexOf('usr_') === 0) { set.add(String(k).slice(4)); } }); } catch (e) {}
  return Array.from(set).filter((n) => USERNAME_RE.test(n));
}
async function idxAdd(name) {
  const idx = await kget('idx_users');
  const list = Array.isArray(idx) ? idx : [];
  if (list.indexOf(name) === -1) { list.push(name); await kput('idx_users', list); }
}
async function idxRemove(name) {
  const idx = await kget('idx_users');
  if (Array.isArray(idx) && idx.indexOf(name) !== -1) { await kput('idx_users', idx.filter((n) => n !== name)); }
}

// ---------- config (defaults live in code; admin edits are stored in KV) ----------
const CFG_NAMES = ['zones', 'zonedef', 'rates_std', 'rates_bulk', 'b2b_zone', 'b2b_lanes', 'b2b_cfg', 'state_zone', 'cc_cfg', 'partners'];
async function cfg(name) {
  const v = await kget('cfg_' + name);
  if (v !== null && !(Array.isArray(v) && v.length === 0)) { return v; }
  if (name === 'rates_bulk') { return DEFAULTS.rates_std; }
  if (name === 'partners') { return [{ name: 'BCI Road Cargo', mode: 'Road' }, { name: 'BCI Air Express', mode: 'Air' }]; }
  return DEFAULTS[name];
}
async function ccPartners() {
  const v = await kget('cfg_cc_partners');
  return (Array.isArray(v) && v.length) ? v : DEFAULTS.cc_partners;
}

// ---------- users / session ----------
const USERNAME_RE = /^[a-z0-9_]{3,32}$/;
const pub = (u) => ({ id: u.username, username: u.username, role: u.role, pickup_location: u.pickup_location || '', pickup_pin: u.pickup_pin || '' });
async function getUser(name) { return USERNAME_RE.test(name || '') ? await kget('usr_' + name) : null; }
async function sessionCookie(env, username) {
  if (!env.SESSION_SECRET) { fail(500, 'SESSION_SECRET environment variable is not set.'); }
  const p = b64uEnc(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  const sig = await hmacHex(env.SESSION_SECRET, p);
  return 'bci_session=' + p + '.' + sig + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + SESSION_SECONDS;
}
async function readSession(request, env) {
  const m = (request.headers.get('cookie') || '').match(/(?:^|;\s*)bci_session=([^;]+)/);
  if (!m || !env.SESSION_SECRET) { return null; }
  const parts = m[1].split('.');
  if (parts.length !== 2) { return null; }
  if (!safeEq(await hmacHex(env.SESSION_SECRET, parts[0]), parts[1])) { return null; }
  let pl; try { pl = JSON.parse(b64uDec(parts[0])); } catch (e) { return null; }
  if (!pl || !pl.u || pl.exp < Date.now() / 1000) { return null; }
  const u = await getUser(pl.u);
  return (u && u.status === 'approved') ? u : null;
}
const needLogin = (me) => { if (!me) { fail(401, 'Not logged in'); } return me; };
const needAdmin = (me) => { needLogin(me); if (me.role !== 'admin') { fail(403, 'Admin only'); } return me; };

// ---------- wallet (three single-writer counters, so a stale read can never erase a credit) ----------
async function walletParts(u) {
  const r = await Promise.all([kget('wcr_' + u), kget('wca_' + u), kget('wdb_' + u)]);
  const z = () => ({ total: 0, log: [] });
  return { cr: r[0] || z(), ca: r[1] || z(), db: r[2] || z() };
}
const walletBal = (p) => rnd2(num(p.cr.total) + num(p.ca.total) - num(p.db.total));
async function walletBalance(u) { return walletBal(await walletParts(u)); }
async function walletMove(key, delta, entry) {
  const rec = (await kget(key)) || { total: 0, log: [] };
  rec.total = rnd2(num(rec.total) + delta);
  rec.log = [entry].concat(rec.log || []).slice(0, 60);
  await kput(key, rec);
}

// ---------- notifications ----------
async function pushNotification(n) {
  const list = (await kget('notif')) || [];
  list.unshift(n);
  await kput('notif', list.slice(0, 100));
}

// ================= handlers =================
async function mAuth(ctx) {
  const { action, body, env, request, me } = ctx;
  if (action === 'status') {
    return resp({ needsSetup: !(await kget('sys_setup')), sessionConfigured: !!env.SESSION_SECRET, setupKeyConfigured: !!env.SETUP_KEY });
  }
  if (action === 'setup') {
    if (!env.SETUP_KEY) { fail(500, 'SETUP_KEY environment variable is not set.'); }
    if (await kget('sys_setup')) { fail(403, 'Setup already completed.'); }
    if (!safeEq(String(body.setup_key || ''), env.SETUP_KEY)) { fail(403, 'Wrong setup key.'); }
    const username = String(body.username || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!USERNAME_RE.test(username)) { fail(400, 'Username: 3-32 letters/numbers/underscore.'); }
    if (password.length < 8) { fail(400, 'Password must be at least 8 characters.'); }
    const u = { username: username, email: String(body.email || '').trim().toLowerCase(), pass: await hashPassword(password), role: 'admin', status: 'approved', location: 'Head Office', created_at: istNow() };
    await kput('usr_' + username, u);
    if (u.email) { await kput('eml_' + (await sha256Hex(u.email)).slice(0, 32), username); }
    await idxAdd(username);
    await kput('sys_setup', { at: istNow() });
    return resp({ user: pub(u) }, 200, { 'set-cookie': await sessionCookie(env, username) });
  }
  if (action === 'login') {
    const id = String(body.username || '').trim().toLowerCase();
    const password = String(body.password || '');
    let uname = id;
    if (id.indexOf('@') !== -1) { uname = await kget('eml_' + (await sha256Hex(id)).slice(0, 32)); }
    const lockKey = 'lf_' + (USERNAME_RE.test(uname || '') ? uname : 'x');
    const lock = (await kget(lockKey)) || { n: 0, until: 0 };
    if (lock.until && lock.until > Date.now()) { fail(429, 'Too many failed attempts. Try again after 10 minutes.'); }
    const u = await getUser(uname);
    if (!u || !(await verifyPassword(password, u.pass))) {
      lock.n = (lock.n || 0) + 1;
      if (lock.n >= 8) { lock.until = Date.now() + 10 * 60 * 1000; lock.n = 0; }
      if (USERNAME_RE.test(uname || '')) { await kput(lockKey, lock); }
      fail(401, 'Invalid username/email or password');
    }
    if (u.status === 'pending') { fail(403, 'உங்கள் account இன்னும் Admin approval-க்காக காத்திருக்கிறது. சிறிது நேரம் கழித்து முயற்சிக்கவும்.'); }
    if (u.status === 'rejected') { fail(403, 'இந்த account-க்கு அனுமதி மறுக்கப்பட்டுள்ளது. Admin-ஐ தொடர்பு கொள்ளவும்.'); }
    if (lock.n) { await kput(lockKey, { n: 0, until: 0 }); }
    await kput('ll_' + u.username, istNow());
    try { await idxAdd(u.username); } catch (e) {}
    return resp({ user: pub(u) }, 200, { 'set-cookie': await sessionCookie(env, u.username) });
  }
  if (action === 'register') {
    const username = String(body.username || '').trim().toLowerCase();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!USERNAME_RE.test(username)) { fail(400, 'Username: 3-32 letters (a-z), numbers, underscore மட்டும்.'); }
    if (password.length < 8) { fail(400, 'Password குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.'); }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { fail(400, 'Email சரியாக இல்லை.'); }
    if (await getUser(username)) { fail(409, 'இந்த username ஏற்கனவே பயன்பாட்டில் உள்ளது.'); }
    const ek = email ? 'eml_' + (await sha256Hex(email)).slice(0, 32) : '';
    if (ek && (await kget(ek))) { fail(409, 'இந்த email ஏற்கனவே பயன்பாட்டில் உள்ளது.'); }
    await kput('usr_' + username, { username: username, email: email, pass: await hashPassword(password), role: 'vendor', status: 'pending', location: String(body.location || '').trim().slice(0, 80), created_at: istNow() });
    if (ek) { await kput(ek, username); }
    await idxAdd(username);
    await pushNotification({ id: Date.now(), type: 'signup', by_user: username, customer: username, total: 0, message: 'New account request: ' + username + (body.location ? ' (' + String(body.location).slice(0, 40) + ')' : ''), created_at: istNow(), is_read: 0 });
    return resp({ ok: true, message: 'Account உருவாக்கப்பட்டது. Admin approve செய்த பிறகு login செய்யலாம்.' });
  }
  if (action === 'logout') {
    return resp({ ok: true }, 200, { 'set-cookie': 'bci_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0' });
  }
  if (action === 'me') { return resp({ user: me ? pub(me) : null }); }
  fail(400, 'Unknown action');
}

async function allUsers(me) {
  const names = await userNames();
  if (me && names.indexOf(me.username) === -1) { names.push(me.username); try { await idxAdd(me.username); } catch (e) {} }
  const recs = await Promise.all(names.map((n) => kget('usr_' + n)));
  return recs.filter((u) => u && u.username);
}
async function mUsers(ctx) {
  const { action, body, me } = ctx;
  needAdmin(me);
  if (action === 'list' || action === 'pending') {
    let list = await allUsers(me);
    if (action === 'pending') { list = list.filter((u) => u.status === 'pending'); }
    const out = await Promise.all(list.map(async (u) => {
      const base = { id: u.username, username: u.username, email: u.email || '', role: u.role, status: u.status, location: u.location || '', created_at: u.created_at || '' };
      if (action === 'pending') { return base; }
      base.wallet_balance = u.role === 'admin' ? 0 : await walletBalance(u.username);
      base.last_login = (await kget('ll_' + u.username)) || null;
      base.pickup_location = u.pickup_location || ''; base.pickup_pin = u.pickup_pin || '';
      return base;
    }));
    out.sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    return resp({ users: out });
  }
  if (action === 'approve' || action === 'reject') {
    const u = await getUser(String(body.id || ''));
    if (!u) { fail(404, 'User not found'); }
    u.status = action === 'approve' ? 'approved' : 'rejected';
    await kput('usr_' + u.username, u);
    return resp({ ok: true });
  }
  if (action === 'lookup') {
    const u = await getUser(String(body.username || '').trim().toLowerCase());
    if (!u) { fail(404, 'அந்த username-ல் user இல்லை.'); }
    await idxAdd(u.username);
    return resp({ ok: true, username: u.username, status: u.status });
  }
  if (action === 'set_pickup') {
    const u = await getUser(String(body.id || ''));
    if (!u) { fail(404, 'User not found'); }
    u.pickup_location = String(body.pickup_location || '').trim().slice(0, 100);
    u.pickup_pin = /^\d{6}$/.test(String(body.pickup_pin || '')) ? String(body.pickup_pin) : '';
    await kput('usr_' + u.username, u);
    return resp({ ok: true });
  }
  if (action === 'add') {
    const username = String(body.username || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!USERNAME_RE.test(username)) { fail(400, 'Username: 3-32 letters (a-z), numbers, underscore மட்டும்.'); }
    if (password.length < 8) { fail(400, 'Password குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.'); }
    if (await getUser(username)) { fail(409, 'Username already exists'); }
    const email = String(body.email || '').trim().toLowerCase();
    await kput('usr_' + username, { username: username, email: email, pass: await hashPassword(password), role: body.role === 'admin' ? 'admin' : 'vendor', status: 'approved', location: String(body.location || '').trim().slice(0, 80), created_at: istNow() });
    if (email) { await kput('eml_' + (await sha256Hex(email)).slice(0, 32), username); }
    await idxAdd(username);
    return resp({ ok: true });
  }
  if (action === 'reset_password') {
    const u = await getUser(String(body.id || ''));
    if (!u) { fail(404, 'User not found'); }
    if (String(body.password || '').length < 8) { fail(400, 'Password குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.'); }
    u.pass = await hashPassword(String(body.password));
    await kput('usr_' + u.username, u);
    await kput('lf_' + u.username, { n: 0, until: 0 });
    return resp({ ok: true });
  }
  if (action === 'delete') {
    const u = await getUser(String(body.id || ''));
    if (!u) { fail(404, 'User not found'); }
    if (u.username === me.username) { fail(400, 'You cannot delete your own account.'); }
    if (u.role === 'admin' && (await allUsers(me)).filter((x) => x.role === 'admin').length <= 1) { fail(400, 'Cannot delete the last admin.'); }
    await kdel('usr_' + u.username);
    await idxRemove(u.username);
    if (u.email) { await kdel('eml_' + (await sha256Hex(u.email)).slice(0, 32)); }
    return resp({ ok: true });
  }
  fail(400, 'Unknown action');
}

// ---- customers: each vendor sees only their own; admin sees all ----
async function mCustomers(ctx) {
  const { action, body, me } = ctx;
  needLogin(me);
  if (action === 'list') {
    if (me.role !== 'admin') {
      const l = (await kget('cus_' + me.username)) || [];
      return resp({ customers: l.map((c) => Object.assign({ owner: me.username }, c)) });
    }
    const keys = (await userNames()).map((n) => 'cus_' + n);
    const lists = await Promise.all(keys.map((k) => kget(k)));
    const out = [];
    keys.forEach((k, i) => (lists[i] || []).forEach((c) => out.push(Object.assign({ owner: k.slice(4) }, c))));
    out.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return resp({ customers: out });
  }
  if (action === 'upsert') {
    const r = await upsertCustomer(me.username, body);
    if (!r) { fail(400, 'name required'); }
    return resp({ ok: true });
  }
  if (action === 'delete') {
    const owners = me.role === 'admin' ? ((await userNames()).map((n) => 'cus_' + n)).map((k) => k.slice(4)) : [me.username];
    for (const o of owners) {
      const l = (await kget('cus_' + o)) || [];
      const n = l.filter((c) => c.id !== body.id);
      if (n.length !== l.length) { await kput('cus_' + o, n); break; }
    }
    return resp({ ok: true });
  }
  fail(400, 'Unknown action');
}
async function upsertCustomer(owner, c) {
  const name = String(c.name || '').trim();
  if (!name) { return null; }
  const mobile = String(c.mobile || '').trim();
  const l = (await kget('cus_' + owner)) || [];
  const rec = { name: name.slice(0, 150), mobile: mobile.slice(0, 20), addr: String(c.addr || '').slice(0, 255), type: c.type === 'B2B' ? 'B2B' : 'B2C', gstin: String(c.gstin || '').slice(0, 20) };
  const i = l.findIndex((x) => x.name === name && x.mobile === mobile);
  if (i >= 0) { l[i] = Object.assign(l[i], rec); } else { l.push(Object.assign({ id: Date.now().toString(36) + randId(2) }, rec)); }
  await kput('cus_' + owner, l.slice(-2000));
  return true;
}

// ---- generic config (read: any logged in user; write: admin) ----
async function mKv(ctx) {
  const { action, body, me } = ctx;
  needLogin(me);
  if (action === 'all') {
    const out = {};
    for (const n of CFG_NAMES) { out[n] = await cfg(n); }
    return resp({ data: out });
  }
  if (action === 'set') {
    needAdmin(me);
    if (CFG_NAMES.indexOf(body.name) === -1) { fail(400, 'Not allowed'); }
    if (body.value === undefined || body.value === null) { fail(400, 'value required'); }
    await kput('cfg_' + body.name, body.value);
    return resp({ ok: true });
  }
  fail(400, 'Unknown action');
}

// ---- B2C multi-courier compare (margin hidden from non-admin) ----
const CC_CATS = ['City', 'Region', 'Metro', 'ROI', 'Special'];
async function mCc(ctx) {
  const { action, body, me } = ctx;
  needLogin(me);
  if (action === 'list') {
    const ps = await ccPartners();
    return resp({
      partners: ps.map((p) => ({ id: p.id, name: p.name, sub: p.sub || '', base_kg: p.baseKg, base_json: '', add_json: '', base: p.base, add: p.add, cod_flat: p.codFlat, cod_pct: p.codPct, is_on: p.on === false ? 0 : 1, on: p.on !== false })),
      cfg: await cfg('cc_cfg')
    });
  }
  if (action === 'save') {
    needAdmin(me);
    const list = (body.partners || []).slice(0, 60).map((p) => ({
      id: String(p.id || ('cc' + randId(4))).slice(0, 40), name: String(p.name || '').slice(0, 150), sub: String(p.sub || '').slice(0, 150),
      baseKg: num(p.baseKg || 1), base: (p.base || [0, 0, 0, 0, 0]).slice(0, 5).map(num), add: (p.add || [0, 0, 0, 0, 0]).slice(0, 5).map(num),
      codFlat: num(p.codFlat), codPct: num(p.codPct), on: !!p.on
    }));
    await kput('cfg_cc_partners', list);
    if (body.cfg) {
      const c = Object.assign({}, body.cfg);
      c.marginPct = clamp(num(c.marginPct || 15), 10, 30);
      await kput('cfg_cc_cfg', c);
    }
    return resp({ ok: true });
  }
  if (action === 'compare') {
    const cfgv = await cfg('cc_cfg');
    let mg = clamp(num(body.marginOverride !== undefined ? body.marginOverride : (cfgv.marginPct || 15)), 10, 30);
    if (me.role !== 'admin') { mg = clamp(num(cfgv.marginPct || 15), 10, 30); }
    const cw = num(body.cw), ci = Math.round(num(body.category !== undefined ? body.category : 3));
    if (cw <= 0) { fail(400, 'weight required'); }
    if (ci < 0 || ci > 4) { fail(400, 'invalid category'); }
    const cod = !!body.cod, val = num(body.orderValue), gstType = body.gstType === 'CGST_SGST' ? 'CGST_SGST' : 'IGST';
    const rows = (await ccPartners()).filter((p) => p.on !== false).map((p) => {
      const ex = cw <= p.baseKg ? 0 : Math.ceil(cw - p.baseKg - 0.0000001);
      const costFr = rnd2(num(p.base[ci]) + ex * num(p.add[ci]));
      const freight = rnd2(costFr * (1 + mg / 100));
      const codAmt = cod ? rnd2(Math.max(num(p.codFlat), val * num(p.codPct) / 100)) : 0;
      const sub = rnd2(freight + codAmt);
      const gstLines = gstType === 'IGST' ? [{ label: 'IGST @ 18%', amt: rnd2(sub * 0.18) }] : [{ label: 'CGST @ 9%', amt: rnd2(sub * 0.09) }, { label: 'SGST @ 9%', amt: rnd2(sub * 0.09) }];
      const gstTotal = rnd2(gstLines.reduce((a, l) => a + l.amt, 0));
      const row = { id: p.id, name: p.name, sub: p.sub || '', baseKg: p.baseKg, ex: ex, freight: freight, codAmt: codAmt, sub_total: sub, gstLines: gstLines, gstTotal: gstTotal, total: rnd2(sub + gstTotal) };
      if (me.role === 'admin') { row.costFr = costFr; row.marginAmt = rnd2(freight - costFr); row.marginPct = mg; }
      return row;
    });
    rows.sort((a, b) => a.total - b.total);
    return resp({ rows: rows, cw: cw, category: CC_CATS[ci] });
  }
  fail(400, 'Unknown action');
}

// ---- B2B Delhivery freight (margin hidden from non-admin) ----
async function mB2b(ctx) {
  const { action, body, me } = ctx;
  needLogin(me);
  if (action === 'cfg') { return resp({ zone: await cfg('b2b_zone'), lanes: await cfg('b2b_lanes'), cfg: await cfg('b2b_cfg') }); }
  if (action === 'save_cfg') {
    needAdmin(me);
    if (body.zone) { await kput('cfg_b2b_zone', body.zone); }
    if (body.cfg) { const c = Object.assign({}, body.cfg); c.markupPct = clamp(num(c.markupPct || 15), 10, 30); await kput('cfg_b2b_cfg', c); }
    return resp({ ok: true });
  }
  if (action !== 'calc') { fail(400, 'Unknown action'); }
  const C = await cfg('b2b_cfg'), ZONE = await cfg('b2b_zone'), LANES = await cfg('b2b_lanes');
  let mg = clamp(num(body.marginOverride !== undefined ? body.marginOverride : (C.markupPct || 15)), 10, 30);
  if (me.role !== 'admin') { mg = clamp(num(C.markupPct || 15), 10, 30); }
  const pk = String(body.pickup || ''), ds = String(body.dest || ''), lane = String(body.lane || '');
  const actual = num(body.actual), vol = num(body.vol);
  if (actual <= 0 && vol <= 0) { fail(400, 'weight/dimensions required'); }
  const cw = rnd2(Math.max(actual, vol, num(C.minWt || 20)));
  const rawRate = (lane !== '' && LANES[lane] && LANES[lane][pk] !== undefined) ? num(LANES[lane][pk]) : num((ZONE[pk] || {})[ds]);
  const rate = rnd2(rawRate * (1 + mg / 100));
  let freight = cw * rate, minApplied = false;
  if (freight < num(C.minFreight || 350)) { freight = num(C.minFreight); minApplied = true; }
  freight = rnd2(freight);
  const lines = [];
  const add = (label, basis, amt) => { amt = rnd2(amt); if (amt !== 0) { lines.push({ label: label, basis: basis, amt: amt }); } };
  add('Freight (' + pk + ' → ' + (lane || ds) + ')', cw + ' kg × ₹' + rate.toFixed(2) + (minApplied ? ' (min freight ₹' + C.minFreight + ' applied)' : ''), freight);
  const diesel = num(body.diesel || C.dieselPeg), diff = diesel - num(C.dieselPeg);
  const steps = Math.floor(Math.abs(diff) / num(C.dieselStep || 3)), hikePct = (diff < 0 ? -1 : 1) * steps * num(C.dieselPct);
  if (hikePct !== 0) { add('Fuel price adjustment', (hikePct > 0 ? '+' : '') + hikePct + '% of freight', freight * hikePct / 100); }
  add('Fuel Surcharge (FSC)', C.fscPct + '% of freight', freight * num(C.fscPct) / 100);
  add('Docket charge', '₹' + C.docket + ' per LR', num(C.docket));
  if (cw >= num(C.handlingWt)) { add('Handling charges', cw + ' kg × ₹' + C.handlingPerKg, cw * num(C.handlingPerKg)); }
  if (body.oda) { add('ODA charge', '₹' + C.odaPerKg + '/kg, min ₹' + C.odaMin, Math.max(cw * num(C.odaPerKg), num(C.odaMin))); }
  if (body.appt) { add('Appointment / Mall delivery', '₹' + C.apptPerKg + '/kg, min ₹' + C.apptMin, Math.max(cw * num(C.apptPerKg), num(C.apptMin))); }
  if (body.csd) { add('CSD / Army delivery', '₹' + C.csdPerKg + '/kg, min ₹' + C.csdMin, Math.max(cw * num(C.csdPerKg), num(C.csdMin))); }
  if (body.green) { add('Green tax', '₹' + C.greenPerKg + '/kg, min ₹' + C.greenMin, Math.max(cw * num(C.greenPerKg), num(C.greenMin))); }
  if (body.topay) { add('To-Pay (freight to collect)', '₹' + C.topay + ' per LR', num(C.topay)); }
  const cod = num(body.codAmt);
  if (body.cod) {
    add('Value to collect (COD) charge', '₹' + C.codFee + ' per LR', num(C.codFee));
    if (cod > 0) { add('Cash handling', C.cashPct + '% of ₹' + cod + ', min ₹' + C.cashMin, Math.max(cod * num(C.cashPct) / 100, num(C.cashMin))); }
  }
  const declared = num(body.declared);
  if (body.fov) { add("FOV / ROV (Owner's risk)", C.fovPct + '% of declared value, min ₹' + C.fovMin, Math.max(declared * num(C.fovPct) / 100, num(C.fovMin))); }
  const dem = num(body.demDays);
  if (dem > 0) { add('Demurrage', dem + ' day(s)', dem * Math.max(cw * num(C.demPerKg), num(C.demMin))); }
  const sub = rnd2(lines.reduce((a, l) => a + l.amt, 0));
  const gstType = body.gstType === 'CGST_SGST' ? 'CGST_SGST' : 'IGST';
  const gstLines = gstType === 'IGST' ? [{ label: 'IGST @ 18%', amt: rnd2(sub * 0.18) }] : [{ label: 'CGST @ 9%', amt: rnd2(sub * 0.09) }, { label: 'SGST @ 9%', amt: rnd2(sub * 0.09) }];
  const gstTotal = rnd2(gstLines.reduce((a, l) => a + l.amt, 0));
  const rawTotal = sub + gstTotal, total = Math.round(rawTotal), roundOff = rnd2(total - rawTotal);
  const res = { pk: pk, ds: ds, lane: lane, actual: rnd2(actual), vol: rnd2(vol), cw: cw, pcs: Math.round(num(body.pieces || 1)), rate: rate, lines: lines, sub: sub, gstType: gstType, gstLines: gstLines, gstTotal: gstTotal, roundOff: roundOff, total: total, declared: declared, diesel: diesel };
  if (me.role === 'admin') {
    let costFreight = cw * rnd2(rawRate); if (costFreight < num(C.minFreight)) { costFreight = num(C.minFreight); }
    const costSub = rnd2(sub - (freight - rnd2(costFreight)));
    res.costSub = costSub; res.marginAmt = rnd2(sub - costSub); res.marginPct = mg;
  }
  return resp(res);
}

// ---- invoices ----
async function mInvoices(ctx) {
  const { action, body, url, me } = ctx;
  needLogin(me);
  if (action === 'list') {
    let rows = [];
    if (me.role === 'admin') {
      const keys = (await userNames()).map((n) => 'invx_' + n);
      const lists = await Promise.all(keys.map((k) => kget(k)));
      lists.forEach((l) => { rows = rows.concat(l || []); });
    } else { rows = (await kget('invx_' + me.username)) || []; }
    rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    return resp({ invoices: rows.slice(0, 500) });
  }
  if (action === 'get') {
    const r = await kget('inv_' + String(url.searchParams.get('id') || '').replace(/[^A-Za-z0-9]/g, ''));
    if (!r) { fail(404, 'not found'); }
    if (me.role !== 'admin' && r.by_user !== me.username) { fail(403, 'forbidden'); }
    if (me.role === 'admin') {
      const m = await kget('invm_' + r.id);
      if (m) { r.extra = Object.assign({}, r.extra || {}, { costSub: m.cost, marginPct: m.marginPct, marginAmt: m.marginAmt }); }
    }
    return resp({ invoice: r });
  }
  if (action === 'create') {
    const total = rnd2(num(body.total));
    if (!(total >= 0)) { fail(400, 'invalid total'); }
    const isAdmin = me.role === 'admin';
    if (!isAdmin) {
      const bal = await walletBalance(me.username);
      if (bal < total) { fail(402, 'போதிய Wallet Balance இல்லை. தற்போதைய Balance: ₹' + bal.toFixed(2) + '. இந்த Invoice-க்கு: ₹' + total.toFixed(2) + '. முதலில் Wallet Recharge செய்யவும்.'); }
    }
    const id = 'BCI' + String(Date.now()).slice(-8) + String(Math.floor(Math.random() * 90) + 10);
    const created = istNow();
    const inv = {
      id: id, created_at: created, customer: String(body.customer || '').slice(0, 150), mobile: String(body.mobile || '').slice(0, 20), addr: String(body.addr || '').slice(0, 255),
      cust_type: body.custType === 'B2B' ? 'B2B' : 'B2C', gstin: String(body.gstin || '').slice(0, 20), pickup: String(body.pickup || '').slice(0, 80), dest: String(body.dest || '').slice(0, 120),
      weight: num(body.weight), pieces: Math.round(num(body.pieces || 1)), partner: String(body.partner || '').slice(0, 150), rate: num(body.rate), sub_total: num(body.sub), gst: num(body.gst),
      total: total, by_user: me.username, extra: body.extra || null
    };
    if (!isAdmin && total > 0) {
      await walletMove('wdb_' + me.username, total, { t: created, type: 'debit', amount: total, ref: id, note: 'Shipment booking ' + id });
    }
    try {
      await kput('inv_' + id, inv);
      const idx = (await kget('invx_' + me.username)) || [];
      idx.unshift({ id: id, created_at: created, customer: inv.customer, cust_type: inv.cust_type, pickup: inv.pickup, dest: inv.dest, weight: inv.weight, partner: inv.partner, total: total, by_user: me.username });
      await kput('invx_' + me.username, idx.slice(0, 600));
    } catch (e) {
      if (!isAdmin && total > 0) { await walletMove('wca_' + me.username, total, { t: istNow(), type: 'credit', amount: total, ref: id, note: 'Refund: invoice save failed' }); }
      throw e;
    }
    await upsertCustomer(me.username, { name: inv.customer, mobile: inv.mobile, addr: inv.addr, type: inv.cust_type, gstin: inv.gstin });
    await pushNotification({ id: Date.now(), type: 'invoice', invoice_id: id, customer: inv.customer, total: total, by_user: me.username, created_at: created, is_read: 0 });
    return resp({ ok: true, id: id });
  }
  fail(400, 'Unknown action');
}

async function mNotifications(ctx) {
  const { action, me } = ctx;
  needAdmin(me);
  const list = (await kget('notif')) || [];
  if (action === 'list') { return resp({ notifications: list.slice(0, 50), unread: list.filter((n) => !n.is_read).length }); }
  if (action === 'mark_all_read') { list.forEach((n) => { n.is_read = 1; }); await kput('notif', list); return resp({ ok: true }); }
  fail(400, 'Unknown action');
}

// ---- wallet + Razorpay ----
async function rzp(env, method, path, bodyObj) {
  const r = await fetch('https://api.razorpay.com' + path, {
    method: method, headers: { 'Authorization': 'Basic ' + btoa(String(env.RAZORPAY_KEY_ID || '').trim() + ':' + String(env.RAZORPAY_KEY_SECRET || '').trim()), 'Content-Type': 'application/json' },
    body: bodyObj ? JSON.stringify(bodyObj) : undefined
  });
  let data = null; try { data = await r.json(); } catch (e) {}
  return { ok: r.ok, status: r.status, data: data };
}
async function mWallet(ctx) {
  const { action, body, url, env, me } = ctx;
  needLogin(me);
  const target = (me.role === 'admin' && (url.searchParams.get('user_id') || body.user_id)) ? String(url.searchParams.get('user_id') || body.user_id) : me.username;
  if (action === 'balance') { return resp({ balance: await walletBalance(target) }); }
  if (action === 'transactions') {
    const p = await walletParts(target);
    const all = [].concat(p.cr.log || [], p.ca.log || [], p.db.log || []).sort((a, b) => String(b.t).localeCompare(String(a.t))).slice(0, 100);
    return resp({ transactions: all.map((e) => ({ created_at: e.t, type: e.type, amount: e.amount, ref: e.ref, note: e.note })) });
  }
  if (action === 'manual_adjust') {
    needAdmin(me);
    const u = await getUser(String(body.user_id || ''));
    const amt = rnd2(num(body.amount));
    if (!u || amt <= 0) { fail(400, 'user_id & positive amount required'); }
    const type = body.type === 'debit' ? 'debit' : 'credit';
    await walletMove('wca_' + u.username, type === 'credit' ? amt : -amt, { t: istNow(), type: type, amount: amt, ref: 'manual', note: String(body.note || 'Manual adjustment by admin').slice(0, 200) });
    return resp({ ok: true });
  }
  if (action === 'key') { return resp({ key_id: String(env.RAZORPAY_KEY_ID || '').trim(), configured: !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) }); }
  if (action === 'create_order') {
    if (me.role === 'admin') { fail(400, 'Admin accounts do not use a wallet.'); }
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) { fail(400, 'Razorpay is not configured by admin yet. Use manual wallet top-up.'); }
    const amount = rnd2(num(body.amount));
    if (amount < 1) { fail(400, 'Minimum recharge amount is ₹1'); }
    if (amount > 100000) { fail(400, 'Maximum single recharge is ₹1,00,000'); }
    const r = await rzp(env, 'POST', '/v1/orders', { amount: Math.round(amount * 100), currency: 'INR', receipt: ('w_' + me.username + '_' + Date.now()).slice(0, 40), notes: { username: me.username } });
    if (!r.ok || !r.data || !r.data.id) { fail(502, 'Razorpay order creation failed: ' + (r.data && r.data.error ? r.data.error.description : 'HTTP ' + r.status)); }
    return resp({ order_id: r.data.id, amount: r.data.amount, currency: r.data.currency, key_id: String(env.RAZORPAY_KEY_ID || '').trim() });
  }
  if (action === 'verify') {
    if (!env.RAZORPAY_KEY_SECRET) { fail(400, 'Razorpay is not configured.'); }
    const orderId = String(body.razorpay_order_id || ''), payId = String(body.razorpay_payment_id || ''), sig = String(body.razorpay_signature || '');
    if (!/^order_[A-Za-z0-9]+$/.test(orderId) || !/^pay_[A-Za-z0-9]+$/.test(payId) || !sig) { fail(400, 'Missing payment details'); }
    if (!safeEq(await hmacHex(String(env.RAZORPAY_KEY_SECRET || '').trim(), orderId + '|' + payId), sig)) { fail(400, 'Payment signature verification failed'); }
    // the amount is read from Razorpay itself - never trusted from the browser
    const o = await rzp(env, 'GET', '/v1/orders/' + orderId);
    if (!o.ok || !o.data) { fail(502, 'Could not confirm the order with Razorpay.'); }
    const notes = o.data.notes || {};
    if (notes.username !== me.username) { fail(403, 'This payment belongs to another account.'); }
    if (String(notes.credited) === '1') { fail(409, 'This payment was already credited.'); }
    if (o.data.status !== 'paid') { fail(400, 'Payment is not completed yet.'); }
    const marker = 'pay_' + payId.replace(/^pay_/, '');
    if (await kget(marker)) { fail(409, 'This payment was already credited.'); }
    const amount = rnd2(num(o.data.amount_paid) / 100);
    if (amount <= 0) { fail(400, 'No amount paid.'); }
    await kput(marker, { user: me.username, amount: amount, at: istNow() });
    try {
      await walletMove('wcr_' + me.username, amount, { t: istNow(), type: 'credit', amount: amount, ref: payId, note: 'Razorpay recharge (order ' + orderId + ')' });
    } catch (e) { await kdel(marker); throw e; }
    try { await rzp(env, 'PATCH', '/v1/orders/' + orderId, { notes: Object.assign({}, notes, { credited: '1' }) }); } catch (e) {}
    await pushNotification({ id: Date.now(), type: 'wallet', by_user: me.username, customer: me.username, total: amount, message: 'Wallet recharged: ' + me.username + ' +Rs ' + amount.toFixed(2), created_at: istNow(), is_read: 0 });
    return resp({ ok: true, credited: amount });
  }
  fail(400, 'Unknown action');
}

// ---- Delhivery ----
function dlvConfigured(env) { return !!env.DELHIVERY_TOKEN; }
async function dlv(env, method, path, query, formBody) {
  const base = env.DELHIVERY_BASE || 'https://track.delhivery.com';
  const qs = query ? '?' + new URLSearchParams(query).toString() : '';
  const headers = { 'Authorization': 'Token ' + env.DELHIVERY_TOKEN, 'Accept': 'application/json' };
  const opt = { method: method, headers: headers };
  if (formBody) { headers['Content-Type'] = 'application/x-www-form-urlencoded'; opt.body = new URLSearchParams(formBody).toString(); }
  const r = await fetch(base + path + qs, opt);
  const raw = await r.text(); let data = null; try { data = JSON.parse(raw); } catch (e) {}
  return { ok: r.ok, code: r.status, raw: raw, data: data };
}
async function mDelhivery(ctx) {
  const { action, body, url, env, me } = ctx;
  needLogin(me);
  const q = (k) => String(url.searchParams.get(k) || '');
  if (action === 'status') { return resp({ configured: dlvConfigured(env), client: env.DELHIVERY_CLIENT || '', pickup: env.DELHIVERY_PICKUP || '' }); }
  if (!dlvConfigured(env)) { fail(400, 'Delhivery API இன்னும் Admin set up செய்யவில்லை (DELHIVERY_TOKEN environment variable காலியாக உள்ளது).'); }
  if (action === 'pincode') {
    if (!/^\d{6}$/.test(q('pin'))) { fail(400, 'Valid 6-digit pincode required'); }
    const r = await dlv(env, 'GET', '/c/api/pin-codes/json/', { filter_codes: q('pin') });
    return resp({ data: r.data });
  }
  if (action === 'rate') {
    const grams = Math.round(num(q('cgm')));
    if (!/^\d{6}$/.test(q('o_pin')) || !/^\d{6}$/.test(q('d_pin')) || grams <= 0) { fail(400, 'o_pin, d_pin, cgm(grams) required'); }
    const r = await dlv(env, 'GET', '/api/kinko/v1/invoice/charges/.json', { cl: env.DELHIVERY_CLIENT || '', ss: 'Delivered', md: q('md') === 'E' ? 'E' : 'S', pt: q('pt') || 'Pre-paid', o_pin: q('o_pin'), d_pin: q('d_pin'), cgm: String(grams) });
    if (r.code >= 400) { fail(502, 'Delhivery rate API error (HTTP ' + r.code + '): ' + r.raw.slice(0, 300)); }
    return resp({ data: r.data });
  }
  if (action === 'manifest') {
    const inv = await kget('inv_' + String(body.invoice_id || '').replace(/[^A-Za-z0-9]/g, ''));
    if (!inv) { fail(404, 'Invoice not found'); }
    if (me.role !== 'admin' && inv.by_user !== me.username) { fail(403, 'forbidden'); }
    if (inv.extra && inv.extra.delhivery_waybill) { fail(409, 'This invoice already has a Delhivery waybill: ' + inv.extra.delhivery_waybill); }
    const pin = String(body.dest_pin || '').trim();
    if (!/^\d{6}$/.test(pin)) { fail(400, 'Destination pincode (6 digits) required'); }
    if (!String(body.dest_city || '').trim() || !String(body.dest_state || '').trim()) { fail(400, 'Destination city and state required'); }
    const cod = body.payment_mode === 'COD';
    const shipment = {
      name: inv.customer, add: inv.addr, pin: pin, city: String(body.dest_city).trim(), state: String(body.dest_state).trim(), country: 'India', phone: inv.mobile,
      order: inv.id, payment_mode: cod ? 'COD' : 'Prepaid', return_pin: '', return_city: '', return_phone: '', return_add: '', return_state: '', return_country: '',
      products_desc: 'Courier Shipment', hsn_code: '', cod_amount: cod ? inv.total : 0, order_date: null, total_amount: inv.total,
      seller_add: '', seller_name: 'BIG CART INDIA', seller_inv: inv.id, quantity: String(inv.pieces || 1), waybill: '',
      shipment_width: String(body.width || ''), shipment_height: String(body.height || ''), shipment_length: String(body.length || ''),
      weight: String(Math.round(num(inv.weight) * 1000))
    };
    const r = await dlv(env, 'POST', '/api/cmu/create.json', null, { format: 'json', data: JSON.stringify({ shipments: [shipment], pickup_location: { name: env.DELHIVERY_PICKUP || '' } }) });
    if (r.code >= 400 || !r.data) { fail(502, 'Delhivery manifest failed (HTTP ' + r.code + '): ' + r.raw.slice(0, 400)); }
    const pk = r.data.packages && r.data.packages[0];
    const waybill = pk && pk.waybill ? pk.waybill : '';
    if (!waybill) { fail(502, 'Delhivery did not return a waybill: ' + r.raw.slice(0, 400)); }
    inv.extra = Object.assign({}, inv.extra || {}, { delhivery_waybill: waybill });
    await kput('inv_' + inv.id, inv);
    return resp({ ok: true, waybill: waybill, raw: r.data });
  }
  if (action === 'label') {
    if (!q('waybill')) { fail(400, 'waybill required'); }
    const r = await dlv(env, 'GET', '/api/p/packing_slip', { wbns: q('waybill'), pdf: 'true' });
    return resp({ data: r.data });
  }
  if (action === 'track') {
    if (!q('waybill')) { fail(400, 'waybill required'); }
    const r = await dlv(env, 'GET', '/api/v1/packages/json/', { waybill: q('waybill'), verbose: '1' });
    return resp({ data: r.data });
  }
  fail(400, 'Unknown action');
}

// ---- admin diagnostics ----
async function mSystem(ctx) {
  const { env, me } = ctx;
  needAdmin(me);
  let kvOk = false; try { await kput('sys_ping', { t: Date.now() }); kvOk = true; } catch (e) {}
  let listOk = false, listCount = -1, listErr = '';
  try { listCount = (await klist('usr_')).length; listOk = true; } catch (e) { listErr = String(e && e.message ? e.message : e).slice(0, 120); }
  const idx = await kget('idx_users');
  const kid = String(env.RAZORPAY_KEY_ID || '').trim(), ksec = String(env.RAZORPAY_KEY_SECRET || '').trim();
  const rz = { set: !!(kid && ksec), mode: kid.indexOf('rzp_live_') === 0 ? 'live' : (kid.indexOf('rzp_test_') === 0 ? 'test' : 'unknown'), keyIdLen: kid.length, secretLen: ksec.length, rawIdSpaces: String(env.RAZORPAY_KEY_ID || '') !== kid, rawSecretSpaces: String(env.RAZORPAY_KEY_SECRET || '') !== ksec, authOk: false, authMsg: '' };
  if (rz.set) {
    try { const r = await rzp(env, 'GET', '/v1/orders?count=1'); rz.authOk = r.ok; rz.authMsg = r.ok ? 'OK' : ('HTTP ' + r.status + ': ' + ((r.data && r.data.error && r.data.error.description) || '')); }
    catch (e) { rz.authMsg = 'network error'; }
  }
  const sfxInfo = { set: sfxConfigured(env), authOk: false, msg: '' };
  if (sfxInfo.set) { try { const r = await sfx(env, 'GET', '/v1/clients/serviceability/?service=marketplace&pincodes=560001'); sfxInfo.authOk = r.ok; sfxInfo.msg = r.ok ? 'OK' : 'HTTP ' + r.code; } catch (e) { sfxInfo.msg = 'network error'; } }
  return resp({ shadowfax: sfxInfo, kvBound: kvOk, kvList: listOk, kvListCount: listCount, kvListErr: listErr, userIndex: Array.isArray(idx) ? idx.length : 0, sessionSecret: !!env.SESSION_SECRET, setupKey: !!env.SETUP_KEY, razorpay: !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET), razorpayInfo: rz, delhivery: dlvConfigured(env), delhiveryClient: !!env.DELHIVERY_CLIENT, delhiveryPickup: !!env.DELHIVERY_PICKUP });
}


// ---- Delhivery shipping: live quote + book (order create + manifest) + pickup request ----
// Delhivery's own charge is read live from their API and our margin (10-30%) is added automatically.
async function dlvJson(env, method, path, bodyObj) {
  const base = env.DELHIVERY_BASE || 'https://track.delhivery.com';
  const r = await fetch(base + path, { method: method, headers: { 'Authorization': 'Token ' + env.DELHIVERY_TOKEN, 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(bodyObj) });
  const raw = await r.text(); let data = null; try { data = JSON.parse(raw); } catch (e) {}
  return { ok: r.ok, code: r.status, raw: raw, data: data };
}
async function shipMargin(me, body) {
  const c = (await kget('cfg_dlv_cfg')) || {};
  const def = clamp(num(c.marginPct || 15), 10, 30);
  if (me.role === 'admin' && body.marginOverride !== undefined && body.marginOverride !== null && body.marginOverride !== '') { return clamp(num(body.marginOverride), 10, 30); }
  return def;
}
function shipInput(body) {
  const o = String(body.o_pin || '').trim(), d = String(body.d_pin || '').trim();
  if (!/^[1-9]\d{5}$/.test(o) || !/^[1-9]\d{5}$/.test(d)) { fail(400, 'Pickup & Destination pincode (6 இலக்கம்) தேவை.'); }
  const grams = Math.round(num(body.weight_g));
  if (grams < 1 || grams > 500000) { fail(400, 'Weight (grams) 1 முதல் 5,00,000 வரை இருக்க வேண்டும்.'); }
  const cod = body.payment === 'COD';
  const codAmt = cod ? rnd2(num(body.cod_amount)) : 0;
  if (cod && codAmt <= 0) { fail(400, 'COD தொகை உள்ளிடவும்.'); }
  return { o: o, d: d, grams: grams, md: body.mode === 'E' ? 'E' : 'S', cod: cod, codAmt: codAmt, gstType: body.gstType === 'CGST_SGST' ? 'CGST_SGST' : 'IGST',
    qty: clamp(Math.round(num(body.qty || 1)), 1, 999), value: rnd2(num(body.value)), desc: String(body.desc || 'Courier Shipment').trim().slice(0, 120),
    l: num(body.l), b: num(body.b), h: num(body.h) };
}
async function shipQuote(env, me, body, inp) {
  if (!dlvConfigured(env)) { fail(400, 'Delhivery API இன்னும் Admin set up செய்யவில்லை.'); }
  // destination serviceability
  let pinInfo = {};
  try {
    const pr = await dlv(env, 'GET', '/c/api/pin-codes/json/', { filter_codes: inp.d });
    const dc = pr.data && pr.data.delivery_codes;
    if (pr.ok && Array.isArray(dc)) {
      if (!dc.length) { fail(400, 'இந்த Destination pincode-க்கு Delhivery சேவை இல்லை.'); }
      const pc = (dc[0] && dc[0].postal_code) || {};
      if (inp.cod && pc.cod === 'N') { fail(400, 'இந்த pincode-ல் COD சேவை இல்லை. Prepaid தேர்வு செய்யவும்.'); }
      if (!inp.cod && pc.pre_paid === 'N') { fail(400, 'இந்த pincode-ல் Prepaid சேவை இல்லை.'); }
      pinInfo = { city: pc.city || pc.district || '' };
    }
  } catch (e) { if (e instanceof HttpError) { throw e; } }
  const r = await dlv(env, 'GET', '/api/kinko/v1/invoice/charges/.json', { cl: env.DELHIVERY_CLIENT || '', ss: 'Delivered', md: inp.md, pt: inp.cod ? 'COD' : 'Pre-paid', o_pin: inp.o, d_pin: inp.d, cgm: String(inp.grams) });
  if (!r.ok) { fail(502, 'Delhivery rate API error (HTTP ' + r.code + '): ' + r.raw.slice(0, 300)); }
  const row = Array.isArray(r.data) ? r.data[0] : r.data;
  if (!row || typeof row !== 'object') { fail(502, 'Delhivery rate படிக்க முடியவில்லை: ' + r.raw.slice(0, 200)); }
  const gross = num(row.gross_amount), total = num(row.total_amount);
  const cost = gross > 0 ? gross : total;
  if (!(cost > 0)) { fail(502, 'Delhivery rate கிடைக்கவில்லை: ' + r.raw.slice(0, 200)); }
  const mg = await shipMargin(me, body);
  const freight = rnd2(cost * (1 + mg / 100));
  const gstLines = inp.gstType === 'IGST' ? [{ label: 'IGST @ 18%', amt: rnd2(freight * 0.18) }] : [{ label: 'CGST @ 9%', amt: rnd2(freight * 0.09) }, { label: 'SGST @ 9%', amt: rnd2(freight * 0.09) }];
  const gstTotal = rnd2(gstLines.reduce((a, l) => a + l.amt, 0));
  const lines = [{ label: 'Delhivery ' + (inp.md === 'E' ? 'Express' : 'Surface') + ' shipping charge', basis: inp.grams + ' g, ' + inp.o + ' → ' + inp.d + ', ' + (inp.cod ? 'COD' : 'Prepaid'), amt: freight }];
  return { lines: lines, sub: freight, gstType: inp.gstType, gstLines: gstLines, gstTotal: gstTotal, total: rnd2(freight + gstTotal), pinInfo: pinInfo, cost: cost, marginPct: mg, marginAmt: rnd2(freight - cost), raw: row };
}
function publicQuote(q, me) {
  const out = { lines: q.lines, sub: q.sub, gstType: q.gstType, gstLines: q.gstLines, gstTotal: q.gstTotal, total: q.total, pinInfo: q.pinInfo };
  if (me.role === 'admin') { out.cost = q.cost; out.marginPct = q.marginPct; out.marginAmt = q.marginAmt; out.raw = q.raw; }
  return out;
}
async function dlvWalletLow(r, me) {
  if (!/wallet balance/i.test(String(r.raw || ''))) { return; }
  await pushNotification({ id: Date.now(), type: 'alert', by_user: me.username, customer: me.username, total: 0, message: 'Delhivery wallet balance low - recharge needed: ' + String(r.raw).slice(0, 160), created_at: istNow(), is_read: 0 });
  fail(502, 'BCI-ன் Delhivery prepaid wallet balance குறைவாக உள்ளது. Admin-க்கு தெரிவிக்கப்பட்டுள்ளது - Admin Delhivery wallet-ஐ recharge செய்த பின் மீண்டும் முயற்சிக்கவும்.');
}
async function mShip(ctx) {
  const { action, body, env, me, url } = ctx;
  needLogin(me);
  if (action === 'info') {
    const own = me.pickup_location || '';
    return resp({ configured: dlvConfigured(env), clientSet: !!env.DELHIVERY_CLIENT, pickup_location: me.role === 'admin' ? (own || env.DELHIVERY_PICKUP || '') : own, pickup_pin: me.pickup_pin || '', needsPickup: me.role !== 'admin' && !own });
  }
  if (action === 'cfg') { needAdmin(me); const c = (await kget('cfg_dlv_cfg')) || {}; return resp({ marginPct: clamp(num(c.marginPct || 15), 10, 30) }); }
  if (action === 'save_cfg') { needAdmin(me); await kput('cfg_dlv_cfg', { marginPct: clamp(num(body.marginPct || 15), 10, 30) }); return resp({ ok: true }); }
  if (action === 'warehouse_get') {
    let t = me;
    if (me.role === 'admin' && url.searchParams.get('user_id')) { t = await getUser(String(url.searchParams.get('user_id'))); if (!t) { fail(404, 'User not found'); } }
    return resp({ username: t.username, pickup_location: t.pickup_location || '', pickup_pin: t.pickup_pin || '', wh: t.wh || null });
  }
  if (action === 'warehouse_save') {
    if (!dlvConfigured(env)) { fail(400, 'Delhivery API இன்னும் Admin set up செய்யவில்லை.'); }
    let t = me;
    if (me.role === 'admin' && body.user_id) { t = await getUser(String(body.user_id)); if (!t) { fail(404, 'User not found'); } }
    const clean = (x, n) => String(x || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n);
    const f = { contact: clean(body.contact_person, 60), phone: String(body.phone || '').replace(/\D/g, '').slice(-10), email: clean(body.email, 80), address: clean(body.address, 200), city: clean(body.city, 60), state: clean(body.state, 60), pin: String(body.pin || '').trim() };
    if (!f.contact || f.phone.length !== 10 || f.address.length < 5 || !f.city || !f.state || !/^[1-9]\d{5}$/.test(f.pin)) { fail(400, 'Contact person, 10 இலக்க mobile, முகவரி, city, state, 6 இலக்க pincode அனைத்தும் தேவை.'); }
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) { fail(400, 'Email சரியாக இல்லை.'); }
    const exists = !!(t.wh && t.wh.synced && t.pickup_location);
    const name = exists ? t.pickup_location : ('BCI_' + t.username.toUpperCase()).slice(0, 40);
    const reg = env.DELHIVERY_CLIENT || '';
    const okRes = (r) => r.code < 400 && r.data && r.data.success !== false && !r.data.error;
    const errTxt = (r) => (r.data && (r.data.error || r.data.message || r.data.rmk)) ? JSON.stringify(r.data.error || r.data.message || r.data.rmk) : r.raw.slice(0, 300);
    let created = false;
    if (!exists) {
      const r = await dlvJson(env, 'POST', '/api/backend/clientwarehouse/create/', { name: name, email: f.email, phone: f.phone, address: f.address, city: f.city, state: f.state, country: 'India', pin: f.pin, contact_person: f.contact, registered_name: reg, return_address: f.address, return_pin: f.pin, return_city: f.city, return_state: f.state, return_country: 'India' });
      if (okRes(r)) { created = true; }
      else if (/exist/i.test(r.raw)) { created = false; }
      else { fail(502, 'Delhivery warehouse create failed: ' + errTxt(r)); }
    }
    if (exists || !created) {
      const e = await dlvJson(env, 'POST', '/api/backend/clientwarehouse/edit/', { name: name, phone: f.phone, address: f.address, pin: f.pin, registered_name: reg });
      if (!okRes(e)) { fail(502, 'Delhivery warehouse update failed: ' + errTxt(e)); }
    }
    t.pickup_location = name; t.pickup_pin = f.pin;
    t.wh = { contact: f.contact, phone: f.phone, email: f.email, address: f.address, city: f.city, state: f.state, pin: f.pin, synced: true, at: istNow() };
    await kput('usr_' + t.username, t);
    await pushNotification({ id: Date.now(), type: 'warehouse', by_user: t.username, customer: t.username, total: 0, message: 'Pickup address ' + (created ? 'registered' : 'updated') + ': ' + t.username + ' (' + f.city + ')', created_at: istNow(), is_read: 0 });
    return resp({ ok: true, name: name, created: created });
  }
  if (action === 'quote') {
    const inp = shipInput(body);
    return resp(publicQuote(await shipQuote(env, me, body, inp), me));
  }
  if (action === 'book') {
    const inp = shipInput(body);
    const name = String(body.name || '').trim().slice(0, 100), phone = String(body.phone || '').replace(/\D/g, '').slice(-10);
    const addr = String(body.addr || '').trim().slice(0, 200), city = String(body.city || '').trim().slice(0, 60), state = String(body.state || '').trim().slice(0, 60);
    if (!name || phone.length !== 10 || addr.length < 5 || !city || !state) { fail(400, 'Consignee பெயர், 10 இலக்க மொபைல், முகவரி, city, state அனைத்தும் தேவை.'); }
    const pickupLoc = String(me.role === 'admin' ? (me.pickup_location || env.DELHIVERY_PICKUP || '') : (me.pickup_location || '')).trim();
    if (!pickupLoc) { fail(400, 'முதலில் உங்கள் Pickup Address-ஐ சேமிக்கவும் (Delhivery Ship tab -> My Pickup Address).'); }
    const q = await shipQuote(env, me, body, inp);
    const isAdmin = me.role === 'admin';
    if (!isAdmin) {
      const bal = await walletBalance(me.username);
      if (bal < q.total) { fail(402, 'போதிய Wallet Balance இல்லை. தற்போதைய Balance: ₹' + bal.toFixed(2) + '. இந்த Shipment-க்கு: ₹' + q.total.toFixed(2) + '. முதலில் Wallet Recharge செய்யவும்.'); }
    }
    const id = 'BCI' + String(Date.now()).slice(-8) + String(Math.floor(Math.random() * 90) + 10);
    const shipment = {
      name: name, add: addr, pin: inp.d, city: city, state: state, country: 'India', phone: phone, order: id, payment_mode: inp.cod ? 'COD' : 'Prepaid',
      return_pin: '', return_city: '', return_phone: '', return_add: '', return_state: '', return_country: '', products_desc: inp.desc, hsn_code: '',
      cod_amount: inp.cod ? inp.codAmt : 0, order_date: null, total_amount: inp.value || q.total, seller_add: '', seller_name: 'BIG CART INDIA', seller_inv: id,
      quantity: String(inp.qty), waybill: '', shipment_width: String(inp.b || ''), shipment_height: String(inp.h || ''), shipment_length: String(inp.l || ''),
      weight: String(inp.grams), shipping_mode: inp.md === 'E' ? 'Express' : 'Surface'
    };
    const r = await dlv(env, 'POST', '/api/cmu/create.json', null, { format: 'json', data: JSON.stringify({ shipments: [shipment], pickup_location: { name: pickupLoc } }) });
    const pk = r.data && r.data.packages && r.data.packages[0];
    const waybill = pk && pk.waybill ? String(pk.waybill) : '';
    if (r.code >= 400 || !waybill || (pk && pk.status && String(pk.status).toLowerCase() === 'fail')) {
      await dlvWalletLow(r, me);
      const why = pk && pk.remarks ? [].concat(pk.remarks).join('; ') : (r.data && r.data.rmk) ? String(r.data.rmk) : r.raw.slice(0, 300);
      fail(502, 'Delhivery order create failed: ' + why);
    }
    const created = istNow();
    if (!isAdmin && q.total > 0) { await walletMove('wdb_' + me.username, q.total, { t: created, type: 'debit', amount: q.total, ref: id, note: 'Delhivery shipment ' + id + ' (AWB ' + waybill + ')' }); }
    const kg = rnd2(inp.grams / 1000);
    const extra = { kind: 'cc', cat: 'Delhivery ' + (inp.md === 'E' ? 'Express' : 'Surface'), actual: kg, vol: 0, cw: kg, pcs: inp.qty, declared: inp.value, lines: q.lines, sub: q.sub, gstType: q.gstType, gstLines: q.gstLines, gstTotal: q.gstTotal, roundOff: 0, total: q.total, delhivery_waybill: waybill, dlv: { o_pin: inp.o, d_pin: inp.d, city: city, state: state, mode: inp.md, payment: inp.cod ? 'COD' : 'Prepaid', pickup_location: pickupLoc } };
    const inv = { id: id, created_at: created, customer: name, mobile: phone, addr: addr + ', ' + city + ', ' + state + ' - ' + inp.d, cust_type: 'B2C', gstin: '', pickup: inp.o, dest: inp.d + ' (' + city + ')', weight: kg, pieces: inp.qty, partner: 'Delhivery ' + (inp.md === 'E' ? 'Express' : 'Surface'), rate: rnd2(q.sub / (kg || 1)), sub_total: q.sub, gst: q.gstTotal, total: q.total, by_user: me.username, extra: extra };
    await kput('inv_' + id, inv);
    await kput('invm_' + id, { cost: q.cost, marginPct: q.marginPct, marginAmt: q.marginAmt });
    const idx = (await kget('invx_' + me.username)) || [];
    idx.unshift({ id: id, created_at: created, customer: name, cust_type: 'B2C', pickup: inp.o, dest: inv.dest, weight: kg, partner: inv.partner, total: q.total, by_user: me.username, waybill: waybill });
    await kput('invx_' + me.username, idx.slice(0, 600));
    await upsertCustomer(me.username, { name: name, mobile: phone, addr: addr, type: 'B2C' });
    await pushNotification({ id: Date.now(), type: 'shipment', invoice_id: id, customer: name, total: q.total, by_user: me.username, waybill: waybill, message: 'Delhivery shipment ' + waybill, created_at: created, is_read: 0 });
    return resp({ ok: true, invoice_id: id, waybill: waybill, total: q.total });
  }
  if (action === 'pickup') {
    if (!dlvConfigured(env)) { fail(400, 'Delhivery API இன்னும் Admin set up செய்யவில்லை.'); }
    const loc = String(me.role === 'admin' ? (me.pickup_location || env.DELHIVERY_PICKUP || '') : (me.pickup_location || '')).trim();
    if (!loc) { fail(400, 'முதலில் உங்கள் Pickup Address-ஐ சேமிக்கவும் (Delhivery Ship tab -> My Pickup Address).'); }
    const date = String(body.pickup_date || ''), time = String(body.pickup_time || '');
    const count = clamp(Math.round(num(body.expected_package_count || 1)), 1, 500);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < istNow().slice(0, 10)) { fail(400, 'Pickup date இன்று அல்லது எதிர்காலமாக இருக்க வேண்டும்.'); }
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(time)) { fail(400, 'Pickup time சரியாக இல்லை.'); }
    const r = await dlvJson(env, 'POST', '/fm/request/new/', { pickup_time: time.length === 5 ? time + ':00' : time, pickup_date: date, pickup_location: loc, expected_package_count: count });
    if (r.code >= 400 || !r.data || r.data.error) { await dlvWalletLow(r, me); fail(502, 'Delhivery pickup request failed: ' + ((r.data && (r.data.error || r.data.message)) ? JSON.stringify(r.data.error || r.data.message) : r.raw.slice(0, 300))); }
    const rec = { id: r.data.pickup_id || r.data.id || '', date: date, time: time, count: count, loc: loc, by_user: me.username, created_at: istNow() };
    const list = (await kget('pkr_' + me.username)) || []; list.unshift(rec); await kput('pkr_' + me.username, list.slice(0, 100));
    await pushNotification({ id: Date.now(), type: 'pickup', by_user: me.username, customer: me.username, total: 0, message: 'Pickup request: ' + me.username + ' - ' + count + ' pkg on ' + date + ' ' + time, created_at: rec.created_at, is_read: 0 });
    return resp({ ok: true, pickup: rec, raw: r.data });
  }
  if (action === 'list') {
    let rows = [], picks = [];
    if (me.role === 'admin') {
      const keys = (await userNames()).map((n) => 'invx_' + n); const lists = await Promise.all(keys.map((k) => kget(k))); lists.forEach((l) => { rows = rows.concat(l || []); });
      const pk = (await userNames()).map((n) => 'pkr_' + n); const pl = await Promise.all(pk.map((k) => kget(k))); pl.forEach((l) => { picks = picks.concat(l || []); });
    } else { rows = (await kget('invx_' + me.username)) || []; picks = (await kget('pkr_' + me.username)) || []; }
    rows = rows.filter((r) => r.waybill).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 100);
    picks = picks.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 50);
    return resp({ shipments: rows, pickups: picks });
  }
  fail(400, 'Unknown action');
}

// =====================================================================================
// Shadowfax (second courier partner). Completely separate from the Delhivery code above.
// Env: SHADOWFAX_TOKEN (required), SHADOWFAX_BASE (optional, default production).
// Shadowfax has no public rate API, so the price comes from an admin-maintained rate card
// (category based, like the B2C courier partners) + our margin (10-40%) + GST.
// =====================================================================================
const SFX_DEFAULT_RATES = { baseKg: 0.5, stepKg: 0.5, base: [0, 0, 0, 0, 0], add: [0, 0, 0, 0, 0], codFlat: 0, codPct: 0, volDivisor: 5000, marginPct: 15 };
const CC_MET = { DEL: ['110', '121', '122', '201'], MUM: ['400', '401', '410', '421'], BLR: ['560', '561', '562'], CHE: ['600', '601', '602', '603'], HYD: ['500', '501', '502'], KOL: ['700', '711', '712', '743'] };
const sfxConfigured = (env) => !!String(env.SHADOWFAX_TOKEN || '').trim();
function sfxBase(env) { return String(env.SHADOWFAX_BASE || 'https://dale.shadowfax.in/api').trim().replace(/\/+$/, ''); }
async function sfx(env, method, path, bodyObj) {
  const r = await fetch(sfxBase(env) + path, { method: method, headers: { 'Authorization': 'Token ' + String(env.SHADOWFAX_TOKEN || '').trim(), 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: bodyObj ? JSON.stringify(bodyObj) : undefined });
  const raw = await r.text(); let data = null; try { data = JSON.parse(raw); } catch (e) {}
  return { ok: r.ok, code: r.status, raw: raw, data: data };
}
function pinStateName(p) {
  const n = +p, n3 = +String(p).slice(0, 3), n2 = +String(p).slice(0, 2);
  if (n3 === 194) { return 'Ladakh'; } if (n2 === 18 || n2 === 19) { return 'Jammu & Kashmir'; } if (n3 === 744) { return 'Andaman & Nicobar'; }
  if (n3 === 737) { return 'Sikkim'; } if (n3 >= 790 && n3 <= 792) { return 'Arunachal Pradesh'; } if (n3 === 793 || n3 === 794) { return 'Meghalaya'; }
  if (n3 === 795) { return 'Manipur'; } if (n3 === 796) { return 'Mizoram'; } if (n3 === 797 || n3 === 798) { return 'Nagaland'; } if (n3 === 799) { return 'Tripura'; }
  if (n2 === 78) { return 'Assam'; } if (n2 === 17) { return 'Himachal Pradesh'; } if (n3 === 403) { return 'Goa'; } if (n2 === 11) { return 'Delhi'; } if (n3 === 160) { return 'Chandigarh'; }
  if (n2 === 12 || n2 === 13) { return 'Haryana'; } if (n2 >= 14 && n2 <= 16) { return 'Punjab'; }
  if ((n >= 605001 && n <= 605014) || n === 673310 || n === 533464 || n === 609601 || n === 609602) { return 'Puducherry'; }
  if (n3 === 682 && n >= 682551 && n <= 682559) { return 'Lakshadweep'; }
  if ([246, 248, 249, 262, 263].indexOf(n3) >= 0 || (n >= 244712 && n <= 244716) || (n >= 247656 && n <= 247670)) { return 'Uttarakhand'; }
  if (n2 >= 20 && n2 <= 28) { return 'Uttar Pradesh'; } if (n2 >= 30 && n2 <= 34) { return 'Rajasthan'; } if (n2 >= 36 && n2 <= 39) { return 'Gujarat'; }
  if (n2 >= 40 && n2 <= 44) { return 'Maharashtra'; } if (n2 >= 45 && n2 <= 48) { return 'Madhya Pradesh'; } if (n2 === 49) { return 'Chhattisgarh'; }
  if (n2 === 50) { return 'Telangana'; } if (n2 >= 51 && n2 <= 53) { return 'Andhra Pradesh'; } if (n2 >= 56 && n2 <= 59) { return 'Karnataka'; }
  if (n2 >= 60 && n2 <= 64) { return 'Tamil Nadu'; } if (n2 >= 67 && n2 <= 69) { return 'Kerala'; } if (n2 >= 70 && n2 <= 74) { return 'West Bengal'; }
  if (n2 >= 75 && n2 <= 77) { return 'Odisha'; }
  if (n2 >= 80 && n2 <= 85) { return ((n3 >= 814 && n3 <= 816) || n3 === 822 || (n3 >= 825 && n3 <= 835)) ? 'Jharkhand' : 'Bihar'; }
  return '';
}
function pinMetro(p) { const p3 = String(p).slice(0, 3); for (const k of Object.keys(CC_MET)) { if (CC_MET[k].indexOf(p3) >= 0) { return k; } } return ''; }
async function sfxCategory(o, d) {
  const ccc = (await cfg('cc_cfg')) || {}, SZ = (await cfg('state_zone')) || {};
  const so = pinStateName(o), sd = pinStateName(d);
  const spec = String(ccc.specialStates || '').split(',').map((x) => x.trim());
  if (sd && spec.indexOf(sd) >= 0) { return { c: 4, why: 'Special destination (' + sd + ')' }; }
  const mo = pinMetro(o), md = pinMetro(d);
  if ((mo && mo === md) || String(o).slice(0, 4) === String(d).slice(0, 4)) { return { c: 0, why: 'Same city' }; }
  const zo = so ? SZ[so] : '', zd = sd ? SZ[sd] : '';
  if (zo && zd && zo === zd) { return { c: 1, why: 'Same region (' + zo + ')' }; }
  if (mo && md) { return { c: 2, why: 'Metro to Metro' }; }
  return { c: 3, why: 'Rest of India' };
}
async function sfxRates() {
  const v = await kget('cfg_sfx_rates');
  return Object.assign({}, SFX_DEFAULT_RATES, (v && typeof v === 'object') ? v : {});
}
function sfxInput(body, addrPin) {
  const o = String(addrPin || body.o_pin || '').trim(), d = String(body.d_pin || '').trim();
  if (!/^[1-9]\d{5}$/.test(o) || !/^[1-9]\d{5}$/.test(d)) { fail(400, 'Pickup & Destination pincode (6 இலக்கம்) தேவை.'); }
  const grams = Math.round(num(body.weight_g));
  if (grams < 1 || grams > 100000) { fail(400, 'Weight (grams) 1 முதல் 1,00,000 வரை இருக்க வேண்டும்.'); }
  const cod = body.payment === 'COD', codAmt = cod ? rnd2(num(body.cod_amount)) : 0;
  if (cod && codAmt <= 0) { fail(400, 'COD தொகை உள்ளிடவும்.'); }
  const value = rnd2(num(body.value));
  if (value >= 50000 || codAmt >= 50000) { fail(400, 'Shadowfax-ல் ₹50,000 அல்லது அதற்கு மேற்பட்ட மதிப்புக்கு e-way bill தேவை - இந்த பதிப்பில் ஆதரவு இல்லை.'); }
  return { o: o, d: d, grams: grams, cod: cod, codAmt: codAmt, value: value, gstType: body.gstType === 'CGST_SGST' ? 'CGST_SGST' : 'IGST', l: num(body.l), b: num(body.b), h: num(body.h),
    desc: String(body.desc || 'Courier Shipment').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, 100), qty: clamp(Math.round(num(body.qty || 1)), 1, 99) };
}
async function sfxServiceable(env, pin) {
  const r = await sfx(env, 'GET', '/v1/clients/serviceability/?service=marketplace&pincodes=' + pin);
  if (r.code === 401 || r.code === 403) { fail(502, 'Shadowfax token தவறானது அல்லது அனுமதி இல்லை (HTTP ' + r.code + ').'); }
  if (!r.ok) { fail(502, 'Shadowfax serviceability error (HTTP ' + r.code + '): ' + r.raw.slice(0, 200)); }
  const rows = Array.isArray(r.data) ? r.data : ((r.data && (r.data.results || r.data.data)) || []);
  return Array.isArray(rows) && rows.some((x) => String(x.code) === String(pin));
}
async function sfxQuote(env, me, body, inp) {
  if (!sfxConfigured(env)) { fail(400, 'Shadowfax இன்னும் Admin set up செய்யவில்லை (SHADOWFAX_TOKEN).'); }
  const rc = await sfxRates();
  if (!(num(rc.base[0]) > 0 || num(rc.base[1]) > 0 || num(rc.base[2]) > 0 || num(rc.base[3]) > 0)) { fail(400, 'Shadowfax rate card இன்னும் set செய்யப்படவில்லை (Admin: Rate Master -> Shadowfax).'); }
  if (!(await sfxServiceable(env, inp.d))) { fail(400, 'இந்த Destination pincode-க்கு Shadowfax சேவை இல்லை.'); }
  const cat = await sfxCategory(inp.o, inp.d);
  const actual = inp.grams / 1000, vol = (inp.l > 0 && inp.b > 0 && inp.h > 0) ? (inp.l * inp.b * inp.h) / num(rc.volDivisor || 5000) : 0;
  const cw = rnd2(Math.max(actual, vol));
  const baseKg = num(rc.baseKg) || 0.5, step = num(rc.stepKg) || 0.5;
  const base = num(rc.base[cat.c]), add = num(rc.add[cat.c]);
  if (!(base > 0)) { fail(400, 'இந்த பாதைக்கான (' + cat.why + ') Shadowfax rate set செய்யப்படவில்லை.'); }
  const steps = cw <= baseKg ? 0 : Math.ceil((cw - baseKg) / step - 1e-7);
  const cost = rnd2(base + steps * add);
  const codFee = inp.cod ? rnd2(Math.max(num(rc.codFlat), inp.codAmt * num(rc.codPct) / 100)) : 0;
  let mg = clamp(num(rc.marginPct || 15), 10, 40);
  if (me.role === 'admin' && body.marginOverride !== undefined && body.marginOverride !== null && body.marginOverride !== '') { mg = clamp(num(body.marginOverride), 10, 40); }
  const freight = rnd2(cost * (1 + mg / 100)), sub = rnd2(freight + codFee);
  const gstLines = inp.gstType === 'IGST' ? [{ label: 'IGST @ 18%', amt: rnd2(sub * 0.18) }] : [{ label: 'CGST @ 9%', amt: rnd2(sub * 0.09) }, { label: 'SGST @ 9%', amt: rnd2(sub * 0.09) }];
  const gstTotal = rnd2(gstLines.reduce((a, l) => a + l.amt, 0));
  const lines = [{ label: 'Shadowfax shipping charge', basis: cw + ' kg chargeable, ' + cat.why + ', ' + inp.o + ' → ' + inp.d, amt: freight }];
  if (codFee > 0) { lines.push({ label: 'COD handling charge', basis: 'COD ₹' + inp.codAmt, amt: codFee }); }
  return { lines: lines, sub: sub, gstType: inp.gstType, gstLines: gstLines, gstTotal: gstTotal, total: rnd2(sub + gstTotal), cw: cw, category: cat.why, cost: rnd2(cost + codFee), marginPct: mg, marginAmt: rnd2(freight - cost) };
}
function sfxPublicQuote(q, me) {
  const out = { lines: q.lines, sub: q.sub, gstType: q.gstType, gstLines: q.gstLines, gstTotal: q.gstTotal, total: q.total, cw: q.cw };
  if (me.role === 'admin') { out.cost = q.cost; out.marginPct = q.marginPct; out.marginAmt = q.marginAmt; out.category = q.category; }
  return out;
}
function sfxAddr(u) {
  const a = u.sfx_addr || (u.wh ? { contact: u.wh.contact, phone: u.wh.phone, address: u.wh.address, city: u.wh.city, state: u.wh.state, pin: u.wh.pin } : null);
  return a && a.contact && a.phone && a.address && a.city && a.pin ? a : null;
}
async function sfxOwns(me, awb) {
  if (me.role === 'admin') { return true; }
  const rows = (await kget('invx_' + me.username)) || [];
  return rows.some((r) => r.awb_sfx === awb);
}
async function mSfx(ctx) {
  const { action, body, env, me, url } = ctx;
  needLogin(me);
  const q = (k) => String(url.searchParams.get(k) || '').trim();
  if (action === 'info') {
    const rc = await sfxRates();
    return resp({ configured: sfxConfigured(env), rateReady: num(rc.base[0]) > 0 || num(rc.base[3]) > 0, address: sfxAddr(me), marginMax: 40 });
  }
  if (action === 'cfg') { needAdmin(me); return resp({ rates: await sfxRates() }); }
  if (action === 'save_cfg') {
    needAdmin(me);
    const r = body.rates || {}, arr = (a) => (Array.isArray(a) ? a : []).slice(0, 5).concat([0, 0, 0, 0, 0]).slice(0, 5).map((x) => Math.max(0, num(x)));
    await kput('cfg_sfx_rates', { baseKg: Math.max(0.1, num(r.baseKg) || 0.5), stepKg: Math.max(0.1, num(r.stepKg) || 0.5), base: arr(r.base), add: arr(r.add), codFlat: Math.max(0, num(r.codFlat)), codPct: Math.max(0, num(r.codPct)), volDivisor: Math.max(1000, num(r.volDivisor) || 5000), marginPct: clamp(num(r.marginPct || 15), 10, 40) });
    return resp({ ok: true });
  }
  if (action === 'address_save') {
    const clean = (x, n) => String(x || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n);
    const a = { contact: clean(body.contact_person, 60), phone: String(body.phone || '').replace(/\D/g, '').slice(-10), address: clean(body.address, 200), city: clean(body.city, 50), state: clean(body.state, 40), pin: String(body.pin || '').trim() };
    if (!a.contact || a.phone.length !== 10 || a.address.length < 5 || !a.city || !/^[1-9]\d{5}$/.test(a.pin)) { fail(400, 'Contact person, 10 இலக்க mobile, முகவரி, city, 6 இலக்க pincode தேவை.'); }
    const u = await getUser(me.username); u.sfx_addr = a; await kput('usr_' + u.username, u);
    return resp({ ok: true });
  }
  if (action === 'quote') {
    const a = sfxAddr(me);
    return resp(sfxPublicQuote(await sfxQuote(env, me, body, sfxInput(body, a ? a.pin : '')), me));
  }
  if (action === 'book') {
    const a = sfxAddr(me);
    if (!a) { fail(400, 'முதலில் உங்கள் Pickup Address-ஐ சேமிக்கவும் (Shadowfax tab -> My Pickup Address).'); }
    const inp = sfxInput(body, a.pin);
    const name = String(body.name || '').trim().slice(0, 100), phone = String(body.phone || '').replace(/\D/g, '').slice(-10);
    const addr = String(body.addr || '').trim().slice(0, 200), city = String(body.city || '').trim().slice(0, 50), state = String(body.state || '').trim().slice(0, 40);
    if (!name || phone.length !== 10 || addr.length < 5 || !city) { fail(400, 'Consignee பெயர், 10 இலக்க மொபைல், முகவரி, city தேவை.'); }
    const qt = await sfxQuote(env, me, body, inp);
    const isAdmin = me.role === 'admin';
    if (!isAdmin) {
      const bal = await walletBalance(me.username);
      if (bal < qt.total) { fail(402, 'போதிய Wallet Balance இல்லை. தற்போதைய Balance: ₹' + bal.toFixed(2) + '. இந்த Shipment-க்கு: ₹' + qt.total.toFixed(2) + '. முதலில் Wallet Recharge செய்யவும்.'); }
    }
    const id = 'BCI' + String(Date.now()).slice(-8) + String(Math.floor(Math.random() * 90) + 10);
    const pv = Math.max(1, inp.value || 1);
    const payload = {
      customer_details: { name: name, contact: phone, address_line_1: addr, city: city.toUpperCase(), pincode: Number(inp.d), state: state },
      order_details: { client_order_id: id, product_value: pv, payment_mode: inp.cod ? 'cod' : 'prepaid', cod_amount: inp.cod ? inp.codAmt : 0, order_service: 'Regular', actual_weight: rnd2(inp.grams / 1000), volumetric_weight: rnd2(qt.cw) },
      pickup_details: { pickup_type: 'seller', name: a.contact, contact: a.phone, address_line_1: a.address, city: String(a.city).toUpperCase(), pincode: Number(a.pin) },
      return_details: { return_type: 'seller', name: a.contact, contact: a.phone, address_line_1: a.address, city: String(a.city).toUpperCase(), pincode: Number(a.pin) },
      product_details: [{ sku_name: inp.desc, sku_id: 'SKU-' + id, price: pv, category: 'General', hsn_code: '', invoice_no: id }],
      order_type: 'marketplace'
    };
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(body.pickup_date || ''))) { payload.pickup_details.pickup_date = body.pickup_date; }
    const r = await sfx(env, 'POST', '/v3/clients/orders/', payload);
    const awb = r.data && r.data.data && r.data.data.awb_number ? String(r.data.data.awb_number) : '';
    if (r.code === 401 || r.code === 403) { fail(502, 'Shadowfax token தவறானது அல்லது அனுமதி இல்லை (HTTP ' + r.code + ').'); }
    if (!r.data || r.data.message !== 'Success' || !awb) {
      const why = r.data && r.data.errors ? (typeof r.data.errors === 'string' ? r.data.errors : JSON.stringify(r.data.errors)) : r.raw.slice(0, 300);
      fail(502, 'Shadowfax order create failed: ' + why);
    }
    const created = istNow();
    if (!isAdmin && qt.total > 0) { await walletMove('wdb_' + me.username, qt.total, { t: created, type: 'debit', amount: qt.total, ref: id, note: 'Shadowfax shipment ' + id + ' (AWB ' + awb + ')' }); }
    const kg = rnd2(inp.grams / 1000);
    const extra = { kind: 'cc', cat: 'Shadowfax', actual: kg, vol: rnd2(qt.cw > kg ? qt.cw : 0), cw: qt.cw, pcs: inp.qty, declared: inp.value, lines: qt.lines, sub: qt.sub, gstType: qt.gstType, gstLines: qt.gstLines, gstTotal: qt.gstTotal, roundOff: 0, total: qt.total, sfx_awb: awb, sfx: { o_pin: inp.o, d_pin: inp.d, city: city, state: state, payment: inp.cod ? 'COD' : 'Prepaid' } };
    const inv = { id: id, created_at: created, customer: name, mobile: phone, addr: addr + ', ' + city + (state ? ', ' + state : '') + ' - ' + inp.d, cust_type: 'B2C', gstin: '', pickup: inp.o, dest: inp.d + ' (' + city + ')', weight: kg, pieces: inp.qty, partner: 'Shadowfax', rate: rnd2(qt.sub / (kg || 1)), sub_total: qt.sub, gst: qt.gstTotal, total: qt.total, by_user: me.username, extra: extra };
    await kput('inv_' + id, inv);
    await kput('invm_' + id, { cost: qt.cost, marginPct: qt.marginPct, marginAmt: qt.marginAmt });
    const idx = (await kget('invx_' + me.username)) || [];
    idx.unshift({ id: id, created_at: created, customer: name, cust_type: 'B2C', pickup: inp.o, dest: inv.dest, weight: kg, partner: 'Shadowfax', total: qt.total, by_user: me.username, awb_sfx: awb });
    await kput('invx_' + me.username, idx.slice(0, 600));
    await upsertCustomer(me.username, { name: name, mobile: phone, addr: addr, type: 'B2C' });
    await pushNotification({ id: Date.now(), type: 'shipment', courier: 'Shadowfax', invoice_id: id, customer: name, total: qt.total, by_user: me.username, waybill: awb, message: 'Shadowfax shipment ' + awb, created_at: created, is_read: 0 });
    return resp({ ok: true, invoice_id: id, awb: awb, total: qt.total });
  }
  if (action === 'label') {
    if (!sfxConfigured(env)) { fail(400, 'Shadowfax set up செய்யப்படவில்லை.'); }
    const awb = q('awb'); if (!/^[A-Za-z0-9]+$/.test(awb)) { fail(400, 'awb required'); }
    if (!(await sfxOwns(me, awb))) { fail(403, 'forbidden'); }
    const r = await sfx(env, 'POST', '/client/generate_label/', { awb_number: awb, file_type: 'pdf' });
    const lu = r.data && r.data.data && r.data.data.label_url;
    if (!lu) { fail(502, 'Shadowfax label கிடைக்கவில்லை: ' + ((r.data && (r.data.message || r.data.errors)) ? JSON.stringify(r.data.message || r.data.errors) : r.raw.slice(0, 200))); }
    return resp({ label_url: lu });
  }
  if (action === 'track') {
    if (!sfxConfigured(env)) { fail(400, 'Shadowfax set up செய்யப்படவில்லை.'); }
    const awb = q('awb'); if (!/^[A-Za-z0-9]+$/.test(awb)) { fail(400, 'awb required'); }
    if (!(await sfxOwns(me, awb))) { fail(403, 'forbidden'); }
    const r = await sfx(env, 'GET', '/v4/clients/orders/' + awb + '/track/');
    if (!r.ok || !r.data) { fail(502, 'Shadowfax track failed (HTTP ' + r.code + '): ' + r.raw.slice(0, 200)); }
    const od = r.data.order_details || {};
    return resp({ status: od.status_display || od.status || '', events: (r.data.tracking_details || []).slice(-8).reverse().map((e) => ({ at: e.created, location: e.location, status: e.status, remarks: e.remarks })) });
  }
  if (action === 'list') {
    let rows = [];
    if (me.role === 'admin') { const keys = (await userNames()).map((n) => 'invx_' + n); const lists = await Promise.all(keys.map((k) => kget(k))); lists.forEach((l) => { rows = rows.concat(l || []); }); }
    else { rows = (await kget('invx_' + me.username)) || []; }
    rows = rows.filter((r) => r.awb_sfx).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 100);
    return resp({ shipments: rows });
  }
  fail(400, 'Unknown action');
}

const MODULES = { sfx: mSfx, ship: mShip, auth: mAuth, users: mUsers, customers: mCustomers, kv: mKv, cc: mCc, b2b: mB2b, invoices: mInvoices, notifications: mNotifications, wallet: mWallet, delhivery: mDelhivery, system: mSystem };

async function handle(request, env) {
  const url = new URL(request.url);
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  const mod = (parts[0] || '').replace(/\.php$/, '');
  const action = url.searchParams.get('action') || parts[1] || '';
  if (!MODULES[mod]) { fail(404, 'Unknown API'); }
  let body = {};
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (request.headers.get('x-requested-with') !== 'bci') { fail(403, 'Forbidden'); }
    try { body = await request.json(); } catch (e) { body = {}; }
    if (!body || typeof body !== 'object') { body = {}; }
  }
  const me = await readSession(request, env);
  return MODULES[mod]({ action: action, body: body, url: url, env: env, request: request, me: me });
}

export async function onRequest(context) {
  try {
    return await handle(context.request, context.env || {});
  } catch (e) {
    if (e instanceof HttpError) { return resp({ error: e.message }, e.status); }
    return resp({ error: 'Server error: ' + (e && e.message ? e.message : String(e)) }, 500);
  }
}
