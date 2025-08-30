import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import jwt_decode from "jwt-decode";
import {BASE_URL} from "../../constant/appInfo.ts";



const Login = () => {
    const navigate = useNavigate()


    const [user, setUser] = React.useState({
        email: '',
        password: ''
    })
    //
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    const [error, setError] = React.useState('')
    // @ts-ignore
    const [cookies, setCookie, removeCookie] = useCookies([ 'AuthToken'])
    const [typee, setType] = useState('')



    //   const [buttonDisabled, setButtonDisabled]= React.useState(false)
    //
    useEffect(() => {
        if (typee === 'USER') navigate('/');
        if (typee === 'ADMIN') navigate('/admin');
    }, [typee, navigate]);


    const onLogin = async (e) =>  {
        e.preventDefault() //chặn reload trang
        try {
            const response = await axios.post(BASE_URL+`/login`, user)



            const success = response.status === 201
            if (success) {
                // Đăng ký thành công

                // setCookie
                // setCookie('UserId',response.data.UserId)
                setCookie('AuthToken',response.data.access_token)


                const decode_token_user = jwt_decode(response.data.access_token)


                // @ts-ignore
                const user__type = decode_token_user.userType

                // setUser(ten)
                setType(user__type)



                // window.location.reload(); // Tùy chỉnh theo nhu cầu của bạn
            } else {
                // Xử lý lỗi không rõ ràng từ backend
                setError('Something went wrong. Please try again later.');
            }


        } catch (error) {
            // Xử lý lỗi từ API NestJS
            if (error.response) {
                setError(error.response.data.message); // Lấy thông báo lỗi từ phản hồi API
            } else {
                setError('Something went wrong. Please try again later.'); // Lỗi không rõ ràng không có phản hồi từ API
            }
        }
    }



    //
    //   React.useEffect(()=>{
    //     if(user.email.length>0 && user.password.length>0){
    //         setButtonDisabled(false)
    //     } else {
    //         setButtonDisabled(true)
    //     }
    // },[user])


    return (
        <div>
            <div className=" pet-stock-color hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex">
                    <div className="text-center text-white lg:text-left">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        {/*<p className="py-6">*/}
                        {/*    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda*/}
                        {/*    excepturi exercitationem quasi. In deleniti eaque aut repudiandae*/}
                        {/*    et a id nisi.*/}
                        {/*</p>*/}
                    </div>
                    <div className="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl w-screen">
                        <div className="card-body">
                            <form>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        // value={user.email}
                                        // value={email}
                                        required={true}
                                        className="input input-bordered"
                                        // onChange={(e) => setEmail(e.target.value)}
                                        onChange={(e) => setUser({...user, email: e.target.value})}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={user.password}
                                        // value={password}
                                        placeholder="Password"
                                        className="input input-bordered"
                                        // onChange={(e) => setPassword(e.target.value)}
                                        onChange={(e) => setUser({...user, password: e.target.value})}
                                    />
                                    <label className="label">
                                        <a href="client/src/page#" className="link-hover link label-text-alt">
                                            Forgot password?
                                        </a>
                                    </label>
                                </div>
                            </form>
                            <p className="text-center text-red-500 font-semibold">{error}</p>

                            <div className="form-control mt-6">
                                <button onClick={onLogin} className="btn btn-primary">Login</button>
                            </div>


                            <p className="mt-10 text-center ">Don't have an account?</p>
                            <Link to="/sign-up">
                                <div className="form-control ">
                                    <button className="btn btn-success">Sign Up</button>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
