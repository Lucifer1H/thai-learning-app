-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE lesson_type AS ENUM ('alphabet', 'pronunciation', 'vocabulary', 'grammar', 'writing', 'culture', 'conversation');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'elementary', 'intermediate', 'advanced');
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    native_language TEXT DEFAULT 'chinese',
    target_language TEXT DEFAULT 'thai',
    user_role user_role DEFAULT 'student',
    learning_streak INTEGER DEFAULT 0,
    total_study_time INTEGER DEFAULT 0, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE public.lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    title_chinese TEXT NOT NULL,
    description TEXT,
    description_chinese TEXT,
    lesson_type lesson_type NOT NULL,
    difficulty_level difficulty_level DEFAULT 'beginner',
    order_index INTEGER NOT NULL,
    content JSONB NOT NULL, -- Flexible content structure
    audio_urls TEXT[], -- Array of audio file URLs
    image_urls TEXT[], -- Array of image URLs
    estimated_duration INTEGER DEFAULT 15, -- in minutes
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vocabulary table
CREATE TABLE public.vocabulary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    thai_word TEXT NOT NULL,
    chinese_translation TEXT NOT NULL,
    pronunciation TEXT NOT NULL, -- Romanized pronunciation
    pronunciation_ipa TEXT, -- IPA pronunciation
    audio_url TEXT,
    image_url TEXT,
    category TEXT NOT NULL, -- e.g., 'greetings', 'food', 'numbers'
    difficulty_level difficulty_level DEFAULT 'beginner',
    usage_example_thai TEXT,
    usage_example_chinese TEXT,
    usage_example_audio_url TEXT,
    tags TEXT[], -- Array of tags for categorization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress for lessons
CREATE TABLE public.user_lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_spent INTEGER DEFAULT 0, -- in minutes
    attempts INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- User progress for vocabulary
CREATE TABLE public.user_vocabulary_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5), -- 0-5 scale
    correct_answers INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_review_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vocabulary_id)
);

-- Study sessions for tracking daily activity
CREATE TABLE public.study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_date DATE DEFAULT CURRENT_DATE,
    total_time INTEGER DEFAULT 0, -- in minutes
    lessons_completed INTEGER DEFAULT 0,
    vocabulary_practiced INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_date)
);

-- Achievements system
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    name_chinese TEXT NOT NULL,
    description TEXT,
    description_chinese TEXT,
    icon TEXT, -- Icon identifier
    criteria JSONB NOT NULL, -- Flexible criteria structure
    reward_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Audio files metadata
CREATE TABLE public.audio_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    duration REAL, -- in seconds
    content_type TEXT DEFAULT 'audio/mpeg',
    related_vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE SET NULL,
    related_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    speaker_gender TEXT CHECK (speaker_gender IN ('male', 'female')),
    speaker_region TEXT, -- e.g., 'bangkok', 'northern', 'southern'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thai consonants table
CREATE TABLE public.thai_consonants (
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
    difficulty_level difficulty_level DEFAULT 'beginner',
    audio_url TEXT,
    is_obsolete BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thai vowels table
CREATE TABLE public.thai_vowels (
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
    difficulty_level difficulty_level DEFAULT 'beginner',
    audio_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User letter progress table
CREATE TABLE public.user_letter_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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

-- Create indexes for better performance
CREATE INDEX idx_lessons_type_difficulty ON public.lessons(lesson_type, difficulty_level);
CREATE INDEX idx_lessons_order ON public.lessons(order_index);
CREATE INDEX idx_vocabulary_category ON public.vocabulary(category);
CREATE INDEX idx_vocabulary_difficulty ON public.vocabulary(difficulty_level);
CREATE INDEX idx_user_lesson_progress_user ON public.user_lesson_progress(user_id);
CREATE INDEX idx_user_vocabulary_progress_user ON public.user_vocabulary_progress(user_id);
CREATE INDEX idx_user_vocabulary_progress_review ON public.user_vocabulary_progress(next_review_at);
CREATE INDEX idx_study_sessions_user_date ON public.study_sessions(user_id, session_date);
CREATE INDEX idx_thai_consonants_order ON public.thai_consonants(order_index);
CREATE INDEX idx_thai_vowels_order ON public.thai_vowels(order_index);
CREATE INDEX idx_user_letter_progress_user ON public.user_letter_progress(user_id);
CREATE INDEX idx_user_letter_progress_type ON public.user_letter_progress(letter_type);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thai_consonants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thai_vowels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_letter_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- User progress policies
CREATE POLICY "Users can view own lesson progress" ON public.user_lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress" ON public.user_lesson_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" ON public.user_lesson_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vocabulary progress" ON public.user_vocabulary_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary progress" ON public.user_vocabulary_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary progress" ON public.user_vocabulary_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can view own study sessions" ON public.study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study sessions" ON public.study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions" ON public.study_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for lessons, vocabulary, achievements, and audio files
CREATE POLICY "Anyone can view published lessons" ON public.lessons
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view vocabulary" ON public.vocabulary
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view achievements" ON public.achievements
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view audio files" ON public.audio_files
    FOR SELECT USING (true);

-- Thai letters policies
CREATE POLICY "Anyone can view thai consonants" ON public.thai_consonants
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view thai vowels" ON public.thai_vowels
    FOR SELECT USING (true);

-- User letter progress policies
CREATE POLICY "Users can view own letter progress" ON public.user_letter_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own letter progress" ON public.user_letter_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own letter progress" ON public.user_letter_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own letter progress" ON public.user_letter_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabulary_updated_at BEFORE UPDATE ON public.vocabulary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON public.user_lesson_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_vocabulary_progress_updated_at BEFORE UPDATE ON public.user_vocabulary_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON public.study_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thai_consonants_updated_at BEFORE UPDATE ON public.thai_consonants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thai_vowels_updated_at BEFORE UPDATE ON public.thai_vowels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_letter_progress_updated_at BEFORE UPDATE ON public.user_letter_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
