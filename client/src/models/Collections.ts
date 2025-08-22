// src/models/Collection.ts
export interface Collection {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    productsCount?: number; // Số lượng sản phẩm trong collection
}

export interface CollectionForm {
    name: string;
    description?: string;
}
