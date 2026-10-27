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
      className="bg-[#f8f8f5] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Heading */}
        <div className="mb-12 max-w-2xl lg:mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#54745b]" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#54745b]">
              MindCare / Features
            </span>
          </div>

          <h2 className="mb-5 font-serif text-4xl font-medium leading-tight tracking-tight text-[#263b2e] sm:text-5xl">
            What We Offer
          </h2>

          <p className="max-w-xl text-base leading-7 text-[#687169] sm:text-lg sm:leading-8">
            Digital-first solutions to promote student well-being and create healthier campus environments
            through evidence-based tools and professional support.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">

          {/* Features */}
          <div>
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="group flex gap-4 border-t border-[#e3e5dc] py-5 sm:gap-5 sm:py-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#e9eee5] text-[#4d7054]">
                    <Icon size={21} strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h3 className="text-base font-semibold text-[#304334] sm:text-lg">
                        {feature.title}
                      </h3>

                      <span className="hidden text-xs tabular-nums text-[#a0a69c] sm:block">
                        0{index + 1}
                      </span>
                    </div>

                    <p className="max-w-lg text-sm leading-6 text-[#707870] sm:text-[15px]">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Dashboard */}
          <div className="lg:pt-2">
            <div className="overflow-hidden border border-[#e0e2d9] bg-white">

              {/* Header */}
              <header className="flex items-center justify-between border-b border-[#e7e8e0] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center bg-[#e9eee5] text-[#4d7054]">
                    <Brain size={19} strokeWidth={1.7} />
                  </div>

                  <span className="text-sm font-semibold text-[#304334]">
                    MindCare
                  </span>
                </div>

                <span className="text-xs text-[#838b81]">
                  Student portal
                </span>
              </header>

              <div className="space-y-6 p-5 sm:p-6">

                {/* Title */}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#7b877a]">
                    Overview
                  </p>

                  <h3 className="text-2xl font-semibold tracking-tight text-[#293d30]">
                    Student Dashboard
                  </h3>
                </div>

                {/* Assessment */}
                <Card className="rounded-none border border-[#e5e6de] bg-[#fdfdfa] shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span className="text-sm text-[#707870]">
                        Current Assessment
                      </span>

                      <span className="border border-[#dce5d7] bg-[#edf2e9] px-2.5 py-1 text-xs font-medium text-[#456449]">
                        In Progress
                      </span>
                    </div>

                    <h4 className="mb-5 text-base font-semibold text-[#344638]">
                      PHQ-9 Depression Screening
                    </h4>

                    <div
                      className="h-1.5 w-full bg-[#e7e9e0]"
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

                {/* Chat */}
                <Card className="rounded-none border border-[#e5e6de] bg-white shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9eee5] text-[#4d7054]">
                        <MessageCircle size={19} strokeWidth={1.7} />
                      </div>

                      <span className="text-sm font-semibold text-[#304334]">
                        Anonymous Support Chat
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="max-w-[90%] bg-[#f1f2ec] p-3.5 text-sm leading-6 text-[#5f6b60]">
                        "How are you feeling today? I'm here to listen and support you."
                      </div>

                      <div className="ml-auto max-w-[90%] bg-[#45684d] p-3.5 text-sm leading-6 text-white">
                        "Thank you for being here. I've been feeling overwhelmed lately..."
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Footer */}
                <div className="border-t border-[#e7e8e0] pt-4">
                  <p className="text-xs leading-5 text-[#858c83]">
                    A supportive space for student well-being.
                  </p>
                </div>

              </div>
            </div>

            <p className="mt-3 text-xs text-[#858c83]">
              A preview of the MindCare student experience.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;