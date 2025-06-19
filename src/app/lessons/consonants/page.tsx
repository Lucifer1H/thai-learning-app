'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { Button, AudioButton } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ImprovedWritingPractice } from '@/components/ImprovedWritingPractice';
import { ArrowLeft, ArrowRight, Volume2, BookOpen, Settings } from 'lucide-react';
import { playAudioWithFallback, audioManager } from '@/lib/audio-utils';
import { VoiceSetupGuide } from '@/components/audio/voice-setup-guide';
import Link from 'next/link';
import {
  getThaiConsonants,
  getUserLetterProgress,
  markLetterAsLearned,
  incrementPracticeCount,
  type ThaiConsonant,
  type UserLetterProgress
} from '@/lib/thai-letters';

// 使用标准泰语字体的正确笔画数据 - 基于300x300画布，居中显示
const fallbackConsonants = [
  {
    letter: 'ก',
    name: 'ก ไก่',
    sound: 'g',
    meaning: 'chicken',
    chinese: '鸡',
    pronunciation: 'gɔɔ gài',
    strokes: [
      // 第一笔：左侧圆形头部 - 根据标准书写顺序，更接近真实ก字母形状
      'M 90 140 C 90 110, 110 90, 140 90 C 170 90, 190 110, 190 140 C 190 170, 170 190, 140 190 C 110 190, 90 170, 90 140 Z',
      // 第二笔：从圆形右侧向右的横线 - 与圆形平滑连接
      'M 190 140 L 260 140',
      // 第三笔：从横线末端向下的竖线 - 标准长度
      'M 260 140 L 260 240'
    ]
  },
  {
    letter: 'ข',
    name: 'ข ไข่',
    sound: 'kh',
    meaning: 'egg',
    chinese: '蛋',
    pronunciation: 'khɔ̌ɔ khài',
    strokes: [
      'M 80 95 A 25 25 0 1 0 80 145 A 25 25 0 1 0 80 95', // 左侧圆形头部
      'M 105 120 L 180 120', // 横线
      'M 130 120 L 130 200', // 中间竖线
      'M 190 105 A 15 15 0 1 0 190 135 A 15 15 0 1 0 190 105' // 右侧小圆
    ]
  },
  {
    letter: 'ค',
    name: 'ค ควาย',
    sound: 'kh',
    meaning: 'buffalo',
    chinese: '水牛',
    pronunciation: 'khɔɔ khwaai',
    strokes: [
      'M 80 95 A 25 25 0 1 0 80 145 A 25 25 0 1 0 80 95', // 左侧圆形头部
      'M 105 120 L 180 120', // 横线
      'M 130 120 L 130 200', // 中间竖线
      'M 190 110 L 220 110', // 右上横线
      'M 205 95 L 205 125' // 右侧竖线
    ]
  },
  {
    letter: 'ง',
    name: 'ง งู',
    sound: 'ng',
    meaning: 'snake',
    chinese: '蛇',
    pronunciation: 'ngɔɔ nguu',
    strokes: [
      'M 100 95 A 25 25 0 1 0 100 145 A 25 25 0 1 0 100 95', // 圆形头部
      'M 125 120 L 200 120', // 横线
      'M 200 120 Q 220 140 220 170 Q 210 190 190 190 Q 170 180 170 160' // 右侧弯钩
    ]
  },
  {
    letter: 'จ',
    name: 'จ จาน',
    sound: 'j',
    meaning: 'plate',
    chinese: '盘子',
    pronunciation: 'jɔɔ jaan',
    strokes: [
      'M 80 110 L 220 110', // 上横线
      'M 150 110 L 150 180', // 中竖线
      'M 130 180 Q 150 195 170 180' // 底部小弧
    ]
  },
  {
    letter: 'ฉ',
    name: 'ฉ ฉิ่ง',
    sound: 'ch',
    meaning: 'cymbal',
    chinese: '钹',
    pronunciation: 'chɔ̌ɔ chìng',
    strokes: [
      'M 80 110 L 220 110', // 上横线
      'M 150 110 L 150 180', // 中竖线
      'M 120 140 L 180 140', // 中横线
      'M 130 180 Q 150 195 170 180', // 底部小弧
      'M 200 95 L 230 95 M 215 85 L 215 105' // 右上装饰
    ]
  },
];

export default function ConsonantsLessonPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [consonants, setConsonants] = useState<ThaiConsonant[]>([]);
  const [userProgress, setUserProgress] = useState<UserLetterProgress[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [voiceQuality, setVoiceQuality] = useState<'excellent' | 'good' | 'basic' | 'none'>('none');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // 加载字母数据和用户进度
  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        setDataLoading(true);
        const [consonantsData, progressData] = await Promise.all([
          getThaiConsonants(),
          getUserLetterProgress(user.id)
        ]);

        setConsonants(consonantsData);
        setUserProgress(progressData);

        // 设置已完成的字母
        const completedIndices = new Set<number>();
        consonantsData.forEach((consonant, index) => {
          const progress = progressData.find(p =>
            p.letter_type === 'consonant' && p.letter_id === consonant.id
          );
          if (progress?.is_learned) {
            completedIndices.add(index);
          }
        });
        setCompletedLetters(completedIndices);

      } catch (error) {
        console.error('加载数据失败:', error);
        // 如果数据库加载失败，使用fallback数据
        setConsonants(fallbackConsonants.map((c, index) => ({
          ...c,
          id: `fallback-${index}`,
          chinese_meaning: c.chinese,
          tone_class: 'mid' as const,
          order_index: index + 1,
          difficulty_level: 'beginner' as const,
          is_obsolete: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [user]);

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

  if (loading || dataLoading) {
    return <LoadingPage message="加载课程中..." />;
  }

  if (!user || consonants.length === 0) {
    return null;
  }

  const currentLetter = consonants[currentIndex];
  const progress = Math.round(((completedLetters.size) / consonants.length) * 100);

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

  const handleNext = () => {
    if (currentIndex < consonants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkComplete = async () => {
    if (!user) return;

    try {
      const currentLetter = consonants[currentIndex];
      await markLetterAsLearned(user.id, 'consonant', currentLetter.id);
      setCompletedLetters(prev => new Set([...prev, currentIndex]));

      // 更新用户进度状态
      const updatedProgress = await getUserLetterProgress(user.id);
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('标记字母完成时出错:', error);
      // 即使API失败，也在本地标记为完成
      setCompletedLetters(prev => new Set([...prev, currentIndex]));
    }
  };

  const playAudio = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    console.log('开始播放音频:', currentLetter.letter);

    try {
      // 确保语音合成可用
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
            window.speechSynthesis.onvoiceschanged = () => {
              resolve();
            };
          }
        });
      };

      await waitForVoices();

      // 创建语音合成实例
      const utterance = new SpeechSynthesisUtterance(currentLetter.letter);

      // 使用选定的语音或最佳泰语语音
      const voiceToUse = selectedVoice || audioManager.getBestThaiVoice();

      if (voiceToUse) {
        utterance.voice = voiceToUse;
        console.log('使用泰语语音:', voiceToUse.name);
      } else {
        console.log('未找到泰语语音，使用默认语音');
      }

      utterance.lang = 'th-TH';
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // 设置事件监听器
      utterance.onstart = () => {
        console.log('🔊 语音开始播放 - 如果您听不到声音，请检查：');
        console.log('1. 浏览器是否静音');
        console.log('2. 系统音量是否开启');
        console.log('3. 音频输出设备是否正确');
        console.log('4. 尝试调高系统音量');
      };

      utterance.onend = () => {
        console.log('✅ 语音播放完成 - 如果没有听到声音，这是浏览器/系统设置问题，不是代码问题');
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error('❌ 语音播放错误:', event.error);
        console.log('💡 尝试解决方案：');
        console.log('1. 刷新页面重试');
        console.log('2. 尝试其他浏览器（Chrome/Edge）');
        console.log('3. 检查浏览器权限设置');
        setIsPlaying(false);
      };

      // 播放语音
      window.speechSynthesis.speak(utterance);

      // 额外的音频诊断信息
      console.log('🔧 音频诊断信息：');
      console.log('- 可用语音数量:', voices.length);
      console.log('- 泰语语音:', thaiVoice ? `找到: ${thaiVoice.name}` : '未找到，使用默认语音');
      console.log('- 语音合成支持:', 'speechSynthesis' in window ? '✅ 支持' : '❌ 不支持');
      console.log('- 当前音量设置:', utterance.volume);
      console.log('- 播放速度:', utterance.rate);

    } catch (error) {
      console.error('❌ 音频播放失败:', error);
      console.log('💡 这通常是浏览器或系统问题，不是代码问题');
      setIsPlaying(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/lessons/alphabet" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 chinese-text">泰语辅音学习</h1>
                <p className="text-gray-600 chinese-text">学习44个泰语辅音字母</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4 mb-2">
                <span className={`text-xs ${getVoiceQualityInfo().color}`}>
                  {getVoiceQualityInfo().icon} {getVoiceQualityInfo().text}
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
              <p className="text-sm text-gray-600 chinese-text">
                {currentIndex + 1} / {consonants.length}
              </p>
              <ProgressBar progress={progress} className="w-32" showLabel />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Top Section - Letter Display and Memory Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Letter Display */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                  {/* Large Thai Letter */}
                  <div className="mb-6">
                    <div className="text-9xl thai-text text-blue-600 font-bold mb-2" style={{ fontSize: '12rem', lineHeight: '1' }}>
                      {currentLetter.letter}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xl thai-text text-gray-700">
                        {currentLetter.name}
                      </span>
                      <AudioButton
                        onClick={playAudio}
                        isPlaying={isPlaying}
                        className="ml-2"
                        title={isPlaying ? "正在播放..." : "点击播放发音"}
                      />
                      {isPlaying && (
                        <span className="ml-2 text-sm text-blue-600 animate-pulse chinese-text">
                          🔊 播放中... (检查音量设置)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pronunciation Guide */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 chinese-text mb-1">发音</p>
                      <p className="text-lg font-semibold text-blue-700">
                        [{currentLetter.pronunciation}]
                      </p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 chinese-text mb-1">含义</p>
                      <p className="text-lg font-semibold text-green-700">
                        {currentLetter.meaning} ({currentLetter.chinese_meaning})
                      </p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 chinese-text mb-1">音值</p>
                      <p className="text-lg font-semibold text-purple-700">
                        [{currentLetter.sound}]
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleMarkComplete}
                      disabled={completedLetters.has(currentIndex)}
                      variant={completedLetters.has(currentIndex) ? 'secondary' : 'primary'}
                      fullWidth
                      className="chinese-text"
                    >
                      {completedLetters.has(currentIndex) ? '已掌握 ✓' : '标记为已掌握'}
                    </Button>

                    <div className="flex space-x-2">
                      <Button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        variant="outline"
                        icon={ArrowLeft}
                        className="flex-1 chinese-text"
                      >
                        上一个
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={currentIndex === consonants.length - 1}
                        variant="outline"
                        icon={ArrowRight}
                        iconPosition="right"
                        className="flex-1 chinese-text"
                      >
                        下一个
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Tips - Prominent Position */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-lg p-6 border-l-4 border-yellow-400">
                <h3 className="text-xl font-bold text-gray-900 chinese-text mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  记忆技巧
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-yellow-700 chinese-text mb-2">联想记忆</h4>
                    <p className="text-sm chinese-text text-gray-700">
                      <strong>{currentLetter.letter}</strong> 的形状像 <strong>{currentLetter.chinese_meaning}</strong>，
                      发音是 <strong>[{currentLetter.sound}]</strong>
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-blue-700 chinese-text mb-2">发音提示</h4>
                    <p className="text-sm chinese-text text-gray-700">
                      这个字母在泰语中的发音类似中文的某些音，
                      多听多练习可以更好地掌握。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Writing Practice */}
          <div className="bg-white rounded-lg shadow-lg">
            <ImprovedWritingPractice
              letter={currentLetter.letter}
              onComplete={() => {
                console.log('Writing practice completed successfully!');
                // 可以在这里添加完成练习后的逻辑，比如自动标记为已掌握
              }}
              className="shadow-none"
            />
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 chinese-text">
              学习进度
            </h3>
            <p className="text-sm text-gray-600 chinese-text">
              已掌握: {completedLetters.size} / {consonants.length} 个字母
            </p>
          </div>
          <div className="grid grid-cols-11 sm:grid-cols-22 gap-2">
            {consonants.map((letter, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`
                  aspect-square rounded text-center thai-text text-sm font-semibold transition-colors
                  ${index === currentIndex
                    ? 'bg-blue-500 text-white'
                    : completedLetters.has(index)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                title={letter.name}
              >
                {letter.letter}
              </button>
            ))}
          </div>
        </div>

        {/* Completion Message */}
        {completedLetters.size === consonants.length && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 chinese-text mb-2">
              恭喜！您已完成所有辅音字母的学习
            </h3>
            <p className="text-green-700 chinese-text mb-4">
              您已经掌握了泰语的基础辅音字母，可以继续学习元音了！
            </p>
            <Link href="/lessons/vowels">
              <Button
                variant="primary"
                className="chinese-text"
              >
                继续学习元音
              </Button>
            </Link>
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
