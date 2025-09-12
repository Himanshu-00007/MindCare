import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Download, 
  Video, 
  Headphones, 
  FileText, 
  Calendar,
  ArrowRight 
} from 'lucide-react';

const ResourcesSection = () => {
  const resources = [
    {
      icon: BookOpen,
      title: 'Mental Health Guides',
      description: 'Comprehensive guides on managing stress, anxiety, and depression for students.',
      type: 'PDF Guide',
      size: '2.4 MB'
    },
    {
      icon: Video,
      title: 'Meditation Videos',
      description: 'Guided meditation and mindfulness sessions designed specifically for busy students.',
      type: 'Video Series',
      size: '15 videos'
    },
    {
      icon: Headphones,
      title: 'Sleep Stories & Sounds',
      description: 'Calming audio content to help improve sleep quality and reduce insomnia.',
      type: 'Audio Collection',
      size: '25 tracks'
    },
    {
      icon: FileText,
      title: 'Self-Care Worksheets',
      description: 'Interactive worksheets for mood tracking, goal setting, and personal reflection.',
      type: 'Workbook',
      size: '40 pages'
    },
    {
      icon: Calendar,
      title: 'Wellness Planner',
      description: 'Digital planner to track mental health habits, appointments, and progress.',
      type: 'Digital Tool',
      size: 'Interactive'
    },
    {
      icon: BookOpen,
      title: 'Crisis Support Toolkit',
      description: 'Essential resources and contacts for mental health emergencies and crisis situations.',
      type: 'Quick Reference',
      size: '1.2 MB'
    }
  ];

  return (
    <section id="resources" className="py-16 lg:py-24 section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Free Mental Health Resources
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Access our comprehensive library of evidence-based resources, tools, and guides designed 
            specifically for student mental health and well-being. All resources are free and 
            available for immediate download.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 animate-fade-in bg-background group"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <resource.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {resource.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {resource.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {resource.size}
                  </span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Free
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 animate-fade-in animate-delay-300">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Need Personalized Support?
              </h3>
              <p className="text-muted-foreground mb-6">
                While our resources are helpful, sometimes you need one-on-one support. 
                Connect with our licensed counselors for personalized guidance.
              </p>
              <Button className="hover-glow">
                Book a Session
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;