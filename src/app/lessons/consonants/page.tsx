'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { Button, AudioButton } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StrokeOrder, PracticeCanvas } from '@/components/lesson/stroke-order';
import { ArrowLeft, ArrowRight, Volume2, BookOpen } from 'lucide-react';
import { playAudioWithFallback } from '@/lib/audio-utils';
import Link from 'next/link';
import {
  getThaiConsonants,
  getUserLetterProgress,
  markLetterAsLearned,
  incrementPracticeCount,
  type ThaiConsonant,
  type UserLetterProgress
} from '@/lib/thai-letters';

// Fallback consonants data (if database is unavailable)
const fallbackConsonants = [
  {
    letter: 'ก',
    name: 'ก ไก่',
    sound: 'g',
    meaning: 'chicken',
    chinese: '鸡',
    pronunciation: 'gɔɔ gài',
    strokes: [
      'M60,40 Q90,30 120,40 Q90,50 60,40', // 上部圆弧
      'M90,40 L90,120', // 中间竖线
      'M75,75 L105,75' // 中间横线
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
      'M50,40 Q80,30 110,40 Q80,50 50,40', // 左侧圆弧
      'M80,40 L80,120', // 左侧竖线
      'M65,75 L95,75', // 左侧横线
      'M120,35 Q135,30 150,35 Q135,40 120,35' // 右侧小圆弧
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
      'M50,40 Q80,30 110,40 Q80,50 50,40', // 左侧圆弧
      'M80,40 L80,120', // 左侧竖线
      'M65,75 L95,75', // 左侧横线
      'M120,45 L140,45', // 右侧横线
      'M130,35 L130,55' // 右侧竖线
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
      'M70,50 Q100,40 130,50 Q100,60 70,50', // 上部圆弧
      'M100,50 L100,100 Q90,110 80,100' // 下部带钩
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
      'M60,45 L120,45', // 上横线
      'M90,45 L90,100', // 中竖线
      'M80,100 Q90,110 100,100' // 下部小弧
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
      'M60,45 L120,45', // 上横线
      'M90,45 L90,100', // 中竖线
      'M75,70 L105,70', // 中横线
      'M80,100 Q90,110 100,100' // 下部小弧
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

  if (loading || dataLoading) {
    return <LoadingPage message="加载课程中..." />;
  }

  if (!user || consonants.length === 0) {
    return null;
  }

  const currentLetter = consonants[currentIndex];
  const progress = Math.round(((completedLetters.size) / consonants.length) * 100);

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

    try {
      // 尝试播放音频文件，如果失败则使用语音合成
      const audioUrl = `/audio/consonants/${currentLetter.letter}.mp3`;
      await playAudioWithFallback(audioUrl, currentLetter.letter, {
        lang: 'th-TH',
        rate: 0.8
      });
    } catch (error) {
      console.warn('音频播放失败:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
              <p className="text-sm text-gray-600 chinese-text">
                {currentIndex + 1} / {consonants.length}
              </p>
              <ProgressBar progress={progress} className="w-32" showLabel />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Letter Display - Left Column */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                {/* Large Thai Letter */}
                <div className="mb-6">
                  <div className="text-8xl thai-text text-blue-600 font-bold mb-2">
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
                    />
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

          {/* Stroke Order Practice - Middle Column */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <StrokeOrder
                letter={currentLetter.letter}
                strokes={currentLetter.strokes}
                className="shadow-none"
              />
            </div>
          </div>

          {/* Writing Practice and Progress - Right Column */}
          <div className="xl:col-span-1 space-y-6">
            {/* Writing Practice Canvas */}
            <div className="bg-white rounded-lg shadow-lg">
              <PracticeCanvas
                letter={currentLetter.letter}
                onComplete={() => console.log('Practice completed!')}
                className="shadow-none"
              />
            </div>

            {/* Memory Tips */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-3">
                记忆技巧
              </h3>
              <div className="space-y-2">
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm chinese-text">
                    <strong>联想记忆：</strong>
                    {currentLetter.letter} 的形状像 {currentLetter.chinese_meaning}，
                    发音是 [{currentLetter.sound}]
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm chinese-text">
                    <strong>发音提示：</strong>
                    这个字母在泰语中的发音类似中文的某些音，
                    多听多练习可以更好地掌握。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview - Full Width */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
            学习进度
          </h3>
          <div className="grid grid-cols-8 sm:grid-cols-11 md:grid-cols-22 gap-2">
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
          <p className="text-sm text-gray-600 chinese-text mt-3">
            已掌握: {completedLetters.size} / {consonants.length} 个字母
          </p>
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
    </div>
  );
}
