"use client";
import React, {useEffect, useState} from "react";


import {Link} from "react-router-dom";
import HandleProducts from "../api/HandleProducts";
import {Products} from "../models/Products";



export default function ProductsCardSale() {

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
            console.log(`Product not found: ${e.message}`)
        }
    }

    return (
        <div>
            <div className="py-10 pl-48 my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center ">
                {productSale.length > 0 && productSale.map(item =>

                    <Link to={`/products/${item.id}`}>
                        <div className="card ml-5 w-64 bg-base-100 shadow-xl ">
                            <figure className="py-3">
                                <img src={item.imageUrl} alt="Shoes"/>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-base">
                                    {item.name}
                                </h2>
                                <p className="text-sm">{item.description}</p>
                                <p className="py-2 text-3xl font-semibold">${item.price}</p>
                                <div className="card-actions ">
                                    <button className="p-btn-addToCartSale pet-stock-color btn text-white">
                                        Add to Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>

            )}</div>
        </div>
    );

}


