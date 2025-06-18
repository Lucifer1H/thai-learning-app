-- Sample lessons data
INSERT INTO public.lessons (title, title_chinese, description, description_chinese, lesson_type, difficulty_level, order_index, content, estimated_duration, is_published) VALUES
-- Alphabet lessons
('Thai Consonants - Part 1', '泰语辅音 - 第一部分', 'Learn the first 11 Thai consonants', '学习前11个泰语辅音', 'alphabet', 'beginner', 1, 
'{"consonants": [
  {"letter": "ก", "name": "ก ไก่", "sound": "g", "meaning": "chicken", "chinese": "鸡"},
  {"letter": "ข", "name": "ข ไข่", "sound": "kh", "meaning": "egg", "chinese": "蛋"},
  {"letter": "ค", "name": "ค ควาย", "sound": "kh", "meaning": "buffalo", "chinese": "水牛"},
  {"letter": "ง", "name": "ง งู", "sound": "ng", "meaning": "snake", "chinese": "蛇"},
  {"letter": "จ", "name": "จ จาน", "sound": "j", "meaning": "plate", "chinese": "盘子"},
  {"letter": "ฉ", "name": "ฉ ฉิ่ง", "sound": "ch", "meaning": "cymbal", "chinese": "钹"},
  {"letter": "ช", "name": "ช ช้าง", "sound": "ch", "meaning": "elephant", "chinese": "大象"},
  {"letter": "ซ", "name": "ซ โซ่", "sound": "s", "meaning": "chain", "chinese": "链条"},
  {"letter": "ญ", "name": "ญ หญิง", "sound": "y", "meaning": "woman", "chinese": "女人"},
  {"letter": "ด", "name": "ด เด็ก", "sound": "d", "meaning": "child", "chinese": "孩子"},
  {"letter": "ต", "name": "ต เต่า", "sound": "t", "meaning": "turtle", "chinese": "乌龟"}
]}', 20, true),

('Thai Vowels - Basic', '泰语元音 - 基础', 'Learn basic Thai vowels', '学习基础泰语元音', 'alphabet', 'beginner', 2,
'{"vowels": [
  {"symbol": "อะ", "sound": "a", "example": "กะ", "chinese": "短a音"},
  {"symbol": "อา", "sound": "aa", "example": "กา", "chinese": "长a音"},
  {"symbol": "อิ", "sound": "i", "example": "กิ", "chinese": "短i音"},
  {"symbol": "อี", "sound": "ii", "example": "กี", "chinese": "长i音"},
  {"symbol": "อุ", "sound": "u", "example": "กุ", "chinese": "短u音"},
  {"symbol": "อู", "sound": "uu", "example": "กู", "chinese": "长u音"},
  {"symbol": "เอะ", "sound": "e", "example": "เกะ", "chinese": "短e音"},
  {"symbol": "เอ", "sound": "ee", "example": "เก", "chinese": "长e音"},
  {"symbol": "โอะ", "sound": "o", "example": "โกะ", "chinese": "短o音"},
  {"symbol": "โอ", "sound": "oo", "example": "โก", "chinese": "长o音"}
]}', 25, true),

-- Pronunciation lessons
('Thai Tones Introduction', '泰语声调入门', 'Understanding the 5 Thai tones', '理解泰语的5个声调', 'pronunciation', 'beginner', 3,
'{"tones": [
  {"name": "สามัญ", "chinese": "中平调", "symbol": "◌", "description": "Middle tone, neutral", "example": "กา"},
  {"name": "เอก", "chinese": "低降调", "symbol": "◌่", "description": "Low tone, falling", "example": "ก่า"},
  {"name": "โท", "chinese": "高降调", "symbol": "◌้", "description": "Falling tone", "example": "ก้า"},
  {"name": "ตรี", "chinese": "高平调", "symbol": "◌๊", "description": "High tone", "example": "ก๊า"},
  {"name": "จัตวา", "chinese": "升调", "symbol": "◌๋", "description": "Rising tone", "example": "ก๋า"}
]}', 30, true);

-- Sample vocabulary data
INSERT INTO public.vocabulary (thai_word, chinese_translation, pronunciation, category, difficulty_level, usage_example_thai, usage_example_chinese, tags) VALUES
-- Greetings
('สวัสดี', '你好', 'sà-wàt-dii', 'greetings', 'beginner', 'สวัสดีครับ', '你好（男性用）', ARRAY['greeting', 'polite', 'daily']),
('สบายดีไหม', '你好吗', 'sà-baai dii mǎi', 'greetings', 'beginner', 'สบายดีไหมครับ', '你好吗？（男性用）', ARRAY['greeting', 'question', 'daily']),
('ขอบคุณ', '谢谢', 'khɔ̀ɔp khun', 'greetings', 'beginner', 'ขอบคุณมากครับ', '非常感谢（男性用）', ARRAY['gratitude', 'polite', 'daily']),
('ขอโทษ', '对不起', 'khɔ̌ɔ thôot', 'greetings', 'beginner', 'ขอโทษครับ', '对不起（男性用）', ARRAY['apology', 'polite', 'daily']),
('ลาก่อน', '再见', 'laa kɔ̀ɔn', 'greetings', 'beginner', 'ลาก่อนครับ', '再见（男性用）', ARRAY['farewell', 'polite', 'daily']),

-- Numbers
('หนึ่ง', '一', 'nɯ̀ng', 'numbers', 'beginner', 'หนึ่งคน', '一个人', ARRAY['number', 'counting', 'basic']),
('สอง', '二', 'sɔ̌ɔng', 'numbers', 'beginner', 'สองคน', '两个人', ARRAY['number', 'counting', 'basic']),
('สาม', '三', 'sǎam', 'numbers', 'beginner', 'สามคน', '三个人', ARRAY['number', 'counting', 'basic']),
('สี่', '四', 'sìi', 'numbers', 'beginner', 'สี่คน', '四个人', ARRAY['number', 'counting', 'basic']),
('ห้า', '五', 'hâa', 'numbers', 'beginner', 'ห้าคน', '五个人', ARRAY['number', 'counting', 'basic']),

-- Family
('แม่', '妈妈', 'mɛ̂ɛ', 'family', 'beginner', 'แม่ของฉัน', '我的妈妈', ARRAY['family', 'relationship', 'basic']),
('พ่อ', '爸爸', 'phɔ̂ɔ', 'family', 'beginner', 'พ่อของฉัน', '我的爸爸', ARRAY['family', 'relationship', 'basic']),
('ลูก', '孩子', 'lûuk', 'family', 'beginner', 'ลูกชาย', '儿子', ARRAY['family', 'relationship', 'basic']),
('พี่', '哥哥/姐姐', 'phîi', 'family', 'beginner', 'พี่ชาย', '哥哥', ARRAY['family', 'relationship', 'basic']),
('น้อง', '弟弟/妹妹', 'nɔ́ɔng', 'family', 'beginner', 'น้องสาว', '妹妹', ARRAY['family', 'relationship', 'basic']),

-- Food
('ข้าว', '米饭', 'khâao', 'food', 'beginner', 'กินข้าว', '吃饭', ARRAY['food', 'staple', 'daily']),
('น้ำ', '水', 'náam', 'food', 'beginner', 'ดื่มน้ำ', '喝水', ARRAY['drink', 'basic', 'daily']),
('อาหาร', '食物', 'aa-hǎan', 'food', 'beginner', 'อาหารไทย', '泰国菜', ARRAY['food', 'general', 'daily']),
('ผลไม้', '水果', 'phǒn-lá-máai', 'food', 'beginner', 'กินผลไม้', '吃水果', ARRAY['food', 'fruit', 'healthy']),
('เนื้อ', '肉', 'nɯ́a', 'food', 'beginner', 'เนื้อหมู', '猪肉', ARRAY['food', 'meat', 'protein']);

-- Sample achievements
INSERT INTO public.achievements (name, name_chinese, description, description_chinese, icon, criteria, reward_points) VALUES
('First Steps', '第一步', 'Complete your first lesson', '完成第一课', 'trophy', '{"lessons_completed": 1}', 10),
('Alphabet Master', '字母大师', 'Complete all alphabet lessons', '完成所有字母课程', 'book', '{"alphabet_lessons_completed": 10}', 50),
('Week Warrior', '一周勇士', 'Study for 7 consecutive days', '连续学习7天', 'calendar', '{"consecutive_days": 7}', 30),
('Vocabulary Builder', '词汇建造者', 'Learn 50 new words', '学习50个新单词', 'word', '{"vocabulary_learned": 50}', 40),
('Pronunciation Pro', '发音专家', 'Complete all pronunciation lessons', '完成所有发音课程', 'microphone', '{"pronunciation_lessons_completed": 5}', 60);

-- Sample audio files metadata (these would be actual audio files in production)
INSERT INTO public.audio_files (filename, original_name, file_path, duration, related_vocabulary_id, speaker_gender, speaker_region) 
SELECT 
    'audio_' || v.id || '.mp3',
    v.thai_word || '_pronunciation.mp3',
    '/audio/vocabulary/' || v.id || '.mp3',
    2.5,
    v.id,
    'female',
    'bangkok'
FROM public.vocabulary v
WHERE v.category IN ('greetings', 'numbers')
LIMIT 10;

-- Update vocabulary with audio URLs
UPDATE public.vocabulary 
SET audio_url = '/audio/vocabulary/' || id || '.mp3'
WHERE category IN ('greetings', 'numbers', 'family', 'food');

-- Sample lesson audio URLs
UPDATE public.lessons 
SET audio_urls = ARRAY['/audio/lessons/' || id || '_intro.mp3', '/audio/lessons/' || id || '_practice.mp3']
WHERE lesson_type IN ('alphabet', 'pronunciation');
