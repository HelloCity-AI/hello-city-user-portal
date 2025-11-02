[![English Version](https://img.shields.io/badge/Docs-English-green?style=flat-square)](./README.md)

# Hello City Client

一个由 Next.js 15、React 19、TypeScript、Material-UI、Tailwind CSS、Redux Toolkit 构建，并提供完善国际化支持的现代前端项目。

## 📋 目录

1. [环境要求](#1-环境要求)
2. [快速开始](#2-快速开始)
3. [环境配置](#3-环境配置)
4. [开发命令](#4-开发命令)
5. [核心特性](#5-核心特性)
6. [Git 钩子 (Husky)](#6-git-钩子-husky)
7. [技术栈](#7-技术栈)
8. [项目结构](#8-项目结构)
9. [开发工作流](#9-开发工作流)
10. [注意事项](#10-注意事项)

## 1. 环境要求

- Node.js: **>=20.19.0 或 >=22.12.0** (推荐使用 Node 22 LTS)
- 包管理工具：npm (推荐 v9+)，或 yarn/pnpm/bun
- 本地环境变量文件
  - 在项目根目录创建 `.env.local`，并复制 `.env.example` 中的常量名
  - 当前 `.env.local` 中包含启用以下功能所需的常量：
    - Auth0
    - 后端 API 调用

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

5. **配置环境变量** (详见下文环境配置章节)

6. **在浏览器中访问** [http://localhost:3000](http://localhost:3000)

## 3. 环境配置

**必需：** 在项目根目录创建 `.env.local` 文件：

```bash
# macOS/Linux
cp .env.example .env.local

# Windows
copy .env.example .env.local
```

将 `.env.local` 填入实际配置值：

- **Auth0 配置：**
  - `AUTH0_DOMAIN` - Auth0 域名
  - `AUTH0_CLIENT_ID` - Auth0 应用客户端 ID
  - `AUTH0_CLIENT_SECRET` - Auth0 应用客户端密钥
  - `AUTH0_SECRET` - Auth0 会话密钥（生成命令：`openssl rand -hex 32`）
  - `AUTH0_AUDIENCE` - Auth0 API audience（Auth0 v4 必需）
  - `APP_BASE_URL` - 应用基础 URL
    - 开发环境：`http://localhost:3000`
    - 生产环境：`https://your-domain.com`

- **后端服务：**
  - `BACKEND_URL` - 后端 API 基础地址（默认 http://localhost:5000）
  - `NEXT_PUBLIC_EMAIL_API` - 邮件服务 API 端点（用于联系表单）
  - `PYTHON_SERVICE_URL` - Python AI 服务地址（默认 http://localhost:8000）
  - `FRONTEND_API_KEY` - 用于验证 Python AI 服务请求的 API Key（生成：`openssl rand -base64 32`）

- **聊天配置（可选）：**
  - `CHAT_STREAM_DELAY_MS` - 打字机效果延迟（单位：毫秒，默认 15）
    - 15ms - 快速流畅（默认）
    - 25ms - 中等速度
    - 40-60ms - 较慢、沉稳的效果

- **生产部署配置（Vercel 必需）：**
  - `AUTH_TRUST_HOST` - 设置为 `true` 以信任 Vercel 反向代理转发的主机头（NextAuth 必需）
  - `NPM_CONFIG_PRODUCTION` - 设置为 `false` 确保构建时安装 devDependencies（`lingui:compile` 必需）

**提示：** 尽量联系团队负责人获取真实环境配置值。

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

创建 PR 前必须通过所有单元测试。

```bash
# 运行所有测试
npm run test

# 监听模式（文件变更时自动重新运行）
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
# 代码中提取文案
npm run lingui:extract

# 编译提取的文案
npm run lingui:compile

# 添加新文案后必须运行的组合命令
npm run lingui:extract && npm run lingui:compile
```

### Storybook

用于交互式组件文档与开发。

**首次使用（推荐）：**

```bash
# 先构建 Storybook，后续启动更快
npm run build-storybook

# 然后启动开发服务器
npm run storybook
```

**日常开发：**

```bash
# 启动 Storybook 开发服务器（必要时自动构建）
npm run storybook
```

Storybook 会查找 `stories/` 目录中的 `.stories.tsx` 文件。

**访问地址：** [http://localhost:6006](http://localhost:6006)

## 5. 核心特性

### AI 智能对话助手

基于 OpenAI GPT 的实时 AI 对话体验，并支持生成智能任务清单。

**功能亮点：**

- **流式响应：** 借助 Vercel AI SDK，通过 SSE 提供实时流式回复，可配置打字机效果
- **会话管理：** 创建、查看并管理多轮对话记录
- **智能清单：** AI 异步生成城市任务清单并自动更新
- **多语言支持：** 完整支持 5 种语言 (en, zh_CN, zh_TW, ja, ko) 的国际化体验
- **Node.js 运行时：** 在生产环境中使用 Node.js 运行时以精确控制流式与打字机效果

**架构特点：**

- **路由分组：** 采用 Next.js Route Groups，将受保护页面与公共页面分离
  - `/assistant` - AI 对话界面（需登录）
  - `/profile` - 用户资料管理（需登录）
  - `/` - 营销落地页（公开）
  - `/contact-us` - 联系表单（公开）

**技术选型：**

- Vercel AI SDK (`@ai-sdk/react`, `ai`)
- OpenAI GPT 集成
- Redux Saga 负责状态管理中的副作用
- 基于服务端推送 (SSE) 的实时响应

## 6. Git 钩子 (Husky)

自动执行以下代码质量检查：

- ✅ 代码格式化 (Prettier)
- ✅ 代码检查 (ESLint)
- ✅ 类型检查 (TypeScript)
- ✅ 测试验证
- ✅ 提交消息格式

**设置方式：** 在任意平台执行 `npm install` 时会自动配置。

## 7. 技术栈

### 核心框架

- [Next.js 15](https://nextjs.org/) - 带 App Router 的 React 框架
- [React 19](https://react.dev/) - UI 库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

### UI 与样式

- [Material-UI v7.2+](https://mui.com/) - React 组件库
- [MUI X Date Pickers](https://mui.com/x/react-date-pickers/) - 高级日期时间组件
- [Radix UI](https://www.radix-ui.com/) - 无样式、无障碍 UI 基础组件
  - Avatar、Dropdown Menu、Select、Slot 等组件
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- 自定义主题（品牌色彩与渐变）

### 状态管理

- [Redux Toolkit](https://redux-toolkit.js.org/) - 状态管理
- [Redux Saga](https://redux-saga.js.org/) - 副作用管理

### AI 与流式能力

- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI 聊天流接口
- [OpenAI](https://openai.com/) - GPT 驱动的对话响应

### 认证与 API

- [Auth0](https://auth0.com/) - 身份认证与授权
- [Axios](https://axios-http.com/) - HTTP 客户端

### 国际化

- [Lingui](https://lingui.js.org/) - 国际化库
- 支持 5 种语言：英文 (en)、简体中文 (zh_CN)、繁体中文 (zh_TW)、日文 (ja)、韩文 (ko)

### 开发工具

- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react) - 测试
- [Storybook](https://storybook.js.org/) - 组件文档
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - 代码质量
- [Husky](https://typicode.github.io/husky/) - Git 钩子

## 8. 项目结构

```
src/
├── app/[lang]/             # Next.js App Router，支持 i18n 路由
│   ├── (app)/              # 需要认证的应用页面
│   │   ├── assistant/      # AI 对话助手
│   │   ├── profile/        # 用户资料
│   │   └── create-user-profile/  # 资料创建流程
│   ├── (site)/             # 公共营销页面
│   │   ├── page.tsx        # 落地页
│   │   └── contact-us/     # 联系表单
│   └── api/                # Next.js API 路由
│       └── chat/           # OpenAI 聊天流式接口
├── components/             # 原子化可复用组件
│   ├── ai-elements/        # AI 相关 UI 组件
│   └── AppPageSections/    # 应用布局片段
├── compoundComponents/     # 多部分复杂组件
│   ├── ChatPage/           # AI 对话功能相关组件
│   │   ├── ChatMainArea/   # 主对话界面
│   │   ├── ChatSidebar/    # 对话历史
│   │   └── ChecklistPanel/ # 城市任务清单面板
│   ├── NavBar/             # 导航栏
│   ├── Menus/              # 下拉菜单
│   └── Modals/             # 模态框
├── store/                  # Redux 状态管理
│   ├── slices/             # Redux 切片（用户、对话、清单）
│   ├── sagas/              # Redux Saga 文件（userSaga、conversationSaga、checklistSaga）
│   └── helpers/            # 纯函数工具（reduxChecklistHelpers.ts）
├── lib/                    # 第三方配置与 API 客户端
│   └── api-client.ts       # Axios 后端 HTTP 客户端（统一 API 层）
├── api/                    # 类型定义与数据转换
│   └── transformers/       # 后端 ↔ 前端数据格式转换
├── contexts/               # React Context（语言、I18n）
├── hooks/                  # 自定义 React hooks
├── locales/                # 国际化消息目录（en/zh PO 格式）
├── types/                  # TypeScript 类型定义
├── utils/                  # 工具函数
└── theme/                  # Material-UI 主题配置
```

### 关键配置文件

- `tailwind.config.ts` - Tailwind CSS 配置（自定义主题）
- `src/theme/` - Material-UI 主题（品牌色彩）
- `jest.config.ts` + `jest.setup.ts` - 测试配置
- `lingui.config.js` - 国际化设置
- `.storybook/` - Storybook 配置

## 9. 开发工作流

### 添加新功能

1. 在 `src/components/` 中创建组件
2. 需要全局状态时，在 `src/store/slices/` 中添加 Redux 切片
3. 在 `src/stories/` 中编写 Storybook 故事
4. 在 `__tests__/` 目录中补充测试
5. 所有用户可见文本使用 `<Trans>` 组件
6. 添加文本后运行 `npm run lingui:extract && npm run lingui:compile`

### 语言支持

- **英文**：`/en/` 路由（默认）
- **简体中文**：`/zh_CN/` 路由
- **繁体中文**：`/zh_TW/` 路由
- **日文**：`/ja/` 路由
- **韩文**：`/ko/` 路由
- 始终使用 `<Trans>` 包裹用户可见文案
- 开发流程中需测试所有语言

### 代码质量

- Husky pre-commit 钩子自动运行
- 创建 PR 前必须通过全部测试
- ESLint 与 Prettier 强制执行代码规范
- TypeScript 启用严格模式

### 身份认证

- Auth0 负责用户认证
- 使用 `fetchWithAuth` 工具发送认证过的 API 请求
- 用户状态由 Redux 管理

## 10. 注意事项

- 所有依赖均使用精确版本（无需 `^` 前缀），MUI 超过 7.2 可能出现兼容性问题
- 已启用 TypeScript 严格模式，提供全面的类型检查
