import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, TrendingUp, Users, ThumbsUp, Eye } from 'lucide-react';

const SocialPanel: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'HockeyFan92',
      avatar: '🏒',
      content: 'What a save by Price! That was absolutely incredible!',
      likes: 234,
      comments: 45,
      timestamp: '2 min ago',
      trending: true,
    },
    {
      id: 2,
      user: 'LeafsNation',
      avatar: '🍁',
      content: 'Matthews is on fire tonight! 🔥 That shot was pure magic',
      likes: 189,
      comments: 32,
      timestamp: '5 min ago',
      trending: false,
    },
    {
      id: 3,
      user: 'HabsFan4Life',
      avatar: '⚡',
      content: 'The energy in the building is electric! You can feel it through the screen',
      likes: 156,
      comments: 28,
      timestamp: '8 min ago',
      trending: true,
    },
    {
      id: 4,
      user: 'HockeyAnalyst',
      avatar: '📊',
      content: 'Interesting stat: This is the 3rd time this season these teams have gone to overtime',
      likes: 98,
      comments: 15,
      timestamp: '12 min ago',
      trending: false,
    },
  ]);

  const [newPost, setNewPost] = useState('');

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        user: 'You',
        avatar: '👤',
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: 'now',
        trending: false,
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const trendingTopics = [
    { tag: '#NHLPlayoffs', posts: '12.5K' },
    { tag: '#LeafsVsHabs', posts: '8.2K' },
    { tag: '#HockeyNight', posts: '5.7K' },
    { tag: '#SaveOfTheYear', posts: '3.1K' },
  ];

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Community Activity
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">47.2K</div>
            <div className="text-xs text-gray-400">Watching</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">1.8K</div>
            <div className="text-xs text-gray-400">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">892</div>
            <div className="text-xs text-gray-400">Reactions</div>
          </div>
        </div>
      </motion.div>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending Now
        </h3>
        
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <motion.div
              key={topic.tag}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <div className="text-blue-400 font-medium">{topic.tag}</div>
                <div className="text-xs text-gray-400">{topic.posts} posts</div>
              </div>
              <div className="text-sm text-gray-400">#{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Post Composer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Share Your Thoughts</h3>
        
        <div className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's happening in the game?"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {280 - newPost.length} characters remaining
            </div>
            <motion.button
              onClick={handleSubmitPost}
              disabled={!newPost.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Post
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Social Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Live Feed
        </h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              className="border-b border-white/10 pb-4 last:border-b-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-white">{post.user}</span>
                    <span className="text-xs text-gray-400">{post.timestamp}</span>
                    {post.trending && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                        Trending
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{post.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <motion.button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{post.likes}</span>
                    </motion.button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SocialPanel;