export interface Collection {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductForm {
    name: string;
    imageUrl: string;
    type: string;
    price: number;
    forSale: boolean;
    countInStock: number;
    description: string;
    ingredient: string;
    collectionId: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export type ProductType = 'box' | 'package' | 'carton';

export interface ProductTypeOption {
    value: ProductType;
    label: string;
}

export interface ModalState {
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}
