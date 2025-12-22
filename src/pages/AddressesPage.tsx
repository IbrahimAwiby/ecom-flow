import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Plus,
  Trash2,
  Loader2,
  Home,
  Building,
  Navigation,
  Phone,
  FileText,
  Building2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { addressesService } from "@/services/addresses.service";
import { cn } from "@/lib/utils";

const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  details: z.string().min(5, "Please enter more details"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number"),
  city: z.string().min(2, "City is required"),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressesService.getAll,
  });

  const addMutation = useMutation({
    mutationFn: addressesService.add,
    onSuccess: () => {
      toast({
        title: "Address added successfully",
        description: "Your new address has been saved",
      });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setDialogOpen(false);
      reset();
    },
    onError: () => {
      toast({
        title: "Failed to add address",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: addressesService.remove,
    onSuccess: () => {
      toast({
        title: "Address removed",
        description: "Address has been deleted from your saved addresses",
      });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: () => {
      toast({
        title: "Failed to remove address",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const addresses = data?.data || [];

  const onSubmit = (data: AddressForm) => {
    addMutation.mutate(data as Required<AddressForm>);
  };

  const getAddressIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("home"))
      return <Home className="h-5 w-5 text-blue-500" />;
    if (lowerName.includes("office") || lowerName.includes("work"))
      return <Building className="h-5 w-5 text-purple-500" />;
    return <Navigation className="h-5 w-5 text-green-500" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
        <div className="container px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          <Skeleton className="mb-8 h-10 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container px-4 py-6 sm:px-6 sm:py-8 md:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <MapPin className="relative h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                  My Addresses
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {addresses.length} saved addresses
                </p>
              </div>
            </div>

            <Button
              size="lg"
              className="rounded-xl group"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
              Add Address
            </Button>
          </div>

          {/* Stats Card */}
          <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold">
                    {addresses.length}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total Addresses
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold">
                    {
                      addresses.filter((a) =>
                        a.name.toLowerCase().includes("home")
                      ).length
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Home
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold">
                    {
                      addresses.filter(
                        (a) =>
                          a.name.toLowerCase().includes("office") ||
                          a.name.toLowerCase().includes("work")
                      ).length
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Work
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold">
                    {
                      addresses.filter(
                        (a) =>
                          !a.name.toLowerCase().includes("home") &&
                          !a.name.toLowerCase().includes("office") &&
                          !a.name.toLowerCase().includes("work")
                      ).length
                    }
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Other
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-16 sm:py-24 backdrop-blur-sm">
            <div className="text-center px-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold">
                No addresses saved
              </h2>
              <p className="mt-2 sm:mt-3 text-muted-foreground max-w-md mx-auto">
                Add your first address for faster checkout and delivery
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="rounded-xl"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add First Address
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {addresses.map((address) => (
                <Card
                  key={address._id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/50"
                >
                  <CardHeader
                    className={cn(
                      "pb-3 px-4 sm:px-6",
                      address.name.toLowerCase().includes("home")
                        ? "bg-blue-500/5"
                        : address.name.toLowerCase().includes("office") ||
                          address.name.toLowerCase().includes("work")
                        ? "bg-purple-500/5"
                        : "bg-green-500/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-background/50">
                          {getAddressIcon(address.name)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {address.name}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {address.city}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMutation.mutate(address._id)}
                        disabled={removeMutation.isPending}
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      >
                        {removeMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                          <p className="text-sm sm:text-base">
                            {address.details}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {address.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {address.phone}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {address.name.toLowerCase().includes("home")
                            ? "Home"
                            : address.name.toLowerCase().includes("office") ||
                              address.name.toLowerCase().includes("work")
                            ? "Work"
                            : "Other"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMutation.mutate(address._id)}
                          disabled={removeMutation.isPending}
                          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {removeMutation.isPending ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="mr-1 h-3 w-3" />
                          )}
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add More CTA */}
            <div className="mt-8 sm:mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Need another address?
                  </h3>
                  <p className="text-muted-foreground">
                    Add delivery addresses for home, work, or other locations.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="rounded-xl group"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                  Add New Address
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Add Address Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Address
              </DialogTitle>
              <DialogDescription>
                Add a new delivery address for faster checkout
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Address Name</Label>
                  <Input
                    id="name"
                    placeholder="Home, Office, Work, etc."
                    {...register("name")}
                    className="h-11"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Address Details</Label>
                  <Input
                    id="details"
                    placeholder="Street, building, floor, apartment number..."
                    {...register("details")}
                    className="h-11"
                  />
                  {errors.details && (
                    <p className="text-sm text-destructive">
                      {errors.details.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Cairo, Alexandria, Giza..."
                      {...register("city")}
                      className="h-11"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="01012345678"
                      {...register("phone")}
                      className="h-11"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    reset();
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none"
                  disabled={addMutation.isPending}
                >
                  {addMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Address
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
