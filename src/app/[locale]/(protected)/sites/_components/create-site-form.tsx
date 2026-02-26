"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteService } from "@/services/site-service";
import { useRouter } from "@/components/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Wand2 } from "lucide-react";

const formSchema = z.object({
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
});

type FormValues = z.infer<typeof formSchema>;

export const CreateSiteForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domainName: "",
      siteName: "",
      region: "Ukraine",
      themeId: 1,
      currency: "UAH",
      description: "",
      categories: [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await SiteService.createSite(values);
      toast.success("Site created successfully!");
      router.push("/sites");
    } catch (error) {
      toast.error("Failed to create site");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateCategories = async () => {
    const siteName = form.getValues("siteName");
    const description = form.getValues("description");
    const region = form.getValues("region");

    if (!siteName || !description) {
      toast.error("Please fill in site name and description first");
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await SiteService.generateCategories({
        siteName,
        description,
        region,
        prompt: prompt || "Generate relevant categories for this site",
      });

      if (generated && generated.length > 0) {
        replace(generated);
        toast.success("Categories generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate categories");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Marketplace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="domainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name</FormLabel>
                      <FormControl>
                        <Input placeholder="example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Ukraine" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input placeholder="UAH" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="themeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme ID</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your marketplace..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Categories</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", description: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex gap-4 items-start p-4 border rounded-lg bg-default-50"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`categories.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Electronics" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`categories.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Gadgets and devices"
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-6 text-destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <FormMessage>
                  {form.formState.errors.categories?.message}
                </FormMessage>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/sites")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Site
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              AI Category Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-default-500">
              Fill in the site name and description, then use this tool to
              automatically generate relevant categories.
            </p>
            <div className="space-y-2">
              <Label>Custom Prompt (Optional)</Label>
              <Textarea
                placeholder="e.g. Focus on high-end fashion and luxury accessories..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={7}
                className="text-sm"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleGenerateCategories}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Categories
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
