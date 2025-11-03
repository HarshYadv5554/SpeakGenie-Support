import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color
}) => {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  );
};