"use client";

import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import "./css/hero.css";
import "./css/chatview.css";
import axios from "axios";
import Prompt from "@/data/Prompt";
import ReactMarkdown from "react-markdown";
import { useSidebar } from "../ui/sidebar";
import { api } from "@/convex/_generated/api";

function ChatView() {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useContext(MessagesContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      //@ts-expect-error mne pox
      workspaceId: id,
    });
    setMessages(result?.messages);
    console.log("result", result);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role == "user") {
        console.log("role", role);
        GetAiResponse();
      }
    }
  }, [messages]);

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      promt: PROMT,
    });
    console.log("result.data.result", result.data.result);
    const aiResp = {
      role: "ai",
      content: result.data.result,
    };
    setMessages((prev: any) => [...prev, aiResp]);
    await UpdateMessages({
      messages: [...messages, aiResp],
      //@ts-expect-error mne pox type err
      workspaceId: id,
    });
    setLoading(false);
  };

  const onGenerate = (input: string) => {
    setMessages((prev: any) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);
    setUserInput("");
  };

  return (
    <div className="relative h-[80vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll hide-scrollbar">
        {Array.isArray(messages) &&
          messages.map((msg: any, index: number) => (
            <div
              key={index}
              className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7"
              style={{
                backgroundColor: Colors.CHAT_BACKGROUND,
              }}
            >
              {msg.role === "user" && (
                <Image
                  src={userDetail.picture}
                  alt="avatar"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
            style={{
              backgroundColor: Colors.CHAT_BACKGROUND,
            }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-end ">
        {userDetail && (
          <Image
            src={userDetail.picture}
            alt="user"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
        {/* Input Section */}
        <div className="mt-5">
          <div className="card">
            <div className="bg">
              <div className="flex gap-2 h-[17vh]">
                <Textarea
                  placeholder="How can AI help you today?"
                  value={userInput}
                  className="h-full p-4 border-none focus:outline-none focus:ring-0 styled-textarea outline-none"
                  style={{
                    boxShadow: "none",
                    resize: "none",
                    overflow: "auto",
                    fontWeight: 500,
                  }}
                  onChange={(event) => setUserInput(event.target.value)}
                />
                {userInput && (
                  <div className="p-4">
                    <ArrowRight
                      onClick={() => onGenerate(userInput)}
                      className="bg-[#289cf0] p-2 h-[34px] w-[34px] rounded-md cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <div className="pl-4">
                <Link className="h-5 w-5 cursor-pointer" />
              </div>
            </div>
            <div className="blob"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
