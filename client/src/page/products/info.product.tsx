import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MenuCollection from "../../components/Product/MenuCollection";
import ProductsCard from "../../components/Product/ProductsCard";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import OptionNearYou from "../../components/Product/OptionNearYou";

export default function ProductInforPage() {

    const [productDetail, setProductDetail] = useState(null)
    const [deliverOne, setDeliverOne] = useState(false)
    const [autoShip, setAutoShip] = useState(false)
    const [qty, setQty] = useState(1)
    const [cart, setCart] = useState(null)

    const id = useParams().id;

    // console.log(id)

    useEffect(() => {
        const getProductsDetail = async () => {
            const api = `/products/${id}`

            fetch(`http://localhost:7000` + api)
                .then(response => {
                    response.json()
                        .then(data => setProductDetail(data))
                        .catch(error => console.log(error))
                })


        }
        getProductsDetail()
    }, [])


    useEffect(() => {
        if (deliverOne) {
            setAutoShip(false);
        }
        if (autoShip) {
            setDeliverOne(false);
        }
    }, [deliverOne, autoShip]);


    // const addToCartHandler = () => {
    //     const newItem = {productDetail, quantity};
    //
    //     const cartItem = cart.find((item) => {
    //         return item.id === id;
    //
    //     });
    //
    //     // if cart item is already in the cart
    //     if (cartItem) {
    //         const newQuantity = cartItem.quantity + quantity;
    //         if (newQuantity > 0) {
    //             const newCart = [...cart].map((item => {
    //                 if (item.id === id) {
    //                     return {...item, quantity: newQuantity};
    //                 } else {
    //                     return item;
    //                 }
    //             }));
    //             setCart(newCart);
    //         }
    //     } else {
    //         setCart([...cart, newItem]);
    //     }
    // };
    //

    const addToCartHandler = () =>{
        let totalPrice = qty * productDetail.price
        const tempProduct ={
            ...productDetail,
            quantity: qty,
            totalPrice
        }
        console.log(tempProduct)
        setCart(tempProduct)
    }



    return (
        <div>

            {productDetail && (
                <div className="px-20">
                    <div className="pet-stock-text-color py-10 text-4xl font-semibold">
                        {productDetail.name}
                    </div>


                    <main className="flex flex-row ">
                        <div1 className="basis-1/4 border border-slate-200 rounded ">
                            <figure className="py-3 ">
                                <img src={productDetail.imageUrl} alt="Shoes"/>
                            </figure>
                        </div1>
                        <div2 className=" basis-2/4 grid border border-slate-200 rounded mx-8 px-5 h-44  ">
                            <div className="h-16  ">
                                <p className="py-4 font-medium ">
                                    Select Size:
                                    <div
                                        className="btn btn-ghost border-2 pet-stock-border-color ml-5 px-8 ">
                                        {productDetail.size}
                                       </div></p>
                                <hr/>

                                <div className="grid grid-cols-2 h-16 mt-4 grid-cols-3 gap-x-4">
                                    <div1
                                        className="border-2 border-slate-200 rounded flex flex-1  items-center h-full ">
                                        {/*minus icon*/}
                                        <div className="flex flex-1 justify-center items-center cursor-pointer">
                                            <IoMdRemove onClick={() => {
                                                setQty((prev) => (prev === 1 ? 1 : prev - 1))
                                            }}/>
                                        </div>
                                        {/*amount*/}
                                        <div className="h-full flex  justify-center items-center px-2">
                                            {qty}
                                        </div>
                                        {/*plus icon*/}
                                        <div className="flex flex-1 justify-center items-center cursor-pointer">
                                            <IoMdAdd onClick={() => {
                                                setQty((prev) => prev + 1)
                                            }}/>
                                        </div>
                                    </div1>


                                    <button
                                        className="btn btn-neutral h-16 border-2 border-slate-200 rounded col-span-2 pet-stock-color text-white"
                                        onClick={addToCartHandler}>
                                        ADD TO CART
                                    </button>


                                </div>
                            </div>


                        </div2>
                        <div3 className="basis-1/4">
                            <OptionNearYou/>
                        </div3>
                    </main>

                </div>
            )}

        </div>
    )

}