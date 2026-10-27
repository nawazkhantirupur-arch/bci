// BCI EXPRESS - single-file backend for EdgeOne Pages (Edge Function)
// Route: /api/*   (file: edge-functions/api/[[default]].js)
// Needs: KV namespace bound with variable name  bigcartindiabciexpress_kv
// Env vars (Project Settings > Environment Variables):
//   SESSION_SECRET (Nawaz1703), SETUP_KEY (MdNawaaz),
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
  try { const v = await KV().get(key, { type: 'json' }); return v === undefined ? null : v; }
  catch (e) { if (e instanceof HttpError) { throw e; } return null; }
}
async function kput(key, val) { await KV().put(key, JSON.stringify(val)); }
async function kdel(key) { await KV().delete(key); }
async function klist(prefix) {
  const out = []; let cursor;
  for (let i = 0; i < 20; i++) {
    const r = await KV().list({ prefix: prefix, limit: 256, cursor: cursor });
    (r.keys || []).forEach((k) => out.push(k.key));
    if (!r || r.complete || !r.cursor) { break; }
    cursor = r.cursor;
  }
  return out;
}

// ---------- config (defaults live in code; admin edits are stored in KV) ----------
const CFG_NAMES = ['zones', 'zonedef', 'rates_std', 'rates_bulk', 'b2b_zone', 'b2b_lanes', 'b2b_cfg', 'state_zone', 'cc_cfg', 'partners'];
async function cfg(name) {
  const v = await kget('cfg_' + name);
  if (v !== null) { return v; }
  if (name === 'rates_bulk') { return DEFAULTS.rates_std; }
  if (name === 'partners') { return [{ name: 'BCI Road Cargo', mode: 'Road' }, { name: 'BCI Air Express', mode: 'Air' }]; }
  return DEFAULTS[name];
}
async function ccPartners() {
  const v = await kget('cfg_cc_partners');
  return Array.isArray(v) ? v : DEFAULTS.cc_partners;
}

// ---------- users / session ----------
const USERNAME_RE = /^[a-z0-9_]{3,32}$/;
const pub = (u) => ({ id: u.username, username: u.username, role: u.role });
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
    return resp({ ok: true, message: 'Account உருவாக்கப்பட்டது. Admin approve செய்த பிறகு login செய்யலாம்.' });
  }
  if (action === 'logout') {
    return resp({ ok: true }, 200, { 'set-cookie': 'bci_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0' });
  }
  if (action === 'me') { return resp({ user: me ? pub(me) : null }); }
  fail(400, 'Unknown action');
}

async function allUsers() {
  const keys = await klist('usr_');
  const recs = await Promise.all(keys.map((k) => kget(k)));
  return recs.filter(Boolean);
}
async function mUsers(ctx) {
  const { action, body, me } = ctx;
  needAdmin(me);
  if (action === 'list' || action === 'pending') {
    let list = await allUsers();
    if (action === 'pending') { list = list.filter((u) => u.status === 'pending'); }
    const out = await Promise.all(list.map(async (u) => {
      const base = { id: u.username, username: u.username, email: u.email || '', role: u.role, status: u.status, location: u.location || '', created_at: u.created_at || '' };
      if (action === 'pending') { return base; }
      base.wallet_balance = u.role === 'admin' ? 0 : await walletBalance(u.username);
      base.last_login = (await kget('ll_' + u.username)) || null;
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
  if (action === 'add') {
    const username = String(body.username || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!USERNAME_RE.test(username)) { fail(400, 'Username: 3-32 letters (a-z), numbers, underscore மட்டும்.'); }
    if (password.length < 8) { fail(400, 'Password குறைந்தது 8 எழுத்துகள் இருக்க வேண்டும்.'); }
    if (await getUser(username)) { fail(409, 'Username already exists'); }
    const email = String(body.email || '').trim().toLowerCase();
    await kput('usr_' + username, { username: username, email: email, pass: await hashPassword(password), role: body.role === 'admin' ? 'admin' : 'vendor', status: 'approved', location: String(body.location || '').trim().slice(0, 80), created_at: istNow() });
    if (email) { await kput('eml_' + (await sha256Hex(email)).slice(0, 32), username); }
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
    if (u.role === 'admin' && (await allUsers()).filter((x) => x.role === 'admin').length <= 1) { fail(400, 'Cannot delete the last admin.'); }
    await kdel('usr_' + u.username);
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
    const keys = await klist('cus_');
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
    const owners = me.role === 'admin' ? (await klist('cus_')).map((k) => k.slice(4)) : [me.username];
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
      c.marginPct = clamp(num(c.marginPct || 15), 10, 20);
      await kput('cfg_cc_cfg', c);
    }
    return resp({ ok: true });
  }
  if (action === 'compare') {
    const cfgv = await cfg('cc_cfg');
    let mg = clamp(num(body.marginOverride !== undefined ? body.marginOverride : (cfgv.marginPct || 15)), 10, 20);
    if (me.role !== 'admin') { mg = clamp(num(cfgv.marginPct || 15), 10, 20); }
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
    if (body.cfg) { const c = Object.assign({}, body.cfg); c.markupPct = clamp(num(c.markupPct || 15), 10, 20); await kput('cfg_b2b_cfg', c); }
    return resp({ ok: true });
  }
  if (action !== 'calc') { fail(400, 'Unknown action'); }
  const C = await cfg('b2b_cfg'), ZONE = await cfg('b2b_zone'), LANES = await cfg('b2b_lanes');
  let mg = clamp(num(body.marginOverride !== undefined ? body.marginOverride : (C.markupPct || 15)), 10, 20);
  if (me.role !== 'admin') { mg = clamp(num(C.markupPct || 15), 10, 20); }
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
      const keys = await klist('invx_');
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
    await pushNotification({ id: Date.now(), invoice_id: id, customer: inv.customer, total: total, by_user: me.username, created_at: created, is_read: 0 });
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
    method: method, headers: { 'Authorization': 'Basic ' + btoa(env.RAZORPAY_KEY_ID + ':' + env.RAZORPAY_KEY_SECRET), 'Content-Type': 'application/json' },
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
  if (action === 'key') { return resp({ key_id: env.RAZORPAY_KEY_ID || '', configured: !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) }); }
  if (action === 'create_order') {
    if (me.role === 'admin') { fail(400, 'Admin accounts do not use a wallet.'); }
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) { fail(400, 'Razorpay is not configured by admin yet. Use manual wallet top-up.'); }
    const amount = rnd2(num(body.amount));
    if (amount < 1) { fail(400, 'Minimum recharge amount is ₹1'); }
    if (amount > 100000) { fail(400, 'Maximum single recharge is ₹1,00,000'); }
    const r = await rzp(env, 'POST', '/v1/orders', { amount: Math.round(amount * 100), currency: 'INR', receipt: ('w_' + me.username + '_' + Date.now()).slice(0, 40), notes: { username: me.username } });
    if (!r.ok || !r.data || !r.data.id) { fail(502, 'Razorpay order creation failed: ' + (r.data && r.data.error ? r.data.error.description : 'HTTP ' + r.status)); }
    return resp({ order_id: r.data.id, amount: r.data.amount, currency: r.data.currency, key_id: env.RAZORPAY_KEY_ID });
  }
  if (action === 'verify') {
    if (!env.RAZORPAY_KEY_SECRET) { fail(400, 'Razorpay is not configured.'); }
    const orderId = String(body.razorpay_order_id || ''), payId = String(body.razorpay_payment_id || ''), sig = String(body.razorpay_signature || '');
    if (!/^order_[A-Za-z0-9]+$/.test(orderId) || !/^pay_[A-Za-z0-9]+$/.test(payId) || !sig) { fail(400, 'Missing payment details'); }
    if (!safeEq(await hmacHex(env.RAZORPAY_KEY_SECRET, orderId + '|' + payId), sig)) { fail(400, 'Payment signature verification failed'); }
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
  return resp({ kvBound: kvOk, sessionSecret: !!env.SESSION_SECRET, setupKey: !!env.SETUP_KEY, razorpay: !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET), delhivery: dlvConfigured(env), delhiveryClient: !!env.DELHIVERY_CLIENT, delhiveryPickup: !!env.DELHIVERY_PICKUP });
}

const MODULES = { auth: mAuth, users: mUsers, customers: mCustomers, kv: mKv, cc: mCc, b2b: mB2b, invoices: mInvoices, notifications: mNotifications, wallet: mWallet, delhivery: mDelhivery, system: mSystem };

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
