'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/providers';
import { ArrowLeft, RotateCcw, Check, Volume2, Settings } from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';
import { LoadingPage } from '@/components/ui/loading';
import { VoiceSetupGuide } from '@/components/audio/voice-setup-guide';
import { audioManager } from '@/lib/audio-utils';
import Link from 'next/link';

// 完整的44个泰语辅音字母数据
const thaiLetters = [
  { letter: 'ก', name: 'ก ไก่', meaning: '鸡', pronunciation: 'gɔɔ gài', strokes: ['M 50 20 Q 80 20 80 50 Q 80 80 50 80', 'M 50 50 L 80 50', 'M 65 50 L 65 100'] },
  { letter: 'ข', name: 'ข ไข่', meaning: '蛋', pronunciation: 'khɔɔ khài', strokes: ['M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50', 'M 45 50 L 45 100', 'M 70 20 Q 90 20 90 40 Q 90 60 70 60'] },
  { letter: 'ฃ', name: 'ฃ ขวด', meaning: '瓶子', pronunciation: 'khɔɔ khùat', strokes: ['M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50', 'M 45 50 L 45 100', 'M 70 20 L 90 40', 'M 90 20 L 70 40'] },
  { letter: 'ค', name: 'ค ควาย', meaning: '水牛', pronunciation: 'khɔɔ khwaai', strokes: ['M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50', 'M 45 50 L 45 100', 'M 70 30 L 90 30', 'M 80 20 L 80 40'] },
  { letter: 'ฅ', name: 'ฅ คน', meaning: '人', pronunciation: 'khɔɔ khon', strokes: ['M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50', 'M 45 50 L 45 100', 'M 70 20 L 90 20', 'M 80 20 L 80 40'] },
  { letter: 'ฆ', name: 'ฆ ระฆัง', meaning: '钟', pronunciation: 'khɔɔ rakhang', strokes: ['M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50', 'M 45 50 L 45 100', 'M 70 20 Q 90 30 70 40'] },
  { letter: 'ง', name: 'ง งู', meaning: '蛇', pronunciation: 'ngɔɔ nguu', strokes: ['M 40 20 Q 70 20 70 50 Q 70 80 40 80', 'M 40 50 L 70 50'] },
  { letter: 'จ', name: 'จ จาน', meaning: '盘子', pronunciation: 'jɔɔ jaan', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 60', 'M 40 60 Q 55 80 70 60'] },
  { letter: 'ฉ', name: 'ฉ ฉิ่ง', meaning: '钹', pronunciation: 'chɔɔ chìng', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 60', 'M 40 60 Q 55 80 70 60', 'M 85 20 Q 95 30 85 40'] },
  { letter: 'ช', name: 'ช ช้าง', meaning: '大象', pronunciation: 'chɔɔ cháang', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 60', 'M 40 60 Q 55 80 70 60', 'M 85 30 L 95 30', 'M 90 20 L 90 40'] },
  { letter: 'ซ', name: 'ซ โซ่', meaning: '链子', pronunciation: 'sɔɔ sôo', strokes: ['M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50', 'M 45 50 L 45 100', 'M 70 30 Q 85 20 85 40'] },
  { letter: 'ฌ', name: 'ฌ เฌอ', meaning: '树', pronunciation: 'chɔɔ chəə', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 60', 'M 40 60 Q 55 80 70 60', 'M 85 20 L 95 40', 'M 95 20 L 85 40'] },
  { letter: 'ญ', name: 'ญ หญิง', meaning: '女人', pronunciation: 'yɔɔ yǐng', strokes: ['M 30 20 L 80 20', 'M 40 20 L 40 60', 'M 70 20 L 70 60', 'M 30 60 Q 55 80 80 60'] },
  { letter: 'ฎ', name: 'ฎ ชฎา', meaning: '头饰', pronunciation: 'dɔɔ chadaa', strokes: ['M 40 20 Q 70 20 70 50 Q 70 80 40 80', 'M 40 50 L 70 50', 'M 55 50 L 55 100', 'M 30 30 L 40 40'] },
  { letter: 'ฏ', name: 'ฏ ปฏัก', meaning: '标枪', pronunciation: 'tɔɔ patak', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80', 'M 30 30 L 40 40'] },
  { letter: 'ฐ', name: 'ฐ ฐาน', meaning: '基座', pronunciation: 'thɔɔ thǎan', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80', 'M 85 30 L 95 30', 'M 90 20 L 90 40'] },
  { letter: 'ฑ', name: 'ฑ มณโฑ', meaning: '老人', pronunciation: 'thɔɔ monthoo', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80', 'M 85 20 L 95 20', 'M 90 20 L 90 40'] },
  { letter: 'ฒ', name: 'ฒ ผู้เฒ่า', meaning: '老者', pronunciation: 'thɔɔ phûu thào', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80', 'M 85 20 Q 95 30 85 40'] },
  { letter: 'ณ', name: 'ณ เณร', meaning: '沙弥', pronunciation: 'nɔɔ neen', strokes: ['M 30 20 L 80 20', 'M 40 20 L 40 60', 'M 70 20 L 70 60', 'M 30 60 Q 55 80 80 60', 'M 85 30 L 95 30'] },
  { letter: 'ด', name: 'ด เด็ก', meaning: '孩子', pronunciation: 'dɔɔ dèk', strokes: ['M 40 20 Q 70 20 70 50 Q 70 80 40 80', 'M 40 50 L 70 50', 'M 55 50 L 55 100'] },
  { letter: 'ต', name: 'ต เต่า', meaning: '乌龟', pronunciation: 'tɔɔ tào', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80'] },
  { letter: 'ถ', name: 'ถ ถุง', meaning: '袋子', pronunciation: 'thɔɔ thǔng', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80', 'M 85 30 L 95 30', 'M 90 20 L 90 40'] },
  { letter: 'ท', name: 'ท ทหาร', meaning: '士兵', pronunciation: 'thɔɔ thahǎan', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80', 'M 85 20 L 95 20', 'M 90 20 L 90 40'] },
  { letter: 'ธ', name: 'ธ ธง', meaning: '旗子', pronunciation: 'thɔɔ thong', strokes: ['M 30 20 L 80 20', 'M 55 20 L 55 80', 'M 85 20 Q 95 30 85 40'] },
  { letter: 'น', name: 'น หนู', meaning: '老鼠', pronunciation: 'nɔɔ nǔu', strokes: ['M 30 20 L 80 20', 'M 40 20 L 40 60', 'M 70 20 L 70 60', 'M 30 60 Q 55 80 80 60'] },
  { letter: 'บ', name: 'บ ใบไม้', meaning: '叶子', pronunciation: 'bɔɔ bai máai', strokes: ['M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50', 'M 45 50 L 45 100', 'M 70 20 Q 90 20 90 50 Q 90 80 70 80', 'M 70 50 L 90 50'] },
  { letter: 'ป', name: 'ป ปลา', meaning: '鱼', pronunciation: 'pɔɔ plaa', strokes: ['M 30 20 L 80 20', 'M 30 20 L 30 80', 'M 30 50 L 60 50', 'M 70 20 Q 90 20 90 50 Q 90 80 70 80', 'M 70 50 L 90 50'] },
  { letter: 'ผ', name: 'ผ ผึ้ง', meaning: '蜜蜂', pronunciation: 'phɔɔ phɯ̂ng', strokes: ['M 30 20 L 80 20', 'M 30 20 L 30 80', 'M 30 50 L 60 50', 'M 85 30 L 95 30', 'M 90 20 L 90 40'] },
  { letter: 'ฝ', name: 'ฝ ฝา', meaning: '盖子', pronunciation: 'fɔɔ fǎa', strokes: ['M 30 20 L 80 20', 'M 30 20 L 30 80', 'M 30 50 L 60 50', 'M 85 20 Q 95 30 85 40'] },
  { letter: 'พ', name: 'พ พาน', meaning: '托盘', pronunciation: 'phɔɔ phaan', strokes: ['M 30 20 L 80 20', 'M 30 20 L 30 80', 'M 30 50 L 60 50', 'M 85 20 L 95 20', 'M 90 20 L 90 40'] },
  { letter: 'ฟ', name: 'ฟ ฟัน', meaning: '牙齿', pronunciation: 'fɔɔ fan', strokes: ['M 30 20 L 80 20', 'M 30 20 L 30 80', 'M 30 50 L 60 50', 'M 85 30 Q 95 20 95 40'] },
  { letter: 'ภ', name: 'ภ สำเภา', meaning: '帆船', pronunciation: 'phɔɔ samphao', strokes: ['M 30 20 L 80 20', 'M 30 20 L 30 80', 'M 30 50 L 60 50', 'M 70 20 Q 90 20 90 50 Q 90 80 70 80', 'M 70 50 L 90 50', 'M 95 30 L 105 30'] },
  { letter: 'ม', name: 'ม ม้า', meaning: '马', pronunciation: 'mɔɔ máa', strokes: ['M 30 20 L 80 20', 'M 40 20 L 40 60', 'M 70 20 L 70 60', 'M 30 60 Q 55 80 80 60'] },
  { letter: 'ย', name: 'ย ยักษ์', meaning: '巨人', pronunciation: 'yɔɔ yák', strokes: ['M 30 20 Q 55 40 80 20', 'M 55 40 L 55 80'] },
  { letter: 'ร', name: 'ร เรือ', meaning: '船', pronunciation: 'rɔɔ rɯa', strokes: ['M 30 20 L 30 80', 'M 30 20 Q 60 20 60 50 Q 60 80 30 80', 'M 30 50 L 60 50'] },
  { letter: 'ล', name: 'ล ลิง', meaning: '猴子', pronunciation: 'lɔɔ ling', strokes: ['M 30 20 Q 55 10 80 20', 'M 55 20 L 55 80', 'M 30 60 Q 55 80 80 60'] },
  { letter: 'ว', name: 'ว แหวน', meaning: '戒指', pronunciation: 'wɔɔ wɛ̌ɛn', strokes: ['M 30 20 Q 55 40 80 20', 'M 55 40 Q 55 60 55 80'] },
  { letter: 'ศ', name: 'ศ ศาลา', meaning: '亭子', pronunciation: 'sɔɔ sǎalaa', strokes: ['M 30 20 L 80 20', 'M 40 20 L 40 60', 'M 70 20 L 70 60', 'M 30 60 Q 55 80 80 60', 'M 85 30 L 95 30'] },
  { letter: 'ษ', name: 'ษ ฤๅษี', meaning: '隐士', pronunciation: 'sɔɔ rɯɯsǐi', strokes: ['M 30 20 L 80 20', 'M 40 20 L 40 60', 'M 70 20 L 70 60', 'M 30 60 Q 55 80 80 60', 'M 85 20 L 95 20', 'M 90 20 L 90 40'] },
  { letter: 'ส', name: 'ส เสือ', meaning: '老虎', pronunciation: 'sɔɔ sɯ̌a', strokes: ['M 30 20 L 80 20', 'M 40 20 L 40 60', 'M 70 20 L 70 60', 'M 30 60 Q 55 80 80 60', 'M 85 20 Q 95 30 85 40'] },
  { letter: 'ห', name: 'ห หีบ', meaning: '箱子', pronunciation: 'hɔɔ hìip', strokes: ['M 30 20 L 30 80', 'M 30 20 L 60 20', 'M 60 20 L 60 50', 'M 60 50 L 80 50', 'M 80 50 L 80 80'] },
  { letter: 'ฬ', name: 'ฬ จุฬา', meaning: '风筝', pronunciation: 'lɔɔ julaa', strokes: ['M 30 20 Q 55 10 80 20', 'M 55 20 L 55 80', 'M 30 60 Q 55 80 80 60', 'M 85 30 L 95 30'] },
  { letter: 'อ', name: 'อ อ่าง', meaning: '盆', pronunciation: 'ɔɔ àang', strokes: ['M 30 30 Q 30 20 40 20 Q 70 20 70 30 Q 70 70 40 70 Q 30 70 30 60', 'M 55 30 L 55 70'] },
  { letter: 'ฮ', name: 'ฮ นกฮูก', meaning: '猫头鹰', pronunciation: 'hɔɔ nók hûuk', strokes: ['M 30 20 L 30 80', 'M 30 20 L 60 20', 'M 60 20 L 60 50', 'M 60 50 L 80 50', 'M 80 50 L 80 80', 'M 85 30 Q 95 20 95 40'] }
];

export default function WritingPracticePage() {
  const { user, loading } = useAuth();
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [showVoiceSetup, setShowVoiceSetup] = useState(false);
  const [voiceQuality, setVoiceQuality] = useState<'excellent' | 'good' | 'basic' | 'none'>('none');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);

  const currentLetter = thaiLetters[currentLetterIndex];

  // 语音质量检测
  useEffect(() => {
    const checkVoiceQuality = () => {
      const quality = audioManager.getVoiceQuality();
      setVoiceQuality(quality);

      const bestVoice = audioManager.getBestThaiVoice();
      setSelectedVoice(bestVoice);

      // 如果语音质量很差，自动显示设置指导
      if (quality === 'none') {
        setShowVoiceSetup(true);
      }
    };

    checkVoiceQuality();
    speechSynthesis.onvoiceschanged = checkVoiceQuality;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getVoiceQualityInfo = () => {
    switch (voiceQuality) {
      case 'excellent':
        return { text: '语音质量：优秀', color: 'text-green-600', icon: '🎯' };
      case 'good':
        return { text: '语音质量：良好', color: 'text-blue-600', icon: '👍' };
      case 'basic':
        return { text: '语音质量：基础', color: 'text-yellow-600', icon: '⚠️' };
      case 'none':
        return { text: '未找到泰语语音', color: 'text-red-600', icon: '❌' };
    }
  };

  // 播放发音
  const playPronunciation = async () => {
    if (isPlayingAudio) return;

    setIsPlayingAudio(true);
    console.log('开始播放书写练习音频:', currentLetter.letter);

    try {
      // 确保语音合成可用
      if (!('speechSynthesis' in window)) {
        throw new Error('浏览器不支持语音合成');
      }

      // 等待语音列表加载
      const waitForVoices = () => {
        return new Promise<void>((resolve) => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            resolve();
          } else {
            window.speechSynthesis.onvoiceschanged = () => resolve();
          }
        });
      };

      await waitForVoices();

      // 创建语音合成实例
      const utterance = new SpeechSynthesisUtterance(currentLetter.letter);

      // 使用选定的语音或最佳泰语语音
      const voiceToUse = selectedVoice || audioManager.getBestThaiVoice();

      if (voiceToUse) {
        utterance.voice = voiceToUse;
        console.log('使用泰语语音:', voiceToUse.name);
      } else {
        console.log('未找到泰语语音，使用默认语音');
      }

      utterance.lang = 'th-TH';
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        console.log('书写练习语音开始播放');
      };

      utterance.onend = () => {
        console.log('书写练习语音播放完成');
        setIsPlayingAudio(false);
      };

      utterance.onerror = (event) => {
        console.error('书写练习语音播放错误:', event.error);
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error('书写练习音频播放失败:', error);
      setIsPlayingAudio(false);
    }
  };

  // 清除画布
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    // 阻止触摸事件的默认行为（如滚动），但只在开始绘制时
    if ('touches' in e) {
      e.preventDefault();
    }

    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      // 计算缩放比例，将显示坐标转换为canvas内部坐标
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      setLastPoint({ x, y });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    // 阻止触摸事件的默认行为（如滚动），但只在正在绘制时
    if ('touches' in e) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        // 计算缩放比例，将显示坐标转换为canvas内部坐标
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        
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

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-12">
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
              <div className="flex items-center space-x-4 mb-2">
                <span className={`text-xs ${getVoiceQualityInfo().color}`}>
                  {getVoiceQualityInfo().icon} {getVoiceQualityInfo().text}
                </span>
                <button
                  onClick={() => setShowVoiceSetup(true)}
                  className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="语音设置"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 左侧：字母信息和控制 */}
          <div className="lg:col-span-2 space-y-6">
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
                disabled={isPlayingAudio}
                className={`w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                  isPlayingAudio
                    ? 'bg-blue-200 text-blue-600 cursor-not-allowed'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
              >
                <Volume2 className="h-4 w-4" />
                <span className="chinese-text">
                  {isPlayingAudio ? '播放中...' : '播放发音'}
                </span>
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


          </div>

          {/* 右侧：书写区域 */}
          <div className="lg:col-span-3 space-y-6">
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
                  width={800}
                  height={500}
                  className="w-full cursor-crosshair bg-white block"
                  style={{ height: '500px', maxWidth: '100%' }}
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

      {/* 语音设置指导弹窗 */}
      {showVoiceSetup && (
        <VoiceSetupGuide
          onClose={() => setShowVoiceSetup(false)}
          onVoiceSelected={(voice) => {
            setSelectedVoice(voice);
            // 重新检查语音质量
            const quality = audioManager.getVoiceQuality();
            setVoiceQuality(quality);
          }}
        />
      )}
    </div>
  );
}
