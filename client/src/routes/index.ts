import Home from "../page/Home";
import Login from "../page/sign/Login";
import SignUp from "../page/sign/SignUp";
import ProductInforPage from "../page/products/info.product";
import PageProduct from "../page/products/page.product";

import NotFoundPage from "../page/NotFoundPage";
import CartPage from "../page/Cart";
import AdminPage from "../page/admin/AdminPage";
import DashboardPage from "../page/pages/admin/DashboardPage.tsx";
import CollectionsPage from "../page/pages/admin/CollectionsPage.tsx";
import UsersPage from "../page/pages/admin/UsersPage.tsx";

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
        path: '/user/admin/products',
        page: AdminPage,
        isShowHeader: false
    },

    {
        path: '/user/admin/dashboard',
        page: DashboardPage,
        isShowHeader: false
    },
    {
        path: '/user/admin/collections',
        page: CollectionsPage,
        isShowHeader: false
    },

    {
        path: '/user/admin/users',
        page: UsersPage,
        isShowHeader: false
    },

    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },


]