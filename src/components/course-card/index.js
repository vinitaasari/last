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
import Truncate from "react-truncate";

import { course_types } from "../../static-data/course-constants";

const statusToColor = {
  Missed: "#EF250B",
  Ongoing: "#EFB414",
  Completed: "#479B00",
};

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    minWidth: "370px",
    borderBottom: "1px solid #E7E7EA",
    borderRadius: "4px",
  },
  media: {
    height: 120,
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
  statusText: {
    fontWeight: 600,
    textAlign: "right",
  },
}));

export function MyCourseCard({
  title = "",
  tagline = "",
  dateAndTime = null,
  handleJoinCourse = () => {},
  isDisabled = true,
  courseObj = {},
  image_url,
}) {
  const classes = useStyles({ isJoinDisabled: isDisabled });

  const handleJoinClick = (e) => {
    e.stopPropagation();
    if (isDisabled) {
      return;
    }

    handleJoinCourse(courseObj);
  };
  return (
    <Box pr={2} mt={3}>
      <Card onClick={handleJoinClick}>
        <CardActionArea>
          <Box display="flex" w={1} className={classes.cardContainer}>
            <CardMedia
              className={classes.media}
              image={image_url}
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
                style={{ marginTop: "1rem" }}
              >
                <Typography classes={{ root: classes.courseInstructor }}>
                  {courseObj &&
                    (courseObj.course_type === course_types.slot
                      ? `${courseObj.no_of_enrolled} slots`
                      : courseObj.course_type === course_types.structured
                      ? `${courseObj.no_of_sessions} sessions`
                      : "")}
                </Typography>
                {/* <Box display="flex" alignItems="center">
                  <Star style={{ fontSize: 16, color: "#FFB833" }} />
                  <Typography
                    varaint="caption"
                    classes={{ root: classes.ratingText }}
                  >
                    {rating <= 0 ? "New" : `${rating} (${total_rating})`}
                  </Typography>
                </Box> */}
              </Box>
            </CardContent>
          </Box>
          <CardContent classes={{ root: classes.ctaContainer }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              fullWidth
              style={{ width: "100%" }}
              // onClick={handleJoinClick}
              // role="Join Course Button"
            >
              {dateAndTime &&
                courseObj &&
                (courseObj.course_type === course_types.structured ? (
                  <Typography classes={{ root: classes.date }}>
                    {`${dateAndTime.startDate} - ${dateAndTime.endDate}`}
                  </Typography>
                ) : courseObj.course_type === course_types.slot ? (
                  <Typography classes={{ root: classes.date }}>
                    {`${dateAndTime.startDate} . ${dateAndTime.startTime} - ${dateAndTime.endTime}`}
                  </Typography>
                ) : null)}
              <Typography
                classes={{ root: classes.statusText }}
                style={{ color: statusToColor[courseObj.status] }}
              >
                {courseObj && courseObj.status}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
