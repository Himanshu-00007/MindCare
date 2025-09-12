import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, Users } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Heart,
      title: 'Early Assessments',
      description: 'Quick, science-backed mental health screenings to identify concerns early and provide timely support.'
    },
    {
      icon: Shield,
      title: 'Confidential Support',
      description: 'Anonymous chats, counseling, and guidance ensuring complete privacy and safe spaces for healing.'
    },
    {
      icon: Users,
      title: 'Accessible Resources',
      description: 'Self-help tools, workshops, and stress management guides available 24/7 for all students.'
    }
  ];

  return (
    <section id="about" className="py-16 lg:py-24 section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Why Mental Health Support for Students?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Students face academic stress, anxiety, depression, and social isolation. Our platform 
            bridges the gap by making help accessible, confidential, and stigma-free for every student 
            who needs support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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