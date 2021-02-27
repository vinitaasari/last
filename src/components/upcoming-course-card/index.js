import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Star } from "@material-ui/icons";

import PlayColorIcon from "../../assets/images/join-now-active-animation.gif";
import PlayColorIconDisabled from "../../assets/images/play-color-icon-disabled.svg";
import Truncate from "react-truncate";
import { useHistory } from "react-router-dom";
import { isAfter, isBefore, format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    minWidth: "370px",
    borderBottom: "1px solid #E7E7EA",
    borderRadius: "4px",
  },
  media: {
    height: 118,
    width: "50%",
  },
  cardContent: {
    width: "100%",
    height: "100%",
  },
  courseName: {
    color: "#393A45",
    fontSize: "20px",
    fontWeight: 600,
  },
  courseDescription: {
    color: "#393A45",
    fontSize: "16px",
    fontWeight: 500,
  },
  courseInstructor: {
    color: "#393A45",
    fontSize: "13px",
    fontWeight: 400,
    textTransform: "capitalize",
  },
  date: {
    color: "#393A45",
    fontSize: "15px",
    fontWeight: 600,
  },
  ctaContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaText: (props) => ({
    marginLeft: theme.spacing(1),
    color: props.isJoinDisabled ? "#9b9b9b" : "#F05E23",
    fontSize: "16px",
    fontWeight: 500,
    textTransform: "none",
  }),
  ratingText: {
    marginLeft: theme.spacing(0.5),
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
  },
  joinNowBtn: {
    "&:hover": {
      backgroundColor: 'transparent'
    }
  }
}));

function UpComingCourseCard({
  title = "",
  tagline = "",
  instructor_id = "",
  instructor_name = "",
  rating = 0,
  course_rating = 0,
  dateAndTime = "",
  handleJoinCourse = () => { },
  isDisabled = true,
  courseObj = {},
  image_url,
  thumbnail_image_url,
  joinSession,
  learner_id,
  duration,
  session_start_time = "",
  session_end_time = "",
}) {
  const classes = useStyles({ isJoinDisabled: isDisabled });
  const history = useHistory();

  const noPropagation = (e) => e.stopPropagation();
  const LinkNoPropagate = (props) => (
    <Link {...props} onClick={noPropagation} />
  );

  const handleJoinClick = (event) => {
    event.stopPropagation()
    let apiBody = {
      entity_type: "learner",
      learner_id: learner_id,
    };

    if (courseObj.course_type === "slot_course") {
      apiBody = {
        ...apiBody,
        slot_course_session_id: courseObj.slot_course_session_id,
      };
    } else {
      apiBody = {
        ...apiBody,
        structured_course_timing_id: courseObj.structured_course_timing_id,
      };
    }

    joinSession(apiBody, courseObj);
  };

  const isMeetingJoinable = () => {
    if (session_start_time && session_end_time) {
      const startTime = session_start_time * 1000;
      const endTime = session_end_time * 1000;
      const timeUnit = localStorage.getItem("before_start_time");
      const startSessionBeforeTime = timeUnit * 60 * 1000;
      const sessionBeforeStartTime = startTime - startSessionBeforeTime;
      if (
        isAfter(new Date(), new Date(sessionBeforeStartTime)) &&
        isBefore(new Date(), new Date(endTime))
      ) {
        return true;
      }

      if (isAfter(new Date(), new Date(endTime))) {
        return false;
      }
      return false;
    } else {
      return false;
    }
  };

  return (
    <Box pr={3} style={{ height: '40%' }}>
      <Card>
        <CardActionArea>
          <Box
            onClick={() => {
              if (courseObj.course_type === "slot_course") {
                history.push("/course-detail/slot/" + courseObj.id, {
                  details: true,
                  courseObj,
                  session_end_time,
                  session_start_time,
                  duration,
                });
              } else {
                history.push("/course-detail/structured/" + courseObj.id, {
                  details: true,
                  courseObj,
                  session_end_time,
                  session_start_time,
                });
              }
            }}
            display="flex"
            w={1}
            className={classes.cardContainer}
          >
            <CardMedia
              className={classes.media}
              image={thumbnail_image_url}
              title={title}
            />
            <CardContent classes={{ root: classes.cardContent }}>
              <Typography classes={{ root: classes.courseName }}>
                <Truncate lines={1} ellipsis={<span>...</span>}>
                  {
                    title.length > 25 ? (
                      <>
                        {title.substring(0, 25)}...
                </>
                    ) : (
                        title
                      )
                  }
                </Truncate>
              </Typography>
              <Typography classes={{ root: classes.courseDescription }}>
                <Truncate lines={1} ellipsis={<span>...</span>}>
                  {
                    tagline.length > 30 ? (
                      <>
                        {tagline.substring(0, 30)}...
                </>
                    ) : (
                        tagline
                      )
                  }                </Truncate>
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="auto"
              >
                <LinkNoPropagate to={`/instructor/${instructor_id}`}>
                  <Typography classes={{ root: classes.courseInstructor }}>
                    {instructor_name && `By `}
                    {
                      instructor_name.length > 30 ? (
                        <>
                          {instructor_name.substring(0, 30)}...
                </>
                      ) : (
                          instructor_name
                        )
                    }
                  </Typography>
                </LinkNoPropagate>
                <Box display="flex" alignItems="center">
                  <Star style={{ fontSize: 16, color: "#FFB833" }} />
                  <Typography
                    varaint="caption"
                    classes={{ root: classes.ratingText }}
                  >
                    {rating <= 0 ? "New" : `${rating} (${course_rating})`}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Box>
          <CardContent
            onClick={() => {
              if (courseObj.course_type === "slot_course") {
                history.push("/course-detail/slot/" + courseObj.id, {
                  details: true,
                  courseObj,
                  session_end_time,
                  session_start_time,
                  duration,
                });
              } else {
                history.push("/course-detail/structured/" + courseObj.id, {
                  details: true,
                  courseObj,
                  session_end_time,
                  session_start_time,
                });
              }
            }}
            classes={{ root: classes.ctaContainer }}
          >
            <Typography classes={{ root: classes.date }}>
              {dateAndTime}
            </Typography>

            <Button disabled={!isMeetingJoinable()} className={classes.joinNowBtn} onClick={handleJoinClick}>
              {isMeetingJoinable() ? (
                <>
                  <img
                    src={PlayColorIcon}
                    style={{ height: "35px", width: "35px" }}
                  />
                  <Typography style={{ color: "red" }}>Join now</Typography>
                </>
              ) : (
                  <>
                    <img src={PlayColorIconDisabled} alt="Join session button" />
                    <Typography style={{ color: "grey", marginLeft: "10px" }}>
                      Join now
                  </Typography>
                  </>
                )}
            </Button>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export default UpComingCourseCard;
