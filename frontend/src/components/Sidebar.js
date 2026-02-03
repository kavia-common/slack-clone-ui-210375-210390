import React from 'react';
import { Hash, Lock, ChevronDown, Plus, MessageSquare, Edit3, AtSign, Bookmark, MoreHorizontal, MessageCircle, Circle } from 'lucide-react';

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
  const [channelsExpanded, setChannelsExpanded] = React.useState(true);
  const [dmsExpanded, setDmsExpanded] = React.useState(true);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-[#3F0E40] flex flex-col items-center py-4 custom-scrollbar-dark overflow-y-auto">
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
    <div className="w-[260px] bg-[#3F0E40] text-white flex flex-col custom-scrollbar-dark h-screen">
      {/* Workspace Header */}
      <div className="px-4 py-3 bg-[#350d36] border-b border-white/[0.1] flex-shrink-0">
        <button className="flex items-center justify-between w-full hover:bg-white/[0.06] rounded px-2 py-1.5 transition-colors duration-150">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center text-xl flex-shrink-0">
              {currentWorkspace?.icon || '🚀'}
            </div>
            <span className="font-bold text-white truncate text-[18px]">
              {currentWorkspace?.name || 'Workspace'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/70 flex-shrink-0" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark">
        {/* Primary Navigation Items */}
        <div className="px-3 py-2 mt-2">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[15px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors duration-150">
            <MessageCircle className="w-[16px] h-[16px] flex-shrink-0" />
            <span>Threads</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[15px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors duration-150">
            <Edit3 className="w-[16px] h-[16px] flex-shrink-0" />
            <span>Drafts</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[15px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors duration-150">
            <MessageSquare className="w-[16px] h-[16px] flex-shrink-0" />
            <span>All DMs</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[15px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors duration-150">
            <AtSign className="w-[16px] h-[16px] flex-shrink-0" />
            <span>Mentions & reactions</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[15px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors duration-150">
            <Bookmark className="w-[16px] h-[16px] flex-shrink-0" />
            <span>Saved items</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[15px] text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors duration-150">
            <MoreHorizontal className="w-[16px] h-[16px] flex-shrink-0" />
            <span>More</span>
          </button>
        </div>

        {/* Channels Section */}
        <div className="px-3 py-2 mt-4">
          <button 
            onClick={() => setChannelsExpanded(!channelsExpanded)}
            className="flex items-center justify-between w-full text-white/70 hover:text-white text-[15px] py-1.5 px-2 hover:bg-white/[0.04] rounded transition-colors duration-100"
          >
            <div className="flex items-center gap-2">
              <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${!channelsExpanded ? '-rotate-90' : ''}`} />
              <span className="font-semibold">Channels</span>
            </div>
            <Plus className="w-4 h-4 flex-shrink-0" />
          </button>
          {channelsExpanded && (
            <div className="mt-1 space-y-0.5">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-[15px] transition-all duration-150 ${
                    activeChannel === channel.id
                      ? 'bg-[#1164A3] text-white font-bold'
                      : channel.unread > 0
                      ? 'text-white font-bold hover:bg-white/[0.06]'
                      : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {channel.isPrivate ? (
                      <Lock className="w-[14px] h-[14px] flex-shrink-0" />
                    ) : (
                      <Hash className="w-[14px] h-[14px] flex-shrink-0" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-white text-[#3F0E40] text-[11px] font-bold px-1.5 py-0.5 rounded min-w-[18px] text-center flex-shrink-0 ml-2">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Direct Messages Section */}
        <div className="px-3 py-2 mt-4">
          <button 
            onClick={() => setDmsExpanded(!dmsExpanded)}
            className="flex items-center justify-between w-full text-white/70 hover:text-white text-[15px] py-1.5 px-2 hover:bg-white/[0.04] rounded transition-colors duration-100"
          >
            <div className="flex items-center gap-2">
              <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${!dmsExpanded ? '-rotate-90' : ''}`} />
              <span className="font-semibold">Direct messages</span>
            </div>
            <Plus className="w-4 h-4 flex-shrink-0" />
          </button>
          {dmsExpanded && (
            <div className="mt-1 space-y-0.5">
              {directMessages.map((dm) => {
                const user = users.find((u) => u.id === dm.userId);
                return (
                  <button
                    key={dm.id}
                    onClick={() => onChannelSelect(dm.id)}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded text-[15px] transition-all duration-150 ${
                      activeChannel === dm.id
                        ? 'bg-[#1164A3] text-white font-bold'
                        : dm.unread > 0
                        ? 'text-white font-bold hover:bg-white/[0.06]'
                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <div className="relative flex-shrink-0">
                        <span className="text-base leading-none">{user?.avatar || '👤'}</span>
                        {user?.status === 'online' && (
                          <Circle className="absolute -bottom-0.5 -right-0.5 w-2 h-2 fill-green-500 text-green-500 stroke-[#3F0E40] stroke-[2px]" />
                        )}
                      </div>
                      <span className="truncate">{user?.name || 'User'}</span>
                    </div>
                    {dm.unread > 0 && (
                      <span className="bg-[#E01E5A] text-white text-[11px] font-bold px-1.5 py-0.5 rounded min-w-[18px] text-center flex-shrink-0 ml-2">
                        {dm.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Apps Section */}
        <div className="px-3 py-2 mt-4">
          <button className="flex items-center justify-between w-full text-white/70 hover:text-white text-[15px] py-1.5 px-2 hover:bg-white/[0.04] rounded transition-colors duration-100">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-3 h-3 flex-shrink-0 -rotate-90" />
              <span className="font-semibold">Apps</span>
            </div>
            <Plus className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="px-3 py-3 border-t border-white/[0.1] flex-shrink-0">
        <button className="flex items-center gap-2 hover:bg-white/[0.06] rounded px-2 py-1.5 w-full transition-colors duration-150">
          <div className="relative flex-shrink-0">
            <span className="text-2xl leading-none">👤</span>
            <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500 stroke-[#3F0E40] stroke-[2.5px]" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[15px] font-semibold text-white truncate">You</div>
            <div className="text-xs text-white/70">Active</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
