import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from "@material-ui/icons/Delete";


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
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
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function CustomizedDialogs(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        setOpen(false);
        props.handleDelete();
    };


    return (
        <div>

            <DeleteIcon
                style={{ color: "#03579c" }}
                onClick={handleClickOpen}
            />
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                    <Typography style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                        Are You Sure?
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Are you sure you want to delete the profile picture?
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
                        // size="small"
                        onClick={handleDelete}
                        style={{ background: "#F05E23", color: "white", minWidth: "90px" }}
                        disableElevation
                    >
                        YES
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
