/* ── LOAD COURSE DATA FROM URL PARAMS ── */
(function () {
  const p = new URLSearchParams(window.location.search);

  const title      = p.get('title')      || 'Хичээл';
  const instructor = p.get('instructor') || '';
  const lessons    = p.get('lessons')    || '';
  const hours      = p.get('hours')      || '';
  const enrolled   = p.get('enrolled')   || '';
  const rating     = p.get('rating')     || '';
  const price      = p.get('price')      || '';

  document.getElementById('headerTitle').textContent  = title;
  document.title = title + ' – EduLearn';
  document.getElementById('lessonTitle').textContent  = title + ' — Оршил';
  document.getElementById('lessonDesc').textContent   =
    title + '-ийн үндсэн ойлголт, тэмдэглэгээ болон анхдагч харилцааг танилцуулна.';
  document.getElementById('unit1Name').textContent    = title + ' гэж юу вэ?';

  document.getElementById('infoInstructor').textContent = instructor;
  document.getElementById('infoLessons').textContent    = lessons;
  document.getElementById('infoHours').textContent      = hours;
  document.getElementById('infoEnrolled').textContent   = enrolled;
  document.getElementById('infoRating').textContent     = rating;
  const priceEl = document.getElementById('infoPrice');
  priceEl.textContent = parseFloat(price) === 0 ? 'Үнэгүй' : (price ? '$' + price : '');
  priceEl.style.color = parseFloat(price) === 0 ? '#22c55e' : 'inherit';

  // Track progress in localStorage keyed by course title
  const key      = 'progress_' + title;
  const progress = parseInt(localStorage.getItem(key) || '0');
  updateProgress(progress);
})();

/* ── PROGRESS ── */
let completedLessons = 0;
const totalLessons   = 7; // unit 1×2 + unit 2×2 + unit 3×3

function updateProgress(pct) {
  document.getElementById('progressFill').style.width  = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% дууссан';
}

function selectLesson(el, unit) {
  document.querySelectorAll('.lesson-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  completedLessons = Math.min(completedLessons + 1, totalLessons);
  const pct = Math.round((completedLessons / totalLessons) * 100);
  const key = 'progress_' + (document.getElementById('headerTitle').textContent);
  localStorage.setItem(key, pct);
  updateProgress(pct);
}

/* ── UNIT TOGGLE ── */
function toggleUnit(header) {
  const lessons = header.nextElementSibling;
  const isOpen  = lessons.classList.contains('open');
  lessons.classList.toggle('open', !isOpen);
  header.classList.toggle('active', !isOpen);
}

/* ── NOTES ── */
let notes     = JSON.parse(localStorage.getItem('cp_notes') || '[]');
let notesOpen = false;

function saveNotes() { localStorage.setItem('cp_notes', JSON.stringify(notes)); }

function toggleNotes() {
  notesOpen = !notesOpen;
  document.getElementById('notesList').classList.toggle('open', notesOpen);
  document.getElementById('notesChevron').classList.toggle('open', notesOpen);
  renderNotes();
}

function renderNotes() {
  const list = document.getElementById('notesList');
  list.innerHTML = '';
  if (notes.length === 0) {
    list.innerHTML = '<div class="notes-empty">Тэмдэглэл байхгүй байна</div>';
    return;
  }
  notes.forEach((note, i) => {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `
      <span class="note-title">${escHtml(note.title)}</span>
      <button class="note-delete" onclick="deleteNote(event,${i})" title="Устгах">
        <i class="bi bi-trash3"></i>
      </button>`;
    div.addEventListener('click', () => openNote(i));
    list.appendChild(div);
  });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function createNote() {
  const n = { title: 'Шинэ тэмдэглэл', content: '', created: Date.now() };
  notes.unshift(n);
  saveNotes();
  if (!notesOpen) toggleNotes(); else renderNotes();
  openNote(0);
}

function deleteNote(e, i) {
  e.stopPropagation();
  notes.splice(i, 1);
  saveNotes();
  renderNotes();
}

/* ── NOTE POPUP ── */
function openNote(i) {
  const note = notes[i];
  for (const p of document.querySelectorAll('.note-popup')) {
    if (parseInt(p.dataset.index) === i) { p.style.zIndex = 10000; return; }
  }
  const popup  = document.createElement('div');
  popup.className   = 'note-popup';
  popup.dataset.index = i;
  const d = new Date(note.created || Date.now());
  const dateStr = d.toLocaleDateString('mn-MN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  popup.innerHTML = `
    <div class="note-popup-header" onmousedown="dragStart(event, this.closest('.note-popup'))">
      <input value="${escHtml(note.title)}" placeholder="Гарчиг...">
      <div class="popup-actions">
        <button class="popup-btn" onclick="togglePopupSize(this)" title="Томруулах"><i class="bi bi-arrows-fullscreen"></i></button>
        <button class="popup-btn" onclick="this.closest('.note-popup').remove()" title="Хаах"><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
    <div class="note-popup-body">
      <textarea placeholder="Тэмдэглэл бичих...">${escHtml(note.content)}</textarea>
    </div>
    <div class="note-popup-footer">${dateStr}</div>`;
  document.body.appendChild(popup);
  popup.querySelector('input').addEventListener('input', e => { notes[i].title = e.target.value; saveNotes(); renderNotes(); });
  popup.querySelector('textarea').addEventListener('input', e => { notes[i].content = e.target.value; saveNotes(); });
}

function togglePopupSize(btn) { btn.closest('.note-popup').classList.toggle('large'); }

/* ── DRAG ── */
function dragStart(e, el) {
  e.preventDefault();
  let startX = e.clientX - el.offsetLeft;
  let startY = e.clientY - el.offsetTop;
  function onMove(e) {
    el.style.left     = (e.clientX - startX) + 'px';
    el.style.top      = (e.clientY - startY) + 'px';
    el.style.bottom   = 'auto';
    el.style.right    = 'auto';
    el.style.position = 'fixed';
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
}
