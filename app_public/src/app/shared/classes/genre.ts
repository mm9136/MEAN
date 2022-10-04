class Movie {
    _id: string;
    imdb_id: string;
    title: string;
    year: number
    description: string;
}

export class Genre {
    _id: string;
    name: string;
    movies: Movie[];
}
