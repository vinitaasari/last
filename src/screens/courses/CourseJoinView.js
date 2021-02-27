import React, { useState, useEffect } from "react";
import {
  // Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Tabs,
  Tab,
  Typography,
  Divider,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import _ from "lodash";
import { Star, FavoriteBorder } from "@material-ui/icons";
// import * as dateFns from "date-fns";
import { useSnackbar } from "notistack";
import message from "../../assets/images/message.png";
import cross from "../../assets/images/cross.png";
import { useHistory } from "react-router-dom";
import messages from "../../assets/images/messeges.png";

import { apiClient } from "../../utils/api-client";
import useCallbackStatus from "../../hooks/use-callback-status";

// import DateSlot from "./DateSlot";
import Assignments from "../../components/assignments";
import About from "./About";
// import AboutStats from "./AboutStats";
import ShortDescription from "./ShortDescription";
import LongDescription from "./LongDescription";
import CurriculumInfo from "./CurriculumInfo";
import CourseReviews from "./CourseReviews";
import InstructorCard from "./InstructorCard";

import PlayColorIcon from "../../assets/images/join-now-active-animation.gif";
import PlayColorIconDisabled from "../../assets/images/play-color-icon-disabled.svg";
import * as dateFns from "date-fns";

import {
  course_types,
  course_details_tab,
} from "../../static-data/course-constants";
import { useAuth } from "../../contexts/auth-context";
// import { isAfter, isBefore } from "date-fns";

import { courseDetail as useStyles } from "./styles";
import { isAfter, isBefore, format } from "date-fns";
import moment from "moment";

function CourseEnrollView({
  courseDetail = {},
  activeTab,
  handleTabChange = () => { },
  cadenceDetails,
  status,
  handleSelectCadenceClick,
  handleBuyClick,
  createOrderApiStatus,
  slotsDeails,
  selectAllSlots,
  handleSelectAllSlotClick,
  handleSelectSlotClick,
  currentSelectedSlotOrCadence,
  checkCanEnrollApiStatus,
  joinSession,
  isDisabled = false,
  sessions,
  sessionsApi,
  courseReviews,
  conversationId,
  assignments,
}) {
  const classes = useStyles({ isJoinDisabled: isDisabled });
  const history = useHistory();

  const isHistoryCourseObjPresent =
    history.location &&
      history.location.state &&
      history.location.state.courseObj
      ? true
      : false;
  const historyCourseObj = history.location.state.courseObj;

  console.log("Please check here", history.location.state.courseObj);
  console.log("Please COurse Details: ", courseDetail);
  console.log(history.location.state.courseObj);
  console.log(history.location.state.session_start_time);

  const { getUserId } = useAuth();
  const learner_id = getUserId();
  const { getUserDetails } = useAuth();
  const user = getUserDetails();

  const favApiStatus = useCallbackStatus();
  const certificateApiStatus = useCallbackStatus();
  const downloadCertificateApiStatus = useCallbackStatus();
  const notification = useSnackbar();

  const [isFav, setFav] = useState(courseDetail.is_favourite);
  const [isCertificateAvailable, setCertificateAvailability] = useState(false);

  const handleJoinClick = () => {
    let courseObj = history.location.state.courseObj;
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

  const handleFavorites = (e) => {
    changeFavorites({
      learner_id: user.id,
      course_id: courseDetail.id,
      action: isFav ? "delete" : "add",
      course_type: courseDetail.course_type,
    });
    setFav(!isFav);
  };

  useEffect(() => {
    if (isHistoryCourseObjPresent && historyCourseObj.is_completed) {
      let apiBody;
      if (historyCourseObj.course_type == "slot_course") {
        apiBody = {
          learner_id: learner_id,
          slot_course_session_id: historyCourseObj.slot_course_session_id,
        };
      } else {
        apiBody = {
          learner_id: learner_id,
          structured_course_cadence_id:
            historyCourseObj.structured_course_cadence_id,
        };
      }
      checkCertificateAvailability(apiBody);
    }
  }, []);

  const changeFavorites = async (apiBody) => {
    try {
      const res = await favApiStatus.run(
        apiClient("POST", "learner", "addremovefavourite", {
          body: { ...apiBody },
          shouldUseDefaltToken: true,
        })
      );
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

  const checkCertificateAvailability = async (apiBody) => {
    try {
      const res = await certificateApiStatus.run(
        apiClient("POST", "course", "checkcertificateavailability", {
          body: { ...apiBody },
          shouldUseDefaltToken: true,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;

      if (data) {
        setCertificateAvailability(true);
      }
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const downloadCertificate = async (apiBody) => {
    try {
      const res = await downloadCertificateApiStatus.run(
        apiClient("POST", "course", "downloadcertificate", {
          body: { ...apiBody },
          shouldUseDefaltToken: true,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;

      if (data && data.certificateLink) {
        openInNewTab(data.certificateLink);
      }
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const isMeetingJoinable = () => {
    let session_start_time = history.location.state.session_start_time;
    let session_end_time = history.location.state.session_end_time;

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

  const getSessionDuration = (startTime, endTime) => {
    const duration = (endTime - startTime) / 60;
    return duration;
  };

  const handleCertificateDownloadClick = () => {
    if (isHistoryCourseObjPresent && historyCourseObj.is_completed) {
      let apiBody;
      if (historyCourseObj.course_type == "slot_course") {
        apiBody = {
          learner_id: learner_id,
          slot_course_session_id: historyCourseObj.slot_course_session_id,
        };
      } else {
        apiBody = {
          learner_id: learner_id,
          structured_course_cadence_id:
            historyCourseObj.structured_course_cadence_id,
        };
      }
      downloadCertificate(apiBody);
    }
  };

  const getTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
  };

  return (
    <Container maxWidth="lg" classes={{ root: classes.container }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <video
            width="100%"
            height="400px"
            controls
            poster={courseDetail.thumbnail_image_url}
            style={{ objectFit: "cover" }}
          >
            <source
              src={courseDetail.introductory_video_url}
              type="video/mp4"
            />
          </video>
        </Grid>

        <Grid container item xs={12} alignItems="flex-start">
          <Box>
            <Typography varaint="body1" classes={{ root: classes.courseName }}>
              {courseDetail.title || ""}
            </Typography>
            <Typography
              varaint="body1"
              classes={{ root: classes.courseTagline }}
            >
              {courseDetail.tag_line || ""}
            </Typography>
          </Box>
          {/* <Box ml="auto" display="flex" alignItems="center">
            <IconButton
              size="small"
              style={{
                color: isFav ? "red" : "",
              }}
              onClick={handleFavorites}
              classes={{ sizeSmall: classes.favoriteIconContainer }}
            >
              <FavoriteIcon />
            </IconButton>
            <Typography
              varaint="body1"
              classes={{ root: classes.favouriteText }}
            >
              Favourites
            </Typography>
          </Box> */}
        </Grid>

        <Grid container item xs={12} md={8} spacing={2}>
          {history.location.state.courseObj && history.location.state.courseObj.status === "Missed" ? (
            <Grid item xs={12} className={classes.courseCompletionContainer}>
              <Typography style={{ color: 'red', fontWeight: 600, fontSize: '22px' }}>
                {history.location.state.courseObj.status}
              </Typography>
            </Grid>
          ) : null}
          {history.location.state.courseObj && history.location.state.courseObj.status === "Completed" ? (
            <Grid item xs={12} className={classes.courseCompletionContainer}>
              <Typography style={{ color: 'green', fontWeight: 600 }}>
                {history.location.state.courseObj.status}
              </Typography>
            </Grid>
          ) : null}
          {history.location.state.courseObj && history.location.state.courseObj.status === "Ongoing" ? (
            <Grid item xs={12} className={classes.courseCompletionContainer}>
              <Typography style={{ color: 'rgb(239, 180, 20)', fontWeight: 600 }}>
                {history.location.state.courseObj.status}
              </Typography>
            </Grid>
          ) : null}

          {courseDetail.is_completed && isCertificateAvailable ? (
            <Grid item xs={12} className={classes.courseCompletionContainer}>
              <Box className={classes.certificateDownloadContainer}>
                <Button
                  variant="text"
                  className={classes.downloadCertificateButton}
                  onClick={handleCertificateDownloadClick}
                >
                  {downloadCertificateApiStatus.isPending ? (
                    <CircularProgress size={20} color="primary" />
                  ) : (
                      "Download Certificate"
                    )}
                </Button>
              </Box>
            </Grid>
          ) : null}

          {isHistoryCourseObjPresent && history.location && history.location.state && !history.location.state.course &&
            historyCourseObj.course_type != "slot_course" ? (
              <Grid
                item
                xs={12}
                className={classes.gridItemContainer}
                style={{ paddingTop: "18px" }}
              >
                <Box className={classes.dateContainer}>
                  <Typography className={classes.date}>
                    {historyCourseObj.session_start_time
                      ? format(
                        new Date(historyCourseObj.session_start_time * 1000),
                        "dd"
                      )
                      : ""}
                  </Typography>
                  <Typography className={classes.month}>
                    {historyCourseObj.session_start_time
                      ? format(
                        new Date(historyCourseObj.session_start_time * 1000),
                        "MMM"
                      )
                      : ""}
                  </Typography>
                </Box>
                <Box ml={3}>
                  <Typography className={classes.sessionNumber}>
                    Session{" "}
                    {historyCourseObj.structured_course_session_sequence || ""}
                  </Typography>
                  <Typography className={classes.sessionName}>
                    {historyCourseObj.session_title || ""}
                  </Typography>

                  <Box display="flex" alignItems="center" mt={0.5}>
                    <Button
                      variant="text"
                      disabled={!isMeetingJoinable()}
                      onClick={handleJoinClick}
                      color="secondary"
                      className={classes.joinNowButton}
                    >
                      {isMeetingJoinable() ? (
                        <img
                          src={PlayColorIcon}
                          alt="Join session button"
                          style={{ height: "36px", width: "36px" }}
                        />
                      ) : (
                          <img
                            src={PlayColorIconDisabled}
                            alt="Join session button"
                          />
                        )}
                      <span style={{ marginLeft: "8px" }}>Join now</span>
                    </Button>
                  &nbsp;
                  <Typography className={classes.timing}>
                      | &nbsp;
                    {getTime(historyCourseObj.session_start_time * 1000)}{" "}
                    &nbsp;| &nbsp;
                    {getSessionDuration(
                      historyCourseObj.session_start_time,
                      historyCourseObj.session_end_time
                    )}{" "}
                      <span style={{ textTransform: "none" }}>mins</span>
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ) : null}

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <Box className={classes.tabContainer}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {courseDetail.course_type === course_types.structured ? (
                    <Tab label="Curriculum" value="curriculum" />
                  ) : null}
                  {courseDetail.course_type === "structured_course" ? (
                    <Tab label="Assignments" value="assignments" />
                  ) : null}
                  <Tab label="About" value="about" />
                  <Tab label="Reviews" value="reviews" />
                </Tabs>
              </Box>
            </Grid>

            {activeTab === course_details_tab.curriculum && (
              <CurriculumInfo
                cadenceDetails={cadenceDetails}
                onCadenceSelect={handleSelectCadenceClick}
                sessions={sessions}
                sessionsApi={sessionsApi}
              />
            )}

            {/* {activeTab === "assignments" && (
              <Grid
                item
                xs={12}
                alignItems="center"
                style={{ marginTop: "16px" }}
              >
                <Assignments
                  assignments={assignments}
                  hideTitle
                  viewType="show"
                />
              </Grid>
            )} */}

            {activeTab === "about" && (
              <>
                <Grid item xs={12}>
                  <About
                    level={courseDetail.level}
                    duration={courseDetail.course_duration}
                    language={courseDetail.language}
                    slots={courseDetail.no_of_available_slots}
                    total_seats={courseDetail.total_seats}
                    ageRange={`${courseDetail.age_start}-${courseDetail.age_end}`}
                    booked={courseDetail.no_of_enrolled}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ShortDescription description={courseDetail.after_notes} />
                </Grid>

                <Grid item xs={12}>
                  <LongDescription
                    description={courseDetail.detailed_description}
                  />
                </Grid>
              </>
            )}

            {activeTab === "assignments" && (
              <Grid item xs={12}>
                <Assignments assignments={assignments} viewType="submit" />
              </Grid>
            )}
            {activeTab === "reviews" && (
              <Grid item xs={12}>
                <CourseReviews
                  reviews={courseReviews}
                  courseRating={courseDetail.course_rating}
                  totalCourseRating={courseDetail.total_course_rating}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid xs={12} md={4}>
          <Grid item xs={12}>
            <InstructorCard
              conversationId={
                !_.isUndefined(history.location.state.courseObj)
                  ? history.location.state.courseObj.conversation_id
                  : null
              }
              cadenceDetails={cadenceDetails}
              slotDetails={slotsDeails}
              courseDetail={courseDetail}
              cadenceDetails={cadenceDetails}
              status={status}
              currentSelectedSlotOrCadence={currentSelectedSlotOrCadence}
              name={`${courseDetail.instructor_first_name} ${courseDetail.instructor_last_name}`}
              instructorId={courseDetail.instructor_id}
              designation={courseDetail.instructor_designation}
              rating={courseDetail.instructor_rating}
              instructorImage={courseDetail.instructor_profile_url}
            />
            {/* <Card>
              <Box
                p={2}
                className={classes.priceContainer}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems="center">
                  <Typography
                    varaint="body2"
                    classes={{ root: classes.discountedPrice }}
                  >
                    &#x20B9; {courseDetail.discounted_price}
                  </Typography>
                  <Typography
                    varaint="body2"
                    classes={{ root: classes.oldPrice }}
                  >
                    &#x20B9; {courseDetail.offered_price}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ alignSelf: "flex-end" }}
                  onClick={handleBuyClick}
                  disabled={createOrderApiStatus.isPending}
                >
                  Buy Now
                </Button>
              </Box>
              <Box p={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems={
                    courseDetail.course_type === course_types.slot
                      ? "center"
                      : "flex-start"
                  }
                  flexDirection={
                    courseDetail.course_type === course_types.slot
                      ? "row"
                      : "column"
                  }
                >
                  {courseDetail.course_type === course_types.slot ? (
                    <>
                      <Typography
                        varaint="body2"
                        gutterBottom
                        classes={{ root: classes.availableSlotsText }}
                      >
                        {slotsDeails.length} slots available
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectAllSlots}
                            onChange={handleSelectAllSlotClick}
                            name="select-all-slots"
                            color="primary"
                          />
                        }
                        label="Select All"
                        labelPlacement="start"
                      />
                    </>
                  ) : (
                    <>
                      <AboutStats
                        label="Level"
                        value={courseDetail.level}
                        icon={<BarChart style={{ color: "#05589C" }} />}
                      />
                      <AboutStats
                        label="Up To"
                        value={courseDetail.no_of_available_slots}
                        icon={<People style={{ color: "#05589C" }} />}
                      />
                      <AboutStats
                        label="Suitable For"
                        value={`${courseDetail.age_start}-${courseDetail.age_end}`}
                        icon={<AccessibilityNew style={{ color: "#05589C" }} />}
                      />
                      <AboutStats
                        label="Delivered In"
                        value={courseDetail.language}
                        icon={<Chat style={{ color: "#05589C" }} />}
                      />
                      <AboutStats
                        label="Duration"
                        value={courseDetail.course_duration}
                        icon={<Timer style={{ color: "#05589C" }} />}
                      />
                      <AboutStats
                        label="Registered Till Date"
                        value={courseDetail.no_of_enrolled}
                        icon={<Event style={{ color: "#05589C" }} />}
                      />
                    </>
                  )}
                </Box>
                
                <Box className={classes.slotsViewContainer}>
                  {slotsDeails.map((item) => (
                    <DateSlot
                      date_str={item.start_date_str}
                      time_str={`${item.start_time_str} - ${item.end_time_str}`}
                      id={item.id}
                      key={item.id}
                      isSelected={item.isSelected}
                      title={item.title}
                      onSelectClick={handleSelectSlotClick}
                      isLoading={
                        currentSelectedSlotOrCadence !== null &&
                        currentSelectedSlotOrCadence === item.id &&
                        checkCanEnrollApiStatus.isPending
                      }
                    />
                  ))}
                  
                </Box>
                
              </Box>
            </Card> */}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CourseEnrollView;
