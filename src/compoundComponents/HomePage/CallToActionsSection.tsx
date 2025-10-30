import React from 'react';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import { getServerTranslation } from '@/utils/serverI18n';
import Typography from '@mui/material/Typography';
import { TryHelloCityButton } from '@/components/HomePage/TryHelloCityButton';

const CallToActionsSection = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslation(locale);
  return (
    <SectionBackground bgColor="primary">
      <SectionContent>
        <Typography component="h3" variant="h4" color="white">
          {t('CallToAction.Title', 'Ready to make your move?')}
        </Typography>
        <Typography variant="body1" color="white">
          {t(
            'CallToAction.Description',
            "Join thousands of people who have successfully navigated their new cities with HelloCity's guidance.",
          )}
        </Typography>
        <TryHelloCityButton variant="cta" />
      </SectionContent>
    </SectionBackground>
  );
};

export default CallToActionsSection;
