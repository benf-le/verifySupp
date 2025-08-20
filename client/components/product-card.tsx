import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import {Product} from "@/type/product";

interface Props {
    product: Product;
}

export const ProductCard = ({ product }: Props) => {
    const price = product.price;

    return (
        <Link href={`/products/${product.id}`} className="block h-full">
            <Card className="group hover:shadow-2xl transition duration-300 py-0 h-[480px] flex flex-col border-gray-300 gap-0">
                {product.imageUrl && product.imageUrl[0] && (
                    <div className="relative h-64 w-full flex-shrink-0 p-4">
                        <div className="relative w-full h-full bg-white rounded-xl p-6 border-gray-100">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                style={{
                                    objectFit: "contain"
                                }}
                                className="group-hover:opacity-90 transition-opacity duration-300"
                            />
                        </div>
                    </div>
                )}
                <CardHeader className="p-4">
                    <CardTitle className="text-sm font-bold text-gray-800 line-clamp-2">
                        {product.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    {product.description && (
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    )}
                    <div className="mt-auto">
                        {price && (
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                                {price.toLocaleString("vi-VN")} ₫
                            </p>
                        )}
                        <Button className="w-full bg-black text-white">View Details</Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};