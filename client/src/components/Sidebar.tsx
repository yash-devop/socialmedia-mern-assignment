import {
  Bell,
  House,
  Inbox,
  LucideProps,
  MessageCircle,
  Plus,
} from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./icons/Logo";
export default function Sidebar() {
    
  return (
    <>
      <div className="md:max-w-[70px] w-full border-t md:border-r border-neutral-600/70 md:min-h-screen fixed bottom-0 md:relative">
        <div className="hidden md:flex md:pt-6 items-center justify-center">
            <Logo />
        </div>
        <div className="flex md:flex-col flex-grow h-full justify-center items-center gap-8 py-4 md:py-0">
            <SidebarButton Icon={House} />
            <SidebarButton Icon={Inbox} />
            <SidebarButton Icon={MessageCircle} />
            <SidebarButton Icon={Bell} />
            <SidebarButton Icon={Plus} size={33} className="bg-primary py-6 px-3 hover:bg-primary"/>
        </div>
      </div>
      {/* <div className="max-w-[70px] w-full border-r border-neutral-600/70 min-h-screen flex flex-col items-center justify-center"> */}

    </>
  );
}

const SidebarButton = ({
  Icon,
  className,
  size
}: {
  size?: number;
  Icon: React.ComponentType<LucideProps>;
  className?:string
}) => {
  return (
    <Button variant={"ghost"} className={cn("[&_svg]:size-7 py-6",className)}>
      <Icon size={size} className={`shrink-0 size-6 text-white`}/>
    </Button> 
  );
};
