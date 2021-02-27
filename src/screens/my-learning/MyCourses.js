import React, { useState, useEffect } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import * as dateFns from "date-fns";
import { makeStyles } from "@material-ui/core/styles";

import UpComingCourseCard from "../../components/my-courses-card";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { getRemainingTime, scheduleTimeout } from "../../utils/date-time";
import shortid from "shortid";
import {
  course_types,
  course_detail_view,
} from "../../static-data/course-constants";
import { useAuth } from "../../contexts/auth-context";
import EmptyState from "../../components/empty-state";
import NoCoursesImage from "../../assets/images/no-courses.svg";
import CustomPagination from "../../components/pagination";

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

function Upcoming(props) {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();
  const history = useHistory();
  const { setFilters } = useUser();

  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [runningTimers, setRunningTimers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useUser();
  const { filters } = useUser();

  const getUpcomingCoursesApi = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();
  console.log(filters);
  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

  const getUpcomingCourses = async (apiBody) => {
    try {
      // clear the previous timeouts
      runningTimers.forEach((id) => clearTimeout(id));
      // eslint-disable-next-line
      const res = await getUpcomingCoursesApi.run(
        apiClient("POST", "course", "getmycourselist", {
          body: { ...apiBody },
          enableLogging: true,
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
      console.log(apiBody);
      console.log(courses);
      setUpcomingCourses(courses);
      setPage(0)
      setTotalPages(Math.ceil(res.content.totalPages));
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
    setFilters("All");
  }, []);

  useEffect(() => {
    // because it requires user to be logged in
    if (user && user.authenticated === true) {
      if (filters && filters != "All") {
        getUpcomingCourses({
          learner_id: user.id,
          page_size: 12,
          page_number: 1,
          status: filters,
        });
      } else {
        getUpcomingCourses({
          learner_id: user.id,
          page_size: 12,
          page_number: 1,
        });
      }
    }
    // eslint-disable-next-line
  }, [user, filters]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (filters && filters != "All") {
      getUpcomingCourses({
        learner_id: user.id,
        page_size: 12,
        page_number: newPage,
        status: filters,
      });
    } else {
      getUpcomingCourses({
        learner_id: user.id,
        page_size: 12,
        page_number: newPage,
      });
    }
  };

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
            upcomingCourses.map((item, index) => (
              <Grid key={item} item>
                <UpComingCourseCard
                  key={item.slot_course_session_id}
                  title={item.title}
                  tagline={item.tag_line}
                  instructor_id={item.instructor_id}
                  instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                  rating={item.course_rating}
                  total_rating={item.total_course_rating}
                  image_url={item.image_url}
                  thumbnail_image_url={item.thumbnail_image_url}
                  status={item.status}
                  course_type={item.course_type}
                  total_sessions={item.total_session}
                  dateAndTime={getDateTimeStr(item)}
                  courseObj={{ ...item }}
                />
              </Grid>
            ))
          ) : (
              <Grid xs={12} container justify="center" item>
                <EmptyState image={NoCoursesImage} text="No course added yet" />
              </Grid>
            )}
        </Grid>
      </Grid>
      {upcomingCourses.length > 0 && (
        <Grid container item xs={12} justify="center">
          <CustomPagination
            page={page}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default Upcoming;
