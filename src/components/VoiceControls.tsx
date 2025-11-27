import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { SpeechRecognitionService } from '../services/speechRecognition';

interface VoiceControlsProps {
  onVoiceMessage: (message: string) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isListening?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onVoiceMessage,
  voiceEnabled,
  onToggleVoice,
  isListening = false
}) => {
  // voiceEnabled and onToggleVoice kept for interface compatibility but not used
  const [isRecording, setIsRecording] = useState(false);
  const speechService = new SpeechRecognitionService();

  const handleVoiceInput = async () => {
    if (!speechService.isSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
      return;
    }

    try {
      setIsRecording(true);
      const transcript = await speechService.startListening();
      if (transcript.trim()) {
        onVoiceMessage(transcript);
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      alert('Could not recognize speech. Please try again.');
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={handleVoiceInput}
      disabled={!speechService.isSupported()}
      className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 ${
        isRecording
          ? 'animate-pulse'
          : 'hover:scale-[1.02]'
      } disabled:opacity-50 disabled:cursor-not-allowed text-white`}
      style={{
        backgroundColor: isRecording ? '#ff4444' : '#19C472'
      }}
      title={isRecording ? 'Stop recording' : 'Tap to speak'}
    >
      {isRecording ? (
        <>
          <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Stop Recording</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Tap to Speak</span>
        </>
      )}
    </button>
  );
};