'use client';

// I created this for resolve conflicts with the origin page.tsx.  This file is used for showing the visual effect of SCRUM-45 work.

import React from 'react';

import { Banner, NavBar } from '@/components';

import styles from './Homepage.module.scss';

export default function HomePage() {
  return (
    <div className={styles['homepage-container']}>
      <div className={styles['banner-background']} />

      <div className={styles['blur-top']}>
        <NavBar isCustom />
      </div>

      <div className={styles['homepage-content']}>
        <Banner isCustom />
      </div>
    </div>
  );
}
