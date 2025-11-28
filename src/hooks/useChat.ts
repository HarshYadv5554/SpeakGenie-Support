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
          await ttsService.speak(response, userProfile.preferences.accent, userProfile.preferences.language);
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

  const escalateToHuman = useCallback(async () => {
    const getLocalizedEscalationMessage = (language: string): string => {
      switch (language) {
        case 'hindi':
          return 'मैंने आपकी क्वेरी हमारी मानव सहायता टीम को भेज दी है। वे 24 घंटे के भीतर hello@speakgenie.com पर आपसे संपर्क करेंगे। क्या इस बीच मैं आपकी किसी और तरह से मदद कर सकता/सकती हूँ?';
        case 'bengali':
          return 'আমি আপনার জিজ্ঞাসাটি আমাদের মানব সাপোর্ট টিমে পাঠিয়ে দিয়েছি। তারা ২৪ ঘন্টার মধ্যে hello@speakgenie.com এ আপনার সাথে যোগাযোগ করবে। এর মধ্যে আর কীভাবে সাহায্য করতে পারি?';
        case 'telugu':
          return 'మీ ప్రశ్నను మా మానవ సహాయ బృందానికి పంపించాను. వారు 24 గంటలలో hello@speakgenie.com ద్వారా మీను సంప్రదిస్తారు. ఈ మధ్యలో ఇంకేమైనా సహాయం కావాలా?';
        case 'marathi':
          return 'आपली विचारणा आमच्या मानवी सहाय्यक टीमकडे पाठवली आहे. ते 24 तासांच्या आत hello@speakgenie.com वरून आपल्याशी संपर्क करतील. दरम्यान आणखी काही मदत हवी आहे का?';
        case 'tamil':
          return 'உங்கள் கேள்வியை எங்கள் மனித உதவி அணியிடம் அனுப்பியுள்ளேன். அவர்கள் 24 மணிநேரத்தில் hello@speakgenie.com மூலம் தொடர்பு கொள்வார்கள். இதற்கிடையில் வேறு ஏதாவது உதவி வேண்டுமா?';
        case 'gujarati':
          return 'તમારી ક્વેરીને હું અમારી માનવીય સપોર્ટ ટીમને મોકલી છે. તેઓ 24 કલાકમાં hello@speakgenie.com પર તમારા સંપર્કમાં રહેશે. દરમિયાનમાં હું બીજી કોઈ મદદ કરી શકું?';
        case 'kannada':
          return 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಾನು ನಮ್ಮ ಮಾನವ ಸಹಾಯ ತಂಡಕ್ಕೆ ಕಳುಹಿಸಿದ್ದೇನೆ. ಅವರು 24 ಗಂಟೆಗಳ ಒಳಗೆ hello@speakgenie.com ಮೂಲಕ ಸಂಪರ್ಕಿಸುತ್ತಾರೆ. ಇದರ ನಡುವೆ ಇನ್ನೇನಾದರೂ ಸಹಾಯ ಬೇಕೆ?';
        case 'malayalam':
          return 'നിങ്ങളുടെ ചോദ്യം ഞങ്ങളുടെ മനുഷ്യ സഹായ ടീമിലേക്ക് കൈമാറിയിരിക്കുന്നു. അവർ 24 മണിക്കൂറിനുള്ളിൽ hello@speakgenie.com വഴി നിങ്ങളെ ബന്ധപ്പെടും. ഇതിനിടയിൽ വേറെ എന്തെങ്കിലും സഹായം വേണ്ടേ?';
        case 'punjabi':
          return 'ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਮੈਂ ਸਾਡੀ ਮਨੁੱਖੀ ਸਹਾਇਤਾ ਟੀਮ ਨੂੰ ਭੇਜ ਦਿੱਤੀ ਹੈ। ਉਹ 24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ hello@speakgenie.com ਤੇ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਨਗੇ। ਇਸ ਦੌਰਾਨ ਹੋਰ ਕੋਈ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?';
        case 'odia':
          return 'ଆପଣଙ୍କ ପ୍ରଶ୍ନକୁ ମୁଁ ଆମର ମାନବ ସହାୟତା ଦଳକୁ ପଠାଇଦେଇଛି। ସେମାନେ 24 ଘଣ୍ଟା ମଧ୍ୟରେ hello@speakgenie.com ମାଧ୍ୟମରେ ଯୋଗାଯୋଗ କରିବେ। ଏଥିବେଳେ ଅନ୍ୟ କିଛି ସହାୟତା ଦରକାର କି?';
        case 'assamese':
          return 'মই আপোনাৰ প্ৰশ্নক আমাৰ মানুহ সহায়ক দললৈ দিছিলো। তেওঁলোকে ২৪ ঘণ্টাৰ ভিতৰত hello@speakgenie.com ৰ জৰিয়তে আপোনাৰ সৈতে যোগাযোগ কৰিব। এই মাজত আন কিবা সহায় লাগে নে?';
        case 'bhojpuri':
          return 'हम रउआर सवाल के हमरा मनई सपोर्ट टीम लग भेज देनी ह। ऊ लोग 24 घंटा भितरे hello@speakgenie.com से रउआ से सम्पर्क करी। ए बीच में अउर कवनो मदद चाहीं?';
        case 'rajasthani':
          return 'मैंने थारी पूछ को हमारी मानव सहायता टीम ने सौंप दी है। वे 24 घंटा में hello@speakgenie.com पर थारा संपर्क में आवेंगे। बीच में और काई मदद चाहिए?';
        case 'english':
        default:
          return "I've escalated your query to our human support team. They will contact you within 24 hours at hello@speakgenie.com. Is there anything else I can help you with in the meantime?";
      }
    };

    const localizedContent = getLocalizedEscalationMessage(userProfile.preferences.language);
    const escalationMessage: Message = {
      id: Date.now().toString(),
      content: localizedContent,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, escalationMessage]);
    
    if (userProfile.preferences.voiceEnabled) {
      try {
        await ttsService.speak(
          localizedContent,
          userProfile.preferences.accent,
          userProfile.preferences.language
        );
      } catch (error) {
        console.warn('Text-to-speech failed for escalation message:', error);
      }
    }

    // Log escalation (in a real app, this would send to your backend)
    console.log('Chat escalated to human support:', {
      userId: userProfile.id,
      messages: messages.slice(-5), // Last 5 messages for context
      timestamp: new Date()
    });
  }, [messages, userProfile, ttsService]);

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