'use client';
import React, { useState } from 'react';
import { InputBox } from '@/components';
import { Button, Link, Typography } from '@mui/material';
import { defaultUser } from '@/types/User.types';

const Page = () => {
  const [userInfo, setUserInfo] = useState(defaultUser);

  return (
    <div className="bg-slate-100 w-[100vw] h-[100vh] flex justify-center items-center ">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-[350px] bg-white h-[100%] z-10 flex flex-col p-5">
        <div className="flex-grow-[12] flex flex-col gap-4">
          
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

      <form className="bg-white h-3/5 w-1/2 rounded-3xl p-6 flex gap-6 z-10 flex-col">
        <Typography variant="h5">Profile Settings</Typography>
        <Typography variant="body1">
          Manage your personal information and preferences
        </Typography>

        <Typography variant="h5">Personal Information</Typography>

        <div className="flex flex-wrap justify-between gap-6">
          <div className="flex flex-col gap-3 w-full md:w-[48%]">
            <InputBox
              label="Email"
              fieldType="email"
              value={userInfo.Email}
              name="Email"
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />

            <InputBox
              label="Gender"
              value={userInfo.Gender}
              name="Gender"
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />

            <InputBox
              label="Nationality"
              value={userInfo.nationality}
              name="nationality"
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />

            <InputBox
              label="City"
              value={userInfo.city}
              name="city"
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />

            <Button variant="contained">Submit</Button>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-[48%]">
            <InputBox
              label="University"
              value={userInfo.university}
              name="university"
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />

            <InputBox
              label="Major"
              value={userInfo.major}
              name="major"
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />

            <InputBox
              label="Preferred Language"
              value={userInfo.preferredLanguage}
              name="preferredLanguage"
              onChange={(e) =>
                setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
