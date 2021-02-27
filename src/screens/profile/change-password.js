import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  FormHelperText,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Lock, Visibility, VisibilityOff } from "@material-ui/icons";

import { useAuth } from "../../contexts/auth-context";
import { useFormik } from "formik";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import { changePasswordSchema } from "../../schema";
import useCancelRequest from "../../hooks/useCancelRequest";
import useCallbackStatus from "../../hooks/use-callback-status";
import useToggle from "../../hooks/useToggle";

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    fontWeight: 500,
    color: "#334856",
  },
  inputField: {
    backgroundColor: "#fff",
    maxWidth: "400px",
  },
  notchedOutline: {
    borderColor: `#D9DFE5 !important`,
  },
  icon: {
    color: "#C3C3C3",
  },
  helperText: {
    color: "#371C36",
    fontWeight: 500,
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
  },
  secondaryButton: {
    color: "#939393",
    padding: "6px 32px",
    marginRight: theme.spacing(2),
  },
}));

const ChangePassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const { getUserId } = useAuth();
  const learner_id = getUserId();
  const { logout } = useAuth();

  const passwordToggle = useToggle();
  const confirmPasswordToggle = useToggle();
  const changePasswordApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: (values, formActions) => {
      // alert(JSON.stringify(values, null, 2));
      changePassword(
        {
          learner_id: learner_id,
          new_password: values.new_password,
          old_password: values.old_password,
        },
        formActions
      );
    },
  });

  const {
    touched,
    errors,
    handleSubmit,
    handleChange,
    values,
    resetForm,
  } = formik;

  const cancelPassword = () => { 
    resetForm();
  }

  const changePassword = async (apiBody, formActions) => {
    const user_name = window.localStorage.getItem("user_name");

    if (
      apiBody.new_password
        .toLowerCase()
        .includes(user_name.toLowerCase().split(" ")[0]) ||
      apiBody.new_password
        .toLowerCase()
        .includes(user_name.toLowerCase().split(" ")[1])
    ) {
      formActions.setFieldError(
        "new_password",
        "Password shouldn't contain First Name or Last Name"
      );
      return;
    }
    if (/\s/.test(apiBody.new_password)) {
      formActions.setFieldError(
        "new_password",
        "Password shouldn't contain spaces!"
      );
      return;
    }
    if (/\s/.test(apiBody.new_password)) {
      formActions.setFieldError(
        "new_password",
        "Password shouldn't contain spaces!"
      );
      return;
    }
    try {
      const res = await changePasswordApiStatus.run(
        apiClient("POST", "learner", "changepasswordlearner", {
          body: { ...apiBody },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      if (data === true) {
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
        resetForm();
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

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            Current Password
          </Typography>
          <TextField
            name="old_password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            value={values.old_password}
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Enter your current password"
            classes={{ root: classes.inputField }}
            error={Boolean(touched.old_password && errors.old_password)}
            helperText={touched.old_password && errors.old_password}
            InputProps={{
              classes: { notchedOutline: classes.notchedOutline },
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" className={classes.icon} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? (
                      <Visibility fontSize="small" className={classes.icon} />
                    ) : (
                      <VisibilityOff
                        fontSize="small"
                        className={classes.icon}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            New Password
          </Typography>
          <TextField
            name="new_password"
            type={passwordToggle.on ? "text" : "password"}
            onChange={handleChange}
            value={values.new_password}
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Enter your new password"
            classes={{ root: classes.inputField }}
            error={Boolean(touched.new_password && errors.new_password)}
            helperText={touched.new_password && errors.new_password}
            InputProps={{
              classes: { notchedOutline: classes.notchedOutline },
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" className={classes.icon} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={passwordToggle.toggle}
                  >
                    {passwordToggle.on ? (
                      <Visibility fontSize="small" className={classes.icon} />
                    ) : (
                      <VisibilityOff
                        fontSize="small"
                        className={classes.icon}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" classes={{ root: classes.inputLabel }}>
            Confirm Password
          </Typography>
          <TextField
            name="confirm_password"
            type={confirmPasswordToggle.on ? "text" : "password"}
            onChange={handleChange}
            value={values.confirm_password}
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Enter your confirm password"
            error={Boolean(touched.confirm_password && errors.confirm_password)}
            helperText={touched.confirm_password && errors.confirm_password}
            classes={{
              root: classes.inputField,
            }}
            InputProps={{
              classes: { notchedOutline: classes.notchedOutline },
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" className={classes.icon} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={confirmPasswordToggle.toggle}
                  >
                    {confirmPasswordToggle.on ? (
                      <Visibility fontSize="small" className={classes.icon} />
                    ) : (
                      <VisibilityOff
                        fontSize="small"
                        className={classes.icon}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText classes={{ root: classes.helperText }}>
            Your password must be at least 8 character long.
          </FormHelperText>
        </Grid>

        <Grid item xs={12} classes={{ root: classes.buttonContainer }}>
          <Button
            variant="outlined"
            classes={{ outlined: classes.secondaryButton }}
            onClick = {cancelPassword}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary">
            {
              changePasswordApiStatus.isPending ? (
                <CircularProgress size={20} style={{ color: 'white' }} className={classes.loader} />
              ) : ("UPDATE")
            }
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ChangePassword;
