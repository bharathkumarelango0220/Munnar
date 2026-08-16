# 🌿 Munnar Explorer & Trip Expense Tracker

> A modern, mobile-first travel companion and 6-category dynamic budget & expense tracking web application for travelers exploring Munnar, Kerala.
> **Crafted & Designed with ❤️ by Bharathkumar E**

---

## 🌟 Highlights & Key Features

- 📍 **16+ Munnar Tourist Attractions Directory**:
  - Direct 1-tap **Google Maps Navigation** for all top spots (Eravikulam National Park, Mattupetty Dam, Kolukkumalai Sunrise Tea Estate, Top Station, Kundala Lake, Attukal Falls, Lakkam Falls, etc.).
  - Detailed entrance fees, operating hours, best photography timings, and traveler pro-tips.
  - Category filters (*Viewpoints, Tea Estates, Waterfalls, Lakes & Dams, Wildlife, Adventure*) and interactive wishlist.

- 💰 **6-Category Dynamic Expense Tracker**:
  - 6 dedicated categories: **Bike (Fuel/Rent/Tolls)**, **Food**, **Snacks**, **Rooms**, **Entry Tickets**, and **Unexpected Expenses**.
  - Customizable budget setup: every user sets their own budget limits first before logging expenses.
  - **Real-Time Dynamic Reduction**: Logging even ₹1 immediately deducts from that category's remaining balance (e.g. ₹15,000 Bike Budget - ₹3,000 Fuel = ₹12,000 remaining).
  - Itemized transaction ledger with payment mode badges (UPI / Cash / Card), timestamps, notes, and delete/edit options.

- 📄 **Downloadable Document & PDF Reports**:
  - 1-Click **PDF Report Generation** (`jspdf` & `jspdf-autotable`) with traveler details, category budget comparison table, and itemized transaction log.
  - 1-Click **CSV / Excel Spreadsheet Export** and printable document view.

- 📲 **Free SMS OTP Authentication**:
  - Phone and Email login powered by **Google Firebase Phone Authentication** (10,000 free SMS OTPs per month).
  - Bot protection with invisible Google reCAPTCHA.

- ☁️ **Cross-Device Cloud Sync**:
  - Powered by **Google Cloud Firestore** (100% Free Tier forever).
  - Log in with the same mobile number on any device (phone, laptop, tablet) to access and sync your trip budgets and expenses in real-time.

- 🧳 **Travel Companion Tools**:
  - 3-Day suggested Munnar itinerary route.
  - Altitude weather & mist guide.
  - Interactive packing checklist.
  - 24x7 Munnar emergency contacts (Police, Tata General Hospital, Forest Office, Ambulance).

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide Icons + Custom Glassmorphism UI
- **PDF Generation**: `jspdf` + `jspdf-autotable`
- **Database & Auth**: Google Firebase (Phone Authentication + Firestore Cloud Sync)
- **Visual Delight**: `canvas-confetti`

---

## 👨‍💻 Creator & Developer Info

- **Name**: Bharathkumar E
- **Phone**: [+91 8220802736](tel:8220802736)
- **Email**: [bharathkumarelango02@gmail.com](mailto:bharathkumarelango02@gmail.com)
- **Website & Portfolio**: [https://apexassure.vercel.app/](https://apexassure.vercel.app/)

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/bharathkumarelango0220/Munnar.git

# 2. Navigate into project folder
cd Munnar

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

---

## 🌐 Deploy to Vercel (Free Hosting)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New Project"** $\rightarrow$ **"Import Git Repository"** $\rightarrow$ Select `bharathkumarelango0220/Munnar`.
3. Click **"Deploy"**.
4. Your site will be live on `https://munnar-....vercel.app` in under 1 minute!
