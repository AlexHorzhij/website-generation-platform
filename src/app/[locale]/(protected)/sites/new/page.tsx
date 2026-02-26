import { getTranslations } from "next-intl/server";
import { CreateSiteForm } from "../_components/create-site-form";
import { Link } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const CreateSitePage = async () => {
  const t = await getTranslations("SitesManagement");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sites">
          <Button variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-default-900">
            Create New Site
          </h2>
          <p className="text-sm text-default-500">
            Set up a new marketplace instance
          </p>
        </div>
      </div>

      <CreateSiteForm />
    </div>
  );
};

export default CreateSitePage;
