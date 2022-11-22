export type CommentType =  {
    postid: string,
    author: string,
    content: string,
    likes: string[],
    appreciateAmount: number,
    createdAt?: string,
    updatedAt?: string,
    _id?: string,
    [key: string]: any
}

export type CommunityType = {
    name: string,
    description?: string,
    bannerImageUrl?: string,
    logoImageUrl?: string,
    creator?: string,
    [key: string]: any,
}