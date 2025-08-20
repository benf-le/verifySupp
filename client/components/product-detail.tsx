import {Product} from "@/type/product";
import Image from "next/image";

interface Props {
    product: Product
}

export const ProductDetail = ({product}: Props) => {

    const price = product.price;

    return <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
        {product.imageUrl && product.imageUrl[0] && (
            <div className="relative h-96 w-full md:w-1/2 rounded-lg overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{
                        objectFit: "contain"
                    }}
                    className="group-hover:opacity-90 transition duration-300"
                />
            </div>
        )}

        <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            {product.description && (
                <p className="text-gray-700 mb-4">{product.description}</p>
            )}

            {price && (
                <p className="text-lg font-semibold text-gray-900 mb-2">
                    {price.toLocaleString("vi-VN")} ₫
                </p>
            )}
        </div>
    </div>

}