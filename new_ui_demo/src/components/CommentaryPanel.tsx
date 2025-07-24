import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Volume2, 
  MessageSquare, 
  Clock,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Headphones,
  Radio
} from 'lucide-react';

interface Commentary {
  id: string;
  text: string;
  timestamp: string;
  type: 'play' | 'analysis' | 'color';
  speaker?: string;
  gameTime?: string;
  isBookmarked?: boolean;
}

interface CommentaryPanelProps {
  commentary: Commentary[];
  isPlaying: boolean;
  isLive?: boolean;
}

const CommentaryPanel: React.FC<CommentaryPanelProps> = ({ 
  commentary, 
  isPlaying,
  isLive = true
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [selectedCommentary, setSelectedCommentary] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (scrollRef.current && autoScroll) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commentary, autoScroll]);

  const getCommentaryIcon = (type: string) => {
    switch (type) {
      case 'play':
        return <Mic className="h-4 w-4 text-blue-400" />;
      case 'analysis':
        return <MessageSquare className="h-4 w-4 text-green-400" />;
      default:
        return <Volume2 className="h-4 w-4 text-purple-400" />;
    }
  };

  const getCommentaryStyle = (type: string) => {
    switch (type) {
      case 'play':
        return 'border-l-blue-400 bg-blue-500/10';
      case 'analysis':
        return 'border-l-green-400 bg-green-500/10';
      default:
        return 'border-l-purple-400 bg-purple-500/10';
    }
  };

  const handleBookmark = (commentaryId: string) => {
    // Handle bookmark functionality
    console.log('Bookmark commentary:', commentaryId);
  };

  const handleShare = (commentaryId: string) => {
    // Handle share functionality
    console.log('Share commentary:', commentaryId);
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            {isLive ? (
              <>
                <Radio className="h-5 w-5 text-red-500" />
                <span>Live Commentary</span>
              </>
            ) : (
              <>
                <Headphones className="h-5 w-5 text-blue-500" />
                <span>Commentary Replay</span>
              </>
            )}
          </h3>
          
          {isLive && isPlaying && (
            <motion.div 
              className="flex items-center space-x-2 text-red-400"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm font-medium">Recording</span>
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowTranscript(!showTranscript)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showTranscript ? (
              <>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-2 rounded-lg transition-colors text-sm ${
              autoScroll ? 'bg-blue-600 text-white' : 'hover:bg-white/20 text-gray-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Auto
          </motion.button>
        </div>
      </div>

      {/* Commentary Feed */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-80 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {commentary.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Waiting for commentary...</p>
              <p className="text-sm mt-1">
                {isLive ? 'Live commentary will appear here' : 'Select a time to hear commentary'}
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {commentary.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`border-l-4 pl-4 py-3 rounded-r-lg ${getCommentaryStyle(comment.type)} ${
                  selectedCommentary === comment.id ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setSelectedCommentary(selectedCommentary === comment.id ? null : comment.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getCommentaryIcon(comment.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {comment.speaker && (
                          <span className="text-sm font-medium text-gray-300">
                            {comment.speaker}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {comment.timestamp}
                        </span>
                        {comment.gameTime && (
                          <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-0.5 rounded">
                            {comment.gameTime}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-white text-sm leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>

                  {/* Action Menu */}
                  <div className="flex items-center space-x-1 ml-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(comment.id);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bookmark className={`h-3 w-3 ${comment.isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </motion.button>
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(comment.id);
                      }}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 className="h-3 w-3 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedCommentary === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Commentary Type: {comment.type}</span>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>Jump to this moment</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Audio Visualization */}
      {isPlaying && (
        <div className="mt-4 flex items-center justify-center space-x-1">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-400 rounded-full"
              animate={{
                height: [10, Math.random() * 30 + 10, 10],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript Toggle */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <h4 className="text-sm font-medium text-gray-300 mb-2">Full Transcript</h4>
            <div className="max-h-32 overflow-y-auto text-xs text-gray-400 space-y-1">
              {commentary.map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <span className="text-blue-400">[{comment.timestamp}]</span>
                  <span>{comment.speaker}:</span>
                  <span>{comment.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentaryPanel;