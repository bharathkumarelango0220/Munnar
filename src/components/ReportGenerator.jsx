import React, { useRef } from 'react';
import { useApp, CATEGORY_DEFINITIONS } from '../context/AppContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Share2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Code,
  IndianRupee
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReportGenerator() {
  const { 
    user, 
    budgets, 
    expenses, 
    categoryStats, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed,
    setIsAuthModalOpen 
  } = useApp();

  const printRef = useRef();

  const travelerName = user?.name || 'Guest Traveler';
  const travelerPhone = user?.phone ? `+91 ${user.phone}` : 'Not linked';
  const travelerEmail = user?.email || 'Not linked';
  const tripTitle = user?.tripName || 'Munnar Travel Expedition 2026';
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // 1. Generate & Download PDF Document
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colors
      const primaryGreen = [21, 128, 61]; // #15803d
      const darkSlate = [15, 23, 42]; // #0f172a
      const softBg = [240, 253, 244]; // #f0fdf4

      // Header Banner
      doc.setFillColor(21, 128, 61);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('MUNNAR TRIP EXPENSE REPORT', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Crafted by Bharathkumar E  |  Web: apexassure.vercel.app  |  Ph: +91 8220802736', 14, 22);
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 27);

      // Traveler Info Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 38, 182, 24, 3, 3, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 38, 182, 24, 3, 3, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Traveler: ${travelerName}`, 20, 46);
      doc.text(`Trip: ${tripTitle}`, 110, 46);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Mobile: ${travelerPhone}`, 20, 54);
      doc.text(`Email: ${travelerEmail}`, 110, 54);

      // Table 1: Category Budget vs Actual Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(21, 128, 61);
      doc.text('1. Category Budget vs. Actual Spend Summary', 14, 70);

      const categoryRows = Object.values(CATEGORY_DEFINITIONS).map((cat) => {
        const stat = categoryStats[cat.id] || { allocated: 0, spent: 0, remaining: 0, percentUsed: 0 };
        return [
          cat.name,
          `Rs. ${stat.allocated.toLocaleString('en-IN')}`,
          `Rs. ${stat.spent.toLocaleString('en-IN')}`,
          `Rs. ${stat.remaining.toLocaleString('en-IN')}`,
          `${stat.percentUsed}%`,
          stat.remaining < 0 ? 'OVER BUDGET' : stat.remaining === 0 ? 'EXHAUSTED' : 'WITHIN BUDGET'
        ];
      });

      // Add Grand Totals Row
      categoryRows.push([
        'GRAND TOTAL',
        `Rs. ${totalBudget.toLocaleString('en-IN')}`,
        `Rs. ${totalSpent.toLocaleString('en-IN')}`,
        `Rs. ${totalRemaining.toLocaleString('en-IN')}`,
        `${totalPercentUsed}%`,
        totalRemaining < 0 ? 'OVER BUDGET' : 'ON TRACK'
      ]);

      autoTable(doc, {
        startY: 74,
        head: [['Category', 'Allocated Budget', 'Total Spent', 'Remaining Balance', '% Used', 'Status']],
        body: categoryRows,
        theme: 'striped',
        headStyles: { fillColor: [21, 128, 61], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        footStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
        didParseCell: (data) => {
          if (data.row.index === categoryRows.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [220, 252, 231];
            data.cell.styles.textColor = [20, 83, 45];
          }
        }
      });

      // Table 2: Chronological Itemized Transactions
      const finalY = doc.lastAutoTable.finalY + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(21, 128, 61);
      doc.text('2. Itemized Chronological Expense Ledger', 14, finalY);

      const expenseRows = expenses.map((exp, idx) => {
        const catName = CATEGORY_DEFINITIONS[exp.category]?.name || exp.category;
        return [
          (idx + 1).toString(),
          `${exp.date} ${exp.time || ''}`,
          catName,
          `${exp.title}${exp.note ? ` (${exp.note})` : ''}`,
          exp.paymentMode || 'UPI',
          `Rs. ${exp.amount.toLocaleString('en-IN')}`
        ];
      });

      autoTable(doc, {
        startY: finalY + 4,
        head: [['#', 'Date & Time', 'Category', 'Expense Description & Notes', 'Mode', 'Amount']],
        body: expenseRows.length > 0 ? expenseRows : [['-', '-', '-', 'No expenses recorded yet', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
        bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      // Footer Promotion
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Munnar Explorer Document Report | Developed by Bharathkumar E (Ph: 8220802736, Mail: bharathkumarelango02@gmail.com, Web: apexassure.vercel.app)`,
          14,
          290
        );
        doc.text(`Page ${i} of ${pageCount}`, 190, 290);
      }

      doc.save(`Munnar_Trip_Expense_Report_${travelerName.replace(/\s+/g, '_')}.pdf`);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Could not generate PDF directly. Please try Print Document.');
    }
  };

  // 2. Export CSV Spreadsheet
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Header
    csvContent += `MUNNAR TRIP EXPENSE REPORT\r\n`;
    csvContent += `Traveler,${travelerName}\r\n`;
    csvContent += `Mobile,${travelerPhone}\r\n`;
    csvContent += `Email,${travelerEmail}\r\n`;
    csvContent += `Generated Date,${reportDate}\r\n`;
    csvContent += `Author & Developer,Bharathkumar E (https://apexassure.vercel.app/)\r\n\r\n`;

    // Category Summary
    csvContent += `CATEGORY SUMMARY\r\n`;
    csvContent += `Category,Allocated Budget (INR),Total Spent (INR),Remaining Balance (INR),Percentage Used\r\n`;
    Object.values(CATEGORY_DEFINITIONS).forEach((cat) => {
      const stat = categoryStats[cat.id] || { allocated: 0, spent: 0, remaining: 0, percentUsed: 0 };
      csvContent += `"${cat.name}",${stat.allocated},${stat.spent},${stat.remaining},${stat.percentUsed}%\r\n`;
    });
    csvContent += `"GRAND TOTAL",${totalBudget},${totalSpent},${totalRemaining},${totalPercentUsed}%\r\n\r\n`;

    // Itemized Transactions
    csvContent += `ITEMIZED TRANSACTIONS\r\n`;
    csvContent += `ID,Date,Time,Category,Title,Payment Mode,Note,Amount (INR)\r\n`;
    expenses.forEach((exp, idx) => {
      const catName = CATEGORY_DEFINITIONS[exp.category]?.name || exp.category;
      csvContent += `${idx + 1},"${exp.date}","${exp.time || ''}","${catName}","${exp.title.replace(/"/g, '""')}","${exp.paymentMode}","${(exp.note || '').replace(/"/g, '""')}",${exp.amount}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Munnar_Expense_Report_${travelerName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Trip Document & Reports</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Downloadable Trip Expense Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full itemized breakdown showing spending per category, total allocated vs. remaining balance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors hidden sm:flex"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Printable / Screen Report Document */}
      <div 
        ref={printRef}
        className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-soft space-y-6 print:shadow-none print:border-none print:p-0"
      >
        
        {/* Report Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Munnar Explorer Official Trip Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Expense Summary & Itemized Audit
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Application & System Designed by <strong className="text-emerald-700">Bharathkumar E</strong>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5 sm:text-right min-w-[220px]">
            <div className="flex sm:justify-end gap-2">
              <span className="text-slate-700">Report Date:</span>
              <strong className="text-slate-900">{reportDate}</strong>
            </div>
            <div className="flex sm:justify-end gap-2">
              <span className="text-slate-700">Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </span>
            </div>
          </div>
        </div>

        {/* Traveler Information Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase block">Traveler Name</span>
              <strong className="text-xs sm:text-sm text-slate-900">{travelerName}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase block">Mobile Phone</span>
              <strong className="text-xs sm:text-sm text-slate-900">{travelerPhone}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase block">Email Address</span>
              <strong className="text-xs sm:text-sm text-slate-900 truncate block max-w-[180px]">
                {travelerEmail}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 1: 6 Categories Comparison Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Category Budget vs. Spend Comparison</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">6 Defined Categories</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 sm:px-4">Category</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Allocated Budget</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Total Spent</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Remaining Balance</th>
                  <th className="py-3 px-3 sm:px-4 text-center">% Used</th>
                  <th className="py-3 px-3 sm:px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {Object.values(CATEGORY_DEFINITIONS).map((cat) => {
                  const stat = categoryStats[cat.id] || { allocated: 0, spent: 0, remaining: 0, percentUsed: 0 };
                  
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right font-semibold">
                        ₹{stat.allocated.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right font-semibold text-amber-600">
                        ₹{stat.spent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right font-black">
                        <span className={stat.remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          ₹{stat.remaining.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center font-bold text-xs">
                        {stat.percentUsed}%
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          stat.remaining < 0
                            ? 'bg-rose-100 text-rose-700'
                            : stat.percentUsed >= 85
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {stat.remaining < 0 ? 'Exceeded' : stat.percentUsed >= 85 ? 'Near Limit' : 'Within Budget'}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Grand Totals Summary Row */}
                <tr className="bg-emerald-50/80 font-black text-slate-950 border-t-2 border-emerald-200">
                  <td className="py-3.5 px-3 sm:px-4 uppercase text-xs tracking-wider font-extrabold">
                    Grand Total
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-right font-black text-slate-900">
                    ₹{totalBudget.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-right font-black text-amber-700">
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-right font-black text-emerald-800 text-base">
                    ₹{totalRemaining.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center font-extrabold text-xs">
                    {totalPercentUsed}%
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-600 text-white">
                      {totalRemaining < 0 ? 'Over' : 'Balanced'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Detailed Chronological Expenses List */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Itemized Expenses Ledger</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">{expenses.length} Records</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Expense Details & Note</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No expenses logged yet.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp, idx) => {
                    const catName = CATEGORY_DEFINITIONS[exp.category]?.name || exp.category;
                    return (
                      <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 font-medium">
                          {exp.date} {exp.time ? `• ${exp.time}` : ''}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {catName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-900 block">{exp.title}</span>
                          {exp.note && (
                            <span className="text-[11px] text-slate-600 italic block">Note: {exp.note}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 font-semibold">{exp.paymentMode}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Attribution & Promotion */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              B
            </div>
            <div>
              <p className="font-bold text-slate-800">Designed & Developed by Bharathkumar E</p>
              <p className="text-[11px] text-slate-600">Available free for all Munnar travelers & friends</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="tel:8220802736" 
              className="text-emerald-700 font-bold hover:underline"
            >
              📞 8220802736
            </a>
            <span>•</span>
            <a 
              href="mailto:bharathkumarelango02@gmail.com" 
              className="text-emerald-700 font-bold hover:underline"
            >
              ✉️ bharathkumarelango02@gmail.com
            </a>
            <span>•</span>
            <a 
              href="https://apexassure.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              🌐 apexassure.vercel.app
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </section>
  );
}
