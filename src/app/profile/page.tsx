'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { createSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Trophy, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  native_language: string;
  target_language: string;
  learning_streak: number;
  total_study_time: number;
  created_at: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createSupabaseClient();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    native_language: 'chinese',
    target_language: 'thai',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('获取用户信息失败');
        return;
      }

      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        native_language: data.native_language || 'chinese',
        target_language: data.target_language || 'thai',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('获取用户信息失败');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          native_language: formData.native_language,
          target_language: formData.target_language,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('更新失败，请重试');
        return;
      }

      toast.success('个人信息更新成功！');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error:', error);
      toast.error('更新失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 chinese-text">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900 chinese-text">
                个人资料
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 chinese-text">基本信息</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm chinese-text"
                  >
                    编辑
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 hover:text-gray-700 text-sm chinese-text"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="text-blue-600 hover:text-blue-700 text-sm chinese-text disabled:opacity-50"
                    >
                      {saving ? '保存中...' : '保存'}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 chinese-text mb-1">
                    姓名
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="请输入您的姓名"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.full_name || '未设置'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 chinese-text mb-1">
                    邮箱地址
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 chinese-text mb-1">
                    母语
                  </label>
                  {isEditing ? (
                    <select
                      name="native_language"
                      value={formData.native_language}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="chinese">中文</option>
                      <option value="english">English</option>
                      <option value="japanese">日本語</option>
                      <option value="korean">한국어</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.native_language === 'chinese' ? '中文' : profile.native_language}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 chinese-text mb-1">
                    目标语言
                  </label>
                  {isEditing ? (
                    <select
                      name="target_language"
                      value={formData.target_language}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="thai">ไทย (泰语)</option>
                      <option value="english">English</option>
                      <option value="japanese">日本語</option>
                      <option value="korean">한국어</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {profile.target_language === 'thai' ? 'ไทย (泰语)' : profile.target_language}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 chinese-text mb-1">
                    注册时间
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">学习统计</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 chinese-text">学习天数</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.learning_streak} 天</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 chinese-text">总学习时间</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.total_study_time} 分钟</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 chinese-text">获得成就</p>
                    <p className="text-lg font-semibold text-gray-900">3 个</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">账户设置</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded chinese-text">
                  更改密码
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded chinese-text">
                  通知设置
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded chinese-text">
                  删除账户
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
