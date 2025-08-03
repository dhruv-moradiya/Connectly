import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { showToast } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { emailVerifyThunk } from "@/store/auth/auth-thunks";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const OtpVerificationForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isFormLoading, isAuthenticated, error } = useAppSelector(
    (state) => state.auth
  );
  const { email: userEmail } = useParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!userEmail) {
      showToast(
        "Email verification failed",
        "Email address is missing.",
        "error"
      );
      return;
    }
    dispatch(emailVerifyThunk({ otp: data.pin, email: userEmail }));
  }

  useEffect(() => {
    if (isAuthenticated && !error) {
      navigate("/");
    }
  }, [isAuthenticated, error]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isFormLoading} className="">
          {isFormLoading ? <div className="btn-spinner" /> : "Verify"}
        </Button>
      </form>
    </Form>
  );
};

export default OtpVerificationForm;
