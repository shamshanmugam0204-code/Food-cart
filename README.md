# FoodCart — Order Ahead. Skip the Queue.

FoodCart is a modern, production-grade food commerce frontend engineered with React 19, TypeScript, Tailwind CSS, Zustand, and React Router. It solves the biggest pain point in fast food, food courts, canteens, and cafés: **waiting in long lines**.

---

## 🌟 Key Differentiator: FoodCart QuickPick

While standard delivery brings food to the customer's address, **QuickPick** allows users to order ahead from food trucks, canteens, cafés, and restaurants.
- **Queue-Free Collection**: Customer receives a confirmed order pass with a dynamic **QR Code**, a **6-Digit Pickup OTP**, and a designated pickup window (e.g. *Spice Garden — Counter 2*).
- **Zero Delivery Fee**: Automatically waives delivery fees (`Delivery fee: ₹0`).
- **Live Terminal & Counter Verification**: Merchant kitchen portal can view active pickup orders, update prep stages, and scan/verify the customer OTP to hand over food.

---

## 🚀 Information Architecture & Routes

### Customer Portal
| Route | Description |
| :--- | :--- |
| `/` | Landing page featuring the hero section, fulfillment toggle, cuisine categories, popular restaurants, QuickPick showcase, and feature highlights. |
| `/explore` | Restaurant listings with faceted filters (Cuisines, Veg only, Open now, QuickPick), sorting, and search. |
| `/restaurant/:id` | Full restaurant storefront with cover image, category tabs, food cards, dietary indicators, customizable portions/toppings, and desktop mini-cart. |
| `/search` | Live search for dishes, restaurants, and cuisines with instant keyword suggestion chips. |
| `/cart` | Item quantity steppers, customizations breakdown, delivery/pickup switcher, promo codes, and bill summary. |
| `/checkout` | 2-step checkout flow (Delivery Address or QuickPick Counter details, followed by UPI/Card/Wallet/COD payment selection). |
| `/order-confirmation/:orderId` | Post-checkout pass displaying the interactive **QuickPick QR Code**, **Pickup OTP**, Counter identifier, and delivery arrival estimates. |
| `/track-order/:orderId` | Live progress tracker with active status timeline, demo simulator controls, "I Have Arrived" counter alert, and helpline dialog. |
| `/orders` | Order history categorized into Active and Past orders with 1-click reorder. |
| `/favorites` | Bookmarked restaurants for quick re-ordering. |
| `/profile` | Customer profile management, saved addresses, wallet balance, and notification toggles. |
| `/login` & `/register` | Authentication with Zod schema validation and 1-click demo login buttons for Customer, Partner, and Admin roles. |

### Restaurant Partner Portal
| Route | Description |
| :--- | :--- |
| `/partner/login` | Dedicated Kitchen Display System (KDS) & terminal login. |
| `/partner/dashboard` | Real-time kitchen dashboard with KPIs, live QuickPick queue widget, weekly revenue & order charts (Recharts), and quick prep-buffer controls. |
| `/partner/orders` | Kitchen order board organized by prep stages, with QuickPick OTP verification modal to complete handoffs. |
| `/partner/menu` | Dish catalog management with availability switches (In Stock / Sold Out), pricing edits, prep times, and dish creation modal. |
| `/partner/analytics` | Analytics comparing Delivery vs QuickPick volume, peak rush hours, and prep time averages. |
| `/partner/settings` | Counter branding (*Counter 2*), operating hours, auto-rush buffer triggers, and audio alert settings. |

### Platform Operations & Admin
| Route | Description |
| :--- | :--- |
| `/admin/dashboard` | System-wide run-rate metrics, daily order volume, and city GMV analytics. |
| `/admin/restaurants` | Merchant moderation, QuickPick enablement switches, and outlet suspension controls. |
| `/admin/orders` | Platform-wide transaction ledger with OTP audits and payment states. |
| `/admin/users` | User access control with account suspension and role assignments. |

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (Vite 8)
- **Styling**: Tailwind CSS + Custom Design System Tokens (Tomato Red `#E64A2E`, Warm Amber `#F59E0B`, Off-white `#FAF8F5`)
- **State Management**: Zustand with `localStorage` persistence (Cart, Location, Orders, Favorites, Auth)
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualization**: Recharts (Revenue curves, peak hours, fulfillment comparisons)
- **Icons**: Lucide React
- **QR Generation**: `qrcode.react` (SVG standard)
- **Animations**: Framer Motion (subtle modals, slide-overs, and toasts)

---

## 🏃 Local Setup & Development

1. Navigate to the project root:
   ```bash
   cd C:\Users\acer\.gemini\antigravity-ide\scratch\foodcart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npx vite
   ```
   Open **`http://localhost:5173`** in your browser.

4. Production Build:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Access Credentials

To test any role with 1-click, go to `/login`:
- **Customer**: `arjun.mehta@email.com` / `password123`
- **Restaurant Partner**: Direct access to `/partner/dashboard` or `/partner/login`
- **Admin**: Direct access to `/admin/dashboard`
