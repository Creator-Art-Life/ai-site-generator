"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import "./css/tabs.css";
import { motion } from "framer-motion";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "@/context/ActionsContext";
import { api } from "@/convex/_generated/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ButtonGit } from "./Header";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

// const LocalUse = process.env.NEXT_PUBLIC_PRODUCTION_USE;

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [files, setFiles] = useState(Lookup.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const { action, setAction } = useContext(ActionContext);

  const [isLongRequest, setIsLongRequest] = useState(false);
  const requestTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  useEffect(() => {
    setActiveTab("preview");
  }, [action]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      //@ts-expect-error text for resolve type err
      workspaceId: id,
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role == "user") {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GenerateAiCode = async () => {
    setLoading(true);
    setIsLongRequest(false);

    if (requestTimer.current) clearTimeout(requestTimer.current);

    requestTimer.current = setTimeout(() => {
      setIsLongRequest(true);
    }, 10000);

    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post("/api/gen-ai-code", {
      prompt: PROMPT,
    });
    console.log("result:", result.data);
    const aiResp = result.data;

    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp.files };
    setFiles(mergedFiles);
    console.log("aiResp.files", aiResp.files);
    await UpdateFiles({
      //@ts-expect-error mne pox type err
      workspaceId: id,
      files: aiResp.files,
    });

    if (requestTimer.current) clearTimeout(requestTimer.current);
    setLoading(false);
  };

  return (
    <div className="relative">
      <ToggleSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 w-[140px] gap-3 bg-black p-1 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${
              activeTab == "code"
                ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
                : ""
            }`}
          >
            Code
          </h2>

          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${
              activeTab == "preview"
                ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
                : ""
            }`}
          >
            Preview
          </h2>
        </div>
      </div> */}

      <SandpackProvider
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        files={files}
        options={{
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
      >
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreviewClient />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>

      {isLongRequest && (
        <LongOparation
          isLongRequest={isLongRequest}
          setIsLongRequest={setIsLongRequest}
        />
      )}

      {loading && (
        <div className="p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2 className="text-white">Generating your files...</h2>
        </div>
      )}
    </div>
  );
}

const ToggleSwitch = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "code" | "preview";
  setActiveTab: (tab: "code" | "preview") => void;
}) => {
  return (
    <div className="bg-[#181818] w-full p-2 border">
      <div className="flex items-center flex-wrap shrink-0 w-[140px] gap-3 bg-black p-1 justify-center rounded-full">
        <h2
          onClick={() => setActiveTab("code")}
          className={`text-sm cursor-pointer transition-colors duration-300 ${
            activeTab === "code"
              ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
              : "text-white hover:text-blue-500 hover:bg-blue-500 hover:bg-opacity-10 p-1 px-2 rounded-full"
          }`}
        >
          Code
        </h2>

        <h2
          onClick={() => setActiveTab("preview")}
          className={`text-sm cursor-pointer transition-colors duration-300 ${
            activeTab === "preview"
              ? "text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full"
              : "text-white hover:text-blue-500 hover:bg-blue-500 hover:bg-opacity-10 p-1 px-2 rounded-full"
          }`}
        >
          Preview
        </h2>
      </div>
    </div>
  );
};

const LongOparation = ({
  setIsLongRequest,
  isLongRequest,
}: {
  setIsLongRequest: React.Dispatch<React.SetStateAction<boolean>>;
  isLongRequest: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 opacity-80 flex items-center justify-center">
      <AlertDialog open={isLongRequest}>
        <AlertDialogContent className="max-sm:w-[40vh] max-sm:rounded-lg">
          <AlertDialogHeader className="flex items-center relative">
            <AlertDialogTitle className="flex items-center">
              <p>Long Operation</p>
              {/* <ChangeLang /> */}
            </AlertDialogTitle>
            <div className="mt-6 text-center text-sm text-gray-300">
              If you see this message, the hosting service is unable to process
              such a large request. However, you can run this project locally.
              Before doing so, please read the README.md file.
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-center">
            <Button
              variant={"destructive"}
              onClick={() => setIsLongRequest(false)}
              className="max-sm:mt-2 max-sm:w-[100px]"
            >
              Cancel
            </Button>
            <Link
              href={
                "https://github.com/Creator-Art-Life/ai-site-generator/blob/master/DEVELOPMENT.md"
              }
            >
              <Button
                variant="outline"
                className="px-4 py-2 text-sm font-bold text-white transition-all duration-500 bg-black bg-opacity-40 shadow-md hover:text-blue-400 hover:shadow-lg hover:bg-opacity-50 hover:-translate-y-1 max-sm:w-[200px]"
              >
                Project on Github
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

type Checked = DropdownMenuCheckboxItemProps["checked"];

const ChangeLang = () => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Lang</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          disabled
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
        >
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CodeView;
