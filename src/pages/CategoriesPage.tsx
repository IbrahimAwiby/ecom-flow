import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { categoriesService } from "@/services/categories.service";

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const categories = data?.data || [];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Categories</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all product categories
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))
          : categories.map((category) => (
              <Link
                key={category._id}
                to={`/categories/${category._id}`}
                className="group flex flex-col items-center gap-4"
              >
                <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted transition-all group-hover:shadow-elevated">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-center font-medium transition-colors group-hover:text-primary">
                  {category.name}
                </h3>
              </Link>
            ))}
      </div>
    </div>
  );
}
