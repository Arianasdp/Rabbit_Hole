export interface IPublicacion {
    _id: string;
    author: Author;
    title: string;
    description: string;
    img: string;
    likesCount: number;
    created: string;
    likedByUser: boolean;
}

export interface Author {
    _id: string;
    username: string;
    img: string;
}