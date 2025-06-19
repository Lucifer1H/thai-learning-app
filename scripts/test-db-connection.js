const { createClient } = require('@supabase/supabase-js');

// 从环境变量读取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqkzozmcgrlvcvfpyicy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3pvem1jZ3JsdmN2ZnB5aWN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI0NjA5MywiZXhwIjoyMDY1ODIyMDkzfQ.7JMu9Ihnl64dbT1t7ZcUyFcLYcJLwS-rRCAMiuC-j0w';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('测试数据库连接...');
    
    // 测试基本连接
    const { data, error } = await supabase
      .from('vocabulary')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('连接测试失败:', error);
      return;
    }
    
    console.log('数据库连接成功！');
    
    // 检查泰语字母表是否存在
    console.log('检查泰语辅音表...');
    const { data: consonantData, error: consonantError } = await supabase
      .from('thai_consonants')
      .select('id')
      .limit(1);
    
    if (consonantError) {
      console.log('辅音表不存在:', consonantError.message);
    } else {
      console.log('辅音表存在，记录数:', consonantData?.length || 0);
    }
    
    console.log('检查泰语元音表...');
    const { data: vowelData, error: vowelError } = await supabase
      .from('thai_vowels')
      .select('id')
      .limit(1);
    
    if (vowelError) {
      console.log('元音表不存在:', vowelError.message);
    } else {
      console.log('元音表存在，记录数:', vowelData?.length || 0);
    }
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 运行测试
testConnection();
