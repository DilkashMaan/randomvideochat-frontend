import React, { useState } from "react";
import "./style/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstance";
import { useAuth } from "./AuthContext";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const ForgotPasswordModal = ({ onBack }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
      

    const handleReset = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await AxiosInstance.post("password-reset/", { email });
            setMessage("Password reset email sent!");
        } catch (err) {
            console.log(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-content" id="forget-password">
            <div className="signup-close">
                <div>
                    <h2>Reset Password</h2>
                </div>
                <button className="close-btn" onClick={onBack}>x</button>
            </div>
            <p>Enter your email to receive a reset link.</p>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
            />
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            <button onClick={handleReset} disabled={loading} className="reset-btn">
                {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button className="secondary-btn reset-btn" onClick={onBack}>
                Back to Login
            </button>
        </div>
    );
};

// Main Login Component
const Login = ({ onClose, switchToSignup }) => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { setIsAuthenticated, setUserId } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState("");


    const priceId = new URLSearchParams(location.search).get("priceId");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.username) newErrors.username = "Username is required";
        if (form.password.length < 6)
            newErrors.password = "Minimum 6 characters required";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {

                const response = await AxiosInstance.post("login/", form);

                const updateData = { ...response.data };
                delete updateData.message;

                console.log("response login----", response);
                localStorage.setItem('currentUser', JSON.stringify(updateData));
                setIsAuthenticated(true);
                setUserId(response.data.user_id);
                setForm({ username: "", password: "" });


                if (priceId) {
                    try {
                        const stripe = await stripePromise;
                        const stripeRes = await AxiosInstance.post("subscribe/", {
                            price_id: priceId,
                        });
                        const sessionId = stripeRes.data.sessionId;
                        const { error } = await stripe.redirectToCheckout({ sessionId });

                        if (error) {
                            console.error("Stripe redirect error:", error.message);
                            navigate("/pricing");
                        }

                        return;
                    } catch (err) {
                        console.error("Stripe redirect failed:", err);
                        navigate("/pricing");
                        return;
                    }
                }


                onClose();
                navigate("/dashboard", { state: { currentUser: response.data } });


            } catch (error) {

                const errorMessage = error?.response?.data?.error;
                console.log("errrrrrrr",errorMessage,error?.response?.data);

                if (errorMessage === "Email not verified. Please verify your account.") {
                    setTimeout(() => {
                        setErrors({ general: errorMessage });
                    }, 4000);
                    

                    try {
                        // ✅ Send OTP to email
                        const resp = await AxiosInstance.post("/send_mail/", { email: form.email });

                        // ✅ Save email in localStorage (for verification page)
                        localStorage.setItem("signup_email", form.email);

                        if (resp.status === 200) {
                            setSuccessMessage("OTP has been sent to your email. Please check your inbox.");
                            localStorage.setItem("signup_email",form.email);
                            setErrors("");
                            // Wait 4 seconds then redirect
                            setTimeout(() => {
                                setSuccessMessage("");
                                navigate("/email"); // ✅ your target page
                            }, 4000); // 4000ms = 4 seconds
                        }



                    } catch (mailError) {
                        console.error("Failed to send OTP email:", mailError);
                    }

                } else {
                    // Other errors
                    setErrors({ general: errorMessage || "Login failed" });
                }

            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="modal-overlay" id="login">
            {showForgotPassword ? (
                <ForgotPasswordModal onBack={() => setShowForgotPassword(false)} />
            ) : (
                <div className="modal-content">
                    <div className="signup-close">
                        <div>
                            <h2>Log In</h2>
                            <p>
                                Don't have an account?{" "}
                                <span onClick={(e) => { e.preventDefault(); switchToSignup(); }}>
                                    Sign up
                                </span>
                            </p>
                        </div>
                        <button className="close-btn" onClick={onClose}>x</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username/Email"
                            value={form.username}
                            onChange={handleChange}
                            className={errors.username ? "input error-border" : "input"}
                        />
                        {errors.username && <p className="error">{errors.username}</p>}

                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className={errors.password ? "input error-border" : "input"}
                            />
                            <img
                                src={
                                    showPassword
                                        ? "home-images/visible.png"
                                        : "home-images/eye.png"
                                }
                                alt="Toggle visibility"
                                className="toggle-password-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        {errors.password && <p className="error">{errors.password}</p>}
                        {errors.general && <p className="error">{errors.general}</p>}
                        {successMessage && <p className="scucess">{successMessage}</p>}

                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="forget-password">
                        <a onClick={() => setShowForgotPassword(true)}>Forgot Password?</a>
                    </div>

                    <div className="google-apple-login">
                        <p>or Continue with</p>
                        <button>
                            <img src="/home-images/google.png" height={20} width={20} alt="Google" />
                            Google
                        </button>
                        <button>
                            <img src="/home-images/apple-logo.png" height={22} width={22} alt="Apple" />
                            Apple
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
