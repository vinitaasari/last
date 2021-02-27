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
import CssBaseline from "@material-ui/core/CssBaseline";
import { KeyboardBackspace as KeyboardBackspaceIcon } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import OtpInput from "react-otp-input";
import Timer from "react-compound-timer";
import { useSnackbar } from "notistack";

import AppWrapper from "../../components/app-wrapper";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { otpSchema } from "./form-validations";
import { otpFormStyles as useStyles } from "./style";
import { useAuth } from "../../contexts/auth-context";

function OTPForm() {
  const [resendTimerValue, setResendTimerValue] = useState(parseInt(window.localStorage.getItem('wait_time')) * 1000);
  const [otp, setOtp] = useState("");
  const [formValidation, setFormValidation] = useState({
    isValid: true,
    message: "",
  });
  const [times, setTimes] = useState(0);

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
    setOtp(otp);
  };

  const handleBackClick = () => {
    history.push("/forgot-password");
  };

  const resendOtp = async (apiBody, cb, timerActions) => {
    try {
      const res = await resendOtpStatus.run(
        apiClient("POST", "common", "sendresendotp", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );
      setResendTimerValue(res.content.wait_time * 1000);
      timerActions.setTime(res.content.wait_time * 1000);
      timerActions.reset();
      timerActions.start();
      cb();
      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
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

  const validateOtp = async (apiBody) => {
    try {
      const res = await validateOtpStatus.run(
        apiClient("POST", "common", "validateotp", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );
      if (res.content) {
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
        window.localStorage.setItem("otp", apiBody.otp);
        history.push("/reset-password");
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
    resendOtp(
      {
        email: window.localStorage.getItem("email"),
        entity_type: "learner",
        action_type: "forgot_password",
      },
      cb,
      timerActions
    );
  };

  const handleValidateClick = () => {
    otpSchema
      .validate({ otp: otp })
      .then(() => {
        validateOtp({
          email: window.localStorage.getItem("email"),
          entity_type: "learner",
          otp: otp,
          action_type: "forgot_password",
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
    <AppWrapper hideFooter>
      <Grid container className={classes.root}>
        <CssBaseline />
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
              <IconButton onClick={handleBackClick}>
                <KeyboardBackspaceIcon style={{ color: "#545551" }} />
              </IconButton>
              <Typography
                component="h1"
                variant="h3"
                className={classes.pageTitle}
              >
                Verification
              </Typography>
            </Box>
            <Typography
              component="p"
              variant="subtitle1"
              className={classes.pageSubTitle}
            >
              Enter the 6-digit code Midigiworld just sent to{" "}
              {window.localStorage.getItem("email")}
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
                          <Timer.Seconds />
                        </>
                      ) : state === "STOPPED" && resendOtpStatus.isPending ? (
                        <CircularProgress
                          size={20}
                          className={classes.loader}
                        />
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
                disabled={otp.length < 6}
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
      </Grid>
    </AppWrapper>
  );
}

export default OTPForm;
