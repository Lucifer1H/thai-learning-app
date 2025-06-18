'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { Button, AudioButton } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Thai vowels data
const thaiVowels = [
  { symbol: 'อะ', sound: 'a', example: 'กะ', chinese: '短a音', pronunciation: 'a', length: 'short' },
  { symbol: 'อา', sound: 'aa', example: 'กา', chinese: '长a音', pronunciation: 'aa', length: 'long' },
  { symbol: 'อิ', sound: 'i', example: 'กิ', chinese: '短i音', pronunciation: 'i', length: 'short' },
  { symbol: 'อี', sound: 'ii', example: 'กี', chinese: '长i音', pronunciation: 'ii', length: 'long' },
  { symbol: 'อุ', sound: 'u', example: 'กุ', chinese: '短u音', pronunciation: 'u', length: 'short' },
  { symbol: 'อู', sound: 'uu', example: 'กู', chinese: '长u音', pronunciation: 'uu', length: 'long' },
  { symbol: 'เอะ', sound: 'e', example: 'เกะ', chinese: '短e音', pronunciation: 'e', length: 'short' },
  { symbol: 'เอ', sound: 'ee', example: 'เก', chinese: '长e音', pronunciation: 'ee', length: 'long' },
  { symbol: 'โอะ', sound: 'o', example: 'โกะ', chinese: '短o音', pronunciation: 'o', length: 'short' },
  { symbol: 'โอ', sound: 'oo', example: 'โก', chinese: '长o音', pronunciation: 'oo', length: 'long' },
];

export default function VowelsLessonPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedVowels, setCompletedVowels] = useState<Set<number>>(new Set());
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

  const currentVowel = thaiVowels[currentIndex];
  const progress = Math.round(((completedVowels.size) / thaiVowels.length) * 100);

  const handleNext = () => {
    if (currentIndex < thaiVowels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleMarkComplete = () => {
    setCompletedVowels(prev => new Set([...prev, currentIndex]));
  };

  const playAudio = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1500);
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
                <h1 className="text-2xl font-bold text-gray-900 chinese-text">泰语元音学习</h1>
                <p className="text-gray-600 chinese-text">学习泰语基础元音</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 chinese-text">
                {currentIndex + 1} / {thaiVowels.length}
              </p>
              <ProgressBar progress={progress} className="w-32" showLabel />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vowel Display */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              {/* Large Thai Vowel */}
              <div className="mb-6">
                <div className="text-6xl thai-text text-purple-600 font-bold mb-2">
                  {currentVowel.symbol}
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg text-gray-700 chinese-text">
                    {currentVowel.chinese}
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
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 chinese-text mb-1">发音</p>
                  <p className="text-lg font-semibold text-purple-700">
                    [{currentVowel.pronunciation}]
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 chinese-text mb-1">示例</p>
                  <p className="text-lg font-semibold text-blue-700 thai-text">
                    {currentVowel.example}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 chinese-text mb-1">长度</p>
                  <p className="text-lg font-semibold text-green-700 chinese-text">
                    {currentVowel.length === 'short' ? '短元音' : '长元音'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleMarkComplete}
                  disabled={completedVowels.has(currentIndex)}
                  variant={completedVowels.has(currentIndex) ? 'secondary' : 'primary'}
                  fullWidth
                  className="chinese-text"
                >
                  {completedVowels.has(currentIndex) ? '已掌握 ✓' : '标记为已掌握'}
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
                    disabled={currentIndex === thaiVowels.length - 1}
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
            {/* Vowel Length Explanation */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
                元音长度说明
              </h3>
              <div className="space-y-3">
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-sm chinese-text">
                    <strong>短元音：</strong>
                    发音时间较短，通常在音节末尾需要辅音结尾。
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm chinese-text">
                    <strong>长元音：</strong>
                    发音时间较长，可以单独构成音节。
                  </p>
                </div>
              </div>
            </div>

            {/* Pronunciation Tips */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
                发音技巧
              </h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm chinese-text">
                    <strong>口型提示：</strong>
                    {currentVowel.sound.includes('a') && '张开嘴巴，舌头放平'}
                    {currentVowel.sound.includes('i') && '嘴角向两边拉，舌头前伸'}
                    {currentVowel.sound.includes('u') && '嘴唇收圆，舌头后缩'}
                    {currentVowel.sound.includes('e') && '嘴巴半开，舌头中位'}
                    {currentVowel.sound.includes('o') && '嘴唇圆形，舌头后位'}
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-sm chinese-text">
                    <strong>练习建议：</strong>
                    重复发音，注意长短元音的区别，可以录音对比。
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
                学习进度
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {thaiVowels.map((vowel, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`
                      p-2 rounded text-center thai-text text-sm font-semibold transition-colors
                      ${index === currentIndex 
                        ? 'bg-purple-500 text-white' 
                        : completedVowels.has(index)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {vowel.symbol}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 chinese-text mt-3">
                已掌握: {completedVowels.size} / {thaiVowels.length} 个元音
              </p>
            </div>

            {/* Vowel Combinations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
                元音组合示例
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="thai-text text-lg">{currentVowel.example}</span>
                  <span className="text-sm text-gray-600">
                    [{currentVowel.pronunciation}]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {completedVowels.size === thaiVowels.length && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 chinese-text mb-2">
              恭喜！您已完成所有元音的学习
            </h3>
            <p className="text-green-700 chinese-text mb-4">
              您已经掌握了泰语的基础元音，可以继续学习声调了！
            </p>
            <Link href="/lessons/pronunciation">
              <Button
                variant="primary"
                className="chinese-text"
              >
                继续学习声调
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
