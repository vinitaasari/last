import React, { useEffect, useState } from "react";
import { Container, Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import CourseReviews from "../courses/CourseReviews";
import Loader from "../../components/loader";
import EmptyState from "../../components/empty-state";
import NoCoursesImage from "../../assets/images/no-reviews.svg";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({}));

const InstructorReviews = (props) => {
  const classes = useStyles();
  const { instructorId, instructorRating, totalInstructorRating } = props;
  const [reviews, setReviews] = useState([]);

  const getReviewApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const getReviewsOfInstructor = async (apiBody) => {
    try {
      const res = await getReviewApiStatus.run(
        apiClient("POST", "rating", "getreviewsbyinstructorid", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      setReviews(data);
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    getReviewsOfInstructor({
      instructor_id: instructorId,
      page_number: 1,
      page_size: 100,
    });
    // eslint-disable-next-line
  }, []);

  if (getReviewApiStatus.isPending) {
    return <Loader />;
  }

  return (
    <Grid container spacing={2} className={classes.coursesContainer}>
      <SEO
        title="Midigiworld - Instructor"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />
      <Grid item xs={12}>
        <CourseReviews
          reviews={reviews}
          courseRating={instructorRating}
          totalCourseRating={totalInstructorRating}
          itemsToDisplay={3}
        />
      </Grid>
    </Grid>
  );
};

export default InstructorReviews;
