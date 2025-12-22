import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";

// Accept both 5 or 6 digits
const verifyCodeSchema = z.object({
  resetCode: z
    .string()
    .min(5, "Reset code must be at least 5 digits")
    .max(6, "Reset code cannot exceed 6 digits")
    .regex(/^[0-9]+$/, "Reset code must contain only numbers"),
});

type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;

export default function VerifyResetCodePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeForm>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: authService.verifyResetCode,
    onSuccess: (response) => {
      toast({
        title: "Code verified!",
        description: "You can now reset your password",
      });
      navigate("/reset-password", { state: { email } });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid code",
        description:
          error.response?.data?.message || "The code is invalid or expired",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VerifyCodeForm) => {
    verifyMutation.mutate({ resetCode: data.resetCode });
  };

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">
            Verify Reset Code
          </CardTitle>
          <CardDescription>
            Enter the 5 or 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetCode">Reset Code</Label>
              <Input
                id="resetCode"
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                {...register("resetCode")}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, "");
                  e.target.value = value;
                }}
              />
              {errors.resetCode && (
                <p className="text-sm text-destructive">
                  {errors.resetCode.message}
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Enter the 5 or 6-digit code you received in your email
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify Code
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
