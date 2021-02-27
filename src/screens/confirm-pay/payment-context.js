import React, { useState, useEffect, createContext, useContext } from "react";
import {
  useElements,
  useStripe,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { Dialog, DialogContent, Button, Typography } from "@material-ui/core";
import Iframe from 'react-iframe'


import REGISTRATION_SUCCESS from "../../assets/images/feedback-registration-success.svg";

import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";

import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import FeedbackCard from "../../components/feedback-cards";

import { modalStyles as useStyles } from "./styles";
import { useAuth } from "../../contexts/auth-context";

const constants = {
  fetching_cards: "fetching_cards",
  initializing_payment: "initializing_payment",
  saved_card: "saved_card",
  new_card: "new_card",
  initial_loading: "initial_loading",
  creating_subscription: "creating_subscription",
  error: "error",
  saving_card: "saving_card",
  deleting_card: "deleting_card",
  making_payment: "making_payment",
  threed_secure_required: "3d_secure_required",
  confirming_3d_secure: "confirming_3d_secure",
};

const PaymentContext = createContext({
  status: {},
  setStatus: () => { },
  mode: constants.saved_card,
  cards: [],
  selectedCard: {},
  setCard: () => { },
  changePaymentMode: () => { },
  handlePurchaseClick: () => { },
  saveCardDetails: () => { },
  constants: {},
});

function PaymentProvider({ children }) {
  const [paymentMode, changePaymentMode] = useState(constants.new_card);
  const [iframe, setIframe] = useState(false)
  const [cards, setCards] = useState([]);
  const [selectedCard, setCard] = useState(null);
  const [subs_id, setSubs] = useState(null)
  const [card, setCardd] = useState(null);
  const { setUser } = useUser();
  const [myClientSecret, setClientSecret] = useState('')
  const [status, setStatus] = useState({
    type: constants.initial_loading,
    loading: true,
    msg: "Getting Details",
  });
  const [showSuccessPopup, setPopup] = useState(false);
  const { logout } = useAuth();
  const history = useHistory();
  const { user } = useUser();
  const stripe = useStripe();
  const elements = useElements();
  const notification = useSnackbar();
  const classes = useStyles();


  const getAllCards = async (apiBody) => {
    try {
      setStatus({
        loading: true,
        type: constants.fetching_cards,
        msg: "Fetching Cards",
      });
      const res = await apiClient("POST", "stripe", "fetchallcustomercards", {
        body: { ...apiBody },
        shouldUseDefaultToken: true,
      });

      setCards(res.content.data);

      setStatus({
        loading: false,
        type: null,
        msg: "",
      });


    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
    }
  };
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     console.log(myClientSecret)
  //     if (myClientSecret) {
  //       const res = await stripe.retrievePaymentIntent(myClientSecret);
  //       if (res.paymentIntent.status === "succeeded") {
  //         setClientSecret(null)
  //         alert("success");
  //       }
  //       else {
  //         console.log("no")
  //       }

  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [myClientSecret])



  useEffect(() => {
    if (stripe) {
      statuss()
    }
  }, [stripe])


  const statuss = async () => {
    if (stripe && window.localStorage.getItem('subscription_id')) {
      const urlParams = new URLSearchParams(window.location.search);
      const res = await stripe.retrievePaymentIntent(urlParams.get("payment_intent_client_secret"));
      if (res.paymentIntent.status === "succeeded") {
        const res2 = await apiClient("POST", "subscription", "addsubscriptiondata", {
          body: {
            subscription_id: window.localStorage.getItem('subscription_id'),
            learner_id: window.localStorage.getItem('user_id'),
            is_logged_in: Boolean(window.localStorage.getItem('is_logged_in') === 1)
          },
          shouldUseDefaultToken: true
        });
        setStatus({
          type: null,
          loading: false,
          msg: "",
        });
        var userData = JSON.parse(window.localStorage.getItem("user_details"));
        userData.is_subscription_purchased = 1;
        window.localStorage.setItem("user_details", JSON.stringify(userData));
        if (res2.content.data.learner) {
          window.localStorage.setItem('user_token', res2.content.data.learner.secret)
        }
        window.localStorage.removeItem('subscription_id')
        notification.enqueueSnackbar("Payment Successful", {
          variant: "success",
          autoHideDuration: 3000,
          onExited: () => {
            history.push("/home");
          },
        });
        setPopup(true);
      }
      else {
        notification.enqueueSnackbar("Payment failed", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    }
  }

  useEffect(() => {
    // if (user.is_mi_user && !user.is_subscription_purchased) {

    // }
    // else {
    getAllCards({ customer_id: user.customer_id });
    // }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // if (user.is_mi_user && !user.is_subscription_purchased) {
    console.log("My card");
    console.log(card)
    // }
    // else {
    // getAllCards({ customer_id: user.customer_id });
    // }
    // eslint-disable-next-line
  }, [card]);

  const createSubscription = async (apiBody) => {
    try {
      setStatus({
        type: constants.creating_subscription,
        loading: true,
        msg: "Creating Subscription",
      });
      const res = await apiClient(
        "POST",
        "subscription",
        "createsubscription",
        {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
        }
      );
      if (res.content.data.subscription === true) {
        var userData = JSON.parse(window.localStorage.getItem("user_details"));
        userData.is_subscription_purchased = 1;

        window.localStorage.setItem("user_details", JSON.stringify(userData));
        if (res.content.data.learner) {
          window.localStorage.setItem('user_token', res.content.data.learner.secret)
        }
        userData.authenticated = true;
        setUser(userData)
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 3000,
          onExited: () => {
            history.push("/home");
            setStatus({
              type: null,
              loading: false,
              msg: "",
            });
          },
        });

        setPopup(true);
      }
      else {
        subscription3D({ client_secret: res.content.data.client_secret, subscription_id: res.content.data.subscription_id });
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });

      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
    }
  };

  // eslint-disable-next-line
  const capturePayment = async (apiBody) => {
    setStatus({
      type: constants.saving_card,
      loading: true,
      msg: "Making a payment",
    });
    try {
      const res = await apiClient("POST", "stripe", "capturepayment", {
        body: { ...apiBody },
      });

      if (
        res.content.data.status === "requires_action" ||
        res.content.data.status === "requires_source_action"
      ) {
        confirmPayment(
          res.content.data.client_secret,
          res.content.data.id,
          apiBody
        );
        return;
      } else {
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 3000,
          onExited: () => {
            history.push("/home");
            setStatus({
              type: null,
              loading: false,
              msg: "",
            });
          },
        });
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  // eslint-disable-next-line


  const subscription3D = async (apiBody) => {
    setStatus({
      type: constants.confirming_3d_secure,
      loading: true,
      msg: "Confirming 3D Secure",
    });
    try {
      window.localStorage.setItem('subscription_id', apiBody.subscription_id)
      const resp = await stripe.confirmCardPayment(
        apiBody.client_secret,
        {
          return_url: `${window.location.origin}/confirm-pay`
        },
        { handleActions: false }
      )
      console.log(resp)
      var action = resp.paymentIntent.next_action;
      if (action && action.type === 'redirect_to_url') {
        window.location = action.redirect_to_url.url;
      }
      if (resp.error) {
        alert(resp.error.message)
        notification.enqueueSnackbar("Payment failed, Please try again", {
          variant: "error",
          autoHideDuration: 2000,
        });
        return;
      }
    } catch (error) {

      console.log(error.message)
      if (error.code === 401) {
        logout();
      }
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }

  }

  const confirmPayment = async (client_secret, paymentIntentId, apiBody) => {
    setStatus({
      type: constants.confirming_3d_secure,
      loading: true,
      msg: "Confirming 3D Secure",
    });
    try {
      delete apiBody.payment_method;

      // var orderPayment = {
      //   ...apiBody,
      //   payment_intent_id: paymentIntentId
      // }

      const resp2 = await stripe.retrievePaymentIntent(client_secret);
      setIframe(resp2.paymentIntent.next_action.use_stripe_sdk.stripe_js)
      // console.log(resp2);
      // setClientSecret(client_secret)
      // if (resp2.paymentIntent.next_action) {
      //   window.open(resp2.paymentIntent.next_action.use_stripe_sdk.stripe_js, 'popup', 'width=600,height=600')
      // }



      // const intent = await stripe.paymentIntents(resp2.paymentIntent.id, {
      //   return_url: 'http://localhost:4022/confirm-pay',
      // });
      // console.log(intent)
      console.log("start handeCard")
      console.log(client_secret)
      // const res = await stripe.handleCardAction(client_secret)

      const { paymentIntent, error } = await stripe.handleCardAction(
        client_secret
      );
      console.log(paymentIntent)
      console.log(error)
      // if (res.error) {
      //   notification.enqueueSnackbar(res.error.message, {
      //     variant: "error",
      //     autoHideDuration: 2000,
      //   });
      //   return;
      // }

      await apiClient("POST", "stripe", "confirmpayment", {
        body: { ...apiBody, payment_intent_id: paymentIntentId },
      });

      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
      notification.enqueueSnackbar("Payment Successful", {
        variant: "success",
        autoHideDuration: 3000,
        onExited: () => {
          history.push("/home");
        },
      });

    } catch (error) {
      console.log("error123");
      console.log(error)
      if (error.code === 401) {
        logout();
      }
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const saveCard = async (apiBody, payment_details, callback = () => { }, callback2 = () => { }) => {
    try {
      console.log("here is the api Bodyyyy");
      console.log(apiBody)
      setStatus({
        type: constants.saving_card,
        loading: true,
        msg: "Saving Card",
      });
      const res = await apiClient("POST", "stripe", "savecard", {
        body: { ...apiBody },
        shouldUseDefaultToken: true,
      });

      if (res.content.data && payment_details.payment_type === "subscription") {
        createSubscription({
          plan_id: payment_details.id,
          source: apiBody.source,
          learner_id: user.id,
          is_logged_in: Boolean(window.localStorage.getItem('is_logged_in') === 1)
        });
      }

      if (res.content.data && payment_details.payment_type === "order") {
        capturePayment({
          order_id: payment_details.id,
          payment_method: apiBody.source,
          learner_id: user.id,
        });
      }

      setStatus({
        type: null,
        loading: false,
        msg: "",
      });

      // if (user.is_mi_user && !user.is_subscription_purchased) {

      // }
      // else {
      getAllCards({ customer_id: user.customer_id });

      // }
      callback();
    } catch (error) {
      if (callback2) {
        callback2();
      }
      if (error.code === 401) {
        logout();
      }
      console.log(error)
      if (error.message) {
        notification.enqueueSnackbar(error.message, {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
      else {
        notification.enqueueSnackbar("Invalid Card Details", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
    }
  };

  const deleteCard = async (apiBody) => {
    try {
      setStatus({
        type: constants.deleting_card,
        loading: true,
        msg: "Deleting Card",
      });
      const res = await apiClient("POST", "stripe", "deletecard", {
        body: { ...apiBody },
        shouldUseDefaultToken: false,
      });

      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
      // if (user.is_mi_user && !user.is_subscription_purchased) {

      // }
      // else {
      getAllCards({ customer_id: user.customer_id });
      // }


    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
    }
  };

  const createStripePayment = async (payment_details) => {
    try {
      setStatus({
        type: constants.initializing_payment,
        loading: true,
        msg: "Initializing Payment",
      });
      const cardElement = elements.getElement(CardNumberElement);
      setCardd(cardElement)
      if (cardElement === null) {
        notification.enqueueSnackbar(
          "Please enter new card details or select an existing card",
          {
            variant: "error",
            autoHideDuration: 4000,
          }
        );
        setStatus({
          type: null,
          loading: false,
          msg: "",
        });
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        notification.enqueueSnackbar(error.message, {
          variant: "error",
          autoHideDuration: 2000,
        });
        setStatus({
          type: null,
          loading: false,
          msg: "",
        });
      } else {
        saveCard(
          { source: paymentMethod.id, customer_id: user.customer_id },
          payment_details
        );
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
    }
  };

  const handlePurchaseClick = (e, paymentInfo) => {
    e.preventDefault();
    if (paymentInfo.unit_amount === 0) {
      if (paymentInfo.payment_type === "order") {
        capturePayment({
          order_id: paymentInfo.id,
          // payment_method: selectedCard.id,
          learner_id: user.id,
        });
      }
    }
    else {
      if (!stripe || !elements) {
        return;
      }

      // setPaymentDetails(() => ({ ...paymentInfo }));

      if (paymentMode === constants.new_card) {
        createStripePayment({ ...paymentInfo });
      }

      if (paymentMode === constants.saved_card) {
        if (paymentInfo.payment_type === "subscription") {
          createSubscription({
            plan_id: paymentInfo.id,
            source: selectedCard.id,
            learner_id: user.id,
            is_logged_in: Boolean(window.localStorage.getItem('is_logged_in') === 1)
          });
        }

        if (paymentInfo.payment_type === "order") {
          capturePayment({
            order_id: paymentInfo.id,
            payment_method: selectedCard.id,
            learner_id: user.id,
          });
        }
      }
    }
  };

  const saveCardDetails = async (e, callback, callback2) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    setCardd(cardElement)
    console.log("saved card details");

    if (cardElement === null) {
      notification.enqueueSnackbar(
        "Please enter new card details or select an existing cardd",
        {
          variant: "error",
          autoHideDuration: 4000,
        }
      );
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
    } else {
      saveCard(
        { source: paymentMethod.id, customer_id: user.customer_id },
        {
          payment_type: "",
        },
        callback,
        callback2
      );
    }
  };

  const handleModalClose = () => {
    setPopup(false);

    // so that user doesn't go back on payment page
    history.replace("/home");
  };

  return (
    <>
      <PaymentContext.Provider
        value={{
          status,
          setStatus,
          paymentMode,
          cards,
          selectedCard,
          setCard,
          handlePurchaseClick,
          changePaymentMode,
          saveCardDetails,
          deleteCard,
          constants,
        }}
      >
        {children}
        <Dialog
          open={showSuccessPopup}
          onClose={handleModalClose}
          aria-labelledby="Subscription Successful"
          className={classes.registrationSuccessBox}
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          fullWidth
        >
          <DialogContent>
            <FeedbackCard
              imgSrc={REGISTRATION_SUCCESS}
              cardText="Congratulations!!"
              cardSubText="You are a subscribed user now."
              btnText={`OK`}
              onClick={handleModalClose}
            />
          </DialogContent>
        </Dialog>
        {/* <Dialog
        open={showSuccessPopup}
        onClose={handleModalClose}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogContent className={classes.cardBg}>
          <Typography
            component="h2"
            variant="body1"
            className={classes.cardMsg}
          >
            Congratulations!! <br /> You’re a subscribed user now!! <br /> Book
            courses and keep learning
          </Typography>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.cardBtn}
            onClick={handleModalClose}
          >
            Ok
          </Button>
        </DialogContent>
      </Dialog> */}
      </PaymentContext.Provider>
      {
        iframe ? (
          <Iframe url={iframe}
            width="200px"
            height="300px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative" />
        ) : null
      }
    </>
  );
}

function usePayment() {
  const context = useContext(PaymentContext);

  if (context === undefined) {
    throw new Error("usePayment must be inside Payment Provider");
  }
  return context;
}

export { PaymentContext, PaymentProvider, usePayment };
