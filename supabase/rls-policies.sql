-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_files ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Lessons table policies (public read access)
CREATE POLICY "Anyone can view published lessons" ON public.lessons
    FOR SELECT USING (is_published = true);

CREATE POLICY "Teachers can manage lessons" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND user_role IN ('teacher', 'admin')
        )
    );

-- Vocabulary table policies (public read access)
CREATE POLICY "Anyone can view vocabulary" ON public.vocabulary
    FOR SELECT USING (true);

CREATE POLICY "Teachers can manage vocabulary" ON public.vocabulary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND user_role IN ('teacher', 'admin')
        )
    );

-- User lesson progress policies
CREATE POLICY "Users can view own lesson progress" ON public.user_lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" ON public.user_lesson_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own lesson progress" ON public.user_lesson_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- User vocabulary progress policies
CREATE POLICY "Users can view own vocabulary progress" ON public.user_vocabulary_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary progress" ON public.user_vocabulary_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own vocabulary progress" ON public.user_vocabulary_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can view own study sessions" ON public.study_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own study sessions" ON public.study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study sessions" ON public.study_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies (public read access)
CREATE POLICY "Anyone can view achievements" ON public.achievements
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can award achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audio files policies (public read access)
CREATE POLICY "Anyone can view audio files" ON public.audio_files
    FOR SELECT USING (true);

CREATE POLICY "Teachers can manage audio files" ON public.audio_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND user_role IN ('teacher', 'admin')
        )
    );

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update user updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vocabulary_updated_at BEFORE UPDATE ON public.vocabulary
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_lesson_progress_updated_at BEFORE UPDATE ON public.user_lesson_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_vocabulary_progress_updated_at BEFORE UPDATE ON public.user_vocabulary_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON public.study_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
