import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

export const CreateBtn = ({
  locale,
  id,
  text,
}: {
  locale: string;
  id: number;
  text: string;
}) => {
  return (
    <Button size="sm" asChild className="h-8">
      <Link href={`/${locale}/sites/${id}/listings/create`}>
        <Icon icon="heroicons:plus" className="w-3.5 h-3.5 mr-2" />
        {text}
      </Link>
    </Button>
  );
};
