import Image, { ImageProps } from "next/image";

const DashCodeLogo = (props: Partial<ImageProps>) => {
  return (
    <Image
      src="/images/logo/logo-1.png"
      alt="logo"
      width={32}
      height={32}
      priority
      {...props}
    />
  );
};

export default DashCodeLogo;
