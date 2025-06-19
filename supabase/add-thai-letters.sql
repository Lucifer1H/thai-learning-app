-- 添加泰语字母表到现有数据库

-- Thai consonants table
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
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'elementary', 'intermediate', 'advanced')),
    audio_url TEXT,
    is_obsolete BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thai vowels table
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
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'elementary', 'intermediate', 'advanced')),
    audio_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User letter progress table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_thai_consonants_order ON public.thai_consonants(order_index);
CREATE INDEX IF NOT EXISTS idx_thai_vowels_order ON public.thai_vowels(order_index);
CREATE INDEX IF NOT EXISTS idx_user_letter_progress_user ON public.user_letter_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_letter_progress_type ON public.user_letter_progress(letter_type);

-- Enable RLS
ALTER TABLE public.thai_consonants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thai_vowels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_letter_progress ENABLE ROW LEVEL SECURITY;

-- Create policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view thai consonants" ON public.thai_consonants;
CREATE POLICY "Anyone can view thai consonants" ON public.thai_consonants
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view thai vowels" ON public.thai_vowels;
CREATE POLICY "Anyone can view thai vowels" ON public.thai_vowels
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own letter progress" ON public.user_letter_progress;
CREATE POLICY "Users can view own letter progress" ON public.user_letter_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own letter progress" ON public.user_letter_progress;
CREATE POLICY "Users can insert own letter progress" ON public.user_letter_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own letter progress" ON public.user_letter_progress;
CREATE POLICY "Users can update own letter progress" ON public.user_letter_progress
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own letter progress" ON public.user_letter_progress;
CREATE POLICY "Users can delete own letter progress" ON public.user_letter_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at (drop existing ones first)
DROP TRIGGER IF EXISTS update_thai_consonants_updated_at ON public.thai_consonants;
CREATE TRIGGER update_thai_consonants_updated_at
    BEFORE UPDATE ON public.thai_consonants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_thai_vowels_updated_at ON public.thai_vowels;
CREATE TRIGGER update_thai_vowels_updated_at
    BEFORE UPDATE ON public.thai_vowels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_letter_progress_updated_at ON public.user_letter_progress;
CREATE TRIGGER update_user_letter_progress_updated_at
    BEFORE UPDATE ON public.user_letter_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
