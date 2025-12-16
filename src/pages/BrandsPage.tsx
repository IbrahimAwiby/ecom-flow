import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { brandsService } from "@/services/brands.service";

export default function BrandsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: brandsService.getAll,
  });

  const brands = data?.data || [];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Brands</h1>
        <p className="mt-2 text-muted-foreground">
          Shop from your favorite brands
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))
          : brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/brands/${brand._id}`}
                className="group flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-soft"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-20 w-auto object-contain grayscale transition-all group-hover:grayscale-0"
                />
              </Link>
            ))}
      </div>
    </div>
  );
}
