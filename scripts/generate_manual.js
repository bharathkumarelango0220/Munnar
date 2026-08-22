import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

async function generateManualPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297

  // Helper functions for styling
  const primaryColor = [5, 150, 105]; // Emerald #059669
  const darkBg = [8, 12, 20]; // #080c14
  const slateDark = [15, 23, 42]; // #0f172a
  const slateLight = [241, 245, 249];
  const accentGold = [217, 119, 6]; // Amber #d97706
  const textColor = [30, 41, 59];

  // Header & Footer on each page
  const addHeaderFooter = (pageNumber, totalPages, title) => {
    if (pageNumber === 1) return; // Skip cover

    // Top Header Bar
    doc.setFillColor(8, 12, 20);
    doc.rect(0, 0, pageWidth, 15, 'F');

    doc.setFillColor(5, 150, 105);
    doc.rect(0, 14, pageWidth, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('TRIPTOOLS - OFFICIAL USER MANUAL & FEATURE GUIDE', 14, 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(167, 243, 208);
    doc.text(title.toUpperCase(), pageWidth - 14, 9.5, { align: 'right' });

    // Bottom Footer
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(0, pageHeight - 12, pageWidth, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Crafted with pride by Bharathkumar E • Live App: munnartools.vercel.app', 14, pageHeight - 5);
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 14, pageHeight - 5, { align: 'right' });
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Emerald Accent Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 40, 12, 110, 'F');

  // Cover Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(25, 45, 55, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('COMPLETE USER GUIDE 2026', 28, 50.5);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('TripTools', 25, 68);

  doc.setFontSize(16);
  doc.setTextColor(52, 211, 153);
  doc.text('Smart Mountain Travel & Expense Companion', 25, 78);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    'A comprehensive, beginner-friendly manual explaining every feature, tool,\nand calculation formula in simple English with visual workflow diagrams.\nOptimized for Munnar, South India Highways, and Mountain Road Trips.',
    25,
    90
  );

  // Key Feature Highlights Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(25, 115, pageWidth - 50, 85, 4, 4, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(25, 115, pageWidth - 50, 85, 4, 4, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Core Modules Covered in This Manual:', 32, 126);

  const modules = [
    '1. 🧭 Route Distance Suite (Google Maps Verified 160 KM & 250+ TN Cities)',
    '2. ⛽ Smart Mountain Fuel & Vehicle Rental Cost Calculator',
    '3. 💰 AI Tour Cost & Multi-Day Budget Predictor',
    '4. 📒 Live Group Expense Ledger & Instant "Who Owes Whom" Splitter',
    '5. 📷 AI Smart Receipt & Bill OCR Scanner',
    '6. 📊 Real-Time Spending Analytics & Over-Budget Gauges',
    '7. 📄 One-Tap PDF Settlement Statement & WhatsApp Trip Sharing'
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(226, 232, 240);
  modules.forEach((mod, idx) => {
    doc.text(mod, 32, 137 + idx * 8.5);
  });

  // Creator & App Metadata Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(25, 215, pageWidth - 50, 50, 4, 4, 'F');
  doc.setDrawColor(5, 150, 105);
  doc.roundedRect(25, 215, pageWidth - 50, 50, 4, 4, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(52, 211, 153);
  doc.text('DEVELOPER & PRODUCT DETAILS', 32, 224);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  doc.text('Creator / Developer: Bharathkumar E', 32, 232);
  doc.text('Live Website: https://munnartools.vercel.app', 32, 238);
  doc.text('Portfolio: https://apexassure.vercel.app/', 32, 244);
  doc.text('Support WhatsApp / Phone: +91 8220802736', 32, 250);
  doc.text('Email Contact: bharathkumarelango02@gmail.com', 32, 256);

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS & QUICK WORKFLOW
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...primaryColor);
  doc.text('Table of Contents', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  doc.text('This manual provides clear explanations and step-by-step illustrations for all modules.', 14, 32);

  doc.autoTable({
    startY: 38,
    theme: 'grid',
    head: [['Module #', 'Module Name', 'Primary Purpose', 'Page']],
    body: [
      ['Module 1', 'Home & Munnar Sightseeing Guide', 'Weather, Ghat Helplines & Spot Directory', 'Page 3'],
      ['Module 2', 'Smart Mountain Fuel Calculator', 'Uphill physics, Vehicle mileage & Fuel Split', 'Page 4'],
      ['Module 3', 'Route Distance & Highway Suite', '100% Free 250+ TN cities & Google Verified Distances', 'Page 5'],
      ['Module 4', 'AI Tour Cost & Budget Predictor', 'Predict total tour expenses for groups in seconds', 'Page 6'],
      ['Module 5', 'Live Group Expense Ledger & OCR', 'Record bills, AI scanner & "Who Owes Whom"', 'Page 7'],
      ['Module 6', 'Spending Analytics & PDF Generator', 'Visual charts, PDF statements & WhatsApp sharing', 'Page 8'],
      ['Module 7', 'Offline Mountain Mode & Pro Tips', 'Using tools in zero-network ghats & hill safety', 'Page 9']
    ],
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3.5 }
  });

  // Visual Workflow Diagram
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text('End-to-End Travel Planning Flowchart', 14, finalY);

  finalY += 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, finalY, pageWidth - 28, 85, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, finalY, pageWidth - 28, 85, 3, 3, 'D');

  const steps = [
    { num: 'STEP 1', title: 'Find Exact Route & Distance', desc: 'Select your city (e.g. Madurai ➔ Munnar = 160 KM). Check 24/7 bunks.' },
    { num: 'STEP 2', title: 'Calculate Mountain Petrol Split', desc: 'Choose vehicle (Car/Bike/EV). Apply ghat uphill penalty and split per head.' },
    { num: 'STEP 3', title: 'Predict Total Tour Budget', desc: 'Select duration & luxury level. Generate daily stay, food & sightseeing costs.' },
    { num: 'STEP 4', title: 'Record Live Expenses Offline', desc: 'Log bills or snap receipts with AI OCR. Real-time equal or custom bill split.' },
    { num: 'STEP 5', title: 'Generate PDF Settlement Sheet', desc: 'Download official trip statement and share debt settlement on WhatsApp.' }
  ];

  steps.forEach((s, idx) => {
    const boxY = finalY + 5 + idx * 15.5;
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(18, boxY, 22, 11, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(s.num, 29, boxY + 7, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(s.title, 44, boxY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(s.desc, 44, boxY + 9.5);
  });

  // ==========================================
  // PAGE 3: MODULE 1 — HOME & SIGHTSEEING
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Module 1: Home Dashboard & Sightseeing Guide', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textColor);
  doc.text(
    'The Home Dashboard provides immediate situational awareness upon opening the app.\nIt equips travelers with live weather conditions, emergency contacts, and tourist spots.',
    14,
    32
  );

  doc.autoTable({
    startY: 42,
    theme: 'striped',
    head: [['Feature Name', 'How to Use It', 'Why It Is Useful for You']],
    body: [
      [
        'Live Mountain Weather & Mist Forecast',
        'Displayed at the top of the Home tab. Shows temperature, humidity, and mist status.',
        'Helps you choose the right time to start ghat drives before heavy 5 PM fog sets in.'
      ],
      [
        '24/7 Emergency Ghat Helplines',
        'Direct tap-to-call buttons for Police (100), Ambulance (108), Forest Dept, and Fire.',
        'Instant emergency calling during vehicle breakdowns or medical alerts in mountain passes.'
      ],
      [
        'Munnar Top Attractions Directory',
        'Browse photo cards of Top Station, Eravikulam, Kolukkumalai, Tea Museum, etc.',
        'View entry ticket costs, opening timings, best photography hours, and altitude.'
      ],
      [
        'Quick Category Filters',
        'Filter spots by "Waterfalls", "Viewpoints", "Sunrise/Trek", and "Tea Gardens".',
        'Quickly plan a custom daily itinerary based on your group\'s personal preferences.'
      ]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  let p3Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('⭐ Top Recommended Attractions & Entry Fees', 14, p3Y);

  doc.autoTable({
    startY: p3Y + 4,
    theme: 'grid',
    head: [['Attraction Name', 'Key Highlights', 'Timings', 'Approx. Ticket']],
    body: [
      ['Eravikulam National Park', 'Nilgiri Tahr endangered goat, Anamudi View', '7:30 AM - 4:00 PM', '₹200 (Adults)'],
      ['Kolukkumalai Sunrise', 'World\'s Highest Tea Estate & 4x4 Jeep Safari', '4:30 AM - 9:00 AM', '₹2,500 / Jeep'],
      ['Top Station', 'Panoramic cloud-bed valley view bordering Tamil Nadu', '6:00 AM - 6:00 PM', '₹50 / Person'],
      ['Mattupetty Dam & Lake', 'Speed boating, elephant sightings, serene lake', '9:30 AM - 5:00 PM', '₹500 / Speedboat'],
      ['Cheeyappara & Valara Falls', 'Multi-tier roadside waterfall on Kochi-Munnar NH', 'Open 24/7', 'Free Entry']
    ],
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 2.5 }
  });

  // ==========================================
  // PAGE 4: MODULE 2 — SMART FUEL CALCULATOR
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Module 2: Smart Mountain Fuel & Rental Calculator', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textColor);
  doc.text(
    'Mountain driving in low gears (2nd & 3rd) consumes 20% to 35% more fuel than highway cruising.\nThis calculator uses calibrated physics to predict exact liters, petrol costs, and split per friend.',
    14,
    32
  );

  doc.autoTable({
    startY: 42,
    theme: 'striped',
    head: [['Input Field', 'Description & How to Set It', 'Impact on Calculation']],
    body: [
      [
        'Total Distance (KM)',
        'Enter manual KM or tap "Route Finder" to load verified highway distances.',
        'Base multiplier for fuel consumption and rental usage.'
      ],
      [
        'Vehicle Type Selector',
        'Choose Hatchback, Sedan, SUV, Bike/Scooter, Royal Enfield 350, or EV.',
        'Auto-fills standard highway mileage and adjusts ghat torque penalties.'
      ],
      [
        'Terrain Penalty Mode',
        'Select "Highway Only" (0% penalty) or "Mountain Ghats" (+25% fuel penalty).',
        'Compensates for steep uphill climbing and heavy hairpin braking.'
      ],
      [
        'Daily Vehicle Rental Rate',
        'Optional field. Enter self-drive car or rented bike rental per day (e.g. ₹500/day).',
        'Combines fuel cost + rental price into a unified single trip total.'
      ],
      [
        'Number of Travelers',
        'Enter how many people are sharing the ride (e.g. 4 friends in a car).',
        'Calculates the exact per-person share to collect without arguments.'
      ]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  let p4Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('📐 Real-World Mountain Fuel Formula Explained', 14, p4Y);

  p4Y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, p4Y, pageWidth - 28, 38, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, p4Y, pageWidth - 28, 38, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Effective Mountain Mileage = Standard Mileage ÷ (1 + Ghat Penalty Percentage)', 18, p4Y + 8);
  doc.text('2. Liters Needed = Total Distance (KM) ÷ Effective Mountain Mileage', 18, p4Y + 16);
  doc.text('3. Total Fuel Cost = Liters Needed × Fuel Price per Liter (₹)', 18, p4Y + 24);
  doc.text('4. Cost Per Person = (Total Fuel Cost + Total Rental Fee) ÷ Passenger Count', 18, p4Y + 32);

  // ==========================================
  // PAGE 5: MODULE 3 — ROUTE DISTANCE SUITE
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Module 3: Route Distance & Highway Intelligence Suite', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textColor);
  doc.text(
    'A 100% Free, zero-API-cost navigation intelligence suite covering all 38 Tamil Nadu districts\nand major South Indian corridors calibrated exactly against verified Google Maps routes.',
    14,
    32
  );

  doc.autoTable({
    startY: 42,
    theme: 'grid',
    head: [['Popular Route Corridor', 'Highway Route', 'Verified KM', 'Driving Time']],
    body: [
      ['Madurai ➔ Munnar Town', 'NH 85 via Theni, Bodi Mettu & Gap Road', '160 KM', '3h 45m'],
      ['Coimbatore ➔ Munnar Town', 'SH 17 via Pollachi & Udumalpet Ghats', '158 KM', '4h 15m'],
      ['Kochi / Ernakulam ➔ Munnar', 'NH 85 via Muvattupuzha, Kothamangalam & Adimali', '128 KM', '3h 30m'],
      ['Chennai ➔ Munnar Town', 'NH 45 / NH 85 via Trichy, Dindigul & Theni', '575 KM', '9h 30m'],
      ['Bangalore ➔ Munnar Town', 'NH 44 via Salem, Dindigul & Theni', '480 KM', '8h 45m'],
      ['Theni ➔ Munnar Town', 'NH 85 Direct Mountain Pass', '84 KM', '2h 15m'],
      ['Bodi (Bodinayakanur) ➔ Munnar', 'Lockhart Gap Road Mountain Corridor', '68 KM', '1h 55m'],
      ['Tirunelveli ➔ Munnar Town', 'NH 44 / NH 85 via Virudhunagar & Theni', '245 KM', '5h 15m']
    ],
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 2.5 }
  });

  let p5Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('⛽ Valuable Mountain Highway Road Intelligence', 14, p5Y);

  p5Y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, p5Y, pageWidth - 28, 55, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, p5Y, pageWidth - 28, 55, 3, 3, 'D');

  const roadCards = [
    { title: '⛽ Last 24/7 Fuel Bunk Strategy:', desc: 'Top up full tank at Theni Bypass or Adimali base bunks. Hill station pumps in Munnar town close at 8:00 PM.' },
    { title: '🏔️ Ghat Road & Hairpin Curves:', desc: 'Routes feature 15-20 hairpin curves. Never ride neutral downhills — always use 2nd/3rd gear engine braking.' },
    { title: '☕ FASTag Tolls & Scenic Stops:', desc: 'Displays exact toll checkpoints and scenic photo spots (Cheeyappara Falls, Lockhart Gap Viewpoint).' },
    { title: '⚡ 1-Tap Fuel Integration:', desc: 'Tap "Apply 160 KM to Fuel Calculator" to automatically transfer the distance into the fuel split engine.' }
  ];

  roadCards.forEach((rc, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(rc.title, 18, p5Y + 9 + i * 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(rc.desc, 18, p5Y + 14 + i * 12);
  });

  // ==========================================
  // PAGE 6: MODULE 4 — BUDGET PREDICTOR
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Module 4: AI Tour Cost & Budget Predictor', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textColor);
  doc.text(
    'Plan complete tour budgets before leaving home. The AI engine predicts realistic expenses\nbased on group size, trip duration, and chosen travel style (Backpacker, Moderate, Luxury).',
    14,
    32
  );

  doc.autoTable({
    startY: 42,
    theme: 'striped',
    head: [['Category', 'Budget / Backpacker', 'Moderate / Family', 'Luxury / Honeymoon']],
    body: [
      ['🏨 Stay & Hotels', 'Homestays (₹800 - ₹1,500/night)', '3-Star Resorts (₹2,500 - ₹4,500)', '5-Star Valley Villas (₹7,000+)'],
      ['🍲 Food & Dining', 'Local Kerala Mess (₹350/day)', 'Multi-Cuisine Cafes (₹750/day)', 'Fine Dining Buffets (₹1,500/day)'],
      ['🚙 Transport', 'KSRTC Public Bus & Shared Auto', 'Private Cab / Self-Drive Car', 'Dedicated Innova Crysta / SUV'],
      ['🎟️ Sightseeing & Jeep', 'National Park & Dam entry', 'Tea Museum & Boating', 'Kolukkumalai Sunrise 4x4 Jeep Safari'],
      ['🛡️ Emergency Buffer', '₹500 / Person Reserve', '₹1,500 / Person Reserve', '₹3,000 / Person Reserve']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  let p6Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('💡 How to Use the Predictor in 3 Quick Steps:', 14, p6Y);

  p6Y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, p6Y, pageWidth - 28, 48, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, p6Y, pageWidth - 28, 48, 3, 3, 'D');

  const pSteps = [
    '1. Set Duration & People: Slide trip length (e.g. 3 Days / 2 Nights) and group size (e.g. 4 Travelers).',
    '2. Select Travel Style: Tap "Budget", "Standard", or "Luxury" to auto-tune daily spending rates.',
    '3. View Grand Total & Split: See the complete estimated budget + per-person share instantly.',
    '4. Set as Target Budget: Tap "Apply as Trip Budget" to monitor actual spending against this goal!'
  ];

  pSteps.forEach((ps, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(ps, 18, p6Y + 9 + idx * 10);
  });

  // ==========================================
  // PAGE 7: MODULE 5 — LIVE EXPENSE LEDGER & OCR
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Module 5: Live Group Expense Ledger & OCR Scanner', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textColor);
  doc.text(
    'Eliminate money disputes during group vacations. Record bills offline, split costs fairly,\nand calculate exact net balances ("Who owes whom") with 1-tap AI bill scanning.',
    14,
    32
  );

  doc.autoTable({
    startY: 42,
    theme: 'striped',
    head: [['Feature', 'Description', 'How It Helps Your Group']],
    body: [
      [
        '➕ 1-Tap Add Expense',
        'Tap the floating (+) button to log amount, category, payer, and split participants.',
        'Records expenses in under 5 seconds with offline local memory.'
      ],
      [
        '📷 AI Smart Receipt Scanner',
        'Snap a photo or upload hotel bills and food receipts directly from mobile.',
        'Auto-extracts bill total, date, and category tags without manual typing.'
      ],
      [
        '👥 Smart Bill Splitter',
        'Choose "Equal Split" across all members or "Custom Split" for selective diners.',
        'Prevents unfair splitting when only some friends order non-veg or specialty dishes.'
      ],
      [
        '🤝 "Who Owes Whom" Engine',
        'Algorithm minimizes transaction count to settle all group debts in fewest payments.',
        'Shows simple clear settlements: e.g., "Praveen pays ₹450 to Bharath".'
      ]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  let p7Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('📊 Example Group Debt Settlement Calculation', 14, p7Y);

  p7Y += 4;
  doc.autoTable({
    startY: p7Y,
    theme: 'grid',
    head: [['Friend Name', 'Total Paid by Person', 'Fair Share Owed', 'Net Settlement Balance']],
    body: [
      ['Bharath (Payer 1)', '₹4,800 (Resort Booking)', '₹2,000', '+₹2,800 (Will Receive)'],
      ['Karthik (Payer 2)', '₹2,200 (Fuel & Jeep)', '₹2,000', '+₹200 (Will Receive)'],
      ['Dinesh (Member)', '₹1,000 (Dinner)', '₹2,000', '-₹1,000 (Owes Bharath)'],
      ['Praveen (Member)', '₹0 (Joined trip)', '₹2,000', '-₹2,000 (Owes ₹1,800 to Bharath, ₹200 to Karthik)']
    ],
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 2.5 }
  });

  // ==========================================
  // PAGE 8: MODULE 6 — ANALYTICS & PDF REPORTS
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Module 6: Spending Analytics & PDF Report Generator', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textColor);
  doc.text(
    'Keep your spending disciplined and export formal travel statements at the end of the trip.\nGenerate official audit PDF reports or share formatted text summaries on WhatsApp.',
    14,
    32
  );

  doc.autoTable({
    startY: 42,
    theme: 'striped',
    head: [['Feature Name', 'Functionality', 'Output & Benefit']],
    body: [
      [
        '🎯 Budget Health Gauge',
        'Visual meter displaying % of budget used (Green < 75%, Amber 75-95%, Red > 95%).',
        'Gives instant visual warning before your group accidentally exceeds the trip budget.'
      ],
      [
        '🥧 Category Breakdown Chart',
        'Interactive distribution of Food, Stay, Fuel, Activities, and Shopping.',
        'Identifies where the majority of vacation money is being spent.'
      ],
      [
        '📄 Formal PDF Report Generator',
        '1-Tap compiles complete expense tables, payer ledger, and debt settlement sheet.',
        'Downloadable print-ready PDF statement for personal records or office reimbursement.'
      ],
      [
        '📲 WhatsApp Instant Share',
        'Formats the complete trip settlement summary into a clean WhatsApp message.',
        'Post directly into your friends\' trip group chat with one tap.'
      ]
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  let p8Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('📲 Example WhatsApp Trip Statement Output', 14, p8Y);

  p8Y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, p8Y, pageWidth - 28, 52, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, p8Y, pageWidth - 28, 52, 3, 3, 'D');

  const waLines = [
    '🗺️ *Munnar Vacation Settlement Statement*',
    '💰 *Total Trip Spent:* ₹8,000 (4 Travelers • ₹2,000 / Person)',
    '🏨 Stay: ₹4,800 | ⛽ Fuel: ₹2,200 | 🍲 Food: ₹1,000',
    '',
    '🤝 *Settlement Summary:*',
    '• Dinesh pays ₹1,000 to Bharath',
    '• Praveen pays ₹1,800 to Bharath & ₹200 to Karthik',
    'Generated via TripTools (https://munnartools.vercel.app)'
  ];

  waLines.forEach((wal, idx) => {
    doc.setFont('helvetica', idx === 0 || idx === 1 || idx === 4 ? 'bold' : 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(wal, 18, p8Y + 8 + idx * 5.5);
  });

  // ==========================================
  // PAGE 9: MODULE 7 — OFFLINE MOUNTAIN TIPS
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Module 7: Offline Mountain Mode & Safety Guidelines', 14, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textColor);
  doc.text(
    'Munnar\'s high-altitude valleys and ghat passes (Gap Road, Top Station, Marayoor) often have\nzero cellular connectivity. Here is how TripTools ensures uninterrupted offline functionality.',
    14,
    32
  );

  doc.autoTable({
    startY: 42,
    theme: 'grid',
    head: [['Offline Feature', 'How It Works With 0 Mobile Signal', 'Reliability Guarantee']],
    body: [
      ['📴 Service Worker App Shell', 'Stores full HTML/CSS/JS bundle on device storage.', 'Loads in < 0.1 seconds with zero internet.'],
      ['💾 Local Expense Persistence', 'All bills & group splits save directly into browser storage.', 'Data is never lost when closing or refreshing tabs.'],
      ['🗺️ 250+ Embedded City Coordinates', 'Exact GPS coordinates and distances built into app code.', 'Search and calculate routes completely offline.'],
      ['🔋 Battery & Data Optimization', 'Zero continuous background polling or battery drain.', 'Preserves maximum mobile battery on long drives.']
    ],
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 8.5, cellPadding: 3 }
  });

  let p9Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('🏔️ Essential Munnar Mountain Driving Safety Rules', 14, p9Y);

  p9Y += 4;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, p9Y, pageWidth - 28, 54, 3, 3, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, p9Y, pageWidth - 28, 54, 3, 3, 'D');

  const safetyRules = [
    '1. Uphill Right-of-Way: Vehicles climbing uphill always have the right of way. Give way safely on narrow turns.',
    '2. Engine Braking on Downhills: Never coast down mountain slopes in Neutral. Keep vehicle in 2nd or 3rd gear.',
    '3. Heavy Evening Fog: Gap Road and Top Station experience dense mist after 5:00 PM. Use low-beam yellow fog lamps.',
    '4. Wildlife Safety (Chinnar / Marayoor): Watch for wild elephants crossing between 6:00 PM and 6:00 AM. Never honk.'
  ];

  safetyRules.forEach((sr, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15);
    doc.text(sr, 18, p9Y + 9 + idx * 11);
  });

  // Apply Headers & Footers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    let title = 'General Guide';
    if (i === 2) title = 'Table of Contents';
    else if (i === 3) title = 'Home & Sightseeing';
    else if (i === 4) title = 'Fuel Calculator';
    else if (i === 5) title = 'Route Distance Suite';
    else if (i === 6) title = 'Budget Predictor';
    else if (i === 7) title = 'Expense Ledger';
    else if (i === 8) title = 'Analytics & PDF';
    else if (i === 9) title = 'Offline & Safety';
    addHeaderFooter(i, totalPages, title);
  }

  // Save PDF to public folder
  const outputPath = path.resolve('public/TripTools_User_Manual.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`✅ User Manual PDF successfully generated at: ${outputPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
}

generateManualPDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
