"use client";

import { useEffect } from "react";
import apiClient from "@/lib/axios";

const ListingsPage = () => {
  useEffect(() => {
    const testRequest = async () => {
      try {
        console.log("Starting test request to /api/listings...");
        const response = await apiClient.get("/api/listings/site/196");
        console.log("Success! Response from /api/listings:", response.data);
      } catch (error) {
        console.error("Error during test request to /api/listings:", error);
      }
    };

    testRequest();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listings</h1>
      <p className="text-default-600">
        Check the browser console for the /api/listings request result.
      </p>
    </div>
  );
};

export default ListingsPage;
