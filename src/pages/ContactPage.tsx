// src/pages/ContactPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowLeft,
  MessageSquare,
  User,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <MessageSquare className="relative h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">
                  Contact Us
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  We're here to help. Get in touch with our team
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/faq">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to FAQ
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Choose your preferred contact method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-sm text-muted-foreground">
                      ShopHub@example.com
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Response time: Under 2 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Phone className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-sm text-muted-foreground">
                      01031071411
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mon-Fri, 9AM-6PM EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Commerce St, Suite 100
                      <br />
                      Cairo, CA 94107
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mon-Fri</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saturday</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Need Quick Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check our FAQ for instant answers
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/faq">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Browse FAQ
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Ibrahim Hassan"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="ShopHub@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please describe your issue or question in detail..."
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      * Required fields
                    </p>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>

                  <Separator />

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          For order-related inquiries, please include your order
                          number. This helps us assist you faster.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Live Chat Section */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <Badge className="mb-2">Live Now</Badge>
                    <h3 className="text-xl font-semibold mb-2">
                      Instant Live Chat
                    </h3>
                    <p className="text-muted-foreground">
                      Chat with our support agents in real-time. Available 24/7.
                    </p>
                  </div>
                  <Button size="lg">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Start Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
