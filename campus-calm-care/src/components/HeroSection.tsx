import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/mind.jpg';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#f8f8f3] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-28">
      <div className="container relative mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

          {/* Left Content */}
          <div className="relative z-10 max-w-2xl">

            <Badge
              variant="outline"
              className="mb-7 rounded-full border-[#d5e0d4] bg-[#edf3eb] px-4 py-2 text-sm font-medium text-[#41664c] hover:bg-[#edf3eb]"
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#64866a]" />
              Student Well-being Matters
            </Badge>

            <h1 className="mb-7 text-[2.65rem] font-semibold leading-[1.12] tracking-tight text-[#253c30] sm:text-5xl lg:text-[4.25rem]">
              Your Mental Health,{' '}
              <span className="font-serif font-normal italic text-[#63816a]">
                Our Priority
              </span>
            </h1>

            <p className="mb-9 max-w-xl text-base leading-8 text-[#68736b] sm:text-lg">
              A safe, digital-first platform providing students with access to assessments,
              resources, and psychological support. Making mental health care accessible,
              confidential, and stigma-free.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <Button
                size="lg"
                className="h-12 rounded-full bg-[#345b43] px-7 text-base font-medium text-white shadow-none transition-all duration-200 hover:bg-[#294a36] hover:shadow-md"
                onClick={() => navigate('/auth')}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full rounded-full border-[#d9ded5] bg-transparent px-7 text-base font-medium text-[#344a3a] transition-colors hover:border-[#b8c8b8] hover:bg-[#edf1e9] sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </a>

            </div>

            {/* Small supporting detail */}
            <div className="mt-10 flex items-center gap-3 border-t border-[#e3e6dc] pt-6">
              <div className="flex -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f8f8f3] bg-[#dce7d8] text-xs font-semibold text-[#345b43]">
                  M
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f8f8f3] bg-[#e9dfcf] text-xs font-semibold text-[#705a42]">
                  C
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#f8f8f3] bg-[#dce4e8] text-xs font-semibold text-[#45616b]">
                  S
                </div>
              </div>

              <p className="text-sm leading-6 text-[#7a837b]">
                A calmer space to begin
                <span className="block font-medium text-[#405947]">
                  Your well-being comes first.
                </span>
              </p>
            </div>

          </div>

          {/* Right Image */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">

            {/* Soft background shape */}
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-tr-[4rem] border border-[#dce5d7] sm:-right-7 sm:-top-7 sm:h-40 sm:w-40" />

            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#e8ece3]">
              <img
                src={heroImage}
                alt="Students receiving mental health support in a calm, digital environment"
                className="aspect-[4/4.4] w-full object-cover object-center sm:aspect-[4/4.1] lg:aspect-[4/4.6]"
              />

              {/* Subtle image overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b3025]/20 via-transparent to-transparent" />
            </div>

            {/* Floating information card */}
            <div className="absolute -bottom-6 left-4 max-w-[calc(100%-2rem)] rounded-2xl border border-[#e6e8df] bg-white/95 p-4 shadow-[0_12px_35px_rgba(36,59,48,0.09)] backdrop-blur-sm sm:bottom-7 sm:-left-8 sm:max-w-[280px] sm:p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf3eb] text-[#47765b]">
                  <Play className="h-3.5 w-3.5 fill-current" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718072]">
                  MindCare
                </span>
              </div>

              <p className="text-sm font-medium leading-6 text-[#334839]">
                A safe, welcoming space for your mental well-being.
              </p>
            </div>

            {/* Decorative accent */}
            <div className="absolute -bottom-5 right-5 -z-10 h-24 w-24 rounded-full bg-[#e4eadf] sm:-bottom-7 sm:-right-7 sm:h-32 sm:w-32" />

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;