import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { LanguageSelector } from './LanguageSelector';
import { useChat } from '../hooks/useChat';
import { UserProfile } from '../types';
import { MessageCircle, X } from 'lucide-react';

interface ChatWindowProps {
  userProfile: UserProfile;
  isOpen: boolean;
  onToggle: () => void;
  onLanguageChange?: (language: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  userProfile,
  isOpen,
  onToggle,
  onLanguageChange
}) => {
  const { messages, isLoading, isTyping, sendMessage, escalateToHuman, ttsService } = useChat(userProfile);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check if TTS is currently speaking and track which message is playing
  useEffect(() => {
    const checkTtsStatus = () => {
      const speaking = ttsService.isSpeaking();
      setIsTtsPlaying(speaking);
      
      // If TTS is playing but no message is marked as playing, 
      // it means it's auto-playing the last assistant message
      if (speaking && !playingMessageId) {
        const lastAssistantMessage = [...messages].reverse().find(m => m.sender === 'assistant');
        if (lastAssistantMessage) {
          setPlayingMessageId(lastAssistantMessage.id);
        }
      } else if (!speaking && playingMessageId) {
        // If TTS stopped, clear the playing message ID
        setPlayingMessageId(null);
      }
    };
    
    const interval = setInterval(checkTtsStatus, 100);
    return () => clearInterval(interval);
  }, [ttsService, messages, playingMessageId]);

  const handlePlayAudio = async (text: string, messageId: string) => {
    try {
      setPlayingMessageId(messageId);
      setIsTtsPlaying(true);
      await ttsService.speak(text, userProfile.preferences.accent, userProfile.preferences.language);
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setPlayingMessageId(null);
      setIsTtsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    ttsService.stop();
    setPlayingMessageId(null);
    setIsTtsPlaying(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
        style={{backgroundColor: '#19C472'}}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:bottom-6 sm:right-6 sm:inset-auto w-full sm:w-96 h-full sm:h-[600px] bg-white rounded-none sm:rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b text-white rounded-none sm:rounded-t-xl" style={{backgroundColor: '#19C472'}}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold">SpeakGenie Support</h3>
            <p className="text-xs opacity-90">
              {userProfile.type === 'kid' ? 'Hi there! 👋' : 'How can we help you?'}
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Language Selector */}
      {onLanguageChange && (
        <div className="p-3 sm:p-4 border-b bg-gray-50">
          <LanguageSelector
            selectedLanguage={userProfile.preferences.language}
            onLanguageChange={onLanguageChange}
          />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-6 sm:py-8">
            <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-xs sm:text-sm px-4">
              {userProfile.type === 'kid' 
                ? "Hi! I'm here to help you with SpeakGenie! 🌟"
                : "Welcome! How can I assist you with SpeakGenie today?"
              }
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onPlayAudio={(text) => handlePlayAudio(text, message.id)}
            onStopAudio={handleStopAudio}
            isPlaying={playingMessageId === message.id}
          />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={sendMessage}
        onEscalate={escalateToHuman}
        disabled={isLoading}
        voiceEnabled={userProfile.preferences.voiceEnabled}
        onToggleVoice={() => {
          // In a real app, this would update the user profile
          userProfile.preferences.voiceEnabled = !userProfile.preferences.voiceEnabled;
        }}
      />
    </div>
  );
};