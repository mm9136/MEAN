import { User } from './user';

export class BillMovie {
    id: string;
    title: string;
    year: number;
}

export class BillDvd {
    price: number;
    quantity: number;
    name: string;
    movies: BillMovie[];
}

export class Bill {
    _id: string;
    order_number: number;
    date: Date;
    total: number;
    dvd: BillDvd[];
    user: User | string;
}
