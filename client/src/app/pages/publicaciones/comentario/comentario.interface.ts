export interface IComentario {
    _id: string;
    publicacion_id: string;
    author: Author;
    description: string;
    created: string;
    edited: boolean;
}

export interface Author {
    username: string;
    img: string;
}