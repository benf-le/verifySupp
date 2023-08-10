import React, {Fragment} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {routes} from "./routes";

import DefaultComponent from "./components/DefaultComponent/DefaultComponent";


 function App() {

    return (
        <div>

            <Router>

                <Routes>
                    {routes.map((route) => {
                        const Page = route.page
                        const Layout = route.isShowHeader ? DefaultComponent : Fragment
                        return (
                            <Route key={route.path} path={route.path} element={
                                <Layout>
                                    <Page />
                                </Layout>
                            } />
                        )
                    })}
                </Routes>
            </Router>


        </div>
    )
}
export default App
//
// import logo from './logo.svg';
//
// import {BrowserRouter, Routes, Route} from 'react-router-dom'
// import Home from "./page/Home";
// import Login from "./page/sign/Login";
// import SignUp from "./page/sign/SignUp";
// import PageProduct from "./page/products/page.product";
// import ProductInforPage from "./page/products/info.product";
// import Footer from "./components/Footer";
// import Header from "./components/Header";
// import Cart from "./components/Cart";
// function App() {
//     return (
//         <BrowserRouter>
//             <Header/>
//             <Routes>
//                 <Route path="/" element={<Home/>}/>
//                 <Route path="/login" element={<Login/>}/>
//                 <Route path="/sign-up" element={<SignUp/>}/>
//                 <Route path="/products/:id" element={<ProductInforPage />} />
//                 <Route path="/collections/:id" element={<PageProduct />} />
//                 <Route path="/cart" element={<Cart />} />
//
//             </Routes>
//
//             <Footer/>
//
//         </BrowserRouter>
//     );
// }
//
// export default App;
