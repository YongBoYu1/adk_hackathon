import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, TrendingUp, Award, Target, Clock, Zap } from 'lucide-react';

interface PlayerProfileProps {
  playerId: string;
  gameState: any;
  onClose: () => void;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ playerId, gameState, onClose }) => {
  const player = gameState.players?.find((p: any) => p.id === playerId);
  
  if (!player) return null;

  const playerStats = {
    goals: Math.floor(Math.random() * 25 + 5),
    assists: Math.floor(Math.random() * 30 + 10),
    points: 0,
    plusMinus: Math.floor(Math.random() * 20 - 10),
    pim: Math.floor(Math.random() * 50),
    shots: Math.floor(Math.random() * 150 + 50),
    faceoffWins: Math.floor(Math.random() * 60 + 40),
    hits: Math.floor(Math.random() * 100 + 20),
    blocks: Math.floor(Math.random() * 50 + 10),
    timeOnIce: `${Math.floor(Math.random() * 5 + 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  };

  playerStats.points = playerStats.goals + playerStats.assists;

  const recentGames = [
    { opponent: 'BOS', goals: 1, assists: 2, points: 3, result: 'W 4-2' },
    { opponent: 'NYR', goals: 0, assists: 1, points: 1, result: 'L 2-3' },
    { opponent: 'PHI', goals: 2, assists: 0, points: 2, result: 'W 5-1' },
    { opponent: 'PIT', goals: 0, assists: 2, points: 2, result: 'W 3-1' },
    { opponent: 'WSH', goals: 1, assists: 1, points: 2, result: 'L 3-4' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
            player.team === 'home' ? 'bg-blue-600' : 'bg-red-600'
          }`}>
            {player.number}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{player.name}</h3>
            <p className="text-sm text-gray-400">
              {player.team === 'home' ? gameState.homeTeam : gameState.awayTeam}
            </p>
          </div>
        </div>
        <motion.button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-5 w-5 text-white" />
        </motion.button>
      </div>

      {/* Season Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Star className="h-4 w-4 mr-2" />
          Season Statistics
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{playerStats.goals}</div>
            <div className="text-xs text-gray-400">Goals</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{playerStats.assists}</div>
            <div className="text-xs text-gray-400">Assists</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{playerStats.points}</div>
            <div className="text-xs text-gray-400">Points</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-2xl font-bold text-white">{playerStats.plusMinus > 0 ? '+' : ''}{playerStats.plusMinus}</div>
            <div className="text-xs text-gray-400">+/-</div>
          </div>
        </div>
      </div>

      {/* Advanced Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Advanced Metrics
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shots</span>
            <span className="text-white">{playerStats.shots}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shooting %</span>
            <span className="text-white">{((playerStats.goals / playerStats.shots) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Faceoff %</span>
            <span className="text-white">{playerStats.faceoffWins}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Hits</span>
            <span className="text-white">{playerStats.hits}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Blocks</span>
            <span className="text-white">{playerStats.blocks}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">TOI/Game</span>
            <span className="text-white">{playerStats.timeOnIce}</span>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Last 5 Games
        </h4>
        <div className="space-y-2">
          {recentGames.map((game, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white">vs {game.opponent}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  game.result.startsWith('W') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {game.result}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {game.goals}G {game.assists}A ({game.points}P)
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerProfile;