import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// eslint-disable-next-line import/no-named-as-default
import clsx from 'clsx';
import { getServerTranslation } from '@/utils/serverI18n';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';

const overlayLinearGradient =
  'bg-[linear-gradient(to_top,rgba(11,18,32,0)_0%,rgba(11,18,32,0.0)_15%,rgba(11,18,32,0.14)_30%,rgba(11,18,32,0.22)_45%,rgba(11,18,32,0.12)_65%,rgba(11,18,32,0)_100%)]';

const HeroSection = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslation(locale);
  return (
    <SectionBackground
      imgSrc="/images/banner-image.webp"
      imgAlt={t(
        'Hero.BannerAlt',
        'Melbourne skyline at golden hour, welcoming newcomers with HelloCity',
      )}
      additionalWrapperClassName="py-0"
      overlay
      overlayClassName={clsx('absolute inset-0 z-10', overlayLinearGradient)}
      priority
    >
      <SectionContent additionalClassName="text-white h-[100vh] flex items-center pt-5 ">
        <SectionContentArea additionalClassName="flex-col gap-8">
          <Typography
            component="h1"
            variant="h3"
            className="translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            <Typography variant="inherit" component="span" sx={{ color: 'secondary.main' }}>
              {t('Hero.Title.Part1', 'Your AI Companion')} <br />
            </Typography>
            {t('Hero.Title.Part2', 'for Every City')}
          </Typography>
          <Typography
            component="p"
            variant="h5"
            className="max-w-[700px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            {t(
              'Hero.Description',
              'Step-by-step checklists and tailored timelines to make moving into any city simple, clear, and stress-free—for tourists, students, and new migrants.',
            )}
          </Typography>
          <Button
            component={Link}
            href={`/${locale}`}
            variant="primary"
            sx={{ marginTop: '6px' }}
            className="group w-[200px] font-semibold"
          >
            {t('NavBar.Try HelloCity', 'Try HelloCity')}&nbsp;&nbsp;
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
