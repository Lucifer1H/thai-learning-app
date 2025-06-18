'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { BookOpen, Mail, Lock, User } from 'lucide-react';

import toast from 'react-hot-toast';
import { validateEmail, validatePassword, validateName, checkRateLimit } from '@/lib/validation';

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

  // 输入验证函数
  const validateInput = (email: string, password: string, fullName?: string) => {
    // 验证邮箱
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      throw new Error(emailResult.error);
    }

    // 验证密码
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      throw new Error(passwordResult.error);
    }

    // 验证姓名（仅注册时）
    if (!isLogin && fullName) {
      const nameResult = validateName(fullName);
      if (!nameResult.isValid) {
        throw new Error(nameResult.error);
      }
    }

    return {
      email: emailResult.sanitizedValue!,
      password: passwordResult.sanitizedValue!,
      fullName: fullName ? validateName(fullName).sanitizedValue : undefined
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 速率限制检查
      const clientIP = 'client'; // 在实际应用中应该获取真实 IP
      if (!checkRateLimit(clientIP, 5, 60000)) {
        toast.error('请求过于频繁，请稍后再试');
        return;
      }

      // 输入验证和清理
      const validatedData = validateInput(formData.email, formData.password, formData.fullName);

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (error) {
          // 安全的错误处理 - 不暴露具体错误信息
          if (error.message.includes('Invalid login credentials')) {
            toast.error('邮箱或密码错误，请重试');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('请先验证您的邮箱地址');
          } else {
            toast.error('登录失败，请稍后重试');
          }
        } else {
          toast.success('登录成功！');

          // 安全的跳转方式
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              full_name: validatedData.fullName,
              native_language: 'chinese',
              target_language: 'thai',
            },
          },
        });

        if (error) {
          // 安全的错误处理
          if (error.message.includes('already registered')) {
            toast.error('该邮箱已被注册，请直接登录');
          } else if (error.message.includes('Password')) {
            toast.error('密码不符合要求，请重新设置');
          } else {
            toast.error('注册失败，请稍后重试');
          }
        } else {
          toast.success('注册成功！请检查您的邮箱以验证账户。');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('操作失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 基本长度限制
    const maxLengths = {
      email: 254,
      password: 128,
      fullName: 50
    };

    const maxLength = maxLengths[name as keyof typeof maxLengths] || 100;
    const truncatedValue = value.slice(0, maxLength);

    setFormData({
      ...formData,
      [name]: truncatedValue,
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
                    autoComplete="name"
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
    </div>
  );
}
