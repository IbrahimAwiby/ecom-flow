import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { productsService } from "@/services/products.service";

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsService.getAll({ limit: 8 }),
  });

  const products = data?.data || [];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Featured Products
            </h2>
            <p className="mt-2 text-muted-foreground">
              Handpicked products just for you
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
