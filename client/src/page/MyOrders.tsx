import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import HandleOrders from "../api/HandleOrders";
import { Order } from "../models/Order";
import { formatDate } from "../utils/formatUtils";

export default function MyOrdersPage() {
    const [cookies] = useCookies(['AuthToken']);
    const authToken = cookies.AuthToken;
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        if (!authToken) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const ordersData = await HandleOrders.getUserOrders(authToken);
                setOrders(ordersData);
            } catch (err: any) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [authToken, navigate]);

    // const getStatusBadge = (order: Order) => {
    //     if (order.isDelivered) {
    //         return (
    //             <span className="badge badge-success badge-lg">
    //                 Delivered
    //             </span>
    //         );
    //     } else if (order.isPaid) {
    //         return (
    //             <span className="badge badge-warning badge-lg">
    //                 Processing
    //             </span>
    //         );
    //     } else {
    //         return (
    //             <span className="badge badge-error badge-lg">
    //                 Pending Payment
    //             </span>
    //         );
    //     }
    // };
    const getStatusBadge = (order: Order) => {
        // Nếu thanh toán tiền mặt/thẻ => coi như Done/Processing
        if (order.paymentMethod !== 'online' && !order.isDelivered) {
            return <span className="badge badge-info badge-lg">Processing</span>;
        }
    
        if (order.isDelivered) {
            return <span className="badge badge-success badge-lg">Delivered</span>;
        }
    
        if (order.isPaid) {
            return <span className="badge badge-success badge-lg">Done</span>;
        }
    
        // Mặc định: đang xử lý (không hiển thị Pending)
        return <span className="badge badge-info badge-lg">Processing</span>;
    };

    if (loading) {
        return (
            <div className="px-20 py-20 text-center">
                <div className="max-w-6xl mx-auto">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-20 py-20 text-center">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-3xl font-semibold mb-4">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                        >
                            Retry
                        </button>
                        <Link to="/" className="btn btn-outline">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-20 py-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="pet-stock-text-color text-4xl font-semibold mb-2">
                        My Orders
                    </h1>
                    <p className="text-gray-600">
                        {orders.length === 0
                            ? "You haven't placed any orders yet"
                            : `You have ${orders.length} order${orders.length > 1 ? 's' : ''}`}
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white border rounded-lg p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Start shopping to see your orders here!
                        </p>
                        <Link to="/" className="btn btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b">
                                    <div className="mb-4 md:mb-0">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <h3 className="text-xl font-semibold">
                                                Order #{order.id.toUpperCase()}
                                            </h3>
                                            {getStatusBadge(order)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold pet-stock-text-color mb-1">
                                            ${order.totalPrice }
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-4">
                                        {order.orderItems.slice(0, 3).map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                                            >
                                                <img
                                                    src={item.image || item.product?.imageUrl}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm line-clamp-1">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Qty: {item.amount} × ${item.price }
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
                                                <p className="text-sm text-gray-600">
                                                    +{order.orderItems.length - 3} more
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-gray-600 mb-1">Payment</p>
                                        <p className="font-medium">
                                            {order.isPaid ? (
                                                <span className="text-green-600">✓ Paid</span>
                                            ) : (
                                                <span className="text-yellow-600">Pending</span>
                                            )}
                                        </p>
                                        {order.paidAt && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(order.paidAt)}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1">Delivery</p>
                                        <p className="font-medium">
                                            {order.isDelivered ? (
                                                <span className="text-green-600">✓ Delivered</span>
                                            ) : (
                                                <span className="text-gray-600">Processing</span>
                                            )}
                                        </p>
                                        {order.deliveredAt && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(order.deliveredAt)}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-gray-600 mb-1">Payment Method</p>
                                        <p className="font-medium capitalize">
                                            {order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="btn btn-primary btn-sm flex-1 sm:flex-none"
                                    >
                                        View Details
                                    </Link>
                                    {!order.isPaid && (
                                        <button
                                            className="btn btn-outline btn-sm flex-1 sm:flex-none"
                                            onClick={() => {
                                                // Có thể thêm logic để thanh toán lại hoặc hủy đơn
                                                alert('Payment functionality coming soon!');
                                            }}
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                    {order.isDelivered && (
                                        <button
                                            className="btn btn-outline btn-sm flex-1 sm:flex-none"
                                            onClick={() => {
                                                // Có thể thêm logic để đánh giá sản phẩm
                                                alert('Review functionality coming soon!');
                                            }}
                                        >
                                            Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
