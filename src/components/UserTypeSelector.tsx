import React from 'react';
import { User, GraduationCap } from 'lucide-react';

interface UserTypeSelectorProps {
  selectedType: 'parent' | 'kid';
  onTypeChange: (type: 'parent' | 'kid') => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  const userTypes = [
    {
      type: 'parent' as const,
      label: 'Parent',
      icon: User,
      description: 'Get help with your child\'s learning'
    },
    {
      type: 'kid' as const,
      label: 'Student',
      icon: GraduationCap,
      description: 'Ask questions about SpeakGenie'
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        I am a...
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypes.map(({ type, label, icon: Icon, description }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              selectedType === type
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
            }`}
          >
            <Icon className="w-8 h-8 mx-auto mb-2" />
            <div className="font-medium">{label}</div>
            <div className="text-sm opacity-75 mt-1">{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};