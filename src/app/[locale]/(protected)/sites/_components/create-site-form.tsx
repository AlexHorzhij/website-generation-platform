"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSiteFormSchema,
  type SiteFormValues,
} from "@/lib/validations/site";
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
import { SiteService } from "@/api/services/site-service";
import { useRouter } from "@/components/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Wand2, Sparkles, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CategoryEditDialog } from "./category-edit-dialog";

export const CreateSiteForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [aiCategories, setAiCategories] = useState<
    { name: string; description: string }[]
  >([]);

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(createSiteFormSchema),
    defaultValues: {
      domainName: "",
      siteName: "",
      region: "Ukraine",
      themeId: 1,
      currency: "UAH",
      description: "",
      categories: [],
    },
  });

  const { fields, prepend, remove, update } = useFieldArray({
    control: form.control,
    name: "categories",
  });
  console.log("form", fields);
  const onSubmit = async (values: SiteFormValues) => {
    setIsSubmitting(true);
    console.log("values", values);
    try {
      const site = await SiteService.createSite(values);
      console.log("site", site);
      toast.success("Site created successfully!");
      router.push(`/sites/${site.id}`);
    } catch (error) {
      toast.error("Failed to create site");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onAddManually = () => {
    form.setValue("draftCategory", { name: "", description: "" });
    setEditingIndex(-1);
  };

  const handleGenerateCategories = async () => {
    const isValid = await form.trigger(["siteName", "description"]);

    if (!isValid) {
      toast.error("Please fill in site name and description first");
      return;
    }

    const { siteName, description, region } = form.getValues();
    setIsGenerating(true);
    try {
      const generated = await SiteService.generateCategories({
        siteName,
        description,
        region,
        prompt: prompt || "Generate relevant categories for this site",
      });

      if (generated && generated.length > 0) {
        setAiCategories(generated);
        toast.success("Categories generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate categories");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectCategory = (
    category: { name: string; description: string },
    index: number,
  ) => {
    prepend(category);
    setAiCategories((prev) => prev.filter((_, i) => i !== index));
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

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      Selected Categories
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add categories manually or select from suggestions.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={onAddManually}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Manually
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {fields.map((field, index) => {
                      const categoryName = form.watch(
                        `categories.${index}.name`,
                      );
                      const categoryDesc = form.watch(
                        `categories.${index}.description`,
                      );

                      return (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={{
                            opacity: 0,
                            scale: 0.95,
                            filter: "blur(10px)",
                          }}
                          layout
                          className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                          <div className="p-4 flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm truncate">
                                {categoryName || "Untitled Category"}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {categoryDesc || "No description provided"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                                onClick={() => {
                                  form.setValue("draftCategory", {
                                    name: categoryName,
                                    description: categoryDesc,
                                  });
                                  setEditingIndex(index);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
                                onClick={() => remove(index)}
                                disabled={fields.length === 0}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="absolute left-0 bottom-0 top-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <CategoryEditDialog
                  open={editingIndex !== null}
                  onOpenChange={(open) => !open && setEditingIndex(null)}
                  onSave={() => {
                    const values = form.getValues("draftCategory");
                    if (values && editingIndex !== null) {
                      if (editingIndex === -1) {
                        prepend(values);
                      } else {
                        update(editingIndex, values);
                      }
                    }
                    setEditingIndex(null);
                  }}
                />
              </div>
              <FormMessage>
                {form.formState.errors.categories?.message}
              </FormMessage>

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
        <Card className="overflow-hidden border-primary/10 shadow-lg">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary font-bold">
              <div className="p-1 bg-primary rounded-md">
                <Wand2 className="w-4 h-4 text-primary-foreground" />
              </div>
              AI Category Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Describe your marketplace and let AI suggest relevant categories
              for you.
            </p>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground/70">
                Custom Prompt (Optional)
              </Label>
              <Textarea
                placeholder="e.g. Focus on high-end fashion and luxury accessories..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="text-sm border-muted-foreground/20 focus:border-primary transition-all resize-none"
              />
            </div>
            <Button
              className="w-full shadow-md hover:shadow-lg transition-all group"
              onClick={handleGenerateCategories}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence>
          {aiCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Suggestions
                </h4>
                <Badge
                  color="primary"
                  className="text-[10px] font-medium bg-primary/5 text-primary border-primary/20"
                >
                  {aiCategories.length} available
                </Badge>
              </div>
              <div className="grid gap-3">
                {aiCategories.map((cat, index) => (
                  <motion.div
                    key={`${cat.name}-${index}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectCategory(cat, index)}
                    className="p-3 border rounded-xl bg-card hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-md group transition-all relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                      <div className="ml-2 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                        <div className="p-1 bg-primary/10 rounded-full">
                          <Plus className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
