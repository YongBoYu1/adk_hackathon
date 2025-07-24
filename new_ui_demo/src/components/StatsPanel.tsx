import React from 'react';
import { TrendingUp, Target, Clock, Users } from 'lucide-react';

interface GameState {
  players?: Array<{
    id: string;
    name: string;
    team: 'home' | 'away';
    number: number;
    stats?: {
      goals?: number;
      assists?: number;
      shots?: number;
      timeOnIce?: string;
    };
  }>;
  teamStats?: {
    home: {
      shots: number;
      hits: number;
      faceoffWins: number;
    };
    away: {
      shots: number;
      hits: number;
      faceoffWins: number;
    };
  };
}

interface StatsPanelProps {
  gameState: GameState;
  selectedPlayer: string | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ 
  gameState, 
  selectedPlayer 
}) => {
  const selectedPlayerData = gameState.players?.find(p => p.id === selectedPlayer);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <TrendingUp className="h-5 w-5" />
        <span>Statistics</span>
      </h3>

      {/* Selected Player Stats */}
      {selectedPlayerData ? (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            {selectedPlayerData.name} (#{selectedPlayerData.number})
          </h4>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Goals:</span>
              <span className="text-white">{selectedPlayerData.stats?.goals || 0}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Assists:</span>
              <span className="text-white">{selectedPlayerData.stats?.assists || 0}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Shots:</span>
              <span className="text-white">{selectedPlayerData.stats?.shots || 0}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">TOI:</span>
              <span className="text-white">{selectedPlayerData.stats?.timeOnIce || '0:00'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 text-center text-gray-400 py-4">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a player to view stats</p>
        </div>
      )}

      {/* Team Stats */}
      <div className="border-t border-white/10 pt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Team Statistics</h4>
        
        <div className="space-y-4">
          {/* Shots */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Shots on Goal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">Home: {gameState.teamStats?.home.shots || 0}</span>
              <span className="text-red-400">Away: {gameState.teamStats?.away.shots || 0}</span>
            </div>
          </div>

          {/* Hits */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Hits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">Home: {gameState.teamStats?.home.hits || 0}</span>
              <span className="text-red-400">Away: {gameState.teamStats?.away.hits || 0}</span>
            </div>
          </div>

          {/* Faceoffs */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Faceoff Wins</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">Home: {gameState.teamStats?.home.faceoffWins || 0}</span>
              <span className="text-red-400">Away: {gameState.teamStats?.away.faceoffWins || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Performance</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Shot Accuracy</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs text-white">75%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Power Play</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-xs text-white">60%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Penalty Kill</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <span className="text-xs text-white">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;