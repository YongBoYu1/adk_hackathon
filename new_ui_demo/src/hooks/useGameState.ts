import { useState, useEffect } from 'react';

interface Player {
  id: string;
  name: string;
  position: { x: number; y: number };
  team: 'home' | 'away';
  number: number;
  stats?: {
    goals?: number;
    assists?: number;
    shots?: number;
    timeOnIce?: string;
  };
}

interface GameState {
  players: Player[];
  puck: { x: number; y: number };
  score: { home: number; away: number };
  period: number;
  timeRemaining: string;
  homeTeam: string;
  awayTeam: string;
  status: 'live' | 'paused' | 'ended';
  teamStats: {
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

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    puck: { x: 300, y: 150 },
    score: { home: 2, away: 1 },
    period: 2,
    timeRemaining: '15:42',
    homeTeam: 'Toronto Maple Leafs',
    awayTeam: 'Montreal Canadiens',
    status: 'live',
    teamStats: {
      home: { shots: 18, hits: 12, faceoffWins: 15 },
      away: { shots: 14, hits: 16, faceoffWins: 13 }
    }
  });
  
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate sample players
    const samplePlayers: Player[] = [
      // Home team players
      { id: '1', name: 'John Smith', position: { x: 150, y: 100 }, team: 'home', number: 91 },
      { id: '2', name: 'Mike Johnson', position: { x: 200, y: 150 }, team: 'home', number: 34 },
      { id: '3', name: 'Dave Wilson', position: { x: 180, y: 200 }, team: 'home', number: 16 },
      { id: '4', name: 'Tom Brown', position: { x: 120, y: 120 }, team: 'home', number: 88 },
      { id: '5', name: 'Steve Davis', position: { x: 160, y: 180 }, team: 'home', number: 27 },
      { id: '6', name: 'Alex Miller', position: { x: 80, y: 150 }, team: 'home', number: 1 },
      
      // Away team players
      { id: '7', name: 'Pierre Dubois', position: { x: 450, y: 120 }, team: 'away', number: 67 },
      { id: '8', name: 'Jean Tremblay', position: { x: 400, y: 160 }, team: 'away', number: 22 },
      { id: '9', name: 'Marc Leclerc', position: { x: 420, y: 200 }, team: 'away', number: 45 },
      { id: '10', name: 'Luc Bergeron', position: { x: 480, y: 140 }, team: 'away', number: 13 },
      { id: '11', name: 'Claude Roy', position: { x: 440, y: 180 }, team: 'away', number: 71 },
      { id: '12', name: 'Carey Price', position: { x: 520, y: 150 }, team: 'away', number: 31 }
    ];

    setGameState(prev => ({ ...prev, players: samplePlayers }));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        players: prev.players.map(player => ({
          ...player,
          position: {
            x: Math.max(20, Math.min(580, player.position.x + (Math.random() - 0.5) * 10)),
            y: Math.max(20, Math.min(280, player.position.y + (Math.random() - 0.5) * 10))
          }
        })),
        puck: {
          x: Math.max(20, Math.min(580, prev.puck.x + (Math.random() - 0.5) * 15)),
          y: Math.max(20, Math.min(280, prev.puck.y + (Math.random() - 0.5) * 15))
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { gameState, isConnected, error };
};