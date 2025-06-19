const { createClient } = require('@supabase/supabase-js');

// 从环境变量读取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqkzozmcgrlvcvfpyicy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3pvem1jZ3JsdmN2ZnB5aWN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI0NjA5MywiZXhwIjoyMDY1ODIyMDkzfQ.7JMu9Ihnl64dbT1t7ZcUyFcLYcJLwS-rRCAMiuC-j0w';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 完整的44个泰语辅音字母数据
const thaiConsonants = [
  {
    letter: 'ก', name: 'ก ไก่', meaning: 'chicken', chinese_meaning: '鸡',
    pronunciation: 'gɔɔ gài', sound: 'g', tone_class: 'mid', order_index: 1,
    strokes: ['M50,30 Q80,20 110,30 Q80,40 50,30', 'M80,30 L80,90', 'M65,60 L95,60']
  },
  {
    letter: 'ข', name: 'ข ไข่', meaning: 'egg', chinese_meaning: '蛋',
    pronunciation: 'khɔ̌ɔ khài', sound: 'kh', tone_class: 'high', order_index: 2,
    strokes: ['M40,30 Q70,20 100,30 Q70,40 40,30', 'M70,30 L70,90', 'M55,60 L85,60', 'M110,25 Q125,20 140,25 Q125,30 110,25']
  },
  {
    letter: 'ฃ', name: 'ฃ ขวด', meaning: 'bottle', chinese_meaning: '瓶子',
    pronunciation: 'khɔ̌ɔ khùat', sound: 'kh', tone_class: 'high', order_index: 3, is_obsolete: true,
    strokes: ['M40,30 Q70,20 100,30 Q70,40 40,30', 'M70,30 L70,90', 'M55,60 L85,60', 'M110,40 L125,25', 'M125,40 L110,25']
  },
  {
    letter: 'ค', name: 'ค ควาย', meaning: 'buffalo', chinese_meaning: '水牛',
    pronunciation: 'khɔɔ khwaai', sound: 'kh', tone_class: 'low', order_index: 4,
    strokes: ['M40,30 Q70,20 100,30 Q70,40 40,30', 'M70,30 L70,90', 'M55,60 L85,60', 'M110,35 L130,35', 'M120,25 L120,45']
  },
  {
    letter: 'ฅ', name: 'ฅ คน', meaning: 'person', chinese_meaning: '人',
    pronunciation: 'khɔɔ khon', sound: 'kh', tone_class: 'low', order_index: 5, is_obsolete: true,
    strokes: ['M40,30 Q70,20 100,30 Q70,40 40,30', 'M70,30 L70,90', 'M55,60 L85,60', 'M110,30 L130,50', 'M130,30 L110,50']
  },
  {
    letter: 'ฆ', name: 'ฆ ระฆัง', meaning: 'bell', chinese_meaning: '钟',
    pronunciation: 'khɔɔ rakhang', sound: 'kh', tone_class: 'low', order_index: 6,
    strokes: ['M40,30 Q70,20 100,30 Q70,40 40,30', 'M70,30 L70,90', 'M55,60 L85,60', 'M110,20 L110,50', 'M110,35 L130,35', 'M120,25 L120,45']
  },
  {
    letter: 'ง', name: 'ง งู', meaning: 'snake', chinese_meaning: '蛇',
    pronunciation: 'ngɔɔ nguu', sound: 'ng', tone_class: 'low', order_index: 7,
    strokes: ['M50,40 Q80,25 110,40 Q80,55 50,40']
  },
  {
    letter: 'จ', name: 'จ จาน', meaning: 'plate', chinese_meaning: '盘子',
    pronunciation: 'jɔɔ jaan', sound: 'j', tone_class: 'mid', order_index: 8,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90', 'M55,75 Q70,85 85,75']
  },
  {
    letter: 'ฉ', name: 'ฉ ฉิ่ง', meaning: 'cymbal', chinese_meaning: '钹',
    pronunciation: 'chɔ̌ɔ chìng', sound: 'ch', tone_class: 'high', order_index: 9,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90', 'M50,50 L90,50', 'M55,75 Q70,85 85,75']
  },
  {
    letter: 'ช', name: 'ช ช้าง', meaning: 'elephant', chinese_meaning: '大象',
    pronunciation: 'chɔɔ cháang', sound: 'ch', tone_class: 'low', order_index: 10,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90', 'M50,65 L90,65', 'M55,75 Q70,85 85,75']
  },
  {
    letter: 'ซ', name: 'ซ โซ่', meaning: 'chain', chinese_meaning: '链子',
    pronunciation: 'sɔɔ sôo', sound: 's', tone_class: 'low', order_index: 11,
    strokes: ['M40,30 Q70,20 100,30 Q70,40 40,30', 'M70,30 L70,90', 'M55,60 L85,60', 'M110,30 Q125,25 140,30 Q125,35 110,30']
  },
  {
    letter: 'ฌ', name: 'ฌ เฌอ', meaning: 'tree', chinese_meaning: '树',
    pronunciation: 'chɔɔ chəə', sound: 'ch', tone_class: 'low', order_index: 12,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90', 'M50,50 L90,50', 'M50,65 L90,65', 'M55,75 Q70,85 85,75']
  },
  {
    letter: 'ญ', name: 'ญ หญิง', meaning: 'woman', chinese_meaning: '女人',
    pronunciation: 'yɔɔ yǐng', sound: 'y', tone_class: 'low', order_index: 13,
    strokes: ['M40,30 L100,30', 'M55,30 L55,90', 'M85,30 L85,90', 'M40,75 Q70,85 100,75']
  },
  {
    letter: 'ฎ', name: 'ฎ ชฎา', meaning: 'headdress', chinese_meaning: '头饰',
    pronunciation: 'dɔɔ chadaa', sound: 'd', tone_class: 'mid', order_index: 14,
    strokes: ['M50,20 L50,90', 'M50,20 Q80,15 110,20 Q80,25 50,20', 'M80,20 L80,60', 'M65,45 L95,45']
  },
  {
    letter: 'ฏ', name: 'ฏ ปฏัก', meaning: 'goad', chinese_meaning: '刺棒',
    pronunciation: 'tɔɔ patak', sound: 't', tone_class: 'mid', order_index: 15,
    strokes: ['M40,20 L100,20', 'M70,20 L70,90', 'M55,60 L85,60']
  },
  {
    letter: 'ฐ', name: 'ฐ ฐาน', meaning: 'base', chinese_meaning: '基座',
    pronunciation: 'thɔɔ thǎan', sound: 'th', tone_class: 'high', order_index: 16,
    strokes: ['M40,20 L100,20', 'M70,20 L70,90', 'M55,45 L85,45', 'M55,65 L85,65']
  },
  {
    letter: 'ฑ', name: 'ฑ มณโฑ', meaning: 'Montho', chinese_meaning: '蒙托',
    pronunciation: 'thɔɔ monthoo', sound: 'th', tone_class: 'low', order_index: 17,
    strokes: ['M40,20 L100,20', 'M70,20 L70,90', 'M55,45 L85,45', 'M55,65 L85,65', 'M110,30 Q125,25 140,30']
  },
  {
    letter: 'ฒ', name: 'ฒ ผู้เฒ่า', meaning: 'old man', chinese_meaning: '老人',
    pronunciation: 'thɔɔ phûu thào', sound: 'th', tone_class: 'low', order_index: 18,
    strokes: ['M40,20 L100,20', 'M70,20 L70,90', 'M55,45 L85,45', 'M55,65 L85,65', 'M110,20 L110,50', 'M110,35 L130,35']
  },
  {
    letter: 'ณ', name: 'ณ เณร', meaning: 'novice', chinese_meaning: '沙弥',
    pronunciation: 'nɔɔ neen', sound: 'n', tone_class: 'low', order_index: 19,
    strokes: ['M40,30 L100,30', 'M55,30 L55,90', 'M85,30 L85,90', 'M40,75 Q70,85 100,75']
  },
  {
    letter: 'ด', name: 'ด เด็ก', meaning: 'child', chinese_meaning: '孩子',
    pronunciation: 'dɔɔ dèk', sound: 'd', tone_class: 'mid', order_index: 20,
    strokes: ['M50,30 Q80,20 110,30 Q80,40 50,30', 'M80,30 L80,90']
  },
  {
    letter: 'ต', name: 'ต เต่า', meaning: 'turtle', chinese_meaning: '乌龟',
    pronunciation: 'tɔɔ tào', sound: 't', tone_class: 'mid', order_index: 21,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90']
  },
  {
    letter: 'ถ', name: 'ถ ถุง', meaning: 'bag', chinese_meaning: '袋子',
    pronunciation: 'thɔ̌ɔ thǔng', sound: 'th', tone_class: 'high', order_index: 22,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90', 'M55,60 L85,60']
  },
  {
    letter: 'ท', name: 'ท ทหาร', meaning: 'soldier', chinese_meaning: '士兵',
    pronunciation: 'thɔɔ thahǎan', sound: 'th', tone_class: 'low', order_index: 23,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90', 'M50,65 L90,65']
  },
  {
    letter: 'ธ', name: 'ธ ธง', meaning: 'flag', chinese_meaning: '旗子',
    pronunciation: 'thɔɔ thong', sound: 'th', tone_class: 'low', order_index: 24,
    strokes: ['M40,30 L100,30', 'M70,30 L70,90', 'M50,50 L90,50', 'M50,65 L90,65']
  },
  {
    letter: 'น', name: 'น หนู', meaning: 'mouse', chinese_meaning: '老鼠',
    pronunciation: 'nɔɔ nǔu', sound: 'n', tone_class: 'low', order_index: 25,
    strokes: ['M50,30 Q80,20 110,30 Q80,40 50,30', 'M80,30 L80,90', 'M65,60 L95,60']
  },
  {
    letter: 'บ', name: 'บ ใบไม้', meaning: 'leaf', chinese_meaning: '叶子',
    pronunciation: 'bɔɔ bai máai', sound: 'b', tone_class: 'mid', order_index: 26,
    strokes: ['M50,20 L50,90', 'M50,20 Q80,15 110,20 Q80,25 50,20', 'M50,55 Q80,50 110,55 Q80,60 50,55']
  },
  {
    letter: 'ป', name: 'ป ปลา', meaning: 'fish', chinese_meaning: '鱼',
    pronunciation: 'pɔɔ plaa', sound: 'p', tone_class: 'mid', order_index: 27,
    strokes: ['M40,30 L100,30', 'M40,30 L40,90', 'M40,60 L100,60']
  },
  {
    letter: 'ผ', name: 'ผ ผึ้ง', meaning: 'bee', chinese_meaning: '蜜蜂',
    pronunciation: 'phɔ̌ɔ phɯ̂ng', sound: 'ph', tone_class: 'high', order_index: 28,
    strokes: ['M40,30 L100,30', 'M40,30 L40,90', 'M40,60 L100,60', 'M110,25 Q125,20 140,25 Q125,30 110,25']
  },
  {
    letter: 'ฝ', name: 'ฝ ฝา', meaning: 'lid', chinese_meaning: '盖子',
    pronunciation: 'fɔ̌ɔ fǎa', sound: 'f', tone_class: 'high', order_index: 29,
    strokes: ['M40,30 L100,30', 'M40,30 L40,90', 'M40,60 L100,60', 'M110,40 L125,25', 'M125,40 L110,25']
  },
  {
    letter: 'พ', name: 'พ พาน', meaning: 'tray', chinese_meaning: '托盘',
    pronunciation: 'phɔɔ phaan', sound: 'ph', tone_class: 'low', order_index: 30,
    strokes: ['M40,30 L100,30', 'M40,30 L40,90', 'M40,60 L100,60', 'M110,35 L130,35', 'M120,25 L120,45']
  },
  {
    letter: 'ฟ', name: 'ฟ ฟัน', meaning: 'teeth', chinese_meaning: '牙齿',
    pronunciation: 'fɔɔ fan', sound: 'f', tone_class: 'low', order_index: 31,
    strokes: ['M40,30 L100,30', 'M40,30 L40,90', 'M40,60 L100,60', 'M110,30 Q125,25 140,30 Q125,35 110,30']
  },
  {
    letter: 'ภ', name: 'ภ สำเภา', meaning: 'sailboat', chinese_meaning: '帆船',
    pronunciation: 'phɔɔ samphao', sound: 'ph', tone_class: 'low', order_index: 32,
    strokes: ['M40,30 L100,30', 'M40,30 L40,90', 'M40,60 L100,60', 'M110,20 L110,50', 'M110,35 L130,35', 'M120,25 L120,45']
  },
  {
    letter: 'ม', name: 'ม ม้า', meaning: 'horse', chinese_meaning: '马',
    pronunciation: 'mɔɔ máa', sound: 'm', tone_class: 'low', order_index: 33,
    strokes: ['M50,30 Q80,20 110,30 Q80,40 50,30', 'M80,30 L80,90', 'M65,60 L95,60', 'M50,75 Q70,85 90,75']
  },
  {
    letter: 'ย', name: 'ย ยักษ์', meaning: 'giant', chinese_meaning: '巨人',
    pronunciation: 'yɔɔ yák', sound: 'y', tone_class: 'low', order_index: 34,
    strokes: ['M40,30 Q70,20 100,30', 'M70,30 L70,60', 'M55,60 L85,60', 'M70,60 L70,90']
  },
  {
    letter: 'ร', name: 'ร เรือ', meaning: 'boat', chinese_meaning: '船',
    pronunciation: 'rɔɔ rɯa', sound: 'r', tone_class: 'low', order_index: 35,
    strokes: ['M50,20 L50,90', 'M50,20 Q80,15 110,20 Q80,25 50,20', 'M50,55 Q80,50 110,55']
  },
  {
    letter: 'ล', name: 'ล ลิง', meaning: 'monkey', chinese_meaning: '猴子',
    pronunciation: 'lɔɔ ling', sound: 'l', tone_class: 'low', order_index: 36,
    strokes: ['M50,20 Q80,15 110,20 Q80,25 50,20', 'M80,20 L80,60', 'M65,45 L95,45', 'M80,60 L80,90']
  },
  {
    letter: 'ว', name: 'ว แหวน', meaning: 'ring', chinese_meaning: '戒指',
    pronunciation: 'wɔɔ wɛ̌ɛn', sound: 'w', tone_class: 'low', order_index: 37,
    strokes: ['M50,40 Q80,25 110,40 Q80,55 50,40', 'M80,40 L80,90']
  },
  {
    letter: 'ศ', name: 'ศ ศาลา', meaning: 'pavilion', chinese_meaning: '凉亭',
    pronunciation: 'sɔ̌ɔ sǎalaa', sound: 's', tone_class: 'high', order_index: 38,
    strokes: ['M40,20 L100,20', 'M40,20 L40,50', 'M100,20 L100,50', 'M40,50 L100,50', 'M70,50 L70,90']
  },
  {
    letter: 'ษ', name: 'ษ ฤๅษี', meaning: 'hermit', chinese_meaning: '隐士',
    pronunciation: 'sɔ̌ɔ rɯ̌ɯsǐi', sound: 's', tone_class: 'high', order_index: 39,
    strokes: ['M40,20 L100,20', 'M40,20 L40,50', 'M100,20 L100,50', 'M40,50 L100,50', 'M70,50 L70,90', 'M110,30 Q125,25 140,30']
  },
  {
    letter: 'ส', name: 'ส เสือ', meaning: 'tiger', chinese_meaning: '老虎',
    pronunciation: 'sɔ̌ɔ sɯ̌a', sound: 's', tone_class: 'high', order_index: 40,
    strokes: ['M40,20 L100,20', 'M40,20 L40,50', 'M100,20 L100,50', 'M40,50 L100,50', 'M70,50 L70,90', 'M55,75 Q70,85 85,75']
  },
  {
    letter: 'ห', name: 'ห หีบ', meaning: 'chest', chinese_meaning: '箱子',
    pronunciation: 'hɔ̌ɔ hìip', sound: 'h', tone_class: 'high', order_index: 41,
    strokes: ['M40,20 L40,90', 'M100,20 L100,90', 'M40,55 L100,55']
  },
  {
    letter: 'ฬ', name: 'ฬ จุฬา', meaning: 'kite', chinese_meaning: '风筝',
    pronunciation: 'lɔɔ julaa', sound: 'l', tone_class: 'low', order_index: 42,
    strokes: ['M50,20 Q80,15 110,20 Q80,25 50,20', 'M80,20 L80,60', 'M65,45 L95,45', 'M80,60 L80,90', 'M110,30 Q125,25 140,30']
  },
  {
    letter: 'อ', name: 'อ อ่าง', meaning: 'basin', chinese_meaning: '盆',
    pronunciation: 'ɔɔ àang', sound: 'ɔ', tone_class: 'mid', order_index: 43,
    strokes: ['M50,30 Q80,20 110,30 Q110,60 80,70 Q50,60 50,30']
  },
  {
    letter: 'ฮ', name: 'ฮ นกฮูก', meaning: 'owl', chinese_meaning: '猫头鹰',
    pronunciation: 'hɔɔ nók hûuk', sound: 'h', tone_class: 'low', order_index: 44,
    strokes: ['M40,20 L40,90', 'M100,20 L100,90', 'M40,55 L100,55', 'M110,30 Q125,25 140,30 Q125,35 110,30']
  }
];

// 完整的32个泰语元音数据（前10个）
const thaiVowels = [
  {
    symbol: 'อะ', name: 'สระ อะ', sound: 'a', length: 'short', position: 'after',
    example_word: 'กะ', example_meaning: 'to', chinese_meaning: '短a音', order_index: 1
  },
  {
    symbol: 'อา', name: 'สระ อา', sound: 'aa', length: 'long', position: 'after',
    example_word: 'กา', example_meaning: 'crow', chinese_meaning: '长a音', order_index: 2
  },
  {
    symbol: 'อิ', name: 'สระ อิ', sound: 'i', length: 'short', position: 'above',
    example_word: 'กิ', example_meaning: 'branch', chinese_meaning: '短i音', order_index: 3
  },
  {
    symbol: 'อี', name: 'สระ อี', sound: 'ii', length: 'long', position: 'above',
    example_word: 'กี', example_meaning: 'how many', chinese_meaning: '长i音', order_index: 4
  },
  {
    symbol: 'อึ', name: 'สระ อึ', sound: 'ɯ', length: 'short', position: 'above',
    example_word: 'กึ', example_meaning: 'half', chinese_meaning: '短ɯ音', order_index: 5
  },
  {
    symbol: 'อื', name: 'สระ อื', sound: 'ɯɯ', length: 'long', position: 'above',
    example_word: 'กื', example_meaning: 'almost', chinese_meaning: '长ɯ音', order_index: 6
  },
  {
    symbol: 'อุ', name: 'สระ อุ', sound: 'u', length: 'short', position: 'below',
    example_word: 'กุ', example_meaning: 'you', chinese_meaning: '短u音', order_index: 7
  },
  {
    symbol: 'อู', name: 'สระ อู', sound: 'uu', length: 'long', position: 'below',
    example_word: 'กู', example_meaning: 'I (vulgar)', chinese_meaning: '长u音', order_index: 8
  },
  {
    symbol: 'เอะ', name: 'สระ เอะ', sound: 'e', length: 'short', position: 'before',
    example_word: 'เกะ', example_meaning: 'to clear', chinese_meaning: '短e音', order_index: 9
  },
  {
    symbol: 'เอ', name: 'สระ เอ', sound: 'ee', length: 'long', position: 'before',
    example_word: 'เก', example_meaning: 'to collect', chinese_meaning: '长e音', order_index: 10
  },
  {
    symbol: 'แอะ', name: 'สระ แอะ', sound: 'ɛ', length: 'short', position: 'before',
    example_word: 'แกะ', example_meaning: 'sheep', chinese_meaning: '短ɛ音', order_index: 11
  },
  {
    symbol: 'แอ', name: 'สระ แอ', sound: 'ɛɛ', length: 'long', position: 'before',
    example_word: 'แก', example_meaning: 'to fix', chinese_meaning: '长ɛ音', order_index: 12
  },
  {
    symbol: 'โอะ', name: 'สระ โอะ', sound: 'o', length: 'short', position: 'before',
    example_word: 'โกะ', example_meaning: 'bald', chinese_meaning: '短o音', order_index: 13
  },
  {
    symbol: 'โอ', name: 'สระ โอ', sound: 'oo', length: 'long', position: 'before',
    example_word: 'โก', example_meaning: 'to cheat', chinese_meaning: '长o音', order_index: 14
  },
  {
    symbol: 'เออะ', name: 'สระ เออะ', sound: 'ə', length: 'short', position: 'around',
    example_word: 'เกอะ', example_meaning: 'awkward', chinese_meaning: '短ə音', order_index: 15
  },
  {
    symbol: 'เออ', name: 'สระ เออ', sound: 'əə', length: 'long', position: 'around',
    example_word: 'เกอ', example_meaning: 'to be', chinese_meaning: '长ə音', order_index: 16
  },
  {
    symbol: 'เอียะ', name: 'สระ เอียะ', sound: 'iə', length: 'short', position: 'around',
    example_word: 'เกียะ', example_meaning: 'almost', chinese_meaning: '短iə音', order_index: 17
  },
  {
    symbol: 'เอีย', name: 'สระ เอีย', sound: 'iə', length: 'long', position: 'around',
    example_word: 'เกีย', example_meaning: 'gear', chinese_meaning: '长iə音', order_index: 18
  },
  {
    symbol: 'เอือะ', name: 'สระ เอือะ', sound: 'ɯə', length: 'short', position: 'around',
    example_word: 'เกือะ', example_meaning: 'almost', chinese_meaning: '短ɯə音', order_index: 19
  },
  {
    symbol: 'เอือ', name: 'สระ เอือ', sound: 'ɯə', length: 'long', position: 'around',
    example_word: 'เกือ', example_meaning: 'to move', chinese_meaning: '长ɯə音', order_index: 20
  },
  {
    symbol: 'อัวะ', name: 'สระ อัวะ', sound: 'uə', length: 'short', position: 'around',
    example_word: 'กัวะ', example_meaning: 'temporary', chinese_meaning: '短uə音', order_index: 21
  },
  {
    symbol: 'อัว', name: 'สระ อัว', sound: 'uə', length: 'long', position: 'around',
    example_word: 'กัว', example_meaning: 'to stir', chinese_meaning: '长uə音', order_index: 22
  },
  {
    symbol: 'ไอ', name: 'สระ ไอ', sound: 'ai', length: 'long', position: 'before',
    example_word: 'ไก', example_meaning: 'far', chinese_meaning: 'ai音', order_index: 23
  },
  {
    symbol: 'ใอ', name: 'สระ ใอ', sound: 'ai', length: 'long', position: 'before',
    example_word: 'ใก', example_meaning: 'near', chinese_meaning: 'ai音(2)', order_index: 24
  },
  {
    symbol: 'เอา', name: 'สระ เอา', sound: 'ao', length: 'long', position: 'around',
    example_word: 'เกา', example_meaning: 'to scratch', chinese_meaning: 'ao音', order_index: 25
  },
  {
    symbol: 'อำ', name: 'สระ อำ', sound: 'am', length: 'short', position: 'after',
    example_word: 'กำ', example_meaning: 'to hold', chinese_meaning: 'am音', order_index: 26
  },
  {
    symbol: 'ฤ', name: 'สระ ฤ', sound: 'rɯ', length: 'short', position: 'after',
    example_word: 'กฤ', example_meaning: 'to do', chinese_meaning: '短rɯ音', order_index: 27
  },
  {
    symbol: 'ฤๅ', name: 'สระ ฤๅ', sound: 'rɯɯ', length: 'long', position: 'after',
    example_word: 'กฤๅ', example_meaning: 'very', chinese_meaning: '长rɯ音', order_index: 28
  },
  {
    symbol: 'ฦ', name: 'สระ ฦ', sound: 'lɯ', length: 'short', position: 'after',
    example_word: 'กฦ', example_meaning: 'to', chinese_meaning: '短lɯ音', order_index: 29
  },
  {
    symbol: 'ฦๅ', name: 'สระ ฦๅ', sound: 'lɯɯ', length: 'long', position: 'after',
    example_word: 'กฦๅ', example_meaning: 'very much', chinese_meaning: '长lɯ音', order_index: 30
  },
  {
    symbol: 'อย', name: 'สระ อย', sound: 'ɔi', length: 'long', position: 'after',
    example_word: 'กอย', example_meaning: 'to pile', chinese_meaning: 'ɔi音', order_index: 31
  },
  {
    symbol: 'อว', name: 'สระ อว', sound: 'uə', length: 'long', position: 'after',
    example_word: 'กอว', example_meaning: 'to bend', chinese_meaning: 'uə音(2)', order_index: 32
  }
];

async function populateThaiLetters() {
  try {
    console.log('开始填充泰语字母数据...');
    
    // 检查表是否存在，如果不存在则跳过清除
    console.log('检查表是否存在...');

    // 尝试查询辅音表
    const { error: consonantCheckError } = await supabase
      .from('thai_consonants')
      .select('id')
      .limit(1);

    if (!consonantCheckError) {
      console.log('清除现有辅音数据...');
      const { error: deleteConsonantsError } = await supabase
        .from('thai_consonants')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteConsonantsError) {
        console.error('删除辅音数据时出错:', deleteConsonantsError);
      }
    } else {
      console.log('辅音表不存在，将创建新表');
    }

    // 尝试查询元音表
    const { error: vowelCheckError } = await supabase
      .from('thai_vowels')
      .select('id')
      .limit(1);

    if (!vowelCheckError) {
      console.log('清除现有元音数据...');
      const { error: deleteVowelsError } = await supabase
        .from('thai_vowels')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteVowelsError) {
        console.error('删除元音数据时出错:', deleteVowelsError);
      }
    } else {
      console.log('元音表不存在，将创建新表');
    }
    
    // 插入辅音数据
    console.log(`插入 ${thaiConsonants.length} 个辅音字母...`);
    const { data: consonantsData, error: consonantsError } = await supabase
      .from('thai_consonants')
      .insert(thaiConsonants);
    
    if (consonantsError) {
      console.error('插入辅音数据时出错:', consonantsError);
      return;
    }
    
    console.log(`成功插入 ${thaiConsonants.length} 个辅音字母！`);
    
    // 插入元音数据
    console.log(`插入 ${thaiVowels.length} 个元音...`);
    const { data: vowelsData, error: vowelsError } = await supabase
      .from('thai_vowels')
      .insert(thaiVowels);
    
    if (vowelsError) {
      console.error('插入元音数据时出错:', vowelsError);
      return;
    }
    
    console.log(`成功插入 ${thaiVowels.length} 个元音！`);
    
    // 显示统计信息
    const { data: consonantStats, error: consonantStatsError } = await supabase
      .from('thai_consonants')
      .select('tone_class')
      .order('order_index');
    
    if (!consonantStatsError && consonantStats) {
      const toneStats = consonantStats.reduce((acc, item) => {
        acc[item.tone_class] = (acc[item.tone_class] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n辅音统计:');
      Object.entries(toneStats).forEach(([tone, count]) => {
        console.log(`  ${tone} 音调类: ${count} 个字母`);
      });
      console.log(`  总计: ${consonantStats.length} 个辅音字母`);
    }
    
    const { data: vowelStats, error: vowelStatsError } = await supabase
      .from('thai_vowels')
      .select('length')
      .order('order_index');
    
    if (!vowelStatsError && vowelStats) {
      const lengthStats = vowelStats.reduce((acc, item) => {
        acc[item.length] = (acc[item.length] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n元音统计:');
      Object.entries(lengthStats).forEach(([length, count]) => {
        console.log(`  ${length} 元音: ${count} 个`);
      });
      console.log(`  总计: ${vowelStats.length} 个元音`);
    }
    
    console.log('\n泰语字母数据填充完成！');
    
  } catch (error) {
    console.error('填充过程中发生错误:', error);
  }
}

// 运行填充
populateThaiLetters();
