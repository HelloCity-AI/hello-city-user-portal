import React from 'react';
import SectionBackground from '@/components/HomepageSections/SectionBackground';
import SectionContent from '@/components/HomepageSections/SectionContent';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { Avatar } from '@mui/material';
import HomepageCard from '@/components/HomepageCard';
import { getServerTranslation } from '@/utils/serverI18n';
import { twMerge } from 'tailwind-merge';
//
const TestimonialsSection = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslation(locale);

  const testimonials = [
    {
      key: 'zhang-wei',
      rating: 5,
      review: t(
        'Testimonials.Review1',
        "I moved to Sydney for work and honestly had no idea where to start. HelloCity broke everything down into simple steps—documents, banking, housing. Without it, I'd probably still be stuck Googling things at midnight. Lifesaver.",
      ),
      avatarName: 'zhang-wei',
      name: t('Testimonials.Name1', 'Zhang Wei'),
      title: t('Testimonials.Title1', 'Product Manager'),
      country: t('Testimonials.Country1', 'China'),
    },
    {
      key: 'ayaka-tanaka',
      rating: 5,
      review: t(
        'Testimonials.Review2',
        "When I relocated, I was worried I'd waste weeks just figuring out how to open a bank account or set up utilities. HelloCity made it super straightforward. I got settled in a few days and could actually focus on creating content instead of stressing.",
      ),
      avatarName: 'ayaka-tanaka',
      name: t('Testimonials.Name2', 'Ayaka Tanaka'),
      title: t('Testimonials.Title2', 'Content Creator'),
      country: t('Testimonials.Country2', 'Japan'),
    },
    {
      key: 'rajesh-kumar',
      rating: 5,
      review: t(
        'Testimonials.Review3',
        "I came abroad for my master's and was so nervous about the paperwork. HelloCity kept reminding me what to do next—like a plan in my pocket. It really reduced my stress, and I could spend more time enjoying campus life.",
      ),
      avatarName: 'rajesh-kumar',
      name: t('Testimonials.Name3', 'Rajesh Kumar'),
      title: t('Testimonials.Title3', 'Student'),
      country: t('Testimonials.Country3', 'India'),
    },
    {
      key: 'maria-santos',
      rating: 4.5,
      review: t(
        'Testimonials.Review4',
        'As a freelancer, I move around a lot for projects. HelloCity has been my go-to whenever I need to set up in a new city quickly. The timeline feature is clutch - helps me plan everything around my project deadlines. Only wish they had more info on coworking spaces.',
      ),
      avatarName: 'maria-santos',
      name: t('Testimonials.Name4', 'Maria Santos'),
      title: t('Testimonials.Title4', 'Freelance Designer'),
      country: t('Testimonials.Country4', 'Brazil'),
    },
    {
      key: 'solon-mok',
      rating: 5,
      review: t(
        'Testimonials.Review5',
        'Moving with two kids was our biggest nightmare until we found HelloCity. The family-specific plan covered everything from schools to pediatricians. My 8-year-old even helped check things off the list! Made what could have been chaos actually manageable.',
      ),
      avatarName: 'solon-mok',
      name: t('Testimonials.Name5', 'Solon Mok'),
      title: t('Testimonials.Title5', 'Marketing Director'),
      country: t('Testimonials.Country5', 'China'),
    },
    {
      key: 'emma-wilson',
      rating: 4.5,
      review: t(
        'Testimonials.Review6',
        'Fresh out of university and completely overwhelmed by adult life, HelloCity was like having a mentor guide me through every step. From setting up my first apartment to understanding local banking, it made the transition from student to working professional so much smoother.',
      ),
      avatarName: 'emma-wilson',
      name: t('Testimonials.Name6', 'Emma Wilson'),
      title: t('Testimonials.Title6', 'Junior Software Developer'),
      country: t('Testimonials.Country6', 'United Kingdom'),
    },
    {
      key: 'priya-sharma',
      rating: 5,
      review: t(
        'Testimonials.Review7',
        "As expats moving from Singapore to Melbourne, we were worried about everything - schools, healthcare, even simple things like grocery shopping. HelloCity's location-specific guides were incredibly detailed and saved us months of research and mistakes.",
      ),
      avatarName: 'priya-sharma',
      name: t('Testimonials.Name7', 'Priya Sharma'),
      title: t('Testimonials.Title7', 'Operations Manager'),
      country: t('Testimonials.Country7', 'Singapore'),
    },
    {
      key: 'lucas-miller',
      rating: 4.5,
      review: t(
        'Testimonials.Review8',
        'Working as a consultant means constantly adapting to new environments. HelloCity has become my secret weapon for quick city transitions. The local insights and practical plan help me focus on my clients instead of logistics. Game-changer for business travelers.',
      ),
      avatarName: 'lucas-miller',
      name: t('Testimonials.Name8', 'Lucas Miller'),
      title: t('Testimonials.Title8', 'Business Consultant'),
      country: t('Testimonials.Country8', 'United States'),
    },
  ];

  const testimonialsDuplication = [...testimonials];
  // custom classes for testimonial cards
  const customCardClass =
    'relative w-[300px] lg:w-[380px] max-w-[380px] min-w-[300px] lg:min-w-[380px] overflow-hidden rounded-lg';

  return (
    <SectionBackground>
      <SectionContent>
        <Typography
          component="h3"
          variant="h4"
          className="w-full text-center"
          color="secondary.contrastText"
        >
          {t('Testimonials.Title', 'Loved by thousands of users')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="mx-auto w-full max-w-[900px] text-wrap text-center"
        >
          {t(
            'Testimonials.Description',
            'See what people are saying about HelloCity — hear from students, professionals, and families who turned uncertainty into confidence with our step-by-step relocation tools.',
          )}
        </Typography>
      </SectionContent>
      {/* Scrollable container for cards - full viewport width */}
      <Box
        className="group mt-3 w-[100vw] overflow-x-scroll lg:overflow-x-hidden"
        sx={{ WebkitOverflowScrolling: 'touch' }}
      >
        <Box
          className="flex gap-5 pl-6 text-left group-hover:paused lg:animate-marquee lg:pl-[max(2rem,calc((100vw-1200px)/2))]"
          sx={{ width: 'max-content', willChange: 'transform' }}
        >
          {testimonials.map((testimonial) => {
            return (
              <HomepageCard
                key={testimonial.key}
                disableDefaultClass={true}
                additionalClassName={customCardClass}
                variant="outlined"
              >
                <CardContent className="flex h-full flex-col gap-3">
                  <Rating
                    name="half-rating-read"
                    defaultValue={testimonial.rating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.review}
                  </Typography>
                  <Box component="div" className="mt-auto flex gap-3">
                    <Avatar
                      src={`/images/homepage/testimonial-avatar/${testimonial.avatarName}.jpg`}
                    />
                    <Box component="div">
                      <Typography
                        variant="body2"
                        className="font-semibold"
                        color="secondary.contrastText"
                      >
                        {`${testimonial.name}(${testimonial.country})`}
                      </Typography>
                      {testimonial.title && (
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.title}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </HomepageCard>
            );
          })}

          {testimonialsDuplication.map((testimonial) => {
            return (
              <HomepageCard
                key={`${testimonial.key}-duplication`}
                disableDefaultClass={true}
                additionalClassName={twMerge(customCardClass, 'hidden lg:flex')}
                variant="outlined"
              >
                <CardContent className="flex h-full flex-col gap-3">
                  <Rating
                    name="half-rating-read"
                    defaultValue={testimonial.rating}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.review}
                  </Typography>
                  <Box component="div" className="mt-auto flex gap-3">
                    <Avatar
                      src={`/images/homepage/testimonial-avatar/${testimonial.avatarName}.jpg`}
                    />
                    <Box component="div">
                      <Typography
                        variant="body2"
                        className="font-semibold"
                        color="secondary.contrastText"
                      >
                        {`${testimonial.name} (${testimonial.country})`}
                      </Typography>
                      {testimonial.title && (
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.title}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </HomepageCard>
            );
          })}
        </Box>
      </Box>
    </SectionBackground>
  );
};

export default TestimonialsSection;
