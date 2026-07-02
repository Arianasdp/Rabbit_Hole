export interface ILikeEvent {
    _id: string;
    cantidad: number;
}

export interface ILoginEvent {
    username: string;
    cantidad: number;
}

export interface IProfileVisit {
    username: string;
    cantidad: number;
}

export interface IPublicacionesPorUsuario {
    usuario: string;
    cantidad: number;
}

export interface IComentariosPorPeriodo {
    fecha: string;
    cantidad: number;
}

export interface IComentariosPorPeriodoYPublicacion {
    publicacion: string;
    cantidad: number;
}