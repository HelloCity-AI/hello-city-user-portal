'use client';
import React from 'react';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { Box, CardHeader } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HomepageCard from '@/components/HomepageCard';

const cards = [
  {
    key: 'personalized-guidance',
    icon: <ChatBubbleOutlineOutlinedIcon sx={{ color: '#5C6DF7' }} />,
    title: 'Personalized Guidance',
    description:
      'Get tailored advice based on your situation, destination, and timeline. No generic answers.',
  },
  {
    key: 'step-by-step-checklists',
    icon: <CheckCircleOutlineOutlinedIcon sx={{ color: '#FFB663' }} />,
    title: 'Step-by-step Checklists',
    description:
      '    Never miss important tasks with our comprehensive checklists for every type of move.',
  },
  {
    key: 'timeline-planning',
    icon: <AccessTimeOutlinedIcon sx={{ color: '#16A34A' }} />,
    title: 'Timeline Planning',
    description: 'Know exactly when to do what with realistic timelines and deadline reminders.',
  },
];

const ValuePropositionSection = () => {
  return (
    <SectionBackground>
      <SectionContent>
        <Typography component="h3" variant="h4" color="secondary.contrastText">
          Why choose HelloCity?
        </Typography>
        <Typography variant="body1" color="text.secondary" className="max-w-[900px] text-wrap">
          We understand that moving to a new city can be overwhelming. That&apos;s why we&apos;ve
          built the most comprehensive city landing assistant.
        </Typography>
        {/* Cards area */}
        <SectionContentArea>
          {cards.map((card) => {
            return (
              <HomepageCard
                key={card.key}
                additionalClassName="rounded-lg text-center transition-all duration-300 hover:scale-105 hover:shadow-md"
                variant="outlined"
              >
                <Box
                  component="div"
                  className="mx-auto mt-10 flex aspect-square w-[50px] items-center justify-center rounded-md bg-slate-100"
                >
                  {card.icon}
                </Box>
                <CardHeader
                  title={card.title}
                  slotProps={{
                    title: { variant: 'h6', color: 'black' },
                  }}
                  className="flex h-[80px] items-center"
                />
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </HomepageCard>
            );
          })}
        </SectionContentArea>
      </SectionContent>
    </SectionBackground>
  );
};

export default ValuePropositionSection;
