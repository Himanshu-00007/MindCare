import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardCheck, 
  Brain, 
  MessageCircle, 
  Users2, 
  BarChart3 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: ClipboardCheck,
      title: 'Self-Assessment Tools',
      description: 'PHQ-9, GAD-7, stress checkers and other validated mental health screening tools.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Sentiment analysis and red-flag detection to provide personalized support recommendations.'
    },
    {
      icon: MessageCircle,
      title: 'Anonymous Counseling',
      description: 'Chat or video sessions with licensed mental health professionals in complete privacy.'
    },
    {
      icon: Users2,
      title: 'Community Support',
      description: 'Moderated peer discussions and support groups for students facing similar challenges.'
    },
    {
      icon: BarChart3,
      title: 'Dashboard for Institutions',
      description: 'Trends, analytics, and resource allocation insights for campus mental health teams.'
    }
  ];

  return (
    <section id="features" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              What We Offer
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Digital-first solutions to promote student well-being and create healthier campus environments 
              through evidence-based tools and professional support.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Mockup */}
          <div className="animate-slide-up animate-delay-300">
            <Card className="border-0 shadow-elegant bg-gradient-to-br from-background to-muted">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">Student Dashboard</h3>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Mock Assessment Card */}
                  <Card className="bg-background border border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-muted-foreground">Current Assessment</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">In Progress</span>
                      </div>
                      <h4 className="font-semibold mb-2 text-foreground">PHQ-9 Depression Screening</h4>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">75% Complete</p>
                    </CardContent>
                  </Card>
                  
                  {/* Mock Chat Preview */}
                  <Card className="bg-background border border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-foreground">Anonymous Support Chat</span>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                          "How are you feeling today? I'm here to listen and support you."
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg text-sm text-foreground ml-6">
                          "Thank you for being here. I've been feeling overwhelmed lately..."
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;