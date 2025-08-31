import {useEffect, useState} from 'react'
import {Link, useLocation} from "react-router-dom";
import HandleProducts from "../api/HandleProducts";

import {AiOutlineUser} from "react-icons/ai";
import {BsCart3} from "react-icons/bs";

import ButtonInputSearch from "./ButtonInputSearch";
import {useCookies} from "react-cookie";
import jwt_decode from "jwt-decode"
import {Collection} from "../models/Collections.ts";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";

export default function Header() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [user, setUser] = useState('')
    const [type, setType] = useState('')
    const [cookies, , removeCookie] = useCookies(['AuthToken'])
    const authToken = cookies.AuthToken

    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

    const location = useLocation(); // lấy đường dẫn hiện tại để check active

    useEffect(() => {
        getUser()
        getCollections()
    }, [])

    const getUser = async () => {
        try {
            const decode_token_user = jwt_decode(authToken)
            // @ts-ignore
            setUser(decode_token_user.firstName || "")
            // @ts-ignore
            setType(decode_token_user.userType || "")
        } catch (error) {
            console.log(error)
        }
    }

    const getCollections = async () => {
        const api = `/collections`
        try {
            const res: any = await HandleProducts.getProducts(api)
            if (res) {
                setCollections(res)
            }
        } catch (error) {
            console.log(`Product not found: ${error}`)
        }
    }

    const lastCollection = collections.length > 0 ? collections[collections.length - 1] : null;

    function Logout() {
        removeCookie('AuthToken', cookies.AuthToken)
        window.location.reload()
    }

    return (
        <div>
            {/* HEADER */}
            <header className="h-20">
                <div className="verify-supp-color navbar flex h-20 flex-grow fixed left-0 right-0 top-0 z-10">
                    <div className="basis-1/4 justify-center">
                        <Link to="/" className="btn btn-ghost text-xl text-white">VerifySupp</Link>
                    </div>

                    <div className="basis-1/2 ">
                        <ButtonInputSearch placeholder="Search"/>
                    </div>

                    <div className="basis-1/4 justify-center">
                        {!authToken ? (
                            <Link to="/login">
                                <button className="btn btn-ghost text-white">
                                    <AiOutlineUser/> Login
                                </button>
                            </Link>
                        ) : (
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost text-white">
                                    {user}
                                </label>
                                <ul tabIndex={0}
                                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                    <li>
                                        <Link to='/user/profile'>Profile</Link>
                                    </li>
                                    <li onClick={Logout}><a>Logout</a></li>
                                </ul>
                            </div>
                        )}
                        <Link to="/cart">
                            <button className="btn btn-ghost text-white relative">
                                <BsCart3/>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
                                      {cartCount}
                                    </span>
                                )}
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* MENU COLLECTIONS */}
            <menu >
                <div className="navbar bg-white border-b">
                    <div className="hidden lg:flex mx-auto">
                        <ul className="flex space-x-5 px-1">
                            {collections.length > 0 && collections.slice(0, collections.length - 1).map(collec => {
                                const active = location.pathname.includes(`/collections/${collec.name}`)
                                return (
                                    <Link to={`/collections/${collec.name}`} key={collec.name}>
                                        <div
                                            className={`px-4 py-2 text-lg cursor-pointer 
                                            ${active ? "text-sky-900 border-b-4" : "text-gray-700 hover:text-sky-900"}`}
                                            style={active ? { borderBottomColor: "rgb(13, 145, 5)" } : {}}
                                        >
                                            {collec.name}
                                        </div>

                                    </Link>
                                )
                            })}

                            {lastCollection && (
                                <Link to={`/collections/${lastCollection.name}`}>
                                    <div
                                        className={`px-4 py-2 text-lg cursor-pointer 
                                            ${location.pathname.includes(`/collections/${lastCollection.name}`)
                                            ? "text-sky-900 border-b-4 border-verify-supp-color"
                                            : "bg-red-600 text-white rounded-md"}`}>
                                        {lastCollection.name}
                                    </div>
                                </Link>
                            )}
                        </ul>
                    </div>
                </div>
            </menu>
        </div>
    );
}
