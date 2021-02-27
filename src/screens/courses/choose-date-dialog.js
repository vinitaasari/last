import React, { useState, Fragment } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Close as CloseIcon, ArrowForward } from "@material-ui/icons";

// const useStyles = makeStyles((theme) => ({}));

const useDateSlotStyles = makeStyles((theme) => ({
  slotContainer: {
    borderBottom: "1px solid #E7E7EA",
    paddingBottom: theme.spacing(2),
  },
  slotCourseName: {
    color: "#6E6C6C",
    fontSize: "12px",
    fontWeight: 400,
  },
  slotDate: {
    color: "#1C1A1A",
    fontSize: "14px",
    fontWeight: 500,
  },
  slotTime: {
    color: "#1C1A1A",
    fontSize: "12px",
    fontWeight: 400,
  },
  chooseButton: {
    textTransform: "none",
  },
}));

const DateSlot = () => {
  const classes = useDateSlotStyles();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      className={classes.slotContainer}
    >
      <Box>
        <Typography classes={{ root: classes.slotCourseName }}>
          Introduction to Yoga
        </Typography>
        <Typography classes={{ root: classes.slotDate }}>
          Fri, 16 Oct
        </Typography>
        <Typography classes={{ root: classes.slotTime }}>
          6:30 AM - 7:30 AM
        </Typography>
      </Box>
      <Box>
        <Button
          variant="text"
          color="secondary"
          classes={{ root: classes.chooseButton }}
          endIcon={<ArrowForward />}
        >
          Choose
        </Button>
      </Box>
    </Box>
  );
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        variant="h6"
        style={{
          color: "#3F3F3F",
          fontSize: "22px",
          fontWeight: 600,
        }}
      >
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const ChooseDateDialog = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleClickOpen}
      >
        Show more slots
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          6 Available Slots
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary">
                Choose Dates
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateSlot />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateSlot />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateSlot />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateSlot />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateSlot />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ChooseDateDialog;
