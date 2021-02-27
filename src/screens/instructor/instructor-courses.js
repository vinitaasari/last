import React, { useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import CourseCard from "../courses/course-card";
import Loader from "../../components/loader";
import EmptyState from "../../components/empty-state";
import NoCoursesImage from "../../assets/images/no-reviews.svg";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({}));

const InstructorCourses = (props) => {
  const classes = useStyles();
  const { instructorId } = props;
  const [courses, setCourses] = useState([]);

  const getCourseApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const getCoursesOfInstructor = async (apiBody) => {
    try {
      const res = await getCourseApiStatus.run(
        apiClient("POST", "course_setting", "getcoursesbyinstructor", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      setCourses(data);
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    getCoursesOfInstructor({
      instructor_id: instructorId,
      page_number: 1,
      page_size: 100,
      is_approved: true,
    });
    // eslint-disable-next-line
  }, []);

  if (getCourseApiStatus.isPending) {
    return <Loader />;
  }

  return (
    <Grid container spacing={2} className={classes.coursesContainer}>
      <SEO
        title="Midigiworld - Instructor"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />
      {courses.length > 0 ? (
        courses.map((item) => {
          return (
            <Grid key={item.id} item xs={12} sm={6} md={3}>
              <CourseCard
                id={item.id}
                rating={item.course_rating}
                title={item.title}
                tagline={item.tag_line}
                price={item.price}
                discounted_price={item.discounted_price}
                image_url={item.image_url}
                thumbnail_image_url={item.thumbnail_image_url}
                instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                no_of_slots={item.no_of_available_slots}
                course_type={item.course_type}
                total_course_rating={item.total_course_rating}
                offered_price={item.offered_price}
                suggested_price={item.suggested_price}
                is_favorite={item.is_favourite}
                no_of_enrolled={item.no_of_enrolled}
                no_of_sessions={item.no_of_sessions}
                instructor_id={item.instructor_id}
                isWebinar={item.is_webinar ? true : false}
              />
            </Grid>
          );
        })
      ) : (
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <EmptyState image={NoCoursesImage} text="No course found" />
        </Box>
      )}
    </Grid>
  );
};

export default InstructorCourses;
