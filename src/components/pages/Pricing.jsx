import React, { useState, useEffect } from "react";
import axiosInstance from "../axios/AxiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import "./style/Pricing.css";
import { useNavigate } from "react-router-dom";
import Spinner from '../spinner/spinner';

const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`);
console.log("ttttt",import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Pricing = ({ onLoginClick }) => {
  const [plans, setPlans] = useState([]);
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect( () => {
    axiosInstance
      .get("plans/")
      .then((res) => {setPlans(res.data)
    
    console.log("checkssss datatatatatta",res.data)})
      .catch((err) => console.error("Failed to load plans:", err));
  }, []);

  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  const displayedPlans = plans
    .filter((plan) => plan.interval === (isYearly ? "year" : "month"))
    .sort((a, b) => b.amount - a.amount);

  const handleSubscribe = async (priceId) => {
    console.log("priceId handleSubscribe",priceId);
    
    setLoading(true);
    try {
      const stripe = await stripePromise;

      const response = await axiosInstance.post("subscribe/", {
        price_id: priceId,
      });

      console.log("price", response);

      const sessionId = response.data.sessionId;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe Checkout redirect error:", error.message);
        alert(error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      if (error.response && error.response.status === 401) {
        console.log("User not logged in. Opening login modal.");

        navigate(`/login?priceId=${priceId}`);

        if (onLoginClick) {
          onLoginClick(priceId);
        }
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-container">
      <div className="container">
        <div className="pricing-wrapper">
          <h2 className="pricing-heading">Payment Plans</h2>

          <div className="billing-toggle">
            <span>Monthly</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isYearly}
                onChange={handleToggle}
                disabled={loading}
              />
              <span className="slider round"></span>
            </label>
            <span>Yearly</span>
          </div>

          {displayedPlans.length === 0 ? (
           <>
            <div className="pos-center">
                <Spinner />
            </div>
           </>
          ) : (
            displayedPlans.map((plan) => (
              <div key={plan.id} className="plan-card">
                {plan.image && (
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="plan-image"
                  />
                )}
                <h3>
                  ${(plan.amount / 100).toFixed(2)}{" "}
                  <small>/{plan.interval}</small>
                </h3>
                <div className="plan-description">
                  {(plan.description || plan.name)
                    .split(".")
                    .map(
                      (sentence, index) =>
                        sentence.trim() && <p key={index}>{sentence.trim()}.</p>
                    )}
                </div>
                <button
                  className="subscribe-button"
                  disabled={loading}
                  onClick={() => handleSubscribe(plan.price_id)}
                >
                  {loading ? "Processing..." : "Subscribe Now"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
