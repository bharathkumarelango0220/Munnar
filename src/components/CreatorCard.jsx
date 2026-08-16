import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  Code, 
  CheckCircle2, 
  MessageSquare, 
  Copy, 
  Check, 
  Laptop, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  Heart,
  Send,
  Star,
  Award,
  ArrowUpRight
} from 'lucide-react';

export default function CreatorCard() {
  const [copiedField, setCopiedField] = useState('');

  const handleCopy = (text, fieldName) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (e) {
      console.warn('Copy failed:', e);
    }
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Creator Intro Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
                  B
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-400 text-slate-950 rounded-full shadow">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    Bharathkumar E
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Developer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 font-semibold mt-1">
                  Full-Stack Software Engineer & UI/UX Specialist
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-1.5 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Free Munnar Companion Built for All Travelers</span>
                </p>
              </div>
            </div>

            {/* Main Website Promotion Link */}
            <div className="flex flex-col sm:items-start md:items-end gap-2">
              <a
                href="https://apexassure.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 active:scale-95 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>Visit My Website: ApexAssure</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
              <span className="text-xs text-emerald-300/90 font-semibold">
                👉 apexassure.vercel.app
              </span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            
            {/* Phone & WhatsApp */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Phone className="w-4 h-4" />
                  <span>Phone / WhatsApp</span>
                </div>
                <button
                  onClick={() => handleCopy('8220802736', 'phone')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <a
                  href="tel:8220802736"
                  className="text-lg font-black text-white hover:text-emerald-300 transition-colors block tracking-tight"
                >
                  +91 8220802736
                </a>
                <span className="text-[11px] text-slate-400">Available for calls & projects</span>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </div>
                <button
                  onClick={() => handleCopy('bharathkumarelango02@gmail.com', 'email')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <a
                  href="mailto:bharathkumarelango02@gmail.com"
                  className="text-xs sm:text-sm font-bold text-white hover:text-teal-300 transition-colors block truncate"
                >
                  bharathkumarelango02@gmail.com
                </a>
                <span className="text-[11px] text-slate-400">Quick response within 24 hours</span>
              </div>
            </div>

            {/* Portfolio */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Globe className="w-4 h-4" />
                  <span>Portfolio & Projects</span>
                </div>
                <a
                  href="https://apexassure.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div>
                <a
                  href="https://apexassure.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-black text-emerald-300 hover:underline block truncate"
                >
                  apexassure.vercel.app
                </a>
                <span className="text-[11px] text-slate-400">High-converting web apps</span>
              </div>
            </div>

          </div>

          {/* Promotion Banner for Website Building Services */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-black text-base sm:text-lg text-white">
                Looking to Build a Modern Website or Web Application?
              </h3>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              I specialize in developing <strong>fast, mobile-first, high-converting websites</strong>, e-commerce stores, custom travel tools, SaaS web platforms, and automated business systems.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-emerald-200">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mobile-First UI</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-emerald-200">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-emerald-200">
                <Laptop className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>React & Next.js</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Reliable</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=918220802736&text=Hi%20Bharathkumar,%20I%20saw%20your%20Munnar%20Explorer%20app%20and%20want%20to%20discuss%20building%20a%20website!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="mailto:bharathkumarelango02@gmail.com?subject=Website%20Building%20Inquiry&body=Hi%20Bharathkumar,%20I%20want%20to%20discuss%20a%20website%20project."
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/15"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email Inquiry</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
