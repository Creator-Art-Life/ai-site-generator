import React, { useContext } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useImageLogo } from "@/lib/utils";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./WorkspaceHistory";
import Link from "next/link";
import SideBarFooter from "./SideBarFooter";
import { Separator } from "../ui/separator";
import { UserDetailContext } from "@/context/UserDetailContext";
// 19262f
// 299aec

// bghover: 1b3345
function AppSideBar() {
  const logo = useImageLogo();
  return (
    <Sidebar
      className=" rounded-r-3xl"
      style={{
        overflow: "hidden",
      }}
    >
      <SidebarHeader className="pl-5">
        <Link className="pointer-cursor" href={"/"}>
          <Image src={logo} alt="logo" width={50} height={50} />
        </Link>
        <div className="flex items-start">
          <Button className="mt-5 w-full flex items-center justify-start bg-[#19262f] hover:bg-[#1b3345]">
            <MessageCircleCode color="#299aec" />
            <p className="text-[#299aec]">Start New Chat</p>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="pl-5">
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#0a0a0a] pt-0 pb-0">
        <SideBarFooter />
      </SidebarFooter>
      <Separator orientation="horizontal" />
      <UserProfile />
    </Sidebar>
  );
}

function UserProfile() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="flex items-center p-3 bg-[#171717] rounded-lg w-full">
      <div className=" ">
        {userDetail && userDetail.name ? (
          <Image
            src={userDetail.picture}
            alt="user"
            width={30}
            height={30}
            className="bg-blue-500 flex items-center justify-center rounded-full text-white font-bold text-lg w-10 h-10"
          />
        ) : (
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded-full text-white font-bold text-lg">
            {"u".charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="ml-3">
        <h3 className="text-white font-semibold text-sm">
          {userDetail && userDetail.email ? userDetail.email : "Guest"}
        </h3>
        <p className="text-gray-400 text-xs">Personal Plan</p>
      </div>
    </div>
  );
}

export default AppSideBar;
