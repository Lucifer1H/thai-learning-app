'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ArrowLeft, BookOpen, Type, Volume2, Users, Target } from 'lucide-react';
import Link from 'next/link';
import {
  getThaiConsonants,
  getThaiVowels,
  getLetterLearningStats,
  type ThaiConsonant,
  type ThaiVowel
} from '@/lib/thai-letters';

export default function AlphabetLessonPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [consonants, setConsonants] = useState<ThaiConsonant[]>([]);
  const [vowels, setVowels] = useState<ThaiVowel[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // 加载字母数据和统计信息
  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        setDataLoading(true);
        const [consonantsData, vowelsData, statsData] = await Promise.all([
          getThaiConsonants(),
          getThaiVowels(),
          getLetterLearningStats(user.id)
        ]);

        setConsonants(consonantsData);
        setVowels(vowelsData);
        setStats(statsData);

      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setDataLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading || dataLoading) {
    return <LoadingPage message="加载课程中..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" icon={ArrowLeft}>
                返回首页
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">泰语字母学习</h1>
              <p className="text-gray-600 chinese-text">掌握泰语辅音和元音字母</p>
            </div>
          </div>
        </div>

        {/* Learning Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Consonants Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8" />
                <h2 className="text-2xl font-bold">辅音字母</h2>
              </div>
              <p className="text-blue-100">学习44个泰语辅音字母</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{consonants.length}</div>
                  <div className="text-sm text-gray-600">总字母数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {stats?.consonants?.learned || 0}
                  </div>
                  <div className="text-sm text-gray-600">已掌握</div>
                </div>
              </div>
              
              {stats?.consonants && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>学习进度</span>
                    <span>{Math.round((stats.consonants.learned / stats.consonants.total) * 100)}%</span>
                  </div>
                  <ProgressBar 
                    progress={(stats.consonants.learned / stats.consonants.total) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>包含高、中、低音调分类</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Volume2 className="h-4 w-4" />
                  <span>发音练习和笔画指导</span>
                </div>
              </div>
              
              <Link href="/lessons/consonants">
                <Button className="w-full mt-6" variant="primary">
                  开始学习辅音
                </Button>
              </Link>
            </div>
          </div>

          {/* Vowels Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <Type className="h-8 w-8" />
                <h2 className="text-2xl font-bold">元音字母</h2>
              </div>
              <p className="text-purple-100">学习32个泰语元音</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{vowels.length}</div>
                  <div className="text-sm text-gray-600">总元音数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {stats?.vowels?.learned || 0}
                  </div>
                  <div className="text-sm text-gray-600">已掌握</div>
                </div>
              </div>
              
              {stats?.vowels && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>学习进度</span>
                    <span>{Math.round((stats.vowels.learned / stats.vowels.total) * 100)}%</span>
                  </div>
                  <ProgressBar 
                    progress={(stats.vowels.learned / stats.vowels.total) * 100} 
                    className="h-2"
                  />
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>包含长短元音和位置分类</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Volume2 className="h-4 w-4" />
                  <span>发音示例和使用指导</span>
                </div>
              </div>
              
              <Link href="/lessons/vowels">
                <Button className="w-full mt-6" variant="primary">
                  开始学习元音
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 chinese-text">学习建议</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 chinese-text">先学辅音</h4>
              <p className="text-sm text-gray-600 chinese-text">
                建议先掌握44个辅音字母，它们是泰语的基础
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Type className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 chinese-text">再学元音</h4>
              <p className="text-sm text-gray-600 chinese-text">
                掌握辅音后学习元音，了解它们的位置和长度
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 chinese-text">多练发音</h4>
              <p className="text-sm text-gray-600 chinese-text">
                反复练习发音，注意音调的区别
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        {stats && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 chinese-text">总体进度</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>辅音掌握度</span>
                  <span>{stats.consonants.learned}/{stats.consonants.total}</span>
                </div>
                <ProgressBar 
                  progress={(stats.consonants.learned / stats.consonants.total) * 100} 
                  className="h-3"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>元音掌握度</span>
                  <span>{stats.vowels.learned}/{stats.vowels.total}</span>
                </div>
                <ProgressBar 
                  progress={(stats.vowels.learned / stats.vowels.total) * 100} 
                  className="h-3"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
