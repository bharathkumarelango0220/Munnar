import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  User, 
  Calendar, 
  MapPin,
  CheckCircle2, 
  ExternalLink,
  Edit3
} from 'lucide-react';

export default function ReportGenerator() {
  const { 
    travelerName,
    tripTitle,
    setIsNameModalOpen,
    budgets, 
    expenses, 
    categoryDefinitions,
    categoryStats, 
    totalBudget, 
    totalSpent, 
    totalRemaining, 
    totalPercentUsed
  } = useApp();

  const printRef = useRef();
  const activeCategories = Object.values(categoryDefinitions || {});

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
      doc.text('TRIPTOOLS EXPENSE STATEMENT & AUDIT', 14, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Crafted by Bharathkumar E  |  Web: apexassure.vercel.app  |  Ph: +91 8220802736', 14, 22);
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 27);

      // Traveler Info Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 38, 182, 22, 3, 3, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, 38, 182, 22, 3, 3, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Report Prepared For: ${travelerName}`, 20, 47);
      doc.text(`Trip Title: ${tripTitle}`, 110, 47);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Statement Date: ${reportDate}`, 20, 54);
      doc.text(`Status: Verified Active Expense Record`, 110, 54);

      // Table 1: Category Budget vs Actual Summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(21, 128, 61);
      doc.text('1. Category Budget vs. Actual Spend Summary', 14, 68);

      const categoryRows = activeCategories.map((cat) => {
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
        totalRemaining < 0 ? 'OVER BUDGET' : 'UNDER BUDGET'
      ]);

      autoTable(doc, {
        startY: 72,
        head: [['Expense Category', 'Allocated Budget', 'Total Spent', 'Remaining Balance', '% Used', 'Status']],
        body: categoryRows,
        theme: 'striped',
        headStyles: { fillColor: [21, 128, 61], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        footStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }
      });

      // Table 2: Itemized Transactions Ledger
      const finalY = doc.lastAutoTable.finalY || 130;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(21, 128, 61);
      doc.text('2. Itemized Transactions Audit Ledger', 14, finalY + 12);

      const expenseRows = expenses.map((exp, idx) => {
        const catName = categoryDefinitions[exp.category]?.name || exp.category;
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
        startY: finalY + 16,
        head: [['#', 'Date & Time', 'Category', 'Expense Description & Notes', 'Mode', 'Amount']],
        body: expenseRows.length > 0 ? expenseRows : [['-', '-', '-', 'No expenses recorded yet', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
        bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `TripTools Document Report | Developed by Bharathkumar E (Ph: 8220802736, Mail: bharathkumarelango02@gmail.com, Web: apexassure.vercel.app)`,
          14,
          290
        );
        doc.text(`Page ${i} of ${pageCount}`, 190, 290);
      }

      doc.save(`TripTools_Report_${travelerName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Could not generate PDF directly. Please try Print Document.');
    }
  };

  // 2. Export CSV Spreadsheet
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Header
    csvContent += `TRIPTOOLS EXPENSE STATEMENT\r\n`;
    csvContent += `Report Prepared For,${travelerName}\r\n`;
    csvContent += `Trip Title,${tripTitle}\r\n`;
    csvContent += `Generated Date,${reportDate}\r\n`;
    csvContent += `Author & Developer,Bharathkumar E (https://apexassure.vercel.app/)\r\n\r\n`;

    // Category Summary
    csvContent += `CATEGORY SUMMARY\r\n`;
    csvContent += `Category,Allocated Budget (INR),Total Spent (INR),Remaining Balance (INR),Percentage Used\r\n`;
    activeCategories.forEach((cat) => {
      const stat = categoryStats[cat.id] || { allocated: 0, spent: 0, remaining: 0, percentUsed: 0 };
      csvContent += `"${cat.name}",${stat.allocated},${stat.spent},${stat.remaining},${stat.percentUsed}%\r\n`;
    });
    csvContent += `"GRAND TOTAL",${totalBudget},${totalSpent},${totalRemaining},${totalPercentUsed}%\r\n\r\n`;

    // Itemized Transactions
    csvContent += `ITEMIZED TRANSACTIONS\r\n`;
    csvContent += `ID,Date,Time,Category,Title,Payment Mode,Note,Amount (INR)\r\n`;
    expenses.forEach((exp, idx) => {
      const catName = categoryDefinitions[exp.category]?.name || exp.category;
      csvContent += `${idx + 1},"${exp.date}","${exp.time || ''}","${catName}","${exp.title.replace(/"/g, '""')}","${exp.paymentMode}","${(exp.note || '').replace(/"/g, '""')}",${exp.amount}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TripTools_Report_${travelerName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Trip Document & Reports</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Official Travel Expense Report 📑
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized with your traveler name. Download in PDF & CSV spreadsheet format.
          </p>
        </div>

        {/* Action Buttons - Mobile friendly full width grid / row */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="truncate">CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all active:scale-95 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div 
        ref={printRef}
        className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 print:shadow-none print:border-none print:p-0 transition-colors"
      >
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/60">
                Official Trip Audit
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Expense Summary & Itemized Audit
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Application & System Designed by <strong className="text-emerald-700 dark:text-emerald-400">Bharathkumar E</strong>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 sm:text-right w-full sm:w-auto min-w-[220px]">
            <div className="flex sm:justify-end gap-2">
              <span className="text-slate-500 dark:text-slate-400">Report Date:</span>
              <strong className="text-slate-900 dark:text-white">{reportDate}</strong>
            </div>
            <div className="flex sm:justify-end gap-2">
              <span className="text-slate-500 dark:text-slate-400">Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Active
              </span>
            </div>
          </div>
        </div>

        {/* Traveler Information Card with High-Contrast Dark Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 dark:text-emerald-400 uppercase tracking-wider block">
                  Report Prepared For
                </span>
                <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-black truncate block">
                  {travelerName}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsNameModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs shrink-0"
              title="Edit Traveler Name"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 dark:text-teal-400 uppercase tracking-wider block">
                  Trip Title
                </span>
                <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-black truncate block">
                  {tripTitle}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsNameModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all shadow-xs shrink-0"
              title="Edit Trip Title"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Section 1: Categories Comparison Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Category Budget vs. Spend Comparison</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{activeCategories.length} Categories</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3 sm:px-4">Category</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Allocated Budget</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Total Spent</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Remaining Balance</th>
                  <th className="py-3 px-3 sm:px-4 text-center">% Used</th>
                  <th className="py-3 px-3 sm:px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {activeCategories.map((cat) => {
                  const stat = categoryStats[cat.id] || { allocated: 0, spent: 0, remaining: 0, percentUsed: 0 };
                  
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 sm:px-4 font-bold text-slate-900 dark:text-white">{cat.name}</td>
                      <td className="py-3 px-3 sm:px-4 text-right">₹{stat.allocated.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 sm:px-4 text-right text-rose-600 dark:text-rose-400 font-bold">₹{stat.spent.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 sm:px-4 text-right font-black">
                        <span className={stat.remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}>
                          ₹{stat.remaining.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          stat.percentUsed > 100 
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300' 
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {stat.percentUsed}%
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-center">
                        <span className={`text-[11px] font-bold ${
                          stat.remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {stat.remaining < 0 ? 'Exceeded' : 'Within Budget'}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Grand Total Row */}
                <tr className="bg-slate-900 dark:bg-slate-950 text-white font-black text-xs sm:text-sm border-t-2 border-slate-700">
                  <td className="py-3.5 px-3 sm:px-4 uppercase tracking-wider">Grand Total</td>
                  <td className="py-3.5 px-3 sm:px-4 text-right">₹{totalBudget.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 sm:px-4 text-right text-rose-400">₹{totalSpent.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 sm:px-4 text-right text-emerald-400">₹{totalRemaining.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-3 sm:px-4 text-center">{totalPercentUsed}%</td>
                  <td className="py-3.5 px-3 sm:px-4 text-center text-xs">
                    {totalRemaining < 0 ? '⚠️ Over Budget' : '✅ Balanced'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Itemized Transactions Table */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Itemized Transactions Log ({expenses.length})</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Live Item Ledger</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Payment Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No expense transactions logged yet. Add expenses in the Tracker to view them here.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp, idx) => {
                    const catName = categoryDefinitions[exp.category]?.name || exp.category;
                    return (
                      <tr key={exp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-400 dark:text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">{exp.date} {exp.time}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            {catName}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                          {exp.title}
                          {exp.note && <span className="text-slate-400 dark:text-slate-500 block text-[11px]">{exp.note}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{exp.paymentMode || 'UPI'}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white">₹{Number(exp.amount).toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2">
          <span>Official Statement generated by TripTools Suite</span>
          <a 
            href="https://apexassure.vercel.app/"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            Engineered by Bharathkumar E (apexassure.vercel.app)
          </a>
        </div>

      </div>

    </section>
  );
}
