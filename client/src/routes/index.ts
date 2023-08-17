import Home from "../page/Home";
import Login from "../page/sign/Login";
import SignUp from "../page/sign/SignUp";
import ProductInforPage from "../page/products/info.product";
import PageProduct from "../page/products/page.product";

import NotFoundPage from "../page/NotFoundPage";
import CartPage from "../page/Cart";
import AdminPage from "../page/admin/AdminPage";

export const routes = [
    {
        path: '/',
        page: Home,
        isShowHeader: true
    },
    {
        path: '/login',
        page: Login,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUp,
        isShowHeader: true
    },
    {
        path: '/products/:id',
        page: ProductInforPage,
        isShowHeader: true
    },
    {
        path: '/collections/:id',
        page: PageProduct,
        isShowHeader: true
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true
    },
    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },

]