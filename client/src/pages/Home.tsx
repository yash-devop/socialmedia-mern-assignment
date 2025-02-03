import Categories from "@/components/Categories"
import Developer from "@/components/Developer"
import PostList from "@/components/posts/PostCard"
import { useFetch } from "@/context/ApiContext"
import { useEffect } from "react"

export default function HomePage(){
    const {fetchPosts,posts} = useFetch();

    useEffect(()=>{
        fetchPosts()
    },[])
    return (
        <>
            <div className="flex flex-col w-full">
                <div className="h-full w-full flex flex-col items-center justify-center max-w-[1200px] mx-auto py-4 overflow-autos">
                    <Categories />
                    <div className="py-4">
                        <PostList posts={posts}/>
                    </div>
                </div>
                <Developer />
            </div>
        </>
    )
}