'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export function AudioRecorder({ 
  onRecordingComplete, 
  maxDuration = 30,
  className 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        onRecordingComplete?.(blob, url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);

      toast.success('开始录音');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('无法访问麦克风');
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast.success('录音完成');
    }
  };

  const playRecording = () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
    toast.success('录音已删除');
  };

  const downloadRecording = () => {
    if (!audioBlob || !audioUrl) return;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `recording-${new Date().toISOString().slice(0, 19)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('录音已下载');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === false) {
    return (
      <div className={cn('bg-red-50 border border-red-200 rounded-lg p-4', className)}>
        <div className="text-center">
          <Mic className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-800 font-medium chinese-text mb-2">无法访问麦克风</p>
          <p className="text-red-600 text-sm chinese-text">
            请允许浏览器访问您的麦克风以使用录音功能。
          </p>
        </div>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className={cn('bg-gray-50 border border-gray-200 rounded-lg p-4', className)}>
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-600 chinese-text">检查麦克风权限...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-4', className)}>
      <div className="text-center space-y-4">
        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-600 font-medium chinese-text">录音中...</span>
          </div>
        )}

        {/* Timer */}
        <div className="text-2xl font-mono text-gray-700">
          {formatTime(recordingTime)}
          {maxDuration && (
            <span className="text-sm text-gray-500 ml-2">
              / {formatTime(maxDuration)}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-2">
          {!isRecording && !audioUrl && (
            <Button
              onClick={startRecording}
              variant="primary"
              icon={Mic}
              className="chinese-text"
            >
              开始录音
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              variant="danger"
              icon={Square}
              className="chinese-text"
            >
              停止录音
            </Button>
          )}

          {audioUrl && !isRecording && (
            <>
              <Button
                onClick={playRecording}
                variant="primary"
                icon={isPlaying ? Pause : Play}
                className="chinese-text"
              >
                {isPlaying ? '暂停' : '播放'}
              </Button>
              
              <Button
                onClick={deleteRecording}
                variant="outline"
                icon={Trash2}
                className="chinese-text"
              >
                删除
              </Button>
              
              <Button
                onClick={downloadRecording}
                variant="outline"
                icon={Download}
                className="chinese-text"
              >
                下载
              </Button>
            </>
          )}
        </div>

        {/* Audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Instructions */}
        <p className="text-sm text-gray-600 chinese-text">
          {!audioUrl && !isRecording && '点击开始录音按钮开始录制您的发音'}
          {isRecording && '正在录音中，点击停止按钮结束录制'}
          {audioUrl && !isRecording && '录音完成，您可以播放、下载或删除录音'}
        </p>
      </div>
    </div>
  );
}
