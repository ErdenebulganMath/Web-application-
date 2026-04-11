// ── Nav switching ──
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById('panel-' + item.dataset.panel).classList.add('active');
  });
});

// ── Pre-fill from sessionStorage ──
(function () {
  document.getElementById('set-name').value  = sessionStorage.getItem('user_name')  || '';
  document.getElementById('set-email').value = sessionStorage.getItem('user_email') || '';
  const role = sessionStorage.getItem('user_role') || 'student';
  document.getElementById('set-role').value  = role;
})();

// ── Save helpers ──
function flashConfirm(id) {
  const el = document.getElementById(id);
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

function saveAccount() {
  const name  = document.getElementById('set-name').value.trim();
  const email = document.getElementById('set-email').value.trim();
  const role  = document.getElementById('set-role').value;
  if (!name)  { alert('Нэрээ оруулна уу!'); return; }
  if (!email.includes('@')) { alert('Зөв имэйл оруулна уу!'); return; }
  sessionStorage.setItem('user_name',  name);
  sessionStorage.setItem('user_email', email);
  sessionStorage.setItem('user_role',  role);
  flashConfirm('acc-confirm');
}

function changePassword() {
  const oldPw  = document.getElementById('old-pw').value;
  const newPw  = document.getElementById('new-pw').value;
  const newPw2 = document.getElementById('new-pw2').value;
  if (!oldPw)  { alert('Одоогийн нууц үгээ оруулна уу!'); return; }
  if (newPw.length < 6) { alert('Шинэ нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой!'); return; }
  if (newPw !== newPw2) { alert('Нууц үг таарахгүй байна!'); return; }
  document.getElementById('old-pw').value  = '';
  document.getElementById('new-pw').value  = '';
  document.getElementById('new-pw2').value = '';
  flashConfirm('pw-confirm');
}

function saveNotifications() { flashConfirm('notif-confirm'); }
function saveAppearance()    { flashConfirm('app-confirm'); }

function toggleDark(cb) {
  document.body.style.filter = cb.checked ? 'invert(1) hue-rotate(180deg)' : '';
}

function clearProgress() {
  if (!confirm('Дэвшлийн бүх өгөгдлийг устгах уу?')) return;
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('progress_') || k.startsWith('exam_score_') || k === 'cp_notes') {
      localStorage.removeItem(k);
    }
  });
  alert('Дэвшлийн өгөгдөл арилгагдлаа.');
}

function deleteAccount() {
  if (!confirm('Бүртгэлийг бүрмөсөн устгах уу? Энэ үйлдлийг буцаах боломжгүй!')) return;
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = 'login.html';
}
