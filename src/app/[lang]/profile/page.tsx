'use client';
import React from 'react'
import UserProfileCard from '../../../components/UserLabel';
import { InputBox } from '@/components';
import { Button, Link, Typography } from '@mui/material';
import { defaultUser } from '@/types/User.types';
import { useState } from 'react';

const page = () => {
  const [userInfo, setUserInfo] = useState(defaultUser);
  return (
    <div className='bg-slate-100 w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='fixed top-0 left-0 w-[350px] bg-white h-[100%] z-10 flex flex-col p-5'>
        <div className='flex-grow-[12] flex flex-col'>
          <Link href="/profile">
            Profile
          </Link>
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
      <div className='bg-white h-1/2 w-1/2 rounded-3xl p-6 flex gap-4 z-10 flex-col'>
          <Typography variant='h5'>
            Profile Settings
          </Typography>
          <Typography variant='body1'>
            Manage your personal information and preferences
          </Typography>
          <UserProfileCard/>
          <Typography variant='h5'>
            Personal Information
          </Typography>
          <div className=''>
            <InputBox
              label="Username"
              fieldType="name"
              value={userInfo.username}
              name='username'
              onChange={(e)=>(setUserInfo({...userInfo, [e.target.name]: e.target.value}))}
            />

            <InputBox
              label="Email"
              fieldType="name"
              value={''}
              onChange={()=>(null)}
            />
            
              <div className='flex justify-between flex-row'>
                <div className='w-1/2'>
                  <InputBox
                    label="Password"
                    fieldType="name"
                    value={''}
                    onChange={()=>(null)}
                  />
                </div>
              </div>
              <Button>
                Submit
              </Button>
            
          </div>
        
        
      </div>
    </div>
  )
}

export default page