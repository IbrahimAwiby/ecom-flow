import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { categoriesService } from "@/services/categories.service";

export function CategoriesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const categories = data?.data.slice(0, 6) || [];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 md:mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Browse Categories
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl">
              Discover amazing products curated by category for easier shopping
            </p>
          </div>
          <Button
            variant="ghost"
            asChild
            className="hidden sm:flex group h-11 px-6 border border-transparent hover:border-primary/20"
          >
            <Link to="/categories" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-3 w-1/2 mx-auto" />
                  </div>
                </div>
              ))
            : categories.map((category, index) => (
                <Link
                  key={category._id}
                  to={`/categories/${category._id}`}
                  className="group relative flex flex-col items-center gap-4"
                >
                  {/* Image Container with Gradient Border */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300" />

                    {/* Image */}
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 p-1">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Button
                          size="sm"
                          className="rounded-full bg-white text-black hover:bg-white/90 shadow-lg"
                        >
                          Shop Now
                        </Button>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold shadow-sm">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      <span className="text-xs text-primary font-medium">
                        Explore
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Button
            asChild
            className="h-11 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
          >
            <Link to="/categories" className="gap-2">
              View All Categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="hidden lg:block absolute left-0 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl -z-10" />
        <div className="hidden lg:block absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-primary/3 blur-3xl -z-10" />
      </div>
    </section>
  );
}
