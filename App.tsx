import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Menu, Heart, List, Home } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  duration: string;
  artist: string;
}

interface Album {
  title: string;
  artist: string;
  cover: string;
  tracks: Track[];
}

const sampleAlbum: Album = {
  title: "Bad guy",
  artist: "Billie Eilish Pirate Baird",
  cover: "/api/placeholder/300/300",
  tracks: [
    { id: 1, title: "Small Talk", duration: "4:29", artist: "Billie Eilish" },
    { id: 2, title: "Boyfriend", duration: "3:38", artist: "Billie Eilish" },
    { id: 3, title: "OMG", duration: "3:17", artist: "Billie Eilish" },
    { id: 4, title: "Les Us Love", duration: "3:02", artist: "Billie Eilish" },
    { id: 5, title: "July", duration: "3:42", artist: "Billie Eilish" },
  ]
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<'player' | 'playlist' | 'favorites'>('player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(25);
  const [currentTime, setCurrentTime] = useState("01:04");
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 0.5;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % sampleAlbum.tracks.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + sampleAlbum.tracks.length) % sampleAlbum.tracks.length);
    setProgress(0);
  };

  const toggleFavorite = (trackId: number) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  // Progress calculations for semi-circle
  const radius = 120;
  const circumference = Math.PI * radius; // Half circle
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Player Screen
  if (currentScreen === 'player') {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto bg-white rounded-[24px] shadow-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <div className="flex space-x-2">
              <button 
                onClick={() => setCurrentScreen('playlist')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <List className="w-6 h-6 text-black" />
              </button>
              <button 
                onClick={() => setCurrentScreen('favorites')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Heart className="w-6 h-6 text-black" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF2D55] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Album Art Container - Rectangle with Semi-circle bottom */}
          <div className="relative px-8 pb-4">
            <div className="relative w-full h-80 mx-auto">
              {/* Main Rectangle Container */}
              <div className="relative w-full h-64 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-t-[24px] overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Album Cover"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Neon accents */}
                <div className="absolute top-8 right-12 w-4 h-4 bg-[#FF0055] rounded-full blur-sm opacity-80" />
                <div className="absolute bottom-8 left-16 w-6 h-6 bg-[#00E0FF] rounded-full blur-sm opacity-60" />
                
                {/* Album Info */}
                <div className="absolute bottom-6 left-6 right-6 text-center">
                  <h2 className="text-white text-2xl font-bold mb-1">{sampleAlbum.title}</h2>
                  <p className="text-white/80 text-base">{sampleAlbum.artist}</p>
                </div>
              </div>

              {/* Semi-circle Progress Container */}
              <div className="relative w-full h-16 bg-white">
                <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-32" viewBox="0 0 280 140">
                  {/* Background semi-circle */}
                  <path
                    d="M 20 140 A 120 120 0 0 1 260 140"
                    fill="none"
                    stroke="#EFEFEF"
                    strokeWidth="3"
                  />
                  {/* Progress semi-circle */}
                  <path
                    d="M 20 140 A 120 120 0 0 1 260 140"
                    fill="none"
                    stroke="#111111"
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Progress knob */}
                  <circle
                    cx={140 + radius * Math.cos(Math.PI - (progress / 100) * Math.PI)}
                    cy={140 + radius * Math.sin(Math.PI - (progress / 100) * Math.PI)}
                    r="6"
                    fill="#111111"
                    className="transition-all duration-300 cursor-pointer"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Time Display */}
          <div className="text-center pb-6">
            <span className="text-3xl font-light text-black">{currentTime}</span>
          </div>

          {/* Controls */}
          <div className="px-8 pb-8">
            <div className="flex items-center justify-center space-x-12">
              <button 
                onClick={prevTrack}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipBack className="w-7 h-7 text-black" />
              </button>
              <button 
                onClick={togglePlay}
                className="p-5 bg-black rounded-full hover:bg-gray-800 transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
              <button 
                onClick={nextTrack}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipForward className="w-7 h-7 text-black" />
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-around p-4 border-t border-gray-100 mt-auto">
            <button 
              onClick={() => setCurrentScreen('player')}
              className={`p-3 rounded-full transition-colors ${
                currentScreen === 'player' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Home className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentScreen('playlist')}
              className={`p-3 rounded-full transition-colors ${
                currentScreen === 'playlist' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <List className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentScreen('favorites')}
              className={`p-3 rounded-full transition-colors relative ${
                currentScreen === 'favorites' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF2D55] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Song List Screen
  if (currentScreen === 'playlist') {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
        <div className="w-full max-w-sm mx-auto bg-white rounded-[24px] shadow-lg overflow-hidden flex flex-col" style={{ aspectRatio: '9/16' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={() => setCurrentScreen('player')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <h1 className="text-xl font-bold text-black">Playlist</h1>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Album Header - Rectangle with Semi-circle bottom */}
          <div className="relative px-8 pb-4">
            <div className="relative w-full h-48 mx-auto">
              {/* Main Rectangle Container */}
              <div className="relative w-full h-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-t-[24px] overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Album Cover"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Album Info */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h2 className="text-white text-lg font-bold mb-1">{sampleAlbum.title}</h2>
                  <p className="text-white/80 text-sm">{sampleAlbum.artist}</p>
                </div>
              </div>

              {/* Semi-circle bottom */}
              <div className="relative w-full h-16 bg-white">
                <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-24" viewBox="0 0 200 100">
                  <path
                    d="M 10 100 A 90 90 0 0 1 190 100"
                    fill="none"
                    stroke="#EFEFEF"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Song List - Scrollable */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="space-y-3">
              {sampleAlbum.tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-[16px] transition-colors cursor-pointer"
                  onClick={() => {
                    setCurrentTrack(index);
                    setCurrentScreen('player');
                  }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-base">{track.title}</h3>
                    <p className="text-[#777777] text-sm">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[#777777] text-sm">{track.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.includes(track.id) 
                            ? 'text-[#FF2D55] fill-current' 
                            : 'text-[#777777]'
                        }`} 
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-around p-4 border-t border-gray-100">
            <button 
              onClick={() => setCurrentScreen('player')}
              className={`p-3 rounded-full transition-colors ${
                currentScreen === 'player' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Home className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentScreen('playlist')}
              className={`p-3 rounded-full transition-colors ${
                currentScreen === 'playlist' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <List className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setCurrentScreen('favorites')}
              className={`p-3 rounded-full transition-colors relative ${
                currentScreen === 'favorites' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
              }`}
            >
              <Heart className="w-6 h-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF2D55] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Favorites Screen
  const favoritesTracks = sampleAlbum.tracks.filter(track => favorites.includes(track.id));
  
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-[24px] shadow-lg overflow-hidden flex flex-col" style={{ aspectRatio: '9/16' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button 
            onClick={() => setCurrentScreen('playlist')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-xl font-bold text-black">Favorites</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Album Header - Rectangle with Semi-circle bottom */}
        <div className="relative px-8 pb-4">
          <div className="relative w-full h-48 mx-auto">
            {/* Main Rectangle Container */}
            <div className="relative w-full h-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-t-[24px] overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Album Cover"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Album Info */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <h2 className="text-white text-lg font-bold mb-1">My Favorites</h2>
                <p className="text-white/80 text-sm">{favorites.length} songs</p>
              </div>
            </div>

            {/* Semi-circle bottom */}
            <div className="relative w-full h-16 bg-white">
              <svg className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-24" viewBox="0 0 200 100">
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100"
                  fill="none"
                  stroke="#EFEFEF"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Favorites List - Scrollable */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          {favoritesTracks.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-[#777777] mx-auto mb-4" />
              <p className="text-[#777777] text-lg">No favorites yet</p>
              <p className="text-[#777777] text-sm mt-2">Tap the heart icon to add songs</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoritesTracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-[16px] transition-colors cursor-pointer"
                  onClick={() => {
                    const originalIndex = sampleAlbum.tracks.findIndex(t => t.id === track.id);
                    setCurrentTrack(originalIndex);
                    setCurrentScreen('player');
                  }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-base">{track.title}</h3>
                    <p className="text-[#777777] text-sm">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-[#777777] text-sm">{track.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Heart className="w-5 h-5 text-[#FF2D55] fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-around p-4 border-t border-gray-100">
          <button 
            onClick={() => setCurrentScreen('player')}
            className={`p-3 rounded-full transition-colors ${
              currentScreen === 'player' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
            }`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentScreen('playlist')}
            className={`p-3 rounded-full transition-colors ${
              currentScreen === 'playlist' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
            }`}
          >
            <List className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setCurrentScreen('favorites')}
            className={`p-3 rounded-full transition-colors relative ${
              currentScreen === 'favorites' ? 'bg-black text-white' : 'text-black hover:bg-gray-100'
            }`}
          >
            <Heart className="w-6 h-6" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF2D55] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;