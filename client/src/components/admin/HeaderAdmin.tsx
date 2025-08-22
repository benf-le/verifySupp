import  {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import jwt_decode from "jwt-decode";

function HeaderAdmin() {
    // @ts-ignore
    const [cookies, setCookie, removeCookie] = useCookies(['AuthToken'])
    const [user, setUser] = useState('')


    const authToken = cookies.AuthToken


    const navigate = useNavigate()
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


        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getUser()

    }, [])

    function Logout() {

        removeCookie('AuthToken', cookies.AuthToken)
        if (!removeCookie) {
        } else {
            navigate('/')
        }
        window.location.reload() //nen sua cho nay de load lai trang chu
    }

    return (
        <div>
            <nav>
                <div className="navbar bg-base-100 ">
                    <div className="flex-1">
                        <Link to="/user/admin/dashboard"> <a className="btn btn-ghost normal-case text-xl">Dashboard</a> </Link>
                    </div>

                    <div className="flex-none gap-2">

                        {/*<div className="dropdown dropdown-end">*/}
                        {/*    <label tabIndex={0} className="btn btn-ghost text-black">*/}
                        {/*        /!*<div className="w-10 rounded-full">*!/*/}
                        {/*        /!*    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg"/>*!/*/}
                        {/*        /!*</div>*!/*/}
                        {/*        {user}*/}
                        {/*    </label>*/}
                        {/*    <ul tabIndex={0}*/}
                        {/*        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">*/}
                        {/*        <li>*/}
                        {/*            <Link to='/user/profile'>*/}
                        {/*                <a className="justify-between">*/}
                        {/*                    Profile*/}
                        {/*                </a></Link>*/}
                        {/*        </li>*/}

                        {/*        <li onClick={Logout}><a>Logout</a></li>*/}
                        {/*    </ul>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default HeaderAdmin;