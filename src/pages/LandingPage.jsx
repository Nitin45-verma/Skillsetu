import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Handshake, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Award,
  Zap,
  BookOpen,
  Utensils,
  Wrench,
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300/60 px-4 py-1.5 rounded-full text-xs font-bold text-amber-900 shadow-xs">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Zero-Cash Time-Bank Community</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Your time is your <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500">currency.</span>
            </h1>

            <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              SkillSetu lets you exchange services with neighbors using a fair time-credit model. 
              Help someone for 1 hour with guitar, cooking, or coding to earn <span className="font-extrabold text-slate-800">1 Skill Credit</span>, 
              and spend it on help from <span className="font-extrabold text-brand-600">ANYONE</span> on the platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-base shadow-xl shadow-brand-500/25 transition transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{user ? 'Go to Dashboard' : 'Join & Get 5 Starter Credits'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/browse"
                className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-xs transition text-center"
              >
                Explore Offered Skills
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 text-xs font-bold text-slate-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-brand-500 shrink-0" />
                <span>1 Hour = 1 Credit</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Double Confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Non-Cash Barter</span>
              </div>
            </div>
          </motion.div>

          {/* HERO VISUAL CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-150 space-y-6">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Community Credit Ledger</h3>
                    <p className="text-xs text-slate-500">Atomic Time-Bank System</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                  Active Demo
                </span>
              </div>

              {/* Sample Trade Animation Flow */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100" className="w-10 h-10 rounded-full object-cover" alt="Aarav" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Aarav (Tutor)</h4>
                      <p className="text-[11px] text-slate-500">Taught React JS (2 hrs)</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-600">+2 Credits</span>
                </div>

                <div className="flex justify-center my-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shadow-inner">
                    ↓
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" className="w-10 h-10 rounded-full object-cover" alt="Priya" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Priya (Baker)</h4>
                      <p className="text-[11px] text-slate-500">Received 2 Sourdough Credits</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-brand-600">Spent -2 Credits</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 text-white text-xs font-medium flex items-center justify-between">
                <span>Fair time equity: 1 hr doctor = 1 hr plumber</span>
                <span className="font-bold text-amber-400">100% Equal Value</span>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold tracking-widest text-brand-500 uppercase">How SkillSetu Works</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Three simple steps to start bartering time
          </h2>
          <p className="text-slate-600 text-sm">
            Forget monetary prices. Exchange your passion for the skills you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-black">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900">List Your Skills</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Add skills you can offer (e.g., cooking, guitar, math tutoring, home repairs) and specify skills you want to learn.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-black">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900">Help Others & Earn</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Accept requests from neighbors. For every 1 hour of help provided, earn 1 Skill Credit deposited directly to your wallet.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-black">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900">Request Help from Anyone</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Spend your credits with ANY member on the platform. It's a community pool, not a direct 1-to-1 swap constraint.
            </p>
          </div>

        </div>
      </section>

      {/* WHY TIME-BANK MODEL */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">The Technical Core</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Why Time-Bank beat traditional 1-to-1 Barter
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                In traditional barter, if you need a plumber who wants guitar lessons, finding a direct match is almost impossible. 
                SkillSetu solves this with an atomic time-credit ledger:
              </p>

              <ul className="space-y-3 text-sm text-slate-200 font-medium">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>Multi-lateral Liquidity:</strong> Help Person A, spend your earned credit with Person B.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>Atomic Double-Confirmation:</strong> Credits move only when BOTH requester and provider confirm completed work.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>No Cash & No Arbitrage:</strong> Everyone's hour is respected equally, fostering true community trust.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/90 rounded-3xl p-8 border border-slate-700 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="font-bold text-white text-base">Model Comparison</h3>
                <span className="text-xs font-bold text-slate-400">Time-Bank vs Freelance</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-200">1-to-1 Barter</h4>
                    <p className="text-slate-400">Requires mutual matching interest</p>
                  </div>
                  <span className="text-rose-400 font-bold">Hard to match</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-200">Cash Marketplaces (Fiverr)</h4>
                    <p className="text-slate-400">High fees, monetary barrier</p>
                  </div>
                  <span className="text-amber-400 font-bold">Expensive</span>
                </div>

                <div className="p-4 rounded-2xl bg-brand-950/80 border border-brand-500/40 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-brand-300">SkillSetu Time-Bank</h4>
                    <p className="text-brand-100">1 hr = 1 credit, infinite liquidity</p>
                  </div>
                  <span className="text-emerald-400 font-extrabold">🌟 Optimal Community</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="space-y-3 text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to swap skills without money?</h2>
            <p className="text-amber-100 text-sm max-w-xl">
              Sign up in 30 seconds and receive 5 free starter credits immediately.
            </p>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-black text-base hover:bg-slate-100 transition shadow-lg shrink-0 transform hover:scale-105"
          >
            Claim 5 Free Credits
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
