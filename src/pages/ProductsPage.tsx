import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Package,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";
import { brandsService } from "@/services/brands.service";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const keyword = searchParams.get("keyword") || "";

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", page, category, brand, sort, keyword],
    queryFn: () =>
      productsService.getAll({
        page,
        limit: 12,
        category,
        brand,
        sort,
        keyword: keyword || undefined,
      }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: brandsService.getAll,
  });

  const products = productsData?.data || [];
  const metadata = productsData?.metadata;
  const totalResults = productsData?.results || 0;
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = category || brand || sort || keyword;

  const FiltersContent = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Search in Filters */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium">
          Search Products
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={keyword}
            onChange={(e) => updateFilter("keyword", e.target.value || null)}
            className="pl-9 sm:pl-10 h-9 sm:h-10 text-sm"
          />
          {keyword && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => updateFilter("keyword", null)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium">Category</label>
        <Select
          value={category || "all"}
          onValueChange={(value) =>
            updateFilter("category", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="h-9 sm:h-10 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">
              All Categories
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id} className="text-sm">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium">Brand</label>
        <Select
          value={brand || "all"}
          onValueChange={(value) =>
            updateFilter("brand", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="h-9 sm:h-10 text-sm">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">
              All Brands
            </SelectItem>
            {brands.map((b) => (
              <SelectItem key={b._id} value={b._id} className="text-sm">
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium">Sort By</label>
        <Select
          value={sort || "default"}
          onValueChange={(value) =>
            updateFilter("sort", value === "default" ? null : value)
          }
        >
          <SelectTrigger className="h-9 sm:h-10 text-sm">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default" className="text-sm">
              Default
            </SelectItem>
            <SelectItem value="-price" className="text-sm">
              Price: High to Low
            </SelectItem>
            <SelectItem value="price" className="text-sm">
              Price: Low to High
            </SelectItem>
            <SelectItem value="-sold" className="text-sm">
              Best Selling
            </SelectItem>
            <SelectItem value="-ratingsAverage" className="text-sm">
              Top Rated
            </SelectItem>
            <SelectItem value="-createdAt" className="text-sm">
              Newest
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          className="w-full h-9 sm:h-10"
          onClick={clearFilters}
        >
          <X className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <div className="container px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
        {/* Hero Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Premium Products
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl">
            Discover Products
          </h1>
          <p className="mx-auto mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
            Find the perfect products from our curated collection
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">{totalResults}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">
                  {categories.length}
                </p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-green-500/10 p-2">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">{brands.length}</p>
                <p className="text-xs text-muted-foreground">Brands</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">100%</p>
                <p className="text-xs text-muted-foreground">Quality</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 font-semibold text-lg">Filters</h2>
              <FiltersContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Search Bar */}
            <div className="mb-6 flex flex-col gap-4">
              {/* Mobile Filters Button and Active Filters */}
              <div className="flex items-center justify-between">
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="mr-2 h-3.5 w-3.5" />
                      Filters
                      {hasFilters && (
                        <Badge className="ml-2 h-5 w-5 p-0 rounded-full">
                          !
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85%] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="text-lg">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Desktop Sort - Hidden on mobile */}
                <div className="hidden lg:block">
                  <Select
                    value={sort || "default"}
                    onValueChange={(value) =>
                      updateFilter("sort", value === "default" ? null : value)
                    }
                  >
                    <SelectTrigger className="w-48 h-10">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="-price">Price: High to Low</SelectItem>
                      <SelectItem value="price">Price: Low to High</SelectItem>
                      <SelectItem value="-sold">Best Selling</SelectItem>
                      <SelectItem value="-ratingsAverage">Top Rated</SelectItem>
                      <SelectItem value="-createdAt">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Bar - Full width on mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) =>
                    updateFilter("keyword", e.target.value || null)
                  }
                  className="pl-10 h-11 text-sm sm:text-base"
                />
                {keyword && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => updateFilter("keyword", null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Active Filters */}
              {hasFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium">
                    Active filters:
                  </span>
                  {keyword && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      Search: {keyword}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => updateFilter("keyword", null)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {category && categories.find((c) => c._id === category) && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      Category:{" "}
                      {categories.find((c) => c._id === category)?.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => updateFilter("category", null)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {brand && brands.find((b) => b._id === brand) && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      Brand: {brands.find((b) => b._id === brand)?.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => updateFilter("brand", null)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  {sort && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      Sort:{" "}
                      {sort === "-price"
                        ? "High to Low"
                        : sort === "price"
                        ? "Low to High"
                        : sort === "-sold"
                        ? "Best Selling"
                        : sort === "-ratingsAverage"
                        ? "Top Rated"
                        : sort === "-createdAt"
                        ? "Newest"
                        : "Default"}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => updateFilter("sort", null)}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 text-xs"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalResults}
                  </span>{" "}
                  products
                  {metadata && (
                    <span className="ml-2">
                      (Page {page} of {metadata.numberOfPages})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No products found</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {hasFilters
                      ? "Try adjusting your filters or search terms"
                      : "No products available at the moment"}
                  </p>
                  {hasFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {metadata && metadata.numberOfPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      Page {page} of {metadata.numberOfPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9"
                        disabled={page <= 1}
                        onClick={() => updateFilter("page", String(page - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {[...Array(Math.min(5, metadata.numberOfPages))].map(
                        (_, i) => {
                          const pageNum = i + 1;
                          if (metadata.numberOfPages > 5) {
                            // Show smart pagination for many pages
                            if (page <= 3) {
                              if (
                                pageNum <= 4 ||
                                pageNum === metadata.numberOfPages
                              ) {
                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      page === pageNum ? "default" : "outline"
                                    }
                                    size="sm"
                                    className="h-9 w-9"
                                    onClick={() =>
                                      updateFilter("page", String(pageNum))
                                    }
                                  >
                                    {pageNum === metadata.numberOfPages
                                      ? "..."
                                      : pageNum}
                                  </Button>
                                );
                              }
                            } else if (page >= metadata.numberOfPages - 2) {
                              if (
                                pageNum === 1 ||
                                pageNum >= metadata.numberOfPages - 3
                              ) {
                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      page === pageNum ? "default" : "outline"
                                    }
                                    size="sm"
                                    className="h-9 w-9"
                                    onClick={() =>
                                      updateFilter("page", String(pageNum))
                                    }
                                  >
                                    {pageNum === 1 ? "1" : pageNum}
                                  </Button>
                                );
                              }
                            } else {
                              if (
                                pageNum === 1 ||
                                pageNum === metadata.numberOfPages ||
                                (pageNum >= page - 1 && pageNum <= page + 1)
                              ) {
                                return (
                                  <Button
                                    key={pageNum}
                                    variant={
                                      page === pageNum ? "default" : "outline"
                                    }
                                    size="sm"
                                    className="h-9 w-9"
                                    onClick={() =>
                                      updateFilter("page", String(pageNum))
                                    }
                                  >
                                    {pageNum === 1
                                      ? "1"
                                      : pageNum === metadata.numberOfPages
                                      ? "..."
                                      : pageNum}
                                  </Button>
                                );
                              }
                            }
                            return null;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              size="sm"
                              className="h-9 w-9"
                              onClick={() =>
                                updateFilter("page", String(pageNum))
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9"
                        disabled={page >= metadata.numberOfPages}
                        onClick={() => updateFilter("page", String(page + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        {!isLoading && products.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-4 py-2 sm:px-6 sm:py-3 mb-4 sm:mb-6">
              <ShieldCheck className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium">
                Secure Shopping • Free Shipping • Easy Returns
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
