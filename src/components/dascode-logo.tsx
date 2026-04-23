import Image, { ImageProps } from "next/image";
import { withBasePath } from "@/lib/asset-path";

const DashCodeLogo = ({ style, ...props }: Partial<ImageProps>) => {
  return (
    <Image
      src={withBasePath("/images/logo/logo-1.png")}
      alt="logo"
      width={32}
      height={32}
      priority
      style={{ height: "auto", ...style }}
      {...props}
    />
  );
};

export default DashCodeLogo;
