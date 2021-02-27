import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { apiClient } from "../../utils/api-client";

import { Star, Event, Favorite, People } from "@material-ui/icons";
import JoinNowActiveIcon from "../../assets/images/join-now-active.svg";
import JoinNowDisabledIcon from "../../assets/images/join-now-disabled.svg";
import { useAuth } from "../../contexts/auth-context";

import { useUser } from "../../contexts/user-context";
import { isAfter, isBefore } from "date-fns";
import Truncate from "react-truncate";
import useCallbackStatus from "../../hooks/use-callback-status";

import {
  course_types,
  course_detail_view,
} from "../../static-data/course-constants";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 150,
  },
  courseCard: {
    cursor: "pointer",
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  ratingText: {
    marginLeft: theme.spacing(0.5),
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
  },
  courseName: {
    color: "#393A45",
    fontSize: "20px",
    fontWeight: 600,
  },
  courseDesc: {
    color: "#393A45",
    fontSize: "16px",
    fontWeight: 400,
  },
  courseInstructor: {
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
    textTransform: "capitalize",
  },
  discountedPriceContainer: {
    backgroundColor: "#E2EAFA",
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  discountedPrice: {
    color: "#03579C",
    fontSize: "18px",
    fontWeight: 600,
  },
  oldPrice: {
    color: "#707070",
    fontSize: "13px",
    fontWeight: 400,
    textDecoration: "line-through",
  },
  statsText: {
    marginLeft: theme.spacing(0.5),
    color: "#7C7C7C",
    fontSize: "14px",
    fontWeight: 400,
  },
  ctaText: (props) => ({
    marginLeft: theme.spacing(1),
    color: props.isJoinDisabled ? "#9b9b9b" : "#F05E23",
    textTransform: "none",
    fontSize: "14px",
    fontWeight: 500,
  }),
  joinNowButton: {
    textTransform: "none",
    marginLeft: "auto",
  },
  topRecommendedBadgeContainer: {
    position: "absolute",
    display: "inline-block",
    zIndex: 100,
    top: 10,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: theme.spacing(0.5, 1),
  },
  recommendedBadgeContainer: {
    position: "absolute",
    display: "inline-block",
    zIndex: 100,
    bottom: 10,
    left: 10,
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: theme.spacing(0.5, 1),
  },
  recommendedBadgeText: {
    color: "#707070",
    fontSize: "12px",
    fontWeight: 500,
  },
}));

const CourseCard = ({
  id,
  rating,
  title,
  tagline,
  price,
  discounted_price,
  image_url,
  thumbnail_image_url,
  instructor_name,
  no_of_slots,
  is_favorite,
  course_type,
  is_enrolled,
  slot_course_session_id,
  structured_course_timing_id,
  session_start_time,
  session_end_time,
  section,
  joinSession,
  total_course_rating,
  on = false,
  offered_price,
  suggested_price,
  no_of_enrolled,
  no_of_sessions,
  instructor_id = "",
  isWebinar = false,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const { getUserId } = useAuth();
  const learner_id = getUserId();
  const [isFavs, setIsFav] = React.useState(is_favorite);
  const { getUserDetails } = useAuth();
  const { user } = useUser();
  const favApiStatus = useCallbackStatus();
  const notification = useSnackbar();

  const changeFavorites = async (apiBody) => {
    try {
      const res = await favApiStatus.run(
        apiClient("POST", "learner", "addremovefavourite", {
          body: { ...apiBody },
          shouldUseDefaltToken: true,
        })
      );
      if (on) {
        window.location.reload();
      }
      if (apiBody.action === "add") {
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
      } else {
        notification.enqueueSnackbar(res.message, {
          variant: "success",
          autoHideDuration: 2000,
        });
      }
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleFav = (isFav, id) => {
    changeFavorites({
      learner_id: user.id,
      course_id: id,
      action: isFav ? "delete" : "add",
      course_type: course_type,
    });
    setIsFav(!isFav);
  };

  const default_utl =
    "https://images.unsplash.com/photo-1477948879622-5f16e220fa42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80";

  const handleCardClick = () => {
    const stateObj = {
      course_type,
    };

    if (is_enrolled) {
      stateObj.view = course_detail_view.joinCourse;
    } else {
      stateObj.cadence_id = id;
    }

    history.push(`/course-detail/${course_types[course_type]}/${id}`, stateObj);
  };

  const handleJoinSessionClick = (e) => {
    e.stopPropagation();
    let apiBody = {
      entity_type: "learner",
      learner_id: learner_id,
    };
    if (course_type === "slot_course") {
      apiBody = {
        ...apiBody,
        slot_course_session_id,
      };
    } else {
      apiBody = {
        ...apiBody,
        structured_course_timing_id,
      };
    }
    joinSession(apiBody);
  };

  const isMeetingJoinable = () => {
    const startTime = session_start_time * 1000;
    const endTime = session_end_time * 1000;
    const startSessionBeforeTime = 5 * 60 * 1000;
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
  };

  const noPropagation = (e) => e.stopPropagation();
  const LinkNoPropagate = (props) => (
    <Link {...props} onClick={noPropagation} />
  );

  return (
    <Card className={classes.courseCard}>
      <Box position="relative">
        <CardMedia
          onClick={handleCardClick}
          className={classes.media}
          image={thumbnail_image_url ? thumbnail_image_url : default_utl}
        />
        <IconButton
          size="small"
          classes={{ sizeSmall: classes.favoriteIconContainer }}
        >
          <Favorite
            style={{ color: isFavs ? "red" : "" }}
            onClick={(e) => {
              e.stopPropagation();
              if (user.authenticated) {
                handleFav(isFavs, id);
              } else {
                history.push("/login");
              }
            }}
          />
        </IconButton>

        {isWebinar && section === "recommended" ? (
          <Box className={classes.topRecommendedBadgeContainer}>
            <Typography className={classes.recommendedBadgeText}>
              Recommended
            </Typography>
          </Box>
        ) : null}

        {isWebinar ? (
          <Box className={classes.recommendedBadgeContainer}>
            <Typography className={classes.recommendedBadgeText}>
              Webinar
            </Typography>
          </Box>
        ) : section === "recommended" ? (
          <Box className={classes.recommendedBadgeContainer}>
            <Typography className={classes.recommendedBadgeText}>
              Recommended
            </Typography>
          </Box>
        ) : null}
      </Box>
      <CardContent onClick={handleCardClick}>
        <Box display="flex" alignItems="center">
          <Star style={{ fontSize: 16, color: "#FFB833" }} />
          <Typography varaint="caption" classes={{ root: classes.ratingText }}>
            {rating <= 0 ? "New" : `${rating} (${total_course_rating})`}
          </Typography>
        </Box>
        <Typography varaint="body1" classes={{ root: classes.courseName }}>
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
        <Typography
          gutterBottom
          varaint="body2"
          classes={{ root: classes.courseDesc }}
        >
          <Truncate lines={1} ellipsis={<span>...</span>}>
            {
              tagline.length > 30 ? (
                <>
                  {tagline.substring(0, 30)}...
                </>
              ) : (
                  tagline
                )
            }
          </Truncate>
        </Typography>

        <LinkNoPropagate to={`/instructor/${instructor_id}`}>
          <Typography
            varaint="body2"
            classes={{ root: classes.courseInstructor }}
          >
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

        <Box mt={2} display="flex" alignItems="center">
          {user && !user.is_mi_user ? (
            <Box className={classes.discountedPriceContainer}>
              {discounted_price || discounted_price === 0 ? (
                <>
                  <Typography
                    varaint="body2"
                    classes={{ root: classes.discountedPrice }}
                  >
                    {discounted_price ? (
                      <span>&#x20B9; {discounted_price}</span>
                    ) : (
                        "Free"
                      )}
                  </Typography>
                </>
              ) : (
                  <Typography
                    varaint="body2"
                    classes={{ root: classes.discountedPrice }}
                  >
                    {offered_price ? (
                      <span>&#x20B9; {offered_price}</span>
                    ) : (
                        "Free"
                      )}
                  </Typography>
                )}
            </Box>
          ) : (
              <></>
            )}
          {user && user.is_mi_user != 1 && discounted_price != null && (
            <>
              <Typography varaint="body2" classes={{ root: classes.oldPrice }}>
                &#x20B9; {offered_price}
              </Typography>
            </>
          )}
          {!user ? (
            <Box className={classes.discountedPriceContainer}>
              <Typography
                varaint="body2"
                classes={{ root: classes.discountedPrice }}
              >
                {offered_price ? <span>&#x20B9; {offered_price}</span> : "Free"}
              </Typography>
            </Box>
          ) : (
              <></>
            )}
          {section === "upcoming" && (
            <Button
              variant="text"
              color="secondary"
              disabled={!isMeetingJoinable()}
              className={classes.joinNowButton}
              onClick={handleJoinSessionClick}
            >
              <img
                src={
                  isMeetingJoinable() ? JoinNowActiveIcon : JoinNowDisabledIcon
                }
                alt="Join session button"
              />
              <span style={{ marginLeft: "6px" }}>Join now</span>
            </Button>
          )}
        </Box>
        {course_type === "structured_course" ? (
          <Box mt={2} display="flex" alignItems="center">
            <People style={{ fontSize: 16, color: "#7C7C7C" }} />
            <Typography varaint="caption" classes={{ root: classes.statsText }}>
              {no_of_enrolled || 0} Enrolled &#124; {no_of_sessions || 0}{" "}
              Sessions
            </Typography>
          </Box>
        ) : (
            <Box mt={2} display="flex" alignItems="center">
              <Event style={{ fontSize: 16, color: "#7C7C7C" }} />
              <Typography varaint="caption" classes={{ root: classes.statsText }}>
                {no_of_slots || 0} slots available
            </Typography>
            </Box>
          )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
