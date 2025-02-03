import { Heart, MessageCircle } from "lucide-react"
import { ActionItem } from "./ActionItem"
import { Link } from "react-router-dom"
import { Posts } from "@/types/Posts"
import { cn } from "@/lib/utils"

export default function PostList({
    posts,
    className
}:{
    posts: Posts,
    className?:string
}){
    return (
        <>
            {
                posts.length > 0 ? posts.map((post, idx)=>(
                    <PostCard currentIdx={idx} length={posts.length} key={post._id} username={post.user.name} content={post.description} profilePicture={post.user.profilePicture} title={post.title} image={post.imageUrl} className={className}/>
                )) : <div className="flex items-center justify-center pt-28 text-neutral-500">
                    <p>No posts found.</p>
                </div>
            }
        </>
    )
}

function PostCard({
    username,
    content,
    title,
    profilePicture,
    image,
    className,
    length,
    currentIdx
}:{
    username: string,
    title: string,
    content: string,
    profilePicture?: string,
    image?:string,
    className?:string,
    length: number
    currentIdx: number
}){
    return (
        <>
            <div className={cn(`text-white w-full h-auto min-w-[576px] max-w-xl min-h-[80px] flex gap-2 border-b border-accent py-4 px-4 lg:px-0`,className, currentIdx === length - 1 && "border-none")}>
                <div className="min-w-fit">
                    <img src={profilePicture || "https://pbs.twimg.com/profile_images/77846223/profile_400x400.jpg"} alt="" className="size-8 rounded-full border border-accent/80 shrink-0" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between w-full">
                        <Link to={`/@${username}`} className="font-semibold hover:underline cursor-pointer text-[15px] w-fit">{username}</Link>
                    </div>
                    <span className="antialiased cursor-default pb-4 text-xs text-neutral-500">{title}</span>
                    <span className="text-sm antialiased cursor-default pb-4">{content}</span>
                    <img src={image} className="max-w-[380px] w-full rounded-lg"/>
                    <div className="flex items-center gap-3 pt-4 text-neutral-600">
                        <ActionItem name="Like" Icon={Heart} value={"2.9K"}/>
                        <ActionItem name="Comment" Icon={MessageCircle} value={60}/>
                    </div>
                </div>
            </div>
        </>
    )
}

