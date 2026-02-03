import React, { useState, useRef } from 'react';
import { Send, Smile, Paperclip, AtSign, Hash, Bold, Italic, Strikethrough, Code, Info, Star, UserPlus, Settings, Phone, Video, X, File, Image as ImageIcon } from 'lucide-react';
import Message from './Message';

// PUBLIC_INTERFACE
/**
 * ChatArea component displaying the main chat interface with messages and input
 * @param {Object} props - Component props
 * @param {Object} props.activeChannel - Currently active channel or DM
 * @param {boolean} props.isDM - Whether current conversation is a DM
 * @param {Array} props.messages - List of messages to display
 * @param {Array} props.users - List of all users
 * @param {Function} props.onThreadOpen - Callback when thread is opened
 * @param {Function} props.onReact - Callback when reaction is added
 * @param {Function} props.onEditMessage - Callback when message is edited
 * @param {Function} props.onDeleteMessage - Callback when message is deleted
 * @param {Function} props.onSendMessage - Callback when a new message is sent
 */
const ChatArea = ({ activeChannel, isDM = false, messages, users, onThreadOpen, onReact, onEditMessage, onDeleteMessage, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [showFormatting, setShowFormatting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get user object for DM
  const dmUser = isDM && activeChannel?.userId 
    ? users.find((u) => u.id === activeChannel.userId)
    : null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((messageText.trim() || attachments.length > 0) && onSendMessage) {
      onSendMessage(messageText, attachments);
      setMessageText('');
      setAttachments([]);
      setShowFormatting(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    setAttachments([...attachments, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (attachmentId) => {
    setAttachments(attachments.filter((att) => att.id !== attachmentId));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getUserById = (userId) => users.find((u) => u.id === userId);

  // Determine display name for header
  const displayName = isDM && dmUser 
    ? dmUser.name 
    : activeChannel?.name || 'channel';

  // Determine placeholder text
  const placeholderText = isDM 
    ? `Message ${dmUser?.name || 'user'}` 
    : `Message #${activeChannel?.name || 'channel'}`;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel/DM Header */}
      <div className="h-14 border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {isDM ? (
            <>
              <div className="text-2xl">{dmUser?.avatar || '👤'}</div>
              <h2 className="font-bold text-gray-900">{displayName}</h2>
            </>
          ) : (
            <>
              <Hash className="w-5 h-5 text-gray-600" />
              <h2 className="font-bold text-gray-900">{displayName}</h2>
              <button 
                className="p-1 hover:bg-gray-100 rounded transition-colors" 
                title="Star channel"
              >
                <Star className="w-4 h-4 text-gray-500" />
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-2 hover:bg-gray-100 rounded transition-colors" 
            title="Start call"
          >
            <Phone className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded transition-colors" 
            title="Start video call"
          >
            <Video className="w-4 h-4 text-gray-600" />
          </button>
          {!isDM && (
            <>
              <div className="w-px h-5 bg-gray-300 mx-1" />
              <button 
                className="p-2 hover:bg-gray-100 rounded transition-colors" 
                title="Add members"
              >
                <UserPlus className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded transition-colors" 
                title="Channel details"
              >
                <Info className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded transition-colors" 
                title="Channel settings"
              >
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Channel/DM Intro */}
        <div className="px-4 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            {isDM ? (
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-slack-retro-purple to-slack-retro-pink rounded-lg flex items-center justify-center text-4xl">
                {dmUser?.avatar || '👤'}
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-slack-retro-purple to-slack-retro-pink rounded-lg flex items-center justify-center text-3xl">
                #
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {isDM ? displayName : `#${displayName}`}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isDM 
                  ? `This is the beginning of your direct message history with ${dmUser?.name || 'this user'}.`
                  : (activeChannel?.description || 'This is the beginning of the channel')
                }
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
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="px-3 pt-3 pb-2 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <div 
                    key={attachment.id}
                    className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2 max-w-[250px]"
                  >
                    {attachment.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    ) : (
                      <File className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {attachment.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                      title="Remove attachment"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              ref={textareaRef}
              value={messageText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowFormatting(true)}
              placeholder={placeholderText}
              className="flex-1 resize-none outline-none text-sm min-h-[40px] max-h-[200px] overflow-y-auto"
              rows={1}
              style={{ lineHeight: '1.5' }}
            />
            <div className="flex items-center gap-1 pb-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                onClick={handleAttachClick}
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
                disabled={!messageText.trim() && attachments.length === 0}
                className="p-1.5 bg-primary hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
                title="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Helper Text */}
          {showFormatting && (
            <div className="px-3 pb-2 text-xs text-gray-500">
              <span className="font-semibold">Shift + Enter</span> to add a new line
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
