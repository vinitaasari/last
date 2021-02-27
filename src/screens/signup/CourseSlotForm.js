import React from "react";
import {
  InputLabel,
  Chip,
  Select,
  FormHelperText,
  MenuItem,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { days } from "../../static-data/data";

const useStyles = makeStyles((theme) => ({
  formInputGroup: {
    marginBottom: theme.spacing(4),
  },
  formInputLabel: {
    color: theme.palette.primary.text,
    fontSize: "16px",
    fontWeight: 500,
  },
  formInputField: {
    marginTop: theme.spacing(1),
    "& .MuiInputBase-root": {
      fontSize: "16px",
    },
  },
  slotInputGroup: {
    marginTop: theme.spacing(1),
    padding: `${theme.spacing(2)}px 0`,
    border: `1px solid ${theme.palette.custom.border}`,
    borderRadius: "4px",
  },
  daysCheckboxesContainer: {
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.custom.border}`,
  },
  slotTimeLabel: {
    margin: `0 ${theme.spacing(2)}px 0 0`,
  },
  slotTimeCheckbox: {
    position: "absolute",
    visibility: "hidden",
  },
  timingGroupContainer: {
    marginLeft: theme.spacing(3),
    paddingTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
}));

function CourseSlotForm() {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box className={classes.formInputGroup}>
          <InputLabel
            htmlFor="user-course-category"
            className={classes.formInputLabel}
          >
            Course Category
          </InputLabel>
          <Select
            value="none"
            // onChange={handleChange}
            variant="outlined"
            fullWidth
            className={classes.formInputField}
            inputProps={{
              name: "course_category",
              id: "user-course-category",
            }}
            // multiple
          >
            <MenuItem aria-label="None" value="none">
              Select your course categories
            </MenuItem>
            <MenuItem value="education">Education</MenuItem>
            <MenuItem value="photography">Photography</MenuItem>
            <MenuItem value="travel">Travel</MenuItem>
          </Select>
          <FormHelperText>
            You can select more than one category.
          </FormHelperText>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.formInputGroup}>
          <InputLabel
            htmlFor="user-course-slot"
            className={classes.formInputLabel}
          >
            Preferred Day(s) & Slot(s)
          </InputLabel>
          <Box className={classes.slotInputGroup}>
            <Box className={classes.daysCheckboxesContainer}>
              {days.map((day) => (
                <FormControlLabel
                  key={day.index}
                  value={day.abbr}
                  control={<Checkbox color="primary" />}
                  label={day.abbr.toUpperCase()}
                  labelPlacement="bottom"
                  name="slot-days"
                />
              ))}
            </Box>
            <Box className={classes.timingGroupContainer}>
              <Chip
                label="Morning 9 to 12"
                component="button"
                clickable
                variant="outlined"
                className={classes.slotTimeLabel}
              />
              <Chip
                label="Afternoon 12 to 3"
                component="button"
                clickable
                variant="outlined"
                className={classes.slotTimeLabel}
              />
              <Chip
                label="Evening 3 to 6"
                component="button"
                clickable
                variant="outlined"
                className={classes.slotTimeLabel}
              />
            </Box>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                // checked={state.checkedB}
                // onChange={handleChange}
                name="checkedB"
                color="primary"
              />
            }
            label="Available all days & slots"
            classes={{
              label: classes.formInputLabel,
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default CourseSlotForm;
