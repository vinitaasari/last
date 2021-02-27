import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripe = loadStripe(process.env.REACT_APP_STRIPE_KEY);

export function StripeProvider({ children }) {
  return <Elements stripe={stripe}>{children}</Elements>;
}
