import { Product } from "./Product";

export interface BasketItem {
    basketItemId: number;
    quantity: number;
    productId: number;
    product: Product;
}

export interface Basket {
    basketId: number;
    buyerId: string;
    items: BasketItem[];
}



