import './style.css';
import certificates from './certificates.json';

const $ = (selector) => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

// A real theme preference, persisted only in this browser.
const themeButton = $('#theme-toggle');
function updateThemeButton() {
  const light = document.documentElement.classList.contains('light');
  themeButton.setAttribute('aria-label', light ? 'Aktifkan tema gelap' : 'Aktifkan tema terang');
  themeButton.setAttribute('aria-pressed', String(light));
  themeButton.innerHTML = light
    ? '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/></svg>'
    : '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/></svg>';
  $('meta[name="theme-color"]').content = light ? '#f7f7f5' : '#0e0e0f';
}
themeButton.addEventListener('click', () => {
  const light = document.documentElement.classList.toggle('light');
  try { localStorage.setItem('portfolio-theme', light ? 'light' : 'dark'); } catch { /* Storage can be disabled. */ }
  updateThemeButton();
});
updateThemeButton();

// Mobile navigation remains a keyboard-accessible disclosure.
const menuButton = $('#menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu(returnFocus = false) {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Buka navigasi');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Tutup navigasi' : 'Buka navigasi');
});
mobileNav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', (event) => { if (!event.target.closest('header')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true); });
window.matchMedia('(min-width: 1100px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

const navigationLinks = [...document.querySelectorAll('header nav a')];
const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of navigationLinks) {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
  }
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

// Respect reduced motion for both animated typing sequences.
const roles = ['Frontend Developer', 'Backend Developer', 'Cybersecurity'];
const greetings = [
  ['Indonesia', 'python', 'hello_indonesia.py', 'Halo, dunia!'],
  ['English', 'node', 'hello_english.js', 'Hello, world!'],
  ['Jawa', 'php', 'hello_jawa.php', 'Sugeng rawuh, jagad!'],
  ['日本語', 'python', 'hello_japanese.py', 'こんにちは、世界！'],
  ['Español', 'python', 'hello_spanish.py', '¡Hola, mundo!'],
  ['Français', 'python', 'hello_french.py', 'Bonjour, le monde !'],
  ['한국어', 'python', 'hello_korean.py', '안녕하세요, 세계!'],
  ['中文', 'python', 'hello_mandarin.py', '你好，世界！'],
];
let roleTimer;
let terminalTimer;
function animateHero() {
  clearTimeout(roleTimer);
  clearTimeout(terminalTimer);
  const roleText = $('#typewriter-text');
  const command = $('#terminal-cmd-display');
  const output = $('#terminal-live-output');
  const badge = $('#terminal-badge-lang');
  if (reducedMotion.matches) {
    roleText.textContent = 'Backend Developer';
    command.textContent = 'python hello_indonesia.py';
    output.textContent = 'Halo, dunia!';
    badge.textContent = 'Indonesia';
    return;
  }
  let roleIndex = 0;
  let position = 0;
  let deleting = false;
  function typeRole() {
    const role = roles[roleIndex];
    position += deleting ? -1 : 1;
    roleText.textContent = role.slice(0, position);
    let delay = deleting ? 38 : 80;
    if (!deleting && position === role.length) { deleting = true; delay = 2100; }
    else if (deleting && position === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
    roleTimer = setTimeout(typeRole, delay);
  }
  typeRole();
  let greetingIndex = 0;
  function runGreeting() {
    const [language, runner, filename, message] = greetings[greetingIndex];
    badge.textContent = language;
    output.textContent = '';
    const line = `${runner} ${filename}`;
    let index = 0;
    function typeCommand() {
      command.textContent = line.slice(0, index++);
      if (index <= line.length) terminalTimer = setTimeout(typeCommand, 42);
      else terminalTimer = setTimeout(() => {
        output.textContent = message;
        greetingIndex = (greetingIndex + 1) % greetings.length;
        terminalTimer = setTimeout(runGreeting, 2300);
      }, 220);
    }
    typeCommand();
  }
  runGreeting();
}
animateHero();
reducedMotion.addEventListener('change', animateHero);

// The catalog links to all 28 documents provided in the original ZIP.
const categories = [
  ['all', 'Semua', '◇'], ['web', 'Web & Database', '</>'], ['security', 'Keamanan Siber', '⌘'],
  ['network', 'Jaringan', '⌁'], ['data', 'Data & AI', '▥'], ['event', 'Seminar', '◎'], ['language', 'Bahasa', 'Aa'],
];
const categoryMap = Object.fromEntries(categories.map(([id, title, icon]) => [id, { title, icon }]));
const filters = $('#cert-filters');
const grid = $('#cert-grid');
const showMore = $('#toggle-certs-btn');
let activeCategory = 'all';
let expanded = false;
let search = '';
const normalize = (value) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id');
const dateFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
for (const [id, title] of categories) {
  const count = id === 'all' ? certificates.length : certificates.filter((cert) => cert.category === id).length;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cert-filter';
  button.dataset.category = id;
  button.setAttribute('aria-pressed', String(id === activeCategory));
  button.innerHTML = `${escapeHtml(title)} <span>${count}</span>`;
  filters.append(button);
}
function renderCertificates() {
  const query = normalize(search.trim());
  const matches = certificates.filter((cert) =>
    (activeCategory === 'all' || cert.category === activeCategory) &&
    normalize(`${cert.title} ${cert.issuer} ${cert.kind} ${cert.note}`).includes(query));
  const showingAll = expanded || activeCategory !== 'all' || Boolean(query);
  const visible = showingAll ? matches : matches.slice(0, 4);
  grid.innerHTML = visible.map((cert) => {
    const category = categoryMap[cert.category];
    return `<article class="certificate-card">
      <div class="certificate-top"><span class="certificate-icon" aria-hidden="true">${escapeHtml(category.icon)}</span><span class="certificate-category">${escapeHtml(category.title)}</span></div>
      <div class="certificate-body"><time datetime="${cert.date}">${dateFormat.format(new Date(`${cert.date}T12:00:00`))}</time>
      <h4>${escapeHtml(cert.title)}</h4><p class="certificate-issuer">${escapeHtml(cert.issuer)}</p>
      <span class="certificate-kind">${escapeHtml(cert.kind)}</span>${cert.note ? `<p class="certificate-note">${escapeHtml(cert.note)}</p>` : ''}</div>
      <div class="certificate-links"><a href="${cert.file}" target="_blank" rel="noopener noreferrer" aria-label="Lihat dokumen ${escapeHtml(cert.title)} (tab baru)">Lihat Dokumen <span aria-hidden="true">↗</span></a>
      ${cert.attachments.map((attachment) => `<a class="attachment-link" href="${attachment.file}" target="_blank" rel="noopener noreferrer">${escapeHtml(attachment.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>
    </article>`;
  }).join('');
  $('#cert-empty').hidden = matches.length > 0;
  $('#cert-results').textContent = `${visible.length} dari ${matches.length} sertifikat ditampilkan.`;
  showMore.hidden = activeCategory !== 'all' || Boolean(query) || matches.length <= 4;
  showMore.setAttribute('aria-expanded', String(expanded));
  showMore.innerHTML = expanded ? 'Tampilkan lebih sedikit <span aria-hidden="true">↑</span>' : `Lihat semua sertifikat (${certificates.length}) <span aria-hidden="true">↓</span>`;
  for (const button of filters.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.category === activeCategory));
}
filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;
  activeCategory = button.dataset.category;
  expanded = false;
  renderCertificates();
});
$('#cert-search').addEventListener('input', (event) => { search = event.target.value; expanded = false; renderCertificates(); });
showMore.addEventListener('click', () => {
  const collapsing = expanded;
  expanded = !expanded;
  renderCertificates();
  if (collapsing) $('#certs-container').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
renderCertificates();

// No credentials or external service are required: visitors send from their email app.
const contactForm = $('#contact-form');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = $('#full-name');
  const name = nameInput.value.trim();
  nameInput.setCustomValidity(name ? '' : 'Silakan isi nama Anda.');
  if (!contactForm.reportValidity()) return;
  const email = $('#email-address').value.trim();
  const messageInput = $('#message-content');
  const message = messageInput.value.trim();
  messageInput.setCustomValidity(message ? '' : 'Silakan tulis pesan Anda.');
  if (!contactForm.reportValidity()) return;
  const subject = `Pesan portofolio dari ${name}`;
  const body = `Nama: ${name}\nEmail: ${email}\n\n${message}`;
  window.location.href = `mailto:naufalizzuddin134@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#form-feedback').classList.remove('hidden');
});
for (const input of contactForm.querySelectorAll('input, textarea')) {
  input.addEventListener('input', () => {
    input.setCustomValidity('');
    $('#form-feedback').classList.add('hidden');
  });
}
