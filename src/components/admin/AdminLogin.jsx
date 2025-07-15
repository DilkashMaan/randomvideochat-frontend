import React, { useState } from "react";
import { Link } from "react-router-dom";
// Forgot Password Modal Component
const ForgotPasswordModal = ({ onBack }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="modal-content" id="forget-password">
      <div className="signup-close">
        <div>
          <h2>Reset Password</h2>
        </div>
        <button className="close-btn2" onClick={onBack}>
          x
        </button>
      </div>
      <p>Enter your email to receive a reset link.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <button className="reset-btn">Send Reset Link</button>
      <button className="secondary-btn reset-btn" onClick={onBack}>
        Back to Login
      </button>
    </div>
  );
};

// Main Login Component
const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="modal-overlay admin-login" id="login">
      {showForgotPassword ? (
        <ForgotPasswordModal onBack={() => setShowForgotPassword(false)} />
      ) : (
        <div className="modal-content">

          {/* <div className="image-div">
          <img src="../home-images/login1.avif"></img>
          </div> */}
         <div className="login-content">
           <div className="admin-close">
            <Link to="/">
              {" "}
              <button className="close-btn2">x</button>
            </Link>
          </div>
          
           <h2>Log In</h2>
           {/* <div className="signup-close">
            <div>
              <h2>Log In</h2>
            </div>
            <Link to="/">
              {" "}
              <button className="close-btn2">x</button>
            </Link>
          </div> */}

          <form>
            <input
              type="text"
              name="username"
              placeholder="Username/Email"
              value={form.username}
              onChange={handleChange}
              className="input"
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input"
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

            <button type="button">Login</button>
          </form>

          <div className="forget-password">
            <a onClick={() => setShowForgotPassword(true)}>Forgot Password?</a>
          </div>

          {/* <div className="google-apple-login">
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
          </div> */}
         </div>

        </div>
      )}
    </div>
  );
};

export default AdminLogin;
