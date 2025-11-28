import { Message, UserProfile } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://speakgenie-support-api.onrender.com';

// Use backend API in production, direct API in development
const isProduction = import.meta.env.PROD;
const useBackendAPI = isProduction || import.meta.env.VITE_USE_BACKEND_API === 'true';

export class OpenAIService {
  private async makeRequest(messages: any[]) {
    // If using backend API, call our server endpoint
    if (useBackendAPI) {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data.content;
    }

    // Otherwise, use direct OpenAI API (for local development)
    if (!OPENAI_API_KEY) {
      console.error('VITE_OPENAI_API_KEY is not defined. Make sure it is set in your environment.');
      throw new Error('VITE_OPENAI_API_KEY is missing');
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: Message[],
    userProfile: UserProfile,
    relevantKnowledge: string[]
  ): Promise<string> {
    const systemPrompt = this.createSystemPrompt(userProfile, relevantKnowledge);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    return await this.makeRequest(messages);
  }

  private createSystemPrompt(userProfile: UserProfile, relevantKnowledge: string[]): string {
    const knowledgeContext = relevantKnowledge.length > 0 
      ? `\n\nRelevant information from SpeakGenie knowledge base:\n${relevantKnowledge.join('\n\n')}`
      : '';

    const toneInstructions = this.getToneInstructions(userProfile.type);
    const languageInstructions = this.getLanguageInstructions(userProfile.preferences.language);

    return `You are a helpful AI customer support agent for SpeakGenie, an English learning app for kids aged 6-16.

IMPORTANT GUIDELINES:
1. Always use the provided knowledge base information when available
2. If you don't know something specific about SpeakGenie, say so and offer to escalate to human support
3. Keep responses concise but helpful
4. Use emojis appropriately to make responses engaging
5. ${toneInstructions}
6. ${languageInstructions}

SpeakGenie Key Info:
- English learning app for kids aged 6-16 (Grades 1-12)
- Features: AI tutor, peer calls, audio stories, games, grammar lessons
- Pricing: 7-day free trial, then ₹1,500/3 months, ₹2,400/6 months, ₹3,000/year
- Contact: hello@speakgenie.com
- Safe and supervised environment for children

${knowledgeContext}

If the user's question cannot be answered with the available information, politely suggest escalating to human support.`;
  }

  private getToneInstructions(userType: string): string {
    switch (userType) {
      case 'parent':
        return 'Use a polite, professional, and empathetic tone. Address concerns about child safety, learning progress, and value for money.';
      case 'kid':
        return 'Use simple, friendly language with fun emojis. Make explanations easy to understand and engaging for children.';
      default:
        return 'Use a friendly, helpful tone appropriate for the context.';
    }
  }

  private getLanguageInstructions(language: string): string {
    switch (language) {
      case 'hindi':
        return 'Respond in Hindi (हिंदी). Use Devanagari script for Hindi text. Keep responses natural and conversational in Hindi.';
      case 'bengali':
        return 'Respond in Bengali (বাংলা). Use Bengali script for Bengali text. Keep responses natural and conversational in Bengali.';
      case 'telugu':
        return 'Respond in Telugu (తెలుగు). Use Telugu script for Telugu text. Keep responses natural and conversational in Telugu.';
      case 'marathi':
        return 'Respond in Marathi (मराठी). Use Devanagari script for Marathi text. Keep responses natural and conversational in Marathi.';
      case 'tamil':
        return 'Respond in Tamil (தமிழ்). Use Tamil script for Tamil text. Keep responses natural and conversational in Tamil.';
      case 'gujarati':
        return 'Respond in Gujarati (ગુજરાતી). Use Gujarati script for Gujarati text. Keep responses natural and conversational in Gujarati.';
      case 'urdu':
        return 'Respond in Urdu (اردو). Use Arabic script for Urdu text. Keep responses natural and conversational in Urdu.';
      case 'kannada':
        return 'Respond in Kannada (ಕನ್ನಡ). Use Kannada script for Kannada text. Keep responses natural and conversational in Kannada.';
      case 'malayalam':
        return 'Respond in Malayalam (മലയാളം). Use Malayalam script for Malayalam text. Keep responses natural and conversational in Malayalam.';
      case 'punjabi':
        return 'Respond in Punjabi (ਪੰਜਾਬੀ). Use Gurmukhi script for Punjabi text. Keep responses natural and conversational in Punjabi.';
      case 'odia':
        return 'Respond in Odia (ଓଡ଼ିଆ). Use Odia script for Odia text. Keep responses natural and conversational in Odia.';
      case 'assamese':
        return 'Respond in Assamese (অসমীয়া). Use Assamese script for Assamese text. Keep responses natural and conversational in Assamese.';
      case 'bhojpuri':
        return 'Respond in Bhojpuri (भोजपुरी). Use Devanagari script for Bhojpuri text. Keep responses natural and conversational in Bhojpuri.';
      case 'rajasthani':
        return 'Respond in Rajasthani (राजस्थानी). Use Devanagari script for Rajasthani text. Keep responses natural and conversational in Rajasthani.';
      case 'hinglish':
        return 'Respond in Hinglish (mix of Hindi and English). Use both Hindi and English words naturally. Example: "Aap ka question bahut good hai!"';
      case 'english':
      default:
        return 'Respond in English. Use clear, professional English language.';
    }
  }
}