import { useFetch } from "@/context/ApiContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "./ui/button";
import AllPostList from "./posts/AllPostsList";

export default function Profile() {
  const {name} = useParams();
  const {user} = useAuth();
  const {fetchUserPosts , userPosts} = useFetch();

  useEffect(()=>{
    fetchUserPosts()
  },[name])

  return (
    <>
          <div className="flex flex-col w-full max-w-xl mx-auto">
            <div className="flex justify-between items-center pt-12 pb-4">
              <div className="flex flex-col">
                <span className="text-white text-xl font-semibold">{user?.name}</span>
                <span className="text-xs text-neutral-600">@{user?.name}</span>
              </div>
              <div>
                <img src={user?.profilePicture} alt="" className="size-[60px] rounded-full"/>
              </div>
            </div>
            <div className="w-full py-10">
              <div className="py-4">
                <span className=" text-neutral-600">36K+ subscribers</span>
              </div>
              <Button className="w-full">Subscribe</Button>
              <AllPostList posts={userPosts} className="max-w-full pt-10" />
            </div>
           </div>
    </>
  );
}
