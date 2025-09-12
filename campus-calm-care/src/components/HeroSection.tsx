import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/hero-mental-health.jpg';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-background via-background to-muted relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in relative">
            {/* Floating elements around content */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            <Badge 
              variant="secondary" 
              className="mb-6 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            >
              Student Well-being Matters
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Mental Health,{' '}
              <span className="text-gradient">Our Priority</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              A safe, digital-first platform providing students with access to assessments, 
              resources, and psychological support. Making mental health care accessible, 
              confidential, and stigma-free.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="hover-glow text-base px-8 py-3"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-3"
              >
                <Play className="mr-2 w-5 h-5" />
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="animate-slide-up animate-delay-200 relative">
            {/* Floating decorative elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <img
                src={heroImage}
                alt="Students receiving mental health support in a calm, digital environment"
                className="relative w-full h-auto rounded-2xl shadow-elegant"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;