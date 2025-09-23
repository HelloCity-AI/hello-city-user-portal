[![English Version](https://img.shields.io/badge/Docs-English-green?style=flat-square)](./README.md)

# Hello City Client

一个基于 Next.js 14、React 18、TypeScript、Material-UI、Tailwind CSS、Redux Toolkit 和完整国际化支持的现代前端项目。

## 📋 目录

1. [环境要求](#1-环境要求)
2. [快速开始](#2-快速开始)
3. [环境配置](#3-环境配置)
4. [开发命令](#4-开发命令)
5. [Git 钩子 (Husky)](#5-git-钩子-husky)
6. [技术栈](#6-技术栈)
7. [项目结构](#7-项目结构)
8. [开发工作流](#8-开发工作流)
9. [注意事项](#9-注意事项)

## 1. 环境要求

- Node.js: **>=20.19.0 或 >=22.12.0** (推荐 Node 22 LTS)
- 包管理工具: npm (推荐 v9+)
- 本地环境文件设置 (见下方环境配置)

## 2. 快速开始

1. **克隆项目并进入目录：**

   ```bash
   git clone <repo-url/ssh>
   cd HelloCityUserPortal
   ```

2. **安装依赖：**

   ```bash
   npm install  # 或 npm ci
   # 或
   yarn install --frozen-lockfile  # 或 yarn ci
   # 或
   pnpm install --frozen-lockfile  # 或 pnpm ci
   # 或
   bun install --frozen-lockfile
   ```

3. **编译国际化消息：**

   ```bash
   npm run lingui:compile
   ```

4. **启动开发服务器：**

   ```bash
   npm run dev
   # 或 yarn dev / pnpm dev / bun dev
   ```

5. **设置环境变量** (见下方环境配置)

6. **在浏览器中访问** [http://localhost:3000](http://localhost:3000)

## 3. 环境配置

**必需：** 在项目根目录创建 `.env.local` 文件：

```bash
# macOS/Linux
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

填入实际配置值：

- **Auth0 配置：**
  - `AUTH0_SECRET` - 32位随机字符串
  - `AUTH0_BASE_URL` - 应用URL (开发环境: http://localhost:3000)
  - `AUTH0_ISSUER_BASE_URL` - Auth0 域名
  - `AUTH0_CLIENT_ID` - Auth0 应用客户端ID
  - `AUTH0_CLIENT_SECRET` - Auth0 应用客户端密钥

- **后端 API：**
  - `NEXT_PUBLIC_API_BASE_URL` - 后端API基础URL

**注意：** 请联系团队负责人获取实际环境配置值。

## 4. 开发命令

### 核心开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 类型检查
npm run type-check
```

### 代码质量

```bash
# 代码检查
npm run lint          # 检查问题
npm run lint:fix      # 自动修复问题

# 代码格式化
npm run format:check  # 检查格式
npm run format:fix    # 修复格式

# 综合修复
npm run fix           # 同时运行 lint:fix 和 format:fix
```

### 测试

创建PR前必须通过所有单元测试。

```bash
# 运行所有测试
npm run test

# 监听模式 (文件变化时重新运行)
npm run test:watch

# 生成覆盖率报告
npm run test:coverage

# 端到端测试
npm run test:e2e
```

测试文件位置：

- `**/__tests__/**/*.test.tsx`
- `**/*.test.tsx`, `**/*.spec.tsx`

### 国际化

```bash
# 从代码中提取消息
npm run lingui:extract

# 编译提取的消息
npm run lingui:compile

# 两步合并 (添加新文本后必需)
npm run lingui:extract && npm run lingui:compile
```

### Storybook

交互式组件文档和开发工具。

**首次设置 (推荐)：**

```bash
# 先构建 Storybook (后续启动更快)
npm run build-storybook

# 然后启动开发服务器
npm run storybook
```

**日常开发：**

```bash
# 启动 Storybook 开发服务器 (需要时自动构建)
npm run storybook
```

Storybook 会查找 `stories/` 目录中的 `.stories.tsx` 文件。

**访问 Storybook：** [http://localhost:6006](http://localhost:6006)

## 5. Git 钩子 (Husky)

自动执行代码质量标准检查：

- ✅ 代码格式化 (Prettier)
- ✅ 代码检查 (ESLint)
- ✅ 类型检查 (TypeScript)
- ✅ 测试验证
- ✅ 提交消息格式

**设置：** 在所有平台上执行 `npm install` 时自动配置。

## 6. 技术栈

### 核心框架

- [Next.js 14](https://nextjs.org/) - 带 App Router 的 React 框架
- [React 18](https://react.dev/) - UI 库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

### UI 和样式

- [Material-UI v7.2+](https://mui.com/) - React 组件库
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) - 高级日期时间组件
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- 自定义主题 (品牌色彩和渐变)

### 状态管理

- [Redux Toolkit](https://redux-toolkit.js.org/) - 状态管理
- [Redux Saga](https://redux-saga.js.org/) - 副作用管理

### 认证和 API

- [Auth0](https://auth0.com/) - 身份认证和授权
- [Axios](https://axios-http.com/) - HTTP 客户端

### 国际化

- [Lingui](https://lingui.js.org/) - i18n 库
- 支持英文和中文

### 开发工具

- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react) - 测试
- [Storybook](https://storybook.js.org/) - 组件文档
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - 代码质量
- [Husky](https://typicode.github.io/husky/) - Git 钩子

## 7. 项目结构

```
src/
├── app/[lang]/             # Next.js App Router 动态语言路由
├── components/             # 原子化可复用组件
├── compoundComponents/     # 复杂多部分组件 (NavBar, Modals)
├── store/                  # Redux Toolkit + Saga 状态管理
├── api/                    # API 层 (Auth0 认证)
├── contexts/               # React contexts (语言, I18n)
├── hooks/                  # 自定义 React hooks
├── locales/                # i18n 消息目录 (en/zh po格式)
├── stories/                # Storybook 组件文档
├── types/                  # TypeScript 类型定义
├── utils/                  # 工具函数 (fetchWithAuth, serverI18n)
├── lib/                    # 第三方库配置
├── theme/                  # Material-UI 主题配置
└── enums/                  # TypeScript 枚举
```

### 关键配置文件

- `tailwind.config.ts` - Tailwind CSS 配置 (自定义主题)
- `src/theme/` - Material-UI 主题 (品牌色彩)
- `jest.config.ts` + `jest.setup.ts` - 测试配置
- `lingui.config.js` - 国际化设置
- `.storybook/` - Storybook 配置

## 8. 开发工作流

### 添加新功能

1. 在 `src/components/` 中创建组件
2. 如需要在 `src/store/slices/` 中添加 Redux 状态
3. 在 `src/stories/` 中添加 Storybook 故事
4. 在 `__tests__/` 目录中编写测试
5. 对所有用户界面文本使用 `<Trans>` 组件
6. 添加文本后运行 `npm run lingui:extract && npm run lingui:compile`

### 语言支持

- **英文**: `/en/` 路由 (默认)
- **中文**: `/zh/` 路由
- 始终用 `<Trans>` 组件包装用户界面文本
- 开发过程中测试两种语言

### 代码质量

- Husky pre-commit 钩子自动运行
- 创建PR前所有测试必须通过
- ESLint 和 Prettier 强制执行代码标准
- 启用 TypeScript 严格模式

### 身份认证

- Auth0 处理用户认证
- 使用 `fetchWithAuth` 工具进行认证API调用
- 用户状态通过 Redux 管理

## 9. 注意事项

- 所有依赖使用精确版本 (无 `^` 前缀),MUI超过7.2会有不兼容情况
- 启用 TypeScript 严格模式和全面类型检查
