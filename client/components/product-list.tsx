"use client";


import { ProductCard } from "./product-card";
import { useState } from "react";
import {Product} from "@/type/product";

interface Props {
    products: Product[];
}

export const ProductList = ({ products }: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredProducts = products.filter((product) => {
        const term = searchTerm.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(term);
        const descriptionMatch = product.description
            ? product.description.toLowerCase().includes(term)
            : false;

        return nameMatch || descriptionMatch;
    });

    return (
        <div>
            <div className="mb flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full max-w-md rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                    <li key={product.id}>
                        {/* Truyền 1 product (không phải mảng) vào ProductCard */}
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
        </div>
    );
};