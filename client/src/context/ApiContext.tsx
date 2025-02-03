import { BACKEND_URL } from "@/config/constants";
import { fetcher } from "@/lib/fetchers";
import { Posts } from "@/types/Posts";
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

type ApiContextType = {
  posts: Posts
  userPosts: Posts
  fetchPosts: () => void;
  createNewPost: (formData: FormData) => void;
  editPost: (formData: FormData, postId: string) => void;
  fetchUserPosts: () => void;
  deletePost: (postId:string) => void;
};

const ApiContext = createContext<ApiContextType>({
  posts: [],
  userPosts: [],
  fetchPosts: () => {},
  createNewPost: () => {},
  editPost: () => {},
  fetchUserPosts: () => {},
  deletePost: () => {},
});

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const {user} = useAuth();
  const [posts , setPosts] = useState<Posts>([]);
  const [userPosts , setUserPosts] = useState<Posts>([])
  const fetchPosts = async () => {
    const res = await fetcher({
      url: `${BACKEND_URL}/api/posts`,
      method: "GET",
      credentials:"include"
    });

    const {posts}: {posts: Posts} = res;

    setPosts(posts)
    console.log("res", res);
  };
  const createNewPost = async (formData: FormData) => {
    const res = await fetcher({
      url: `${BACKEND_URL}/api/posts`,
      method: "POST",
      credentials:"include",
      body: formData
    });

    const {posts}: {posts: Posts} = res;

    setPosts(posts)
    console.log("res", res);
  };
  const editPost = async (formData: FormData , postId: string) => {
    const res = await fetcher({
      url: `${BACKEND_URL}/api/posts/${postId}`,
      method: "PUT",
      credentials:"include",
      body: formData
    });

    const {posts}: {posts: Posts} = res;

    setPosts(posts)
    toast.success(res?.message)

  };
  const fetchUserPosts = async () => {
    const res = await fetcher({
      url: `${BACKEND_URL}/api/posts/user/${user?._id}`,
      method: "GET",
      credentials:"include",
    });

    const posts: Posts = res;
    console.log('posts',posts);
    setUserPosts(posts)
  };
  const deletePost = async (postId: string) => {
    const res = await fetcher({
      url: `${BACKEND_URL}/api/posts/${postId}`,
      method: "DELETE",
      credentials:"include",
    });
    toast.success(res?.message)
  };

  return (
    <ApiContext.Provider value={{ posts ,fetchPosts , createNewPost , userPosts, fetchUserPosts ,deletePost , editPost}}>{children}</ApiContext.Provider>
  );
};

export const useFetch = () => useContext(ApiContext);
