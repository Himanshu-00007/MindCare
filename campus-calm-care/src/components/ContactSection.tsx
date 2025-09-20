import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Phone, Mail, MapPin, Clock, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const ContactSection = () => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    const id = localStorage.getItem("id");
    const Token = localStorage.getItem("Token");

    if (id && Token) {
      navigate("/chat"); // AuthGuard will allow access
    } else {
      navigate("/auth"); // Not logged in → redirect to login
    }
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat Support',
      description: 'Get instant help through our secure chat system',
      action: 'Start Chat',
      availability: '24/7 Available',
      primary: true,
      onClick: handleStartChat
    },
    {
      icon: Phone,
      title: 'Crisis Helpline',
      description: 'Immediate support for mental health emergencies',
      action: 'Call Now',
      availability: 'Emergency Only',
      urgent: true,
      onClick: () => window.location.href = "tel:+911234567890"
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your questions and concerns',
      action: 'Send Email',
      availability: 'Response in 24hrs',
      onClick: () => window.location.href = "mailto:support@mindcare.com"
    }
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            We're Here for You
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Whether you need immediate crisis support, have questions about our services, or want to 
            connect with our team, we're available 24/7 to provide the help you need.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8">
          {contactMethods.map((method, index) => (
            <Card 
              key={index} 
              className={`border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in bg-background ${
                method.primary ? 'ring-2 ring-primary/20' : method.urgent ? 'ring-2 ring-red-500/20' : ''
              }`}
              style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  method.primary ? 'bg-gradient-to-br from-primary to-secondary' :
                  method.urgent ? 'bg-gradient-to-br from-red-500 to-red-600' :
                  'bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/30'
                }`}>
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {method.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {method.description}
                </p>
                
                <div className="mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    method.primary ? 'bg-primary/10 text-primary' :
                    method.urgent ? 'bg-red-500/10 text-red-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {method.availability}
                  </span>
                </div>
                
                <Button 
                  variant={method.primary ? 'default' : method.urgent ? 'destructive' : 'outline'}
                  size="sm"
                  className="w-full hover-glow"
                  onClick={method.onClick}
                >
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
