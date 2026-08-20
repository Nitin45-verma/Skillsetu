import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, SlidersHorizontal, AlertCircle, Sparkles, LayoutGrid, Map as MapIcon } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import RequestModal from '../components/RequestModal';
import AIMatchmaker from '../components/AIMatchmaker';
import { useAuth } from '../context/AuthContext';
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

const BrowseSkillsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [sortOption, setSortOption] = useState('rating');

  // Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (locationQuery) params.append('location', locationQuery);
      if (sortOption) params.append('sort', sortOption);

      const res = await API.get(`/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users/skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory, searchQuery, locationQuery, sortOption]);

  const handleRequestClick = (skill, provider) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user._id === provider._id) {
      alert('You cannot send a skill request to yourself.');
      return;
    }
    setActiveSkill(skill);
    setActiveProvider(provider);
    setIsModalOpen(true);
  };

  const handleRequestSuccess = () => {
    navigate('/requests');
  };

  // Flatten all skills offered across returned users
  const skillFeed = [];
  users.forEach(member => {
    if (member.skillsOffered && member.skillsOffered.length > 0) {
      member.skillsOffered.forEach(skill => {
        if (selectedCategory === 'All' || skill.category === selectedCategory) {
          skillFeed.push({ skill, provider: member });
        }
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white">
            <Sparkles className="w-4 h-4" />
            <span>Community Time-Bank Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Browse Offered Skills & Services
          </h1>
          <p className="text-amber-100 text-sm leading-relaxed">
            Find neighbors willing to teach, fix, cook, or design in exchange for time credits. 1 hour of work = 1 credit.
          </p>
        </div>

        {/* VIEW MODE TOGGLE BUTTONS */}
        <div className="flex items-center bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
          <button
            onClick={() => navigate('/browse')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 shadow-md transition"
          >
            <LayoutGrid className="w-4 h-4 text-brand-600" />
            <span>Grid View</span>
          </button>
          <button
            onClick={() => navigate('/map')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition"
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* FEATURE 1: AI SKILL MATCHMAKER COMPONENT */}
      <AIMatchmaker
        onSelectProvider={(providerId) => navigate(`/profile?id=${providerId}`)}
        onRequestClick={handleRequestClick}
      />

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill name, description, or member name (e.g. React, Guitar, Sourdough)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Location Search */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Filter location (e.g. Bengaluru, Mumbai)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          {/* Sorting */}
          <div className="md:col-span-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500"
            >
              <option value="rating">Sort by: Highest Rating ⭐</option>
              <option value="newest">Sort by: Newest Members</option>
              <option value="credits_desc">Sort by: Credits Balance High</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* SKILLS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900">
            Community Skills Directory ({skillFeed.length})
          </h2>
          <button
            onClick={() => navigate('/map')}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Switch to Map View</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Searching community skill index...</p>
          </div>
        ) : skillFeed.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No skills found matching your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try broadening your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setLocationQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-brand-50 text-brand-600 font-bold text-xs hover:bg-brand-100 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillFeed.map(({ skill, provider }, index) => (
              <SkillCard
                key={`${provider._id}-${index}`}
                skill={skill}
                provider={provider}
                onRequestClick={handleRequestClick}
                onViewProfile={(providerId) => navigate(`/profile?id=${providerId}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* REQUEST MODAL */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skill={activeSkill}
        provider={activeProvider}
        onRequestSuccess={handleRequestSuccess}
      />

    </div>
  );
};

export default BrowseSkillsPage;
