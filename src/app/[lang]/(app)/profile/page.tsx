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
import {
  genderOptions,
  cityOptions,
  nationalityOptions,
  languageOptions,
  Genders,
  Nationalities,
  Cities,
} from '@/enums/UserAttributes';
import Modal from '../../../../components/Modal';
// Removed incorrect updateUser import from api layer
// import { updateUser } from '../../../../api/userApi';
import { Trans, useLingui } from '@lingui/react';
import { userAttrOptionIds } from '../../../../i18n/userAttributes';
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
    // Use avatarUrl from userData
    setAvatarPreview(userData?.avatarUrl || null);
  }, [userData]);

  useEffect(() => {
    return () => {
      if (prevObjectUrl.current) {
        URL.revokeObjectURL(prevObjectUrl.current);
        prevObjectUrl.current = null;
      }
    };
  }, []);

  // Translate userInfo displayed options using stable IDs in messages.po
  const tGender = (value?: string) => {
    if (!value) return i18n._('profile.not-provided', { default: 'Not provided' });
    const id = userAttrOptionIds.genders[value as keyof typeof userAttrOptionIds.genders];
    return id ? i18n._(id, { default: value }) : value;
  };

  const tNationality = (value?: string) => {
    if (!value) return i18n._('profile.not-provided', { default: 'Not provided' });
    const id =
      userAttrOptionIds.nationalities[value as keyof typeof userAttrOptionIds.nationalities];
    return id ? i18n._(id, { default: value }) : value;
  };

  const tCity = (value?: string) => {
    if (!value) return i18n._('profile.not-provided', { default: 'Not provided' });
    const id = userAttrOptionIds.cities[value as keyof typeof userAttrOptionIds.cities];
    return id ? i18n._(id, { default: value }) : value;
  };

  // Generic fallback for simple string fields
  const tProvided = (value?: string) =>
    value ? String(value) : i18n._('profile.not-provided', { default: 'Not provided' });

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
      <div className="flex items-center justify-center px-4 py-8" key={tick}>
        <div className="hover:shadow-3xl z-10 flex h-auto w-full max-w-4xl flex-col gap-8 rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 md:p-10">
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {/* Header Section */}
          <div className="flex flex-col gap-2 border-b border-gray-200 pb-6">
            <Typography
              variant="h4"
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent"
            >
              <Trans id="profile.title" />
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              <Trans id="profile.subtitle" />
            </Typography>
          </div>

          {/* Avatar Section */}
          <div className="flex justify-center">
            <div className="group relative">
              <Image
                src={avatarPreview || '/images/default-avatar.jpg'}
                alt="Profile Picture"
                width={120}
                height={120}
                className="h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-lg ring-4 ring-blue-100 transition-all duration-300 group-hover:ring-blue-300"
              />
              <div className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="flex flex-col gap-6">
            <Typography variant="h6" className="font-semibold text-gray-800">
              <Trans id="profile.personal-info" />
            </Typography>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Username */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-200 hover:shadow-md">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-wide text-gray-500"
                >
                  {i18n._('profile.username', { default: 'Username' })}
                </Typography>
                <Typography variant="body1" className="mt-2 font-medium text-gray-800">
                  {tProvided(userInfo.username)}
                </Typography>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-200 hover:shadow-md">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-wide text-gray-500"
                >
                  {i18n._('profile.email', { default: 'Email' })}
                </Typography>
                <Typography variant="body1" className="mt-2 font-medium text-gray-800">
                  {tProvided(userInfo.email)}
                </Typography>
              </div>

              {/* Nationality */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-200 hover:shadow-md">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-wide text-gray-500"
                >
                  {i18n._('profile.nationality', { default: 'Nationality' })}
                </Typography>
                <Typography variant="body1" className="mt-2 font-medium text-gray-800">
                  {tNationality(userInfo.nationality)}
                </Typography>
              </div>

              {/* City */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-200 hover:shadow-md">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-wide text-gray-500"
                >
                  {i18n._('profile.city', { default: 'City' })}
                </Typography>
                <Typography variant="body1" className="mt-2 font-medium text-gray-800">
                  {tCity(userInfo.city)}
                </Typography>
              </div>

              {/* Gender */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-200 hover:shadow-md">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-wide text-gray-500"
                >
                  {i18n._('profile.gender', { default: 'Gender' })}
                </Typography>
                <Typography variant="body1" className="mt-2 font-medium text-gray-800">
                  {tGender(userInfo.gender)}
                </Typography>
              </div>

              {/* University */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-200 hover:shadow-md">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-wide text-gray-500"
                >
                  {i18n._('profile.university', { default: 'University' })}
                </Typography>
                <Typography variant="body1" className="mt-2 font-medium text-gray-800">
                  {tProvided(userInfo.university)}
                </Typography>
              </div>

              {/* Major */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-200 hover:shadow-md md:col-span-2">
                <Typography
                  variant="caption"
                  className="font-semibold uppercase tracking-wide text-gray-500"
                >
                  {i18n._('profile.major', { default: 'Major' })}
                </Typography>
                <Typography variant="body1" className="mt-2 font-medium text-gray-800">
                  {tProvided(userInfo.major)}
                </Typography>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="contained"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              <Trans id="profile.edit-button" />
            </Button>
          </div>
        </div>

        <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="md">
          <form
            className="flex flex-col gap-8 p-8"
            onSubmit={(e) => {
              e.preventDefault();
              OnSubmit();
            }}
          >
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
              <Typography
                variant="h4"
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent"
              >
                <Trans id="profile.edit-title" />
              </Typography>
              <Typography variant="body2" className="mt-2 text-gray-600">
                Update your personal information and preferences
              </Typography>
            </div>

            {/* Avatar Section */}
            <div className="flex w-full flex-col items-center justify-center gap-3">
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
                  width={120}
                  height={120}
                  className="h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-lg ring-4 ring-blue-100 transition-all duration-300 group-hover:ring-blue-300"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-1">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <Typography variant="caption" className="text-xs font-semibold text-white">
                      Update Photo
                    </Typography>
                  </div>
                </div>
              </Button>
              <Typography variant="caption" className="text-gray-500">
                Click on the avatar to change your profile picture
              </Typography>
            </div>

            {uploaderOpen && (
              <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-3xl bg-black/50 backdrop-blur-sm">
                <div className="max-h-[90%] w-[90%] max-w-sm overflow-y-auto rounded-3xl bg-white px-6 pb-4 pt-10 shadow-2xl">
                  <ProfileImageUploader
                    selectedImage={handleSelectImage}
                    initialPreview={avatarPreview}
                  />
                  <div className="flex items-center justify-end pt-3">
                    <Typography variant="body2" className="p-2 text-gray-600">
                      <Trans id="profile.edit-title" />
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

            {/* Form Section */}
            <div className="flex flex-col gap-6">
              <Typography variant="h6" className="font-semibold text-gray-800">
                Personal Information
              </Typography>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="flex flex-col gap-5">
                  <TextField
                    fullWidth
                    label={i18n._('profile.username', { default: 'Username' })}
                    name="username"
                    variant="outlined"
                    value={userInfo.username || ''}
                    placeholder={i18n._('profile.username-placeholder', {
                      default: 'Please enter your username',
                    })}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type="email"
                    label={i18n._('profile.email', { default: 'Email' })}
                    name="email"
                    variant="outlined"
                    value={userInfo.email || ''}
                    placeholder={i18n._('profile.email-placeholder', {
                      default: 'Please enter your email',
                    })}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    select
                    label={i18n._('profile.nationality', { default: 'Nationality' })}
                    name="nationality"
                    variant="outlined"
                    required
                    value={userInfo.nationality || ''}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    {nationalityOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Trans
                          id={userAttrOptionIds.nationalities[option as Nationalities]}
                          message={option}
                        />
                      </MenuItem>
                    ))}
                  </TextField>

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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Trans id={userAttrOptionIds.genders[option as Genders]} message={option} />
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-5">
                  <TextField
                    fullWidth
                    label={i18n._('profile.university', { default: 'University' })}
                    name="university"
                    variant="outlined"
                    value={userInfo.university || ''}
                    placeholder={i18n._('profile.university-placeholder', {
                      default: 'Please enter your university',
                    })}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label={i18n._('profile.major', { default: 'Major' })}
                    name="major"
                    variant="outlined"
                    value={userInfo.major || ''}
                    placeholder={i18n._('profile.major-placeholder', {
                      default: 'Please enter your major',
                    })}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    select
                    label={i18n._('profile.city', { default: 'City' })}
                    name="city"
                    variant="outlined"
                    required
                    value={userInfo.city || ''}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                    }}
                  >
                    {cityOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Trans id={userAttrOptionIds.cities[option as Cities]} message={option} />
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* <div style={{ width: '400px', marginBottom: '24px' }}>
                  <TextField
                    fullWidth
                    select
                    label={i18n._('profile.preferred-language', { default: 'Preferred Language' })}
                    name="preferredLanguage"
                    variant="outlined"
                    required
                    value={userInfo.preferredLanguage || ''}
                    onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    helperText=" "
                  >
                    {languageOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </div> */}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setUserInfo(userData || defaultUser)}
                  className="rounded-xl border-2 px-6 py-2.5 transition-all duration-300 hover:shadow-md"
                >
                  <Trans id="profile.refresh" />
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => (setUserInfo(userData || defaultUser), setIsEditModalOpen(false))}
                  className="rounded-xl border-2 px-6 py-2.5 transition-all duration-300 hover:shadow-md"
                >
                  <Trans id="profile.cancel" />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  <Trans id="profile.submit" />
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </ChatMainContentContainer>
  );
};

export default Page;
