# CraveKart Frontend — Modern Food Ordering Experience

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-orange.svg)](https://lucide.dev/)

A premium, responsive, modern food ordering web application designed for **CraveKart** — "Your Cravings, Delivered."

---

## 🎨 Design Philosophy & Brand Aesthetic

* **Warm Palette**: Warm cream backgrounds (`#FAF7F2`), Tomato-red accents (`#E23744`), Vibrant warm orange (`#FF7A00`), and dark charcoal typography (`#1C1917`).
* **Micro-interactions**: Framer Motion transitions, cart count badges, quantity steppers, and interactive confetti celebration on order placement.
* **Responsive First**: Pixel-perfect layout across mobile devices, tablets, and desktop displays.

---

## 🌟 Features

* **Landing Experience**:
  * Hero section with custom branding: *"Your Cravings, Delivered."*
  * Dynamic location selector (e.g. Indiranagar, Koramangala, Whitefield)
  * Live search bar with trending tags
  * 30-minute express delivery and hygiene certification trust badges
  * Category carousel and popular bestseller dishes showcase
  * Special offers and voucher codes banner
  * How-it-works section & customer testimonials
  * Newsletter subscription with instant feedback
* **Catalog & Discovery**:
  * Browse foods by category, keyword search, and vegetarian status
  * Price range slider and multi-field sorting (popularity, rating, price)
  * Detailed culinary modal with reviews, spice meter, prep time, and calories
* **Cart & Checkout**:
  * Slide-over cart drawer with real-time recalculations
  * Free delivery tracker (orders over ₹499 unlock free shipping)
  * Coupon validation (`WELCOME50`, `CRAVE20`, `HUNGRY100`, `FREESHIP`)
  * Multi-step address selection and address book creator
  * Payment options: Cash on Delivery (COD) and Online Payment
  * Celebratory confetti animation upon order creation
* **Live Stepper Tracking**:
  * Multi-step timeline: Order Placed ➔ Confirmed ➔ Cooking ➔ Out for Delivery ➔ Delivered
  * Estimated delivery countdown timer
  * Assigned delivery courier details (name, vehicle, direct call)
  * Itemized printable order receipt
* **Account Management**:
  * Customer login and registration with validation
  * Order history with 1-click reorder functionality
  * Wishlist favorites management
  * Profile and delivery address book
* **Admin Dashboard**:
  * Protected with `ADMIN` role access control
  * Live database analytics (Gross revenue, order count, registered users, menu items)
  * Order queue with instant status updates
  * Food menu management (Add, edit, delete, toggle availability)
  * Coupon code generation and deletion
  * User role management

---

## 🛠️ Technology Stack

* **Build Tool**: Vite
* **UI Library**: React with TypeScript
* **Styling**: Tailwind CSS with custom brand theme
* **Routing**: React Router DOM (v6)
* **HTTP Client**: Axios
* **Icons**: Lucide React
* **Effects**: Canvas Confetti

---

## 🏃 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
# Copy .env.example to .env
# Set VITE_API_BASE_URL=http://localhost:5000/api

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🌐 Production Deployment

Configured for deployment to **Vercel** with automatic SPA routing rewrites in `vercel.json`.
Set `VITE_API_BASE_URL` in Vercel environment variables pointing to your deployed backend API.
