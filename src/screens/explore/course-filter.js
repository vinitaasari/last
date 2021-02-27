import React, { useCallback, useState, Fragment } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Radio,
  RadioGroup,
  IconButton,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  TextField,
  Checkbox,
  Slider,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import useCancelRequest from "../../hooks/useCancelRequest";
import useCallbackStatus from "../../hooks/use-callback-status";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Close as CloseIcon } from "@material-ui/icons";
import { useAuth } from "../../contexts/auth-context";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 1,
    label: "1",
  },

  {
    value: 2,
    label: "2",
  },

  {
    value: 3,
    label: "3",
  },

  {
    value: 4,
    label: "4",
  },

  {
    value: 5,
    label: "5",
  },
];

const useStyles = makeStyles((theme) => ({
  filterSection: (props) => ({
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: props.noBorder ? undefined : "1px solid #e7e8ea",
  }),
  filterSectionHeading: {
    color: "#393a45",
    fontWeight: 600,
    fontSize: "16px",
  },
  dialogContent: {
    paddingBottom: theme.spacing(2),
  },
  checkboxWrapper: {
    "& > *": {
      marginRight: theme.spacing(4),
    },
  },
  formControlLabel: {
    color: "#4e4e4e",
    fontWeight: 400,
  },
  inputField: {
    backgroundColor: "#FAFCFD",
    marginRight: theme.spacing(1.5),
    width: "120px",
  },
  datePickerField: {
    backgroundColor: "#FAFCFD",
    marginRight: theme.spacing(1.5),
    width: "130px",
  },
  dash: {
    marginRight: theme.spacing(1.5),
    color: "#707070",
  },
  rangeValue: {
    color: "#4e4e4e",
    fontSize: "14px",
    fontWeight: 400,
    marginLeft: theme.spacing(-0.8),
  },
  slider: {
    width: "50%",
  },
  submitBtn: {
    boxShadow: "none",
  },
  clearBtn: {
    color: "#3f3f3f",
    textTransform: "none",
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    left: theme.spacing(1),
    color: "#2c516c",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        variant="h6"
        style={{
          color: "#2c516c",
          fontSize: "18px",
          fontWeight: 500,
          textAlign: "center",
        }}
      >
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const FilterSection = ({ heading, children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.filterSection}>
      <Typography className={classes.filterSectionHeading}>
        {heading}
      </Typography>
      {children}
    </Box>
  );
};

const CourseFilter = (props) => {
  const classes = useStyles();
  const { filterCourses } = props;
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const { logout } = useAuth();

  const apiSource = useCancelRequest();
  const getLanguageStatus = useCallbackStatus();
  const { enqueueSnackbar } = useSnackbar();

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

  const formik = useFormik({
    initialValues: {
      difficulty_level: [],
      user_language: [],
      price_range: [],
      is_certificated: "",
      rating_lower_range: 0,
      rating_higher_range: 0,
      start_date: null,
      end_date: null,
      duration_lower_range: "",
      duration_higher_range: "",
    },
    onSubmit: (values, formActions) => {
      let reqBody = {
        ...values,
        is_certificated: values.is_certificated
          ? values.is_certificated == "true"
            ? [true]
            : [false]
          : undefined,
        start_date: values.start_date
          ? new Date(values.start_date).getTime() / 1000
          : undefined,
        end_date: values.end_date
          ? new Date(values.end_date).getTime() / 1000
          : undefined,
        price_range: [getPriceRangeObj(values.price_range)],
        duration_lower_range: values.duration_lower_range || undefined,
        duration_higher_range: values.duration_higher_range || undefined,
        rating_lower_range: values.rating_lower_range || undefined,
        rating_higher_range: values.rating_higher_range || undefined,
      };

      if (!values.rating_lower_range) {
        delete reqBody.rating_lower_range;
      }

      if (!values.rating_higher_range) {
        delete reqBody.rating_higher_range;
      }

      filterCourses(reqBody);
      handleClose();
    },
  });

  const {
    initialValues,
    handleSubmit,
    handleChange,
    values,
    resetForm,
    setFieldValue,
  } = formik;

  const getPriceRangeObj = (range) => {
    let minValue = 0;
    let maxValue = 10000;

    let minRangeChosen = Math.min.apply(Math, range);
    let maxRangeChosen = Math.max.apply(Math, range);

    if (minRangeChosen == 0) {
      minValue = 0;
    }
    if (minRangeChosen == 1) {
      minValue = 250;
    }
    if (minRangeChosen == 2) {
      minValue = 500;
    }
    if (minRangeChosen == 3) {
      minValue = 1000;
    }

    if (maxRangeChosen == 0) {
      maxValue = 250;
    }
    if (maxRangeChosen == 1) {
      maxValue = 500;
    }
    if (maxRangeChosen == 2) {
      maxValue = 1000;
    }
    if (maxRangeChosen == 3) {
      maxValue = 10000;
    }

    return {
      min: minValue,
      max: maxValue,
    };
  };

  const handleRangeChange = (event, newValue) => {
    setFieldValue("rating_lower_range", newValue[0]);
    setFieldValue("rating_higher_range", newValue[1]);
  };

  const handleClickOpen = () => {
    setOpen(true);
    getLanguages();
  };

  const handleClose = () => {
    setFieldValue("difficulty_level", []);
    setFieldValue("user_language", []);
    setFieldValue("price_range", []);
    setFieldValue("is_certificated", "");
    setFieldValue("rating_lower_range", 0);
    setFieldValue("rating_higher_range", 0);
    setFieldValue("start_date", null);
    setFieldValue("end_date", null);
    setFieldValue("duration_lower_range", "");
    setFieldValue("duration_higher_range", "");
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    if (event.target.name == "difficulty_level") {
      let currentDifficultyValues;
      currentDifficultyValues = values.difficulty_level;
      if (currentDifficultyValues.includes(event.target.value)) {
        const index = currentDifficultyValues.indexOf(event.target.value);
        if (index > -1) {
          currentDifficultyValues.splice(index, 1);
        }
      } else {
        currentDifficultyValues.push(event.target.value);
      }
      setFieldValue("difficulty_level", currentDifficultyValues);
    }

    if (event.target.name == "user_language") {
      let currentLanguageValues;
      currentLanguageValues = values.user_language;
      if (currentLanguageValues.includes(event.target.value)) {
        const index = currentLanguageValues.indexOf(event.target.value);
        if (index > -1) {
          currentLanguageValues.splice(index, 1);
        }
      } else {
        currentLanguageValues.push(event.target.value);
      }
      setFieldValue("user_language", currentLanguageValues);
    }

    if (event.target.name == "price_range") {
      let currentPriceValues;
      currentPriceValues = values.price_range;
      if (currentPriceValues.includes(Number(event.target.value))) {
        const index = currentPriceValues.indexOf(Number(event.target.value));
        if (index > -1) {
          currentPriceValues.splice(index, 1);
        }
      } else {
        currentPriceValues.push(Number(event.target.value));
      }
      setFieldValue("price_range", currentPriceValues);
    }
  };

  const clearSkillFilter = () => {
    setFieldValue("difficulty_level", []);
    setFieldValue("user_language", []);
    setFieldValue("price_range", []);
    setFieldValue("is_certificated", "");
    setFieldValue("rating_lower_range", 0);
    setFieldValue("rating_higher_range", 0);
    setFieldValue("start_date", null);
    setFieldValue("end_date", null);
    setFieldValue("duration_lower_range", "");
    setFieldValue("duration_higher_range", "");
    filterCourses({});
    handleClose();
  };

  return (
    <Fragment>
      <Chip
        // icon={<FaceIcon />}
        label="Filter"
        clickable
        variant="outlined"
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Filters
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          <form onSubmit={handleSubmit}>
            <FilterSection heading="Difficulty level">
              <Box mt={0.8} className={classes.checkboxWrapper}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.difficulty_level.includes("beginner")}
                      onChange={handleCheckboxChange}
                      name="difficulty_level"
                      color="secondary"
                      value="beginner"
                    />
                  }
                  className={classes.formControlLabel}
                  label="Easy"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.difficulty_level.includes("intermediate")}
                      onChange={handleCheckboxChange}
                      name="difficulty_level"
                      color="secondary"
                      value="intermediate"
                    />
                  }
                  className={classes.formControlLabel}
                  label="Intermediate"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.difficulty_level.includes("advance")}
                      onChange={handleCheckboxChange}
                      name="difficulty_level"
                      color="secondary"
                      value="advance"
                    />
                  }
                  className={classes.formControlLabel}
                  label="Difficult"
                />
              </Box>
            </FilterSection>

            <FilterSection heading="Price Range">
              <Box mt={0.8} className={classes.checkboxWrapper}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.price_range.includes(0)}
                      onChange={handleCheckboxChange}
                      name="price_range"
                      color="secondary"
                      value={0}
                    />
                  }
                  className={classes.formControlLabel}
                  label="0 - Rs 250"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.price_range.includes(1)}
                      onChange={handleCheckboxChange}
                      name="price_range"
                      color="secondary"
                      value={1}
                    />
                  }
                  className={classes.formControlLabel}
                  label="Rs 250 - Rs 500"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.price_range.includes(2)}
                      onChange={handleCheckboxChange}
                      name="price_range"
                      color="secondary"
                      value={2}
                    />
                  }
                  className={classes.formControlLabel}
                  label="Rs 500 - Rs 1000"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.price_range.includes(3)}
                      onChange={handleCheckboxChange}
                      name="price_range"
                      color="secondary"
                      value={3}
                    />
                  }
                  className={classes.formControlLabel}
                  label="Rs 1000+"
                />
              </Box>
            </FilterSection>

            <FilterSection heading="Certification">
              <Box mt={0.8} className={classes.checkboxWrapper}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Certification"
                    name="is_certificated"
                    value={values.is_certificated}
                    onChange={(event) =>
                      setFieldValue("is_certificated", event.target.value)
                    }
                    style={{ flexDirection: "row" }}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </FilterSection>

            <FilterSection heading="Duration">
              <Box mt={0.8} display="flex" alignItems="center">
                <TextField
                  name="duration_lower_range"
                  type="number"
                  onChange={handleChange}
                  value={values.duration_lower_range}
                  variant="outlined"
                  margin="dense"
                  placeholder="Min (Hours)"
                  classes={{ root: classes.inputField }}
                  InputProps={{
                    classes: { notchedOutline: classes.notchedOutline },
                  }}
                />

                <span className={classes.dash}>&#8212;</span>

                <TextField
                  name="duration_higher_range"
                  type="number"
                  onChange={handleChange}
                  value={values.duration_higher_range}
                  variant="outlined"
                  margin="dense"
                  placeholder="Max (Hours)"
                  classes={{ root: classes.inputField }}
                  InputProps={{
                    classes: { notchedOutline: classes.notchedOutline },
                  }}
                />
              </Box>
            </FilterSection>

            <FilterSection heading="Start Date - End Date">
              <Box mt={0.8} display="flex" alignItems="center">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    inputVariant="outlined"
                    margin="dense"
                    className={classes.datePickerField}
                    value={values.start_date}
                    format="dd/MM/yyyy"
                    onChange={(date) => setFieldValue("start_date", date)}
                    placeholder="Start date"
                  />

                  <span className={classes.dash}>&#8212;</span>

                  <DatePicker
                    inputVariant="outlined"
                    margin="dense"
                    className={classes.datePickerField}
                    value={new Date()}
                    format="dd/MM/yyyy"
                    minDate={values.start_date}
                    value={values.end_date}
                    onChange={(date) => setFieldValue("end_date", date)}
                    placeholder="End date"
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </FilterSection>

            <FilterSection heading="Rating">
              <Box mt={0.8} ml={0.8}>
                <Typography
                  className={classes.rangeValue}
                  id="range-slider"
                  gutterBottom
                >
                  {values.rating_lower_range}-{values.rating_higher_range}
                </Typography>
                <Slider
                  step={1}
                  min={1}
                  max={5}
                  color="secondary"
                  value={[
                    values.rating_lower_range,
                    values.rating_higher_range,
                  ]}
                  marks={marks}
                  onChange={handleRangeChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  className={classes.slider}
                />
              </Box>
            </FilterSection>

            <FilterSection heading="Course Delivery Language" noBorder>
              <Box mt={0.8} className={classes.checkboxWrapper}>
                {languages.map((item) => {
                  return (
                    <FormControlLabel
                      key={item.id}
                      control={
                        <Checkbox
                          checked={values.user_language.includes(item.id)}
                          onChange={handleCheckboxChange}
                          name="user_language"
                          color="secondary"
                          value={item.id}
                        />
                      }
                      className={classes.formControlLabel}
                      label={item.name}
                    />
                  );
                })}
              </Box>
            </FilterSection>

            <Box
              mt={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                onClick={clearSkillFilter}
                className={classes.clearBtn}
                color="primary"
              >
                Clear
              </Button>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                className={classes.submitBtn}
              >
                Apply
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default CourseFilter;
