import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import OtpInput from "react-otp-input";
import { useSnackbar } from "notistack";
import * as yup from "yup";
import Timer from "react-compound-timer";


import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { otpFormStyles as useStyles } from "./styles";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";

const otpSchema = yup.object().shape({
  otp: yup.string().length(6, "Please enter 6 digit otp").required("Required!"),
});

function OTPForm({ otpLength, formValues, setFormValues, handleCloseModal, handleOkayOtpModal }) {
  const [otp, setOtp] = useState("");
  const [resendTimerValue, setResendTimerValue] = useState(60 * 1000);

  const [formValidation, setFormValidation] = useState({
    isValid: true,
    message: "",
  });

  const resendOtpStatus = useCallbackStatus();
  const validateOtpStatus = useCallbackStatus();
  const confirmPhoneStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const classes = useStyles();
  const muiTheme = useTheme();
  const notification = useSnackbar();
  const { logout } = useAuth();
  const history = useHistory();
  const { user } = useUser();

  const handleOtpChange = (otp) => {
    if (formValidation.isValid === false) {
      setFormValidation({
        isValid: true,
        message: "",
      });
    }
    setOtp(otp);
  };

  // const handleBackClick = () => {
  //   history.push("/register?currentStep=email");
  // };

  const resendOtp = async (apiBody, cb, timerActions) => {
    try {
      console.log(apiBody);
      const res = await resendOtpStatus.run(
        apiClient("POST", "common", "sendresendotp", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );
      console.log(res.content.data.otp);
      setResendTimerValue(res.content.wait_time * 1000);
      if (timerActions) {
        timerActions.setTime(res.content.wait_time * 1000);
        timerActions.reset();
        timerActions.start();
      }
      if (res.content.data === true) {
        cb();
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      handleOkayOtpModal();
      console.log(error.message);
      if (error.code === 401) {
        logout();
      }
      // handle the validation error
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    resendOtp(
      {
        phone_number: formValues.phone_no,
        entity_type: "learner",
        action_type: "verify_phone_number",
      },
      () => { }
    );
    // eslint-disable-next-line
  }, []);

  const confirmVerify = async (apiBody) => {
    try {
      const res = await confirmPhoneStatus.run(
        apiClient("POST", "learner", "updatelearnerprofile", {
          body: { ...apiBody },
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );

      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 1000,
        // onClose: handleCloseModal,
      });

      handleCloseModal();
      history.push('/profile/edit-profile')
      // window.location.reload()
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const verifyPhoneNumber = async (apiBody) => {
    console.log(apiBody)
    try {
      const res = await confirmPhoneStatus.run(
        apiClient("POST", "common", "verifyphonenumber", {
          body: { ...apiBody },
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );

      confirmVerify({ learner_id: user.id, is_phone_number_verified: true });

      handleCloseModal();
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const validateOtp = async (apiBody) => {
    console.log(apiBody)
    if (apiBody.phone_number) {
      delete apiBody.email
    } else {
      delete apiBody.phone_number
    }
    console.log(apiBody)
    apiBody.entity_type = "learner"
    apiBody.action_type = "verify_phone_number"
    try {
      const res = await validateOtpStatus.run(
        apiClient("POST", "common", "validateotp", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );

      if (res.content) {
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
        // confirmVerify({ learner_id: user.id, is_phone_number_verified: true });
        console.log(apiBody)
        console.log(res)
        verifyPhoneNumber({ user_id: user.id, entity_type: "learner", phone_number: apiBody.phone_number, otp: apiBody.otp })
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      // handle the validation error
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  // const handleResendClick = (timerActions) => {
  //   const cb = () => {
  //     timerActions.reset();
  //     timerActions.start();
  //   };

  //   resendOtp(
  //     { phone_number: formValues.phone_no, entity_type: "learner" },
  //     cb
  //   );
  // };

  const handleResendClick = (timerActions) => {
    const cb = () => {

    };

    resendOtp({
      phone_number: formValues.phone_no,
      entity_type: "learner",
      action_type: "verify_phone_number",
    }, cb, timerActions);
  };

  const handleValidateClick = () => {
    otpSchema
      .validate({ otp })
      .then(() => {
        validateOtp({
          phone_number: formValues.phone_no,
          otp,
          email: formValues.email,
        });
      })
      .catch((error) => {
        setFormValidation({
          isValid: false,
          message: error.message,
        });
      });
  };

  return (
    <Grid
      item
      xs={12}
      component={Paper}
      square
      className={classes.paperContainer}
    >
      <div className={classes.paper}>
        <Box className={classes.formHeader}>
          <Typography component="h1" variant="h3" className={classes.pageTitle}>
            Phone Number Verification
          </Typography>
        </Box>
        <Typography
          component="p"
          variant="subtitle1"
          className={classes.pageSubTitle}
        >
          Enter the 6-digit code just sent to <br /> {formValues.phone_no}
        </Typography>
        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          isInputNum
          containerStyle={classes.otpInputContainer}
          inputStyle={{
            width: "42px",
            height: "52px",
            border: `1px solid ${muiTheme.palette.primary.main}`,
            borderRadius: "3px",
            backgroundColor: muiTheme.palette.primary.contrastText,
            fontSize: "26px",
          }}
        />
        {formValidation.isValid === false ? (
          <Typography
            component="span"
            variant="caption"
            className={classes.errorMessage}
          >
            {formValidation.message}
          </Typography>
        ) : null}
        <Box className={classes.actionBtnContainer}>
          <Button
            type="button"
            variant="outlined"
            className={classes.resendOtp}
            onClick={handleOkayOtpModal}
          >
            Cancel
          </Button>
          {/* <Timer initialTime={resendTimerValue} direction="backward">
            {({ start, stop, reset, getTimerState }) => {
              const state = getTimerState();
              return (
                <Button
                  type="button"
                  variant="outlined"
                  className={classes.resendOtp}
                  disabled={
                    state === "INITED" ||
                    state === "PLAYING" ||
                    resendOtpStatus.isPending
                      ? true
                      : false
                  }
                  onClick={() => handleResendClick({ start, stop, reset })}
                >
                  {state === "INITED" || state === "PLAYING" ? (
                    <>
                      RESEND In <Timer.Minutes />
                      {":"}
                      <Timer.Seconds />
                    </>
                  ) : state === "STOPPED" && resendOtpStatus.isPending ? (
                    <CircularProgress size={20} className={classes.loader} />
                  ) : (
                    "Resend"
                  )}
                </Button>
              );
            }}
          </Timer> */}

          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.validateOtp}
            disabled={otp.length < otpLength}
            onClick={handleValidateClick}
          >
            {validateOtpStatus.isPending ? (
              <CircularProgress size={20} className={classes.loader} />
            ) : (
                "Verify"
              )}
          </Button>
        </Box>
        <Box style={{ marginLeft: '25%', marginTop: '5px' }}>
          <Timer initialTime={resendTimerValue} direction="backward">
            {({ start, stop, reset, getTimerState, setTime }) => {
              const state = getTimerState();
              return (
                <Button
                  type="button"
                  variant="outlined"
                  className={classes.resendOtp}
                  disabled={
                    state === "INITED" ||
                      state === "PLAYING" ||
                      resendOtpStatus.isPending
                      ? true
                      : false
                  }
                  onClick={() =>
                    handleResendClick({ start, stop, reset, setTime })
                  }
                >
                  {state === "INITED" || state === "PLAYING" ? (
                    <>
                      RESEND In <Timer.Minutes />
                      {":"}
                      <Timer.Seconds
                        formatValue={(text) =>
                          text.toString().length > 1 ? text : "0" + text
                        }
                      />
                    </>
                  ) : state === "STOPPED" && resendOtpStatus.isPending ? (
                    <CircularProgress size={20} className={classes.loader} />
                  ) : (
                        "Resend"
                      )}
                </Button>
              );
            }}
          </Timer>
        </Box>
      </div>
    </Grid>
  );
}

export default OTPForm;
