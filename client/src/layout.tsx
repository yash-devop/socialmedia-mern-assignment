import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

export default function RootLayout(){
    return (
        <>
            <main className="flex w-full min-h-screen overflow-auto">
                <Sidebar />
                <div className="w-full">
                    <Navbar />
                    <Outlet />
          <Toaster />

                </div>
            </main>
        </>
    )
}