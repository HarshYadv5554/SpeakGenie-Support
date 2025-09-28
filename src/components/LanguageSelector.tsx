import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: 'english' | 'hindi' | 'hinglish';
  onLanguageChange: (language: 'english' | 'hindi' | 'hinglish') => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  const languages = [
    {
      code: 'english' as const,
      name: 'English',
      flag: '🇺🇸',
      description: 'Chat in English'
    },
    {
      code: 'hindi' as const,
      name: 'हिंदी',
      flag: '🇮🇳',
      description: 'हिंदी में बात करें'
    },
    {
      code: 'hinglish' as const,
      name: 'Hinglish',
      flag: '🔄',
      description: 'Mix of Hindi and English'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">Chat Language</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {languages.map(({ code, name, flag, description }) => (
          <button
            key={code}
            onClick={() => onLanguageChange(code)}
            className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              selectedLanguage === code
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{flag}</span>
              <div className="text-left">
                <div className="font-medium text-sm">{name}</div>
                <div className="text-xs opacity-75">{description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
