export class TextToSpeechService {
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  async speak(text: string, accent: 'indian' | 'american' | 'british' = 'indian', language: string = 'english'): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any current speech
      this.stop();
      
      // Clean text for speech - remove emojis and symbols
      const cleanText = this.cleanTextForSpeech(text);
      
      // If text is empty after cleaning, resolve immediately
      if (!cleanText.trim()) {
        resolve();
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Configure voice based on accent preference and text language
      const voices = this.synthesis.getVoices();
      const voice = this.selectVoiceForText(voices, accent, cleanText, language);
      
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      let resolved = false;
      
      utterance.onend = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      utterance.onerror = (event) => {
        if (!resolved) {
          resolved = true;
          // Don't reject on certain errors that might be recoverable
          if (event.error === 'interrupted' || event.error === 'canceled') {
            resolve();
          } else {
            reject(new Error(`Speech synthesis error: ${event.error}`));
          }
        }
      };

      // Small delay to ensure previous speech is fully cancelled
      // This helps when audio was manually stopped
      setTimeout(() => {
        // Double-check synthesis is ready
        if (this.synthesis.speaking || this.synthesis.pending) {
          this.synthesis.cancel();
        }
        
        this.synthesis.speak(utterance);
      }, 10);
    });
  }

  stop(): void {
    if (this.synthesis.speaking || this.synthesis.pending) {
      this.synthesis.cancel();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  private selectVoiceForText(voices: SpeechSynthesisVoice[], accent: string, text: string, language: string): SpeechSynthesisVoice | null {
    // Check for various Indian language scripts
    const hasHindiText = /[\u0900-\u097F]/.test(text);
    const hasBengaliText = /[\u0980-\u09FF]/.test(text);
    const hasTeluguText = /[\u0C00-\u0C7F]/.test(text);
    const hasTamilText = /[\u0B80-\u0BFF]/.test(text);
    const hasGujaratiText = /[\u0A80-\u0AFF]/.test(text);
    const hasKannadaText = /[\u0C80-\u0CFF]/.test(text);
    const hasMalayalamText = /[\u0D00-\u0D7F]/.test(text);
    const hasPunjabiText = /[\u0A00-\u0A7F]/.test(text);
    const hasOdiaText = /[\u0B00-\u0B7F]/.test(text);
    const hasAssameseText = /[\u0980-\u09FF]/.test(text);
    
    // Voice selection logic based on accent preference and text language
    const voiceMap = {
      indian: ['hi-IN', 'en-IN', 'hi', 'bn-IN', 'te-IN', 'mr-IN', 'ta-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN', 'or-IN', 'as-IN'],
      american: ['en-US'],
      british: ['en-GB', 'en-UK']
    };

    const preferredLangs = voiceMap[accent as keyof typeof voiceMap] || ['en-US'];
    
    // Language-specific voice selection for Indian languages
    if (accent === 'indian') {
      const languageVoiceMap = {
        hindi: ['hi-IN', 'hi'],
        bengali: ['bn-IN', 'bn'],
        telugu: ['te-IN', 'te'],
        marathi: ['mr-IN', 'mr'],
        tamil: ['ta-IN', 'ta'],
        gujarati: ['gu-IN', 'gu'],
        kannada: ['kn-IN', 'kn'],
        malayalam: ['ml-IN', 'ml'],
        punjabi: ['pa-IN', 'pa'],
        odia: ['or-IN', 'or'],
        assamese: ['as-IN', 'as'],
        bhojpuri: ['hi-IN', 'hi'],
        rajasthani: ['hi-IN', 'hi']
      };

      const targetLangs = languageVoiceMap[language as keyof typeof languageVoiceMap];
      if (targetLangs) {
        for (const lang of targetLangs) {
          const voice = voices.find(v => v.lang.includes(lang));
          if (voice) return voice;
        }
      }

      // Check for script-based detection
      if (hasHindiText || language === 'bhojpuri' || language === 'rajasthani') {
        const hindiVoice = voices.find(v => v.lang.includes('hi'));
        if (hindiVoice) return hindiVoice;
      }
      if (hasBengaliText || hasAssameseText || language === 'bengali' || language === 'assamese') {
        const bengaliVoice = voices.find(v => v.lang.includes('bn'));
        if (bengaliVoice) return bengaliVoice;
      }
      if (hasTeluguText || language === 'telugu') {
        const teluguVoice = voices.find(v => v.lang.includes('te'));
        if (teluguVoice) return teluguVoice;
      }
      if (hasTamilText || language === 'tamil') {
        const tamilVoice = voices.find(v => v.lang.includes('ta'));
        if (tamilVoice) return tamilVoice;
      }
      if (hasGujaratiText || language === 'gujarati') {
        const gujaratiVoice = voices.find(v => v.lang.includes('gu'));
        if (gujaratiVoice) return gujaratiVoice;
      }
      if (hasKannadaText || language === 'kannada') {
        const kannadaVoice = voices.find(v => v.lang.includes('kn'));
        if (kannadaVoice) return kannadaVoice;
      }
      if (hasMalayalamText || language === 'malayalam') {
        const malayalamVoice = voices.find(v => v.lang.includes('ml'));
        if (malayalamVoice) return malayalamVoice;
      }
      if (hasPunjabiText || language === 'punjabi') {
        const punjabiVoice = voices.find(v => v.lang.includes('pa'));
        if (punjabiVoice) return punjabiVoice;
      }
      if (hasOdiaText || language === 'odia') {
        const odiaVoice = voices.find(v => v.lang.includes('or'));
        if (odiaVoice) return odiaVoice;
      }
    }
    
    // Try to find a voice matching the preferred language
    for (const lang of preferredLangs) {
      const voice = voices.find(v => v.lang.startsWith(lang));
      if (voice) return voice;
    }

    // Fallback to any English voice
    return voices.find(v => v.lang.startsWith('en')) || null;
  }


  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices().filter(voice => 
      voice.lang.startsWith('en') || 
      voice.lang.startsWith('hi') ||
      voice.lang.startsWith('bn') ||
      voice.lang.startsWith('te') ||
      voice.lang.startsWith('mr') ||
      voice.lang.startsWith('ta') ||
      voice.lang.startsWith('gu') ||
      voice.lang.startsWith('kn') ||
      voice.lang.startsWith('ml') ||
      voice.lang.startsWith('pa') ||
      voice.lang.startsWith('or') ||
      voice.lang.startsWith('as')
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
      // Keep letters (English and all Indian languages), numbers, basic punctuation, and spaces
      .replace(/[^a-zA-Z\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F0-9\s.,!?;:'"()-]/g, '')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Trim whitespace
      .trim();
  }
}