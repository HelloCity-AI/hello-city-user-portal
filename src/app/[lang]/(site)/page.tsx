import React from 'react';
import {
  HeroSection,
  AdventureShowcaseSection,
  ValuePropositionSection,
  HowItWorksSection,
  CallToActionsSection,
  TestimonialsSection,
} from '@/compoundComponents';

export default function Home({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return (
    <React.Fragment>
      <HeroSection locale={lang} />
      <AdventureShowcaseSection locale={lang} />
      <ValuePropositionSection locale={lang} />
      <HowItWorksSection locale={lang} />
      <TestimonialsSection locale={lang} />
      <CallToActionsSection locale={lang} />
    </React.Fragment>
  );
}
