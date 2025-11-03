import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        onClick={onToggleVoice}
        className="p-1.5 sm:p-2 rounded-full transition-colors hover:bg-opacity-80"
        style={{
          backgroundColor: '#f4f4f4',
          color: '#444'
        }}
        title={voiceEnabled ? 'Voice responses enabled' : 'Voice responses disabled'}
      >
        {voiceEnabled ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />}
      </button>

      <button
        onClick={handleVoiceInput}
        disabled={!speechService.isSupported()}
        className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
          isRecording
            ? 'animate-pulse'
            : 'hover:scale-105'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        style={{
          backgroundColor: isRecording ? '#ff4444' : '#f4f4f4',
          color: isRecording ? 'white' : '#444'
        }}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
      >
        {isRecording ? <MicOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Mic className="w-3 h-3 sm:w-4 sm:h-4" />}
      </button>
    </div>
  );
};