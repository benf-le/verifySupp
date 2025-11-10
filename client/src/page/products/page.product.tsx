
import MenuCollection from "../../components/Product/MenuCollection";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import ProductsCard from "../../components/Product/ProductsCard";
import {BASE_URL} from "../../constant/appInfo.ts";
import {Collection} from "../../models/Collections.ts";


export default function PageProduct(){

    const [collection, setCollection] = useState<Collection | null>(null);
    const { id } = useParams();

    useEffect(() => {
        const getCollectionDetail = async () => {
            try {
                const api = `/collections/${id}`;
                const res = await fetch(BASE_URL + api);
                const data = await res.json();
                setCollection(data); // lưu full object collection
            } catch (error) {
                console.log("Error fetching collection:", error);
            }
            window.scrollTo(0, 0);
        };
        getCollectionDetail();
    }, [id]); // chạy lại khi đổi collectionId

    return (
        <div>

             <div className="px-20">
                <div className="pet-stock-text-color py-10 text-5xl font-semibold uppercase ">
                    {collection ? collection.name : "Loading..."}
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