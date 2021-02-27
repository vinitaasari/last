import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Star, Forum } from "@material-ui/icons";
import { useSnackbar } from "notistack";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import CustomCarousel from "../../components/carousel";
import PlayColorIcon from "../../assets/images/play-color-icon.svg";
import CourseCard from "../courses/course-card";
import AppWrapper from "../../components/app-wrapper";
import { useAuth } from "../../contexts/auth-context"

// import PriceFilter from "../courses/price-filter-dialog";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeading: {
    color: "#3F3F3F",
    fontSize: "26px",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "22px",
    },
  },
  cardContainer: {
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
  ctaText: {
    marginLeft: theme.spacing(1),
    color: "#F05E23",
    fontSize: "16px",
    fontWeight: 500,
  },
  categoryCard: {
    height: 180,
    display: "flex",
    alignItems: "center",
  },
  categoryIconContainer: {
    height: "64px",
    width: "64px",
    backgroundColor: "#F0F0F0",
    // display: "inline-block",
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    color: "#05589C",
    fontSize: "18px",
    fontWeight: 600,
  },
  categorySkills: {
    color: "#52534F",
    fontSize: "16px",
    fontWeight: 400,
  },
  skillContainer: {
    backgroundColor: "#F4F6FA",
    padding: theme.spacing(2),
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
  },
  skillName: {
    color: "#03579C",
    fontSize: "20px",
    fontWeight: 600,
  },
  achievementContainer: {
    backgroundColor: "#EFF7FF",
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
  achievementWrapper: {
    maxWidth: "60%",
    margin: "0 auto",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      maxWidth: "100%",
    },
  },
  achievementStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  achievementHeading: {
    color: "#475677",
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: theme.spacing(1),
  },
  achievementSubHeading: {
    color: "#7D8597",
    fontSize: "16px",
    fontWeight: 400,
  },
  achievementNumber: {
    color: "#2680EB",
    fontSize: "28px",
    fontWeight: 400,
  },
  achievementName: {
    color: "#7D8597",
    fontSize: "12px",
    fontWeight: 400,
  },
  feedbackHeading: {
    color: "#475677",
    fontSize: "26px",
    fontWeight: 400,
    textAlign: "center",
  },
  feedbackCardContainer: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  feedbackCard: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4, 2),
    textAlign: "center",
  },
  feedbackText: {
    color: "#7D8597",
    fontSize: "14px",
    fontWeight: 400,
    textAlign: "center",
  },
  avatar: {
    marginBottom: theme.spacing(1),
  },
  feedbackUsername: {
    color: "#293B5F",
    fontSize: "12px",
    fontWeight: 500,
  },
  feedbackUserDesignation: {
    color: "#707D97",
    fontSize: "10px",
    fontWeight: 400,
  },
}));

// eslint-disable-next-line
const UpcomingCourse = (props) => {
  const classes = useStyles();

  return (
    <Box pr={2}>
      <Card>
        <CardActionArea>
          <Box display="flex" w={1} className={classes.cardContainer}>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            />
            <CardContent classes={{ root: classes.cardContent }}>
              <Typography classes={{ root: classes.courseName }}>
                Yoga
              </Typography>
              <Typography classes={{ root: classes.courseDescription }}>
                Freshen body, mind & soul
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="auto"
              >
                <Typography classes={{ root: classes.courseInstructor }}>
                  By Amrita Mishra
                </Typography>
                <Box display="flex" alignItems="center">
                  <Star style={{ fontSize: 16, color: "#FFB833" }} />
                  <Typography
                    varaint="caption"
                    classes={{ root: classes.ratingText }}
                  >
                    4.5 (123)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Box>
          <CardContent classes={{ root: classes.ctaContainer }}>
            <Typography classes={{ root: classes.date }}>
              12 OCT 6:30 AM - 7:30 AM
            </Typography>
            <Box display="flex" alignItems="center">
              <img src={PlayColorIcon} alt="Play Icon" />
              <Typography classes={{ root: classes.ctaText }}>
                Join now
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

const Category = (props) => {
  const classes = useStyles();

  return (
    <Box pr={2}>
      <Card classes={{ root: classes.categoryCard }}>
        <CardContent>
          <Box mb={1.5} className={classes.categoryIconContainer}>
            {/**
            TODO: make icon dynamic
           */}
            <Forum style={{ fontSize: "28px", color: "#05589C" }} />
          </Box>
          <Typography classes={{ root: classes.categoryName }}>
            {props.name}
          </Typography>
          <Typography classes={{ root: classes.categorySkills }}>
            {props.count > 0 ? `${props.count} Skills` : ""}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const Skill = (props) => {
  const classes = useStyles();

  return (
    <Box pr={2}>
      <Paper
        variant="elevation"
        elevation={0}
        classes={{ root: classes.skillContainer }}
      >
        <Typography classes={{ root: classes.skillName }}>
          {props.name || ""}
        </Typography>
      </Paper>
    </Box>
  );
};

const Feedback = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Typography classes={{ root: classes.feedbackHeading }}>
        Enrolled Student's{" "}
        <span style={{ color: "#475677", fontSize: "26px", fontWeight: 700 }}>
          Feedback
        </span>
      </Typography>
      <Box mt={3} className={classes.feedbackCardContainer}>
        <FeedbackCard />
        <FeedbackCard />
        <FeedbackCard />
      </Box>
    </Box>
  );
};

const FeedbackCard = (props) => {
  const classes = useStyles();

  return (
    <Box w={1} pr={{ xs: 0, sm: 2 }} pt={{ xs: 2, sm: 0 }}>
      <Paper variant="outlined" classes={{ root: classes.feedbackCard }}>
        <Typography classes={{ root: classes.feedbackText }}>
          It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining
        </Typography>
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Avatar
            alt="Enrolled Student"
            src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
            className={classes.avatar}
          />
          <Typography classes={{ root: classes.feedbackUsername }}>
            Amanda Jackson
          </Typography>
          <Typography classes={{ root: classes.feedbackUserDesignation }}>
            CEO, NRD Group
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

const Achievement = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.achievementContainer}>
      <Box className={classes.achievementWrapper}>
        <Typography classes={{ root: classes.achievementHeading }}>
          Our Achievements
        </Typography>
        <Typography classes={{ root: classes.achievementSubHeading }}>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected humour
        </Typography>
        <Box mt={2} className={classes.achievementStats}>
          <Box>
            <Typography classes={{ root: classes.achievementNumber }}>
              2400+
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              Online Course
            </Typography>
          </Box>
          <Box>
            <Typography
              classes={{ root: classes.achievementNumber }}
              style={{ color: "#00B592" }}
            >
              99,854+
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              Enrolled Students
            </Typography>
          </Box>
          <Box>
            <Typography
              classes={{ root: classes.achievementNumber }}
              style={{ color: "#FFBE58" }}
            >
              650+
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              Expert Instructors
            </Typography>
          </Box>
          <Box>
            <Typography
              classes={{ root: classes.achievementNumber }}
              style={{ color: "#E0474E" }}
            >
              1820+
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              Profile Review
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const HomeScreen = (props) => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  // eslint-disable-next-line
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coursesStartsInX, setStartsInCourses] = useState([]);

  const { logout } = useAuth()
  const { user } = useUser();
  const classes = useStyles();
  const getHomeScreenDataApi = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const getRecommendedCourses = async (apiBody) => {
    try {
      const res = await getHomeScreenDataApi.run(
        apiClient("POST", "course", "getrecommendcourse", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      setRecommendedCourses(res.content.data);
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
    getRecommendedCourses({ page_size: 20, page_number: 1 });

    // eslint-disable-next-line
  }, []);

  const getUpcomingCourses = async (apiBody) => {
    try {
      // eslint-disable-next-line
      const res = await getHomeScreenDataApi.run(
        apiClient("POST", "course", "getupcomingenrolledcourse", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      // do something with res
      // TODO: getting error from backend need to check reason
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
    getUpcomingCourses({ learner_id: user.id, page_size: 20, page_number: 1 });

    // eslint-disable-next-line
  }, []);

  const getTrendingSkills = async (apiBody) => {
    try {
      const res = await getHomeScreenDataApi.run(
        apiClient("POST", "course_setting", "gettrendingskill", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      setTrendingSkills(res.content.data);
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
    getTrendingSkills({ page_size: 10, page_number: 1 });

    // eslint-disable-next-line
  }, []);

  const getCourseCategory = async (apiBody) => {
    try {
      const res = await getHomeScreenDataApi.run(
        apiClient("POST", "course_setting", "getcoursecategory", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      setCategories(res.content.data);
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
    getCourseCategory({ page_size: 10, page_number: 1, is_admin: false });

    // eslint-disable-next-line
  }, []);

  const getCourseStartsInX = async (apiBody) => {
    try {
      const res = await getHomeScreenDataApi.run(
        apiClient("POST", "course", "startsinxdays", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
        })
      );

      setStartsInCourses(res.content.data);
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
    getCourseStartsInX({
      page_size: 20,
      page_number: 1,
      difficulty_level: ["intermediate"],
    });

    // eslint-disable-next-line
  }, []);

  return (
    <AppWrapper>
      <div>
        <Container maxWidth="lg" classes={{ root: classes.container }}>
          {getHomeScreenDataApi.isPending ? (
            <Box mt={4} className={classes.loadingContainer}>
              <CircularProgress size={50} />
            </Box>
          ) : (
            <>
              <Box mt={4}>
                <CustomCarousel
                  heading={
                    <Typography
                      variant="body1"
                      classes={{ root: classes.sectionHeading }}
                    >
                      Upcoming Courses
                    </Typography>
                  }
                  itemsToDisplay={3}
                  dataLength={upcomingCourses.length}
                  noDataMsg="No Courses Available"
                >
                  {/* <UpcomingCourse /> */}
                </CustomCarousel>
              </Box>
              <Box mt={4}>
                <CustomCarousel
                  heading={
                    <Typography
                      variant="body1"
                      classes={{ root: classes.sectionHeading }}
                    >
                      Explore Categories
                    </Typography>
                  }
                  itemsToDisplay={5}
                >
                  {categories.map((item) => (
                    <Category
                      name={item.name}
                      imgUrl={item.image_url}
                      count={item.skill_count}
                    />
                  ))}
                </CustomCarousel>
              </Box>
              <Box mt={4}>
                <CustomCarousel
                  heading={
                    <Typography
                      variant="body1"
                      classes={{ root: classes.sectionHeading }}
                    >
                      Starting in next 3 days
                    </Typography>
                  }
                  itemsToDisplay={4}
                  dataLength={coursesStartsInX.length}
                  noDataMsg="No Courses Available"
                >
                  {coursesStartsInX.map((item) => (
                    <Box pr={2} key={item.id}>
                      <CourseCard
                        id={item.id}
                        rating={item.course_rating}
                        title={item.title}
                        tagline={item.tag_line}
                        price={item.price}
                        discounted_price={item.discounted_price}
                        image_url={item.image_url}
                        instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                        no_of_slots={item.no_of_available_slots}
                        course_type={item.course_type}
                        instructor_id={item.instructor_id}
                        isWebinar={item.is_webinar ? true : false}
                      />
                    </Box>
                  ))}
                </CustomCarousel>
              </Box>

              <Box mt={4}>
                <CustomCarousel
                  heading={
                    <Typography
                      variant="body1"
                      classes={{ root: classes.sectionHeading }}
                    >
                      Trending Skills
                    </Typography>
                  }
                  itemsToDisplay={5}
                >
                  {trendingSkills.map((item) => (
                    <Skill name={item.name} />
                  ))}
                </CustomCarousel>
              </Box>

              <Box mt={4}>
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
                >
                  {recommendedCourses.map((item) => (
                    <Box pr={2} key={item.id}>
                      <CourseCard
                        id={item.id}
                        rating={item.course_rating}
                        title={item.title}
                        tagline={item.tag_line}
                        price={item.price}
                        discounted_price={item.discounted_price}
                        image_url={item.image_url}
                        instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                        no_of_slots={item.no_of_available_slots}
                        course_type={item.course_type}
                        instructor_id={item.instructor_id}
                        isWebinar={item.is_webinar ? true : false}
                      />
                    </Box>
                  ))}
                </CustomCarousel>
              </Box>
            </>
          )}
        </Container>

        <Box mt={4}>
          <Achievement />
        </Box>

        <Container>
          <Box mt={4} mb={20}>
            <Feedback />
          </Box>
        </Container>
      </div>
    </AppWrapper>
  );
};

export default HomeScreen;
