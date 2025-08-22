import {ProductTypeOption} from "../types/common.ts";

export const PRODUCT_TYPE_OPTIONS: ProductTypeOption[] = [
    { value: 'box', label: 'Box (Hộp)' },
    { value: 'package', label: 'Package (Gói)' },
    { value: 'carton', label: 'Carton (Thùng)' }
];

export const STOCK_LEVELS = {
    HIGH: 10,
    LOW: 1,
    OUT_OF_STOCK: 0
} as const;

export const MODAL_CLOSE_DELAY = 1500;
