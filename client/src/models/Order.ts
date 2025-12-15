export interface OrderItem {
    id?: string;
    name: string;
    amount: number; // quantity
    image: string;
    price: number;
    discount?: number;
    productId: string;
    product?: {
        id: string;
        name: string;
        imageUrl: string;
    };
}

export interface CreateOrderRequest {
    orderItems: OrderItem[];
    shippingAddress: string;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
}

export interface Order {
    id: string;
    orderItems: OrderItem[];
    shippingAddress: string;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    userId: string;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}