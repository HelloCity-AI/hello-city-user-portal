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
    <div className="flex w-full max-w-[38rem] flex-col items-center justify-center gap-6 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg">
      {/* Header Section */}
      <div className="flex w-full flex-col items-center gap-2 border-b border-gray-200 pb-6">
        <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <Typography
          variant="h5"
          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent"
        >
          <Trans id="account.title" message="HelloCity Account" />
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          <Trans id="profile.avatar.title" message="Profile Picture" />
        </Typography>
      </div>

      {/* Image Preview Section */}
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 blur-xl"></div>
        <Image
          src={!preview ? '/images/default-avatar.jpg' : preview}
          alt={!preview ? 'Default Avatar' : 'Profile Image Preview'}
          width={140}
          height={140}
          className="relative h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-2xl ring-4 ring-blue-100"
        />
        {preview && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-br from-green-400 to-green-600 p-2 shadow-lg">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Error Message */}
      {status === 'error' && (
        <div className="flex w-full items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <Typography variant="body2" className="text-red-700">
            {message}
          </Typography>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          variant="contained"
          component="label"
          size="small"
          className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
        >
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <Trans id="profile.avatar.add" message="Add Profile Picture" />
          </div>
          <input type="file" hidden ref={imageInputRef} onChange={handleFileChange} />
        </Button>

        {preview && (
          <Button
            variant="outlined"
            onClick={handleRemove}
            size="small"
            className="rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
          >
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <Trans id="profile.avatar.remove" message="Remove Picture" />
            </div>
          </Button>
        )}
      </div>

      {/* Helper Text */}
      <Typography variant="caption" className="text-center text-gray-500">
        Upload a profile picture (JPG, PNG, SVG - Max 5MB)
      </Typography>
    </div>
  );
};

export default ProfileImageUploader;
