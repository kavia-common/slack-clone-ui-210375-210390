import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ThreadPanel from './components/ThreadPanel';
import { workspaces, users, workspaceData } from './data/mockData';

// PUBLIC_INTERFACE
/**
 * Main Slack clone application component
 * Manages the entire application state and layout including workspace switching
 */
function App() {
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState('ws1');
  const [activeChannel, setActiveChannel] = useState('ch3');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState({});
  const [threads, setThreads] = useState({});

  // Get current workspace object
  const currentWorkspace = workspaces.find((ws) => ws.id === currentWorkspaceId) || workspaces[0];

  // Get workspace-specific data
  const currentWorkspaceData = workspaceData[currentWorkspaceId] || workspaceData.ws1;
  const channels = currentWorkspaceData.channels;
  const directMessages = currentWorkspaceData.directMessages;

  // Initialize messages and threads for current workspace
  useEffect(() => {
    if (currentWorkspaceData) {
      setMessages((prev) => ({
        ...prev,
        [currentWorkspaceId]: currentWorkspaceData.messages,
      }));
      setThreads((prev) => ({
        ...prev,
        [currentWorkspaceId]: currentWorkspaceData.threads,
      }));
    }
  }, [currentWorkspaceId, currentWorkspaceData]);

  // Get current workspace messages and threads
  const workspaceMessages = messages[currentWorkspaceId] || [];
  const workspaceThreads = threads[currentWorkspaceId] || {};

  // Get active channel or DM object
  const activeChannelObj = channels.find((ch) => ch.id === activeChannel);
  const activeDMObj = directMessages.find((dm) => dm.id === activeChannel);
  const activeConversation = activeChannelObj || activeDMObj;

  // Determine if current conversation is a DM
  const isDM = !!activeDMObj;

  // Filter messages for active channel or DM
  const channelMessages = workspaceMessages.filter((msg) => msg.channelId === activeChannel);

  // Get thread data if a thread is open
  const threadParentMessage = activeThreadId 
    ? workspaceMessages.find((msg) => msg.id === activeThreadId)
    : null;
  const threadReplies = activeThreadId ? workspaceThreads[activeThreadId] || [] : [];

  // PUBLIC_INTERFACE
  /**
   * Handle workspace switching
   * @param {string} workspaceId - ID of the workspace to switch to
   */
  const handleWorkspaceSwitch = (workspaceId) => {
    if (workspaceId === currentWorkspaceId) return;

    // Switch workspace
    setCurrentWorkspaceId(workspaceId);

    // Get the new workspace data
    const newWorkspaceData = workspaceData[workspaceId];
    
    // Close any open threads
    setActiveThreadId(null);

    // Reset to first channel of new workspace or find a valid channel
    if (newWorkspaceData && newWorkspaceData.channels.length > 0) {
      // Try to find a channel with the same name, otherwise use the first channel
      const matchingChannel = newWorkspaceData.channels.find(
        (ch) => ch.name === activeChannelObj?.name
      );
      setActiveChannel(matchingChannel ? matchingChannel.id : newWorkspaceData.channels[0].id);
    }

    console.log('Switched to workspace:', workspaceId);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle channel or DM selection
   * @param {string} channelId - ID of the selected channel or DM
   */
  const handleChannelSelect = (channelId) => {
    // Verify the channel or DM exists in the current workspace
    const channelExists = channels.some((ch) => ch.id === channelId);
    const dmExists = directMessages.some((dm) => dm.id === channelId);
    
    if (!channelExists && !dmExists) {
      console.warn('Channel or DM not found in current workspace:', channelId);
      return;
    }

    setActiveChannel(channelId);
    setActiveThreadId(null); // Close thread when switching channels/DMs
  };

  // PUBLIC_INTERFACE
  /**
   * Handle thread opening
   * @param {string} messageId - ID of the message to open thread for
   */
  const handleThreadOpen = (messageId) => {
    setActiveThreadId(messageId);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle thread closing
   */
  const handleThreadClose = () => {
    setActiveThreadId(null);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle adding reaction to a message
   * @param {string} messageId - ID of the message
   * @param {string} emoji - Emoji to add as reaction
   * @param {string} currentUserId - Current user ID (default 'u1')
   */
  const handleReact = (messageId, emoji, currentUserId = 'u1') => {
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages[currentWorkspaceId] = updatedMessages[currentWorkspaceId].map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (existingReactionIndex !== -1) {
            // Reaction exists - toggle user's reaction
            const reaction = reactions[existingReactionIndex];
            const userHasReacted = reaction.users && reaction.users.includes(currentUserId);

            if (userHasReacted) {
              // Remove user from reaction
              const updatedUsers = reaction.users.filter((uid) => uid !== currentUserId);
              if (updatedUsers.length === 0) {
                // Remove reaction entirely if no users left
                return {
                  ...msg,
                  reactions: reactions.filter((r) => r.emoji !== emoji),
                };
              } else {
                // Update count and users
                return {
                  ...msg,
                  reactions: reactions.map((r, idx) =>
                    idx === existingReactionIndex
                      ? { ...r, count: updatedUsers.length, users: updatedUsers }
                      : r
                  ),
                };
              }
            } else {
              // Add user to reaction
              const updatedUsers = [...(reaction.users || []), currentUserId];
              return {
                ...msg,
                reactions: reactions.map((r, idx) =>
                  idx === existingReactionIndex
                    ? { ...r, count: updatedUsers.length, users: updatedUsers }
                    : r
                ),
              };
            }
          } else {
            // New reaction - add it
            return {
              ...msg,
              reactions: [...reactions, { emoji, count: 1, users: [currentUserId] }],
            };
          }
        }
        return msg;
      });
      return updatedMessages;
    });

    // Also update thread replies if the message is in a thread
    setThreads((prevThreads) => {
      const updatedThreads = { ...prevThreads };
      const workspaceThreadsCopy = { ...updatedThreads[currentWorkspaceId] };
      
      Object.keys(workspaceThreadsCopy).forEach((threadId) => {
        workspaceThreadsCopy[threadId] = workspaceThreadsCopy[threadId].map((reply) => {
          if (reply.id === messageId) {
            const reactions = reply.reactions || [];
            const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

            if (existingReactionIndex !== -1) {
              const reaction = reactions[existingReactionIndex];
              const userHasReacted = reaction.users && reaction.users.includes(currentUserId);

              if (userHasReacted) {
                const updatedUsers = reaction.users.filter((uid) => uid !== currentUserId);
                if (updatedUsers.length === 0) {
                  return {
                    ...reply,
                    reactions: reactions.filter((r) => r.emoji !== emoji),
                  };
                } else {
                  return {
                    ...reply,
                    reactions: reactions.map((r, idx) =>
                      idx === existingReactionIndex
                        ? { ...r, count: updatedUsers.length, users: updatedUsers }
                        : r
                    ),
                  };
                }
              } else {
                const updatedUsers = [...(reaction.users || []), currentUserId];
                return {
                  ...reply,
                  reactions: reactions.map((r, idx) =>
                    idx === existingReactionIndex
                      ? { ...r, count: updatedUsers.length, users: updatedUsers }
                      : r
                  ),
                };
              }
            } else {
              return {
                ...reply,
                reactions: [...reactions, { emoji, count: 1, users: [currentUserId] }],
              };
            }
          }
          return reply;
        });
      });
      
      updatedThreads[currentWorkspaceId] = workspaceThreadsCopy;
      return updatedThreads;
    });
  };

  // PUBLIC_INTERFACE
  /**
   * Handle editing a message
   * @param {string} messageId - ID of the message to edit
   * @param {string} newContent - New message content
   */
  const handleEditMessage = (messageId, newContent) => {
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages[currentWorkspaceId] = updatedMessages[currentWorkspaceId].map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      );
      return updatedMessages;
    });
    
    // Also update thread replies if the message is in a thread
    setThreads((prevThreads) => {
      const updatedThreads = { ...prevThreads };
      const workspaceThreadsCopy = { ...updatedThreads[currentWorkspaceId] };
      
      Object.keys(workspaceThreadsCopy).forEach((threadId) => {
        workspaceThreadsCopy[threadId] = workspaceThreadsCopy[threadId].map((reply) =>
          reply.id === messageId
            ? { ...reply, content: newContent, isEdited: true }
            : reply
        );
      });
      
      updatedThreads[currentWorkspaceId] = workspaceThreadsCopy;
      return updatedThreads;
    });
  };

  // PUBLIC_INTERFACE
  /**
   * Handle deleting a message
   * @param {string} messageId - ID of the message to delete
   */
  const handleDeleteMessage = (messageId) => {
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages[currentWorkspaceId] = updatedMessages[currentWorkspaceId].filter(
        (msg) => msg.id !== messageId
      );
      return updatedMessages;
    });
    
    // Also remove from threads if needed
    setThreads((prevThreads) => {
      const updatedThreads = { ...prevThreads };
      const workspaceThreadsCopy = { ...updatedThreads[currentWorkspaceId] };
      
      Object.keys(workspaceThreadsCopy).forEach((threadId) => {
        workspaceThreadsCopy[threadId] = workspaceThreadsCopy[threadId].filter(
          (reply) => reply.id !== messageId
        );
      });
      
      // Remove thread entry if parent message is deleted
      if (workspaceThreadsCopy[messageId]) {
        delete workspaceThreadsCopy[messageId];
      }
      
      updatedThreads[currentWorkspaceId] = workspaceThreadsCopy;
      return updatedThreads;
    });
    
    // Close thread panel if the parent message was deleted
    if (activeThreadId === messageId) {
      setActiveThreadId(null);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle sending a new message to channel or DM
   * @param {string} content - Message content to send
   * @param {Array} attachments - Optional array of attachment objects
   */
  const handleSendMessage = (content, attachments = []) => {
    if (!content.trim() && attachments.length === 0) return;

    // Generate a unique message ID
    const newMessageId = `m${Date.now()}`;
    
    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timestamp = `${displayHours}:${displayMinutes} ${ampm}`;

    // Create new message object
    const newMessage = {
      id: newMessageId,
      workspaceId: currentWorkspaceId,
      userId: 'u1', // Current user (Sarah Chen from mockData)
      channelId: activeChannel,
      content: content.trim(),
      timestamp: timestamp,
      reactions: [],
      replies: 0,
      isThreaded: false,
      hasAttachment: attachments.length > 0,
      attachments: attachments,
    };

    // Add message to state
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      if (!updatedMessages[currentWorkspaceId]) {
        updatedMessages[currentWorkspaceId] = [];
      }
      updatedMessages[currentWorkspaceId] = [...updatedMessages[currentWorkspaceId], newMessage];
      return updatedMessages;
    });

    console.log('Message sent to', isDM ? 'DM' : 'channel', ':', newMessage);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle sending a reply in a thread
   * @param {string} threadId - ID of the thread (parent message ID)
   * @param {string} content - Reply content
   */
  const handleSendThreadReply = (threadId, content) => {
    if (!content.trim()) return;

    const replyId = `t${threadId}-${Date.now()}`;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timestamp = `${displayHours}:${displayMinutes} ${ampm}`;

    const newReply = {
      id: replyId,
      userId: 'u1',
      content: content.trim(),
      timestamp: timestamp,
      reactions: [],
    };

    // Add reply to thread
    setThreads((prevThreads) => {
      const updatedThreads = { ...prevThreads };
      if (!updatedThreads[currentWorkspaceId]) {
        updatedThreads[currentWorkspaceId] = {};
      }
      if (!updatedThreads[currentWorkspaceId][threadId]) {
        updatedThreads[currentWorkspaceId][threadId] = [];
      }
      updatedThreads[currentWorkspaceId][threadId] = [
        ...updatedThreads[currentWorkspaceId][threadId],
        newReply,
      ];
      return updatedThreads;
    });

    // Update parent message reply count
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages[currentWorkspaceId] = updatedMessages[currentWorkspaceId].map((msg) =>
        msg.id === threadId
          ? { ...msg, replies: (msg.replies || 0) + 1, isThreaded: true }
          : msg
      );
      return updatedMessages;
    });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeChannel={activeChannel}
        onChannelSelect={handleChannelSelect}
        channels={channels}
        directMessages={directMessages}
        users={users}
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        onWorkspaceSwitch={handleWorkspaceSwitch}
      />

      {/* Main Chat Area */}
      <ChatArea
        activeChannel={activeConversation}
        isDM={isDM}
        messages={channelMessages}
        users={users}
        onThreadOpen={handleThreadOpen}
        onReact={handleReact}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onSendMessage={handleSendMessage}
      />

      {/* Right Thread Panel (conditional) */}
      {activeThreadId && (
        <ThreadPanel
          threadId={activeThreadId}
          parentMessage={threadParentMessage}
          replies={threadReplies}
          users={users}
          onClose={handleThreadClose}
          onReact={handleReact}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onSendReply={handleSendThreadReply}
        />
      )}
    </div>
  );
}

export default App;
