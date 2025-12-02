'use client';
import { Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useDispatch, useSelector } from 'react-redux';
import type { User } from '@/types/User.types';
import { defaultUser } from '@/types/User.types';
import { createUser } from '@/store/slices/user';
import { Trans } from '@lingui/react';
import { i18n } from '@/i18n';
import PersonalInfo from './PersonalInfo';
import { AxiosError } from 'axios';
import Image from 'next/image';
import ProfileImageUploader from '@/components/ProfileImageUploader';
import type { RootState } from '@/store';
import { registerFile } from '@/upload/fileRegistry';

const Page = () => {
  const { user, isLoading } = useUser();
  const dispatch = useDispatch();
  const { isCreating, createError, data: userData } = useSelector((state: RootState) => state.user);
  const [imageId, setImageId] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState<User>({
    ...defaultUser,
    userId: '', // This will be used as username
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploaderOpen, setUploaderOpen] = useState<boolean>(false);
  const prevObjectUrl = useRef<string | null>(null);

  const revokeUrl = () => {
    if (prevObjectUrl.current) {
      URL.revokeObjectURL(prevObjectUrl.current);
      prevObjectUrl.current = null;
    }
  };

  // Set Email after Auth0 user information is loaded
  useEffect(() => {
    if (user?.email) {
      setUserInfo((prev) => ({
        ...prev,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    return () => revokeUrl();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSelectImage = (file: File | null) => {
    revokeUrl();
    if (!file) {
      setAvatarPreview(null);
      setImageId(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    prevObjectUrl.current = url;
    const id = crypto.randomUUID();
    setImageId(id);
    registerFile(id, file);
    console.log('imageFile is selected: ', file);
  };

  // Handle successful user creation
  useEffect(() => {
    if (userData && !isCreating && !createError) {
      // After successful creation, redirect to homepage
      // Note: Removed localStorage storage to avoid PII data leakage risk
      window.location.href = '/';
    }
  }, [userData, isCreating, createError]);

  // Handle creation errors
  useEffect(() => {
    if (createError) {
      alert('Failed to create user: ' + createError);
    }
  }, [createError]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInfo.username) {
      alert('Please input username');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      alert('Invalid email format');
      return;
    }

    dispatch(createUser({ ...userInfo, imageId: imageId ?? undefined }));
  };

  // If user information is loading, show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Typography>Loading user information...</Typography>
      </div>
    );
  }

  // If no user information, redirect to login page
  if (!user) {
    window.location.href = '/auth/login';
    return null;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8"
      >
        <div className="absolute inset-0 bg-[url('/images/auth-image.jpeg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

        <div className="hover:shadow-3xl relative flex h-auto min-h-[600px] w-full max-w-md flex-col items-center justify-start overflow-hidden rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 sm:min-h-[650px] sm:w-[440px] sm:p-10 md:w-[480px] lg:w-[520px]">
          {/* Header */}
          <div className="mb-6 text-center">
            <Typography
              variant="h3"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
            >
              Hello City
            </Typography>
            <Typography variant="body2" className="mt-2 text-gray-600">
              Create your profile to get started
            </Typography>
          </div>

          {/* Image Uploader Modal */}
          {uploaderOpen && (
            <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-3xl bg-black/50 backdrop-blur-sm">
              <div className="max-h-[90%] w-[90%] max-w-sm overflow-y-auto rounded-3xl bg-white px-6 pb-4 pt-10 shadow-2xl">
                <ProfileImageUploader
                  selectedImage={handleSelectImage}
                  initialPreview={avatarPreview}
                />
                <div className="flex items-center justify-end pt-3">
                  <Typography variant="body2" className="p-2 text-gray-600">
                    Return to Sign Up
                  </Typography>
                  <IconButton
                    onClick={() => setUploaderOpen(false)}
                    className="transition-colors hover:bg-blue-50"
                  >
                    <CloseIcon color="primary" fontSize="medium" />
                  </IconButton>
                </div>
              </div>
            </div>
          )}

          {/* Avatar Section */}
          <div className="relative mb-6">
            <Button
              type="button"
              onClick={() => setUploaderOpen(true)}
              className="group relative flex items-center justify-center overflow-hidden rounded-full p-0 transition-all duration-300 hover:scale-105"
              sx={{ minWidth: 0 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
              <Image
                src={!avatarPreview ? '/images/default-avatar.jpg' : avatarPreview}
                alt={!avatarPreview ? 'Default Avatar' : 'Profile Image Preview'}
                width={100}
                height={100}
                className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:border-blue-300"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Typography variant="caption" className="text-xs font-semibold text-white">
                  Change Photo
                </Typography>
              </div>
            </Button>
          </div>

          {/* Username Input */}
          <div className="mb-5 w-full">
            <input
              type="text"
              name="username"
              placeholder={i18n._('profile.username-placeholder', {
                default: 'Please enter your username',
              })}
              value={userInfo.username}
              onChange={handleChange}
              required
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Personal Info Fields */}
          <PersonalInfo userInfo={userInfo} handleChange={handleChange} />

          {/* Submit Button */}
          <div className="mt-6 w-full">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={isCreating}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 text-base font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500"
            >
              {isCreating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <Trans id="Creating..." message="Creating..." />
                </div>
              ) : (
                <Trans id="I'm all set" message="I'm all set" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Page;
