# 🚀 AWS 生产环境部署指南

## 目录

1. [架构概览](#架构概览)
2. [成本分析](#成本分析)
3. [前置准备](#前置准备)
4. [部署步骤](#部署步骤)
5. [流式响应配置](#流式响应配置)
6. [监控与维护](#监控与维护)
7. [故障排除](#故障排除)

## 架构概览

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   用户请求   │────▶│  CloudFront  │────▶│     S3      │
└─────────────┘     │     (CDN)     │     │ (静态资源)  │
                    └───────┬────────┘     └─────────────┘
                            │
                    ┌───────▼────────┐
                    │      EC2        │
                    │   ┌────────┐   │
                    │   │ Nginx  │   │
                    │   └───┬────┘   │
                    │   ┌───▼────┐   │
                    │   │ Docker │   │
                    │   │ Next.js│   │
                    │   └────────┘   │
                    └────────────────┘
                            ▲
                            │
                    ┌───────┴────────┐
                    │      ECR        │
                    │ (Docker 镜像)   │
                    └────────────────┘
```

### 核心组件

| 组件           | 作用                         | 成本              |
| -------------- | ---------------------------- | ----------------- |
| **CloudFront** | CDN 分发，全球加速           | ~$8-10/月 (100GB) |
| **S3**         | 存储静态资源 (\_next/static) | ~$0.5/月 (20GB)   |
| **EC2**        | 运行 Next.js 服务器          | $15/月 (t3.small) |
| **ECR**        | Docker 镜像仓库              | ~$1/月 (10GB)     |
| **Nginx**      | 反向代理，流式优化           | 免费              |

**总成本：约 $25-30/月**

## 成本分析

### 对比方案

| 方案                   | 月成本 | 流式支持  | 扩展性     | 维护难度 |
| ---------------------- | ------ | --------- | ---------- | -------- |
| **本方案** (EC2+S3+CF) | $25-30 | ✅ 完美   | ⭐⭐⭐⭐   | 中等     |
| Amplify Hosting        | $15-20 | ❌ 不支持 | ⭐⭐⭐     | 简单     |
| Vercel Pro             | $20    | ✅ 原生   | ⭐⭐⭐⭐⭐ | 最简单   |
| 纯 EC2                 | $15    | ✅ 支持   | ⭐⭐       | 复杂     |

### 成本优化建议

1. **使用 t3.small 预留实例**：节省 30-50%
2. **S3 智能分层**：自动优化存储成本
3. **CloudFront 价格类别**：选择"仅北美和欧洲"可节省 20%
4. **使用 Spot 实例**：开发环境可节省 70%

## 前置准备

### 1. AWS 账号配置

```bash
# 安装 AWS CLI
brew install awscli  # macOS
# 或
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# 配置 AWS 凭证
aws configure
# AWS Access Key ID: [你的密钥]
# AWS Secret Access Key: [你的密钥]
# Default region name: ap-southeast-2
# Default output format: json
```

### 2. 安装必需工具

```bash
# Docker
brew install --cask docker  # macOS

# Node.js
brew install node@20

# 其他工具
npm install -g pm2
```

### 3. 域名准备（可选）

- 购买域名（Route 53 或其他服务商）
- 准备 SSL 证书（ACM 或 Let's Encrypt）

## 部署步骤

### Step 1: 创建 AWS 资源

运行初始化脚本：

```bash
./scripts/setup-aws.sh
```

这将创建：

- ECR 仓库
- S3 存储桶
- CloudFront 分发
- 必要的 IAM 角色

### Step 2: 配置环境变量

```bash
cp .env.production.example .env.production

# 编辑 .env.production
vim .env.production
```

必需的环境变量：

```env
# 应用配置
NODE_ENV=production
PORT=3000

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SECRET=your-secret

# API
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
NEXT_PUBLIC_PYTHON_SERVICE_URL=http://your-python-service:8000

# OpenAI
OPENAI_API_KEY=sk-...

# CDN
NEXT_PUBLIC_CDN_URL=https://d1234567.cloudfront.net

# 流式配置
CHAT_STREAM_DELAY_MS=15
```

### Step 3: 构建和部署

#### 方式一：手动部署

```bash
# 1. 构建 Docker 镜像
docker build -f docker/Dockerfile.production -t hello-city-frontend .

# 2. 上传静态资源到 S3
npm run build
aws s3 sync .next/static s3://hello-city-static/_next/static \
  --cache-control "public, max-age=31536000, immutable"

# 3. 推送镜像到 ECR
aws ecr get-login-password --region ap-southeast-2 | \
  docker login --username AWS --password-stdin [账号ID].dkr.ecr.ap-southeast-2.amazonaws.com

docker tag hello-city-frontend:latest \
  [账号ID].dkr.ecr.ap-southeast-2.amazonaws.com/hello-city-frontend:latest

docker push [账号ID].dkr.ecr.ap-southeast-2.amazonaws.com/hello-city-frontend:latest

# 4. 在 EC2 上部署
ssh ec2-user@your-ec2-ip
./deploy-on-ec2.sh
```

#### 方式二：一键部署

```bash
./scripts/deploy.sh
```

#### 方式三：CI/CD 自动部署

推送代码到 main 分支即可触发自动部署：

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### Step 4: 验证部署

```bash
# 1. 检查健康状态
curl https://your-domain.com/api/health

# 2. 测试静态资源（应从 CDN）
curl -I https://your-domain.com/_next/static/css/app.css
# 查看: x-cache: Hit from cloudfront

# 3. 测试流式响应
curl -N https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
# 应该看到逐字输出
```

## 流式响应配置

### 关键配置点

#### 1. CloudFront 配置

```json
{
  "CacheBehaviors": [
    {
      "PathPattern": "/api/chat",
      "TargetOriginId": "EC2-Origin",
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
      "Compress": false, // 关键：禁用压缩
      "MinTTL": 0,
      "DefaultTTL": 0,
      "MaxTTL": 0
    }
  ]
}
```

#### 2. Nginx 配置

```nginx
location /api/chat {
    proxy_pass http://localhost:3000/api/chat;
    proxy_buffering off;  # 关键：禁用缓冲
    proxy_cache off;
    proxy_read_timeout 3600s;
    chunked_transfer_encoding on;
    proxy_set_header X-Accel-Buffering no;
}
```

#### 3. Next.js 配置

```javascript
// 使用 Node.js runtime
export const runtime = 'nodejs';

// 响应头
return new Response(stream, {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache, no-store',
    'X-Accel-Buffering': 'no',
  },
});
```

## 监控与维护

### CloudWatch 监控

```bash
# 查看 EC2 指标
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

### 日志查看

```bash
# Docker 日志
docker logs hello-city-frontend --tail 100 -f

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PM2 日志（如果使用）
pm2 logs hello-city
```

### 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新部署
./scripts/deploy.sh

# 或手动更新容器
docker pull [ECR_URI]:latest
docker stop hello-city-frontend
docker rm hello-city-frontend
docker run -d --name hello-city-frontend [ECR_URI]:latest
```

## 故障排除

### 问题 1：流式响应不工作

**症状**：文本一次性显示，没有打字效果

**解决方案**：

1. 检查 CloudFront 缓存策略
2. 验证 Nginx `proxy_buffering off`
3. 确认使用 Node.js runtime

```bash
# 测试直连 EC2（绕过 CloudFront）
curl -N http://ec2-ip:3000/api/chat
```

### 问题 2：静态资源 404

**症状**：CSS/JS 文件无法加载

**解决方案**：

1. 检查 S3 bucket 中是否有文件
2. 验证 CloudFront behavior 配置
3. 检查 Next.js assetPrefix 设置

```bash
# 列出 S3 文件
aws s3 ls s3://hello-city-static/_next/static/
```

### 问题 3：Docker 容器启动失败

**症状**：容器不断重启

**解决方案**：

1. 检查环境变量
2. 查看容器日志
3. 验证端口占用

```bash
# 查看容器日志
docker logs hello-city-frontend

# 检查端口
sudo netstat -tlnp | grep 3000
```

### 问题 4：CloudFront 503 错误

**症状**：网站无法访问

**解决方案**：

1. 检查 EC2 实例状态
2. 验证安全组规则
3. 检查 Origin 健康状态

```bash
# 检查 EC2 状态
aws ec2 describe-instance-status --instance-ids i-xxxxx

# 测试 Origin
curl -I http://ec2-ip/health
```

## 性能优化

### 1. 启用 Gzip 压缩（非流式路径）

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 2. 设置浏览器缓存

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

### 3. 使用 CDN 预热

```bash
# 预热关键资源
aws cloudfront create-invalidation \
  --distribution-id E1234567890 \
  --paths "/_next/static/*"
```

## 安全最佳实践

1. **使用 Secrets Manager** 存储敏感信息
2. **启用 WAF** 保护 CloudFront
3. **配置 CORS** 正确的跨域策略
4. **使用 VPC** 隔离 EC2 实例
5. **定期更新** 依赖和系统补丁

## 备份与恢复

### 自动备份脚本

```bash
#!/bin/bash
# backup.sh

# 备份数据库
docker exec postgres pg_dump -U user dbname > backup_$(date +%Y%m%d).sql

# 备份环境变量
cp .env.production .env.production.backup

# 上传到 S3
aws s3 cp backup_$(date +%Y%m%d).sql s3://hello-city-backups/
```

### 恢复流程

```bash
# 恢复数据库
docker exec -i postgres psql -U user dbname < backup_20240101.sql

# 恢复环境变量
cp .env.production.backup .env.production

# 重启服务
docker restart hello-city-frontend
```

## 联系支持

遇到问题？

1. 查看 [GitHub Issues](https://github.com/your-org/hello-city/issues)
2. 查阅 [AWS 文档](https://docs.aws.amazon.com)
3. 联系 DevOps 团队：devops@your-company.com

---

最后更新：2024年12月
