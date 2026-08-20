import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Star, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Clock, 
  Award, 
  MessageSquare,
  Sparkles,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const avatarPresets = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
];

const ProfilePage = () => {
  const { user: currentUser, setUser: setCurrentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const publicUserId = searchParams.get('id');

  const isSelf = !publicUserId || publicUserId === currentUser?._id;

  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');

  // Skill Adding State
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    category: 'Tutoring & Education',
    description: '',
    hourlyCreditRate: 1
  });

  // Wanted Skill Adding State
  const [newWantedTag, setNewWantedTag] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const targetId = isSelf ? currentUser._id : publicUserId;
      const [userRes, reviewRes] = await Promise.all([
        API.get(`/users/${targetId}`),
        API.get(`/reviews/user/${targetId}`)
      ]);

      if (userRes.data.success) {
        setProfileData(userRes.data.data);
        setBio(userRes.data.data.bio || '');
        const locVal = userRes.data.data.location;
        setLocation(typeof locVal === 'object' ? (locVal?.address || '') : (locVal || ''));
        setAvatar(userRes.data.data.avatar || '');
      }

      if (reviewRes.data.success) {
        setReviews(reviewRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [publicUserId, currentUser]);

  const handleSaveProfile = async () => {
    try {
      const res = await API.put('/users/profile', { bio, location, avatar });
      if (res.data.success) {
        setProfileData(res.data.data);
        if (isSelf) setCurrentUser(res.data.data);
        setIsEditingBio(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skillName || !newSkill.description) {
      alert('Please fill skill title and description.');
      return;
    }

    try {
      const updatedSkills = [...(profileData.skillsOffered || []), newSkill];
      const res = await API.put('/users/skills', { skillsOffered: updatedSkills });
      if (res.data.success) {
        setProfileData(res.data.data);
        if (isSelf) setCurrentUser(res.data.data);
        setShowAddSkillForm(false);
        setNewSkill({ skillName: '', category: 'Tutoring & Education', description: '', hourlyCreditRate: 1 });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this skill offering?')) return;
    try {
      const updatedSkills = profileData.skillsOffered.filter(s => s._id !== skillId);
      const res = await API.put('/users/skills', { skillsOffered: updatedSkills });
      if (res.data.success) {
        setProfileData(res.data.data);
        if (isSelf) setCurrentUser(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove skill.');
    }
  };

  const handleAddWantedTag = async (e) => {
    e.preventDefault();
    if (!newWantedTag.trim()) return;
    try {
      const updatedWanted = [...(profileData.skillsWanted || []), newWantedTag.trim()];
      const res = await API.put('/users/skills', { skillsWanted: updatedWanted });
      if (res.data.success) {
        setProfileData(res.data.data);
        if (isSelf) setCurrentUser(res.data.data);
        setNewWantedTag('');
      }
    } catch (err) {
      alert('Failed to add wanted skill.');
    }
  };

  const handleDeleteWantedTag = async (tagToDelete) => {
    try {
      const updatedWanted = profileData.skillsWanted.filter(t => t !== tagToDelete);
      const res = await API.put('/users/skills', { skillsWanted: updatedWanted });
      if (res.data.success) {
        setProfileData(res.data.data);
        if (isSelf) setCurrentUser(res.data.data);
      }
    } catch (err) {
      alert('Failed to remove wanted tag.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center py-20">User profile not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* HEADER PROFILE CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-5">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={profileData.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-brand-100 shadow-md"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {profileData.name}
              </h1>
              <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>
                  {typeof profileData.location === 'object' ? (profileData.location?.address || 'Local Community Member') : (profileData.location || 'Local Community Member')}
                </span>
              </p>

              {/* Rating & Balance badges */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{profileData.rating ? profileData.rating.toFixed(1) : '5.0'}</span>
                  <span className="text-slate-400 font-normal">({profileData.totalReviews || 0} reviews)</span>
                </div>

                <div className="flex items-center space-x-1 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold text-orange-800">
                  <span>⚡ {profileData.creditBalance} Skill Credits</span>
                </div>
              </div>
            </div>
          </div>

          {isSelf && (
            <button
              onClick={() => setIsEditingBio(!isEditingBio)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingBio ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          )}
        </div>

        {/* BIO & EDIT MODE */}
        {isEditingBio ? (
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Update Your Details</h4>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Bio</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600">Select Avatar Preset</label>
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {avatarPresets.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    onClick={() => setAvatar(preset)}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition ${
                      avatar === preset ? 'border-brand-500 scale-110' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {profileData.bio || 'No bio provided yet.'}
          </p>
        )}

      </div>

      {/* SKILLS OFFERED & WANTED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SKILLS OFFERED SECTION */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <span>Skills Offered ({profileData.skillsOffered?.length || 0})</span>
            </h2>

            {isSelf && (
              <button
                onClick={() => setShowAddSkillForm(!showAddSkillForm)}
                className="px-3.5 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-bold transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            )}
          </div>

          {/* ADD SKILL FORM */}
          {showAddSkillForm && (
            <form onSubmit={handleAddSkill} className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 uppercase">Offer a New Skill to Community</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Skill Title (e.g. Sourdough Baking)"
                  value={newSkill.skillName}
                  onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs font-medium"
                />
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs font-medium"
                >
                  <option value="Tutoring & Education">Tutoring & Education</option>
                  <option value="Cooking & Baking">Cooking & Baking</option>
                  <option value="Home Repairs & Crafts">Home Repairs & Crafts</option>
                  <option value="Tech & Design">Tech & Design</option>
                  <option value="Fitness & Wellness">Fitness & Wellness</option>
                  <option value="Gardening & Outdoors">Gardening & Outdoors</option>
                  <option value="Arts & Music">Arts & Music</option>
                  <option value="Language Exchange">Language Exchange</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <textarea
                rows="2"
                required
                placeholder="Detailed description of what you will provide during the swap..."
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-amber-200 text-xs font-medium"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillForm(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 shadow-xs"
                >
                  Add Skill Offering
                </button>
              </div>
            </form>
          )}

          {/* LIST OF OFFERED SKILLS */}
          {profileData.skillsOffered?.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 text-xs text-slate-500">
              No skills currently listed. Add a skill to start earning credits!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileData.skillsOffered?.map((s) => (
                <div key={s._id || s.skillName} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 relative">
                  {isSelf && (
                    <button
                      onClick={() => handleDeleteSkill(s._id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition"
                      title="Delete skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                    {s.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{s.skillName}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-500" />
                      <span>{s.hourlyCreditRate || 1} Credit / Hour</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* SKILLS WANTED & REVIEWS SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SKILLS WANTED */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Skills Wanted</span>
            </h3>

            {isSelf && (
              <form onSubmit={handleAddWantedTag} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. French, Plumbing"
                  value={newWantedTag}
                  onChange={(e) => setNewWantedTag(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
                <button type="submit" className="p-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {profileData.skillsWanted?.length === 0 ? (
                <p className="text-xs text-slate-400">No requested skills listed.</p>
              ) : (
                profileData.skillsWanted?.map((tag) => (
                  <span key={tag} className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-900">
                    <span>{tag}</span>
                    {isSelf && (
                      <button onClick={() => handleDeleteWantedTag(tag)} className="hover:text-rose-600 ml-1">
                        ×
                      </button>
                    )}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>Member Reviews</span>
              <span className="text-xs font-normal text-slate-500">{reviews.length} Total</span>
            </h3>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No reviews received yet.</p>
            ) : (
              <div className="space-y-3.5">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={rev.reviewerId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} className="w-6 h-6 rounded-full object-cover" alt="" />
                        <span className="font-bold text-slate-900">{rev.reviewerId?.name}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1 font-extrabold text-amber-900">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-normal">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
