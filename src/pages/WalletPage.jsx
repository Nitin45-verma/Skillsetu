import React, { useEffect, useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Clock, 
  Activity, 
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const WalletPage = () => {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'earned' | 'spent'

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      await refreshUser();
      const res = await API.get('/transactions/my');
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error('Error loading transaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalEarned = transactions
    .filter(t => t.toUser?._id === user?._id)
    .reduce((sum, t) => sum + t.creditsExchanged, 0);

  const totalSpent = transactions
    .filter(t => t.fromUser?._id === user?._id)
    .reduce((sum, t) => sum + t.creditsExchanged, 0);

  const filteredTxns = transactions.filter((t) => {
    const isEarned = t.toUser?._id === user?._id;
    if (filterType === 'earned' && !isEarned) return false;
    if (filterType === 'spent' && isEarned) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* WALLET HERO HEADER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl space-y-6 border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-700 pb-6">
          
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-extrabold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tamper-Proof Time Ledger</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Skill Credits Wallet
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              User ID: <span className="font-mono text-slate-300">{user?._id}</span>
            </p>
          </div>

          {/* BALANCE COUNTER */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-6 text-right space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Available Credit Balance
            </span>
            <div className="flex items-baseline justify-end space-x-2">
              <span className="text-4xl sm:text-5xl font-black text-amber-400">{user?.creditBalance ?? 0}</span>
              <span className="text-base font-bold text-slate-300">Credits</span>
            </div>
          </div>

        </div>

        {/* QUICK LEDGER STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase">Total Credits Earned</p>
              <p className="text-lg font-extrabold text-white">+{totalEarned} Credits</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase">Total Credits Spent</p>
              <p className="text-lg font-extrabold text-white">-{totalSpent} Credits</p>
            </div>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase">Ledger Integrity</p>
              <p className="text-lg font-extrabold text-teal-300">100% Atomic</p>
            </div>
          </div>
        </div>

      </div>

      {/* TRANSACTION TABLE & FILTERS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Activity className="w-5 h-5 text-brand-500" />
              <span>Full Transaction History</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditable record of all skill swaps completed under your account.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
            {['all', 'earned', 'spent'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  filterType === type
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No transactions found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Counterparty Member</th>
                  <th className="py-3 px-4">Skill Exchange Topic</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredTxns.map((txn) => {
                  const isEarned = txn.toUser?._id === user?._id;
                  const counterParty = isEarned ? txn.fromUser : txn.toUser;

                  return (
                    <tr key={txn._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] ${
                          isEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isEarned ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          <span>{isEarned ? 'EARNED' : 'SPENT'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <img
                            src={counterParty?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                            className="w-7 h-7 rounded-full object-cover"
                            alt=""
                          />
                          <span className="font-bold text-slate-900">{counterParty?.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {txn.requestId?.skillName || 'Community Skill Swap'}
                      </td>

                      <td className={`py-3.5 px-4 font-extrabold text-sm ${
                        isEarned ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isEarned ? '+' : '-'}{txn.creditsExchanged} Cr
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                          {txn.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(txn.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default WalletPage;
