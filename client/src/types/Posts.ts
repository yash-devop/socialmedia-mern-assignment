export type Post = {
    title: string,
    description: string,
    createdAt: Date,
    imageUrl: string,
    updatedAt: Date
    user: User,
    _id: string
}
export type Posts = Post[];

type User = {
    name: string,
    profilePicture?: string,
    _id: string
}