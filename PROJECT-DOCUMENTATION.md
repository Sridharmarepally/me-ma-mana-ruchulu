# Me Ma Mana Ruchulu — Project Documentation

**Business Name:** Me Ma Mana Ruchulu
**Telugu:** సాంప్రదాయ తెలుగు ఇంటి వంటలు
**Translation:** Traditional Telugu Homemade Food
**Document Date:** April 23, 2026
**Version:** 1.0

---

## 1. Project Overview

### What Is This?
A food ordering website for **Me Ma Mana Ruchulu**, a homemade Telugu food business. The website allows customers to browse a digital menu, add items to a cart, and place orders. Orders are saved to a Firebase database and simultaneously sent to the business owner via WhatsApp.

### Target Users
- **Customers:** Local people who want to order traditional homemade Telugu food online
- **Admin (Business Owner):** Receives and manages orders through a protected dashboard

### Business Problem Solved
Before this website, the business relied on word-of-mouth and manual WhatsApp messages for orders. This website provides:
- A professional online presence
- A structured digital menu with prices and images
- An organized order management system
- Dual order delivery (database storage + WhatsApp notification)

---

## 2. Features Implemented

### Customer-Facing Website (index.html)

| Feature | Description |
|---------|-------------|
| **Hero Section** | Full-screen welcome area with logo, business name, tagline, trust badges, and call-to-action buttons |
| **Digital Menu** | 38 food items displayed as cards with images, Telugu + English names, category badges, and multi-weight pricing tables |
| **Category Filters** | 6 filter buttons (All, Snacks, Sweets, Powders, Pickles, Fryums) to browse by category |
| **Food Images** | Real product photographs on each card with zoom-on-hover effect |
| **Cart System** | Add items with weight/size selection, adjust quantities, remove items. Cart persists across page refreshes via localStorage |
| **Cart Drawer** | Slide-in panel from the right showing all cart items, quantities, subtotals, and total amount |
| **Order Form** | Modal form collecting customer name, phone, delivery address, and special instructions. Shows order summary before submission |
| **Firestore Integration** | Orders saved to Firebase Firestore database via REST API |
| **WhatsApp Integration** | After Firestore save, WhatsApp opens with a pre-formatted order message sent to the business number |
| **Floating WhatsApp Button** | Always-visible green button with pulse animation and "Order Now!" tooltip |
| **Floating Cart Button** | Appears when items are in cart, shows item count badge |
| **Back to Top Button** | Appears after scrolling past the hero section |
| **Scroll Progress Bar** | Thin gold line at the top showing scroll position |
| **Contact Section** | Phone numbers, WhatsApp chat link, and business timings |
| **Responsive Design** | Fully functional on mobile phones, tablets, and desktops |

### Admin System

| Feature | Description |
|---------|-------------|
| **Admin Login (admin-login.html)** | Email/password authentication via Firebase Auth. Includes password visibility toggle, error messages with form shake animation, loading spinner |
| **Admin Dashboard (admin.html)** | Protected page — redirects to login if not authenticated. Shows admin email, login timestamp, quick stats, and action links |
| **Order Management** | Real-time order list fetched from Firestore via onSnapshot listener. Shows customer details, items, total, timestamp, and status |
| **Order Status Updates** | Admin can mark orders as "Preparing" or "Completed" with one click. Status updates in Firestore instantly |
| **Logout** | Sign-out button that clears the session and redirects to login |
| **Route Protection** | Auth state listener on dashboard page — unauthorized users are immediately redirected |

### Visual & UX Enhancements

| Feature | Description |
|---------|-------------|
| **Traditional Telugu Motifs** | SVG-based rangoli flowers, temple gopuram, paisley, and kolam patterns placed at corners with very low opacity and slow rotation |
| **Floating Blobs** | Soft blurred circles drifting slowly in the background for depth |
| **Glassmorphism Cards** | Semi-transparent white cards with backdrop blur and subtle borders |
| **3D Card Tilt** | Cards tilt slightly following the mouse cursor on desktop (disabled on touch devices) |
| **Image Shine Swipe** | Golden highlight sweeps across card images on hover |
| **Parallax Scrolling** | Hero blobs, overlay, and content move at different scroll speeds creating depth |
| **Scroll Reveal Animations** | Elements fade/slide into view from different directions (up, left, right) as you scroll |
| **Staggered Card Entrance** | Menu cards appear one by one with 60ms delay between each |
| **Hero Entrance Animation** | Logo drops down, title/subtitle/buttons cascade upward with staggered delays |
| **Logo Glow** | Pulsing golden glow animation on the hero logo |
| **Wave Section Dividers** | SVG wave shapes between hero/menu and menu/contact sections |
| **Film Grain Texture** | Subtle SVG noise overlay on the menu section background |
| **Button Animations** | Scale-down on click, lift on hover, pop animation on filter selection |

---

## 3. Technologies Used

### Frontend
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, animations, responsive design, glassmorphism, gradients |
| **JavaScript (Vanilla)** | Menu rendering, cart logic, filtering, animations, Firebase integration |
| **Google Fonts (Poppins)** | Typography |
| **SVG** | Icons, decorative motifs, wave dividers (no icon libraries used) |

### Backend / Services
| Technology | Purpose |
|-----------|---------|
| **Firebase Authentication** | Admin email/password login |
| **Firebase Firestore** | Order storage and real-time sync |
| **Firestore REST API** | Order submission from the customer side (bypasses SDK WebSocket limitations) |
| **Firebase SDK (Compat v10.12.0)** | Auth and Firestore client libraries loaded via CDN |
| **WhatsApp Click-to-Chat API** | Order notification via wa.me links |

### Hosting & Tools
| Tool | Purpose |
|------|---------|
| **Python HTTP Server / Live Server** | Local development server |
| **GitHub Pages / Netlify** | Planned production hosting (free) |
| **VS Code** | Code editor |

---

## 4. System Architecture

### File Structure

```
Website/
  index.html              — Customer-facing website (menu + cart + ordering)
  admin-login.html         — Admin authentication page
  admin.html               — Protected admin dashboard
  style.css                — All customer website styles
  admin.css                — Admin page styles
  script.js                — Menu data, cart, filtering, animations, Firestore orders
  admin.js                 — Firebase auth, order fetching, status updates
  images/
    logo.jpg               — Business logo
    menu1.jpg              — Original menu image (snacks & sweets)
    menu2.jpg              — Original menu image (powders, pickles, fryums)
    Murukulu.jpg           — Individual food photos (36 total)
    Sanna Segu.jpg
    ...
  PLAN.md                  — Initial project planning document
  PROJECT-DOCUMENTATION.md — This file
```

### Data Flow — Customer Places an Order

```
1. Customer browses menu on index.html
              |
2. Selects weight/size from dropdown, clicks "Add"
              |
3. Item added to cart (stored in browser localStorage)
              |
4. Customer opens cart drawer, reviews items
              |
5. Clicks "Proceed to Order"
              |
6. Order form modal opens — fills name, phone, address, notes
              |
7. Clicks "Place Order"
              |
8. JavaScript builds order object
              |
   +----------+----------+
   |                      |
9a. POST to Firestore    9b. Build WhatsApp
    REST API                  message URL
   |                      |
10a. Order saved in      10b. WhatsApp opens
     "orders" collection       with pre-filled
     with status:              order details
     "pending"                 |
   |                     11b. Customer taps
10b. Success toast            "Send" in WhatsApp
     shown to user            |
              |          12b. Business owner
11. Cart cleared,             receives message
    form reset                on WhatsApp
```

### Data Flow — Admin Manages Orders

```
1. Admin visits admin-login.html
              |
2. Enters email + password
              |
3. Firebase Auth verifies credentials
              |
4. Redirect to admin.html
              |
5. onAuthStateChanged confirms login
              |
6. Dashboard shown, Firestore onSnapshot listener starts
              |
7. All orders from "orders" collection stream in real-time
              |
8. Orders displayed as cards (newest first)
              |
9. Admin clicks "Preparing" or "Done"
              |
10. Firestore document updated (status field)
              |
11. UI refreshes automatically via onSnapshot
```

---

## 5. Firebase Integration Details

### Firebase Project
- **Project Name:** me-ma-mana-ruchulu
- **Project ID:** me-ma-mana-ruchulu
- **Region:** asia-south1 (Mumbai)

### Services Used

| Service | Mode | Purpose |
|---------|------|---------|
| **Authentication** | Email/Password | Admin login only. Single admin account created manually in Firebase Console |
| **Firestore Database** | Native mode, Standard edition | Stores order data. Test mode rules active until May 23, 2026 |

### Firestore Data Structure

```
Collection: orders
  Document: {auto-generated-id}
    Fields:
      customer (map)
        name: string          — "Ravi Kumar"
        phone: string         — "9876543210"
        address: string       — "Flat 302, Kukatpally"
      items (array of maps)
        [0]
          name: string        — "Murukulu"
          qty: string         — "1 KG"
          price: number       — 450
          count: number       — 2
          subtotal: number    — 900
        [1]
          name: string        — "Ravva Laddu"
          qty: string         — "1/2 KG"
          price: number       — 200
          count: number       — 1
          subtotal: number    — 200
      total: number           — 1100
      notes: string           — "Less spicy please"
      status: string          — "pending" | "preparing" | "completed"
      createdAt: string       — ISO 8601 timestamp
```

### Order Status Lifecycle

```
pending  ──→  preparing  ──→  completed
(new order)   (admin clicked   (admin clicked
               "Preparing")     "Done")
```

### Firebase SDK Loading
- Customer pages load: `firebase-app-compat.js` + `firebase-firestore-compat.js`
- Admin pages load: `firebase-app-compat.js` + `firebase-auth-compat.js` + `firebase-firestore-compat.js`
- All loaded from Google CDN (version 10.12.0)

### Firestore Connection Method
The customer-facing website uses the **Firestore REST API** (`fetch()` to `firestore.googleapis.com`) instead of the SDK's real-time connection. This was implemented because the SDK's WebSocket/long-polling connection was failing in certain network environments. The REST API approach is reliable across all networks.

The admin dashboard uses the **SDK's onSnapshot** listener for real-time order updates, which works correctly on the admin side.

### Current Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 5, 23);
    }
  }
}
```

**Note:** These test-mode rules expire on May 23, 2026. Before that date, production security rules should be implemented to restrict write access.

---

## 6. Menu Data

### Categories and Item Counts

| Category | Items | Price Format |
|----------|-------|-------------|
| Snacks | 9 | 1/2 KG and 1 KG |
| Sweets | 10 | 1/2 KG and 1 KG |
| Powders | 8 | 100g, 1/4 KG, and 1 KG |
| Pickles | 7 | 1/4 KG, 1/2 KG, and 1 KG |
| Fryums | 4 | 1 KG only |
| **Total** | **38 items** | |

### Item List

**Snacks:** Murukulu, Sanna Segu, Atukulu Mixture, Chuduva Atukulu, Chekkalu/Appalu, Masala Chekkalu, Kaara Boondhi, Chegodulu, Ribbon Pakodi

**Sweets:** Dry Fruit Laddu, Ravva Laddu, Sunnundalu, Kajjikayalu, Boondi Laddu, Bakshalu/Bobbatlu, Nuvvula Laddu, Besan Laddu, Ariselu, Palli Laddu

**Powders:** Munagaku Podi, Karivepaku Podi, Kandi Podi, Putnala Podi, Avisa Ginjala Podi, Sambar Podi, Rasam Podi, Palli Karam Podi

**Pickles:** Usirikaya Pachadi, Tomato Pachadi, Mamidikaya Pachadi, Uppava, Grated Mango Pickle, Gongura Pachadi, Cauliflower Niluva Pachadi

**Fryums:** Biyyam Appadalu, Biyyam Janthikalu, Saggubiyyam Appadalu, Gummadikaya Vadiyalu

### Contact Numbers
- Primary: 9502043575
- Secondary: 9676380110

---

## 7. Responsive Design Breakpoints

| Breakpoint | Target | Key Adjustments |
|-----------|--------|-----------------|
| > 768px | Desktop | 3-column menu grid, full navbar, parallax active, 3D tilt active |
| 481–768px | Tablet | 2-column grid, hamburger menu, reduced blobs, simplified effects |
| ≤ 480px | Mobile | Single column, full-width cart drawer, stacked buttons, no parallax/tilt/blobs |

### Accessibility
- `prefers-reduced-motion` media query disables all animations
- ARIA labels on interactive elements (buttons, nav toggle)
- Semantic HTML structure
- Keyboard-navigable forms

---

## 8. Performance Considerations

| Optimization | Implementation |
|-------------|----------------|
| **Lazy loading** | Food images use `loading="lazy"` attribute |
| **Image fallback** | Missing images fall back to logo via `onerror` handler |
| **GPU compositing** | Animated elements use `will-change: transform` |
| **requestAnimationFrame** | Scroll handler throttled to 60fps |
| **Parallax cutoff** | Parallax calculations stop when hero is scrolled out of view |
| **Touch device detection** | 3D tilt and parallax disabled on touch devices |
| **Mobile blob reduction** | Decorative blobs and motifs hidden on small screens |
| **localStorage cart** | Cart survives page refresh without server round-trips |
| **REST API for orders** | Direct HTTP fetch instead of WebSocket SDK connection |

---

## 9. Current Project Status

| Component | Status |
|-----------|--------|
| Customer website UI | Complete |
| Menu with 38 items + images | Complete |
| Category filtering | Complete |
| Cart system (add/remove/qty) | Complete |
| Order form + validation | Complete |
| Firestore order storage (REST API) | Complete — pending live test confirmation |
| WhatsApp order notification | Complete |
| Admin login (Firebase Auth) | Complete and working |
| Admin dashboard | Complete |
| Real-time order display | Complete |
| Order status management | Complete |
| Responsive design | Complete |
| Visual animations & effects | Complete |
| Production deployment | Not yet started |

### Known Issues / Pending Items
1. **Firestore SDK WebSocket connection** — The SDK's real-time connection fails in certain network environments. Workaround implemented using REST API for order writes. Admin dashboard uses SDK onSnapshot which works after authentication.
2. **Firestore security rules** — Currently in test mode (expires May 23, 2026). Production rules need to be written before that date.
3. **Production hosting** — Website is running on local development server. Needs to be deployed to GitHub Pages, Netlify, or Firebase Hosting.
4. **Menu management** — Menu items are hardcoded in script.js. Future enhancement: manage menu from admin dashboard via Firestore.

---

## 10. Future Roadmap

### Phase 3 (Planned)
- Admin menu management (add/edit/delete items from dashboard)
- Order analytics (daily order count, popular items, revenue)
- Customer order tracking
- WhatsApp notification when order status changes
- Image upload from admin panel
- Production security rules for Firestore
- Deployment to production hosting

---

*Document prepared for Me Ma Mana Ruchulu project*
*Built by Sridhar with Claude Code assistance*
