import React, {useState} from "react";
import {Link} from "react-router-dom";
import {FiMapPin} from "react-icons/fi";
import {BiShoppingBag, BiStoreAlt} from "react-icons/bi";

export default function CartSummary({emptyCart}) {




    return (
        <div >
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
                    <input type="text" placeholder="Coupon" className="input input-bordered w-4/5 max-w-xs" />
                    <button className="btn ml-1">Apply</button>

                </div>
                </div>
                <hr/>

                <div>
                    <div className="flex flex-row pet-stock-text-color text-xl font-semibold pb-4">
                        <p className=" py-1 flex-1 ">Total</p>
                        <p className=" py-1 ">$0.00</p>
                    </div>
                    <button className="btn w-full h-20"> {emptyCart ? 'You must add items to your cart before you can checkout.' : 'Check Out'}</button>
                </div>


            </div>
        </div>
    )

}