import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  InputLabel,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { Email as EmailIcon } from "@material-ui/icons";
import { useAuth } from "./../../contexts/auth-context";

import AppWrapper from "../../components/app-wrapper";
import useCallbackStatus from "../../hooks/use-callback-status";
import { apiClient } from "../../utils/api-client";
import SEO from "../../components/seo";
import * as yup from "yup";

export const forgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email!")
    .required("Email is required"),
});

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "100px",

      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2),
      },
    },
    image: {
      backgroundColor: theme.palette.primary.main_secondary,
    },
    paperContainer: {
      backgroundColor: theme.palette.custom.primaryBackground,
      boxShadow: "0 0 30px 0 rgba(0, 0, 0, 0.1)",
      borderRadius: "5px",
      maxWidth: "500px",
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    paper: {
      margin: theme.spacing(0, 5),
      paddingBottom: theme.spacing(4),
      paddingTop: theme.spacing(4),
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      backgroundColor: theme.palette.custom.primaryBackground,
    },
    pageTitle: {
      width: "100%",
      fontSize: "18px",
      fontWeight: 600,
      textAlign: "center",
      color: "#494b47",
    },
    pageSubTitle: {
      marginTop: theme.spacing(1),
      color: theme.palette.custom.contrastText,
      fontSize: "14px",
      fontWeight: 400,
      textAlign: "center",
      color: "#334856",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
      display: "flex",
      flexDirection: "column",
    },
    formInputGroup: {
      marginBottom: theme.spacing(4),
    },
    formInputLabel: {
      color: theme.palette.primary.text,
      fontSize: "14px",
      fontWeight: 500,
    },
    formInputField: {
      marginTop: theme.spacing(1),
    },
    submit: {
      alignSelf: "center",
      marginTop: theme.spacing(2),
      minWidth: "150px",
      backgroundColor: theme.palette.secondary.main,
      fontWeight: 600,
      textTransform: "uppercase",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      },
    },
    signupLinkText: {
      marginTop: theme.spacing(1.5),
      fontSize: "14px",
      fontWeight: 400,
      color: "#334856",
    },
    signupLink: {
      color: theme.palette.secondary.main,
      fontWeight: 700,
    },
    loader: {
      color: theme.palette.primary.contrastText,
    },
    icon: {
      color: "#c3c3c3",
    },
    errorMessage: {
      display: "inline-block",
      marginTop: theme.spacing(0),
      marginLeft: theme.spacing(0),
      color: theme.palette.error.main,
    },
  };
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [formValidation, setFormValidation] = useState({
    isValid: true,
    message: "",
    path: "",
  });
  const history = useHistory();

  const forgotPasApiStatus = useCallbackStatus();
  const classes = useStyles();
  const notification = useSnackbar();

  const { logout } = useAuth();

  // eslint-disable-next-line
  const sendResetPassLink = async (apiBody) => {
    try {
      const res = await forgotPasApiStatus.run(
        apiClient("POST", "common", "sendresendotp", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
        })
      );

      const { data } = res.content;
      window.localStorage.setItem("email", apiBody.email);
      window.localStorage.setItem('wait_time', res.content.wait_time)
      window.localStorage.setItem(
        "name",
        `${data.first_name} ${data.last_name}`
      );
      history.push("/otpverification");
      notification.enqueueSnackbar("OTP sent Successfully", {
        variant: "success",
        autoHideDuration: 2000,
      });
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

  const handleLogin = (e) => {
    e.preventDefault();
    forgetPasswordSchema
      .validate({ email })
      .then(() => {
        sendResetPassLink({
          email,
          entity_type: "learner",
          action_type: "forgot_password",
        });
      })
      .catch((error) => {
        setFormValidation({
          isValid: false,
          message: error.message,
          path: error.path,
        });
      });
  };

  return (
    <AppWrapper hideFooter>
      <SEO
        title="Midigiworld - Forgot Password"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Grid container component="main" className={classes.root}>
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
            <Typography
              component="h1"
              variant="h3"
              className={classes.pageTitle}
            >
              Forgot your password
            </Typography>
            <Typography
              component="h2"
              variant="subtitle2"
              className={classes.pageSubTitle}
            >
              No worries! Enter your registered email and we will send you a
              reset password email
            </Typography>
            <form className={classes.form} noValidate>
              <Box className={classes.formInputGroup}>
                <InputLabel
                  htmlFor="user-email"
                  className={classes.formInputLabel}
                >
                  Email
                </InputLabel>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="user-email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    if (formValidation.isValid === false) {
                      setFormValidation({
                        isValid: true,
                        message: "",
                        path: "",
                      });
                    }
                    setEmail(e.target.value);
                  }}
                  error={
                    formValidation.path === "email" && !formValidation.isValid
                  }
                  autoComplete="email"
                  autoFocus
                  className={classes.formInputField}
                  placeholder="Enter your email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon
                          className={classes.icon}
                          fontSize="small"
                          color={
                            formValidation.path === "email" &&
                              !formValidation.isValid
                              ? "error"
                              : undefined
                          }
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                {formValidation.path === "email" &&
                  formValidation.isValid === false ? (
                    <Typography
                      component="span"
                      variant="caption"
                      className={classes.errorMessage}
                    >
                      {formValidation.message}
                    </Typography>
                  ) : null}
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleLogin}
                disabled={forgotPasApiStatus.isPending}
              >
                {forgotPasApiStatus.isPending ? (
                  <CircularProgress size={20} className={classes.loader} />
                ) : (
                    "Send"
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
            </form>
          </div>
        </Grid>
      </Grid>
    </AppWrapper>
  );
}

export default ForgotPassword;
