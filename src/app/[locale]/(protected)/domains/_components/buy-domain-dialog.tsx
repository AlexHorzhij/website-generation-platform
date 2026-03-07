"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Globe,
  CheckCircle2,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { useCheckDomain, usePurchaseDomain } from "@/api/hooks/use-domains";
import { DomainCheckResponse } from "@/api/types/domain";
import { toast } from "sonner";
import { DialogModal } from "@/components/ui-kit/table/dialog-modal";

interface BuyDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BuyDomainDialog({ open, onOpenChange }: BuyDomainDialogProps) {
  const t = useTranslations("BuyDomainDialog");
  const [checkDomainName, setCheckDomainName] = useState("");
  const [purchaseDomainName, setPurchaseDomainName] = useState("");
  const [result, setResult] = useState<DomainCheckResponse | null>(null);

  const checkMutation = useCheckDomain();
  const purchaseMutation = usePurchaseDomain();

  const handleCheck = async () => {
    if (!checkDomainName) return;
    try {
      const data = await checkMutation.mutateAsync(checkDomainName);
      setResult(data);
    } catch (error) {
      toast.error(t("error_checking"));
    }
  };

  const handlePurchase = async () => {
    if (!purchaseDomainName) return;
    try {
      await purchaseMutation.mutateAsync(purchaseDomainName);
      onOpenChange(false);
      setResult(null);
      setCheckDomainName("");
      setPurchaseDomainName("");
    } catch (error) {
      // toast is handled in mutation
    }
  };

  return (
    <DialogModal
      open={open}
      onOpenChange={onOpenChange}
      title={t("buy_domain")}
    >
      <div className="space-y-8 py-4 px-1">
        {/* Section 1: Check Availability */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-default-700 uppercase tracking-wider">
              1. {t("check_availability")}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-default-400" />
                <Input
                  placeholder="example.com"
                  value={checkDomainName}
                  onChange={(e) => setCheckDomainName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  className="pl-9 bg-white dark:bg-slate-800 h-[44px]"
                />
              </div>
              <Button
                onClick={handleCheck}
                disabled={checkMutation.isPending || !checkDomainName}
                variant="outline"
                className="min-w-[100px]"
              >
                {checkMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Check"
                )}
              </Button>
            </div>
          </div>

          {result && (
            <div className="p-4 rounded-xl border bg-default-50/30 dark:bg-slate-800/50 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {result.available ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-bold text-default-900 truncate max-w-[180px]">
                      {checkDomainName}
                    </p>
                    <p className="text-xs text-default-500">
                      {result.available ? t("available") : t("not_available")}
                    </p>
                  </div>
                </div>
                {result.available && (
                  <p className="font-bold text-default-900 text-lg">
                    {result.registrationPrice} {result.currency}
                  </p>
                )}
              </div>

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="pt-3 border-t border-default-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-default-400 mb-2">
                    {t("suggestions")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suggestions.map((suggestion) => (
                      <Badge
                        key={suggestion}
                        color="secondary"
                        className="px-2.5 py-0.5 cursor-pointer hover:bg-default-200 dark:hover:bg-slate-700 text-[10px] border-none"
                        onClick={() => {
                          setCheckDomainName(suggestion);
                          setResult(null);
                        }}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.error && (
                <p className="text-xs text-destructive bg-destructive/5 p-2 rounded-lg border border-destructive/10">
                  {result.error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Purchase Domain */}
        <div className="space-y-4 pt-6 border-t border-default-100 dark:border-slate-800">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-default-700 uppercase tracking-wider">
              2. {t("purchase")}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-default-400" />
                <Input
                  placeholder="example.com"
                  value={purchaseDomainName}
                  onChange={(e) => setPurchaseDomainName(e.target.value)}
                  className="pl-9 bg-white dark:bg-slate-800 h-[44px]"
                />
              </div>
              <Button
                onClick={handlePurchase}
                disabled={purchaseMutation.isPending || !purchaseDomainName}
                className="min-w-[100px] shadow-sm"
              >
                {purchaseMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Buy"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogModal>
  );
}
