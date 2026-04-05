// ── PARTICLES ──────────────────────────────────────────────────────────────
(function () {
  const c = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const x = Math.random() * 100;
    p.style.cssText =
      `left:${x}%;background:${Math.random() > 0.6 ? '#ff1744' : '#00e5ff'};` +
      `--d:${(Math.random() - 0.5) * 160}px;` +
      `animation-duration:${10 + Math.random() * 12}s;` +
      `animation-delay:-${Math.random() * 20}s;`;
    c.appendChild(p);
  }
})();

// ── AUTH GUARD ─────────────────────────────────────────────────────────────
const session = JSON.parse(sessionStorage.getItem('rw_current') || 'null');

function showAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.classList.add('open');
    document.body.classList.add('auth-active');
  }
}

function hideAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.classList.remove('auth-active');
  }
}

if (!session) {
  showAuthOverlay();
} else {
  hideAuthOverlay();
}

// ── AUTH TABS ──────────────────────────────────────────────────────────────
function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-form-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(isLogin ? 'tabLogin' : 'tabRegister').classList.add('active');
  document.getElementById(isLogin ? 'panelLogin' : 'panelRegister').classList.add('active');
  clearAuthMsgs();
}

function clearAuthMsgs() {
  document.querySelectorAll('.auth-msg').forEach(m => { m.className = 'auth-msg'; m.textContent = ''; });
}

function showAuthMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'auth-msg ' + type;
}

// ── RIPPLE EFFECT ──────────────────────────────────────────────────────────
document.querySelectorAll('.auth-btn-main').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const r = document.createElement('span');
    r.className = 'auth-ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});

// ── STORAGE HELPERS ────────────────────────────────────────────────────────
function getUsers() {
  return JSON.parse(localStorage.getItem('rw_users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('rw_users', JSON.stringify(users));
}

function setSession(username, name) {
  sessionStorage.setItem('rw_current', JSON.stringify({ username, name }));
}

// ── REGISTER ───────────────────────────────────────────────────────────────
function handleRegister(e) {
  e.preventDefault();
  const name  = document.getElementById('regName').value.trim();
  const user  = document.getElementById('regUser').value.trim();
  const pass  = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPass2').value;

  if (!name || !user || !pass || !pass2)
    return showAuthMsg('msgRegister', '⚠ Preencha todos os campos.', 'error');
  if (pass.length < 6)
    return showAuthMsg('msgRegister', '⚠ Senha deve ter pelo menos 6 caracteres.', 'error');
  if (pass !== pass2)
    return showAuthMsg('msgRegister', '⚠ As senhas não coincidem.', 'error');

  const users = getUsers();
  if (users[user])
    return showAuthMsg('msgRegister', '⚠ Usuário já existe. Escolha outro nome.', 'error');

  users[user] = { name, pass };
  saveUsers(users);
  showAuthMsg('msgRegister', '✔ Conta criada com sucesso! Faça login para continuar.', 'success');
  setTimeout(() => switchAuthTab('login'), 1800);
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;

  if (!user || !pass)
    return showAuthMsg('msgLogin', '⚠ Preencha usuário e senha.', 'error');

  const users = getUsers();
  if (!users[user] || users[user].pass !== pass)
    return showAuthMsg('msgLogin', '⚠ Usuário ou senha incorretos.', 'error');

  setSession(user, users[user].name);
  showAuthMsg('msgLogin', `✔ Bem-vindo, ${users[user].name}! Iniciando...`, 'success');

  const card = document.getElementById('authCard');
  setTimeout(() => {
    card.style.opacity = '0';
    setTimeout(() => {
      hideAuthOverlay();
      card.style.opacity = '1';
      populateUserInfo();
    }, 700);
  }, 1200);
}

// ── ENTER KEY SUPPORT ──────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const overlay = document.getElementById('authOverlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  const loginActive = document.getElementById('panelLogin').classList.contains('active');
  loginActive ? handleLogin(e) : handleRegister(e);
});

// ── LIVE PLAYER COUNT (AUTH) ───────────────────────────────────────────────
let authCount = 2847;
setInterval(() => {
  authCount += Math.floor(Math.random() * 5) - 2;
  const el = document.getElementById('authPlayerCount');
  if (el) el.textContent = authCount.toLocaleString('pt-BR');
}, 3000);

// ── POPULATE NAV WITH USER INFO ────────────────────────────────────────────
function populateUserInfo() {
  const s = JSON.parse(sessionStorage.getItem('rw_current') || 'null');
  if (!s) return;

  const initials = s.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  document.getElementById('navAvatar').textContent  = initials;
  document.getElementById('navName').textContent    = s.name.split(' ')[0];
  document.getElementById('modalAvatar').textContent = initials;
  document.getElementById('modalName').textContent  = s.name;
  document.getElementById('modalUsername').textContent = '@' + s.username;
}

if (session) {
  populateUserInfo();
}

// ── SCROLL REVEAL ──────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── PROFILE MODAL ──────────────────────────────────────────────────────────
function openProfile(e) {
  e.preventDefault();
  document.getElementById('profileModal').classList.add('open');
}

function closeProfile(e) {
  const overlay = document.getElementById('profileModal');
  if (!e || e.target === overlay) overlay.classList.remove('open');
}

function logout() {
  sessionStorage.removeItem('rw_current');
  showAuthOverlay();
  document.getElementById('profileModal').classList.remove('open');
}

// ── GAME LOADING MODAL ─────────────────────────────────────────────────────
const loadingMsgs = [
  'Inicializando protocolos de combate...',
  'Calibrando sensores neurais...',
  'Carregando arena de batalha...',
  'Sincronizando interface háptica...',
  'Conectando ao servidor de matchmaking...',
  'Ativando modo de combate...',
  'Prontos para a batalha!'
];

let gameInterval = null;
let loadPct = 0;

function startGame() {
  document.getElementById('gameModal').classList.add('open');
  loadPct = 0;
  document.getElementById('loadingBar').style.width = '0%';
  document.getElementById('loadingLabel').textContent = 'CARREGANDO — 0%';
  document.querySelector('.game-sub').textContent = loadingMsgs[0];
  let msgIdx = 0;

  gameInterval = setInterval(() => {
    loadPct += Math.random() * 4 + 1;
    if (loadPct >= 100) { loadPct = 100; clearInterval(gameInterval); }

    document.getElementById('loadingBar').style.width = loadPct + '%';
    document.getElementById('loadingLabel').textContent = 'CARREGANDO — ' + Math.floor(loadPct) + '%';

    const nextIdx = Math.min(Math.floor(loadPct / 15), loadingMsgs.length - 1);
    if (nextIdx > msgIdx) {
      msgIdx = nextIdx;
      document.querySelector('.game-sub').textContent = loadingMsgs[msgIdx];
    }

    if (loadPct >= 100) {
      document.querySelector('.game-sub').textContent = '⚡ Arena Carregada! Jogo em desenvolvimento...';
    }
  }, 120);
}

function closeGame() {
  clearInterval(gameInterval);
  document.getElementById('gameModal').classList.remove('open');
  loadPct = 0;
}

// ── ESC KEY ─────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeGame();
    document.getElementById('profileModal').classList.remove('open');
  }
});

// ── LIVE PLAYER STATS ──────────────────────────────────────────────────────
let playerCount = 2847;
setInterval(() => {
  playerCount += Math.floor(Math.random() * 7) - 3;
  const el = document.getElementById('statPlayers');
  if (el) el.textContent = playerCount.toLocaleString('pt-BR');
}, 3000);
