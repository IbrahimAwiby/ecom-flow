import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { categoriesService } from "@/services/categories.service";

export function CategoriesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const categories = data?.data.slice(0, 6) || [];

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse our wide selection of categories
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/categories">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            : categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category._id}`}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted transition-all group-hover:shadow-elevated">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <span className="text-sm font-medium transition-colors group-hover:text-primary">
                    {category.name}
                  </span>
                </Link>
              ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link to="/categories">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
