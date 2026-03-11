"use client";
import { useConfig } from "@/hooks/use-config";
import React from "react";
import { cn } from "@/lib/utils";

const LayoutContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useConfig();

  if (config.sidebar === "two-column") {
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;
    const sidebarOffset = (config.menuHidden || config.layout === "horizontal" || !isDesktop)
      ? "0px"
      : (config.subMenu || !config.hasSubMenu ? "72px" : "300px");

    return (
      <main
        style={{ marginLeft: sidebarOffset }}
        className={cn("flex-1", {
          "bg-default-100 dark:bg-background": config.skin === "default",
          "bg-transparent": config.skin === "bordered",
        })}
      >
        <div
          className={cn("p-6 mb-24 md:mb-0", {
            "container ": config.contentWidth === "boxed",
          })}
        >
          {children}
        </div>
      </main>
    );
  }

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;
  const sidebarOffset = (config.menuHidden || config.layout === "horizontal" || !isDesktop)
    ? "0px"
    : (config.sidebar === "compact" ? "112px" : (config.collapsed ? "72px" : "248px"));

  return (
    <>
      <main
        style={{ marginLeft: sidebarOffset }}
        className={cn("flex-1", {
          "bg-default-100 dark:bg-background": config.skin === "default",
          "bg-transparent": config.skin === "bordered",
          "pt-6": config.navbar === "floating" && config.layout !== "semi-box",
        })}
      >
        <div
          className={cn("mb-24 md:mb-0", {
            container: config.contentWidth === "boxed",
            "p-6": config.layout !== "semi-box",
            "py-10": config.layout === "semi-box",
            "lg:p-0 px-0 lg:ms-6 mt-6 md:mb-6": config.layout === "compact",
          })}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default LayoutContentProvider;
