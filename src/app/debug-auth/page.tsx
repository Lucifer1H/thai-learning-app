'use client';

import { useAuth } from '@/components/providers';
import { createSupabaseClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSessionInfo({ session, error });
    };
    
    checkSession();
  }, [supabase.auth]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">认证调试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Provider 状态 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Auth Provider 状态</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? '是' : '否'}</p>
              <p><strong>User:</strong> {user ? '已登录' : '未登录'}</p>
              {user && (
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <p><strong>用户邮箱:</strong> {user.email}</p>
                  <p><strong>用户ID:</strong> {user.id}</p>
                  <p><strong>创建时间:</strong> {user.created_at}</p>
                </div>
              )}
            </div>
          </div>

          {/* Supabase Session 状态 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Supabase Session 状态</h2>
            <div className="space-y-2">
              {sessionInfo ? (
                <div>
                  <p><strong>Session:</strong> {sessionInfo.session ? '存在' : '不存在'}</p>
                  <p><strong>Error:</strong> {sessionInfo.error ? sessionInfo.error.message : '无'}</p>
                  {sessionInfo.session && (
                    <div className="mt-4 p-4 bg-blue-50 rounded">
                      <p><strong>Access Token:</strong> {sessionInfo.session.access_token ? '存在' : '不存在'}</p>
                      <p><strong>Refresh Token:</strong> {sessionInfo.session.refresh_token ? '存在' : '不存在'}</p>
                      <p><strong>过期时间:</strong> {new Date(sessionInfo.session.expires_at * 1000).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>加载中...</p>
              )}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">测试操作</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/auth'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              前往登录页
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              前往仪表板
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              刷新页面
            </button>
          </div>
        </div>

        {/* 环境变量检查 */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">环境变量</h2>
          <div className="space-y-2">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置'}</p>
            <p><strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置' : '未设置'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
