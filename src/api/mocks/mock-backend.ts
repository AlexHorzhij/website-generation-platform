import {
  AxiosAdapter,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { CreateOrUpdateContactRequest } from "@/api/types/contact";
import {
  Category,
  CategoryGenerationRequest,
  CreateOrUpdateCategoryRequest,
  CreateSiteRequest,
  Region,
  UpdateSiteRequest,
} from "@/api/types/site";
import { UpdateAxisRequest } from "@/api/services/axis-service";
import { UpdatePromptRequest } from "@/api/types/prompt";
import {
  getDashboardStats,
  mockAxes,
  mockAxisTypes,
  mockCategories,
  mockContactsBySite,
  mockDomainDashboard,
  mockDomains,
  mockFolders,
  mockImagesByFolder,
  mockListings,
  mockPrompts,
  mockRegions,
  mockSiteMetadata,
  mockSites,
  mockUsers,
} from "@/api/mocks/data/mock-db";

type ReqConfig = InternalAxiosRequestConfig | AxiosRequestConfig;

let siteSeq = Math.max(...mockSites.map((s) => s.id), 100) + 1;
let categorySeq = Math.max(...mockCategories.map((c) => c.id), 1000) + 1;
let regionSeq = Math.max(...mockRegions.map((r) => r.id), 2000) + 1;
let listingSeq = Math.max(...mockListings.map((l) => l.id), 3000) + 1;
let contactSeq = Math.max(
  ...Object.values(mockContactsBySite)
    .flat()
    .map((c) => c.id),
  4000,
) + 1;
let axisSeq = Math.max(...mockAxes.map((a) => a.id), 5000) + 1;

const ok = <T>(config: ReqConfig, data: T, status = 200): Promise<AxiosResponse<T>> =>
  Promise.resolve({
    data,
    status,
    statusText: "OK",
    headers: {},
    config: config as InternalAxiosRequestConfig,
  });

const normalizeUrl = (rawUrl?: string): string => {
  if (!rawUrl) return "/";
  const withoutOrigin = rawUrl.replace(/^https?:\/\/[^/]+/, "");
  const versionless = withoutOrigin.replace(/^\/?api\/v\d+/, "");
  return versionless.startsWith("/") ? versionless : `/${versionless}`;
};

const parseUrl = (config: ReqConfig) => {
  const raw = normalizeUrl(config.url);
  const [pathname, query = ""] = raw.split("?");
  return { pathname, query: new URLSearchParams(query) };
};

const getJsonPayload = async <T>(config: ReqConfig): Promise<T> => {
  const data = config.data;
  if (!data) return {} as T;
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch {
      return {} as T;
    }
  }
  return data as T;
};

const getListingPayloadFromFormData = async (config: ReqConfig): Promise<any> => {
  const payload = config.data as FormData | undefined;
  if (!payload || typeof payload.get !== "function") return {};
  const listingPart = payload.get("listing");
  if (listingPart instanceof Blob) {
    const text = await listingPart.text();
    return JSON.parse(text);
  }
  if (typeof listingPart === "string") {
    return JSON.parse(listingPart);
  }
  return {};
};

const extractFolderName = (siteId: number): string => {
  return mockSites.find((s) => s.id === siteId)?.folder || `site-${siteId}`;
};

const unauthorized = (config: ReqConfig) =>
  Promise.reject({
    config,
    response: { status: 401, data: { message: "Unauthorized" } },
  });

export const mockApiAdapter: AxiosAdapter = async (config) => {
  const method = (config.method || "get").toLowerCase();
  const { pathname, query } = parseUrl(config);

  if (pathname === "/login" && method === "post") {
    const body = await getJsonPayload<{ username?: string }>(config);
    return ok(config, {
      message: "Logged in successfully (mock)",
      sessionId: "mock-session-id",
      username: body.username || "demo-user",
      role: "ADMIN",
    });
  }

  if (pathname === "/register" && method === "post") {
    const body = await getJsonPayload<{ email?: string; username?: string }>(config);
    return ok(config, {
      message: "Registered successfully (mock)",
      sessionId: "mock-session-id",
      username: body.username || body.email || "demo-user",
      role: "USER",
    });
  }

  if (pathname === "/logout" && method === "post") return ok(config, { success: true });
  if (pathname === "/users/me" && method === "get") return ok(config, mockUsers[0]);
  if (pathname === "/users" && method === "get") return ok(config, mockUsers);

  const makeAdminMatch = pathname.match(/^\/users\/(\d+)\/make-admin$/);
  if (makeAdminMatch && method === "patch") {
    const user = mockUsers.find((u) => u.id === Number(makeAdminMatch[1]));
    if (!user) return ok(config, { message: "User not found" }, 404);
    user.role = "ADMIN";
    return ok(config, { success: true });
  }

  const deleteUserMatch = pathname.match(/^\/users\/(\d+)$/);
  if (deleteUserMatch && method === "delete") {
    const userId = Number(deleteUserMatch[1]);
    const idx = mockUsers.findIndex((u) => u.id === userId);
    if (idx >= 0) mockUsers.splice(idx, 1);
    return ok(config, { success: true });
  }

  if (pathname === "/sites" && method === "get") return ok(config, mockSites);
  if (pathname === "/sites/metadata" && method === "get") return ok(config, mockSiteMetadata);
  if (pathname === "/sites/statistics/dashboard" && method === "get") {
    return ok(config, getDashboardStats());
  }

  if (pathname === "/sites/create" && method === "post") {
    const body = await getJsonPayload<CreateSiteRequest>(config);
    const newSite = {
      id: siteSeq++,
      domainName: body.domainName,
      marketplaceName: body.siteName,
      description: body.description,
      marketplaceNameEn: body.siteName,
      descriptionEn: body.description,
      region: body.region,
      subregions: "",
      themeId: body.themeId,
      ownerId: 1,
      ownerName: "admin",
      status: "DRAFT",
      currency: body.currency,
      language: body.language,
      autogeneration: false,
      autogenPerDay: 0,
      folder: body.domainName.split(".")[0],
      seoTitle: body.siteName,
      seoDescription: body.description,
      h1: body.siteName,
    };
    mockSites.push(newSite);
    mockContactsBySite[newSite.id] = [];
    return ok(config, newSite, 201);
  }

  const patchSiteMatch = pathname.match(/^\/sites\/(\d+)$/);
  if (patchSiteMatch && method === "patch") {
    const body = await getJsonPayload<UpdateSiteRequest>(config);
    const id = Number(patchSiteMatch[1]);
    const site = mockSites.find((s) => s.id === id);
    if (!site) return ok(config, { message: "Site not found" }, 404);
    site.marketplaceName = body.siteName;
    site.description = body.description;
    site.marketplaceNameEn = body.siteNameEn;
    site.descriptionEn = body.descriptionEn;
    site.currency = body.currency;
    site.seoTitle = body.seoTitle;
    site.seoDescription = body.seoDescription;
    site.h1 = body.h1;
    return ok(config, site);
  }

  const autogenPerDayMatch = pathname.match(/^\/sites\/(\d+)\/autogen-per-day$/);
  if (autogenPerDayMatch && method === "patch") {
    const id = Number(autogenPerDayMatch[1]);
    const site = mockSites.find((s) => s.id === id);
    if (!site) return ok(config, { message: "Site not found" }, 404);
    const value = typeof config.data === "number" ? config.data : Number(config.data);
    site.autogenPerDay = Number.isFinite(value) ? value : site.autogenPerDay;
    return ok(config, { success: true });
  }

  const autogenerationMatch = pathname.match(/^\/sites\/(\d+)\/autogeneration$/);
  if (autogenerationMatch && method === "patch") {
    const id = Number(autogenerationMatch[1]);
    const site = mockSites.find((s) => s.id === id);
    if (!site) return ok(config, { message: "Site not found" }, 404);
    const enabled =
      typeof config.data === "boolean"
        ? config.data
        : String(config.data).toLowerCase() === "true";
    site.autogeneration = enabled;
    return ok(config, { success: true });
  }

  const folderMatch = pathname.match(/^\/sites\/(\d+)\/set-folder$/);
  if (folderMatch && method === "patch") {
    const id = Number(folderMatch[1]);
    const folderName = query.get("folderName") || "";
    const site = mockSites.find((s) => s.id === id);
    if (!site) return ok(config, { message: "Site not found" }, 404);
    site.folder = folderName;
    return ok(config, site);
  }

  if (pathname === "/ai/categories" && method === "post") {
    const body = await getJsonPayload<CategoryGenerationRequest>(config);
    const generated: Category[] = [
      {
        id: categorySeq++,
        siteId: 0,
        name: `${body.siteName} - Базова категорія`,
        description: body.prompt || "Згенерована категорія",
        nameEn: `${body.siteName} - Base category`,
        descriptionEn: "Generated by mock AI",
        seoTitle: `${body.siteName} SEO`,
        seoDescription: "AI generated category description",
        h1: body.siteName,
        text: `Категорія для регіону ${body.region}.`,
      },
    ];
    return ok(config, generated);
  }

  const siteCategoriesMatch = pathname.match(/^\/categories\/(\d+)\/categories$/);
  if (siteCategoriesMatch && method === "get") {
    const siteId = Number(siteCategoriesMatch[1]);
    return ok(
      config,
      mockCategories.filter((c) => c.siteId === siteId),
    );
  }

  if (pathname === "/categories" && method === "post") {
    const body = await getJsonPayload<CreateOrUpdateCategoryRequest>(config);
    const newCategory: Category = {
      ...body,
      id: categorySeq++,
    };
    mockCategories.push(newCategory);
    return ok(config, newCategory, 201);
  }

  const categoryByIdMatch = pathname.match(/^\/categories\/(\d+)$/);
  if (categoryByIdMatch && method === "get") {
    const category = mockCategories.find((c) => c.id === Number(categoryByIdMatch[1]));
    return ok(config, category || null);
  }

  if (categoryByIdMatch && method === "put") {
    const id = Number(categoryByIdMatch[1]);
    const body = await getJsonPayload<CreateOrUpdateCategoryRequest>(config);
    const category = mockCategories.find((c) => c.id === id);
    if (!category) return ok(config, { message: "Category not found" }, 404);
    Object.assign(category, body);
    return ok(config, category);
  }

  if (categoryByIdMatch && method === "delete") {
    const id = Number(categoryByIdMatch[1]);
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx >= 0) mockCategories.splice(idx, 1);
    return ok(config, { success: true });
  }

  const categorySeoInfoMatch = pathname.match(/^\/seo-info\/category\/(\d+)$/);
  if (categorySeoInfoMatch && method === "get") {
    const id = Number(categorySeoInfoMatch[1]);
    const category = mockCategories.find((c) => c.id === id);
    if (!category) return ok(config, []);
    return ok(config, [
      {
        id: category.id,
        seoTitle: category.seoTitle,
        seoDescription: category.seoDescription,
        h1: category.h1,
        text: category.text,
        region: "Україна",
      },
    ]);
  }

  const regionByIdMatch = pathname.match(/^\/regions\/(\d+)$/);
  if (regionByIdMatch && method === "get") {
    return ok(config, mockRegions.find((r) => r.id === Number(regionByIdMatch[1])) || null);
  }

  const regionBySiteMatch = pathname.match(/^\/regions\/site\/(\d+)$/);
  if (regionBySiteMatch && method === "get") {
    return ok(
      config,
      mockRegions.filter((r) => r.siteId === Number(regionBySiteMatch[1])),
    );
  }

  if (pathname === "/regions" && method === "post") {
    const body = await getJsonPayload<Region>(config);
    const region: Region = { ...body, id: regionSeq++ };
    mockRegions.push(region);
    return ok(config, region, 201);
  }

  if (regionByIdMatch && method === "put") {
    const body = await getJsonPayload<Region>(config);
    const region = mockRegions.find((r) => r.id === Number(regionByIdMatch[1]));
    if (!region) return ok(config, { message: "Region not found" }, 404);
    Object.assign(region, body);
    return ok(config, region);
  }

  if (regionByIdMatch && method === "delete") {
    const id = Number(regionByIdMatch[1]);
    const idx = mockRegions.findIndex((r) => r.id === id);
    if (idx >= 0) mockRegions.splice(idx, 1);
    return ok(config, { success: true });
  }

  if (pathname === "/listings" && method === "get") {
    return ok(config, [...mockListings].sort((a, b) => b.id - a.id));
  }

  const listingByIdMatch = pathname.match(/^\/listings\/(\d+)$/);
  if (listingByIdMatch && method === "get") {
    const listing = mockListings.find((l) => l.id === Number(listingByIdMatch[1]));
    if (!listing) return unauthorized(config);
    return ok(config, listing);
  }

  const listingBySiteMatch = pathname.match(/^\/listings\/site\/(\d+)$/);
  if (listingBySiteMatch && method === "get") {
    const site = mockSites.find((s) => s.id === Number(listingBySiteMatch[1]));
    return ok(
      config,
      mockListings.filter((l) => l.siteName === site?.marketplaceName),
    );
  }

  const listingMetadataMatch = pathname.match(/^\/listings\/metadata\/(\d+)$/);
  if (listingMetadataMatch && method === "get") {
    const siteId = Number(listingMetadataMatch[1]);
    return ok(config, {
      categories: mockCategories.filter((c) => c.siteId === siteId),
      regions: mockRegions.filter((r) => r.siteId === siteId),
    });
  }

  if (pathname === "/listings" && method === "post") {
    const siteId = Number(query.get("siteId"));
    const payload = await getListingPayloadFromFormData(config);
    const site = mockSites.find((s) => s.id === siteId);
    const listing = {
      id: listingSeq++,
      title: payload.title || "Нове оголошення",
      description: payload.description || "",
      price: Number(payload.price || 0),
      status: payload.status || "ACTIVE",
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      username: "admin",
      siteName: site?.marketplaceName || "Unknown site",
      categoryName: payload.categoryName || "Без категорії",
      regionName: payload.regionName || "Без регіону",
      contact: payload.contact || "",
      themeId: site?.themeId || 1,
      imagePaths: "/mock/images/new-listing.jpg",
      titleEn: payload.titleEn || payload.title || "New listing",
      seoTitle: payload.seoTitle || payload.title || "",
      seoDescription: payload.seoDescription || "",
      h1: payload.h1 || payload.title || "",
    };
    mockListings.push(listing);
    return ok(config, listing, 201);
  }

  const listingUpdateMatch = pathname.match(/^\/listings\/update\/(\d+)$/);
  if (listingUpdateMatch && method === "put") {
    const listing = mockListings.find((l) => l.id === Number(listingUpdateMatch[1]));
    if (!listing) return ok(config, { message: "Listing not found" }, 404);
    const payload = await getListingPayloadFromFormData(config);
    Object.assign(listing, payload);
    return ok(config, listing);
  }

  const listingDeleteMatch = pathname.match(/^\/listings\/delete\/(\d+)$/);
  if (listingDeleteMatch && method === "delete") {
    const id = Number(listingDeleteMatch[1]);
    const idx = mockListings.findIndex((l) => l.id === id);
    if (idx >= 0) mockListings.splice(idx, 1);
    return ok(config, { success: true });
  }

  const siteContactsMatch = pathname.match(/^\/sites\/(\d+)\/contacts$/);
  if (siteContactsMatch && method === "get") {
    const siteId = Number(siteContactsMatch[1]);
    return ok(config, mockContactsBySite[siteId] || []);
  }

  if (siteContactsMatch && method === "post") {
    const siteId = Number(siteContactsMatch[1]);
    const body = await getJsonPayload<CreateOrUpdateContactRequest>(config);
    const contact = { id: contactSeq++, number: body.number };
    if (!mockContactsBySite[siteId]) mockContactsBySite[siteId] = [];
    mockContactsBySite[siteId].push(contact);
    return ok(config, contact, 201);
  }

  const siteContactByIdMatch = pathname.match(/^\/sites\/(\d+)\/contacts\/(\d+)$/);
  if (siteContactByIdMatch && method === "put") {
    const siteId = Number(siteContactByIdMatch[1]);
    const contactId = Number(siteContactByIdMatch[2]);
    const body = await getJsonPayload<CreateOrUpdateContactRequest>(config);
    const contact = (mockContactsBySite[siteId] || []).find((c) => c.id === contactId);
    if (!contact) return ok(config, { message: "Contact not found" }, 404);
    contact.number = body.number;
    return ok(config, contact);
  }

  if (siteContactByIdMatch && method === "delete") {
    const siteId = Number(siteContactByIdMatch[1]);
    const contactId = Number(siteContactByIdMatch[2]);
    const contacts = mockContactsBySite[siteId] || [];
    const idx = contacts.findIndex((c) => c.id === contactId);
    if (idx >= 0) contacts.splice(idx, 1);
    return ok(config, { success: true });
  }

  if (pathname === "/axes" && method === "get") return ok(config, mockAxes);
  if (pathname === "/axes/types" && method === "get") return ok(config, mockAxisTypes);

  const siteAxesMatch = pathname.match(/^\/axes\/site\/(\d+)$/);
  if (siteAxesMatch && method === "get") {
    const siteId = Number(siteAxesMatch[1]);
    return ok(
      config,
      mockAxes.filter((a) => a.siteId === siteId),
    );
  }

  if (pathname === "/axes" && method === "put") {
    const body = await getJsonPayload<UpdateAxisRequest>(config);
    const axis = mockAxes.find((a) => a.id === body.id);
    if (!axis) return ok(config, { message: "Axis not found" }, 404);
    axis.type = body.type;
    axis.content = body.content;
    return ok(config, axis);
  }

  if (pathname === "/axes/multiple" && method === "post") {
    const body = await getJsonPayload<UpdateAxisRequest>(config);
    const axis = {
      id: axisSeq++,
      type: body.type,
      siteId: body.siteId,
      content: body.content,
    };
    mockAxes.push(axis);
    return ok(config, axis, 201);
  }

  const deleteAxisMatch = pathname.match(/^\/axes\/(\d+)$/);
  if (deleteAxisMatch && method === "delete") {
    const idx = mockAxes.findIndex((a) => a.id === Number(deleteAxisMatch[1]));
    if (idx >= 0) mockAxes.splice(idx, 1);
    return ok(config, { success: true });
  }

  if (pathname === "/prompts" && method === "get") return ok(config, mockPrompts);

  const promptByIdMatch = pathname.match(/^\/prompts\/(\d+)$/);
  if (promptByIdMatch && method === "put") {
    const body = await getJsonPayload<UpdatePromptRequest>(config);
    const prompt = mockPrompts.find((p) => p.id === Number(promptByIdMatch[1]));
    if (!prompt) return ok(config, { message: "Prompt not found" }, 404);
    prompt.prompt = body.prompt;
    prompt.description = body.description;
    return ok(config, prompt);
  }

  const promptsBySiteMatch = pathname.match(/^\/prompts\/sites\/(\d+)\/prompts$/);
  if (promptsBySiteMatch && method === "get") {
    const siteId = Number(promptsBySiteMatch[1]);
    return ok(config, mockPrompts.filter((p) => p.siteId === siteId || p.siteId === null));
  }

  const updateSitePromptMatch = pathname.match(/^\/prompts\/sites\/(\d+)\/prompts\/(\d+)$/);
  if (updateSitePromptMatch && method === "put") {
    const siteId = Number(updateSitePromptMatch[1]);
    const promptId = Number(updateSitePromptMatch[2]);
    const body = await getJsonPayload<UpdatePromptRequest>(config);
    const prompt = mockPrompts.find((p) => p.id === promptId);
    if (!prompt) return ok(config, { message: "Prompt not found" }, 404);
    prompt.siteId = siteId;
    prompt.prompt = body.prompt;
    prompt.description = body.description;
    return ok(config, prompt);
  }

  if (pathname === "/domains" && method === "get") return ok(config, mockDomains);
  if (pathname === "/domains/dashboard" && method === "get") {
    const selected = query.get("selected") || mockDomains[0].domainName;
    return ok(config, mockDomainDashboard(selected));
  }
  if (pathname === "/domains/check" && method === "post") {
    const requested = query.get("domain") || "";
    const isTaken = mockDomains.some((d) => d.domainName === requested);
    return ok(config, {
      available: !isTaken,
      suggestions: [
        `${requested.split(".")[0] || "my-market"}-shop.demo`,
        `${requested.split(".")[0] || "my-market"}-market.demo`,
      ],
      registrationPrice: 9.99,
      currency: "USD",
    });
  }
  if (pathname === "/domains/purchase" && method === "post") {
    const requested = query.get("domain") || "new-market.demo";
    return ok(config, {
      name: requested,
      status: "ACTIVE",
      expirationDate: "2027-01-01",
      tld: ".demo",
      cost: 9.99,
      available: false,
    });
  }

  if (pathname === "/folders" && method === "get") return ok(config, mockFolders);

  const folderImagesMatch = pathname.match(/^\/folders\/([^/]+)\/images$/);
  if (folderImagesMatch && method === "get") {
    const folderName = decodeURIComponent(folderImagesMatch[1]);
    return ok(config, mockImagesByFolder[folderName] || []);
  }

  const deleteFolderMatch = pathname.match(/^\/folders\/([^/]+)$/);
  if (deleteFolderMatch && method === "delete") {
    const folderName = decodeURIComponent(deleteFolderMatch[1]);
    delete mockImagesByFolder[folderName];
    const idx = mockFolders.findIndex((f) => f.name === folderName);
    if (idx >= 0) mockFolders.splice(idx, 1);
    return ok(config, { success: true });
  }

  const uploadImageMatch = pathname.match(/^\/sites\/(\d+)\/images\/upload$/);
  if (uploadImageMatch && method === "post") {
    const siteId = Number(uploadImageMatch[1]);
    const folderName =
      (config.params?.folderName as string | undefined) || extractFolderName(siteId);
    const existingFolder = mockFolders.find((f) => f.name === folderName);
    if (!existingFolder) {
      mockFolders.push({ name: folderName, amount: 0 });
      mockImagesByFolder[folderName] = [];
    }
    const newImage = {
      id: Date.now(),
      s3Url: `/mock/images/uploaded-${Date.now()}.jpg`,
      fileName: "uploaded.jpg",
      folder: {
        name: folderName,
        amount: (mockImagesByFolder[folderName]?.length || 0) + 1,
      },
    };
    if (!mockImagesByFolder[folderName]) mockImagesByFolder[folderName] = [];
    mockImagesByFolder[folderName].push(newImage);
    const folder = mockFolders.find((f) => f.name === folderName);
    if (folder) folder.amount = mockImagesByFolder[folderName].length;
    return ok(config, {
      success: true,
      message: "Image uploaded (mock)",
      url: newImage.s3Url,
      path: `${folderName}/${newImage.fileName}`,
    });
  }

  const deleteImageMatch = pathname.match(/^\/sites\/images\/(\d+)$/);
  if (deleteImageMatch && method === "delete") {
    const imageId = Number(deleteImageMatch[1]);
    for (const folderName of Object.keys(mockImagesByFolder)) {
      const idx = mockImagesByFolder[folderName].findIndex((img) => img.id === imageId);
      if (idx >= 0) {
        mockImagesByFolder[folderName].splice(idx, 1);
        const folder = mockFolders.find((f) => f.name === folderName);
        if (folder) folder.amount = mockImagesByFolder[folderName].length;
      }
    }
    return ok(config, { success: true });
  }

  const fallbackHeaders = config.headers || new AxiosHeaders();
  return ok(
    { ...config, headers: fallbackHeaders },
    {
      message: "Mock endpoint is not implemented yet",
      path: pathname,
      method,
    },
    404,
  );
};
