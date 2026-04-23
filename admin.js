/* ============================================================
   ME MA MANA RUCHULU — ADMIN AUTHENTICATION
   Handles: Firebase init, Login, Logout, Route protection
   ============================================================ */


/* ----- 1. FIREBASE CONFIGURATION -----
   ╔══════════════════════════════════════════════════════════╗
   ║  REPLACE the values below with YOUR Firebase config.    ║
   ║  Get it from: Firebase Console → Project Settings       ║
   ║  → General → Your apps → Web app → Config              ║
   ╚══════════════════════════════════════════════════════════╝ */

const firebaseConfig = {
  apiKey: "AIzaSyD0mikp8Hiw9YxDYDBGohs_U9PItGARo3o",
  authDomain: "me-ma-mana-ruchulu.firebaseapp.com",
  projectId: "me-ma-mana-ruchulu",
  storageBucket: "me-ma-mana-ruchulu.firebasestorage.app",
  messagingSenderId: "789758322502",
  appId: "1:789758322502:web:2025becd7cde67560ca747"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


/* ----- 2. DETECT CURRENT PAGE -----
   Determines which page we're on so we run
   the correct logic (login page vs dashboard).  */

const isLoginPage = document.getElementById("loginForm") !== null;
const isDashboardPage = document.getElementById("dashboard") !== null;


/* ----- 3. LOGIN PAGE LOGIC -----
   Handles form submission, Firebase sign-in,
   error display, and password toggle.           */

if (isLoginPage) {

  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");
  const loginBtn = document.getElementById("loginBtn");
  const btnText = loginBtn.querySelector(".btn-text");
  const btnLoader = loginBtn.querySelector(".btn-loader");
  const toggleBtn = document.getElementById("togglePassword");

  // If already logged in, redirect straight to dashboard
  auth.onAuthStateChanged(user => {
    if (user) {
      window.location.href = "admin.html";
    }
  });

  // Handle login form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Clear previous errors
    hideError();

    // Show loading state
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
    loginBtn.disabled = true;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Success — redirect to dashboard
      window.location.href = "admin.html";

    } catch (error) {
      // Show user-friendly error
      showError(getFriendlyError(error.code));

      // Reset button
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
      loginBtn.disabled = false;

      // Shake the form for visual feedback
      loginForm.classList.add("shake");
      setTimeout(() => loginForm.classList.remove("shake"), 500);
    }
  });

  // Toggle password visibility
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      toggleBtn.querySelector(".eye-open").style.display = isPassword ? "none" : "block";
      toggleBtn.querySelector(".eye-closed").style.display = isPassword ? "block" : "none";
    });
  }

  // Show error message with animation
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("visible");
  }

  // Hide error message
  function hideError() {
    errorMessage.textContent = "";
    errorMessage.classList.remove("visible");
  }

  // Convert Firebase error codes to friendly messages
  function getFriendlyError(code) {
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-credential":
        return "Invalid email or password. Please try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Check your internet connection.";
      default:
        return "Login failed. Please try again.";
    }
  }
}


/* ----- 4. DASHBOARD PAGE LOGIC -----
   Protects the dashboard: if not logged in,
   redirect to login. Shows user info + logout.  */

if (isDashboardPage) {

  const dashboardEl = document.getElementById("dashboard");
  const authLoading = document.getElementById("authLoading");
  const adminEmailEl = document.getElementById("adminEmail");
  const loginTimeEl = document.getElementById("loginTime");
  const logoutBtn = document.getElementById("logoutBtn");

  const ordersList = document.getElementById("ordersList");
  const ordersCount = document.getElementById("ordersCount");

  // Check authentication state
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in — show dashboard
      authLoading.style.display = "none";
      dashboardEl.style.display = "block";

      // Display admin email
      if (adminEmailEl) {
        adminEmailEl.textContent = user.email;
      }

      // Display login time
      if (loginTimeEl) {
        const now = new Date();
        loginTimeEl.textContent = "Logged in at " + now.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        });
      }

      // Start real-time order listener
      listenToOrders();

    } else {
      // Not logged in — redirect to login page
      window.location.href = "admin-login.html";
    }
  });

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await auth.signOut();
        window.location.href = "admin-login.html";
      } catch (error) {
        alert("Logout failed. Please try again.");
      }
    });
  }


  /* ----- 5. REAL-TIME ORDER LISTENER -----
     Uses onSnapshot for live updates — no refresh needed.
     New orders appear automatically.                       */

  function listenToOrders() {
    db.collection("orders")
      .orderBy("createdAt", "desc")
      .limit(50)
      .onSnapshot(snapshot => {
        if (snapshot.empty) {
          ordersList.innerHTML = `
            <div class="no-orders">
              <p>No orders yet</p>
              <span>Orders will appear here in real-time</span>
            </div>
          `;
          ordersCount.textContent = "";
          return;
        }

        ordersCount.textContent = `(${snapshot.size})`;
        ordersList.innerHTML = "";

        snapshot.forEach(doc => {
          const order = doc.data();
          const orderId = doc.id;
          const time = order.createdAt
            ? order.createdAt.toDate().toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
            })
            : "Just now";

          const statusClass = order.status === "completed" ? "status-done"
            : order.status === "preparing" ? "status-prep"
              : "status-pending";

          const statusLabel = order.status === "completed" ? "Completed"
            : order.status === "preparing" ? "Preparing"
              : "Pending";

          const itemsHtml = order.items.map(item =>
            `<div class="order-item-row">
              <span>${item.name} (${item.qty}) × ${item.count}</span>
              <span>₹${item.subtotal}</span>
            </div>`
          ).join("");

          const card = document.createElement("div");
          card.className = "order-card";
          card.innerHTML = `
            <div class="order-card-top">
              <div class="order-customer">
                <strong>${order.customer.name}</strong>
                <a href="tel:${order.customer.phone}" class="order-phone">${order.customer.phone}</a>
              </div>
              <div class="order-meta">
                <span class="order-time">${time}</span>
                <span class="order-status ${statusClass}">${statusLabel}</span>
              </div>
            </div>
            ${order.customer.address ? `<p class="order-address">📍 ${order.customer.address}</p>` : ""}
            <div class="order-items-list">${itemsHtml}</div>
            ${order.notes ? `<p class="order-notes">📝 ${order.notes}</p>` : ""}
            <div class="order-card-bottom">
              <span class="order-total">Total: ₹${order.total}</span>
              <div class="order-actions">
                <button class="status-btn prep-btn" onclick="updateStatus('${orderId}', 'preparing')" ${order.status !== 'pending' ? 'disabled' : ''}>
                  Preparing
                </button>
                <button class="status-btn done-btn" onclick="updateStatus('${orderId}', 'completed')" ${order.status === 'completed' ? 'disabled' : ''}>
                  Done
                </button>
              </div>
            </div>
          `;
          ordersList.appendChild(card);
        });
      }, error => {
        ordersList.innerHTML = `<p class="order-error">Failed to load orders: ${error.message}</p>`;
      });
  }
}


/* ----- 6. UPDATE ORDER STATUS -----
   Called from status buttons in order cards. */

function updateStatus(orderId, newStatus) {
  db.collection("orders").doc(orderId).update({
    status: newStatus
  }).catch(error => {
    alert("Failed to update status: " + error.message);
  });
}
