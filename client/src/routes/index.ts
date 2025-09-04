import Home from "../page/Home";
import Login from "../page/sign/Login";
import SignUp from "../page/sign/SignUp";
import ProductInforPage from "../page/products/info.product";
import PageProduct from "../page/products/page.product";

import NotFoundPage from "../page/NotFoundPage";
import CartPage from "../page/Cart";
import ProductsPage from "../page/admin/ProductsPage.tsx";
import DashboardPage from "../page/admin/DashboardPage.tsx";

import UsersPage from "../page/admin/UsersPage.tsx";
import CollectionsPage from "../page/admin/CollectionsPage.tsx";
import SearchPage from "../components/SearchPage.tsx";

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
        path: '/search',
        page: SearchPage,
        isShowHeader: true
    },
    {
        path: '/admin/products',
        page: ProductsPage,
        isShowHeader: false
    },

    {
        path: '/admin',
        page: DashboardPage,
        isShowHeader: false
    },
    {
        path: '/admin/collections',
        page: CollectionsPage,
        isShowHeader: false
    },

    {
        path: '/admin/users',
        page: UsersPage,
        isShowHeader: false
    },

    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },


]