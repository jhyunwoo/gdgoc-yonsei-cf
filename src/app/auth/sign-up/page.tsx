import SignUpForm from "@/app/auth/sign-up/sign-up-form";

export default function SignUpPage() {
  return (
    <div className={"w-full h-screen flex items-center justify-center p-8"}>
      <div>
        <h1 className={"text-xl font-bold"}>Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
