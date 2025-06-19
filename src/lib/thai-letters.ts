// 泰语字母数据库操作
import { createSupabaseClient } from './supabase';

export interface ThaiConsonant {
  id: string;
  letter: string;
  name: string;
  meaning: string;
  chinese_meaning: string;
  pronunciation: string;
  sound: string;
  tone_class: 'high' | 'mid' | 'low';
  initial_sound?: string;
  final_sound?: string;
  strokes?: string[];
  stroke_count?: number;
  order_index: number;
  difficulty_level: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  audio_url?: string;
  is_obsolete: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ThaiVowel {
  id: string;
  symbol: string;
  name: string;
  sound: string;
  length: 'short' | 'long';
  position: 'before' | 'after' | 'above' | 'below' | 'around';
  example_word?: string;
  example_meaning?: string;
  chinese_meaning: string;
  pronunciation?: string;
  strokes?: string[];
  order_index: number;
  difficulty_level: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  audio_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserLetterProgress {
  id: string;
  user_id: string;
  letter_type: 'consonant' | 'vowel';
  letter_id: string;
  is_learned: boolean;
  practice_count: number;
  last_practiced_at?: string;
  mastery_level: number;
  created_at: string;
  updated_at: string;
}

// 获取所有辅音字母
export async function getThaiConsonants(): Promise<ThaiConsonant[]> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('thai_consonants')
    .select('*')
    .order('order_index');
  
  if (error) {
    console.error('获取辅音字母时出错:', error);
    throw error;
  }
  
  return data || [];
}

// 获取所有元音
export async function getThaiVowels(): Promise<ThaiVowel[]> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('thai_vowels')
    .select('*')
    .order('order_index');
  
  if (error) {
    console.error('获取元音时出错:', error);
    throw error;
  }
  
  return data || [];
}

// 获取用户字母学习进度
export async function getUserLetterProgress(userId: string): Promise<UserLetterProgress[]> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_letter_progress')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('获取用户字母进度时出错:', error);
    throw error;
  }
  
  return data || [];
}

// 更新用户字母学习进度
export async function updateUserLetterProgress(
  userId: string,
  letterType: 'consonant' | 'vowel',
  letterId: string,
  updates: Partial<Omit<UserLetterProgress, 'id' | 'user_id' | 'letter_type' | 'letter_id' | 'created_at' | 'updated_at'>>
): Promise<UserLetterProgress> {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_letter_progress')
    .upsert({
      user_id: userId,
      letter_type: letterType,
      letter_id: letterId,
      ...updates,
      last_practiced_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('更新用户字母进度时出错:', error);
    throw error;
  }
  
  return data;
}

// 标记字母为已学会
export async function markLetterAsLearned(
  userId: string,
  letterType: 'consonant' | 'vowel',
  letterId: string
): Promise<void> {
  await updateUserLetterProgress(userId, letterType, letterId, {
    is_learned: true,
    mastery_level: Math.min(100, 80), // 标记为已学会时设置为80%掌握度
    practice_count: 1
  });
}

// 增加练习次数
export async function incrementPracticeCount(
  userId: string,
  letterType: 'consonant' | 'vowel',
  letterId: string
): Promise<void> {
  const currentProgress = await getUserLetterProgress(userId);
  const existing = currentProgress.find(p => 
    p.letter_type === letterType && p.letter_id === letterId
  );
  
  const newPracticeCount = (existing?.practice_count || 0) + 1;
  const newMasteryLevel = Math.min(100, (existing?.mastery_level || 0) + 5);
  
  await updateUserLetterProgress(userId, letterType, letterId, {
    practice_count: newPracticeCount,
    mastery_level: newMasteryLevel
  });
}

// 获取学习统计
export async function getLetterLearningStats(userId: string) {
  const [consonants, vowels, progress] = await Promise.all([
    getThaiConsonants(),
    getThaiVowels(),
    getUserLetterProgress(userId)
  ]);
  
  const consonantProgress = progress.filter(p => p.letter_type === 'consonant');
  const vowelProgress = progress.filter(p => p.letter_type === 'vowel');
  
  return {
    consonants: {
      total: consonants.length,
      learned: consonantProgress.filter(p => p.is_learned).length,
      practiced: consonantProgress.length,
      averageMastery: consonantProgress.length > 0 
        ? consonantProgress.reduce((sum, p) => sum + p.mastery_level, 0) / consonantProgress.length 
        : 0
    },
    vowels: {
      total: vowels.length,
      learned: vowelProgress.filter(p => p.is_learned).length,
      practiced: vowelProgress.length,
      averageMastery: vowelProgress.length > 0 
        ? vowelProgress.reduce((sum, p) => sum + p.mastery_level, 0) / vowelProgress.length 
        : 0
    }
  };
}
