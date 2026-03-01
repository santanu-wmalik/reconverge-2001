import HeroSection from './sections/HeroSection';
import EventHighlights from './sections/EventHighlights';
import VenueDates from './sections/VenueDates';
import NostalgiaPreview from './sections/NostalgiaPreview';
import TestimonialsSection from './sections/TestimonialsSection';
import SponsorsSection from './sections/SponsorsSection';
import GiveBackPreview from './sections/GiveBackPreview';
import CTASection from './sections/CTASection';

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <EventHighlights />
      <VenueDates />
      <NostalgiaPreview />
      <TestimonialsSection />
      <GiveBackPreview />
      <SponsorsSection />
      <CTASection />
    </div>
  );
}
