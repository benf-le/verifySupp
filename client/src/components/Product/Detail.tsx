import  {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {BASE_URL} from "../../constant/appInfo.ts";

function Detail() {
    // @ts-ignore
    const [productDetail, setProductDetail] = useState(null)
    const id = useParams().id;
    useEffect(() => {
        const getProductsDetail = async () => {
            const api = `/products/${id}`

            fetch(BASE_URL+ api)
                .then(response => {
                    response.json()
                        .then(data => setProductDetail(data))
                        .catch(error => console.log(error))
                })


        }
        getProductsDetail()
    }, [])




    return (
        <div></div>

    );
}

export default Detail;