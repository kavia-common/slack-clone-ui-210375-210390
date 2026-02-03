import React, { useState, useRef, useEffect } from 'react';
import { Hash, Lock, ChevronDown, Plus, MessageSquare, Edit3, AtSign, Bookmark, MoreHorizontal, MessageCircle, Circle, User, Settings, HelpCircle, LogOut, Check } from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Sidebar component displaying workspace navigation, channels, and direct messages
 * Replicates Slack's sidebar design with exact colors, spacing, and typography
 * @param {Object} props - Component props
 * @param {boolean} props.isCollapsed - Whether sidebar is collapsed
 * @param {Function} props.onToggleCollapse - Callback to toggle collapse state
 * @param {string} props.activeChannel - Currently active channel ID
 * @param {Function} props.onChannelSelect - Callback when channel is selected
 * @param {Array} props.channels - List of channels
 * @param {Array} props.directMessages - List of direct messages
 * @param {Array} props.users - List of users
 * @param {Object} props.currentWorkspace - Current workspace object
 * @param {Array} props.workspaces - List of all workspaces
 * @param {Function} props.onWorkspaceSwitch - Callback when workspace is switched
 */
const Sidebar = ({ 
  isCollapsed, 
  onToggleCollapse, 
  activeChannel, 
  onChannelSelect,
  channels,
  directMessages,
  users,
  currentWorkspace,
  workspaces,
  onWorkspaceSwitch
}) => {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const workspaceSwitcherRef = useRef(null);

  // Mock current user (in a real app, this would come from auth context)
  const currentUser = users[0]; // Using first user as the logged-in user

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileMenuOpen]);

  // Close workspace switcher when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceSwitcherRef.current && !workspaceSwitcherRef.current.contains(event.target)) {
        setWorkspaceSwitcherOpen(false);
      }
    };

    if (workspaceSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [workspaceSwitcherOpen]);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-[#3F0E40] flex flex-col items-center py-4 custom-scrollbar-dark overflow-y-auto">
        <button
          onClick={onToggleCollapse}
          className="text-white text-2xl hover:bg-white/[0.06] w-10 h-10 rounded flex items-center justify-center mb-4 transition-colors duration-150"
        >
          {currentWorkspace?.icon || '🚀'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-[260px] bg-[#3F0E40] text-white flex flex-col custom-scrollbar-dark h-screen">
      {/* Workspace Header */}
      <div className="px-4 py-3 bg-[#350d36] border-b border-white/[0.1] flex-shrink-0 relative h-[58px] flex items-center" ref={workspaceSwitcherRef}>
        <button 
          onClick={() => setWorkspaceSwitcherOpen(!workspaceSwitcherOpen)}
          className="flex items-center justify-between w-full hover:bg-white/[0.06] rounded px-2 py-1 transition-colors duration-150"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center text-2xl flex-shrink-0">
              {currentWorkspace?.icon || '🚀'}
            </div>
            <span className="font-black text-white truncate text-[18px] tracking-tight leading-[1.2]">
              {currentWorkspace?.name || 'Workspace'}
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-white/70 flex-shrink-0" />
        </button>

        {/* Workspace Switcher Dropdown */}
        {workspaceSwitcherOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 min-w-[300px]">
            {/* Current Workspace Section */}
            <div className="pt-3 pb-2 px-0">
              <div className="px-5 pb-2">
                <div className="text-[13px] font-bold text-gray-500 uppercase tracking-wide leading-tight">
                  Current Workspace
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 rounded-md">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-success rounded flex items-center justify-center text-xl flex-shrink-0">
                    {currentWorkspace?.icon || '🚀'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-gray-900 truncate flex items-center gap-1.5 leading-tight">
                      {currentWorkspace?.name || 'Workspace'}
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    </div>
                    <div className="text-[13px] text-gray-600 leading-tight mt-0.5">
                      {currentWorkspace?.isPremium ? 'Premium Plan' : 'Free Plan'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-200 my-2" />

            {/* Other Workspaces Section */}
            {workspaces && workspaces.filter(ws => ws.id !== currentWorkspace?.id).length > 0 && (
              <>
                <div className="py-1">
                  <div className="px-5 py-2">
                    <div className="text-[13px] font-bold text-gray-500 uppercase tracking-wide leading-tight">
                      Your Workspaces
                    </div>
                  </div>
                  {workspaces
                    .filter(ws => ws.id !== currentWorkspace?.id)
                    .map((workspace) => (
                      <button
                        key={workspace.id}
                        onClick={() => {
                          onWorkspaceSwitch(workspace.id);
                          setWorkspaceSwitcherOpen(false);
                        }}
                        className="w-full px-5 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-100"
                      >
                        <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-xl flex-shrink-0">
                          {workspace.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-bold text-gray-900 truncate leading-tight">
                            {workspace.name}
                          </div>
                          <div className="text-[13px] text-gray-600 leading-tight mt-0.5">
                            {workspace.isPremium ? 'Premium Plan' : 'Free Plan'}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                {/* Separator */}
                <div className="h-px bg-gray-200 my-2" />
              </>
            )}

            {/* Actions Section */}
            <div className="py-2">
              <button 
                onClick={() => {
                  console.log('Create new workspace');
                  setWorkspaceSwitcherOpen(false);
                }}
                className="w-full px-5 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-100"
              >
                <div className="w-9 h-9 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-gray-900 leading-tight">Create a workspace</div>
                  <div className="text-[13px] text-gray-600 leading-tight mt-0.5">Start fresh with a new team</div>
                </div>
              </button>
              <button 
                onClick={() => {
                  console.log('Join workspace');
                  setWorkspaceSwitcherOpen(false);
                }}
                className="w-full px-5 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-100"
              >
                <div className="w-9 h-9 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-gray-900 leading-tight">Join a workspace</div>
                  <div className="text-[13px] text-gray-600 leading-tight mt-0.5">Connect with an existing team</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-dark">
        {/* Primary Navigation Items */}
        <div className="px-3 pt-2 pb-1 space-y-0.5">
          {/* Threads */}
          <button className="w-full flex items-center justify-between px-2 py-1.5 rounded text-[15px] leading-[1.4] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-[18px] h-[18px] flex-shrink-0 stroke-2" />
              <span>Threads</span>
            </div>
          </button>

          {/* Drafts */}
          <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-[15px] leading-[1.4] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150">
            <Edit3 className="w-[18px] h-[18px] flex-shrink-0 stroke-2" />
            <span>Drafts</span>
          </button>

          {/* All DMs */}
          <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-[15px] leading-[1.4] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150">
            <MessageSquare className="w-[18px] h-[18px] flex-shrink-0 stroke-2" />
            <span>All DMs</span>
          </button>

          {/* Mentions & reactions */}
          <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-[15px] leading-[1.4] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150">
            <AtSign className="w-[18px] h-[18px] flex-shrink-0 stroke-2" />
            <span>Mentions & reactions</span>
          </button>

          {/* Saved items */}
          <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-[15px] leading-[1.4] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150">
            <Bookmark className="w-[18px] h-[18px] flex-shrink-0 stroke-2" />
            <span>Saved items</span>
          </button>

          {/* More */}
          <button className="w-full flex items-center gap-3 px-2 py-1.5 rounded text-[15px] leading-[1.4] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-150">
            <MoreHorizontal className="w-[18px] h-[18px] flex-shrink-0 stroke-2" />
            <span>More</span>
          </button>
        </div>

        {/* Channels Section */}
        <div className="px-3 pt-4 pb-1">
          <button 
            onClick={() => setChannelsExpanded(!channelsExpanded)}
            className="flex items-center justify-between w-full text-white/70 hover:text-white text-[13px] leading-[1.3] font-bold py-2 px-2 hover:bg-white/[0.04] rounded transition-colors duration-150"
          >
            <div className="flex items-center gap-2">
              <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${!channelsExpanded ? '-rotate-90' : ''}`} />
              <span>Channels</span>
            </div>
            <Plus className="w-4 h-4 flex-shrink-0" />
          </button>
          {channelsExpanded && (
            <div className="mt-1 space-y-0.5">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[15px] leading-[1.4] transition-all duration-150 ${
                    activeChannel === channel.id
                      ? 'bg-[#1164A3] text-white font-bold'
                      : channel.unread > 0
                      ? 'text-white font-bold hover:bg-white/[0.08]'
                      : 'text-white/70 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate min-w-0">
                    {channel.isPrivate ? (
                      <Lock className="w-[16px] h-[16px] flex-shrink-0 stroke-2" />
                    ) : (
                      <Hash className="w-[16px] h-[16px] flex-shrink-0 stroke-2 font-bold" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span className="bg-white text-[#3F0E40] text-[11px] leading-[1] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center flex-shrink-0 ml-2">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Direct Messages Section */}
        <div className="px-3 pt-4 pb-1">
          <button 
            onClick={() => setDmsExpanded(!dmsExpanded)}
            className="flex items-center justify-between w-full text-white/70 hover:text-white text-[13px] leading-[1.3] font-bold py-2 px-2 hover:bg-white/[0.04] rounded transition-colors duration-150"
          >
            <div className="flex items-center gap-2">
              <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${!dmsExpanded ? '-rotate-90' : ''}`} />
              <span>Direct messages</span>
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
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[15px] leading-[1.4] transition-all duration-150 ${
                      activeChannel === dm.id
                        ? 'bg-[#1164A3] text-white font-bold'
                        : dm.unread > 0
                        ? 'text-white font-bold hover:bg-white/[0.08]'
                        : 'text-white/70 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate min-w-0">
                      <div className="relative flex-shrink-0">
                        <span className="text-base leading-none block">{user?.avatar || '👤'}</span>
                        {user?.status === 'online' && (
                          <Circle className="absolute -bottom-0.5 -right-0.5 w-[6px] h-[6px] fill-[#2BAC76] text-[#2BAC76] stroke-[#3F0E40] stroke-[2px]" />
                        )}
                      </div>
                      <span className="truncate">{user?.name || 'User'}</span>
                    </div>
                    {dm.unread > 0 && (
                      <span className="bg-[#E01E5A] text-white text-[11px] leading-[1] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center flex-shrink-0 ml-2">
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
        <div className="px-3 pt-4 pb-2">
          <button className="flex items-center justify-between w-full text-white/70 hover:text-white text-[13px] leading-[1.3] font-bold py-2 px-2 hover:bg-white/[0.04] rounded transition-colors duration-150">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-3 h-3 flex-shrink-0 -rotate-90" />
              <span>Apps</span>
            </div>
            <Plus className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="px-3 py-2.5 border-t border-white/[0.1] flex-shrink-0 relative" ref={profileMenuRef}>
        <button 
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="flex items-center gap-2.5 hover:bg-white/[0.06] rounded px-2 py-1.5 w-full transition-colors duration-150"
        >
          <div className="relative flex-shrink-0">
            <span className="text-2xl leading-none">{currentUser?.avatar || '👤'}</span>
            <Circle className={`absolute bottom-0 right-0 w-3 h-3 fill-[#2BAC76] text-[#2BAC76] stroke-[#3F0E40] stroke-[2.5px] ${currentUser?.status === 'online' ? 'block' : 'hidden'}`} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[15px] font-semibold text-white truncate leading-[1.4]">{currentUser?.name || 'User'}</div>
            <div className="text-xs text-white/70 capitalize">{currentUser?.status || 'Active'}</div>
          </div>
        </button>

        {/* Profile Dropdown Menu */}
        {profileMenuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-50">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-3xl leading-none">{currentUser?.avatar || '👤'}</span>
                  <Circle className={`absolute bottom-0 right-0 w-3 h-3 fill-[#2BAC76] text-[#2BAC76] stroke-white stroke-[2.5px] ${currentUser?.status === 'online' ? 'block' : 'hidden'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-gray-900 truncate">{currentUser?.name || 'User'}</div>
                  <div className="text-xs text-gray-600">{currentUser?.title || 'Team Member'}</div>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </div>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition-colors">
                <Circle className="w-3 h-3 fill-[#2BAC76] text-[#2BAC76]" />
                <span>Active</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition-colors">
                <Circle className="w-3 h-3 fill-gray-400 text-gray-400" />
                <span>Away</span>
              </button>
            </div>

            <div className="border-t border-gray-200 my-1" />

            {/* Menu Options */}
            <div className="py-1">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition-colors">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Preferences</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 text-gray-700 transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </button>
            </div>

            <div className="border-t border-gray-200 my-1" />

            {/* Sign Out */}
            <div className="py-1">
              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 text-red-600 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign out of {currentWorkspace?.name || 'Workspace'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
