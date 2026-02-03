import React, { useState } from 'react';
import { MoreVertical, MessageSquare, Smile } from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Message component displaying a single chat message with reactions, threading, and actions
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object
 * @param {Object} props.user - User who sent the message
 * @param {Function} props.onReact - Callback for adding reaction
 * @param {Function} props.onThreadOpen - Callback for opening thread
 */
const Message = ({ message, user, onReact, onThreadOpen }) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const quickEmojis = ['👍', '❤️', '😂', '🎉', '🚀', '👀'];

  return (
    <div
      className="group hover:bg-gray-50 px-4 py-2 transition-colors relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded flex items-center justify-center text-xl bg-gradient-to-br from-slack-retro-purple to-slack-retro-pink">
            {user?.avatar || '👤'}
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-gray-900 text-sm">{user?.name || 'Unknown'}</span>
            <span className="text-xs text-gray-500">{message.timestamp}</span>
          </div>

          {/* Message Text */}
          <div className="text-sm text-gray-900 break-words">
            {message.hasMention && (
              <span className="bg-blue-100 text-blue-800 px-1 rounded">@mentioned</span>
            )}
            {message.hasCodeBlock ? (
              <pre className="bg-gray-100 border border-gray-300 rounded p-3 mt-1 overflow-x-auto text-xs font-mono">
                {message.content}
              </pre>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {/* Attachment Preview */}
          {message.hasAttachment && message.attachmentType === 'link' && (
            <div className="mt-2 border border-gray-300 rounded p-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-xs text-gray-500 mb-1">Link preview</div>
              <div className="text-sm font-semibold text-blue-600">Figma Design</div>
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, idx) => (
                <button
                  key={idx}
                  onClick={() => onReact(message.id, reaction.emoji)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50 transition-colors text-xs"
                >
                  <span>{reaction.emoji}</span>
                  <span className="font-semibold text-gray-700">{reaction.count}</span>
                </button>
              ))}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50 transition-colors"
              >
                <Smile className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          )}

          {/* Thread Reply Count */}
          {message.isThreaded && message.replies > 0 && (
            <button
              onClick={() => onThreadOpen(message.id)}
              className="flex items-center gap-2 mt-2 text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{message.replies} {message.replies === 1 ? 'reply' : 'replies'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      {showActions && (
        <div className="absolute top-0 right-4 bg-white border border-gray-300 rounded-lg shadow-lg flex items-center gap-1 px-1 py-1">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(message.id, emoji)}
              className="hover:bg-gray-100 rounded px-2 py-1 text-base transition-colors"
            >
              {emoji}
            </button>
          ))}
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button
            onClick={() => onThreadOpen(message.id)}
            className="hover:bg-gray-100 rounded p-1 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-gray-600" />
          </button>
          <button className="hover:bg-gray-100 rounded p-1 transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Quick Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 mb-2 bg-white border border-gray-300 rounded-lg shadow-xl p-2 grid grid-cols-4 gap-1 z-10">
          {['👍', '❤️', '😂', '🎉', '🚀', '👀', '🔥', '✅', '💯', '🙌', '👏', '💪'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReact(message.id, emoji);
                setShowEmojiPicker(false);
              }}
              className="hover:bg-gray-100 rounded p-2 text-xl transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;
