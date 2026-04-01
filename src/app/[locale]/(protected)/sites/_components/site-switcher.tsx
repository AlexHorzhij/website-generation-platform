"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/components/navigation";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSites } from "@/api/hooks/use-sites";
import { Site } from "@/api/types/site";

interface SiteSwitcherProps {
  currentSite: Site;
}

export function SiteSwitcher({ currentSite }: SiteSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const { data: sites = [] } = useSites();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("SitesManagement");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 px-2 -ml-2 text-2xl font-bold text-default-900 hover:bg-default-100 hover:text-default-300 transition-colors h-auto py-1"
        >
          <div className="flex flex-col items-start gap-0">
            <span className="flex items-center gap-2">
              {currentSite.marketplaceName}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </span>
            <span className="text-sm font-normal text-default-500 lowercase">
              {currentSite.domainName}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("find_site")} />
          <CommandList>
            <CommandEmpty>{t("no_site_found")}</CommandEmpty>
            <CommandGroup>
              {sites.map((site) => (
                <CommandItem
                  key={site.id}
                  value={`${site.marketplaceName} ${site.domainName}`}
                  onSelect={() => {
                    setOpen(false);
                    const newPath = pathname.replace(
                      `/sites/${currentSite.id}`,
                      `/sites/${site.id}`,
                    );
                    router.push(newPath);
                  }}
                  className="flex items-center justify-between py-3 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-default-900">
                      {site.marketplaceName}
                    </span>
                    <span className="text-xs text-default-500 lowercase">
                      {site.domainName}
                    </span>
                  </div>
                  {currentSite.id === site.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
