import LoginForm from "@/components/partials/auth/login-form";
import Logo from "@/components/partials/auth/logo";
import Copyright from "@/components/partials/auth/copyright";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — GoMarketPlatform",
  description: "Sign in to your GoMarketPlatform account",
};

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

const LoginPage = async ({ params }: LoginPageProps) => {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <p className="absolute bottom-6 text-white/40 text-xs">
        <Copyright />
      </p>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-center px-6 py-12 sm:px-10 xl:px-16 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-default-900">
              Sign in to your account
            </h2>
          </div>

          {/* <Separator className="my-5" /> */}

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <p className="text-center mt-10 text-xs text-default-400">
            <Copyright />
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
