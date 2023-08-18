import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";


const getSessionValue = (key: string) => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
};


export default function CartPage() {


    const [cart, setCart] = useState(getSessionValue("shoppingCart")?? []);

    const calculateTotal = () => {
        let total = 0;

        for (const itemCart of cart) {
            const price = parseFloat(itemCart.price);
            const qty = parseInt(itemCart.qty);
            total += price * qty;
        }

        return total.toFixed(2);
    };

    const qtyCart = () => {
        return cart.length;
    };

    console.log(qtyCart())




    return (
        <div >
            <div className="px-20 h-screen">
                <main className="flex flex-row h-60">
                    <div className="basis-2/3 ">
                        <p className="pet-stock-text-color py-10 text-2xl font-semibold">
                            Your shopping cart
                        </p>

                        {cart == '' ?
                            ( <div>
                                <div className="h-32  text-2xl w-10/12">
                                    Your cart is currently empty, but you can still donate to the Petstock Foundation
                                </div>
                                <Link to='/'>
                                    <button className="btn ml-1">Continue Shopping</button>
                                </Link>
                            </div>

                            ):(


                            <div>
                                <div className="h-32  border border-slate-200 rounded w-10/12">
                                    <p className="py-4 font-medium pl-5">
                                        Choose your delivery method
                                    </p>
                                    <hr/>
                                    <div className="pt-5 pl-7 flex flex-row ">
                                        <input type="radio" name="radio-5" className="radio radio-success "/>
                                        <p className="pl-3">Free standard shipping for metro orders over $25*</p>
                                    </div>
                                </div>

                                <div className="  border border-slate-200 rounded w-10/12">
                                    <p className="py-4 font-medium pl-5">
                                        Products
                                    </p>

                                    <div className="pt-5 pl-7 flex flex-col overflow-x-scroll h-[200px]">
                                        {cart?.map((item) =>
                                            <div
                                                className=" flex flex-row border border-slate-200 rounded w-full mr-8 mb-5">
                                                <image className="basis-2/12 ">
                                                    <img src={item.imageUrl} alt="Products"/>
                                                </image>

                                                <detail className="basis-10/12 bg-yellow-50">
                                                    <p> {item.name}</p>
                                                    <p> ${item.price} </p>
                                                    <p>Quantity: {item.qty}</p>
                                                    <p>Total: ${item.price * item.qty}</p>
                                                </detail>
                                            </div>
                                        )}
                                    </div>
                                </div>


                            </div>

                            ) }

                    </div>
                    <div className="basis-1/3 pt-10 ">

                        <div>
                            <div
                                className="  bg-zinc-50 p-8 border rounded">
                                <div className=" ">
                                    <p className="pet-stock-text-color text-3xl font-semibold pb-4">Cart Summary</p>

                                </div>
                                <hr/>

                                <div className="py-5">
                                    <div>
                                        <div className="flex flex-row">
                                            <p className=" py-1 flex-1 ">Delivery</p>
                                            <p className=" py-1 ">Calculated at Checkout</p>
                                        </div>
                                        <div className="flex flex-row">
                                            <p className=" py-1 flex-1 ">Coupon</p>
                                            <p className=" py-1 ">$0.00</p>
                                        </div>

                                    </div>

                                    <hr/>
                                    <p className=" py-2">Coupon</p>
                                    <div className="lex flex-row">
                                        <input type="text" placeholder="Coupon"
                                               className="input input-bordered w-4/5 max-w-xs"/>
                                        <button className="btn ml-1">Apply</button>

                                    </div>
                                </div>
                                <hr/>

                                <div>
                                    <div className="flex flex-row pet-stock-text-color text-xl font-semibold pb-4">
                                        <p className=" py-1 flex-1 ">Total</p>
                                        <p className=" py-1 ">{calculateTotal()}</p>
                                    </div>
                                    <button
                                        className="btn w-full h-20"> {!cart ? 'You must add items to your cart before you can checkout.' : 'Check Out'}</button>
                                </div>


                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </div>
    )
}