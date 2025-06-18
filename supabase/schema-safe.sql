-- Safe schema creation script (handles existing types)
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE lesson_type AS ENUM ('alphabet', 'pronunciation', 'vocabulary', 'grammar', 'writing', 'culture', 'conversation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('beginner', 'elementary', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
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
CREATE TABLE IF NOT EXISTS public.lessons (
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
CREATE TABLE IF NOT EXISTS public.vocabulary (
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
CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
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
CREATE TABLE IF NOT EXISTS public.user_vocabulary_progress (
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
CREATE TABLE IF NOT EXISTS public.study_sessions (
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
CREATE TABLE IF NOT EXISTS public.achievements (
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
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Audio files metadata
CREATE TABLE IF NOT EXISTS public.audio_files (
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

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_lessons_type_difficulty ON public.lessons(lesson_type, difficulty_level);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_vocabulary_category ON public.vocabulary(category);
CREATE INDEX IF NOT EXISTS idx_vocabulary_difficulty ON public.vocabulary(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON public.user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_progress_user ON public.user_vocabulary_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_progress_review ON public.user_vocabulary_progress(next_review_at);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, session_date);
