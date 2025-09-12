import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Users, 
  Brain, 
  Shield, 
  Clock, 
  Target,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const DifferentiatorSection = () => {
  const differentiators = [
    {
      icon: Brain,
      title: 'AI-Powered Early Detection',
      description: 'Our advanced algorithms analyze patterns to identify mental health concerns before they become severe.',
      highlight: 'Industry First',
      benefits: ['Predictive analytics', 'Early intervention', 'Personalized insights']
    },
    {
      icon: Shield,
      title: 'Complete Anonymity',
      description: 'Unlike other platforms, we offer 100% anonymous support with no registration or personal data required.',
      highlight: 'Privacy First',
      benefits: ['No login required', 'Zero data collection', 'Anonymous counseling']
    },
    {
      icon: Clock,
      title: 'Instant Access',
      description: 'Get immediate help without waiting lists, appointments, or complex processes that delay care.',
      highlight: '24/7 Availability',
      benefits: ['No waiting periods', 'Immediate response', 'Always accessible']
    },
    {
      icon: Users,
      title: 'Student-Only Community',
      description: 'A dedicated space exclusively for students, by students, with peer support that truly understands.',
      highlight: 'Student Focused',
      benefits: ['Peer counselors', 'Student moderators', 'Academic stress focus']
    },
    {
      icon: Target,
      title: 'Evidence-Based Tools',
      description: 'All our assessments and interventions are backed by peer-reviewed research and clinical validation.',
      highlight: 'Scientifically Proven',
      benefits: ['PHQ-9 & GAD-7 certified', 'Clinical partnerships', 'Research backed']
    },
    {
      icon: Zap,
      title: 'Integrated Campus Support',
      description: 'Direct connections with campus resources, counseling centers, and academic support services.',
      highlight: 'Campus Connected',
      benefits: ['Direct referrals', 'Academic accommodations', 'Campus partnerships']
    }
  ];

  const comparisonPoints = [
    'No waiting lists or appointment scheduling',
    'Completely anonymous - no personal data required',
    'AI-powered early detection and prevention',
    'Student-only community and peer support',
    'Direct campus counseling center integration',
    'Free access to all mental health resources',
    'Real-time crisis intervention capabilities',
    'Evidence-based assessment tools only'
  ];

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <Badge 
            variant="secondary" 
            className="mb-6 text-sm bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            What Makes Us Different
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Beyond Traditional Mental Health Apps
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            While others offer generic solutions, we've built the first platform designed specifically 
            for the unique mental health challenges students face in higher education.
          </p>
        </div>

        {/* Main Differentiators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {differentiators.map((item, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 animate-fade-in bg-background group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30"
                  >
                    {item.highlight}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                <ul className="space-y-2">
                  {item.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-secondary mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Choose Us Comparison */}
        <Card className="border-0 shadow-elegant bg-gradient-to-br from-background to-muted animate-fade-in animate-delay-300">
          <CardContent className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
                  Why Students Choose MindCare Over Others
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Traditional mental health apps weren't built for students. We understand the unique 
                  pressures of academic life, financial constraints, and the need for immediate, 
                  anonymous support that fits into your busy schedule.
                </p>
                <div className="space-y-3">
                  {comparisonPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
                  <div className="text-6xl font-bold text-gradient mb-4">95%</div>
                  <p className="text-lg font-semibold text-foreground mb-2">Student Satisfaction</p>
                  <p className="text-muted-foreground text-sm">
                    "Finally, a mental health platform that gets what it's like to be a student"
                  </p>
                  <div className="mt-6 flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">4.9/5</div>
                      <div className="text-xs text-muted-foreground">App Store</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">4.8/5</div>
                      <div className="text-xs text-muted-foreground">Play Store</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DifferentiatorSection;