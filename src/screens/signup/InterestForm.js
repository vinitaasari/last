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

function InterestForm({ formValues, setFormValues }) {
  const [interests, setList] = useState([]);
  const [mi_user, setMiUser] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const referralDialog = useToggle();
  const successDialog = useToggle();
  const getCategoriesStatus = useCallbackStatus();
  const addLearnerStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const classes = useStyles();
  const notification = useSnackbar();

  const { setUserDetails } = useAuth();
  const { setUser } = useUser();
  const { logout } = useAuth();

  const getCatgories = useCallback(
    async (apiBody) => {
      try {
        const res = await getCategoriesStatus.run(
          apiClient("POST", "course_setting", "getcoursecategory", {
            body: { ...apiBody },
            shouldUseDefaultToken: true,
            cancelToken: apiSource.token,
          })
        );

        const list = res.content.data.map((item) => {
          const obj = {
            ...item,
            is_selected: false,
          };
          // if (formVaformValues.interests.includes(item.id)) {
          //   obj.is_selected = true;
          // }
          return obj;
        });
        setList(list);
      } catch (error) {
        if (error.code === 401) {
          logout();
        }
        notification.enqueueSnackbar(error.message, {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    },

    // eslint-disable-next-line
    []
  );

  useEffect(() => {
    getCatgories({
      is_admin: false,
      page_size: 100,
      page_number: 1,
    });

    return () => {
      apiSource.cancel();
    };
    // eslint-disable-next-line
  }, [getCatgories]);

  const handleChipClick = (chipDetails) => {
    const newList = interests.map((item) => {
      if (item.id === chipDetails.id) {
        item.is_selected = !item.is_selected;
      }
      return item;
    });
    setList(newList);
    const selectedList = interests
      .filter((item) => item.is_selected === true)
      .map((item) => item.id);
    setFormValues({ ...formValues, interests: selectedList });
  };

  const handleBackClick = () => {
    if (location.state && location.state.is_socialMedia_login === true) {
      history.push("/register?currentStep=location", { ...location.state });
    } else {
      history.push("/register?currentStep=location");
    }
  };

  const handleNextClick = () => {
    const selectedList = interests
      .filter((item) => item.is_selected === true)
      .map((item) => item.id);
    setFormValues({ ...formValues, interests: selectedList });
    if (location.state && location.state.is_socialMedia_login === true) {
      history.push("/register?currentStep=notification", {
        ...location.state,
      });
    } else {
      history.push("/register?currentStep=notification");
    }
  };

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
      <Slider value={90} />
      <div className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography className={classes.interestsText}>
              Please tell us your Interests
            </Typography>
          </Grid>

          <Grid item xs={12}>
            {getCategoriesStatus.isPending ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress
                  size={40}
                  className={classes.interestsLoader}
                />
              </Box>
            ) : (
                interests.map((item) => (
                  <Chip
                    key={item.id}
                    variant="outlined"
                    label={item.name}
                    onClick={() => handleChipClick(item)}
                    className={`${classes.interestChip} ${item.is_selected && classes.interestChipSelected
                      }`}
                  />
                ))
              )}
          </Grid>
        </Grid>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.updateProfileDetails}
          disabled={getCategoriesStatus.isPending || addLearnerStatus.isPending}
          onClick={handleNextClick}
        >
          {addLearnerStatus.isPending ? (
            <CircularProgress size={20} className={classes.loader} />
          ) : (
              "Next"
            )}
        </Button>
      </div>
    </Grid>
  );
}

export default InterestForm;
