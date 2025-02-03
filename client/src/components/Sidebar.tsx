import {
  Bell,
  House,
  Inbox,
  LucideProps,
  MessageCircle,
  Plus,
} from "lucide-react";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./icons/Logo";
import { Dialog, DialogTrigger } from "./ui/dialog";
import CreatePost from "./posts/CreatePost";
import { Link } from "react-router-dom";
export default function Sidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <div className="md:max-w-[70px] w-full border-t md:border-t-0 md:border-r border-neutral-600/70 fixed bottom-0 md:left-0 md:top-0 md:bottom-0 z-10 bg-background">
        <div className="hidden md:flex md:pt-6 items-center justify-center">
          <Logo />
        </div>
        <div className="flex md:flex-col flex-grow h-full justify-center items-center gap-8 py-4 md:py-0">
            <SidebarButton Icon={House} href="/home"/>
          <SidebarButton Icon={Inbox} />
          <SidebarButton Icon={MessageCircle} />
          <SidebarButton Icon={Bell} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <SidebarButton 
                Icon={Plus}
                className="bg-primary focus:bg-primary hover:bg-primary"
              />
            </DialogTrigger>
          </Dialog>
          
        </div>
      </div>
            {
              isDialogOpen ? (
                  <CreatePost open={isDialogOpen} closeDialog={() => setIsDialogOpen(false)} /> 
              ): null
            }
    </>
  );
}

const SidebarButton = ({
  Icon,
  className,
  size,
  onClick,
  href
}: {
  size?: number;
  Icon: React.ComponentType<LucideProps>;
  className?: string;
  onClick?: () => void;
  href?: string;
}) => {
  return (
    // If `href` is provided, render Link around Button, else just render Button
    href ? (
      <Link to={href} className="no-underline">
        <Button
          variant={"ghost"}
          className={cn("[&_svg]:size-7 py-6", className)}
          onClick={onClick}
        >
          <Icon size={size} className={`shrink-0 size-6 text-white`} />
        </Button>
      </Link>
    ) : (
      <Button
        variant={"ghost"}
        className={cn("[&_svg]:size-7 py-6", className)}
        onClick={onClick}
      >
        <Icon size={size} className={`shrink-0 size-6 text-white`} />
      </Button>
    )
  );
};

