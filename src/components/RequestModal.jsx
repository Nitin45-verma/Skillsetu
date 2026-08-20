import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MessageSquare, Calendar, AlertTriangle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const RequestModal = ({ isOpen, onClose, skill, provider, onRequestSuccess }) => {
  const { user } = useAuth();
  const [proposedHours, setProposedHours] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !skill || !provider) return null;

  const userBalance = user?.creditBalance ?? 0;
  const isBalanceLow = userBalance < proposedHours;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a message explaining what help you need.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await API.post('/requests', {
        providerId: provider._id,
        skillName: skill.skillName,
        skillCategory: skill.category,
        message,
        proposedHours: Number(proposedHours),
        scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date()
      });

      if (res.data.success) {
        onRequestSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit skill request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-100">Send Skill Request</span>
              <h3 className="text-xl font-extrabold mt-0.5">{skill.skillName}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Provider Info Card */}
            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={provider.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={provider.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-semibold">Service Provider</p>
                <h4 className="text-sm font-bold text-slate-900">{provider.name}</h4>
                <p className="text-xs text-slate-500">
                  {typeof provider?.location === 'object' ? (provider.location?.address || 'Local Member') : (provider?.location || 'Local Member')}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Proposed Hours (Credits) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Proposed Hours (1 Hr = 1 Credit)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={proposedHours}
                  onChange={(e) => setProposedHours(e.target.value)}
                  className="w-28 px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-slate-900 text-base focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
                <div className="text-xs text-slate-600">
                  <p className="font-bold text-slate-800">Total: {proposedHours} Skill Credits</p>
                  <p className="text-slate-500">Your Current Balance: <span className="font-bold text-amber-700">{userBalance} Credits</span></p>
                </div>
              </div>
              {isBalanceLow && (
                <p className="text-xs text-amber-700 font-medium pt-1">
                  ⚠️ Note: Your current balance is lower than proposed hours. You can earn credits by offering help!
                </p>
              )}
            </div>

            {/* Scheduled Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preferred Schedule Date & Time
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Message to {provider.name.split(' ')[0]}
              </label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain what specific help you need, your goals, and location details..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RequestModal;
