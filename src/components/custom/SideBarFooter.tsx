import { HelpCircle, LogOut, Settings, Wallet } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function SideBarFooter() {
  const options = [
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Help Center",
      icon: HelpCircle,
    },
    {
      name: "My Subscription",
      icon: Wallet,
    },
    {
      name: "Sign Out",
      icon: LogOut,
    },
  ];

  const renderOptions = () => {
    const buttons = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i]; // Get the current option object
      buttons.push(
        <Button
          key={i}
          variant="ghost"
          className="w-full flex items-center justify-start my-3 text-base font-normal"
        >
          <option.icon className="w-5 h-5 mr-2" />{" "}
          {/* Access icon from the option object */}
          <span>{option.name}</span> {/* Access name from the option object */}
        </Button>
      );
      if (i === 1) {
        buttons.push(<Separator />);
      }
    }
    return buttons;
  };
  return <div className="">{renderOptions()}</div>;
}
