'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check } from 'lucide-react';

interface StrokeOrderProps {
  letter: string;
  strokes: string[]; // Array of stroke paths (SVG paths)
  className?: string;
}

export function StrokeOrder({ letter, strokes, className }: StrokeOrderProps) {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const animateStroke = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (currentStroke < strokes.length - 1) {
        setCurrentStroke(currentStroke + 1);
      } else {
        setShowComplete(true);
      }
    }, 1000);
  };

  const resetAnimation = () => {
    setCurrentStroke(0);
    setIsAnimating(false);
    setShowComplete(false);
  };

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
        笔画顺序练习
      </h3>
      
      {/* SVG Canvas for stroke order */}
      <div className="relative bg-gray-50 rounded-lg p-6 mb-4">
        <svg
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="mx-auto border border-gray-200 rounded bg-white"
        >
          {/* Grid lines for guidance */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="300" height="300" fill="url(#grid)" />

          {/* Center guidelines */}
          <line x1="150" y1="0" x2="150" y2="300" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1="150" x2="300" y2="150" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />

          {/* Completed strokes */}
          {strokes.slice(0, currentStroke).map((stroke, index) => (
            <path
              key={index}
              d={stroke}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Current animating stroke */}
          {isAnimating && currentStroke < strokes.length && (
            <path
              d={strokes[currentStroke]}
              fill="none"
              stroke="#ef4444"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="500"
              strokeDashoffset="500"
              className="animate-draw-stroke"
            />
          )}

          {/* Next stroke preview (faded) */}
          {!isAnimating && currentStroke < strokes.length && (
            <path
              d={strokes[currentStroke]}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8,4"
            />
          )}
        </svg>
        
        {/* Completion indicator */}
        {showComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-50 bg-opacity-90 rounded-lg">
            <div className="text-center">
              <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-semibold chinese-text">完成！</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 chinese-text">
          笔画 {Math.min(currentStroke + 1, strokes.length)} / {strokes.length}
        </div>
        <div className="space-x-2">
          <Button
            onClick={resetAnimation}
            variant="outline"
            size="sm"
            icon={RotateCcw}
            className="chinese-text"
          >
            重新开始
          </Button>
          <Button
            onClick={animateStroke}
            disabled={isAnimating || showComplete}
            variant="primary"
            size="sm"
            className="chinese-text"
          >
            {isAnimating ? '绘制中...' : showComplete ? '已完成' : '下一笔画'}
          </Button>
        </div>
      </div>

      {/* Letter reference */}
      <div className="mt-4 text-center">
        <div className="text-4xl thai-text text-gray-400 mb-2">{letter}</div>
        <p className="text-sm text-gray-600 chinese-text">
          参考字形
        </p>
      </div>
    </div>
  );
}

// Practice canvas component for user drawing
interface PracticeCanvasProps {
  letter: string;
  onComplete?: () => void;
  className?: string;
}

export function PracticeCanvas({ letter, onComplete, className }: PracticeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#3b82f6';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleComplete = () => {
    if (hasDrawn && onComplete) {
      onComplete();
    }
  };

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-4">
        书写练习
      </h3>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair mx-auto block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Reference letter overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-8xl thai-text text-gray-200 opacity-50">
            {letter}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600 chinese-text">
          在上方区域练习书写字母 {letter}
        </p>
        <div className="space-x-2">
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
            className="chinese-text"
          >
            清除
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!hasDrawn}
            variant="primary"
            size="sm"
            className="chinese-text"
          >
            完成练习
          </Button>
        </div>
      </div>
    </div>
  );
}
