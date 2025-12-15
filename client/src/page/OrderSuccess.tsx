import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccessPage() {
    const { orderId } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log('OrderSuccess page loaded with orderId:', orderId); // Debug log
    }, [orderId]);

    if (!orderId) {
        return (
            <div className="px-20 py-20 text-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-semibold mb-4">Order ID not found</h1>
                    <Link to="/" className="btn btn-primary">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="px-20 py-20 text-center">
            <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-semibold mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-6">
                    Your order ID: <strong>{orderId}</strong>
                </p>
                <p className="mb-8">
                    Thank you for your purchase. We'll send you a confirmation email shortly.
                </p>
                <div className="space-x-4">
                    <Link to="/" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                    <Link to={`/orders/${orderId}`} className="btn btn-outline">
                        View Order
                    </Link>
                    <Link to="/orders" className="btn btn-outline">
                        My Orders
                    </Link>
                </div>
            </div>
        </div>
    );
}