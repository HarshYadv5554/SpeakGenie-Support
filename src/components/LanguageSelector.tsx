import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'bengali', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
    { code: 'telugu', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी (Marathi)', flag: '🇮🇳' },
    { code: 'tamil', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'gujarati', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'urdu', name: 'اردو (Urdu)', flag: '🇮🇳' },
    { code: 'kannada', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { code: 'malayalam', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    { code: 'punjabi', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
    { code: 'odia', name: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳' },
    { code: 'assamese', name: 'অসমীয়া (Assamese)', flag: '🇮🇳' },
    { code: 'bhojpuri', name: 'भोजपुरी (Bhojpuri)', flag: '🇮🇳' },
    { code: 'rajasthani', name: 'राजस्थानी (Rajasthani)', flag: '🇮🇳' },
    { code: 'hinglish', name: 'Hinglish (Mix)', flag: '🔄' }
  ];

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700">Chat Language</span>
      </div>
      
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none cursor-pointer"
        >
          {languages.map(({ code, name, flag }) => (
            <option key={code} value={code}>
              {flag} {name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Select your preferred language for chat responses
      </p>
    </div>
  );
};
