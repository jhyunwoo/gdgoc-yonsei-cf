"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/client";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (inputData) => {
    const { data, error } = await authClient.signUp.email({
      name: inputData.firstName + " " + inputData.lastName,
      email: inputData.email,
      password: inputData.password,
      callbackURL: "/profile",
      firstName: inputData.firstName,
      lastName: inputData.lastName,
    } as Parameters<typeof authClient.signUp.email>[0]);
    console.log(data, error);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"flex flex-col gap-2 items-center"}
    >
      <input
        placeholder={"first name"}
        {...register("firstName", { required: true })}
      />
      <input
        placeholder={"last name"}
        {...register("lastName", { required: true })}
      />

      <input placeholder={"email"} {...register("email", { required: true })} />

      <input
        placeholder={"password"}
        type={"password"}
        {...register("password", { required: true })}
      />
      <input
        placeholder={"password confirmation"}
        type={"password"}
        {...register("passwordConfirmation", { required: true })}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
