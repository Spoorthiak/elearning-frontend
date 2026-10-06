import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    if (
        !token ||
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {
        return null;
    }

    return (
        <nav className="navbar">

            <div className="navbar-container">

                <Link to={
                    role === "ROLE_STUDENT"
                        ? "/student-dashboard"
                        : role === "ROLE_TRAINER"
                            ? "/trainer-dashboard"
                            : "/admin-dashboard"
                } className="navbar-logo">
                    🎓 E-Learning
                </Link>

                <div className="navbar-links">

                    {role === "ROLE_STUDENT" && (
                        <>
                            <Link to="/student-dashboard">
                                🏠 Dashboard
                            </Link>

                            <Link to="/courses">
                                📚 Courses
                            </Link>

                            <Link to="/my-enrollments">
                                🎓 My Enrollments
                            </Link>
                        </>
                    )}

                    {role === "ROLE_TRAINER" && (
                        <Link to="/trainer-dashboard">
                            🏠 Dashboard
                        </Link>
                    )}

                    {role === "ROLE_ADMIN" && (
                        <Link to="/admin-dashboard">
                            🏠 Dashboard
                        </Link>
                    )}

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;