'use client';

import React, { useState } from 'react';
import { Trans } from '@lingui/react';
import { Button, Switch, FormControlLabel, Avatar } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import { useLanguage } from '@/contexts/LanguageContext';

import { Dropdown } from '.';
import { userMenuOptions, languageMenuOptions } from './dropdownMenuOptions';
import styles from './NavBar.module.css';

type Props = {
  isCustom?: boolean;
};

const NavBar = ({ isCustom }: Props) => {
  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Get the language and setLanguage from the LanguageContext.tsx
  const { language, setLanguage, isLanguage } = useLanguage();

  const isEnglish = isLanguage('en');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguage = event.target.checked ? 'en' : 'zh';
    setLanguage(newLanguage);
  };

  if (isCustom) {
    return (
      <div className={styles['navbar-container']}>
        <Link href="/">
          <Image
            src="/images/Logo.png"
            alt="HelloCity Logo"
            width={120}
            height={0}
            style={{ height: 'auto' }}
          />
        </Link>
        <div className={styles['navbar-left']}>
          <Button component={Link} href={`/${language}`} variant="tertiary" passHref>
            Home
          </Button>
          <Button component={Link} href={`/${language}`} variant="tertiary">
            Chat
          </Button>
          <Button component={Link} href={`/${language}`} variant="tertiary">
            FAQ
          </Button>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            href={`/${language}`}
            variant="tertiary"
          >
            Check Items
          </Button>
          <FormControlLabel
            control={<Switch checked={isEnglish} onChange={handleLanguageChange} color="primary" />}
            sx={{ color: 'white' }}
            label={isEnglish ? 'EN' : 'CN'}
          />
        </div>

        <div className={styles['navbar-right']}>
          {isLoggedIn ? (
            <>
              <Button component={Link} href={`/${language}`} variant="tertiary">
                Profile
              </Button>
              <Button component={Link} href={`/${language}`} variant="tertiary">
                Logout
              </Button>
              <Button component={Link} href={`/${language}`} variant="tertiary">
                Language
              </Button>
            </>
          ) : (
            <Button variant="tertiary">Sign In</Button>
          )}

          <Button component={Link} href={`/${language}`} variant="primary">
            Try HelloCity
          </Button>
        </div>
      </div>
    );
  }

  // Default Tailwind version
  return (
    <div className="fixed left-0 top-0 z-10 flex w-[100vw] items-center justify-around pt-5">
      <Link href="/">
        <Image
          src="/images/Logo.png"
          alt="HelloCity Logo"
          width={120}
          height={0}
          style={{ height: 'auto' }}
        />
      </Link>
      <div className="flex gap-2">
        <Link href={`/${language}`}>
          <Button variant="tertiary">
            <Trans id="NaveBar.Home" message="Home" />
          </Button>
        </Link>
        <Link href={`/${language}`}>
          <Button variant="tertiary">
            <Trans id="NaveBar.Chat" message="Chat" />
          </Button>
        </Link>
        <Link href={`/${language}`}>
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

      <div className="flex items-center gap-2">
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
          <>
            <Button component={Link} href={`/${language}`} variant="tertiary">
              <Trans id="NaveBar.Sign In" message="Sign In" />
            </Button>
            <Button variant="tertiary" component={Link} href={`/${language}/create-user-profile`}>
              <Trans id="NaveBar.Sign Up" message="Sign Up" />
            </Button>
          </>
        )}

        <Button component={Link} href={`/${language}`} variant="primary">
          <Trans id="NaveBar.Try HelloCity" message="Try HelloCity" />
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
