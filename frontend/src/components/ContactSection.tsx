import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Shield,
  Heart,
  Send
} from 'lucide-react';

const ContactSection = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat Support',
      description: 'Get instant help through our secure chat system',
      action: 'Start Chat',
      availability: '24/7 Available',
      primary: true
    },
    {
      icon: Phone,
      title: 'Crisis Helpline',
      description: 'Immediate support for mental health emergencies',
      action: 'Call Now',
      availability: 'Emergency Only',
      urgent: true
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your questions and concerns',
      action: 'Send Email',
      availability: 'Response in 24hrs'
    }
  ];

  const campusInfo = [
    {
      icon: MapPin,
      title: 'Campus Locations',
      details: ['New Delhi - Main Office', 'Mumbai - Regional Hub', 'Bangalore - Tech Center', 'Kolkata - Eastern Hub']
    },
    {
      icon: Clock,
      title: 'Support Hours',
      details: ['24/7 - Crisis Support', 'Mon-Fri 9AM-8PM - General', 'Weekends 10AM-6PM - Limited', 'Holidays - Emergency Only']
    },
    {
      icon: Shield,
      title: 'Privacy Guarantee',
      details: ['100% Confidential', 'HIPAA Compliant', 'Anonymous Options', 'Secure Platform']
    }
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                >
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 shadow-elegant bg-background animate-fade-in">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Send us a Message
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      First Name
                    </label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input type="email" placeholder="your.email@university.edu" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    University/Institution
                  </label>
                  <Input placeholder="Your university name" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    How can we help you?
                  </label>
                  <Textarea 
                    placeholder="Please describe how we can assist you. Remember, this is not for crisis situations - use our emergency contacts for immediate help."
                    rows={4}
                  />
                </div>
                
                <Button className="w-full hover-glow">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  For immediate crisis support, please use our 24/7 helpline or emergency contacts.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Campus Information */}
          <div className="space-y-8 animate-fade-in animate-delay-200">
            {campusInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-card bg-background">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-foreground">
                        {info.title}
                      </h4>
                      <ul className="space-y-2">
                        {info.details.map((detail, i) => (
                          <li key={i} className="text-muted-foreground text-sm">
                            • {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;