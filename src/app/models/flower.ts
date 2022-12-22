import { IMenu } from './menu';

export interface IFlower {
    id: string,
    name: string,
    address: string,
    colors: string,
    rating: string,
    reviews: string,
    feature_image: string,
    thumbnail_image: string,
    menu: IMenu[]
}