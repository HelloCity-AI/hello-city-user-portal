'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InputBox } from '@/components';
import { Button, MenuItem, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { defaultUser, type User } from '@/types/User.types';
import { genderOptions } from '@/enums/UserAttributes';
import ProfileSideBar from '../../../components/ProfileSideBar';
import Modal from '../../../components/Modal';
import { updateUser } from '../../../api/userApi';
import { Trans, useLingui } from '@lingui/react';
import { type RootState } from '@/store';
import { fetchUser } from '@/store/slices/user';

const Page = () => {
  const { i18n } = useLingui();
  const dispatch = useDispatch();
  const { data: userData, isLoading, error } = useSelector((state: RootState) => state.user);
  const [tick, setTick] = useState(0);
  const [userInfo, setUserInfo] = useState<User>(defaultUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    i18n.on('change', handler);
    return () => {
      i18n.removeListener('change', handler);
    };
  }, [i18n]);

  useEffect(() => {
    setUserInfo(userData || defaultUser);
    console.log(userData);
  }, [userData]);

  const OnSubmit = async () => {
    try {
      await updateUser(userInfo);
      dispatch(fetchUser());
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-slate-100">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] w-[100vw] bg-slate-100" key={tick}>
      <ProfileSideBar />
      <div className="ml-[80px] flex flex-1 items-center justify-center pl-4 lg:ml-[15%]">
        <div className="z-10 flex h-auto w-11/12 max-w-4xl flex-col gap-6 rounded-3xl bg-white p-6 lg:w-3/5">
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

        <Modal
          open={isEditModalOpen}
          onClose={() => (setUserInfo(userData || defaultUser), setIsEditModalOpen(false))}
          maxWidth="md"
        >
          <form className="flex flex-col gap-6 p-4">
            <Typography variant="h6">
              <Trans id="profile.edit-title" />
            </Typography>

            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
              <div className="flex w-full flex-col gap-3 lg:w-[48%]">
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
              <Button variant="outlined" onClick={() => setUserInfo(userData || defaultUser)}>
                <Trans id="profile.refresh" />
              </Button>
              <Button
                variant="outlined"
                onClick={() => (setUserInfo(userData || defaultUser), setIsEditModalOpen(false))}
              >
                <Trans id="profile.cancel" />
              </Button>
              <Button variant="contained" onClick={OnSubmit}>
                <Trans id="profile.submit" />
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Page;
