import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Wifi, 
  WifiOff,
  Volume2,
  VolumeX,
  Radio,
  Clock,
  Download,
  Share2,
  Bookmark,
  Settings,
  Rewind,
  FastForward
} from 'lucide-react';

interface GameState {
  status?: 'live' | 'paused' | 'ended' | 'replay';
  period?: number;
  timeRemaining?: string;
  currentTime?: string;
  duration?: string;
}

interface ControlPanelProps {
  gameState: GameState;
  isConnected: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  gameState, 
  isConnected 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3600); // 60 minutes in seconds
  const [isBookmarked, setIsBookmarked] = useState(false);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = (currentTime / duration) * 100;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
    if (newTime >= duration - 30) {
      setIsLive(true);
    } else {
      setIsLive(false);
    }
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 15));
    setIsLive(false);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 15);
    setCurrentTime(newTime);
    if (newTime >= duration - 30) {
      setIsLive(true);
    }
  };

  const handleGoLive = () => {
    setCurrentTime(duration);
    setIsLive(true);
  };

  const handleSpeedChange = () => {
    const currentIndex = speedOptions.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setPlaybackSpeed(speedOptions[nextIndex]);
  };

  // Simulate time progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isLive) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(duration, prev + 1));
        setDuration(prev => prev + 1); // Live content keeps growing
      }, 1000 / playbackSpeed);
    } else if (isPlaying && !isLive) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = Math.min(duration, prev + 1);
          if (newTime >= duration - 30) {
            setIsLive(true);
          }
          return newTime;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isLive, playbackSpeed, duration]);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          {isLive ? (
            <>
              <Radio className="h-5 w-5 text-red-500" />
              <span>Live Commentary</span>
            </>
          ) : (
            <>
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Replay Mode</span>
            </>
          )}
        </h3>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Live Indicator */}
      {isLive && (
        <motion.div 
          className="flex items-center justify-center mb-4 p-2 bg-red-500/20 rounded-lg border border-red-500/30"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <span className="text-red-400 text-sm font-medium">LIVE</span>
          <span className="text-gray-400 text-xs ml-2">• {Math.floor(Math.random() * 50000 + 10000)} listeners</span>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{isLive ? 'LIVE' : formatTime(duration)}</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progress}%, #374151 ${progress}%, #374151 100%)`
            }}
          />
          {/* Live edge indicator */}
          {!isLive && (
            <div 
              className="absolute top-0 w-1 h-2 bg-red-500 rounded-full transform -translate-x-1/2"
              style={{ left: '100%' }}
            />
          )}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {/* Skip Back 15s */}
        <motion.button
          onClick={handleSkipBack}
          className="p-3 hover:bg-white/20 rounded-full transition-colors relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Rewind className="h-5 w-5 text-white" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">15</span>
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={handlePlayPause}
          className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white ml-1" />
          )}
        </motion.button>

        {/* Skip Forward 15s */}
        <motion.button
          onClick={handleSkipForward}
          className="p-3 hover:bg-white/20 rounded-full transition-colors relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FastForward className="h-5 w-5 text-white" />
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">15</span>
        </motion.button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
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
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-8">{isMuted ? 0 : volume}%</span>
        </div>

        {/* Playback Speed */}
        <motion.button
          onClick={handleSpeedChange}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {playbackSpeed}x
        </motion.button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Go Live Button (only show when not live) */}
        {!isLive && (
          <motion.button
            onClick={handleGoLive}
            className="col-span-2 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Radio className="h-4 w-4" />
            <span>Go Live</span>
          </motion.button>
        )}
        
        {/* Bookmark */}
        <motion.button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
            isBookmarked 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          <span>Save</span>
        </motion.button>
        
        {/* Share */}
        <motion.button
          className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </motion.button>
      </div>

      {/* Game Information */}
      <div className="pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Game Information
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Period:</span>
            <span className="text-white">{gameState.period || 1}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Time Remaining:</span>
            <span className="text-white">{gameState.timeRemaining || '20:00'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Mode:</span>
            <span className={`font-medium ${isLive ? 'text-red-400' : 'text-blue-400'}`}>
              {isLive ? 'Live' : 'Replay'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Quality:</span>
            <span className="text-green-400">HD</span>
          </div>
        </div>
      </div>

      {/* Download for Offline (only for replays) */}
      {!isLive && (
        <motion.button
          className="w-full mt-4 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="h-4 w-4" />
          <span>Download for Offline</span>
        </motion.button>
      )}
    </div>
  );
};

export default ControlPanel;