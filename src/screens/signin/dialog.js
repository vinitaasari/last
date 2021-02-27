import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions,
  Typography,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import { useAuth } from "./../../contexts/auth-context";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "16px",
    fontWeight: 400,
    textAlign: "center",
  },
  actionButton: {
    minWidth: "100px",
    // textTransform: "none",
    // align : "right",
    backgroundColor: "#F05E23", 
    color: "white",
    marginLeft : "10px",
    "&:hover": {
      backgroundColor: "#F05E23",
    },
  },
  cancelButton: {
    minWidth: "100px",
    // textTransform: "none",
    color: "grey",
    // align : "right"
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 3),
  },
}))(MuiDialogContent);

export default function CategoryActionModal(props) {
  console.log(props.myBody)
  console.log(props.myBody.type)
  const classes = useStyles();
  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if(props.myBody.type === undefined){
      console.log("if")
      props.login(props.myBody)
    }else{
      props.loginViaSocialMedia(props.myBody);
  };
}

  return (
    <div>
      <Dialog
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={true}
        fullWidth
        maxWidth="xs"
      // disableBackdropClick
      // disableEscapeKeyDown
      >
        <form onSubmit={handleFormSubmit}>
          <DialogContent id="customized-dialog-title">
            <Typography className={classes.title}>
              You are already logged in with another device. Do you want to continue to login here?
            </Typography>
            </DialogContent>
            <DialogActions>
            <Box mt={3} display="flex" justifyContent="space-between" >
              <Button
                variant="outlined"
                disableElevation
                type="submit"
                //color="secondary"
                onClick={props.handleClose}
                className={classes.cancelButton}
              >
                No
              </Button>
              <Button
                variant="contained"
                type="submit"
                //color="secondary"
                disableElevation
                onClick={handleFormSubmit}
                className={classes.actionButton}
              >
                Yes
              </Button>              
            </Box>
            </DialogActions>
          
        </form>
      </Dialog>
    </div>
  );
}
