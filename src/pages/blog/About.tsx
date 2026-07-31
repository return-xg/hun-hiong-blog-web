import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* 标题区 */}
      <div
        style={{
          marginBottom: 36,
          padding: '36px 40px',
          background: 'var(--bg-hero)',
          borderRadius: 'var(--radius-card)',
          textAlign: 'center',
        }}
      >
        <Title
          level={2}
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
            marginBottom: 8,
          }}
        >
          关于我
        </Title>
        <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 0, fontSize: 15 }}>
          了解这个博客和它背后的故事
        </Paragraph>
      </div>

      {/* 内容区 */}
      <div
        style={{
          padding: '32px',
          background: 'var(--bg-component)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
          }}
        >
          开发中...
        </Paragraph>
      </div>
    </div>
  );
};

export default About;
