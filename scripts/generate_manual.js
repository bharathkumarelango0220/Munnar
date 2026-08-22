import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

async function generateVisualManualPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297

  // Helper to load image as base64 data URI
  const loadImageData = (filename) => {
    const filePath = path.resolve('screenshots', filename);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return `data:image/png;base64,${buffer.toString('base64')}`;
    }
    return null;
  };

  const imgHome = loadImageData('1_home_tab.png');
  const imgFuel = loadImageData('2_fuel_calculator.png');
  const imgRoute = loadImageData('3_route_modal.png');
  const imgPredictor = loadImageData('4_cost_predictor.png');
  const imgTracker = loadImageData('5_expense_tracker.png');
  const imgAnalytics = loadImageData('6_analytics.png');
  const imgReports = loadImageData('7_reports.png');

  // Styling palette
  const primaryColor = [5, 150, 105]; // Emerald #059669
  const darkBg = [8, 12, 20]; // #080c14
  const slateDark = [15, 23, 42]; // #0f172a
  const textColor = [30, 41, 59];

  // Global Header and Footer
  const addHeaderFooter = (pageNumber, totalPages, title) => {
    if (pageNumber === 1) return; // Skip cover

    // Top Header Bar
    doc.setFillColor(8, 12, 20);
    doc.rect(0, 0, pageWidth, 13, 'F');

    doc.setFillColor(5, 150, 105);
    doc.rect(0, 12, pageWidth, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('TRIPTOOLS • VISUAL STEP-BY-STEP USER MANUAL', 14, 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(167, 243, 208);
    doc.text(title.toUpperCase(), pageWidth - 14, 8.5, { align: 'right' });

    // Bottom Footer
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(0, pageHeight - 10, pageWidth, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Crafted with pride by Bharathkumar E • Live Website: munnartools.vercel.app', 14, pageHeight - 4);
    doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 14, pageHeight - 4, { align: 'right' });
  };

  // Helper to draw a framed screenshot container
  const drawScreenshotFrame = (imgData, y, width = 182, height = 98) => {
    const x = (pageWidth - width) / 2;
    // Outer shadow container
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(x - 1, y - 1, width + 2, height + 2, 3, 3, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(x - 1, y - 1, width + 2, height + 2, 3, 3, 'D');

    if (imgData) {
      doc.addImage(imgData, 'PNG', x, y, width, height);
    }
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Emerald Accent Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 30, 10, 120, 'F');

  // Cover Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(22, 32, 62, 7.5, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL VISUAL USER MANUAL', 25, 37.5);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('TripTools Travel Suite', 22, 53);

  doc.setFontSize(14);
  doc.setTextColor(52, 211, 153);
  doc.text('Visual Step-by-Step Feature Manual & User Guide', 22, 62);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    'A complete visual guide featuring actual screenshot walkthroughs of every single tool,\ncalculating mountain fuel with ghat penalties, route distance discovery, budget predictions,\nlive group expense splitting, and one-tap PDF statements.',
    22,
    72
  );

  // Embedded Mini Preview Image
  if (imgHome) {
    const previewWidth = 166;
    const previewHeight = 85;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(22, 86, previewWidth, previewHeight, 3, 3, 'F');
    doc.setDrawColor(5, 150, 105);
    doc.roundedRect(22, 86, previewWidth, previewHeight, 3, 3, 'D');
    doc.addImage(imgHome, 'PNG', 23, 87, previewWidth - 2, previewHeight - 2);
  }

  // Creator & Product Details Card
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(22, 182, 166, 95, 3, 3, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(22, 182, 166, 95, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(52, 211, 153);
  doc.text('PRODUCT & DEVELOPER SPECIFICATIONS', 28, 192);

  const devDetails = [
    ['Product Name:', 'TripTools (Munnar Trip Companion Suite)'],
    ['Developer / Engineer:', 'Bharathkumar E (Full-Stack Engineer & UI Specialist)'],
    ['Live Application URL:', 'https://munnartools.vercel.app'],
    ['Creator Portfolio:', 'https://apexassure.vercel.app/'],
    ['Direct WhatsApp / Phone:', '+91 8220802736'],
    ['Official Email:', 'bharathkumarelango02@gmail.com'],
    ['Target Regions:', 'Munnar Ghats, Tamil Nadu Highways, Kerala, South India'],
    ['Offline Availability:', '100% Zero-Network Mountain PWA Ready']
  ];

  doc.autoTable({
    startY: 196,
    margin: { left: 28, right: 28 },
    theme: 'plain',
    body: devDetails,
    styles: { fontSize: 8.5, textColor: [226, 232, 240], cellPadding: 1.5 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [52, 211, 153], cellWidth: 45 },
      1: { textColor: [255, 255, 255] }
    }
  });

  // ==========================================
  // PAGE 2: TABLE OF CONTENTS & QUICK FLOW
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('Table of Contents & Quick Visual Flow', 14, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text('This manual explains each section of the site with actual screenshots and simple English guides.', 14, 28);

  doc.autoTable({
    startY: 33,
    theme: 'grid',
    head: [['Module #', 'Module Name', 'Visual Screenshot & Key Purpose', 'Page']],
    body: [
      ['Module 1', 'Home & Sightseeing Guide', 'Live weather, mist alerts, emergency helplines & top spot cards', 'Page 3'],
      ['Module 2', 'Smart Mountain Fuel Calculator', 'Vehicle presets, uphill low-gear penalty (+25%) & per-head split', 'Page 4'],
      ['Module 3', 'Route Distance & Highway Suite', '100% Free 250+ TN cities, 160 KM corridor, 24/7 bunks & hairpin rules', 'Page 5'],
      ['Module 4', 'AI Tour Cost & Budget Predictor', '3-Day tour estimation across stay, food, 4x4 jeep & emergency reserve', 'Page 6'],
      ['Module 5', 'Live Expense Ledger & OCR Scanner', 'Offline bill logging, photo receipt scanning & "Who Owes Whom"', 'Page 7'],
      ['Module 6', 'Spending Analytics & PDF Reports', 'Budget health radar, visual charts, official PDF statements & WhatsApp', 'Page 8'],
      ['Module 7', 'Offline Mountain Mode & Pro Tips', 'Ghat driving safety, engine braking rules & zero-network guide', 'Page 9']
    ],
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 }
  });

  let p2Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Visual 5-Step Trip Planning Flowchart', 14, p2Y);

  p2Y += 4;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, p2Y, pageWidth - 28, 88, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, p2Y, pageWidth - 28, 88, 3, 3, 'D');

  const visualSteps = [
    { step: 'STEP 1', title: 'Open Route Distance Suite', desc: 'Type departure city (e.g. Madurai) ➔ Destination (Munnar = 160 KM). Check 24/7 bunks.' },
    { step: 'STEP 2', title: 'Calculate Fuel & Rental Share', desc: 'Select vehicle (Car/Bike/EV). Apply mountain uphill penalty and calculate cost per friend.' },
    { step: 'STEP 3', title: 'Predict Total Tour Budget', desc: 'Set days & group size. Predict room rates, dining, and Kolukkumalai 4x4 jeep safari.' },
    { step: 'STEP 4', title: 'Log Live Expenses with OCR', desc: 'Snap photo receipts or enter expenses offline. Instant "Who Owes Whom" split.' },
    { step: 'STEP 5', title: 'Export PDF Statement & WhatsApp', desc: 'Download official settlement PDF statement and share net balances on WhatsApp.' }
  ];

  visualSteps.forEach((vs, idx) => {
    const bY = p2Y + 5 + idx * 16;
    doc.setFillColor(5, 150, 105);
    doc.roundedRect(18, bY, 20, 11, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(vs.step, 28, bY + 7, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(vs.title, 42, bY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(vs.desc, 42, bY + 9.5);
  });

  // ==========================================
  // PAGE 3: MODULE 1 — HOME & SIGHTSEEING
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  doc.text('Module 1: Home Dashboard & Sightseeing Guide', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Here is the actual screenshot of your Home page showing the live weather, emergency bar, and attractions:', 14, 26);

  // 1. Actual Screenshot
  drawScreenshotFrame(imgHome, 30, 182, 92);

  // 2. Feature Explanation Below Image
  let p3TextY = 126;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('🔍 Step-by-Step Feature Breakdown of the Home Screen:', 14, p3TextY);

  doc.autoTable({
    startY: p3TextY + 3,
    theme: 'striped',
    head: [['UI Element', 'How to Use It on Your Screen', 'Benefit for Tourists']],
    body: [
      ['🌤️ Live Mountain Weather', 'Top left banner shows real-time temperature, mist alert, and humidity.', 'Plan ghat drives before dense 5 PM fog rolls in.'],
      ['🚨 24/7 Emergency Helplines', 'Direct 1-tap call buttons for Police (100), Ambulance (108), and Forest Dept.', 'Instant access during vehicle breakdown in mountain passes.'],
      ['🏞️ Tourist Spot Cards', 'Photo cards of Top Station, Kolukkumalai, Eravikulam, and Tea Museum.', 'Displays exact entry fees, timings, and altitude.'],
      ['🏷️ Category Filter Badges', 'Tap "Waterfalls", "Viewpoints", "Sunrise/Trek", or "Tea Gardens".', 'Quickly organize your personal daily sightseeing route.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 7.8, cellPadding: 2.2 }
  });

  // ==========================================
  // PAGE 4: MODULE 2 — SMART FUEL CALCULATOR
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  doc.text('Module 2: Smart Mountain Fuel & Rental Calculator', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Actual screenshot of the Smart Fuel Calculator showing mountain physics, vehicle presets, and rental split:', 14, 26);

  // 1. Actual Screenshot
  drawScreenshotFrame(imgFuel, 30, 182, 92);

  // 2. Feature Explanation
  let p4TextY = 126;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('⛽ How the Mountain Fuel Calculations Work:', 14, p4TextY);

  doc.autoTable({
    startY: p4TextY + 3,
    theme: 'striped',
    head: [['Screen Control', 'What to Enter / Select', 'How It Computes the Total']],
    body: [
      ['Total Distance (KM)', 'Type KM manually or tap "Route Finder" to load verified distances.', 'Base multiplier for total fuel required.'],
      ['Vehicle Type Chips', 'Tap Hatchback (16 km/l), SUV (12 km/l), Bike (40 km/l), RE 350, or EV.', 'Auto-fills standard highway mileage and torque factors.'],
      ['Mountain Ghat Penalty', 'Switch ON "Mountain Ghats" for steep uphill climbs in 2nd/3rd gear.', 'Applies +25% fuel penalty to compensate for mountain climbs.'],
      ['Daily Vehicle Rental', 'Optional: Enter self-drive rental per day (e.g. ₹500/day bike, ₹2,000 car).', 'Combines rental cost + fuel into one final bill.'],
      ['Passenger Split', 'Select number of travelers sharing the vehicle (e.g. 4 friends).', 'Divides grand total equally so everyone pays their fair share.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 7.8, cellPadding: 2.2 }
  });

  // ==========================================
  // PAGE 5: MODULE 3 — ROUTE DISTANCE SUITE
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  doc.text('Module 3: Route Distance & Highway Intelligence Suite', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Actual screenshot of the Route Distance Modal with verified Google Maps 160 KM distance and 24/7 bunks:', 14, 26);

  // 1. Actual Screenshot
  drawScreenshotFrame(imgRoute, 30, 182, 92);

  // 2. Feature Explanation
  let p5TextY = 126;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('🧭 Key Road & Route Intelligence Features:', 14, p5TextY);

  doc.autoTable({
    startY: p5TextY + 3,
    theme: 'striped',
    head: [['Feature on Screen', 'How to Use It', 'Why It Matters on Mountain Roads']],
    body: [
      ['🔍 250+ Free City Search', 'Type any Tamil Nadu district, taluk, or Kerala town (e.g. Madurai, Pollachi, Theni).', '100% Free instant autocomplete with zero API costs.'],
      ['📏 Verified 160 KM Banner', 'Displays Google Maps verified distance: Madurai ➔ Munnar = 160 KM (3h 45m).', 'Guarantees 100% accuracy without highway detours.'],
      ['🔄 One-Way vs Round Trip', 'Tap "One-Way" (160 KM) or "Round Trip" (320 KM 2×).', 'Instantly doubles distance for complete return journey planning.'],
      ['⛽ 24/7 Fuel Bunk Strategy', 'Tells you the last 24/7 pump (Theni Bypass) before entering Munnar.', 'Crucial warning: Munnar hill station bunks close at 8:00 PM.'],
      ['🏔️ Ghat Road Hairpin Guide', 'Displays hairpin curve count and 2nd/3rd gear engine braking advice.', 'Prevents dangerous brake pad overheating on steep downhills.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 7.8, cellPadding: 2.2 }
  });

  // ==========================================
  // PAGE 6: MODULE 4 — BUDGET PREDICTOR
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  doc.text('Module 4: AI Tour Cost & Budget Predictor', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Actual screenshot of the Tour Cost Predictor showing full multi-day budget breakdown and sliders:', 14, 26);

  // 1. Actual Screenshot
  drawScreenshotFrame(imgPredictor, 30, 182, 92);

  // 2. Feature Explanation
  let p6TextY = 126;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('💰 How the AI Tour Budget Predictor Works:', 14, p6TextY);

  doc.autoTable({
    startY: p6TextY + 3,
    theme: 'striped',
    head: [['Control on Screen', 'Setting / Option', 'Automated Budget Breakdown Output']],
    body: [
      ['👥 Group Size & Days Sliders', 'Drag sliders for number of people (e.g. 4) and trip days (e.g. 3 Days).', 'Calculates total room-nights and daily meal multiples.'],
      ['⭐ Travel Style Selector', 'Choose "Backpacker", "Standard / Family", or "Luxury / Honeymoon".', 'Auto-adjusts hotel tier rates from ₹1,200 to ₹7,000+/night.'],
      ['🏨 Stay & Rooms', 'Predicted room charges based on group size and luxury level.', 'Includes resort taxes and hill-view premiums.'],
      ['🍲 Food & Dining', 'Estimated breakfast, lunch, tea, and dinner costs per person.', 'Covers authentic Kerala meals and local tea snacks.'],
      ['🚙 Sightseeing & Jeep Safari', 'Includes Kolukkumalai 4x4 Jeep Safari and National Park entry fees.', 'Prevents surprise costs at tourist ticket counters.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 7.8, cellPadding: 2.2 }
  });

  // ==========================================
  // PAGE 7: MODULE 5 — LIVE EXPENSE LEDGER & OCR
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  doc.text('Module 5: Live Group Expense Ledger & OCR Scanner', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Actual screenshot of the Live Expense Ledger with logged vacation bills and "Who Owes Whom" settlements:', 14, 26);

  // 1. Actual Screenshot
  drawScreenshotFrame(imgTracker, 30, 182, 92);

  // 2. Feature Explanation
  let p7TextY = 126;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('📝 How to Record Expenses & Settle Debts Offline:', 14, p7TextY);

  doc.autoTable({
    startY: p7TextY + 3,
    theme: 'striped',
    head: [['Feature on Screen', 'How to Use It', 'Benefit to Vacation Groups']],
    body: [
      ['➕ Floating (+) Add Expense', 'Tap the green (+) button in bottom-right corner to log any bill.', 'Log expense in 5 seconds without internet connection.'],
      ['📷 AI Receipt Vision Scanner', 'Tap camera icon to snap hotel, petrol, or restaurant bills.', 'Auto-reads bill amount, date, and category via AI OCR.'],
      ['🏷️ Category Tagging', 'Tag bills as Food, Stay, Fuel, Tickets, Activities, Shopping, or Misc.', 'Organizes spending for clean analytics and PDF reports.'],
      ['👥 Who Paid & Split Modes', 'Select which friend paid (e.g. Bharath) and who participated.', 'Supports Equal Split or Custom Split for individual diners.'],
      ['🤝 "Who Owes Whom" Card', 'Displays exact net balances: e.g., "Praveen owes ₹450 to Bharath".', 'Settles all vacation debts with zero arguments or confusion.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 7.8, cellPadding: 2.2 }
  });

  // ==========================================
  // PAGE 8: MODULE 6 — ANALYTICS & PDF REPORTS
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  doc.text('Module 6: Spending Analytics & PDF Report Generator', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Actual screenshots of the Analytics health radar and official PDF statement generator:', 14, 26);

  // 2 Mini Screenshots Side-by-Side
  const splitW = 89;
  const splitH = 88;
  drawScreenshotFrame(imgAnalytics, 30, splitW, splitH);
  drawScreenshotFrame(imgReports, 30, splitW, splitH);
  // Shift right screenshot
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(pageWidth - 14 - splitW - 1, 29, splitW + 2, splitH + 2, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - 14 - splitW - 1, 29, splitW + 2, splitH + 2, 3, 3, 'D');
  if (imgReports) {
    doc.addImage(imgReports, 'PNG', pageWidth - 14 - splitW, 30, splitW, splitH);
  }

  // 2. Feature Explanation
  let p8TextY = 124;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryColor);
  doc.text('📊 Understanding Your Trip Analytics & PDF Statements:', 14, p8TextY);

  doc.autoTable({
    startY: p8TextY + 3,
    theme: 'striped',
    head: [['UI Element', 'What It Tells You', 'Action to Take']],
    body: [
      ['🎯 Budget Health Gauge', 'Shows percentage of trip budget spent (Green < 75%, Red > 95%).', 'Warns group to slow down discretionary spending before overspending.'],
      ['🥧 Category Breakdown', 'Pie chart showing percentage spent on Stay vs Food vs Fuel.', 'Identifies where the majority of vacation money went.'],
      ['📄 Download PDF Statement', 'Generates official A4 PDF settlement statement with digital verification.', 'Save for personal audit records or submit for office reimbursement.'],
      ['📲 Share on WhatsApp', '1-Tap compiles debt settlement into formatted WhatsApp message.', 'Post directly into your trip friends group chat for instant UPI payment.']
    ],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    styles: { fontSize: 7.8, cellPadding: 2.2 }
  });

  // ==========================================
  // PAGE 9: MODULE 7 — OFFLINE MOUNTAIN TIPS
  // ==========================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...primaryColor);
  doc.text('Module 7: Offline Mountain Mode & Safety Guidelines', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textColor);
  doc.text('Essential guidelines for operating TripTools with zero mobile network and staying safe on Munnar ghats:', 14, 26);

  doc.autoTable({
    startY: 32,
    theme: 'grid',
    head: [['Offline Technology in TripTools', 'How It Works with 0 Mobile Signal', 'Reliability Guarantee']],
    body: [
      ['📴 Service Worker App Shell', 'Caches the entire web application code on your phone.', 'App opens in 0.05 seconds even with mobile data turned OFF.'],
      ['💾 Local Memory Storage', 'Expenses, budgets, and names save directly into device storage.', 'Zero data loss when closing browser or rebooting your phone.'],
      ['🗺️ Embedded 250+ TN City Coordinates', 'Exact GPS coordinates and highway distances built into code.', 'Route distances and fuel calculation work 100% offline.'],
      ['🔋 Battery & Data Saver Mode', 'Zero continuous background sync polling.', 'Preserves maximum mobile battery on 8-hour mountain drives.']
    ],
    headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255] },
    styles: { fontSize: 8, cellPadding: 2.8 }
  });

  let p9Y = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('🏔️ Vital Munnar Mountain Driving Safety Rules', 14, p9Y);

  p9Y += 4;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(14, p9Y, pageWidth - 28, 62, 3, 3, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(14, p9Y, pageWidth - 28, 62, 3, 3, 'D');

  const safetyItems = [
    '1. Uphill Right-of-Way: Vehicles climbing uphill have legal right of way. Safely stop and give way on single-lane roads.',
    '2. Engine Braking on Downhills: NEVER coast down ghat slopes in Neutral or with clutch depressed. Always stay in 2nd or 3rd gear to allow engine compression to brake the vehicle.',
    '3. Evening Mist & Fog: Lockhart Gap Road and Top Station experience dense fog after 5:00 PM. Keep yellow low-beam fog lamps ON and follow road white margin lines.',
    '4. Night Elephant Corridors: Drive slowly between 6:00 PM and 6:00 AM on Marayoor & Chinnar roads. Never honk or flash high beams at wild elephants.'
  ];

  safetyItems.forEach((si, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(120, 53, 15);
    doc.text(si, 18, p9Y + 9 + idx * 13, { maxWidth: pageWidth - 36 });
  });

  // Final Summary & Support Card
  let p9BotY = p9Y + 68;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, p9BotY, pageWidth - 28, 22, 3, 3, 'F');
  doc.setDrawColor(5, 150, 105);
  doc.roundedRect(14, p9BotY, pageWidth - 28, 22, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(52, 211, 153);
  doc.text('Need Support or Custom Web Development?', 20, p9BotY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(241, 245, 249);
  doc.text('Contact Developer Bharathkumar E on WhatsApp: +91 8220802736 | Portfolio: https://apexassure.vercel.app', 20, p9BotY + 14);

  // Apply Headers and Footers
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
  console.log(`✅ Visual Screenshot User Manual PDF successfully generated at: ${outputPath} (${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
}

generateVisualManualPDF().catch(err => {
  console.error('Error generating visual PDF:', err);
  process.exit(1);
});
