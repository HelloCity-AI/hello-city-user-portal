'use client';

import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { Trans } from '@lingui/react';
import type { ReactElement } from 'react';

const ProfileImageUploader = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'none' | 'uploading' | 'uploaded' | 'error'>('none');
  const [message, setMessage] = useState<ReactElement<typeof Trans> | null>(null);
  const theme = useTheme();

  // Use useRef hook to avoid bug when keep selecting same image from local disk
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      setStatus('error');
      setMessage(
        <Trans id="file.upload.error">
          Invalid File size or type. Please upload an image file under 5MB
        </Trans>,
      );
      return;
    }

    setStatus('uploading');
    setMessage(<Trans id="file.upload.progress">The image is uploading ...</Trans>);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    setTimeout(() => {
      setStatus('uploaded');
      setMessage(<Trans id="file.upload.success">The image is uploaded</Trans>);
    }, 3000);
  };

  const handleRemove = () => {
    setPreview(null);
    setStatus('none');
    setMessage(null);

    imageInputRef.current!.value = '';
  };

  const renderStatus = () => {
    switch (status) {
      case 'uploading':
        return (
          <>
            <CircularProgress sx={{ mt: 2 }} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              &nbsp;{message}&nbsp;
            </Typography>
          </>
        );
      case 'uploaded':
      case 'error':
        return (
          <Typography variant="body2" sx={{ mt: 2 }}>
            &nbsp;{message}&nbsp;
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-w-[35rem] flex-col items-center justify-center rounded-xl border-2 gap-4 pb-4">
      <Box
        sx={{
          background: theme.backgroundGradients.buttonPrimaryActive,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 80,
          borderRadius: "inherit"
        }}
      >
        <Typography variant="h4" color="primary.contrastText">
          <Trans id="account.title">HelloCity Account</Trans>
        </Typography>
      </Box>
      <Typography variant="h6">
        <Trans id="profile.avatar.title">Profile Picture</Trans>
      </Typography>

      {/* Image Preview Section below ↓ */}
      
      <Image 
        src = {!preview || status === 'uploading' ? "/images/default-avatar.jpg" : preview}
        alt = {!preview || status === 'uploading' ? "Default Avatar" : "Profile Image Preview"}
        width = {150}
        height = {150}
        className = "h-[150px] w-[150px] rounded-xl border-2 border-indigo-600 object-cover"
      />

      {renderStatus()}

      {/* Buttons to upload or remove photos */}
      <div className="flex w-4/5 flex-wrap justify-center">
        <Button variant="secondary" component="label"  disabled = {status === 'uploading'}>
          <Trans id="profile.avatar.add">Add Profile Photo</Trans>
          <input type="file" hidden ref={imageInputRef} onChange={handleFileChange} />
        </Button>

        {preview && status !== 'uploading' && (
          <Button variant="secondary" onClick={handleRemove}>
            <Trans id="profile.avatar.remove">Remove Photo</Trans>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUploader;
