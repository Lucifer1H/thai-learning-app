-- Thai Letters Database Schema
-- 泰语字母数据库结构

-- 音调类别枚举
CREATE TYPE tone_class AS ENUM ('high', 'mid', 'low');

-- 元音位置枚举  
CREATE TYPE vowel_position AS ENUM ('before', 'after', 'above', 'below', 'around');

-- 元音长度枚举
CREATE TYPE vowel_length AS ENUM ('short', 'long');

-- 泰语辅音字母表
CREATE TABLE IF NOT EXISTS public.thai_consonants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    letter TEXT NOT NULL UNIQUE, -- 字母符号，如 'ก'
    name TEXT NOT NULL, -- 字母名称，如 'ก ไก่'
    meaning TEXT NOT NULL, -- 英文含义，如 'chicken'
    chinese_meaning TEXT NOT NULL, -- 中文含义，如 '鸡'
    pronunciation TEXT NOT NULL, -- 发音，如 'gɔɔ gài'
    sound TEXT NOT NULL, -- 音值，如 'g'
    tone_class tone_class NOT NULL, -- 音调类别
    initial_sound TEXT, -- 声母音值
    final_sound TEXT, -- 韵尾音值（如果适用）
    strokes JSONB, -- 笔画数据，存储SVG路径数组
    stroke_count INTEGER, -- 笔画数
    order_index INTEGER NOT NULL, -- 学习顺序（1-44）
    difficulty_level difficulty_level DEFAULT 'beginner',
    audio_url TEXT, -- 音频文件URL
    is_obsolete BOOLEAN DEFAULT FALSE, -- 是否为废用字母（如 ฃ ฅ）
    notes TEXT, -- 备注信息
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 泰语元音表
CREATE TABLE IF NOT EXISTS public.thai_vowels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE, -- 元音符号，如 'อะ'
    name TEXT NOT NULL, -- 元音名称
    sound TEXT NOT NULL, -- 音值，如 'a'
    length vowel_length NOT NULL, -- 长短
    position vowel_position NOT NULL, -- 位置
    example_word TEXT, -- 示例词，如 'กะ'
    example_meaning TEXT, -- 示例词含义
    chinese_meaning TEXT NOT NULL, -- 中文说明
    pronunciation TEXT, -- 发音指导
    strokes JSONB, -- 笔画数据（如果适用）
    order_index INTEGER NOT NULL, -- 学习顺序（1-32）
    difficulty_level difficulty_level DEFAULT 'beginner',
    audio_url TEXT, -- 音频文件URL
    notes TEXT, -- 备注信息
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户字母学习进度表
CREATE TABLE IF NOT EXISTS public.user_letter_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    letter_type TEXT NOT NULL CHECK (letter_type IN ('consonant', 'vowel')),
    letter_id UUID NOT NULL, -- 可以引用 thai_consonants 或 thai_vowels
    is_learned BOOLEAN DEFAULT FALSE, -- 是否已学会
    practice_count INTEGER DEFAULT 0, -- 练习次数
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100), -- 掌握程度 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, letter_type, letter_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_thai_consonants_order ON public.thai_consonants(order_index);
CREATE INDEX IF NOT EXISTS idx_thai_vowels_order ON public.thai_vowels(order_index);
CREATE INDEX IF NOT EXISTS idx_user_letter_progress_user ON public.user_letter_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_letter_progress_type ON public.user_letter_progress(letter_type);

-- 启用行级安全策略
ALTER TABLE public.thai_consonants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thai_vowels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_letter_progress ENABLE ROW LEVEL SECURITY;

-- 字母表的读取策略（所有人都可以读取）
CREATE POLICY "Thai consonants are viewable by everyone" ON public.thai_consonants
    FOR SELECT USING (true);

CREATE POLICY "Thai vowels are viewable by everyone" ON public.thai_vowels
    FOR SELECT USING (true);

-- 用户进度的策略（只能访问自己的进度）
CREATE POLICY "Users can view own letter progress" ON public.user_letter_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letter progress" ON public.user_letter_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own letter progress" ON public.user_letter_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own letter progress" ON public.user_letter_progress
    FOR DELETE USING (auth.uid() = user_id);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_thai_consonants_updated_at BEFORE UPDATE ON public.thai_consonants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thai_vowels_updated_at BEFORE UPDATE ON public.thai_vowels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_letter_progress_updated_at BEFORE UPDATE ON public.user_letter_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
