import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Send, 
  Zap, 
  ArrowRight,
  Radio
} from 'lucide-react';
import { parseVoiceExpense, SAMPLE_VOICE_COMMANDS } from '../services/voiceAssistant';

export default function AIVoiceAssistantModal() {
  const { 
    isVoiceAssistantOpen, 
    setIsVoiceAssistantOpen, 
    categoryDefinitions, 
    addExpense,
    setActiveTab
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [audioLevel, setAudioLevel] = useState(1);
  const [listeningSeconds, setListeningSeconds] = useState(0);

  const recognitionRef = useRef(null);
  const textInputRef = useRef(null);
  const isListeningRef = useRef(false);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const activeCategories = Object.values(categoryDefinitions || {});

  // Setup speech recognition instance
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          isListeningRef.current = true;
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setTranscript(currentTranscript);
            setInputText(currentTranscript);
            handleProcessVoiceText(currentTranscript);
          }
        };

        recognition.onerror = (event) => {
          console.log('Speech recognition notice:', event.error);
        };

        recognition.onend = () => {
          // If still marked as listening by user, auto restart
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition restart wait');
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.log('Speech API init error', e);
      }
    }

    return () => {
      stopListening();
    };
  }, [categoryDefinitions]);

  // Handle Listening Timer
  useEffect(() => {
    if (isListening) {
      setListeningSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setListeningSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isListening]);

  if (!isVoiceAssistantOpen) return null;

  // Start Voice Listening with audio visualizer & mic stream
  const startListening = async () => {
    setTranscript('');
    setParsedData(null);
    setIsListening(true);
    isListeningRef.current = true;

    // 1. Request microphone stream for true audio activity
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const audioCtx = new AudioContext();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (!isListeningRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const normalized = Math.min(Math.max(average / 15, 1), 3.5);
            setAudioLevel(normalized);
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        }
      }
    } catch (micErr) {
      console.warn('Microphone stream notice:', micErr);
    }

    // 2. Start Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try { recognitionRef.current.start(); } catch (err) {}
          }, 150);
        } catch (err) {}
      }
    }
  };

  // Stop Voice Listening
  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setAudioLevel(1);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // If there is text in input, auto process final result
    if (inputText.trim()) {
      handleProcessVoiceText(inputText);
    }
  };

  // Parse Text via NLP Engine
  const handleProcessVoiceText = (text) => {
    if (!text || text.trim().length === 0) return;
    const result = parseVoiceExpense(text, activeCategories);
    if (result && result.success) {
      setParsedData({
        title: result.title,
        amount: result.amount.toString(),
        category: result.category,
        paymentMode: result.paymentMode,
        date: result.date,
        time: result.time,
        note: result.notes
      });
    }
  };

  // Handle Manual Text Typing & Instant Parse
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim().length > 0) {
      setTranscript(inputText);
      handleProcessVoiceText(inputText);
    }
  };

  // Handle Sample Voice Click
  const handleSampleClick = (sample) => {
    setTranscript(sample.phrase);
    setInputText(sample.phrase);
    handleProcessVoiceText(sample.phrase);
  };

  // Confirm and Log to Tracker
  const handleConfirmAndSave = (e) => {
    e.preventDefault();
    if (!parsedData || !parsedData.amount || Number(parsedData.amount) <= 0) {
      return;
    }

    addExpense({
      title: parsedData.title || 'Voice Expense',
      amount: Number(parsedData.amount),
      category: parsedData.category || (activeCategories[0]?.id || 'food'),
      paymentMode: parsedData.paymentMode,
      date: parsedData.date,
      time: parsedData.time,
      note: parsedData.note || 'Logged via Voice Assistant'
    });

    handleClose();
    setActiveTab('tracker');
  };

  const handleClose = () => {
    stopListening();
    setIsVoiceAssistantOpen(false);
    setTranscript('');
    setInputText('');
    setParsedData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl animate-scaleUp max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/30">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base leading-tight">
                AI Voice Expense Assistant
              </h3>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Continuous Speech to Expense Logger
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

          {/* SECTION 1: DYNAMIC MICROPHONE WITH LIVE AUDIO WAVE VISUALIZER */}
          <div className="text-center py-2 space-y-3">
            
            <div className="relative inline-flex items-center justify-center">
              
              {/* Dynamic Sound Wave Rings */}
              {isListening && (
                <>
                  <div 
                    className="absolute rounded-full bg-emerald-500/30 transition-transform duration-100 pointer-events-none"
                    style={{
                      width: `${80 * audioLevel}px`,
                      height: `${80 * audioLevel}px`
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-emerald-500/20 transition-transform duration-150 pointer-events-none animate-ping"
                    style={{
                      width: `${100 * audioLevel}px`,
                      height: `${100 * audioLevel}px`
                    }}
                  />
                </>
              )}

              {/* Main Mic Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center text-white transition-all shadow-xl active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 shadow-rose-600/40 ring-4 ring-rose-400/80 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 hover:scale-105'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 sm:w-9 sm:h-9" />
                ) : (
                  <Mic className="w-8 h-8 sm:w-9 sm:h-9" />
                )}
              </button>
            </div>

            {/* Listening Status & Timer */}
            <div>
              {isListening ? (
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    <span>Listening... ({listeningSeconds}s)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Speak your expense phrase, then tap the red mic to finish!
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 block">
                    Tap the Mic to Start Speaking
                  </span>
                  <p className="text-xs text-slate-500">
                    e.g. <em>"Spent 450 rupees for lunch at Saravana Bhavan with GPay"</em>
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* SECTION 2: LIVE SPEECH & SMART INPUT BAR */}
          <form onSubmit={handleTextSubmit} className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Spoken / Typed Expense Command:
            </label>
            <div className="relative flex items-center">
              <input
                ref={textInputRef}
                type="text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (e.target.value.trim().length > 2) {
                    handleProcessVoiceText(e.target.value);
                  }
                }}
                placeholder="Type or speak: e.g. Petrol 800 cash..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 bg-white shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                title="Parse Expense"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* SECTION 3: EXTRACTED STRUCTURED DATA */}
          {parsedData && (
            <form onSubmit={handleConfirmAndSave} className="p-4 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3.5 animate-scaleUp">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Extracted Details</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Auto-Parsed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm font-black text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={parsedData.amount}
                      onChange={(e) => setParsedData({ ...parsedData, amount: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-black text-slate-900 bg-white"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={parsedData.category}
                    onChange={(e) => setParsedData({ ...parsedData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  >
                    {activeCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description / Merchant
                  </label>
                  <input
                    type="text"
                    required
                    value={parsedData.title}
                    onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  />
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={parsedData.paymentMode}
                    onChange={(e) => setParsedData({ ...parsedData, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Log to Expense Tracker 🚀</span>
              </button>
            </form>
          )}

          {/* SECTION 4: 1-CLICK TEST SAMPLES */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Or Try 1-Click Sample Commands:</span>
            </span>

            <div className="grid grid-cols-1 gap-1.5">
              {SAMPLE_VOICE_COMMANDS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSampleClick(sample)}
                  className="p-2.5 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/60 hover:bg-white text-left text-xs font-medium text-slate-800 transition-all flex items-center justify-between gap-2 group"
                >
                  <span className="truncate">🗣️ "{sample.phrase}"</span>
                  <span className="text-[11px] font-bold text-emerald-700 shrink-0 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    <span>Try</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
