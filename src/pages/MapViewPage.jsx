import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Sliders, Search, Star, Sparkles, Filter, AlertCircle, ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RequestModal from '../components/RequestModal';
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

// City fallback centers for manual selection
const fallbackCities = [
  { name: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { name: 'Mumbai', lat: 19.0596, lng: 72.8295 },
  { name: 'New Delhi', lat: 28.6304, lng: 77.2177 },
  { name: 'Kolkata', lat: 22.5539, lng: 88.3518 }
];

// Helper component to re-center map view dynamically
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

// Custom Leaflet DivIcon for User Pin
const createUserPin = () => {
  return L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs animate-bounce">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

// Custom Leaflet DivIcon for Skill Provider Pins
const createProviderPin = (rating) => {
  return L.divIcon({
    className: 'custom-provider-pin',
    html: `
      <div class="relative group cursor-pointer">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs hover:scale-110 transition-transform">
          ⚡
        </div>
        <div class="absolute -top-2 -right-1 bg-amber-400 text-slate-900 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full border border-white shadow-xs">
          ${rating || 5.0}★
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

const MapViewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // User position & map state
  const [userLocation, setUserLocation] = useState([12.9784, 77.6408]); // Default Bengaluru
  const [locationStatus, setLocationStatus] = useState('Detecting browser location...');
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Filters state
  const [radiusKm, setRadiusKm] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Providers & Map data
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeProvider, setActiveProvider] = useState(null);

  // Detect Geolocation
  const requestGeolocation = () => {
    setLocationStatus('Locating...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setLocationStatus('Centered on your location');
          setPermissionDenied(false);
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setPermissionDenied(true);
          setLocationStatus('Permission denied. Defaulted to Bengaluru (Select city below)');
        },
        { timeout: 10000 }
      );
    } else {
      setPermissionDenied(true);
      setLocationStatus('Browser geolocation not supported');
    }
  };

  useEffect(() => {
    requestGeolocation();
  }, []);

  // Fetch Nearby Users whenever location, radius, category, or search changes
  const fetchNearby = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('lat', userLocation[0]);
      params.append('lng', userLocation[1]);
      params.append('radius', radiusKm);
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await API.get(`/users/nearby?${params.toString()}`);
      if (res.data.success) {
        setNearbyUsers(res.data.data);
      }
    } catch (err) {
      console.error('Fetch nearby users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, [userLocation, radiusKm, selectedCategory, searchQuery]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* HEADER & CONTROLS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-bold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Feature 2: Interactive Geolocation Map</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Nearby Skills Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Explore community members offering skills within your neighborhood radius.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/browse')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to List View</span>
            </button>
            <button
              onClick={requestGeolocation}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition shadow-md flex items-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>My Location</span>
            </button>
          </div>
        </div>

        {/* Status / Permission Notice */}
        {permissionDenied && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Geolocation permission was denied. Pick a fallback city or adjust coordinates below:
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {fallbackCities.map(city => (
                <button
                  key={city.name}
                  onClick={() => setUserLocation([city.lat, city.lng])}
                  className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 font-bold text-xs transition"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MAP FILTERS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-100">
          
          {/* Radius Slider */}
          <div className="md:col-span-4 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-500" />
                <span>Search Radius</span>
              </span>
              <span className="text-brand-600 font-extrabold">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          {/* Search Query */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill (e.g. Guitar, React, Yoga)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Selector */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* MAP CONTAINER & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEAFLET MAP VIEW */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-3 border border-slate-200/80 shadow-md relative min-h-[500px] h-[600px] overflow-hidden">
          
          <MapContainer
            center={userLocation}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full rounded-2xl z-0"
          >
            <RecenterMap center={userLocation} />

            {/* OpenStreetMap Free Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Radius Circle */}
            <Circle
              center={userLocation}
              radius={radiusKm * 1000}
              pathOptions={{ fillColor: '#3B82F6', fillOpacity: 0.1, color: '#2563EB', weight: 1.5, dashArray: '4, 4' }}
            />

            {/* Current User Marker */}
            <Marker position={userLocation} icon={createUserPin()}>
              <Popup>
                <div className="p-1 text-center space-y-1">
                  <span className="font-extrabold text-xs text-blue-600">Your Location</span>
                  <p className="text-[11px] text-slate-500">Center of radius search ({radiusKm} km)</p>
                </div>
              </Popup>
            </Marker>

            {/* Nearby Skill Provider Pins */}
            {nearbyUsers.map((provider) => {
              const lat = provider.location?.lat;
              const lng = provider.location?.lng;
              if (!lat || !lng) return null;

              return (
                <Marker
                  key={provider._id}
                  position={[lat, lng]}
                  icon={createProviderPin(provider.rating)}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 space-y-3 max-w-xs">
                      
                      {/* Provider info */}
                      <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-2">
                        <img
                          src={provider.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={provider.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">{provider.name}</h4>
                          <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{provider.rating || 5.0} ({provider.totalReviews || 0})</span>
                          </div>
                          {provider.distanceKm !== undefined && (
                            <span className="text-[10px] font-extrabold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                              {provider.distanceKm} km away
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Skills Offered List */}
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Offered Skills:</p>
                        {provider.skillsOffered && provider.skillsOffered.map((sk, i) => (
                          <div key={i} className="bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-0.5">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                              <span>{sk.skillName}</span>
                              <span className="text-amber-600">{sk.hourlyCreditRate} cr/hr</span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{sk.description}</p>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-1.5 pt-1">
                        <button
                          onClick={() => handleRequestClick(provider.skillsOffered[0], provider)}
                          className="flex-1 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-lg transition text-center shadow-xs"
                        >
                          Send Request
                        </button>
                        <button
                          onClick={() => navigate(`/profile?id=${provider._id}`)}
                          className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
                        >
                          Profile
                        </button>
                      </div>

                    </div>
                  </Popup>
                </Marker>
              );
            })}

          </MapContainer>
        </div>

        {/* SIDEBAR CARDS LIST */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">
              Providers in Range ({nearbyUsers.length})
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Within {radiusKm} km
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Querying nearby providers...</p>
            </div>
          ) : nearbyUsers.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">No skill providers within {radiusKm} km</h4>
              <p className="text-xs text-slate-500">
                Try increasing the radius slider or changing category filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {nearbyUsers.map(member => (
                <div
                  key={member._id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-brand-300 hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={member.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{member.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center">
                          <MapPin className="w-3 h-3 text-slate-400 mr-1" />
                          {member.location?.address || 'Local Community'}
                        </p>
                      </div>
                    </div>

                    {member.distanceKm !== undefined && (
                      <span className="text-xs font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {member.distanceKm} km
                      </span>
                    )}
                  </div>

                  {member.skillsOffered && member.skillsOffered.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-slate-800 flex justify-between">
                        <span>{member.skillsOffered[0].skillName}</span>
                        <span className="text-brand-600 font-extrabold">{member.skillsOffered[0].hourlyCreditRate} Cr/hr</span>
                      </div>
                      <p className="text-slate-500 text-[11px] line-clamp-1">{member.skillsOffered[0].description}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleRequestClick(member.skillsOffered[0], member)}
                      className="flex-1 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl transition text-center"
                    >
                      Send Request
                    </button>
                    <button
                      onClick={() => navigate(`/profile?id=${member._id}`)}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* REQUEST MODAL */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skill={activeSkill}
        provider={activeProvider}
        onRequestSuccess={() => navigate('/requests')}
      />

    </div>
  );
};

export default MapViewPage;
