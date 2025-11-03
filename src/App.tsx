import { useState } from 'react';
import { Header } from './components/Header';
import { UserTypeSelector } from './components/UserTypeSelector';
import { ChatWindow } from './components/ChatWindow';
import { FeatureCard } from './components/FeatureCard';
import { UserProfile } from './types';
import { 
  MessageCircle, 
  Mic, 
  Brain, 
  Shield, 
  Clock, 
  Users,
  Sparkles,
  Heart
} from 'lucide-react';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'User',
    type: 'parent',
    preferences: {
      voiceEnabled: true,
      accent: 'indian',
      language: 'english'
    }
  });

  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleUserTypeChange = (type: 'parent' | 'kid') => {
    setUserProfile(prev => ({
      ...prev,
      type,
      preferences: {
        ...prev.preferences,
        accent: type === 'kid' ? 'indian' : prev.preferences.accent
      }
    }));
  };

  const handleLanguageChange = (language: string) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        language
      }
    }));
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'Smart Chat Support',
      description: 'Get instant answers about SpeakGenie features, pricing, and usage with our AI-powered chatbot.',
      color: 'bg-blue-500'
    },
    {
      icon: Mic,
      title: 'Voice Interaction',
      description: 'Talk naturally with voice input and hear responses in your preferred accent - Indian, American, or British.',
      color: 'bg-[#19C472]'
    },
    {
      icon: Brain,
      title: 'Intelligent Responses',
      description: 'Powered by GPT-4o mini with comprehensive knowledge about SpeakGenie\'s features and policies.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Child-safe interactions with appropriate tone and content based on user type (parent, kid, teacher).',
      color: 'bg-red-500'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Get help anytime, anywhere. Our AI support never sleeps and is always ready to assist you.',
      color: 'bg-orange-500'
    },
    {
      icon: Users,
      title: 'Human Escalation',
      description: 'Complex queries are seamlessly escalated to our human support team for personalized assistance.',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" style={{color: '#19C472'}} />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 px-2">Welcome to SpeakGenie Support</h2>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8" style={{color: '#19C472'}} />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Get instant help with our AI-powered support system. Whether you're a parent or student, 
            we're here to answer all your questions about SpeakGenie's English learning platform.
          </p>
        </div>

        {/* User Type Selection */}
        <UserTypeSelector
          selectedType={userProfile.type}
          onTypeChange={handleUserTypeChange}
        />


        {/* Features Grid */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-8 px-4">
            How We Can Help You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center text-white mb-6 sm:mb-8" style={{backgroundColor: '#19C472'}}>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h3>
          <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-90 px-2">
            Click the chat button to start a conversation with our AI support assistant!
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            style={{color: '#19C472'}}
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Start Chat
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="text-2xl sm:text-3xl font-bold mb-2" style={{color: '#19C472'}}>7 Days</div>
            <div className="text-gray-600 text-sm sm:text-base">Free Trial</div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="text-2xl sm:text-3xl font-bold mb-2" style={{color: '#19C472'}}>₹3,000</div>
            <div className="text-gray-600 text-sm sm:text-base">Yearly Plan</div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="text-2xl sm:text-3xl font-bold mb-2" style={{color: '#19C472'}}>6-16</div>
            <div className="text-gray-600 text-sm sm:text-base">Age Range</div>
          </div>
        </div>
      </main>

      {/* Chat Window */}
      <ChatWindow
        userProfile={userProfile}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}

export default App;