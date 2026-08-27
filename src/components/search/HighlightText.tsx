import React from 'react';

interface HighlightTextProps {
  /** 原始文本 */
  text: string;
  /** 搜索关键词 */
  keyword: string;
  /** 高亮 mark 的 CSS 类名 */
  className?: string;
}

/** CJK 统一表意文字范围检测 */
function isCJK(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x4E00 && code <= 0x9FFF) ||   // CJK 基本区
    (code >= 0x3400 && code <= 0x4DBF) ||   // CJK 扩展 A
    (code >= 0x20000 && code <= 0x2A6DF) || // CJK 扩展 B
    (code >= 0xF900 && code <= 0xFAFF)      // CJK 兼容表意文字
  );
}

/** 转义正则表达式中的特殊字符 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 从搜索关键词中提取匹配词列表
 * 1. 按空白字符拆分
 * 2. 对包含 CJK 字符的 token，进一步将 CJK 连续片段和非 CJK 片段分离
 * 3. 去重（大小写不敏感）
 */
function extractKeywords(keyword: string): string[] {
  const trimmed = keyword.trim();
  if (!trimmed) return [];

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const keywords: string[] = [];
  const seen = new Set<string>();

  for (const token of tokens) {
    const hasCJK = Array.from(token).some(isCJK);

    if (!hasCJK) {
      // 纯非 CJK，整体作为一个关键词
      const lower = token.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        keywords.push(token);
      }
    } else {
      // 包含 CJK 字符，按 CJK / 非 CJK 拆分
      const parts: string[] = [];
      let current = '';
      let currentIsCJK = false;

      for (const char of token) {
        const charIsCJK = isCJK(char);

        if (current === '') {
          current = char;
          currentIsCJK = charIsCJK;
        } else if (charIsCJK === currentIsCJK) {
          current += char;
        } else {
          parts.push(current);
          current = char;
          currentIsCJK = charIsCJK;
        }
      }
      if (current) parts.push(current);

      for (const part of parts) {
        // 跳过纯空白/标点片段（长度为 0 或全是非文字字符的情况不跳过，保留精确匹配）
        if (part.trim().length === 0) continue;
        const lower = part.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          keywords.push(part);
        }
      }
    }
  }

  // 按长度降序排列，确保长关键词优先匹配（如 JavaScript 优先于 Java）
  keywords.sort((a, b) => b.length - a.length);
  return keywords;
}

/**
 * 搜索关键词高亮组件
 *
 * 使用纯 React Node 渲染，不使用 dangerouslySetInnerHTML，无 XSS 风险。
 * 匹配大小写不敏感，显示时保留原始文本大小写。
 */
const HighlightText: React.FC<HighlightTextProps> = ({ text, keyword, className = 'search-highlight' }) => {
  if (!text) return null;

  const keywords = extractKeywords(keyword);
  if (keywords.length === 0) return <>{text}</>;

  // 构建合并正则表达式（所有关键词用 | 连接，已按长度降序排列）
  const pattern = keywords.map(escapeRegExp).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  // 收集所有匹配位置
  const matches: Array<{ start: number; end: number }> = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length });
    // 防止零长度匹配导致无限循环
    if (match[0].length === 0) regex.lastIndex++;
  }

  if (matches.length === 0) return <>{text}</>;

  // 按起始位置排序，去除重叠（保留先出现的匹配）
  matches.sort((a, b) => a.start - b.start);
  const nonOverlapping: Array<{ start: number; end: number }> = [];
  let lastEnd = 0;

  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  // 构建 React Node 数组
  const nodes: React.ReactNode[] = [];
  let pos = 0;

  for (const m of nonOverlapping) {
    if (m.start > pos) {
      nodes.push(text.slice(pos, m.start));
    }
    nodes.push(
      <mark key={m.start} className={className}>
        {text.slice(m.start, m.end)}
      </mark>
    );
    pos = m.end;
  }

  if (pos < text.length) {
    nodes.push(text.slice(pos));
  }

  return <>{nodes}</>;
};

export default HighlightText;
