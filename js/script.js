const menuBtn = document.getElementById('menuBtn');
const navLinks = document.querySelector('.nav-links');

function setMenuOpen(open) {
  if (!menuBtn || !navLinks) return;
  navLinks.classList.toggle('mobile-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuBtn.textContent = open ? '\u00d7' : '\u2630';
}

menuBtn?.addEventListener('click', () => {
  setMenuOpen(menuBtn.getAttribute('aria-expanded') !== 'true');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});

const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  const light = theme === 'light';
  document.body.classList.toggle('light', light);
  if (themeToggle) {
    themeToggle.textContent = light ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.setAttribute('title', light ? 'Switch to dark theme' : 'Switch to light theme');
  }
  try { localStorage.setItem('portfolio-theme', theme); } catch (e) {}
}

let savedTheme = 'dark';
try {
  savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
} catch (e) {}
applyTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
});

document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

document.querySelectorAll('.artifact-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.artifact-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.artifact-panel').forEach(panel => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target)?.classList.add('active');
  });
});

// Contact form: open the visitor's default email client.
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:aakash.02cx@gmail.com?subject=${subject}&body=${body}`;
});

// Highlight the navigation item for the section currently in view.
const observedSections = document.querySelectorAll('main section[id]');
const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${entry.target.id}`
      ));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  observedSections.forEach(section => navObserver.observe(section));
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 1050) setMenuOpen(false);
});

// Close mobile navigation when clicking outside it.
document.addEventListener('click', (event) => {
  if (window.innerWidth > 1050 || !navLinks) return;
  if (!navLinks.contains(event.target) && !menuBtn?.contains(event.target)) setMenuOpen(false);
});

// Keep the terminal animation slow and low-key.
const terminalLines = document.querySelectorAll('.terminal-line');
function runTerminalAnimation() {
  terminalLines.forEach(line => {
    line.classList.remove('show');
  });
  terminalLines.forEach(line => {
    const delay = Number(line.dataset.delay || 0);
    window.setTimeout(() => line.classList.add('show'), delay);
  });
}
if (terminalLines.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  runTerminalAnimation();
  window.setInterval(runTerminalAnimation, 9000);
}

// Animated defect lifecycle demo.
const cycleSteps = document.querySelectorAll('.cycle-step');
const cycleStatus = document.getElementById('cycleStatus');
const cycleMessage = document.getElementById('cycleMessage');

if (cycleSteps.length && cycleStatus && cycleMessage) {
  const cycleData = [
    ['New', 'QA has reported the defect.'],
    ['Assigned', 'The defect is assigned to the responsible owner.'],
    ['In Progress', 'Development is working on the fix.'],
    ['Fixed', 'The developer has marked the defect as fixed.'],
    ['Retest', 'QA is verifying the fix.'],
    ['Closed', 'The fix is verified and the defect is closed.']
  ];
  let cycleIndex = 0;
  const updateCycle = () => {
    cycleSteps.forEach(step => step.classList.remove('cycle-active'));
    cycleSteps[cycleIndex]?.classList.add('cycle-active');
    cycleStatus.textContent = cycleData[cycleIndex][0];
    cycleMessage.textContent = cycleData[cycleIndex][1];
    cycleIndex = (cycleIndex + 1) % cycleData.length;
  };
  updateCycle();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(updateCycle, 2400);
  }
}

// Interactive test-case generator demo.
const generatorApp = document.getElementById('generatorApp');
const generatorModule = document.getElementById('generatorModule');
const generatorType = document.getElementById('generatorType');
const generateTestCase = document.getElementById('generateTestCase');

const testCaseExamples = {
  login: {
    functional: ['TC_LOGIN_001','Verify login with valid credentials','User is registered and the login page is available.','1. Open login page<br>2. Enter valid username<br>3. Enter valid password<br>4. Click Login','User is authenticated and redirected to the dashboard.'],
    negative: ['TC_LOGIN_002','Verify login with an invalid password','User has a valid username and an invalid password is available.','1. Open login page<br>2. Enter valid username<br>3. Enter invalid password<br>4. Click Login','Login is rejected and a clear validation message is displayed.'],
    boundary: ['TC_LOGIN_003','Verify maximum password length','Password field has a documented maximum length.','1. Open login page<br>2. Enter username<br>3. Enter a password at the maximum allowed length<br>4. Submit','Application accepts the valid boundary value without UI or validation errors.']
  },
  search: {
    functional: ['TC_SEARCH_001','Verify search returns matching products','Products exist for the selected keyword.','1. Open search<br>2. Enter a valid keyword<br>3. Submit search','Matching products are displayed with relevant information.'],
    negative: ['TC_SEARCH_002','Verify search with an unknown keyword','Search is available.','1. Enter a keyword with no matching result<br>2. Submit search','A clear no-results state is displayed without an error.'],
    boundary: ['TC_SEARCH_003','Verify search field at its maximum length','A maximum input length is defined.','1. Enter a value at the maximum length<br>2. Submit search','The value is handled correctly and the page remains stable.']
  },
  checkout: {
    functional: ['TC_CHECKOUT_001','Verify checkout with valid order details','Cart contains an eligible product.','1. Open cart<br>2. Proceed to checkout<br>3. Enter valid details<br>4. Place order','Order is created and confirmation details are displayed.'],
    negative: ['TC_CHECKOUT_002','Verify checkout blocks incomplete required data','Cart contains an item.','1. Proceed to checkout<br>2. Leave a required field blank<br>3. Submit','Order is not created and the required field is clearly identified.'],
    boundary: ['TC_CHECKOUT_003','Verify checkout with boundary quantity','Product supports the documented quantity range.','1. Set quantity to the maximum allowed value<br>2. Proceed to checkout','Quantity is accepted and totals are calculated correctly.']
  }
};

function renderTestCase() {
  const module = generatorModule?.value || 'login';
  const type = generatorType?.value || 'functional';
  const data = testCaseExamples[module]?.[type];
  if (!data) return;
  const appName = generatorApp?.options[generatorApp.selectedIndex]?.text || 'E-commerce';
  document.getElementById('caseId').textContent = data[0];
  document.getElementById('caseTitle').textContent = data[1];
  document.getElementById('casePrecondition').textContent = `${appName}: ${data[2]}`;
  const caseApp = document.getElementById('caseApp');
  if (caseApp) caseApp.textContent = `${appName} · Sample`;
  document.getElementById('caseSteps').innerHTML = data[3];
  document.getElementById('caseExpected').textContent = data[4];
  const card = document.getElementById('generatedCase');
  card.classList.remove('case-refresh');
  void card.offsetWidth;
  card.classList.add('case-refresh');
}
generateTestCase?.addEventListener('click', renderTestCase);
generatorApp?.addEventListener('change', renderTestCase);
generatorModule?.addEventListener('change', renderTestCase);
generatorType?.addEventListener('change', renderTestCase);
