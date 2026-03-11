import LayoutProvider from "@/providers/layout.provider";
import LayoutContentProvider from "@/providers/content.provider";
import DashCodeSidebar from "@/components/partials/sidebar";
import DashCodeFooter from "@/components/partials/footer";
import ThemeCustomize from "@/components/partials/customizer";
import DashCodeHeader from "@/components/partials/header";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/routing";
const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const session = cookieStore.get("JSESSIONID");

  if (!session) {
    redirect({ href: "/auth/login", locale: "uk" });
  }

  return (
    <LayoutProvider>
      {/* <ThemeCustomize /> */}
      <DashCodeHeader />
      <DashCodeSidebar />
      <LayoutContentProvider>{children}</LayoutContentProvider>
      <DashCodeFooter />
    </LayoutProvider>
  );
};

export default layout;
