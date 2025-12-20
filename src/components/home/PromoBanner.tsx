import { Link } from "react-router-dom";
import { ArrowRight, Gift, Truck, Shield, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Gift,
    title: "Gift Cards",
    description: "Perfect for gifting",
    gradient: "from-orange-500 to-red-400",
  },
];

export function PromoBanner() {
  return (
    <>
      {/* CTA Banner */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/100 via-primary/150 to-primary/100 dark:from-primary dark:via-primary/95 dark:to-primary/90 p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl shadow-primary/10 dark:shadow-primary/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent dark:from-black/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 dark:to-black/5" />

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,_transparent_1px,_rgba(255,255,255,0.1)_1px)] bg-[size:20px_20px]" />
              <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_rgba(255,255,255,0.1)_1px)] bg-[size:20px_20px]" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Left Content */}
              <div className="flex-1 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 dark:bg-black/30 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5">
                  <Sparkles className="h-4 w-4 text-white" />
                  <span className="text-sm sm:text-base font-semibold text-white">
                    Limited Time Offer
                  </span>
                </div>

                <h2 className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Get{" "}
                  <span className="text-yellow-300 dark:text-yellow-200">
                    25% Off
                  </span>{" "}
                  Your First Order
                </h2>

                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/90 dark:text-white/80 leading-relaxed">
                  Sign up today and receive an exclusive discount on your first
                  purchase. Don't miss out on this amazing deal!
                </p>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="group h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white hover:bg-white/90 text-primary dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link to="/register">
                      Sign Up Now
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:scale-110" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="group h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold border-2 border-white/30 hover:border-white bg-transparent hover:bg-white/10 text-white dark:text-white"
                  >
                    <Link to="/products">
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                {/* Countdown Timer (Optional) */}
                <div className="mt-8 sm:mt-10 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        05
                      </span>
                      <span className="text-xs text-white/70">Days</span>
                    </div>
                    <span className="text-xl text-white/50">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        12
                      </span>
                      <span className="text-xs text-white/70">Hours</span>
                    </div>
                    <span className="text-xl text-white/50">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        30
                      </span>
                      <span className="text-xs text-white/70">Mins</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Illustration/Image */}
              <div className="hidden lg:block relative">
                <div className="relative w-64 h-64 xl:w-80 xl:h-80">
                  {/* Decorative circles */}
                  <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-400/30 blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-40 h-40 rounded-full bg-gradient-to-tr from-purple-400/30 to-pink-400/30 blur-xl" />

                  {/* Main illustration container */}
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 p-6">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 mb-4">
                          <span className="text-3xl font-bold text-white">
                            25%
                          </span>
                        </div>
                        <p className="text-white font-semibold">OFF</p>
                        <p className="text-white/80 text-sm mt-2">
                          First Order
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-2xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border/50 dark:border-border/30 bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/10 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-white">
              Why Choose Us
            </h2>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
              Experience shopping with premium benefits and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={cn(
                  "group relative p-5 sm:p-6 rounded-2xl bg-card dark:bg-gray-900/50 border border-border/50 dark:border-gray-800",
                  "hover:border-primary/50 dark:hover:border-primary/30 transition-all duration-300",
                  "hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10",
                  "hover:-translate-y-1"
                )}
              >
                {/* Gradient Background Effect */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10",
                    "transition-opacity duration-500",
                    feature.gradient
                  )}
                />

                <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-4">
                  {/* Icon Container */}
                  <div
                    className={cn(
                      "flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl",
                      "bg-gradient-to-br shadow-lg",
                      feature.gradient,
                      "group-hover:scale-110 transition-transform duration-300"
                    )}
                  >
                    <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center sm:text-left lg:text-center">
                    <h3 className="font-semibold text-lg sm:text-xl text-foreground dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground dark:text-gray-400">
                      {feature.description}
                    </p>
                    <div className="mt-3 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-4 w-4 text-primary mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-0 group-hover:w-[100%] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="group h-12 px-6 text-base font-medium"
            >
              <Link to="/about">
                Learn More About Our Services
                <ArrowRight className="ml-2 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
