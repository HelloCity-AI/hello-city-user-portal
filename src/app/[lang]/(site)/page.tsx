import React from 'react';
import {
  HeroSection,
  AdventureShowcaseSection,
  ValuePropositionSection,
  HowItWorksSection,
  CallToActionsSection,
  TestimonialsSection,
} from '@/compoundComponents';

import FAQSection from '@/compoundComponents/HomePage/FAQSection';

export default function Home({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return (
    <React.Fragment>
      <HeroSection locale={lang} />
      <AdventureShowcaseSection locale={lang} />
      <ValuePropositionSection locale={lang} />
      <HowItWorksSection locale={lang} />
      <TestimonialsSection locale={lang} />
      <FAQSection />
      <FAQSection />
      <CallToActionsSection locale={lang} />
    </React.Fragment>
  );
}
