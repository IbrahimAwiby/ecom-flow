import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { addressesService } from "@/services/addresses.service";

const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  details: z.string().min(5, "Please enter more details"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Please enter a valid phone number"),
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
      toast({ title: "Address added" });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setDialogOpen(false);
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: addressesService.remove,
    onSuccess: () => {
      toast({ title: "Address removed" });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const addresses = data?.data || [];

  const onSubmit = (data: AddressForm) => {
    addMutation.mutate(data as Required<AddressForm>);
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-display text-3xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground">{addresses.length} saved addresses</p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Address Name</Label>
                <Input
                  id="name"
                  placeholder="Home, Office, etc."
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Address Details</Label>
                <Input
                  id="details"
                  placeholder="Street, building, floor..."
                  {...register("details")}
                />
                {errors.details && (
                  <p className="text-sm text-destructive">{errors.details.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Cairo, Alexandria, etc."
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="01012345678"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={addMutation.isPending}>
                {addMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Address
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <MapPin className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No addresses saved</h2>
          <p className="mt-2 text-muted-foreground">
            Add an address for faster checkout
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address._id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{address.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMutation.mutate(address._id)}
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{address.details}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {address.city} • {address.phone}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
