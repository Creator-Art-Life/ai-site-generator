import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { v4 as uuid } from "uuid";

function SignInDialog({
  openDialog,
  closeDialog,
}: {
  openDialog: boolean;
  closeDialog: (open: boolean) => void;
}) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  const CreateUser = useMutation(api.users.CreateUser);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      // console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse.access_token } }
      );

      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        uid: uuid(),
      });

      if (typeof window !== undefined) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      setUserDetail(userInfo.data);

      // save this inside out db
      closeDialog(false);
    },
    onError: (errorResponse: any) => console.log(errorResponse),
  });
  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogPortal>
        <DialogContent className="z-[2000]" style={{ top: "440px" }}>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              <div className="flex items-center flex-col justify-center ">
                <h2 className="font-bold text-2xl text-center  text-white">
                  {Lookup.SIGNIN_HEADING}
                </h2>
                <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-400 mt-6 w-[300px]"
                  //@ts-expect-error text for resolve type error
                  onClick={googleLogin}
                >
                  {/* <img src="/google.svg" width={20} /> */}
                  Sign In With Google
                </Button>

                <p className="mt-5">{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default SignInDialog;
