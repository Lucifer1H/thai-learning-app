const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从环境变量读取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqkzozmcgrlvcvfpyicy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3pvem1jZ3JsdmN2ZnB5aWN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI0NjA5MywiZXhwIjoyMDY1ODIyMDkzfQ.7JMu9Ihnl64dbT1t7ZcUyFcLYcJLwS-rRCAMiuC-j0w';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 扩展词汇数据
const extendedVocabulary = [
  // Greetings and Politeness (20 words)
  { thai_word: 'สวัสดี', chinese_translation: '你好', pronunciation: 'sà-wàt-dii', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'สวัสดีครับ', usage_example_chinese: '你好（男性用）', tags: ['greeting', 'polite', 'daily'] },
  { thai_word: 'สบายดีไหม', chinese_translation: '你好吗', pronunciation: 'sà-baai dii mǎi', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'สบายดีไหมครับ', usage_example_chinese: '你好吗？（男性用）', tags: ['greeting', 'question', 'daily'] },
  { thai_word: 'ขอบคุณ', chinese_translation: '谢谢', pronunciation: 'khɔ̀ɔp khun', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'ขอบคุณมากครับ', usage_example_chinese: '非常感谢（男性用）', tags: ['gratitude', 'polite', 'daily'] },
  { thai_word: 'ขอโทษ', chinese_translation: '对不起', pronunciation: 'khɔ̌ɔ thôot', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'ขอโทษครับ', usage_example_chinese: '对不起（男性用）', tags: ['apology', 'polite', 'daily'] },
  { thai_word: 'ลาก่อน', chinese_translation: '再见', pronunciation: 'laa kɔ̀ɔn', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'ลาก่อนครับ', usage_example_chinese: '再见（男性用）', tags: ['farewell', 'polite', 'daily'] },
  { thai_word: 'ยินดีที่ได้รู้จัก', chinese_translation: '很高兴认识你', pronunciation: 'yin-dii thîi dâi rúu-jàk', category: 'greetings', difficulty_level: 'intermediate', usage_example_thai: 'ยินดีที่ได้รู้จักครับ', usage_example_chinese: '很高兴认识你（男性用）', tags: ['greeting', 'introduction', 'polite'] },
  { thai_word: 'ไม่เป็นไร', chinese_translation: '没关系', pronunciation: 'mâi pen rai', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'ไม่เป็นไรครับ', usage_example_chinese: '没关系（男性用）', tags: ['response', 'polite', 'daily'] },
  { thai_word: 'ขอโทษนะ', chinese_translation: '不好意思', pronunciation: 'khɔ̌ɔ thôot ná', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'ขอโทษนะครับ', usage_example_chinese: '不好意思（男性用）', tags: ['apology', 'mild', 'daily'] },
  { thai_word: 'ยินดีด้วย', chinese_translation: '恭喜', pronunciation: 'yin-dii dûai', category: 'greetings', difficulty_level: 'intermediate', usage_example_thai: 'ยินดีด้วยครับ', usage_example_chinese: '恭喜（男性用）', tags: ['congratulation', 'celebration', 'polite'] },
  { thai_word: 'โชคดี', chinese_translation: '祝你好运', pronunciation: 'chôok dii', category: 'greetings', difficulty_level: 'beginner', usage_example_thai: 'โชคดีนะ', usage_example_chinese: '祝你好运', tags: ['blessing', 'encouragement', 'daily'] },

  // Numbers 1-20 and basic counting (25 words)
  { thai_word: 'หนึ่ง', chinese_translation: '一', pronunciation: 'nɯ̀ng', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'หนึ่งคน', usage_example_chinese: '一个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'สอง', chinese_translation: '二', pronunciation: 'sɔ̌ɔng', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'สองคน', usage_example_chinese: '两个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'สาม', chinese_translation: '三', pronunciation: 'sǎam', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'สามคน', usage_example_chinese: '三个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'สี่', chinese_translation: '四', pronunciation: 'sìi', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'สี่คน', usage_example_chinese: '四个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'ห้า', chinese_translation: '五', pronunciation: 'hâa', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'ห้าคน', usage_example_chinese: '五个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'หก', chinese_translation: '六', pronunciation: 'hòk', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'หกคน', usage_example_chinese: '六个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'เจ็ด', chinese_translation: '七', pronunciation: 'jèt', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'เจ็ดคน', usage_example_chinese: '七个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'แปด', chinese_translation: '八', pronunciation: 'pàet', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'แปดคน', usage_example_chinese: '八个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'เก้า', chinese_translation: '九', pronunciation: 'gâo', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'เก้าคน', usage_example_chinese: '九个人', tags: ['number', 'counting', 'basic'] },
  { thai_word: 'สิบ', chinese_translation: '十', pronunciation: 'sìp', category: 'numbers', difficulty_level: 'beginner', usage_example_thai: 'สิบคน', usage_example_chinese: '十个人', tags: ['number', 'counting', 'basic'] },

  // Family and Relationships (20 words)
  { thai_word: 'แม่', chinese_translation: '妈妈', pronunciation: 'mɛ̂ɛ', category: 'family', difficulty_level: 'beginner', usage_example_thai: 'แม่ของฉัน', usage_example_chinese: '我的妈妈', tags: ['family', 'relationship', 'basic'] },
  { thai_word: 'พ่อ', chinese_translation: '爸爸', pronunciation: 'phɔ̂ɔ', category: 'family', difficulty_level: 'beginner', usage_example_thai: 'พ่อของฉัน', usage_example_chinese: '我的爸爸', tags: ['family', 'relationship', 'basic'] },
  { thai_word: 'ลูก', chinese_translation: '孩子', pronunciation: 'lûuk', category: 'family', difficulty_level: 'beginner', usage_example_thai: 'ลูกชาย', usage_example_chinese: '儿子', tags: ['family', 'relationship', 'basic'] },
  { thai_word: 'พี่', chinese_translation: '哥哥/姐姐', pronunciation: 'phîi', category: 'family', difficulty_level: 'beginner', usage_example_thai: 'พี่ชาย', usage_example_chinese: '哥哥', tags: ['family', 'relationship', 'basic'] },
  { thai_word: 'น้อง', chinese_translation: '弟弟/妹妹', pronunciation: 'nɔ́ɔng', category: 'family', difficulty_level: 'beginner', usage_example_thai: 'น้องสาว', usage_example_chinese: '妹妹', tags: ['family', 'relationship', 'basic'] },

  // Food and Drinks (25 words)
  { thai_word: 'ข้าว', chinese_translation: '米饭', pronunciation: 'khâao', category: 'food', difficulty_level: 'beginner', usage_example_thai: 'กินข้าว', usage_example_chinese: '吃饭', tags: ['food', 'staple', 'daily'] },
  { thai_word: 'น้ำ', chinese_translation: '水', pronunciation: 'náam', category: 'food', difficulty_level: 'beginner', usage_example_thai: 'ดื่มน้ำ', usage_example_chinese: '喝水', tags: ['drink', 'basic', 'daily'] },
  { thai_word: 'อาหาร', chinese_translation: '食物', pronunciation: 'aa-hǎan', category: 'food', difficulty_level: 'beginner', usage_example_thai: 'อาหารไทย', usage_example_chinese: '泰国菜', tags: ['food', 'general', 'daily'] },
  { thai_word: 'ผลไม้', chinese_translation: '水果', pronunciation: 'phǒn-lá-máai', category: 'food', difficulty_level: 'beginner', usage_example_thai: 'กินผลไม้', usage_example_chinese: '吃水果', tags: ['food', 'fruit', 'healthy'] },
  { thai_word: 'เนื้อ', chinese_translation: '肉', pronunciation: 'nɯ́a', category: 'food', difficulty_level: 'beginner', usage_example_thai: 'เนื้อหมู', usage_example_chinese: '猪肉', tags: ['food', 'meat', 'protein'] },

  // Colors (15 words)
  { thai_word: 'สี', chinese_translation: '颜色', pronunciation: 'sǐi', category: 'colors', difficulty_level: 'beginner', usage_example_thai: 'สีแดง', usage_example_chinese: '红色', tags: ['color', 'basic', 'visual'] },
  { thai_word: 'แดง', chinese_translation: '红色', pronunciation: 'dɛɛng', category: 'colors', difficulty_level: 'beginner', usage_example_thai: 'สีแดง', usage_example_chinese: '红色', tags: ['color', 'primary', 'basic'] },
  { thai_word: 'เขียว', chinese_translation: '绿色', pronunciation: 'khǐao', category: 'colors', difficulty_level: 'beginner', usage_example_thai: 'สีเขียว', usage_example_chinese: '绿色', tags: ['color', 'primary', 'basic'] },
  { thai_word: 'น้ำเงิน', chinese_translation: '蓝色', pronunciation: 'náam ngəən', category: 'colors', difficulty_level: 'beginner', usage_example_thai: 'สีน้ำเงิน', usage_example_chinese: '蓝色', tags: ['color', 'primary', 'basic'] },
  { thai_word: 'เหลือง', chinese_translation: '黄色', pronunciation: 'lɯ̌ang', category: 'colors', difficulty_level: 'beginner', usage_example_thai: 'สีเหลือง', usage_example_chinese: '黄色', tags: ['color', 'primary', 'basic'] },

  // Body Parts (20 words)
  { thai_word: 'หัว', chinese_translation: '头', pronunciation: 'hǔa', category: 'body', difficulty_level: 'beginner', usage_example_thai: 'หัวของฉัน', usage_example_chinese: '我的头', tags: ['body', 'head', 'basic'] },
  { thai_word: 'หน้า', chinese_translation: '脸', pronunciation: 'nâa', category: 'body', difficulty_level: 'beginner', usage_example_thai: 'หน้าสวย', usage_example_chinese: '漂亮的脸', tags: ['body', 'face', 'basic'] },
  { thai_word: 'ตา', chinese_translation: '眼睛', pronunciation: 'taa', category: 'body', difficulty_level: 'beginner', usage_example_thai: 'ตาสวย', usage_example_chinese: '漂亮的眼睛', tags: ['body', 'face', 'sense'] },
  { thai_word: 'หู', chinese_translation: '耳朵', pronunciation: 'hǔu', category: 'body', difficulty_level: 'beginner', usage_example_thai: 'หูของฉัน', usage_example_chinese: '我的耳朵', tags: ['body', 'head', 'sense'] },
  { thai_word: 'จมูก', chinese_translation: '鼻子', pronunciation: 'ja-mùuk', category: 'body', difficulty_level: 'beginner', usage_example_thai: 'จมูกของฉัน', usage_example_chinese: '我的鼻子', tags: ['body', 'face', 'sense'] },

  // Time and Days (20 words)
  { thai_word: 'เวลา', chinese_translation: '时间', pronunciation: 'wee-laa', category: 'time', difficulty_level: 'beginner', usage_example_thai: 'เวลาเท่าไหร่', usage_example_chinese: '几点了', tags: ['time', 'general', 'basic'] },
  { thai_word: 'วัน', chinese_translation: '天', pronunciation: 'wan', category: 'time', difficulty_level: 'beginner', usage_example_thai: 'วันนี้', usage_example_chinese: '今天', tags: ['time', 'day', 'basic'] },
  { thai_word: 'วันนี้', chinese_translation: '今天', pronunciation: 'wan níi', category: 'time', difficulty_level: 'beginner', usage_example_thai: 'วันนี้อากาศดี', usage_example_chinese: '今天天气好', tags: ['time', 'today', 'present'] },
  { thai_word: 'เมื่อวาน', chinese_translation: '昨天', pronunciation: 'mɯ̂a waan', category: 'time', difficulty_level: 'beginner', usage_example_thai: 'เมื่อวานฝนตก', usage_example_chinese: '昨天下雨', tags: ['time', 'yesterday', 'past'] },
  { thai_word: 'พรุ่งนี้', chinese_translation: '明天', pronunciation: 'phrûng níi', category: 'time', difficulty_level: 'beginner', usage_example_thai: 'พรุ่งนี้ไปทำงาน', usage_example_chinese: '明天去工作', tags: ['time', 'tomorrow', 'future'] },

  // Weather (15 words)
  { thai_word: 'อากาศ', chinese_translation: '天气', pronunciation: 'aa-gàat', category: 'weather', difficulty_level: 'beginner', usage_example_thai: 'อากาศดี', usage_example_chinese: '天气好', tags: ['weather', 'general', 'climate'] },
  { thai_word: 'ฝน', chinese_translation: '雨', pronunciation: 'fǒn', category: 'weather', difficulty_level: 'beginner', usage_example_thai: 'ฝนตก', usage_example_chinese: '下雨', tags: ['weather', 'precipitation', 'wet'] },
  { thai_word: 'แดด', chinese_translation: '太阳', pronunciation: 'dàet', category: 'weather', difficulty_level: 'beginner', usage_example_thai: 'แดดแรง', usage_example_chinese: '太阳很强', tags: ['weather', 'sun', 'hot'] },
  { thai_word: 'ลม', chinese_translation: '风', pronunciation: 'lom', category: 'weather', difficulty_level: 'beginner', usage_example_thai: 'ลมแรง', usage_example_chinese: '风很大', tags: ['weather', 'wind', 'air'] },
  { thai_word: 'เมฆ', chinese_translation: '云', pronunciation: 'mêek', category: 'weather', difficulty_level: 'beginner', usage_example_thai: 'เมฆมาก', usage_example_chinese: '云很多', tags: ['weather', 'cloud', 'sky'] },

  // Animals (20 words)
  { thai_word: 'สุนัข', chinese_translation: '狗', pronunciation: 'sù-nák', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'สุนัขน่ารัก', usage_example_chinese: '狗很可爱', tags: ['animal', 'pet', 'domestic'] },
  { thai_word: 'แมว', chinese_translation: '猫', pronunciation: 'mɛɛo', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'แมวเหมียว', usage_example_chinese: '猫叫', tags: ['animal', 'pet', 'domestic'] },
  { thai_word: 'ช้าง', chinese_translation: '大象', pronunciation: 'cháang', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'ช้างใหญ่', usage_example_chinese: '大象很大', tags: ['animal', 'wild', 'large'] },
  { thai_word: 'เสือ', chinese_translation: '老虎', pronunciation: 'sɯ̌a', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'เสือดุ', usage_example_chinese: '老虎很凶', tags: ['animal', 'wild', 'predator'] },
  { thai_word: 'ลิง', chinese_translation: '猴子', pronunciation: 'ling', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'ลิงซน', usage_example_chinese: '猴子很调皮', tags: ['animal', 'wild', 'playful'] },
  { thai_word: 'นก', chinese_translation: '鸟', pronunciation: 'nók', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'นกบิน', usage_example_chinese: '鸟飞', tags: ['animal', 'bird', 'flying'] },
  { thai_word: 'ปลา', chinese_translation: '鱼', pronunciation: 'plaa', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'ปลาว่าย', usage_example_chinese: '鱼游泳', tags: ['animal', 'fish', 'water'] },
  { thai_word: 'งู', chinese_translation: '蛇', pronunciation: 'nguu', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'งูยาว', usage_example_chinese: '蛇很长', tags: ['animal', 'reptile', 'dangerous'] },
  { thai_word: 'หมู', chinese_translation: '猪', pronunciation: 'mǔu', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'หมูอ้วน', usage_example_chinese: '猪很胖', tags: ['animal', 'farm', 'domestic'] },
  { thai_word: 'วัว', chinese_translation: '牛', pronunciation: 'wua', category: 'animals', difficulty_level: 'beginner', usage_example_thai: 'วัวใหญ่', usage_example_chinese: '牛很大', tags: ['animal', 'farm', 'domestic'] },

  // Transportation (15 words)
  { thai_word: 'รถ', chinese_translation: '车', pronunciation: 'rót', category: 'transportation', difficulty_level: 'beginner', usage_example_thai: 'รถเร็ว', usage_example_chinese: '车很快', tags: ['transport', 'vehicle', 'common'] },
  { thai_word: 'รถยนต์', chinese_translation: '汽车', pronunciation: 'rót yon', category: 'transportation', difficulty_level: 'beginner', usage_example_thai: 'รถยนต์สีแดง', usage_example_chinese: '红色汽车', tags: ['transport', 'car', 'modern'] },
  { thai_word: 'รถไฟ', chinese_translation: '火车', pronunciation: 'rót fai', category: 'transportation', difficulty_level: 'beginner', usage_example_thai: 'รถไฟเร็ว', usage_example_chinese: '火车很快', tags: ['transport', 'train', 'public'] },
  { thai_word: 'เครื่องบิน', chinese_translation: '飞机', pronunciation: 'khrɯ̂ang bin', category: 'transportation', difficulty_level: 'intermediate', usage_example_thai: 'เครื่องบินบิน', usage_example_chinese: '飞机飞行', tags: ['transport', 'airplane', 'fast'] },
  { thai_word: 'เรือ', chinese_translation: '船', pronunciation: 'rɯa', category: 'transportation', difficulty_level: 'beginner', usage_example_thai: 'เรือใหญ่', usage_example_chinese: '大船', tags: ['transport', 'boat', 'water'] },
  { thai_word: 'รถบัส', chinese_translation: '公交车', pronunciation: 'rót bát', category: 'transportation', difficulty_level: 'beginner', usage_example_thai: 'รถบัสสีเหลือง', usage_example_chinese: '黄色公交车', tags: ['transport', 'bus', 'public'] },
  { thai_word: 'รถแท็กซี่', chinese_translation: '出租车', pronunciation: 'rót thɛ́k-sîi', category: 'transportation', difficulty_level: 'beginner', usage_example_thai: 'รถแท็กซี่สีเหลือง', usage_example_chinese: '黄色出租车', tags: ['transport', 'taxi', 'service'] },
  { thai_word: 'จักรยาน', chinese_translation: '自行车', pronunciation: 'jàk-gra-yaan', category: 'transportation', difficulty_level: 'intermediate', usage_example_thai: 'จักรยานสีน้ำเงิน', usage_example_chinese: '蓝色自行车', tags: ['transport', 'bicycle', 'exercise'] },
  { thai_word: 'มอเตอร์ไซค์', chinese_translation: '摩托车', pronunciation: 'mɔɔ-təə-sai', category: 'transportation', difficulty_level: 'intermediate', usage_example_thai: 'มอเตอร์ไซค์เร็ว', usage_example_chinese: '摩托车很快', tags: ['transport', 'motorcycle', 'common'] },
  { thai_word: 'รถตุ๊กตุ๊ก', chinese_translation: '嘟嘟车', pronunciation: 'rót túk túk', category: 'transportation', difficulty_level: 'intermediate', usage_example_thai: 'รถตุ๊กตุ๊กไทย', usage_example_chinese: '泰式嘟嘟车', tags: ['transport', 'tuktuk', 'thai'] },

  // Places (20 words)
  { thai_word: 'บ้าน', chinese_translation: '家', pronunciation: 'bâan', category: 'places', difficulty_level: 'beginner', usage_example_thai: 'บ้านใหญ่', usage_example_chinese: '大房子', tags: ['place', 'home', 'basic'] },
  { thai_word: 'โรงเรียน', chinese_translation: '学校', pronunciation: 'roong rian', category: 'places', difficulty_level: 'beginner', usage_example_thai: 'โรงเรียนใหญ่', usage_example_chinese: '大学校', tags: ['place', 'education', 'building'] },
  { thai_word: 'โรงพยาบาล', chinese_translation: '医院', pronunciation: 'roong pha-yaa-baan', category: 'places', difficulty_level: 'intermediate', usage_example_thai: 'โรงพยาบาลใหม่', usage_example_chinese: '新医院', tags: ['place', 'medical', 'building'] },
  { thai_word: 'ตลาด', chinese_translation: '市场', pronunciation: 'ta-làat', category: 'places', difficulty_level: 'beginner', usage_example_thai: 'ตลาดใหญ่', usage_example_chinese: '大市场', tags: ['place', 'shopping', 'food'] },
  { thai_word: 'ร้านอาหาร', chinese_translation: '餐厅', pronunciation: 'ráan aa-hǎan', category: 'places', difficulty_level: 'intermediate', usage_example_thai: 'ร้านอาหารอร่อย', usage_example_chinese: '好吃的餐厅', tags: ['place', 'restaurant', 'food'] },
  { thai_word: 'ธนาคาร', chinese_translation: '银行', pronunciation: 'tha-naa-khaan', category: 'places', difficulty_level: 'intermediate', usage_example_thai: 'ธนาคารใหญ่', usage_example_chinese: '大银行', tags: ['place', 'finance', 'service'] },
  { thai_word: 'สนามบิน', chinese_translation: '机场', pronunciation: 'sa-nǎam bin', category: 'places', difficulty_level: 'intermediate', usage_example_thai: 'สนามบินใหญ่', usage_example_chinese: '大机场', tags: ['place', 'airport', 'travel'] },
  { thai_word: 'สวนสาธารณะ', chinese_translation: '公园', pronunciation: 'sǔan sǎa-thaa-ra-ná', category: 'places', difficulty_level: 'advanced', usage_example_thai: 'สวนสาธารณะสวย', usage_example_chinese: '美丽的公园', tags: ['place', 'park', 'nature'] },
  { thai_word: 'ห้างสรรพสินค้า', chinese_translation: '购物中心', pronunciation: 'hâang sàp-phá-sǐn-kháa', category: 'places', difficulty_level: 'advanced', usage_example_thai: 'ห้างสรรพสินค้าใหญ่', usage_example_chinese: '大购物中心', tags: ['place', 'mall', 'shopping'] },
  { thai_word: 'ชายหาด', chinese_translation: '海滩', pronunciation: 'chaai hàat', category: 'places', difficulty_level: 'intermediate', usage_example_thai: 'ชายหาดสวย', usage_example_chinese: '美丽的海滩', tags: ['place', 'beach', 'nature'] },

  // Clothing (15 words)
  { thai_word: 'เสื้อ', chinese_translation: '衣服', pronunciation: 'sɯ̂a', category: 'clothing', difficulty_level: 'beginner', usage_example_thai: 'เสื้อสีแดง', usage_example_chinese: '红色衣服', tags: ['clothing', 'shirt', 'basic'] },
  { thai_word: 'กางเกง', chinese_translation: '裤子', pronunciation: 'gaang geeng', category: 'clothing', difficulty_level: 'beginner', usage_example_thai: 'กางเกงยีนส์', usage_example_chinese: '牛仔裤', tags: ['clothing', 'pants', 'basic'] },
  { thai_word: 'รองเท้า', chinese_translation: '鞋子', pronunciation: 'rɔɔng tháo', category: 'clothing', difficulty_level: 'beginner', usage_example_thai: 'รองเท้าสีดำ', usage_example_chinese: '黑色鞋子', tags: ['clothing', 'shoes', 'basic'] },
  { thai_word: 'หมวก', chinese_translation: '帽子', pronunciation: 'mùak', category: 'clothing', difficulty_level: 'beginner', usage_example_thai: 'หมวกสีน้ำเงิน', usage_example_chinese: '蓝色帽子', tags: ['clothing', 'hat', 'accessory'] },
  { thai_word: 'กระเป๋า', chinese_translation: '包', pronunciation: 'gra-pǎo', category: 'clothing', difficulty_level: 'beginner', usage_example_thai: 'กระเป๋าใหญ่', usage_example_chinese: '大包', tags: ['clothing', 'bag', 'accessory'] },
  { thai_word: 'แว่นตา', chinese_translation: '眼镜', pronunciation: 'wàen taa', category: 'clothing', difficulty_level: 'intermediate', usage_example_thai: 'แว่นตาใหม่', usage_example_chinese: '新眼镜', tags: ['clothing', 'glasses', 'accessory'] },
  { thai_word: 'นาฬิกา', chinese_translation: '手表', pronunciation: 'naa-li-gaa', category: 'clothing', difficulty_level: 'intermediate', usage_example_thai: 'นาฬิกาทอง', usage_example_chinese: '金表', tags: ['clothing', 'watch', 'accessory'] },
  { thai_word: 'เข็มขัด', chinese_translation: '腰带', pronunciation: 'khěm khàt', category: 'clothing', difficulty_level: 'intermediate', usage_example_thai: 'เข็มขัดหนัง', usage_example_chinese: '皮腰带', tags: ['clothing', 'belt', 'accessory'] },
  { thai_word: 'ถุงเท้า', chinese_translation: '袜子', pronunciation: 'thǔng tháo', category: 'clothing', difficulty_level: 'beginner', usage_example_thai: 'ถุงเท้าสีขาว', usage_example_chinese: '白色袜子', tags: ['clothing', 'socks', 'basic'] },
  { thai_word: 'ชุดว่ายน้ำ', chinese_translation: '泳衣', pronunciation: 'chút wâai náam', category: 'clothing', difficulty_level: 'intermediate', usage_example_thai: 'ชุดว่ายน้ำสวย', usage_example_chinese: '漂亮的泳衣', tags: ['clothing', 'swimwear', 'sport'] },

  // Emotions and Feelings (20 words)
  { thai_word: 'ดีใจ', chinese_translation: '高兴', pronunciation: 'dii jai', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันดีใจมาก', usage_example_chinese: '我很高兴', tags: ['emotion', 'happy', 'positive'] },
  { thai_word: 'เศร้า', chinese_translation: '伤心', pronunciation: 'sàao', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'เขาเศร้ามาก', usage_example_chinese: '他很伤心', tags: ['emotion', 'sad', 'negative'] },
  { thai_word: 'โกรธ', chinese_translation: '生气', pronunciation: 'gròot', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'อย่าโกรธนะ', usage_example_chinese: '别生气', tags: ['emotion', 'angry', 'negative'] },
  { thai_word: 'กลัว', chinese_translation: '害怕', pronunciation: 'glua', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันกลัวงู', usage_example_chinese: '我怕蛇', tags: ['emotion', 'fear', 'negative'] },
  { thai_word: 'รัก', chinese_translation: '爱', pronunciation: 'rák', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันรักคุณ', usage_example_chinese: '我爱你', tags: ['emotion', 'love', 'positive'] },
  { thai_word: 'เหนื่อย', chinese_translation: '累', pronunciation: 'nɯ̀ai', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันเหนื่อยมาก', usage_example_chinese: '我很累', tags: ['emotion', 'tired', 'physical'] },
  { thai_word: 'หิว', chinese_translation: '饿', pronunciation: 'hǐw', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันหิวข้าว', usage_example_chinese: '我饿了', tags: ['emotion', 'hungry', 'physical'] },
  { thai_word: 'กระหาย', chinese_translation: '渴', pronunciation: 'gra-hǎai', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันกระหายน้ำ', usage_example_chinese: '我渴了', tags: ['emotion', 'thirsty', 'physical'] },
  { thai_word: 'ตื่นเต้น', chinese_translation: '兴奋', pronunciation: 'tɯ̀ɯn tên', category: 'emotions', difficulty_level: 'intermediate', usage_example_thai: 'ฉันตื่นเต้นมาก', usage_example_chinese: '我很兴奋', tags: ['emotion', 'excited', 'positive'] },
  { thai_word: 'เบื่อ', chinese_translation: '无聊', pronunciation: 'bɯ̀a', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันเบื่อมาก', usage_example_chinese: '我很无聊', tags: ['emotion', 'bored', 'negative'] },
  { thai_word: 'ประหลาดใจ', chinese_translation: '惊讶', pronunciation: 'pra-làat jai', category: 'emotions', difficulty_level: 'intermediate', usage_example_thai: 'ฉันประหลาดใจมาก', usage_example_chinese: '我很惊讶', tags: ['emotion', 'surprised', 'reaction'] },
  { thai_word: 'ผิดหวัง', chinese_translation: '失望', pronunciation: 'phìt wǎng', category: 'emotions', difficulty_level: 'intermediate', usage_example_thai: 'เขาผิดหวัง', usage_example_chinese: '他失望了', tags: ['emotion', 'disappointed', 'negative'] },
  { thai_word: 'ภูมิใจ', chinese_translation: '骄傲', pronunciation: 'phuu-mii jai', category: 'emotions', difficulty_level: 'intermediate', usage_example_thai: 'ฉันภูมิใจในตัวเอง', usage_example_chinese: '我为自己骄傲', tags: ['emotion', 'proud', 'positive'] },
  { thai_word: 'อิจฉา', chinese_translation: '嫉妒', pronunciation: 'ìt-chaa', category: 'emotions', difficulty_level: 'intermediate', usage_example_thai: 'อย่าอิจฉาเขา', usage_example_chinese: '别嫉妒他', tags: ['emotion', 'jealous', 'negative'] },
  { thai_word: 'เครียด', chinese_translation: '压力大', pronunciation: 'khriat', category: 'emotions', difficulty_level: 'intermediate', usage_example_thai: 'ฉันเครียดมาก', usage_example_chinese: '我压力很大', tags: ['emotion', 'stressed', 'negative'] },
  { thai_word: 'สบาย', chinese_translation: '舒服', pronunciation: 'sa-baai', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ฉันรู้สึกสบาย', usage_example_chinese: '我感觉舒服', tags: ['emotion', 'comfortable', 'positive'] },
  { thai_word: 'เจ็บ', chinese_translation: '疼', pronunciation: 'jèp', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'หัวฉันเจ็บ', usage_example_chinese: '我头疼', tags: ['emotion', 'pain', 'physical'] },
  { thai_word: 'ปวด', chinese_translation: '痛', pronunciation: 'pùat', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'ท้องฉันปวด', usage_example_chinese: '我肚子痛', tags: ['emotion', 'ache', 'physical'] },
  { thai_word: 'สนุก', chinese_translation: '有趣', pronunciation: 'sa-nùk', category: 'emotions', difficulty_level: 'beginner', usage_example_thai: 'เกมนี้สนุกมาก', usage_example_chinese: '这个游戏很有趣', tags: ['emotion', 'fun', 'positive'] },
  { thai_word: 'น่าเบื่อ', chinese_translation: '无聊的', pronunciation: 'nâa bɯ̀a', category: 'emotions', difficulty_level: 'intermediate', usage_example_thai: 'หนังเรื่องนี้น่าเบื่อ', usage_example_chinese: '这部电影很无聊', tags: ['emotion', 'boring', 'negative'] },

  // Actions and Verbs (25 words)
  { thai_word: 'กิน', chinese_translation: '吃', pronunciation: 'gin', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'กินข้าว', usage_example_chinese: '吃饭', tags: ['action', 'eat', 'daily'] },
  { thai_word: 'ดื่ม', chinese_translation: '喝', pronunciation: 'dɯ̀ɯm', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ดื่มน้ำ', usage_example_chinese: '喝水', tags: ['action', 'drink', 'daily'] },
  { thai_word: 'นอน', chinese_translation: '睡觉', pronunciation: 'nɔɔn', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ไปนอน', usage_example_chinese: '去睡觉', tags: ['action', 'sleep', 'daily'] },
  { thai_word: 'ตื่น', chinese_translation: '醒来', pronunciation: 'tɯ̀ɯn', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ตื่นเช้า', usage_example_chinese: '早上醒来', tags: ['action', 'wake', 'daily'] },
  { thai_word: 'เดิน', chinese_translation: '走路', pronunciation: 'dəən', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'เดินไปโรงเรียน', usage_example_chinese: '走路去学校', tags: ['action', 'walk', 'movement'] },
  { thai_word: 'วิ่ง', chinese_translation: '跑', pronunciation: 'wîng', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'วิ่งเร็วมาก', usage_example_chinese: '跑得很快', tags: ['action', 'run', 'movement'] },
  { thai_word: 'นั่ง', chinese_translation: '坐', pronunciation: 'nâng', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'นั่งที่นี่', usage_example_chinese: '坐在这里', tags: ['action', 'sit', 'position'] },
  { thai_word: 'ยืน', chinese_translation: '站', pronunciation: 'yɯɯn', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ยืนตรงนั้น', usage_example_chinese: '站在那里', tags: ['action', 'stand', 'position'] },
  { thai_word: 'ไป', chinese_translation: '去', pronunciation: 'pai', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ไปโรงเรียน', usage_example_chinese: '去学校', tags: ['action', 'go', 'movement'] },
  { thai_word: 'มา', chinese_translation: '来', pronunciation: 'maa', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'มาที่นี่', usage_example_chinese: '来这里', tags: ['action', 'come', 'movement'] },
  { thai_word: 'อ่าน', chinese_translation: '读', pronunciation: 'àan', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'อ่านหนังสือ', usage_example_chinese: '读书', tags: ['action', 'read', 'study'] },
  { thai_word: 'เขียน', chinese_translation: '写', pronunciation: 'khǐan', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'เขียนจดหมาย', usage_example_chinese: '写信', tags: ['action', 'write', 'study'] },
  { thai_word: 'ฟัง', chinese_translation: '听', pronunciation: 'fang', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ฟังเพลง', usage_example_chinese: '听音乐', tags: ['action', 'listen', 'sense'] },
  { thai_word: 'ดู', chinese_translation: '看', pronunciation: 'duu', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ดูหนัง', usage_example_chinese: '看电影', tags: ['action', 'watch', 'sense'] },
  { thai_word: 'พูด', chinese_translation: '说话', pronunciation: 'phûut', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'พูดภาษาไทย', usage_example_chinese: '说泰语', tags: ['action', 'speak', 'communication'] },
  { thai_word: 'ทำงาน', chinese_translation: '工作', pronunciation: 'tham ngaan', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ทำงานหนัก', usage_example_chinese: '努力工作', tags: ['action', 'work', 'daily'] },
  { thai_word: 'เรียน', chinese_translation: '学习', pronunciation: 'rian', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'เรียนภาษาไทย', usage_example_chinese: '学泰语', tags: ['action', 'study', 'education'] },
  { thai_word: 'สอน', chinese_translation: '教', pronunciation: 'sɔ̌ɔn', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'สอนภาษาไทย', usage_example_chinese: '教泰语', tags: ['action', 'teach', 'education'] },
  { thai_word: 'ซื้อ', chinese_translation: '买', pronunciation: 'sɯ́ɯ', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ซื้อของ', usage_example_chinese: '买东西', tags: ['action', 'buy', 'shopping'] },
  { thai_word: 'ขาย', chinese_translation: '卖', pronunciation: 'khǎai', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ขายของ', usage_example_chinese: '卖东西', tags: ['action', 'sell', 'business'] },
  { thai_word: 'ทำ', chinese_translation: '做', pronunciation: 'tham', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ทำอาหาร', usage_example_chinese: '做饭', tags: ['action', 'do', 'general'] },
  { thai_word: 'เล่น', chinese_translation: '玩', pronunciation: 'lên', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'เล่นเกม', usage_example_chinese: '玩游戏', tags: ['action', 'play', 'fun'] },
  { thai_word: 'ช่วย', chinese_translation: '帮助', pronunciation: 'chûai', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'ช่วยฉันหน่อย', usage_example_chinese: '帮我一下', tags: ['action', 'help', 'social'] },
  { thai_word: 'รอ', chinese_translation: '等', pronunciation: 'rɔɔ', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'รอสักครู่', usage_example_chinese: '等一下', tags: ['action', 'wait', 'time'] },
  { thai_word: 'หา', chinese_translation: '找', pronunciation: 'hǎa', category: 'actions', difficulty_level: 'beginner', usage_example_thai: 'หาของ', usage_example_chinese: '找东西', tags: ['action', 'find', 'search'] },

  // Technology and Modern Life (20 words)
  { thai_word: 'โทรศัพท์', chinese_translation: '电话', pronunciation: 'thoo-ra-sàp', category: 'technology', difficulty_level: 'beginner', usage_example_thai: 'โทรศัพท์มือถือ', usage_example_chinese: '手机', tags: ['technology', 'phone', 'communication'] },
  { thai_word: 'คอมพิวเตอร์', chinese_translation: '电脑', pronunciation: 'khɔm-phiu-təə', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'ใช้คอมพิวเตอร์', usage_example_chinese: '使用电脑', tags: ['technology', 'computer', 'modern'] },
  { thai_word: 'อินเทอร์เน็ต', chinese_translation: '互联网', pronunciation: 'in-thəə-nét', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'เล่นอินเทอร์เน็ต', usage_example_chinese: '上网', tags: ['technology', 'internet', 'modern'] },
  { thai_word: 'เว็บไซต์', chinese_translation: '网站', pronunciation: 'wép-sai', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'เว็บไซต์ดี', usage_example_chinese: '好网站', tags: ['technology', 'website', 'internet'] },
  { thai_word: 'อีเมล', chinese_translation: '电子邮件', pronunciation: 'ii-meel', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'ส่งอีเมล', usage_example_chinese: '发邮件', tags: ['technology', 'email', 'communication'] },
  { thai_word: 'แอป', chinese_translation: '应用程序', pronunciation: 'ɛ́ɛp', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'ดาวน์โหลดแอป', usage_example_chinese: '下载应用', tags: ['technology', 'app', 'mobile'] },
  { thai_word: 'เกม', chinese_translation: '游戏', pronunciation: 'geem', category: 'technology', difficulty_level: 'beginner', usage_example_thai: 'เล่นเกม', usage_example_chinese: '玩游戏', tags: ['technology', 'game', 'entertainment'] },
  { thai_word: 'ทีวี', chinese_translation: '电视', pronunciation: 'thii-wii', category: 'technology', difficulty_level: 'beginner', usage_example_thai: 'ดูทีวี', usage_example_chinese: '看电视', tags: ['technology', 'tv', 'entertainment'] },
  { thai_word: 'วิทยุ', chinese_translation: '收音机', pronunciation: 'wít-tha-yu', category: 'technology', difficulty_level: 'beginner', usage_example_thai: 'ฟังวิทยุ', usage_example_chinese: '听收音机', tags: ['technology', 'radio', 'entertainment'] },
  { thai_word: 'กล้อง', chinese_translation: '相机', pronunciation: 'glɔ̂ɔng', category: 'technology', difficulty_level: 'beginner', usage_example_thai: 'ถ่ายรูปด้วยกล้อง', usage_example_chinese: '用相机拍照', tags: ['technology', 'camera', 'photography'] },
  { thai_word: 'หูฟัง', chinese_translation: '耳机', pronunciation: 'hǔu fang', category: 'technology', difficulty_level: 'beginner', usage_example_thai: 'ใส่หูฟัง', usage_example_chinese: '戴耳机', tags: ['technology', 'headphones', 'audio'] },
  { thai_word: 'ลำโพง', chinese_translation: '扬声器', pronunciation: 'lam-phoong', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'เปิดลำโพง', usage_example_chinese: '打开扬声器', tags: ['technology', 'speaker', 'audio'] },
  { thai_word: 'ไมโครโฟน', chinese_translation: '麦克风', pronunciation: 'mai-khroo-foon', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'ใช้ไมโครโฟน', usage_example_chinese: '使用麦克风', tags: ['technology', 'microphone', 'audio'] },
  { thai_word: 'แบตเตอรี่', chinese_translation: '电池', pronunciation: 'bɛ̀ɛt-təə-rii', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'แบตเตอรี่หมด', usage_example_chinese: '电池没电了', tags: ['technology', 'battery', 'power'] },
  { thai_word: 'ชาร์จ', chinese_translation: '充电', pronunciation: 'chaaj', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'ชาร์จโทรศัพท์', usage_example_chinese: '给手机充电', tags: ['technology', 'charge', 'power'] },
  { thai_word: 'ไวไฟ', chinese_translation: 'WiFi', pronunciation: 'wai-fai', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'เชื่อมต่อไวไฟ', usage_example_chinese: '连接WiFi', tags: ['technology', 'wifi', 'internet'] },
  { thai_word: 'บลูทูธ', chinese_translation: '蓝牙', pronunciation: 'bluu-thuut', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'เปิดบลูทูธ', usage_example_chinese: '打开蓝牙', tags: ['technology', 'bluetooth', 'wireless'] },
  { thai_word: 'ซอฟต์แวร์', chinese_translation: '软件', pronunciation: 'sɔ́ɔf-wɛɛ', category: 'technology', difficulty_level: 'advanced', usage_example_thai: 'ติดตั้งซอฟต์แวร์', usage_example_chinese: '安装软件', tags: ['technology', 'software', 'computer'] },
  { thai_word: 'ฮาร์ดแวร์', chinese_translation: '硬件', pronunciation: 'háat-wɛɛ', category: 'technology', difficulty_level: 'advanced', usage_example_thai: 'ฮาร์ดแวร์ใหม่', usage_example_chinese: '新硬件', tags: ['technology', 'hardware', 'computer'] },
  { thai_word: 'ข้อมูล', chinese_translation: '数据', pronunciation: 'khɔ̂ɔ muun', category: 'technology', difficulty_level: 'intermediate', usage_example_thai: 'สำรองข้อมูล', usage_example_chinese: '备份数据', tags: ['technology', 'data', 'information'] },

  // Education and School (20 words)
  { thai_word: 'นักเรียน', chinese_translation: '学生', pronunciation: 'nák rian', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'นักเรียนดี', usage_example_chinese: '好学生', tags: ['education', 'student', 'school'] },
  { thai_word: 'ครู', chinese_translation: '老师', pronunciation: 'khruu', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'ครูสอนดี', usage_example_chinese: '老师教得好', tags: ['education', 'teacher', 'school'] },
  { thai_word: 'ห้องเรียน', chinese_translation: '教室', pronunciation: 'hɔ̂ɔng rian', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'ห้องเรียนใหญ่', usage_example_chinese: '大教室', tags: ['education', 'classroom', 'school'] },
  { thai_word: 'หนังสือ', chinese_translation: '书', pronunciation: 'nǎng sɯ̌ɯ', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'อ่านหนังสือ', usage_example_chinese: '读书', tags: ['education', 'book', 'reading'] },
  { thai_word: 'ปากกา', chinese_translation: '笔', pronunciation: 'pàak gaa', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'ปากกาสีน้ำเงิน', usage_example_chinese: '蓝色笔', tags: ['education', 'pen', 'writing'] },
  { thai_word: 'ดินสอ', chinese_translation: '铅笔', pronunciation: 'din sɔ̌ɔ', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'ดินสอดำ', usage_example_chinese: '黑铅笔', tags: ['education', 'pencil', 'writing'] },
  { thai_word: 'กระดาษ', chinese_translation: '纸', pronunciation: 'gra-dàat', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'กระดาษขาว', usage_example_chinese: '白纸', tags: ['education', 'paper', 'writing'] },
  { thai_word: 'สมุด', chinese_translation: '笔记本', pronunciation: 'sa-mùt', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'สมุดใหม่', usage_example_chinese: '新笔记本', tags: ['education', 'notebook', 'writing'] },
  { thai_word: 'การบ้าน', chinese_translation: '作业', pronunciation: 'gaan bâan', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'ทำการบ้าน', usage_example_chinese: '做作业', tags: ['education', 'homework', 'study'] },
  { thai_word: 'สอบ', chinese_translation: '考试', pronunciation: 'sɔ̀ɔp', category: 'education', difficulty_level: 'beginner', usage_example_thai: 'สอบยาก', usage_example_chinese: '考试难', tags: ['education', 'exam', 'test'] },
  { thai_word: 'เกรด', chinese_translation: '成绩', pronunciation: 'greet', category: 'education', difficulty_level: 'intermediate', usage_example_thai: 'เกรดดี', usage_example_chinese: '成绩好', tags: ['education', 'grade', 'result'] },
  { thai_word: 'ปริญญา', chinese_translation: '学位', pronunciation: 'pa-rin-yaa', category: 'education', difficulty_level: 'advanced', usage_example_thai: 'จบปริญญา', usage_example_chinese: '毕业获得学位', tags: ['education', 'degree', 'university'] },
  { thai_word: 'มหาวิทยาลัย', chinese_translation: '大学', pronunciation: 'ma-hǎa-wít-tha-yaa-lai', category: 'education', difficulty_level: 'intermediate', usage_example_thai: 'เรียนมหาวิทยาลัย', usage_example_chinese: '上大学', tags: ['education', 'university', 'higher'] },
  { thai_word: 'วิทยาศาสตร์', chinese_translation: '科学', pronunciation: 'wít-tha-yaa-sàat', category: 'education', difficulty_level: 'intermediate', usage_example_thai: 'เรียนวิทยาศาสตร์', usage_example_chinese: '学科学', tags: ['education', 'science', 'subject'] },
  { thai_word: 'คณิตศาสตร์', chinese_translation: '数学', pronunciation: 'kha-nít-sa-sàat', category: 'education', difficulty_level: 'intermediate', usage_example_thai: 'เรียนคณิตศาสตร์', usage_example_chinese: '学数学', tags: ['education', 'mathematics', 'subject'] },
  { thai_word: 'ภาษาอังกฤษ', chinese_translation: '英语', pronunciation: 'phaa-sǎa ang-grìt', category: 'education', difficulty_level: 'intermediate', usage_example_thai: 'เรียนภาษาอังกฤษ', usage_example_chinese: '学英语', tags: ['education', 'english', 'language'] },
  { thai_word: 'ประวัติศาสตร์', chinese_translation: '历史', pronunciation: 'pra-wàt-ti-sàat', category: 'education', difficulty_level: 'advanced', usage_example_thai: 'เรียนประวัติศาสตร์', usage_example_chinese: '学历史', tags: ['education', 'history', 'subject'] },
  { thai_word: 'ภูมิศาสตร์', chinese_translation: '地理', pronunciation: 'phuu-mii-sàat', category: 'education', difficulty_level: 'advanced', usage_example_thai: 'เรียนภูมิศาสตร์', usage_example_chinese: '学地理', tags: ['education', 'geography', 'subject'] },
  { thai_word: 'ศิลปะ', chinese_translation: '艺术', pronunciation: 'sǐn-la-pá', category: 'education', difficulty_level: 'intermediate', usage_example_thai: 'เรียนศิลปะ', usage_example_chinese: '学艺术', tags: ['education', 'art', 'creative'] },
  { thai_word: 'ดนตรี', chinese_translation: '音乐', pronunciation: 'don-trii', category: 'education', difficulty_level: 'intermediate', usage_example_thai: 'เรียนดนตรี', usage_example_chinese: '学音乐', tags: ['education', 'music', 'creative'] },

  // Health and Medical (20 words)
  { thai_word: 'สุขภาพ', chinese_translation: '健康', pronunciation: 'sùk-kha-phâap', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'สุขภาพดี', usage_example_chinese: '身体健康', tags: ['health', 'wellness', 'general'] },
  { thai_word: 'หมอ', chinese_translation: '医生', pronunciation: 'mɔ̌ɔ', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'ไปหาหมอ', usage_example_chinese: '去看医生', tags: ['health', 'doctor', 'medical'] },
  { thai_word: 'พยาบาล', chinese_translation: '护士', pronunciation: 'pha-yaa-baan', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'พยาบาลใจดี', usage_example_chinese: '护士很好', tags: ['health', 'nurse', 'medical'] },
  { thai_word: 'ยา', chinese_translation: '药', pronunciation: 'yaa', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'กินยา', usage_example_chinese: '吃药', tags: ['health', 'medicine', 'treatment'] },
  { thai_word: 'ป่วย', chinese_translation: '生病', pronunciation: 'pùai', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'ฉันป่วย', usage_example_chinese: '我生病了', tags: ['health', 'sick', 'condition'] },
  { thai_word: 'ไข้', chinese_translation: '发烧', pronunciation: 'khài', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'มีไข้', usage_example_chinese: '发烧了', tags: ['health', 'fever', 'symptom'] },
  { thai_word: 'ไอ', chinese_translation: '咳嗽', pronunciation: 'ai', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'ไอมาก', usage_example_chinese: '咳嗽很厉害', tags: ['health', 'cough', 'symptom'] },
  { thai_word: 'จาม', chinese_translation: '打喷嚏', pronunciation: 'jaam', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'จามบ่อย', usage_example_chinese: '经常打喷嚏', tags: ['health', 'sneeze', 'symptom'] },
  { thai_word: 'ปวดหัว', chinese_translation: '头痛', pronunciation: 'pùat hǔa', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'ปวดหัวมาก', usage_example_chinese: '头很痛', tags: ['health', 'headache', 'pain'] },
  { thai_word: 'ปวดท้อง', chinese_translation: '肚子痛', pronunciation: 'pùat thɔ́ɔng', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'ปวดท้องเล็กน้อย', usage_example_chinese: '肚子有点痛', tags: ['health', 'stomachache', 'pain'] },
  { thai_word: 'เหนื่อย', chinese_translation: '疲劳', pronunciation: 'nɯ̀ai', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'รู้สึกเหนื่อย', usage_example_chinese: '感觉疲劳', tags: ['health', 'tired', 'fatigue'] },
  { thai_word: 'แข็งแรง', chinese_translation: '强壮', pronunciation: 'khǎeng rɛɛng', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'ร่างกายแข็งแรง', usage_example_chinese: '身体强壮', tags: ['health', 'strong', 'fitness'] },
  { thai_word: 'ออกกำลังกาย', chinese_translation: '锻炼', pronunciation: 'ɔ̀ɔk gam-lang gaai', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'ออกกำลังกายทุกวัน', usage_example_chinese: '每天锻炼', tags: ['health', 'exercise', 'fitness'] },
  { thai_word: 'วิ่งจ๊อกกิ้ง', chinese_translation: '慢跑', pronunciation: 'wîng jɔ́ɔk-gîng', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'วิ่งจ๊อกกิ้งตอนเช้า', usage_example_chinese: '早上慢跑', tags: ['health', 'jogging', 'exercise'] },
  { thai_word: 'โยคะ', chinese_translation: '瑜伽', pronunciation: 'yoo-khá', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'เล่นโยคะ', usage_example_chinese: '练瑜伽', tags: ['health', 'yoga', 'exercise'] },
  { thai_word: 'นวด', chinese_translation: '按摩', pronunciation: 'nûat', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'นวดผ่อนคลาย', usage_example_chinese: '放松按摩', tags: ['health', 'massage', 'relaxation'] },
  { thai_word: 'นอนหลับ', chinese_translation: '睡眠', pronunciation: 'nɔɔn làp', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'นอนหลับดี', usage_example_chinese: '睡得好', tags: ['health', 'sleep', 'rest'] },
  { thai_word: 'ฟันผุ', chinese_translation: '蛀牙', pronunciation: 'fan phù', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'มีฟันผุ', usage_example_chinese: '有蛀牙', tags: ['health', 'tooth', 'dental'] },
  { thai_word: 'แปรงฟัน', chinese_translation: '刷牙', pronunciation: 'prɛɛng fan', category: 'health', difficulty_level: 'beginner', usage_example_thai: 'แปรงฟันทุกวัน', usage_example_chinese: '每天刷牙', tags: ['health', 'brush', 'dental'] },
  { thai_word: 'วิตามิน', chinese_translation: '维生素', pronunciation: 'wi-taa-min', category: 'health', difficulty_level: 'intermediate', usage_example_thai: 'กินวิตามิน', usage_example_chinese: '吃维生素', tags: ['health', 'vitamin', 'nutrition'] },

  // Sports and Recreation (20 words)
  { thai_word: 'กีฬา', chinese_translation: '体育运动', pronunciation: 'gii-laa', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'เล่นกีฬา', usage_example_chinese: '做运动', tags: ['sports', 'general', 'activity'] },
  { thai_word: 'ฟุตบอล', chinese_translation: '足球', pronunciation: 'fút-bɔɔn', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'เล่นฟุตบอล', usage_example_chinese: '踢足球', tags: ['sports', 'football', 'team'] },
  { thai_word: 'บาสเกตบอล', chinese_translation: '篮球', pronunciation: 'bàat-gèt-bɔɔn', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'เล่นบาสเกตบอล', usage_example_chinese: '打篮球', tags: ['sports', 'basketball', 'team'] },
  { thai_word: 'เทนนิส', chinese_translation: '网球', pronunciation: 'then-nít', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'เล่นเทนนิส', usage_example_chinese: '打网球', tags: ['sports', 'tennis', 'racket'] },
  { thai_word: 'แบดมินตัน', chinese_translation: '羽毛球', pronunciation: 'bɛ̀ɛt-min-tan', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'เล่นแบดมินตัน', usage_example_chinese: '打羽毛球', tags: ['sports', 'badminton', 'racket'] },
  { thai_word: 'ปิงปอง', chinese_translation: '乒乓球', pronunciation: 'ping-pɔɔng', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'เล่นปิงปอง', usage_example_chinese: '打乒乓球', tags: ['sports', 'pingpong', 'table'] },
  { thai_word: 'ว่ายน้ำ', chinese_translation: '游泳', pronunciation: 'wâai náam', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'ไปว่ายน้ำ', usage_example_chinese: '去游泳', tags: ['sports', 'swimming', 'water'] },
  { thai_word: 'วอลเลย์บอล', chinese_translation: '排球', pronunciation: 'wɔɔn-lee-bɔɔn', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'เล่นวอลเลย์บอล', usage_example_chinese: '打排球', tags: ['sports', 'volleyball', 'team'] },
  { thai_word: 'มวยไทย', chinese_translation: '泰拳', pronunciation: 'muai thai', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'เรียนมวยไทย', usage_example_chinese: '学泰拳', tags: ['sports', 'muaythai', 'martial'] },
  { thai_word: 'โกลฟ์', chinese_translation: '高尔夫', pronunciation: 'goof', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'เล่นโกลฟ์', usage_example_chinese: '打高尔夫', tags: ['sports', 'golf', 'individual'] },
  { thai_word: 'ลูกบอล', chinese_translation: '球', pronunciation: 'lûuk bɔɔn', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'เตะลูกบอล', usage_example_chinese: '踢球', tags: ['sports', 'ball', 'equipment'] },
  { thai_word: 'สนาม', chinese_translation: '场地', pronunciation: 'sa-nǎam', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'สนามฟุตบอล', usage_example_chinese: '足球场', tags: ['sports', 'field', 'venue'] },
  { thai_word: 'ทีม', chinese_translation: '队伍', pronunciation: 'thiim', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'ทีมดี', usage_example_chinese: '好队伍', tags: ['sports', 'team', 'group'] },
  { thai_word: 'ผู้เล่น', chinese_translation: '球员', pronunciation: 'phûu lên', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'ผู้เล่นเก่ง', usage_example_chinese: '优秀球员', tags: ['sports', 'player', 'athlete'] },
  { thai_word: 'แข่งขัน', chinese_translation: '比赛', pronunciation: 'khàeng khǎn', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'แข่งขันฟุตบอล', usage_example_chinese: '足球比赛', tags: ['sports', 'competition', 'match'] },
  { thai_word: 'ชนะ', chinese_translation: '赢', pronunciation: 'cha-ná', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'ทีมเราชนะ', usage_example_chinese: '我们队赢了', tags: ['sports', 'win', 'victory'] },
  { thai_word: 'แพ้', chinese_translation: '输', pronunciation: 'phɛ́ɛ', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'ทีมเราแพ้', usage_example_chinese: '我们队输了', tags: ['sports', 'lose', 'defeat'] },
  { thai_word: 'เสมอ', chinese_translation: '平局', pronunciation: 'sa-mə̌ə', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'เสมอกัน', usage_example_chinese: '平局', tags: ['sports', 'draw', 'tie'] },
  { thai_word: 'คะแนน', chinese_translation: '分数', pronunciation: 'kha-nɛɛn', category: 'sports', difficulty_level: 'beginner', usage_example_thai: 'คะแนนสูง', usage_example_chinese: '分数高', tags: ['sports', 'score', 'points'] },
  { thai_word: 'เหรียญ', chinese_translation: '奖牌', pronunciation: 'rǐan', category: 'sports', difficulty_level: 'intermediate', usage_example_thai: 'ได้เหรียญทอง', usage_example_chinese: '获得金牌', tags: ['sports', 'medal', 'award'] },

  // Jobs and Professions (20 words)
  { thai_word: 'งาน', chinese_translation: '工作', pronunciation: 'ngaan', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'หางานทำ', usage_example_chinese: '找工作', tags: ['job', 'work', 'career'] },
  { thai_word: 'หมอ', chinese_translation: '医生', pronunciation: 'mɔ̌ɔ', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'เป็นหมอ', usage_example_chinese: '当医生', tags: ['job', 'doctor', 'medical'] },
  { thai_word: 'ครู', chinese_translation: '教师', pronunciation: 'khruu', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'เป็นครู', usage_example_chinese: '当老师', tags: ['job', 'teacher', 'education'] },
  { thai_word: 'วิศวกร', chinese_translation: '工程师', pronunciation: 'wít-sa-wa-gɔɔn', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นวิศวกร', usage_example_chinese: '当工程师', tags: ['job', 'engineer', 'technical'] },
  { thai_word: 'พยาบาล', chinese_translation: '护士', pronunciation: 'pha-yaa-baan', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นพยาบาล', usage_example_chinese: '当护士', tags: ['job', 'nurse', 'medical'] },
  { thai_word: 'ตำรวจ', chinese_translation: '警察', pronunciation: 'tam-rùat', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'เป็นตำรวจ', usage_example_chinese: '当警察', tags: ['job', 'police', 'security'] },
  { thai_word: 'ทหาร', chinese_translation: '军人', pronunciation: 'tha-hǎan', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'เป็นทหาร', usage_example_chinese: '当军人', tags: ['job', 'soldier', 'military'] },
  { thai_word: 'นักบิน', chinese_translation: '飞行员', pronunciation: 'nák bin', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นนักบิน', usage_example_chinese: '当飞行员', tags: ['job', 'pilot', 'aviation'] },
  { thai_word: 'พ่อครัว', chinese_translation: '厨师', pronunciation: 'phɔ̂ɔ khrua', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'เป็นพ่อครัว', usage_example_chinese: '当厨师', tags: ['job', 'chef', 'cooking'] },
  { thai_word: 'ช่างตัดผม', chinese_translation: '理发师', pronunciation: 'châang tàt phǒm', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นช่างตัดผม', usage_example_chinese: '当理发师', tags: ['job', 'barber', 'service'] },
  { thai_word: 'คนขับรถ', chinese_translation: '司机', pronunciation: 'khon khàp rót', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'เป็นคนขับรถ', usage_example_chinese: '当司机', tags: ['job', 'driver', 'transport'] },
  { thai_word: 'นักธุรกิจ', chinese_translation: '商人', pronunciation: 'nák thú-ra-gìt', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นนักธุรกิจ', usage_example_chinese: '当商人', tags: ['job', 'businessman', 'commerce'] },
  { thai_word: 'ทนายความ', chinese_translation: '律师', pronunciation: 'tha-naai khwaam', category: 'jobs', difficulty_level: 'advanced', usage_example_thai: 'เป็นทนายความ', usage_example_chinese: '当律师', tags: ['job', 'lawyer', 'legal'] },
  { thai_word: 'นักข่าว', chinese_translation: '记者', pronunciation: 'nák khàao', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นนักข่าว', usage_example_chinese: '当记者', tags: ['job', 'journalist', 'media'] },
  { thai_word: 'ศิลปิน', chinese_translation: '艺术家', pronunciation: 'sǐn-la-pin', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นศิลปิน', usage_example_chinese: '当艺术家', tags: ['job', 'artist', 'creative'] },
  { thai_word: 'นักดนตรี', chinese_translation: '音乐家', pronunciation: 'nák don-trii', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นนักดนตรี', usage_example_chinese: '当音乐家', tags: ['job', 'musician', 'creative'] },
  { thai_word: 'นักเขียน', chinese_translation: '作家', pronunciation: 'nák khǐan', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นนักเขียน', usage_example_chinese: '当作家', tags: ['job', 'writer', 'creative'] },
  { thai_word: 'ช่างภาพ', chinese_translation: '摄影师', pronunciation: 'châang phâap', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นช่างภาพ', usage_example_chinese: '当摄影师', tags: ['job', 'photographer', 'creative'] },
  { thai_word: 'เกษตรกร', chinese_translation: '农民', pronunciation: 'ga-sèet-ta-gɔɔn', category: 'jobs', difficulty_level: 'intermediate', usage_example_thai: 'เป็นเกษตรกร', usage_example_chinese: '当农民', tags: ['job', 'farmer', 'agriculture'] },
  { thai_word: 'แม่บ้าน', chinese_translation: '家庭主妇', pronunciation: 'mɛ̂ɛ bâan', category: 'jobs', difficulty_level: 'beginner', usage_example_thai: 'เป็นแม่บ้าน', usage_example_chinese: '当家庭主妇', tags: ['job', 'housewife', 'domestic'] },

  // Shopping and Money (15 words)
  { thai_word: 'เงิน', chinese_translation: '钱', pronunciation: 'ngəən', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'มีเงิน', usage_example_chinese: '有钱', tags: ['money', 'currency', 'finance'] },
  { thai_word: 'ราคา', chinese_translation: '价格', pronunciation: 'raa-khaa', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'ราคาแพง', usage_example_chinese: '价格贵', tags: ['money', 'price', 'cost'] },
  { thai_word: 'แพง', chinese_translation: '贵', pronunciation: 'phɛɛng', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'ของแพง', usage_example_chinese: '东西贵', tags: ['money', 'expensive', 'cost'] },
  { thai_word: 'ถูก', chinese_translation: '便宜', pronunciation: 'thùuk', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'ของถูก', usage_example_chinese: '东西便宜', tags: ['money', 'cheap', 'cost'] },
  { thai_word: 'ร้านค้า', chinese_translation: '商店', pronunciation: 'ráan kháa', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'ไปร้านค้า', usage_example_chinese: '去商店', tags: ['shopping', 'store', 'retail'] },
  { thai_word: 'ซื้อของ', chinese_translation: '购物', pronunciation: 'sɯ́ɯ khɔ̌ɔng', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'ไปซื้อของ', usage_example_chinese: '去购物', tags: ['shopping', 'buy', 'activity'] },
  { thai_word: 'จ่ายเงิน', chinese_translation: '付钱', pronunciation: 'jàai ngəən', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'จ่ายเงินแล้ว', usage_example_chinese: '已经付钱了', tags: ['money', 'pay', 'transaction'] },
  { thai_word: 'เงินทอน', chinese_translation: '找零', pronunciation: 'ngəən thɔɔn', category: 'shopping', difficulty_level: 'intermediate', usage_example_thai: 'ได้เงินทอน', usage_example_chinese: '得到找零', tags: ['money', 'change', 'transaction'] },
  { thai_word: 'ลดราคา', chinese_translation: '打折', pronunciation: 'lót raa-khaa', category: 'shopping', difficulty_level: 'intermediate', usage_example_thai: 'ลดราคา 50%', usage_example_chinese: '打5折', tags: ['shopping', 'discount', 'sale'] },
  { thai_word: 'บัตรเครดิต', chinese_translation: '信用卡', pronunciation: 'bàt kree-dìt', category: 'shopping', difficulty_level: 'intermediate', usage_example_thai: 'จ่ายด้วยบัตรเครดิต', usage_example_chinese: '用信用卡付款', tags: ['money', 'credit', 'payment'] },
  { thai_word: 'เงินสด', chinese_translation: '现金', pronunciation: 'ngəən sòt', category: 'shopping', difficulty_level: 'intermediate', usage_example_thai: 'จ่ายเงินสด', usage_example_chinese: '付现金', tags: ['money', 'cash', 'payment'] },
  { thai_word: 'ใบเสร็จ', chinese_translation: '收据', pronunciation: 'bai sèt', category: 'shopping', difficulty_level: 'intermediate', usage_example_thai: 'ขอใบเสร็จ', usage_example_chinese: '要收据', tags: ['shopping', 'receipt', 'document'] },
  { thai_word: 'ถุงผ้า', chinese_translation: '布袋', pronunciation: 'thǔng phâa', category: 'shopping', difficulty_level: 'beginner', usage_example_thai: 'ใช้ถุงผ้า', usage_example_chinese: '用布袋', tags: ['shopping', 'bag', 'eco'] },
  { thai_word: 'ถุงพลาสติก', chinese_translation: '塑料袋', pronunciation: 'thǔng phlaa-sà-tìk', category: 'shopping', difficulty_level: 'intermediate', usage_example_thai: 'ไม่ใช้ถุงพลาสติก', usage_example_chinese: '不用塑料袋', tags: ['shopping', 'plastic', 'bag'] },
  { thai_word: 'ของขวัญ', chinese_translation: '礼物', pronunciation: 'khɔ̌ɔng khwǎn', category: 'shopping', difficulty_level: 'intermediate', usage_example_thai: 'ซื้อของขวัญ', usage_example_chinese: '买礼物', tags: ['shopping', 'gift', 'present'] },

  // Nature and Environment (15 words)
  { thai_word: 'ธรรมชาติ', chinese_translation: '自然', pronunciation: 'tham-ma-châat', category: 'nature', difficulty_level: 'intermediate', usage_example_thai: 'รักธรรมชาติ', usage_example_chinese: '爱自然', tags: ['nature', 'environment', 'general'] },
  { thai_word: 'ป่า', chinese_translation: '森林', pronunciation: 'pàa', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'ป่าใหญ่', usage_example_chinese: '大森林', tags: ['nature', 'forest', 'trees'] },
  { thai_word: 'ต้นไม้', chinese_translation: '树', pronunciation: 'tôn máai', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'ต้นไม้สูง', usage_example_chinese: '高树', tags: ['nature', 'tree', 'plant'] },
  { thai_word: 'ดอกไม้', chinese_translation: '花', pronunciation: 'dɔ̀ɔk máai', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'ดอกไม้สวย', usage_example_chinese: '美丽的花', tags: ['nature', 'flower', 'plant'] },
  { thai_word: 'ใบไม้', chinese_translation: '叶子', pronunciation: 'bai máai', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'ใบไม้เขียว', usage_example_chinese: '绿叶子', tags: ['nature', 'leaf', 'plant'] },
  { thai_word: 'หญ้า', chinese_translation: '草', pronunciation: 'yâa', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'หญ้าเขียว', usage_example_chinese: '绿草', tags: ['nature', 'grass', 'plant'] },
  { thai_word: 'ภูเขา', chinese_translation: '山', pronunciation: 'phuu khao', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'ภูเขาสูง', usage_example_chinese: '高山', tags: ['nature', 'mountain', 'landscape'] },
  { thai_word: 'ทะเล', chinese_translation: '海', pronunciation: 'tha-lee', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'ทะเลใส', usage_example_chinese: '清澈的海', tags: ['nature', 'sea', 'water'] },
  { thai_word: 'แม่น้ำ', chinese_translation: '河流', pronunciation: 'mɛ̂ɛ náam', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'แม่น้ำใหญ่', usage_example_chinese: '大河', tags: ['nature', 'river', 'water'] },
  { thai_word: 'ลำธาร', chinese_translation: '小溪', pronunciation: 'lam thaan', category: 'nature', difficulty_level: 'intermediate', usage_example_thai: 'ลำธารใส', usage_example_chinese: '清澈的小溪', tags: ['nature', 'stream', 'water'] },
  { thai_word: 'ทะเลสาบ', chinese_translation: '湖', pronunciation: 'tha-lee sàap', category: 'nature', difficulty_level: 'intermediate', usage_example_thai: 'ทะเลสาบสวย', usage_example_chinese: '美丽的湖', tags: ['nature', 'lake', 'water'] },
  { thai_word: 'เกาะ', chinese_translation: '岛', pronunciation: 'gɔ̀', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'เกาะสวย', usage_example_chinese: '美丽的岛', tags: ['nature', 'island', 'geography'] },
  { thai_word: 'ดาว', chinese_translation: '星星', pronunciation: 'daao', category: 'nature', difficulty_level: 'beginner', usage_example_thai: 'ดาวสวย', usage_example_chinese: '美丽的星星', tags: ['nature', 'star', 'sky'] },
  { thai_word: 'พระจันทร์', chinese_translation: '月亮', pronunciation: 'phra jan', category: 'nature', difficulty_level: 'intermediate', usage_example_thai: 'พระจันทร์เต็มดวง', usage_example_chinese: '满月', tags: ['nature', 'moon', 'sky'] },
  { thai_word: 'พระอาทิตย์', chinese_translation: '太阳', pronunciation: 'phra aa-thít', category: 'nature', difficulty_level: 'intermediate', usage_example_thai: 'พระอาทิตย์ขึ้น', usage_example_chinese: '太阳升起', tags: ['nature', 'sun', 'sky'] }
];

async function updateVocabulary() {
  try {
    console.log('开始更新词汇数据...');

    // 清除现有词汇（可选）
    console.log('清除现有词汇数据...');
    const { error: deleteError } = await supabase
      .from('vocabulary')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // 删除所有记录

    if (deleteError) {
      console.error('删除现有数据时出错:', deleteError);
    } else {
      console.log('现有词汇数据已清除');
    }

    // 批量插入新词汇
    console.log(`准备插入 ${extendedVocabulary.length} 个词汇...`);

    const { data, error } = await supabase
      .from('vocabulary')
      .insert(extendedVocabulary);

    if (error) {
      console.error('插入词汇数据时出错:', error);
      return;
    }

    console.log(`成功插入 ${extendedVocabulary.length} 个词汇！`);

    // 更新音频URL
    console.log('更新音频URL...');
    const { error: updateError } = await supabase
      .from('vocabulary')
      .update({ audio_url: supabase.storage.from('audio').getPublicUrl('vocabulary/placeholder.mp3').data.publicUrl })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (updateError) {
      console.error('更新音频URL时出错:', updateError);
    } else {
      console.log('音频URL更新完成');
    }

    // 显示统计信息
    const { data: stats, error: statsError } = await supabase
      .from('vocabulary')
      .select('category')
      .order('category');

    if (!statsError && stats) {
      const categoryStats = stats.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});

      console.log('\n词汇统计:');
      Object.entries(categoryStats).forEach(([category, count]) => {
        console.log(`  ${category}: ${count} 个词汇`);
      });
      console.log(`  总计: ${stats.length} 个词汇`);
    }

    console.log('\n词汇数据更新完成！');

  } catch (error) {
    console.error('更新过程中发生错误:', error);
  }
}

// 运行更新
updateVocabulary();