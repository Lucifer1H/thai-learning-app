'use client';

import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Volume2, PenTool, Trophy, Target, Calendar } from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';
import { LessonCard } from '@/components/ui/lesson-card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { LoadingPage } from '@/components/ui/loading';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 添加延迟以避免竞态条件
    const timer = setTimeout(() => {
      if (!loading && !user) {
        console.log('Dashboard: 用户未认证，重定向到登录页');
        router.push('/auth');
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return <LoadingPage message="加载中..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 chinese-text mb-2">
            欢迎回来！
          </h2>
          <p className="text-gray-600 chinese-text">
            继续您的泰语学习之旅，今天要学习什么呢？
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 chinese-text">学习进度</p>
                <p className="text-2xl font-bold text-gray-900">15%</p>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar progress={15} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 chinese-text">学习天数</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 chinese-text">已掌握词汇</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LessonCard
            title="泰语字母"
            description="学习44个辅音和32个元音"
            href="/lessons/alphabet"
            icon={BookOpen}
            progress={25}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            estimatedTime={20}
          />

          <LessonCard
            title="发音练习"
            description="掌握泰语的5个声调"
            href="/lessons/pronunciation"
            icon={Volume2}
            progress={10}
            iconColor="text-green-600"
            iconBgColor="bg-green-100"
            estimatedTime={15}
          />

          <LessonCard
            title="书写练习"
            description="练习泰文字母书写"
            href="/lessons/writing"
            icon={PenTool}
            progress={5}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
            estimatedTime={25}
          />

          <LessonCard
            title="词汇学习"
            description="常用词汇和短语"
            href="/vocabulary"
            icon={BookOpen}
            progress={20}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
            estimatedTime={10}
          />

          <LessonCard
            title="语法学习"
            description="泰语语法规则"
            href="/grammar"
            icon={BookOpen}
            progress={0}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-100"
            estimatedTime={30}
            isLocked={true}
          />

          <LessonCard
            title="文化背景"
            description="了解泰国文化"
            href="/culture"
            icon={BookOpen}
            progress={0}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
            estimatedTime={15}
            isLocked={true}
          />
        </div>

        {/* Daily Goal */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">今日学习目标</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 chinese-text">学习15分钟</p>
                <p className="text-sm text-gray-600 chinese-text">今天已学习 8 分钟</p>
              </div>
            </div>
            <div className="text-right">
              <ProgressBar progress={53} className="w-32 mb-1" />
              <p className="text-sm text-gray-600">53%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
