
/**
 
 * @param {string} text  
 * @param {number} shift 
 * @returns {string}    
 */
function caesarShift(text, shift) {
  return text
    .toUpperCase()          
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      // Only transform A–Z (65–90)
      if (code >= 65 && code <= 90) {
        const x = code - 65;                     
        const shifted = ((x + shift) % 26 + 26) % 26;  
        return String.fromCharCode(shifted + 65);
      }
      
      return char;
    })
    .join('');
}

/**
 * @returns {{ text: string, valid: boolean, errors: string[] }}
 */
function buildPlaintext() {
  const name   = document.getElementById('fullname').value.trim();
  const year   = document.getElementById('year').value.trim();
  const course = document.getElementById('course').value.trim();

  const errors = [];
  if (!name)   errors.push('Full Name is required');
  if (!year)   errors.push('Year Level is required');
  if (!course) errors.push('Course is required');

  const combined = `${name} | ${year} | ${course}`.toUpperCase();
  return { text: combined, valid: errors.length === 0, errors };
}

/**
 * @returns {{ n: number, valid: boolean, error: string }}
 */
function getShift() {
  const raw = parseInt(document.getElementById('shift').value, 10);
  if (isNaN(raw) || raw < 1 || raw > 25) {
    return { n: 0, valid: false, error: 'Key N must be between 1 and 25' };
  }
  return { n: raw, valid: true, error: '' };
}


function showPlaintext() {
  const { text, valid } = buildPlaintext();
  const el = document.getElementById('plaintext-display');
  if (valid) {
    el.innerHTML = text;
  } else {
    el.innerHTML = '<span class="placeholder">Fill in your identity above…</span>';
  }
}

function setOutput(text, mode) {
  const el  = document.getElementById('output-display');
  const meta = document.getElementById('output-meta');
  el.classList.remove('flash', 'mode-decrypt');
  void el.offsetWidth; // reflow
  el.classList.add('flash');

  if (mode === 'decrypt') el.classList.add('mode-decrypt');

  el.innerHTML = text;
  meta.textContent = mode === 'encrypt'
    ? `▲ Encrypted with Key N = ${getShift().n}`
    : `▼ Decrypted with Key N = ${getShift().n}`;
}

function showError(msg) {
  const el  = document.getElementById('output-display');
  const meta = document.getElementById('output-meta');
  el.classList.remove('flash', 'mode-decrypt');
  void el.offsetWidth;
  el.classList.add('flash');
  el.innerHTML = `<span class="placeholder">⚠ ${msg}</span>`;
  meta.textContent = '';
}


function handleEncrypt() {
  const pt = buildPlaintext();
  if (!pt.valid) { showError(pt.errors[0]); return; }

  const sh = getShift();
  if (!sh.valid) { showError(sh.error); return; }

  showPlaintext();
  const cipher = caesarShift(pt.text, sh.n);
  setOutput(cipher, 'encrypt');
}

function handleDecrypt() {
  const pt = buildPlaintext();
  if (!pt.valid) { showError(pt.errors[0]); return; }

  const sh = getShift();
  if (!sh.valid) { showError(sh.error); return; }

  showPlaintext();
  const plain = caesarShift(pt.text, -sh.n);
  setOutput(plain, 'decrypt');
}


['fullname', 'year', 'course'].forEach(id => {
  document.getElementById(id).addEventListener('input', showPlaintext);
});

// Initialise on load
showPlaintext();
