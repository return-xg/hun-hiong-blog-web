# Hun Hiong Blog Web

个人博客系统前端项目，基于 React 18 + TypeScript + Vite 构建。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| 路由 | React Router v6 |
| 状态管理 | Zustand |
| HTTP 请求 | Axios |
| UI 组件库 | Ant Design 5 |

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
│   └── file.ts           # 文件接口
├── assets/
│   ├── images/           # 图片资源
│   └── styles/
│       ├── global.css    # 全局样式
│       └── variables.css # CSS 变量
├── components/
│   ├── Layout/
│   │   ├── AdminLayout.tsx  # 后台管理布局
│   │   └── BlogLayout.tsx   # 博客前台布局
│   └── ProtectedRoute.tsx   # 路由守卫
├── hooks/                # 自定义 Hooks
├── pages/
│   ├── admin/            # 后台管理页面
│   │   ├── Dashboard.tsx
│   │   ├── ArticleList.tsx
│   │   ├── ArticleEdit.tsx
│   │   ├── CategoryList.tsx
│   │   ├── TagList.tsx
│   │   └── UserList.tsx
│   ├── blog/             # 前台博客页面
│   │   ├── Home.tsx
│   │   ├── ArticleDetail.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── TagPage.tsx
│   │   └── About.tsx
│   └── auth/             # 认证页面
│       ├── Login.tsx
│       └── Register.tsx
├── router/
│   └── index.tsx         # 路由配置
├── store/
│   ├── useAuthStore.ts   # 认证状态（Token、用户信息）
│   └── useAppStore.ts    # 应用全局状态（侧边栏折叠等）
├── types/                # TypeScript 类型定义
│   ├── api.ts            # Result<T>、PageResult<T>
│   ├── auth.ts
│   ├── article.ts
│   ├── category.ts
│   ├── tag.ts
│   ├── user.ts
│   └── file.ts
├── utils/
│   ├── storage.ts        # localStorage 封装
│   └── constants.ts      # 常量配置
├── App.tsx
└── main.tsx
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
- 认证方式：JWT 无状态认证，请求头 `Authorization: Bearer <accessToken>`
- 公开接口：`/auth/login`、`/auth/register`、`/auth/refresh`
- 其余接口均需鉴权
- Token 过期后自动使用 refreshToken 刷新，刷新失败跳转登录页

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

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | Home | 博客首页 |
| `/article/:id` | ArticleDetail | 文章详情 |
| `/category/:id` | CategoryPage | 分类页 |
| `/tag/:id` | TagPage | 标签页 |
| `/about` | About | 关于页面 |
| `/login` | Login | 登录页 |
| `/register` | Register | 注册页 |
| `/admin` | Dashboard | 后台仪表盘（需登录） |
| `/admin/articles` | ArticleList | 文章管理（需登录） |
| `/admin/articles/create` | ArticleEdit | 创建文章（需登录） |
| `/admin/articles/edit/:id` | ArticleEdit | 编辑文章（需登录） |
| `/admin/categories` | CategoryList | 分类管理（需登录） |
| `/admin/tags` | TagList | 标签管理（需登录） |
| `/admin/users` | UserList | 用户管理（需登录） |
