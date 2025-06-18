// 简单的构建测试脚本
const { execSync } = require('child_process');

console.log('🔍 开始测试应用构建...');

try {
  console.log('📦 检查依赖安装...');
  execSync('npm list --depth=0', { stdio: 'inherit' });
  
  console.log('✅ 依赖检查通过');
  
  console.log('🔧 检查TypeScript配置...');
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'inherit' });
  
  console.log('✅ TypeScript检查通过');
  
  console.log('🎯 所有基本检查都通过了！');
  
} catch (error) {
  console.error('❌ 测试失败:', error.message);
  process.exit(1);
}
