"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { withBasePath } from "@/lib/asset-path";

const Logo = () => {
  const { theme: mode } = useTheme();
  return (
    <div>
      <Image
        src={
          mode === "light"
            ? withBasePath("/images/logo/logo.png")
            : withBasePath("/images/logo/logo.png")
        }
        alt=""
        width={300}
        height={300}
        className=" w-36 "
        style={{ height: "auto" }}
        priority
      />
    </div>
  );
};

export default Logo;
