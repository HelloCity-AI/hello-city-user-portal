import Typography from '@mui/material/Typography';
import React from 'react';
import Image from 'next/image';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';
import HomepageCard from '@/components/HomepageCard';
import Box from '@mui/material/Box';
import { getServerTranslation } from '@/utils/serverI18n';

const AdventureShowcaseSection = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslation(locale);

  const adventures = [
    {
      image: '/images/homepage/ready-for-takeoff.jpeg',
      alt: t('AdventureShowcase.Case1.Alt', 'Ready for Takeoff'),
      title: t('AdventureShowcase.Case1.Title', 'Ready for Takeoff'),
      description: t(
        'AdventureShowcase.Case1.Description',
        'Start your journey to a new adventure',
      ),
    },
    {
      image: '/images/homepage/new-connections.jpeg',
      alt: t('AdventureShowcase.Case2.Alt', 'New Connections'),
      title: t('AdventureShowcase.Case2.Title', 'New Connections'),
      description: t(
        'AdventureShowcase.Case2.Description',
        'Meet amazing people and build lasting relationships',
      ),
    },
    {
      image: '/images/homepage/dreams-realized.jpeg',
      alt: t('AdventureShowcase.Case3.Alt', 'Dreams Realized'),
      title: t('AdventureShowcase.Case3.Title', 'Dreams Realized'),
      description: t(
        'AdventureShowcase.Case3.Description',
        'Turn your dreams into reality in a new city',
      ),
    },
  ];

  return (
    <SectionBackground>
      <SectionContent>
        <Typography component="h3" variant="h4" color="secondary.contrastText">
          {t('AdventureShowcase.Title', 'Your adventure awaits')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(
            'AdventureShowcase.Description',
            'Feel the excitement of discovering new places, meeting new people, and starting fresh in an amazing city.',
          )}
        </Typography>
        {/* Cards area */}
        <SectionContentArea>
          {adventures.map((adventure) => {
            return (
              <HomepageCard
                key={adventure.title}
                additionalClassName={
                  'aspect-video rounded-lg min-w-[100px] min-h-[200px] overflow-hidden'
                }
                elevation={0}
              >
                <Image
                  src={adventure.image}
                  fill
                  loading="lazy"
                  alt={adventure.alt}
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Box
                  component="div"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent"
                />
                <Box
                  component="div"
                  className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white"
                >
                  <Typography component="h4" color="inherit" variant="h6">
                    {adventure.title}
                  </Typography>
                  <Typography color="inherit" variant="body2">
                    {adventure.description}
                  </Typography>
                </Box>
              </HomepageCard>
            );
          })}
        </SectionContentArea>
      </SectionContent>
    </SectionBackground>
  );
};

export default AdventureShowcaseSection;
