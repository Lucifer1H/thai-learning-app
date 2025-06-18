'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { ArrowLeft, RotateCcw, Check, Volume2 } from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import Link from 'next/link';

// 泰语字母数据
const thaiLetters = [
  { 
    letter: 'ก', 
    name: 'ก ไก่', 
    meaning: '鸡',
    pronunciation: 'gɔɔ gài',
    strokes: [
      'M 50 20 Q 80 20 80 50 Q 80 80 50 80',
      'M 50 50 L 80 50',
      'M 65 50 L 65 100'
    ]
  },
  { 
    letter: 'ข', 
    name: 'ข ไข่', 
    meaning: '蛋',
    pronunciation: 'khɔɔ khài',
    strokes: [
      'M 30 20 Q 60 20 60 50 Q 60 80 30 80',
      'M 30 50 L 60 50',
      'M 45 50 L 45 100',
      'M 70 20 Q 90 20 90 40 Q 90 60 70 60'
    ]
  },
  { 
    letter: 'ค', 
    name: 'ค ควาย', 
    meaning: '水牛',
    pronunciation: 'khɔɔ khwaai',
    strokes: [
      'M 30 20 Q 60 20 60 50 Q 60 80 30 80',
      'M 30 50 L 60 50',
      'M 45 50 L 45 100',
      'M 70 30 L 90 30',
      'M 80 20 L 80 40'
    ]
  }
];

export default function WritingPracticePage() {
  const { user, loading } = useAuth();
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userStrokes, setUserStrokes] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(true);
  const [completed, setCompleted] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);

  const currentLetter = thaiLetters[currentLetterIndex];

  // 播放发音
  const playPronunciation = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentLetter.pronunciation);
      utterance.lang = 'th-TH';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // 清除画布
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setUserStrokes([]);
        setCurrentStrokeIndex(0);
        setCompleted(false);
      }
    }
  };

  // 显示指导线
  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (canvas && showGuide) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // 绘制参考线
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 4);
        ctx.lineTo(canvas.width, canvas.height / 4);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.moveTo(0, canvas.height * 3 / 4);
        ctx.lineTo(canvas.width, canvas.height * 3 / 4);
        ctx.stroke();
        
        ctx.setLineDash([]);
      }
    }
  };

  // 显示示例字母
  const drawExample = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '120px serif';
        ctx.fillStyle = '#f3f4f6';
        ctx.textAlign = 'center';
        ctx.fillText(currentLetter.letter, canvas.width / 2, canvas.height * 0.7);
      }
    }
  };

  useEffect(() => {
    drawGuide();
    drawExample();
  }, [currentLetterIndex, showGuide]);

  // 鼠标/触摸事件处理
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setLastPoint({ x, y });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        setLastPoint({ x, y });
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
    
    // 简单的完成检测（实际应用中需要更复杂的笔画识别）
    if (currentStrokeIndex < currentLetter.strokes.length - 1) {
      setCurrentStrokeIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  // 下一个字母
  const nextLetter = () => {
    if (currentLetterIndex < thaiLetters.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
      clearCanvas();
    }
  };

  // 上一个字母
  const prevLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(prev => prev - 1);
      clearCanvas();
    }
  };

  if (loading) {
    return <LoadingPage message="加载课程中..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 课程头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 chinese-text">泰文书写练习</h1>
                <p className="text-gray-600 chinese-text">练习泰文字母的正确书写</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 chinese-text">
                {currentLetterIndex + 1} / {thaiLetters.length}
              </p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentLetterIndex + 1) / thaiLetters.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：字母信息和控制 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 当前字母 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="text-6xl font-serif text-blue-600 mb-3">
                  {currentLetter.letter}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 chinese-text mb-1">
                  {currentLetter.name}
                </h2>
                <p className="text-gray-600 chinese-text mb-1">{currentLetter.meaning}</p>
                <p className="text-sm text-gray-500">
                  发音: {currentLetter.pronunciation}
                </p>
              </div>

              <button
                type="button"
                onClick={playPronunciation}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-lg transition-colors"
              >
                <Volume2 className="h-4 w-4" />
                <span className="chinese-text">播放发音</span>
              </button>
            </div>

            {/* 练习控制 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 chinese-text">练习控制</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="chinese-text">显示参考线</span>
                  <button
                    type="button"
                    onClick={() => setShowGuide(!showGuide)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      showGuide ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      showGuide ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={clearCanvas}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="chinese-text">重新开始</span>
                </button>
              </div>
            </div>

            {/* 书写进度 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 chinese-text">书写进度</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="chinese-text">当前笔画</span>
                  <span>{currentStrokeIndex + 1} / {currentLetter.strokes.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStrokeIndex + 1) / currentLetter.strokes.length) * 100}%` }}
                  />
                </div>
                {completed && (
                  <div className="flex items-center space-x-2 text-green-600 mt-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm chinese-text">完成！</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：书写区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 书写画布 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold chinese-text">书写区域</h3>
                <p className="text-sm text-gray-500 chinese-text">
                  在下方区域练习书写 {currentLetter.letter}
                </p>
              </div>

              <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-auto cursor-crosshair touch-none bg-white"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>

            {/* 导航控制 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevLetter}
                  disabled={currentLetterIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="chinese-text">上一个</span>
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 chinese-text">
                    字母 {currentLetterIndex + 1} / {thaiLetters.length}
                  </p>
                  <p className="text-xs text-gray-500 chinese-text">
                    {currentLetter.name} - {currentLetter.meaning}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={nextLetter}
                  disabled={currentLetterIndex === thaiLetters.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <span className="chinese-text">下一个</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
