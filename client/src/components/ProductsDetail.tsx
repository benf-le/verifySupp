// import {Link, useParams, useRoutes} from "react-router-dom";
// import {useEffect, useState} from 'react'
//
//
// export default function ProductsDetail() {
//
//     const [productDetail, setProductDetail] = useState(null)
//     const id = useParams().id;
//
//     // console.log(id)
//
//     useEffect(() => {
//         const getProductsDetail = async () => {
//             const api = `/products/${id}`
//
//             fetch(`http://localhost:7000` + api)
//                 .then(response => {
//                     response.json()
//                         .then(data => setProductDetail(data))
//                         .catch(error => console.log(error))
//                 })
//
//
//         }
//         getProductsDetail()
//     }, [])
//
//
//     console.log(productDetail)
//
//     return (
//         <div>
//
//
//             <div className="flex w-full flex-nowrap justify-center">
//                 {productDetail &&(
//                     <Link to={`/products/${productDetail.id}`}>hi
//                     </Link>
//                 )}
//             </div>
//
//         </div>
//     )
// }
//
//
//
//
