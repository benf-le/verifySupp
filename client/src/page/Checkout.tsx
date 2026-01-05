import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { RootState } from "../redux/store";
import {addToCart, clearCart} from "../redux/cartSlice";
import HandleOrders from "../api/HandleOrders";
import { CreateOrderRequest } from "../models/Order";
import { CartItem } from "../redux/cartSlice";

export default function CheckoutPage() {
    const cart = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies] = useCookies(['AuthToken']);
    const authToken = cookies.AuthToken;

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        phone: '',
        paymentMethod: 'cash' // 'cash' hoặc 'card'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOrderSuccess, ] = useState(false); // Thêm flag này

    useEffect(() => {
        window.scrollTo(0, 0);
        // Nếu chưa đăng nhập, chuyển về trang login
        if (!authToken) {
            navigate('/login');
        }
        // Nếu giỏ hàng trống, chuyển về trang cart
        if (cart.length === 0 && !isOrderSuccess) {
            navigate('/cart');
        }
    }, [authToken, cart.length, navigate, isOrderSuccess]);

    const calculateItemsPrice = () => {
        return cart.reduce((sum, item) => sum + (item.price ) * item.qty, 0);
    };

    const calculateShippingPrice = () => {
        // Tính phí ship, có thể tùy chỉnh logic
        const itemsPrice = calculateItemsPrice();
        return itemsPrice > 25 ? 0 : 5; // Free shipping trên $25
    };

    const calculateTotalPrice = () => {
        return calculateItemsPrice() + calculateShippingPrice();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Thêm useEffect để cleanup cart items không hợp lệ khi component mount
        useEffect(() => {
            const validCart = cart.filter((item: CartItem) => item.id && item.id.trim() !== '');
            if (validCart.length !== cart.length) {
                // Có items không hợp lệ, cập nhật lại cart
                dispatch(clearCart());
                validCart.forEach(item => {
                    dispatch(addToCart(item));
                });
                setError('Some invalid products have been removed from your cart. Please check again.');
            }
        }, []); // Chỉ chạy một lần khi mount
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!authToken) {
                throw new Error('Please login to place an order');
            }
                    // Validate cart items có productId hợp lệ
            const invalidItems = cart.filter((item: CartItem) => !item.id || item.id.trim() === '');
            
            if (invalidItems.length > 0) {
                throw new Error(
                    `Some products in your cart are invalid. Please remove and add them again: ${invalidItems.map(i => i.name).join(', ')}`
                );
            }
        // Chuyển đổi cart items thành order items - chỉ lấy items có id hợp lệ
            const orderItems = cart
                .filter((item: CartItem) => item.id && item.id.trim() !== '') // Filter ra items không có id
                .map((item: CartItem) => ({
                    name: item.name,
                    amount: item.qty,
                    image: item.imageUrl,
                    price: item.price, // price đã ở dạng cents
                    productId: item.id // Không cần || '' nữa vì đã filter rồi
                }));

            // Kiểm tra lại nếu không có items hợp lệ
            if (orderItems.length === 0) {
                throw new Error('No valid products in cart. Please add products to your cart.');
            }

            // Tạo shipping address string
            const shippingAddress = `${formData.fullName}, ${formData.address}, ${formData.city}, Phone: ${formData.phone}`;

            const orderData: CreateOrderRequest = {
                orderItems,
                shippingAddress,
                paymentMethod: formData.paymentMethod,
                itemsPrice: calculateItemsPrice(), // Chuyển sang cents
                shippingPrice: calculateShippingPrice(), // Chuyển sang cents
                totalPrice: calculateTotalPrice() // Chuyển sang cents
            };

            console.log('Creating order with data:', orderData); // Debug log

            const newOrder = await HandleOrders.createOrder(orderData, authToken);

            if (!newOrder || !newOrder.id) {
                console.error('Order response missing id:', newOrder);
                throw new Error('Order was created but ID was not received. Please check again.');
            }
            

// Navigate TRƯỚC, rồi mới clearCart
            console.log('Navigating to:', `/order-success/${newOrder.id}`);
            navigate(`/order-success/${newOrder.id}`);

// Clear cart sau khi đã navigate (có thể dùng setTimeout để đảm bảo navigate hoàn tất)
            setTimeout(() => {
                dispatch(clearCart());
            }, 100);
        } catch (err: any) {
            setError(err.message || 'An error occurred while placing the order. Please try again.');
            console.error('Order error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Cập nhật điều kiện render
    if (cart.length === 0 && !isOrderSuccess) {
        return null; // Sẽ redirect về cart
    }

    return (
        <div className="px-20 py-10">
            <h1 className="pet-stock-text-color text-3xl font-semibold mb-8">Checkout</h1>
            
            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-row gap-8">
                {/* Form bên trái */}
                <div className="basis-2/3">
                    {/* Shipping Address */}
                    <div className="bg-white border rounded p-6 mb-4">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Address</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">City</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Phone</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white border rounded p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={formData.paymentMethod === 'cash'}
                                    onChange={handleInputChange}
                                    className="radio radio-success"
                                />
                                <span>Cash on Delivery</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={formData.paymentMethod === 'card'}
                                    onChange={handleInputChange}
                                    className="radio radio-success"
                                />
                                <span>Credit/Debit Card</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Order Summary bên phải */}
                <div className="basis-1/3">
                    <div className="bg-zinc-50 p-8 border rounded sticky top-20">
                        <h2 className="pet-stock-text-color text-2xl font-semibold pb-4">Order Summary</h2>
                        <hr className="mb-4" />
                        
                        <div className="space-y-2 mb-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center space-x-3">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            ${item.price} | {item.qty}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        ${item.price * item.qty}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <hr className="mb-4" />
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Items Price</span>
                                <span>${calculateItemsPrice()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                    {calculateShippingPrice() === 0 
                                        ? 'Free' 
                                        : `$${calculateShippingPrice()}`}
                                </span>
                            </div>
                        </div>

                        <hr className="mb-4" />
                        
                        <div className="flex justify-between pet-stock-text-color text-xl font-semibold mb-6">
                            <span>Total</span>
                            <span>${calculateTotalPrice()}</span>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full h-12"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}