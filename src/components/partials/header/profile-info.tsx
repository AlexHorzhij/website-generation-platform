"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import Image from "next/image";
import { useLogout } from "@/api/hooks/use-auth";

const ProfileInfo = () => {
  // const { data: user } = useMe();
  const { logout } = useLogout();

  const userName = "Menu";
  // console.log("user", user);
  // const userEmail = user?.email || "info@codeshaper.net";
  const userAvatar = "/images/avatar/av-1.jpg";

  return (
    <div className="md:block hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className=" cursor-pointer">
          <div className=" flex items-center gap-3  text-default-800 ">
            <Image
              src={userAvatar}
              alt={userName}
              width={36}
              height={36}
              className="rounded-full"
            />

            <div className="text-sm font-medium  capitalize lg:block hidden  ">
              {userName}
            </div>
            <span className="text-base  me-2.5 lg:inline-block hidden">
              <Icon icon="heroicons-outline:chevron-down"></Icon>
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-0" align="end">
          {/* <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
            <Image
              src={userAvatar}
              alt={userName}
              width={36}
              height={36}
              className="rounded-full"
            />

            <div>
              <div className="text-sm font-medium text-default-800 capitalize ">
                {userName}
              </div>
              <Link
                href="/dashboard"
                className="text-xs text-default-600 hover:text-primary"
              >
                {userEmail}
              </Link>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mb-0 dark:bg-background" /> */}
          <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 cursor-pointer">
            <div
              onClick={() => logout()}
              className="w-full flex items-center gap-2"
            >
              <Icon icon="heroicons:power" className="w-4 h-4" />
              Log out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ProfileInfo;
