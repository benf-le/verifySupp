export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
    usageInstruction?: string;
    ingredients?: string;
    isActive: boolean;
    // createAt: string;   // ISO date string nếu gửi qua JSON
    // updateAt: string;   // tương tự

    categoryId: number;

    // Tuỳ bạn muốn load quan hệ hay không

}