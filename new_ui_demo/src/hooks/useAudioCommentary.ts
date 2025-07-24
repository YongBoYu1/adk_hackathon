import { useState, useEffect } from 'react';

interface Commentary {
  id: string;
  text: string;
  timestamp: string;
  type: 'play' | 'analysis' | 'color';
  speaker?: string;
}

export const useAudioCommentary = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [commentary, setCommentary] = useState<Commentary[]>([]);

  const sampleCommentary = [
    {
      id: '1',
      text: "What a save by Price! He stretches across the crease to deny Smith's one-timer from the slot.",
      timestamp: '15:42',
      type: 'play' as const,
      speaker: 'Play-by-Play'
    },
    {
      id: '2',
      text: "The Maple Leafs are really controlling the pace in this second period. They've outshot Montreal 12-6 so far.",
      timestamp: '15:38',
      type: 'analysis' as const,
      speaker: 'Analyst'
    },
    {
      id: '3',
      text: "You can feel the energy in the building tonight. This rivalry never gets old!",
      timestamp: '15:35',
      type: 'color' as const,
      speaker: 'Color Commentary'
    }
  ];

  useEffect(() => {
    setCommentary(sampleCommentary);

    // Simulate new commentary coming in
    const interval = setInterval(() => {
      if (isPlaying) {
        const newCommentary: Commentary = {
          id: Date.now().toString(),
          text: getRandomCommentary(),
          timestamp: new Date().toLocaleTimeString('en-US', { 
            minute: '2-digit', 
            second: '2-digit' 
          }),
          type: ['play', 'analysis', 'color'][Math.floor(Math.random() * 3)] as 'play' | 'analysis' | 'color',
          speaker: ['Play-by-Play', 'Analyst', 'Color Commentary'][Math.floor(Math.random() * 3)]
        };

        setCommentary(prev => [...prev, newCommentary].slice(-10)); // Keep last 10 comments
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const getRandomCommentary = () => {
    const comments = [
      "Great defensive play by the home team, breaking up that rush.",
      "The puck movement has been excellent tonight from both teams.",
      "That's a textbook example of how to forecheck effectively.",
      "The goaltender is seeing the puck well tonight, tracking every shot.",
      "Beautiful passing sequence leads to a scoring chance!",
      "The crowd is on their feet after that big hit along the boards.",
      "Excellent stick work to break up that two-on-one opportunity.",
      "The power play unit is setting up nicely in the offensive zone."
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    isPlaying,
    isMuted,
    volume,
    commentary,
    togglePlayback,
    toggleMute,
    setVolume
  };
};