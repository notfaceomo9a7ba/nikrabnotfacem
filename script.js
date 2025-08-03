// Toggle Learn More
document.getElementById('learnMoreBtn').addEventListener('click', () => {
  const box = document.getElementById('infoBox');
  box.classList.toggle('hidden');
});

// Snow Effect
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const snowflakes = [];

function createSnowflakes() {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const radius = Math.random() * 1 + 0.5; // smaller snowflakes
  const speed = Math.random() * 0.3 + 0.1; // slower snowflakes
  snowflakes.push({ x, y, radius, speed });
}

for (let i = 0; i < 150; i++) {
  createSnowflakes();
}

function drawSnowflakes() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'white';
  ctx.beginPath();

  for (let flake of snowflakes) {
    ctx.moveTo(flake.x, flake.y);
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
  }

  ctx.fill();
  updateSnowflakes();
}

function updateSnowflakes() {
  for (let flake of snowflakes) {
    flake.y += flake.speed;
    if (flake.y > height) {
      flake.y = 0;
      flake.x = Math.random() * width;
    }
  }
}

setInterval(drawSnowflakes, 10);
// Scroll to Pricing when clicking Purchase
document.querySelector('a[href="#pricing"]').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById("loginBtn").addEventListener("click", () => {
  const menu = document.getElementById("loginMenu");
  menu.classList.toggle("hidden");
});

// في script.js
document.getElementById("loginToggle").addEventListener("click", () => {
  const menu = document.getElementById("settingsMenu");
  menu.classList.toggle("hidden");
});

// احذف هذه الأجزاء:
document.getElementById("loginBtn").addEventListener("click", () => {
  const menu = document.getElementById("loginMenu");
  menu.classList.toggle("hidden");
});

document.getElementById("loginToggle").addEventListener("click", () => {
  const menu = document.getElementById("settingsMenu");
  menu.classList.toggle("hidden");
});


// Toggle Learn More
document.getElementById('learnMoreBtn').addEventListener('click', () => {
  const box = document.getElementById('infoBox');
  box.classList.toggle('hidden');
});

// Snow Effect
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const snowflakes = [];

function createSnowflakes() {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const radius = Math.random() * 1 + 0.5;
  const speed = Math.random() * 0.3 + 0.1;
  snowflakes.push({ x, y, radius, speed });
}

for (let i = 0; i < 150; i++) {
  createSnowflakes();
}

function drawSnowflakes() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'white';
  ctx.beginPath();

  for (let flake of snowflakes) {
    ctx.moveTo(flake.x, flake.y);
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
  }

  ctx.fill();
  updateSnowflakes();
}

function updateSnowflakes() {
  for (let flake of snowflakes) {
    flake.y += flake.speed;
    if (flake.y > height) {
      flake.y = 0;
      flake.x = Math.random() * width;
    }
  }
}

setInterval(drawSnowflakes, 10);

// Scroll to Pricing when clicking Purchase
document.querySelector('a[href="#pricing"]').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });

});

// Check if certain extension objects exist
if (typeof someNuiToolObject !== 'undefined') {
  console.log('NUI tool detected');
  // Implement workarounds or show warning
}

document.addEventListener('touchstart', function(e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
document.addEventListener('selectstart', function(e) {
  e.preventDefault();
});

// CSS approach (more reliable)
document.head.insertAdjacentHTML('beforeend', `
  <style>
    * {
      user-select: none;
      -webkit-user-select: none;
    }
  </style>
`);
document.documentElement.requestFullscreen();
// This is easily bypassable and not reliable
setInterval(function() {
  if (window.outerWidth - window.innerWidth > 200 || 
      window.outerHeight - window.innerHeight > 200) {
    document.body.innerHTML = 'Please disable developer tools';
  }
}, 1000);
