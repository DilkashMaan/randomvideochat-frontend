import React, { useState, useEffect, useContext } from "react";
import Header from "./Header.jsx";
import "./style/Home.css";
import Signup from "../auth/Signup.jsx";
import Login from "../auth/Login.jsx";
import Footer from "./Footer.jsx";
import { AuthContext } from "../auth/AuthContext";  // adjust path if needed
import { useNavigate } from "react-router-dom";
import PricingPage from "./Pricing.jsx";

const Home = () => {


    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const switchToSignup = () => {
        setShowLogin(false);
        setShowSignup(true);
    };

    const switchToLogin = () => {
        setShowSignup(false);
        setShowLogin(true);
    };

    useEffect(() => {
        functionOnLoad();
    }, []);

    useEffect(() => {
        const emailVerified = localStorage.getItem("email_verified");
        if (emailVerified) {
            setShowLogin(true);
        }
    }, []);

    const functionOnLoad = () => {
        console.log("cookie", document.cookie);
        console.log(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

    };

    const handleTalkNowClick = () => {
        
        if (!loading) {
            if (isAuthenticated) {
                navigate("/dashboard");
            } else {
                switchToLogin();
            }
        }
    };

    useEffect(() => {

        console.log("isAuthenticated checkkkkkkk", isAuthenticated);
        if (isAuthenticated) {
            navigate("/dashboard");
        } else {
            console.log("user isAuthenticated", isAuthenticated);

        }
    }, [isAuthenticated,]);

    return (
        <>
            <Header
                onSignupClick={() => setShowSignup(true)}
                onLoginClick={() => setShowLogin(true)}
            />

            <div className="homepage-section" id="home-section">
                <div className="homecontent-image container">
                    <div className="home-content">
                        <h1>
                            <span className="gradient-text">Who Will You Meet Today?</span>
                        </h1>
                        <p>
                            Meet someone interesting — the conversation starts now and could
                            lead anywhere.
                        </p>
                        <button className="talk-button" onClick={handleTalkNowClick}>
                            Talk Now
                        </button>
                    </div>

                    <div className="home-image">
                        <img src="home-images/Frame444.png" alt="Chat Visual" />
                    </div>
                </div>
            </div>

            {showSignup && (
                <Signup
                    onClose={() => setShowSignup(false)}
                    switchToLogin={switchToLogin}
                />
            )}

            {showLogin && (
                <Login
                    onClose={() => setShowLogin(false)}
                    switchToSignup={switchToSignup}
                />
            )}

            <div className="section-second">
                <div className="container">
                    <div className="second-heading">
                        <h2>Connect Instantly. Meet the World.</h2>
                        <p>
                            Discover a whole new way to connect with people around the globe
                            through live video chat...
                        </p>
                    </div>

                    <div className="second-sec-div">
                        <div>
                            <h6>From Strangers to Friends</h6>
                            <h5>Connect with People Who Share Your Passions</h5>
                            <p>
                                Meet new people who get you. Whether it’s gaming, music, movies,
                                or anything else you love...
                            </p>
                        </div>
                        <div>
                            <img src="home-images/image33.png" alt="Connect" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-why-choose-us">
                <div className="container">
                    <div>
                        <h2>Our Specialties</h2>
                        <p>
                            We’re not just another video chat app — here’s what sets us apart:
                        </p>
                        <div className="features-grid">
                            <div className="feature-card">
                                <img src="home-images/protection.png" alt="Safe Chat" />
                                <h4>Safe & Moderated</h4>
                                <p>
                                    We prioritize your safety with moderation tools and
                                    guidelines.
                                </p>
                            </div>
                            <div className="feature-card">
                                <img src="home-images/network.png" alt="Instant Connect" />
                                <h4>Instant Connections</h4>
                                <p>No long signups—start chatting in seconds with one tap.</p>
                            </div>
                            <div className="feature-card">
                                <img src="home-images/epidemiology.png" alt="Global Reach" />
                                <h4>Global Community</h4>
                                <p>
                                    Talk to people from all over the world—expand your circle.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PricingPage onLoginClick={() => setShowLogin(true)}></PricingPage>

            <Footer />
        </>
    );
};

export default Home;
