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

  // Get active channel object
  const activeChannelObj = channels.find((ch) => ch.id === activeChannel) || channels[0];

  // Filter messages for active channel
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
   * Handle channel selection
   * @param {string} channelId - ID of the selected channel
   */
  const handleChannelSelect = (channelId) => {
    // Verify the channel exists in the current workspace
    const channelExists = channels.some((ch) => ch.id === channelId);
    if (!channelExists) {
      console.warn('Channel not found in current workspace:', channelId);
      return;
    }

    setActiveChannel(channelId);
    setActiveThreadId(null); // Close thread when switching channels
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
   */
  const handleReact = (messageId, emoji) => {
    // In a real app, this would update the backend
    console.log('Adding reaction:', emoji, 'to message:', messageId);
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
        activeChannel={activeChannelObj}
        messages={channelMessages}
        users={users}
        onThreadOpen={handleThreadOpen}
        onReact={handleReact}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
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
        />
      )}
    </div>
  );
}

export default App;
