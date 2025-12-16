import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rePassword: z.string(),
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords don't match",
  path: ["rePassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();
  const { setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data) => {
      setToken(data.token);
      toast({
        title: "Password changed!",
        description: "Your password has been successfully updated",
      });
      reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Current password is incorrect",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data as Required<ChangePasswordForm>);
  };

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("currentPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rePassword">Confirm New Password</Label>
              <Input
                id="rePassword"
                type="password"
                placeholder="••••••••"
                {...register("rePassword")}
              />
              {errors.rePassword && (
                <p className="text-sm text-destructive">{errors.rePassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
