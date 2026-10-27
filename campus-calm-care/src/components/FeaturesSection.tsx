import { Card, CardContent } from '@/components/ui/card';
import {
  ClipboardCheck,
  Brain,
  MessageCircle,
  Users2,
  BarChart3,
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: ClipboardCheck,
      title: 'Self-Assessment Tools',
      description:
        'PHQ-9, GAD-7, stress checkers and other validated mental health screening tools.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description:
        'Sentiment analysis and red-flag detection to provide personalized support recommendations.',
    },
    {
      icon: MessageCircle,
      title: 'Anonymous Counseling',
      description:
        'Chat or video sessions with licensed mental health professionals in complete privacy.',
    },
    {
      icon: Users2,
      title: 'Community Support',
      description:
        'Moderated peer discussions and support groups for students facing similar challenges.',
    },
    {
      icon: BarChart3,
      title: 'Dashboard for Institutions',
      description:
        'Trends, analytics, and resource allocation insights for campus mental health teams.',
    },
  ];

  return (
    <section
      id="features"
      className="bg-[#faf9f6] py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section heading */}
        <div className="mb-12 max-w-2xl lg:mb-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-[#53745a]">
            What matters to us
          </p>

          <h2 className="mb-5 font-serif text-4xl font-medium leading-tight tracking-tight text-[#263b2e] sm:text-5xl">
            What We Offer
          </h2>

          <p className="max-w-xl text-base leading-7 text-[#6c746d] sm:text-lg sm:leading-8">
            Digital-first solutions to promote student well-being and create healthier campus environments
            through evidence-based tools and professional support.
          </p>
        </div>

        {/* Main content */}
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">

          {/* Feature list */}
          <div className="divide-y divide-[#e7e7df]">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 py-6 first:pt-0 last:pb-0 sm:gap-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eaf0e6] text-[#527257]">
                  <feature.icon
                    size={22}
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <h3 className="mb-2 text-base font-semibold text-[#304434] sm:text-lg">
                    {feature.title}
                  </h3>

                  <p className="max-w-lg text-sm leading-6 text-[#707970] sm:text-[15px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard preview */}
          <div className="lg:sticky lg:top-24">
            <div className="overflow-hidden border border-[#e4e4da] bg-white">

              {/* Dashboard header */}
              <div className="flex items-center justify-between border-b border-[#e9e9e2] px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf0e6] text-[#527257]">
                    <Brain size={19} strokeWidth={1.7} />
                  </div>

                  <span className="text-sm font-semibold text-[#304434]">
                    MindCare
                  </span>
                </div>

                <span className="text-xs text-[#8a9289]">
                  Student portal
                </span>
              </div>

              <div className="space-y-7 p-5 sm:p-7">

                {/* Dashboard title */}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#7d897d]">
                    Overview
                  </p>

                  <h3 className="text-2xl font-semibold tracking-tight text-[#293e30]">
                    Student Dashboard
                  </h3>
                </div>

                {/* Assessment */}
                <Card className="rounded-none border border-[#e7e8df] bg-[#fdfdfa] shadow-none">
                  <CardContent className="p-5 sm:p-6">

                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="text-sm text-[#707970]">
                        Current Assessment
                      </span>

                      <span className="border border-[#dce6d8] bg-[#edf3e9] px-2.5 py-1 text-xs font-medium text-[#456449]">
                        In Progress
                      </span>
                    </div>

                    <h4 className="mb-5 text-base font-semibold text-[#304434]">
                      PHQ-9 Depression Screening
                    </h4>

                    <div
                      className="h-1.5 w-full bg-[#e8eae1]"
                      role="progressbar"
                      aria-label="Assessment completion"
                      aria-valuenow={75}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div className="h-full w-3/4 bg-[#63836a]" />
                    </div>

                    <p className="mt-3 text-sm text-[#737b73]">
                      75% Complete
                    </p>
                  </CardContent>
                </Card>

                {/* Chat preview */}
                <Card className="rounded-none border border-[#e7e8df] bg-white shadow-none">
                  <CardContent className="p-5 sm:p-6">

                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf0e6] text-[#527257]">
                        <MessageCircle size={19} strokeWidth={1.7} />
                      </div>

                      <span className="text-sm font-semibold text-[#304434]">
                        Anonymous Support Chat
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="max-w-[90%] bg-[#f3f3ed] p-3.5 text-sm leading-6 text-[#626d63]">
                        "How are you feeling today? I'm here to listen and support you."
                      </div>

                      <div className="ml-auto max-w-[90%] bg-[#45684d] p-3.5 text-sm leading-6 text-white">
                        "Thank you for being here. I've been feeling overwhelmed lately..."
                      </div>
                    </div>

                  </CardContent>
                </Card>

                {/* Dashboard footer */}
                <div className="border-t border-[#e9e9e2] pt-4">
                  <p className="text-xs leading-5 text-[#858c83]">
                    A supportive space for student well-being.
                  </p>
                </div>

              </div>
            </div>

            {/* Simple caption */}
            <p className="mt-4 text-xs leading-5 text-[#828980]">
              A preview of the MindCare student experience.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;