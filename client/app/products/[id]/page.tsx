import {ProductDetail} from "@/components/product-detail";

export default async function ProductPage({
                                              params
                                          }: {
    params: Promise<{ id: string }>
}) {
    const {id} = await params;
    const data = await fetch(process.env.BACKEND_URL + `/products/${id}`);
    const products = await data.json()


    return <ProductDetail product={products} />
}