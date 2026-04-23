# Me Ma Mana Ruchulu — Project Documentation

**Business Name:** Me Ma Mana Ruchulu
**Telugu:** సాంప్రదాయ తెలుగు ఇంటి వంటలు
**Translation:** Traditional Telugu Homemade Food
**Document Date:** April 23, 2026
**Version:** 2.0 (Production Release)

---

## 1. Project Overview

### What Is This?
A food ordering website for **Me Ma Mana Ruchulu**, a homemade Telugu food business. The website allows customers to browse a digital menu, add items to a cart, and place orders. Orders are saved to a Firebase Firestore database and simultaneously sent to the business owner via WhatsApp. An admin dashboard provides real-time order management.

### Live URLs

| Page | URL |
|------|-----|
| **Customer Website** | https://sridharmarepally.github.io/me-ma-mana-ruchulu/ |
| **Admin Login** | https://sridharmarepally.github.io/me-ma-mana-ruchulu/admin-login.html |
| **Admin Dashboard** | https://sridharmarepally.github.io/me-ma-mana-ruchulu/admin.html |
| **GitHub Repository** | https://github.com/Sridharmarepally/me-ma-mana-ruchulu |

### Target Users
- **Customers:** Local people who want to order traditional homemade Telugu food online
- **Admin (Business Owner):** Receives and manages orders through a protected dashboard

### Business Problem Solved
Before this website, the business relied on word-of-mouth and manual WhatsApp messages for orders. This website provides:
- A professional online presence with a live public URL
- A structured digital menu with prices and food photos
- An organized order management system with real-time updates
- Dual order delivery (database storage + WhatsApp notification)

---

## 2. Features Implemented

### Customer-Facing Website (index.html)

| Feature | Description |
|---------|-------------|
| **Hero Section** | Full-screen welcome area with logo, business name, tagline, trust badges, and call-to-action buttons |
| **Digital Menu** | 38 food items displayed as cards with images, Telugu + English names, category badges, and multi-weight pricing tables |
| **Category Filters** | 6 filter buttons (All, Snacks, Sweets, Powders, Pickles, Fryums) with horizontal scroll on mobile |
| **Food Images** | Real product photographs on each card with zoom-on-hover effect (36 product images) |
| **Cart System** | Add items with weight/size selection, adjust quantities, remove items. Cart persists across page refreshes via localStorage |
| **Cart Drawer** | Slide-in panel from the right showing all cart items, quantities, subtotals, and total amount |
| **Always-Visible Cart Button** | Cart button stays visible even when empty; shows "Your cart is empty" state when opened |
| **Order Form Modal** | Collects customer name, phone, delivery address, and special instructions with order summary |
| **Firestore Integration** | Orders saved to Firebase Firestore database via REST API |
| **WhatsApp Integration** | After Firestore save, WhatsApp opens with a pre-formatted order message sent to the business number |
| **Success Toast** | Confirmation notification slides up from bottom after successful order |
| **Floating WhatsApp Button** | Bottom-right green button with pulse animation and "Order Now!" tooltip |
| **Floating Cart Button** | Bottom-left position (no overlap with WhatsApp); shows item count badge |
| **Back to Top Button** | Appears above WhatsApp button after scrolling past the hero section |
| **Scroll Progress Bar** | Thin gold line at the top showing scroll position |
| **Contact Section** | Phone numbers, WhatsApp chat link, and business timings |
| **Responsive Design** | Fully functional across all screen sizes from 320px to 4K |

### Admin System

| Feature | Description |
|---------|-------------|
| **Admin Login (admin-login.html)** | Email/password authentication via Firebase Auth. Includes password visibility toggle, error messages with form shake animation, loading spinner, friendly Firebase error translations |
| **Admin Dashboard (admin.html)** | Protected page — redirects to login if not authenticated. Shows admin email, login timestamp, stats, and action links |
| **Order Management** | Orders fetched from Firestore via REST API with auto-polling every 15 seconds. Shows customer details, items, total, timestamp, and status |
| **Safe Order Rendering** | Graceful fallbacks for missing fields: "Guest" for missing names, "N/A" for phones, empty arrays for items. Dashboard never breaks on incomplete data |
| **Order Status Updates** | Admin can mark orders as "Preparing" or "Completed" with one click. Status updates via Firestore REST PATCH |
| **Newest Orders First** | Client-side sort by createdAt timestamp (supports both Firestore Timestamps and ISO strings) |
| **Logout** | Sign-out button that clears the session and redirects to login |
| **Route Protection** | Auth state listener on dashboard page — unauthorized users are immediately redirected |

### Visual & UX Enhancements

| Feature | Description |
|---------|-------------|
| **Traditional Telugu Motifs** | SVG-based rangoli flowers, temple gopuram, paisley, and kolam patterns placed at corners with low opacity and slow rotation |
| **Floating Blobs** | Soft blurred circles drifting slowly in the background for depth (desktop only) |
| **Glassmorphism Cards** | Semi-transparent white cards with backdrop blur and subtle borders (disabled on mobile for performance) |
| **3D Card Tilt** | Cards tilt slightly following the mouse cursor on desktop (disabled on touch devices) |
| **Image Shine Swipe** | Golden highlight sweeps across card images on hover |
| **Parallax Scrolling** | Hero blobs, overlay, and content move at different scroll speeds creating depth (desktop only) |
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
| **Firebase Firestore (Native mode)** | Order storage |
| **Firestore REST API** | Primary method for both customer order submission AND admin dashboard order fetching (bypasses SDK WebSocket limitations) |
| **Firebase SDK (Compat v10.12.0)** | Auth and Firestore client libraries loaded via CDN |
| **WhatsApp Click-to-Chat API** | Order notification via wa.me links |

### Hosting & Version Control
| Tool | Purpose |
|------|---------|
| **GitHub** | Version control and source code hosting |
| **GitHub Pages** | Free static website hosting (production) |
| **Git** | Version control CLI |
| **Python HTTP Server / Live Server** | Local development server |
| **VS Code** | Code editor |

---

## 4. System Architecture

### File Structure

```
Website/
  index.html               — Customer-facing website (menu + cart + ordering)
  admin-login.html         — Admin authentication page
  admin.html               — Protected admin dashboard
  style.css                — All customer website styles
  admin.css                — Admin page styles
  script.js                — Menu data, cart, filtering, animations, Firestore orders
  admin.js                 — Firebase auth, order fetching via REST API, status updates
  .gitignore               — Git ignore rules (OS files, editor files)
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
   |                     |
9a. POST to Firestore    9b. Build WhatsApp
    REST API                  message URL
   |                     |
10a. Order saved in      10b. WhatsApp opens
     "orders" collection       with pre-filled
     with status:              order details
     "pending"                 |
   |                     11b. Customer taps
11. Success toast             "Send" in WhatsApp
    shown to user             |
              |           12b. Business owner
12. Cart cleared,              receives message
    form reset                 on WhatsApp
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
6. Dashboard shown, fetchOrders() runs immediately
              |
7. Orders fetched from Firestore REST API
              |
8. Response parsed (Firestore REST → JS objects)
              |
9. Sorted client-side by createdAt (newest first)
              |
10. Rendered as cards with safe fallbacks
              |
11. Polling interval set: refetch every 15 seconds
              |
12. Admin clicks "Preparing" or "Done"
              |
13. PATCH request to Firestore REST API updates status
              |
14. Immediate refetch refreshes the list
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

### Authorized Domains (Firebase Auth)
- `localhost` (for development)
- `me-ma-mana-ruchulu.firebaseapp.com` (default)
- `sridharmarepally.github.io` (for production — added for GitHub Pages)

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
- Admin login page loads: `firebase-app-compat.js` + `firebase-auth-compat.js` + `firebase-firestore-compat.js`
- Admin dashboard loads: same as login page
- All loaded from Google CDN (version 10.12.0)

### Firestore Connection Method (Updated)

Both the customer website AND admin dashboard use the **Firestore REST API** directly via `fetch()` to `firestore.googleapis.com`. This was switched from the SDK after discovering the SDK's WebSocket connection fails silently in some network environments.

**Why REST API:**
- Reliable across all networks, ISPs, and firewalls
- No silent hanging — HTTP returns clear status codes
- Simpler debugging
- Works everywhere the browser can make HTTPS requests

**Admin dashboard polling:** Since REST isn't real-time, the dashboard refetches orders every 15 seconds. New orders appear within that window.

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

## 7. Responsive Design

### Breakpoints

| Breakpoint | Target | Key Adjustments |
|-----------|--------|-----------------|
| > 768px | Desktop | Flexible menu grid, full navbar, parallax active, 3D tilt active, all decorative effects |
| ≤ 768px | Tablet | Auto-fill grid, hamburger menu, reduced blobs, simplified motifs |
| ≤ 576px | Mobile | Single column, horizontal-scroll filter bar, stacked buttons, no parallax/tilt/blobs, no backdrop-filter |
| ≤ 360px | Very small phones | Further reduced text sizes, tighter spacing |

### Mobile Optimizations (Applied)
- Removed `background-attachment: fixed` (major scroll jank cause on mobile)
- Added `-webkit-overflow-scrolling: touch` for iOS momentum scrolling
- Disabled `backdrop-filter` on mobile cards (GPU-heavy)
- Killed all decorative animations (blobs, parallax, tilt, shine, grain) on mobile
- Horizontal scrolling filter bar (swipe to see all categories)
- Stacked card footer (quantity dropdown + Add button on separate lines)
- Full-width cart drawer on mobile
- Hero buttons stack vertically with 80% width
- `overflow-x: hidden` on html and body to prevent horizontal scroll
- Targeted `overflow: hidden` on all main sections to clip decorative blobs/motifs
- Floating cart button moved to bottom-left to avoid overlap with WhatsApp button (bottom-right)

### Accessibility
- `prefers-reduced-motion` media query disables all animations
- ARIA labels on interactive elements (buttons, nav toggle)
- Semantic HTML structure
- Keyboard-navigable forms
- `-webkit-text-size-adjust: 100%` prevents iOS zoom on orientation change

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
| **Mobile effect reduction** | Blobs, motifs, backdrop-filter, animations all disabled on mobile |
| **localStorage cart** | Cart survives page refresh without server round-trips |
| **REST API for orders** | Direct HTTP fetch instead of WebSocket SDK connection |
| **No background-attachment:fixed** | Avoids the #1 cause of scroll jank on mobile |
| **Overflow-x hidden globally** | Prevents horizontal scrollbars from decorative elements |

---

## 9. Deployment Details

### Deployment Platform: GitHub Pages (Free)

### Git Workflow
```bash
# After making code changes locally:
git add -A
git commit -m "description of changes"
git push

# Changes go live on GitHub Pages within 1-2 minutes
```

### GitHub Pages Configuration
- **Repository:** Sridharmarepally/me-ma-mana-ruchulu
- **Branch:** main
- **Folder:** / (root)
- **Build:** Not required (static HTML/CSS/JS)
- **SSL:** Automatic HTTPS

### Deployment Checklist (Completed)
- ✅ Git repository initialized locally
- ✅ `.gitignore` created (excludes OS files, editor configs)
- ✅ Initial commit with all project files
- ✅ GitHub repository created at github.com/Sridharmarepally/me-ma-mana-ruchulu
- ✅ Code pushed to main branch
- ✅ GitHub Pages enabled via Settings → Pages → main branch
- ✅ Live URL verified working
- ✅ Firebase authorized domain added for sridharmarepally.github.io

### Cost Breakdown
| Service | Cost |
|---------|------|
| GitHub Pages hosting | Free (public repo) |
| Firebase Authentication | Free (up to 50k MAU) |
| Firebase Firestore | Free (1 GiB storage, 50k reads/day, 20k writes/day) |
| Domain (github.io subdomain) | Free |
| SSL certificate | Free (automatic) |
| **Total monthly cost** | **₹0** |

---

## 10. Major Fixes & Improvements Applied

### Firestore Connection Issues (Resolved)
- **Problem:** Orders were timing out with "Request timed out" after 15 seconds. SDK WebSocket connection was hanging silently.
- **Root cause:** First Firestore database was mistakenly created via Google Cloud Console (Datastore mode reference), second attempt revealed WebSocket blocking on some networks.
- **Fix:** Deleted and recreated Firestore database from Firebase Console in Native mode. Switched all Firestore writes/reads to use the REST API (`fetch()` to `firestore.googleapis.com`) instead of the SDK's real-time connection.
- **Result:** Orders now save reliably across all networks.

### Admin Dashboard Rendering (Resolved)
- **Problem:** Admin dashboard showed order count `(7)` but cards didn't render. Old orders with string timestamps were breaking the `orderBy` query.
- **Fix:** Switched admin from SDK `onSnapshot` to REST API fetching. Added safe fallbacks for all fields (customer → Guest, items → [], phone → N/A). Client-side sorting handles both Firestore Timestamps and ISO strings.
- **Result:** All orders render correctly regardless of data completeness.

### Mobile Horizontal Overflow (Resolved)
- **Problem:** Blank white space on the right side of mobile view; horizontal scroll; navbar hamburger icon shifting inward.
- **Root causes:**
  1. Decorative blobs/motifs used negative positioning (`left: -5%`, `right: -60px`) that escaped the viewport on narrow screens
  2. `background-attachment: fixed` on body was causing scroll jank
  3. Aggressive `* { max-width: 100% }` broke flexbox in the navbar
  4. `max-width: 100vw` on body didn't match actual viewport (scrollbar width mismatch)
- **Fix:** Added `overflow-x: hidden` to html, added `overflow: hidden` to every section (hero, menu, contact, footer, blob containers). Used `width: 100%` instead of `100vw`. Replaced universal selector with targeted rules on sections only.
- **Result:** Clean layout at all screen widths from 320px to 4K.

### Scroll Performance on Mobile (Resolved)
- **Problem:** Janky scrolling on mobile devices.
- **Fix:** Removed `background-attachment: fixed`, disabled `backdrop-filter` on mobile cards, killed all CSS animations on mobile, added `-webkit-overflow-scrolling: touch`, disabled parallax JS on touch devices.
- **Result:** Smooth 60fps scrolling on mobile.

### Button Overlap (Resolved)
- **Problem:** Floating cart button and WhatsApp button both at bottom-right, overlapping each other.
- **Fix:** Moved cart button to bottom-left. WhatsApp stays bottom-right. Back-to-top button sits above WhatsApp.
- **Result:** All three floating buttons visible and accessible without overlap.

### Cart Empty State Visibility (Resolved)
- **Problem:** Cart button disappeared when cart was empty, leaving no way to see "Your cart is empty" message.
- **Fix:** Cart button always visible; only the badge with item count hides when cart is empty.
- **Result:** Users can always open the cart drawer to see its state.

### Mobile Breakpoint Coverage (Resolved)
- **Problem:** Breakpoint at 480px was too small; many phones report CSS widths above it and missed mobile styles.
- **Fix:** Expanded mobile breakpoint to 576px. Added 360px breakpoint for very small phones.
- **Result:** All common phones (iPhone SE through iPhone Pro Max, Pixel, Samsung) now get proper mobile styling.

---

## 11. Current Project Status

| Component | Status |
|-----------|--------|
| Customer website UI | Complete |
| Menu with 38 items + images | Complete |
| Category filtering | Complete |
| Cart system (add/remove/qty) | Complete |
| Order form + validation | Complete |
| Firestore order storage (REST API) | Complete and verified working |
| WhatsApp order notification | Complete |
| Admin login (Firebase Auth) | Complete and working |
| Admin dashboard (REST API) | Complete and working |
| Real-time order display | Complete (15-second polling) |
| Order status management | Complete |
| Safe data rendering with fallbacks | Complete |
| Responsive design | Complete (576px + 360px breakpoints) |
| Horizontal overflow fixes | Complete |
| Mobile scroll performance | Optimized |
| Button layout (no overlaps) | Complete |
| Visual animations & effects | Complete |
| Git version control | Set up |
| GitHub Pages deployment | Live and working |
| Firebase authorized domain | Configured |

### Known Pending Items
1. **Firestore security rules** — Currently in test mode (expires May 23, 2026). Production rules need to be written before that date to restrict write access to authenticated admins only (for status updates) while allowing public creates (for new orders).
2. **Menu management** — Menu items are hardcoded in script.js. Future enhancement: manage menu from admin dashboard via Firestore.
3. **Order analytics** — Admin dashboard shows orders but no aggregate stats (daily count, popular items, revenue).
4. **Real-time updates** — Currently polls every 15 seconds. Could be replaced with Firestore SDK onSnapshot if the SDK WebSocket issues are resolved.

---

## 12. Future Roadmap

### Phase 3 (Planned Enhancements)
- Admin menu management (add/edit/delete items from dashboard)
- Order analytics dashboard (daily order count, popular items, revenue trends)
- Customer order tracking with order IDs
- WhatsApp notification to customer when order status changes
- Image upload from admin panel (replace hardcoded image paths)
- Production security rules for Firestore
- Custom domain (e.g., memamanaruchulu.com) with Firebase Hosting
- Email receipts for customers
- Search functionality across menu items
- Customer reviews / testimonials section

---

## 13. Development Workflow

### Making Changes Locally
1. Open project in VS Code (`D:\Website`)
2. Run local server: `python -m http.server 5500`
3. Visit `http://localhost:5500` to preview
4. Make code changes
5. Test in browser (hard refresh with Ctrl+Shift+R)

### Deploying Changes
```bash
git add -A
git commit -m "describe what changed"
git push
```
Changes appear on live URL within 1-2 minutes.

### Testing Firebase Locally
- Firebase works on `localhost` (authorized in Firebase Console)
- Must use HTTP server (not file:// protocol) due to Firebase SDK requirements

### Testing on Mobile
- Use browser DevTools device emulation for quick tests
- Test on real device via the live URL
- Hard refresh (clear cache) to see latest changes

---

*Document prepared for Me Ma Mana Ruchulu project*
*Built by Sridhar with Claude Code assistance*
*Version 2.0 — April 23, 2026*
