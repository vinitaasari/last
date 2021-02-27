import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';

import CardEditIcon from "../../assets/images/card-edit-icon.svg";
import CardDeleteIcon from "../../assets/images/card-delete-icon.svg";
import VisaIcon from "../../assets/images/visa-icon.svg";
import { PaymentProvider, usePayment } from "./payment-context";
import EmptyState from "../../components/empty-state";
import NoCardsImage from "../../assets/images/no-cards.svg";
import CardActionDialog from "./card-action-dialog";

const useStyles = makeStyles((theme) => ({
  heading: {
    color: "#52534f",
    fontWeight: 500,
    fontSize: "16px",
  },
  addButton: {
    color: "#747572",
    backgroundColor: "#fff",
    fontWeight: 600,
    border: "1px solid #747572",
  },
  cardsListingContainer: {
    marginTop: theme.spacing(2),
  },
  card: {
    boxShadow: "0 8px 26px 0 rgba(0, 0, 0, 0.16)",
  },
  cardNoText: {
    color: "#454743",
    fontSize: "13px",
    fontWeight: 400,
  },
  cardNo: {
    color: "#454743",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "4px",
  },
  expiryDate: {
    color: "#454743",
    fontSize: "13px",
    fontWeight: 400,
  },
}));

const AllCardsListing = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const [myId, setId] = useState(null)
  const { status, cards, deleteCard } = usePayment();

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  if (status.loading && status.type === "fetching_cards") {
    return (
      <Grid item container spacing={2}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={4}
          style={{ width: "100%" }}
        >
          <CircularProgress size={20} />
        </Box>
      </Grid>
    );
  }

  if (cards.length === 0) {
    return (
      <Box
        w={1}
        mt={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <EmptyState image={NoCardsImage} text="Not added any cards yet!" />

        <Box mt={2}>
          <CardActionDialog />
        </Box>
      </Box>
    );
  }

  return (
    <Box w={1} mt={3}>
      <Grid container item xs={12} alignItems="center" justify="space-between">
        <Typography className={classes.heading}>Saved Cards</Typography>
        <CardActionDialog />
      </Grid>

      <Grid container spacing={2} className={classes.cardsListingContainer}>
        {cards.map((item) => {
          return (
            <Grid key={item.id} item xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    {item.card.brand === "visa" && (
                      <img src={VisaIcon} alt="Visa" />
                    )}

                    <Box ml="auto" display="flex" alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setId(item.id)
                          handleOpen();
                        }}
                      // onClick={() => deleteCard({ source_id: item.id })}
                      >
                        <img src={CardDeleteIcon} alt="Delete card" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box mt={2}>
                    <Typography className={classes.cardNoText}>
                      Card no
                    </Typography>
                    <Typography className={classes.cardNo}>
                      {`XXXX XXXX XXXX ${item.card.last4}`}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Typography className={classes.expiryDate}>
                      Expiry Date
                    </Typography>
                    <Typography className={classes.expiryDate}>
                      {item.card.exp_month} / {item.card.exp_year}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title">
          <Typography style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
            Are You Sure?
                    </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you want to delete this card?
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="outlined"
            // size="small"
            //className={classes.cancelButton}
            onClick={handleClose}
            style={{ color: "grey", minWidth: "90px" }}
            disableElevation
          >
            No
                    </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              deleteCard({ source_id: myId })
              handleClose();
            }}

            style={{ background: "#F05E23", color: "white", minWidth: "90px" }}
            disableElevation
          >
            YES
                    </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function WithPayment() {
  return (
    <PaymentProvider>
      <AllCardsListing />
    </PaymentProvider>
  );
}

export default WithPayment;
