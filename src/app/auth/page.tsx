'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { BookOpen, Mail, Lock, User } from 'lucide-react';
import { EnvCheck } from '@/components/debug/env-check';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 调试信息
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Form data:', { email: formData.email, hasPassword: !!formData.password });

      if (isLogin) {
        console.log('尝试登录...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        console.log('登录结果:', { data, error });

        if (error) {
          console.error('登录错误:', error);
          toast.error(`登录失败: ${error.message}`);
        } else {
          console.log('登录成功:', data);
          toast.success('登录成功！');

          // 等待一小段时间让认证状态更新
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        }
      } else {
        console.log('尝试注册...');
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              native_language: 'chinese',
              target_language: 'thai',
            },
          },
        });

        console.log('注册结果:', { data, error });

        if (error) {
          console.error('注册错误:', error);
          toast.error(`注册失败: ${error.message}`);
        } else {
          console.log('注册成功:', data);
          toast.success('注册成功！请检查您的邮箱以验证账户。');
        }
      }
    } catch (error) {
      console.error('认证过程中发生错误:', error);
      toast.error(`发生错误: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="chinese-text">泰语学习</span>
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 chinese-text">
            {isLogin ? '登录您的账户' : '创建新账户'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 chinese-text">
            {isLogin ? '继续您的泰语学习之旅' : '开始您的泰语学习冒险'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="sr-only">
                  姓名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="您的姓名"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                邮箱地址
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="邮箱地址"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="密码"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-500 text-sm chinese-text"
            >
              {isLogin ? '还没有账户？点击注册' : '已有账户？点击登录'}
            </button>
          </div>
        </form>
      </div>
      <EnvCheck />
    </div>
  );
}
