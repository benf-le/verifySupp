import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../redux/store.ts";
import {decreaseQty, increaseQty, removeFromCart} from "../redux/cartSlice.ts";


export default function CartPage() {
    const cart = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    window.scrollTo(0, 0);


    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price/100) * item.qty, 0).toFixed(2);
    };


    return (
        <div className="px-20 ">
            <main className="flex flex-row ">
                <div className="basis-2/3">
                    <p className="pet-stock-text-color py-10 text-2xl font-semibold">
                        Your shopping cart
                    </p>

                    {cart.length === 0 ? (
                        <div>
                            <div className="h-32 text-2xl w-10/12">
                                Your cart is currently empty, but you can still donate to the Petstock Foundation
                            </div>
                            <Link to="/">
                                <button className="btn ml-1">Continue Shopping</button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="h-32 border border-slate-200 rounded w-10/12">
                                <p className="py-4 font-medium pl-5">Choose your delivery method</p>
                                <hr />
                                <div className="pt-5 pl-7 flex flex-row">
                                    <input type="radio" name="radio-5" className="radio radio-success" />
                                    <p className="pl-3">Free standard shipping for metro orders over $25*</p>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded w-10/12 mt-4">
                                <p className="py-4 font-medium pl-5">Products</p>
                                <div className="pt-5 pl-7 flex flex-col space-y-5">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-row border border-slate-200 rounded w-full mr-8"
                                        >
                                            <div className="basis-2/12">
                                                <img src={item.imageUrl} alt={item.name} />
                                            </div>
                                            <div className="basis-10/12 bg-yellow-50 p-2">
                                                <p className="font-medium">{item.name}</p>
                                                <p>${item.price}</p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <button
                                                        className="px-2 py-1 bg-gray-200 rounded"
                                                        onClick={() => dispatch(decreaseQty(item.id))}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.qty}</span>
                                                    <button
                                                        className="px-2 py-1 bg-gray-200 rounded"
                                                        onClick={() => dispatch(increaseQty(item.id))}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <p className="mt-2">
                                                    Total: ${((item.price/100) * item.qty).toFixed(2)}
                                                </p>
                                                <button
                                                    className="mt-2 text-red-600 underline"
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>
                    )}
                </div>

                <div className="basis-1/3 pt-10">
                    <div className="bg-zinc-50 p-8 border rounded sticky top-20">
                        <p className="pet-stock-text-color text-3xl font-semibold pb-4">Cart Summary</p>
                        <hr />
                        <div className="py-5">
                            <div className="flex flex-row">
                                <p className="flex-1">Delivery</p>
                                <p>Calculated at Checkout</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="flex-1">Coupon</p>
                                <p>$0.00</p>
                            </div>
                        </div>
                        <hr />
                        <div className="flex flex-row pet-stock-text-color text-xl font-semibold pb-4">
                            <p className="flex-1">Total</p>
                            <p>${calculateTotal()}</p>
                        </div>
                        <button className="btn w-full h-20" disabled={cart.length === 0}>
                            {cart.length === 0
                                ? "You must add items to your cart before you can checkout."
                                : "Check Out"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
