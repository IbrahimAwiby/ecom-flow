import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { brandsService } from "@/services/brands.service";

export function BrandsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: brandsService.getAll,
  });

  const brands = data?.data.slice(0, 8) || [];

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Popular Brands
            </h2>
            <p className="mt-2 text-muted-foreground">
              Shop from your favorite brands
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/brands">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))
            : brands.map((brand) => (
                <Link
                  key={brand._id}
                  to={`/brands/${brand._id}`}
                  className="group flex items-center justify-center rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-soft"
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-16 w-auto object-contain grayscale transition-all group-hover:grayscale-0"
                  />
                </Link>
              ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/brands">
              View All Brands
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
