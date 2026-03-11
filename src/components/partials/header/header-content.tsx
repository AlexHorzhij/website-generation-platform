"use client";
import React from "react";
import { useConfig } from "@/hooks/use-config";
import { cn } from "@/lib/utils";

const HeaderContent = ({ children }: { children: React.ReactNode }) => {
  const [config] = useConfig();

  if (config.sidebar === "two-column") {
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;
    const sidebarOffset = (config.menuHidden || config.layout === "horizontal" || !isDesktop)
      ? "0px"
      : (config.subMenu || !config.hasSubMenu ? "72px" : "300px");

    return (
      <header
        className={cn("top-0 z-50", config.navbar, {
          "has-sticky-header sticky top-6  px-6 ": config.navbar === "floating",
        })}
      >
        <div
          style={{ marginLeft: sidebarOffset }}
          className={cn(
            "flex-none bg-header backdrop-blur-lg md:px-6 px-[15px] py-3 flex items-center justify-between relative",
            {
              "border-b":
                config.skin === "bordered" && config.layout !== "semi-box",
              border:
                config.skin === "bordered" && config.layout === "semi-box",
              "shadow-base": config.skin === "default",
              "rounded-md": config.navbar === "floating",
            }
          )}
        >
          {children}
        </div>
      </header>
    );
  }

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;
  const headerOffset = (config.menuHidden || config.layout === "horizontal" || !isDesktop)
    ? "0px"
    : (config.sidebar === "compact" ? "112px" : (config.collapsed ? "72px" : "248px"));

  return (
    <header
      className={cn("top-0 z-50", config.navbar, {
        [`dark theme-${config.headerColor}`]: config.headerColor !== "light",
        "has-sticky-header sticky top-6  px-6 ": config.navbar === "floating",
        "top-10 has-sticky-header": config.layout === "compact",
        "has-sticky-header":
          config.layout === "semi-box" && config.navbar !== "floating",
        "top-0 px-0":
          config.layout === "semi-box" && config.navbar === "floating",
      })}
    >
      <div
        style={{ marginLeft: headerOffset }}
        className={cn(
          "flex-none bg-header backdrop-blur-lg md:px-6 px-[15px] py-3 flex items-center justify-between relative ",
          {
            "border-b":
              config.skin === "bordered" && config.layout !== "semi-box",
            border: config.skin === "bordered" && config.layout === "semi-box",
            "shadow-base": config.skin === "default",
            "top-6 rounded-md": config.layout === "semi-box",
            "rounded-md": config.navbar === "floating",
          }
        )}
      >
        {children}
      </div>
    </header>
  );
};

export default HeaderContent;
