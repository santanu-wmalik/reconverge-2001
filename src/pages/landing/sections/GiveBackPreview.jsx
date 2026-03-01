import { Link } from 'react-router-dom';
import SectionHeading from '../../../components/shared/SectionHeading';
import ScrollReveal from '../../../components/shared/ScrollReveal';
import GlassCard from '../../../components/ui/GlassCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

const initiatives = [
  { title: 'Campus Plaza / Common Space', icon: '🏛️', status: 'In Planning', description: 'A tangible, lasting legacy — a dedicated space on the NIT Calicut campus by the Class of 2001.' },
  { title: 'Memorial for Departed Batchmates', icon: '🕯️', status: 'In Planning', description: 'Honoring those no longer with us, integrated into the campus plaza project.' },
  { title: 'Silver Jubilee Endowment Fund', icon: '🏅', status: 'Active', description: 'Contributing to the existing NITC endowment fund for ongoing campus development.' },
];

export default function GiveBackPreview() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Give Back"
          subtitle="Building a lasting legacy at the campus that shaped our future"
        />

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {initiatives.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="h-full">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                <Badge variant={item.status === 'Active' ? 'success' : 'gold'} size="sm" className="mb-3">{item.status}</Badge>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center">
          <Link to="/give-back">
            <Button variant="outline" size="lg">Learn More & Contribute</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
