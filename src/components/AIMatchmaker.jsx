import React, { useState } from 'react';
import { Sparkles, MapPin, Search, Star, Clock, AlertCircle, ArrowRight, CheckCircle2, User, Loader2 } from 'lucide-react';
import API from '../services/api';

const categories = [
  'All',
  'Tutoring & Education',
  'Cooking & Baking',
  'Home Repairs & Crafts',
  'Tech & Design',
  'Fitness & Wellness',
  'Gardening & Outdoors',
  'Arts & Music',
  'Language Exchange',
  'Caregiving & Assistance',
  'Other'
];

const AIMatchmaker = ({ onSelectProvider, onRequestClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('Indiranagar, Bengaluru');
  const [userCoords, setUserCoords] = useState({ lat: 12.9784, lng: 77.6408 });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isFallback, setIsFallback] = useState(false);

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords({ lat, lng });
          setLocationText(`Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`);
        },
        (err) => {
          console.warn('Geolocation permission denied or unavailable:', err.message);
        }
      );
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter a short description of what skill or help you need.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResults(null);

      const payload = {
        category,
        description,
        location: userCoords ? { lat: userCoords.lat, lng: userCoords.lng, address: locationText } : locationText
      };

      const res = await API.post('/match/suggest', payload);
      if (res.data.success) {
        setResults(res.data.suggestions || []);
        setIsFallback(res.data.fallback || false);
      } else {
        setError(res.data.message || 'Failed to generate matches.');
      }
    } catch (err) {
      console.error('Match API Error:', err);
      setError(err.response?.data?.message || 'Error communicating with AI Matchmaker. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-700/40 relative overflow-hidden my-6">
      
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-brand-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Feature 1: AI Matchmaker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI-Powered Skill Matchmaker
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Describe what you want to learn or fix. Our AI analyzes community member ratings, location proximity, and skill offerings to rank your best matches.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="self-start sm:self-center px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 font-bold text-xs text-white transition shadow-lg hover:scale-105 flex items-center space-x-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isOpen ? 'Close Matchmaker' : 'Find Best Match'}</span>
          </button>
        </div>

        {/* Input Form Drawer */}
        {isOpen && (
          <form onSubmit={handleMatch} className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-indigo-700/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Category */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Category Needed
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="md:col-span-8 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Your Location / Region
                  </label>
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Use My Geolocation</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru or Bandra, Mumbai"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Requirement Description */}
              <div className="md:col-span-12 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  What skill or assistance do you need?
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., I need a patient mentor to guide me through React pair programming and debug component state, or someone to help bake sourdough bread."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

            </div>

            {error && (
              <div className="flex items-center space-x-2 bg-rose-500/20 border border-rose-500/40 p-3 rounded-xl text-rose-300 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-brand-500 hover:from-amber-400 hover:to-brand-400 font-extrabold text-sm text-white shadow-lg transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Finding your best match... ✨</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Suggestions</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Loading State Overlay */}
        {loading && (
          <div className="bg-slate-900/90 rounded-2xl p-10 text-center border border-indigo-500/30 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-amber-300">Finding your best match... ✨</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Analyzing candidate skill descriptions, rating histories, and location distances...
            </p>
          </div>
        )}

        {/* AI Results Section */}
        {results && !loading && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-extrabold text-white">
                  Top AI Recommended Providers ({results.length})
                </h3>
              </div>
              {isFallback && (
                <span className="text-[11px] bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-semibold">
                  ⚡ Smart Heuristic Fallback
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="bg-slate-800/70 rounded-2xl p-6 text-center text-slate-400 text-sm">
                No matching providers found for this category or region. Try broadening your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((match, idx) => {
                  const { user, matchedSkill, rank, matchScore, reasonText, distanceKm } = match;
                  return (
                    <div
                      key={user._id || idx}
                      className="bg-slate-800/90 border border-slate-700/80 hover:border-brand-400/60 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition hover:shadow-xl relative overflow-hidden group"
                    >
                      {/* Rank Badge */}
                      <div className="flex items-center justify-between">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                          #{rank} Match
                        </span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {matchScore}% Match
                        </span>
                      </div>

                      {/* Provider Header */}
                      <div className="flex items-start space-x-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={user.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500/40"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-base truncate">{user.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-slate-300 mt-0.5">
                            <span className="flex items-center text-amber-400 font-extrabold">
                              <Star className="w-3.5 h-3.5 fill-current mr-1" />
                              {user.rating || 5.0}
                            </span>
                            <span>({user.totalReviews || 0} reviews)</span>
                          </div>
                          
                          {/* Distance Tag */}
                          <div className="flex items-center space-x-1 text-[11px] text-brand-300 mt-1">
                            <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
                            <span className="truncate">{user.location?.address || 'Local'}</span>
                            {distanceKm !== null && (
                              <span className="font-bold text-amber-300 ml-1">
                                • {distanceKm} km away
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Matched Skill Details */}
                      {matchedSkill && (
                        <div className="bg-slate-900/80 p-3 rounded-xl space-y-1 border border-slate-700/50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-300 truncate">{matchedSkill.skillName}</span>
                            <span className="text-[10px] font-bold bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700/40">
                              {matchedSkill.hourlyCreditRate || 1} Credit/hr
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {matchedSkill.description}
                          </p>
                        </div>
                      )}

                      {/* AI Reason Badge */}
                      <div className="bg-gradient-to-r from-brand-950/80 to-indigo-950/80 border border-brand-500/30 p-2.5 rounded-xl flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-brand-200 font-medium leading-tight">
                          <span className="font-bold text-amber-300">AI Reason: </span>
                          {reasonText}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center space-x-2">
                        <button
                          onClick={() => onRequestClick(matchedSkill || user.skillsOffered[0], user)}
                          className="flex-1 py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-400 font-bold text-xs text-white transition text-center shadow-md"
                        >
                          Send Request
                        </button>
                        <button
                          onClick={() => onSelectProvider && onSelectProvider(user._id)}
                          className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-xs text-slate-200 transition"
                        >
                          View Profile
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AIMatchmaker;
