import React, { useState, useMemo } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import {
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Radio,
  CircularProgress,
} from "@material-ui/core";
import {
  CreditCard as CreditCardIcon,
  Close as CloseIcon,
} from "@material-ui/icons";
import Visa from "../../assets/images/visa-logo.png"

import { usePayment } from "./payment-context";
import { cardSetupStyles as useStyles } from "./styles";

function CardSetup() {
  const [isFormVisible, setVisibility] = useState(false);
  const [running, setRunning] = useState(false)

  const {
    status,
    cards,
    setCard,
    changePaymentMode,
    constants,
    selectedCard,
    saveCardDetails,
  } = usePayment();
  const classes = useStyles();

  const options = useMemo(
    () => ({
      iconStyle: "solid",
      style: {
        base: {
          fontSize: "16px",
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Work Sans, sans-serif",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    []
  );

  const toggleForm = () => {
    changePaymentMode(constants.new_card);
    setVisibility(!isFormVisible);
    setRunning(false)
  };
  const clbk = () => {
    setRunning(false)
  };
  if (status.loading && status.type === "fetching_cards") {
    return (
      <Grid item container spacing={2}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ width: "100%" }}
        >
          <CircularProgress size={20} />
        </Box>
      </Grid>
    );
  }

  return (
    <Grid item container spacing={2} className={classes.cardSetupContainer}>
      {isFormVisible ? (
        <>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className={classes.cardTitle}>Pay With</Typography>
              <IconButton onClick={toggleForm}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.cardSubTitle}>
              <CreditCardIcon /> Credit/Debit Card
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <label className={classes.cardElementLabel}>Card Number</label>
            <CardNumberElement options={options} />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={4}>
            <label className={classes.cardElementLabel}>Expiry Date</label>
            <CardExpiryElement options={options} />
          </Grid>
          <Grid item xs={2}>
            <label className={classes.cardElementLabel}>CVC</label>
            <CardCvcElement options={options} />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              variant="text"
              color="default"
              disabled={running}
              className={classes.cardSaveBtn}
              startIcon={<CreditCardIcon style={{ color: "#454743" }} />}
              onClick={(e) => {
                setRunning(true)
                saveCardDetails(e, toggleForm, clbk)
              }}
            >
              {status.loading && status.type !== constants.initial_loading ? (
                <CircularProgress size={18} />
              ) : (
                  "Save"
                )}
            </Button>
          </Grid>
        </>
      ) : (
          <form style={{ width: "100%" }}>
            <Grid item xs={12}>
              <Typography className={classes.cardDisplaySectionHeading}>
                Select a Card
            </Typography>
            </Grid>

            {cards.map((item) => (

              < Grid item xs={12} key={item.id} className={classes.cardFormItem} >
                <Typography>
                  {
                    item.card.brand === "visa" ? (
                      <img src={Visa} style={{ height: '20px', width: '50px', marginRight: '10px' }}></img>
                    ) : null
                  }
                </Typography>
                <label
                  htmlFor={item.id}
                  className={classes.cardNumber}
                >{`XXXX XXXX XXXX ${item.card.last4}`}</label>
                <Radio
                  name="user-payment-card"
                  color="secondary"
                  id={item.id}
                  value={item.id}
                  className={classes.radioBtn}
                  onChange={() => {
                    setCard({ ...item });
                    changePaymentMode(constants.saved_card);
                  }}
                  checked={selectedCard && selectedCard.id === item.id}
                />
              </Grid>
            ))}
            <Grid item xs={12} className={classes.addCardSection}>
              <Button
                type="button"
                variant="text"
                color="default"
                className={classes.formToggleBtn}
                startIcon={<CreditCardIcon style={{ color: "#454743" }} />}
                onClick={toggleForm}
              >
                Add a Credit/Debit Card
            </Button>
            </Grid>
          </form>
        )
      }
    </Grid >
  );
}

export default CardSetup;
