import React, { useState } from 'react';
import { Send, Smile, Paperclip, AtSign, Hash, Bold, Italic, Strikethrough, Code } from 'lucide-react';
import Message from './Message';

// PUBLIC_INTERFACE
/**
 * ChatArea component displaying the main chat interface with messages and input
 * @param {Object} props - Component props
 * @param {Object} props.activeChannel - Currently active channel
 * @param {Array} props.messages - List of messages to display
 * @param {Array} props.users - List of all users
 * @param {Function} props.onThreadOpen - Callback when thread is opened
 * @param {Function} props.onReact - Callback when reaction is added
 * @param {Function} props.onEditMessage - Callback when message is edited
 * @param {Function} props.onDeleteMessage - Callback when message is deleted
 */
const ChatArea = ({ activeChannel, messages, users, onThreadOpen, onReact, onEditMessage, onDeleteMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [showFormatting, setShowFormatting] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const getUserById = (userId) => users.find((u) => u.id === userId);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel Header */}
      <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-gray-600" />
          <h2 className="font-bold text-gray-900">{activeChannel?.name || 'channel'}</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden sm:inline">{activeChannel?.members || 0} members</span>
          <div className="w-px h-4 bg-gray-300 hidden sm:block" />
          <span className="hidden sm:inline">{activeChannel?.description || ''}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Channel Intro */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-primary via-slack-retro-purple to-slack-retro-pink rounded-lg flex items-center justify-center text-3xl">
              #
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">#{activeChannel?.name || 'channel'}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {activeChannel?.description || 'This is the beginning of the channel'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="py-2">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              user={getUserById(message.userId)}
              onReact={onReact}
              onThreadOpen={onThreadOpen}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))}
        </div>
      </div>

      {/* Message Input Area */}
      <div className="px-4 pb-6 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition-colors">
          {/* Formatting Toolbar */}
          {showFormatting && (
            <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200">
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Bold">
                <Bold className="w-4 h-4 text-gray-600" />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Italic">
                <Italic className="w-4 h-4 text-gray-600" />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Strikethrough">
                <Strikethrough className="w-4 h-4 text-gray-600" />
              </button>
              <button type="button" className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Code">
                <Code className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

          {/* Input Field */}
          <div className="flex items-end gap-2 p-3">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onFocus={() => setShowFormatting(true)}
              placeholder={`Message #${activeChannel?.name || 'channel'}`}
              className="flex-1 resize-none outline-none text-sm min-h-[40px] max-h-[200px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <div className="flex items-center gap-1 pb-1">
              <button
                type="button"
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Add emoji"
              >
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Mention"
              >
                <AtSign className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-1.5 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
                title="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
