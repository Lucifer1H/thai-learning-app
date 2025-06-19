'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Volume2, 
  Download, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  X,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInfo {
  name: string;
  lang: string;
  localService: boolean;
  quality: 'high' | 'medium' | 'low';
}

interface VoiceSetupGuideProps {
  onClose?: () => void;
  onVoiceSelected?: (voice: SpeechSynthesisVoice | null) => void;
}

export function VoiceSetupGuide({ onClose, onVoiceSelected }: VoiceSetupGuideProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [thaiVoices, setThaiVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const [userOS, setUserOS] = useState<'windows' | 'mac' | 'linux' | 'unknown'>('unknown');

  useEffect(() => {
    // 检测操作系统
    const platform = navigator.platform.toLowerCase();
    if (platform.includes('win')) {
      setUserOS('windows');
    } else if (platform.includes('mac')) {
      setUserOS('mac');
    } else if (platform.includes('linux')) {
      setUserOS('linux');
    }

    // 加载语音列表
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      const thai = availableVoices.filter(voice => 
        voice.lang.startsWith('th') || 
        voice.name.toLowerCase().includes('thai')
      );
      setThaiVoices(thai);
      
      // 自动选择最好的泰语语音
      if (thai.length > 0) {
        const bestVoice = thai.find(v => v.localService) || thai[0];
        setSelectedVoice(bestVoice);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const testVoice = async (voice: SpeechSynthesisVoice | null) => {
    if (isTestPlaying) return;

    setIsTestPlaying(true);
    
    try {
      const utterance = new SpeechSynthesisUtterance('สวัสดี กา มา นา');
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = 'th-TH';
      utterance.rate = 0.7;
      utterance.volume = 1.0;

      utterance.onend = () => setIsTestPlaying(false);
      utterance.onerror = () => setIsTestPlaying(false);

      speechSynthesis.speak(utterance);
    } catch (error) {
      setIsTestPlaying(false);
    }
  };

  const getVoiceQuality = (voice: SpeechSynthesisVoice): 'high' | 'medium' | 'low' => {
    if (voice.localService && voice.lang === 'th-TH') return 'high';
    if (voice.localService) return 'medium';
    return 'low';
  };

  const getInstallInstructions = () => {
    switch (userOS) {
      case 'windows':
        return {
          title: 'Windows 安装泰语语音包',
          steps: [
            '打开 设置 (Win + I)',
            '选择 时间和语言',
            '点击 语音',
            '在 管理语音 下点击 添加语音',
            '搜索并选择 泰语 (ไทย)',
            '点击 安装',
            '安装完成后重启浏览器'
          ],
          directLink: 'ms-settings:speech'
        };
      case 'mac':
        return {
          title: 'macOS 安装泰语语音包',
          steps: [
            '打开 系统偏好设置',
            '选择 辅助功能',
            '点击 语音',
            '在 系统语音 下拉菜单中选择 自定义',
            '找到并下载泰语语音包',
            '安装完成后重启浏览器'
          ]
        };
      case 'linux':
        return {
          title: 'Linux 安装泰语语音包',
          steps: [
            '安装 espeak-ng: sudo apt install espeak-ng',
            '安装泰语语音数据: sudo apt install espeak-ng-data',
            '或使用 festival: sudo apt install festival festvox-th',
            '重启浏览器'
          ]
        };
      default:
        return {
          title: '安装泰语语音包',
          steps: [
            '请根据您的操作系统查找相应的语音包安装方法',
            '通常在系统设置的语言或辅助功能部分',
            '安装完成后重启浏览器'
          ]
        };
    }
  };

  const instructions = getInstallInstructions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 chinese-text">
            泰语语音设置
          </h2>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              icon={X}
            />
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* 当前语音状态 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 chinese-text mb-3">
              当前语音状态
            </h3>
            
            {thaiVoices.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="chinese-text">找到 {thaiVoices.length} 个泰语语音</span>
                </div>
                
                {thaiVoices.map((voice, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded p-3">
                    <div>
                      <div className="font-medium">{voice.name}</div>
                      <div className="text-sm text-gray-600">
                        {voice.lang} • {voice.localService ? '本地语音' : '在线语音'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        'px-2 py-1 rounded text-xs',
                        getVoiceQuality(voice) === 'high' ? 'bg-green-100 text-green-800' :
                        getVoiceQuality(voice) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      )}>
                        {getVoiceQuality(voice) === 'high' ? '高质量' :
                         getVoiceQuality(voice) === 'medium' ? '中等' : '基础'}
                      </span>
                      <Button
                        onClick={() => testVoice(voice)}
                        disabled={isTestPlaying}
                        variant="outline"
                        size="sm"
                        icon={Play}
                        className="chinese-text"
                      >
                        测试
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center text-orange-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="chinese-text">未找到泰语语音包</span>
              </div>
            )}
          </div>

          {/* 安装指导 */}
          {thaiVoices.length === 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 chinese-text mb-3 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                {instructions.title}
              </h3>
              
              <ol className="space-y-2 text-sm text-blue-800">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-200 text-blue-900 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="chinese-text">{step}</span>
                  </li>
                ))}
              </ol>

              {instructions.directLink && userOS === 'windows' && (
                <div className="mt-4">
                  <Button
                    onClick={() => window.open(instructions.directLink, '_blank')}
                    variant="primary"
                    icon={ExternalLink}
                    className="chinese-text"
                  >
                    直接打开语音设置
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 测试区域 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 chinese-text mb-3">
              语音测试
            </h3>
            <p className="text-sm text-gray-600 chinese-text mb-3">
              点击下面的按钮测试当前语音效果
            </p>
            <Button
              onClick={() => testVoice(selectedVoice)}
              disabled={isTestPlaying}
              variant="primary"
              icon={isTestPlaying ? undefined : Volume2}
              className="chinese-text"
            >
              {isTestPlaying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  播放中...
                </>
              ) : (
                '🔊 测试泰语发音'
              )}
            </Button>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-3">
            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                className="chinese-text"
              >
                稍后设置
              </Button>
            )}
            <Button
              onClick={() => {
                onVoiceSelected?.(selectedVoice);
                onClose?.();
              }}
              variant="primary"
              className="chinese-text"
            >
              使用当前设置
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
