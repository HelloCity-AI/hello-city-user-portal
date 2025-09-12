'use client';
import React, { useState, useEffect } from 'react';
import { InputBox } from '@/components';
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import { defaultUser } from '@/types/User.types';
import { genderOptions } from '@/enums/UserAttributes';
import ProfileSideBar from '../../../components/ProfileSideBar';
import { updateUser } from '../../../api/userApi';
import { Trans, useLingui } from '@lingui/react';

const Page = () => {
  const { i18n } = useLingui();
  const [tick, setTick] = useState(0);
  const [userInfo, setUserInfo] = useState(defaultUser);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    i18n.on('change', handler);
    return () => {
      i18n.removeListener('change', handler);
    };
  }, [i18n]);

  const OnSubmit = () => {
    updateUser(userInfo);
    // TODO Obtain user info from Redux saga
    // Then Reset/Refresh User Info
  };
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-slate-100" key={tick}>
      <ProfileSideBar />
      <form className="z-10 flex h-auto w-11/12 max-w-4xl flex-col gap-6 rounded-3xl bg-white p-6 lg:w-3/5">
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
              value={userInfo.Email}
              name="Email"
              placeholder={i18n._('profile.email-placeholder', { default: 'Please enter your email' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.nationality', { default: 'Nationality' })}
              value={userInfo.nationality}
              name="nationality"
              placeholder={i18n._('profile.nationality-placeholder', { default: 'Please enter your nationality' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.city', { default: 'City' })}
              value={userInfo.city}
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
              value={userInfo.Gender}
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
              value={userInfo.university}
              name="university"
              placeholder={i18n._('profile.university-placeholder', { default: 'Please enter your university' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.major', { default: 'Major' })}
              value={userInfo.major}
              name="major"
              placeholder={i18n._('profile.major-placeholder', { default: 'Please enter your major' })}
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label={i18n._('profile.preferred-language', { default: 'Preferred Language' })}
              value={userInfo.preferredLanguage}
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
