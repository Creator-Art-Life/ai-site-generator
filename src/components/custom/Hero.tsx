"use client";

import Lookup from "@/data/Lookup";
import React, { useContext, useEffect, useState } from "react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Textarea } from "../ui/textarea";
import "./css/hero-main.css";
import { ArrowLeft, ArrowRight, TriangleAlert } from "lucide-react";
import { Link } from "lucide-react";
import { MessagesContext } from "@/context/MessagesContext";
import SignInDialog from "./SignInDialog";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);

  const router = useRouter();

  const onGenerate = async (input: string) => {
    console.log("userDetail", userDetail);
    if (!userDetail) {
      setOpenDialog(true);
      return;
    }
    const msg = {
      role: "user",
      content: input,
    };
    setMessages(msg);

    const workspaceId = await CreateWorkspace({
      user: userDetail._id,
      messages: [msg],
    });
    console.log("workspaceId", workspaceId);
    router.push(`/workspace/${workspaceId}`);
  };

  return (
    <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
      <h2 className="font-bold text-[44px] max-sm:text-center max-sm:text-4xl">
        {Lookup.HERO_HEADING}
      </h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
      <div className="flex justify-center w-full mt-5">
        <div
          className="card"
          style={{
            width: "500px",
          }}
        >
          <div className="bg">
            <div className="flex gap-2 h-[15.5vh]">
              <Textarea
                placeholder="How can AI help you today?"
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
            <div className="pl-4 pb-4 ">
              <Link className="h-5 w-5 cursor-pointer" />
            </div>
          </div>
          <div className="blob"></div>
        </div>
      </div>
      <div className="flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-8">
        {Lookup.SUGGSTIONS.map((suggstion, index) => (
          <h2
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
            key={index}
            onClick={() => onGenerate(suggstion)}
          >
            {suggstion}
          </h2>
        ))}
      </div>
      <div className="flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-8 w-full">
        <AlertDemo />
      </div>
      <SignInDialog
        closeDialog={(v) => setOpenDialog(v)}
        openDialog={openDialog}
      />
    </div>
  );
}

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AlertDemo() {
  return (
    <Alert className="flex items-center">
      <TriangleAlert className="h-4 w-4" />
      <div>
        <AlertTitle>Note!</AlertTitle>
        <AlertDescription>
          Due to high traffic, the app might not work properly. We appreciate
          your patience.
        </AlertDescription>
      </div>
    </Alert>
  );
}

export default Hero;
