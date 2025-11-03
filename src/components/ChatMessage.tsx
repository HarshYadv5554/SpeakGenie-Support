import React from 'react';
import { Message } from '../types';
import { Bot, User, Volume2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onPlayAudio?: (text: string) => void;
  onStopAudio?: () => void;
  isPlaying?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onPlayAudio,
  onStopAudio,
  isPlaying
}) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-gray-500' : ''
      }`} style={!isUser ? {backgroundColor: '#19C472'} : {}}>
        {isUser ? (
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        ) : (
          <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        )}
      </div>
      
      <div className={`max-w-[85%] sm:max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-3 sm:px-4 py-2 rounded-2xl ${
          isUser
            ? 'text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`} style={isUser ? {backgroundColor: '#19C472'} : {}}>
          <div className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</div>
          
          {!isUser && onPlayAudio && (
            <button
              onClick={() => isPlaying ? onStopAudio?.() : onPlayAudio(message.content)}
              className="mt-2 flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              <Volume2 className={`w-3 h-3 ${isPlaying ? 'animate-pulse' : ''}`} />
              {isPlaying ? 'Stop audio' : 'Play audio'}
            </button>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};