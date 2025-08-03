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


// Add this to your existing auth.js
function checkAdminStatus() {
  const user = firebase.auth().currentUser;
  if (user && user.email.endsWith('@admin.scanner.ac')) {
    return true;
  }
  return false;
}

// Add this to your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('admin')) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!checkAdminStatus()) {
        window.location.href = 'login.html';
      }
    });
  }
});

// Add these functions to your auth.js
async function getTotalUsers() {
  const snapshot = await firebase.firestore().collection('users').get();
  return snapshot.size;
}

async function getActiveToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const snapshot = await firebase.firestore()
    .collection('users')
    .where('lastActive', '>=', today)
    .get();
    
  return snapshot.size;
}

async function getNewThisWeek() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const snapshot = await firebase.firestore()
    .collection('users')
    .where('signupDate', '>=', oneWeekAgo)
    .get();
    
  return snapshot.size;
}

async function getRecentActivity(limit = 5) {
  const snapshot = await firebase.firestore()
    .collection('activity_logs')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
    
  return snapshot.docs.map(doc => doc.data());
}

// Add this to your signInWithEmailAndPassword success handler
function logUserActivity(action, ip = 'N/A') {
  const user = firebase.auth().currentUser;
  if (!user) return;

  firebase.firestore().collection('activity_logs').add({
    userId: user.uid,
    email: user.email,
    action: action,
    ip: ip,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  // Update last active time
  firebase.firestore().collection('users').doc(user.uid).set({
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

auth.createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Add user to database
    return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
      username: username,
      email: email,
      signupDate: firebase.firestore.FieldValue.serverTimestamp(),
      lastActive: firebase.firestore.FieldValue.serverTimestamp(),
      isAdmin: email.endsWith('@admin.scanner.ac')
    });
  })

  // Add these functions to your existing auth.js
const db = firebase.firestore();

async function getAdminStats() {
  try {
    // Get counts using Firebase queries
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = await db.collection('users')
      .where('lastActive', '>=', today)
      .get()
      .then(snap => snap.size);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = await db.collection('users')
      .where('signupDate', '>=', oneWeekAgo)
      .get()
      .then(snap => snap.size);
    
    // Get recent activity
    const recentActivity = await db.collection('activity_logs')
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get()
      .then(snap => snap.docs.map(doc => doc.data()));
    
    return {
      totalUsers,
      activeToday,
      newThisWeek,
      recentActivity
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}

// Add this to your admin.html
document.addEventListener('DOMContentLoaded', async () => {
  // Verify admin status
  const user = firebase.auth().currentUser;
  if (!user || !user.email.endsWith('@admin.scanner.ac')) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const stats = await getAdminStats();
    
    // Update stats
    document.getElementById('totalUsers').innerHTML = stats.totalUsers.toLocaleString();
    document.getElementById('activeToday').innerHTML = stats.activeToday.toLocaleString();
    document.getElementById('newThisWeek').innerHTML = stats.newThisWeek.toLocaleString();
    
    // Update activity table
    const activityTable = document.getElementById('recentActivity');
    activityTable.innerHTML = '';
    
    stats.recentActivity.forEach(activity => {
      const row = document.createElement('tr');
      const time = activity.timestamp?.toDate ? 
        formatTime(activity.timestamp.toDate()) : 'N/A';
      
      row.innerHTML = `
        <td>${activity.email || 'Unknown'}</td>
        <td>${activity.action || 'Unknown action'}</td>
        <td>${time}</td>
        <td>${activity.ip || 'N/A'}</td>
      `;
      activityTable.appendChild(row);
    });
    
  } catch (error) {
    console.error("Admin data error:", error);
    // Show error messages
    document.getElementById('totalUsers').textContent = "Error loading";
    document.getElementById('activeToday').textContent = "Error loading";
    document.getElementById('newThisWeek').textContent = "Error loading";
    document.getElementById('recentActivity').innerHTML = `
      <tr>
        <td colspan="4" class="error">Failed to load activity</td>
      </tr>
    `;
  }
});

// Helper function to format time
function formatTime(date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Add this to auth.js
async function logActivity(action) {
  try {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    // Get IP address
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    
    await db.collection('activity_logs').add({
      userId: user.uid,
      email: user.email,
      action: action,
      ip: ipData.ip || 'N/A',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Update user's last active time
    await db.collection('users').doc(user.uid).set({
      lastActive: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Activity logging failed:", error);
  }
}
// Example usage in your login success handler:
auth.signInWithEmailAndPassword(email, password)
  .then(async (userCredential) => {
    await logActivity('User logged in');
    // Rest of your login logic
  });
  /* Add to your style.css */
.fa-spinner {
  margin-right: 8px;
}

.error {
  color: #ff006a;
  text-align: center;
  padding: 20px;
}
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if isAdmin();
    }
    
    match /activity_logs/{logId} {
      allow read: if isAdmin();
      allow write: if request.auth != null;
    }
    
    function isAdmin() {
      return request.auth.token.admin == true;
    }
  }
}
// In your Firebase Cloud Functions
exports.setAdminClaim = functions.firestore
  .document('users/{userId}')
  .onWrite(async (change, context) => {
    const data = change.after.data();
    if (!data) return null;
    
    // Check if this user should be admin
    const isAdmin = data.email.endsWith('@admin.scanner.ac');
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(context.params.userId, {
      admin: isAdmin
    });
    
    console.log(`Set admin=${isAdmin} for ${data.email}`);
    return null;
  });