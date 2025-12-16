import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <CardContent className="p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-5 w-full" />
        <Skeleton className="mt-1 h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-20" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
