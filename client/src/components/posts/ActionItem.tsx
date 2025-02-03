import { LucideProps } from "lucide-react"
import { Button } from "../ui/button"

export const ActionItem=({
    name,
    Icon,
    value
}:{
    name: string
    Icon: React.ComponentType<LucideProps>,
    value: string | number
})=>{
    return (
        <Button name={name} size={"sm"} variant={"ghost"} className="rounded-full">
            <Icon className="cursor-pointer"/>
            <p>{value}</p>
        </Button>
    )
}
