import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { brandsService } from "@/services/brands.service";
import { productsService } from "@/services/products.service";

export default function BrandDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: brandData, isLoading: brandLoading } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => brandsService.getById(id!),
    enabled: !!id,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "brand", id],
    queryFn: () => productsService.getAll({ brand: id }),
    enabled: !!id,
  });

  const brand = brandData?.data;
  const products = productsData?.data || [];

  if (brandLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-32 w-32 rounded-xl" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Brand not found</h1>
          <Link to="/brands" className="mt-4 text-primary hover:underline">
            Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/brands" className="hover:text-foreground">Brands</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-border bg-card p-4">
          <img
            src={brand.image}
            alt={brand.name}
            className="h-full w-auto object-contain"
          />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{brand.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {productsData?.results || 0} products
          </p>
        </div>
      </div>

      {/* Products */}
      <section>
        <h2 className="mb-6 font-display text-2xl font-bold">Products</h2>
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg font-medium">No products from this brand</p>
            <Link to="/products" className="mt-2 text-primary hover:underline">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
