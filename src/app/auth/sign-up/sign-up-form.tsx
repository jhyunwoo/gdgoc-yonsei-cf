"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { createAuthClient } from "better-auth/react";

type Inputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default function SignUpForm() {
  const authClient = createAuthClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (inputData) => {
    const { data, error } = await authClient.signUp.email({
      name: inputData.name, // required
      email: inputData.email, // required
      password: inputData.password, // required
    });
    console.log(data, error);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"flex flex-col gap-2 items-center"}
    >
      <input placeholder={"name"} {...register("name", { required: true })} />

      <input placeholder={"email"} {...register("email", { required: true })} />

      <input
        placeholder={"password"}
        {...register("password", { required: true })}
      />
      <input
        placeholder={"password confirmation"}
        {...register("passwordConfirmation", { required: true })}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
