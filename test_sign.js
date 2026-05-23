const crypto = require('crypto');

async function hmacSha256(key, data) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

async function deriveAesKey(seed, windowNum) {
  const key = Buffer.from(seed);
  const data = Buffer.from(String(windowNum));
  return await hmacSha256(key, data);
}

function b64UrlToBytes(input) {
  const s = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s + pad, 'base64');
}

async function decryptSignRefreshBlob(blob, aesSeed) {
  const parts = blob.split('.');
  const version = parts[0];
  const windowNum = parseInt(parts[1], 10);
  const nonce = b64UrlToBytes(parts[2]);
  const ciphertext = b64UrlToBytes(parts[3]);

  const aesKeyRaw = await deriveAesKey(aesSeed, windowNum);
  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKeyRaw, nonce);
  decipher.setAuthTag(ciphertext.slice(-16));
  const plaintext = Buffer.concat([decipher.update(ciphertext.slice(0, -16)), decipher.final()]);
  return JSON.parse(plaintext.toString());
}

function normalizeSignatureKey(key) {
  const k = String(key || '').trim().toLowerCase();
  if (k === 'pagesize') return 'pageSize';
  let out = '';
  let upperNext = false;
  for (const ch of String(key || '')) {
    if (ch === '_' || ch === '-') {
      upperNext = true;
      continue;
    }
    const c = ch.toLowerCase();
    if (upperNext) {
      out += c.toUpperCase();
      upperNext = false;
    } else {
      out += c;
    }
  }
  return out;
}

function toSignatureJsStringOrNull(key, v) {
  const keyLower = key.toLowerCase();
  if (v == null) return null;
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') {
    let num = v;
    if (keyLower === 'page' && num < 1) num = 1;
    if (keyLower === 'pagesize') num = Math.min(100, Math.max(1, num));
    return String(num);
  }
  if (typeof v === 'string') {
    const trimmed = v.trim();
    if (trimmed === '') return null;
    return trimmed; 
  }
  return String(v);
}

async function run() {
  const aesSeed = 'F2tIMkXbRMVkV6dar3qqVNoqFV-OKQNbrn99zSDp5zI';
  const baseUrl = 'http://localhost:8180'\;

  try {
    const initRes = await fetch(`${baseUrl}/security/sign/init`, {
      headers: { 'AppType': 'desktop' }
    });
    const initData = await initRes.json();
    const blob = initData.attach.sign_refresh;
    const info = await decryptSignRefreshBlob(blob, aesSeed);

    const ts = Date.now();
    const params = { page: 1, pagesize: 1, ts: ts, nonce: '12345678', sign: '123456789012345678901234' };
    const canon = {};
    for (const [k, v] of Object.entries(params)) {
        const kn = normalizeSignatureKey(k);
        if (kn === '' || kn === 'nonce' || kn === 'sign') continue;
        const vs = toSignatureJsStringOrNull(kn, v);
        if (vs !== null) canon[kn] = vs;
    }

    const sortedKeys = Object.keys(canon).sort();
    const pairs = sortedKeys.map(k => `${k}=${canon[k]}`);
    const backendPath = '/quotes';
    const content = `${backendPath}?${pairs.join('&')}`;
    const hashContentHex = crypto.createHash('sha256').update(content).digest('hex');
    const sig = crypto.createHmac('sha256', Buffer.from(info.sign_key_hex)).update(hashContentHex).digest('base64');

    const finalUrl = `${baseUrl}/quotes?page=1&pagesize=1&ts=${ts}&nonce=${params.nonce}&sign=${params.sign}`;
    const res = await fetch(finalUrl, {
      headers: {
        [info.sign_header_name]: `${info.sign_sig_prefix}${sig}`,
        'Soc-Fetch-Dest': 'empty; seg=rnbf'
      }
    });

    const body = await res.json();
    console.log('HTTP Status:', res.status);
    if (body.data && body.data.rows) {
        console.log('Total:', body.data.total, 'Rows length:', body.data.rows.length);
    } else {
        console.log('Response:', JSON.stringify(body));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

run();
