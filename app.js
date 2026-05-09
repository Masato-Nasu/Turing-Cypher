(() => {
  'use strict';

  const VERSION = 3;
  const APP_BUILD = 'turing-clean-text-ui-jp-en-2026-05-09';
  const BIT_COUNT = 128;
  const MAX_SLUG = 16;
  const VERIFIER_BITS = 24;
  const AP28_BINARY_THRESHOLD = 0.54;
  const AP28_EDGE_GAIN = 28;
  const PREFIXES = ['https://masato-lab.pages.dev/'];
  const PATH_CLASSES = ['', 'tools', 'portfolio', 'peripheral-memory', 'about'];
  const SLUG32 = 'abcdefghijklmnopqrstuvwxyz-01234';

  const $ = (id) => document.getElementById(id);
  const ui = {
    url: $('urlInput'), key: $('keyInput'), decodeKey: $('decodeKeyInput'), size: $('sizeInput'), steps: $('stepsInput'),
    generate: $('generateBtn'), decodeCurrent: $('decodeCurrentBtn'), download: $('downloadBtn'),
    file: $('fileInput'), decodeLoaded: $('decodeLoadedBtn'), canvas: $('canvas'),
    log: $('log'), badge: $('statusBadge'), meta: $('imageMeta'), fileName: $('fileName'),
    resultUrl: $('resultUrl'), resultStatusText: $('resultStatusText'), copyResult: $('copyResultBtn'),
    langJa: $('langJa'), langEn: $('langEn')
  };


  const STR = {
    ja: {
      subtitle: 'URLを、1枚の模様にします。同じ合い言葉で、あとからURLに戻せます。',
      leadTitle: 'できること',
      leadBody: 'URLを模様PNGにして、そのPNGからURLを読み出します。',
      encryptTitle: '模様を作る',
      encryptDesc: 'URLと合い言葉を入れて、暗号化された模様を作ります。',
      decryptTitle: 'URLに戻す',
      decryptDesc: 'PNGと、作った時と同じ合い言葉を入れます。',
      targetUrl: '入れるURL',
      targetUrlHint: '対応：masato-lab.pages.dev の tools / portfolio / peripheral-memory / about。slugは16文字まで。',
      keySeed: '合い言葉（暗号化用）',
      keySeedHint: 'この合い言葉がないと、あとでURLに戻せません。',
      decodeKeySeed: '合い言葉（復号用・必須）',
      decodeKeySeedHint: '画像を作った時と同じ合い言葉を入れてください。違うと読めません。',
      encryptButton: '模様を作る',
      downloadButton: 'PNGを保存',
      choosePng: 'PNGを選ぶ',
      noFile: 'まだ選んでいません',
      decryptLoaded: '選んだPNGを読む',
      decryptCurrent: '上の模様を読む',
      imageTitle: '模様',
      resultTitle: '読み出したURL',
      resultWaiting: 'ここに結果が出ます。',
      resultLabel: 'URL',
      copyResult: 'URLをコピー',
      detailsTitle: 'くわしいログを見る',
      guideTitle: '使い方',
      guide1: 'URLと合い言葉を入れて「模様を作る」を押します。',
      guide2: 'できたPNGを保存します。',
      guide3: '復号するときは、PNGを選び、同じ合い言葉を入れて「読む」を押します。',
            readyLog: 'Ready.\n\n1. URLを入れる\n2. 合い言葉を入れる\n3. 模様を作る\n4. PNGと同じ合い言葉で読む\n\n対応URL：\nhttps://masato-lab.pages.dev/{tools|portfolio|peripheral-memory|about}/slug\n\nSlug: 最大16文字。使用文字は a-z, hyphen, 0-4。',
      runningPacket: '暗号画像を作っています。少し待ってください。',
      generatedDecode: '模様ができました。読み取り確認中です。',
      decodingCurrent: '模様を読んでいます。',
      loadingPng: 'PNGを読み込み中です。',
      loadedPng: 'PNGを読み込みました。合い言葉を入れて「選んだPNGを読む」を押してください。',
      fileNone: 'まだ選んでいません',
      needUrl: 'URLを入れてください。',
      needKey: '合い言葉を入れてください。',
      needDecodeKey: '復号用の合い言葉を入れてください。',
      passMsg: '復号できました。URLは下に大きく表示されます。',
      failMsg: '読めませんでした。PNGか合い言葉を確認してください。',
      copied: 'コピーしました。'
    },
    en: {
      subtitle: 'Turn a URL into one pattern. Use the same passphrase to bring the URL back.',
      leadTitle: 'What it does',
      leadBody: 'For short MASATO-LAB URLs. Make a pattern PNG, then recover the URL from that PNG.',
      encryptTitle: 'Make pattern',
      encryptDesc: 'Enter a URL and passphrase to make an encrypted pattern.',
      decryptTitle: 'Back to URL',
      decryptDesc: 'Use the PNG and the same passphrase used to make it.',
      targetUrl: 'URL to put in',
      targetUrlHint: 'Supported: masato-lab.pages.dev tools / portfolio / peripheral-memory / about. Slug max 16 characters.',
      keySeed: 'Passphrase for making',
      keySeedHint: 'You need this passphrase later to recover the URL.',
      decodeKeySeed: 'Passphrase for reading / required',
      decodeKeySeedHint: 'Enter the same passphrase used to make the image. A different one will not work.',
      encryptButton: 'Make pattern',
      downloadButton: 'Save PNG',
      choosePng: 'Choose PNG',
      noFile: 'No file selected',
      decryptLoaded: 'Read selected PNG',
      decryptCurrent: 'Read shown pattern',
      imageTitle: 'Pattern',
      resultTitle: 'Recovered URL',
      resultWaiting: 'Result will appear here.',
      resultLabel: 'URL',
      copyResult: 'Copy URL',
      detailsTitle: 'Show technical log',
      guideTitle: 'How to use',
      guide1: 'Enter a URL and passphrase, then press “Make pattern.”',
      guide2: 'Save the PNG.',
      guide3: 'To decode, choose the PNG and enter the same passphrase.',
      capacityBody: 'This version is for short MASATO-LAB URLs. Long text and arbitrary URLs are separate research.',
      readyLog: 'Ready.\n\n1. Enter a URL\n2. Enter a passphrase\n3. Make a pattern\n4. Read it back with the same passphrase\n\nSupported URL:\nhttps://masato-lab.pages.dev/{tools|portfolio|peripheral-memory|about}/slug\n\nSlug: max 16 characters. Charset: a-z, hyphen, 0-4.',
      runningPacket: 'Making the encrypted image. Please wait a moment.',
      generatedDecode: 'Pattern created. Checking readability.',
      decodingCurrent: 'Reading the pattern.',
      loadingPng: 'Loading PNG.',
      loadedPng: 'PNG loaded. Enter the passphrase, then press “Read selected PNG.”',
      fileNone: 'No file selected',
      needUrl: 'Please enter a URL.',
      needKey: 'Please enter a passphrase.',
      needDecodeKey: 'Please enter the passphrase for reading.',
      passMsg: 'Decoded. The URL is shown clearly below.',
      failMsg: 'Could not read it. Check the PNG or passphrase.',
      copied: 'Copied.'
    }
  };

  let currentLang = localStorage.getItem('turing-cypher-lang');
  if (currentLang !== 'ja' && currentLang !== 'en') {
    currentLang = (navigator.language || '').toLowerCase().startsWith('ja') ? 'ja' : 'en';
  }
  function tr(key) { return (STR[currentLang] && STR[currentLang][key]) || STR.en[key] || key; }
  function applyLang(next = currentLang) {
    currentLang = next;
    localStorage.setItem('turing-cypher-lang', currentLang);
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (tr(key)) el.textContent = tr(key);
    });
    ui.langJa.classList.toggle('active', currentLang === 'ja');
    ui.langEn.classList.toggle('active', currentLang === 'en');
    if (ui.fileName && (!ui.file.files || !ui.file.files[0])) ui.fileName.textContent = tr('fileNone');
    if (ui.badge.textContent === 'READY') ui.log.textContent = tr('readyLog');
  }


  function resetInputsOnLoad() {
    if (ui.url) ui.url.value = '';
    if (ui.key) ui.key.value = '';
    if (ui.decodeKey) ui.decodeKey.value = '';
  }

  const ctx = ui.canvas.getContext('2d', { willReadFrequently: true });
  let loadedImage = null;

  function setLog(text, state = 'READY') {
    ui.log.textContent = text;
    ui.badge.textContent = state;
    ui.badge.className = 'status' + (state === 'PASS' ? ' pass' : state.startsWith('FAIL') || state === 'ERROR' ? ' fail' : '');
  }

  function clearResult() {
    if (ui.resultUrl) ui.resultUrl.value = '';
    if (ui.resultStatusText) {
      ui.resultStatusText.textContent = tr('resultWaiting');
      ui.resultStatusText.className = 'resultStatus';
    }
    if (ui.copyResult) ui.copyResult.disabled = true;
  }
  function showResult(res) {
    const ok = res && res.status === 'PASS' && res.verifierOk;
    if (ui.resultUrl) ui.resultUrl.value = res && res.url ? res.url : '';
    if (ui.resultStatusText) {
      ui.resultStatusText.textContent = ok ? tr('passMsg') : tr('failMsg');
      ui.resultStatusText.className = 'resultStatus ' + (ok ? 'passText' : 'failText');
    }
    if (ui.copyResult) ui.copyResult.disabled = !(res && res.url);
  }
  function currentExpectedUrl() {
    return '';
  }

  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

  function normalizeUrl(url) { return String(url || '').trim(); }
  function intBits(value, width) {
    const out = [];
    for (let shift = width - 1; shift >= 0; shift--) out.push((value >> shift) & 1);
    return out;
  }
  function bitsInt(bits) {
    let v = 0;
    for (const b of bits) v = (v << 1) | Number(b);
    return v;
  }
  function bytesToBits(bytes, n) {
    const out = [];
    for (const by of bytes) {
      for (let i = 7; i >= 0; i--) out.push((by >> i) & 1);
      if (n && out.length >= n) return out.slice(0, n);
    }
    return out;
  }
  async function sha256Bytes(str) {
    const data = new TextEncoder().encode(str);
    return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
  }
  async function hmacSha256Bytes(key, message) {
    const cryptoKey = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    return new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message)));
  }
  async function streamBits(key, nBits) {
    let out = [];
    let counter = 0;
    while (out.length < nBits) {
      out = out.concat(bytesToBits(await sha256Bytes(`AP52.2-PWA|stream|${key}|${counter++}`)));
    }
    return Uint8Array.from(out.slice(0, nBits));
  }
  async function verifierForUrl(url, key) {
    return Uint8Array.from(bytesToBits(await hmacSha256Bytes(key, 'AP52.2-PWA|verifier|' + url), VERIFIER_BITS));
  }

  function splitUrl(url) {
    url = normalizeUrl(url);
    for (let prefixId = 0; prefixId < PREFIXES.length; prefixId++) {
      const prefix = PREFIXES[prefixId];
      if (!url.startsWith(prefix)) continue;
      const rest = url.slice(prefix.length).replace(/^\/+|\/+$/g, '');
      if (rest === '') return { prefixId, pathId: 0, slug: '' };
      const parts = rest.split('/');
      const first = parts[0];
      const tail = parts.slice(1).join('/');
      for (let pathId = 1; pathId < PATH_CLASSES.length; pathId++) {
        if (first === PATH_CLASSES[pathId]) return { prefixId, pathId, slug: tail };
      }
      return { prefixId, pathId: 0, slug: rest };
    }
    throw new Error('対応していないURLです。https://masato-lab.pages.dev/ から始まるURLを入れてください。');
  }
  function urlFromParts(prefixId, pathId, slug) {
    if (prefixId < 0 || prefixId >= PREFIXES.length || pathId < 0 || pathId >= PATH_CLASSES.length) throw new Error('invalid dictionary id');
    const prefix = PREFIXES[prefixId];
    const path = PATH_CLASSES[pathId];
    if (path === '') return prefix + slug;
    return slug ? prefix + path + '/' + slug : prefix + path;
  }
  function slugValues(slug) {
    if (slug.length > MAX_SLUG) throw new Error(`slug is too long: ${slug.length} > ${MAX_SLUG}`);
    const vals = [];
    for (const ch of slug) {
      const idx = SLUG32.indexOf(ch);
      if (idx < 0) throw new Error(`slug character ${JSON.stringify(ch)} uses unsupported characters: ${SLUG32}`);
      vals.push(idx);
    }
    while (vals.length < MAX_SLUG) vals.push(0);
    return vals;
  }
  async function makePlainBits(url, key) {
    url = normalizeUrl(url);
    const { prefixId, pathId, slug } = splitUrl(url);
    const vals = slugValues(slug);
    let bits = [];
    bits = bits.concat(intBits(VERSION, 4));
    bits = bits.concat(intBits(prefixId, 3));
    bits = bits.concat(intBits(pathId, 4));
    bits = bits.concat(intBits(slug.length, 5));
    for (const v of vals) bits = bits.concat(intBits(v, 5));
    bits = bits.concat(intBits(0, 4));
    bits = bits.concat(intBits(0, 4));
    bits = bits.concat(Array.from(await verifierForUrl(url, key)));
    if (bits.length !== BIT_COUNT) throw new Error(`internal packet size mismatch: ${bits.length} bits`);
    return { plain: Uint8Array.from(bits), prefixId, pathId, slug };
  }
  async function buildPacket(url, key) {
    const { plain, prefixId, pathId, slug } = await makePlainBits(url, key);
    const stream = await streamBits(key, BIT_COUNT);
    const encrypted = new Uint8Array(BIT_COUNT);
    for (let i = 0; i < BIT_COUNT; i++) encrypted[i] = plain[i] ^ stream[i];
    return { url: normalizeUrl(url), plain, encrypted, prefixId, pathId, slug, verifier: await verifierForUrl(normalizeUrl(url), key) };
  }
  async function parsePlainBits(plain, key) {
    const b = Array.from(plain);
    let p = 0;
    const version = bitsInt(b.slice(p, p + 4)); p += 4;
    if (version !== VERSION) throw new Error('version mismatch');
    const prefixId = bitsInt(b.slice(p, p + 3)); p += 3;
    const pathId = bitsInt(b.slice(p, p + 4)); p += 4;
    const slugLen = bitsInt(b.slice(p, p + 5)); p += 5;
    if (slugLen > MAX_SLUG) throw new Error('invalid slug length');
    const vals = [];
    for (let i = 0; i < MAX_SLUG; i++) { vals.push(bitsInt(b.slice(p, p + 5))); p += 5; }
    const flags = bitsInt(b.slice(p, p + 4)); p += 4;
    const reserved = bitsInt(b.slice(p, p + 4)); p += 4;
    if (flags !== 0 || reserved !== 0) throw new Error('reserved bits are not zero');
    const verifier = b.slice(p, p + VERIFIER_BITS); p += VERIFIER_BITS;
    if (p !== BIT_COUNT) throw new Error('packet length mismatch');
    let slug = '';
    for (let i = 0; i < slugLen; i++) {
      if (vals[i] < 0 || vals[i] >= SLUG32.length) throw new Error('invalid slug code');
      slug += SLUG32[vals[i]];
    }
    const url = urlFromParts(prefixId, pathId, slug);
    const expectedVerifier = Array.from(await verifierForUrl(url, key));
    const verifierOk = verifier.every((x, i) => x === expectedVerifier[i]);
    return { url, verifierOk };
  }

  function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
  }
  function sfc32(a, b, c, d) {
    return function rand() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      d = (d + 1) | 0;
      t = (t + d) | 0;
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }
  function rngFor(seedText) {
    const s = cyrb128(seedText);
    return sfc32(s[0], s[1], s[2], s[3]);
  }
  function basisParams(i, key) {
    const r = rngFor(`AP52.2-PWA|basis|${key}|${i}`);
    const arr = [];
    for (let j = 0; j < 5; j++) {
      const angle = r() * Math.PI * 2;
      const freq = 2 + r() * 16;
      arr.push([
        Math.cos(angle) * freq,
        Math.sin(angle) * freq,
        r() * Math.PI * 2,
        (r() < 0.5 ? -1 : 1) * (0.7 + 0.6 * r())
      ]);
    }
    return arr;
  }
  function evalBasisAt(params, x, y) {
    let m = 0;
    for (const p of params) m += p[3] * Math.sin(Math.PI * 2 * (p[0] * x + p[1] * y) + p[2]);
    return m / Math.sqrt(params.length);
  }
  function generateBaseSeed(size, key) {
    const r = rngFor(`AP52.2-PWA|base|${key}|${size}`);
    const params = [];
    for (let j = 0; j < 32; j++) {
      const angle = r() * Math.PI * 2;
      const freq = 1 + r() * 10;
      params.push([
        Math.cos(angle) * freq,
        Math.sin(angle) * freq,
        r() * Math.PI * 2,
        (r() < 0.5 ? -1 : 1) * (0.5 + r())
      ]);
    }
    const out = new Float32Array(size * size);
    let mean = 0;
    for (let y = 0; y < size; y++) {
      const yy = y / size * 2 - 1;
      for (let x = 0; x < size; x++) {
        const xx = x / size * 2 - 1;
        let v = 0;
        for (const p of params) v += p[3] * Math.sin(Math.PI * 2 * (p[0] * xx + p[1] * yy) + p[2]);
        const idx = y * size + x;
        out[idx] = v;
        mean += v;
      }
    }
    mean /= out.length;
    let sq = 0;
    for (let i = 0; i < out.length; i++) { const d = out[i] - mean; out[i] = d; sq += d * d; }
    const sd = Math.sqrt(sq / out.length) || 1;
    for (let i = 0; i < out.length; i++) out[i] /= sd;
    return out;
  }
  function buildEncryptedField(bits, key, size) {
    const params = [];
    for (let i = 0; i < bits.length; i++) params.push(basisParams(i, key));
    const out = new Float32Array(size * size);
    const norm = Math.sqrt(bits.length);
    let mean = 0;
    for (let y = 0; y < size; y++) {
      const yy = y / size * 2 - 1;
      for (let x = 0; x < size; x++) {
        const xx = x / size * 2 - 1;
        let v = 0;
        for (let i = 0; i < bits.length; i++) v += (bits[i] ? 1 : -1) * evalBasisAt(params[i], xx, yy);
        v /= norm;
        const idx = y * size + x;
        out[idx] = v;
        mean += v;
      }
    }
    mean /= out.length;
    let sq = 0;
    for (let i = 0; i < out.length; i++) { const d = out[i] - mean; out[i] = d; sq += d * d; }
    const sd = Math.sqrt(sq / out.length) || 1;
    for (let i = 0; i < out.length; i++) out[i] /= sd;
    return out;
  }
  function percentileFromArray(arr, q) {
    const sorted = Array.from(arr).sort((a, b) => a - b);
    return sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor(sorted.length * q)))];
  }
  function generateGrayScott(encryptedBits, key, options) {
    const size = options.size || 256;
    const steps = options.steps || 1000;
    const deltaK = options.deltaK || 0.0020;
    const vBias = options.vBias || 0.030;
    const E = buildEncryptedField(encryptedBits, key, size);
    const seed = generateBaseSeed(size, key);
    let U = new Float32Array(size * size);
    let V = new Float32Array(size * size);
    U.fill(1);
    for (let i = 0; i < U.length; i++) {
      if (seed[i] > 0.9) { U[i] = 0.5; V[i] = 0.25; }
      V[i] = Math.max(0, Math.min(1, V[i] + vBias * Math.tanh(E[i] / 1.5)));
    }
    const kmap = new Float32Array(size * size);
    for (let i = 0; i < kmap.length; i++) kmap[i] = 0.0565 + deltaK * Math.tanh(E[i] / 2);
    const Du = 0.16, Dv = 0.08, F = 0.0290;
    let U2 = new Float32Array(size * size);
    let V2 = new Float32Array(size * size);
    for (let t = 0; t < steps; t++) {
      for (let y = 0; y < size; y++) {
        const ym = (y + size - 1) % size;
        const yp = (y + 1) % size;
        for (let x = 0; x < size; x++) {
          const xm = (x + size - 1) % size;
          const xp = (x + 1) % size;
          const idx = y * size + x;
          const u = U[idx];
          const v = V[idx];
          const Lu = U[ym * size + x] + U[yp * size + x] + U[y * size + xm] + U[y * size + xp] - 4 * u;
          const Lv = V[ym * size + x] + V[yp * size + x] + V[y * size + xm] + V[y * size + xp] - 4 * v;
          const uvv = u * v * v;
          let nu = u + Du * Lu - uvv + F * (1 - u);
          let nv = v + Dv * Lv + uvv - (F + kmap[idx]) * v;
          if ((t & 127) === 0) {
            if (nu < 0) nu = 0; else if (nu > 1) nu = 1;
            if (nv < 0) nv = 0; else if (nv > 1) nv = 1;
          }
          U2[idx] = nu;
          V2[idx] = nv;
        }
      }
      let tmp = U; U = U2; U2 = tmp;
      tmp = V; V = V2; V2 = tmp;
    }
    const lo = percentileFromArray(V, 0.02);
    const hi = percentileFromArray(V, 0.98);
    const norm = new Float32Array(size * size);
    for (let i = 0; i < V.length; i++) {
      let z = (V[i] - lo) / (hi - lo + 1e-9);
      if (z < 0) z = 0; else if (z > 1) z = 1;
      norm[i] = z;
    }
    // AP28-like output with softened ink edges.
    // The signal is still read from visible pixels only; this is not metadata,
    // LSB, alpha payload, or overlay. The soft edge only removes staircase
    // jaggies from the binary ink rendering.
    const threshold = percentileFromArray(norm, AP28_BINARY_THRESHOLD);
    const bytes = new Uint8ClampedArray(size * size);
    for (let i = 0; i < norm.length; i++) {
      const z = 1 / (1 + Math.exp(-(norm[i] - threshold) * AP28_EDGE_GAIN));
      bytes[i] = Math.round(10 + 235 * z);
    }
    return bytes;
  }
  function drawBytes(bytes, size) {
    ui.canvas.width = size;
    ui.canvas.height = size;
    const imageData = ctx.createImageData(size, size);
    for (let i = 0, j = 0; i < bytes.length; i++, j += 4) {
      const v = bytes[i];
      imageData.data[j] = v;
      imageData.data[j + 1] = v;
      imageData.data[j + 2] = v;
      imageData.data[j + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    ui.meta.textContent = `${size} × ${size}`;
  }
  function imageDataToField(imageData) {
    const n = imageData.width * imageData.height;
    const out = new Float32Array(n);
    let mean = 0;
    for (let i = 0, j = 0; i < n; i++, j += 4) {
      const v = (imageData.data[j] * 0.299 + imageData.data[j + 1] * 0.587 + imageData.data[j + 2] * 0.114) / 255;
      out[i] = v;
      mean += v;
    }
    mean /= n;
    let sq = 0;
    for (let i = 0; i < n; i++) { const d = out[i] - mean; out[i] = d; sq += d * d; }
    const sd = Math.sqrt(sq / n) || 1;
    for (let i = 0; i < n; i++) out[i] /= sd;
    return out;
  }
  function rawReadBits(field, key, size) {
    const raw = new Uint8Array(BIT_COUNT);
    const scores = new Float32Array(BIT_COUNT);
    const n = size * size;
    for (let i = 0; i < BIT_COUNT; i++) {
      const params = basisParams(i, key);
      let score = 0;
      for (let y = 0; y < size; y++) {
        const yy = y / size * 2 - 1;
        for (let x = 0; x < size; x++) {
          const xx = x / size * 2 - 1;
          score += evalBasisAt(params, xx, yy) * field[y * size + x];
        }
      }
      score /= n;
      scores[i] = score;
      raw[i] = score > 0 ? 1 : 0;
    }
    return { raw, scores };
  }
  function* combinations(items, r, start = 0, prefix = []) {
    if (prefix.length === r) { yield prefix.slice(); return; }
    for (let i = start; i < items.length; i++) {
      prefix.push(items[i]);
      yield* combinations(items, r, i + 1, prefix);
      prefix.pop();
    }
  }
  async function decodeField(field, key, expectedUrl, size, maxFlip = 4, weakCount = 18) {
    const { raw, scores } = rawReadBits(field, key, size);
    const weak = Array.from({ length: BIT_COUNT }, (_, i) => i)
      .sort((a, b) => Math.abs(scores[a]) - Math.abs(scores[b]))
      .slice(0, weakCount);
    const stream = await streamBits(key, BIT_COUNT);
    let bestVerifierUrl = null;
    let tested = 0;
    for (const orientation of [1, -1]) {
      const base = new Uint8Array(BIT_COUNT);
      for (let i = 0; i < BIT_COUNT; i++) base[i] = orientation === 1 ? raw[i] : 1 - raw[i];
      for (let r = 0; r <= maxFlip; r++) {
        for (const flips of combinations(weak, r)) {
          tested++;
          const enc = base.slice();
          for (const idx of flips) enc[idx] ^= 1;
          const plain = new Uint8Array(BIT_COUNT);
          for (let i = 0; i < BIT_COUNT; i++) plain[i] = enc[i] ^ stream[i];
          try {
            const parsed = await parsePlainBits(plain, key);
            const exact = !expectedUrl || normalizeUrl(parsed.url) === normalizeUrl(expectedUrl);
            if (parsed.verifierOk && exact) return { status: 'PASS', ...parsed, exactMatch: exact, orientation, flips, tested };
            if (parsed.verifierOk && !bestVerifierUrl) bestVerifierUrl = { status: 'FAIL_URL_MISMATCH', ...parsed, exactMatch: false, orientation, flips, tested };
          } catch (_) {}
        }
      }
    }
    return bestVerifierUrl || { status: 'FAIL', url: null, verifierOk: false, exactMatch: false, orientation: 0, flips: [], tested };
  }
  async function decodeCanvas(expectedUrl = currentExpectedUrl(), keyOverride = null) {
    const size = ui.canvas.width;
    if (!size) throw new Error('no image on canvas');
    const key = keyOverride !== null ? keyOverride : (ui.decodeKey ? ui.decodeKey.value : '');
    if (!String(key || '').trim()) throw new Error(tr('needDecodeKey'));
    const imageData = ctx.getImageData(0, 0, size, size);
    const field = imageDataToField(imageData);
    return decodeField(field, key, expectedUrl, size);
  }

  async function handleGenerate() {
    try {
      ui.generate.disabled = true;
      ui.decodeCurrent.disabled = true;
      ui.download.disabled = true;
      setLog(tr('runningPacket'), 'RUNNING');
      await sleep(40);
      const url = normalizeUrl(ui.url.value);
      const key = ui.key.value;
      if (!url) throw new Error(tr('needUrl'));
      if (!String(key || '').trim()) throw new Error(tr('needKey'));
      if (ui.decodeKey && !ui.decodeKey.value.trim()) ui.decodeKey.value = key;
      const size = Number(ui.size.value);
      const steps = Number(ui.steps.value);
      const packet = await buildPacket(url, key);
      setLog(`Turing Cypher packet\n  build      : ${APP_BUILD}\n  url        : ${packet.url}\n  prefix id  : ${packet.prefixId}\n  path id    : ${packet.pathId} (${PATH_CLASSES[packet.pathId]})\n  slug       : '${packet.slug}'\n  bits       : ${packet.encrypted.length} encrypted bits\n\nGenerating Gray-Scott field...`, 'RUNNING');
      await sleep(40);
      const bytes = generateGrayScott(packet.encrypted, key, { size, steps, deltaK: 0.0020, vBias: 0.030 });
      drawBytes(bytes, size);
      ui.download.disabled = false;
      ui.decodeCurrent.disabled = false;
      setLog(tr('generatedDecode'), 'RUNNING');
      await sleep(40);
      const res = await decodeCanvas(packet.url, key);
      printDecodeResult(res, 'self decode');
    } catch (err) {
      setLog(`ERROR\n${err.message || err}`, 'ERROR');
    } finally {
      ui.generate.disabled = false;
      ui.decodeCurrent.disabled = false;
    }
  }
  function printDecodeResult(res, title = 'decode') {
    const txt = `Turing Cypher ${title}\n  status     : ${res.status}\n  url        : ${res.url}\n  verifier OK: ${!!res.verifierOk}\n  URL verified: ${!!res.verifierOk}\n  orientation: ${res.orientation}\n  flips      : (${(res.flips || []).join(', ')})\n  tested     : ${res.tested || 0}`;
    setLog(txt, res.status || 'FAIL');
    showResult(res);
  }
  async function handleDecodeCurrent() {
    try {
      ui.decodeCurrent.disabled = true;
      if (!ui.decodeKey.value.trim()) throw new Error(tr('needDecodeKey'));
      setLog(tr('decodingCurrent'), 'RUNNING');
      await sleep(40);
      printDecodeResult(await decodeCanvas(currentExpectedUrl()), 'decode current');
    } catch (err) {
      setLog(`ERROR\n${err.message || err}`, 'ERROR');
    } finally {
      ui.decodeCurrent.disabled = false;
    }
  }
  function loadFileToCanvas(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedImage = img;
        const s = Math.max(img.naturalWidth, img.naturalHeight);
        ui.canvas.width = s;
        ui.canvas.height = s;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, s, s);
        ctx.drawImage(img, 0, 0, s, s);
        ui.meta.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
        ui.decodeLoaded.disabled = false;
        ui.decodeCurrent.disabled = false;
        resolve();
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  async function handleDecodeLoaded() {
    if (!loadedImage) return;
    await handleDecodeCurrent();
  }
  function downloadFileName() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    return `${stamp}-Turing-Cyper.png`;
  }
  function handleDownload() {
    ui.canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = downloadFileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  }

  ui.generate.addEventListener('click', handleGenerate);
  ui.decodeCurrent.addEventListener('click', handleDecodeCurrent);
  ui.decodeLoaded.addEventListener('click', handleDecodeLoaded);
  ui.download.addEventListener('click', handleDownload);
  ui.file.addEventListener('change', async () => {
    const file = ui.file.files && ui.file.files[0];
    if (ui.fileName) ui.fileName.textContent = file ? file.name : tr('fileNone');
    if (!file) return;
    try {
      clearResult();
      setLog(tr('loadingPng'), 'RUNNING');
      await loadFileToCanvas(file);
      setLog(tr('loadedPng'), 'READY');
    } catch (err) {
      setLog(`ERROR\n${err.message || err}`, 'ERROR');
    }
  });


  if (ui.copyResult) {
    ui.copyResult.addEventListener('click', async () => {
      const text = ui.resultUrl ? ui.resultUrl.value.trim() : '';
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const old = ui.copyResult.textContent;
        ui.copyResult.textContent = tr('copied');
        setTimeout(() => { ui.copyResult.textContent = tr('copyResult'); }, 900);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    });
  }

  ui.langJa.addEventListener('click', () => applyLang('ja'));
  ui.langEn.addEventListener('click', () => applyLang('en'));
  resetInputsOnLoad();
  clearResult();
  applyLang(currentLang);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=ap522-no-answer-url-1').catch(() => {}));
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }
})();
