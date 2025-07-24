import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  Play, Pause, Volume2, VolumeX, Settings, Users, 
  Zap, Maximize2, Minimize2, Share2, Heart, 
  MessageCircle, TrendingUp, Calendar, Clock,
  Gamepad2, Trophy, Target, Activity
} from 'lucide-react';

import GameBoard from './components/GameBoard';
import CommentaryPanel from './components/CommentaryPanel';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import PlayerProfile from './components/PlayerProfile';
import SocialPanel from './components/SocialPanel';
import SettingsModal from './components/SettingsModal';
import GameSchedule from './components/GameSchedule';
import LiveChat from './components/LiveChat';
import PerformanceMetrics from './components/PerformanceMetrics';

import { useGameState } from './hooks/useGameState';
import { useAudioCommentary } from './hooks/useAudioCommentary';
import { useUserPreferences } from './hooks/useUserPreferences';

function App() {
  const { gameState, isConnected, error } = useGameState();
  const { 
    isPlaying, 
    isMuted, 
    volume, 
    togglePlayback, 
    toggleMute, 
    setVolume,
    commentary 
  } = useAudioCommentary();

  const { preferences, updatePreference } = useUserPreferences();
  
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'stats' | 'social' | 'schedule'>('game');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlayback();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          setIsFullscreen(!isFullscreen);
          break;
        case 's':
          setShowSettings(!showSettings);
          break;
        case 'escape':
          setSelectedPlayer(null);
          setShowSettings(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, showSettings, togglePlayback, toggleMute]);

  const tabs = [
    { id: 'game', label: 'Live Game', icon: Gamepad2 },
    { id: 'stats', label: 'Analytics', icon: TrendingUp },
    { id: 'social', label: 'Community', icon: MessageCircle },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      {/* Enhanced Header */}
      <motion.header 
        className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Status */}
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-8 w-8 text-blue-400" />
                <h1 className="text-xl font-bold text-white">NHL Live Commentary</h1>
              </motion.div>
              
              {isConnected && (
                <motion.div 
                  className="flex items-center space-x-2 text-green-400"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live</span>
                  <span className="text-xs text-gray-400">• {Math.floor(Math.random() * 50000 + 10000)} viewers</span>
                </motion.div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-lg p-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Audio Controls */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                <motion.button
                  onClick={togglePlayback}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-white" />
                  ) : (
                    <Play className="h-4 w-4 text-white" />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={toggleMute}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-white" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-white" />
                  )}
                </motion.button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5 text-white" />
                  ) : (
                    <Maximize2 className="h-5 w-5 text-white" />
                  )}
                </motion.button>

                <motion.button
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 className="h-5 w-5 text-white" />
                </motion.button>

                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <motion.div 
            className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Main Game Area */}
              <div className="lg:col-span-3 space-y-6">
                <GameBoard 
                  gameState={gameState}
                  selectedPlayer={selectedPlayer}
                  onPlayerSelect={setSelectedPlayer}
                />
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <CommentaryPanel 
                    commentary={commentary}
                    isPlaying={isPlaying}
                  />
                  <PerformanceMetrics gameState={gameState} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <ControlPanel 
                  gameState={gameState}
                  isConnected={isConnected}
                />
                
                <StatsPanel 
                  gameState={gameState}
                  selectedPlayer={selectedPlayer}
                />

                {selectedPlayer && (
                  <PlayerProfile 
                    playerId={selectedPlayer}
                    gameState={gameState}
                    onClose={() => setSelectedPlayer(null)}
                  />
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PerformanceMetrics gameState={gameState} detailed />
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2">
                <SocialPanel />
              </div>
              <div>
                <LiveChat />
              </div>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GameSchedule />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            preferences={preferences}
            onUpdatePreference={updatePreference}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10 z-40">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
                activeTab === tab.id ? 'text-blue-400' : 'text-gray-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-400 bg-black/20 backdrop-blur-sm rounded-lg p-2 hidden lg:block">
        <div>Space: Play/Pause • M: Mute • F: Fullscreen • S: Settings</div>
      </div>
    </div>
  );
}

export default App;