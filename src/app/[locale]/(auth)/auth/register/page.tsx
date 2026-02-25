import RegForm from "@/components/partials/auth/reg-form";
import Logo from "@/components/partials/auth/logo";
import Copyright from "@/components/partials/auth/copyright";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Create Account — GoMarketPlatform",
  description: "Create GoMarketPlatform account",
};

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

const RegisterPage = async ({ params }: RegisterPageProps) => {
  return (
    <div className="flex justify-center w-full min-h-screen">
      {/* Left form panel */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-center px-6 py-12 sm:px-10 xl:px-16 bg-background order-2 lg:order-1">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-bold text-default-900 mb-1">
              Create your account
            </h2>
            <p className="text-default-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <Separator className="my-5" />

          {/* Register Form */}
          <RegForm />

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-default-400">
            <Copyright />
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
