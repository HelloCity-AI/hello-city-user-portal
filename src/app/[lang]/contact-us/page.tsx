'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitted:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: '80px' }} key={tick}>
      <Typography variant="h5" gutterBottom>
        <Trans id="contact-us.title">Contact Us</Trans>
      </Typography>

      <form onSubmit={handleSubmit}>
        <InputBox
          label={i18n._('contact-us.name', { default: 'Name' })}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <InputBox
          label={i18n._('contact-us.email', { default: 'Email' })}
          fieldType="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputBox
          label={i18n._('contact-us.message', { default: 'Message' })}
          fieldType="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          <Trans id="contact-us.submit">Submit</Trans>
        </Button>
      </form>
    </Box>
  );
};

export default ContactUs;
