import {apiPost, apiGet, apiPatch} from "../utils/apiUtils";
import { CreateOrderRequest, Order } from "../models/Order";

class HandleOrders {
    static createOrder = async (data: CreateOrderRequest, token: string): Promise<Order> => {
        return apiPost<Order>('/orders/create', data, token);
    }

    static getOrderById = async (orderId: string, token: string): Promise<Order> => {
        return apiGet<Order>(`/orders/${orderId}`, token);
    }

    static getUserOrders = async (token: string): Promise<Order[]> => {
        return apiGet<Order[]>('/orders/my-orders', token);
    }

      // ADMIN
  static getAllOrders = async (token: string): Promise<Order[]> =>
    apiGet<Order[]>("/orders", token);

  static markPaid = async (orderId: string, token: string): Promise<Order> =>
    apiPatch<Order>(`/orders/${orderId}/pay`, {}, token);

  static markDelivered = async (orderId: string, token: string): Promise<Order> =>
    apiPatch<Order>(`/orders/${orderId}/deliver`, {}, token);

  static updateOrder = async (
    orderId: string,
    data: Partial<Pick<Order, "shippingAddress" | "paymentMethod" | "isPaid" | "isDelivered">>,
    token: string
  ): Promise<Order> => apiPatch<Order>(`/orders/${orderId}/update`, data, token);
}

export default HandleOrders;