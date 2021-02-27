import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import _ from "lodash";
import { CircularProgress } from "@material-ui/core";
import { Box, IconButton } from "@material-ui/core";
import { Close as CloseIcon, Star as StarIcon } from "@material-ui/icons";

const useStyles = makeStyles({
  closeBtn: {},
  successBtn: {
    background: "#f05e23",
    color: "white",
    border: "1px solid #f05e23",
    "&:hover": {
      color: "white",
      backgroundColor: "#f05e23",
    },
  },
  dialogWidth: {
    minWidth: "450px"
  }
});

function Modal(props) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const [modalType, setModalType] = useState("default");

  useEffect(() => {
    if (!_.isUndefined(props.modaltype)) setModalType(props.modaltype);
  }, [props.modaltype]);

  useEffect(() => {
    setOpen(props.status);
  }, [props.status]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.statusUpdated();
  };

  const renderModal = (type) => {
    switch (type) {
      case "default":
        return (
          <Dialog
            // fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            {_.isUndefined(props.disableTitle) ?
              (<DialogTitle {...props} id="responsive-dialog-title">
                {props.title}
              </DialogTitle>
              )
              : ""}
            <DialogContent>
              {!_.isUndefined(props.enableTopClose) ?
                <Box style={{ textAlign: "right" }}>
                  <IconButton
                    size="small"
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                : ""}
              {props.children}
            </DialogContent>
            <DialogActions
              style={{ justifyContent: "center", paddingBottom: "24px" }}
            >

              {_.isUndefined(props.enableTopClose) ?
                <Button
                  variant="outlined"
                  className={classes.closeBtn}
                  autoFocus
                  onClick={handleClose}
                  color="primary"
                >
                  {_.isUndefined(props.cancelText) ? "Close" : props.cancelText}
                </Button>
                : ""}

              {!_.isUndefined(props.successButton) ? (
                <Button
                  variant="outlined"
                  className={classes.successBtn}
                  onClick={props.successButton}
                  color="primary"
                  autoFocus
                >
                  {_.isUndefined(props.successText)
                    ? "Send"
                    : props.successText}
                </Button>
              ) : (
                  ""
                )}
            </DialogActions>
          </Dialog>
        );
      case "loader":
        return (
          <Dialog
            // fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogContent><CircularProgress /></DialogContent>
          </Dialog>
        );
    }
  };

  return <div>{renderModal(modalType)}</div>;
}

export default React.memo(Modal);
