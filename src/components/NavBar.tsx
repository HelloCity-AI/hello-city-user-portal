'use client';

import React, { useState } from 'react';
import { Button, Switch, FormControlLabel, Avatar } from '@mui/material';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trans } from '@lingui/react';
import Link from 'next/link';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';

import { Dropdown } from '.';
import { userMenuOptions, languageMenuOptions } from './dropdownMenuOptions';

const NavBar = () => {
  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Get the language and setLanguage from the LanguageContext.tsx
  const { language, setLanguage, isLanguage } = useLanguage();

  const isEnglish = isLanguage('en');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguage = event.target.checked ? 'en' : 'zh';
    setLanguage(newLanguage);
  };

  return (
    <div className="fixed left-0 top-0 z-10 flex w-[100vw] items-center justify-around pt-5">
      <img src="/images/Logo.png" alt="HelloCity Logo" width={120} />
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="tertiary">
            <Trans id="NaveBar.Home" message="Home" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="tertiary">
            <Trans id="NaveBar.Chat" message="Chat" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="tertiary">
            <Trans id="NaveBar.FAQ" message="FAQ" />
          </Button>
        </Link>
        <Button onClick={() => setIsExpanded(!isExpanded)} variant="tertiary">
          <Trans id="NaveBar.Check Items" message="Check Items" />
        </Button>
        <FormControlLabel
          control={<Switch checked={isEnglish} onChange={handleLanguageChange} color="primary" />}
          sx={{ color: 'white' }}
          label={isEnglish ? 'EN' : 'CN'}
        />
      </div>

      <div>
        {isLoggedIn ? (
          <Dropdown
            anchorElContent={
              <Avatar
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                src="/images/banner-image.jpeg"
                alt="User Avatar"
              />
            }
            dropdownOptions={userMenuOptions}
            showUserLabel
          />
        ) : (
          <Button variant="tertiary">
            <Trans id="NaveBar.Sign In" message="Sign In" />
          </Button>
        )}

        <Link href="/">
          <Button variant="primary">
            <Trans id="NaveBar.Try HelloCity" message="Try HelloCity" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
