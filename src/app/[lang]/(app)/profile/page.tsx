'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InputBox } from '@/components';
import {
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { defaultUser, type User } from '@/types/User.types';
import { genderOptions } from '@/enums/UserAttributes';
import Modal from '../../../../components/Modal';
// Removed incorrect updateUser import from api layer
// import { updateUser } from '../../../../api/userApi';
import { Trans, useLingui } from '@lingui/react';
import { type RootState } from '@/store';
// Import updateUser action from Redux slice
import { updateUser } from '@/store/slices/user';
import ChatMainContentContainer from '@/components/AppPageSections/ChatMainContentContainer';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import ProfileImageUploader from '@/components/ProfileImageUploader';
import { registerFile } from '@/upload/fileRegistry';

const Page = () => {
  const { i18n } = useLingui();
  const dispatch = useDispatch();
  const { data: userData, isLoading, error } = useSelector((state: RootState) => state.user);
  const [tick, setTick] = useState(0);
  const [userInfo, setUserInfo] = useState<User>(defaultUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploaderOpen, setUploaderOpen] = useState<boolean>(false);
  const [imageId, setImageId] = useState<string | null>(null);
  const prevObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    i18n.on('change', handler);
    return () => {
      i18n.removeListener('change', handler);
    };
  }, [i18n]);

  useEffect(() => {
    setUserInfo(userData || defaultUser);
    setAvatarPreview(userData?.avatar ? String(userData.avatar) : null);
  }, [userData]);

  useEffect(() => {
    return () => {
      if (prevObjectUrl.current) {
        URL.revokeObjectURL(prevObjectUrl.current);
        prevObjectUrl.current = null;
      }
    };
  }, []);

  const handleSelectImage = (file: File | null) => {
    if (prevObjectUrl.current) {
      URL.revokeObjectURL(prevObjectUrl.current);
      prevObjectUrl.current = null;
    }

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
  };

  const OnSubmit = () => {
    // Dispatch Redux action to update user; saga will handle API call
    dispatch(updateUser({ ...(userInfo as any), imageId: imageId ?? undefined } as User));
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-slate-100">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ChatMainContentContainer>
      <div className="flex items-center justify-center px-4" key={tick}>
        <div className="z-10 flex h-auto w-11/12 min-w-[300px] max-w-4xl flex-col gap-6 rounded-3xl p-6 glassmorphism lg:w-[600px]">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="h5">
            <Trans id="profile.title" />
          </Typography>
          <Typography variant="body1">
            <Trans id="profile.subtitle" />
          </Typography>

          <Typography variant="h5">
            <Trans id="profile.personal-info" />
          </Typography>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Typography variant="body2" color="text.secondary">
                {i18n._('profile.email', { default: 'Email' })}
              </Typography>
              <Typography variant="body1">{userInfo.email || 'Not provided'}</Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="body2" color="text.secondary">
                {i18n._('profile.nationality', { default: 'Nationality' })}
              </Typography>
              <Typography variant="body1">{userInfo.nationality || 'Not provided'}</Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="body2" color="text.secondary">
                {i18n._('profile.city', { default: 'City' })}
              </Typography>
              <Typography variant="body1">{userInfo.city || 'Not provided'}</Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="body2" color="text.secondary">
                {i18n._('profile.gender', { default: 'Gender' })}
              </Typography>
              <Typography variant="body1">{userInfo.gender || 'Not provided'}</Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="body2" color="text.secondary">
                {i18n._('profile.university', { default: 'University' })}
              </Typography>
              <Typography variant="body1">{userInfo.university || 'Not provided'}</Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="body2" color="text.secondary">
                {i18n._('profile.major', { default: 'Major' })}
              </Typography>
              <Typography variant="body1">{userInfo.major || 'Not provided'}</Typography>
            </div>

            <div className="flex flex-col gap-2">
              <Typography variant="body2" color="text.secondary">
                {i18n._('profile.preferred-language', { default: 'Preferred Language' })}
              </Typography>
              <Typography variant="body1">
                {userInfo.preferredLanguage || 'Not provided'}
              </Typography>
            </div>
          </div>

          <Button
            variant="contained"
            onClick={() => setIsEditModalOpen(true)}
            className="self-center"
          >
            <Trans id="profile.edit-button" />
          </Button>
        </div>

        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md">
          <form
            className="flex flex-col gap-6 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              OnSubmit();
            }}
          >
            <Typography variant="h6">
              <Trans id="profile.edit-title" />
            </Typography>

            {/* Centered avatar preview & trigger */}
            <div className="flex w-full items-center justify-center py-2">
              <Button
                type="button"
                onClick={() => setUploaderOpen(true)}
                className="flex items-center justify-center overflow-hidden rounded-full object-cover"
              >
                <Image
                  src={!avatarPreview ? '/images/default-avatar.jpg' : avatarPreview}
                  alt={!avatarPreview ? 'Default Avatar' : 'Profile Image Preview'}
                  width={150}
                  height={150}
                  className="h-[150px] w-[150px] rounded-full border-2 border-indigo-600 object-cover"
                />
              </Button>
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
                      <Trans id="profile.edit-title" />
                    </Typography>
                    <IconButton onClick={() => setUploaderOpen(false)}>
                      <CloseIcon color="primary" fontSize="medium" />
                    </IconButton>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
              <div className="flex w-full flex-col gap-3 lg:w-[48%]">
                <InputBox
                  label={i18n._('profile.username', { default: 'Username' })}
                  value={userInfo.username || ''}
                  name="username"
                  placeholder={i18n._('profile.username-placeholder', {
                    default: 'Please enter your username',
                  })}
                  onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                />

                <InputBox
                  label={i18n._('profile.email', { default: 'Email' })}
                  fieldType="email"
                  value={userInfo.email || ''}
                  name="email"
                  placeholder={i18n._('profile.email-placeholder', {
                    default: 'Please enter your email',
                  })}
                  onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                />

                <InputBox
                  label={i18n._('profile.nationality', { default: 'Nationality' })}
                  value={userInfo.nationality || ''}
                  name="nationality"
                  placeholder={i18n._('profile.nationality-placeholder', {
                    default: 'Please enter your nationality',
                  })}
                  onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                />

                <InputBox
                  label={i18n._('profile.city', { default: 'City' })}
                  value={userInfo.city || ''}
                  name="city"
                  placeholder={i18n._('profile.city-placeholder', {
                    default: 'Please enter your city',
                  })}
                  onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                />

                <div style={{ width: '400px', marginBottom: '24px' }}>
                  <TextField
                    fullWidth
                    select
                    label={i18n._('profile.gender', { default: 'Gender' })}
                    name="gender"
                    variant="outlined"
                    required
                    value={userInfo.gender || ''}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    helperText=" "
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 lg:w-[48%]">
                <InputBox
                  label={i18n._('profile.university', { default: 'University' })}
                  value={userInfo.university || ''}
                  name="university"
                  placeholder={i18n._('profile.university-placeholder', {
                    default: 'Please enter your university',
                  })}
                  onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                />

                <InputBox
                  label={i18n._('profile.major', { default: 'Major' })}
                  value={userInfo.major || ''}
                  name="major"
                  placeholder={i18n._('profile.major-placeholder', {
                    default: 'Please enter your major',
                  })}
                  onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                />

                <InputBox
                  label={i18n._('profile.preferred-language', { default: 'Preferred Language' })}
                  value={userInfo.preferredLanguage || ''}
                  name="preferredLanguage"
                  placeholder={i18n._('profile.preferred-language-placeholder', {
                    default: 'Please enter your preferred language',
                  })}
                  onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outlined"
                onClick={() => setUserInfo(userData || defaultUser)}
              >
                <Trans id="profile.refresh" />
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => (setUserInfo(userData || defaultUser), setIsEditModalOpen(false))}
              >
                <Trans id="profile.cancel" />
              </Button>
              <Button type="submit" variant="contained">
                <Trans id="profile.submit" />
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ChatMainContentContainer>
  );
};

export default Page;
