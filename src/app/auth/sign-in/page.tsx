import SignInForm from "@/app/auth/sign-in/sign-in-form";

export default function SignInPage() {
  return (
    <div className={"w-screen h-screen flex items-center justify-center p-8"}>
      <div className={"w-full max-w-4xl p-4 bg-white rounded-2xl shadow-xl"}>
        <h1 className={"text-2xl font-bold"}>Sign In</h1>
        <SignInForm />
      </div>
    </div>
  );
}
