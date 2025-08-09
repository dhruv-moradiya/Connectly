import { memo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { registerUser } from "@/api";
import { cn, showToast } from "@/lib/utils";
import { SignupSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { IUserRegistrationResponse } from "@/types/auth-type";

const SignupForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {},
  });

  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleSubmitForm = async (data: z.infer<typeof SignupSchema>) => {
    try {
      setIsFormLoading(true);

      const response: IUserRegistrationResponse = await registerUser(data);

      if (response.success) {
        showToast("Registration successful", response.message, "success");
        navigate(`/auth/email-verification/${data.email}`);
      } else {
        showToast("Registration failed", response.message, "error");
      }
    } catch (error) {
      console.error("Registration error:", error);

      showToast(
        "Registration failed",
        error instanceof Error ? error.message : "Something went wrong.",
        "error"
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Create a new account to get started with our service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    placeholder="ravi"
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    type="bio"
                    placeholder="A short bio about yourself"
                    {...register("bio")}
                  />
                </div>
                {errors.bio && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.bio.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ravi@example.com"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? <div className="btn-spinner" /> : "Signup"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(SignupForm);
