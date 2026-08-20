import React from 'react';
import { Star, MapPin, Clock, ArrowRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryColors = {
  'Tutoring & Education': 'bg-blue-50 text-blue-700 border-blue-200',
  'Cooking & Baking': 'bg-orange-50 text-orange-700 border-orange-200',
  'Home Repairs & Crafts': 'bg-amber-50 text-amber-800 border-amber-200',
  'Tech & Design': 'bg-teal-50 text-teal-700 border-teal-200',
  'Fitness & Wellness': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Gardening & Outdoors': 'bg-green-50 text-green-700 border-green-200',
  'Arts & Music': 'bg-purple-50 text-purple-700 border-purple-200',
  'Language Exchange': 'bg-rose-50 text-rose-700 border-rose-200',
  'Caregiving & Assistance': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Other': 'bg-slate-50 text-slate-700 border-slate-200',
};

const SkillCard = ({ skill, provider, onRequestClick, onViewProfile }) => {
  const categoryStyle = categoryColors[skill.category] || categoryColors['Other'];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
    >
      <div className="p-5 space-y-4">
        
        {/* Header: Provider Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewProfile && onViewProfile(provider._id)}>
            <img
              src={provider.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
              alt={provider.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-brand-100"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm hover:text-brand-600 transition flex items-center space-x-1">
                <span>{provider.name}</span>
              </h4>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span className="flex items-center space-x-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[120px]">
                    {typeof provider?.location === 'object' ? (provider.location?.address || 'Community Member') : (provider?.location || 'Community Member')}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold text-amber-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{provider.rating ? provider.rating.toFixed(1) : '5.0'}</span>
            <span className="text-slate-400 font-normal">({provider.totalReviews || 0})</span>
          </div>
        </div>

        {/* Category Badge */}
        <div>
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${categoryStyle}`}>
            {skill.category}
          </span>
        </div>

        {/* Skill Details */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
            {skill.skillName}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {skill.description}
          </p>
        </div>

      </div>

      {/* Footer: Rate & Action Button */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs font-bold text-slate-700">
          <Clock className="w-4 h-4 text-brand-500" />
          <span>{skill.hourlyCreditRate || 1} Credit / Hr</span>
        </div>

        <button
          onClick={() => onRequestClick(skill, provider)}
          className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center space-x-1"
        >
          <span>Request Swap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default SkillCard;
