"use client";

import Image from "next/image";
import {Product} from "@/type/product";
import {useEffect, useState} from "react";
// import {clearInterval} from "node:timers";
import {Card, CardContent, CardTitle} from "@/components/ui/card";

interface CarouselProps {
    products: Product[]
}
export const Carousel=({products}:CarouselProps)=>{

    const [current, setCurrent] = useState<number>(0);

    useEffect(()=>{
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % products.length);
        },3000)

        return () => clearInterval(interval)
    },[products.length])

    const currentProduct = products[current];

    const prices = currentProduct.price;

    // console.log(currentProduct)
    return (
        <Card className="relative overflow-hidden rounded-lg shadow-md border-gray-300">
            {currentProduct.imageUrl  && (
                <div className="relative h-80 w-full">
                    <Image
                        src={currentProduct.imageUrl}
                        alt={currentProduct.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-opacity duration-500 ease-in-out"
                    />
                </div>
            )}
            <CardContent className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                    {currentProduct.name}
                </CardTitle>
                {prices  && (
                    <p className="text-xl text-white">
                        <p>{prices.toLocaleString("vi-VN")} ₫</p>

                    </p>
                )}
            </CardContent>
        </Card>
    );
}