import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, Users, ArrowUpRight } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Heart,
      title: 'Early Assessments',
      description:
        'Quick, science-backed mental health screenings to identify concerns early and provide timely support.',
    },
    {
      icon: Shield,
      title: 'Confidential Support',
      description:
        'Anonymous chats, counseling, and guidance ensuring complete privacy and safe spaces for healing.',
    },
    {
      icon: Users,
      title: 'Accessible Resources',
      description:
        'Self-help tools, workshops, and stress management guides available 24/7 for all students.',
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f8f8f3] py-20 sm:py-24 lg:py-28"
    >
      <div className="container mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section heading */}
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16 mb-16 lg:mb-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#47765b]" />
              <span className="text-sm font-semibold tracking-[0.16em] uppercase text-[#47765b]">
                About MindCare
              </span>
            </div>

            <h2 className="max-w-xl text-3xl font-semibold leading-[1.15] tracking-tight text-[#243b30] sm:text-4xl lg:text-5xl">
              Why Mental Health Support for Students?
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-[#68736b] sm:text-lg lg:pb-1">
            Students face academic stress, anxiety, depression, and social isolation. Our platform
            bridges the gap by making help accessible, confidential, and stigma-free for every student
            who needs support.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-[#e6e8df] bg-white shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-[#c5d5c8] hover:shadow-[0_14px_35px_rgba(36,59,48,0.07)]"
            >
              <CardContent className="flex h-full flex-col p-7 sm:p-8 lg:p-9">
                <div className="mb-10 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf3ed] text-[#47765b] transition-colors duration-300 group-hover:bg-[#dfece1]">
                    <feature.icon
                      className="h-6 w-6"
                      strokeWidth={1.7}
                    />
                  </div>

                  <span className="text-sm font-medium tracking-wide text-[#a3aaa1]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-semibold tracking-tight text-[#293d31]">
                  {feature.title}
                </h3>

                <p className="flex-1 text-[15px] leading-7 text-[#727a73]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;