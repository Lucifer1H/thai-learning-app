'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { VocabularyCard, VocabularyQuiz } from '@/components/vocabulary/vocabulary-card';
import { SpacedRepetition } from '@/components/vocabulary/spaced-repetition';
import { Search, Filter, BookOpen, Brain, Trophy, Play } from 'lucide-react';
import toast from 'react-hot-toast';

interface VocabularyItem {
  id: string;
  thai_word: string;
  chinese_translation: string;
  pronunciation: string;
  audio_url?: string;
  category: string;
  difficulty_level: string;
  usage_example_thai?: string;
  usage_example_chinese?: string;
  tags?: string[];
}

type ViewMode = 'browse' | 'study' | 'quiz' | 'review';

export default function VocabularyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createSupabaseClient();
  
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchVocabulary();
    }
  }, [user]);

  useEffect(() => {
    filterItems();
  }, [vocabularyItems, searchTerm, selectedCategory]);

  const fetchVocabulary = async () => {
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('difficulty_level', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching vocabulary:', error);
        toast.error('获取词汇失败');
        return;
      }

      setVocabularyItems(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('获取词汇失败');
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = vocabularyItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.thai_word.includes(searchTerm) ||
        item.chinese_translation.includes(searchTerm) ||
        item.pronunciation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
    setCurrentIndex(0);
  };

  const getCategories = () => {
    const categories = [...new Set(vocabularyItems.map(item => item.category))];
    return categories.sort();
  };

  const generateQuizOptions = (correctAnswer: string) => {
    const otherAnswers = vocabularyItems
      .filter(item => item.chinese_translation !== correctAnswer)
      .map(item => item.chinese_translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [correctAnswer, ...otherAnswers].sort(() => Math.random() - 0.5);
    return options;
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredItems.length - 1);
    }
  };

  if (loading || isLoading) {
    return <LoadingPage message="加载词汇中..." />;
  }

  if (!user) {
    return null;
  }

  if (vocabularyItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 chinese-text mb-4">
            暂无词汇内容
          </h2>
          <p className="text-gray-600 chinese-text">
            词汇库正在建设中，请稍后再来查看。
          </p>
        </div>
      </div>
    );
  }

  const currentItem = filteredItems[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 chinese-text mb-2">
            词汇学习
          </h1>
          <p className="text-gray-600 chinese-text">
            学习泰语词汇，提高语言能力
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setViewMode('browse')}
              variant={viewMode === 'browse' ? 'primary' : 'outline'}
              icon={BookOpen}
              size="sm"
              className="chinese-text"
            >
              浏览词汇
            </Button>
            <Button
              onClick={() => setViewMode('study')}
              variant={viewMode === 'study' ? 'primary' : 'outline'}
              icon={Brain}
              size="sm"
              className="chinese-text"
            >
              学习模式
            </Button>
            <Button
              onClick={() => setViewMode('quiz')}
              variant={viewMode === 'quiz' ? 'primary' : 'outline'}
              icon={Play}
              size="sm"
              className="chinese-text"
            >
              测试模式
            </Button>
            <Button
              onClick={() => setViewMode('review')}
              variant={viewMode === 'review' ? 'primary' : 'outline'}
              icon={Trophy}
              size="sm"
              className="chinese-text"
            >
              复习模式
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        {viewMode !== 'review' && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索词汇..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="all">所有分类</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 chinese-text">
              找到 {filteredItems.length} 个词汇
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <div className="text-center">
                  <div className="text-2xl thai-text text-blue-600 font-bold mb-2">
                    {item.thai_word}
                  </div>
                  <div className="text-lg chinese-text text-gray-900 mb-1">
                    {item.chinese_translation}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    [{item.pronunciation}]
                  </div>
                  <div className="text-xs text-gray-500 chinese-text">
                    {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'study' && currentItem && (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <VocabularyCard
                vocabulary={currentItem}
                mode="study"
                onNext={handleNext}
              />
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="sm"
                  className="chinese-text"
                >
                  上一个
                </Button>
                <span className="text-sm text-gray-600">
                  {currentIndex + 1} / {filteredItems.length}
                </span>
                <Button
                  onClick={handleNext}
                  variant="outline"
                  size="sm"
                  className="chinese-text"
                >
                  下一个
                </Button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'quiz' && currentItem && (
          <div className="flex justify-center">
            <VocabularyQuiz
              vocabulary={currentItem}
              options={generateQuizOptions(currentItem.chinese_translation)}
              onAnswer={(answer, isCorrect) => {
                setTimeout(handleNext, 1500);
              }}
            />
          </div>
        )}

        {viewMode === 'review' && (
          <div className="flex justify-center">
            <SpacedRepetition
              vocabularyItems={filteredItems}
              onProgress={(progress) => {
                console.log('Progress:', progress);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
