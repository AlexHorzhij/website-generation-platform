import Image from "next/image";
import { withBasePath } from "@/lib/asset-path";

const Social = ({ locale }: { locale: string }) => {
  return (
    <>
      <ul className="flex">
        <li className="flex-1">
          <a
            href="#"
            className="inline-flex h-10 w-10 p-2 bg-[#1C9CEB] text-white text-2xl flex-col items-center justify-center rounded-full"
          >
            <Image
              width={300}
              height={300}
              className="w-full h-full"
              src={withBasePath("/images/icon/tw.svg")}
              alt=""
            />
          </a>
        </li>
        <li className="flex-1">
          <a
            href="#"
            className="inline-flex h-10 w-10 p-2 bg-[#395599] text-white text-2xl flex-col items-center justify-center rounded-full"
          >
            <Image
              width={300}
              height={300}
              className="w-full h-full"
              src={withBasePath("/images/icon/fb.svg")}
              alt=""
            />
          </a>
        </li>
        <li className="flex-1">
          <a
            href="#"
            className="inline-flex h-10 w-10 p-2 bg-[#0A63BC] text-white text-2xl flex-col items-center justify-center rounded-full"
          >
            <Image
              width={300}
              height={300}
              className="w-full h-full"
              src={withBasePath("/images/icon/in.svg")}
              alt=""
            />
          </a>
        </li>
        <li className="flex-1">
          <button
            type="submit"
            className="inline-flex h-10 w-10 p-2 bg-[#EA4335] text-white text-2xl flex-col items-center justify-center rounded-full"
          >
            <Image
              width={300}
              height={300}
              className="w-full h-full"
              src={withBasePath("/images/icon/gp.svg")}
              alt=""
            />
          </button>
        </li>
      </ul>
    </>
  );
};

export default Social;
