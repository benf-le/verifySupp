import {ProductList} from "@/components/product-list";

export default async function ProductsPage() {
    const data = await fetch(process.env.BACKEND_URL + `/products`);
    const products = await data.json()

    return (
        <div className="pb-8">
            <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground text-center mb-8">
                All Products
            </h1>
            <ProductList products={products} />
        </div>
    );
}