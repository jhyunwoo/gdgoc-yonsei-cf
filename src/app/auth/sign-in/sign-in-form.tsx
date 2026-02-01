"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { createAuthClient } from "better-auth/react";

type Inputs = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const authClient = createAuthClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (inputData) => {
    const { data, error } = await authClient.signIn.email({
      email: inputData.email, // required
      password: inputData.password, // required
      callbackURL: "/profile",
    });
    console.log(data, error);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"flex flex-col gap-2 items-center"}
    >
      <input placeholder={"email"} {...register("email", { required: true })} />

      <input
        placeholder={"password"}
        type={"password"}
        {...register("password", { required: true })}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
