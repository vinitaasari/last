import React, { useMemo } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { usePayment } from "./payment-context";

const useStyles = makeStyles((theme) => ({
  addButton: {
    color: "#747572",
    backgroundColor: "#fff",
    fontWeight: 600,
    border: "1px solid #747572",
  },
  cancelButton: {
    color: "#747572",
    backgroundColor: "#fff",
    fontWeight: 500,
    border: "1px solid #747572",
  },
  saveButton: {
    marginLeft: theme.spacing(1.5),
    boxShadow: "none",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  title: {
    color: "#494b47",
    fontSize: "18px",
    fontWeight: 600,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" className={classes.title}>
        {children}
      </Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(0),
  },
}))(MuiDialogContent);

export default function CardActionDialog() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [running, setRunning] = React.useState(false)

  const { status, constants, saveCardDetails } = usePayment();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const options = useMemo(
    () => ({
      iconStyle: "solid",
      style: {
        base: {
          fontSize: "15px",
          margin: "0px",
          color: "#a6a6b2",
          backgroundColor: "#fafcfd",
          letterSpacing: "0.025em",
          fontFamily: "Work Sans, sans-serif",
          "::placeholder": {
            color: "#a6a6b2",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    []
  );

  const callback = () => {
    handleClose();
    setRunning(false)
  };
  const callback2 = () => {
    setRunning(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        className={classes.addButton}
        onClick={handleClickOpen}
      >
        Add a credit/debit card
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Add a card
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CardNumberElement options={options} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CardExpiryElement options={options} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CardCvcElement options={options} />
            </Grid>

            <Grid container justify="center" alignItems="center" item xs={12}>
              <Button
                variant="outlined"
                className={classes.cancelButton}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={running}
                className={classes.saveButton}
                onClick={(e) => {
                  setRunning(true)
                  saveCardDetails(e, callback, callback2)
                }}
              >
                {status.loading && status.type !== constants.initial_loading ? (
                  <CircularProgress size={18} style={{ color: "#fff" }} />
                ) : (
                    "Save"
                  )}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
