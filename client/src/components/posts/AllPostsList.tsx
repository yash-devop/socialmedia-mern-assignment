import { Heart, Image, MessageCircle, X } from "lucide-react";
import { ActionItem } from "./ActionItem";
import { Link } from "react-router-dom";
import { Posts } from "@/types/Posts";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useFetch } from "@/context/ApiContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function AllPostList({
  posts,
  className,
}: {
  posts: Posts;
  className?: string;
}) {
  const { deletePost } = useFetch();
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post, idx) => (
          <PostCard
            id={post._id}
            currentIdx={idx}
            length={posts.length}
            key={post._id}
            username={post.user.name}
            content={post.description}
            profilePicture={post.user.profilePicture}
            title={post.title}
            image={post.imageUrl}
            className={className}
            onClick={() => deletePost(post._id)}
          />
        ))
      ) : (
        <div className="flex items-center justify-center pt-28 text-neutral-500">
          <p>No posts found.</p>
        </div>
      )}
    </>
  );
}

function PostCard({
  id,
  username,
  content,
  title,
  profilePicture,
  image,
  className,
  length,
  currentIdx,
  onClick,
}: {
  id: string,
  username: string;
  title: string;
  content: string;
  profilePicture?: string;
  image?: string;
  className?: string;
  length: number;
  currentIdx: number;
  onClick?: () => void;
}) {
    const {editPost} = useFetch();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const imageSelectionRef = useRef<HTMLInputElement>(null);
    const [titles, setTitles] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isModalOpen , setIsModelOpen] = useState(false)
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setImages(reader.result as string);
            setImageFile(file);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleDeleteImage = () => {
      setImages(null);
      setImageFile(null);
    };
  
    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        // Resetting the height to 'auto' so it shrinks back
        textareaRef.current.style.height = "auto";
        // im setting this height based on the scrollHeight, which is the height of the content
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(event.target.value);
      adjustTextareaHeight();
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("title", titles);
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }
  
      console.log("image", formData.get("image"));
      editPost(formData,id)
      toast.success("Post created successfully !")
      setIsModelOpen(false)
    };
  return (
    <>
      <div
        className={cn(
          `text-white w-full h-auto min-w-[576px] max-w-xl min-h-[80px] flex gap-2 border-b border-accent py-4 px-4 lg:px-0`,
          className,
          currentIdx === length - 1 && "border-none"
        )}
      >
        <div className="min-w-fit">
          <img
            src={
              profilePicture ||
              "https://pbs.twimg.com/profile_images/77846223/profile_400x400.jpg"
            }
            alt=""
            className="size-8 rounded-full border border-accent/80 shrink-0"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <Link
              to={`/@${username}`}
              className="font-semibold hover:underline cursor-pointer text-[15px] w-fit"
            >
              {username}
            </Link>
            <div className="flex gap-2">
              <Dialog open={isModalOpen} onOpenChange={setIsModelOpen}>
                <DialogTrigger>
                  <Button size={"sm"} variant={"secondary"} className="h-6">
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-accent overflow-auto max-h-[550px] max-w-[590px] hidescrollbar flex flex-col">
                    <DialogHeader>
                    <DialogTitle className="text-primary">Edit Post</DialogTitle>
                    <div className="flex flex-col gap-2">
                        <input
                        type="file"
                        hidden
                        id="image-selection"
                        ref={imageSelectionRef}
                        onChange={handleImageChange}
                        />
                        <input
                        type="text"
                        placeholder="Title of the post"
                        name="title"
                        id="title"
                        className="bg-background border p-2 border-neutral-600 outline-none mt-3 rounded-lg text-white text-sm"
                        onChange={(e) => setTitles(e.target.value)}
                        />
                        <textarea
                        ref={textareaRef}
                        value={description}
                        onChange={handleChange}
                        className="w-full bg-background mt-6 outline-none resize-none hidescrollbar text-white"
                        placeholder="Type your post here..."
                        />
                    </div>
                    </DialogHeader> 

                    <DialogDescription className="max-h-[450px] overflow-auto hidescrollbar">
                    {images && (
                        <>
                        <div className="w-fit relative rounded-lg">
                            <img
                            src={images}
                            alt="Selected preview"
                            className="mt-4 max-h-[400px] min-w-[310px] rounded-lg"
                            />
                            <X
                            className="absolute text-white top-0 right-0 m-2 bg-black rounded-full p-0.5 cursor-pointer"
                            onClick={handleDeleteImage}
                            size={18}
                            />
                        </div>
                        </>
                    )}
                    <Image
                        className="text-neutral-600 cursor-pointer mt-4"
                        onClick={() => imageSelectionRef.current?.click()}
                    />
                    </DialogDescription>
                    <Button className="w-full mt-4" onClick={handleSubmit}>
                    Edit Post
                    </Button>
                </DialogContent>
              </Dialog>

              <Button
                size={"sm"}
                variant={"destructive"}
                className="h-6"
                onClick={onClick}
              >
                Delete
              </Button>
            </div>
          </div>
          <span className="antialiased cursor-default pb-4 text-xs text-neutral-500">
            {title}
          </span>
          <span className="text-sm antialiased cursor-default pb-4">
            {content}
          </span>
          <img src={image} className="max-w-[380px] w-full rounded-lg" />
          <div className="flex items-center gap-3 pt-4 text-neutral-600">
            <ActionItem name="Like" Icon={Heart} value={"2.9K"} />
            <ActionItem name="Comment" Icon={MessageCircle} value={60} />
          </div>
        </div>
      </div>
    </>
  );
}
