import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">SpeakGenie Support</h1>
              <p className="text-indigo-100 text-xs sm:text-sm">AI-powered customer support</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">24/7 Available</span>
          </div>
          
          {/* Mobile indicator */}
          <div className="sm:hidden flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs font-medium">24/7</span>
          </div>
        </div>
      </div>
    </header>
  );
};