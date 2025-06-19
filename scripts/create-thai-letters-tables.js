const { createClient } = require('@supabase/supabase-js');

// 从环境变量读取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqkzozmcgrlvcvfpyicy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3pvem1jZ3JsdmN2ZnB5aWN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI0NjA5MywiZXhwIjoyMDY1ODIyMDkzfQ.7JMu9Ihnl64dbT1t7ZcUyFcLYcJLwS-rRCAMiuC-j0w';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createThaiLettersTables() {
  try {
    console.log('开始创建泰语字母表结构...');
    
    // 创建枚举类型
    console.log('创建枚举类型...');
    
    const enumQueries = [
      `CREATE TYPE IF NOT EXISTS tone_class AS ENUM ('high', 'mid', 'low');`,
      `CREATE TYPE IF NOT EXISTS vowel_position AS ENUM ('before', 'after', 'above', 'below', 'around');`,
      `CREATE TYPE IF NOT EXISTS vowel_length AS ENUM ('short', 'long');`
    ];
    
    // 跳过枚举类型创建，直接使用TEXT类型
    
    // 创建辅音表
    console.log('创建辅音表...');
    const consonantTableQuery = `
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
    `;
    
    const { error: consonantError } = await supabase.from('thai_consonants').select('id').limit(1);
    if (consonantError) {
      console.error('创建辅音表时出错:', consonantError);
    } else {
      console.log('辅音表创建成功');
    }
    
    // 创建元音表
    console.log('创建元音表...');
    const vowelTableQuery = `
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
    `;
    
    const { error: vowelError } = await supabase.rpc('exec_sql', { sql: vowelTableQuery });
    if (vowelError) {
      console.error('创建元音表时出错:', vowelError);
    } else {
      console.log('元音表创建成功');
    }
    
    // 创建用户进度表
    console.log('创建用户进度表...');
    const progressTableQuery = `
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
    `;
    
    const { error: progressError } = await supabase.rpc('exec_sql', { sql: progressTableQuery });
    if (progressError) {
      console.error('创建用户进度表时出错:', progressError);
    } else {
      console.log('用户进度表创建成功');
    }
    
    // 创建索引
    console.log('创建索引...');
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_thai_consonants_order ON public.thai_consonants(order_index);`,
      `CREATE INDEX IF NOT EXISTS idx_thai_vowels_order ON public.thai_vowels(order_index);`,
      `CREATE INDEX IF NOT EXISTS idx_user_letter_progress_user ON public.user_letter_progress(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_user_letter_progress_type ON public.user_letter_progress(letter_type);`
    ];
    
    for (const query of indexQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error('创建索引时出错:', error);
      }
    }
    
    // 启用RLS
    console.log('启用行级安全策略...');
    const rlsQueries = [
      `ALTER TABLE public.thai_consonants ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE public.thai_vowels ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE public.user_letter_progress ENABLE ROW LEVEL SECURITY;`
    ];
    
    for (const query of rlsQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error('启用RLS时出错:', error);
      }
    }
    
    // 创建策略
    console.log('创建安全策略...');
    const policyQueries = [
      `CREATE POLICY IF NOT EXISTS "Thai consonants are viewable by everyone" ON public.thai_consonants FOR SELECT USING (true);`,
      `CREATE POLICY IF NOT EXISTS "Thai vowels are viewable by everyone" ON public.thai_vowels FOR SELECT USING (true);`,
      `CREATE POLICY IF NOT EXISTS "Users can view own letter progress" ON public.user_letter_progress FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can insert own letter progress" ON public.user_letter_progress FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can update own letter progress" ON public.user_letter_progress FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can delete own letter progress" ON public.user_letter_progress FOR DELETE USING (auth.uid() = user_id);`
    ];
    
    for (const query of policyQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error('创建策略时出错:', error);
      }
    }
    
    console.log('泰语字母表结构创建完成！');
    
  } catch (error) {
    console.error('创建表结构时发生错误:', error);
  }
}

// 运行创建
createThaiLettersTables();
