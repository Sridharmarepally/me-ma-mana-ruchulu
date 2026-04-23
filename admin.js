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

  // In-memory cache of all fetched orders (used for filtering without refetch)
  let allOrders = [];

  // Check if today (treats both ISO string + Firestore timestamp)
  function isToday(createdAt) {
    if (!createdAt) return false;
    try {
      const d = new Date(createdAt);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() &&
             d.getMonth()    === now.getMonth() &&
             d.getDate()     === now.getDate();
    } catch (e) {
      return false;
    }
  }

  // Update summary cards based on ALL orders (not filtered)
  function updateSummary(orders) {
    const sumToday     = document.getElementById("sumToday");
    const sumPending   = document.getElementById("sumPending");
    const sumCompleted = document.getElementById("sumCompleted");
    const sumRevenue   = document.getElementById("sumRevenue");

    let todayCount = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let revenue = 0;

    orders.forEach(o => {
      const status = o.status || "pending";
      revenue += Number(o.total || 0);
      if (status === "pending") pendingCount++;
      if (status === "completed") completedCount++;
      if (isToday(o.createdAt)) todayCount++;
    });

    console.log("📊 Summary:", { todayCount, pendingCount, completedCount, revenue, total: orders.length });

    if (sumToday)     sumToday.textContent     = todayCount;
    if (sumPending)   sumPending.textContent   = pendingCount;
    if (sumCompleted) sumCompleted.textContent = completedCount;
    if (sumRevenue)   sumRevenue.textContent   = "₹" + revenue.toLocaleString("en-IN");
  }

  // Apply search + filters on cached data
  function applyFilters() {
    const searchInput  = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const dateFilter   = document.getElementById("dateFilter");

    const query     = (searchInput  && searchInput.value  || "").trim().toLowerCase();
    const statusVal = (statusFilter && statusFilter.value || "all");
    const dateVal   = (dateFilter   && dateFilter.value   || "all");

    console.log("🔍 Applying filters:", { query, statusVal, dateVal, totalOrders: allOrders.length });

    const filtered = allOrders.filter(o => {
      // Status filter
      if (statusVal !== "all" && (o.status || "pending") !== statusVal) return false;

      // Date filter (today only)
      if (dateVal === "today" && !isToday(o.createdAt)) return false;

      // Search (customer name OR phone)
      if (query) {
        const customer = o.customer || {};
        const name  = String(customer.name  || "").toLowerCase();
        const phone = String(customer.phone || "").toLowerCase();
        if (!name.includes(query) && !phone.includes(query)) return false;
      }

      return true;
    });

    renderOrders(filtered);
  }

  // Wire up live search + filter events ONCE (after DOM ready)
  function wireToolbarEvents() {
    const searchInput  = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const dateFilter   = document.getElementById("dateFilter");

    if (searchInput && !searchInput._wired) {
      searchInput.addEventListener("input", applyFilters);
      searchInput._wired = true;
    }
    if (statusFilter && !statusFilter._wired) {
      statusFilter.addEventListener("change", applyFilters);
      statusFilter._wired = true;
    }
    if (dateFilter && !dateFilter._wired) {
      dateFilter.addEventListener("change", applyFilters);
      dateFilter._wired = true;
    }
  }

  // Render a given list of orders (full re-render each call)
  function renderOrders(orders) {
    if (orders.length === 0) {
      ordersList.innerHTML = `
        <div class="no-orders">
          <p>No matching orders</p>
          <span>Try clearing search or changing filters</span>
        </div>
      `;
      ordersCount.textContent = "(0)";
      return;
    }

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
        card.setAttribute("data-order-id", orderId);
        // Safe-encode for JS string attributes
        const safeAddr  = customerAddr.replace(/'/g, "\\'").replace(/\n/g, " ");
        const safePhone = customerPhone.replace(/'/g, "\\'");

        card.innerHTML = `
          <div class="order-card-top">
            <div class="order-customer">
              <strong>${customerName}</strong>
              ${customerPhone !== "N/A"
                ? `<div class="phone-row">
                     <a href="tel:${customerPhone}" class="order-phone">${customerPhone}</a>
                     <button class="icon-btn copy-phone-btn"
                       onclick="copyToClipboard('${safePhone}', 'Phone copied!')"
                       title="Copy phone number">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                         <rect x="9" y="9" width="13" height="13" rx="2"/>
                         <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                       </svg>
                     </button>
                   </div>`
                : `<span class="order-phone">No phone</span>`
              }
            </div>
            <div class="order-meta">
              <span class="order-time">${time}</span>
              <span class="order-status ${statusClass}">${statusLabel}</span>
            </div>
          </div>
          ${customerAddr ? `
            <div class="order-address-row">
              <p class="order-address">📍 ${customerAddr}</p>
              <div class="address-actions">
                <button class="addr-btn copy-addr-btn"
                  onclick="copyToClipboard('${safeAddr}', 'Address copied!')"
                  title="Copy address">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                  Copy
                </button>
                <a class="addr-btn maps-btn"
                  href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddr)}"
                  target="_blank" rel="noopener" title="Open in Google Maps">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Maps
                </a>
              </div>
            </div>
          ` : ""}
          <div class="order-items-list">${itemsHtml}</div>
          ${notes ? `<p class="order-notes">📝 ${notes}</p>` : ""}
          <div class="order-card-bottom">
            <span class="order-total">Total: ₹${total}</span>
            <div class="order-actions">
              <button class="status-btn prep-btn" onclick="updateStatus('${orderId}', 'preparing')" ${status !== 'pending' ? 'disabled' : ''}>
                Start Preparing
              </button>
              <button class="status-btn done-btn" onclick="updateStatus('${orderId}', 'completed')" ${status !== 'preparing' ? 'disabled' : ''}>
                Mark as Completed
              </button>
              <button class="status-btn notify-btn"
                onclick="notifyCustomer('${customerName.replace(/'/g, "\\'")}', '${customerPhone}', '${status}')"
                ${customerPhone === 'N/A' ? 'disabled title="No phone number"' : ''}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Notify
              </button>
              <button class="status-btn delete-btn"
                onclick="deleteOrder('${orderId}', '${customerName.replace(/'/g, "\\'")}')"
                title="Delete this order">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        `;
        ordersList.appendChild(card);
      });
  }

  // Fetch orders from Firestore and update cache + UI
  async function fetchOrders() {
    try {
      const res = await fetch(FIRESTORE_URL + "?pageSize=100");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const documents = json.documents || [];
      console.log("📋 Fetched", documents.length, "orders from Firestore");

      // Parse + sort newest first
      const orders = documents.map(parseDoc);
      orders.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      // Cache for filtering
      allOrders = orders;

      // Wire up events if not yet (safety — in case dashboard wasn't visible when listenToOrders ran)
      wireToolbarEvents();

      // Summary always reflects ALL orders
      updateSummary(allOrders);

      // Handle empty state
      if (allOrders.length === 0) {
        ordersList.innerHTML = `
          <div class="no-orders">
            <p>No orders yet</p>
            <span>Orders will appear here when customers place them</span>
          </div>
        `;
        ordersCount.textContent = "";
        return;
      }

      // Apply current filters + search to render
      applyFilters();

    } catch (error) {
      console.error("❌ Failed to fetch orders:", error.message);
      ordersList.innerHTML = `<p class="order-error">Failed to load orders: ${error.message}</p>`;
    }
  }


  // Make fetchOrders accessible to updateStatus
  window._fetchOrders = fetchOrders;

  function listenToOrders() {
    // Wire up toolbar events now that the dashboard is visible
    wireToolbarEvents();
    fetchOrders();
    // Poll every 5 seconds for near real-time updates
    setInterval(fetchOrders, 5000);
  }
}


/* ----- 6. UPDATE ORDER STATUS (REST API) -----
   Called from status buttons in order cards.    */

/* ----- 7. NOTIFY CUSTOMER VIA WHATSAPP -----
   Opens WhatsApp with a pre-filled message about order status. */

function notifyCustomer(name, phone, status) {
  if (!phone || phone === "N/A") {
    alert("No phone number available for this customer.");
    return;
  }

  // Normalize phone number — ensure it starts with country code 91 (India)
  let cleanPhone = String(phone).replace(/\D/g, ""); // digits only

  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;           // add India country code
  } else if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
    cleanPhone = "91" + cleanPhone.slice(1);  // 0XXX -> 91XXX
  }
  // If already starts with 91 and is 12 digits, keep as is

  if (cleanPhone.length < 10) {
    alert("Phone number looks invalid: " + phone);
    return;
  }

  // Status-specific friendly messages
  const statusLabels = {
    pending:    "received and is pending confirmation",
    preparing:  "being prepared now",
    completed:  "ready / completed"
  };
  const statusText = statusLabels[status] || status;

  const message =
    `Hi ${name}, your order from *Me Ma Mana Ruchulu* is now *${statusText}*. ` +
    `Thank you for ordering with us! 🙏`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}


/* ----- 8. DELETE ORDER -----
   Shows confirmation dialog, then deletes the order
   from Firestore via REST API DELETE.               */

/* ----- 9. COPY TO CLIPBOARD + TOAST -----
   Copies text using Clipboard API with fallback
   for older browsers / HTTP contexts.            */

function copyToClipboard(text, message) {
  const successMsg = message || "Copied!";

  // Modern Clipboard API (secure contexts / HTTPS)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(successMsg))
      .catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

// Fallback for browsers without Clipboard API
function fallbackCopy(text, message) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    if (success) {
      showToast(message);
    } else {
      alert("Could not copy. Please copy manually:\n\n" + text);
    }
  } catch (err) {
    alert("Could not copy. Please copy manually:\n\n" + text);
  }
}

// Lightweight toast for copy feedback
function showToast(message) {
  // Remove any existing toast
  const existing = document.getElementById("adminToast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "adminToast";
  toast.className = "admin-toast";
  toast.textContent = "✓ " + message;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add("show"));

  // Auto-dismiss after 2s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}


function deleteOrder(orderId, customerName) {
  const name = customerName || "this customer";
  const confirmed = confirm(
    `Are you sure you want to delete this order from ${name}?\n\n` +
    `This action cannot be undone.`
  );

  if (!confirmed) return;

  // Fade out the card immediately for instant feedback
  const card = document.querySelector(`[data-order-id="${orderId}"]`);
  if (card) card.classList.add("deleting");

  const url = `https://firestore.googleapis.com/v1/projects/me-ma-mana-ruchulu/databases/(default)/documents/orders/${orderId}`;

  fetch(url, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("🗑️ Order deleted:", orderId);
      // Refresh order list to reflect deletion
      if (window._fetchOrders) window._fetchOrders();
    })
    .catch(error => {
      console.error("❌ Delete failed:", error.message);
      alert("Failed to delete order. Please try again.\n\nError: " + error.message);
      if (card) card.classList.remove("deleting");
    });
}


function updateStatus(orderId, newStatus) {
  // Instant UI update — update the card's status badge immediately
  const card = document.querySelector(`[data-order-id="${orderId}"]`);
  if (card) {
    card.classList.add("updating");
  }

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
    // Refresh order list immediately to reflect the change
    if (window._fetchOrders) window._fetchOrders();
  })
  .catch(error => {
    console.error("❌ Status update failed:", error.message);
    alert("Failed to update status. Please check your connection and try again.\n\nError: " + error.message);
    if (card) card.classList.remove("updating");
  });
}

