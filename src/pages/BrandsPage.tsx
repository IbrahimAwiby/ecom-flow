import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  Sparkles,
  TrendingUp,
  Star,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

// Components
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Services
import { brandsService } from "@/services/brands.service";

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: brandsService.getAll,
  });

  const brands = data?.data || [];

  // Filter brands based on search
  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset search
  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <div className="container px-4 py-8 sm:px-6 lg:py-12">
        {/* Hero Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Premium Brands
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Discover Brands
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Explore our curated collection of premium brands offering quality
            products and exceptional experiences.
          </p>
        </div>

        {/* Stats Bar - Simplified */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{brands.length}</p>
                <p className="text-sm text-muted-foreground">Total Brands</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Star className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">24+</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-green-500/10 p-3">
                <ShieldCheck className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={handleResetSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Results Info */}
          {searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredBrands.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {brands.length}
                </span>{" "}
                brands
              </p>
              <p className="text-sm mt-1">
                Results for "
                <span className="font-semibold">{searchQuery}</span>"
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSearch}
                className="mt-2"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))
          ) : filteredBrands.length === 0 && searchQuery ? (
            <div className="col-span-full py-16 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No brands found</h3>
              <p className="mt-2 text-muted-foreground">
                No brands found matching "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={handleResetSearch}
                className="mt-4"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <Link
                key={brand._id}
                to={`/brands/${brand._id}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:scale-[1.02]"
              >
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Brand Image */}
                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-full w-full object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/150x150?text=Brand";
                    }}
                  />
                </div>

                {/* Brand Name */}
                <div className="text-center">
                  <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Empty state when no brands exist */}
        {!isLoading && brands.length === 0 && !searchQuery && (
          <div className="col-span-full py-16 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No brands available</h3>
            <p className="mt-2 text-muted-foreground">
              Check back soon for new brands!
            </p>
          </div>
        )}

        {/* Info Section */}
        {!isLoading && brands.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-6 py-3 mb-6">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                100% Authentic Brands • Premium Quality • Verified Sellers
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All brands in our collection are carefully selected to ensure
              quality and authenticity. Shop with confidence from trusted
              manufacturers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
