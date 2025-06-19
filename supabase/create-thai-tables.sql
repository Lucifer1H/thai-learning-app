-- 创建泰语辅音字母表
CREATE TABLE IF NOT EXISTS public.thai_consonants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    letter TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    meaning TEXT NOT NULL,
    chinese_meaning TEXT NOT NULL,
    pronunciation TEXT NOT NULL,
    sound TEXT NOT NULL,
    tone_class TEXT NOT NULL CHECK (tone_class IN ('high', 'mid', 'low')),
    initial_sound TEXT,
    final_sound TEXT,
    strokes JSONB,
    stroke_count INTEGER,
    order_index INTEGER NOT NULL,
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    audio_url TEXT,
    is_obsolete BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建泰语元音表
CREATE TABLE IF NOT EXISTS public.thai_vowels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    sound TEXT NOT NULL,
    length TEXT NOT NULL CHECK (length IN ('short', 'long')),
    position TEXT NOT NULL CHECK (position IN ('before', 'after', 'above', 'below', 'around')),
    example_word TEXT,
    example_meaning TEXT,
    chinese_meaning TEXT NOT NULL,
    pronunciation TEXT,
    strokes JSONB,
    order_index INTEGER NOT NULL,
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    audio_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户字母学习进度表
CREATE TABLE IF NOT EXISTS public.user_letter_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    letter_type TEXT NOT NULL CHECK (letter_type IN ('consonant', 'vowel')),
    letter_id UUID NOT NULL,
    is_learned BOOLEAN DEFAULT FALSE,
    practice_count INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
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
CREATE POLICY IF NOT EXISTS "Thai consonants are viewable by everyone" ON public.thai_consonants
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Thai vowels are viewable by everyone" ON public.thai_vowels
    FOR SELECT USING (true);

-- 用户进度的策略（只能访问自己的进度）
CREATE POLICY IF NOT EXISTS "Users can view own letter progress" ON public.user_letter_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own letter progress" ON public.user_letter_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own letter progress" ON public.user_letter_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own letter progress" ON public.user_letter_progress
    FOR DELETE USING (auth.uid() = user_id);

-- 更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER IF NOT EXISTS update_thai_consonants_updated_at 
    BEFORE UPDATE ON public.thai_consonants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_thai_vowels_updated_at 
    BEFORE UPDATE ON public.thai_vowels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_user_letter_progress_updated_at 
    BEFORE UPDATE ON public.user_letter_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
