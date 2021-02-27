import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import CancelIcon from "../../assets/images/cancel-icon.svg";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom"
import { useUser } from "../../contexts/user-context"
import { apiClient } from "../../utils/api-client";
import {
    CircularProgress,
} from "@material-ui/core";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    interactionBtn: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,

        "& span": {
            display: "block",
        },

        "& p": {
            color: "#52534f",
            fontSize: "16px",
            fontWeight: 500,
            textAlign: "center",
        },
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
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

const useStyles = makeStyles((theme) => ({
    instructorInfoContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
        paddingBottom: theme.spacing(4),
        borderBottom: "1px solid #e7e7ea",
    },
    name: {
        color: "#1c1a1a",
        fontSize: "18px",
        fontWeight: 600,
    },
    designation: {
        color: "#6e6c6c",
        fontSize: "18px",
        fontWeight: 500,
    },
    instructorInteractionBtns: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(2),
    },
    interactionBtn: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,

        "& span": {
            display: "block",
        },

        "& p": {
            color: "#52534f",
            fontSize: "16px",
            fontWeight: 500,
            textAlign: "center",
        },
    },
}));

export default function CustomizedDialogs({ currentSelectedSlotOrCadence, courseDetail, cadenceDetails, slotDetails }) {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const createOrderApiStatus = useCallbackStatus();
    const notification = useSnackbar();
    const { user } = useUser();
    const [message, setMessage] = useState("");
    const [to_be_refunded, setRefunded] = useState(false);


    const checkRefund = async (apiBody) => {
        console.log(apiBody)
        try {
            const res = await createOrderApiStatus.run(
                apiClient("POST", "course_manage", "checkrefundoncancellationbylearner", {
                    body: { ...apiBody },
                    shouldUseDefaultToken: false,
                })
            );
            console.log(res.content.data);
            setMessage(res.content.data.refund_message);
            setRefunded(res.content.data.to_be_refunded)
        } catch (error) {
            notification.enqueueSnackbar(error.message, {
                variant: "error",
                autoHideDuration: 2000,
            });
        }
    };
    const cancelSession = async (apiBody) => {
        try {
            const res = await createOrderApiStatus.run(
                apiClient("POST", "course_manage", "cadenceorsessioncancellationbylearner", {
                    body: { ...apiBody },
                    shouldUseDefaultToken: false,
                })
            );
            setOpen(false);
            history.push("/home")
            notification.enqueueSnackbar(res.message, {
                variant: "success",
                autoHideDuration: 2000,
            });
        } catch (error) {
            notification.enqueueSnackbar(error.message, {
                variant: "error",
                autoHideDuration: 2000,
            });
        }
    };

    const handleClickOpen = () => {
        console.log(courseDetail)
        console.log(slotDetails)
        if (courseDetail.course_type === "slot_course") {
            checkRefund({ learner_id: user.id, slot_course_session_id: history.location.state.courseObj.slot_course_session_id });
        }
        else {
            checkRefund({ learner_id: user.id, structured_course_cadence_id: history.location.state.courseObj.structured_course_cadence_id });
        }
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        if (courseDetail.course_type === "slot_course") {
            let a =
                { learner_id: user.id, slot_course_session_id: history.location.state.courseObj.slot_course_session_id }
            if (!user.is_mi_user) {
                a.to_be_refunded = to_be_refunded
            }
            cancelSession(a);
        }
        else {
            let a = { learner_id: user.id, structured_course_cadence_id: history.location.state.courseObj.structured_course_cadence_id }
            if (!user.is_mi_user) {
                a.to_be_refunded = to_be_refunded
            }
            cancelSession(a);
        }
    };

    return (
        <div>

            <Button className={classes.interactionBtn} onClick={handleClickOpen}>
                <img src={CancelIcon} alt="Cancel" />
                <Typography >Cancel Session</Typography>

            </Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                    <Typography style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                        Are You Sure?
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        {message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        variant="outlined"
                        // size="small"
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
                        {
                            createOrderApiStatus.isPending ? (
                                <CircularProgress size={20} style={{ color: 'white' }} />
                            ) : "YES"
                        }

                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
