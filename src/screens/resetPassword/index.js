import React from "react";
import {
  Button,
  InputLabel,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  InputAdornment,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  FormHelperText,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useFormik } from "formik";

import AppWrapper from "../../components/app-wrapper";
import FeedbackCard from "../../components/feedback-cards";
import useToggle from "../../hooks/useToggle";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import useCallbackStatus from "../../hooks/use-callback-status";
import { apiClient } from "../../utils/api-client";
import { resetSchema } from "./validations";

import RESETPASSWORD_SUCCESS from "../../assets/images/feedback-password-change-success.svg";
import { useAuth } from "../../contexts/auth-context";

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
    },
    paper: {
      padding: theme.spacing(3, 4),
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
      backgroundColor: theme.palette.custom.primaryBackground,
    },
    pageTitle: {
      fontSize: "18px",
      fontWeight: 600,
      textAlign: "center",
      color: "#494b47",
    },
    pageSubTitle: {
      width: "100%",
      color: theme.palette.custom.contrastText,
      fontWeight: 500,
      textAlign: "center",
    },
    errorMessage: {
      display: "inline-block",
      fontSize: "12px",
      marginLeft: theme.spacing(0),
      color: theme.palette.error.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(5),
      display: "flex",
      flexDirection: "column",
    },
    formInputGroup: {
      marginBottom: theme.spacing(1.5),
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
      marginTop: theme.spacing(3),
      minWidth: "150px",
      backgroundColor: theme.palette.secondary.main,
      fontWeight: 600,
      textTransform: "uppercase",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      },
    },
    forgotPasswordLink: {
      display: "inline-block",
      width: "100%",
      textAlign: "right",
    },
    signupLinkText: {
      marginTop: theme.spacing(4),
    },
    signupLink: {
      color: theme.palette.secondary.main,
      fontWeight: 700,
    },
    loader: {
      color: theme.palette.primary.contrastText,
    },
    passwordChangeSuccessBox: {
      "& .MuiDialogContent-root": {
        padding: 0,
      },
    },
    helperText: {
      color: "#504A50",
      fontSize: "12px",
      fontWeight: 500,
    },
    icon: {
      color: "#c3c3c3",
    },
  };
});

function ForgotPassword() {
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetSchema,
    onSubmit: handleLogin,
  });
  const forgotPasApiStatus = useCallbackStatus();
  const classes = useStyles();
  const notification = useSnackbar();
  const { logout } = useAuth();

  const passwordToggle = useToggle();
  const confirmpasswordToggle = useToggle();
  const passwordChangeSuccess = useToggle();

  // eslint-disable-next-line
  const resetPassword = async (apiBody) => {
    try {
      const res = await forgotPasApiStatus.run(
        apiClient("POST", "learner", "learner/updatepassword", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
        })
      );

      if (res.content && !res.error) {
        passwordChangeSuccess.toggle();
      }

      notification.enqueueSnackbar(res.message, {
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
        onClose: () => {
          window.localStorage.clear();
          history.replace("/forgot-password");
        },
      });
    }
  };

  function handleLogin(values, formActions) {
    console.log(values, formActions);
    const name = window.localStorage.getItem("name");

    if (
      values.password
        .toLowerCase()
        .includes(name.toLowerCase().split(" ")[0]) ||
      values.password.toLowerCase().includes(name.toLowerCase().split(" ")[1])
    ) {
      formActions.setFieldError(
        "password",
        "Password must not include your name"
      );
      return;
    }

    resetPassword({
      password: values.password,
      otp: window.localStorage.getItem("otp"),
      email: window.localStorage.getItem("email"),
    });
  }

  const handleSuccessDialogClose = () => {
    window.localStorage.clear();
    history.push("/login");
  };

  return (
    <AppWrapper hideFooter>
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
              Reset Your Password
            </Typography>

            <form
              className={classes.form}
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <Box className={classes.formInputGroup}>
                <InputLabel
                  htmlFor="user-password"
                  className={classes.formInputLabel}
                >
                  New Password
                </InputLabel>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  type={passwordToggle.on ? "text" : "password"}
                  id="user-password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  autoFocus
                  className={classes.formInputField}
                  placeholder="Enter new Password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          fontSize="small"
                          className={classes.icon}
                          color={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                              ? "error"
                              : undefined
                          }
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={passwordToggle.toggle}
                        >
                          {passwordToggle.on ? (
                            <VisibilityIcon
                              fontSize="small"
                              className={classes.icon}
                            />
                          ) : (
                            <VisibilityOffIcon
                              fontSize="small"
                              className={classes.icon}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography
                  component="span"
                  variant="body1"
                  className={classes.errorMessage}
                >
                  {formik.touched.password && formik.errors.password}
                </Typography>
                <FormHelperText className={classes.helperText}>
                  Your password must be 8 characters long and should not contain
                  your first & last name
                </FormHelperText>
              </Box>
              <Box className={classes.formInputGroup}>
                <InputLabel
                  htmlFor="user-confirm-password"
                  className={classes.formInputLabel}
                >
                  Confirm Password
                </InputLabel>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  type={confirmpasswordToggle.on ? "text" : "password"}
                  id="user-confirm-password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  autoFocus
                  className={classes.formInputField}
                  placeholder="Enter Confirm Password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon
                          fontSize="small"
                          className={classes.icon}
                          color={
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                              ? "error"
                              : undefined
                          }
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={confirmpasswordToggle.toggle}
                        >
                          {confirmpasswordToggle.on ? (
                            <VisibilityIcon
                              fontSize="small"
                              className={classes.icon}
                            />
                          ) : (
                            <VisibilityOffIcon
                              fontSize="small"
                              className={classes.icon}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography
                  component="span"
                  variant="body1"
                  className={classes.errorMessage}
                >
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                // onClick={handleLogin}
                disabled={forgotPasApiStatus.isPending}
              >
                {forgotPasApiStatus.isPending ? (
                  <CircularProgress size={20} className={classes.loader} />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </div>
        </Grid>
        <Dialog
          open={passwordChangeSuccess.on}
          onClose={passwordChangeSuccess.toggle}
          aria-labelledby="Registration Successful"
          className={classes.passwordChangeSuccessBox}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogContent>
            <FeedbackCard
              imgSrc={RESETPASSWORD_SUCCESS}
              cardText="Password changed successfully"
              btnText={"thanks".toUpperCase()}
              onClick={handleSuccessDialogClose}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    </AppWrapper>
  );
}

export default ForgotPassword;
