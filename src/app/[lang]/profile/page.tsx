'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InputBox } from '@/components';
import { Button, MenuItem, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { defaultUser, type User } from '@/types/User.types';
import { genderOptions } from '@/enums/UserAttributes';
import ProfileSideBar from '../../../components/ProfileSideBar';
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

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    i18n.on('change', handler);
    return () => {
      i18n.removeListener('change', handler);
    };
  }, [i18n]);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      // Ensure all fields have valid string values, never null/undefined
      setUserInfo({
        ...userData,
        Email: userData.Email || '',
        Avatar: userData.Avatar || '',
        Gender: userData.Gender || '',
        nationality: userData.nationality || '',
        city: userData.city || '',
        university: userData.university || '',
        major: userData.major || '',
        preferredLanguage: userData.preferredLanguage || '',
        userId: userData.userId || '',
        lastJoinDate: userData.lastJoinDate || new Date(),
      });
    } else {
      setUserInfo(defaultUser);
    }
    console.log(userData)
  }, [userData]);

  const OnSubmit = () => {
    updateUser(userInfo);
    // Refresh user info from store after update
    dispatch(fetchUser());
  };
  if (isLoading) {
    return (
      <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-slate-100">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-slate-100" key={tick}>
      <ProfileSideBar />
      <form className="z-10 flex h-auto w-11/12 max-w-4xl flex-col gap-6 rounded-3xl bg-white p-6 lg:w-3/5">
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

        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <div className="flex w-full flex-col gap-3 lg:w-[48%]">
            <InputBox
              label={i18n._('profile.email', { default: 'Email' })}
              fieldType="email"
              value={userInfo.Email || ''}
              name="Email"
              placeholder={i18n._('profile.email-placeholder', { default: 'Please enter your email' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.nationality', { default: 'Nationality' })}
              value={userInfo.nationality || ''}
              name="nationality"
              placeholder={i18n._('profile.nationality-placeholder', { default: 'Please enter your nationality' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.city', { default: 'City' })}
              value={userInfo.city || ''}
              name="city"
              placeholder={i18n._('profile.city-placeholder', { default: 'Please enter your city' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <TextField
              fullWidth
              select
              label={i18n._('profile.gender', { default: 'Gender' })}
              name="Gender"
              variant="outlined"
              required
              value={userInfo.Gender || ''}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
              sx={{ marginBottom: '30px' }}
            >
              {genderOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-[48%]">
            <InputBox
              label={i18n._('profile.university', { default: 'University' })}
              value={userInfo.university || ''}
              name="university"
              placeholder={i18n._('profile.university-placeholder', { default: 'Please enter your university' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.major', { default: 'Major' })}
              value={userInfo.major || ''}
              name="major"
              placeholder={i18n._('profile.major-placeholder', { default: 'Please enter your major' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.preferred-language', { default: 'Preferred Language' })}
              value={userInfo.preferredLanguage || ''}
              name="preferredLanguage"
              placeholder={i18n._('profile.preferred-language-placeholder', { default: 'Please enter your preferred language' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />
          </div>
        </div>

        <Button variant="contained" type="submit" onClick={OnSubmit} className="self-center">
          <Trans id="profile.submit" />
        </Button>
      </form>
    </div>
  );
};

export default Page;
