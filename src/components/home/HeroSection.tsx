import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container py-20 md:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              New Collection Available
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Discover Your
              <span className="text-gradient block">Perfect Style</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Explore our curated collection of premium products. From electronics to
              fashion, find everything you need at unbeatable prices.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild className="group">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">100K+</p>
                <p className="text-sm text-muted-foreground">Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">99%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                alt="Shopping"
                className="h-full w-full rounded-2xl object-cover shadow-elevated"
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -left-4 top-1/4 animate-bounce rounded-xl bg-card p-4 shadow-elevated">
              <p className="text-2xl font-bold text-secondary">-30%</p>
              <p className="text-xs text-muted-foreground">Today's Deal</p>
            </div>

            <div className="absolute -right-4 bottom-1/4 animate-bounce rounded-xl bg-card p-4 shadow-elevated [animation-delay:0.5s]">
              <p className="text-2xl font-bold text-primary">Free</p>
              <p className="text-xs text-muted-foreground">Shipping</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
