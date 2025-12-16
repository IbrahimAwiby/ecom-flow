import { Link } from "react-router-dom";
import { ArrowRight, Gift, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Perfect for gifting",
  },
];

export function PromoBanner() {
  return (
    <>
      {/* CTA Banner */}
      <section className="py-16">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12">
            <div className="relative z-10 max-w-xl">
              <span className="inline-block rounded-full bg-primary-foreground/20 px-4 py-1.5 text-sm font-medium text-primary-foreground">
                Limited Time Offer
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Get 25% Off Your First Order
              </h2>
              <p className="mt-4 text-primary-foreground/80">
                Sign up today and receive an exclusive discount on your first
                purchase. Don't miss out on this amazing deal!
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="mt-6 group"
              >
                <Link to="/register">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/10" />
            <div className="absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-primary-foreground/10" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
