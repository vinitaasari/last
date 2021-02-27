import React, { Fragment, useState, useCallback, useEffect } from "react";
import { Box, Button, Chip, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";

const useStyles = makeStyles((theme) => ({
  interestChipsContainer: {
    width: "60%",
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  activeChipOutlined: {
    backgroundColor: "#E2EAFA",
    border: "1px solid #05589C",
  },
  activeChipLabel: {
    color: "#05589C",
  },
}));

const EditInterest = (props) => {
  const classes = useStyles();
  const [interests, setInterests] = useState([]);
  const { logout } = useAuth();

  const getCategoriesStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { currentInterests, updateLearnerProfile } = props;

  const getCatgories = async (apiBody) => {
    try {
      const res = await getCategoriesStatus.run(
        apiClient("POST", "course_setting", "getcoursecategory", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      // const list = res.content.data.response;

      const list = res.content.data.map((item) => {
        const obj = {
          ...item,
          is_selected: false,
        };
        if (currentInterests.find((i) => i.id === item.id)) {
          obj.is_selected = true;
        }
        return obj;
      });

      setInterests(list);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      if (error.message) {
        notification.enqueueSnackbar(error.message, {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    }
  };

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
  }, [currentInterests]);

  const handleChipClick = (chipDetails) => {
    const newList = interests.map((item) => {
      if (item.id === chipDetails.id) {
        item.is_selected = !item.is_selected;
      }
      return item;
    });
    setInterests(newList);
  };

  const updateInterests = () => {
    const selectedList = interests
      .filter((item) => item.is_selected === true)
      .map((item) => item.id);
    updateLearnerProfile({ interest: selectedList });
  };

  return (
    <Fragment>
      <Box className={classes.interestChipsContainer}>
        {interests.map((interest) => {
          return (
            <Chip
              key={interest.id}
              label={interest.name}
              clickable
              variant="outlined"
              onClick={() => handleChipClick(interest)}
              classes={{
                outlined: interest.is_selected
                  ? classes.activeChipOutlined
                  : undefined,
                label: interest.is_selected
                  ? classes.activeChipLabel
                  : undefined,
              }}
            />
          );
        })}
      </Box>
      <Box mt={6}>
        <Button variant="contained" color="secondary" onClick={updateInterests}>
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
      </Box>
    </Fragment>
  );
};

export default EditInterest;
