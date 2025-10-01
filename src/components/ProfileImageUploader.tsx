'use client';

import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { Trans } from '@lingui/react';
import type { ReactElement } from 'react';

type Props = {
  selectedImage: (file: File | null) => void;
  initialPreview?: string | null;
};

// initialPreview prop is only valid when this component is used in editUser flow rather than createUser flow
const ProfileImageUploader: React.FC<Props> = ({ selectedImage, initialPreview }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
  const [status, setStatus] = useState<'none' | 'selected' | 'error'>('none');
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
        <Trans
          id="file.upload.error"
          message="Invalid File size or type. Please upload an image file under 5MB"
        />,
      );
      return;
    }

    setStatus('selected');
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    selectedImage(file);
  };

  const handleRemove = () => {
    selectedImage(null);
    setPreview(null);
    setStatus('none');
    setMessage(null);

    imageInputRef.current!.value = '';
  };

  return (
    <div className="flex min-w-[35rem] flex-col items-center justify-center gap-4 rounded-xl border-2 pb-4">
      <Box
        sx={{
          background: theme.backgroundGradients.buttonPrimaryActive,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 80,
          borderRadius: 'inherit',
        }}
      >
        <Typography variant="h4" color="primary.contrastText">
          <Trans id="account.title" message="HelloCity Account" />
        </Typography>
      </Box>
      <Typography variant="h6">
        <Trans id="profile.avatar.title" message="Profile Picture" />
      </Typography>

      {/* Image Preview Section below ↓ */}

      <Image
        src={!preview ? '/images/default-avatar.jpg' : preview}
        alt={!preview ? 'Default Avatar' : 'Profile Image Preview'}
        width={150}
        height={150}
        className="h-[150px] w-[150px] rounded-full border-2 border-indigo-600 object-cover"
      />

      {status == 'error' && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {' '}
          &nbsp;{message}&nbsp;
        </Typography>
      )}

      {/* Buttons to upload or remove photos */}
      <div className="flex w-4/5 flex-wrap justify-center">
        <Button variant="secondary" component="label" sx={{ width: 200, mx: 1 }}>
          <Trans id="profile.avatar.add" message="Add Profile Picture" />
          <input type="file" hidden ref={imageInputRef} onChange={handleFileChange} />
        </Button>

        {preview && (
          <Button variant="secondary" onClick={handleRemove} sx={{ width: 200, mx: 1 }}>
            <Trans id="profile.avatar.remove" message="Remove Picture" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUploader;
