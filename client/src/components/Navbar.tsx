import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function Navbar() {
  const {user , logout} = useAuth();
  return (
    <>
      <header className="border-b border-neutral-700 w-full h-14 flex items-center justify-end px-3">
        <nav className="flex items-center">
          {user ? (
            <div className="flex text-white gap-2">
              <img
                src={user.profilePicture}
                alt="user-pfp"
                className="size-7 rounded-md"
              />

              <DropdownMenu>
                <DropdownMenuTrigger className="border-none outline-none">
                  <span>Welcome , {user.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-full bg-accent border-neutral-700"
                >
                  <DropdownMenuItem className="text-primary focus:text-primary cursor-pointer" asChild>
                    <Link to={"/profile"}> 
                        My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem className="text-white focus:bg-destructive cursor-pointer" onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button>Signin</Button>
          )}
        </nav>
      </header>
    </>
  );
}
