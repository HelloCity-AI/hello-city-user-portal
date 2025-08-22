import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import InputBox from '@/components/InputBox/InputBox'

const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitted:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputBox
          label="Name"
          value={name}
          onChange={ (e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <InputBox
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <InputBox
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default ContactUs;
