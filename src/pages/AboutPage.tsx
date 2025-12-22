// src/pages/AboutPage.tsx
import { Link } from "react-router-dom";
import {
  Sparkles,
  Award,
  Shield,
  Truck,
  Heart,
  Users,
  Target,
  Globe,
  Clock,
  ShoppingBag,
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Package,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const milestones = [
  {
    year: "2020",
    title: "ShopHub Founded",
    description: "Started with a vision to revolutionize online shopping",
  },
  {
    year: "2021",
    title: "1M Customers",
    description: "Reached our first million satisfied customers",
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Launched in 20+ countries worldwide",
  },
  {
    year: "2023",
    title: "Award Winning",
    description: "Won Best E-commerce Platform 2023",
  },
  {
    year: "2024",
    title: "AI Integration",
    description: "Launched AI-powered shopping assistant",
  },
];

const values = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Customer First",
    description: "Every decision starts with our customers' needs in mind.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Innovation",
    description:
      "Constantly pushing boundaries to improve the shopping experience.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Trust & Security",
    description:
      "Your data and transactions are protected with enterprise-grade security.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Sustainability",
    description:
      "Committed to eco-friendly packaging and carbon-neutral shipping.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const stats = [
  {
    label: "Happy Customers",
    value: "2M+",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Products Available",
    value: "50K+",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Countries Served",
    value: "50+",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    label: "Orders Delivered",
    value: "5M+",
    icon: <Truck className="h-5 w-5" />,
  },
];

export default function AboutPage() {
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container relative px-3 py-12 sm:px-4 sm:py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20">
              <Sparkles className="mr-2 h-4 w-4" />
              Since 2020
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                ShopHub
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
              We're redefining online shopping with innovation, quality, and an
              uncompromising commitment to customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="rounded-xl">
                <Link to="/products">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16">
        <div className="container px-3 sm:px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
                    <div className="text-primary">{stat.icon}</div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16">
        <div className="container px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Our Journey
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Building the Future of E-commerce
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Founded in 2020, ShopHub began with a simple idea: make online
                  shopping more personal, more secure, and more enjoyable. What
                  started as a small startup has grown into a global platform
                  serving millions of customers.
                </p>
                <p className="text-muted-foreground">
                  Today, we combine cutting-edge technology with human-centric
                  design to create shopping experiences that feel both
                  futuristic and familiar. Our AI-powered recommendations,
                  seamless checkout process, and exceptional customer service
                  set new standards in the industry.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Easy Returns</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                  alt="ShopHub Team"
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 backdrop-blur-sm rounded-lg">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        Award Winning Platform
                      </p>
                      <p className="text-sm text-white/80">
                        Best E-commerce 2023
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16">
        <div className="container px-3 sm:px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-muted-foreground">
              These principles guide every decision we make and every feature we
              build.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-6">
                  <div
                    className={`inline-flex items-center justify-center p-4 rounded-2xl ${value.bgColor} mb-4`}
                  >
                    <div className={value.color}>{value.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-12 sm:py-16">
        <div className="container px-3 sm:px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4">
              Our Journey
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Milestones & Achievements
            </h2>
            <p className="text-muted-foreground">
              From humble beginnings to industry leadership.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8"
                    }`}
                  >
                    <Card className="inline-block max-w-md">
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="h-4 w-4 rounded-full bg-primary border-4 border-background" />
                  </div>

                  {/* Empty space for alternating sides */}
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="container px-3 sm:px-4">
          <Card className="border-none bg-gradient-to-r from-primary/10 via-primary/5 to-background overflow-hidden">
            <CardContent className="p-6 sm:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Ready to Experience ShopHub?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Join millions of satisfied customers who trust us for their
                    online shopping needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="rounded-xl">
                      <Link to="/products">
                        Start Shopping Now
                        <ShoppingBag className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl"
                      asChild
                    >
                      <Link to="/contact">Get in Touch</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Card className="bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Truck className="h-6 w-6 text-green-500" />
                            <div>
                              <p className="font-semibold">Free Shipping</p>
                              <p className="text-xs text-muted-foreground">
                                Over $50
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-blue-500" />
                            <div>
                              <p className="font-semibold">Secure Payment</p>
                              <p className="text-xs text-muted-foreground">
                                256-bit SSL
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-4">
                      <Card className="bg-background/50 backdrop-blur-sm mt-8">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <RefreshCw className="h-6 w-6 text-orange-500" />
                            <div>
                              <p className="font-semibold">Easy Returns</p>
                              <p className="text-xs text-muted-foreground">
                                30 Days
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-background/50 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Clock className="h-6 w-6 text-purple-500" />
                            <div>
                              <p className="font-semibold">24/7 Support</p>
                              <p className="text-xs text-muted-foreground">
                                Always Here
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
