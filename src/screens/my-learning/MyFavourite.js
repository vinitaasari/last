import React, { useState, useEffect } from "react";
import { CircularProgress, Grid, Box } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import * as dateFns from "date-fns";
import { makeStyles } from "@material-ui/core/styles";

import UpComingCourseCard from "../../components/my-fav-card";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { getRemainingTime, scheduleTimeout } from "../../utils/date-time";
import shortid from "shortid";
import CourseCard from "../courses/course-card";

import {
  course_types,
  course_detail_view,
} from "../../static-data/course-constants";
import { useAuth } from "../../contexts/auth-context";
import EmptyState from "../../components/empty-state";
import NoFavoritesImage from "../../assets/images/no-favourite-courses.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

function Upcoming() {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [runningTimers, setRunningTimers] = useState([]);

  const history = useHistory();
  const { setFilters } = useUser();
  setFilters(null)

  const { user } = useUser();
  const getUpcomingCoursesApi = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();
  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  const getUpcomingCourses = async (apiBody) => {
    try {
      // clear the previous timeouts
      runningTimers.forEach((id) => clearTimeout(id));
      // eslint-disable-next-line
      const res = await getUpcomingCoursesApi.run(
        apiClient("POST", "learner", "getfavouritesbyearner", {
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

      setUpcomingCourses(courses);
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
    // because it requires user to be logged in
    if (user && user.authenticated === true) {
      getUpcomingCourses({
        learner_id: user.id,
        page_size: 20,
        page_number: 1,
      });
    }
    // eslint-disable-next-line
  }, [user]);

  const getDateTimeStr = (course_details_obj) => {
    const start_d = dateFns.fromUnixTime(course_details_obj.course_start_time);
    const end_d = dateFns.fromUnixTime(course_details_obj.course_end_time);

    const start_time_str = dateFns.format(start_d, "hh:mm a");
    const start_date_str = dateFns.format(start_d, "dd MMM");
    const end_time_str = dateFns.format(end_d, "hh:mm a");
    // const end_date_str = dateFns.format(end_d, "dd MMM")

    return `${start_date_str} ${start_time_str} - ${end_time_str}`;
  };

  if (getUpcomingCoursesApi.isPending) {
    return (
      <Grid item container xs={12} justify="center">
        <CircularProgress color="primary" size={28} />
      </Grid>
    );
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="left" spacing={spacing}>
          {upcomingCourses.length > 0 ? (
            upcomingCourses.map((item) => (
              <Grid key={item} xs={3} item>
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
                  on={true}
                  no_of_enrolled={item.no_of_enrolled}
                  no_of_sessions={item.no_of_sessions}
                  instructor_id={item.instructor_id}
                  isWebinar={item.is_webinar ? true : false}
                />
              </Grid>
            ))
          ) : (
              <Grid xs={12} container justify="center" item>
                <EmptyState
                  image={NoFavoritesImage}
                  text="No Favourite course added yet"
                />
              </Grid>
            )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Upcoming;
