import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

interface ProtectedRouteProps {
    children: JSX.Element;
    requireAdmin?: boolean; // tuỳ bạn có muốn check role hay không
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const [cookies] = useCookies(["AuthToken"]);
    const token = cookies.AuthToken;

    if (!token) {
        // chưa login thì redirect sang login
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded: any = jwt_decode(token);
        if (requireAdmin && decoded.userType !== "ADMIN") {
            // nếu cần quyền ADMIN mà không phải admin → redirect home
            return <Navigate to="/" replace />;
        }
    } catch (e) {
        // token lỗi/không decode được
        return <Navigate to="/login" replace />;
    }

    // ok, cho vào
    return children;
};

export default ProtectedRoute;
