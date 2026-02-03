import React, { useState, useRef } from 'react';
import { X, Send, Smile } from 'lucide-react';
import Message from './Message';

// PUBLIC_INTERFACE
/**
 * ThreadPanel component for displaying threaded message replies
 * @param {Object} props - Component props
 * @param {string} props.threadId - ID of the thread message
 * @param {Object} props.parentMessage - Parent message object
 * @param {Array} props.replies - List of reply messages
 * @param {Array} props.users - List of all users
 * @param {Function} props.onClose - Callback to close the thread panel
 * @param {Function} props.onReact - Callback for adding reaction
 * @param {Function} props.onEditMessage - Callback for editing message
 * @param {Function} props.onDeleteMessage - Callback for deleting message
 * @param {Function} props.onSendReply - Callback for sending a reply
 */
const ThreadPanel = ({ threadId, parentMessage, replies, users, onClose, onReact, onEditMessage, onDeleteMessage, onSendReply }) => {
  const [replyText, setReplyText] = useState('');
  const textareaRef = useRef(null);

  const getUserById = (userId) => users.find((u) => u.id === userId);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (replyText.trim() && onSendReply) {
      onSendReply(threadId, replyText);
      setReplyText('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply(e);
    }
  };

  const handleTextChange = (e) => {
    setReplyText(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  if (!parentMessage) return null;

  return (
    <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
      {/* Thread Header */}
      <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-gray-900">Thread</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Thread Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Parent Message */}
        <div className="border-b border-gray-200">
          <Message
            message={parentMessage}
            user={getUserById(parentMessage.userId)}
            onReact={onReact}
            onThreadOpen={() => {}}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
          />
        </div>

        {/* Thread Replies */}
        <div className="py-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-600">
            {replies?.length || 0} {replies?.length === 1 ? 'reply' : 'replies'}
          </div>
          {replies?.map((reply) => (
            <Message
              key={reply.id}
              message={reply}
              user={getUserById(reply.userId)}
              onReact={onReact}
              onThreadOpen={() => {}}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))}
        </div>
      </div>

      {/* Reply Input */}
      <div className="px-4 pb-4 border-t border-gray-200 pt-4 flex-shrink-0">
        <form onSubmit={handleSendReply} className="border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition-colors">
          <div className="flex items-end gap-2 p-3">
            <textarea
              ref={textareaRef}
              value={replyText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Reply..."
              className="flex-1 resize-none outline-none text-sm min-h-[40px] max-h-[120px] overflow-y-auto"
              rows={1}
              style={{ lineHeight: '1.5' }}
            />
            <div className="flex items-center gap-1 pb-1">
              <button
                type="button"
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Add emoji"
              >
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="p-1.5 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
                title="Send reply"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <div className="px-3 pb-2 text-xs text-gray-500">
            <span className="font-semibold">Shift + Enter</span> to add a new line
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThreadPanel;
