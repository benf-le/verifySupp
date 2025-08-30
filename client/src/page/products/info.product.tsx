
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import OptionNearYou from "../../components/Product/OptionNearYou";
import {BASE_URL} from "../../constant/appInfo.ts";


export default function ProductInforPage() {

    const [productDetail, setProductDetail] = useState(null)
    const [deliverOne, setDeliverOne] = useState(false)
    const [autoShip, setAutoShip] = useState(false)
    let [qty, setQty] = useState(1)
    // const [cart, setCart] = useState(null)

    const id = useParams().id;

    // console.log(id)

    useEffect(() => {
        const getProductsDetail = async () => {
            const api = `/products/${id}`

            fetch(BASE_URL+ api)
                .then(response => {
                    response.json()
                        .then(data => setProductDetail(data))
                        .catch(error => console.log(error))
                })
            window.scrollTo(0, 0);

        }
        getProductsDetail()
    }, [])


    useEffect(() => {
        if (deliverOne) {
            setAutoShip(false);
        }
        if (autoShip) {
            setDeliverOne(false);
        }
    }, [deliverOne, autoShip]);


    const addToCartHandler = () => {
        const cart = JSON.parse(sessionStorage.getItem("shoppingCart") as string) || [];
        const product = {
            name: productDetail.name,
            imageUrl: productDetail.imageUrl,
            price: productDetail.price,
            type: productDetail.type,
            qty: qty,
        };



        if (cart.find(item => item.name === product.name)) {
            cart[cart.findIndex(item => item.name === product.name)].qty += product.qty;
        } else {
            cart.push(product);
        }

        sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
    };








    return (
        <div>

            {productDetail && (
                <div className="px-20">
                    <div className="pet-stock-text-color py-10 text-4xl font-semibold">
                        {productDetail.name}
                    </div>


                    <main className="flex flex-row ">
                        <div className="basis-1/4 border border-slate-200 rounded ">
                            <figure className="py-3 ">
                                <img src={productDetail.imageUrl} alt="Shoes"/>
                            </figure>
                        </div>
                        <div className=" basis-2/4 grid border border-slate-200 rounded mx-8 px-5 h-44  ">
                            <div className="h-16  ">
                                <p className="py-4 font-medium ">
                                    Select Size:
                                    <div
                                        className="btn btn-ghost border-2 pet-stock-border-color ml-5 px-8 ">
                                        {productDetail.type}
                                    </div></p>
                                <hr/>

                                <div className="grid grid-cols-2 h-16 mt-4 grid-cols-3 gap-x-4">
                                    <div
                                        className="border-2 border-slate-200 rounded flex flex-1  items-center h-full ">
                                        {/*minus icon*/}
                                        <div className="flex flex-1 justify-center items-center cursor-pointer">
                                            <IoMdRemove onClick={() => {
                                                setQty((prev) => (prev === 1 ? 1 : prev - 1))
                                            }}/>
                                        </div>
                                        {/*amount*/}
                                        <div className="h-full flex  justify-center items-center px-2">
                                            {qty}
                                        </div>
                                        {/*plus icon*/}
                                        <div className="flex flex-1 justify-center items-center cursor-pointer">
                                            <IoMdAdd onClick={() => {
                                                setQty((prev) => prev + 1)
                                            }}/>
                                        </div>
                                    </div>


                                    <button
                                        className="btn btn-neutral h-16 border-2 border-slate-200 rounded col-span-2 pet-stock-color text-white"
                                        onClick={addToCartHandler}>
                                        ADD TO CART
                                    </button>


                                </div>
                            </div>


                        </div>
                        <div className="basis-1/4">
                            <OptionNearYou/>
                        </div>
                    </main>

                    <div className="mt-16 flex flex-row bg-zinc-200 border rounded pb-16 mb-20">
                        <div className="basis-1/3">
                            <p className="pet-stock-text-color py-10 text-2xl font-semibold text-center">Description</p>
                            <p className="text-center px-16">{productDetail.description}</p>
                        </div>

                        <div className="basis-1/3">
                            <p className="pet-stock-text-color py-10 text-2xl font-semibold text-center">Ingredients</p>
                            <p className="text-center px-16">{productDetail.ingredient}</p>
                        </div>
                        <div className="basis-1/3">
                            <p className="pet-stock-text-color py-10 text-2xl font-semibold text-center">Reviews</p>
                            <p className="text-center px-16">{productDetail.reviews}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )

}