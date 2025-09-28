import { Message, UserProfile } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIService {
  private async makeRequest(messages: any[]) {
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
      case 'hinglish':
        return 'Respond in Hinglish (mix of Hindi and English). Use both Hindi and English words naturally. Example: "Aap ka question bahut good hai!"';
      case 'english':
      default:
        return 'Respond in English. Use clear, professional English language.';
    }
  }
}