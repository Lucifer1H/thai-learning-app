// 输入验证和清理工具

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

// 邮箱验证
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitizedEmail = email.trim().toLowerCase();
  
  if (!sanitizedEmail) {
    return { isValid: false, error: '邮箱地址不能为空' };
  }
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: '请输入有效的邮箱地址' };
  }
  
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: '邮箱地址过长' };
  }
  
  return { isValid: true, sanitizedValue: sanitizedEmail };
}

// 密码验证
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: '密码不能为空' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: '密码至少需要6个字符' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: '密码过长' };
  }
  
  // 检查密码强度
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (password.length < 8 && (!hasLetter || !hasNumber)) {
    return { 
      isValid: false, 
      error: '为了安全，密码应包含字母和数字，或至少8个字符' 
    };
  }
  
  return { isValid: true, sanitizedValue: password };
}

// 姓名验证
export function validateName(name: string): ValidationResult {
  const sanitizedName = sanitizeInput(name).trim();
  
  if (!sanitizedName) {
    return { isValid: false, error: '姓名不能为空' };
  }
  
  if (sanitizedName.length < 2) {
    return { isValid: false, error: '姓名至少需要2个字符' };
  }
  
  if (sanitizedName.length > 50) {
    return { isValid: false, error: '姓名过长' };
  }
  
  // 检查是否包含特殊字符
  const nameRegex = /^[\u4e00-\u9fa5a-zA-Z\s]+$/;
  if (!nameRegex.test(sanitizedName)) {
    return { isValid: false, error: '姓名只能包含中文、英文字母和空格' };
  }
  
  return { isValid: true, sanitizedValue: sanitizedName };
}

// 通用输入清理 - 防止 XSS
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    // 移除 HTML 标签
    .replace(/<[^>]*>/g, '')
    // 移除脚本标签
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // 移除事件处理器
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    // 移除 javascript: 协议
    .replace(/javascript:/gi, '')
    // 移除 data: 协议（除了图片）
    .replace(/data:(?!image)/gi, '')
    // 限制长度
    .slice(0, 1000);
}

// 验证 URL
export function validateUrl(url: string): ValidationResult {
  const sanitizedUrl = url.trim();
  
  if (!sanitizedUrl) {
    return { isValid: false, error: 'URL 不能为空' };
  }
  
  try {
    const urlObj = new URL(sanitizedUrl);
    
    // 只允许 http 和 https 协议
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: '只支持 HTTP 和 HTTPS 协议' };
    }
    
    return { isValid: true, sanitizedValue: sanitizedUrl };
  } catch {
    return { isValid: false, error: '请输入有效的 URL' };
  }
}

// 速率限制检查（简单实现）
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// 清理速率限制记录（定期调用）
export function cleanupRateLimit(): void {
  const now = Date.now();
  const windowMs = 60000;
  
  for (const [key, record] of rateLimitMap.entries()) {
    if (now - record.lastReset > windowMs) {
      rateLimitMap.delete(key);
    }
  }
}
