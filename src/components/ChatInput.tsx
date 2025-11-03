import React, { useState, KeyboardEvent } from 'react';
import { Send, LifeBuoy } from 'lucide-react';
import { VoiceControls } from './VoiceControls';

interface ChatInputProps {
  onSendMessage: (message: string, type?: 'text' | 'voice') => void;
  onEscalate: () => void;
  disabled?: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onEscalate,
  disabled = false,
  voiceEnabled,
  onToggleVoice
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceMessage = (voiceMessage: string) => {
    onSendMessage(voiceMessage, 'voice');
  };

  return (
    <div className="border-t bg-white p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={disabled}
            rows={1}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <VoiceControls
            onVoiceMessage={handleVoiceMessage}
            voiceEnabled={voiceEnabled}
            onToggleVoice={onToggleVoice}
          />

          <button
            type="button"
            onClick={onEscalate}
            className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: '#f4f4f4',
              color: '#444'
            }}
            title="Escalate to human support"
          >
            <LifeBuoy className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="p-1.5 sm:p-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{backgroundColor: '#19C472'}}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};