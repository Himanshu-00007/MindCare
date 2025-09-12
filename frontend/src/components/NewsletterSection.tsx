import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, ArrowRight } from 'lucide-react';

const NewsletterSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-elegant bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center max-w-2xl mx-auto animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                Stay Informed
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Get updates on student mental health initiatives and new features straight to your inbox. 
                Be part of the movement to create healthier campus communities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-background border-border focus:ring-primary"
                />
                <Button className="hover-glow">
                  Subscribe
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                No spam, unsubscribe at any time. Your privacy is important to us.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSection;