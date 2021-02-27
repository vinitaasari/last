import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Tabs,
  Tab,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import message from "../../assets/images/message.png";
import cross from "../../assets/images/cross.png";
import { useHistory } from "react-router-dom";
import messages from "../../assets/images/messeges.png";
import * as dateFns from "date-fns";
import CustomCarousel from "../../components/carousel";
import CourseCard from "./course-card";

import { apiClient } from "../../utils/api-client";
import useCallbackStatus from "../../hooks/use-callback-status";
import {
  Star,
  Event,
  BarChart,
  People,
  Chat,
  Timer,
  AccessibilityNew,
  Close,
} from "@material-ui/icons";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DateSlot from "./DateSlot";
import About from "./About";
import AboutStats from "./AboutStats";
import ShortDescription from "./ShortDescription";
import LongDescription from "./LongDescription";
import CurriculumInfo from "./CurriculumInfo";
import CourseReviews from "./CourseReviews";

import { useAuth } from "./../../contexts/auth-context";

import {
  course_types,
  course_details_tab,
} from "../../static-data/course-constants";
import ReactPlayer from "react-player";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { areIntervalsOverlapping, format } from "date-fns";
import { courseDetail as useStyles } from "./styles";

function CourseDetailPurchaseView({
  courseDetail = {},
  activeTab,
  handleTabChange = () => { },
  cadenceDetails,
  handleSelectCadenceClick,
  handleBuyClick,
  createOrderApiStatus,
  slotsDeails,
  setSlotsDetails,
  allSlots,
  handleSelectSlotClick,
  selectAllSlots,
  handleSelectAllSlotClick,
  currentSelectedSlotOrCadence,
  checkCanEnrollApiStatus,
  sessions,
  sessionsApi,
  cad,
  courseReviews,
  activeCadence,
  details = false,
  recommendedCourses = [],
}) {
  const classes = useStyles();
  const { getUserDetails } = useAuth();
  const user = getUserDetails();
  console.log("course detail", courseDetail);
  const [isFav, setFav] = useState(courseDetail.is_favourite);
  const favApiStatus = useCallbackStatus();
  const notification = useSnackbar();
  const history = useHistory();
  const location = useLocation();
  const { state } = location;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [minDate, setMinDate] = useState(new Date())
  const rangeStartDate = date[0]["startDate"];
  const rangeEndDate = date[0]["endDate"];

  const filterSlots = () => {
    console.log("filter")
    var rangeStartDate = date[0]["startDate"].setHours(0);
    var rangeEndDate = date[0]["endDate"].setHours(23);

    if (rangeStartDate && rangeEndDate) {
      const filteredSlots = allSlots.filter((item) => {

        const start_d = item.session_start_time;
        const end_d = item.session_end_time;
        if (
          start_d >= (rangeStartDate / 1000) && end_d <= (rangeEndDate / 1000)
        ) {
          return true;
        } else {
          return false;
        }
      });

      const slots = filteredSlots.map((item) => {
        const start_d = dateFns.fromUnixTime(item.session_start_time);
        const end_d = dateFns.fromUnixTime(item.session_end_time);
        return {
          id: item.id,
          title: item.title,
          start_time_str: dateFns.format(start_d, "hh:mm a"),
          start_date_str: dateFns.format(start_d, "E, do MMM"),
          end_time_str: dateFns.format(end_d, "hh:mm a"),
          end_date_str: dateFns.format(end_d, "E, do MMM"),
          isSelected: false,
        };
      });
      console.log("filtered", slots);
      setSlotsDetails(slots);
    }

    setIsDatePickerOpen(false);
  };

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

  const handleFavorites = (e) => {
    if (user.authenticated === false) {
      history.push("/login", {
        from: history.params.match.url,
        ...state,
      });
      return;
    }

    changeFavorites({
      learner_id: user.id,
      course_id: courseDetail.id,
      action: isFav ? "delete" : "add",
      course_type: courseDetail.course_type,
    });
    setFav(!isFav);
  };

  const buyNowCardAboutStatsWidth = "70%";
  const slotsSelected = slotsDeails.filter((item) => item.isSelected == true);
  const hasSlotsSelected = slotsSelected && slotsSelected.length > 0;

  const getSelectedSlotsPrice = (slots, discountedPrice, offeredPrice) => {
    let updatedPrice;
    if (discountedPrice) {
      updatedPrice = slots.length * +discountedPrice;
      return <>
        <div style={{ display: 'flex' }}>
          {updatedPrice ? <span>&#x20B9; {updatedPrice}</span> : "Free"}
          <Typography varaint="body2" style={{ marginTop: '10px' }} classes={{ root: classes.oldPrice }}>
            &#x20B9; {offeredPrice}
          </Typography>
        </div></>;
    } else {
      updatedPrice = slots.length * +offeredPrice;
      return <>{updatedPrice ? <span>&#x20B9; {updatedPrice}</span> : "Free"}</>;
    }

  };

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    const slots = allSlots.map((item) => {
      const start_d = dateFns.fromUnixTime(item.session_start_time);
      const end_d = dateFns.fromUnixTime(item.session_end_time);
      return {
        id: item.id,
        title: item.title,
        start_time_str: dateFns.format(start_d, "hh:mm a"),
        start_date_str: dateFns.format(start_d, "E, do MMM"),
        end_time_str: dateFns.format(end_d, "hh:mm a"),
        end_date_str: dateFns.format(end_d, "E, do MMM"),
        isSelected: false,
      };
    });
    setDate([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
    setSlotsDetails(slots);
    setIsDatePickerOpen(false);
  };

  const dateRangePicker = (
    <Backdrop className={classes.backdrop} open={isDatePickerOpen}>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={closeDatePicker}
        size="medium"
      >
        <Close />
      </IconButton>
      <Box style={{ position: "relative", zIndex: 10000000 }}>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setDate([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={date}
          minDate={minDate}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="secondary" onClick={filterSlots}>
            Submit
          </Button>
        </Box>
      </Box>
    </Backdrop>
  );

  return (
    <Container maxWidth="lg" classes={{ root: classes.container }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <video
            width="100%"
            height="400px"
            controls
            poster={courseDetail.image_url}
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
            <Box display="flex" alignItems="center">
              <Star style={{ fontSize: 20, color: "#FFB833" }} />
              <Typography
                varaint="caption"
                classes={{ root: classes.ratingText }}
              >
                {courseDetail.course_rating <= 0
                  ? "New"
                  : `${courseDetail.course_rating} (${courseDetail.total_course_rating})`}
              </Typography>
            </Box>
          </Box>
          <Box ml="auto" display="flex" alignItems="center">
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
              Favourite
            </Typography>
          </Box>
        </Grid>

        <Grid container item xs={12} md={8} spacing={2}>
          <Grid container item xs={12} alignItems="center">
            <Avatar
              alt="Mi Life User"
              src={courseDetail.instructor_profile_url}
              className={classes.instructorAvatar}
            />
            <Box ml={2}>
              <Link
                to={`/instructor/${courseDetail.instructor_id}`}
                style={{ cursor: "pointer" }}
              >
                <Typography
                  varaint="body2"
                  classes={{ root: classes.instructorName }}
                >
                  {courseDetail.instructor_first_name &&
                    courseDetail.instructor_last_name && courseDetail.instructor_first_name.length > 15
                    ? `Instructed by ${courseDetail.instructor_first_name.substring(0, 15)}...`
                    : ""}
                  {courseDetail.instructor_first_name &&
                    courseDetail.instructor_last_name && courseDetail.instructor_first_name.length < 15
                    ? `Instructed by ${courseDetail.instructor_first_name}`
                    : ""}
                </Typography>
              </Link>
              <Box display="flex" alignItems="center">
                <Typography
                  varaint="body2"
                  classes={{ root: classes.instructorDomain }}
                >
                  {courseDetail.instructor_designation} |
                </Typography>
                <Box ml={0.5} display="flex" alignItems="center">
                  <Star style={{ fontSize: 16, color: "#FFB833" }} />
                  <Typography
                    varaint="caption"
                    classes={{ root: classes.instructorRatingText }}
                  >
                    {courseDetail.instructor_rating
                      ? `${courseDetail.instructor_rating} (${courseDetail.total_instructor_rating})`
                      : "New"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <Box className={classes.tabContainer}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {courseDetail.course_type === "structured_course" && (
                    <Tab label="Curriculum" value="curriculum" />
                  )}
                  <Tab label="About" value="about" />
                  <Tab label="Reviews" value="reviews" />
                </Tabs>
              </Box>
            </Grid>

            {activeTab === "curriculum" && (
              <CurriculumInfo
                cadenceDetails={cadenceDetails}
                onCadenceSelect={handleSelectCadenceClick}
                sessions={sessions}
                history={history}
                sessionsApi={sessionsApi}
              />
            )}
            {/* {activeTab === course_details_tab.assignments && <Assignments />} */}

            {activeTab === course_details_tab.about && (
              <>
                <Grid item xs={12}>
                  <About
                    level={courseDetail.level}
                    total_seats={courseDetail.total_seats}
                    duration={courseDetail.course_duration}
                    language={courseDetail.language}
                    slots={courseDetail.no_of_available_slots}
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
          <Grid item xs={12} style={{ position: "sticky", top: 5 }}>
            {!history.location && (
              <>
                <Card>
                  <Box
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <>
                      <Box display="flex" alignItems="center">
                        {(user && !user.is_mi_user) || !user ? (
                          <>
                            {courseDetail.discounted_price || courseDetail.discounted_price === 0 ? (
                              <>
                                <Typography
                                  varaint="body2"
                                  classes={{ root: classes.discountedPrice }}
                                >
                                  {
                                    courseDetail.discounted_price === 0 ? (
                                      <>
                                        Free
                                      </>
                                    ) : (
                                        <>
                                          &#x20B9; {courseDetail.discounted_price}
                                        </>
                                      )
                                  }
                                </Typography>
                                <Typography
                                  varaint="body2"
                                  classes={{ root: classes.oldPrice }}
                                >
                                  &#x20B9; {courseDetail.offered_price}
                                </Typography>
                              </>
                            ) : (
                                <Typography
                                  varaint="body2"
                                  classes={{ root: classes.mainPrice }}
                                >
                                  &#x20B9; {courseDetail.offered_price}
                                </Typography>
                              )}
                          </>
                        ) : (
                            <>
                              {courseDetail.course_type === course_types.slot ? (
                                <>
                                  <Typography
                                    varaint="body2"
                                    gutterBottom
                                    style={{
                                      fontSize: 18,
                                      fontWeight: "800px",
                                      color: "rgb(5, 88, 156)",
                                    }}
                                  >
                                    {courseDetail.no_of_available_slots} slots
                                  available
                                </Typography>
                                </>
                              ) : (
                                  <>
                                    <div style={{ textAlign: "left" }}>
                                      <Typography
                                        style={{
                                          fontSize: 20,
                                          fontWeight: "600px",
                                          color: "rgb(5, 88, 156)",
                                        }}
                                      >
                                        {courseDetail.no_of_sessions} SESSION
                                    INCLUDED
                                  </Typography>
                                    </div>
                                  </>
                                )}
                            </>
                          )}
                      </Box>
                      {user && user.is_mi_user ? (
                        <>
                          {courseDetail.course_type === course_types.slot && (
                            <Button
                              variant="contained"
                              color="secondary"
                              style={{ alignSelf: "flex-end" }}
                              onClick={handleBuyClick}
                              disabled={createOrderApiStatus.isPending}
                            >
                              Enroll Now
                            </Button>
                          )}
                        </>
                      ) : (
                          hasSlotsSelected && (
                            <Button
                              variant="contained"
                              color="secondary"
                              style={{ alignSelf: "flex-end" }}
                              onClick={handleBuyClick}
                              disabled={createOrderApiStatus.isPending}
                            >
                              {
                                courseDetail.discounted_price === 0 ?
                                  (
                                    "Enroll Now"
                                  ) : (
                                    <>
                                      {
                                        courseDetail.offeredPrice === 0 ? (
                                          "Enroll Now"
                                        ) : (
                                            "Buy Now"
                                          )
                                      }
                                    </>
                                  )
                              }
                            </Button>
                          )
                        )}
                    </>
                  </Box>
                  <Box p={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      mb={1}
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
                            {courseDetail.no_of_available_slots} slots available
                          </Typography>
                          <Button
                            color="primary"
                            variant="outlined"
                            onClick={openDatePicker}
                          >
                            {rangeEndDate && rangeEndDate
                              ? `${format(
                                new Date(rangeStartDate),
                                "d MMM"
                              )} - ${format(new Date(rangeEndDate), "d MMM")}`
                              : "Choose Dates"}
                          </Button>
                        </>
                      ) : (
                          <>
                            {user && user.is_mi_user ? (
                              <Button
                                variant="contained"
                                color="secondary"
                                style={{ alignSelf: "center" }}
                                onClick={handleBuyClick}
                                disabled={createOrderApiStatus.isPending}
                              >
                                Enroll Now
                              </Button>
                            ) : (
                                <>
                                  <AboutStats
                                    label="Level"
                                    value={courseDetail.level}
                                    icon={<BarChart style={{ color: "#05589C" }} />}
                                    width={buyNowCardAboutStatsWidth}
                                  />
                                  <AboutStats
                                    label="Up To"
                                    value={courseDetail.total_seats}
                                    icon={<People style={{ color: "#05589C" }} />}
                                    width={buyNowCardAboutStatsWidth}
                                  />
                                  <AboutStats
                                    label="Suitable For"
                                    value={`${courseDetail.age_start}-${courseDetail.age_end} yrs`}
                                    icon={
                                      <AccessibilityNew
                                        style={{ color: "#05589C" }}
                                      />
                                    }
                                    width={buyNowCardAboutStatsWidth}
                                  />
                                  <AboutStats
                                    label="Delivered In"
                                    value={courseDetail.language}
                                    icon={<Chat style={{ color: "#05589C" }} />}
                                    width={buyNowCardAboutStatsWidth}
                                  />
                                  <AboutStats
                                    label="Duration"
                                    value={`${courseDetail.course_duration} mins`}
                                    icon={<Timer style={{ color: "#05589C" }} />}
                                    width={buyNowCardAboutStatsWidth}
                                  />
                                  <AboutStats
                                    label="Registered Till Date"
                                    value={courseDetail.no_of_enrolled}
                                    icon={<Event style={{ color: "#05589C" }} />}
                                    width={buyNowCardAboutStatsWidth}
                                  />
                                </>
                              )}
                          </>
                        )}
                    </Box>
                    <Box mt={2} className={classes.slotsViewContainer}>
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
                </Card>
              </>
            )}
            {/* {history.location && history.location.state && !history.location.state.details && ( */}
            <>
              {(user && !user.is_mi_user) || !user ? (
                <Card>
                  <Box
                    p={hasSlotsSelected ? 2 : 0}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <>
                      <Box display="flex" alignItems="center">
                        {hasSlotsSelected ? (
                          <Typography
                            varaint="body2"
                            classes={{ root: classes.mainPrice }}
                          >
                            {getSelectedSlotsPrice(
                              slotsSelected,
                              courseDetail.discounted_price,
                              courseDetail.offered_price
                            )}
                          </Typography>
                        ) : null}
                      </Box>

                      {hasSlotsSelected && (
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{ alignSelf: "flex-end" }}
                          onClick={handleBuyClick}
                          disabled={createOrderApiStatus.isPending}
                        >
                          {
                            courseDetail.discounted_price === 0 ?
                              (
                                "Enroll Now"
                              ) : (
                                <>
                                  {
                                    courseDetail.offeredPrice === 0 ? (
                                      "Enroll Now"
                                    ) : (
                                        "Buy Now"
                                      )
                                  }
                                </>
                              )
                          }
                        </Button>
                      )}
                    </>
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
                          <Button
                            color="primary"
                            variant="outlined"
                            onClick={openDatePicker}
                          >
                            {rangeEndDate && rangeEndDate
                              ? `${format(
                                new Date(rangeStartDate),
                                "d MMM"
                              )} - ${format(new Date(rangeEndDate), "d MMM")}`
                              : "Choose Dates"}
                          </Button>
                          {/* <FormControlLabel
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
                          /> */}
                        </>
                      ) : (
                          <>
                            <>
                              {courseDetail.discounted_price || courseDetail.discounted_price === 0 ? (
                                <>
                                  <Typography
                                    varaint="body2"
                                    style={{ alignSelf: "center" }}
                                    classes={{ root: classes.discountedPrice }}
                                  >
                                    {courseDetail.discounted_price === 0 ? (
                                      <>
                                        Free
                                      </>
                                    ) : (
                                        <>
                                          &#x20B9; {courseDetail.discounted_price}
                                        </>
                                      )}
                                  </Typography>
                                  <Typography
                                    varaint="body2"
                                    style={{ alignSelf: "center" }}
                                    classes={{ root: classes.oldPrice }}
                                  >
                                    &#x20B9; {courseDetail.offered_price}
                                  </Typography>
                                </>
                              ) : (
                                  <Typography
                                    varaint="body2"
                                    style={{ alignSelf: "center" }}
                                    classes={{ root: classes.mainPrice }}
                                  >
                                    {courseDetail.offered_price ? (
                                      <>&#x20B9; {courseDetail.offered_price} </>
                                    ) : (
                                        "Free"
                                      )}
                                  </Typography>
                                )}
                              <Divider
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              />
                              <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                style={{ alignSelf: "center" }}
                                onClick={handleBuyClick}
                                disabled={
                                  createOrderApiStatus.isPending ||
                                  cadenceDetails
                                    .filter((item) => item.isSelected === true)
                                    .map((item) => item.id).length == 0
                                }
                              >
                                {
                                  courseDetail.discounted_price === 0 ?
                                    (
                                      "Enroll Now"
                                    ) : (
                                      <>
                                        {
                                          courseDetail.offeredPrice === 0 ? (
                                            "Enroll Now"
                                          ) : (
                                              "Buy Now"
                                            )
                                        }
                                      </>
                                    )
                                }
                              </Button>{" "}
                              <AboutStats
                                label="Level"
                                value={courseDetail.level}
                                icon={<BarChart style={{ color: "#05589C" }} />}
                                width={buyNowCardAboutStatsWidth}
                              />
                              <AboutStats
                                label="Up To"
                                value={courseDetail.total_seats}
                                icon={<People style={{ color: "#05589C" }} />}
                                width={buyNowCardAboutStatsWidth}
                              />
                              <AboutStats
                                label="Suitable For"
                                value={`${courseDetail.age_start}-${courseDetail.age_end} yrs`}
                                icon={
                                  <AccessibilityNew
                                    style={{ color: "#05589C" }}
                                  />
                                }
                                width={buyNowCardAboutStatsWidth}
                              />
                              <AboutStats
                                label="Delivered In"
                                value={courseDetail.language}
                                icon={<Chat style={{ color: "#05589C" }} />}
                                width={buyNowCardAboutStatsWidth}
                              />
                              <AboutStats
                                label="Duration"
                                value={`${courseDetail.course_duration} mins`}
                                icon={<Timer style={{ color: "#05589C" }} />}
                                width={buyNowCardAboutStatsWidth}
                              />
                              <AboutStats
                                label="Registered Till Date"
                                value={courseDetail.no_of_enrolled}
                                icon={<Event style={{ color: "#05589C" }} />}
                                width={buyNowCardAboutStatsWidth}
                              />
                            </>
                          </>
                        )}
                    </Box>

                    <Box mt={2} className={classes.slotsViewContainer}>
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
                </Card>
              ) : (
                  <Card>
                    <Box p={2}>
                      <>
                        <Box style={{ textAlign: "center" }}>
                          <>
                            {courseDetail.course_type === course_types.slot ? (
                              <>
                                <Typography
                                  varaint="body2"
                                  gutterBottom
                                  style={{
                                    fontSize: 18,
                                    fontWeight: "800px",
                                    color: "rgb(5, 88, 156)",
                                  }}
                                >
                                  {courseDetail.no_of_available_slots} slots
                                available
                              </Typography>
                              </>
                            ) : (
                                <>
                                  <div>
                                    <Typography
                                      style={{
                                        fontSize: 20,
                                        fontWeight: 600,
                                        color: "#05589c",
                                      }}
                                    >
                                      {courseDetail.no_of_sessions} SESSIONS
                                  INCLUDED
                                </Typography>
                                    <Typography>
                                      Batch: {cad ? cad.title : null}{" "}
                                    </Typography>
                                    {cad ? (
                                      <Typography>
                                        {" "}
                                        {`${dateFns.format(
                                          cad.cadenceStartDateObj,
                                          "dd MMM"
                                        )} - ${dateFns.format(
                                          cad.cadenceEndDateObj,
                                          "dd MMM"
                                        )}`}
                                      </Typography>
                                    ) : null}
                                    <Divider
                                      style={{
                                        marginTop: "20px",
                                        marginBottom: "-15px",
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                          </>
                        </Box>

                        {courseDetail.course_type === course_types.slot &&
                          hasSlotsSelected && (
                            <Button
                              variant="contained"
                              color="secondary"
                              fullWidth
                              style={{ alignSelf: "center" }}
                              onClick={handleBuyClick}
                              disabled={createOrderApiStatus.isPending}
                            >
                              Enroll Now
                            </Button>
                          )}
                      </>
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
                            {/* <Typography
                              varaint="body2"
                              gutterBottom
                              classes={{ root: classes.availableSlotsText }}
                            >
                              {courseDetail.no_of_available_slots} slots available
                          </Typography> */}
                            <Button
                              color="primary"
                              fullWidth
                              variant="outlined"
                              onClick={openDatePicker}
                            >
                              {rangeEndDate && rangeEndDate
                                ? `${format(
                                  new Date(rangeStartDate),
                                  "d MMM"
                                )} - ${format(new Date(rangeEndDate), "d MMM")}`
                                : "Choose Dates"}
                            </Button>
                            {/* <FormControlLabel
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
                            /> */}
                          </>
                        ) : (
                            <>
                              <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                style={{ alignSelf: "center" }}
                                onClick={handleBuyClick}
                                disabled={createOrderApiStatus.isPending}
                              >
                                Enroll Now
                          </Button>
                            </>
                          )}
                      </Box>

                      <Box mt={2} className={classes.slotsViewContainer}>
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
                  </Card>
                )}
            </>
            {/* )} */}
            {/* {history.location && history.location.state && history.location.state.details && (
              <>
                <Card style={{ textAlign: "center" }}>
                  <Box p={2}>
                    <Avatar
                      alt="Mi Life User"
                      style={{
                        marginLeft: "40%",
                        marginBottom: "10px",
                      }}
                      src={courseDetail.instructor_profile_url}
                      className={classes.instructorAvatar}
                    />
                    <Link
                      to={`/instructor/${courseDetail.instructor_id}`}
                      style={{ cursor: "pointer" }}
                    >
                      <Typography
                        varaint="body2"
                        classes={{ root: classes.instructorName }}
                      >
                        {courseDetail.instructor_first_name &&
                        courseDetail.instructor_last_name
                          ? `Instructed by ${courseDetail.instructor_first_name} ${courseDetail.instructor_last_name}`
                          : ""}
                      </Typography>
                    </Link>
                    <div
                      style={{
                        display: "flex",
                        marginLeft: "35%",
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Typography
                          varaint="body2"
                          classes={{ root: classes.instructorDomain }}
                        >
                          {courseDetail.instructor_designation} |
                        </Typography>
                        <Box ml={0.5} display="flex" alignItems="center">
                          <Star style={{ fontSize: 16, color: "#FFB833" }} />
                          <Typography
                            varaint="caption"
                            classes={{ root: classes.instructorRatingText }}
                          >
                            {courseDetail.instructor_rating
                              ? `${courseDetail.instructor_rating} (${courseDetail.total_instructor_rating})`
                              : "New"}
                          </Typography>
                        </Box>
                      </Box>
                    </div>
                    <Divider style={{ marginTop: "15px" }} />
                    <Box
                      p={4}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box>
                        <img src={message}></img>
                        <Typography style={{ marginTop: "5px" }}>
                          Message Instructor
                        </Typography>
                      </Box>
                      <Box>
                        <img src={messages}></img>
                        <Typography style={{ marginTop: "5px" }}>
                          Discussion Forum
                        </Typography>
                      </Box>
                      <Box>
                        <img src={cross}></img>
                        <Typography style={{ marginTop: "5px" }}>
                          Cancel Course
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </>
            )} */}
          </Grid>
        </Grid>

        {recommendedCourses.length > 0 && (
          <Grid xs={12} style={{ marginTop: "48px" }}>
            <CustomCarousel
              heading={
                <Typography
                  variant="body1"
                  classes={{ root: classes.sectionHeading }}
                >
                  Recommended Courses
                </Typography>
              }
              itemsToDisplay={4}
              path="/recommended-courses"
            >
              {recommendedCourses.map((item) => (
                <Box pr={2} key={item.id}>
                  <CourseCard
                    id={item.id}
                    rating={item.course_rating}
                    title={item.title}
                    tagline={item.tag_line}
                    is_favorite={item.is_favourite}
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
                    no_of_enrolled={item.no_of_enrolled}
                    no_of_sessions={item.no_of_sessions}
                    section="recommended"
                    instructor_id={item.instructor_id}
                  />
                </Box>
              ))}
            </CustomCarousel>
          </Grid>
        )}
      </Grid>

      {dateRangePicker}
    </Container>
  );
}

export default CourseDetailPurchaseView;
