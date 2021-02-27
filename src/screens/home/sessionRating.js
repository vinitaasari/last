import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, Box, useScrollTrigger } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useSnackbar } from "notistack";
import Loader from "../../components/loader";
import useCancelRequest from "../../hooks/useCancelRequest";
import { makeStyles } from '@material-ui/core/styles';
import ChatImage from "../../assets/images/chat.png";
import { useAuth } from "../../contexts/auth-context"
import { apiClient } from "../../utils/api-client";
import { useHistory } from "react-router-dom"

import useCallbackStatus from "../../hooks/use-callback-status";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

export default function FormDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(0);
    const [one, setOne] = React.useState(false);
    const [two, setTwo] = React.useState(true);
    const [three, setThree] = React.useState(false);

    const [chat, setChat] = React.useState("");
    const { getUserId } = useAuth();
    const learner_id = getUserId();
    const notification = useSnackbar();
    const favApiStatus = useCallbackStatus();
    const endMeeting = useCallbackStatus();
    const { logout } = useAuth();
    const history = useHistory();
    const apiSource = useCancelRequest();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        history.push("/home")
    };

    const handleSessionRating = async (apiBody) => {
        console.log(apiBody)
        try {
            console.log(apiBody)
            const res = await favApiStatus.run(
                apiClient("POST", "rating", "addsessionrating", {
                    body: { ...apiBody },
                    shouldUseDefaltToken: false,
                })
            );
            notification.enqueueSnackbar("Review received successfully", {
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
    const handleCourseRating = async (apiBody) => {
        console.log(apiBody)
        try {
            console.log(apiBody)
            console.log("hello")
            const res = await favApiStatus.run(
                apiClient("POST", "rating", "addcourserating", {
                    body: { ...apiBody },
                    shouldUseDefaltToken: false,
                })
            );
            notification.enqueueSnackbar("Review received successfully", {
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
    const handleInstructorRating = async (apiBody) => {
        console.log(apiBody)

        if (apiBody.structured_course_session_id) {
            apiBody.rating_type = "structured_course_session"
            delete apiBody.structured_course_id
        } else if (apiBody.structured_course_id) {
            apiBody.rating_type = "structured_course"
            delete apiBody.structured_course_session_id
        } else {
            apiBody.rating_type = "slot_course_session"
            delete apiBody.slot_course_id
        }
        try {
            console.log(apiBody)
            const res = await favApiStatus.run(
                apiClient("POST", "rating", "addinstructorrating", {
                    body: { ...apiBody },
                    shouldUseDefaltToken: false,
                })
            );
            notification.enqueueSnackbar("Review received successfully", {
                variant: "success",
                autoHideDuration: 2000,
            });
            setOpen(false);
            history.push("/home")
        } catch (error) {
            notification.enqueueSnackbar(error.message, {
                variant: "error",
                autoHideDuration: 2000,
            });
        }
    };

    const checkReview = async () => {
        console.log(history.location.pathname)
        console.log(history.location)
        console.log(history.location.pathname.split("/")[2])
        if (history.location.pathname.split("/")[2] === "structured_course") {
            var apiBody = { structured_course_timing_id: history.location.pathname.split("/")[3] }
            try {
                const res = await endMeeting.run(
                    apiClient("POST", "zoom", "ismeetingended", {
                        body: { ...apiBody },
                        cancelToken: apiSource.token,
                    })
                );
                console.log(res)
                if (res.content.is_meeting_ended == true) {
                    console.log("meeting ended")
                } else if (((Math.floor(new Date() / 1000) - res.content.structured_course.start_date) / 60) >= res.content.structured_course.duration) {
                    console.log("duration is greater")
                } else {
                    setOpen(false);
                    history.push("/home")
                }
            }
            catch (error) {
                notification.enqueueSnackbar(error.message, {
                    variant: "error",
                    autoHideDuration: 2000,
                });
                if (error.code === 401) {
                    logout();
                } else {
                    setOpen(false);
                    history.push("/home")
                }
            }
        } else {
            var apiBody = { slot_course_session_id: history.location.pathname.split("/")[3] }
            console.log(apiBody)
            try {
                const res = await endMeeting.run(
                    apiClient("POST", "zoom", "ismeetingended", {
                        body: { ...apiBody },
                        cancelToken: apiSource.token,
                    })
                );
                console.log(res)
                if (res.content.is_meeting_ended == true) {
                    console.log("meeting ended")
                } else if (((Math.floor(new Date() / 1000) - res.content.slot_course.start_time) / 60) >= res.content.slot_course.duration) {
                    console.log(Math.floor(new Date() / 1000))
                    console.log(res.content.slot_course.start_time)
                    console.log("duration is greater")
                } else {
                    setOpen(false);
                    history.push("/home")
                }
            }
            catch (error) {
                notification.enqueueSnackbar(error.message, {
                    variant: "error",
                    autoHideDuration: 2000,
                });
                if (error.code === 401) {
                    logout();
                } else {
                    setOpen(false);
                    history.push("/home")
                }
            }
        }
    };

    useEffect(() => {
        checkReview()
    }, []);

    if (endMeeting.isPending) {
        return <Loader />;
    }

    const handleNext = () => {

        if (!one) {
            if (value) {
                if (chat) {
                    if (history.location.pathname.split("/")[2] === "structured_course") {
                        if (three) {
                            handleCourseRating({ learner_id: learner_id, rating_type: 'structured_course', rating: value, structured_course_cadence_id: history.location.pathname.split("/")[8], feedback: chat, structured_course_id: history.location.pathname.split("/")[6] });
                        }
                        else {
                            handleSessionRating({ learner_id: learner_id, rating: value, feedback: chat, structured_course_timing_id: history.location.pathname.split("/")[3] });
                        }
                    }
                    else {
                        handleCourseRating({ rating: value, feedback: chat, learner_id: learner_id, rating_type: "slot_course", slot_course_session_id: history.location.pathname.split("/")[3], slot_course_id: history.location.pathname.split("/")[4] })
                    }
                }
                else {
                    if (history.location.pathname.split("/")[2] === "structured_course") {
                        if (three) {
                            handleCourseRating({ learner_id: learner_id, rating_type: 'structured_course', rating: value, structured_course_cadence_id: history.location.pathname.split("/")[8], structured_course_id: history.location.pathname.split("/")[6] });
                        }
                        else {
                            handleSessionRating({ learner_id: learner_id, rating: value, structured_course_timing_id: history.location.pathname.split("/")[3] });

                        }
                    }
                    else {
                        handleCourseRating({ rating: value, learner_id: learner_id, rating_type: "slot_course", slot_course_session_id: history.location.pathname.split("/")[3], slot_course_id: history.location.pathname.split("/")[4] })
                    }
                }
            }
            if (two) {
                setTwo(false);
                if(history.location.pathname.split("/")[7]==="0"){
                    setOne(true)
                }
                else{
                    setThree(true)
                }
            }
            if (three) {
                setOne(true);
                setTwo(false);
                setThree(false)
            }

            setChat("")
            setValue("");
        }
        else {
            if (value) {
                if (chat) {
                    if (history.location.pathname.split("/")[2] === "structured_course") {
                        handleInstructorRating({ structured_course_id: history.location.pathname.split("/")[6], learner_id: learner_id, structured_course_session_id: history.location.pathname.split("/")[4], rating_type: history.location.pathname.split("/")[2], instructor_id: history.location.pathname.split("/")[5], rating: value, feedback: chat });
                    }
                    else {
                        handleInstructorRating({ slot_course_id: history.location.pathname.split("/")[4], learner_id: learner_id, slot_course_session_id: history.location.pathname.split("/")[3], rating_type: history.location.pathname.split("/")[2], instructor_id: history.location.pathname.split("/")[5], rating: value, feedback: chat });

                    }
                }
                else {
                    if (history.location.pathname.split("/")[3] === "structured_course") {
                        handleInstructorRating({ structured_course_id: history.location.pathname.split("/")[6], learner_id: learner_id, structured_course_session_id: history.location.pathname.split("/")[4], rating_type: history.location.pathname.split("/")[2], instructor_id: history.location.pathname.split("/")[5], rating: value });
                    }
                    else {
                        handleInstructorRating({ slot_course_id: history.location.pathname.split("/")[4], learner_id: learner_id, slot_course_session_id: history.location.pathname.split("/")[3], rating_type: history.location.pathname.split("/")[2], instructor_id: history.location.pathname.split("/")[5], rating: value });

                    }
                }
            }
           
            // setOne(false)
            // setTwo(true);
            // handleClose();
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title" style={{ textAlign: 'center' }}>
                    <Typography style={{ fontSize: '20px', fontWeight: 500, color: '#494b47' }}>
                        {
                            one && (
                                'How would you rate the instructor?'
                            )
                        }
                        {
                            two && (
                                'How would you rate the session?'
                            )
                        }
                        {
                            three && (
                                'How would you rate the course?'
                            )
                        }
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Box style={{ textAlign: 'center' }}>
                            <Rating
                                name="simple-controlled"
                                value={value}
                                style={{ fontSize: '40px' }}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                            />

                        </Box>
                        <Box style={{ textAlign: 'center' }}>
                            <TextField
                                className={classes.margin}
                                variant="outlined"
                                size="small"
                                value={chat}
                                placeholder="Write Comment"
                                fullWidth
                                onChange={(event) => {
                                    setChat(event.target.value);
                                }}
                                style={{ background: '#fafcfd', border: "#d9dfe5" }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img src={ChatImage}></img>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button
                                onClick={handleNext}
                                variant="contained" disableElevation style={{ background: '#F05E23', color: 'white' }}>
                                {
                                    history.location.pathname.split("/")[7] === "0" && one && 'Done'
                                }
                                {
                                    history.location.pathname.split("/")[7] === "1" && one && 'Next'
                                }
                                {
                                    three && 'Next'
                                }
                                {
                                    two && 'Next'
                                }
                            </Button>
                        </Box>
                    </DialogContentText>


                </DialogContent>

            </Dialog>
        </div>
    );
}
