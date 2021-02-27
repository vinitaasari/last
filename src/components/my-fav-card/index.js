import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Star } from "@material-ui/icons";
import moment from "moment";
import PlayColorIcon from "../../assets/images/play-color-icon.svg";
import PlayColorIconDisabled from "../../assets/images/play-color-icon-disabled.svg";
import Truncate from "react-truncate";
import LinearProgress from "@material-ui/core/LinearProgress";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { useHistory } from "react-router-dom";

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
  }),
  ratingText: {
    marginLeft: theme.spacing(0.5),
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
  },
}));

const Point = () => {
  return (
    <div
      style={{
        width: 4,
        height: 4,
        borderRadius: 4,
        backgroundColor: "#747572",
        marginRight: "4px",
        marginTop: "8px",
        marginLeft: "4px",
      }}
    />
  );
};

function UpComingCourseCard({
  title = "",
  tagline = "",
  instructor_name = "",
  rating = 0,
  total_rating = 0,
  dateAndTime = "",
  isDisabled = true,
  courseObj = {},
  course_type = "",
  total_sessions = "",
  status = "",
  thumbnail_image_url,
  image_url,
}) {
  const classes = useStyles({ isJoinDisabled: isDisabled });

  const history = useHistory();
  return (
    <Box pr={2}>
      <Card
        onClick={() => {
          if (courseObj.course_type === "slot_course") {
            history.push("/course-detail/slot/" + courseObj.id, {
              details: false,
            });
          } else {
            history.push("/course-detail/structured/" + courseObj.id, {
              details: false,
            });
          }
        }}
      >
        <CardActionArea>
          <Box display="flex" w={1} className={classes.cardContainer}>
            <CardMedia
              className={classes.media}
              image={thumbnail_image_url}
              title={title}
            />
            <CardContent classes={{ root: classes.cardContent }}>
              <Typography classes={{ root: classes.courseName }}>
                <Truncate lines={1} ellipsis={<span>...</span>}>
                  {title || ""}
                </Truncate>
              </Typography>
              <Typography classes={{ root: classes.courseDescription }}>
                <Truncate lines={1} ellipsis={<span>...</span>}>
                  {tagline || ""}
                </Truncate>
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="auto"
              >
                <Typography classes={{ root: classes.courseInstructor }}>
                  {instructor_name && `By ${instructor_name}`}
                </Typography>

                <Box display="flex" alignItems="center">
                  <Star style={{ fontSize: 16, color: "#FFB833" }} />
                  <Typography
                    varaint="caption"
                    classes={{ root: classes.ratingText }}
                  >
                    {rating <= 0 ? "New" : `${rating} (${total_rating})`}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="auto"
              >
                <Typography classes={{ root: classes.courseInstructor }}>
                  {course_type === "slot_course" && status != "Ongoing" && (
                    <span>{total_sessions} Slots</span>
                  )}
                  {course_type != "slot_course" && status != "Ongoing" && (
                    <span>{total_sessions} Sessions</span>
                  )}
                </Typography>
              </Box>
              <div style={{ marginTop: "10px" }}></div>
              {course_type === "slot_course" && status === "Ongoing" && (
                <>
                  <Box width="100%" mr={1}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        courseObj.completed_session /
                        courseObj.total_session /
                        100
                      }
                    />
                  </Box>
                  <Box display="flex" alignItems="left">
                    <Typography
                      varaint="caption"
                      classes={{ root: classes.ratingText }}
                    >
                      {courseObj.completed_session} Sessions of{" "}
                      {courseObj.total_session}
                    </Typography>
                  </Box>
                </>
              )}
              {course_type != "slot_course" && status === "Ongoing" && (
                <>
                  <Box width="100%" mr={1}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (courseObj.completed_session /
                          courseObj.total_session) *
                        100
                      }
                    />
                  </Box>
                  <Box display="flex" alignItems="left">
                    <Typography
                      varaint="caption"
                      classes={{ root: classes.ratingText }}
                    >
                      {courseObj.completed_session} Sessions of{" "}
                      {courseObj.total_session}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Box>
          <CardContent classes={{ root: classes.ctaContainer }}>
            <Typography classes={{ root: classes.date }}>
              {courseObj.course_type === "slot_course" && (
                <span style={{ display: "flex" }}>
                  {moment(new Date(courseObj.course_start_time * 1000)).format(
                    "DD/MM/YYYY"
                  )}
                  <Point />
                  {moment(new Date(courseObj.session_start_time * 1000)).format(
                    "hh:mm"
                  )}
                  -
                  {moment(new Date(courseObj.session_end_time * 1000)).format(
                    "hh:mm"
                  )}
                </span>
              )}
              {courseObj.course_type != "slot_course" && (
                <span>
                  {moment(new Date(courseObj.course_start_time * 1000)).format(
                    "DD/MM/YYYY"
                  )}
                  -
                  {moment(new Date(courseObj.course_end_time * 1000)).format(
                    "DD/MM/YYYY"
                  )}
                </span>
              )}
            </Typography>
            <Typography>
              {status === "Missed" && (
                <span style={{ color: "red" }}>{status}</span>
              )}
              {status === "Ongoing" && (
                <span style={{ color: "yellow" }}>{status}</span>
              )}
              {status === "Completed" && (
                <span style={{ color: "green" }}>{status}</span>
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export default UpComingCourseCard;
