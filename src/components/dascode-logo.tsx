import React from "react";
import Image from "next/image";
type IconProps = React.HTMLAttributes<SVGElement>;
const DashCodeLogo = (props: IconProps) => {
  return (
    <Image src="/images/logo/logo-1.png" alt="logo" width={32} height={32} />
  );
};

export default DashCodeLogo;
