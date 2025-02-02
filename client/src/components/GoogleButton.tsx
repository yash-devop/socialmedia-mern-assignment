import { cn } from "@/lib/utils";
import { Google } from "./icons/Google";
import { Button } from "./ui/button";

export const GoogleButton=({
  className
}:{
  className?:string
})=>{
    const handleLogin = () => {
        // Redirects the user to the backend API to start Google OAuth flow
        window.location.href = 'http://localhost:8000/api/auth/google';
      };
    
  
    return (
      <Button onClick={handleLogin} className={cn("bg-background border border-neutral-800",className)}>
        <Google />
        Login with Google
      </Button>
    );
}