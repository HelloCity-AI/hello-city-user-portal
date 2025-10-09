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
import PersonalInfo from './PersonalInfo';
import { AxiosError } from 'axios';
import Image from 'next/image';
import ProfileImageUploader from '@/components/ProfileImageUploader';
import type { RootState } from '@/store';

const Page = () => {
  const { user, isLoading } = useUser();
  const dispatch = useDispatch();
  const { isCreating, createError, data: userData } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<User>({
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
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    return () => revokeUrl();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectImage = (file: File | null) => {
    revokeUrl();
    if (!file) return setAvatarPreview(null);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    prevObjectUrl.current = url;
    setFormData({ ...formData, avatarFile: file });
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

    if (!formData.username) {
      alert('Please input username');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Invalid email format');
      return;
    }

    dispatch(createUser(formData));
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
        className="relative flex min-h-screen w-full items-center justify-center bg-[url('/images/auth-image.jpeg')] bg-cover bg-center px-4 py-6"
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative flex h-auto min-h-[500px] w-full max-w-md flex-col items-center justify-center rounded-3xl bg-[#ffffff] p-6 sm:min-h-[600px] sm:w-[400px] sm:p-8 md:w-[450px] lg:w-[500px]">
          <div className="mb-6 text-center">
            <Typography variant="h3" className="text-2xl sm:text-3xl">
              Hello City
            </Typography>
          </div>

          {uploaderOpen && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-2">
              <div className="rounded-2xl bg-white px-4 pb-2 pt-8">
                <ProfileImageUploader
                  selectedImage={handleSelectImage}
                  initialPreview={avatarPreview}
                />
                <div className="flex items-center justify-end pt-2">
                  <Typography variant="body2" className="p-2">
                    Return to Sign Up
                  </Typography>
                  <IconButton onClick={() => setUploaderOpen(false)}>
                    <CloseIcon color="primary" fontSize="medium" />
                  </IconButton>
                </div>
              </div>
            </div>
          )}

          <Button
            type="button"
            onClick={() => setUploaderOpen(true)}
            className="mb-6 flex items-center justify-center overflow-hidden rounded-full object-cover"
          >
            <Image
              src={!avatarPreview ? '/images/default-avatar.jpg' : avatarPreview}
              alt={!avatarPreview ? 'Default Avatar' : 'Profile Image Preview'}
              width={100}
              height={100}
              className="h-[100px] w-[100px] rounded-full object-cover"
            />
          </Button>

          <div className="w-full">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <PersonalInfo formData={formData} handleChange={handleChange} />

          <div className="w-full">
            <Button variant="contained" color="primary" fullWidth type="submit" className="mt-4">
              <Trans id="I'm all set" message="I'm all set" />
            </Button>
          </div>
          <div className="w-full">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              className="mt-4"
              disabled={isCreating}
            >
              {isCreating ? (
                <Trans id="Creating..." message="Creating..." />
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
