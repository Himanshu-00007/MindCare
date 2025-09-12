import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import DifferentiatorSection from '@/components/DifferentiatorSection';
import TestimonialSection from '@/components/TestimonialSection';
import ImpactSection from '@/components/ImpactSection';
import ResourcesSection from '@/components/ResourcesSection';
import NewsletterSection from '@/components/NewsletterSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <DifferentiatorSection />
        <TestimonialSection />
        <ImpactSection />
        <ResourcesSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
