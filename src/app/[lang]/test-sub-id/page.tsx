'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { Box, Typography, Card, CardContent, Button, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function TestSubIdPage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          正在加载用户信息...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          加载用户信息时出错: {error.message}
        </Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          您尚未登录，请先登录以查看用户信息。
        </Alert>
        <Button
          variant="contained"
          color="primary"
          href="/auth/login"
          sx={{ mr: 2 }}
        >
          登录
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.back()}
        >
          返回
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        用户 Sub ID 测试页面
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ 成功提取到用户信息！
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            用户 Sub ID
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              wordBreak: 'break-all'
            }}
          >
            {user.sub}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            完整用户信息
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.9rem',
              fontFamily: 'monospace'
            }}
          >
            {JSON.stringify(user, null, 2)}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/create-user-profile')}
        >
          前往创建用户资料
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.back()}
        >
          返回
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            window.location.href = '/auth/logout';
          }}
        >
          登出
        </Button>
      </Box>
    </Box>
  );
}