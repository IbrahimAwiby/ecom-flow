import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  Sparkles,
  Package,
  Tag,
  TrendingUp,
  Layers,
} from "lucide-react";
import { useState } from "react";

// Components
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Services
import { categoriesService } from "@/services/categories.service";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const categories = data?.data || [];

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset search
  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <div className="container px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
        {/* Hero Header - Mobile responsive */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Product Categories
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl">
            Shop by Category
          </h1>
          <p className="mx-auto mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
            Explore our wide range of product categories to find exactly what
            you're looking for.
          </p>
        </div>

        {/* Stats Bar - Mobile responsive */}
        <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="rounded-lg bg-primary/10 p-2 sm:p-3">
                <Layers className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">
                  {categories.length}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Total Categories
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="rounded-lg bg-blue-500/10 p-2 sm:p-3">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">500+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Products
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="rounded-lg bg-green-500/10 p-2 sm:p-3">
                <Tag className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold">24/7</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Available
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section - Mobile responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 p-0"
                onClick={handleResetSearch}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>

          {/* Results Info */}
          {searchQuery && (
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredCategories.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {categories.length}
                </span>{" "}
                categories
              </p>
              <p className="text-xs sm:text-sm mt-1">
                Results for "
                <span className="font-semibold">{searchQuery}</span>"
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSearch}
                className="mt-2 h-8 sm:h-9 px-3"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Categories Grid - Mobile responsive */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 sm:space-y-4">
                <Skeleton className="aspect-square rounded-xl sm:rounded-2xl" />
                <Skeleton className="h-4 sm:h-5 w-20 sm:w-24 mx-auto" />
              </div>
            ))
          ) : filteredCategories.length === 0 && searchQuery ? (
            <div className="col-span-full py-12 sm:py-16 text-center">
              <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted mb-3 sm:mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold">
                No categories found
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                No categories found matching "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={handleResetSearch}
                className="mt-3 sm:mt-4 h-8 sm:h-9 px-3 sm:px-4"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <Link
                key={category._id}
                to={`/categories/${category._id}`}
                className="group flex flex-col items-center gap-3 sm:gap-4"
              >
                {/* Category Image Container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg sm:group-hover:shadow-xl group-hover:scale-[1.02]">
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/400x400?text=Category";
                    }}
                  />

                  {/* Hover badge - Hide on mobile, show on sm+ */}
                  <Badge className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:inline-flex">
                    Shop Now
                  </Badge>
                </div>

                {/* Category Name */}
                <div className="text-center">
                  <h3 className="text-sm sm:text-base font-medium sm:font-semibold transition-colors group-hover:text-primary line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                    Explore collection →
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Empty state when no categories exist */}
        {!isLoading && categories.length === 0 && !searchQuery && (
          <div className="col-span-full py-12 sm:py-16 text-center">
            <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted mb-3 sm:mb-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold">
              No categories available
            </h3>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
              Check back soon for new categories!
            </p>
          </div>
        )}

        {/* Info Section - Mobile responsive */}
        {!isLoading && categories.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-4 py-2 sm:px-6 sm:py-3 mb-4 sm:mb-6">
              <Sparkles className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium">
                Wide Selection • Quality Products • Easy Navigation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              Browse through our carefully organized categories to find products
              that match your needs. Each category offers a unique selection of
              high-quality items.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
