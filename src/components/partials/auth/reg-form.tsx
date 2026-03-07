"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/components/navigation";
import { useRegister } from "@/api/hooks/use-auth";

const schema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Your email is invalid." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const RegForm = () => {
  const { mutate: registerUser, isPending } = useRegister();
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const toggleConfirmPasswordType = () => {
    setConfirmPasswordType(
      confirmPasswordType === "password" ? "text" : "password",
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    registerUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          {...register("name")}
          size="lg"
          className={cn("", { "border-destructive": errors.name })}
          disabled={isPending}
        />
        {errors.name && (
          <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="dashcode@gmail.com"
          {...register("email")}
          size="lg"
          className={cn("", { "border-destructive": errors.email })}
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-destructive text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={passwordType}
            placeholder="Enter password"
            {...register("password")}
            size="lg"
            className={cn("", { "border-destructive": errors.password })}
            disabled={isPending}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            <Icon
              icon={
                passwordType === "password"
                  ? "heroicons:eye"
                  : "heroicons:eye-slash"
              }
              className="w-5 h-5 text-default-400"
            />
          </div>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={confirmPasswordType}
            placeholder="Confirm password"
            {...register("confirmPassword")}
            size="lg"
            className={cn("", { "border-destructive": errors.confirmPassword })}
            disabled={isPending}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={toggleConfirmPasswordType}
          >
            <Icon
              icon={
                confirmPasswordType === "password"
                  ? "heroicons:eye"
                  : "heroicons:eye-slash"
              }
              className="w-5 h-5 text-default-400"
            />
          </div>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" fullWidth disabled={isPending} className="mt-5">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Creating account..." : "Create An Account"}
      </Button>
    </form>
  );
};

export default RegForm;
