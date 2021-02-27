import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CustomCarousel from "../../components/carousel";

import { useSnackbar } from "notistack";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useAuth } from "../../contexts/auth-context"
import Loader from "../../components/loader";

const useStyles = makeStyles((theme) => ({
  sectionHeading: {
    color: "#3F3F3F",
    fontSize: "26px",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "22px",
    },
  },
  skillContainer: {
    backgroundColor: "#F4F6FA",
    padding: theme.spacing(2),
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
  },
  skillName: {
    color: "#03579C",
    fontSize: "20px",
    fontWeight: 600,
  },
}));

const TrendingSkill = ({ skill }) => {
  const classes = useStyles();

  return (
    <Box pr={2}>
      <Paper
        variant="elevation"
        elevation={0}
        classes={{ root: classes.skillContainer }}
      >
        <Typography classes={{ root: classes.skillName }}>
          {/* {skill.name} */}
        </Typography>
      </Paper>
    </Box>
  );
};

const TrendingSkills = (props) => {
  const classes = useStyles();

  const [skills, setSkills] = useState([]);
  const skillsApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth()

  const getTrendingSkills = useCallback(async () => {
    try {
      const res = await skillsApiStatus.run(
        apiClient("POST", "course_setting", "gettrendingskill", {
          body: { page_number: 1, page_size: 100 },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: false,
        })
      );

      const {
        content: { data },
      } = res;

      setSkills(data);
    } catch (error) {
      if (error.code === 401) {
        logout()
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, []);

  useEffect(() => {
    getTrendingSkills();
  }, [getTrendingSkills]);

  return (
    <CustomCarousel
      heading={
        <Typography variant="body1" classes={{ root: classes.sectionHeading }}>
          Trending Skills
        </Typography>
      }
      itemsToDisplay={5}
    >
      {skills.map((skill) => (
        <TrendingSkill key={skill.id} skill={skill} />
      ))}
    </CustomCarousel>
  );
};

export default TrendingSkills;
