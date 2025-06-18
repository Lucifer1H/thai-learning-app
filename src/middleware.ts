import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  try {
    // 仅在开发环境输出调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log('Middleware: 处理路径:', req.nextUrl.pathname)
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({
              name,
              value,
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    // 仅在开发环境记录详细信息
    if (process.env.NODE_ENV === 'development') {
      console.log('Middleware: Session 状态:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: sessionError?.message
      })
    }

    // 仅在开发环境记录 session 错误
    if (sessionError && process.env.NODE_ENV === 'development') {
      console.log('Middleware: Session 错误:', sessionError)
    }

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/lessons', '/vocabulary', '/grammar', '/culture', '/profile']
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // Auth routes that should redirect if user is already logged in
    const authRoutes = ['/auth']
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // 禁用服务器端认证检查，完全依赖客户端认证
    // 这样可以避免服务器端和客户端session同步问题
    // If user is not authenticated and trying to access protected route
    // if (isProtectedRoute && !session) {
    //   // 给一些时间让客户端session同步，避免立即重定向
    //   const hasAuthCookie = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token')
    //
    //   if (hasAuthCookie) {
    //     // 如果有认证cookie但session为空，可能是同步问题，让页面加载并由客户端处理
    //     return res
    //   }
    //
    //   const redirectUrl = new URL('/auth', req.url)
    //   redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    //   return NextResponse.redirect(redirectUrl)
    // }

    // If user is authenticated and trying to access auth routes
    // 暂时禁用自动重定向，让客户端处理跳转
    // if (isAuthRoute && session) {
    //   return NextResponse.redirect(new URL('/dashboard', req.url))
    // }
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
