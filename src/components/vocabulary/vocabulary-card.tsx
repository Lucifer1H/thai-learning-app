'use client';

import { useState, useEffect } from 'react';
import { AudioPlayer } from '@/components/audio/audio-player';
import { VoiceSetupGuide } from '@/components/audio/voice-setup-guide';
import { Button } from '@/components/ui/button';
import { Volume2, Eye, EyeOff, RotateCcw, Check, X, Settings, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audio-utils';

interface VocabularyItem {
  id: string;
  thai_word: string;
  chinese_translation: string;
  pronunciation: string;
  audio_url?: string;
  category: string;
  usage_example_thai?: string;
  usage_example_chinese?: string;
  tags?: string[];
}

interface VocabularyCardProps {
  vocabulary: VocabularyItem;
  showAnswer?: boolean;
  onAnswer?: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onNext?: () => void;
  className?: string;
  mode?: 'study' | 'review' | 'test';
}

export function VocabularyCard({
  vocabulary,
  showAnswer: initialShowAnswer = false,
  onAnswer,
  onNext,
  className,
  mode = 'study'
}: VocabularyCardProps) {
  const [showAnswer, setShowAnswer] = useState(initialShowAnswer);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [voiceQuality, setVoiceQuality] = useState<'excellent' | 'good' | 'basic' | 'none'>('none');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // 语音质量检测
  useEffect(() => {
    const checkVoiceQuality = () => {
      const quality = audioManager.getVoiceQuality();
      setVoiceQuality(quality);

      const bestVoice = audioManager.getBestThaiVoice();
      setSelectedVoice(bestVoice);

      // 如果语音质量很差，自动显示设置指导
      if (quality === 'none') {
        setShowVoiceSetup(true);
      }
    };

    checkVoiceQuality();
    speechSynthesis.onvoiceschanged = checkVoiceQuality;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getVoiceQualityInfo = () => {
    switch (voiceQuality) {
      case 'excellent':
        return { text: '语音质量：优秀', color: 'text-green-600', icon: '🎯' };
      case 'good':
        return { text: '语音质量：良好', color: 'text-blue-600', icon: '👍' };
      case 'basic':
        return { text: '语音质量：基础', color: 'text-yellow-600', icon: '⚠️' };
      case 'none':
        return { text: '未找到泰语语音', color: 'text-red-600', icon: '❌' };
    }
  };

  const handleReveal = () => {
    setShowAnswer(true);
    setIsFlipped(true);
  };

  const handleReset = () => {
    setShowAnswer(false);
    setIsFlipped(false);
  };

  const handleAnswer = (difficulty: 'easy' | 'medium' | 'hard') => {
    onAnswer?.(difficulty);
    if (mode === 'review') {
      setTimeout(() => {
        handleReset();
        onNext?.();
      }, 1000);
    }
  };

  const playTTS = async () => {
    if (isPlayingTTS) return;

    setIsPlayingTTS(true);
    console.log('播放词汇语音合成:', vocabulary.thai_word);

    try {
      if (!('speechSynthesis' in window)) {
        throw new Error('浏览器不支持语音合成');
      }

      // 等待语音列表加载
      const waitForVoices = () => {
        return new Promise<void>((resolve) => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            resolve();
          } else {
            window.speechSynthesis.onvoiceschanged = () => resolve();
          }
        });
      };

      await waitForVoices();

      // 创建语音合成实例
      const utterance = new SpeechSynthesisUtterance(vocabulary.thai_word);

      // 使用选定的语音或最佳泰语语音
      const voiceToUse = selectedVoice || audioManager.getBestThaiVoice();

      if (voiceToUse) {
        utterance.voice = voiceToUse;
        console.log('使用泰语语音:', voiceToUse.name);
      } else {
        console.log('未找到泰语语音，使用默认语音');
      }

      utterance.lang = 'th-TH';
      utterance.rate = 0.6; // 稍慢一些，便于学习词汇
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('词汇语音合成开始播放');
      };

      utterance.onend = () => {
        console.log('词汇语音合成播放完成');
        setIsPlayingTTS(false);
      };

      utterance.onerror = (event) => {
        console.error('词汇语音合成播放错误:', event.error);
        setIsPlayingTTS(false);
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('词汇语音合成播放失败:', error);
      setIsPlayingTTS(false);
    }
  };

  return (
    <div className={cn('max-w-md mx-auto', className)}>
      <div className="relative h-80 perspective-1000">
        <div className={cn(
          'absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d',
          isFlipped && 'rotate-y-180'
        )}>
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="text-center">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500 chinese-text">
                    {vocabulary.category}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getVoiceQualityInfo().color}`}>
                      {getVoiceQualityInfo().icon} {getVoiceQualityInfo().text}
                    </span>
                    <button
                      onClick={() => setShowVoiceSetup(true)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                      title="语音设置"
                    >
                      <Settings className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="text-4xl thai-text text-blue-600 font-bold mb-4">
                  {vocabulary.thai_word}
                </div>
                <div className="flex justify-center mb-4">
                  {vocabulary.audio_url ? (
                    <AudioPlayer
                      src={vocabulary.audio_url}
                      variant="minimal"
                    />
                  ) : (
                    <Button
                      onClick={playTTS}
                      disabled={isPlayingTTS}
                      variant="outline"
                      size="sm"
                      icon={isPlayingTTS ? undefined : Play}
                      className="chinese-text"
                    >
                      {isPlayingTTS ? (
                        <>
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                          播放中...
                        </>
                      ) : (
                        '🔊 播放发音'
                      )}
                    </Button>
                  )}
                </div>
                <div className="text-lg text-gray-600 mb-2">
                  [{vocabulary.pronunciation}]
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center">
                {!showAnswer ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤔</div>
                    <p className="text-gray-600 chinese-text">
                      这个词的中文意思是什么？
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold text-green-600 chinese-text">
                      {vocabulary.chinese_translation}
                    </div>
                    {vocabulary.usage_example_thai && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm thai-text text-gray-700 mb-1">
                          {vocabulary.usage_example_thai}
                        </p>
                        {vocabulary.usage_example_chinese && (
                          <p className="text-sm chinese-text text-gray-600">
                            {vocabulary.usage_example_chinese}
                          </p>
                        )}
                      </div>
                    )}
                    {vocabulary.tags && vocabulary.tags.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {vocabulary.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded chinese-text"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {!showAnswer ? (
                  <Button
                    onClick={handleReveal}
                    variant="primary"
                    fullWidth
                    icon={Eye}
                    className="chinese-text"
                  >
                    显示答案
                  </Button>
                ) : mode === 'review' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-center text-gray-600 chinese-text">
                      这个词对您来说有多难？
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => handleAnswer('easy')}
                        variant="primary"
                        size="sm"
                        className="chinese-text bg-green-600 hover:bg-green-700"
                      >
                        简单
                      </Button>
                      <Button
                        onClick={() => handleAnswer('medium')}
                        variant="primary"
                        size="sm"
                        className="chinese-text bg-yellow-600 hover:bg-yellow-700"
                      >
                        一般
                      </Button>
                      <Button
                        onClick={() => handleAnswer('hard')}
                        variant="primary"
                        size="sm"
                        className="chinese-text bg-red-600 hover:bg-red-700"
                      >
                        困难
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      icon={RotateCcw}
                      className="flex-1 chinese-text"
                    >
                      重新测试
                    </Button>
                    <Button
                      onClick={onNext}
                      variant="primary"
                      className="flex-1 chinese-text"
                    >
                      下一个
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back of card (for flip animation) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 h-full flex flex-col justify-center items-center text-white">
              <div className="text-center">
                <div className="text-3xl mb-4">💡</div>
                <div className="text-xl font-bold mb-2 chinese-text">
                  正在思考...
                </div>
                <p className="text-blue-100 chinese-text">
                  回忆这个词的含义
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 语音设置指导弹窗 */}
      {showVoiceSetup && (
        <VoiceSetupGuide
          onClose={() => setShowVoiceSetup(false)}
          onVoiceSelected={(voice) => {
            setSelectedVoice(voice);
            // 重新检查语音质量
            const quality = audioManager.getVoiceQuality();
            setVoiceQuality(quality);
          }}
        />
      )}
    </div>
  );
}

// Quiz mode component
interface VocabularyQuizProps {
  vocabulary: VocabularyItem;
  options: string[];
  onAnswer: (selectedAnswer: string, isCorrect: boolean) => void;
  className?: string;
}

export function VocabularyQuiz({
  vocabulary,
  options,
  onAnswer,
  className
}: VocabularyQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [voiceQuality, setVoiceQuality] = useState<'excellent' | 'good' | 'basic' | 'none'>('none');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // 语音质量检测
  useEffect(() => {
    const checkVoiceQuality = () => {
      const quality = audioManager.getVoiceQuality();
      setVoiceQuality(quality);

      const bestVoice = audioManager.getBestThaiVoice();
      setSelectedVoice(bestVoice);

      // 如果语音质量很差，自动显示设置指导
      if (quality === 'none') {
        setShowVoiceSetup(true);
      }
    };

    checkVoiceQuality();
    speechSynthesis.onvoiceschanged = checkVoiceQuality;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getVoiceQualityInfo = () => {
    switch (voiceQuality) {
      case 'excellent':
        return { text: '语音质量：优秀', color: 'text-green-600', icon: '🎯' };
      case 'good':
        return { text: '语音质量：良好', color: 'text-blue-600', icon: '👍' };
      case 'basic':
        return { text: '语音质量：基础', color: 'text-yellow-600', icon: '⚠️' };
      case 'none':
        return { text: '未找到泰语语音', color: 'text-red-600', icon: '❌' };
    }
  };

  const handleSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === vocabulary.chinese_translation;
    setTimeout(() => {
      onAnswer(answer, isCorrect);
    }, 1500);
  };

  const playTTS = async () => {
    if (isPlayingTTS) return;

    setIsPlayingTTS(true);
    console.log('播放测试词汇语音合成:', vocabulary.thai_word);

    try {
      if (!('speechSynthesis' in window)) {
        throw new Error('浏览器不支持语音合成');
      }

      // 等待语音列表加载
      const waitForVoices = () => {
        return new Promise<void>((resolve) => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            resolve();
          } else {
            window.speechSynthesis.onvoiceschanged = () => resolve();
          }
        });
      };

      await waitForVoices();

      // 创建语音合成实例
      const utterance = new SpeechSynthesisUtterance(vocabulary.thai_word);

      // 使用选定的语音或最佳泰语语音
      const voiceToUse = selectedVoice || audioManager.getBestThaiVoice();

      if (voiceToUse) {
        utterance.voice = voiceToUse;
        console.log('使用泰语语音:', voiceToUse.name);
      } else {
        console.log('未找到泰语语音，使用默认语音');
      }

      utterance.lang = 'th-TH';
      utterance.rate = 0.6;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('测试词汇语音合成开始播放');
      };

      utterance.onend = () => {
        console.log('测试词汇语音合成播放完成');
        setIsPlayingTTS(false);
      };

      utterance.onerror = (event) => {
        console.error('测试词汇语音合成播放错误:', event.error);
        setIsPlayingTTS(false);
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('测试词汇语音合成播放失败:', error);
      setIsPlayingTTS(false);
    }
  };

  const getButtonVariant = (option: string) => {
    if (!showResult) return 'outline';
    if (option === vocabulary.chinese_translation) return 'primary';
    if (option === selectedAnswer && option !== vocabulary.chinese_translation) return 'danger';
    return 'outline';
  };

  return (
    <div className={cn('max-w-md mx-auto', className)}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Question */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500 chinese-text">
              选择正确的中文翻译
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${getVoiceQualityInfo().color}`}>
                {getVoiceQualityInfo().icon} {getVoiceQualityInfo().text}
              </span>
              <button
                onClick={() => setShowVoiceSetup(true)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="语音设置"
              >
                <Settings className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="text-3xl thai-text text-blue-600 font-bold mb-3">
            {vocabulary.thai_word}
          </div>
          <div className="flex justify-center mb-3">
            {vocabulary.audio_url ? (
              <AudioPlayer
                src={vocabulary.audio_url}
                variant="minimal"
              />
            ) : (
              <Button
                onClick={playTTS}
                disabled={isPlayingTTS}
                variant="outline"
                size="sm"
                icon={isPlayingTTS ? undefined : Play}
                className="chinese-text"
              >
                {isPlayingTTS ? (
                  <>
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    播放中...
                  </>
                ) : (
                  '🔊 播放发音'
                )}
              </Button>
            )}
          </div>
          <div className="text-lg text-gray-600">
            [{vocabulary.pronunciation}]
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => !showResult && handleSelect(option)}
              variant={getButtonVariant(option)}
              fullWidth
              disabled={showResult}
              className={cn(
                'chinese-text justify-start',
                showResult && option === vocabulary.chinese_translation && 'ring-2 ring-green-400',
                showResult && option === selectedAnswer && option !== vocabulary.chinese_translation && 'ring-2 ring-red-400'
              )}
            >
              <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
              {option}
              {showResult && option === vocabulary.chinese_translation && (
                <Check className="h-4 w-4 ml-auto text-green-600" />
              )}
              {showResult && option === selectedAnswer && option !== vocabulary.chinese_translation && (
                <X className="h-4 w-4 ml-auto text-red-600" />
              )}
            </Button>
          ))}
        </div>

        {/* Result */}
        {showResult && (
          <div className={cn(
            'mt-4 p-3 rounded text-center',
            selectedAnswer === vocabulary.chinese_translation 
              ? 'bg-green-50 text-green-800' 
              : 'bg-red-50 text-red-800'
          )}>
            <div className="text-2xl mb-1">
              {selectedAnswer === vocabulary.chinese_translation ? '🎉' : '😅'}
            </div>
            <p className="font-medium chinese-text">
              {selectedAnswer === vocabulary.chinese_translation ? '答对了！' : '答错了'}
            </p>
            {vocabulary.usage_example_thai && (
              <div className="mt-2 text-sm">
                <p className="thai-text">{vocabulary.usage_example_thai}</p>
                <p className="chinese-text text-gray-600">{vocabulary.usage_example_chinese}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 语音设置指导弹窗 */}
      {showVoiceSetup && (
        <VoiceSetupGuide
          onClose={() => setShowVoiceSetup(false)}
          onVoiceSelected={(voice) => {
            setSelectedVoice(voice);
            // 重新检查语音质量
            const quality = audioManager.getVoiceQuality();
            setVoiceQuality(quality);
          }}
        />
      )}
    </div>
  );
}
