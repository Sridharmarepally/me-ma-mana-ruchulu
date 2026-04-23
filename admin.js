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


  /* ----- 5. FETCH ORDERS VIA REST API -----
     Uses Firestore REST API (same fix as customer side).
     Polls every 15 seconds for near-real-time updates.    */

  const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/orders`;

  // Parse Firestore REST value to JS
  function parseValue(val) {
    if (!val) return null;
    if ("stringValue" in val) return val.stringValue;
    if ("integerValue" in val) return Number(val.integerValue);
    if ("doubleValue" in val) return val.doubleValue;
    if ("booleanValue" in val) return val.booleanValue;
    if ("nullValue" in val) return null;
    if ("timestampValue" in val) return val.timestampValue;
    if ("mapValue" in val) {
      const obj = {};
      const fields = val.mapValue.fields || {};
      for (const key in fields) obj[key] = parseValue(fields[key]);
      return obj;
    }
    if ("arrayValue" in val) {
      return (val.arrayValue.values || []).map(parseValue);
    }
    return null;
  }

  // Parse a full Firestore REST document
  function parseDoc(doc) {
    const fields = doc.fields || {};
    const data = {};
    for (const key in fields) data[key] = parseValue(fields[key]);
    data._id = doc.name.split("/").pop();
    return data;
  }

  async function fetchOrders() {
    console.log("📋 Fetching orders via REST API...");
    try {
      const res = await fetch(FIRESTORE_URL + "?pageSize=50");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const documents = json.documents || [];

      if (documents.length === 0) {
        ordersList.innerHTML = `
          <div class="no-orders">
            <p>No orders yet</p>
            <span>Orders will appear here when customers place them</span>
          </div>
        `;
        ordersCount.textContent = "";
        return;
      }

      // Parse all documents
      const orders = documents.map(parseDoc);

      // Sort newest first
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      console.log("✅ Loaded", orders.length, "orders");
      ordersCount.textContent = `(${orders.length})`;
      ordersList.innerHTML = "";

      orders.forEach(order => {
        const orderId = order._id;

        // Safe fallbacks
        const customer      = order.customer || {};
        const customerName  = customer.name  || "Guest";
        const customerPhone = customer.phone || "N/A";
        const customerAddr  = customer.address || "";
        const items         = Array.isArray(order.items) ? order.items : [];
        const total         = order.total || 0;
        const notes         = order.notes || "";
        const status        = order.status || "pending";

        // Parse timestamp
        let time = "Just now";
        try {
          if (order.createdAt) {
            time = new Date(order.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short"
            });
          }
        } catch (e) {
          time = "Unknown time";
        }

        const statusClass = status === "completed" ? "status-done"
          : status === "preparing" ? "status-prep"
            : "status-pending";

        const statusLabel = status === "completed" ? "Completed"
          : status === "preparing" ? "Preparing"
            : "Pending";

        const itemsHtml = items.map(item =>
          `<div class="order-item-row">
            <span>${item?.name || "Unknown"} (${item?.qty || "-"}) × ${item?.count || 1}</span>
            <span>₹${item?.subtotal || item?.price || 0}</span>
          </div>`
        ).join("") || '<div class="order-item-row"><span>No items</span><span>-</span></div>';

        const card = document.createElement("div");
        card.className = "order-card";
        card.innerHTML = `
          <div class="order-card-top">
            <div class="order-customer">
              <strong>${customerName}</strong>
              ${customerPhone !== "N/A"
                ? `<a href="tel:${customerPhone}" class="order-phone">${customerPhone}</a>`
                : `<span class="order-phone">No phone</span>`
              }
            </div>
            <div class="order-meta">
              <span class="order-time">${time}</span>
              <span class="order-status ${statusClass}">${statusLabel}</span>
            </div>
          </div>
          ${customerAddr ? `<p class="order-address">📍 ${customerAddr}</p>` : ""}
          <div class="order-items-list">${itemsHtml}</div>
          ${notes ? `<p class="order-notes">📝 ${notes}</p>` : ""}
          <div class="order-card-bottom">
            <span class="order-total">Total: ₹${total}</span>
            <div class="order-actions">
              <button class="status-btn prep-btn" onclick="updateStatus('${orderId}', 'preparing')" ${status !== 'pending' ? 'disabled' : ''}>
                Preparing
              </button>
              <button class="status-btn done-btn" onclick="updateStatus('${orderId}', 'completed')" ${status === 'completed' ? 'disabled' : ''}>
                Done
              </button>
            </div>
          </div>
        `;
        ordersList.appendChild(card);
      });

    } catch (error) {
      console.error("❌ Failed to fetch orders:", error.message);
      ordersList.innerHTML = `<p class="order-error">Failed to load orders: ${error.message}</p>`;
    }
  }

  // Make fetchOrders accessible to updateStatus
  window._fetchOrders = fetchOrders;

  function listenToOrders() {
    fetchOrders();
    setInterval(fetchOrders, 15000);
  }
}


/* ----- 6. UPDATE ORDER STATUS (REST API) -----
   Called from status buttons in order cards.    */

function updateStatus(orderId, newStatus) {
  const url = `https://firestore.googleapis.com/v1/projects/me-ma-mana-ruchulu/databases/(default)/documents/orders/${orderId}?updateMask.fieldPaths=status`;

  fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        status: { stringValue: newStatus }
      }
    })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log("✅ Status updated to:", newStatus);
    if (window._fetchOrders) window._fetchOrders();
  })
  .catch(error => {
    alert("Failed to update status: " + error.message);
  });
}

