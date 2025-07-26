import OtpVerificationForm from "@/components/otp-verification-form";

const InputOTPForm = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <OtpVerificationForm />
      </div>
    </div>
  );
};

export default InputOTPForm;
