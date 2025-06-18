'use client';

import { useEffect, useState } from 'react';

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean;
    supabaseKey: boolean;
    isProduction: boolean;
  }>({
    supabaseUrl: false,
    supabaseKey: false,
    isProduction: false,
  });

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      isProduction: process.env.NODE_ENV === 'production',
    });
  }, []);

  // 只在开发环境或有问题时显示
  if (envStatus.isProduction && envStatus.supabaseUrl && envStatus.supabaseKey) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg max-w-sm">
      <div className="font-bold">环境变量检查</div>
      <div className="text-sm mt-2">
        <div className={envStatus.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
          Supabase URL: {envStatus.supabaseUrl ? '✅' : '❌'}
        </div>
        <div className={envStatus.supabaseKey ? 'text-green-600' : 'text-red-600'}>
          Supabase Key: {envStatus.supabaseKey ? '✅' : '❌'}
        </div>
        <div className="text-gray-600">
          环境: {envStatus.isProduction ? 'Production' : 'Development'}
        </div>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <div className="text-xs mt-1 break-all">
            URL: {process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...
          </div>
        )}
      </div>
    </div>
  );
}
