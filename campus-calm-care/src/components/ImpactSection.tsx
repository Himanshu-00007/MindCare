import { Card, CardContent } from '@/components/ui/card';

const ImpactSection = () => {
  const stats = [
    {
      number: '10,000+',
      label: 'Students Supported',
      description: 'Across multiple universities and colleges'
    },
    {
      number: '24/7',
      label: 'Anonymous Assistance',
      description: 'Round-the-clock support when you need it most'
    },
    {
      number: '50+',
      label: 'Colleges Connected',
      description: 'Building a nationwide support network'
    }
  ];

  return (
    <section className="py-16 lg:py-24 section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Creating healthier campuses by removing stigma, providing access, and ensuring every student 
            feels supported in their mental health journey. Together, we're building a community where 
            seeking help is seen as a sign of strength.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="text-4xl sm:text-5xl font-bold text-gradient mb-4">
                  {stat.number}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {stat.label}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Building - University Logos Placeholder */}
        <div className="mt-16 pt-16 border-t border-border animate-fade-in animate-delay-300">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by leading educational institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="w-32 h-16 bg-gradient-to-r from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center"
              >
                <span className="text-muted-foreground font-medium">University {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;