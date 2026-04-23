/* ============================================================
   TRACK ORDER — Me Ma Mana Ruchulu
   Queries Firestore by orderId field via REST API
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyD0mikp8Hiw9YxDYDBGohs_U9PItGARo3o",
  authDomain: "me-ma-mana-ruchulu.firebaseapp.com",
  projectId: "me-ma-mana-ruchulu",
  storageBucket: "me-ma-mana-ruchulu.firebasestorage.app",
  messagingSenderId: "789758322502",
  appId: "1:789758322502:web:2025becd7cde67560ca747"
};

firebase.initializeApp(firebaseConfig);

const FIRESTORE_QUERY_URL =
  `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;


/* ----- DOM REFERENCES ----- */

const trackForm    = document.getElementById("trackForm");
const orderInput   = document.getElementById("orderIdInput");
const trackBtn     = document.getElementById("trackBtn");
const btnText      = trackBtn.querySelector(".track-btn-text");
const btnLoader    = trackBtn.querySelector(".track-btn-loader");
const errorEl      = document.getElementById("trackError");
const resultEl     = document.getElementById("trackResult");


/* ----- HELPERS ----- */

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.add("visible");
}

function hideError() {
  errorEl.classList.remove("visible");
  errorEl.textContent = "";
}

function setLoading(isLoading) {
  btnText.style.display = isLoading ? "none" : "inline";
  btnLoader.style.display = isLoading ? "inline-block" : "none";
  trackBtn.disabled = isLoading;
}

// Parse Firestore REST value → JS value
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

function parseDoc(doc) {
  const fields = doc.fields || {};
  const data = {};
  for (const key in fields) data[key] = parseValue(fields[key]);
  return data;
}


/* ----- MAIN: SEARCH ORDER BY ID ----- */

async function searchOrder(orderId) {
  const queryBody = {
    structuredQuery: {
      from: [{ collectionId: "orders" }],
      where: {
        fieldFilter: {
          field: { fieldPath: "orderId" },
          op: "EQUAL",
          value: { stringValue: orderId }
        }
      },
      limit: 1
    }
  };

  const response = await fetch(FIRESTORE_QUERY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(queryBody)
  });

  if (!response.ok) {
    throw new Error(`Server error ${response.status}`);
  }

  const result = await response.json();

  // runQuery returns an array. Empty result = no match.
  const firstHit = result.find(r => r.document);
  if (!firstHit) return null;

  return parseDoc(firstHit.document);
}


/* ----- RENDER ORDER RESULT ----- */

function renderResult(order) {
  const status = order.status || "pending";
  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];

  // Timeline progress: 1=pending, 2=preparing, 3=out_for_delivery, 4=delivered
  const progress =
      status === "delivered"        ? 4
    : status === "completed"        ? 4
    : status === "out_for_delivery" ? 3
    : status === "preparing"        ? 2
                                    : 1;

  // Status label for the badge
  const statusLabel =
      status === "delivered"        ? "Delivered"
    : status === "out_for_delivery" ? "Out for Delivery"
    : status === "preparing"        ? "Preparing"
    : status === "completed"        ? "Completed"
    : status === "pending"          ? "Pending"
                                    : status;

  let formattedTime = "";
  try {
    if (order.createdAt) {
      formattedTime = new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }
  } catch (e) {
    formattedTime = "Unknown";
  }

  const itemsHtml = items.map(item =>
    `<div class="result-item">
      <span>${item.name || "Unknown"} (${item.qty || "-"}) × ${item.count || 1}</span>
      <span>₹${item.subtotal || item.price || 0}</span>
    </div>`
  ).join("");

  resultEl.innerHTML = `
    <div class="result-card">
      <div class="result-header">
        <span class="result-id">${order.orderId || "—"}</span>
        <span class="result-status ${status}">${statusLabel}</span>
      </div>

      <div class="status-timeline timeline-4" data-progress="${progress}">
        <div class="status-step ${progress >= 1 ? 'done' : ''} ${progress === 1 ? 'active' : ''}">
          <div class="status-dot">${progress >= 2 ? '✓' : '1'}</div>
          <div class="status-label">Order Received</div>
        </div>
        <div class="status-step ${progress >= 2 ? (progress === 2 ? 'active' : 'done') : ''}">
          <div class="status-dot">${progress >= 3 ? '✓' : '2'}</div>
          <div class="status-label">Preparing</div>
        </div>
        <div class="status-step ${progress >= 3 ? (progress === 3 ? 'active' : 'done') : ''}">
          <div class="status-dot">${progress >= 4 ? '✓' : '3'}</div>
          <div class="status-label">Out for Delivery</div>
        </div>
        <div class="status-step ${progress === 4 ? 'done' : ''}">
          <div class="status-dot">${progress === 4 ? '✓' : '4'}</div>
          <div class="status-label">Delivered</div>
        </div>
      </div>

      <div class="result-section">
        <h4>Customer</h4>
        <div class="result-row">
          <span>Name</span>
          <strong>${customer.name || "—"}</strong>
        </div>
        <div class="result-row">
          <span>Phone</span>
          <strong>${customer.phone || "—"}</strong>
        </div>
        ${customer.address ? `
          <div class="result-row">
            <span>Address</span>
            <strong style="text-align:right;max-width:60%">${customer.address}</strong>
          </div>
        ` : ""}
        ${formattedTime ? `
          <div class="result-row">
            <span>Ordered on</span>
            <strong>${formattedTime}</strong>
          </div>
        ` : ""}
      </div>

      <div class="result-section">
        <h4>Items</h4>
        <div class="result-items-list">
          ${itemsHtml || '<div class="result-item"><span>No items</span></div>'}
        </div>
        <div class="result-total">
          <span>Total</span>
          <span>₹${order.total || 0}</span>
        </div>
      </div>

      ${order.notes ? `
        <div class="result-section">
          <h4>Special Instructions</h4>
          <p style="font-size:0.85rem;color:var(--text-body);">${order.notes}</p>
        </div>
      ` : ""}

      <button class="track-again-btn" onclick="resetTracker()">Track Another Order</button>
    </div>
  `;

  resultEl.classList.add("show");
}


/* ----- RESET ----- */

function resetTracker() {
  resultEl.classList.remove("show");
  setTimeout(() => {
    resultEl.innerHTML = "";
    orderInput.value = "";
    orderInput.focus();
  }, 300);
}


/* ----- FORM SUBMIT ----- */

trackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const orderId = orderInput.value.trim().toUpperCase();

  hideError();
  resultEl.classList.remove("show");

  if (!orderId) {
    showError("Please enter an Order ID");
    return;
  }

  // Basic format check — our IDs look like MMR-XXXXXX (8+ chars)
  if (orderId.length < 5) {
    showError("Order ID looks too short. Check your order confirmation.");
    return;
  }

  setLoading(true);

  try {
    const order = await searchOrder(orderId);

    if (!order) {
      showError(`No order found with ID "${orderId}". Please check and try again.`);
      return;
    }

    renderResult(order);

  } catch (error) {
    console.error("Track order error:", error);
    showError("Could not fetch order. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
});

// Auto-uppercase as user types
orderInput.addEventListener("input", () => {
  const pos = orderInput.selectionStart;
  orderInput.value = orderInput.value.toUpperCase();
  orderInput.setSelectionRange(pos, pos);
});

// Auto-fill order ID from URL param OR localStorage (priority: URL > storage)
const urlOrderId = new URLSearchParams(window.location.search).get("id");
let savedOrderId = null;
try {
  savedOrderId = localStorage.getItem("lastOrderId");
} catch (e) {}

const autoFillId = urlOrderId || savedOrderId;
if (autoFillId) {
  orderInput.value = autoFillId.toUpperCase();
  // Auto-submit only if from URL (user explicitly clicked a link)
  if (urlOrderId) {
    trackForm.dispatchEvent(new Event("submit"));
  }
}
