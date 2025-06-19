'use client';

import { useState, useEffect } from 'react';
import { AudioPlayer } from './audio-player';
import { AudioRecorder } from './audio-recorder';
import { VoiceSetupGuide } from './voice-setup-guide';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, CheckCircle, XCircle, Play, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audio-utils';

interface PronunciationPracticeProps {
  word: string;
  pronunciation: string;
  audioUrl: string;
  chinese?: string;
  onComplete?: (score: number) => void;
  className?: string;
}

export function PronunciationPractice({
  word,
  pronunciation,
  audioUrl,
  chinese,
  onComplete,
  className
}: PronunciationPracticeProps) {
  const [step, setStep] = useState<'listen' | 'record' | 'compare'>('listen');
  const [userRecording, setUserRecording] = useState<{ blob: Blob; url: string } | null>(null);
  const [feedback, setFeedback] = useState<'good' | 'needs_improvement' | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [voiceQuality, setVoiceQuality] = useState<'excellent' | 'good' | 'basic' | 'none'>('none');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // 检查语音质量
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

  const handleRecordingComplete = (blob: Blob, url: string) => {
    setUserRecording({ blob, url });
    setStep('compare');
  };

  const handleFeedback = (rating: 'good' | 'needs_improvement') => {
    setFeedback(rating);
    const score = rating === 'good' ? 100 : 60;
    onComplete?.(score);
  };

  const resetPractice = () => {
    setStep('listen');
    setUserRecording(null);
    setFeedback(null);
  };

  const playTTS = async () => {
    if (isPlayingTTS) return;

    setIsPlayingTTS(true);
    console.log('播放语音合成:', word);

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
      const utterance = new SpeechSynthesisUtterance(word);

      // 使用选定的语音或最佳泰语语音
      const voiceToUse = selectedVoice || audioManager.getBestThaiVoice();

      if (voiceToUse) {
        utterance.voice = voiceToUse;
        console.log('使用泰语语音:', voiceToUse.name);
      } else {
        console.log('未找到泰语语音，使用默认语音');
      }

      utterance.lang = 'th-TH';
      utterance.rate = 0.6; // 稍慢一些，便于学习
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('语音合成开始播放');
      };

      utterance.onend = () => {
        console.log('语音合成播放完成');
        setIsPlayingTTS(false);
      };

      utterance.onerror = (event) => {
        console.error('语音合成播放错误:', event.error);
        setIsPlayingTTS(false);
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('语音合成播放失败:', error);
      setIsPlayingTTS(false);
    }
  };

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

  const qualityInfo = getVoiceQualityInfo();

  return (
    <>
      <div className={cn('bg-white rounded-lg shadow-lg p-6', className)}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 chinese-text">
              发音练习
            </h3>
            <div className="flex items-center space-x-2">
              <span className={cn('text-xs', qualityInfo.color)}>
                {qualityInfo.icon} {qualityInfo.text}
              </span>
              <Button
                onClick={() => setShowVoiceSetup(true)}
                variant="ghost"
                size="sm"
                icon={Settings}
                className="chinese-text"
                title="语音设置"
              />
            </div>
          </div>
          <div className="text-4xl thai-text text-blue-600 font-bold mb-2">
            {word}
          </div>
          <div className="text-lg text-gray-600 mb-1">
            [{pronunciation}]
          </div>
          {chinese && (
            <div className="text-sm text-gray-500 chinese-text">
              {chinese}
            </div>
          )}
        </div>

      {/* Step indicators */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className={cn(
            'flex items-center space-x-2 px-3 py-1 rounded-full text-sm',
            step === 'listen' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          )}>
            <Volume2 className="h-4 w-4" />
            <span className="chinese-text">1. 听发音</span>
          </div>
          <div className={cn(
            'flex items-center space-x-2 px-3 py-1 rounded-full text-sm',
            step === 'record' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          )}>
            <Mic className="h-4 w-4" />
            <span className="chinese-text">2. 录制发音</span>
          </div>
          <div className={cn(
            'flex items-center space-x-2 px-3 py-1 rounded-full text-sm',
            step === 'compare' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          )}>
            <CheckCircle className="h-4 w-4" />
            <span className="chinese-text">3. 对比评价</span>
          </div>
        </div>
      </div>

      {/* Step 1: Listen */}
      {step === 'listen' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 chinese-text mb-4">
              首先听一下标准发音，注意语调和重音
            </p>
            <div className="flex justify-center">
              <Button
                onClick={playTTS}
                disabled={isPlayingTTS}
                variant="primary"
                icon={isPlayingTTS ? undefined : Play}
                className="chinese-text"
              >
                {isPlayingTTS ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    播放中...
                  </>
                ) : (
                  '🔊 播放标准发音'
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 chinese-text mt-2">
              使用语音合成技术播放，如听不到声音请检查音量设置
            </p>
          </div>
          <div className="text-center">
            <Button
              onClick={() => setStep('record')}
              variant="primary"
              className="chinese-text"
            >
              我已经听过了，开始录音
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Record */}
      {step === 'record' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 chinese-text mb-4">
              现在请录制您的发音，尽量模仿刚才听到的标准发音
            </p>
          </div>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            maxDuration={10}
          />
          <div className="text-center">
            <Button
              onClick={() => setStep('listen')}
              variant="outline"
              className="chinese-text"
            >
              重新听标准发音
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Compare */}
      {step === 'compare' && userRecording && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 chinese-text mb-4">
              对比您的发音和标准发音，给自己的表现打分
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard pronunciation */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 chinese-text mb-2">
                标准发音
              </h4>
              <div className="flex justify-center">
                <Button
                  onClick={playTTS}
                  disabled={isPlayingTTS}
                  variant="primary"
                  size="sm"
                  icon={isPlayingTTS ? undefined : Play}
                  className="chinese-text"
                >
                  {isPlayingTTS ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      播放中
                    </>
                  ) : (
                    '🔊 播放'
                  )}
                </Button>
              </div>
            </div>

            {/* User pronunciation */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 chinese-text mb-2">
                您的发音
              </h4>
              <AudioPlayer 
                src={userRecording.url} 
                variant="compact"
              />
            </div>
          </div>

          {/* Feedback buttons */}
          {!feedback && (
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => handleFeedback('good')}
                variant="primary"
                icon={CheckCircle}
                className="chinese-text"
              >
                发音很好
              </Button>
              <Button
                onClick={() => handleFeedback('needs_improvement')}
                variant="outline"
                icon={XCircle}
                className="chinese-text"
              >
                需要改进
              </Button>
            </div>
          )}

          {/* Feedback result */}
          {feedback && (
            <div className={cn(
              'text-center p-4 rounded-lg',
              feedback === 'good' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            )}>
              <div className="text-4xl mb-2">
                {feedback === 'good' ? '🎉' : '💪'}
              </div>
              <h4 className={cn(
                'font-semibold chinese-text mb-2',
                feedback === 'good' ? 'text-green-800' : 'text-yellow-800'
              )}>
                {feedback === 'good' ? '太棒了！' : '继续努力！'}
              </h4>
              <p className={cn(
                'text-sm chinese-text mb-4',
                feedback === 'good' ? 'text-green-700' : 'text-yellow-700'
              )}>
                {feedback === 'good' 
                  ? '您的发音很标准，继续保持！' 
                  : '多听多练，您会越来越好的！'
                }
              </p>
              <div className="space-x-2">
                <Button
                  onClick={resetPractice}
                  variant="outline"
                  className="chinese-text"
                >
                  再练一次
                </Button>
                <Button
                  onClick={() => {/* Move to next word */}}
                  variant="primary"
                  className="chinese-text"
                >
                  下一个词
                </Button>
              </div>
            </div>
          )}

          {/* Retry button */}
          {!feedback && (
            <div className="text-center">
              <Button
                onClick={() => setStep('record')}
                variant="outline"
                className="chinese-text"
              >
                重新录音
              </Button>
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
  </>
  );
}
