import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Activity, BarChart3, PieChart } from 'lucide-react';

interface PerformanceMetricsProps {
  gameState: any;
  detailed?: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ gameState, detailed = false }) => {
  const metrics = {
    possession: {
      home: 58,
      away: 42,
    },
    faceoffs: {
      home: 65,
      away: 35,
    },
    powerPlay: {
      home: { opportunities: 3, goals: 1 },
      away: { opportunities: 2, goals: 0 },
    },
    shots: {
      home: { total: 28, onGoal: 18, blocked: 6, missed: 4 },
      away: { total: 22, onGoal: 14, blocked: 4, missed: 4 },
    },
    hits: {
      home: 24,
      away: 31,
    },
    giveaways: {
      home: 8,
      away: 12,
    },
    takeaways: {
      home: 11,
      away: 7,
    },
    penalties: {
      home: { count: 4, minutes: 8 },
      away: { count: 3, minutes: 6 },
    },
  };

  const heatMapData = [
    { zone: 'Offensive Zone', home: 45, away: 32 },
    { zone: 'Neutral Zone', home: 28, away: 35 },
    { zone: 'Defensive Zone', home: 27, away: 33 },
  ];

  const playerEfficiency = [
    { name: 'Matthews', efficiency: 92, goals: 2, assists: 1 },
    { name: 'Marner', efficiency: 88, goals: 0, assists: 3 },
    { name: 'Nylander', efficiency: 85, goals: 1, assists: 1 },
    { name: 'Tavares', efficiency: 82, goals: 1, assists: 0 },
  ];

  if (!detailed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Live Performance
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Possession */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Possession %</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-400 text-sm">Home</span>
              <span className="text-red-400 text-sm">Away</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.possession.home}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{metrics.possession.home}%</span>
              <span>{metrics.possession.away}%</span>
            </div>
          </div>

          {/* Shots */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Shots on Goal</div>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{metrics.shots.home.onGoal}</div>
                <div className="text-xs text-gray-400">Home</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{metrics.shots.away.onGoal}</div>
                <div className="text-xs text-gray-400">Away</div>
              </div>
            </div>
          </div>

          {/* Power Play */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Power Play</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-blue-400">
                  {metrics.powerPlay.home.goals}/{metrics.powerPlay.home.opportunities}
                </span>
                <span className="text-gray-400">
                  {((metrics.powerPlay.home.goals / metrics.powerPlay.home.opportunities) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-400">
                  {metrics.powerPlay.away.goals}/{metrics.powerPlay.away.opportunities}
                </span>
                <span className="text-gray-400">
                  {metrics.powerPlay.away.opportunities > 0 ? ((metrics.powerPlay.away.goals / metrics.powerPlay.away.opportunities) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Hits */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Hits</div>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{metrics.hits.home}</div>
                <div className="text-xs text-gray-400">Home</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{metrics.hits.away}</div>
                <div className="text-xs text-gray-400">Away</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Advanced Analytics Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h2>
        <p className="text-gray-400">Deep dive into game performance and statistics</p>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { title: 'Shot Attempts', home: 45, away: 38, icon: Target },
          { title: 'Expected Goals', home: 2.8, away: 2.1, icon: TrendingUp },
          { title: 'Corsi For %', home: 54.2, away: 45.8, icon: BarChart3 },
          { title: 'PDO', home: 102.1, away: 97.9, icon: PieChart },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <metric.icon className="h-6 w-6 text-blue-400" />
              <span className="text-sm text-gray-400">{metric.title}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-400">Home</span>
                <span className="text-white font-bold">{metric.home}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Away</span>
                <span className="text-white font-bold">{metric.away}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Zone Time and Heat Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Zone Time */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Zone Time Distribution</h3>
          <div className="space-y-4">
            {heatMapData.map((zone, index) => (
              <div key={zone.zone}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">{zone.zone}</span>
                  <span className="text-gray-400">{zone.home + zone.away}% total</span>
                </div>
                <div className="relative w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="absolute left-0 bg-blue-500 h-3 rounded-l-full"
                    style={{ width: `${(zone.home / (zone.home + zone.away)) * 100}%` }}
                  />
                  <div 
                    className="absolute right-0 bg-red-500 h-3 rounded-r-full"
                    style={{ width: `${(zone.away / (zone.home + zone.away)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{zone.home}% Home</span>
                  <span>{zone.away}% Away</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Efficiency */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performers</h3>
          <div className="space-y-4">
            {playerEfficiency.map((player, index) => (
              <div key={player.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{player.name}</div>
                    <div className="text-xs text-gray-400">
                      {player.goals}G {player.assists}A
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{player.efficiency}%</div>
                  <div className="text-xs text-gray-400">Efficiency</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detailed Shot Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Shot Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { team: 'Home', data: metrics.shots.home, color: 'blue' },
            { team: 'Away', data: metrics.shots.away, color: 'red' },
            { team: 'Comparison', data: null, color: 'gray' },
          ].map((section, index) => (
            <div key={section.team} className="space-y-4">
              <h4 className={`font-medium text-${section.color}-400`}>{section.team}</h4>
              {section.data ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Shots</span>
                    <span className="text-white">{section.data.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">On Goal</span>
                    <span className="text-white">{section.data.onGoal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blocked</span>
                    <span className="text-white">{section.data.blocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Missed</span>
                    <span className="text-white">{section.data.missed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accuracy</span>
                    <span className="text-white">
                      {((section.data.onGoal / section.data.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">
                      +{metrics.shots.home.total - metrics.shots.away.total}
                    </div>
                    <div className="text-xs text-gray-400">Shot Advantage</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1">
                      {(((metrics.shots.home.onGoal / metrics.shots.home.total) - 
                         (metrics.shots.away.onGoal / metrics.shots.away.total)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Accuracy Diff</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PerformanceMetrics;