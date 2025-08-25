import Box from '@mui/material/Box';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import React from 'react';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import { List, ListItem } from '@mui/material';
import SectionContentArea from '@/components/HomepageSections/SectionContentArea';

const listItems = [
  { key: 1, title: 'Dream & Plan', description: 'Visualize your new life and set your goals' },
  {
    key: 2,
    title: 'Prepare & Organize',
    description: 'Get all your documents and requirements ready',
  },
  { key: 3, title: 'Arrive & Thrive', description: 'Hit the ground running in your new city' },
];

const HowItWorksSection = () => {
  return (
    <SectionBackground bgImg="/images/homepage/sun-set.jpeg" overlay>
      <SectionContent additionalClassName="flex min-h-[500px] items-center px-20">
        <SectionContentArea additionalClassName="flex-col items-center px-4 lg:flex-row xl:pl-2">
          <Box
            component="div"
            className="w-[85vw] text-left text-white md:w-[65vw] lg:max-w-[50%] lg:flex-1"
          >
            <Typography
              component="h3"
              variant="h4"
              color="inherit"
              className="text-center lg:text-left"
            >
              From planning to living your dream
            </Typography>
            <Typography variant="body1" color="inherit">
              Every great journey starts with proper planning. HelloCity transforms the overwhelming
              process of moving to a new city into an exciting, well-organized adventure.
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
            className="relative h-[300px] w-[85vw] lg:h-full lg:min-h-[400px] lg:flex-1 xl:ml-10"
          >
            <Image
              src="/images/homepage/group-scenarios.png"
              fill
              alt=""
              className="object-contain"
            />
          </Box>
        </SectionContentArea>
      </SectionContent>
    </SectionBackground>
  );
};

export default HowItWorksSection;
