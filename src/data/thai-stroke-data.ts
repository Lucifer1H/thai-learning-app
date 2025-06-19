// 泰语字母笔画顺序数据库
// 基于标准泰语书写教学资料

export interface ThaiStrokeData {
  letter: string;
  name: string;
  pronunciation: string;
  meaning: string;
  chinese: string;
  strokes: string[];
  strokeCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 泰语辅音笔画数据
export const thaiConsonantStrokes: ThaiStrokeData[] = [
  {
    letter: 'ก',
    name: 'ก ไก่',
    pronunciation: 'gɔɔ gài',
    meaning: 'chicken',
    chinese: '鸡',
    strokeCount: 3,
    difficulty: 'easy',
    strokes: [
      // 第一笔：左侧圆形头部 - 标准书写顺序
      'M 90 140 C 90 110, 110 90, 140 90 C 170 90, 190 110, 190 140 C 190 170, 170 190, 140 190 C 110 190, 90 170, 90 140 Z',
      // 第二笔：从圆形右侧向右的横线
      'M 190 140 L 260 140',
      // 第三笔：从横线末端向下的竖线
      'M 260 140 L 260 240'
    ]
  },
  {
    letter: 'ข',
    name: 'ข ไข่',
    pronunciation: 'kʰɔɔ kʰài',
    meaning: 'egg',
    chinese: '蛋',
    strokeCount: 3,
    difficulty: 'easy',
    strokes: [
      // 第一笔：左侧圆形头部
      'M 90 140 C 90 110, 110 90, 140 90 C 170 90, 190 110, 190 140 C 190 170, 170 190, 140 190 C 110 190, 90 170, 90 140 Z',
      // 第二笔：从圆形右侧向右的横线
      'M 190 140 L 260 140',
      // 第三笔：从横线末端向下的竖线，带小钩
      'M 260 140 L 260 240 Q 265 245, 270 240'
    ]
  },
  {
    letter: 'ค',
    name: 'ค ควาย',
    pronunciation: 'kʰɔɔ kʰwaai',
    meaning: 'buffalo',
    chinese: '水牛',
    strokeCount: 4,
    difficulty: 'medium',
    strokes: [
      // 第一笔：左侧圆形头部
      'M 90 140 C 90 110, 110 90, 140 90 C 170 90, 190 110, 190 140 C 190 170, 170 190, 140 190 C 110 190, 90 170, 90 140 Z',
      // 第二笔：从圆形右侧向右的横线
      'M 190 140 L 260 140',
      // 第三笔：从横线末端向下的竖线
      'M 260 140 L 260 240',
      // 第四笔：右侧的小横线
      'M 270 160 L 290 160'
    ]
  },
  // 可以继续添加更多字母...
];

// 泰语元音笔画数据
export const thaiVowelStrokes: ThaiStrokeData[] = [
  {
    letter: 'อะ',
    name: 'สระ อะ',
    pronunciation: 'a',
    meaning: 'short a vowel',
    chinese: '短元音a',
    strokeCount: 2,
    difficulty: 'easy',
    strokes: [
      // 基础辅音อ的笔画
      'M 150 100 C 120 100, 100 120, 100 150 C 100 180, 120 200, 150 200 C 180 200, 200 180, 200 150 C 200 120, 180 100, 150 100 Z',
      // 元音符号ะ
      'M 220 180 L 240 180 L 240 200 L 220 200 Z'
    ]
  },
  // 可以继续添加更多元音...
];

// 获取字母笔画数据的工具函数
export function getStrokeData(letter: string): ThaiStrokeData | undefined {
  return [...thaiConsonantStrokes, ...thaiVowelStrokes].find(
    data => data.letter === letter
  );
}

// 按难度筛选字母
export function getLettersByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ThaiStrokeData[] {
  return [...thaiConsonantStrokes, ...thaiVowelStrokes].filter(
    data => data.difficulty === difficulty
  );
}

// 获取所有辅音
export function getAllConsonants(): ThaiStrokeData[] {
  return thaiConsonantStrokes;
}

// 获取所有元音
export function getAllVowels(): ThaiStrokeData[] {
  return thaiVowelStrokes;
}

// 验证笔画数据的完整性
export function validateStrokeData(data: ThaiStrokeData): boolean {
  return (
    data.letter &&
    data.strokes &&
    data.strokes.length === data.strokeCount &&
    data.strokes.every(stroke => stroke.trim().length > 0)
  );
}
