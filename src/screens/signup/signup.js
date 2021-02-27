import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

import useLocalStorage from "../../hooks/useLocalStorage";
import useQuery from "../../hooks/useQuery";

import AppWrapper from "../../components/app-wrapper";
import EmailForm from "./EmailForm";
import OTPForm from "./OTPForm";
import PersonalInfoForm from "./PersonalInfoForm";
import LocationForm from "./LocationForm";
import InterestForm from "./InterestForm";
import NotificationPreference from "./NotificationPreference";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(5),
      height: "80vh",
      [theme.breakpoints.down("xs")]: {
        padding: theme.spacing(2),
      },
    },
  };
});

function SignUp() {
  const [otpLength] = useState(6);
  const [formValues, setFormValues] = useLocalStorage("registrationForm", {
    first_name: "",
    last_name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    country_phone_code: "",
    phone_number: "",
    age: "",
    gender: "",
    country: "India",
    languages: [],
    interests: [],
    state: "",
    city: "",
    interests: [],
    referrer_code: "",
    country_code: "101",
    state_code: "",
    city_code: "",
  });

  const query = useQuery();

  const classes = useStyles();
  useEffect(() => {
    window.localStorage.removeItem("registrationForm");
  }, []);
  return (
    <AppWrapper hideFooter>
      <SEO
        title="Midigiworld - Register"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        {(() => {
          const currentStep = query.get("currentStep");

          switch (currentStep) {
            case "email":
              return (
                <EmailForm
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              );
            case "otp":
              return (
                <OTPForm
                  otpLength={otpLength}
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              );
            case "profile":
              return (
                <PersonalInfoForm
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              );
            case "location":
              return (
                <LocationForm
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              );
            case "interests":
              return (
                <InterestForm
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              );
            case "notification":
              return (
                <NotificationPreference
                  formValues={formValues}
                  setFormValues={setFormValues}
                />
              );
            case null:
              return <Redirect to="/register?currentStep=email" />;
            default:
              return null;
          }
        })()}
      </Grid>
    </AppWrapper>
  );
}

export default SignUp;
