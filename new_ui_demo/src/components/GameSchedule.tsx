import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, TrendingUp, Users, Play } from 'lucide-react';

const GameSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

  const games = [
    {
      id: 1,
      homeTeam: 'Toronto Maple Leafs',
      awayTeam: 'Montreal Canadiens',
      homeScore: 4,
      awayScore: 2,
      status: 'live',
      time: '7:00 PM EST',
      venue: 'Scotiabank Arena',
      period: '2nd',
      timeRemaining: '15:42',
      viewers: 47200,
      featured: true,
    },
    {
      id: 2,
      homeTeam: 'Boston Bruins',
      awayTeam: 'New York Rangers',
      homeScore: null,
      awayScore: null,
      status: 'upcoming',
      time: '8:00 PM EST',
      venue: 'TD Garden',
      viewers: 0,
      featured: false,
    },
    {
      id: 3,
      homeTeam: 'Pittsburgh Penguins',
      awayTeam: 'Philadelphia Flyers',
      homeScore: 3,
      awayScore: 1,
      status: 'final',
      time: '7:00 PM EST',
      venue: 'PPG Paints Arena',
      viewers: 32100,
      featured: false,
    },
    {
      id: 4,
      homeTeam: 'Tampa Bay Lightning',
      awayTeam: 'Florida Panthers',
      homeScore: null,
      awayScore: null,
      status: 'upcoming',
      time: '9:00 PM EST',
      venue: 'Amalie Arena',
      viewers: 0,
      featured: true,
    },
  ];

  const upcomingGames = [
    {
      date: 'Tomorrow',
      games: [
        { home: 'Calgary Flames', away: 'Edmonton Oilers', time: '8:00 PM' },
        { home: 'Vegas Golden Knights', away: 'Los Angeles Kings', time: '10:00 PM' },
      ],
    },
    {
      date: 'Friday',
      games: [
        { home: 'Chicago Blackhawks', away: 'Detroit Red Wings', time: '7:30 PM' },
        { home: 'Colorado Avalanche', away: 'Minnesota Wild', time: '9:00 PM' },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/20';
      case 'final': return 'text-gray-400 bg-gray-400/20';
      case 'upcoming': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Calendar className="h-6 w-6 mr-3" />
          Game Schedule
        </h2>
        
        <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
          {['today', 'week', 'month'].map((mode) => (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Today's Games */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Today's Games</h3>
        
        <div className="space-y-4">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                game.featured 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {game.featured && (
                <div className="absolute top-2 right-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="text-white font-medium">{game.awayTeam}</div>
                    <div className="text-gray-400">@</div>
                    <div className="text-white font-medium">{game.homeTeam}</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{game.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{game.venue}</span>
                    </div>
                    {game.viewers > 0 && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{(game.viewers / 1000).toFixed(1)}K watching</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {game.status === 'live' && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {game.awayScore} - {game.homeScore}
                      </div>
                      <div className="text-xs text-gray-400">
                        {game.period} • {game.timeRemaining}
                      </div>
                    </div>
                  )}
                  
                  {game.status === 'final' && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {game.awayScore} - {game.homeScore}
                      </div>
                      <div className="text-xs text-gray-400">Final</div>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(game.status)}`}>
                      {game.status.toUpperCase()}
                    </span>
                    
                    {game.status === 'live' && (
                      <motion.button
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="h-3 w-3" />
                        <span>Watch</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Games */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Upcoming Games</h3>
        
        <div className="space-y-6">
          {upcomingGames.map((day, dayIndex) => (
            <div key={dayIndex}>
              <h4 className="text-sm font-medium text-gray-300 mb-3">{day.date}</h4>
              <div className="space-y-3">
                {day.games.map((game, gameIndex) => (
                  <motion.div
                    key={gameIndex}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-white">{game.away} @ {game.home}</div>
                    </div>
                    <div className="text-sm text-gray-400">{game.time}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* League Standings Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Atlantic Division Standings
        </h3>
        
        <div className="space-y-2">
          {[
            { team: 'Boston Bruins', wins: 45, losses: 12, ot: 5, points: 95 },
            { team: 'Toronto Maple Leafs', wins: 42, losses: 16, ot: 4, points: 88 },
            { team: 'Tampa Bay Lightning', wins: 38, losses: 20, ot: 4, points: 80 },
            { team: 'Florida Panthers', wins: 35, losses: 22, ot: 5, points: 75 },
          ].map((team, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-white/5 rounded">
              <div className="flex items-center space-x-3">
                <div className="w-6 text-center text-sm text-gray-400">{index + 1}</div>
                <div className="text-white">{team.team}</div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-gray-400">{team.wins}-{team.losses}-{team.ot}</div>
                <div className="text-white font-medium w-8 text-right">{team.points}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameSchedule;