'use client';
import React, { useState } from 'react';
import { InputBox } from '@/components';
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import { defaultUser } from '@/types/User.types';
import { genderOptions } from '@/enums/UserAttributes';

const Page = () => {
  const [userInfo, setUserInfo] = useState(defaultUser);

  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-slate-100">
      <div className="fixed left-0 top-0 z-10 flex h-[100%] w-[350px] flex-col bg-white p-5">
        <div className="mt-20 flex flex-grow-[12] flex-col gap-4">
          <Button variant="contained" href="/plans">
            Plans
          </Button>
          <Button variant="contained" href="/history">
            History
          </Button>
          <Button variant="contained" href="/settings">
            Settings
          </Button>
        </div>

        <Button variant="contained" href="/auth/logout">
          Logout
        </Button>
      </div>

      <form className="z-10 flex h-3/5 w-1/2 flex-col gap-6 rounded-3xl bg-white p-6">
        <Typography variant="h5">Profile Settings</Typography>
        <Typography variant="body1">Manage your personal information and preferences</Typography>

        <Typography variant="h5">Personal Information</Typography>

        <div className="flex flex-wrap justify-between gap-6">
          <div className="flex w-full flex-col gap-3 md:w-[48%]">
            <InputBox
              label="Email"
              fieldType="email"
              value={userInfo.Email}
              name="Email"
              placeholder="Please enter your email"
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label="Nationality"
              value={userInfo.nationality}
              name="nationality"
              placeholder="Please enter your nationality"
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label="City"
              value={userInfo.city}
              name="city"
              placeholder="Please enter your city"
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <TextField
              fullWidth
              select
              label="Gender"
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

            <Button variant="contained">Submit</Button>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-[48%]">
            <InputBox
              label="University"
              value={userInfo.university}
              name="university"
              placeholder="please enter your university"
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label="Major"
              value={userInfo.major}
              name="major"
              placeholder="Please enter your major"
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />

            <InputBox
              label="Preferred Language"
              value={userInfo.preferredLanguage}
              name="preferredLanguage"
              placeholder="Please enter your preferred language"
              onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
