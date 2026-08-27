import { useState, useCallback } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface HeaderSearchProps {
  onSearch: (keyword: string) => void;
}

/** 顶部导航栏搜索框 */
const HeaderSearch: React.FC<HeaderSearchProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSearch = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }, [value, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <Input
      placeholder="搜索文章..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      allowClear
      prefix={<SearchOutlined style={{ color: 'var(--text-light)' }} />}
      style={{
        width: 200,
        borderRadius: 'var(--radius-button)',
        borderColor: 'var(--border-light)',
        background: 'var(--bg-secondary)',
      }}
      size="middle"
    />
  );
};

export default HeaderSearch;
