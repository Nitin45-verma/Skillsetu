import React from 'react';
import { Link } from 'react-router-dom';
import { Handshake, Heart, Shield, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <Handshake className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Skill<span className="text-brand-500">Setu</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              SkillSetu connects neighbors to exchange skills using a fair time-credit model. 
              Earn 1 credit per hour by helping someone with cooking, repairs, coding, or gardening, 
              and spend it on help from ANYONE in the community. No cash involved.
            </p>
            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400 pt-2">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>1 Hour = 1 Credit</span>
              </span>
              <span className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Atomic Double Confirmation</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/browse" className="hover:text-brand-400 transition">Browse Skills</Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-brand-400 transition">Credit Ledger</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-400 transition">Community Dashboard</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition">Get 5 Starter Credits</Link>
              </li>
            </ul>
          </div>

          {/* Skill Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Tutoring & Education</li>
              <li>Cooking & Artisanal Baking</li>
              <li>Home Repairs & DIY</li>
              <li>Tech & Web Development</li>
              <li>Yoga & Personal Fitness</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SkillSetu Time-Bank Platform. Built for community empowerments.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for zero-cash skill sharing</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
