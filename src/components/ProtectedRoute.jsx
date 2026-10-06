import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // No token
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {

        const decodedToken = jwtDecode(token);

        // Check token expiry
        if (decodedToken.exp * 1000 < Date.now()) {

            localStorage.removeItem("token");
            localStorage.removeItem("role");

            return <Navigate to="/login" replace />;
        }

        // Check role
        if (allowedRole && role !== allowedRole) {
            return <Navigate to="/login" replace />;
        }

        return children;

    } catch (error) {

        console.error("Invalid JWT token:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;