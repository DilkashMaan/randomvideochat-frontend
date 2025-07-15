import React, { useRef, useState, useEffect } from "react";
import "./style/EmailVerification.css";
import { useNavigate, useLocation } from "react-router-dom";
import AxiosInstance from "../axios/AxiosInstance";
import Spinner from 'react-bootstrap/Spinner';

const EmailVerification = () => {

    const navigate = useNavigate();

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const [resendTimer, setResendTimer] = useState(30);

    const [showMsg, setShowMsg] = useState("");
    const [loader, setLoader] = useState(false);

    // Start countdown timer for Resend
    useEffect(() => {
        if (resendTimer === 0) return;
        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendTimer]);

    const [email, setEmail] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("signup_email");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            // Optionally redirect if email is not found
            navigate("/");
        }
    }, []);


    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        const key = e.key;

        if (key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];
            if (otp[index]) {
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1].focus();
                const backOtp = [...otp];
                backOtp[index - 1] = "";
                setOtp(backOtp);
            }
        } else if (/^[0-9]$/.test(key)) {
            e.preventDefault();
            const newOtp = [...otp];
            newOtp[index] = key;
            setOtp(newOtp);
            if (index < 5) inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
        if (pasted.length === 6) {
            setOtp(pasted.split(""));
            inputRefs.current[5].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const response = await AxiosInstance.post("/verify_otp/", {
                email: email,
                otp: otp.join(""),
            });

            if (response.status === 200) {
                console.log("OTP Verified", response);
                setShowMsg(response?.data?.detail);

            }

            localStorage.removeItem('signup_email');
            setLoader(false);
            setTimeout(() => {
                setShowMsg("");
            }, 4000);

            localStorage.setItem('email_verified', true);
            navigate("/");


        } catch (error) {
            console.error("OTP verification failed", error);

            const errorMsg = error?.response?.data?.detail || "Something went wrong";

            setShowMsg(errorMsg);

            // ❗ Hide the message after 4 seconds
            setTimeout(() => {
                setShowMsg("");
            }, 4000);

            setLoader(false);
        }
    };
    const handleResend = async () => {
        setLoader(true);
        const now = Date.now();
        const otpResendData = JSON.parse(localStorage.getItem("otpResendData")) || {
            count: 0,
            lastReset: now
        };

        // Reset after 10 minutes
        if (now - otpResendData.lastReset > 10 * 60 * 1000) {
            otpResendData.count = 0;
            otpResendData.lastReset = now;
        }

        // Allow only 2 resends
        if (otpResendData.count >= 2) {
            setShowMsg("You can only resend OTP twice every 10 minutes.");
            setTimeout(() => setShowMsg(""), 4000);
            return;
        }

        setOtp(new Array(6).fill(""));
        setResendTimer(30);
        inputRefs.current[0].focus();

        try {
            const response = await AxiosInstance.post("/resend_otp/", {
                email: email,
            });

            if (response.status === 200) {
                otpResendData.count += 1;
                localStorage.setItem("otpResendData", JSON.stringify(otpResendData));

                setShowMsg("OTP sent again.");
                setTimeout(() => setShowMsg(""), 4000);
            }
        } catch (error) {
            console.error("OTP resend failed", error);
            const errorMsg = error?.response?.data?.detail || "Something went wrong";
            setShowMsg(errorMsg);
            setTimeout(() => setShowMsg(""), 4000);
            setLoader(false);
        }
    };


    return (
        <div className="verify-container">
            <h2>Email Verification</h2>
            <p>Enter the 6-digit code sent to your email</p>

            <form onSubmit={handleSubmit} onPaste={handlePaste}>
                <div className="otp-box">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            value={digit}
                            maxLength={1}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => e.target.select()}
                        />
                    ))}
                </div>
                {loader ? <>

                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </>
                    : <>
                        <button type="submit" className="verify-btn" disabled={loader}>
                            Verify
                        </button>
                    </>

                }



            </form>

            <div className="resend-section">
                {resendTimer > 0 ? (
                    <p className="resend-disabled">Resend OTP in {resendTimer}s</p>
                ) : (
                    <button onClick={handleResend} className="resend-btn">
                        Resend OTP
                    </button>
                )}
            </div>

            {showMsg && (<p className="show-message">{showMsg}</p>)}
        </div>
    );
};

export default EmailVerification;
