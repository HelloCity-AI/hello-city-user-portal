'use client';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import type { User } from '@/types/User.types';
import { defaultUser } from '@/types/User.types';
import { createUser } from '@/api/userApi';
import { Trans } from '@lingui/react';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import { AxiosError } from 'axios';

const Page = () => {
  const [pageNumber, setPageNumber] = useState(1);
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

        {pageNumber === 1 && <PageOne formData={formData} handleChange={handleChange} />}
        {pageNumber === 2 && <PageTwo formData={formData} handleChange={handleChange} />}

        <div className="flex gap-2">
          {pageNumber > 1 && (
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 'auto' }}
              onClick={() => {
                setPageNumber(pageNumber - 1);
              }}
            >
              <Trans id="Prev">Prev</Trans>
            </Button>
          )}
          {pageNumber === 2 ? (
            <Button variant="contained" color="primary" sx={{ mr: 'auto' }} type="submit">
              <Trans id="I'm all set">I'm all set</Trans>
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 'auto' }}
              onClick={() => {
                setPageNumber(pageNumber + 1);
              }}
            >
              <Trans id="Next">Next</Trans>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Page;
