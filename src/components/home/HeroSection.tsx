import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  CreditCard,
  ShoppingBag,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const heroImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=600&fit=crop",
];

const features = [
  { icon: Truck, text: "Free Shipping", highlight: "Over $50" },
  { icon: Shield, text: "Secure Payment", highlight: "100% Safe" },
  { icon: CreditCard, text: "Money Back", highlight: "30 Days" },
];

const stats = [
  { value: "50K+", label: "Products", icon: ShoppingBag },
  { value: "100K+", label: "Customers", icon: Star },
  { value: "99%", label: "Satisfaction", icon: TrendingUp },
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotate images
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl" />
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-bl from-secondary/10 to-transparent blur-3xl" />

      <div className="container relative py-14">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 px-5 py-2.5 backdrop-blur-sm border border-primary/20">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <div className="absolute -inset-1 animate-ping rounded-full bg-primary/20" />
              </div>
              <span className="font-semibold text-primary">
                New Collection Available
              </span>
              <Zap className="h-4 w-4 text-secondary ml-1" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
                Discover Your
                <span className="block">
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                    Perfect Style
                  </span>
                </span>
              </h1>

              <p className="max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                Explore our curated collection of premium products. From
                electronics to fashion, find everything you need at{" "}
                <span className="font-semibold text-primary">
                  unbeatable prices
                </span>
                .
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 rounded-xl bg-card/50 px-4 py-3 backdrop-blur-sm border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{feature.text}</span>
                    <span className="text-xs text-primary font-semibold">
                      {feature.highlight}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="group rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Link to="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Shop Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-xl border-2 hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300"
              >
                <Link to="/categories" className="flex items-center gap-2">
                  Explore Categories
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group text-center space-y-1 hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <stat.icon className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image Carousel */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main Image Container */}
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 p-8 shadow-2xl overflow-hidden">
              {/* Image Carousel */}
              <div className="relative h-full w-full rounded-2xl overflow-hidden">
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hero ${index + 1}`}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    )}
                  />
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
              </div>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      index === currentImageIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-primary/30 hover:bg-primary/50"
                    )}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute left-4 md:-left-4 top-8 animate-bounce-subtle">
              <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 md:p-4 p-1 shadow-xl">
                <Badge className="border-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white">
                  <span className="text-xl font-bold">-30%</span>
                  <span className="ml-1 text-xs">Today's Deal</span>
                </Badge>
              </div>
            </div>

            <div className="absolute hidden md:block right-4 bottom-12 animate-bounce-subtle [animation-delay:0.3s]">
              <div className="rounded-xl bg-gradient-to-br from-secondary to-secondary/80 p-4 shadow-xl">
                <Badge className="border-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white">
                  <Truck className="h-4 w-4 mr-1" />
                  <span className="font-bold">Free</span>
                  <span className="ml-1 text-xs">Shipping</span>
                </Badge>
              </div>
            </div>

            <div className="absolute hidden md:block -bottom-4 left-12 animate-bounce-subtle [animation-delay:0.6s]">
              <div className="rounded-xl bg-gradient-to-br from-success to-success/80 p-4 shadow-xl">
                <Badge className="border-0 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white">
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="text-xs">Secure</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
