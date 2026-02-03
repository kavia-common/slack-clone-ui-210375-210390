import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ThreadPanel from './components/ThreadPanel';
import { workspaces, users, channels, directMessages, messages as initialMessages, threads as initialThreads } from './data/mockData';

// PUBLIC_INTERFACE
/**
 * Main Slack clone application component
 * Manages the entire application state and layout
 */
function App() {
  const [activeChannel, setActiveChannel] = useState('ch3');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [currentWorkspace] = useState(workspaces[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [threads, setThreads] = useState(initialThreads);

  // Get active channel object
  const activeChannelObj = channels.find((ch) => ch.id === activeChannel) || channels[0];

  // Filter messages for active channel
  const channelMessages = messages.filter((msg) => msg.channelId === activeChannel);

  // Get thread data if a thread is open
  const threadParentMessage = activeThreadId 
    ? messages.find((msg) => msg.id === activeThreadId)
    : null;
  const threadReplies = activeThreadId ? threads[activeThreadId] || [] : [];

  // PUBLIC_INTERFACE
  /**
   * Handle channel selection
   * @param {string} channelId - ID of the selected channel
   */
  const handleChannelSelect = (channelId) => {
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
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent, isEdited: true }
          : msg
      )
    );
    
    // Also update thread replies if the message is in a thread
    setThreads((prevThreads) => {
      const updatedThreads = { ...prevThreads };
      Object.keys(updatedThreads).forEach((threadId) => {
        updatedThreads[threadId] = updatedThreads[threadId].map((reply) =>
          reply.id === messageId
            ? { ...reply, content: newContent, isEdited: true }
            : reply
        );
      });
      return updatedThreads;
    });
  };

  // PUBLIC_INTERFACE
  /**
   * Handle deleting a message
   * @param {string} messageId - ID of the message to delete
   */
  const handleDeleteMessage = (messageId) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
    
    // Also remove from threads if needed
    setThreads((prevThreads) => {
      const updatedThreads = { ...prevThreads };
      Object.keys(updatedThreads).forEach((threadId) => {
        updatedThreads[threadId] = updatedThreads[threadId].filter((reply) => reply.id !== messageId);
      });
      // Remove thread entry if parent message is deleted
      if (updatedThreads[messageId]) {
        delete updatedThreads[messageId];
      }
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
