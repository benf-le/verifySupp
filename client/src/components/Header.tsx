import  {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import HandleProducts from "../api/HandleProducts";

import { AiOutlineUser} from "react-icons/ai";
import {BsCart3} from "react-icons/bs";

import ButtonInputSearch from "./ButtonInputSearch";
import {useCookies} from "react-cookie";
import jwt_decode from "jwt-decode"
import {Collection} from "../models/Collections.ts";

export default function Header() {
    const [collections, setCollections] = useState<Collection[]>([]) //Products co dang array
    // const [open, setOpen] = useState(false)

    const [user, setUser] = useState('')
    // @ts-ignore
    const [type, setType] = useState('')

    // @ts-ignore
    const [cookies, setCookie, removeCookie] = useCookies(['AuthToken'])

    const authToken = cookies.AuthToken
    console.log(authToken)


    // const navigate = useNavigate()
    const getUser = async () => {
        try {

            const decode_token_user = jwt_decode(authToken)

            // console.log(decode_token_user)
            // @ts-ignore
            const ten = decode_token_user.firstName
            // @ts-ignore
            const user__type = decode_token_user.userType
            // console.log(user__type)
            setUser(ten)
            setType(user__type)


        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getUser()
        getCollections()
    }, [])

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

    //lấy ra phần tử cuối cùng trong mảng
    const lastCollection = collections.length > 0 ? collections[collections.length - 1] : null;

    function Logout() {

        removeCookie('AuthToken', cookies.AuthToken)
        window.location.reload() //nen sua cho nay de load lai trang chu
    }


    return (

        <div>

            <div>

                <header className="h-20">
                    <div
                        className=" verify-supp-color navbar  flex h-20 flex-grow bg-base-100 fixed left-0 right-0 top-0 z-10">

                        <div className="basis-1/4 justify-center">
                            <Link to="/" className="btn btn-ghost text-xl text-white">VerifySupp</Link>
                        </div>


                        <div className="basis-1/2 ">
                            <ButtonInputSearch
                                placeholder="Search"
                            />

                        </div>
                        <div className="basis-1/4 justify-center">
                            {!authToken ?
                                <Link to="/login">
                                    <button className="btn btn-ghost text-white">
                                        <AiOutlineUser/>
                                        Login
                                    </button>
                                </Link> :

                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost text-white">
                                        {/*<div className="w-10 rounded-full">*/}
                                        {/*    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg"/>*/}
                                        {/*</div>*/}
                                        {user}
                                    </label>
                                    <ul tabIndex={0}
                                        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                        <li>
                                            <Link to='/user/profile'>
                                                <a className="justify-between">
                                                    Profile
                                                </a></Link>
                                        </li>
                                        {/*<li><a>Settings</a></li>*/}
                                        <li onClick={Logout}><a>Logout</a></li>
                                    </ul>
                                </div>
                            }
                            <Link to="/cart">
                                <button className="btn btn-ghost text-white">
                                    <BsCart3/>
                                </button>
                            </Link>
                        </div>
                    </div>
                </header>
                {/*<menu className="verify-supp-color navbar flex h-20 flex-grow justify-center bg-base-100">*/}
                {/*  <div className="join space-x-10">*/}
                {/*    <button className="btn btn-ghost text-white">Dog</button>*/}
                {/*    <button className="btn btn-ghost text-white">Cat</button>*/}
                {/*    <button className="btn btn-ghost text-white">Fish</button>*/}
                {/*    <button className="btn btn-ghost text-white">Horse</button>*/}
                {/*    <button className="btn btn-ghost text-white">Bird</button>*/}
                {/*    <button className="btn btn-ghost text-white">Small Animal</button>*/}
                {/*    <button className="btn btn-ghost text-white">Reptile</button>*/}
                {/*    <button className="btn btn-ghost text-white">Pet Service</button>*/}
                {/*    <button className="btn btn-ghost text-white">More</button>*/}
                {/*    <button className="btn btn-ghost bg-red-600 text-white">Sale</button>*/}
                {/*  </div>*/}
                {/*</menu>*/}

                <menu>
                    <div className=" verify-supp-color navbar bg-base-100  ">
                        <div className="">
                            <div className="dropdown">
                                <label tabIndex={0} className="btn  lg:hidden">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h8m-8 6h16"
                                        />
                                    </svg>
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
                                >
                                    <li>
                                        <a>Item 1</a>
                                    </li>
                                    <li>
                                        <a>Parent</a>
                                        <ul className="p-2">
                                            <li>
                                                <a>Submenu 1</a>
                                            </li>
                                            <li>
                                                <a>Submenu 2</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a>Item 3</a>
                                    </li>
                                </ul>
                            </div>
                        </div>


                        <div className="navbar flex hidden h-8 flex-grow justify-center lg:flex m-0">
                            <ul className="verify-supp-color menu menu-horizontal space-x-5 px-1">
                                {collections.length > 0 && collections.slice(0, collections.length - 1).map(collec =>
                                    <Link to={`/collections/${collec.name}`}>
                                        <div className="dropdown dropdown-hover">
                                            <label tabIndex={0}
                                                   className="btn m-1 text-white verify-supp-color border-none hover:text-sky-900 text-lg">
                                                {collec.name}
                                            </label>
                                            {/*<ul tabIndex={0}*/}
                                            {/*    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">*/}
                                            {/*    <li><a>Item 1</a></li>*/}
                                            {/*    <li><a>Item 2</a></li>*/}
                                            {/*</ul>*/}
                                        </div>
                                    </Link>
                                )}


                                <button className="btn btn-ghost bg-red-600 text-white">

                                    <Link to={`/collections/${lastCollection?.name}`}>
                                        {lastCollection?.name}
                                    </Link>
                                </button>
                            </ul>
                        </div>
                    </div>
                </menu>


            </div>


        </div>
    );

}
