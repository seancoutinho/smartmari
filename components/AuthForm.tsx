"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "./CustomFormField";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      console.log(data);
      //Sign Up with appwrite and create plaid link
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      } 
      
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex mb-12 cursor-pointer gap-1 items-center">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Save Mari Logo"
          />
          <h1 className="text-26 font-ibm-plex-mono font-bold text-black-1">
            SmartMari
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link Your Account to get started"
              : "Please enter your details"}{" "}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">{/* Plaid Link */}</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomFormField
                      type={"text"}
                      control={form.control}
                      name={"firstName"}
                      label={"First Name"}
                      placeholder="Enter your first name"
                    />
                    <CustomFormField
                      type={"text"}
                      control={form.control}
                      name={"lastName"}
                      label={"Last Name"}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <CustomFormField
                    type={"text"}
                    control={form.control}
                    name={"address1"}
                    label={"Address"}
                    placeholder="Enter your home address"
                  />
                  <CustomFormField
                    type={"text"}
                    control={form.control}
                    name={"city"}
                    label={"City"}
                    placeholder="ex: New York"
                  />
                  <div className="flex gap-4">
                    <CustomFormField
                      type={"text"}
                      control={form.control}
                      name={"state"}
                      label={"State"}
                      placeholder="ex: NY"
                    />
                    <CustomFormField
                      type={"text"}
                      control={form.control}
                      name={"postalCode"}
                      label={"Postal Code"}
                      placeholder="ex: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomFormField
                      type={"text"}
                      control={form.control}
                      name={"dateOfBirth"}
                      label={"Date of Birth"}
                      placeholder="dd/mm/yyyy"
                    />
                    <CustomFormField
                      type={"text"}
                      control={form.control}
                      name={"ssn"}
                      label={"SSN"}
                      placeholder="ex: 125489"
                    />
                  </div>
                </>
              )}
              <CustomFormField
                type={"email"}
                control={form.control}
                name={"email"}
                label={"Email"}
                placeholder={"Enter your email"}
              />
              <CustomFormField
                type={"password"}
                control={form.control}
                name={"password"}
                label={"Password"}
                placeholder={"Enter your password"}
              />
              <div className="flex flex-col gap-4">
                <Button className="form-btn" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type == "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <form className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}>
              {type === "sign-in" ? "Sign In" : "Sign Up"}
            </Link>
          </form>
        </>
      )}
    </section>
  );
};

export default AuthForm;