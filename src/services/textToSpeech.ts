export class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  async speak(text: string, accent: 'indian' | 'american' | 'british' = 'indian', language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any current speech
      this.stop();

      // Clean text for speech - remove emojis and symbols
      const cleanText = this.cleanTextForSpeech(text);
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      // Configure voice based on accent preference and text language
      const voices = this.synthesis.getVoices();
      const voice = this.selectVoiceForText(voices, accent, cleanText, language);
      
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  private selectVoiceForText(voices: SpeechSynthesisVoice[], accent: string, text: string, language: string): SpeechSynthesisVoice | null {
    // Check if text contains Hindi characters
    const hasHindiText = /[\u0900-\u097F]/.test(text);
    
    // Voice selection logic based on accent preference and text language
    const voiceMap = {
      indian: ['hi-IN', 'en-IN', 'hi'],
      american: ['en-US'],
      british: ['en-GB', 'en-UK']
    };

    const preferredLangs = voiceMap[accent as keyof typeof voiceMap] || ['en-US'];
    
    // If language is Hindi or Hinglish, or text contains Hindi characters, prioritize Hindi voices
    if ((language === 'hindi' || language === 'hinglish' || hasHindiText) && accent === 'indian') {
      // First try Hindi voices
      const hindiVoice = voices.find(v => 
        v.lang.includes('hi') || 
        v.lang.includes('Hindi') || 
        v.lang.startsWith('hi-IN')
      );
      if (hindiVoice) return hindiVoice;
    }
    
    // Try to find a voice matching the preferred language
    for (const lang of preferredLangs) {
      const voice = voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }

    // Fallback to any English voice
    return voices.find(v => v.lang.startsWith('en')) || null;
  }

  private selectVoice(voices: SpeechSynthesisVoice[], accent: string): SpeechSynthesisVoice | null {
    // Voice selection logic based on accent preference
    const voiceMap = {
      indian: ['hi-IN', 'en-IN', 'hi'],
      american: ['en-US'],
      british: ['en-GB', 'en-UK']
    };

    const preferredLangs = voiceMap[accent as keyof typeof voiceMap] || ['en-US'];
    
    // First try to find a voice matching the preferred language
    for (const lang of preferredLangs) {
      const voice = voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }

    // For Indian accent, also try Hindi voices
    if (accent === 'indian') {
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
      if (hindiVoice) return hindiVoice;
    }

    // Fallback to any English voice
    return voices.find(v => v.lang.startsWith('en')) || null;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices().filter(voice => 
      voice.lang.startsWith('en') || voice.lang.startsWith('hi')
    );
  }

  private cleanTextForSpeech(text: string): string {
    return text
      // Remove all emojis and emoticons
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/gu, '')
      // Remove common symbols and special characters
      .replace(/[🗣👥🤖🎧🎮📖📊✅❌📧💡🔍📝🎯🚀💻📱🌐🔒🛡️⚡🎨🎭🎪🎨🎬🎵🎶🎸🎹🎺🎻🥁🎤🎧🎮🕹️🎲🎯🎳🎰🎱🎮🎯🎲🎳🎰🎱]/g, '')
      // Remove other common symbols that shouldn't be spoken
      .replace(/[•·▪▫‣⁃⁌⁍⁎⁏⁐⁑⁒⁓⁔⁕⁖⁗⁘⁙⁚⁛⁜⁝⁞]/g, '')
      // Remove arrows and directional symbols
      .replace(/[←→↑↓↔↕↖↗↘↙↚↛↜↝↞↟↠↡↢↣↤↥↦↧↨↩↪↫↬↭↮↯↰↱↲↳↴↵↶↷↸↹↺↻↼↽↾↿⇀⇁⇂⇃⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟⇠⇡⇢⇣⇤⇥⇦⇧⇨⇩⇪⇫⇬⇭⇮⇯⇰⇱⇲⇳⇴⇵⇶⇷⇸⇹⇺⇻⇼⇽⇾⇿]/g, '')
      // Remove mathematical and technical symbols
      .replace(/[∑∏∐∆∇∞∝∟∠∡∢∣∤∦∨∧∩∪∫∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿]/g, '')
      // Remove currency and other symbols
      .replace(/[¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/g, '')
      // Keep letters (English and Hindi), numbers, basic punctuation, and spaces
      .replace(/[^a-zA-Z\u0900-\u097F0-9\s.,!?;:'"()-]/g, '')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Trim whitespace
      .trim();
  }
}