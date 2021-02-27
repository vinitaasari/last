import React, { useState, Fragment } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Close as CloseIcon,
  ArrowForward,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
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

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}))(MuiDialogActions);

const PriceFilter = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {};

  return (
    <Fragment>
      {/* <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleClickOpen}
      >
        Show more slots
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Price Range
        </DialogTitle>
        <DialogContent dividers>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    onChange={handleChange}
                    name="0-Rs250"
                  />
                }
                label="0-Rs250"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    onChange={handleChange}
                    name="Rs 250- Rs 500"
                  />
                }
                label="Rs 250- Rs 500"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    onChange={handleChange}
                    name="Rs 500- Rs 1000"
                  />
                }
                label="Rs 500- Rs 1000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={true}
                    onChange={handleChange}
                    name="Rs 1000+"
                  />
                }
                label="Rs 1000+"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            style={{
              textTransform: "none",
              color: "#B7B7B7",
              fontWeight: 400,
              fontSize: "16px",
            }}
          >
            Clear
          </Button>
          <Button variant="contained" onClick={handleClose} color="secondary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default PriceFilter;
