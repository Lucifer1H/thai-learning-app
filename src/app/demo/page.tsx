'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Volume2, BookOpen, Target, Award, Users } from 'lucide-react';
import { Button, AudioButton } from '@/components/ui/button';

// 演示数据
const demoVocabulary = [
  {
    thai_word: 'สวัสดี',
    chinese_translation: '你好',
    pronunciation: 'sà-wàt-dii',
    category: '问候语'
  },
  {
    thai_word: 'ขอบคุณ',
    chinese_translation: '谢谢',
    pronunciation: 'kòp-kun',
    category: '礼貌用语'
  },
  {
    thai_word: 'สบายดีไหม',
    chinese_translation: '你好吗',
    pronunciation: 'sà-baai-dii-mái',
    category: '问候语'
  }
];

const demoAlphabet = [
  { symbol: 'ก', chinese: '鸡', pronunciation: 'gài' },
  { symbol: 'ข', chinese: '蛋', pronunciation: 'kài' },
  { symbol: 'ค', chinese: '水牛', pronunciation: 'kwaai' }
];

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState<'vocabulary' | 'alphabet' | 'features'>('vocabulary');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (isPlaying) return;

    setIsPlaying(true);

    // 使用 Web Speech API 生成语音
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance();

      if (currentDemo === 'vocabulary') {
        utterance.text = demoVocabulary[currentIndex].thai_word;
      } else if (currentDemo === 'alphabet') {
        utterance.text = demoAlphabet[currentIndex].symbol;
      }

      utterance.lang = 'th-TH'; // 泰语
      utterance.rate = 0.8; // 稍慢的语速
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        // 如果泰语不支持，使用英语发音
        const fallbackUtterance = new SpeechSynthesisUtterance();
        if (currentDemo === 'vocabulary') {
          fallbackUtterance.text = demoVocabulary[currentIndex].pronunciation;
        } else if (currentDemo === 'alphabet') {
          fallbackUtterance.text = demoAlphabet[currentIndex].pronunciation;
        }
        fallbackUtterance.lang = 'en-US';
        fallbackUtterance.rate = 0.8;
        fallbackUtterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(fallbackUtterance);
      };

      speechSynthesis.speak(utterance);
    } else {
      // 浏览器不支持语音合成
      alert('您的浏览器不支持语音播放功能');
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="chinese-text">返回首页</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 chinese-text">
              泰语学习平台演示
            </h1>
            <Link href="/auth">
              <Button variant="primary" className="chinese-text">
                开始学习
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setCurrentDemo('vocabulary')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors chinese-text ${
                  currentDemo === 'vocabulary'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                词汇学习
              </button>
              <button
                type="button"
                onClick={() => setCurrentDemo('alphabet')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors chinese-text ${
                  currentDemo === 'alphabet'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                字母学习
              </button>
              <button
                type="button"
                onClick={() => setCurrentDemo('features')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors chinese-text ${
                  currentDemo === 'features'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                功能特色
              </button>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        {currentDemo === 'vocabulary' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 chinese-text mb-4">
                词汇学习演示
              </h2>
              <p className="text-gray-600 chinese-text">
                体验我们的交互式词汇学习功能
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Vocabulary Card */}
                <div className="text-center">
                  <div className="bg-blue-50 rounded-lg p-6 mb-4">
                    <div className="text-4xl thai-text text-blue-600 font-bold mb-2">
                      {demoVocabulary[currentIndex].thai_word}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg text-gray-700 chinese-text">
                        {demoVocabulary[currentIndex].chinese_translation}
                      </span>
                      <AudioButton onClick={playAudio} isPlaying={isPlaying} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-600 chinese-text">发音：</span>
                      <span className="font-medium">{demoVocabulary[currentIndex].pronunciation}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-600 chinese-text">分类：</span>
                      <span className="font-medium chinese-text">{demoVocabulary[currentIndex].category}</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold chinese-text">学习功能</h3>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={playAudio}
                      variant="outline"
                      icon={Volume2}
                      fullWidth
                      className="chinese-text"
                    >
                      播放发音
                    </Button>
                    
                    <Button
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % demoVocabulary.length)}
                      variant="primary"
                      fullWidth
                      className="chinese-text"
                    >
                      下一个词汇
                    </Button>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-700 chinese-text">
                        ✓ 支持音频播放<br/>
                        ✓ 中文翻译对照<br/>
                        ✓ 发音指导<br/>
                        ✓ 分类学习
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentDemo === 'alphabet' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 chinese-text mb-4">
                字母学习演示
              </h2>
              <p className="text-gray-600 chinese-text">
                学习泰语字母的发音和书写
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="text-8xl thai-text text-purple-600 font-bold mb-4">
                  {demoAlphabet[currentIndex].symbol}
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-purple-700 chinese-text">
                      {demoAlphabet[currentIndex].chinese}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-blue-700">
                      [{demoAlphabet[currentIndex].pronunciation}]
                    </p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + demoAlphabet.length) % demoAlphabet.length)}
                    variant="outline"
                    className="chinese-text"
                  >
                    上一个
                  </Button>
                  <AudioButton onClick={playAudio} isPlaying={isPlaying} />
                  <Button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % demoAlphabet.length)}
                    variant="outline"
                    className="chinese-text"
                  >
                    下一个
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentDemo === 'features' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 chinese-text mb-4">
                平台功能特色
              </h2>
              <p className="text-gray-600 chinese-text">
                专为中文母语者设计的泰语学习体验
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold chinese-text mb-2">系统化课程</h3>
                <p className="text-gray-600 chinese-text text-sm">
                  从字母到会话，循序渐进的学习路径
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold chinese-text mb-2">标准发音</h3>
                <p className="text-gray-600 chinese-text text-sm">
                  原生泰语发音，帮助掌握正确语调
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold chinese-text mb-2">个性化学习</h3>
                <p className="text-gray-600 chinese-text text-sm">
                  根据学习进度调整难度和内容
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold chinese-text mb-2">成就系统</h3>
                <p className="text-gray-600 chinese-text text-sm">
                  学习成就激励，保持学习动力
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold chinese-text mb-2">中文支持</h3>
                <p className="text-gray-600 chinese-text text-sm">
                  完整的中文界面和详细解释
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold chinese-text mb-2">互动练习</h3>
                <p className="text-gray-600 chinese-text text-sm">
                  多种练习模式，巩固学习效果
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 chinese-text mb-4">
              准备开始您的泰语学习之旅了吗？
            </h3>
            <p className="text-gray-600 chinese-text mb-6">
              立即注册，免费体验完整的泰语学习课程
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button variant="primary" size="lg" className="chinese-text">
                  免费注册学习
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="chinese-text">
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
