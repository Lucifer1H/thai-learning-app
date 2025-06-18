'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { Trophy, Star, Target, Calendar, BookOpen, Award, Medal, Crown } from 'lucide-react';

// 成就数据类型
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  iconColor: string;
  iconBgColor: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'learning' | 'streak' | 'mastery' | 'special';
}

// 成就数据
const achievements: Achievement[] = [
  // 学习成就
  {
    id: 'first_lesson',
    title: '初学者',
    description: '完成第一个课程',
    icon: BookOpen,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-100',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'learning'
  },
  {
    id: 'alphabet_master',
    title: '字母大师',
    description: '掌握所有泰语字母',
    icon: Star,
    iconColor: 'text-yellow-600',
    iconBgColor: 'bg-yellow-100',
    progress: 0,
    maxProgress: 44,
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'pronunciation_expert',
    title: '发音专家',
    description: '完成所有发音练习',
    icon: Award,
    iconColor: 'text-green-600',
    iconBgColor: 'bg-green-100',
    progress: 0,
    maxProgress: 13,
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'writing_champion',
    title: '书写冠军',
    description: '完成100次书写练习',
    icon: Medal,
    iconColor: 'text-purple-600',
    iconBgColor: 'bg-purple-100',
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    category: 'learning'
  },
  
  // 连续学习成就
  {
    id: 'streak_3',
    title: '坚持不懈',
    description: '连续学习3天',
    icon: Target,
    iconColor: 'text-orange-600',
    iconBgColor: 'bg-orange-100',
    progress: 1,
    maxProgress: 3,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'streak_7',
    title: '一周达人',
    description: '连续学习7天',
    icon: Calendar,
    iconColor: 'text-red-600',
    iconBgColor: 'bg-red-100',
    progress: 1,
    maxProgress: 7,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'streak_30',
    title: '月度学霸',
    description: '连续学习30天',
    icon: Crown,
    iconColor: 'text-indigo-600',
    iconBgColor: 'bg-indigo-100',
    progress: 1,
    maxProgress: 30,
    unlocked: false,
    category: 'streak'
  },
  
  // 特殊成就
  {
    id: 'early_bird',
    title: '早起鸟儿',
    description: '在早上6点前学习',
    icon: Trophy,
    iconColor: 'text-pink-600',
    iconBgColor: 'bg-pink-100',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'special'
  },
  {
    id: 'vocabulary_100',
    title: '词汇达人',
    description: '掌握100个词汇',
    icon: Star,
    iconColor: 'text-cyan-600',
    iconBgColor: 'bg-cyan-100',
    progress: 0,
    maxProgress: 100,
    unlocked: false,
    category: 'mastery'
  }
];

export default function AchievementsPage() {
  const { user, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);

  const categories = [
    { id: 'all', name: '全部', icon: Trophy },
    { id: 'learning', name: '学习', icon: BookOpen },
    { id: 'streak', name: '连续', icon: Calendar },
    { id: 'mastery', name: '精通', icon: Star },
    { id: 'special', name: '特殊', icon: Award }
  ];

  // 过滤成就
  const filteredAchievements = selectedCategory === 'all' 
    ? userAchievements 
    : userAchievements.filter(achievement => achievement.category === selectedCategory);

  // 统计数据
  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  const totalCount = userAchievements.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  if (loading) {
    return <LoadingPage message="加载成就中..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 页面头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-100 p-4 rounded-full">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 chinese-text mb-2">学习成就</h1>
            <p className="text-gray-600 chinese-text mb-4">记录您的学习里程碑和成就</p>
            
            {/* 总体进度 */}
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{unlockedCount}</p>
                  <p className="text-sm text-gray-600 chinese-text">已解锁</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                  <p className="text-sm text-gray-600 chinese-text">总成就</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                  <p className="text-sm text-gray-600 chinese-text">完成度</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 chinese-text mb-4">成就分类</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="chinese-text">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 成就列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = Math.round((achievement.progress / achievement.maxProgress) * 100);
            
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md ${
                  achievement.unlocked ? 'ring-2 ring-yellow-200' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${achievement.iconBgColor} ${
                    achievement.unlocked ? '' : 'opacity-50'
                  }`}>
                    <Icon className={`h-6 w-6 ${achievement.iconColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold chinese-text ${
                        achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      {achievement.unlocked && (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    
                    <p className={`text-sm chinese-text mb-3 ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {/* 进度条 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className={`chinese-text ${
                          achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          进度
                        </span>
                        <span className={`${
                          achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-gray-500 chinese-text mt-2">
                        解锁时间: {achievement.unlockedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 chinese-text">该分类下暂无成就</p>
          </div>
        )}
      </div>
    </div>
  );
}
