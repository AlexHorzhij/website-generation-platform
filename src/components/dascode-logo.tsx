import Image, { ImageProps } from "next/image";

const DashCodeLogo = ({ style, ...props }: Partial<ImageProps>) => {
  return (
    <Image
      src="/images/logo/logo-1.png"
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
