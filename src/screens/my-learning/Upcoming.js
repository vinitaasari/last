import React, { useState, useEffect } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import * as dateFns from "date-fns";
import { makeStyles } from "@material-ui/core/styles";

import EmptyState from "../../components/empty-state";
import CustomPagination from "../../components/pagination";
import UpComingCourseCard from "../../components/upcoming-course-card";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { getRemainingTime, scheduleTimeout } from "../../utils/date-time";
import shortid from "shortid";
import { MyLearnings as MyLearningsLoader } from "../../components/loader";

import {
  course_types,
  course_detail_view,
} from "../../static-data/course-constants";
import { useAuth } from "../../contexts/auth-context";
import NoUpcomingCoursesImage from "../../assets/images/no-upcoming-session.svg";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const history = useHistory();
  const { setFilters } = useUser();

  const { user } = useUser();
  setFilters(null);

  const getUpcomingCoursesApi = useCallbackStatus();
  const joinSessionApiStatus = useCallbackStatus();

  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();
  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };

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
      const res = await getUpcomingCoursesApi.run(
        apiClient("POST", "course", "getupcomingenrolledcourse", {
          body: { ...apiBody },
          cancelToken: apiSource.token,
        })
      );
      console.log(res)
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

      enableCourseJoin(courses, "session_start_time", ["disableJoin", true]);
      setUpcomingCourses(courses);
      setTotalPages(Math.ceil(res.content.totalPages / 12));

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
    // because it requires user to be logged in
    if (user && user.authenticated === true) {
      getUpcomingCourses({
        learner_id: user.id,
        page_size: 12,
        page_number: 1,
      });
    }
    // eslint-disable-next-line
  }, [user]);

  const getDateTimeStr = (course_details_obj) => {
    const start_d = dateFns.fromUnixTime(course_details_obj.session_start_time);
    const end_d = dateFns.fromUnixTime(course_details_obj.session_end_time);

    const start_time_str = dateFns.format(start_d, "hh:mm a");
    const start_date_str = dateFns.format(start_d, "dd MMM");
    const end_time_str = dateFns.format(end_d, "hh:mm a");
    // const end_date_str = dateFns.format(end_d, "dd MMM")

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getUpcomingCourses({
      learner_id: user.id,
      page_size: 12,
      page_number: newPage,
    });
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
              <Grid key={item} item>
                <UpComingCourseCard
                  key={item.slot_course_session_id}
                  title={item.session_title}
                  tagline={item.tag_line}
                  image_url={item.image_url}
                  thumbnail_image_url={item.thumbnail_image_url}
                  instructor_id={item.instructor_id}
                  instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                  rating={item.course_rating}
                  course_rating={item.total_course_rating}
                  dateAndTime={getDateTimeStr(item)}
                  handleJoinCourse={handleJoinCourse}
                  courseObj={{ ...item }}
                  isDisabled={item.disableJoin}
                  joinSession={joinSession}
                  learner_id={user.id}
                  session_start_time={item.session_start_time}
                  session_end_time={item.session_end_time}
                />
              </Grid>
            ))
          ) : (
              <Grid xs={12} container justify="center" item>
                <EmptyState
                  image={NoUpcomingCoursesImage}
                  text="No upcoming session"
                />
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
