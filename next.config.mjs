import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const githubPagesBasePath =
  isGithubActions && repositoryName ? `/${repositoryName}` : "";

const nextConfig = {
  output: "export",
  basePath: githubPagesBasePath,
  assetPrefix: githubPagesBasePath ? `${githubPagesBasePath}/` : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.lorem.space",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "apexcharts",
      "react-apexcharts",
      "framer-motion",
      "@iconify/react",
    ],
  },
};

export default withNextIntl(nextConfig);
