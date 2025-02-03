"use client";

import React, { useContext, useEffect, useState } from "react";
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
import { api } from "../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import SandpackPreviewClient from "./SandpackPreviewClient";
import { ActionContext } from "@/context/ActionsContext";

function CodeView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [files, setFiles] = useState(Lookup.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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

export default CodeView;
