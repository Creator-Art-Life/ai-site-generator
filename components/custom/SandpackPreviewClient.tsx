import { ActionContext } from "@/context/ActionsContext";
import {
  SandpackPreview,
  SandpackPreviewRef,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React, { useContext, useEffect, useRef } from "react";

export default function SandpackPreviewClient() {
  const { sandpack } = useSandpack();
  const previewRef = React.useRef<SandpackPreviewRef>(null);
  const { action, setAction } = useContext(ActionContext);

  useEffect(() => {
    GetSandpackClient();
  }, [sandpack && action]);

  const GetSandpackClient = async () => {
    const client = previewRef.current?.getClient();

    if (client) {
      console.log(client);
      //@ts-expect-error some text for type err
      const result = await client.getCodeSandboxURL();
      console.log(result);
      if (action.actionType == "deploy") {
        window.open(`https://${result.sandboxId}.csb.app`);
      } else if (action.actionType == "export") {
        window.open(result.editorUrl);
      }
    }
  };
  return (
    <SandpackPreview
      ref={previewRef}
      style={{ height: "80vh" }}
      showNavigator={true}
    />
  );
}
