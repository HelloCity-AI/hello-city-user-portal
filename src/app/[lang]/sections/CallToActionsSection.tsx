import React from 'react';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import { useTryHelloCity } from '@/hooks/useTryHelloCity';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const CallToActionsSection = () => {
  const { href: tryHelloCityHref, label: tryHelloCityLabel } = useTryHelloCity();
  return (
    <SectionBackground bgColor="primary">
      <SectionContent>
        <Typography component="h3" variant="h4" color="white">
          Ready to make your move?
        </Typography>
        <Typography variant="body1" color="white">
          Join thousands of people who have successfully navigated their new cities with
          HelloCity&apos;s guidance.
        </Typography>
        <Button
          component={Link}
          href={tryHelloCityHref}
          className="group mt-5 rounded-full bg-white px-10 py-3 font-semibold"
          sx={{ color: 'theme.plate.primary' }}
        >
          {tryHelloCityLabel}&nbsp;&nbsp;
          <Typography component="span" className="transition-transform group-hover:translate-x-2">
            →
          </Typography>
        </Button>
      </SectionContent>
    </SectionBackground>
  );
};

export default CallToActionsSection;
