import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Gift, Crown, Shield } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'goal' | 'system';
  badges?: string[];
  color?: string;
}

const LiveChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'HockeyMod',
      message: 'Welcome to the live chat! Keep it respectful and enjoy the game! 🏒',
      timestamp: new Date(Date.now() - 300000),
      type: 'system',
      badges: ['mod'],
    },
    {
      id: '2',
      user: 'LeafsFan92',
      message: 'LET\'S GO LEAFS! 🍁',
      timestamp: new Date(Date.now() - 240000),
      type: 'message',
      badges: ['vip'],
      color: '#3B82F6',
    },
    {
      id: '3',
      user: 'HabsNation',
      message: 'Price is looking sharp tonight!',
      timestamp: new Date(Date.now() - 180000),
      type: 'message',
      color: '#EF4444',
    },
    {
      id: '4',
      user: 'System',
      message: '🚨 GOAL! Matthews scores for Toronto! 🚨',
      timestamp: new Date(Date.now() - 120000),
      type: 'goal',
    },
    {
      id: '5',
      user: 'HockeyAnalyst',
      message: 'What a shot! Top shelf where mama hides the cookies!',
      timestamp: new Date(Date.now() - 60000),
      type: 'message',
      badges: ['verified'],
      color: '#10B981',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'Great save!',
        'What a hit!',
        'Come on ref, that was a penalty!',
        'This game is intense!',
        'Beautiful passing play',
        'The crowd is electric tonight!',
        'That was close!',
        'Amazing stick work',
      ];

      const randomUsers = [
        'HockeyFan123',
        'PuckLover',
        'IceWarrior',
        'GoalieGuru',
        'SlapShotKing',
        'PowerPlayPro',
      ];

      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        type: 'message',
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
      };

      setMessages(prev => [...prev.slice(-50), newMsg]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        timestamp: new Date(),
        type: 'message',
        badges: ['viewer'],
        color: '#8B5CF6',
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'mod': return <Shield className="h-3 w-3 text-green-400" />;
      case 'vip': return <Crown className="h-3 w-3 text-yellow-400" />;
      case 'verified': return <Gift className="h-3 w-3 text-blue-400" />;
      default: return null;
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'goal':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50';
      case 'system':
        return 'bg-blue-500/20 border-blue-400/50';
      default:
        return 'hover:bg-white/5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 h-96 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center justify-between">
          Live Chat
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">1,247 viewers</span>
          </div>
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-2 rounded-lg border transition-colors ${getMessageStyle(message.type)}`}
            >
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className="font-medium text-sm"
                      style={{ color: message.color || '#fff' }}
                    >
                      {message.user}
                    </span>
                    
                    {message.badges?.map((badge, index) => (
                      <div key={index} className="flex items-center">
                        {getBadgeIcon(badge)}
                      </div>
                    ))}
                    
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              maxLength={200}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded">
              <Smile className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          
          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>Be respectful and follow community guidelines</span>
          <span>{200 - newMessage.length} characters left</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveChat;