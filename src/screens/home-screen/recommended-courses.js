import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CustomCarousel from "../../components/carousel";
import CourseCard from "../courses/course-card";

import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
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
}));

const RecommendedCourses = (props) => {
  const classes = useStyles();

  const [courses, setCourses] = useState([]);

  const { getUserId } = useAuth();
  const learner_id = getUserId();
  const coursesApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const getCourses = useCallback(async () => {
    try {
      const res = await coursesApiStatus.run(
        apiClient("POST", "course", "getrecommendcourse", {
          body: { learner_id: learner_id, page_number: 1, page_size: 5 },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: false,
        })
      );

      const {
        content: { response },
      } = res;

      setCourses(response);
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
    getCourses();
  }, [getCourses]);

  return (
    <CustomCarousel
      heading={
        <Typography variant="body1" classes={{ root: classes.sectionHeading }}>
          Recommended Courses
        </Typography>
      }
      itemsToDisplay={4}
    >
      {courses.map((course) => (
        <Box pr={2} key={course.id}>
          <CourseCard course={course} />
        </Box>
      ))}
    </CustomCarousel>
  );
};

export default RecommendedCourses;
