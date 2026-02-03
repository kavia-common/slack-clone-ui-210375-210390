import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, MessageSquare, Smile, Edit2, Trash2, Check, X } from 'lucide-react';

// PUBLIC_INTERFACE
/**
 * Message component displaying a single chat message with reactions, threading, and actions
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object
 * @param {Object} props.user - User who sent the message
 * @param {Function} props.onReact - Callback for adding reaction
 * @param {Function} props.onThreadOpen - Callback for opening thread
 * @param {Function} props.onEdit - Callback for editing message
 * @param {Function} props.onDelete - Callback for deleting message
 * @param {string} props.currentUserId - Current logged-in user ID
 */
const Message = ({ message, user, onReact, onThreadOpen, onEdit, onDelete, currentUserId = 'u1' }) => {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const editTextareaRef = useRef(null);
  const moreMenuRef = useRef(null);

  const quickEmojis = ['👍', '❤️', '😂', '🎉', '🚀', '👀'];
  const isOwnMessage = message.userId === currentUserId;

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.select();
    }
  }, [isEditing]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMoreMenu]);

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== message.content) {
      onEdit(message.id, editText.trim());
    }
    setIsEditing(false);
    setEditText(message.content);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText(message.content);
  };

  const handleDelete = () => {
    onDelete(message.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className="group hover:bg-gray-50 px-4 py-2 transition-colors relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        if (!showMoreMenu && !isEditing && !showDeleteConfirm) {
          setShowActions(false);
          setShowEmojiPicker(false);
        }
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
            {message.isEdited && (
              <span className="text-xs text-gray-500 italic">(edited)</span>
            )}
          </div>

          {/* Message Text or Edit Mode */}
          {isEditing ? (
            <div className="mb-2">
              <textarea
                ref={editTextareaRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full border-2 border-blue-500 rounded p-2 text-sm resize-none focus:outline-none"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEditSubmit();
                  } else if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleEditSubmit}
                  className="px-3 py-1 bg-primary text-white rounded hover:bg-blue-600 text-sm font-medium flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <span className="text-xs text-gray-500 ml-2">
                  Press Enter to save, Esc to cancel
                </span>
              </div>
            </div>
          ) : (
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
          )}

          {/* Attachment Preview */}
          {!isEditing && message.hasAttachment && message.attachmentType === 'link' && (
            <div className="mt-2 border border-gray-300 rounded p-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-xs text-gray-500 mb-1">Link preview</div>
              <div className="text-sm font-semibold text-blue-600">Figma Design</div>
            </div>
          )}

          {/* Reactions */}
          {!isEditing && message.reactions && message.reactions.length > 0 && (
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
          {!isEditing && message.isThreaded && message.replies > 0 && (
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

      {/* Hover Actions Bar */}
      {showActions && !isEditing && (
        <div className="absolute top-0 right-4 bg-white border border-gray-300 rounded-lg shadow-lg flex items-center gap-1 px-1 py-1 z-20">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(message.id, emoji)}
              className="hover:bg-gray-100 rounded px-2 py-1 text-base transition-colors"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <button
            onClick={() => onThreadOpen(message.id)}
            className="hover:bg-gray-100 rounded p-1 transition-colors"
            title="Reply in thread"
          >
            <MessageSquare className="w-4 h-4 text-gray-600" />
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="hover:bg-gray-100 rounded p-1 transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* More Actions Dropdown Menu */}
            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl py-1 min-w-[160px] z-30">
                {isOwnMessage && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMoreMenu(false);
                        setShowActions(true);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit message
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMoreMenu(false);
                        setShowActions(true);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete message
                    </button>
                    <div className="border-t border-gray-200 my-1" />
                  </>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(message.content);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-700"
                >
                  Copy text
                </button>
                <button
                  onClick={() => {
                    console.log('Copy link to message:', message.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-gray-700"
                >
                  Copy link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute top-full left-4 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-30 min-w-[280px]">
          <h4 className="font-bold text-gray-900 mb-2">Delete message?</h4>
          <p className="text-sm text-gray-600 mb-4">
            This message will be deleted for everyone. This can't be undone.
          </p>
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setShowActions(false);
              }}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Quick Emoji Picker */}
      {showEmojiPicker && !isEditing && (
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
