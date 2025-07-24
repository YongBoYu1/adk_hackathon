import React from 'react';
import { Users, Target, Clock } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: { x: number; y: number };
  team: 'home' | 'away';
  number: number;
}

interface GameState {
  players?: Player[];
  puck?: { x: number; y: number };
  score?: { home: number; away: number };
  period?: number;
  timeRemaining?: string;
  homeTeam?: string;
  awayTeam?: string;
}

interface GameBoardProps {
  gameState: GameState;
  selectedPlayer: string | null;
  onPlayerSelect: (playerId: string | null) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  selectedPlayer, 
  onPlayerSelect 
}) => {
  const rinkWidth = 600;
  const rinkHeight = 300;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      {/* Game Info Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {gameState.score?.away || 0}
            </div>
            <div className="text-sm text-gray-300">
              {gameState.awayTeam || 'Away'}
            </div>
          </div>
          
          <div className="text-white text-xl font-semibold">VS</div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {gameState.score?.home || 0}
            </div>
            <div className="text-sm text-gray-300">
              {gameState.homeTeam || 'Home'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-300">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Period {gameState.period || 1} - {gameState.timeRemaining || '20:00'}
            </span>
          </div>
        </div>
      </div>

      {/* Hockey Rink */}
      <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg overflow-hidden">
        <svg
          width="100%"
          height="300"
          viewBox={`0 0 ${rinkWidth} ${rinkHeight}`}
          className="w-full"
        >
          {/* Rink Background */}
          <rect width={rinkWidth} height={rinkHeight} fill="#f8fafc" />
          
          {/* Center Line */}
          <line
            x1={rinkWidth / 2}
            y1="0"
            x2={rinkWidth / 2}
            y2={rinkHeight}
            stroke="#dc2626"
            strokeWidth="3"
          />
          
          {/* Center Circle */}
          <circle
            cx={rinkWidth / 2}
            cy={rinkHeight / 2}
            r="40"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
          />
          
          {/* Goal Areas */}
          <rect
            x="0"
            y={rinkHeight / 2 - 30}
            width="40"
            height="60"
            fill="none"
            stroke="#1e40af"
            strokeWidth="2"
          />
          <rect
            x={rinkWidth - 40}
            y={rinkHeight / 2 - 30}
            width="40"
            height="60"
            fill="none"
            stroke="#1e40af"
            strokeWidth="2"
          />

          {/* Players */}
          {gameState.players?.map((player) => (
            <g key={player.id}>
              <circle
                cx={player.position.x}
                cy={player.position.y}
                r="8"
                fill={player.team === 'home' ? '#3b82f6' : '#ef4444'}
                stroke={selectedPlayer === player.id ? '#fbbf24' : 'white'}
                strokeWidth={selectedPlayer === player.id ? '3' : '2'}
                className="cursor-pointer hover:stroke-yellow-400 transition-colors"
                onClick={() => onPlayerSelect(
                  selectedPlayer === player.id ? null : player.id
                )}
              />
              <text
                x={player.position.x}
                y={player.position.y + 3}
                textAnchor="middle"
                className="text-xs font-bold fill-white pointer-events-none"
              >
                {player.number}
              </text>
            </g>
          ))}

          {/* Puck */}
          {gameState.puck && (
            <circle
              cx={gameState.puck.x}
              cy={gameState.puck.y}
              r="4"
              fill="#1f2937"
              stroke="#fbbf24"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-white">Home</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white">Away</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-800 border-2 border-yellow-400 rounded-full"></div>
              <span className="text-white">Puck</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;