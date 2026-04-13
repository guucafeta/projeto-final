// ── GUARD DE IDADE — deve ser a primeira coisa executada ───────────────────
// Impede acesso direto ao index.html sem passar pela verificação de idade
(function () {
  if (!sessionStorage.getItem('rw_age_verified')) {
    window.location.href = 'login.html';
  }
})();
 
// ── MENU HAMBÚRGUER (mobile) ───────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('navMobileMenu');
  const btn  = document.getElementById('navHamburger');
  if (!menu || !btn) return;
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}
 
function closeMobileMenu() {
  const menu = document.getElementById('navMobileMenu');
  const btn  = document.getElementById('navHamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
}
 
// Fecha menu mobile ao clicar fora
document.addEventListener('click', function (e) {
  const menu = document.getElementById('navMobileMenu');
  const btn  = document.getElementById('navHamburger');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && btn && !btn.contains(e.target)) {
      closeMobileMenu();
    }
  }
});
 
// ── HASH SIMPLES DE SENHA (djb2) ───────────────────────────────────────────
// Evita armazenar senhas em texto puro no localStorage
function hashStr(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}
 
// ── TEMA CLARO / ESCURO ────────────────────────────────────────────────────
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  document.getElementById('iconMoon').style.display = isLight ? 'none' : 'block';
  document.getElementById('iconSun').style.display  = isLight ? 'block' : 'none';
  localStorage.setItem('rw_theme', isLight ? 'light' : 'dark');
}
 
// Carrega tema salvo ao abrir a página
(function () {
  if (localStorage.getItem('rw_theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('iconMoon').style.display = 'none';
    document.getElementById('iconSun').style.display  = 'block';
  }
})();
 
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
 
  // Salva a senha como hash, nunca em texto puro
  users[user] = { name, pass: hashStr(pass) };
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
  // Compara o hash da senha digitada com o hash armazenado
  if (!users[user] || users[user].pass !== hashStr(pass))
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
 
  document.getElementById('navAvatar').textContent   = initials;
  document.getElementById('navName').textContent     = s.name.split(' ')[0];
  document.getElementById('modalAvatar').textContent = initials;
  document.getElementById('modalName').textContent   = s.name;
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
  // Remove sessão do usuário E a verificação de idade
  // Assim qualquer pessoa que abrir depois precisa passar pela tela de login.html
  sessionStorage.removeItem('rw_current');
  sessionStorage.removeItem('rw_age_verified');
  document.getElementById('profileModal').classList.remove('open');
  // Redireciona para a tela de verificação de idade / login
  window.location.href = 'login.html';
}
 
// ── GAME LOADING MODAL ─────────────────────────────────────────────────────
function startGame() {
  const modal = document.getElementById('gameModal');
  const frame = document.getElementById('gameFrame');
  // Aponta o iframe para a pasta exportada do Construct 3
  // Coloque o jogo exportado na pasta "jogo/" ao lado do index.html
  frame.src = 'jogo/index.html';
  modal.classList.add('open');
  document.body.classList.add('game-active');
}
 
function closeGame() {
  const modal = document.getElementById('gameModal');
  const frame = document.getElementById('gameFrame');
  modal.classList.remove('open');
  document.body.classList.remove('game-active');
  // Para o jogo descarregando o iframe ao fechar
  frame.src = '';
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
 
// ═══════════════════════════════════════════════════════════════════════════
// ── TECH FORGE ─────────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
 
// Persona selecionada globalmente
let selectedPersona = null;
 
// ── SELECIONAR PERSONAGEM ──────────────────────────────────────────────────
function selectPersona(cardEl, name, faction, weapon) {
  // Remove seleção anterior (manipulação do DOM)
  document.querySelectorAll('.persona-card').forEach(c => c.classList.remove('selected'));
 
  // Marca o card clicado como selecionado
  cardEl.classList.add('selected');
 
  // Armazena a persona selecionada
  selectedPersona = { name, faction, weapon };
 
  // Preenche automaticamente os campos do Forge com os dados da persona
  const callsignEl  = document.getElementById('pilotCallsign');
  const factionEl   = document.getElementById('pilotFaction');
  const weaponEl    = document.getElementById('pilotWeapon');
 
  if (callsignEl && !callsignEl.value) callsignEl.value = name;
 
  // Seleciona a opção da facção no <select> via manipulação DOM
  if (factionEl) {
    for (let opt of factionEl.options) {
      if (opt.value === faction) { opt.selected = true; break; }
    }
  }
 
  if (weaponEl && !weaponEl.value) weaponEl.value = weapon;
 
  // Mostra feedback visual na tela (manipulação DOM de visibilidade)
  showForgeNotice(`◉ ${name} selecionado! Complete os campos e salve o protocolo.`, 'info');
}
 
// ── PROMPT: DEFINIR CODINOME VIA DIÁLOGO ──────────────────────────────────
function promptPilotName() {
  const input = prompt(
    '⚡ ROBO WARS — TECH FORGE\n\nDigite seu Codinome de Batalha:\n(máx. 20 caracteres)'
  );
 
  if (input === null) {
    return;
  } else if (input.trim() === '') {
    alert('⚠ PROTOCOLO NEGADO\n\nO codinome não pode estar em branco.\nTente novamente, Comandante.');
  } else if (input.trim().length < 3) {
    alert('⚠ PROTOCOLO INVÁLIDO\n\nCodinome muito curto. Mínimo 3 caracteres.');
  } else {
    const el = document.getElementById('pilotCallsign');
    if (el) {
      el.value = input.trim().slice(0, 20);
      el.classList.add('forge-field-flash');
      setTimeout(() => el.classList.remove('forge-field-flash'), 800);
    }
    showForgeNotice(`✔ Codinome "${input.trim()}" definido com sucesso!`, 'success');
  }
}
 
// ── ATUALIZAR CODINOME (botão ⟳) ──────────────────────────────────────────
function updateCallsign() {
  const el = document.getElementById('pilotCallsign');
  const displayEl = document.getElementById('displayCallsign');
 
  if (!el || !el.value.trim()) {
    alert('⚠ Campo vazio!\n\nDigite um codinome antes de atualizar.');
    return;
  }
 
  if (displayEl) {
    displayEl.textContent = el.value.trim().toUpperCase();
    displayEl.classList.add('forge-field-flash');
    setTimeout(() => displayEl.classList.remove('forge-field-flash'), 600);
  }
 
  showForgeNotice(`✔ Codinome atualizado para "${el.value.trim()}"`, 'success');
}
 
// ── SALVAR CONFIGURAÇÃO ────────────────────────────────────────────────────
function savePilotConfig() {
  const callsign = document.getElementById('pilotCallsign').value.trim();
  const faction  = document.getElementById('pilotFaction').value;
  const weapon   = document.getElementById('pilotWeapon').value.trim();
  const strategy = document.getElementById('pilotStrategy').value.trim();
 
  const missing = [];
  if (!callsign)  missing.push('Codinome de Batalha');
  if (!faction)   missing.push('Facção');
  if (!weapon)    missing.push('Arma Principal');
  if (!strategy)  missing.push('Estratégia de Combate');
 
  if (missing.length > 0) {
    alert(
      '⚠ PROTOCOLO DE LANÇAMENTO BLOQUEADO\n\n' +
      'Os seguintes campos estão incompletos:\n\n' +
      missing.map(m => '  • ' + m).join('\n') +
      '\n\nPreencha todos os campos para ativar o piloto, Comandante.'
    );
    return;
  }
 
  const pilotData = {
    callsign,
    faction,
    weapon,
    strategy,
    persona: selectedPersona ? selectedPersona.name : null,
    savedAt: new Date().toLocaleString('pt-BR')
  };
 
  localStorage.setItem('rw_pilot', JSON.stringify(pilotData));
  showPilotCard(pilotData);
  showForgeNotice('✔ Protocolo ativado! Piloto registrado com sucesso.', 'success');
}
 
// ── MOSTRAR CARD DO PILOTO ─────────────────────────────────────────────────
function showPilotCard(data) {
  const emptyEl = document.getElementById('forgeEmpty');
  const cardEl  = document.getElementById('pilotDisplayCard');
 
  if (emptyEl) emptyEl.style.display = 'none';
  if (cardEl)  cardEl.style.display  = 'flex';
 
  const avatar = data.callsign.slice(0, 2).toUpperCase();
  setDomText('displayAvatar',   avatar);
  setDomText('displayCallsign', data.callsign.toUpperCase());
  setDomText('displayFaction',  data.faction);
  setDomText('displayWeapon',   data.weapon);
  setDomText('displayStrategy', data.strategy);
  setDomText('displayPersona',  data.persona || 'Não selecionado');
  setDomText('displayDate',     data.savedAt);
}
 
// ── OCULTAR CARD DO PILOTO ─────────────────────────────────────────────────
function hidePilotCard() {
  const emptyEl = document.getElementById('forgeEmpty');
  const cardEl  = document.getElementById('pilotDisplayCard');
 
  if (emptyEl) emptyEl.style.display = 'flex';
  if (cardEl)  cardEl.style.display  = 'none';
}
 
// ── HELPER: atualizar texto de um elemento pelo ID ─────────────────────────
function setDomText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
 
// ── RESETAR TODOS OS DADOS ─────────────────────────────────────────────────
function resetPilotConfig() {
  const confirmed = confirm(
    '⚠ CONFIRMAR RESET\n\n' +
    'Isso irá apagar TODOS os dados do piloto do armazenamento local.\n\n' +
    'Tem certeza, Comandante?'
  );
 
  if (!confirmed) return;
 
  localStorage.removeItem('rw_pilot');
 
  document.getElementById('pilotCallsign').value  = '';
  document.getElementById('pilotFaction').value   = '';
  document.getElementById('pilotWeapon').value    = '';
  document.getElementById('pilotStrategy').value  = '';
 
  document.querySelectorAll('.persona-card').forEach(c => c.classList.remove('selected'));
  selectedPersona = null;
 
  hidePilotCard();
  showForgeNotice('◈ Dados do piloto removidos do armazenamento local.', 'info');
}
 
// ── NOTIFICAÇÃO DA FORGE ───────────────────────────────────────────────────
function showForgeNotice(msg, type) {
  let notice = document.getElementById('forgeNotice');
  if (!notice) {
    notice = document.createElement('div');
    notice.id = 'forgeNotice';
    const panel = document.querySelector('.forge-panel');
    if (panel) panel.appendChild(notice);
  }
 
  notice.className = 'forge-notice forge-notice-' + (type || 'info');
  notice.textContent = msg;
  notice.style.display = 'block';
 
  clearTimeout(notice._timer);
  notice._timer = setTimeout(() => {
    notice.style.display = 'none';
  }, 4000);
}
 
// ── CARREGAR CONFIGURAÇÃO SALVA ────────────────────────────────────────────
function loadPilotConfig() {
  const raw = localStorage.getItem('rw_pilot');
  if (!raw) return;
 
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    localStorage.removeItem('rw_pilot');
    return;
  }
 
  if (data.callsign) document.getElementById('pilotCallsign').value  = data.callsign;
  if (data.faction)  document.getElementById('pilotFaction').value   = data.faction;
  if (data.weapon)   document.getElementById('pilotWeapon').value    = data.weapon;
  if (data.strategy) document.getElementById('pilotStrategy').value  = data.strategy;
 
  showPilotCard(data);
}
 
// Carrega configuração salva ao iniciar a página
document.addEventListener('DOMContentLoaded', loadPilotConfig);
 
// ── CONTATO ────────────────────────────────────────────────────────────────
function enviarContato() {
  const nome  = document.getElementById('ctNome').value.trim();
  const email = document.getElementById('ctEmail').value.trim();
  const msg   = document.getElementById('ctMsg').value.trim();
  const fb    = document.getElementById('contatoMsg');
 
  // Limpa feedback anterior
  fb.className = 'contato-feedback';
  fb.textContent = '';
 
  if (!nome || !email || !msg) {
    fb.textContent = '⚠ Preencha todos os campos antes de enviar.';
    fb.className = 'contato-feedback error';
    return;
  }
 
  // Validação básica de e-mail
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    fb.textContent = '⚠ Digite um e-mail válido.';
    fb.className = 'contato-feedback error';
    return;
  }
 
  // Simula envio (aqui você pode conectar a um backend ou EmailJS)
  const btn = document.querySelector('.contato-btn');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
 
  setTimeout(() => {
    fb.textContent = `✔ Mensagem enviada, ${nome}! Retornaremos em breve.`;
    fb.className = 'contato-feedback success';
    document.getElementById('ctNome').value  = '';
    document.getElementById('ctEmail').value = '';
    document.getElementById('ctMsg').value   = '';
    btn.disabled = false;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> Enviar Mensagem';
  }, 1200);
}
 