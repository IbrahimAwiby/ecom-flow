import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { productsService } from "@/services/products.service";

export function BestSellers() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "bestsellers"],
    queryFn: () => productsService.getAll({ limit: 4, sort: "-sold" }),
  });

  const products = data?.data || [];

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">
                Best Sellers
              </h2>
              <p className="text-muted-foreground">
                Most popular products this week
              </p>
            </div>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/products?sort=-sold">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 md:gap-4 gap-2 md:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/products?sort=-sold">
              View All Best Sellers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
