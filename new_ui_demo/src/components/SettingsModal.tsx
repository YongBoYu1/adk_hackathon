import React from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, Eye, Palette, Keyboard, Bell, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: any;
  onUpdatePreference: (key: string, value: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  preferences, 
  onUpdatePreference 
}) => {
  const settingsSections = [
    {
      title: 'Audio & Commentary',
      icon: Volume2,
      settings: [
        {
          key: 'commentarySpeed',
          label: 'Commentary Speed',
          type: 'select',
          options: [
            { value: 'slow', label: 'Slow' },
            { value: 'normal', label: 'Normal' },
            { value: 'fast', label: 'Fast' },
          ],
        },
        {
          key: 'commentaryStyle',
          label: 'Commentary Style',
          type: 'select',
          options: [
            { value: 'professional', label: 'Professional' },
            { value: 'casual', label: 'Casual' },
            { value: 'energetic', label: 'Energetic' },
          ],
        },
        {
          key: 'autoPlay',
          label: 'Auto-play Commentary',
          type: 'toggle',
        },
        {
          key: 'soundEffects',
          label: 'Sound Effects',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Display & Interface',
      icon: Eye,
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
            { value: 'auto', label: 'Auto' },
          ],
        },
        {
          key: 'animations',
          label: 'Animations',
          type: 'toggle',
        },
        {
          key: 'compactMode',
          label: 'Compact Mode',
          type: 'toggle',
        },
        {
          key: 'showPlayerNumbers',
          label: 'Show Player Numbers',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'goalNotifications',
          label: 'Goal Notifications',
          type: 'toggle',
        },
        {
          key: 'periodNotifications',
          label: 'Period End Notifications',
          type: 'toggle',
        },
        {
          key: 'socialNotifications',
          label: 'Social Activity',
          type: 'toggle',
        },
        {
          key: 'gameStartNotifications',
          label: 'Game Start Reminders',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Privacy & Data',
      icon: Shield,
      settings: [
        {
          key: 'analytics',
          label: 'Usage Analytics',
          type: 'toggle',
        },
        {
          key: 'personalizedContent',
          label: 'Personalized Content',
          type: 'toggle',
        },
        {
          key: 'shareData',
          label: 'Share Anonymous Data',
          type: 'toggle',
        },
      ],
    },
  ];

  const keyboardShortcuts = [
    { key: 'Space', action: 'Play/Pause Commentary' },
    { key: 'M', action: 'Mute/Unmute' },
    { key: 'F', action: 'Toggle Fullscreen' },
    { key: 'S', action: 'Open Settings' },
    { key: 'Esc', action: 'Close Modals' },
    { key: '1-4', action: 'Switch Tabs' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-5 w-5 text-white" />
          </motion.button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-slate-900 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <motion.button
                  key={section.title}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </motion.button>
              ))}
              
              <motion.button
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                whileHover={{ x: 4 }}
              >
                <Keyboard className="h-5 w-5" />
                <span>Keyboard Shortcuts</span>
              </motion.button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-8">
              {settingsSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <section.icon className="h-5 w-5 mr-2" />
                    {section.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {section.settings.map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-300">
                            {setting.label}
                          </label>
                        </div>
                        
                        <div>
                          {setting.type === 'toggle' && (
                            <motion.button
                              onClick={() => onUpdatePreference(setting.key, !preferences[setting.key])}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences[setting.key] ? 'bg-blue-600' : 'bg-gray-600'
                              }`}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.span
                                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                                animate={{ x: preferences[setting.key] ? 24 : 4 }}
                              />
                            </motion.button>
                          )}
                          
                          {setting.type === 'select' && (
                            <select
                              value={preferences[setting.key] || setting.options?.[0]?.value}
                              onChange={(e) => onUpdatePreference(setting.key, e.target.value)}
                              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {setting.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Keyboard Shortcuts */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Keyboard className="h-5 w-5 mr-2" />
                  Keyboard Shortcuts
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyboardShortcuts.map((shortcut) => (
                    <div key={shortcut.key} className="flex items-center justify-between bg-slate-700 rounded-lg p-3">
                      <span className="text-gray-300">{shortcut.action}</span>
                      <kbd className="px-2 py-1 bg-slate-600 rounded text-sm font-mono text-white">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-700">
          <motion.button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;