import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import HandleOrders from "../api/HandleOrders";
import { Order } from "../models/Order";
import { formatDate } from "../utils/formatUtils";

export default function ViewOrderPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const [cookies] = useCookies(['AuthToken']);
    const authToken = cookies.AuthToken;
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        if (!authToken) {
            navigate('/login');
            return;
        }

        if (!orderId) {
            setError('Order ID not found');
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                setLoading(true);
                const orderData = await HandleOrders.getOrderById(orderId, authToken);
                setOrder(orderData);
            } catch (err: any) {
                console.error('Error fetching order:', err);
                setError(err.message || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, authToken, navigate]);

    if (loading) {
        return (
            <div className="px-20 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="px-20 py-20 text-center">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-3xl font-semibold mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
                    <div className="space-x-4">
                        <Link to="/" className="btn btn-primary">
                            Go Home
                        </Link>
                        <Link to="/orders" className="btn btn-outline">
                            My Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-20 py-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/orders" className="text-blue-600 hover:underline mb-4 inline-block">
                        ← Back to My Orders
                    </Link>
                    <h1 className="pet-stock-text-color text-4xl font-semibold mb-2">
                        Order Details
                    </h1>
                    <p className="text-gray-600">
                        Order ID: <strong>{order.id}</strong>
                    </p>
                </div>

                {/* Order Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className={`border rounded-lg p-6 ${order.isPaid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                                <p className={`text-xl font-semibold ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {order.isPaid ? 'Paid' : 'Pending'}
                                </p>
                            </div>
                            {order.isPaid ? (
                                <div className="text-3xl">✅</div>
                            ) : (
                                <div className="text-3xl">⏳</div>
                            )}
                        </div>
                        {order.paidAt && (
                            <p className="text-xs text-gray-500 mt-2">
                                Paid on: {formatDate(order.paidAt)}
                            </p>
                        )}
                    </div>

                    <div className={`border rounded-lg p-6 ${order.isDelivered ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Delivery Status</p>
                                <p className={`text-xl font-semibold ${order.isDelivered ? 'text-green-600' : 'text-gray-600'}`}>
                                    {order.isDelivered ? 'Delivered' : 'Processing'}
                                </p>
                            </div>
                            {order.isDelivered ? (
                                <div className="text-3xl">📦</div>
                            ) : (
                                <div className="text-3xl">🚚</div>
                            )}
                        </div>
                        {order.deliveredAt && (
                            <p className="text-xs text-gray-500 mt-2">
                                Delivered on: {formatDate(order.deliveredAt)}
                            </p>
                        )}
                    </div>

                    <div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                                <p className="text-xl font-semibold text-blue-600">
                                    {formatDate(order.createdAt).split(',')[0]}
                                </p>
                            </div>
                            <div className="text-3xl">📅</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border rounded-lg p-6 mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                                        <img
                                            src={item.image || item.product?.imageUrl}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <Link
                                                to={`/products/${item.productId}`}
                                                className="font-semibold text-lg hover:text-blue-600 hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Quantity: {item.amount}
                                            </p>
                                            {item.discount && item.discount > 0 && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    Discount: ${(item.discount / 100).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg">
                                                ${((item.price / 100) * item.amount).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                ${(item.price / 100).toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white border rounded-lg p-6">
                            <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
                            <div className="text-gray-700 whitespace-pre-line">
                                {order.shippingAddress}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-50 border rounded-lg p-6 sticky top-20">
                            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items Price</span>
                                    <span className="font-semibold">
                                        ${(order.itemsPrice / 100).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">
                                        {order.shippingPrice === 0
                                            ? 'Free'
                                            : `$${(order.shippingPrice / 100).toFixed(2)}`}
                                    </span>
                                </div>
                                <hr />
                                <div className="flex justify-between text-xl font-bold pet-stock-text-color">
                                    <span>Total</span>
                                    <span>${(order.totalPrice / 100).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                                <p className="font-semibold capitalize">
                                    {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}
                                </p>
                            </div>

                            <div className="mt-6 space-y-2">
                                <Link
                                    to="/"
                                    className="btn btn-primary w-full"
                                >
                                    Continue Shopping
                                </Link>
                                <Link
                                    to="/orders"
                                    className="btn btn-outline w-full"
                                >
                                    View All Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
