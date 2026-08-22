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
  Layers,
  Cpu,
  Database,
  Palette,
  Terminal,
  Calendar,
  Briefcase,
  FileText
} from 'lucide-react';

export default function CreatorCard() {
  const [copiedField, setCopiedField] = useState('');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');

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
      console.warn('Copy fallback:', e);
    }
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleWhatsAppSend = (e) => {
    e.preventDefault();
    const text = `Hi Bharathkumar! I am ${inquiryName || 'a visitor'}. ${inquiryMsg || 'I saw your TripTools web application and would like to discuss building a website / web project!'}`;
    const url = `https://api.whatsapp.com/send?phone=918220802736&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      
      {/* SECTION 1: HERO DEVELOPER PROFILE CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-6 sm:p-8 md:p-10 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 font-black text-3xl sm:text-4xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  B
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-400 text-slate-950 rounded-full shadow-lg">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                    Bharathkumar E
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Full-Stack Engineer
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 font-bold mt-1">
                  Web Developer, UI/UX Specialist & Software Creator
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Creator of TripTools Travel Suite & Expense Tracker</span>
                </p>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5">
              <a
                href="https://apexassure.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/25 active:scale-95 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>View Portfolio 🌐</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=918220802736&text=Hi%20Bharathkumar,%20I%20saw%20your%20TripTools%20app%20and%20would%20like%20to%20connect!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
              <span className="text-[11px] text-emerald-300/80 font-medium">
                ⚡ Available for freelance & full-time projects
              </span>
            </div>
          </div>

          {/* Contact & Portfolio Direct Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Portfolio Website Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-teal-500/10 to-emerald-500/5 border border-teal-500/30 flex flex-col justify-between space-y-3 hover:border-teal-400 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span>Portfolio Website</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy('https://apexassure.vercel.app/', 'portfolio')}
                    className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                    title="Copy Portfolio URL"
                  >
                    {copiedField === 'portfolio' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href="https://apexassure.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-teal-300 p-1 rounded-lg transition-colors"
                    title="Open Portfolio in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div>
                <a
                  href="https://apexassure.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg font-black text-white hover:text-teal-300 transition-colors block tracking-tight truncate group-hover:underline"
                >
                  apexassure.vercel.app ↗
                </a>
                <span className="text-[11px] text-teal-200/70 block mt-0.5">Live Projects, SaaS & Case Studies</span>
              </div>
            </div>

            {/* Phone / WhatsApp */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Phone className="w-4 h-4" />
                  <span>Phone / WhatsApp</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('8220802736', 'phone')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                  title="Copy Phone"
                >
                  {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div>
                <a
                  href="tel:8220802736"
                  className="text-base sm:text-lg font-black text-white hover:text-emerald-300 transition-colors block tracking-tight"
                >
                  +91 8220802736
                </a>
                <span className="text-[11px] text-slate-400 block mt-0.5">Direct Call & Instant WhatsApp</span>
              </div>
            </div>

            {/* Primary Email */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </div>
                <button
                  type="button"
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
                <span className="text-[11px] text-slate-400 block mt-0.5">Direct Developer Inquiries</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* SECTION 2: TECHNICAL SKILLS & EXPERTISE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>Core Competencies & Stack</span>
        </div>
        
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Skills, Tools & Technologies 💻🚀
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built with modern, production-grade web technologies for speed, SEO, and responsiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Frontend */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase">
              <Laptop className="w-4 h-4" />
              <span>Frontend Dev</span>
            </div>
            <p className="text-sm font-black text-slate-900">React.js & Next.js</p>
            <p className="text-xs text-slate-500">Vite, Tailwind CSS, JavaScript (ES6+), HTML5/CSS3</p>
          </div>

          {/* Backend & DB */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase">
              <Database className="w-4 h-4" />
              <span>Backend & Cloud</span>
            </div>
            <p className="text-sm font-black text-slate-900">Firebase & Node.js</p>
            <p className="text-xs text-slate-500">Cloud Firestore, Auth, RESTful APIs, Express</p>
          </div>

          {/* UI/UX */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase">
              <Palette className="w-4 h-4" />
              <span>UI/UX Design</span>
            </div>
            <p className="text-sm font-black text-slate-900">Mobile-First UI</p>
            <p className="text-xs text-slate-500">Responsive layouts, Micro-animations, Clean Typography</p>
          </div>

          {/* DevOps & Tools */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase">
              <Terminal className="w-4 h-4" />
              <span>DevOps & Tools</span>
            </div>
            <p className="text-sm font-black text-slate-900">Git & Vercel</p>
            <p className="text-xs text-slate-500">Continuous Deployment, GitHub Actions, PDF Generation</p>
          </div>

        </div>
      </div>

      {/* SECTION 3: SERVICES OFFERED */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <Briefcase className="w-4 h-4 text-emerald-600" />
          <span>Services & Freelance</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            What I Can Build For You 🛠️✨
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Need a professional website or custom web software? Here is what I deliver:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Business & Portfolio Websites
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              High-converting, lightning-fast landing pages with custom branding, animations, and lead capture forms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Web Applications & Tools
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dynamic calculators, travel companions, budget trackers, dashboards, and automated business workflows.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Fullstack & Cloud Integrations
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Firebase user auth, cloud databases, live real-time sync, PDF exports, and payment gateway integration.
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 4: DIRECT INQUIRY / CONTACT FORM */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Get In Touch
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
            Have a Project in Mind? Let's Connect! 💬
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Send a direct message on WhatsApp or email to discuss timelines and pricing.
          </p>
        </div>

        <form onSubmit={handleWhatsAppSend} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Your Name:
            </label>
            <input
              type="text"
              value={inquiryName}
              onChange={(e) => setInquiryName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Your Message / Website Requirement:
            </label>
            <textarea
              rows="3"
              value={inquiryMsg}
              onChange={(e) => setInquiryMsg(e.target.value)}
              placeholder="Tell me about what kind of website or application you want to build..."
              className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </button>

            <a
              href="https://apexassure.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Visit Portfolio 🌐</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="mailto:bharathkumarelango02@gmail.com?subject=Website%20Inquiry%20from%20TripTools"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/15"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </a>
          </div>
        </form>
      </div>

    </div>
  );
}
