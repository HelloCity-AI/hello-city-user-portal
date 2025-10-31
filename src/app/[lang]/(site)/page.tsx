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

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang;
  return (
    <React.Fragment>
      <HeroSection locale={lang} />
      <AdventureShowcaseSection locale={lang} />
      <ValuePropositionSection locale={lang} />
      <HowItWorksSection locale={lang} />
      <TestimonialsSection locale={lang} />
      <FAQSection />
      <CallToActionsSection locale={lang} />
    </React.Fragment>
  );
}
