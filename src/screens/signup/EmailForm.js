import React, { useState } from "react";
import {
  Paper,
  InputLabel,
  TextField,
  Box,
  Grid,
  Button,
  Typography,
  Link,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import { Email as EmailIcon } from "@material-ui/icons";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { emailSchema } from "./form-validations";
import { emailFormStyles as useStyles } from "./styles";
import { useAuth } from "../../contexts/auth-context";


function EmailForm({ formValues, setFormValues }) {
  const [formValidation, setFormValidation] = useState({
    isValid: true,
    message: "",
  });
  const { logout } = useAuth();

  const history = useHistory();
  const sendOtpApiStatus = useCallbackStatus();
  const registerReqSource = useCancelRequest();
  const notification = useSnackbar();
  const classes = useStyles();

  const sendOtp = async (apiBody) => {
    try {
      const res = await sendOtpApiStatus.run(
        apiClient("POST", "common", "sendresendotp", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: registerReqSource.token,
          enableLogging: true,
        })
      );
      window.sessionStorage.setItem('email', apiBody.email)
      window.localStorage.setItem('wait_time', res.content.wait_time)
      if (res && res.content.data === true) {
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
        history.push("/register?currentStep=otp");
      }
    } catch (error) {
      if (error.code === 401) {
        logout()
      }
      console.error(error);
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const checkUserStatus = async (apiBody) => {
    try {
      const res = await sendOtpApiStatus.run(
        apiClient("POST", "common", "checkUserExists", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: registerReqSource.token,
        })
      );

      if (res.content.data === true) {
        apiBody.action_type = 'registration'
        sendOtp(apiBody);
      } else {
        // handle the validation error
        notification.enqueueSnackbar(res.message, {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      if (error.code === 401) {
        logout()
      }
      // handle the validation error
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleEmailInputChange = (e) => {
    if (formValidation.isValid === false) {
      setFormValidation({
        isValid: true,
        message: "",
      });
    }
    setFormValues({ ...formValues, email: e.target.value });
  };

  const handleSendClick = (event) => {
    event.preventDefault();
    emailSchema
      .validate({ email: formValues.email })
      .then(() => {
        checkUserStatus({ email: formValues.email, entity_type: "learner" });
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
      elevation={6}
      square
      className={classes.paperContainer}
    >
      <form onSubmit={handleSendClick}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h3" className={classes.pageTitle}>
            Register
          </Typography>
          <Typography
            component="h2"
            variant="subtitle1"
            className={classes.pageSubTitle}
          >
            Please enter your Email address to receive one time password
          </Typography>

          <Box className={classes.formInputGroup}>
            <InputLabel htmlFor="user-email" className={classes.formInputLabel}>
              Email ID
            </InputLabel>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              id="user-email"
              name="email"
              value={formValues.email}
              onChange={handleEmailInputChange}
              error={!formValidation.isValid}
              autoComplete="email"
              className={classes.formInputField}
              placeholder="Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon
                      fontSize="small"
                      className={classes.icon}
                      color={!formValidation.isValid ? "error" : undefined}
                    />
                  </InputAdornment>
                ),
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

            <Typography
              component="p"
              variant="caption"
              className={classes.privacyText}
            >
              By Continuing you agree to the{" "}
              <Link
                href="/terms-and-conditions"
                target="_blank"
                className={classes.externalLink}
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className={classes.externalLink}
              >
                Privacy Policy
              </Link>
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={sendOtpApiStatus.isPending}
          >
            {sendOtpApiStatus.isPending ? (
              <CircularProgress size={20} className={classes.loader} />
            ) : (
                "Next"
              )}
          </Button>

          <Grid container justify="center">
            <Grid item>
              <Typography
                variant="body1"
                component="p"
                className={classes.signupLinkText}
              >
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  variant="body1"
                  to="/login"
                  className={classes.signupLink}
                >
                  Login
                </Link>{" "}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </form>
    </Grid>
  );
}

export default EmailForm;
