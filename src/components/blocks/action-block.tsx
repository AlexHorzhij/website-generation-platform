"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ActionBlockProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  value?: number | string;
  action?: React.ReactNode;
  iconWrapperClass?: string;
}

const ActionBlock = ({
  title,
  value,
  className,
  icon,
  action,
  iconWrapperClass,
}: ActionBlockProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4 h-full flex items-center">
        <div className="flex items-center gap-4 w-full">
          {icon && (
            <div className="flex-none">
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex flex-col items-center justify-center text-2xl bg-default-100 dark:bg-default-900/30",
                  iconWrapperClass,
                )}
              >
                {icon}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {title && (
              <div className="text-default-500 text-sm font-medium truncate uppercase tracking-wider">
                {title}
              </div>
            )}
            {value !== undefined && (
              <div className="text-default-900 text-lg font-bold truncate">
                {value}
              </div>
            )}
          </div>

          {action && (
            <div className="flex-none flex items-center justify-end">
              {action}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ActionBlock };
