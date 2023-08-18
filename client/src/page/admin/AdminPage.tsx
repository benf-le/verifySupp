import React, {useEffect, useState} from 'react';

import {Link, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import jwt_decode from "jwt-decode";
import HeaderAdmin from "../../components/admin/HeaderAdmin";

function AdminPage() {


    const [productsAdmin, setProductsAdmin] = useState([]);
    const [usersAdmin, setUsersAdmin] = useState([]);

    const handleProductsClick = () => {

    };

    useEffect(() => {
        const getProductsDetail = async () => {
            const api = `/products`

            fetch(`http://localhost:7000` + api)
                .then(response => {
                    response.json()
                        .then(data => setProductsAdmin(data))
                        .catch(error => console.log(error))
                })


        }
        getProductsDetail()
    }, [])


    return (
        <div>
            <HeaderAdmin/>

            <main className="flex flex-row h-screen">

                {/*<left className="basis-1/5 bg-zinc-200">*/}
                {/*    <div className="py-5">*/}
                {/*        <a className="btn btn-ghost normal-case text-xl w-full" onClick={handleProductsClick}>Products</a>*/}
                {/*    </div>*/}
                {/*    <div className="py-5">*/}
                {/*        <a className="btn btn-ghost normal-case text-xl w-full" onClick={handleProductsClick}>Users</a>*/}
                {/*    </div>*/}
                {/*</left>*/}

                <right className={`basis-full px-10`}>
                    <div className=" flex flex-row-reverse ">
                        <div className="btn btn-error normal-case text-sm m-1">
                         Delete  </div>
                        <div className="btn btn-warning normal-case text-sm m-1">
                          Edit </div>
                        <div className="btn btn-active btn-accent normal-case text-sm m-1">
                         Add  </div>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Image Url</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>For Sale</th>
                                <th>Count In Stock</th>
                                <th>Description</th>
                                <th>Ingredient</th>
                                <th>Reviews</th>

                            </tr>
                            </thead>
                            <tbody>
                            {/* row 1 */}
                            {productsAdmin.length > 0 && productsAdmin.map(item =>
                                <tr>
                                    <th></th>
                                    <td>{item.name}</td>
                                    <td>{item.imageUrl}</td>
                                    <td>{item.type}</td>
                                    <td>{item.price}</td>
                                    <td>{item.forSale.toString()}</td>
                                    <td>{item.countInStock}</td>
                                    <td>{item.description}</td>
                                    <td>{item.ingredient}</td>
                                    <td>{item.reviews}</td>


                                </tr>
                            )}


                            </tbody>
                        </table>
                    </div>


                </right>
            </main>
        </div>
    );
}

export default AdminPage;