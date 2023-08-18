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

                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Job</th>
                                <th>Favorite Color</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>1</th>
                                <td>Cy Ganderton</td>
                                <td>Quality Control Specialist</td>
                                <td>Blue</td>
                            </tr>
                            {/* row 2 */}
                            <tr>
                                <th>2</th>
                                <td>Hart Hagerty</td>
                                <td>Desktop Support Technician</td>
                                <td>Purple</td>
                            </tr>
                            {/* row 3 */}
                            <tr>
                                <th>3</th>
                                <td>Brice Swyre</td>
                                <td>Tax Accountant</td>
                                <td>Red</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>



                </right>
            </main>
        </div>
    );
}

export default AdminPage;