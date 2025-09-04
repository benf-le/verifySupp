import { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import HandleProducts from "../api/HandleProducts";
import { Products } from "../models/Products";
import {addToCart} from "../redux/cartSlice.ts";
import {useDispatch} from "react-redux";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
    const query = useQuery().get("query") || "";
    const [products, setProducts] = useState<Products[]>([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (query) {
            fetchProducts(query);
        }
    }, [query]);

    const fetchProducts = async (keyword: string) => {
        setLoading(true);
        try {
            const api = `/products?search=${keyword}`; // backend cần hỗ trợ search
            const res: any = await HandleProducts.getProducts(api);
            setProducts(res || []);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
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
        <div className="w-[90%] mx-auto p-6 ">
            <h2 className="text-xl font-bold mb-4">
                Search results for: "{query}"
            </h2>
            <div className="pl-24 my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {loading ? (
                <p>Loading...</p>
            ) : products.length > 0 ? (
                products.map((item) => (
                    <div className="card w-64 bg-base-100 shadow-xl mb-10">
                        <figure className="relative w-full h-full bg-white rounded-t-xl p-6 border-gray-100">
                            <Link to={`/products/${item.id}`} className="block w-full h-full">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="object-contain w-full h-full"
                                />
                            </Link>
                        </figure>

                        <div className="card-body">
                            <Link to={`/products/${item.id}`}>
                                <h2 className="card-title text-base line-clamp-2 min-h-[3rem] hover:underline">
                                    {item.name}
                                </h2>
                                <p className="py-2 text-3xl font-semibold">
                                    ${(item.price / 100).toFixed(2)}
                                </p>
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart(item);
                                }}
                                className="mt-2 px-3 py-2 verify-supp-color text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>

                ))
            ) : (
                <p>No products found.</p>
            )}
        </div>
        </div>
    );
}
