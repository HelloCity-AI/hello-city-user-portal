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

  // Get access token
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const data = await response.json();

          if (data.accessToken) {
            setAccessToken(data.accessToken);

            // Decode JWT token (only decode payload part, do not verify signature)
            try {
              const parts = data.accessToken.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                setDecodedToken(payload);
              }
            } catch (decodeError) {
              console.error('Failed to decode JWT:', decodeError);
              setTokenError('Unable to decode JWT token');
            }
          } else {
            // API returned session info but no access token
            setTokenError(data.message || 'Unable to get access token');
          }
        } else {
          const errorData = await response.json();
          setTokenError(errorData.error || 'Unable to get access token');
        }
      } catch (err) {
        console.error('Failed to get access token:', err);
        setTokenError('Error occurred while getting access token');
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
          Loading user information...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Error loading user information: {error.message}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are not logged in. Please log in first to view user information.
        </Alert>
        <Button variant="contained" color="primary" href="/auth/login" sx={{ mr: 2 }}>
          Login
        </Button>
        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Sub ID Test Page
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ Successfully extracted user information!
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            User Sub ID
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
            Complete User Information
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

      {/* JWT Access Token Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="secondary">
            JWT Access Token
          </Typography>
          {tokenError ? (
            <Alert severity="error">{tokenError}</Alert>
          ) : accessToken ? (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Complete Token:
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
                    Decoded Token Content (Payload):
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

      {/* Auth0 Session Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="info.main">
            Auth0 Session Details
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
          Go to Create User Profile
        </Button>
        <Button variant="outlined" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            window.location.href = '/auth/logout';
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
