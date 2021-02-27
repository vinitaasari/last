import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  FormHelperText,
  Grid,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";

import { KeyboardBackspace as KeyboardBackspaceIcon } from "@material-ui/icons";
import CouponIcon from "../../assets/images/coupon-icon.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";

import FeedbackCard from "../../components/feedback-cards";

import REGISTRATION_SUCCESS from "../../assets/images/feedback-registration-success.svg";

import { useAuth } from "../../contexts/auth-context";
import { useUser } from "../../contexts/user-context";
import useToggle from "../../hooks/useToggle";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { interestStyles as useStyles } from "./styles";
import SingleNotification from "./SingleNotification";

function PersonalInfoForm({ formValues, setFormValues }) {
  const [interests, setList] = useState([]);
  const [mi_user, setMiUser] = useState(false);
  const [referralError, setReferralError] = useState("")
  const [is_mi_user, setIsMiUser] = useState(false);
  const [is_purchased, setIsPurchased] = useState(0);

  const [preferences, setPreferences] = useState({
    is_preference_email: true,
    is_preference_sms: true,
    is_preference_push_notification: true,
  });

  const [allPreferred, setAllPreferred] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const referralDialog = useToggle();
  const successDialog = useToggle();
  const addLearnerStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const classes = useStyles();
  const notification = useSnackbar();

  const { setUserDetails } = useAuth();
  const { setUser } = useUser();
  const { logout } = useAuth();

  const handleSwitchChange = (checked, event, id) => {
    setPreferences((prevValues) => ({
      ...prevValues,
      [id]: checked,
    }));
  };

  useEffect(() => {
    if (allPreferred) {
      let newPreferences = {};
      for (const key in preferences) {
        newPreferences = { ...newPreferences, [key]: true };
      }
      setPreferences(newPreferences);
    }
  }, [allPreferred]);

  useEffect(() => {
    const allTrue =
      Object.keys(preferences).length !== 0 &&
      Object.keys(preferences).every((key) => preferences[key]);
    if (allTrue) {
      setAllPreferred(true);
    } else {
      setAllPreferred(false);
    }
  }, [preferences]);

  const handleBackClick = () => {
    if (location.state && location.state.is_socialMedia_login === true) {
      history.push("/register?currentStep=interests", { ...location.state });
    } else {
      history.push("/register?currentStep=interests");
    }
  };

  const handleNextClick = () => {
    // const selectedList = interests
    //   .filter((item) => item.is_selected === true)
    //   .map((item) => item.id);
    // setFormValues({ ...formValues, interests: selectedList });
    referralDialog.toggle();
  };

  const addLearner = async (apiBody, cb, endpoint = "addlearner") => {
    try {
      const res = await addLearnerStatus.run(
        apiClient("POST", "learner", endpoint, {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      if (res.content && !res.error) {
        cb(res.content.data);
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
      }
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

  const referral = async (apiBody) => {
    try {
      const res = await addLearnerStatus.run(
        apiClient("POST", "learner", "validatelearnermiid", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );
      if (res.content.data) {
        const api_body = getAddLearnerApiBody(formValues);
        api_body.referrer_code = formValues.referrer_code;
        referralDialog.toggle();

        if (location.state && location.state.is_socialMedia_login === true) {
          addLearner(api_body, addLearnerCb, "/learner/completeprofile");
        } else {
          addLearner(api_body, addLearnerCb);
        }
      }


    } catch (error) {
      setReferralError("Enter Valid Code")

      if (error.code === 401) {
        logout();
      }
      // notification.enqueueSnackbar(error.message, {
      //   variant: "error",
      //   autoHideDuration: 2000,
      // });
    }
  };

  const addLearnerCb = (data) => {
    // setMiUser(data.is_mi_user);
    const obj = {
      id: data.id,
      email: data.email,
      name: `${data.first_name} ${data.last_name}`,
      secret: data.secret,
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
    window.localStorage.setItem('is_logged_in', 0)
    setUserDetails(obj);
    setUser({ ...obj, authenticated: true });
    successDialog.toggle();

    // const obj = {
    //   id: data.id,
    //   email: data.email,
    //   name: `${data.first_name} ${data.last_name}`,
    //   secret: data.secret,
    //   customer_id: data.stripe_customer_id || null,
    //   is_mi_user: data.is_mi_user,
    //   participant_id: data.participant_id,
    //   is_subscription_purchased: data.is_subscription_purchased,
    // };
    // setUserDetails(obj);
    // setUser({ ...obj, authenticated: true });
  };

  const handleFeedbackBtnClick = () => {
    successDialog.toggle();
    window.localStorage.removeItem("registrationForm");
    if (is_mi_user && !is_purchased) {
      history.push("/subscription");
      setIsMiUser(false);
      setIsPurchased(0)
      // setMiUser(false);
      // window.location.reload();
    } else if (is_mi_user && is_purchased) {
      history.push("/home");
      setIsMiUser(false);
      setIsPurchased(0)
      // setMiUser(false);
      // window.location.reload();
    } else {
      history.push("/home");
      // window.location.reload();
    }
  };

  const getAddLearnerApiBody = (values, isSocialMedia) => {
    const {
      first_name,
      last_name,
      email,
      password,
      country,
      age,
      gender,
      state,
      city,
      interests,
      languages,
    } = values;

    const body = {
      first_name,
      last_name,
      email,
      password,
      country,
      age: Number(age),
      gender,
      is_preference_sms: preferences.is_preference_sms,
      is_preference_email: preferences.is_preference_email,
      is_preference_push_notification:
        preferences.is_preference_push_notification,
      user_language: languages,
    };

    if (country === "India") {
      body.state = state;
      body.city = city;
    }

    if (interests.length > 0) {
      body.interest = [...interests];
    }

    if (location.state && location.state.is_socialMedia_login === true) {
      const {
        state: { user_data },
      } = location;
      body.id = user_data.id;

      delete body.email;
      delete body.password;
    }

    return body;
  };

  const handleReferralConfirm = () => {
    if (formValues.referrer_code) {

      referral({ mi_id: formValues.referrer_code })
    }
    else {
      setReferralError("Please Enter Code")
    }
  };

  const handleReferralCancel = () => {
    referralDialog.toggle();
    const api_body = getAddLearnerApiBody(formValues);
    if (location.state && location.state.is_socialMedia_login === true) {
      addLearner(api_body, addLearnerCb, "/learner/completeprofile");
    } else {
      addLearner(api_body, addLearnerCb);
    }
  };

  const cardSubText = <span>Registration Successfull</span>;

  return (
    <Grid
      item
      xs={12}
      component={Paper}
      elevation={6}
      square
      className={classes.paperContainer}
    >
      {" "}
      <Dialog
        open={referralDialog.on}
        onClose={referralDialog.toggle}
        aria-labelledby="Referral Code"
        className={classes.referralBox}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="form-dialog-title">
          <Typography className={classes.referralBoxTitle}>
            Do you have a referral code?
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.referralBoxContent}>
          <TextField
            variant="outlined"
            margin="dense"
            required
            fullWidth
            id="referral-code-input"
            name="referralInput"
            value={formValues.referrer_code}
            onChange={(e) =>
              setFormValues({ ...formValues, referrer_code: e.target.value })
            }
            className={`${classes.formInputField} ${classes.referralInput}`}
            placeholder="Enter code here"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={CouponIcon} alt="Coupon" />
                </InputAdornment>
              ),
            }}
          />
          <break>
          </break>


        </DialogContent>
        <DialogContent className={classes.referralBoxContent}>
          <div >
            <FormHelperText error>
              {referralError}
            </FormHelperText>
          </div>
        </DialogContent>

        <DialogActions className={classes.referralBoxBtnContainer}>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            className={classes.cancelReferralBtn}
            onClick={handleReferralCancel}
          >
            No, thanks
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.addReferralBtn}
            // disabled={formValues.otp.length < otpLength}
            onClick={handleReferralConfirm}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <Box className={classes.formHeader}>
        <IconButton onClick={handleBackClick}>
          <KeyboardBackspaceIcon style={{ color: "#545551" }} />
        </IconButton>
        <Typography component="h1" variant="h3" className={classes.pageTitle}>
          Create your profile
        </Typography>
      </Box>
      <Slider
        // variant="determinate"
        value={100}
      // classes={{
      //   colorPrimary: classes.colorPrimary,
      //   barColorPrimary: classes.barColorPrimary,
      // }}
      />
      <div className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.interestsText}>
              Please give Midigiworld permission to contact you about updates
              and your account
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <SingleNotification
              id="is_preference_email"
              label="Email notifications"
              handleSwitchChange={handleSwitchChange}
              checked={true}
              disabled={true}
            />
            <SingleNotification
              id="is_preference_sms"
              label="SMS notifications"
              handleSwitchChange={handleSwitchChange}
              checked={preferences.is_preference_sms}
            />
            <SingleNotification
              id="is_preference_push_notification"
              label="In-App notification"
              handleSwitchChange={handleSwitchChange}
              checked={preferences.is_preference_push_notification}
            />
            <SingleNotification
              id="allPreferred"
              handleSwitchChange={(choice) => {
                if (choice == false) {
                  setPreferences({
                    is_preference_email: true,
                    is_preference_sms: false,
                    is_preference_push_notification: false,
                  });
                }
                setAllPreferred(choice);
              }}
              label="Agree to all the above"
              checked={allPreferred}
            />
          </Grid>
        </Grid>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.updateProfileDetails}
          disabled={addLearnerStatus.isPending}
          onClick={handleNextClick}
        >
          {addLearnerStatus.isPending ? (
            <CircularProgress size={20} className={classes.loader} />
          ) : (
              "Submit"
            )}
        </Button>
      </div>
      <Dialog
        open={successDialog.on}
        onClose={successDialog.toggle}
        aria-labelledby="Registration Successful"
        className={classes.registrationSuccessBox}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <FeedbackCard
            imgSrc={REGISTRATION_SUCCESS}
            cardText="Congratulations!!"
            cardSubText={cardSubText}
            btnText={`OK`}
            onClick={handleFeedbackBtnClick}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default PersonalInfoForm;
