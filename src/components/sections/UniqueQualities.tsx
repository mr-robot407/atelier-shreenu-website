import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel, SectionHeading } from "@/components/ui/SectionHeading";
import { qualities } from "@/content/qualities";
import { 
  Compass, 
  Leaf, 
  Award, 
  Layers, 
  Users, 
  MapPin 
} from "lucide-react";

const iconMap = {
  compass: Compass,
  leaf: Leaf,
  award: Award,
  layers: Layers,
  users: Users,
  "map-pin": MapPin,
};

export function UniqueQualities() {
  return (
    <section className="border-t border-charcoal/10 py-24 md:py-36">
      <Container>
        <FadeIn className="mb-16 md:mb-24 md:max-w-4xl">
          <SectionLabel className="mb-6 block">Why this practice</SectionLabel>
          <SectionHeading>
            Built on six
            <br />
            <span className="italic">uncompromising beliefs.</span>
          </SectionHeading>
        </FadeIn>

        <div className="grid grid-cols-1 gap-px bg-charcoal/15 md:grid-cols-2 lg:grid-cols-3">
          {qualities.map((q, i) => {
            const Icon = iconMap[q.icon as keyof typeof iconMap];
            return (
              <FadeIn key={q.title} delay={(i % 3) * 0.08}>
                <div className="h-full bg-warm-ivory p-8 md:p-10">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/10">
                      <Icon className="h-5 w-5 text-burgundy" strokeWidth={1.5} />
                    </div>
                    <div className="h-px flex-1 bg-charcoal/20" />
                  </div>
                  <h3 className="font-serif text-[26px] leading-tight">{q.title}</h3>
                  <p className="mt-5 text-sm leading-relaxed text-charcoal/70">
                    {q.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}