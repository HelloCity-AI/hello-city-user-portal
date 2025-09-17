'use client';
import { Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import type { User } from '@/types/User.types';
import { defaultUser } from '@/types/User.types';
import { createUser } from '@/api/userApi';
import { Trans } from '@lingui/react';
import PersonalInfo from './PersonalInfo';
import { AxiosError } from 'axios';
import Image from 'next/image';
import ProfileImageUploader from '@/components/ProfileImageUploader';

const Page = () => {
  const { user, isLoading } = useUser();
  const [formData, setFormData] = useState<User>({
    ...defaultUser,
    userId: '', // This will be used as username
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploaderOpen, setUploaderOpen] = useState<boolean>(false);
  const prevObjectUrlRef = useRef<string | null>(null);

  // Set Email after Auth0 user information is loaded
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        Email: user.email || prev.Email,
      }));
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (prevObjectUrlRef.current) {
        URL.revokeObjectURL(prevObjectUrlRef.current);
        prevObjectUrlRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectImage = (file: File | null) => {
    setProfileImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      if (prevObjectUrlRef.current) URL.revokeObjectURL(prevObjectUrlRef.current);
      prevObjectUrlRef.current = url;
      setAvatarPreview(url);
    } else {
      if (prevObjectUrlRef.current) {
        URL.revokeObjectURL(prevObjectUrlRef.current);
        prevObjectUrlRef.current = null;
      }
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.userId) {
      alert('Please input username');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      alert('Invalid email format');
      return;
    }

    const payload = { ...formData, avatarFile: profileImage };

    try {
      console.log('Form Sent: ', payload);
      const response = await createUser(payload);
      localStorage.setItem('userData', JSON.stringify(response.data?.data));
      // After successful creation, can redirect to homepage or other pages
      window.location.href = '/';
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error:', error.response?.data || error.message);
        alert('Failed to create user: ' + (error.response?.data?.message || error.message));
      }
    }
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
      {uploaderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
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

          <button
            type="button"
            onClick={() => setUploaderOpen(true)}
            className="mb-6 flex items-center justify-center overflow-hidden rounded-xl border-2 border-indigo-600 object-cover"
          >
            <Image
              src={!avatarPreview ? '/images/default-avatar.jpg' : avatarPreview}
              alt={!avatarPreview ? 'Default Avatar' : 'Profile Image Preview'}
              width={100}
              height={100}
              className="border-1 h-[100px] w-[100px] rounded-xl object-cover"
            />
          </button>

          <div className="w-full">
            <input
              type="text"
              name="userId"
              placeholder="Username"
              value={formData.userId}
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
        </div>
      </form>
    </>
  );
};

export default Page;
