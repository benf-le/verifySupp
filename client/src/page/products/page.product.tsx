
import MenuCollection from "../../components/Product/MenuCollection";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ProductsCard from "../../components/Product/ProductsCard";


export default function PageProduct(){

    const [productPage, setProductPage] = useState(null)
    const id = useParams().id;

    // console.log(id)

    useEffect(() => {
        const getProductsDetail = async () => {
            const api = `/collections/${id}`

            fetch(`http://localhost:7000` + api)
                .then(response => {
                    response.json()
                        .then(data => setProductPage(data))
                        .catch(error => console.log(error))
                })


        }
        getProductsDetail()
    }, [])


    console.log(productPage)

    return (
        <div>

             <div className="px-20">
                <div className="pet-stock-text-color py-10 text-5xl font-semibold uppercase ">
                    {id}
                </div>


                <main className="flex flex-row ">
                    <div className="basis-1/4">
                        <MenuCollection/>
                    </div>
                    <div className=" basis-3/4 grid ">

                        <ProductsCard/>

                    </div>
                </main>

            </div>

        </div>
    );
}