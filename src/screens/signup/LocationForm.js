import React, { useState, useEffect, useCallback } from "react";
import {
  InputLabel,
  Select,
  Button,
  MenuItem,
  Paper,
  Box,
  Grid,
  IconButton,
  Typography,
  LinearProgress,
  InputAdornment,
  Checkbox,
  TextField,
} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";

import {
  KeyboardBackspace as KeyboardBackspaceIcon,
  Language,
  Public,
  LocationOn,
} from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useHistory, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { apiClient } from "../../utils/api-client";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { locationSchema } from "./form-validations";
import { locationStyles as useStyles } from "./styles";

import countriesList from "../../static-data/countries.json";
import statesList from "../../static-data/states.json";
import citiesList from "../../static-data/cities.json";
import { useAuth } from "../../contexts/auth-context";

function LocationForm({ formValues, setFormValues }) {
  const [languages, setLanguages] = useState([]);
  const [statesDropdownList, setStatesList] = useState([]);
  const [citiesDropdownList, setCities] = useState([]);

  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const apiSource = useCancelRequest();
  const getLanguageStatus = useCallbackStatus();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();

  const getStateCode = (state) => {
    if (!state) {
      return "";
    }

    const obj = statesList.find((item) => item.name === state);
    return obj.id;
  };

  const getCityCode = (state, city) => {
    if (!state || !city) {
      return "";
    }

    const state_code = getStateCode(state);
    const cities = citiesList.filter((item) => item.state_id === state_code);
    const obj = cities.find((item) => item.name === city);
    return obj.id;
  };

  const formik = useFormik({
    initialValues: {
      country: formValues.country,
      state: getStateCode(formValues.state),
      city: getCityCode(formValues.state, formValues.city),
      languages: formValues.languages,
    },
    validationSchema: locationSchema,
    onSubmit: handleNextClick,
    enableReinitialize: false,
  });

  useEffect(() => {
    if (formik.values.country === "India") {
      setStatesList(statesList);
    }
  }, [formik.values]);

  useEffect(() => {
    const cities = citiesList.filter(
      (item) => item.state_id === formik.values.state
    );
    setCities(cities);
  }, [formik.values]);

  const getLanguages = useCallback(async () => {
    try {
      const res = await getLanguageStatus.run(
        apiClient("POST", "admin_configuration", "getlanguage", {
          body: { is_admin: false, order_by: "created_at" },
          shouldUseDefaultToken: true,
          enableLogging: true,
          cancelToken: apiSource.token,
        })
      );

      const arr = res.content.data.map((item) => ({
        id: item.id,
        name: item.language,
      }));

      formik.setFieldValue("languages", [...formik.values.languages]);
      setLanguages(arr);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getLanguages();

    return () => {
      apiSource.cancel();
    };

    // eslint-disable-next-line
  }, [getLanguages]);

  const handleBackClick = () => {
    if (location.state && location.state.is_socialMedia_login === true) {
      history.push("/register?currentStep=profile", { ...location.state });
    } else {
      history.push("/register?currentStep=profile");
    }
  };

  const handleLanguageChange = (_, newValue) => {
    formik.setFieldValue("languages", newValue);
    // setFormValues({
    //   ...formValues,
    //   languages: newValue,
    // });
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    if (val !== "India") {
      formik.setFieldValue("state", "");
      formik.setFieldValue("state_code", "");
      formik.setFieldValue("city", "");
      formik.setFieldValue("city_code", "");
    }

    formik.setFieldValue("country", val);
  };

  function handleNextClick(values, formOptions) {
    const countryObj = countriesList.find(
      (item) => item.name === values.country
    );
    const stateObj = statesDropdownList.find(
      (item) => item.id === Number(values.state)
    );
    const cityObj = citiesDropdownList.find(
      (item) => item.id === Number(values.city)
    );

    const languages = formik.values.languages.map((item) => item.id);

    setFormValues({
      ...formValues,
      country: values.country,
      country_code: countryObj ? countryObj.iso2 : "",
      state: stateObj ? stateObj.name : "",
      state_code: stateObj ? stateObj.state_code : "",
      city: cityObj ? cityObj.name : "",
      city_code: "",
      languages: languages,
    });
    if (location.state && location.state.is_socialMedia_login === true) {
      history.push("/register?currentStep=interests", {
        ...location.state,
      });
    } else {
      history.push("/register?currentStep=interests");
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
        <IconButton onClick={handleBackClick}>
          <KeyboardBackspaceIcon style={{ color: "#545551" }} />
        </IconButton>
        <Typography component="h1" variant="h3" className={classes.pageTitle}>
          Create your profile
        </Typography>
      </Box>
      <Slider value={70} />
      <form className={classes.paper} onSubmit={formik.handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6}>
            <Box className={classes.formInputGroup}>
              <InputLabel
                htmlFor="user-gender"
                className={classes.formInputLabel}
              >
                Select Country
              </InputLabel>
              <Select
                name="country"
                margin="dense"
                value={formik.values.country}
                onChange={handleCountryChange}
                error={formik.touched.country && Boolean(formik.errors.country)}
                variant="outlined"
                fullWidth
                className={classes.formInputField}
                inputProps={{
                  name: "country",
                  id: "user-country",
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Public
                      className={classes.icon}
                      fontSize="small"
                      color={
                        formik.touched.country && Boolean(formik.errors.country)
                          ? "error"
                          : undefined
                      }
                    />
                  </InputAdornment>
                }
              >
                <MenuItem aria-label="None" value="" disabled>
                  Select
                </MenuItem>
                {countriesList.map((item) => (
                  <MenuItem aria-label="None" value={item.name} key={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                component="span"
                variant="body1"
                className={classes.errorMessage}
              >
                {formik.touched.country && formik.errors.country}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Box className={classes.languageInputGroup}>
              <InputLabel htmlFor="language" className={classes.formInputLabel}>
                Course Language
              </InputLabel>
              <Autocomplete
                loading={getLanguageStatus.isPending}
                multiple
                limitTags={2}
                options={languages}
                value={formik.values.languages}
                onChange={handleLanguageChange}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name}
                renderOption={(option, { selected }) => (
                  <>
                    <Checkbox checked={selected} color="primary" />
                    {option.name}
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="languages"
                    variant="outlined"
                    error={
                      formik.touched.languages &&
                      Boolean(formik.errors.languages)
                    }
                    startAdornment={
                      <InputAdornment position="start">
                        <Language fontSize="small" className={classes.icon} />
                      </InputAdornment>
                    }
                  />
                )}
                ChipProps={{
                  size: "small",
                  className: classes.languageChip,
                }}
                size="small"
              />
              <Typography
                component="span"
                variant="body1"
                className={classes.errorMessage}
              >
                {formik.touched.languages && formik.errors.languages}
              </Typography>
            </Box>
          </Grid>
          {formik.values.country === "India" && (
            <>
              <Grid item xs={12} sm={12} md={6}>
                <Box className={classes.formInputGroup}>
                  <InputLabel
                    htmlFor="user-gender"
                    className={classes.formInputLabel}
                  >
                    State
                  </InputLabel>
                  <Select
                    value={formik.values.state}
                    margin="dense"
                    displayEmpty
                    onChange={formik.handleChange}
                    error={
                      formik.touched.country && Boolean(formik.errors.state)
                    }
                    variant="outlined"
                    fullWidth
                    className={classes.formInputField}
                    inputProps={{
                      name: "state",
                      id: "user-state",
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationOn
                          fontSize="small"
                          className={classes.icon}
                          color={
                            formik.touched.country &&
                            Boolean(formik.errors.state)
                              ? "error"
                              : undefined
                          }
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem aria-label="None" value="" disabled>
                      <span style={{ color: "grey" }}> Select From Here</span>{" "}
                    </MenuItem>
                    {statesDropdownList.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography
                    component="span"
                    variant="body1"
                    className={classes.errorMessage}
                  >
                    {formik.touched.country && formik.errors.state}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Box className={classes.formInputGroup}>
                  <InputLabel
                    htmlFor="user-gender"
                    className={classes.formInputLabel}
                  >
                    City
                  </InputLabel>
                  <Select
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    error={formik.touched.state && Boolean(formik.errors.city)}
                    variant="outlined"
                    displayEmpty
                    fullWidth
                    margin="dense"
                    className={classes.formInputField}
                    inputProps={{
                      name: "city",
                      id: "user-city",
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <LocationOn
                          fontSize="small"
                          className={classes.icon}
                          color={
                            formik.touched.state && Boolean(formik.errors.city)
                              ? "error"
                              : undefined
                          }
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem aria-label="None" value="" disabled>
                      <span style={{ color: "grey" }}> Select From Here</span>
                    </MenuItem>
                    {citiesDropdownList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography
                    component="span"
                    variant="body1"
                    className={classes.errorMessage}
                  >
                    {formik.touched.state && formik.errors.city}
                  </Typography>
                </Box>
              </Grid>
            </>
          )}
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

export default LocationForm;
