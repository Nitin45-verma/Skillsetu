import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Star, 
  CheckCheck, 
  ArrowRight,
  Filter,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';
import API from '../services/api';

const statusBadges = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  accepted: 'bg-teal-50 text-teal-700 border-teal-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
};

const RequestsPage = () => {
  const { user, refreshUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [tab, setTab] = useState('received'); // 'received' | 'sent'
  const [statusFilter, setStatusFilter] = useState('all');

  // Review Modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedReqForReview, setSelectedReqForReview] = useState(null);
  const [selectedReviewee, setSelectedReviewee] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/requests/my');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await API.patch(`/requests/${id}/status`, { status });
      if (res.data.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request status.');
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await API.post(`/requests/${id}/complete`);
      if (res.data.success) {
        alert(res.data.message);
        fetchRequests();
        refreshUser();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark completion.');
    }
  };

  const openReviewModal = (req, reviewee) => {
    setSelectedReqForReview(req);
    setSelectedReviewee(reviewee);
    setIsReviewOpen(true);
  };

  const filteredRequests = requests.filter((r) => {
    const isSent = r.requesterId?._id === user?._id;
    const isReceived = r.providerId?._id === user?._id;

    if (tab === 'sent' && !isSent) return false;
    if (tab === 'received' && !isReceived) return false;

    if (statusFilter !== 'all' && r.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Skill Requests & Swaps
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage incoming requests from neighbors and track your active skill swaps.
          </p>
        </div>

        {/* TABS */}
        <div className="flex items-center space-x-2 bg-slate-200/60 p-1.5 rounded-2xl">
          <button
            onClick={() => setTab('received')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'received'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Incoming Requests ({requests.filter(r => r.providerId?._id === user?._id).length})
          </button>

          <button
            onClick={() => setTab('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'sent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sent Requests ({requests.filter(r => r.requesterId?._id === user?._id).length})
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Filter Status:</span>
        {['all', 'pending', 'accepted', 'completed', 'cancelled', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
              statusFilter === st
                ? 'bg-brand-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* REQUESTS LIST */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No requests found in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse skills offered by others to send a swap request!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isRequester = req.requesterId?._id === user?._id;
            const counterParty = isRequester ? req.providerId : req.requesterId;
            const badgeClass = statusBadges[req.status] || statusBadges.pending;

            const myConfirmed = isRequester ? req.requesterConfirmed : req.providerConfirmed;
            const otherConfirmed = isRequester ? req.providerConfirmed : req.requesterConfirmed;

            return (
              <div
                key={req._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Counterparty & Skill Details */}
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={counterParty?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={counterParty?.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {isRequester ? `Provider: ${counterParty?.name}` : `Requester: ${counterParty?.name}`}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg">{req.skillName}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">"{req.message}"</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1 font-medium">
                      <span>⚡ <strong>{req.proposedHours}</strong> Credits</span>
                      <span>📅 {new Date(req.scheduledTime).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-end space-y-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  
                  {/* Realtime Chat Button */}
                  <Link
                    to={`/chat/${req._id}`}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Open Live Chat</span>
                  </Link>

                  {/* ACTION CONTROLS DEPENDING ON STATUS */}
                  {req.status === 'pending' && (
                    <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                      {!isRequester ? (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'accepted')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'rejected')}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'cancelled')}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  )}

                  {req.status === 'accepted' && (
                    <div className="flex flex-col items-end space-y-2 w-full md:w-auto">
                      <button
                        onClick={() => handleComplete(req._id)}
                        disabled={myConfirmed}
                        className={`w-full md:w-auto px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                          myConfirmed
                            ? 'bg-amber-100 text-amber-800 cursor-default'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                        }`}
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>{myConfirmed ? 'Waiting for Other Party to Confirm' : 'Confirm Work Completed'}</span>
                      </button>

                      {otherConfirmed && !myConfirmed && (
                        <span className="text-[11px] font-bold text-emerald-600 animate-pulse">
                          ✨ Other party confirmed! Click to complete credit transfer.
                        </span>
                      )}
                    </div>
                  )}

                  {req.status === 'completed' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ✓ Credits Transferred
                      </span>
                      <button
                        onClick={() => openReviewModal(req, counterParty)}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center space-x-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Leave Review</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* REVIEW MODAL */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        request={selectedReqForReview}
        reviewee={selectedReviewee}
        onReviewSuccess={() => {
          alert('Review submitted successfully! Thank you for rating your community peer.');
        }}
      />

    </div>
  );
};

export default RequestsPage;
