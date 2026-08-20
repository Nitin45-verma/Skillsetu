import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  MessageSquare, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckCircle, 
  Plus, 
  Search, 
  UserCheck, 
  Star,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const DashboardPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      await refreshUser();
      const [reqRes, txnRes] = await Promise.all([
        API.get('/requests/my'),
        API.get('/transactions/my')
      ]);

      if (reqRes.data.success) setRequests(reqRes.data.data);
      if (txnRes.data.success) setTransactions(txnRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingIncoming = requests.filter(
    r => r.providerId?._id === user?._id && r.status === 'pending'
  );

  const activeRequests = requests.filter(
    r => r.status === 'accepted' || (r.status === 'pending' && r.requesterId?._id === user?._id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Namaste, {user?.name.split(' ')[0]}!</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Welcome to your SkillSetu Time-Bank portal. You have{' '}
            <span className="font-extrabold text-amber-700">{user?.creditBalance} Skill Credits</span> available.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/profile"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-brand-500" />
            <span>Add Skill Offering</span>
          </Link>

          <Link
            to="/browse"
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Browse Community Skills</span>
          </Link>
        </div>
      </div>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* HERO CREDIT BALANCE CARD */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="md:col-span-2 bg-gradient-to-br from-amber-500 via-orange-500 to-brand-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-100">
                Available Time Balance
              </span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-5xl font-black tracking-tight">{user?.creditBalance ?? 0}</span>
                <span className="text-lg font-bold text-amber-100">Skill Credits</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              ⚡
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 flex items-center justify-between text-xs text-amber-100 font-medium">
            <span>1 Credit = 1 Hour of Service</span>
            <Link to="/wallet" className="font-bold underline text-white hover:text-amber-200">
              View Full Ledger →
            </Link>
          </div>
        </motion.div>

        {/* STAT 2: SKILLS OFFERED */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Skills Offered</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900">{user?.skillsOffered?.length || 0}</span>
            <p className="text-xs text-slate-500 mt-1">Skills listed on your profile</p>
          </div>
          <Link to="/profile" className="text-xs font-bold text-teal-700 hover:underline">
            Manage Skills & Profile →
          </Link>
        </div>

        {/* STAT 3: INCOMING REQUESTS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900">{pendingIncoming.length}</span>
            <p className="text-xs text-slate-500 mt-1">Awaiting your response</p>
          </div>
          <Link to="/requests" className="text-xs font-bold text-amber-700 hover:underline">
            Review Pending Requests →
          </Link>
        </div>

      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ACTIVE REQUESTS & ACTIONS */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Clock className="w-5 h-5 text-brand-500" />
              <span>Active Skill Swaps</span>
            </h2>
            <Link to="/requests" className="text-xs font-bold text-brand-600 hover:underline">
              View All ({requests.length})
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : activeRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
                🤝
              </div>
              <h3 className="font-bold text-slate-800 text-base">No active skill swaps right now</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore skills offered by neighbors or add skills to your profile to receive barter requests.
              </p>
              <Link
                to="/browse"
                className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-xs hover:bg-brand-600 transition"
              >
                Browse Available Skills
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRequests.slice(0, 4).map((req) => {
                const isProvider = req.providerId?._id === user?._id;
                const otherUser = isProvider ? req.requesterId : req.providerId;

                return (
                  <div
                    key={req._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={otherUser?.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-100"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-500">
                            {isProvider ? 'Receiving Request from' : 'Requested to'}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{otherUser?.name}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{req.skillName}</h4>
                        <p className="text-xs text-slate-500 truncate max-w-md">"{req.message}"</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        {req.proposedHours} Credits
                      </span>

                      <Link
                        to={`/chat/${req._id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center space-x-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* RECENT LEDGER TRANSACTIONS SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>Credit Activity</span>
            </h2>
            <Link to="/wallet" className="text-xs font-bold text-teal-700 hover:underline">
              Ledger →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No completed transactions yet.</p>
            ) : (
              <div className="space-y-3.5">
                {transactions.slice(0, 5).map((txn) => {
                  const isEarned = txn.toUser?._id === user?._id;
                  const counterpart = isEarned ? txn.fromUser : txn.toUser;

                  return (
                    <div key={txn._id} className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isEarned ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isEarned ? '+' : '-'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {isEarned ? `Earned from ${counterpart?.name}` : `Spent with ${counterpart?.name}`}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(txn.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <span className={`font-extrabold ${isEarned ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isEarned ? '+' : '-'}{txn.creditsExchanged} Cr
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
