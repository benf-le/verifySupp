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
import CheckoutPage from "../page/Checkout";
import OrderSuccessPage from "../page/OrderSuccess";
import ViewOrderPage from "../page/ViewOrder";
import MyOrdersPage from "../page/MyOrders";
import OrdersPage from "../page/admin/OrdersPage";
import OrderDetailAdminPage from "../page/admin/OrderDetailAdmin";

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
        path: '/checkout',
        page: CheckoutPage,
        isShowHeader: true
    },
    {
        path: '/order-success/:orderId',
        page: OrderSuccessPage,
        isShowHeader: true
    },
    {
        path: '/orders/:orderId',
        page: ViewOrderPage,
        isShowHeader: true
    },
    {
        path: '/orders', // Thêm route này - phải đặt TRƯỚC /orders/:orderId
        page: MyOrdersPage,
        isShowHeader: true
    },
    {
        path: '/admin/orders',
        page: OrdersPage,
        isShowHeader: true
      },
      {
        path: '/admin/orders/:orderId',
        page: OrderDetailAdminPage,
        isShowHeader: true
      },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false
    },
]