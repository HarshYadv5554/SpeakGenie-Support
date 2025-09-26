import { useState, useCallback } from 'react';
import { Message, UserProfile } from '../types';
import { OpenAIService } from '../services/openai';
import { KnowledgeSearchService } from '../services/knowledgeSearch';
import { TextToSpeechService } from '../services/textToSpeech';

export const useChat = (userProfile: UserProfile) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const openAIService = new OpenAIService();
  const knowledgeSearch = new KnowledgeSearchService();
  const ttsService = new TextToSpeechService();

  const sendMessage = useCallback(async (content: string, type: 'text' | 'voice' = 'text') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Search for relevant knowledge
      const relevantKnowledge = knowledgeSearch.searchRelevantKnowledge(content);
      
      // Generate AI response
      const response = await openAIService.generateResponse(
        content,
        messages,
        userProfile,
        relevantKnowledge
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-play voice response if user prefers voice
      if (userProfile.preferences.voiceEnabled) {
        try {
          await ttsService.speak(response, userProfile.preferences.accent);
        } catch (error) {
          console.warn('Text-to-speech failed:', error);
        }
      }

    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again or contact our support team at hello@speakgenie.com for immediate assistance.",
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [messages, userProfile, openAIService, knowledgeSearch, ttsService]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const escalateToHuman = useCallback(() => {
    const escalationMessage: Message = {
      id: Date.now().toString(),
      content: "I've escalated your query to our human support team. They will contact you within 24 hours at hello@speakgenie.com. Is there anything else I can help you with in the meantime?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, escalationMessage]);
    
    // Log escalation (in a real app, this would send to your backend)
    console.log('Chat escalated to human support:', {
      userId: userProfile.id,
      messages: messages.slice(-5), // Last 5 messages for context
      timestamp: new Date()
    });
  }, [messages, userProfile]);

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    clearChat,
    escalateToHuman,
    ttsService
  };
};