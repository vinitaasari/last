import React, { Fragment, useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";

const useStyles = makeStyles((theme) => ({
  languageChipsContainer: {
    width: "30%",
    // display: "flex",
    // flexWrap: "wrap",
    // "& > *": {
    //   margin: theme.spacing(0.5),
    // },
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
  heading: {
    color: "#334856",
    fontSize: "16px",
    fontWeight: 500,
  },
  paper: {
    marginTop: theme.spacing(2),
    boxShadow: "none",
    border: "1px solid #d9dfe5",
  },
}));

const CourseLanguagePreference = (props) => {
  const classes = useStyles();
  const [languages, setLanguages] = useState([]);
  const { logout } = useAuth();

  const getLanguageStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { currentLanguagePreferences, updateLearnerProfile } = props;

  const getLanguages = async (apiBody) => {
    try {
      const res = await getLanguageStatus.run(
        apiClient("POST", "admin_configuration", "getlanguage", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      const list = res.content.data.map((item) => {
        const languageObj = {
          ...item,
          isSelected: false,
        };
        const isCurrentLang = currentLanguagePreferences.find(
          (lang) => lang.id === item.id
        );

        if (isCurrentLang) {
          languageObj.isSelected = true;
        }

        return languageObj;
      });
      setLanguages(list);
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
    getLanguages({
      is_admin: false,
      page_size: 100,
      page_number: 1,
    });

    return () => {
      apiSource.cancel();
    };
    // eslint-disable-next-line
  }, [currentLanguagePreferences]);

  const handleChipClick = (chipDetails) => {
    const newLanguages = languages.map((item) => {
      if (item.id === chipDetails.id) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });
    setLanguages(newLanguages);
  };

  const updateLanguagePreferences = () => {
    const selectedList = languages
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    updateLearnerProfile({ user_language: selectedList });
  };

  if (getLanguageStatus.isPending) {
    return (
      <Box className={classes.languageChipsContainer}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <Fragment>
      <Box className={classes.languageChipsContainer}>
        <Typography className={classes.heading}>
          You can select multiple language from here
        </Typography>

        <Paper className={classes.paper}>
          <List className={classes.root}>
            {languages.map((item) => {
              const labelId = `checkbox-list-label-${item.language}`;
              return (
                <ListItem
                  key={item.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => handleChipClick(item)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={item.isSelected}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={item.language}
                    style={{
                      color: item.isSelected ? "#f05e23" : undefined,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Box>
      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={updateLanguagePreferences}
        >
          {props.imageApiStatus.isPending ? (
            <CircularProgress
              size={20}
              style={{ color: "white" }}
              className={classes.loader}
            />
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </Fragment>
  );
};

export default CourseLanguagePreference;
