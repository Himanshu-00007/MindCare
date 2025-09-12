import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "MindCare made it so easy to get help when I was struggling with anxiety. The anonymous support chat was exactly what I needed.",
      name: "Sarah M.",
      role: "Computer Science Student",
      university: "University of Delhi"
    },
    {
      quote: "The assessment tools helped me understand my mental health better. Having resources available 24/7 has been life-changing.",
      name: "Rahul K.",
      role: "Psychology Major",
      university: "Mumbai University"
    },
    {
      quote: "As someone who was hesitant to seek help, the stigma-free environment of MindCare gave me the courage to prioritize my well-being.",
      name: "Priya S.",
      role: "Medical Student",
      university: "AIIMS New Delhi"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Student Voices
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real stories from students who found support, hope, and healing through our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-primary" />
                </div>
                
                {/* Stars Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-secondary" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                
                {/* Author Info */}
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {testimonial.university}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;