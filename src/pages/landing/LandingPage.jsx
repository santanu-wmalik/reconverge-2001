import HeroSection from './sections/HeroSection';
import SchedulePreview from './sections/SchedulePreview';
import RollOfHonour from './sections/RollOfHonour';
import ThenAndNow from './sections/ThenAndNow';
import NostalgiaPreview from './sections/NostalgiaPreview';
import TestimonialsSection from './sections/TestimonialsSection';
import VenueDates from './sections/VenueDates';
import CoordinatorsStrip from './sections/CoordinatorsStrip';
import GiveBackPreview from './sections/GiveBackPreview';
import InMemoriamPreview from './sections/InMemoriamPreview';
import SponsorsSection from './sections/SponsorsSection';
import CTASection from './sections/CTASection';

// Landing order mirrors rect1an's home page:
//   Hero → Programme → Roll of Honour → Then & Now → Alumni Vault →
//   Echoes → When & Where → Committee → Give Back → In Memoriam →
//   Sponsors → CTA
//
// BatchPulse + BranchLeaderboard were folded into RollOfHonour.
export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <SchedulePreview />
      <RollOfHonour />
      <ThenAndNow />
      <NostalgiaPreview />
      <TestimonialsSection />
      <VenueDates />
      <CoordinatorsStrip />
      <GiveBackPreview />
      <InMemoriamPreview />
      <SponsorsSection />
      <CTASection />
    </div>
  );
}
