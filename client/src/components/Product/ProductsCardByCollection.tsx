"use client";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Collection } from "../../models/Collections";
import { Products } from "../../models/Products";
import HandleProducts from "../../api/HandleProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";

type RowRefs = Record<string, HTMLDivElement | null>;

export function ProductsCardByCollection() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [productsByCollection, setProductsByCollection] = useState<Record<string, Products[]>>({});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const rowRefs = useRef<RowRefs>({});

    useEffect(() => {
        getCollections();
    }, []);

    const getCollections = async () => {
        try {
            setLoading(true);
            const res: any = await HandleProducts.getProducts(`/collections`);
            if (res) {
                setCollections(res);
                res.forEach((col: Collection) => {
                    getProductsByCollection(col.id);
                });
            }
        } catch (e) {
            console.log("Collections not found:", e);
        } finally {
            setLoading(false);
        }
    };

    const getProductsByCollection = async (collectionId: string) => {
        try {
            const res: any = await HandleProducts.getProducts(`/products?collectionId=${collectionId}&limit=20`);
            if (res && res.data) {
                setProductsByCollection((prev) => ({
                    ...prev,
                    [collectionId]: res.data,
                }));
            }
        } catch (e) {
            console.log(`Products not found for collection ${collectionId}:`, e);
        }
    };

    const handleAddToCart = (product: Products) => {
        dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                qty: 1,
                type: "",
            })
        );
    };

    const scrollRow = (collectionId: string, dir: "left" | "right") => {
        const el = rowRefs.current[collectionId];
        if (!el) return;
        const cardWidth = 272;
        const delta = dir === "left" ? -cardWidth * 2 : cardWidth * 2;
        el.scrollBy({ left: delta, behavior: "smooth" });
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12 xl:px-20 my-8">
            {loading ? (
                <p>Loading...</p>
            ) : collections.length > 0 ? (
                collections.map((col) => {
                    const items = productsByCollection[col.id] || [];
                    if (!rowRefs.current[col.id]) rowRefs.current[col.id] = null;

                    return (
                        <section key={col.id} className="mb-12">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">{col.name}</h2>
                                {items.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            aria-label="Scroll left"
                                            onClick={() => scrollRow(col.id, "left")}
                                            className="rounded-lg border px-3 py-2 hover:bg-gray-100"
                                        >
                                            ←
                                        </button>
                                        <button
                                            aria-label="Scroll right"
                                            onClick={() => scrollRow(col.id, "right")}
                                            className="rounded-lg border px-3 py-2 hover:bg-gray-100"
                                        >
                                            →
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div
                                ref={(el) => (rowRefs.current[col.id] = el)}
                                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-2"
                            >
                                {items.length === 0 ? (
                                    <div className="text-gray-500">No products in this collection.</div>
                                ) : (
                                    <>
                                        {items.map((item) => (
                                            <Link
                                                to={`/products/${item.id}`}
                                                key={item.id}
                                                className="flex-none w-64 snap-start"
                                            >
                                                <div className="card w-64 bg-base-400 shadow-xl">
                                                    <figure className="relative w-full h-64 bg-white rounded-xl p-4 border-gray-100 overflow-hidden">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className="h-full w-full object-contain"
                                                            loading="lazy"
                                                        />
                                                    </figure>
                                                    <div className="card-body">
                                                        <h3 className="card-title text-base line-clamp-2 min-h-[3rem]">{item.name}</h3>
                                                        <p className="py-2 text-3xl font-semibold">
                                                            {(item.price >= 100 ? "$" : "₫")}
                                                            {(item.price / 100).toFixed(2)}
                                                        </p>
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
                                            </Link>
                                        ))}

                                        {/* ✅ Thêm ô "More" ở cuối */}
                                        <Link
                                            to={`/collections/${col.id}`}
                                            className="flex-none w-64 snap-start"
                                        >
                                            <div className="card w-64 h-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner flex items-center justify-center rounded-xl border border-gray-300 hover:scale-105 transition-transform">
                                                <div className="text-center p-6">
                                                    <p className="text-lg font-semibold text-gray-700 mb-2">More products</p>
                                                    <span className="text-4xl font-bold text-gray-800">→</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </section>
                    );
                })
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
}
