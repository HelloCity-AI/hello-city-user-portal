# Dockerfile
FROM node:18-alpine AS base

# 设置工作目录
WORKDIR /app

# 复制 package.json 和锁文件
COPY package.json package-lock.json ./

# 依赖安装阶段
FROM base AS deps
# 安装所有依赖
RUN npm ci

# 构建阶段
FROM base AS builder

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 设置环境变量 - 强制跳过检查
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

# 提取和编译国际化文件
RUN npm run extract
RUN npm run compile

# 跳过 lint，直接构建 
RUN npm run build

# 运行时阶段
FROM node:18-alpine AS runner

WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public

# 复制 Next.js 构建输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]