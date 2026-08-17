import { Typography, Divider, Tag } from 'antd';
import {
  CodeOutlined,
  CoffeeOutlined,
  BookOutlined,
  EnvironmentOutlined,
  BulbOutlined,
  HeartOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

/** 博客内容方向标签 */
const BLOG_TOPICS = [
  '后端开发实战',
  '新手入门经验',
  '职场成长',
  '应届生求职',
  '跳槽择业心得',
  '城市生活',
  '租房避坑',
  '生活成本规划',
  '数码好物',
  '生活干货',
];

/** 段落卡片组件 */
const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  accentColor?: string;
}> = ({ icon, title, subtitle, children, accentColor = 'var(--primary-color)' }) => (
  <div
    style={{
      padding: '32px 36px',
      background: 'var(--bg-component)',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: 24,
    }}
  >
    {/* 标题行 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: `${accentColor}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          color: accentColor,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <Title
        level={4}
        style={{
          margin: 0,
          fontFamily: 'var(--font-serif)',
          color: 'var(--text-color)',
        }}
      >
        {title}
      </Title>
    </div>
    <Text
      style={{
        display: 'block',
        color: accentColor,
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 20,
        paddingLeft: 48,
      }}
    >
      {subtitle}
    </Text>

    {/* 内容 */}
    <div style={{ paddingLeft: 4 }}>{children}</div>
  </div>
);

const About: React.FC = () => {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Hero 区域 */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          marginBottom: 36,
          padding: '52px 48px',
          background: 'var(--bg-hero)',
          textAlign: 'center',
        }}
      >
        {/* 装饰圆 */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -20,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(91, 164, 164, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -30,
            left: -10,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(232, 131, 107, 0.06)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              fontSize: 13,
              color: 'var(--primary-color)',
              fontWeight: 500,
              letterSpacing: 2,
              marginBottom: 14,
              textTransform: 'uppercase',
            }}
          >
            About Me
          </div>
          <Title
            level={2}
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--text-color)',
              marginBottom: 12,
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            关于我｜一个慢慢沉淀、持续成长的普通人
          </Title>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              color: 'var(--text-secondary)',
              fontSize: 14,
            }}
          >
            <span>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              厦门
            </span>
            <span style={{ color: 'var(--border-color)' }}>·</span>
            <span>
              <CodeOutlined style={{ marginRight: 4 }} />
              后端开发工程师
            </span>
            <span style={{ color: 'var(--border-color)' }}>·</span>
            <span>
              <CoffeeOutlined style={{ marginRight: 4 }} />
              00后打工人
            </span>
          </div>
        </div>
      </div>

      {/* 给思绪一个家 */}
      <SectionCard
        icon={<BulbOutlined />}
        title="给思绪一个家"
        subtitle="搭建这个博客的初衷"
      >
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          搭建这个博客的初衷，不是为了跟风记录，而是想给自己的生活、工作与思考，找一个固定的栖息地。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          在信息碎片化、节奏飞快的当下，大部分想法、经验、踩过的坑，都会随着时间被遗忘。我希望通过文字，沉淀自己的成长轨迹，记录技术、生活、认知的所有细碎进步，也希望在这里，和同频的陌生人温柔相遇。
        </Paragraph>
      </SectionCard>

      {/* 个人简介 */}
      <SectionCard
        icon={<HeartOutlined />}
        title="个人简介"
        subtitle="智慧的小国 · 后端开发工程师"
        accentColor="var(--accent-color)"
      >
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          我是<strong style={{ color: 'var(--text-color)' }}>智慧的小国</strong>，一名拥有三年实战经验的后端开发工程师，00后普通打工人。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          深耕后端开发领域，日常和代码、逻辑、业务架构为伴。相比于盲目追求快节奏内卷，我更偏爱稳扎稳打、循序渐进的成长方式。写代码于我而言，不仅是谋生的技能，更是锻炼逻辑思维、解决复杂问题的修行。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          从初入职场的应届生，到独立处理业务需求的职场人，我经历过试用期的迷茫、职场试错、城市抉择。也正是这些经历，让我愈发明白：<strong style={{ color: 'var(--text-color)' }}>职场没有捷径，持续学习、稳定沉淀，才是普通人最好的底气。</strong>
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          目前定居厦门，在山海小城的慢节奏里，平衡代码工作与日常生活。不追逐浮躁的热闹，偏爱安静深耕、慢慢变好。
        </Paragraph>
      </SectionCard>

      {/* 工作 */}
      <SectionCard
        icon={<CodeOutlined />}
        title="💻 工作｜专注技术，理性成长"
        subtitle="后端开发者的日常"
      >
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          作为后端开发者，我的日常离不开接口开发、逻辑优化、问题排查、项目迭代。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          我习惯结构化思考问题，无论是技术 bug 调试、工作复盘，还是职业规划、薪资成本、城市择业对比，我都喜欢理清底层逻辑、拆解变量、对比最优解。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          我始终相信：<strong style={{ color: 'var(--primary-color)' }}>技术需要深耕，认知需要迭代。</strong>工作之余会持续学习新技术、复盘工作踩坑经验，未来也会在博客持续分享后端开发干货、职场避坑指南、新手成长心得，给刚入行的小伙伴一点参考。
        </Paragraph>
      </SectionCard>

      {/* 生活 */}
      <SectionCard
        icon={<CoffeeOutlined />}
        title="🌿 生活｜热爱生活，向内修行"
        subtitle="认真生活、懂得自愈的普通人"
        accentColor="#6B9E7A"
      >
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          褪去程序员的身份，我只是一个认真生活、懂得自愈的普通人。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          平时喜欢研究生活好物、生活成本规划，擅长对比各类产品、方案的优劣，追求高性价比、实用主义的生活方式。同时，我也在持续学习理财知识，相信时间和复利的力量，用理性规划为未来积累底气，让每一份收入都发挥长期价值。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          闲暇之余，也会偶尔解锁游戏、休闲娱乐，在忙碌的工作之余，给自己留足松弛的空间，张弛有度，好好生活。
        </Paragraph>
      </SectionCard>

      {/* 我的博客 */}
      <SectionCard
        icon={<BookOutlined />}
        title="我的博客｜记录，是为了更好的前行"
        subtitle="个人成长自留地"
        accentColor="var(--accent-color)"
      >
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          这个博客，是我的个人成长自留地。在这里，我不会堆砌华丽的辞藻，只写最真实的内容：
        </Paragraph>

        {/* 内容方向标签 */}
        <div style={{ marginBottom: 20 }}>
          {BLOG_TOPICS.map((topic) => (
            <Tag
              key={topic}
              style={{
                marginBottom: 8,
                background: 'var(--tag-bg)',
                color: 'var(--tag-text)',
                border: 'none',
                borderRadius: 'var(--radius-tag)',
                fontSize: 13,
                padding: '4px 14px',
              }}
            >
              {topic}
            </Tag>
          ))}
        </div>

        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 16,
          }}
        >
          我始终认为，<strong style={{ color: 'var(--text-color)' }}>普通的成长，也值得被记录。</strong>所有的踩坑、感悟、收获、思考，都是独一无二的财富。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          这里没有营销、没有焦虑，只有纯粹的分享与记录。我希望每一个来到这里的人，都能有所收获，找到共鸣。
        </Paragraph>
      </SectionCard>

      {/* 分割线 */}
      <Divider style={{ margin: '36px 0', borderColor: 'var(--border-color)' }} />

      {/* 最后寄语 */}
      <div
        style={{
          padding: '36px 40px',
          background: 'var(--bg-hero)',
          borderRadius: 'var(--radius-card)',
          textAlign: 'center',
          marginBottom: 48,
        }}
      >
        <Title
          level={4}
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-color)',
            marginBottom: 20,
          }}
        >
          最后：与温柔的自己，持续前行
        </Title>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2.2,
            marginBottom: 16,
            fontStyle: 'italic',
          }}
        >
          人生是一场漫长的复利，慢慢来，稳一点，久一点。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2.2,
            marginBottom: 16,
          }}
        >
          未来的日子里，我会持续更新、持续记录，在技术里深耕，在生活里热爱。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--primary-color)',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 2,
            marginBottom: 16,
            fontFamily: 'var(--font-serif)',
          }}
        >
          愿我们都能：清醒自律，稳步成长，在自己的节奏里，岁岁精进，岁岁安然。
        </Paragraph>
        <Paragraph
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            lineHeight: 2,
            marginBottom: 0,
          }}
        >
          也期待，在这里，与你相遇。
        </Paragraph>
      </div>
    </div>
  );
};

export default About;
