"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            We encountered an error while loading this page. This might be a temporary connection issue with the backend.
          </p>
          {error.message && (
            <pre className="p-3 bg-muted rounded-md text-[10px] overflow-auto max-h-32 text-muted-foreground border">
              <code>{error.message}</code>
            </pre>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Reload Page
          </Button>
          <Button 
            onClick={() => reset()}
            className="flex-1 gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
