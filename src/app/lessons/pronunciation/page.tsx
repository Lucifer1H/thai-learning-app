'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { PronunciationPractice } from '@/components/audio/pronunciation-practice';
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import Link from 'next/link';

// Thai tones and pronunciation data
const thaiTones = [
  {
    name: '中平调',
    thai: 'สามัญ',
    symbol: '◌',
    description: '中等音高，平稳不变',
    examples: [
      { word: 'กา', pronunciation: 'gaa', chinese: '乌鸦', audioUrl: '/audio/tones/gaa-mid.mp3' },
      { word: 'มา', pronunciation: 'maa', chinese: '来', audioUrl: '/audio/tones/maa-mid.mp3' },
      { word: 'นา', pronunciation: 'naa', chinese: '田', audioUrl: '/audio/tones/naa-mid.mp3' },
    ]
  },
  {
    name: '低降调',
    thai: 'เอก',
    symbol: '◌่',
    description: '从中音降到低音',
    examples: [
      { word: 'ก่า', pronunciation: 'gàa', chinese: '分支', audioUrl: '/audio/tones/gaa-low.mp3' },
      { word: 'ม่า', pronunciation: 'màa', chinese: '马', audioUrl: '/audio/tones/maa-low.mp3' },
      { word: 'น่า', pronunciation: 'nàa', chinese: '可爱的', audioUrl: '/audio/tones/naa-low.mp3' },
    ]
  },
  {
    name: '高降调',
    thai: 'โท',
    symbol: '◌้',
    description: '从高音急降到低音',
    examples: [
      { word: 'ก้า', pronunciation: 'gâa', chinese: '步骤', audioUrl: '/audio/tones/gaa-falling.mp3' },
      { word: 'ม้า', pronunciation: 'mâa', chinese: '马', audioUrl: '/audio/tones/maa-falling.mp3' },
      { word: 'น้า', pronunciation: 'náa', chinese: '水', audioUrl: '/audio/tones/naa-falling.mp3' },
    ]
  },
  {
    name: '高平调',
    thai: 'ตรี',
    symbol: '◌๊',
    description: '高音平稳',
    examples: [
      { word: 'ก๊า', pronunciation: 'gáa', chinese: '气体', audioUrl: '/audio/tones/gaa-high.mp3' },
      { word: 'ม๊า', pronunciation: 'máa', chinese: '妈妈（口语）', audioUrl: '/audio/tones/maa-high.mp3' },
    ]
  },
  {
    name: '升调',
    thai: 'จัตวา',
    symbol: '◌๋',
    description: '从低音升到高音',
    examples: [
      { word: 'ก๋า', pronunciation: 'gǎa', chinese: '咖啡', audioUrl: '/audio/tones/gaa-rising.mp3' },
      { word: 'ม๋า', pronunciation: 'mǎa', chinese: '狗', audioUrl: '/audio/tones/maa-rising.mp3' },
    ]
  },
];

export default function PronunciationLessonPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentToneIndex, setCurrentToneIndex] = useState(0);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [completedExamples, setCompletedExamples] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingPage message="加载发音课程中..." />;
  }

  if (!user) {
    return null;
  }

  const currentTone = thaiTones[currentToneIndex];
  const currentExample = currentTone.examples[currentExampleIndex];
  const exampleKey = `${currentToneIndex}-${currentExampleIndex}`;
  
  const totalExamples = thaiTones.reduce((sum, tone) => sum + tone.examples.length, 0);
  const progress = Math.round((completedExamples.size / totalExamples) * 100);

  const handlePracticeComplete = (score: number) => {
    setCompletedExamples(prev => new Set([...prev, exampleKey]));
    setScores(prev => ({ ...prev, [exampleKey]: score }));
  };

  const handleNext = () => {
    if (currentExampleIndex < currentTone.examples.length - 1) {
      setCurrentExampleIndex(currentExampleIndex + 1);
    } else if (currentToneIndex < thaiTones.length - 1) {
      setCurrentToneIndex(currentToneIndex + 1);
      setCurrentExampleIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentExampleIndex > 0) {
      setCurrentExampleIndex(currentExampleIndex - 1);
    } else if (currentToneIndex > 0) {
      setCurrentToneIndex(currentToneIndex - 1);
      setCurrentExampleIndex(thaiTones[currentToneIndex - 1].examples.length - 1);
    }
  };

  const isLastExample = currentToneIndex === thaiTones.length - 1 && 
                       currentExampleIndex === currentTone.examples.length - 1;
  const isFirstExample = currentToneIndex === 0 && currentExampleIndex === 0;

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
                <h1 className="text-2xl font-bold text-gray-900 chinese-text">泰语发音练习</h1>
                <p className="text-gray-600 chinese-text">学习泰语的5个声调</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 chinese-text">
                总进度: {completedExamples.size} / {totalExamples}
              </p>
              <ProgressBar progress={progress} className="w-32" showLabel />
            </div>
          </div>
        </div>

        {/* Current Tone Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 chinese-text mb-2">
              {currentTone.name}
            </h2>
            <div className="text-xl thai-text text-blue-600 mb-2">
              {currentTone.thai}
            </div>
            <div className="text-lg text-gray-600 mb-2">
              声调符号: <span className="text-2xl thai-text">{currentTone.symbol}</span>
            </div>
            <p className="text-gray-600 chinese-text">
              {currentTone.description}
            </p>
          </div>

          {/* Tone visualization */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 chinese-text mb-2">声调图示</h3>
            <div className="relative h-20 bg-white rounded border">
              {/* Tone curve visualization would go here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500 chinese-text text-sm">
                  {currentTone.description}
                </span>
              </div>
            </div>
          </div>

          {/* Examples navigation */}
          <div className="flex justify-center space-x-2 mb-4">
            {currentTone.examples.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentExampleIndex(index)}
                className={`
                  w-3 h-3 rounded-full transition-colors
                  ${index === currentExampleIndex 
                    ? 'bg-blue-500' 
                    : completedExamples.has(`${currentToneIndex}-${index}`)
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* Pronunciation Practice */}
        <PronunciationPractice
          word={currentExample.word}
          pronunciation={currentExample.pronunciation}
          audioUrl={currentExample.audioUrl}
          chinese={currentExample.chinese}
          onComplete={handlePracticeComplete}
          className="mb-6"
        />

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={isFirstExample}
            variant="outline"
            icon={ArrowLeft}
            className="chinese-text"
          >
            上一个
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 chinese-text">
              {currentTone.name} - 示例 {currentExampleIndex + 1} / {currentTone.examples.length}
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={isLastExample}
            variant="outline"
            icon={ArrowRight}
            iconPosition="right"
            className="chinese-text"
          >
            下一个
          </Button>
        </div>

        {/* Completion Message */}
        {completedExamples.size === totalExamples && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 chinese-text mb-2">
              恭喜！您已完成所有发音练习
            </h3>
            <p className="text-green-700 chinese-text mb-4">
              您已经掌握了泰语的5个声调，可以继续学习词汇了！
            </p>
            <div className="space-x-2">
              <Link href="/vocabulary">
                <Button
                  variant="primary"
                  className="chinese-text"
                >
                  开始学习词汇
                </Button>
              </Link>
              <Button
                onClick={() => {
                  setCurrentToneIndex(0);
                  setCurrentExampleIndex(0);
                  setCompletedExamples(new Set());
                  setScores({});
                }}
                variant="outline"
                className="chinese-text"
              >
                重新练习
              </Button>
            </div>
          </div>
        )}

        {/* Progress Summary */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
            学习进度总览
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {thaiTones.map((tone, toneIndex) => (
              <div key={toneIndex} className="text-center">
                <h4 className="font-medium text-gray-900 chinese-text mb-2">
                  {tone.name}
                </h4>
                <div className="space-y-1">
                  {tone.examples.map((example, exampleIndex) => {
                    const key = `${toneIndex}-${exampleIndex}`;
                    const isCompleted = completedExamples.has(key);
                    const score = scores[key];
                    
                    return (
                      <div
                        key={exampleIndex}
                        className={`
                          text-sm p-2 rounded thai-text
                          ${isCompleted 
                            ? score && score >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}
                      >
                        {example.word}
                        {isCompleted && score && (
                          <span className="ml-1 text-xs">
                            ({score}%)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
