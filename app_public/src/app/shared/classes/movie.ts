class Genre {
    _id: string;
    name: string;
}

export class Movie {
    _id: string;
    title: string;
    year: number;
    genre: Genre;
    description: string;
}
