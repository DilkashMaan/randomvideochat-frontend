import React, { useState } from "react";
import "./style/Signup.css";
import AxiosInstance from "../axios/AxiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const Signup = ({ onClose, switchToLogin }) => {
  const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        dob: "",
        interests: [],
    });

    const interestOptions = [
  "Music", "Gaming", "Sports", "Movies", "Travel",
  "Art", "Technology", "Fitness", "Cooking",
  "Reading", "Dancing", "Photography",
];

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // added
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

 const toggleInterest = (interest) => {
  const alreadySelected = form.interests.includes(interest);
  console.log("alreadySelected",alreadySelected);
  if (alreadySelected) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
    setErrors((prev) => ({ ...prev, interests: null }));
  } else if (form.interests.length < 4) {
    setForm((prev) => ({
      ...prev,
      interests: [...prev.interests, interest],
    }));
    setErrors((prev) => ({ ...prev, interests: null }));
  } else {
    setErrors((prev) => ({
      ...prev,
      interests: "You can select up to 4 interests only.",
    }));
  }
};


    const getPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        if (password.length >= 8) score++;

        if (score <= 1) return { level: "Very weak", bars: 1, color: "red" };
        if (score === 2) return { level: "Weak", bars: 2, color: "yellow" };
        if (score === 3 || score === 4)
            return { level: "Good", bars: 3, color: "green" };
        return { level: "Strong", bars: 4, color: "blue" };
    };

    const strength = getPasswordStrength(form.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.username) newErrors.username = "Username is required";
        if (!/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = "Valid email is required";
        if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
        if (!form.gender) newErrors.gender = "Please select your gender";
        if (!form.dob) newErrors.gender = "Please enter date of birth";
        if (!agreed)
            newErrors.agreed = "You must agree to the terms and privacy policy";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            try {
                const { username, email, password, gender, dob,interests } = form;
                const response = await AxiosInstance.post("/users/signup/", {
                    username,
                    email,
                    password,
                    gender,
                    dob,
                    interests,

                });
                console.log("ressssssssssssssssssss", response);
                await sendEmail();
                
                setForm({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    gender: "",
                    dob: "",
                    interests:[],
                });
                setAgreed(false);
            } catch (error) {
                if (error.serverErrors) {
                    const serverErrors = error.serverErrors;
                    const newErrors = { ...errors };
                    Object.entries(serverErrors).forEach(([field, messages]) => {
                        newErrors[field] = Array.isArray(messages)
                            ? messages.join(", ")
                            : messages;
                    });
                    setErrors(newErrors);
                } else {
                    setErrors({ general: "Signup failed. Try again." });
                }
            } finally {
                setLoading(false);
            }
        }
    };



    const sendEmail = async () => {
        try {
            localStorage.setItem('signup_email', form.email);
            const response = await AxiosInstance.post("/send_mail/", { email: form.email });

            if (response.status === 200) {
               setSuccessMessage("OTP has been sent to your email. Please check your inbox.");
                // Wait 4 seconds then redirect
                setTimeout(() => {
                    navigate("/email"); // ✅ your target page
                }, 4000); // 4000ms = 4 seconds
            }
        } catch (error) {
            console.error("Email sending failed", error);
        }
    };



    return (
        <div className="modal-overlay" id="signup">
            <div className="modal-content">
                <div className="signup-close">
                    <div>
                        <h2>Create Your Account</h2>
                        <p>
                            Have an account?{" "}
                            <span
                                onClick={(e) => {
                                    e.preventDefault();
                                    switchToLogin();
                                }}
                            >
                                Login
                            </span>
                        </p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        x
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className={errors.username ? "input error-border" : "input"}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className={errors.email ? "input error-border" : "input"}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}

                    <input
                        type="date"
                        name="dob"
                        placeholder=""
                        value={form.dob}
                        onChange={handleChange}
                        className={errors.dob ? "input error-border" : "input"}
                    />
                    {errors.dob && <p className="error">{errors.dob}</p>}

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={errors.gender ? "input error-border" : "input"}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors.gender && <p className="error">{errors.gender}</p>}

                    <div className="interests-container">
  <label className="interests-label">Interests (Optional)</label>
  <div className="interest-buttons">
    {interestOptions.map((interest) => (
      <button
        type="button"
        key={interest}
        className={`interest-btn ${form.interests.includes(interest) ? "selected" : ""}`}
        onClick={() => toggleInterest(interest)}
      >
        {interest}
      </button>
    ))}
  </div>
  {errors.interests && <p className="error">{errors.interests}</p>}
</div>


                    {/* Password Field */}
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
                                showPassword ? "home-images/visible.png" : "home-images/eye.png"
                            }
                            alt="Toggle visibility"
                            className="toggle-password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    {errors.password && <p className="error">{errors.password}</p>}

                    {form.password && (
                        <div className="strength-meter">
                            <div className="bars">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bar"
                                        style={{
                                            backgroundColor:
                                                i < strength.bars ? strength.color : "gray",
                                            height: "5px",
                                            marginRight: "2px",
                                            width: "25%",
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="strength-label">{strength.level}</p>
                        </div>
                    )}

                    {/* Confirm Password with Eye */}
                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className={
                                errors.confirmPassword ? "input error-border" : "input"
                            }
                        />
                        <img
                            src={
                                showConfirmPassword
                                    ? "home-images/visible.png"
                                    : "home-images/eye.png"
                            }
                            alt="Toggle visibility"
                            className="toggle-password-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="error">{errors.confirmPassword}</p>
                    )}

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                        />
                        <p>
                            By signing up, you agree to our <a href="#">Terms of Service</a>{" "}
                            and <a href="#">Privacy Policy</a>.
                        </p>
                    </label>
                    {errors.agreed && <p className="error">{errors.agreed}</p>}

                    {errors.general && <p className="error">{errors.general}</p>}
                    {successMessage && (<>
                        <div className="success-message">
                            {successMessage}
                        </div>
                    </>)}

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <div className="google-apple-login">
                    <p>or Continue with</p>
                    <button>
                        <img
                            src="/home-images/google.png"
                            height={20}
                            width={20}
                            alt="Google"
                        />
                        Google
                    </button>
                    <button>
                        <img
                            src="/home-images/apple-logo.png"
                            height={22}
                            width={22}
                            alt="Apple"
                        />
                        Apple
                    </button>
                </div>
            </div>


        </div>
    );
};

export default Signup;
