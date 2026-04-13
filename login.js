// ── SET MAX DATE (today) ───────────────────────────────────────────────────
(function () {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('birthDate').setAttribute('max', today);
})();
 
// ── CHECK IF ALREADY VERIFIED ──────────────────────────────────────────────
// Se o usuário já passou pela verificação nesta sessão, vai direto pro site
(function () {
  const verified = sessionStorage.getItem('rw_age_verified');
  if (verified === 'true') {
    window.location.href = 'index.html';
  }
})();
 
// ── AGE VERIFICATION ───────────────────────────────────────────────────────
function handleAgeVerify(e) {
  e.preventDefault();
 
  const birthInput = document.getElementById('birthDate').value;
  if (!birthInput) {
    return showMsg('msgAge', '⚠ Por favor, insira sua data de nascimento.', 'error');
  }
 
  const birthDate = new Date(birthInput);
  const today = new Date();
 
  // Calcula idade considerando mês e dia exatos
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
 
  if (age < 12) {
    // ACESSO NEGADO
    document.getElementById('ageCard').style.display = 'none';
    document.getElementById('deniedCard').style.display = 'block';
    return;
  }
 
  // ACESSO LIBERADO — marca verificação na sessão
  sessionStorage.setItem('rw_age_verified', 'true');
  showMsg('msgAge', '✔ Idade verificada! Redirecionando...', 'success');
 
  const card = document.getElementById('ageCard');
  setTimeout(() => {
    card.style.opacity = '0';
    setTimeout(() => (window.location.href = 'index.html'), 700);
  }, 1200);
}
 
// ── RESET AGE CHECK ────────────────────────────────────────────────────────
function resetAgeCheck() {
  document.getElementById('deniedCard').style.display = 'none';
  document.getElementById('ageCard').style.display = 'block';
  document.getElementById('birthDate').value = '';
  clearMsgs();
}
 
// ── MESSAGE HELPERS ────────────────────────────────────────────────────────
function clearMsgs() {
  document.querySelectorAll('.msg').forEach(m => { m.className = 'msg'; m.textContent = ''; });
}
 
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'msg ' + type;
}
 
// ── RIPPLE EFFECT ──────────────────────────────────────────────────────────
document.querySelectorAll('.btn-main').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const r = document.createElement('span');
    r.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});
 
// ── ENTER KEY SUPPORT ──────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    handleAgeVerify(e);
  }
});
 
// ── LIVE PLAYER COUNT ──────────────────────────────────────────────────────
let count = 2847;
setInterval(() => {
  count += Math.floor(Math.random() * 5) - 2;
  const el = document.getElementById('playerCount');
  if (el) el.textContent = count.toLocaleString('pt-BR');
}, 3000);
 