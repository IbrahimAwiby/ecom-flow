import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  const keyword = searchParams.get("keyword") || undefined;

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", page, category, brand, sort, keyword],
    queryFn: () =>
      productsService.getAll({
        page,
        limit: 12,
        category,
        brand,
        sort,
        keyword,
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
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={category || "all"}
          onValueChange={(value) => updateFilter("category", value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Brand</label>
        <Select
          value={brand || "all"}
          onValueChange={(value) => updateFilter("brand", value === "all" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b._id} value={b._id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select
          value={sort || "default"}
          onValueChange={(value) => updateFilter("sort", value === "default" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default" />
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

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        <p className="mt-2 text-muted-foreground">
          {productsData?.results || 0} products found
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold">Filters</h2>
            <FiltersContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter & Search */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2">
              {/* Mobile Filters */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {hasFilters && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Desktop Sort */}
              <div className="hidden lg:block">
                <Select
                  value={sort || "default"}
                  onValueChange={(value) => updateFilter("sort", value === "default" ? null : value)}
                >
                  <SelectTrigger className="w-48">
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

            {/* Search */}
            <div className="w-full lg:w-64">
              <Input
                placeholder="Search products..."
                value={keyword || ""}
                onChange={(e) => updateFilter("keyword", e.target.value || null)}
              />
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg font-medium">No products found</p>
              <p className="mt-1 text-muted-foreground">Try adjusting your filters</p>
              {hasFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {metadata && metadata.numberOfPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => updateFilter("page", String(page - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="px-4 text-sm">
                    Page {page} of {metadata.numberOfPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= metadata.numberOfPages}
                    onClick={() => updateFilter("page", String(page + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
