import LayoutProvider from "@/providers/layout.provider";
import LayoutContentProvider from "@/providers/content.provider";
import DashCodeSidebar from "@/components/partials/sidebar";
import DashCodeFooter from "@/components/partials/footer";
import ThemeCustomize from "@/components/partials/customizer";
import DashCodeHeader from "@/components/partials/header";
import { SiteService } from "@/api/services/site-service";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const statsData = await SiteService.getDashboardStatistics();

  if (!statsData) {
    return <div>Loading...</div>;
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
