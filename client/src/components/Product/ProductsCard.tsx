"use client";
import  {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Products} from "../../models/Products";
import HandleProducts from "../../api/HandleProducts";



export default function ProductsCard() {

    const [product, setProduct] = useState<Products[]>([]) //Products co dang array

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = async () => {
        const api = `/products`

        try {
            const res: any = await HandleProducts.getProducts(api)
            if (res) {
                setProduct(res)
            }
        } catch (e) {
            // @ts-ignore
            console.log(`Product not found: ${e.message}`)
        }
    }

    return (
        <div>
            <div className=" pl-24 my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-center">
                {product.length > 0 && product.map(item =>

                    <Link to={`/products/${item.id}`}>
                        <div className="card ml-5 w-52 bg-base-100 shadow-xl mb-10">
                            <figure className="relative w-full h-full bg-white rounded-xl p-6 border-gray-100">

                                <img src={item.imageUrl} alt="Shoes"/>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-base line-clamp-2">
                                    {item.name}
                                </h2>
                                <p className="text-sm">{item.descriptionShort}</p>
                                <p className="py-2 text-3xl font-semibold">${item.price}</p>
                                {/*<div className="card-actions ">*/}
                                {/*    <button className="p-btn-addToCart pet-stock-color btn text-white">*/}
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


