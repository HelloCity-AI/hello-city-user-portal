'use client';
import React from 'react';
import { Typography, Button } from '@mui/material';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';
import { useTryHelloCity } from '@/hooks/useTryHelloCity';
// eslint-disable-next-line import/no-named-as-default
import clsx from 'clsx';
import Link from 'next/link';

const overlayLinearGradient =
  ' bg-[linear-gradient(to_top,rgba(11,18,32,0.62)_0%,rgba(11,18,32,0.54)_10%,rgba(11,18,32,0.46)_20%,rgba(11,18,32,0.38)_30%,rgba(11,18,32,0.30)_40%,rgba(11,18,32,0.22)_52%,rgba(11,18,32,0.16)_66%,rgba(11,18,32,0.10)_80%,rgba(11,18,32,0)_100%)]';

const HeroSection = () => {
  const { href: tryHelloCityHref, label: tryHelloCityLabel } = useTryHelloCity();
  return (
    <SectionBackground
      imgSrc="/images/banner-image.webp"
      imgAlt="Melbourne skyline at golden hour, welcoming newcomers with HelloCity"
      overlay
      overlayClassName={clsx('absolute inset-0 z-10', overlayLinearGradient)}
      priority
    >
      <SectionContent additionalClassName="text-white h-[100vh] lg:h-[80vh] flex items-center pt-5 ">
        <SectionContentArea additionalClassName="lg: flex-col gap-8 px-8 md:px-6 xl:px-2">
          <Typography
            component="h1"
            variant="h3"
            className="translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            <Typography variant="inherit" component="span" sx={{ color: 'secondary.main' }}>
              Your AI Companion <br />
            </Typography>
            for Every City
          </Typography>
          <Typography
            component="p"
            variant="h5"
            className="max-w-[700px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          >
            Step-by-step checklists and tailored timelines to make moving into any city simple,
            clear, and stress-free—for tourists, students, and new migrants.
          </Typography>
          <Button
            component={Link}
            href={tryHelloCityHref}
            variant="primary"
            sx={{ marginTop: '6px' }}
            className="group w-[200px] font-semibold"
          >
            {tryHelloCityLabel}&nbsp;&nbsp;
            <Typography component="span" className="transition-transform group-hover:translate-x-2">
              →
            </Typography>
          </Button>
        </SectionContentArea>
      </SectionContent>
    </SectionBackground>
  );
};

export default HeroSection;
