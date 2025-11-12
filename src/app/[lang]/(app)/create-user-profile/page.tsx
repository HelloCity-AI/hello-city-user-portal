'use client';
import { Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useDispatch, useSelector } from 'react-redux';
import type { User } from '@/types/User.types';
import { defaultUser } from '@/types/User.types';
import { createUser } from '@/store/slices/user';
import { Trans, useLingui } from '@lingui/react';
import PersonalInfo from './PersonalInfo';
import { AxiosError } from 'axios';
import Image from 'next/image';
import ProfileImageUploader from '@/components/ProfileImageUploader';
import type { RootState } from '@/store';
import { registerFile } from '@/upload/fileRegistry';

const Page = () => {
  const { i18n } = useLingui();
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

  const setFieldValue = (name: keyof User, value: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValue(name as keyof User, value);
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
        className="relative flex min-h-screen w-full items-center justify-center bg-[url('/images/auth-image.jpeg')] bg-cover bg-center px-4 py-6"
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative flex h-auto max-h-[90vh] w-full max-w-md flex-col items-center justify-center rounded-3xl bg-[#ffffff] p-6 sm:w-[400px] sm:p-8 md:w-[450px] lg:w-[500px]">
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
          <div className="w-full overflow-y-auto">
            <Button
              type="button"
              onClick={() => setUploaderOpen(true)}
              className="mx-auto mb-6 flex min-h-[150px] min-w-[150px] items-center justify-center overflow-hidden rounded-full border border-gray-200 object-cover"
            >
              <Image
                src={!avatarPreview ? '/images/default-avatar.jpg' : avatarPreview}
                alt={!avatarPreview ? 'Default Avatar' : 'Profile Image Preview'}
                width={120}
                height={120}
                className="min-h-[120px] min-w-[120px] rounded-full object-cover"
              />
            </Button>
            <div className="w-full">
              <input
                type="text"
                name="username"
                placeholder={i18n._('profile.username-placeholder', {
                  default: 'Please enter your username',
                })}
                value={userInfo.username}
                onChange={handleChange}
                required
                className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <PersonalInfo userInfo={userInfo} onFieldChange={setFieldValue} />

            <div className="w-full space-y-3">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                className="mt-4"
                disabled={isCreating}
                sx={{
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    boxShadow: 'none',
                  },
                }}
              >
                {isCreating ? (
                  <Trans id="Creating..." message="Creating..." />
                ) : (
                  <Trans id="I'm all set" message="I'm all set" />
                )}
              </Button>

              <Button
                variant="contained"
                fullWidth
                type="button"
                onClick={() => (window.location.href = '/')}
                disabled={isCreating}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'rgba(0, 0, 0, 0.38)',
                    boxShadow: 'none',
                  },
                }}
              >
                <Trans id="Back to Homepage" message="Back to Homepage" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Page;
