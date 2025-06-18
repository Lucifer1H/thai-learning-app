import Link from "next/link";
import { BookOpen, Volume2, PenTool, Trophy, Users, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                <span className="chinese-text">泰语学习</span>
                <span className="ml-2 thai-text text-blue-600">ไทย</span>
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                开始学习
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="chinese-text">专为中文母语者设计的</span>
            <br />
            <span className="thai-text text-blue-600">泰语学习平台</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 chinese-text max-w-2xl mx-auto">
            从零开始学习泰语，包含字母、发音、词汇和语法。
            专业的中文解释，让您轻松掌握泰语精髓。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              免费开始学习
            </Link>
            <Link href="/demo" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              查看演示
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 chinese-text">
            为什么选择我们的泰语学习平台？
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 chinese-text">系统化课程</h4>
              <p className="text-gray-600 chinese-text">
                从泰语字母到日常对话，循序渐进的学习路径
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 chinese-text">标准发音</h4>
              <p className="text-gray-600 chinese-text">
                泰语母语者录制的标准发音，帮您掌握正确语调
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 chinese-text">书写练习</h4>
              <p className="text-gray-600 chinese-text">
                交互式泰文书写练习，掌握正确笔顺和字形
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 chinese-text">进度追踪</h4>
              <p className="text-gray-600 chinese-text">
                详细的学习进度记录，激励您持续学习
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 chinese-text">文化背景</h4>
              <p className="text-gray-600 chinese-text">
                深入了解泰国文化，让语言学习更有意义
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 chinese-text">中文解释</h4>
              <p className="text-gray-600 chinese-text">
                专业的中文语法解释，对比中泰语言差异
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 chinese-text">
            课程预览
          </h3>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold mb-4 chinese-text">泰语字母学习</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="thai-text text-2xl">ก</span>
                    <span className="chinese-text">鸡 (gài)</span>
                    <button type="button" className="audio-button">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="thai-text text-2xl">ข</span>
                    <span className="chinese-text">蛋 (kài)</span>
                    <button type="button" className="audio-button">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="thai-text text-2xl">ค</span>
                    <span className="chinese-text">水牛 (khwāi)</span>
                    <button type="button" className="audio-button">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-4 chinese-text">常用词汇</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="thai-text text-lg">สวัสดี</span>
                      <button type="button" className="audio-button">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="chinese-text text-sm text-gray-600">你好 (sà-wàt-dii)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="thai-text text-lg">ขอบคุณ</span>
                      <button type="button" className="audio-button">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="chinese-text text-sm text-gray-600">谢谢 (khɔ̀ɔp-khun)</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="thai-text text-lg">ลาก่อน</span>
                      <button type="button" className="audio-button">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="chinese-text text-sm text-gray-600">再见 (laa-kɔ̀ɔn)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4 chinese-text">
            准备开始您的泰语学习之旅了吗？
          </h3>
          <p className="text-xl text-blue-100 mb-8 chinese-text">
            加入我们，开始您的泰语学习冒险！
          </p>
          <Link href="/auth" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            立即开始免费学习
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold chinese-text">泰语学习平台</span>
            </div>
            <p className="text-gray-400 chinese-text">
              © 2024 泰语学习平台. 专为中文母语者设计的泰语学习体验.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
