import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  InputAdornment,
  Select,
  TextField,
  Typography,
  Dialog,
  FormHelperText,
  DialogContent,
  CircularProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles";
import MuiPhoneNumber from "material-ui-phone-number";

import PhoneNumber from "awesome-phonenumber";

import { Email, Language, LocationOn, Person, Wc } from "@material-ui/icons";

import { editProfileSchema } from "../../schema";
import { useFormik } from "formik";
import countriesList from "../../static-data/countries.json";
import statesList from "../../static-data/states.json";
import citiesList from "../../static-data/cities.json";

import genderFemale from "../../assets/images/gender_female.svg";
import genderMale from "../../assets/images/gender_male.svg";
import genderOthers from "../../assets/images/gender_others.svg";

import OtpForm from "./OtpForm";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "850px",
  },
  inputLabel: {
    fontWeight: 500,
    color: "#334856",
  },
  notchedOutline: {
    borderColor: `#D9DFE5 !important`,
  },
  icon: {
    color: "#C3C3C3",
  },
  verifyButton: {
    textTransform: "none",
    fontSize: "14px",
  },
  ageContainer: {
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      paddingRight: 0,
      paddingBottom: theme.spacing(2),
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
  },
}));

const EditProfile = (props) => {
  const classes = useStyles();
  const { user, updateLearnerProfile } = props;

  // const [statesDropdownList, setStatesList] = useState([]);
  const [citiesDropdownList, setCities] = useState([]);
  const [showOtpForm, setOtpForm] = useState(false);
  const [changeFlag, setChangeFlag] = useState(false);
  const [phoneError, setPhoneError] = useState("")
  const history = useHistory();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...user,
      country: user.country
        ? countriesList.find((c) => c.name === user.country)?.["id"]
        : 101,
      state:
        user.state && statesList.find((c) => c.name === user.state)
          ? statesList.find((c) => c.name === user.state)?.["id"]
          : "",
      city:
        user.city && citiesList.find((c) => c.name === user.city)
          ? citiesList.find((c) => c.name === user.city)?.["id"]
          : "",
    },
    validationSchema: editProfileSchema,
    onSubmit: (values) => {
      console.log(values)
      const countryObj = countriesList.find(
        (item) => item.id === Number(values.country)
      );
      const stateObj = statesList.find(
        (item) => item.id === Number(values.state)
      );
      const cityObj = citiesDropdownList.find(
        (item) => item.id === Number(values.city)
      );

      const apiBody = {
        ...values,
        country: countryObj ? countryObj.name : "",
        state: stateObj ? stateObj.name : "",
        city: cityObj ? cityObj.name : "",
      };
      console.log(values.phone_number.length)
      if (values.phone_number) {
        const phoneNumberWithCode = values.phone_number.replace("-", "");
        var pn = new PhoneNumber(phoneNumberWithCode);
        if (!pn.isValid() && !pn.isMobile()) {
          setPhoneError("Enter Valid Number")
        }
        else {
          setPhoneError("")

          var countryCode = values.phone_number.substr(0, values.phone_number.indexOf(' '));
          var number = values.phone_number.substr(values.phone_number.indexOf(' ') + 1);
          number = number.replace(/\(|\)|-|\s/g, '');
          values.phone_number = countryCode + ' ' + number
          apiBody.phone_number = values.phone_number
          delete apiBody.email;
          delete apiBody.isPhoneNumberVerified;

          if (apiBody.country != "India" && apiBody.country != "india") {
            delete apiBody.city;
            delete apiBody.state;
          }
          updateLearnerProfile(apiBody);
          history.push('/profile/edit-profile')
        }
      } else {
        delete apiBody.phone_number;
        delete apiBody.email;
        delete apiBody.isPhoneNumberVerified;

        if (apiBody.country != "India" && apiBody.country != "india") {
          delete apiBody.city;
          delete apiBody.state;
        }
        updateLearnerProfile(apiBody);
        history.push('/profile/edit-profile')
      }


    },
  });

  const {
    touched,
    errors,
    handleSubmit,
    handleChange,
    values,
    setFieldValue,
  } = formik;

  const handleSelectChange = (event) => {
    setFieldValue(event.target.name, event.target.value);
  };

  useEffect(() => {
    const cities = citiesList.filter((item) => item.state_id === values.state);
    setCities(cities);
  }, [values]);

  const handleCloseOtpModal = () => {
    formik.handleSubmit()
    setOtpForm(false);
  };
  const handleOkayOtpModal = () => {
    setOtpForm(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} classes={{ root: classes.container }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            First Name
          </Typography>
          <TextField
            name="first_name"
            onChange={handleChange}
            value={values.first_name}
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Enter your first name"
            classes={{ root: classes.inputField }}
            error={Boolean(touched.first_name && errors.first_name)}
            helperText={touched.first_name && errors.first_name}
            InputProps={{
              classes: { notchedOutline: classes.notchedOutline },
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" className={classes.icon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            Last Name
          </Typography>
          <TextField
            name="last_name"
            onChange={handleChange}
            value={values.last_name}
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Enter your last name"
            error={Boolean(touched.last_name && errors.last_name)}
            helperText={touched.last_name && errors.last_name}
            classes={{ root: classes.inputField }}
            InputProps={{
              classes: { notchedOutline: classes.notchedOutline },
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" className={classes.icon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            Contact No
          </Typography>
          {
            console.log(user)
          }
          <Box display="flex" alignItems="center" w={1}>
            <MuiPhoneNumber
              name="phone_number"
              defaultCountry={"in"}
              variant="outlined"
              value={values.phone_number}
              error={Boolean(phoneError)}
              countryCodeEditable={false}
              onChange={(v) => {
                setChangeFlag(true)
                setFieldValue("phone_number", v)
              }
              }
              margin="dense"
              placeholder="Phone No (Optional)"
              fullWidth
              // disabled={user.isPhoneNumberVerified}
              classes={{ root: classes.inputField }}
              InputProps={{
                endAdornment:
                  !user.isPhoneNumberVerified && user.phone_number && !changeFlag ? (
                    <InputAdornment position="end">
                      <Button
                        variant="text"
                        color="secondary"
                        classes={{ root: classes.verifyButton }}
                        onClick={() => setOtpForm(true)}
                      >
                        Verify
                      </Button>
                    </InputAdornment>
                  ) : (
                      user.isPhoneNumberVerified && user.phone_number && !changeFlag ?
                        (
                          <InputAdornment position="end">
                            <Button
                              variant="text"
                              color="secondary"
                              classes={{ root: classes.verifyButton }}
                              disabled
                            >
                              Verified
                  </Button>
                          </InputAdornment>
                        ) : null
                    )
              }}
            />

          </Box>
          <FormHelperText error>{
            phoneError}</FormHelperText>
          <Dialog open={showOtpForm} disableBackdropClick disableEscapeKeyDown>
            <DialogContent>
              <OtpForm
                otpLength={6}
                formValues={{
                  phone_no: values.phone_number,
                  otp: "",
                  email: user.email,
                }}
                handleCloseModal={handleCloseOtpModal}
                handleOkayOtpModal={handleOkayOtpModal}
              />
            </DialogContent>
          </Dialog>
        </Grid>
        <Grid container item xs={12} md={6}>
          <Grid item xs={12} md={6} className={classes.ageContainer}>
            <Typography variant="body2" classes={{ root: classes.inputLabel }}>
              Age
            </Typography>
            <TextField
              name="age"
              onChange={handleChange}
              value={values.age}
              type="number"
              variant="outlined"
              margin="dense"
              fullWidth
              placeholder="Enter your age"
              classes={{ root: classes.inputField }}
              error={Boolean(touched.age && errors.age)}
              helperText={touched.age && errors.age}
              InputProps={{
                classes: { notchedOutline: classes.notchedOutline },
                startAdornment: (
                  <InputAdornment position="start">
                    <Person fontSize="small" className={classes.icon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" classes={{ root: classes.inputLabel }}>
              Gender
            </Typography>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <Select
                name="gender"
                displayEmpty
                value={values.gender || ""}
                onChange={handleSelectChange}
              // startAdornment={
              //   <InputAdornment position="start">
              //     <Wc fontSize="small" className={classes.icon} />
              //   </InputAdornment>
              // }
              >
                <MenuItem aria-label="None" value="" disabled>
                  Select Gender
                </MenuItem>
                <MenuItem value="male">
                  {" "}
                  <img
                    src={genderMale}
                    style={{ paddingRight: "5px", marginBlock: "-3px" }}
                  />{" "}
                  Male
                </MenuItem>
                <MenuItem value="female">
                  <img
                    src={genderFemale}
                    style={{ paddingRight: "5px", marginBlock: "-3px" }}
                  />{" "}
                  Female
                </MenuItem>
                <MenuItem value="other">
                  <img
                    src={genderOthers}
                    style={{ paddingRight: "5px", marginBlock: "-3px" }}
                  />{" "}
                  Other
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            Email ID
          </Typography>
          <TextField
            name="email"
            disabled
            onChange={handleChange}
            value={values.email}
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Enter your email"
            classes={{ root: classes.inputField }}
            InputProps={{
              classes: { notchedOutline: classes.notchedOutline },
              startAdornment: (
                <InputAdornment position="start">
                  <Email fontSize="small" className={classes.icon} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            Select Country
          </Typography>
          <FormControl variant="outlined" margin="dense" fullWidth>
            <Select
              value={values.country || ""}
              displayEmpty
              inputProps={{
                name: "country",
                id: "user-country",
              }}
              onChange={(e) => {
                setFieldValue("country", e.target.value);
                setFieldValue("state", "");
                setFieldValue("city", "");
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Language fontSize="small" className={classes.icon} />
                </InputAdornment>
              }
            >
              <MenuItem aria-label="None" value="" disabled>
                Select Country
              </MenuItem>
              {countriesList.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {values.country === 101 && (
          <>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                classes={{ root: classes.inputLabel }}
              >
                State
              </Typography>
              <FormControl variant="outlined" margin="dense" fullWidth>
                <Select
                  value={values.state || ""}
                  displayEmpty
                  inputProps={{
                    name: "state",
                    id: "user-state",
                  }}
                  onChange={(e) => {
                    setFieldValue("state", e.target.value);
                    setFieldValue("city", "");
                  }}
                  disabled={values.country !== 101}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOn fontSize="small" className={classes.icon} />
                    </InputAdornment>
                  }
                >
                  <MenuItem aria-label="None" value="" disabled>
                    Select State
                  </MenuItem>
                  {statesList.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                classes={{ root: classes.inputLabel }}
              >
                City
              </Typography>
              <FormControl variant="outlined" margin="dense" fullWidth>
                <Select
                  value={values.city || ""}
                  inputProps={{
                    name: "city",
                    id: "user-city",
                  }}
                  displayEmpty
                  onChange={(e) => {
                    setFieldValue("city", e.target.value);
                  }}
                  disabled={values.country !== 101}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationOn fontSize="small" className={classes.icon} />
                    </InputAdornment>
                  }
                >
                  <MenuItem aria-label="None" value="" disabled>
                    Select City
                  </MenuItem>
                  {citiesDropdownList.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        <Grid item xs={12} classes={{ root: classes.buttonContainer }}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={props.imageApiStatus.isPending}
          >
            {props.imageApiStatus.isPending ? (
              <CircularProgress
                size={20}
                style={{ color: "white" }}
                className={classes.loader}
              />
            ) : (
                "SAVE"
              )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditProfile;
