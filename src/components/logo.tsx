"use client";
import Image from "next/image";
import DashCodeLogo from "./dascode-logo";
import { Link } from "@/i18n/routing";
import { useConfig } from "@/hooks/use-config";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";

const Logo = () => {
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  if (config.sidebar === "compact") {
    return (
      <Link href="/" className="flex gap-2 items-center   justify-center    ">
        <DashCodeLogo className="text-default-900" />
      </Link>
    );
  }
  if (config.sidebar === "two-column" || !isDesktop) return null;

  return (
    <Link href="/" className="flex gap-2 items-center    ">
      <DashCodeLogo className="text-default-900" />
      {(!config?.collapsed || hovered) && (
        <Image
          src="/images/logo/logo-text.png"
          alt="logo"
          width={140}
          height={32}
          priority
        />
      )}
    </Link>
  );
};

export default Logo;
