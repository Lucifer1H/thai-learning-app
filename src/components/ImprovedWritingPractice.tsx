'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, Eye, EyeOff, Target } from 'lucide-react';

interface ImprovedWritingPracticeProps {
  letter: string;
  onComplete?: () => void;
  className?: string;
}

export function ImprovedWritingPractice({ letter, onComplete, className }: ImprovedWritingPracticeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const referenceCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showReference, setShowReference] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<'success' | 'fail' | null>(null);
  const [similarityScore, setSimilarityScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up drawing canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3b82f6';

    // Draw grid background
    drawGrid(ctx, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    // Draw reference letter
    drawReferenceLetterOnCanvas();
  }, [letter, showReference]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    // Draw grid lines
    for (let x = 0; x <= width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw center lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    ctx.restore();
  };

  const drawReferenceLetterOnCanvas = () => {
    const canvas = referenceCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    drawGrid(ctx, canvas.width, canvas.height);

    // Draw reference letter
    ctx.save();
    ctx.font = '120px "Noto Sans Thai", sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  };

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
    setComparisonResult(null);
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
    drawGrid(ctx, canvas.width, canvas.height);
    setHasDrawn(false);
    setComparisonResult(null);
    setSimilarityScore(0);
  };

  const compareWithReference = async () => {
    if (!hasDrawn) return;

    setIsComparing(true);
    
    // 模拟比对过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 简单的模拟比对算法
    const randomScore = Math.random() * 100;
    const threshold = 70; // 70%相似度阈值
    
    setSimilarityScore(Math.round(randomScore));
    
    if (randomScore >= threshold) {
      setComparisonResult('success');
      if (onComplete) {
        setTimeout(() => onComplete(), 1000);
      }
    } else {
      setComparisonResult('fail');
    }
    
    setIsComparing(false);
  };

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 chinese-text">
          书写练习 - {letter}
        </h3>
        <Button
          onClick={() => setShowReference(!showReference)}
          variant="outline"
          size="sm"
          icon={showReference ? EyeOff : Eye}
          className="chinese-text"
        >
          {showReference ? '隐藏参考' : '显示参考'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Reference Canvas */}
        {showReference && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 chinese-text mb-2">
              参考字形
            </h4>
            <div className="relative">
              <canvas
                ref={referenceCanvasRef}
                width={300}
                height={300}
                className="border-2 border-gray-300 rounded-lg mx-auto block bg-white"
              />
              <div className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded chinese-text">
                标准字形
              </div>
            </div>
          </div>
        )}
        
        {/* Practice Canvas */}
        <div className={showReference ? '' : 'lg:col-span-2'}>
          <h4 className="text-sm font-medium text-gray-700 chinese-text mb-2">
            练习区域
          </h4>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="border-2 border-dashed border-gray-400 rounded-lg cursor-crosshair mx-auto block bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            
            {/* Comparison Result Overlay */}
            {comparisonResult && (
              <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                comparisonResult === 'success' 
                  ? 'bg-green-50 bg-opacity-95' 
                  : 'bg-red-50 bg-opacity-95'
              }`}>
                <div className="text-center">
                  {comparisonResult === 'success' ? (
                    <>
                      <Check className="h-16 w-16 text-green-600 mx-auto mb-3" />
                      <p className="text-green-800 font-bold text-lg chinese-text mb-1">
                        练习成功！
                      </p>
                      <p className="text-green-700 text-sm chinese-text">
                        相似度: {similarityScore}%
                      </p>
                    </>
                  ) : (
                    <>
                      <Target className="h-16 w-16 text-red-600 mx-auto mb-3" />
                      <p className="text-red-800 font-bold text-lg chinese-text mb-1">
                        需要改进
                      </p>
                      <p className="text-red-700 text-sm chinese-text mb-2">
                        相似度: {similarityScore}%
                      </p>
                      <p className="text-red-600 text-xs chinese-text">
                        请参考标准字形重新练习
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Loading Overlay */}
            {isComparing && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-95 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-blue-800 font-semibold chinese-text">
                    正在比对字形...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 chinese-text">
          {hasDrawn ? '已绘制内容，可以进行比对' : '请在练习区域书写字母'}
          {similarityScore > 0 && (
            <span className="ml-2 text-blue-600">
              (相似度: {similarityScore}%)
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
            icon={RotateCcw}
            className="chinese-text"
          >
            清除重写
          </Button>
          
          <Button
            onClick={compareWithReference}
            disabled={!hasDrawn || isComparing}
            variant="primary"
            size="sm"
            icon={Target}
            className="chinese-text"
          >
            {isComparing ? '比对中...' : '比对字形'}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 chinese-text">
          💡 <strong>使用提示：</strong>
          参考左侧标准字形，在右侧练习区域书写。完成后点击&ldquo;比对字形&rdquo;进行评估。
          相似度达到70%以上即可通过练习。
        </p>
      </div>
    </div>
  );
}
