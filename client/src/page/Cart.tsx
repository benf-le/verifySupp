import React from "react";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import CartSummary from "../components/CartSummary";

export default function CartPage() {
    const emptyCart = true
    return (
        <div className="">
            <div className="px-20 h-screen">
                <main className="flex flex-row h-60">
                    <div className="basis-2/3 ">
                        <p className="pet-stock-text-color py-10 text-2xl font-semibold">
                            Your shopping cart
                        </p>
                        {emptyCart &&
                            <div>
                                <div className="h-32  text-2xl w-10/12">
                                    Your cart is currently empty, but you can still donate to the Petstock Foundation
                                </div>
                                <button className="btn ml-1">Continue Shopping</button>
                            </div>


                        }

                        {!emptyCart &&
                            <div className="h-32  border border-slate-200 rounded w-10/12">
                                <p className="py-4 font-medium pl-5">
                                    Choose your delivery method
                                </p>
                                <hr/>
                                <div className="pt-5 pl-7 flex flex-row ">
                                    <input type="radio" name="radio-5" className="radio radio-success "/>
                                    <p className="pl-3">Free standard shipping for metro orders over $25*</p>
                                </div>


                            </div>}
                    </div>
                    <div className="basis-1/3 pt-10 ">

                        <CartSummary emptyCart={emptyCart}/>

                    </div>

                </main>
            </div>
        </div>
    )
}