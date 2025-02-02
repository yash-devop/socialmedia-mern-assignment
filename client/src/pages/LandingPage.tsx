import { GoogleButton } from "@/components/GoogleButton";
import { Logo } from "@/components/icons/Logo";

export default function LandingPage(){
    return (
        <>
            <div className="min-h-screen p-4 flex flex-col gap-2 items-center justify-center">
                <div>
                    <div className="flex items-center justify-center gap-2">
                        <Logo className="size-[30px]"/>
                        <div></div>
                        <p className="text-4xl tracking-tighter font-semibold text-white select-none">Socio</p>
                    </div>
                    <GoogleButton className="mt-8"/>
                </div>
                <div className="pt-8 fixed bottom-0 pb-5 text-white">
                    <span>Developed by — <a href="https://portfolio.yashstack.com/" target="_blank" className="underline">Yash Kamble</a></span>
                </div>
            </div>
        </>
    )
}