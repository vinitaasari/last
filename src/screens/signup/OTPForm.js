import React, { useState } from "react";
import {
  Paper,
  Box,
  Grid,
  IconButton,
  Button,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { KeyboardBackspace as KeyboardBackspaceIcon } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import OtpInput from "react-otp-input";
import Timer from "react-compound-timer";
import { useSnackbar } from "notistack";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { otpSchema } from "./form-validations";
import { otpFormStyles as useStyles } from "./styles";
import { useAuth } from "../../contexts/auth-context";

function OTPForm({ otpLength, formValues, setFormValues }) {
  const [resendTimerValue, setResendTimerValue] = useState(parseInt(window.localStorage.getItem('wait_time')) * 1000);
  const [formValidation, setFormValidation] = useState({
    isValid: true,
    message: "",
  });

  const history = useHistory();
  const resendOtpStatus = useCallbackStatus();
  const validateOtpStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const classes = useStyles();
  const muiTheme = useTheme();
  const notification = useSnackbar();
  const { logout } = useAuth();

  const handleOtpChange = (otp) => {
    if (formValidation.isValid === false) {
      setFormValidation({
        isValid: true,
        message: "",
      });
    }
    setFormValues({ ...formValues, otp });
  };

  const handleBackClick = () => {
    history.push("/register?currentStep=email");
  };

  const resendOtp = async (apiBody, cb, timerActions) => {
    try {
      const res = await resendOtpStatus.run(
        apiClient("POST", "common", "sendresendotp", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );
      // alert(res.content.data.otp)
      setResendTimerValue(res.content.wait_time * 1000);
      timerActions.setTime(res.content.wait_time * 1000);
      timerActions.reset();
      timerActions.start();
      if (res.content.data === true) {
        cb();
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      // alert(error.message)
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

  const validateOtp = async (apiBody) => {
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
        if (res.content.access_token) {
          setFormValues({ ...formValues, access_token: res.content.access_token })
        }
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
        history.push("/register?currentStep=profile");
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

  const handleResendClick = (timerActions) => {
    const cb = () => {

    };

    resendOtp({ email: window.sessionStorage.getItem('email'), entity_type: "learner", action_type: 'registration' }, cb, timerActions);
  };

  const handleValidateClick = () => {
    otpSchema
      .validate({ otp: formValues.otp })
      .then(() => {
        validateOtp({
          email: formValues.email,
          otp: formValues.otp,
          entity_type: "learner",
          action_type: 'registration'
        });
      })
      .catch((error) => {
        console.log(error);
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
      elevation={6}
      square
      className={classes.paperContainer}
    >
      <div className={classes.paper}>
        <Box className={classes.formHeader}>
          <Box className={classes.backIcon}>
            <IconButton onClick={handleBackClick}>
              <KeyboardBackspaceIcon style={{ color: "#545551" }} />
            </IconButton>
          </Box>
          <Box display="flex" flexGrow="1" justifyContent="center">
            <Typography
              component="h1"
              variant="h3"
              className={classes.pageTitle}
            >
              Verification
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Typography
            component="p"
            variant="subtitle1"
            className={classes.pageSubTitle}
          >
            Enter the 6-digit code Midigiworld just sent to {formValues.email}
          </Typography>
        </Box>

        <OtpInput
          value={formValues.otp}
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

          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.validateOtp}
            disabled={formValues.otp.length < otpLength}
            onClick={handleValidateClick}
          >
            {validateOtpStatus.isPending ? (
              <CircularProgress size={20} className={classes.loader} />
            ) : (
                "Next"
              )}
          </Button>
        </Box>
      </div>
    </Grid>
  );
}

export default OTPForm;
