'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function TestLoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleLogin = async () => {
    setLoading(true);
    console.log('开始测试登录...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('登录结果:', { data, error });

      if (error) {
        console.error('登录错误:', error);
        toast.error(`登录失败: ${error.message}`);
      } else {
        console.log('登录成功，准备跳转...');
        toast.success('登录成功！');
        
        // 测试多种跳转方法
        console.log('方法1: router.push');
        router.push('/dashboard');
        
        setTimeout(() => {
          console.log('方法2: router.replace');
          router.replace('/dashboard');
        }, 1000);
        
        setTimeout(() => {
          console.log('方法3: window.location.href');
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      toast.error('发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">登录测试页面</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '登录中...' : '测试登录'}
          </button>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>这是一个测试页面，用于调试登录跳转问题。</p>
          <p>请打开浏览器控制台查看详细日志。</p>
        </div>
      </div>
    </div>
  );
}
