// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD866UISZ-U3lhUzuSQYydNaQzEd-eH03o",
  authDomain: "scanner-ac.firebaseapp.com",
  projectId: "scanner-ac",
  storageBucket: "scanner-ac.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Handle Login Form Submission
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }

  // Handle Register Form Submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;
      const username = document.getElementById('reg-username').value;
      const confirmPassword = document.getElementById('reg-confirm').value;
      
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          alert('Registration successful!');
          window.location.href = 'login.html';
        })
        .catch((error) => {
          alert(error.message);
        });
    });
  }
});

// Check auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    if (window.location.pathname.includes('login.html')) {
      window.location.href = 'index.html';
    }
  } else {
    // User is signed out
    if (window.location.pathname.includes('dashboard.html')) {
      window.location.href = 'login.html';
    }
  }
});