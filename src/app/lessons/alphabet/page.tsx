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
import Link from 'next/link';

// Thai consonants data with stroke information
const thaiConsonants = [
  {
    letter: 'ก',
    name: 'ก ไก่',
    sound: 'g',
    meaning: 'chicken',
    chinese: '鸡',
    pronunciation: 'gɔɔ gài',
    strokes: ['M50,50 Q100,30 150,50 Q100,70 50,50', 'M100,50 L100,150']
  },
  {
    letter: 'ข',
    name: 'ข ไข่',
    sound: 'kh',
    meaning: 'egg',
    chinese: '蛋',
    pronunciation: 'khɔ̌ɔ khài',
    strokes: ['M50,50 Q100,30 150,50 Q100,70 50,50', 'M100,50 L100,150', 'M80,80 L120,80']
  },
  {
    letter: 'ค',
    name: 'ค ควาย',
    sound: 'kh',
    meaning: 'buffalo',
    chinese: '水牛',
    pronunciation: 'khɔɔ khwaai',
    strokes: ['M50,50 Q100,30 150,50 Q100,70 50,50', 'M100,50 L100,150', 'M70,100 L130,100']
  },
  {
    letter: 'ง',
    name: 'ง งู',
    sound: 'ng',
    meaning: 'snake',
    chinese: '蛇',
    pronunciation: 'ngɔɔ nguu',
    strokes: ['M50,80 Q100,50 150,80 Q100,110 50,80']
  },
  {
    letter: 'จ',
    name: 'จ จาน',
    sound: 'j',
    meaning: 'plate',
    chinese: '盘子',
    pronunciation: 'jɔɔ jaan',
    strokes: ['M50,50 L150,50', 'M100,50 L100,150', 'M80,120 Q100,140 120,120']
  },
  {
    letter: 'ฉ',
    name: 'ฉ ฉิ่ง',
    sound: 'ch',
    meaning: 'cymbal',
    chinese: '钹',
    pronunciation: 'chɔ̌ɔ chìng',
    strokes: ['M50,50 L150,50', 'M100,50 L100,150', 'M70,80 L130,80', 'M80,120 Q100,140 120,120']
  },
];

export default function AlphabetLessonPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingPage message="加载课程中..." />;
  }

  if (!user) {
    return null;
  }

  const currentLetter = thaiConsonants[currentIndex];
  const progress = Math.round(((completedLetters.size) / thaiConsonants.length) * 100);

  const handleNext = () => {
    if (currentIndex < thaiConsonants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkComplete = () => {
    setCompletedLetters(prev => new Set([...prev, currentIndex]));
  };

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 2000);
    
    // In a real implementation, you would play the actual audio file
    // const audio = new Audio(`/audio/consonants/${currentLetter.letter}.mp3`);
    // audio.play();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 chinese-text">泰语字母学习</h1>
                <p className="text-gray-600 chinese-text">学习泰语辅音字母</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 chinese-text">
                {currentIndex + 1} / {thaiConsonants.length}
              </p>
              <ProgressBar progress={progress} className="w-32" showLabel />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Letter Display */}
          <div className="bg-white rounded-lg shadow-lg p-8">
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
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 chinese-text mb-1">发音</p>
                  <p className="text-lg font-semibold text-blue-700">
                    [{currentLetter.pronunciation}]
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 chinese-text mb-1">含义</p>
                  <p className="text-lg font-semibold text-green-700">
                    {currentLetter.meaning} ({currentLetter.chinese})
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
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
                    disabled={currentIndex === thaiConsonants.length - 1}
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

          {/* Learning Tips */}
          <div className="space-y-6">
            {/* Stroke Order Practice */}
            <StrokeOrder
              letter={currentLetter.letter}
              strokes={currentLetter.strokes}
            />

            {/* Writing Practice Canvas */}
            <PracticeCanvas
              letter={currentLetter.letter}
              onComplete={() => console.log('Practice completed!')}
            />

            {/* Memory Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
                记忆技巧
              </h3>
              <div className="space-y-3">
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm chinese-text">
                    <strong>联想记忆：</strong>
                    {currentLetter.letter} 的形状像 {currentLetter.chinese}，
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

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
                学习进度
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {thaiConsonants.map((letter, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`
                      p-2 rounded text-center thai-text text-lg font-semibold transition-colors
                      ${index === currentIndex 
                        ? 'bg-blue-500 text-white' 
                        : completedLetters.has(index)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {letter.letter}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 chinese-text mt-3">
                已掌握: {completedLetters.size} / {thaiConsonants.length} 个字母
              </p>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {completedLetters.size === thaiConsonants.length && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 chinese-text mb-2">
              恭喜！您已完成所有字母的学习
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
