"use client";

import Image from "next/image";
import React, { useContext, useEffect, useState } from "react"; // Import useState
import Colors from "@/data/Colors";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { UserDetailContext } from "@/context/UserDetailContext";
import "./css/error.css";
import { Skeleton } from "../ui/skeleton";
import { useImageLogo } from "@/lib/utils";
import "./css/btn-git.css";
import { useSidebar } from "../ui/sidebar";
import { ActionContext } from "@/context/ActionsContext";
import { useRouter } from "next/router";

import { usePathname } from "next/navigation"; // Используем новый навигационный хук

function Header() {
  const logoSrc = useImageLogo();
  const { theme } = useTheme();
  const { userDetail } = useContext(UserDetailContext);
  const [mounted, setMounted] = useState(false);
  const { setAction } = useContext(ActionContext);

  // Используем хук usePathname вместо useRouter
  const pathname = usePathname();
  const isWorkspacePath = pathname?.startsWith("/workspace");

  const onActionBtn = (action: "export" | "deploy") => {
    setAction({
      actionType: action,
      timeStamp: Date.now(),
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userDetail !== undefined && userDetail !== null) {
      setLoading(false);
    }
  }, [userDetail]);

  // Остальной код без изменений...
  // ... (как в предыдущем примере)

  return (
    <div className="pr-4 pl-4 pt-2 flex justify-between items-center">
      {mounted && (
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Logo"
            width={70}
            height={70}
            key={logoSrc}
          />
        </Link>
      )}

      {!userDetail?.name ? (
        <div className="flex gap-5">
          <Button variant="outline">Sign In</Button>
          <Button
            style={{ backgroundColor: Colors.BLUE }}
            className="text-white"
          >
            Get Started
          </Button>
          <ModeToggle />
        </div>
      ) : isWorkspacePath ? (
        <div className="flex items-center">
          <Button
            variant="outline"
            className="mr-4"
            onClick={() => onActionBtn("export")}
          >
            Export
          </Button>
          <Button className="mr-4" onClick={() => onActionBtn("deploy")}>
            Deploy
          </Button>
          <Image
            src={userDetail.picture}
            alt="user"
            width={30}
            height={30}
            className="bg-blue-500 rounded-full text-white font-bold text-lg"
          />
        </div>
      ) : (
        <>
          <ButtonGit />
        </>
      )}
    </div>
  );
}

function ButtonGit() {
  return (
    <Link href={"https://github.com/Creator-Art-Life/ai-site-generator"}>
      <button className="btn-github">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.99992 1.33331C7.12444 1.33331 6.25753 1.50575 5.4487 1.84078C4.63986 2.17581 3.90493 2.66688 3.28587 3.28593C2.03563 4.53618 1.33325 6.23187 1.33325 7.99998C1.33325 10.9466 3.24659 13.4466 5.89325 14.3333C6.22659 14.3866 6.33325 14.18 6.33325 14C6.33325 13.8466 6.33325 13.4266 6.33325 12.8733C4.48659 13.2733 4.09325 11.98 4.09325 11.98C3.78659 11.2066 3.35325 11 3.35325 11C2.74659 10.5866 3.39992 10.6 3.39992 10.6C4.06659 10.6466 4.41992 11.2866 4.41992 11.2866C4.99992 12.3 5.97992 12 6.35992 11.84C6.41992 11.4066 6.59325 11.1133 6.77992 10.9466C5.29992 10.78 3.74659 10.2066 3.74659 7.66665C3.74659 6.92665 3.99992 6.33331 4.43325 5.85998C4.36659 5.69331 4.13325 4.99998 4.49992 4.09998C4.49992 4.09998 5.05992 3.91998 6.33325 4.77998C6.85992 4.63331 7.43325 4.55998 7.99992 4.55998C8.56659 4.55998 9.13992 4.63331 9.66659 4.77998C10.9399 3.91998 11.4999 4.09998 11.4999 4.09998C11.8666 4.99998 11.6333 5.69331 11.5666 5.85998C11.9999 6.33331 12.2533 6.92665 12.2533 7.66665C12.2533 10.2133 10.6933 10.7733 9.20659 10.94C9.44659 11.1466 9.66659 11.5533 9.66659 12.1733C9.66659 13.0666 9.66659 13.7866 9.66659 14C9.66659 14.18 9.77325 14.3933 10.1133 14.3333C12.7599 13.44 14.6666 10.9466 14.6666 7.99998C14.6666 7.1245 14.4941 6.25759 14.1591 5.44876C13.8241 4.63992 13.333 3.90499 12.714 3.28593C12.0949 2.66688 11.36 2.17581 10.5511 1.84078C9.7423 1.50575 8.8754 1.33331 7.99992 1.33331V1.33331Z"
            fill="currentcolor"
          ></path>
        </svg>
        <span>We on Github</span>
      </button>
    </Link>
  );
}

function Error() {
  return (
    <div className="main_wrapper">
      <div className="main">
        <div className="antenna">
          <div className="antenna_shadow"></div>
          <div className="a1"></div>
          <div className="a1d"></div>
          <div className="a2"></div>
          <div className="a2d"></div>
          <div className="a_base"></div>
        </div>
        <div className="tv">
          <div className="cruve">
            <svg
              className="curve_svg"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 189.929 189.929"
              xmlSpace="preserve"
            >
              <path
                d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13
        C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"
              ></path>
            </svg>
          </div>
          <div className="display_div">
            <div className="screen_out">
              <div className="screen_out1">
                <div className="screen">
                  <span className="notfound_text">
                    Connect to the internet :(
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="lines">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
          <div className="buttons_div">
            <div className="b1">
              <div></div>
            </div>
            <div className="b2"></div>
            <div className="speakers">
              <div className="g1">
                <div className="g11"></div>
                <div className="g12"></div>
                <div className="g13"></div>
              </div>
              <div className="g"></div>
              <div className="g"></div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="base1"></div>
          <div className="base2"></div>
          <div className="base3"></div>
        </div>
      </div>
    </div>
  );
}

export default Header;
