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
import TownhallPopup from '../../components/shared/TownhallPopup';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Deep links like /#giving (shared in WhatsApp) should land on their section.
// Sections mount lazily and shift as data loads, so retry the scroll a few
// times instead of relying on the browser's one-shot anchor jump.
function useHashScroll() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: tries === 0 ? 'auto' : 'smooth', block: 'start' });
      if (++tries < 5) setTimeout(tick, 400);
    };
    tick();
  }, [hash]);
}

export default function LandingPage() {
  useHashScroll();
  return (
    <div>
      <TownhallPopup />
      <HeroSection />
      <SchedulePreview />
      <RollOfHonour />
      {/* Give Back sits right after the Roll of Honour per the fundraising
          committee — high on the page without displacing the schedule. */}
      <GiveBackPreview />
      <ThenAndNow />
      <NostalgiaPreview />
      <TestimonialsSection />
      <VenueDates />
      <CoordinatorsStrip />
      <InMemoriamPreview />
      <SponsorsSection />
      <CTASection />
    </div>
  );
}
