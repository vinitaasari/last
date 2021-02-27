import React, { useState, useEffect } from "react";
import {
  InputLabel,
  TextField,
  Select,
  Button,
  MenuItem,
  Paper,
  Box,
  FormHelperText,
  Grid,
  InputAdornment,
  IconButton,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import PhoneNumber from "awesome-phonenumber";
import Slider from "@material-ui/core/Slider";
import { useFormik } from "formik";

import {
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Wc,
} from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
import MuiPhoneNumber from "material-ui-phone-number";

import useToggle from "../../hooks/useToggle";
import { profileSchema } from "./form-validations";
import { profileStyles as useStyles } from "./styles";

import genderFemale from "../../assets/images/gender_female.svg";
import genderMale from "../../assets/images/gender_male.svg";
import genderOthers from "../../assets/images/gender_others.svg";

function PersonalInfoForm({ formValues, setFormValues }) {
  const [isSocialMediaLogin, setSocialMediaLogin] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const passwordToggle = useToggle();
  const confirmPasswordToggle = useToggle();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      phone_number: formValues.phone_number,
      password: location.state && location.state.is_socialMedia_login ? '123456789' : formValues.password,
      confirmPassword: location.state && location.state.is_socialMedia_login ? '123456789' : formValues.confirmPassword,
      age: formValues.age,
      gender: formValues.gender,
      isSocialMediaLogin: false,
    },
    validationSchema: profileSchema,
    onSubmit: handleNextClick,
  });



  useEffect(() => {
    if (location.state && location.state.is_socialMedia_login === true) {
      const {
        state: { user_data },
      } = location;
      setFormValues({
        ...formValues,
        first_name: user_data.first_name,
        last_name: user_data.last_name,
      });
      setSocialMediaLogin(true);
    }

    // eslint-disable-next-line
  }, []);

  const handleBackClick = () => {
    history.push("/register?currentStep=otp");
  };

  // initialized with function because of hoisting
  function handleNextClick(values, formOptions) {
    setFormValues({ ...formValues, ...values });
    console.log(values)
    if (location.state && isSocialMediaLogin) {
      history.push("/register?currentStep=location", {
        ...location.state,
      });
    } else {
      if (
        values.password
          .toLowerCase()
          .includes(values.first_name.toLowerCase()) ||
        values.password.toLowerCase().includes(values.last_name.toLowerCase())
      ) {
        formOptions.setFieldError(
          "password",
          "Password should not contain First name or Last Name"
        );
        return;
      }
      if (/\s/.test(values.password)) {
        formOptions.setFieldError(
          "password",
          "Password shouldn't contain spaces!"
        );
        return;
      }
      if (/\s/.test(values.confirmPassword)) {
        formOptions.setFieldError(
          "confirmPassword",
          "Confirm Password shouldn't contain spaces!"
        );
        return;
      } else {
        if (values.phone_number) {
          // const phoneNumberWithCode = values.phone_number.replace("-", "");
          var pn = new PhoneNumber(values.phone_number);
          if (!pn.isValid() && !pn.isMobile()) {
            formOptions.setFieldError(
              "phone_number",
              "Enter Valid Number!"
            );
            return;
          }
          else {
            history.push("/register?currentStep=location");
          }
        }
        else {
          history.push("/register?currentStep=location");
        }
      }
    }
  }
  return (
    <Grid
      item
      xs={12}
      component={Paper}
      elevation={6}
      square
      className={classes.paperContainer}
    >
      <Box className={classes.formHeader}>
        <IconButton onClick={handleBackClick} disabled={isSocialMediaLogin}>
          <KeyboardBackspaceIcon style={{ color: "#545551" }} />
        </IconButton>
        <Typography component="h1" variant="h3" className={classes.pageTitle}>
          Create your profile
        </Typography>
      </Box>
      <Slider
        // variant="determinate"
        value={30}
      // classes={{
      //   colorPrimary: classes.colorPrimary,
      //   // barColorPrimary: classes.barColorPrimary,
      // }}
      />
      <form className={classes.paper} onSubmit={formik.handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <Box className={classes.formInputGroup}>
              <InputLabel
                htmlFor="user-first-name"
                className={classes.formInputLabel}
              >
                First Name
              </InputLabel>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                id="user-first-name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.first_name && Boolean(formik.errors.first_name)
                }
                className={classes.formInputField}
                placeholder="Enter your first name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        fontSize="small"
                        className={classes.icon}
                        color={
                          formik.touched.first_name &&
                            Boolean(formik.errors.first_name)
                            ? "error"
                            : undefined
                        }
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography
                component="span"
                variant="body1"
                className={classes.errorMessage}
              >
                {formik.touched.first_name && formik.errors.first_name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Box className={classes.formInputGroup}>
              <InputLabel
                htmlFor="user-last-name"
                className={classes.formInputLabel}
              >
                Last Name
              </InputLabel>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                id="user-last-name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.last_name && Boolean(formik.errors.last_name)
                }
                className={classes.formInputField}
                placeholder="Enter your last name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        fontSize="small"
                        className={classes.icon}
                        color={
                          formik.touched.last_name &&
                            Boolean(formik.errors.last_name)
                            ? "error"
                            : undefined
                        }
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography
                component="span"
                variant="body1"
                className={classes.errorMessage}
              >
                {formik.touched.last_name && formik.errors.last_name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Box
              className={classes.formInputGroup}
              style={{ display: isSocialMediaLogin && "none" }}
            >
              <InputLabel
                htmlFor="user-password"
                className={classes.formInputLabel}
              >
                Password
              </InputLabel>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="password"
                type={passwordToggle.on ? "text" : "password"}
                id="user-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                autoComplete="current-password"
                className={classes.formInputField}
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
                placeholder="Enter your password"
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
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Box
              className={classes.formInputGroup}
              display={isSocialMediaLogin && "none"}
            >
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
                name="confirmPassword"
                type={confirmPasswordToggle.on ? "text" : "password"}
                id="user-confirm-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                autoComplete="current-password"
                className={classes.formInputField}
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
                        onClick={confirmPasswordToggle.toggle}
                      >
                        {confirmPasswordToggle.on ? (
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
                placeholder="Confirm your password"
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
          </Grid>
          <Grid item xs={12} sm={4} md={6}>
            <Box className={classes.formInputGroup}>
              <InputLabel
                htmlFor="user-gender"
                className={classes.formInputLabel}
              >
                Contact No (Optional)
              </InputLabel>
              <MuiPhoneNumber
                name="phone_number"
                id="user-phone-number"
                defaultCountry={"in"}
                variant="outlined"
                value={formik.values.phone_number}
                error={
                  formik.touched.phone_number &&
                  Boolean(formik.errors.phone_number)
                }
                onChange={(v) =>
                  formik.setFieldValue("phone_number", v)
                }
                margin="dense"
                placeholder="Phone No (Optional)"
                fullWidth
                inputClass={classes.formInputField}
                countryCodeEditable={false}
                autoFormat={false}
              />
            </Box>
            <Typography
              component="span"
              variant="body1"
              className={classes.errorMessage}
            >
              {formik.touched.phone_number && formik.errors.phone_number}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={8} md={3}>
            <Box className={classes.formInputGroup}>
              <InputLabel
                htmlFor="user-contact-number"
                className={classes.formInputLabel}
              >
                Age
              </InputLabel>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="age"
                type="number"
                id="user-age"
                value={formik.values.age}
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                className={classes.formInputField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        className={classes.icon}
                        fontSize="small"
                        color={
                          formik.touched.age && Boolean(formik.errors.age)
                            ? "error"
                            : undefined
                        }
                      />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter your age"
              />
              <Typography
                component="span"
                variant="body1"
                className={classes.errorMessage}
              >
                {formik.touched.age && formik.errors.age}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <Box className={classes.formInputGroup}>
              <InputLabel
                htmlFor="user-gender"
                className={classes.formInputLabel}
              >
                Gender
              </InputLabel>
              <Select
                value={formik.values.gender}
                margin="dense"
                onChange={formik.handleChange}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                variant="outlined"
                fullWidth
                displayEmpty
                className={classes.formInputField}
                inputProps={{
                  name: "gender",
                  id: "user-gender",
                }}
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
              <Typography
                component="span"
                variant="body1"
                className={classes.errorMessage}
              >
                {formik.touched.gender && formik.errors.gender}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.updateProfileDetails}
        >
          Next
        </Button>
      </form>
    </Grid>
  );
}

export default PersonalInfoForm;
