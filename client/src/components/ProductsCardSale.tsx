"use client";
import {useEffect, useState} from "react";


import {Link} from "react-router-dom";
import HandleProducts from "../api/HandleProducts";
import {Products} from "../models/Products";



export function ProductsCardSale() {

    const [productSale, setProductSale] = useState<Products[]>([]) //Products co dang array


    useEffect(() => {
        getSaleProducts()
    }, [])

    const getSaleProducts = async () => {
        const api = `/products/sale`

        try {
            const res: any = await HandleProducts.getProducts(api)
            if (res) {
                setProductSale(res)
            }
        } catch (e) {
            // @ts-ignore
            console.log(`Product not found: ${e.message}`)
        }
    }

    return (
        <div>
            <div className=" mx-auto w-full max-w-7xl px-6 lg:px-12 xl:px-20  my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-center ">
                {productSale.length > 0 && productSale.map(item =>

                    <Link to={`/products/${item.id}`}>
                        <div className="card mx-auto w-56 bg-base-400 shadow-xl mb-10">
                            <figure className="relative w-full h-full bg-white rounded-xl p-6 border-gray-100">
                                <img src={item.imageUrl} alt="Shoes"/>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-base line-clamp-2">
                                    {item.name}
                                </h2>
                                {/*<p className="text-sm">{item.descriptionShort}</p>*/}
                                <p className="py-2 text-3xl font-semibold">${item.price}</p>
                                {/*<div className="card-actions ">*/}
                                {/*    <button className="p-btn-addToCartSale pet-stock-color btn text-white">*/}
                                {/*        Add to Card*/}
                                {/*    </button>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </Link>
                )}</div>
        </div>
    );

}


