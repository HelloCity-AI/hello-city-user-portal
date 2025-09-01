'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { Box, Typography, Card, CardContent, Button, Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TestSubIdPage() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // 获取访问令牌
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const data = await response.json();

          if (data.accessToken) {
            setAccessToken(data.accessToken);

            // 解码JWT令牌（仅解码payload部分，不验证签名）
            try {
              const parts = data.accessToken.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                setDecodedToken(payload);
              }
            } catch (decodeError) {
              console.error('解码JWT失败:', decodeError);
              setTokenError('无法解码JWT令牌');
            }
          } else {
            // API返回了会话信息但没有访问令牌
            setTokenError(data.message || '无法获取访问令牌');
          }
        } else {
          const errorData = await response.json();
          setTokenError(errorData.error || '无法获取访问令牌');
        }
      } catch (err) {
        console.error('获取访问令牌失败:', err);
        setTokenError('获取访问令牌时发生错误');
      }
    };

    if (user) {
      fetchAccessToken();
    }
  }, [user]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
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
        <Alert severity="error">加载用户信息时出错: {error.message}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          您尚未登录，请先登录以查看用户信息。
        </Alert>
        <Button variant="contained" color="primary" href="/auth/login" sx={{ mr: 2 }}>
          登录
        </Button>
        <Button variant="outlined" onClick={() => router.back()}>
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
              wordBreak: 'break-all',
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
              fontFamily: 'monospace',
            }}
          >
            {JSON.stringify(user, null, 2)}
          </Box>
        </CardContent>
      </Card>

      {/* JWT访问令牌信息 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="secondary">
            JWT 访问令牌
          </Typography>
          {tokenError ? (
            <Alert severity="error">{tokenError}</Alert>
          ) : accessToken ? (
            <>
              <Typography variant="subtitle2" gutterBottom>
                完整令牌:
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#fff3e0',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '200px',
                }}
              >
                {accessToken}
              </Box>

              {decodedToken && (
                <>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    解码后的令牌内容 (Payload):
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: '#e8f5e8',
                      p: 2,
                      borderRadius: 1,
                      overflow: 'auto',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {JSON.stringify(decodedToken, null, 2)}
                  </Box>
                </>
              )}
            </>
          ) : (
            <CircularProgress size={20} />
          )}
        </CardContent>
      </Card>

      {/* Auth0 会话信息 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="info.main">
            Auth0 会话详细信息
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f0f8ff',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
            }}
          >
            {JSON.stringify(
              {
                isLoading,
                error: error ? String(error) : null,
                userExists: !!user,
                userSub: user?.sub,
                userEmail: user?.email,
                userNickname: user?.nickname,
                userPicture: user?.picture,
                userEmailVerified: user?.email_verified,
                userUpdatedAt: user?.updated_at,
                allUserProperties: Object.keys(user || {}),
              },
              null,
              2,
            )}
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
        <Button variant="outlined" onClick={() => router.back()}>
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
