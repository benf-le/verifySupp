import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import { Products } from "../../models/Products";
import HandleProducts from "../../api/HandleProducts";
import {useDispatch} from "react-redux";
import {addToCart} from "../../redux/cartSlice.ts";

export default function ProductsCard() {
    const { id: collectionId } = useParams(); // lấy collectionId từ URL
    const [products, setProducts] = useState<Products[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 8;
    const dispatch = useDispatch();

    useEffect(() => {
        getProducts(null, 1);
    }, [collectionId]); // load lại khi đổi collectionId

    const getProducts = async (cursorValue: string | null, page: number) => {
        const api = cursorValue
            ? `/products?collectionId=${collectionId}&cursor=${cursorValue}&limit=${limit}`
            : `/products?collectionId=${collectionId}&limit=${limit}`;

        try {
            const res: any = await HandleProducts.getProducts(api);
            if (res) {
                setProducts(res.data);
                setCursor(res.nextCursor);
                setTotalPages(res.totalPages);
                setCurrentPage(page);
            }
        } catch (e: any) {
            console.log(`Product not found: ${e.message}`);
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
    // Hàm tính range page hiển thị
    const getPaginationRange = (current: number, total: number, delta: number = 2) => {
        const range: (number | string)[] = [];
        const left = current - delta;
        const right = current + delta;

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= left && i <= right)) {
                range.push(i);
            } else if (range[range.length - 1] !== "...") {
                range.push("...");
            }
        }
        return range;
    };

    const paginationRange = getPaginationRange(currentPage, totalPages);

    return (
        <div>
            <div className="pl-24 my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products && products.length > 0 ? (
                    products.map((item) => (
                        <Link key={item.id} to={`/products/${item.id}`}>
                            <div className="card w-64 bg-base-100 shadow-xl mb-10">
                                <figure className="relative w-full h-full bg-white rounded-xl p-6 border-gray-100">
                                    <img src={item.imageUrl} alt={item.name}/>
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title text-base line-clamp-2 min-h-[3rem]">
                                        {item.name}
                                    </h2>
                                    {/*<p className="text-sm">{item.descriptionShort}</p>*/}
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
                ))
                ) : (
                    <p>No products found</p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center space-x-2 my-6 items-center">
                {/* Prev button */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => getProducts(null, currentPage - 1)}
                    className="px-3 py-2 rounded-md border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                    Prev
                </button>

                {paginationRange.map((page, idx) =>
                    page === "..." ? (
                        <span key={idx} className="px-3 py-2">...</span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => {
                                if (page === 1) {
                                    getProducts(null, 1);
                                } else { // @ts-ignore
                                    if (page > currentPage && cursor) {
                                                                        // @ts-ignore
                                        getProducts(cursor, page);
                                                                    }
                                }
                            }}
                            className={`px-4 py-2 rounded-md border ${
                                currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next button */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => cursor && getProducts(cursor, currentPage + 1)}
                    className="px-3 py-2 rounded-md border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
