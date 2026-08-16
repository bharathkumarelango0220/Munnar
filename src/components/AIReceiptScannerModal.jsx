import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Loader2, 
  Receipt, 
  AlertCircle, 
  FileText, 
  Tag, 
  Calendar, 
  Clock, 
  CreditCard, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { scanReceiptWithAI, SAMPLE_RECEIPTS } from '../services/receiptScanner';

export default function AIReceiptScannerModal() {
  const { 
    isReceiptScannerOpen, 
    setIsReceiptScannerOpen, 
    categoryDefinitions, 
    addExpense,
    setActiveTab
  } = useApp();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [step, setStep] = useState('upload'); // 'upload' | 'scanning' | 'verify'
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  const activeCategories = Object.values(categoryDefinitions || {});

  if (!isReceiptScannerOpen) return null;

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  // Handle Sample Receipt Selection
  const handleSelectSample = (sample) => {
    setImagePreviewUrl(sample.previewUrl);
    processImage(sample.id);
  };

  // Trigger AI Scanning Pipeline
  const processImage = async (imageSource) => {
    setError('');
    setStep('scanning');

    if (typeof imageSource !== 'string') {
      setSelectedImage(imageSource);
      setImagePreviewUrl(URL.createObjectURL(imageSource));
    }

    try {
      const result = await scanReceiptWithAI(imageSource, activeCategories);

      if (result && result.success) {
        setExtractedData({
          title: result.title,
          amount: result.amount.toString(),
          category: result.category,
          date: result.date,
          time: result.time,
          paymentMode: result.paymentMode,
          note: result.notes,
          confidence: result.confidence
        });
        setStep('verify');
      } else {
        throw new Error(result?.error || 'Could not parse text from this receipt.');
      }
    } catch (err) {
      console.error(err);
      setError('AI could not read the receipt clearly. Please try another photo or choose a sample bill.');
      setStep('upload');
    }
  };

  // Submit and log expense into context
  const handleConfirmAndSave = (e) => {
    e.preventDefault();
    if (!extractedData.amount || Number(extractedData.amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    addExpense({
      title: extractedData.title || 'Scanned Receipt',
      amount: Number(extractedData.amount),
      category: extractedData.category || (activeCategories[0]?.id || 'food'),
      date: extractedData.date,
      time: extractedData.time,
      paymentMode: extractedData.paymentMode,
      note: extractedData.note || 'Scanned via AI Vision'
    });

    handleClose();
    setActiveTab('tracker');
  };

  const handleClose = () => {
    setIsReceiptScannerOpen(false);
    setStep('upload');
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setExtractedData(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl animate-scaleUp max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                AI Smart Receipt & Bill Scanner
              </h3>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Vision API • Instant Amount & Category OCR
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-5">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: UPLOAD OR CAMERA SNAP */}
          {step === 'upload' && (
            <div className="space-y-5">
              
              {/* Camera & Upload Action Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Camera Snap Button */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-emerald-500/50 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 text-slate-900 flex flex-col items-center justify-center gap-2.5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="font-extrabold text-xs sm:text-sm block">
                      📷 Snap with Camera
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Take a photo of paper bill
                    </span>
                  </div>
                </button>

                {/* Upload File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-slate-100 text-slate-900 flex flex-col items-center justify-center gap-2.5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="font-extrabold text-xs sm:text-sm block">
                      📁 Upload Bill Image
                    </span>
                    <span className="text-[10px] text-slate-500">
                      JPG, PNG, WEBP files
                    </span>
                  </div>
                </button>

              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* 1-Click Demonstration Samples */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Try 1-Click Demo Receipts</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Instant test</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {SAMPLE_RECEIPTS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-white flex items-center justify-between gap-3 text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={sample.previewUrl} 
                          alt={sample.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                            {sample.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {sample.type} • ₹{sample.defaultAmount}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-black text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Scan</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: SCANNING ANIMATION */}
          {step === 'scanning' && (
            <div className="py-8 text-center space-y-5">
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border border-emerald-500/40 shadow-xl bg-slate-950 flex items-center justify-center">
                {imagePreviewUrl ? (
                  <img 
                    src={imagePreviewUrl} 
                    alt="Scanning Preview" 
                    className="w-full h-full object-cover opacity-60" 
                  />
                ) : (
                  <Receipt className="w-16 h-16 text-emerald-400 animate-pulse" />
                )}

                {/* Laser Scanning Line Animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-bounce"></div>

                <div className="absolute bottom-2 px-3 py-1 rounded-full bg-slate-900/90 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                  <span>AI Vision Analyzing...</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-base text-slate-900">
                  Extracting Merchant & Rupee Total 🧠✨
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Detecting bill date, expense category, line items, and payment mode...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFY & CONFIRM DATA */}
          {step === 'verify' && extractedData && (
            <form onSubmit={handleConfirmAndSave} className="space-y-4">
              
              {/* AI Detection Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AI Scan Complete ({extractedData.confidence}% Confidence)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="text-[11px] font-bold text-emerald-700 underline"
                >
                  Rescan
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Total Amount Input */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Scanned Total Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-lg font-black text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={extractedData.amount}
                      onChange={(e) => setExtractedData({ ...extractedData, amount: e.target.value })}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xl font-black text-slate-900 focus:outline-none focus:border-emerald-500 bg-white shadow-xs"
                    />
                  </div>
                </div>

                {/* Merchant / Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merchant / Bill Title
                  </label>
                  <input
                    type="text"
                    required
                    value={extractedData.title}
                    onChange={(e) => setExtractedData({ ...extractedData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Auto-Classified Category
                  </label>
                  <select
                    value={extractedData.category}
                    onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={extractedData.paymentMode}
                    onChange={(e) => setExtractedData({ ...extractedData, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Cash">Cash Payment</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Receipt Date
                  </label>
                  <input
                    type="date"
                    value={extractedData.date}
                    onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Receipt Time
                  </label>
                  <input
                    type="time"
                    value={extractedData.time}
                    onChange={(e) => setExtractedData({ ...extractedData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Log to Tracker</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
