'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause } from 'lucide-react';
import { ThaiStrokeData } from '@/data/thai-stroke-data';

interface ThaiStrokeWriterProps {
  strokeData: ThaiStrokeData;
  width?: number;
  height?: number;
  className?: string;
  onComplete?: () => void;
}

export function ThaiStrokeWriter({ 
  strokeData, 
  width = 300, 
  height = 300, 
  className = '',
  onComplete 
}: ThaiStrokeWriterProps) {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1500); // ms per stroke

  const animateStroke = () => {
    if (isAnimating || showComplete) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsAnimating(false);
      if (currentStroke < strokeData.strokes.length - 1) {
        setCurrentStroke(currentStroke + 1);
      } else {
        setShowComplete(true);
        onComplete?.();
      }
    }, animationSpeed);
  };

  const resetAnimation = () => {
    setCurrentStroke(0);
    setIsAnimating(false);
    setShowComplete(false);
  };

  const autoPlay = () => {
    if (currentStroke === 0 && !isAnimating) {
      let strokeIndex = 0;

      const playNext = () => {
        if (strokeIndex < strokeData.strokes.length) {
          animateStroke();
          strokeIndex++;

          // 只有在不是最后一笔画时才继续
          if (strokeIndex < strokeData.strokes.length) {
            setTimeout(playNext, animationSpeed + 500);
          }
        }
      };

      playNext();
    }
  };

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          animateStroke();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetAnimation();
          break;
        case 'a':
        case 'A':
          e.preventDefault();
          autoPlay();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStroke, isAnimating, showComplete]);

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      {/* 标题和信息 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 chinese-text mb-2">
          笔画顺序练习 - {strokeData.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="chinese-text">笔画数: {strokeData.strokeCount}</span>
          <span className="chinese-text">难度: {
            strokeData.difficulty === 'easy' ? '简单' :
            strokeData.difficulty === 'medium' ? '中等' : '困难'
          }</span>
        </div>
      </div>
      
      {/* SVG画布 */}
      <div className="relative bg-gray-50 rounded-lg p-6 mb-4">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto border border-gray-200 rounded bg-white"
        >
          {/* 网格线 */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
            
            {/* 动画定义 */}
            <style>
              {`
                .stroke-animate {
                  stroke-dasharray: 1000;
                  stroke-dashoffset: 1000;
                  animation: draw ${animationSpeed}ms ease-in-out forwards;
                }
                @keyframes draw {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
              `}
            </style>
          </defs>
          
          <rect width={width} height={height} fill="url(#grid)" />

          {/* 中心辅助线 */}
          <line x1={width/2} y1="0" x2={width/2} y2={height} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />
          <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="5,5" />

          {/* 已完成的笔画 */}
          {strokeData.strokes.slice(0, currentStroke).map((stroke, index) => (
            <path
              key={`completed-${index}`}
              d={stroke}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* 当前动画笔画 */}
          {isAnimating && currentStroke < strokeData.strokes.length && (
            <path
              d={strokeData.strokes[currentStroke]}
              fill="none"
              stroke="#ef4444"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-animate"
            />
          )}

          {/* 下一笔画预览 */}
          {!isAnimating && currentStroke < strokeData.strokes.length && (
            <path
              d={strokeData.strokes[currentStroke]}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8,4"
            />
          )}

          {/* 笔画序号标记 */}
          {strokeData.strokes.map((stroke, index) => {
            if (index > currentStroke) return null;
            
            // 简单提取路径起点作为标记位置
            const match = stroke.match(/M\s*(\d+(?:\.\d+)?)\s*(\d+(?:\.\d+)?)/);
            if (!match) return null;
            
            const x = parseFloat(match[1]);
            const y = parseFloat(match[2]);
            
            return (
              <g key={`marker-${index}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={index < currentStroke ? "#3b82f6" : index === currentStroke ? "#ef4444" : "#9ca3af"}
                  opacity="0.8"
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600 chinese-text">
          笔画 {Math.min(currentStroke + 1, strokeData.strokes.length)} / {strokeData.strokes.length}
          {showComplete && <span className="text-green-600 ml-2">✓ 完成</span>}
        </div>
        
        <div className="flex gap-2">
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
            onClick={autoPlay}
            variant="outline"
            size="sm"
            icon={Play}
            className="chinese-text"
            disabled={isAnimating || (currentStroke > 0 && !showComplete)}
          >
            自动播放
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

      {/* 参考字形 */}
      <div className="text-center">
        <div className="text-4xl thai-text text-gray-400 mb-2">{strokeData.letter}</div>
        <p className="text-sm text-gray-600 chinese-text">
          {strokeData.name} - {strokeData.meaning} ({strokeData.chinese})
        </p>
        <p className="text-xs text-gray-500 mt-1">
          快捷键: 空格键(下一笔画) | R(重新开始) | A(自动播放)
        </p>
      </div>
    </div>
  );
}
