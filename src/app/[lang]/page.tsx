import React from 'react';
import HeroSection from './sections/HeroSection';
import AdventureShowcaseSection from './sections/AdventureShowcaseSection';
import ValuePropositionSection from './sections/ValuePropositionSection';
import HowItWorksSection from './sections/HowItWorksSection';
import CallToActionsSection from './sections/CallToActionsSection';
import TestimonialsSection from './sections/TestimonialsSection';

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
