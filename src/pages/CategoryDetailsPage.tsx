import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { categoriesService } from "@/services/categories.service";
import { productsService } from "@/services/products.service";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesService.getById(id!),
    enabled: !!id,
  });

  const { data: subcategoriesData } = useQuery({
    queryKey: ["subcategories", id],
    queryFn: () => categoriesService.getSubcategories(id!),
    enabled: !!id,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "category", id],
    queryFn: () => productsService.getAll({ category: id }),
    enabled: !!id,
  });

  const category = categoryData?.data;
  const subcategories = subcategoriesData?.data || [];
  const products = productsData?.data || [];

  if (categoryLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link to="/categories" className="mt-4 text-primary hover:underline">
            Back to Categories
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
        <Link to="/categories" className="hover:text-foreground">Categories</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl">
        <img
          src={category.image}
          alt={category.name}
          className="h-48 w-full object-cover md:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="font-display text-3xl font-bold text-card md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-card/80">
            {productsData?.results || 0} products
          </p>
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 font-semibold">Subcategories</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link
                key={sub._id}
                to={`/products?category=${id}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-muted"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </section>
      )}

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
            <p className="text-lg font-medium">No products in this category</p>
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
