import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// buildQueryClient створює новий екземпляр QueryClient для кожного запиту на сервері,
// щоб уникнути витоку даних між різними користувачами.
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    }),
);
