import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { LoginSchema, type TLoginSchemaType } from "@/lib/schema";
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
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUserThunk } from "@/store/auth/auth-thunks";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isFormLoading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "123456",
    },
  });

  const handleSubmitForm = async (data: TLoginSchemaType) => {
    dispatch(
      loginUserThunk({ username: data.username, password: data.password })
    );
  };

  useEffect(() => {
    if (isAuthenticated && !error) {
      navigate("/");
    }
  }, [isAuthenticated, error]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
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
                    placeholder="Quick Brown Fox"
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
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
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? <div className="btn-spinner" /> : "Login"}
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
