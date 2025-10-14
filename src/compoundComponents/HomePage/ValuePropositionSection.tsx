import React from 'react';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HomepageCard from '@/components/HomepageCard';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';
import { getServerTranslation } from '@/utils/serverI18n';

const ValuePropositionSection = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslation(locale);

  const cards = [
    {
      key: 'personalized-guidance',
      icon: <ChatBubbleOutlineOutlinedIcon sx={{ color: '#5C6DF7' }} />,
      title: t('ValueProposition.Card1.Title', 'Personalized Guidance'),
      description: t(
        'ValueProposition.Card1.Description',
        'Get tailored advice based on your situation, destination. No generic answers.',
      ),
    },
    {
      key: 'step-by-step-plan',
      icon: <CheckCircleOutlineOutlinedIcon sx={{ color: '#FFB663' }} />,
      title: t('ValueProposition.Card2.Title', 'Step-by-step Plan'),
      description: t(
        'ValueProposition.Card2.Description',
        'Never miss important tasks with our comprehensive plan for every type of move.',
      ),
    },
    {
      key: 'timeline-planning',
      icon: <AccessTimeOutlinedIcon sx={{ color: '#16A34A' }} />,
      title: t('ValueProposition.Card3.Title', 'Timeline Planning'),
      description: t(
        'ValueProposition.Card3.Description',
        'Know exactly when to do what with realistic timelines and deadline reminders.',
      ),
    },
  ];
  return (
    <SectionBackground>
      <SectionContent>
        <Typography component="h3" variant="h4" color="secondary.contrastText">
          {t('ValueProposition.Title', 'Why choose HelloCity?')}
        </Typography>
        <Typography variant="body1" color="text.secondary" className="max-w-[900px] text-wrap">
          {t(
            'ValueProposition.Description',
            "We understand that moving to a new city can be overwhelming. That's why we've built the most comprehensive city landing assistant.",
          )}
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
