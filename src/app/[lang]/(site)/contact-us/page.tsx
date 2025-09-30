'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Paper, CircularProgress } from '@mui/material';
import InputBox from '@/components/InputBox/InputBox';
import { Trans, useLingui } from '@lingui/react';

const ContactUs = () => {
  const { i18n } = useLingui();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    i18n.on('change', handler);
    return () => {
      i18n.removeListener('change', handler);
    };
  }, [i18n]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_EMAIL_API}/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setAlertMessage({
          type: 'success',
          text: 'Message sent successfully!',
        });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setAlertMessage({
          type: 'error',
          text: 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      setAlertMessage({
        type: 'error',
        text: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
      key={tick}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          <Trans id="contact-us.title">Contact Us</Trans>
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          We’d love to hear from you. Fill out the form and we’ll get back to you soon.
        </Typography>

        {alertMessage && (
          <Alert severity={alertMessage.type} sx={{ mb: 2 }}>
            {alertMessage.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputBox
              label={i18n._('contact-us.name', { default: 'Name' })}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />

            <InputBox
              label={i18n._('contact-us.email', { default: 'Email' })}
              fieldType="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <InputBox
              label={i18n._('contact-us.message', { default: 'Message' })}
              fieldType="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
              multiline
              rows={4}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 1, py: 1.5, fontWeight: 'bold', borderRadius: 2 }}
              disabled={loading}
                aria-label="Submit"

            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <Trans id="contact-us.submit">Submit</Trans>
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ContactUs;
