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
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreatorCard() {
  const [copiedField, setCopiedField] = useState('');

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleHireClick = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <section className="space-y-6">
      
      {/* Section Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Code className="w-4 h-4 text-emerald-600" />
          <span>Creator Profile & Contact</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Crafted by Bharathkumar E
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Free mobile companion built with passion for travelers exploring Munnar, Kerala.
        </p>
      </div>

      {/* Main Creator Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-6 sm:p-8 md:p-10 border border-slate-800 shadow-2xl">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Creator Intro Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  B
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Bharathkumar E
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase">
                    Developer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-0.5">
                  Fullstack Web Developer & UI/UX Specialist
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Free Munnar Travel Gift for Everyone</span>
                </p>
              </div>
            </div>

            {/* Main Website Promotion Link */}
            <div className="flex flex-col sm:items-end gap-2">
              <a
                href="https://apexassure.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleHireClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>Visit My Website: ApexAssure</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
              <span className="text-[11px] text-emerald-300/80 font-medium">
                👉 apexassure.vercel.app
              </span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Phone */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Phone className="w-4 h-4" />
                  <span>Direct Call / WhatsApp</span>
                </div>
                <button
                  onClick={() => handleCopy('8220802736', 'phone')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div>
                <a
                  href="tel:8220802736"
                  className="text-base font-black text-white hover:text-emerald-300 transition-colors block"
                >
                  +91 8220802736
                </a>
                <span className="text-[10px] text-slate-400">Available for calls & projects</span>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
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
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div>
                <a
                  href="mailto:bharathkumarelango02@gmail.com"
                  className="text-xs sm:text-sm font-bold text-white hover:text-teal-300 transition-colors block truncate"
                >
                  bharathkumarelango02@gmail.com
                </a>
                <span className="text-[10px] text-slate-400">Quick response within 24 hours</span>
              </div>
            </div>

            {/* Website */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Globe className="w-4 h-4" />
                  <span>Portfolio & Services</span>
                </div>
                <a
                  href="https://apexassure.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div>
                <a
                  href="https://apexassure.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-emerald-300 hover:underline block truncate"
                >
                  apexassure.vercel.app
                </a>
                <span className="text-[10px] text-slate-400">High-converting web solutions</span>
              </div>
            </div>

          </div>

          {/* Promotion Banner for Website Building Services */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="font-extrabold text-sm sm:text-base text-white">
                Looking to Build a Website or Web Application?
              </h4>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              I specialize in creating <strong>fast, mobile-first, high-performing websites</strong>, e-commerce platforms, travel companions, SaaS applications, and custom business tools tailored to your needs.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile First UI</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
                <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modern React/Next</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Reliable</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://api.whatsapp.com/send?phone=918220802736&text=Hi%20Bharathkumar,%20I%20saw%20your%20Munnar%20Explorer%20website%20and%20want%20to%20discuss%20building%20a%20website!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="mailto:bharathkumarelango02@gmail.com?subject=Website%20Building%20Inquiry%20from%20Munnar%20Companion&body=Hi%20Bharathkumar,"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email Inquiry</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
