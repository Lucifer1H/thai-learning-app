// Audio utility functions for Thai language learning

export interface AudioOptions {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class AudioManager {
  private static instance: AudioManager;
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // 播放泰语文本
  async playThaiText(text: string, options: Partial<AudioOptions> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('浏览器不支持语音合成'));
        return;
      }

      // 停止当前播放
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'th-TH';
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        // 如果泰语不支持，尝试英语发音
        this.playEnglishPronunciation(text, options)
          .then(resolve)
          .catch(reject);
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  // 播放英语发音（作为备选）
  async playEnglishPronunciation(text: string, options: Partial<AudioOptions> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('浏览器不支持语音合成'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        reject(new Error('语音播放失败'));
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  // 播放音频文件（如果存在）
  async playAudioFile(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('音频文件加载失败'));
      
      audio.play().catch(reject);
    });
  }

  // 尝试播放音频文件，失败则使用语音合成
  async playAudio(audioUrl: string | null, fallbackText: string, options: Partial<AudioOptions> = {}): Promise<void> {
    if (audioUrl) {
      try {
        await this.playAudioFile(audioUrl);
        return;
      } catch (error) {
        console.warn('音频文件播放失败，使用语音合成:', error);
      }
    }

    // 使用语音合成作为备选
    await this.playThaiText(fallbackText, options);
  }

  // 停止当前播放
  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  // 检查是否正在播放
  isPlaying(): boolean {
    return this.synthesis?.speaking || false;
  }

  // 获取可用的语音列表
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // 获取泰语语音
  getThaiVoices(): SpeechSynthesisVoice[] {
    return this.getVoices().filter(voice =>
      voice.lang.startsWith('th') ||
      voice.name.toLowerCase().includes('thai')
    );
  }

  // 获取最佳泰语语音
  getBestThaiVoice(): SpeechSynthesisVoice | null {
    const thaiVoices = this.getThaiVoices();
    if (thaiVoices.length === 0) return null;

    // 优先选择本地语音
    const localVoice = thaiVoices.find(voice => voice.localService);
    if (localVoice) return localVoice;

    // 其次选择标准泰语
    const standardThai = thaiVoices.find(voice => voice.lang === 'th-TH');
    if (standardThai) return standardThai;

    // 最后选择任何泰语语音
    return thaiVoices[0];
  }

  // 检查语音质量
  getVoiceQuality(): 'excellent' | 'good' | 'basic' | 'none' {
    const thaiVoices = this.getThaiVoices();

    if (thaiVoices.length === 0) return 'none';

    const hasLocalThai = thaiVoices.some(voice =>
      voice.localService && voice.lang === 'th-TH'
    );
    if (hasLocalThai) return 'excellent';

    const hasLocal = thaiVoices.some(voice => voice.localService);
    if (hasLocal) return 'good';

    return 'basic';
  }

  // 检查是否需要语音设置指导
  needsVoiceSetup(): boolean {
    const quality = this.getVoiceQuality();
    return quality === 'none' || quality === 'basic';
  }
}

// 创建全局实例
export const audioManager = AudioManager.getInstance();

// 便捷函数
export const playThaiAudio = (text: string, options?: Partial<AudioOptions>) => {
  return audioManager.playThaiText(text, options);
};

export const playAudioWithFallback = (audioUrl: string | null, fallbackText: string, options?: Partial<AudioOptions>) => {
  return audioManager.playAudio(audioUrl, fallbackText, options);
};

export const stopAudio = () => {
  audioManager.stop();
};

export const isAudioPlaying = () => {
  return audioManager.isPlaying();
};
