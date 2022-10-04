import { DvdMovie } from './dvd-movie';

export class Dvd {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    movies: DvdMovie[] | string[];
}
