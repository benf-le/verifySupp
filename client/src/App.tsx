import  {Fragment} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {routes} from "./routes";

import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import ProtectedRoute from "./components/admin/ProtectedRoute.tsx";
import {Provider} from "react-redux";
import {store} from "./redux/store.ts";



 function App() {

    return (
        <div>
        <Provider store={store}>

            <Router>

                <Routes>
                    {routes.map((route, index) => {
                        const Page = route.page
                        const Layout = route.isShowHeader ? DefaultComponent : Fragment

                        // Nếu path bắt đầu bằng /admin thì bọc ProtectedRoute
                        if (route.path.startsWith("/admin") || route.path.startsWith("/user/admin")) {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <Page />
                                        </ProtectedRoute>
                                    }
                                />
                            );
                        }
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


        </Provider>
        </div>
    )
}
export default App
