"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Collection} from "../../models/Collections.ts";
import {Products} from "../../models/Products.ts";
import HandleProducts from "../../api/HandleProducts.ts";
import {useDispatch} from "react-redux";
import {addToCart} from "../../redux/cartSlice.ts";


export function ProductsCardByCollection() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [productsByCollection, setProductsByCollection] = useState<Record<string, Products[]>>({});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getCollections();
    }, []);

    const getCollections = async () => {
        try {
            setLoading(true);
            const res: any = await HandleProducts.getProducts(`/collections`);
            if (res) {
                setCollections(res);
                // Sau khi có collections → fetch sản phẩm của từng collection
                res.forEach((col: Collection) => {
                    getProductsByCollection(col.id);
                });
            }
        } catch (e) {
            console.log("Collections not found:", e);
        }finally {
            setLoading(false);
        }
    };

    const getProductsByCollection = async (collectionId: string) => {
        try {
            const res: any = await HandleProducts.getProducts(`/products?collectionId=${collectionId}&limit=4`);
            if (res && res.data) {
                setProductsByCollection(prev => ({
                    ...prev,
                    [collectionId]: res.data
                }));
            }
        } catch (e) {
            console.log(`Products not found for collection ${collectionId}:`, e);
        }
    };

    const handleAddToCart = (product: Products) => {
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            qty: 1,
            type: ""
        }));
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 xl:px-20 my-8">
            {loading ? (<p>Loading...</p>)
                : collections.length > 0 ? (
                    collections.map(col => (
                <div key={col.id} className="mb-10">
                    <h2 className="text-2xl font-bold mb-4">{col.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productsByCollection[col.id]?.map(item => (
                            <Link to={`/products/${item.id}`} key={item.id}>
                                <div className="card mx-auto w-64 bg-base-400 shadow-xl mb-10">
                                    <figure className="relative w-full h-full bg-white rounded-xl p-6 border-gray-100">
                                        <img src={item.imageUrl} alt={item.name} />
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title text-base line-clamp-2 min-h-[3rem]">
                                            {item.name}
                                        </h2>
                                        <p className="py-2 text-3xl font-semibold">
                                            ${(item.price / 100).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();   // chặn link
                                                e.stopPropagation();  // ngăn bubble
                                                handleAddToCart(item);
                                            }}
                                            className="mt-2 px-3 py-2 verify-supp-color text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                ))
                    ) : (
                    <p>No products found.</p>
                )}
        </div>
    );
}
