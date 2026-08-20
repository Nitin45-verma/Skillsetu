import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, Info } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const NotificationToast = () => {
  const { notifications, removeNotification } = useSocket();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto bg-white rounded-2xl shadow-xl border border-slate-150 p-4 flex items-start space-x-3 text-slate-800"
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {n.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-sm">
              <h4 className="font-bold text-slate-900 leading-tight">{n.title}</h4>
              <p className="text-slate-600 mt-1">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-slate-600 p-1 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
