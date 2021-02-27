import React, { useEffect, useState } from "react";
import { history, useHistory } from "react-router-dom";
import shortid from "shortid";
import { Box, Container, Chip, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppWrapper from "../../components/app-wrapper";
import CourseCard from "../courses/course-card";
import Loader from "../../components/loader";
import EmptyState from "../../components/empty-state";
import NoCoursesImage from "../../assets/images/no-reviews.svg";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { useAuth } from "../../contexts/auth-context";
import { useSnackbar } from "notistack";
import { getRemainingTime, scheduleTimeout } from "../../utils/date-time";
import UpComingCourseCard from "../../components/upcoming-course-card";
import * as dateFns from "date-fns";
import {
  course_types,
  course_detail_view,
} from "../../static-data/course-constants";
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

const UpcomingCourses = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [runningTimers, setRunningTimers] = useState([]);
  const { user } = useUser();

  const getHomeScreenDataApi = useCallbackStatus();
  const joinSessionApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();

  const enableCourseJoin = (arr, idKey, id, keyValue, updaterFunc) => {
    return () => {
      const result = arr.map((item) => {
        if (item[idKey] === id) {
          const [key, value] = keyValue;
          item[key] = value;
        }
        return item;
      });

      updaterFunc(result);
    };
  };

  const getUpcomingCourses = async (apiBody) => {
    try {
      // clear the previous timeouts
      runningTimers.forEach((id) => clearTimeout(id));
      // eslint-disable-next-line
      const res = await getHomeScreenDataApi.run(
        apiClient("POST", "course", "getupcomingenrolledcourse", {
          body: { ...apiBody },
          cancelToken: apiSource.token,
        })
      );

      const courses = res.content.data.map((item) => {
        const unique_id = shortid.generate();
        return {
          ...item,
          disableJoin: true,
          unique_id,
        };
      });

      const timers = [];
      courses.forEach((item) => {
        const remainingTime = getRemainingTime(item.session_start_time);
        const timerId = scheduleTimeout(
          enableCourseJoin(
            courses,
            "unique_id",
            item.unique_id,
            ["disableJoin", false],
            setUpcomingCourses
          ),
          remainingTime
        );

        timers.push(timerId);
      });

      // do something with res
      enableCourseJoin(courses, "session_start_time", ["disableJoin", true]);
      setUpcomingCourses(courses);
      setRunningTimers([...runningTimers, ...timers]);
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
    if (user && user.authenticated === true) {
      getUpcomingCourses({
        learner_id: user.id,
        page_size: 20,
        page_number: 1,
      });
    }

    // eslint-disable-next-line
  }, []);

  const filterCourses = (chosenFilterValues) => {
    getUpcomingCourses({
      learner_id: user.id,
      page_size: 20,
      page_number: 1,
    });
  };

  const getDateTimeStr = (course_details_obj) => {
    const start_d = dateFns.fromUnixTime(course_details_obj.session_start_time);
    const end_d = dateFns.fromUnixTime(course_details_obj.session_end_time);

    const start_time_str = dateFns.format(start_d, "hh:mm a");
    const start_date_str = dateFns.format(start_d, "dd MMM");
    const end_time_str = dateFns.format(end_d, "hh:mm a");

    return `${start_date_str} ${start_time_str} - ${end_time_str}`;
  };

  const handleJoinCourse = (courseObj) => {
    history.push(
      `/course-detail/${course_types[courseObj.course_type]}/${courseObj.id}`,
      {
        view: course_detail_view.joinCourse,
      }
    );
  };

  const joinSession = async (apiBody, courseObj) => {
    try {
      const res = await joinSessionApiStatus.run(
        apiClient("POST", "zoom", "startmeeting", {
          body: { ...apiBody },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
          enableLogging: false,
        })
      );

      const {
        content: { data },
        code,
      } = res;

      if (code === 200) {
        const meetingUrl = "/join-meeting";
        history.push(meetingUrl, {
          meetingId: data.meeting_id,
          meetingPassword: data.password,
          meetingSignature: data.learner_signature,
          displayName: data.display_name,
          courseObj,
        });
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

  if (getHomeScreenDataApi.isPending) {
    return <Loader />;
  }

  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - Upcoming Courses"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Typography classes={{ root: classes.heading }}>All Courses</Typography>

        <Grid container spacing={2} className={classes.coursesContainer}>
          {upcomingCourses.length > 0 ? (
            upcomingCourses.map((item) => {
              return (
                <Grid key={item.id} item xs={12} sm={6} md={4}>
                  <UpComingCourseCard
                    title={item.session_title}
                    tagline={item.tag_line}
                    instructor_id={item.instructor_id}
                    instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                    rating={item.course_rating}
                    total_rating={item.total_course_rating}
                    dateAndTime={getDateTimeStr(item)}
                    handleJoinCourse={() => handleJoinCourse({ ...item })}
                    image_url={item.image_url}
                    thumbnail_image_url={item.thumbnail_image_url}
                    joinSession={joinSession}
                    courseObj={{ ...item }}
                    isDisabled={item.disableJoin}
                    learner_id={user.id}
                    session_start_time={item.session_start_time}
                    session_end_time={item.session_end_time}
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

export default UpcomingCourses;
