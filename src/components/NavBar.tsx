'use client';

import React, { useState } from 'react';
import { Trans } from '@lingui/react';
import { Button, Switch, FormControlLabel, Avatar } from '@mui/material';
import Link from 'next/link';

import { useLanguage } from '@/contexts/LanguageContext';

import { Dropdown } from '.';
import { userMenuOptions } from './dropdownMenuOptions';
import styles from './NavBarCustom.module.scss';

type Props = {
  isCustom?: boolean;
};

const NavBar = ({ isCustom }: Props) => {
  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { setLanguage, isLanguage } = useLanguage();
  const isEnglish = isLanguage('en');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguage = event.target.checked ? 'en' : 'zh';
    setLanguage(newLanguage);
  };

  if (isCustom) {
    return (
      <div className={styles['navbar-container']}>
        <img src="/images/Logo.png" alt="HelloCity Logo" width={120} />
        <div className={styles['navbar-left']}>
          <Button component={Link as any} href="/" variant="tertiary">
            <Trans id="Home">Home</Trans>
          </Button>
          <Button component={Link as any} href="/" variant="tertiary">
            <Trans id="Chat">Chat</Trans>
          </Button>
          <Button component={Link as any} href="/" variant="tertiary">
            <Trans id="FAQ">FAQ</Trans>
          </Button>
          <Button onClick={() => setIsExpanded(!isExpanded)} variant="tertiary">
            <Trans id="Check Items">Check Items</Trans>
          </Button>
          <FormControlLabel
            control={<Switch checked={isEnglish} onChange={handleLanguageChange} color="primary" />}
            sx={{ color: 'white' }}
            label={isEnglish ? <Trans id="EN">EN</Trans> : <Trans id="CN">CN</Trans>}
          />
        </div>

        <div className={styles['navbar-right']}>
          {isLoggedIn ? (
            <>
              <Button component={Link as any} href="/" variant="tertiary">
                <Trans id="Profile">Profile</Trans>
              </Button>
              <Button component={Link as any} href="/" variant="tertiary">
                <Trans id="Logout">Logout</Trans>
              </Button>
              <Button component={Link as any} href="/" variant="tertiary">
                <Trans id="Language">Language</Trans>
              </Button>
            </>
          ) : (
            <Button variant="tertiary">
              <Trans id="Sign In">Sign In</Trans>
            </Button>
          )}

          <Button component={Link as any} href="/" variant="primary">
            <Trans id="Try HelloCity">Try HelloCity</Trans>
          </Button>
        </div>
      </div>
    );
  }

  // Default Tailwind version
  return (
    <div className="fixed left-0 top-0 z-10 flex w-[100vw] items-center justify-around pt-5">
      <img src="/images/Logo.png" alt="HelloCity Logo" width={120} />
      <div className="flex gap-2">
        <Button component={Link as any} href="/" variant="tertiary">
          <Trans id="Home">Home</Trans>
        </Button>
        <Button component={Link as any} href="/" variant="tertiary">
          <Trans id="Chat">Chat</Trans>
        </Button>
        <Button component={Link as any} href="/" variant="tertiary">
          <Trans id="FAQ">FAQ</Trans>
        </Button>
        <Button onClick={() => setIsExpanded(!isExpanded)} variant="tertiary">
          <Trans id="Check Items">Check Items</Trans>
        </Button>
        <FormControlLabel
          control={<Switch checked={isEnglish} onChange={handleLanguageChange} color="primary" />}
          sx={{ color: 'white' }}
          label={isEnglish ? <Trans id="EN">EN</Trans> : <Trans id="CN">CN</Trans>}
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
          <div className="flex gap-2">
            <Button component={Link as any} href="/" variant="tertiary">
              <Trans id="Sign In">Sign In</Trans>
            </Button>
            <Button component={Link as any} href="/auth" variant="tertiary">
              <Trans id="Sign Up">Sign Up</Trans>
            </Button>
            <Button component={Link as any} href="/" variant="primary">
              <Trans id="Try HelloCity">Try HelloCity</Trans>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
