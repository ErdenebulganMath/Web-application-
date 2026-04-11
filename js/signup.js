function selectRole(role) {
  document.getElementById('role-input').value = role;
  document.getElementById('role-display').textContent = role === 'student' ? 'Student' : 'Teacher';
  document.getElementById('btn-student').classList.toggle('active', role === 'student');
  document.getElementById('btn-teacher').classList.toggle('active', role === 'teacher');
}

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const fullname = this.fullname.value.trim();
  const email    = this.email.value.trim();
  const password = this.password.value;
  const confirm  = this.confirm_password.value;

  if (!fullname) { alert('Бүтэн нэрээ оруулна уу!'); return; }
  if (!email.includes('@')) { alert('Зөв имэйл хаяг оруулна уу!'); return; }
  if (password.length < 6) { alert('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой!'); return; }
  if (password !== confirm) { alert('Нууц үг таарахгүй байна!'); return; }
  if (!this.terms.checked) { alert('Үйлчилгээний нөхцөлийг зөвшөөрнө үү!'); return; }

  sessionStorage.setItem('user_email', email);
  sessionStorage.setItem('user_name',  fullname);
  sessionStorage.setItem('user_role',  document.getElementById('role-input').value);

  window.location.href = 'main.html';
});
