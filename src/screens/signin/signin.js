import React, { useState, useEffect } from "react";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import AppleSignin from "react-apple-signin-auth"
import AppleIcon from '@material-ui/icons/Apple';
import GoogleIcon from "./../../assets/images/googleIcon.png"
import FacebookIcon from "./../../assets/images/facebookIcon.jpg"

import 'firebase/auth'
import AppleLogin from "react-apple-login"
import firebase from './firebase'
import PhoneNumber from "awesome-phonenumber"
import {
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import AskDialog from "./dialog";
import { makeStyles } from "@material-ui/core/styles";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@material-ui/icons";
import { useSnackbar } from "notistack";

import AppWrapper from "../../components/app-wrapper";
import SocialButton from "../../components/social-button";
import { useAuth } from "../../contexts/auth-context";
import { useUser } from "../../contexts/user-context";
import useToggle from "../../hooks/useToggle";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { loginSchema } from "./form-validations";

import Logo from "../../assets/images/logo-login-page.svg";
import GoogleLogo from "../../assets/images/google.svg";
import FacebookLogo from "../../assets/images/facebook-1.svg";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      margin: theme.spacing(4.5, 0),

      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
        margin: theme.spacing(0),
      },
    },
    image: {
      backgroundColor: theme.palette.primary.main_secondary,
    },
    paperContainer: {
      backgroundColor: theme.palette.custom.primaryBackground,
      boxShadow: "0px 0px 30px #00000019",
      borderRadius: "5px",
    },
    partOne: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderTopLeftRadius: "5px",
      borderBottomLeftRadius: "5px",
      backgroundColor: "#03579c",

      [theme.breakpoints.down("sm")]: {
        height: "200px",
        borderTopRightRadius: "5px",
        borderBottomLeftRadius: "0px",
      },
    },
    welcomeMsg: {
      marginBottom: theme.spacing(3),
      color: theme.palette.primary.contrastText,
      fontSize: "20px",
      fontWeight: 600,
    },
    loginFormContainer: {
      width: "100%",
      backgroundColor: "#fff",
      padding: theme.spacing(3, 4),
      borderTopRightRadius: "5px",
      borderBottomRightRadius: "5px",

      [theme.breakpoints.down("sm")]: {
        borderTopRightRadius: "0px",
        borderBottomLeftRadius: "5px",
      },
    },
    paper: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      backgroundColor: "#fff",
    },
    pageTitle: {
      fontSize: "28px",
      fontWeight: 600,
      textAlign: "center",
      width: "100%",
      color: "#494b47",
    },
    socialBtnContainer: {
      marginTop: theme.spacing(2),
    },
    socialBtn: {
      backgroundColor: "#fafcfd",
      textTransform: "none",
      border: "1px solid #d9dfe5",
      padding: theme.spacing(1, 3.5),
    },
    socialBtnLabel: {
      color: "#707070",
      fontSize: "14px",
      fontWeight: 400,
    },
    socialLogo: {
      marginRight: theme.spacing(1),
    },
    contentSeparater: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: "100%",
      fontSize: "14px",
      fontWeight: 500,
      textAlign: "center",
    },
    apple: {
      marginTop: theme.spacing(2),
      width: "100%",
      fontSize: "18px",
      fontWeight: 500,
      textAlign: "center",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      display: "flex",
      flexDirection: "column",
    },
    formInputGroup: {
      marginBottom: theme.spacing(0.8),
    },
    formInputLabel: {
      color: theme.palette.primary.text,
      fontSize: "14px",
      fontWeight: 500,
    },
    formInputField: {
      marginTop: theme.spacing(1),
      backgroundColor: "#fafcfd",
    },
    errorMessage: {
      display: "inline-block",
      marginTop: theme.spacing(0),
      marginLeft: theme.spacing(0),
      color: theme.palette.error.main,
    },
    submit: {
      alignSelf: "center",
      marginTop: theme.spacing(7),
      minWidth: "150px",
      backgroundColor: theme.palette.secondary.main,
      fontSize: "15px",
      fontWeight: 600,
      boxShadow: "none",
      "&:hover": {
        backgroundColor: theme.palette.secondary.main,
      },
    },
    forgotPasswordLink: {
      color: theme.palette.secondary.main,
      fontSize: "14px",
      fontWeight: 600,
      textTransform: "uppercase",
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
    googleBtn: {
      // paddingRight: "10px",
      [theme.breakpoints.down("sm")]: {
        paddingRight: "0px",
        marginBottom: theme.spacing(2),
      },
    },
  };
});

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ren, setRen] = useState(Math.random());
  const [open, setopen] = useState(false);
  const [myBody, setMyBody] = useState({});
  const [formValidation, setFormValidation] = useState({
    isValid: true,
    message: "",
    path: "",
  });
  const { logout } = useAuth();
  var provider = new firebase.auth.OAuthProvider('apple.com');
  var provider2 = new firebase.auth.GoogleAuthProvider();
  var provider3 = new firebase.auth.FacebookAuthProvider();



  const [is_mi_user, setIsMiUser] = useState(false);
  const [is_purchased, setIsPurchased] = useState(0);

  const { setUserDetails } = useAuth();
  const { setUser } = useUser();
  const history = useHistory();
  const location = useLocation();
  const loginApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const passwordToggle = useToggle();
  const classes = useStyles();
  const notification = useSnackbar();

  const handleClose = () => {
    setopen(false);
    window.location.reload();
  };
  const handleDone = () => {
    setopen(false);
  };

  const redirectionAfterLogin = () => {
    const { state } = location;

    if (state && state.from) {
      history.push(state.from, {
        ...state,
      });
    } else {
      window.setTimeout(() => {
        history.push("/home");
      }, 1000);


    }
  };

  const isEncrptionEnableInChat = async () => {
    const res = await loginApiStatus.run(
      apiClient("POST", "course_setting", "getcourseconfiguration", {
        body: { config_name: 'is_encryption_enabled' },
        shouldUseDefaultToken: true,
        cancelToken: apiSource.token,
        enableLogging: true,
      })
    );

    console.log("getcourseconfiguration schedule-session-slot: ", res)
    localStorage.setItem('is_encryption_enabled', res.content.data[0].unit)
  }

  const login = async (apiBody) => {
    try {
      const res = await loginApiStatus.run(
        apiClient("POST", "learner", "learnerlogin", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );
      isEncrptionEnableInChat()
      const {
        content: { data },
      } = res;

      const obj = {
        id: data.id,
        email: data.email,
        name: `${data.first_name} ${data.last_name}`,
        // secret: data.secret,
        customer_id: data.stripe_customer_id,
        is_mi_user: data.is_mi_user,
        participant_id: data.participant_id,
        is_subscription_purchased: data.is_subscription_purchased,
      };
      setIsMiUser(data.is_mi_user);
      setIsPurchased(data.is_subscription_purchased);
      if (data.is_mi_user && data.is_subscription_purchased) {
        obj.secret = data.secret
      }
      else if (!data.is_mi_user) {
        obj.secret = data.secret
      }
      setUserDetails({ ...obj, authenticated: 1 });
      setUser({ ...obj, authenticated: true });
      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
      window.localStorage.setItem('is_logged_in', 1)


      if (data.is_mi_user && data.is_subscription_purchased) {
        redirectionAfterLogin();
      } else if (!data.is_mi_user) {
        redirectionAfterLogin();
      } else {
        history.push("/subscription");
      }
    } catch (error) {
      console.log(error)
      if (error.code === 401) {
        logout();
      }
      if (
        error.message ===
        "You are already logged in with another device. Do you want to contine to login here?"
      ) {
        setopen(true);
        apiBody.is_force_login = true
        console.log(apiBody)
        setMyBody(apiBody)
      } else if (error.code === 500) {
        notification.enqueueSnackbar(error.userMessage, {
          variant: "error",
          autoHideDuration: 2000,
        })
      } else {
        notification.enqueueSnackbar(error.message, {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    }
  };

  const loginViaSocialMedia = async (apiBody) => {
    try {
      const res = await loginApiStatus.run(
        apiClient("POST", "learner", "learner/sociallogin", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );
      const {
        content: {
          data: { is_complete_profile },
        },
      } = res;

      handleDone();
      if (is_complete_profile) {
        const obj = {
          id: res.content.data.id,
          email: res.content.data.email,
          secret: res.content.data.secret,
          customer_id: res.content.data.stripe_customer_id,
          is_mi_user: res.content.data.is_mi_user,
          is_subscription_purchased: res.content.data.is_subscription_purchased,
        };
        setIsMiUser(res.content.data.is_mi_user);
        setIsPurchased(res.content.data.is_subscription_purchased);
        if (res.content.data.is_mi_user && res.content.data.is_subscription_purchased) {
          obj.secret = res.content.data.secret
        }

        else if (!res.content.data.is_mi_user) {
          obj.secret = res.content.data.secret
        }
        setUserDetails(obj);
        setUser({ ...obj, authenticated: true });
        window.localStorage.setItem('is_logged_in', 1);

        if (
          res.content.data.is_mi_user &&
          res.content.data.is_subscription_purchased
        ) {
          redirectionAfterLogin();
        } else if (!res.content.data.is_mi_user) {
          redirectionAfterLogin();
        } else {
          history.push("/subscription");
        }

        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
      } else {
        history.push("/register?currentStep=profile", {
          user_data: { ...res.content.data },
          is_socialMedia_login: true,
        });
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      if (
        error.message ===
        "You are already logged in with another device. Do you want to contine to login here?"
      ) {
        setopen(true);
      } else {
        notification.enqueueSnackbar(error.userMessage, {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      apiSource.cancel();
    };

    // eslint-disable-next-line
  }, []);


  const handleSocialLogin = (user) => {
    console.log(user)
    const body = {
      type: user._provider,
      first_name: user._profile.firstName,
      last_name: user._profile.lastName,
      email: user._profile.email,
      // profile_file_name: user._profile.profilePicURL,
      is_force_login: false,
    };
    setMyBody({
      type: user._provider,
      first_name: user._profile.firstName,
      last_name: user._profile.lastName,
      email: user._profile.email,
      // profile_file_name: user._profile.profilePicURL,
      is_force_login: true,
    });
    loginViaSocialMedia(body);
  };

  const handleSocialLoginFailure = (error) => {
    // window.location.reload();
    // console.error(error);
    // window.location.reload();
    // notification.enqueueSnackbar(
    //   "Something went wrong while logging in using social media",
    //   {
    //     variant: "error",
    //     autoHideDuration: 2000,
    //     onExited: () => {
    //       // window.location.reload();
    //     },
    //   }
    // );
  };

  const signInWithFacebook = () => {
    firebase
      .auth()
      .signInWithPopup(provider3)
      .then((result) => {
        console.log(result)
        if (result.additionalUserInfo) {
          var user = result.additionalUserInfo.profile;
          const body = {
            type: 'facebook',
            first_name: user.given_name,
            last_name: user.family_name,
            email: user.email,
            // profile_file_name: user._profile.profilePicURL,
            is_force_login: false,
          };
          setMyBody({
            type: 'facebook',
            first_name: user.given_name,
            last_name: user.family_name,
            email: user.email,
            // profile_file_name: user._profile.profilePicURL,
            is_force_login: false,
          });
          loginViaSocialMedia(body);
        }
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const signInWithGoogle = () => {
    firebase.auth()
      .signInWithPopup(provider2)
      .then((result) => {
        var user = result.additionalUserInfo.profile;
        const body = {
          type: 'google',
          first_name: user.given_name,
          last_name: user.family_name,
          email: user.email,
          // profile_file_name: user._profile.profilePicURL,
          is_force_login: false,
        };
        setMyBody({
          type: 'google',
          first_name: user.given_name,
          last_name: user.family_name,
          email: user.email,
          // profile_file_name: user._profile.profilePicURL,
          is_force_login: false,
        });
        loginViaSocialMedia(body);
        // ...
      }).catch((error) => {
        console.log(error)
      });
  }

  const signInWithApple = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;
        console.log(result.user)
        var body = {
          type: 'apple',
          is_force_login: false,
          apple_id: result.user.providerData[0].email,
          email: result.user.providerData[0].email
        }
        setMyBody({
          type: 'apple',
          email: result.user.providerData[0].email,
          apple_id: result.user.providerData[0].email,
          // profile_file_name: user._profile.profilePicURL,
          is_force_login: true,
        });
        loginViaSocialMedia(body)
        // You can also get the Apple OAuth Access and ID Tokens.
        var accessToken = credential.accessToken;
        var idToken = credential.idToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  }

  const handleLogin = (e) => {
    e.preventDefault();
    loginSchema
      .validate({ password })
      .then(() => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.length >= 10) {
          let em = email;
          let k = em.replace(/ +/g, "");
          if (/^\d+$/.test(k.substring(1))) {
            var pn = new PhoneNumber(email);
            if (!pn.isValid() && !pn.isMobile()) {
              var pnn = new PhoneNumber("+91 " + email);
              if (!pnn.isValid() && !pnn.isMobile()) {
                var pnnn = new PhoneNumber("+91 " + email.substring(3));
                if (!pnnn.isValid() && !pnnn.isMobile()) {
                  setFormValidation({
                    isValid: false,
                    message: "Enter Valid email or phone number",
                    path: 'email',
                  });
                }
                else {
                  login({ phone_number: "+91 " + email.substring(3), password, is_force_login: false });
                }
              }
              else {
                login({ phone_number: "+91 " + email, password, is_force_login: false });
              }
            }
            else {
              if (email.substring(0, 4) === "+91 ") {
                login({ phone_number: email, password, is_force_login: false });
              }
              else if (email.substring(0, 3) === "+91") {
                login({ phone_number: "+91 " + email.substring(3), password, is_force_login: false });
              }
              else {
                login({ phone_number: email, password, is_force_login: false });

              }
            }
          }
          else if (re.test(email)) {
            login({ email: email, password, is_force_login: false });
          }
          else {
            setFormValidation({
              isValid: false,
              message: "Enter Valid email or phone number",
              path: 'email',
            });
          }
        }
        else {
          setFormValidation({
            isValid: false,
            message: "Enter Valid email or phone number",
            path: 'email',
          });
        }
        // login({ phone_number: "+91 8239683753", password, is_force_login: false });
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
        title="Midigiworld - Login"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Grid container className={classes.root}>
        <CssBaseline />
        <Grid
          item
          container
          xs={12}
          md={7}
          component={Paper}
          elevation={6}
          className={classes.paperContainer}
        >
          <Grid item xs={12} md={4} className={classes.partOne}>
            {/* <Typography
              component="h1"
              variant="h3"
              className={classes.welcomeMsg}
            >
              Welcome
            </Typography> */}
            <img src={Logo} alt="Midigiworld" />
          </Grid>
          <Grid item xs={12} md={8} className={classes.loginFormContainer}>
            <div className={classes.paper}>
              <Typography
                component="h2"
                variant="h3"
                className={classes.pageTitle}
              >
                Login
              </Typography>

              <Grid
                container
                spcaing={2}
                className={classes.socialBtnContainer}
              >
                <Grid item xs={12} sm={6} className={classes.googleBtn}>
                  <Button
                    variant="outlined"
                    style={{ color: '#d9dfe5', textTransform: 'none', background: '#fafcfd', width: '90%', height: "38px" }}
                    onClick={signInWithGoogle}
                    fullWidth
                    className={classes.button}
                    startIcon={<img src={GoogleIcon} height="20px" width="25px"></img>}
                  >
                    <Typography style={{ fontSize: "14px", fontWeight: 300, color: '#707070' }}>
                      Signin with Google
                  </Typography>
                  </Button>
                  {/* <SocialButton
                    provider="google"
                    appId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    variant="outlined"
                    fullWidth
                    className={classes.socialBtn}
                  >
                    <img
                      src={GoogleLogo}
                      alt="Google"
                      className={classes.socialLogo}
                    />
                    <span className={classes.socialBtnLabel}>
                      Signin with Google
                    </span>
                  </SocialButton> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    style={{ color: '#d9dfe5', textTransform: 'none', background: '#fafcfd', width: '90%', height: "38px" }}
                    onClick={signInWithFacebook}
                    className={classes.button}
                    startIcon={<img src={FacebookIcon} height="35px" width="35px"></img>}
                  >
                    <Typography style={{ fontSize: "14px", fontWeight: 300, color: '#707070' }}>
                      Signin with Facebook
                  </Typography>
                  </Button>
                  {/* <SocialButton
                    provider="facebook"
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    variant="outlined"
                    fullWidth
                    className={classes.socialBtn}
                  >
                    <img
                      src={FacebookLogo}
                      alt="Facebook"
                      className={classes.socialLogo}
                    />
                    <span className={classes.socialBtnLabel}>
                      Signin with Facebook
                    </span>
                  </SocialButton> */}
                </Grid>
              </Grid>
              <Typography
                component="h1"
                variant="h3"
                className={classes.apple}
              >

                <Button
                  variant="outlined"
                  style={{ color: '#d9dfe5', textTransform: 'none', background: '#fafcfd', width: '50%', height: "38px" }}
                  onClick={signInWithApple}
                  className={classes.button}
                  startIcon={<AppleIcon style={{ color: 'black' }} />}
                >
                  <Typography style={{ fontSize: "14px", fontWeight: 300, color: '#707070' }}>
                    Signin with Apple
                  </Typography>
                </Button>
              </Typography>
              <Typography
                component="h1"
                variant="h3"
                className={classes.contentSeparater}
              >
                - OR -
              </Typography>

              <form className={classes.form} noValidate>
                <Box className={classes.formInputGroup}>
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
                    placeholder="Email or Phone no"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            fontSize="small"
                            className={classes.icon}
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
                <Box className={classes.formInputGroup}>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    fullWidth
                    name="password"
                    value={password}
                    onChange={(e) => {
                      if (formValidation.isValid === false) {
                        setFormValidation({
                          isValid: true,
                          message: "",
                          path: "",
                        });
                      }
                      setPassword(e.target.value);
                    }}
                    error={
                      formValidation.path === "password" &&
                      !formValidation.isValid
                    }
                    type={passwordToggle.on ? "text" : "password"}
                    id="user-password"
                    autoComplete="current-password"
                    className={classes.formInputField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon
                            fontSize="small"
                            className={classes.icon}
                            color={
                              formValidation.path === "password" &&
                                !formValidation.isValid
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
                    placeholder="Enter your password"
                  />
                  {formValidation.path === "password" &&
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
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link
                      component={RouterLink}
                      variant="body1"
                      to="/forgot-password"
                      className={classes.forgotPasswordLink}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleLogin}
                  disabled={loginApiStatus.isPending}
                >
                  {loginApiStatus.isPending ? (
                    <CircularProgress size={20} className={classes.loader} />
                  ) : (
                      "LogIn"
                    )}
                </Button>
                <Grid container justify="center">
                  <Grid item>
                    <Typography
                      variant="body1"
                      component="p"
                      className={classes.signupLinkText}
                    >
                      Don't have an account?{" "}
                      <Link
                        component={RouterLink}
                        variant="body1"
                        to="/register"
                        className={classes.signupLink}
                      >
                        Register
                      </Link>{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Grid>
        </Grid>
      </Grid>
      {open && (
        <AskDialog
          handleClose={handleClose}
          loginViaSocialMedia={loginViaSocialMedia}
          login={login}
          myBody={myBody}
        />
      )}
    </AppWrapper>
  );
}

export default LogIn;
