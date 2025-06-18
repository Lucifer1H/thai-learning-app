'use client';

import { useEffect } from 'react';

export function ErrorBoundary() {
  useEffect(() => {
    // 捕获未处理的 Promise 错误
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // 忽略浏览器扩展相关的错误
      if (
        event.reason?.message?.includes('message channel closed') ||
        event.reason?.message?.includes('Extension context invalidated') ||
        event.reason?.message?.includes('listener indicated an asynchronous response')
      ) {
        event.preventDefault();
        console.warn('Browser extension error ignored:', event.reason);
        return;
      }
    };

    // 捕获全局错误
    const handleError = (event: ErrorEvent) => {
      // 忽略浏览器扩展相关的错误
      if (
        event.message?.includes('message channel closed') ||
        event.message?.includes('Extension context invalidated') ||
        event.message?.includes('listener indicated an asynchronous response')
      ) {
        event.preventDefault();
        console.warn('Browser extension error ignored:', event.message);
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
