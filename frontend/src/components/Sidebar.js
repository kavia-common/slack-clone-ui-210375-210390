import React from 'react';
import { Hash, Lock, ChevronDown, Plus, MessageSquare } from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Sidebar component displaying workspace navigation, channels, and direct messages
 * @param {Object} props - Component props
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {Function} props.onToggleCollapse - Callback to toggle collapse state
 * @param {string} props.activeChannel - Currently active channel ID
 * @param {Function} props.onChannelSelect - Callback when channel is selected
 * @param {Array} props.channels - List of channels
 * @param {Array} props.directMessages - List of direct messages
 * @param {Array} props.users - List of users
 * @param {Object} props.currentWorkspace - Current workspace object
 */
const Sidebar = ({ 
  isCollapsed, 
  onToggleCollapse, 
  activeChannel, 
  onChannelSelect,
  channels,
  directMessages,
  users,
  currentWorkspace 
}) => {
  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar flex flex-col items-center py-4 custom-scrollbar-dark overflow-y-auto">
        <button
          onClick={onToggleCollapse}
          className="text-white text-2xl hover:bg-white/[0.06] w-10 h-10 rounded flex items-center justify-center mb-4 transition-colors"
        >
          {currentWorkspace?.icon || '🚀'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar text-white flex flex-col custom-scrollbar-dark">
      {/* Workspace Header */}
      <div className="px-4 py-3 border-b border-white/[0.1]">
        <button className="flex items-center justify-between w-full hover:bg-white/[0.06] rounded px-2 py-1 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentWorkspace?.icon || '🚀'}</span>
            <span className="font-bold text-white truncate">
              {currentWorkspace?.name || 'Workspace'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark">
        {/* Channels Section */}
        <div className="px-3 py-2">
          <button className="flex items-center justify-between w-full text-gray-300 hover:text-white text-sm py-1">
            <span className="font-semibold">Channels</span>
            <Plus className="w-4 h-4" />
          </button>
          <div className="mt-1 space-y-0.5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-colors ${
                  activeChannel === channel.id
                    ? 'bg-sidebar-active text-white font-semibold'
                    : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {channel.isPrivate ? (
                    <Lock className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <Hash className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{channel.name}</span>
                </div>
                {channel.unread > 0 && (
                  <span className="bg-white text-sidebar text-xs font-bold px-1.5 py-0.5 rounded">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="px-3 py-2 mt-4">
          <button className="flex items-center justify-between w-full text-gray-300 hover:text-white text-sm py-1">
            <span className="font-semibold">Direct messages</span>
            <Plus className="w-4 h-4" />
          </button>
          <div className="mt-1 space-y-0.5">
            {directMessages.map((dm) => {
              const user = users.find((u) => u.id === dm.userId);
              return (
                <button
                  key={dm.id}
                  onClick={() => onChannelSelect(dm.id)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-sm transition-colors ${
                    activeChannel === dm.id
                      ? 'bg-sidebar-active text-white font-semibold'
                      : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="relative">
                      <span className="text-base">{user?.avatar || '👤'}</span>
                      {user?.status === 'online' && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-sidebar" />
                      )}
                    </div>
                    <span className="truncate">{user?.name || 'User'}</span>
                  </div>
                  {dm.unread > 0 && (
                    <span className="bg-slack-red text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      {dm.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apps Section */}
        <div className="px-3 py-2 mt-4">
          <button className="flex items-center justify-between w-full text-gray-300 hover:text-white text-sm py-1">
            <span className="font-semibold">Apps</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="px-3 py-3 border-t border-white/[0.1]">
        <button className="flex items-center gap-2 hover:bg-white/[0.06] rounded px-2 py-1 w-full transition-colors">
          <div className="relative">
            <span className="text-2xl">👤</span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-white">You</div>
            <div className="text-xs text-gray-300">Active</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
