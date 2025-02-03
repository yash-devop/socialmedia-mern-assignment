import { Button } from "./ui/button"

const categories = [
    { id: 1, name: "Home" },
    { id: 2, name: "Culture" },
    { id: 3, name: "Technology" },
    { id: 4, name: "Business" },
    { id: 5, name: "Food" },
    { id: 6, name: "Blogs" },
    { id: 7, name: "Travel" },
    { id: 8, name: "Sports" },
    { id: 9, name: "Art & Illustration" },
    { id: 10, name: "News" },
    { id: 11, name: "Politics" },
    { id: 12, name: "Music" },
    { id: 13, name: "Spirituality" },
  ];
  
export default function Categories(){
    return (
        <div className="flex gap-2">
            {
                categories.map((category)=>(
                    <CategoryItem key={category.id} item={category.name}/>
                ))
            }
        </div>
    )
}

const CategoryItem=({
    item
}:{
    item: string
})=>{
    return (
       <Button size={"sm"} className="bg-accent hover:bg-accent/40">
            {item}
       </Button>
    )
}