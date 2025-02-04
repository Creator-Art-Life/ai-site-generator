"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Header } from "@/components/custom/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import React, { useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/custom/AppSideBar";
import { SidebarHandler } from "./sidebar-handler";
import { Toaster } from "react-hot-toast";
import { ActionContext } from "@/context/ActionsContext";
import { api } from "@/convex/_generated/api";

function Provider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [userDetail, setUserDetail] = useState<any | null>(null);
  const [action, setAction] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const convex = useConvex();

  const SIDEBAR_WIDTH = 304; // Для w-64 (16rem = 256px)

  useEffect(() => {
    IsAutheicated();
  }, []);

  const IsAutheicated = async () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?.email) {
        const result = await convex.query(api.users.GetUser, {
          email: user.email,
        });
        setUserDetail(result);
      }
    }
  };

  return (
    <div>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_AUTH_ID!}
      >
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ActionContext.Provider value={{ action, setAction }}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                <SidebarProvider
                  open={isSidebarOpen}
                  onOpenChange={setIsSidebarOpen}
                >
                  <SidebarHandler
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    sidebarWidth={SIDEBAR_WIDTH}
                  />
                  <AppSideBar />
                  <main className="w-full">
                    {children}

                    <Toaster
                      toastOptions={{
                        style: {
                          color: "#fff",
                          background: "#171717",
                        },
                      }}
                    />
                  </main>
                </SidebarProvider>
              </ThemeProvider>
            </ActionContext.Provider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;
