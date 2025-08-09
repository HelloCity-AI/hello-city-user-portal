'use client';
import React from 'react';
import { Typography, Button } from '@mui/material';
import styles from './BannerCustom.module.scss';

type Props = {
  isCustom?: boolean;
};

const Banner = ({ isCustom = false }: Props) => {
  if (isCustom) {
    return (
      <div className={styles['banner-container-custom']}>
        <div className={styles['banner-overlay-custom']} />
        <div className={styles['banner-content-custom']}>
          <Typography variant="h2" sx={{ marginTop: '12vh', fontWeight: 'bold' }}>
            Navigate your new city with <br />
            <Typography variant="inherit" component="span" sx={{ color: 'secondary.main' }}>
              Confidence
            </Typography>
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Get personalized guidance step by step checklists, and timeline <br />
            planning for setting into any city. Whether you're a tourist, student or <br />
            migrant
          </Typography>
          <Button variant="primary" sx={{ marginTop: '12px' }}>
            Try HelloCity
          </Button>
        </div>
      </div>
    );
  }

  // Default version with original Tailwind styles
  return (
    <div className="relative h-[57vh] w-screen bg-[url('/images/banner-image.jpeg')] bg-cover bg-center bg-no-repeat text-left">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative ml-[20vw] w-[70%] pt-24 text-white">
        <Typography variant="h2" sx={{ marginTop: '10vh' }}>
          Navigate your new city with <br />
          <Typography variant="inherit" component="span" sx={{ color: 'primary.main' }}>
            confidence
          </Typography>
        </Typography>
        <Typography variant="body1">
          Get personalized guidance step by step checklists, and timeline <br />
          planning for setting into any city. Whether you're a tourist, student or <br />
          migrant
        </Typography>

        <Button variant="primary" sx={{ marginTop: '6px' }}>
          Try HelloCity
        </Button>
      </div>
    </div>
  );
};

export default Banner;
