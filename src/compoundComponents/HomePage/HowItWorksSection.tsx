import Box from '@mui/material/Box';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import React from 'react';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import { List, ListItem } from '@mui/material';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';
import { getServerTranslation } from '@/utils/serverI18n';

const HowItWorksSection = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslation(locale);

  const listItems = [
    {
      key: 1,
      title: t('HowItWorks.Step1.Title', 'Dream & Plan'),
      description: t('HowItWorks.Step1.Description', 'Visualize your new life and set your goals'),
    },
    {
      key: 2,
      title: t('HowItWorks.Step2.Title', 'Prepare & Organize'),
      description: t(
        'HowItWorks.Step2.Description',
        'Get all your documents and requirements ready',
      ),
    },
    {
      key: 3,
      title: t('HowItWorks.Step3.Title', 'Arrive & Thrive'),
      description: t('HowItWorks.Step3.Description', 'Hit the ground running in your new city'),
    },
  ];
  return (
    <SectionBackground bgImg="/images/homepage/sun-set.jpeg" overlay>
      <SectionContent additionalClassName="flex min-h-[500px] items-center">
        <SectionContentArea additionalClassName="flex-col items-center lg:flex-row lg:justify-between">
          <Box
            component="div"
            className="flex w-full max-w-md flex-col gap-3 text-white md:max-w-lg lg:max-w-[50%] lg:flex-1"
          >
            <Typography
              component="h3"
              variant="h4"
              color="inherit"
              className="text-center lg:text-left"
            >
              {t('HowItWorks.Title', 'From planning to living your dream')}
            </Typography>
            <Typography variant="body1" color="inherit">
              {t(
                'HowItWorks.Description',
                'Every great journey starts with proper planning. HelloCiti transforms the overwhelming process of moving to a new city into an exciting, well-organized adventure.',
              )}
            </Typography>
            <List>
              {listItems.map((item) => {
                return (
                  <ListItem key={item.key} sx={{ pl: 0 }}>
                    <Box
                      component="div"
                      sx={{
                        backgroundColor: 'primary.main',
                      }}
                      className="mr-5 flex aspect-square w-8 flex-shrink-0 items-center justify-center rounded-full"
                    >
                      <Typography component="span" variant="h6">
                        {item.key}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="h4" variant="h6">
                        {item.title}
                      </Typography>
                      <Typography variant="body1">{item.description}</Typography>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box
            component="div"
            className="relative h-[300px] w-full max-w-md md:max-w-lg lg:h-full lg:min-h-[400px] lg:flex-1 xl:ml-10"
          >
            <Image
              src="/images/homepage/group-scenarios.png"
              fill
              alt={t(
                'HowItWorks.ImageAlt',
                'Collage of travel scenes: airport departure, boat on turquoise water, tropical beach bungalows, and couple at sunset.',
              )}
              className="object-contain"
              loading="lazy"
              sizes="(max-width: 768px) 448px, (max-width: 1024px) 512px, 600px"
            />
          </Box>
        </SectionContentArea>
      </SectionContent>
    </SectionBackground>
  );
};

export default HowItWorksSection;
