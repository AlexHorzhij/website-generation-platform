import ForgotPass from "@/components/partials/auth/forgot-pass";
import Logo from "@/components/partials/auth/logo";
import Copyright from "@/components/partials/auth/copyright";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — GoMarketPlatform",
  description: "Reset your GoMarketPlatform account password",
};

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>;
}

const ForgotPasswordPage = async ({ params }: ForgotPasswordPageProps) => {
  const { locale } = await params;

  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-center px-6 py-12 sm:px-10 xl:px-16 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Logo />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-default-900 mb-1">
              Forgot Your Password?
            </h2>
            <p className="text-default-500 text-sm">
              Enter your email to reset your password.
            </p>
          </div>

          {/* Form */}
          <ForgotPass />

          <div className="mt-6 text-center text-sm">
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Back to login
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-default-400">
            <Copyright />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
