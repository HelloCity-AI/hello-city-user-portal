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

const TestimonialsSection = async ({ locale }: { locale: string }) => {
  const { t } = await getServerTranslation(locale);

  const testimonials = [
    {
      key: 'product-manager',
      rating: 5,
      review: t(
        'Testimonials.Review1',
        "I moved to Sydney for work and honestly had no idea where to start. HelloCity broke everything down into simple steps—documents, banking, housing. Without it, I'd probably still be stuck Googling things at midnight. Lifesaver.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name1', 'Zhang Wei'),
      title: t('Testimonials.Title1', 'Product Manager'),
    },
    {
      key: 'content-creator',
      rating: 5,
      review: t(
        'Testimonials.Review2',
        "When I relocated, I was worried I'd waste weeks just figuring out how to open a bank account or set up utilities. HelloCity made it super straightforward. I got settled in a few days and could actually focus on creating content instead of stressing.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name2', 'Ayaka Tanaka'),
      title: t('Testimonials.Title2', 'Content Creator'),
    },
    {
      key: 'student',
      rating: 5,
      review: t(
        'Testimonials.Review3',
        "I came abroad for my master's and was so nervous about the paperwork. HelloCity kept reminding me what to do next—like a checklist in my pocket. It really reduced my stress, and I could spend more time enjoying campus life.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name3', 'Rajesh Kumar'),
      title: t('Testimonials.Title3', 'Student'),
    },
    {
      key: 'freelancer',
      rating: 4.5,
      review: t(
        'Testimonials.Review4',
        'As a freelancer, I move around a lot for projects. HelloCity has been my go-to whenever I need to set up in a new city quickly. The timeline feature is clutch - helps me plan everything around my project deadlines. Only wish they had more info on coworking spaces.',
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name4', 'Maria Santos'),
      title: t('Testimonials.Title4', 'Freelance Designer'),
    },
    {
      key: 'family-relocation',
      rating: 5,
      review: t(
        'Testimonials.Review5',
        'Moving with two kids was our biggest nightmare until we found HelloCity. The family-specific checklists covered everything from schools to pediatricians. My 8-year-old even helped check things off the list! Made what could have been chaos actually manageable.',
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name5', 'David Chen'),
      title: t('Testimonials.Title5', 'Marketing Director'),
    },
    {
      key: 'recent-graduate',
      rating: 4.5,
      review: t(
        'Testimonials.Review6',
        'Fresh out of university and completely overwhelmed by adult life, HelloCity was like having a mentor guide me through every step. From setting up my first apartment to understanding local banking, it made the transition from student to working professional so much smoother.',
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name6', 'Emma Wilson'),
      title: t('Testimonials.Title6', 'Junior Software Developer'),
    },
    {
      key: 'expat-family',
      rating: 5,
      review: t(
        'Testimonials.Review7',
        "As expats moving from Singapore to Melbourne, we were worried about everything - schools, healthcare, even simple things like grocery shopping. HelloCity's location-specific guides were incredibly detailed and saved us months of research and mistakes.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name7', 'Priya Sharma'),
      title: t('Testimonials.Title7', 'Operations Manager'),
    },
  ];

  const testimonialsDuplication = [
    {
      key: 'product-manager',
      rating: 5,
      review: t(
        'Testimonials.Review1',
        "I moved to Sydney for work and honestly had no idea where to start. HelloCity broke everything down into simple steps—documents, banking, housing. Without it, I'd probably still be stuck Googling things at midnight. Lifesaver.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name1', 'Zhang Wei'),
      title: t('Testimonials.Title1', 'Product Manager'),
    },
    {
      key: 'content-creator',
      rating: 5,
      review: t(
        'Testimonials.Review2',
        "When I relocated, I was worried I'd waste weeks just figuring out how to open a bank account or set up utilities. HelloCity made it super straightforward. I got settled in a few days and could actually focus on creating content instead of stressing.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name2', 'Ayaka Tanaka'),
      title: t('Testimonials.Title2', 'Content Creator'),
    },
    {
      key: 'student',
      rating: 5,
      review: t(
        'Testimonials.Review3',
        "I came abroad for my master's and was so nervous about the paperwork. HelloCity kept reminding me what to do next—like a checklist in my pocket. It really reduced my stress, and I could spend more time enjoying campus life.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name3', 'Rajesh Kumar'),
      title: t('Testimonials.Title3', 'Student'),
    },
    {
      key: 'freelancer',
      rating: 4.5,
      review: t(
        'Testimonials.Review4',
        'As a freelancer, I move around a lot for projects. HelloCity has been my go-to whenever I need to set up in a new city quickly. The timeline feature is clutch - helps me plan everything around my project deadlines. Only wish they had more info on coworking spaces.',
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name4', 'Maria Santos'),
      title: t('Testimonials.Title4', 'Freelance Designer'),
    },
    {
      key: 'family-relocation',
      rating: 5,
      review: t(
        'Testimonials.Review5',
        'Moving with two kids was our biggest nightmare until we found HelloCity. The family-specific checklists covered everything from schools to pediatricians. My 8-year-old even helped check things off the list! Made what could have been chaos actually manageable.',
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name5', 'David Chen'),
      title: t('Testimonials.Title5', 'Marketing Director'),
    },
    {
      key: 'recent-graduate',
      rating: 4.5,
      review: t(
        'Testimonials.Review6',
        'Fresh out of university and completely overwhelmed by adult life, HelloCity was like having a mentor guide me through every step. From setting up my first apartment to understanding local banking, it made the transition from student to working professional so much smoother.',
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name6', 'Emma Wilson'),
      title: t('Testimonials.Title6', 'Junior Software Developer'),
    },
    {
      key: 'expat-family',
      rating: 5,
      review: t(
        'Testimonials.Review7',
        "As expats moving from Singapore to Melbourne, we were worried about everything - schools, healthcare, even simple things like grocery shopping. HelloCity's location-specific guides were incredibly detailed and saved us months of research and mistakes.",
      ),
      avatar: 'Personalized Guidance',
      name: t('Testimonials.Name7', 'Priya Sharma'),
      title: t('Testimonials.Title7', 'Operations Manager'),
    },
  ];
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
        className="group mt-3 w-[100vw] overflow-x-hidden"
        sx={{ WebkitOverflowScrolling: 'touch' }}
      >
        <Box
          className="animate-marquee group-hover:paused flex gap-5 pl-[max(2rem,calc((100vw-1200px)/2))] text-left"
          sx={{ width: 'max-content' }}
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
                    <Avatar />
                    <Box component="div">
                      <Typography
                        variant="body2"
                        className="font-semibold"
                        color="secondary.contrastText"
                      >
                        {testimonial.name}
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
                    <Avatar />
                    <Box component="div">
                      <Typography
                        variant="body2"
                        className="font-semibold"
                        color="secondary.contrastText"
                      >
                        {testimonial.name}
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
