/* ============================================================
   ME MA MANA RUCHULU — MAIN SCRIPT
   Handles: Menu Data, Card Rendering, Filtering, WhatsApp Orders
   ============================================================ */


/* ----- 1. MENU DATA -----
   All 38 items stored in a single array.
   Each item has: name, telugu, category, image, and a prices array.
   To add/remove items, just edit this array.                        */

const MENU_DATA = [

  // ==================== SNACK ITEMS (9) ====================
  {
    name: "Murukulu",
    telugu: "మురుకులు",
    category: "snacks",
    image: "images/Murukulu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 225 },
      { qty: "1 KG",   amount: 450 }
    ]
  },
  {
    name: "Sanna Segu",
    telugu: "సన్నసేగు / జాడప్పలు",
    category: "snacks",
    image: "images/Sanna Segu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 225 },
      { qty: "1 KG",   amount: 450 }
    ]
  },
  {
    name: "Atukulu Mixture",
    telugu: "అటుకులు మిక్చర్",
    category: "snacks",
    image: "images/Atukula-mixture.jpg",
    prices: [
      { qty: "1/2 KG", amount: 250 },
      { qty: "1 KG",   amount: 500 }
    ]
  },
  {
    name: "Chuduva Atukulu",
    telugu: "చుడువ అటుకులు",
    category: "snacks",
    image: "images/Atukula-Chudva-800x800.jpg",
    prices: [
      { qty: "1/2 KG", amount: 250 },
      { qty: "1 KG",   amount: 500 }
    ]
  },
  {
    name: "Chekkalu / Appalu",
    telugu: "చెక్కలు / అప్పలు",
    category: "snacks",
    image: "images/Chekkalu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 200 },
      { qty: "1 KG",   amount: 400 }
    ]
  },
  {
    name: "Masala Chekkalu",
    telugu: "మసాలా చెక్కలు",
    category: "snacks",
    image: "images/masala-chekkalu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 225 },
      { qty: "1 KG",   amount: 450 }
    ]
  },
  {
    name: "Kaara Boondhi",
    telugu: "కారా బూంధి",
    category: "snacks",
    image: "images/Kara Boondhi.jpg",
    prices: [
      { qty: "1/2 KG", amount: 250 },
      { qty: "1 KG",   amount: 500 }
    ]
  },
  {
    name: "Chegodulu",
    telugu: "చేగోడులు (బెల్లం / ప్లైన్)",
    category: "snacks",
    image: "images/Chegodulu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 225 },
      { qty: "1 KG",   amount: 450 }
    ]
  },
  {
    name: "Ribbon Pakodi",
    telugu: "రిబ్బన్ పకోడి",
    category: "snacks",
    image: "images/Ribbon pakodi.jpg",
    prices: [
      { qty: "1/2 KG", amount: 175 },
      { qty: "1 KG",   amount: 350 }
    ]
  },
  {
    name: "Dry Fruit Laddu",
    telugu: "డ్రై ఫ్రూట్ లడ్డు",
    category: "sweets",
    image: "images/Dry Fruit Laddu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 625 },
      { qty: "1 KG",   amount: 1250 }
    ]
  },

  // ==================== SWEET ITEMS (10) ====================
  {
    name: "Ravva Laddu",
    telugu: "రవ్వ లడ్డు",
    category: "sweets",
    image: "images/Rava Laddu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 200 },
      { qty: "1 KG",   amount: 400 }
    ]
  },
  {
    name: "Sunnundalu",
    telugu: "సున్నుండలు (బెల్లం / పంచదార)",
    category: "sweets",
    image: "images/Sunnundalu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 150 },
      { qty: "1 KG",   amount: 300 }
    ]
  },
  {
    name: "Kajjikayalu",
    telugu: "కజ్జికాయలు (బెల్లం / పంచదార)",
    category: "sweets",
    image: "images/Kajjikayalu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 175 },
      { qty: "1 KG",   amount: 350 }
    ]
  },
  {
    name: "Boondi Laddu",
    telugu: "బూంది లడ్డు",
    category: "sweets",
    image: "images/Boondhi Laddu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 125 },
      { qty: "1 KG",   amount: 250 }
    ]
  },
  {
    name: "Bakshalu / Bobbatlu",
    telugu: "బక్షాలు / బొబ్బట్లు",
    category: "sweets",
    image: "images/Bakshalu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 200 },
      { qty: "1 KG",   amount: 400 }
    ]
  },
  {
    name: "Nuvvula Laddu",
    telugu: "నువ్వుల లడ్డు",
    category: "sweets",
    image: "images/Nuvvula Laddu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 175 },
      { qty: "1 KG",   amount: 350 }
    ]
  },
  {
    name: "Besan Laddu",
    telugu: "బేసన్ లడ్డు",
    category: "sweets",
    image: "images/Besan Laddu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 300 },
      { qty: "1 KG",   amount: 600 }
    ]
  },
  {
    name: "Ariselu",
    telugu: "అరిసెలు",
    category: "sweets",
    image: "images/Ariselu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 250 },
      { qty: "1 KG",   amount: 500 }
    ]
  },
  {
    name: "Palli Laddu",
    telugu: "పల్లి లడ్డు",
    category: "sweets",
    image: "images/Palli Laddu.jpg",
    prices: [
      { qty: "1/2 KG", amount: 175 },
      { qty: "1 KG",   amount: 350 }
    ]
  },

  // ==================== POWDERS (8) ====================
  {
    name: "Munagaku Podi",
    telugu: "మునగాకు పొడి (Moringa Powder)",
    category: "powders",
    image: "images/Munagaku Podi.jpg",
    prices: [
      { qty: "100g",   amount: 110 },
      { qty: "1/4 KG", amount: 225 },
      { qty: "1 KG",   amount: 900 }
    ]
  },
  {
    name: "Karivepaku Podi",
    telugu: "కరివేపాకు పొడి (Curry Leaf Powder)",
    category: "powders",
    image: "images/Karivepaku-Podi.jpg",
    prices: [
      { qty: "100g",   amount: 110 },
      { qty: "1/4 KG", amount: 225 },
      { qty: "1 KG",   amount: 900 }
    ]
  },
  {
    name: "Kandi Podi",
    telugu: "కంది పొడి (Roasted Lentil Powder)",
    category: "powders",
    image: "images/Kandi-Podi.jpg",
    prices: [
      { qty: "100g",   amount: 80 },
      { qty: "1/4 KG", amount: 200 },
      { qty: "1 KG",   amount: 800 }
    ]
  },
  {
    name: "Putnala Podi",
    telugu: "పుట్నాల పొడి (Fried Gram Powder)",
    category: "powders",
    image: "images/Putnala-Podi.jpg",
    prices: [
      { qty: "100g",   amount: 70 },
      { qty: "1/4 KG", amount: 165 },
      { qty: "1 KG",   amount: 650 }
    ]
  },
  {
    name: "Avisa Ginjala Podi",
    telugu: "అవిస గింజల పొడి (Flaxseed Powder)",
    category: "powders",
    image: "images/Aviseginjala Podi.jpg",
    prices: [
      { qty: "100g",   amount: 110 },
      { qty: "1/4 KG", amount: 225 },
      { qty: "1 KG",   amount: 900 }
    ]
  },
  {
    name: "Sambar Podi",
    telugu: "సాంబార్ పొడి (Sambar Powder)",
    category: "powders",
    image: "images/Sambar-Podi.jpg",
    prices: [
      { qty: "100g",   amount: 110 },
      { qty: "1/4 KG", amount: 225 },
      { qty: "1 KG",   amount: 900 }
    ]
  },
  {
    name: "Rasam Podi",
    telugu: "రసం పొడి (Rasam Powder)",
    category: "powders",
    image: "images/rasam-powder.jpg",
    prices: [
      { qty: "100g",   amount: 110 },
      { qty: "1/4 KG", amount: 225 },
      { qty: "1 KG",   amount: 900 }
    ]
  },
  {
    name: "Palli Karam Podi",
    telugu: "పల్లి కారం పొడి (Peanut Chilli Powder)",
    category: "powders",
    image: "images/Palli karam Podi.jpg",
    prices: [
      { qty: "100g",   amount: 85 },
      { qty: "1/4 KG", amount: 175 },
      { qty: "1 KG",   amount: 700 }
    ]
  },

  // ==================== PICKLES (7) ====================
  {
    name: "Usirikaya Pachadi",
    telugu: "ఉసిరికాయ పచ్చడి (Amla Pickle)",
    category: "pickles",
    image: "images/Usirikay pachadi.jpg",
    prices: [
      { qty: "1/4 KG", amount: 200 },
      { qty: "1/2 KG", amount: 400 },
      { qty: "1 KG",   amount: 800 }
    ]
  },
  {
    name: "Tomato Pachadi",
    telugu: "టమాటో పచ్చడి (Tomato Pickle)",
    category: "pickles",
    image: "images/Tomato Pickle.jpg",
    prices: [
      { qty: "1/4 KG", amount: 125 },
      { qty: "1/2 KG", amount: 250 },
      { qty: "1 KG",   amount: 500 }
    ]
  },
  {
    name: "Mamidikaya Pachadi",
    telugu: "మామిడికాయ పచ్చడి (Mango Pickle)",
    category: "pickles",
    image: "images/Mango Pickle.jpg",
    prices: [
      { qty: "1/4 KG", amount: 190 },
      { qty: "1/2 KG", amount: 375 },
      { qty: "1 KG",   amount: 750 }
    ]
  },
  {
    name: "Uppava",
    telugu: "ఉప్పవ (Salted Sesame Pickle)",
    category: "pickles",
    image: "images/uppava.jpg",
    prices: [
      { qty: "1/4 KG", amount: 115 },
      { qty: "1/2 KG", amount: 225 },
      { qty: "1 KG",   amount: 450 }
    ]
  },
  {
    name: "Grated Mango Pickle",
    telugu: "మామిడికాయ తురుము పచ్చడి",
    category: "pickles",
    image: "images/Mamidikaya chekku pachadi.jpg",
    prices: [
      { qty: "1/2 KG", amount: 200 },
      { qty: "1 KG",   amount: 400 }
    ]
  },
  {
    name: "Gongura Pachadi",
    telugu: "గోంగూర పచ్చడి (Roselle Leaves Pickle)",
    category: "pickles",
    image: "images/gongura pachadi.jpg",
    prices: [
      { qty: "1/4 KG", amount: 150 },
      { qty: "1/2 KG", amount: 300 },
      { qty: "1 KG",   amount: 600 }
    ]
  },
  {
    name: "Cauliflower Niluva Pachadi",
    telugu: "కాలీఫ్లవర్ నిలువ పచ్చడి",
    category: "pickles",
    image: "images/Cauliflower Pachadi.jpg",
    prices: [
      { qty: "1/4 KG", amount: 125 },
      { qty: "1/2 KG", amount: 250 },
      { qty: "1 KG",   amount: 500 }
    ]
  },

  // ==================== FRYUMS / VADIYALU (4) ====================
  {
    name: "Biyyam Appadalu",
    telugu: "బియ్యం అప్పడాలు (Rice Papad)",
    category: "fryums",
    image: "images/Saggu biyyam appalu.jpg",
    prices: [
      { qty: "1 KG", amount: 180 }
    ]
  },
  {
    name: "Biyyam Janthikalu",
    telugu: "బియ్యం జంతికలు (Rice Murukulu)",
    category: "fryums",
    image: "images/Biyyam Janthikalu.jpg",
    prices: [
      { qty: "1 KG", amount: 250 }
    ]
  },
  {
    name: "Saggubiyyam Appadalu",
    telugu: "సగ్గుబియ్యం అప్పడాలు (Sago Papad)",
    category: "fryums",
    image: "images/Saggu biyyam appalu.jpg",
    prices: [
      { qty: "1 KG", amount: 300 }
    ]
  },
  {
    name: "Gummadikaya Vadiyalu",
    telugu: "గుమ్మడికాయ వడియాలు (Pumpkin Fryums)",
    category: "fryums",
    image: "images/Gummadi-Vadiyalu.jpg",
    prices: [
      { qty: "1 KG", amount: 350 }
    ]
  }
];


/* ----- 2. CONFIGURATION -----
   WhatsApp number and category labels.   */

const WHATSAPP_NUMBER = "919502043575";

const CATEGORY_LABELS = {
  snacks:  "Snacks",
  sweets:  "Sweets",
  powders: "Powders",
  pickles: "Pickles",
  fryums:  "Fryums"
};


/* ----- 3. DOM REFERENCES -----
   Grab all elements we'll interact with.  */

const menuGrid    = document.getElementById("menuGrid");
const itemCount   = document.getElementById("itemCount");
const filterBtns  = document.querySelectorAll(".filter-btn");
const header      = document.getElementById("header");
const mobileBtn   = document.getElementById("mobileMenuBtn");
const mobileNav   = document.getElementById("mobileNav");


/* ----- 4. RENDER MENU CARDS -----
   Takes an array of items, builds HTML cards,
   and injects them into the grid.            */

function renderItems(items) {
  // WhatsApp SVG icon used inside every order button
  const whatsappSVG = `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;

  // Build price rows for the table inside each card
  function buildPriceRows(prices) {
    return prices.map(p =>
      `<tr>
        <td class="price-label">${p.qty}</td>
        <td class="price-value">&#8377;${p.amount}</td>
      </tr>`
    ).join("");
  }

  // Build every card's HTML
  const cardsHTML = items.map(item => `
    <div class="menu-card" data-category="${item.category}">
      <div class="card-img-wrapper">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="card-img"
          loading="lazy"
          onerror="this.onerror=null;this.src='images/logo.jpg';this.classList.add('fallback')"
        >
      </div>
      <div class="card-body">
        <span class="card-category ${item.category}">${CATEGORY_LABELS[item.category]}</span>
        <h3 class="card-title">${item.name}</h3>
        <p class="card-telugu">${item.telugu}</p>
        <table class="card-prices">
          <thead>
            <tr>
              <th>Quantity</th>
              <th style="text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${buildPriceRows(item.prices)}
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <div class="card-footer-row">
          <select class="qty-select" id="qty-${item.name.replace(/[^a-zA-Z0-9]/g, '')}">
            ${item.prices.map((p, i) => `<option value="${i}">${p.qty} — ₹${p.amount}</option>`).join("")}
          </select>
          <button class="add-cart-btn" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', '${item.name.replace(/[^a-zA-Z0-9]/g, '')}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `).join("");

  menuGrid.innerHTML = cardsHTML;

  // Update the "Showing X items" counter
  const categoryName = document.querySelector(".filter-btn.active").dataset.category;
  const label = categoryName === "all"
    ? `Showing all ${items.length} items`
    : `Showing ${items.length} items in ${CATEGORY_LABELS[categoryName]}`;
  itemCount.textContent = label;

  // Re-trigger staggered card entrance animation
  animateCards();
}


/* ----- 5. FILTER ITEMS BY CATEGORY -----
   Filters the MENU_DATA array and re-renders. */

function filterItems(category) {
  if (category === "all") {
    renderItems(MENU_DATA);
  } else {
    const filtered = MENU_DATA.filter(item => item.category === category);
    renderItems(filtered);
  }
}


/* ----- 6. FILTER BUTTON CLICK HANDLERS -----
   Toggles the "active" class and triggers filtering. */

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Remove active from all buttons
    filterBtns.forEach(b => b.classList.remove("active"));
    // Add active to clicked button
    btn.classList.add("active");
    // Filter and re-render
    filterItems(btn.dataset.category);
  });
});


/* ============================================================
   CART + ORDER SYSTEM
   Handles: Add to cart, cart UI, Firestore order submission
   ============================================================ */

/* ----- 7. FIREBASE INITIALIZATION ----- */

const firebaseConfig = {
  apiKey: "AIzaSyD0mikp8Hiw9YxDYDBGohs_U9PItGARo3o",
  authDomain: "me-ma-mana-ruchulu.firebaseapp.com",
  projectId: "me-ma-mana-ruchulu",
  storageBucket: "me-ma-mana-ruchulu.firebasestorage.app",
  messagingSenderId: "789758322502",
  appId: "1:789758322502:web:2025becd7cde67560ca747"
};

firebase.initializeApp(firebaseConfig);

// Firestore REST API base URL (bypasses SDK WebSocket issues)
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// Save order via REST API instead of SDK
async function saveOrderToFirestore(order) {
  // Convert JS object to Firestore REST format
  function toFirestoreValue(val) {
    if (val === null || val === undefined) return { nullValue: null };
    if (typeof val === "string") return { stringValue: val };
    if (typeof val === "number") return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
    if (typeof val === "boolean") return { booleanValue: val };
    if (Array.isArray(val)) return { arrayValue: { values: val.map(toFirestoreValue) } };
    if (typeof val === "object") {
      const fields = {};
      for (const key in val) {
        fields[key] = toFirestoreValue(val[key]);
      }
      return { mapValue: { fields } };
    }
    return { stringValue: String(val) };
  }

  const fields = {};
  for (const key in order) {
    fields[key] = toFirestoreValue(order[key]);
  }

  const response = await fetch(`${FIRESTORE_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Firestore error ${response.status}: ${errorBody}`);
  }

  const result = await response.json();
  // Extract document ID from the name field
  const docId = result.name.split("/").pop();
  console.log("✅ Order saved! Document ID:", docId);
  return docId;
}


/* ----- 8. CART STATE -----
   Cart stored in memory and localStorage for persistence. */

let cart = JSON.parse(localStorage.getItem("mmr_cart") || "[]");

function saveCart() {
  localStorage.setItem("mmr_cart", JSON.stringify(cart));
  updateCartUI();
}

/* ----- 9. ADD TO CART -----
   Called when user clicks "Add" on a menu card. */

function addToCart(itemName, itemId) {
  const selectEl = document.getElementById("qty-" + itemId);
  const selectedIndex = parseInt(selectEl.value);

  // Find the item in MENU_DATA
  const menuItem = MENU_DATA.find(m => m.name === itemName);
  if (!menuItem) return;

  const priceOption = menuItem.prices[selectedIndex];

  // Check if same item+qty already in cart — increase count
  const existing = cart.find(c => c.name === itemName && c.qty === priceOption.qty);
  if (existing) {
    existing.count += 1;
  } else {
    cart.push({
      name: itemName,
      qty: priceOption.qty,
      price: priceOption.amount,
      count: 1
    });
  }

  saveCart();

  // Brief "Added!" feedback on the button
  const btn = selectEl.closest(".card-footer").querySelector(".add-cart-btn");
  btn.innerHTML = "✓ Added";
  btn.classList.add("added");
  setTimeout(() => {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
    </svg> Add`;
    btn.classList.remove("added");
  }, 1200);
}


/* ----- 10. CART UI -----
   Renders cart drawer, badge, and handles open/close. */

const cartDrawer    = document.getElementById("cartDrawer");
const cartOverlay   = document.getElementById("cartOverlay");
const cartBody      = document.getElementById("cartBody");
const cartEmpty     = document.getElementById("cartEmpty");
const cartFooter    = document.getElementById("cartFooter");
const cartTotalEl   = document.getElementById("cartTotal");
const cartBadge     = document.getElementById("cartBadge");
const cartFloatBtn  = document.getElementById("cartFloatBtn");
const cartCloseBtn  = document.getElementById("cartClose");
const cartCheckout  = document.getElementById("cartCheckoutBtn");

function updateCartUI() {
  const totalItems = cart.reduce((sum, c) => sum + c.count, 0);
  const totalAmount = cart.reduce((sum, c) => sum + (c.price * c.count), 0);

  // Badge + float button — always visible, badge hidden when empty
  cartBadge.textContent = totalItems;
  cartBadge.style.display = totalItems > 0 ? "flex" : "none";
  cartFloatBtn.style.display = "flex";

  // Cart body
  if (cart.length === 0) {
    cartEmpty.style.display = "block";
    cartFooter.style.display = "none";
    // Remove any item elements
    cartBody.querySelectorAll(".cart-item").forEach(el => el.remove());
    return;
  }

  cartEmpty.style.display = "none";
  cartFooter.style.display = "block";
  cartTotalEl.textContent = "₹" + totalAmount;

  // Render cart items
  const existingItems = cartBody.querySelectorAll(".cart-item");
  existingItems.forEach(el => el.remove());

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">${item.qty} × ${item.count}</span>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-price">₹${item.price * item.count}</span>
        <div class="cart-item-controls">
          <button onclick="changeCartQty(${index}, -1)" class="cart-qty-btn">−</button>
          <span>${item.count}</span>
          <button onclick="changeCartQty(${index}, 1)" class="cart-qty-btn">+</button>
        </div>
        <button onclick="removeCartItem(${index})" class="cart-remove-btn" aria-label="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>
      </div>
    `;
    cartBody.insertBefore(div, cartEmpty);
  });
}

function changeCartQty(index, delta) {
  cart[index].count += delta;
  if (cart[index].count <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
}

// Open / close cart drawer
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartFloatBtn.addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);


/* ----- 11. ORDER FORM MODAL -----
   Opens when user clicks "Proceed to Order" in cart.
   Shows order summary and collects customer details. */

const orderModalOverlay = document.getElementById("orderModalOverlay");
const orderModal        = document.getElementById("orderModal");
const orderModalClose   = document.getElementById("orderModalClose");
const orderForm         = document.getElementById("orderForm");
const orderSummary      = document.getElementById("orderSummary");
const placeOrderBtn     = document.getElementById("placeOrderBtn");
const orderToast        = document.getElementById("orderToast");

// "Proceed to Order" → close cart, open modal
cartCheckout.addEventListener("click", () => {
  closeCart();
  showOrderModal();
});

function showOrderModal() {
  // Build order summary
  const total = cart.reduce((sum, c) => sum + (c.price * c.count), 0);
  orderSummary.innerHTML = `
    <h4>Order Summary</h4>
    ${cart.map(c => `
      <div class="summary-row">
        <span>${c.name} (${c.qty}) × ${c.count}</span>
        <span>₹${c.price * c.count}</span>
      </div>
    `).join("")}
    <div class="summary-row summary-total">
      <span>Total</span>
      <span>₹${total}</span>
    </div>
  `;

  orderModalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  orderModalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

orderModalClose.addEventListener("click", closeOrderModal);
orderModalOverlay.addEventListener("click", (e) => {
  if (e.target === orderModalOverlay) closeOrderModal();
});

// Clear address error once the input becomes valid
const addressFieldInit = document.getElementById("customerAddress");
const addressErrorInit = document.getElementById("addressError");
if (addressFieldInit && addressErrorInit) {
  addressFieldInit.addEventListener("input", () => {
    if (!validateAddress(addressFieldInit.value)) {
      addressFieldInit.classList.remove("invalid");
      addressErrorInit.classList.remove("show");
    }
  });
}


/* ----- 12. PLACE ORDER — SAVE TO FIRESTORE REST API + WHATSAPP -----
   Uses REST API directly to bypass SDK WebSocket connection issues.   */

// Generate a short human-friendly order ID like "MMR-2A5F9K"
function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `MMR-${timestamp}${random}`;
}

// Validate delivery address — returns error message string, or "" if valid
function validateAddress(addr) {
  const trimmed = (addr || "").trim();

  if (!trimmed) {
    return "Please enter delivery address";
  }
  if (trimmed.length < 10) {
    return "Address too short — please include more details";
  }

  // Smart check: must contain at least one address keyword
  const keywords = [
    "house", "street", "road", "colony", "nagar", "area",
    "flat", "apt", "apartment", "sector", "block", "lane",
    "gali", "village", "city", "town", "pin", "near"
  ];
  const lower = trimmed.toLowerCase();
  const hasKeyword = keywords.some(k => lower.includes(k));

  if (!hasKeyword) {
    return "Please enter full address with area details";
  }

  return ""; // valid
}

// Prevent double-submission
let isSubmitting = false;

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Block duplicate submissions
  if (isSubmitting) return;

  const name    = document.getElementById("customerName").value.trim();
  const phone   = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const notes   = document.getElementById("customerNotes").value.trim();
  const total   = cart.reduce((sum, c) => sum + (c.price * c.count), 0);

  // Validate: address is required + meaningful
  const addressField = document.getElementById("customerAddress");
  const addressError = document.getElementById("addressError");

  const addressErrorMessage = validateAddress(address);
  if (addressErrorMessage) {
    addressError.textContent = addressErrorMessage;
    addressField.classList.add("invalid");
    addressError.classList.add("show");
    addressField.focus();
    return; // stop submission
  }

  // Clear any previous invalid state
  addressField.classList.remove("invalid");
  addressError.classList.remove("show");

  isSubmitting = true;

  // Snapshot cart for confirmation display (cart will be cleared on success)
  const cartSnapshot = cart.map(c => ({ ...c }));

  // Show loading
  const poText   = placeOrderBtn.querySelector(".po-text");
  const poLoader = placeOrderBtn.querySelector(".po-loader");
  poText.style.display = "none";
  poLoader.style.display = "inline-block";
  placeOrderBtn.disabled = true;

  // Generate order ID
  const orderId = generateOrderId();
  console.log("📦 Submitting order", orderId);

  // Build order object with orderId
  const order = {
    orderId: orderId,
    customer: { name, phone, address },
    items: cart.map(c => ({
      name: c.name,
      qty: c.qty,
      price: c.price,
      count: c.count,
      subtotal: c.price * c.count
    })),
    total: total,
    notes: notes,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  // Build WhatsApp message (includes order ID)
  const itemLines = cart.map(c =>
    `${c.name} (${c.qty}) × ${c.count} = ₹${c.price * c.count}`
  ).join("\n");

  const waMessage = `*New Order — Me Ma Mana Ruchulu*\n\n` +
    `*Order ID:* ${orderId}\n` +
    `*Customer:* ${name}\n*Phone:* ${phone}\n` +
    (address ? `*Address:* ${address}\n` : "") +
    `\n*Items:*\n${itemLines}\n\n*Total: ₹${total}*` +
    (notes ? `\n\n*Notes:* ${notes}` : "");

  const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  try {
    // Save to Firestore via REST API
    await saveOrderToFirestore(order);

    // Success — clear cart and form
    cart = [];
    saveCart();
    orderForm.reset();
    closeOrderModal();

    // Show confirmation modal with all order details
    showConfirmation({
      orderId,
      name,
      items: cartSnapshot,
      total,
      waURL
    });

    // Open WhatsApp after brief delay
    setTimeout(() => window.open(waURL, "_blank"), 800);

  } catch (error) {
    console.error("❌ Order failed:", error.message);
    alert("Order failed: " + error.message + "\n\nYour order will be sent via WhatsApp instead.");
    window.open(waURL, "_blank");

  } finally {
    poText.style.display = "inline";
    poLoader.style.display = "none";
    placeOrderBtn.disabled = false;
    isSubmitting = false;
  }
});


/* ----- 12.5 ORDER CONFIRMATION MODAL ----- */

const confirmOverlay    = document.getElementById("confirmOverlay");
const confirmOrderIdEl  = document.getElementById("confirmOrderId");
const confirmCustName   = document.getElementById("confirmCustomerName");
const confirmItemsEl    = document.getElementById("confirmItems");
const confirmTotalEl    = document.getElementById("confirmTotal");
const confirmOrderAgain = document.getElementById("confirmOrderAgain");
const confirmGoHome     = document.getElementById("confirmGoHome");
const confirmTrackBtn   = document.getElementById("confirmTrackBtn");

function showConfirmation({ orderId, name, items, total }) {
  confirmOrderIdEl.textContent = orderId;
  confirmCustName.textContent  = name;
  confirmTotalEl.textContent   = "₹" + total;

  // Link track button directly to this order
  if (confirmTrackBtn) {
    confirmTrackBtn.href = `track-order.html?id=${encodeURIComponent(orderId)}`;
  }

  confirmItemsEl.innerHTML = items.map(item =>
    `<div class="confirm-item-row">
      <span>${item.name} (${item.qty}) × ${item.count}</span>
      <span>₹${item.price * item.count}</span>
    </div>`
  ).join("");

  confirmOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeConfirmation() {
  confirmOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// "Go Back to Home" — close modal, scroll to top
confirmGoHome.addEventListener("click", () => {
  closeConfirmation();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// "Order Again" — close modal, scroll to menu
confirmOrderAgain.addEventListener("click", () => {
  closeConfirmation();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

// Close if user taps outside the modal
confirmOverlay.addEventListener("click", (e) => {
  if (e.target === confirmOverlay) closeConfirmation();
});


/* ----- 13. STICKY HEADER + PARALLAX ON SCROLL -----
   - Adds shadow to navbar on scroll
   - Moves hero blobs and content at different speeds
     for a subtle depth/parallax effect
   - Uses requestAnimationFrame for smooth 60fps       */

let ticking = false;
const isTouchDevice = 'ontouchstart' in window;
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

function onScroll() {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // Scroll progress bar
  if (scrollProgress && docHeight > 0) {
    const percent = (scrollY / docHeight) * 100;
    scrollProgress.style.width = percent + "%";
  }

  // Back to Top button visibility — show after scrolling past hero
  if (backToTop) {
    if (scrollY > window.innerHeight * 0.6) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  // Header shadow
  if (scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Parallax — only on desktop and while hero is visible
  if (!isTouchDevice && scrollY < window.innerHeight * 1.2) {
    // Blobs move slower than scroll (0.3x) — creates depth
    const heroBlobs = document.querySelector(".hero-blobs");
    if (heroBlobs) {
      heroBlobs.style.transform = `translateY(${scrollY * 0.3}px)`;
    }

    // Hero content moves slightly faster (0.15x) — closer layer
    const heroContent = document.querySelector("[data-parallax-content]");
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    }

    // Overlay drifts at a middle speed
    const heroOverlay = document.querySelector(".hero-overlay");
    if (heroOverlay) {
      heroOverlay.style.transform = `translateY(${scrollY * 0.2}px)`;
    }
  }
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
    ticking = true;
  }
});


/* ----- 9. MOBILE HAMBURGER MENU TOGGLE -----
   Opens/closes the mobile navigation overlay.  */

mobileBtn.addEventListener("click", () => {
  mobileBtn.classList.toggle("active");
  mobileNav.classList.toggle("open");
});

// Close mobile nav when a link is clicked
document.querySelectorAll(".mobile-nav-link").forEach(link => {
  link.addEventListener("click", () => {
    mobileBtn.classList.remove("active");
    mobileNav.classList.remove("open");
  });
});


/* ----- 10. BACK TO TOP BUTTON -----
   Scrolls smoothly back to the hero section.   */

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* ----- 11. SCROLL-REVEAL ANIMATIONS -----
   Uses Intersection Observer to animate elements
   when they scroll into view. Supports multiple
   direction classes: reveal, reveal-left,
   reveal-right, reveal-up, reveal-fade.           */

function initScrollReveal() {
  // Auto-add .reveal to section headers and filter bar
  document.querySelectorAll(".section-header, .filter-bar").forEach(el => {
    if (!el.classList.contains("reveal") &&
        !el.classList.contains("reveal-left") &&
        !el.classList.contains("reveal-right") &&
        !el.classList.contains("reveal-up") &&
        !el.classList.contains("reveal-fade")) {
      el.classList.add("reveal");
    }
  });

  // Single observer for all reveal variants
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  // Observe all reveal variants
  const selector = ".reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-fade";
  document.querySelectorAll(selector).forEach(el => revealObserver.observe(el));
}


/* ----- 12. STAGGERED CARD ANIMATION -----
   Animates menu and contact cards one by one
   with a slight delay between each.            */

function animateCards() {
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Calculate stagger index among siblings currently being revealed
        const card = entry.target;
        const allCards = card.parentElement.querySelectorAll(".menu-card");
        let index = 0;
        allCards.forEach((c, i) => { if (c === card) index = i; });

        // Stagger: each card delays 60ms more than the previous
        const delay = (index % 6) * 60; // reset stagger every 6 cards for rows
        card.style.animationDelay = `${delay}ms`;
        card.classList.add("card-visible");
        cardObserver.unobserve(card);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".menu-card").forEach(card => {
    cardObserver.observe(card);
  });
}


/* ----- 13. 3D CARD TILT EFFECT -----
   Slight perspective tilt that follows the mouse cursor.
   Disabled on touch devices for performance.              */

function initCardTilt() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;

  menuGrid.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".menu-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;  // mouse X inside card
    const y = e.clientY - rect.top;   // mouse Y inside card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt angle: 4 degrees
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.classList.add("tilt");
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  menuGrid.addEventListener("mouseleave", (e) => {
    const card = e.target.closest(".menu-card");
    if (card) {
      card.classList.remove("tilt");
      card.style.transform = "";
    }
  });

  // Reset tilt when mouse leaves any individual card
  menuGrid.addEventListener("mouseout", (e) => {
    const card = e.target.closest(".menu-card");
    if (card && !card.contains(e.relatedTarget)) {
      card.classList.remove("tilt");
      card.style.transform = "";
    }
  });
}


/* ----- 15. INITIAL RENDER -----
   Load all items and start animations.   */

renderItems(MENU_DATA);
initScrollReveal();
animateCards();
initCardTilt();
updateCartUI();
