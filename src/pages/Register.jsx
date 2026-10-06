import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/register",
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

            const data = await response.text();

            if (!response.ok) {
                throw new Error(
                    data || "Registration failed"
                );
            }

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            alert(error.message);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-icon">
                    🎓
                </div>

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Start your learning journey
                </p>

                <form onSubmit={handleRegister}>

                    <div className="auth-form-group">

                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Choose a username"
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
                                placeholder="Create a password"
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
                        Register
                    </button>

                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <p className="auth-bottom-text">
                    Already have an account?
                </p>

                <button
                    className="auth-outline-btn"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </button>

            </div>

        </div>
    );
}

export default Register;