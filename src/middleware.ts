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
    // 添加调试信息
    console.log('Middleware: 处理路径:', req.nextUrl.pathname)
    console.log('Middleware: Cookies:', req.cookies.getAll().map(c => c.name))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const value = req.cookies.get(name)?.value
            console.log(`Middleware: 获取 cookie ${name}:`, value ? '存在' : '不存在')
            return value
          },
          set(name: string, value: string, options: any) {
            console.log(`Middleware: 设置 cookie ${name}`)
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
            console.log(`Middleware: 删除 cookie ${name}`)
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

    console.log('Middleware: Session 状态:', session ? '存在' : '不存在')
    if (sessionError) {
      console.log('Middleware: Session 错误:', sessionError)
    }

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard', '/lessons', '/vocabulary', '/grammar', '/culture', '/profile']
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    // Auth routes that should redirect if user is already logged in
    const authRoutes = ['/auth']
    const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    console.log('Middleware: 是否受保护路由:', isProtectedRoute)
    console.log('Middleware: 是否认证路由:', isAuthRoute)

    // 临时禁用中间件认证检查，让页面自己处理
    // TODO: 修复中间件认证状态检查后重新启用
    /*
    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !session) {
      console.log('Middleware: 重定向到登录页 - 用户未认证')
      const redirectUrl = new URL('/auth', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    */

    // If user is authenticated and trying to access auth routes
    if (isAuthRoute && session) {
      console.log('Middleware: 重定向到仪表板 - 用户已认证')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    console.log('Middleware: 允许访问')
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
