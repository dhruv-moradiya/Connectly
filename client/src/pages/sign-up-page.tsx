import SignupForm from "@/components/signup-form";

export function SignUp() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
