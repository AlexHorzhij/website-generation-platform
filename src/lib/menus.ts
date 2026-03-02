export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t("dashboard"),
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/",
          label: t("dashboard"),
          active: pathname === "/" || pathname === "/en" || pathname === "/uk",
          icon: "heroicons-outline:home",
          submenus: [],
        },
        {
          id: "sites",
          href: "/sites",
          label: t("sites"),
          active: pathname.includes("/sites"),
          icon: "heroicons-outline:globe-alt",
          submenus: [],
        },
        {
          id: "users",
          href: "/users",
          label: t("users"),
          active: pathname.includes("/users"),
          icon: "heroicons-outline:users",
          submenus: [],
        },
        {
          id: "listings",
          href: "/listings",
          label: t("listings"),
          active: pathname.includes("/listings"),
          icon: "heroicons-outline:view-list",
          submenus: [],
        },
        {
          id: "contacts",
          href: "/contacts",
          label: t("contacts"),
          active: pathname.includes("/contacts"),
          icon: "heroicons-outline:phone",
          submenus: [],
        },
        {
          id: "domains",
          href: "/domains",
          label: t("domains"),
          active: pathname.includes("/domains"),
          icon: "heroicons-outline:link",
          submenus: [],
        },
        {
          id: "prompts",
          href: "/prompts",
          label: t("prompts"),
          active: pathname.includes("/prompts"),
          icon: "heroicons-outline:chat-alt-2",
          submenus: [],
        },
      ],
    },
  ];
}

export function getSiteMenuList(
  pathname: string,
  siteId: string,
  t: any,
): Group[] {
  const base = `/sites/${siteId}`;
  return [
    {
      groupLabel: "",
      id: "site-nav",
      menus: [
        {
          id: "site-info",
          href: base,
          label: t("site_info"),
          active: pathname === base || pathname === `${base}/`,
          icon: "heroicons-outline:information-circle",
          submenus: [],
        },
        {
          id: "site-listings",
          href: `${base}/listings`,
          label: t("site_listings"),
          active: pathname.startsWith(`${base}/listings`),
          icon: "heroicons-outline:view-list",
          submenus: [],
        },
        {
          id: "site-contacts",
          href: `${base}/contacts`,
          label: t("site_contacts"),
          active: pathname.startsWith(`${base}/contacts`),
          icon: "heroicons-outline:phone",
          submenus: [],
        },
        {
          id: "site-seo",
          href: `${base}/seo`,
          label: t("site_seo"),
          active: pathname.startsWith(`${base}/seo`),
          icon: "heroicons-outline:search",
          submenus: [],
        },
      ],
    },
  ];
}
export function getHorizontalMenuList(pathname: string, t: any): Group[] {
  return [
    {
      groupLabel: t("dashboard"),
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/",
          label: t("dashboard"),
          active: pathname.includes("/"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
  ];
}
