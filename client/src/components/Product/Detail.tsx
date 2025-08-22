import  {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

function Detail() {
    // @ts-ignore
    const [productDetail, setProductDetail] = useState(null)
    const id = useParams().id;
    useEffect(() => {
        const getProductsDetail = async () => {
            const api = `/products/${id}`

            fetch(`http://localhost:7000` + api)
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