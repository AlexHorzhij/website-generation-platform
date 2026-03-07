import * as z from "zod";

export const createSiteFormSchema = z.object({
  domainName: z.string().min(3, "Domain name is required"),
  siteName: z.string().min(2, "Site name is required"),
  region: z.string().min(2, "Region is required"),
  themeId: z.coerce.number().int().min(1, "Theme is required"),
  currency: z.string().min(2, "Currency is required"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters"),
  categories: z
    .array(
      z.object({
        name: z.string().min(1, "Category name is required"),
        description: z.string().min(1, "Category description is required"),
      }),
    )
    .min(1, "At least one category is required"),
  draftCategory: z
    .object({
      name: z.string(),
      description: z.string(),
    })
    .optional(),
});

export type SiteFormValues = z.infer<typeof createSiteFormSchema>;
