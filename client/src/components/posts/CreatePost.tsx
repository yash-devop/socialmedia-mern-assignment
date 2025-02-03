import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Image, X } from "lucide-react";
import { useFetch } from "@/context/ApiContext";
import { toast } from "sonner";

export default function CreatePost({
  closeDialog,
  open,
}: {
  open: boolean;
  closeDialog: () => void;
}) {
  const { createNewPost } = useFetch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageSelectionRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result as string);
          setImageFile(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
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
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    console.log("image", formData.get("image"));
    createNewPost(formData);
    toast.success("Post created successfully !")
    closeDialog()
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="border-accent overflow-auto max-h-[550px] max-w-[590px] hidescrollbar flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">Create Post</DialogTitle>
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
              onChange={(e) => setTitle(e.target.value)}
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
          {image && (
            <>
              <div className="w-fit relative rounded-lg">
                <img
                  src={image}
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
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
}
