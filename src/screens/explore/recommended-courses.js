import React, { useEffect, useState } from "react";
import { Box, Container, Chip, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppWrapper from "../../components/app-wrapper";
import CourseCard from "../courses/course-card";
import CourseFilterModal from "./course-filter";
import Loader from "../../components/loader";
import EmptyState from "../../components/empty-state";
import NoCoursesImage from "../../assets/images/no-reviews.svg";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: "#52534f",
    fontSize: "22px",
    fontWeight: 600,
  },
  coursesContainer: {
    marginTop: theme.spacing(2),
  },
  skillChipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
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

const TrendingSkillDetail = (props) => {
  const classes = useStyles();

  const [courses, setCourses] = useState([]);

  const getCourseApiStatus = useCallbackStatus();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();

  const getRecommendedCourses = async (apiBody) => {
    try {
      const res = await getCourseApiStatus.run(
        apiClient("POST", "course", "getrecommendcourse", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      setCourses(res.content.data);
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

  useEffect(() => {
    getRecommendedCourses({ page_size: 20, page_number: 1 });
    // eslint-disable-next-line
  }, []);

  if (getCourseApiStatus.isPending) {
    return <Loader />;
  }

  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - Recommended Courses"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Typography classes={{ root: classes.heading }}>
          All Recommended Courses
        </Typography>

        <Grid container spacing={2} className={classes.coursesContainer}>
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
                    instructor_id={item.instructor_id}
                    no_of_enrolled={item.no_of_enrolled}
                    no_of_sessions={item.no_of_sessions}
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
      </Container>
    </AppWrapper>
  );
};

export default TrendingSkillDetail;
