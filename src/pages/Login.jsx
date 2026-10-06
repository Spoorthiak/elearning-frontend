import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import "./Auth.css";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Invalid username or password");
            }

            const token = await response.text();

            // Store JWT
            localStorage.setItem("token", token);

            // Decode JWT
            const decodedToken = jwtDecode(token);

            // Get role
            const role = decodedToken.role;

            // Store role
            localStorage.setItem("role", role);

            console.log("JWT Token:", token);
            console.log("User Role:", role);

            alert("Login successful!");

            // Redirect based on role
            if (role === "ROLE_STUDENT") {
                navigate("/student-dashboard");
            } else if (role === "ROLE_TRAINER") {
                navigate("/trainer-dashboard");
            } else if (role === "ROLE_ADMIN") {
                navigate("/admin-dashboard");
            }

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    🎓
                </div>

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to continue learning
                </p>

                <form onSubmit={handleLogin}>

                    <div className="auth-form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="auth-form-group">

                        <label>Password</label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit-btn"
                    >
                        Login
                    </button>

                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <p className="auth-bottom-text">
                    Don't have an account?
                </p>

                <button
                    className="auth-outline-btn"
                    onClick={() => navigate("/register")}
                >
                    Create Account
                </button>

            </div>

        </div>
    );
}

export default Login;