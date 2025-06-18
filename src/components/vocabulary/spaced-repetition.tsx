'use client';

import { useState, useEffect } from 'react';
import { VocabularyCard } from './vocabulary-card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Calendar, Clock, Trophy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ReviewItem extends VocabularyItem {
  mastery_level: number; // 0-5
  next_review_at: Date;
  last_reviewed_at?: Date;
  correct_answers: number;
  total_attempts: number;
}

interface SpacedRepetitionProps {
  vocabularyItems: VocabularyItem[];
  onProgress?: (progress: { completed: number; total: number; accuracy: number }) => void;
  className?: string;
}

// Spaced repetition intervals (in days)
const INTERVALS = [1, 3, 7, 14, 30, 90];

export function SpacedRepetition({ 
  vocabularyItems, 
  onProgress,
  className 
}: SpacedRepetitionProps) {
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    total: 0
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Initialize review items with spaced repetition data
    const items: ReviewItem[] = vocabularyItems.map(item => ({
      ...item,
      mastery_level: 0,
      next_review_at: new Date(),
      correct_answers: 0,
      total_attempts: 0
    }));
    
    // Sort by next review date (due items first)
    items.sort((a, b) => a.next_review_at.getTime() - b.next_review_at.getTime());
    
    setReviewItems(items);
    setSessionStats({ reviewed: 0, correct: 0, total: items.length });
  }, [vocabularyItems]);

  const calculateNextReview = (masteryLevel: number, difficulty: 'easy' | 'medium' | 'hard') => {
    let newLevel = masteryLevel;
    let intervalIndex = Math.min(masteryLevel, INTERVALS.length - 1);

    switch (difficulty) {
      case 'easy':
        newLevel = Math.min(masteryLevel + 1, 5);
        intervalIndex = Math.min(newLevel, INTERVALS.length - 1);
        break;
      case 'medium':
        // Keep same level
        intervalIndex = Math.min(masteryLevel, INTERVALS.length - 1);
        break;
      case 'hard':
        newLevel = Math.max(masteryLevel - 1, 0);
        intervalIndex = Math.max(newLevel - 1, 0);
        break;
    }

    const interval = INTERVALS[intervalIndex];
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return { newLevel, nextReview };
  };

  const handleAnswer = (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentItem = reviewItems[currentIndex];
    const isCorrect = difficulty !== 'hard';
    
    const { newLevel, nextReview } = calculateNextReview(currentItem.mastery_level, difficulty);
    
    // Update the item
    const updatedItem: ReviewItem = {
      ...currentItem,
      mastery_level: newLevel,
      next_review_at: nextReview,
      last_reviewed_at: new Date(),
      correct_answers: currentItem.correct_answers + (isCorrect ? 1 : 0),
      total_attempts: currentItem.total_attempts + 1
    };

    // Update review items
    const updatedItems = [...reviewItems];
    updatedItems[currentIndex] = updatedItem;
    setReviewItems(updatedItems);

    // Update session stats
    const newStats = {
      reviewed: sessionStats.reviewed + 1,
      correct: sessionStats.correct + (isCorrect ? 1 : 0),
      total: sessionStats.total
    };
    setSessionStats(newStats);

    // Move to next item or complete session
    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
    }

    // Report progress
    const accuracy = newStats.reviewed > 0 ? (newStats.correct / newStats.reviewed) * 100 : 0;
    onProgress?.({
      completed: newStats.reviewed,
      total: newStats.total,
      accuracy
    });
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setSessionStats({ reviewed: 0, correct: 0, total: reviewItems.length });
    setIsComplete(false);
  };

  const getDueItems = () => {
    const now = new Date();
    return reviewItems.filter(item => item.next_review_at <= now);
  };

  const getMasteryStats = () => {
    const stats = { beginner: 0, intermediate: 0, advanced: 0, mastered: 0 };
    reviewItems.forEach(item => {
      if (item.mastery_level === 0) stats.beginner++;
      else if (item.mastery_level <= 2) stats.intermediate++;
      else if (item.mastery_level <= 4) stats.advanced++;
      else stats.mastered++;
    });
    return stats;
  };

  if (reviewItems.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="text-4xl mb-4">📚</div>
        <p className="text-gray-600 chinese-text">正在加载词汇...</p>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = sessionStats.reviewed > 0 ? (sessionStats.correct / sessionStats.reviewed) * 100 : 0;
    const masteryStats = getMasteryStats();

    return (
      <div className={cn('max-w-md mx-auto', className)}>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 chinese-text mb-4">
            复习完成！
          </h3>
          
          {/* Session Stats */}
          <div className="space-y-3 mb-6">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-600 chinese-text">本次复习</p>
              <p className="text-lg font-bold text-blue-800">
                {sessionStats.reviewed} / {sessionStats.total} 个词
              </p>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-600 chinese-text">正确率</p>
              <p className="text-lg font-bold text-green-800">
                {accuracy.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Mastery Overview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 chinese-text mb-2">
              掌握程度分布
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-red-50 p-2 rounded">
                <p className="text-red-600 chinese-text">初学</p>
                <p className="font-bold text-red-800">{masteryStats.beginner}</p>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <p className="text-yellow-600 chinese-text">进步</p>
                <p className="font-bold text-yellow-800">{masteryStats.intermediate}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-blue-600 chinese-text">熟练</p>
                <p className="font-bold text-blue-800">{masteryStats.advanced}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-green-600 chinese-text">精通</p>
                <p className="font-bold text-green-800">{masteryStats.mastered}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={resetSession}
              variant="primary"
              fullWidth
              icon={RotateCcw}
              className="chinese-text"
            >
              再次复习
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              fullWidth
              className="chinese-text"
            >
              返回词汇列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = reviewItems[currentIndex];
  const progress = ((currentIndex + 1) / reviewItems.length) * 100;
  const dueItems = getDueItems();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 chinese-text">
            复习进度
          </span>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {reviewItems.length}
          </span>
        </div>
        <ProgressBar progress={progress} />
        
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span className="chinese-text">待复习: {dueItems.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="h-3 w-3" />
            <span className="chinese-text">
              正确率: {sessionStats.reviewed > 0 ? ((sessionStats.correct / sessionStats.reviewed) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Current Item Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 chinese-text">掌握等级:</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    i < currentItem.mastery_level ? 'bg-green-400' : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
          </div>
          <div className="text-gray-500">
            {currentItem.total_attempts > 0 && (
              <span className="chinese-text">
                正确率: {((currentItem.correct_answers / currentItem.total_attempts) * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vocabulary Card */}
      <VocabularyCard
        vocabulary={currentItem}
        mode="review"
        onAnswer={handleAnswer}
      />

      {/* Next Review Info */}
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          <span className="chinese-text">
            下次复习: {currentItem.next_review_at.toLocaleDateString('zh-CN')}
          </span>
        </div>
      </div>
    </div>
  );
}
