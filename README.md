# Hun Hiong Blog Web

个人博客系统前端项目，基于 React 18 + TypeScript + Vite 构建。包含前台博客展示、后台管理系统和音乐播放器三大模块。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript 5.6 |
| 构建工具 | Vite 6 |
| 路由 | React Router v6（`createBrowserRouter`） |
| 状态管理 | Zustand 5 |
| HTTP 请求 | Axios（JWT 双 Token 自动刷新） |
| UI 组件库 | Ant Design 5 |
| 富文本编辑器 | WangEditor 5 |
| 图表库 | Recharts |

## 目录结构

```
src/
├── api/                  # API 接口模块
│   ├── request.ts        # Axios 封装（拦截器、Token 刷新、错误处理）
│   ├── auth.ts           # 认证接口
│   ├── article.ts        # 文章接口
│   ├── category.ts       # 分类接口
│   ├── tag.ts            # 标签接口
│   ├── user.ts           # 用户接口
│   ├── file.ts           # 文件接口
│   ├── music.ts          # 音乐接口
│   └── dashboard.ts      # 仪表盘统计接口
├── assets/
│   ├── images/           # 图片资源
│   ├── hero.png          # 首页主视觉图
│   └── styles/
│       ├── global.css    # 全局样式
│       └── variables.css # CSS 变量
├── components/
│   ├── Layout/
│   │   ├── AdminLayout.tsx  # 后台管理布局
│   │   └── BlogLayout.tsx   # 博客前台布局
│   ├── LoginModal.tsx       # 登录弹窗
│   ├── RegisterModal.tsx    # 注册弹窗
│   ├── MusicPlayer.tsx      # 音乐播放器
│   ├── MusicList.tsx        # 歌曲列表面板
│   └── ProtectedRoute.tsx   # 路由守卫
├── hooks/                # 自定义 Hooks
├── pages/
│   ├── admin/            # 后台管理页面
│   │   ├── Dashboard.tsx     # 仪表盘（含统计图表）
│   │   ├── ArticleList.tsx   # 文章管理
│   │   ├── ArticleEdit.tsx   # 文章编辑（富文本编辑器）
│   │   ├── CategoryList.tsx  # 分类管理
│   │   ├── TagList.tsx       # 标签管理
│   │   ├── UserList.tsx      # 用户管理
│   │   └── MusicManage.tsx   # 音乐管理
│   ├── blog/             # 前台博客页面
│   │   ├── Home.tsx          # 首页
│   │   ├── ArticleDetail.tsx # 文章详情
│   │   ├── CategoryPage.tsx  # 分类页
│   │   ├── TagPage.tsx       # 标签页
│   │   ├── About.tsx         # 关于页面
│   │   └── Profile.tsx       # 个人中心
│   └── auth/             # 认证页面（已改为弹窗形式，保留目录）
│       ├── Login.tsx
│       └── Register.tsx
├── router/
│   └── index.tsx         # 路由配置
├── store/
│   ├── useAuthStore.ts       # 认证状态（Token、用户信息）
│   ├── useAppStore.ts        # 应用全局状态
│   ├── useMusicStore.ts      # 音乐播放状态
│   └── useMusicManageStore.ts # 音乐管理状态
├── types/                # TypeScript 类型定义
│   ├── api.ts            # Result<T>、PageResult<T>
│   ├── auth.ts
│   ├── article.ts
│   ├── category.ts
│   ├── tag.ts
│   ├── user.ts
│   ├── file.ts
│   ├── music.ts          # 音乐相关类型
│   └── dashboard.ts      # 仪表盘统计类型
├── utils/
│   ├── storage.ts        # localStorage 封装
│   ├── constants.ts      # 常量配置
│   └── audioManager.ts   # 音频播放管理器（HTMLAudioElement 封装）
├── App.tsx               # 根组件（ConfigProvider + RouterProvider）
└── main.tsx              # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`，并将 `/api` 请求代理到后端 `http://localhost:8080`。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 环境变量

在 `.env` 文件中配置：

```
VITE_API_BASE_URL=http://localhost:8080
```

## 后端对接

- 后端地址：`http://localhost:8080`
- 认证方式：JWT 双 Token 无状态认证（accessToken + refreshToken），请求头 `Authorization: Bearer <accessToken>`
- 公开接口：`/auth/login`、`/auth/register`、`/auth/refresh`
- 其余接口均需鉴权
- Token 过期后自动使用 refreshToken 刷新，刷新失败清除状态并跳转登录页
- 登录 / 注册采用弹窗形式，无需跳转独立页面

### 统一响应格式

```typescript
interface Result<T> {
  code: number;       // 0 表示成功
  message: string;
  data: T;
}

interface PageResult<T> {
  current: number;
  size: number;
  total: number;
  pages: number;
  records: T[];
}
```

## 路由结构

### 前台博客（BlogLayout）

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 博客首页 |
| `/article/:id` | ArticleDetail | 文章详情 |
| `/category/:id` | CategoryPage | 分类页 |
| `/tag/:id` | TagPage | 标签页 |
| `/about` | About | 关于页面 |
| `/profile` | Profile | 个人中心 |

### 认证路由

| 路径 | 说明 |
|------|------|
| `/login` | 重定向到首页（登录通过弹窗完成） |
| `/register` | 重定向到首页（注册通过弹窗完成） |

### 后台管理（AdminLayout，均需登录）

| 路径 | 页面 | 说明 |
|------|------|------|
| `/admin` | Dashboard | 仪表盘（含统计图表） |
| `/admin/articles` | ArticleList | 文章管理 |
| `/admin/articles/create` | ArticleEdit | 创建文章 |
| `/admin/articles/edit/:id` | ArticleEdit | 编辑文章 |
| `/admin/categories` | CategoryList | 分类管理 |
| `/admin/tags` | TagList | 标签管理 |
| `/admin/users` | UserList | 用户管理 |
| `/admin/music` | MusicManage | 音乐管理 |

### 兜底

`*` — 重定向到 `/`
