import { UserDetailContext } from "@/context/UserDetailContext";
import { useConvex, useMutation } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { truncateContent } from "@/lib/utils";
import Link from "next/link";
import { useSidebar } from "../ui/sidebar";
import "./css/fadeText.css";
import { Trash2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import toast from "react-hot-toast";
import { api } from "@/convex/_generated/api";

function WorkspaceHistory() {
  const { userDetail } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaceList, setWorkspaceList] = useState<Workspace[] | any>([]);
  const { toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetail) {
      GetAllWorkspace();
    }
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetAllWorkspace, {
      userId: userDetail._id,
    });
    setWorkspaceList(result);
    setLoading(false);
  };

  return (
    <div className="pt-4">
      <h2 className="text-lg font-semibold mb-4">Your Chats</h2>
      {loading && (
        <div className="space-y-3 w-[250px]">
          <Skeleton className="h-4 w-24" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton className="h-6 w-full" key={i} />
          ))}
        </div>
      )}
      {workspaceList ? (
        <div>
          <h3 className="text-sm text-gray-300 mb-2 font-medium">Today</h3>
          {workspaceList.map((workspace: Workspace) => (
            <WorkspaceItem
              key={workspace._id}
              workspace={workspace}
              toggleSidebar={toggleSidebar}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-2xl font-bold">No chats yet</p>
        </div>
      )}
    </div>
  );
}

const WorkspaceItem = ({
  workspace,
  toggleSidebar,
}: {
  workspace: Workspace;
  toggleSidebar: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const DeleteWorkspace = useMutation(api.workspace.DeleteWorkspace);
  const convex = useConvex();

  const HandlerDeleteWorkspace = async () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user?.email) {
        try {
          const result = await convex.query(api.users.GetUser, {
            email: user.email,
          });
          const userId = result?._id;
          if (userId) {
            await DeleteWorkspace({
              //@ts-expect-error type err
              id: workspace._id,
              userId: userId,
            });

            setDialogOpen(false);
            toast.success("Successfully deleted workspace!");
          } else {
            console.error("User not found or missing userId");
            toast.error("User not found");
          }
        } catch (error) {
          console.error("Error fetching user or deleting workspace", error);
          toast.error("Error fetching user");
        }
      }
    }
  };

  return (
    <div
      className="hover:bg-[#262626] flex gap-2 justify-end items-center w-full  rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/workspace/${workspace._id}`}
        className="flex items-center w-full"
      >
        <div className="flex items-center gap-2 justify-end rounded-lg p-1">
          <h2
            className="text-[15px] cursor-pointer fade-text flex-1 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
            onClick={toggleSidebar}
            style={{ fontWeight: 600 }}
          >
            {workspace.messages && workspace.messages.length > 0
              ? truncateContent(workspace.messages[0].content, 35)
              : "New Chat"}
          </h2>
        </div>
      </Link>
      {isHovered && (
        <Trash2
          className={`cursor-pointer mr-2 ${isTrashHovered ? "text-red-500" : "text-gray-400 hover:text-white"}`}
          onMouseEnter={() => setIsTrashHovered(true)}
          onMouseLeave={() => setIsTrashHovered(false)}
          onClick={() => setDialogOpen(true)}
        />
      )}

      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px] z-[2000] text-white rounded-lg ">
            <DialogHeader>
              <DialogTitle>Delete Chat?</DialogTitle>
            </DialogHeader>
            <Separator className="mb-4" />
            <div>
              <p className="text-[17px]">
                You are about to delete <strong>Media</strong> and{" "}
                <strong>everything</strong> related to chat.
              </p>
              <p className="mt-2 text-[16px]">
                Are you sure you want to delete this chat?
              </p>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 ml-2"
                onClick={HandlerDeleteWorkspace}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

type Message = {
  role: "user" | "ai";
  content: string;
};

type FileData = {
  name?: string;
  type?: string;
  size?: number;
  url?: string;
};

type Workspace = {
  _creationTime: number;
  _id: string;
  fileData: FileData;
  messages: Message[];
  user: string;
};

export default WorkspaceHistory;
