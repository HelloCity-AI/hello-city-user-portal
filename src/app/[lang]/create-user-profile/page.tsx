'use client';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import type { User } from '@/types/User.types';
import { defaultUser } from '@/types/User.types';
import { createUser } from '@/api/userApi';
import { Trans } from '@lingui/react';
import PersonalInfo from './PersonalInfo';
import { AxiosError } from 'axios';

const Page = () => {
  const [formData, setFormData] = useState<User>(defaultUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password != formData.confirmPassword) {
      alert("Password doesn't match with Confirm Password");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Invalid email format');
      return;
    }
    try {
      console.log('Form Sent: ', formData);
      const response = await createUser(formData);
      localStorage.setItem('userId', response.data.data?.userId);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error('Error:', error.response?.data || error.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex h-[100vh] w-[100vw] items-center justify-center bg-[url('/images/auth-image.jpeg')] bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative flex h-[50%] w-[25%] min-w-[400px] flex-col items-center justify-around rounded-3xl bg-[#ffffff]">
        <div>
          <Typography variant="h3">Hello City</Typography>
        </div>

        <PersonalInfo formData={formData} handleChange={handleChange} />

        <div className="flex gap-2">
          <Button variant="contained" color="primary" sx={{ mr: 'auto' }} type="submit">
            <Trans id="I'm all set" message="I'm all set" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Page;
