import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Forum } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import * as dateFns from "date-fns";
import shortid from "shortid";
import SessionReview from "./sessionRating";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import CustomCarousel from "../../components/carousel";
import HomeScreenBanner from "./banner";
import CourseCard from "../courses/course-card";
import AppWrapper from "../../components/app-wrapper";
import Loader from "../../components/loader";
import UpComingCourseCard from "../../components/upcoming-course-card";
// import PriceFilter from "../courses/price-filter-dialog";
import { getRemainingTime, scheduleTimeout } from "../../utils/date-time";
import {
  course_types,
  course_detail_view,
} from "../../static-data/course-constants";
import Pluralize from "react-pluralize";
import { useAuth } from "../../contexts/auth-context";
import SEO from "../../components/seo";
import testimonialsImage_1 from "../../assets/images/testimonialsImage_1.jpg";
import testimonialsImage_2 from "../../assets/images/testimonialsImage_2.jpg";
import testimonialsImage_3 from "../../assets/images/testimonialsImage_3.jpg";

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
    marginLeft: "20px",
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
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  categoryIconContainer: {
    height: "64px",
    width: "64px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  categoryIcon: {
    height: "100%",
    width: "100%",
  },
  categoryName: {
    color: "#05589C",
    fontSize: "18px",
    fontWeight: 600,
    textAlign: "center",
  },
  categorySkills: {
    color: "#52534F",
    fontSize: "16px",
    fontWeight: 400,
    textAlign: "center",
  },
  skillContainer: {
    backgroundColor: "#F4F6FA",
    padding: theme.spacing(2),
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
  },
  skillName: {
    color: "#03579C",
    fontSize: "20px",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  skillCount: {
    color: "#52534F",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "capitalize",
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
// const UpcomingCourse = (props) => {
//   const classes = useStyles();

//   return (
//     <Box pr={2}>
//       <Card>
//         <CardActionArea>
//           <Box display="flex" w={1} className={classes.cardContainer}>
//             <CardMedia
//               className={classes.media}
//               image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
//               title="Course Name"
//             />
//             <CardContent classes={{ root: classes.cardContent }}>
//               <Typography classes={{ root: classes.courseName }}>
//                 Yoga
//               </Typography>
//               <Typography classes={{ root: classes.courseDescription }}>
//                 Freshen body, mind & soul
//               </Typography>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 mt="auto"
//               >
//                 <Typography classes={{ root: classes.courseInstructor }}>
//                   By Amrita Mishra
//                 </Typography>
//                 <Box display="flex" alignItems="center">
//                   <Star style={{ fontSize: 16, color: "#FFB833" }} />
//                   <Typography
//                     varaint="caption"
//                     classes={{ root: classes.ratingText }}
//                   >
//                     4.5 (123)
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Box>
//           <CardContent classes={{ root: classes.ctaContainer }}>
//             <Typography classes={{ root: classes.date }}>
//               12 OCT 6:30 AM - 7:30 AM
//             </Typography>
//             <Box display="flex" alignItems="center">
//               <img src={PlayColorIcon} alt="Play Icon" />
//               <Typography classes={{ root: classes.ctaText }}>
//                 Join now
//               </Typography>
//             </Box>
//           </CardContent>
//         </CardActionArea>
//       </Card>
//     </Box>
//   );
// };

const Category = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const viewCategory = (categoryId, name) => {
    history.push(`/explore/${categoryId}`, { name: name });
  };

  return (
    <Box pr={2}>
      <Card
        classes={{ root: classes.categoryCard }}
        onClick={() => viewCategory(props.id, props.name)}
      >
        <CardContent>
          <Box mb={1.5} className={classes.categoryIconContainer}>
            <img
              src={props.imgUrl}
              alt={props.name}
              className={classes.categoryIcon}
            />
          </Box>
          <Typography classes={{ root: classes.categoryName }}>
            {props.name}
          </Typography>
          <Typography classes={{ root: classes.categorySkills }}>
            <Pluralize singular={"skill"} count={props.count} />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const Skill = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { name, skillCount } = props;
  // const truncatedName = name.length >= 10 ? name.substring(0, 9) + "..." : name;

  const viewSkill = (skillId) => {
    history.push(`/skill/${skillId}`, {
      name: name,
    });
  };

  return (
    <Box pr={2}>
      <Paper
        variant="elevation"
        elevation={0}
        classes={{ root: classes.skillContainer }}
        onClick={() => viewSkill(props.id)}
      >
        <Typography classes={{ root: classes.skillName }}>
          {name || ""}
        </Typography>
        {skillCount > 0 && (
          <Typography classes={{ root: classes.skillCount }}>
            <Pluralize singular={"Course"} count={skillCount} />
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

const Feedback = (props) => {
  const classes = useStyles();

  return (
    <Box>
      <Typography classes={{ root: classes.feedbackHeading }}>
        TESTIMONIALS
        {/* <span style={{ color: "#475677", fontSize: "26px", fontWeight: 700 }}>
          Feedback 

        </span> */}
      </Typography>
      <Box mt={3} className={classes.feedbackCardContainer}>
        <FeedbackCard step={1} />
        <FeedbackCard step={2} />
        <FeedbackCard step={3} />
      </Box>
    </Box>
  );
};

const FeedbackCard = (props) => {
  const classes = useStyles();
  console.log("props here :", props);
  return (
    <Box w={1} pr={{ xs: 0, sm: 2 }} pt={{ xs: 2, sm: 0 }}>
      <Paper variant="outlined" classes={{ root: classes.feedbackCard }}>
        {props &&
          props.step === 1 && [
            <Typography classes={{ root: classes.feedbackText }}>
              "The Yoga and Meditation session made me more aware about the
              nutrition value of food, I realized importance of balanced diet. I
              understood how yoga exercises and meditation keep our mind and
              body healthy. Thank you CreativeYou for informative session."
            </Typography>,
            <Box
              mt={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Avatar
                alt="Enrolled Student"
                // src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                src={testimonialsImage_1}
                className={classes.avatar}
              />
              <Typography classes={{ root: classes.feedbackUsername }}>
                - AROHI RANE
              </Typography>
              <Typography classes={{ root: classes.feedbackUserDesignation }}>
                - Student, Gurunakak School
              </Typography>
            </Box>,
          ]}
        {props &&
          props.step === 2 && [
            <Typography classes={{ root: classes.feedbackText }}>
              "It was fun learning Arts, Crafts and Creativity. I was completely
              bored in this lockdown and wanted a home transformation. Thank you
              CreativeYou for making such an interesting and informative
              platform. I learned a lot of easy techniques and created crafts
              form my home."
            </Typography>,
            <Box
              mt={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Avatar
                alt="Enrolled Student"
                // src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                src={testimonialsImage_2}
                className={classes.avatar}
              />
              <Typography classes={{ root: classes.feedbackUsername }}>
                - MANSI RAICHURA
              </Typography>
              <Typography classes={{ root: classes.feedbackUserDesignation }}>
                - Student
              </Typography>
            </Box>,
          ]}
        {props &&
          props.step === 3 && [
            <Typography classes={{ root: classes.feedbackText }}>
              "l am grateful for CreativeYou for providing a platform to share
              my knowledge and experience. While interacting with students, I
              received a great amount of satisfaction that I am making a
              valuable change in students' life."
            </Typography>,
            <Box
              mt={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Avatar
                alt="Enrolled Student"
                // src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                src={testimonialsImage_3}
                className={classes.avatar}
              />
              <Typography classes={{ root: classes.feedbackUsername }}>
                - SUHANA SHARMA
              </Typography>
              <Typography classes={{ root: classes.feedbackUserDesignation }}>
                - Digital Marketing Trainer
              </Typography>
            </Box>,
          ]}
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
          We make Brilliance happen with Quality online Education
        </Typography>
        <Box mt={2} className={classes.achievementStats}>
          <Box>
            <Typography classes={{ root: classes.achievementNumber }}>
              100+
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              COUNTRIES REACHED
            </Typography>
          </Box>
          <Box>
            <Typography
              classes={{ root: classes.achievementNumber }}
              style={{ color: "#00B592" }}
            >
              35000
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              HAPPY STUDENTS
            </Typography>
          </Box>
          <Box>
            <Typography
              classes={{ root: classes.achievementNumber }}
              style={{ color: "#FFBE58" }}
            >
              850
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              TEACHERS
            </Typography>
          </Box>
          <Box>
            <Typography
              classes={{ root: classes.achievementNumber }}
              style={{ color: "#E0474E" }}
            >
              1220
            </Typography>
            <Typography classes={{ root: classes.achievementName }}>
              COURSES PUBLISHED
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const HomeScreen = (props) => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [runningTimers, setRunningTimers] = useState([]);
  // eslint-disable-next-line
  const [upcomingCourses, setUpcomingCourses] = useState([]);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coursesStartsInX, setStartsInCourses] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const { logout } = useAuth();

  const history = useHistory();
  const { user } = useUser();
  const { setNoti } = useUser();
  const classes = useStyles();
  const getHomeScreenDataApi = useCallbackStatus();
  const getRecommendedCoursesApi = useCallbackStatus();
  const getUpcomingCoursesApi = useCallbackStatus();
  const getTrendingSkillsApi = useCallbackStatus();
  const getCourseCategoryApi = useCallbackStatus();
  const getCourseStartsInXApi = useCallbackStatus();
  const getBannerImagesApi = useCallbackStatus();
  const joinSessionApiStatus = useCallbackStatus();
  const joinBeforeApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

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

  const getRecommendedCourses = async (apiBody) => {
    try {
      const res = await getRecommendedCoursesApi.run(
        apiClient("POST", "course", "getrecommendcourse", {
          body: { ...apiBody },
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

  const getImage = async (apiBody) => {
    try {
      const res = await getRecommendedCoursesApi.run(
        apiClient("POST", "common", "getsignedgetobjecturl", {
          body: { ...apiBody },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
        })
      );
      // alert(res.content.data)
      console.log("imageeeeeeeeeeeeeeeee")
      console.log(res.content.data)
    } catch (error) {
      // if (error.code === 401) {
      //   logout();
      // }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    setNoti(Math.random());
    getRecommendedCourses({ page_size: 20, page_number: 1 });
    // getImage({
    //   file_key: "/assignments/learner/images/beautiful-hologram-water-color-frame-png_119551.png"
    // })
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line
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

      // do something with res
      enableCourseJoin(courses, "session_start_time", ["disableJoin", true]);
      setUpcomingCourses(courses);
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
    if (user && user.authenticated === true && (!user.is_mi_user || (user.is_mi_user && user.is_subscription_purchased))) {
      getUpcomingCourses({
        learner_id: user.id,
      });
    }
    // eslint-disable-next-line
  }, [user]);

  const getTrendingSkills = async (apiBody) => {
    try {
      const res = await getTrendingSkillsApi.run(
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
    getTrendingSkills({ page_size: 100, page_number: 1 });

    // eslint-disable-next-line
  }, []);

  const getCourseCategory = async (apiBody) => {
    try {
      const res = await getCourseCategoryApi.run(
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
    getCourseCategory({ is_admin: false });

    // eslint-disable-next-line
  }, []);

  const getJoinBeforeMeetingTime = async (apiBody) => {
    try {
      const res = await joinBeforeApiStatus.run(
        apiClient("POST", "course_setting", "getcourseconfiguration", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;

      const meetingConfiguration = data.find(
        (c) => c.id === "join_meeting_before_minutes"
      );
      const timeUnit = meetingConfiguration.unit
        ? parseInt(meetingConfiguration.unit)
        : 5;
      localStorage.setItem("before_start_time", timeUnit);
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    getJoinBeforeMeetingTime({ config_name: "join_meeting_before_minutes" });
  }, []);

  const getCourseStartsInX = async (apiBody) => {
    try {
      const res = await getCourseStartsInXApi.run(
        apiClient("POST", "course", "startsinxdays", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: false,
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

  const getBannerImages = async (apiBody) => {
    try {
      const res = await getBannerImagesApi.run(
        apiClient("POST", "cms", "getimagebanner", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: false,
        })
      );

      const {
        content: { data },
      } = res;

      setBannerImages(data);
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
      days: 3,
    });

    getBannerImages({});

    // eslint-disable-next-line
  }, []);

  const getDateTimeStr = (course_details_obj) => {
    const start_d = dateFns.fromUnixTime(course_details_obj.session_start_time);
    const end_d = dateFns.fromUnixTime(course_details_obj.session_end_time);

    const start_time_str = dateFns.format(start_d, "hh:mm a");
    const start_date_str = dateFns.format(start_d, "dd MMM");
    const end_time_str = dateFns.format(end_d, "hh:mm a");

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

  if (
    getHomeScreenDataApi.isPending ||
    getBannerImagesApi.isPending ||
    getUpcomingCoursesApi.isPending ||
    getRecommendedCoursesApi.isPending ||
    getCourseStartsInXApi.isPending ||
    getTrendingSkillsApi.isPending
  ) {
    return <Loader />;
  }

  return (
    <AppWrapper>
      <div>
        <SEO
          title="Midigiworld"
          description="India's interactive online learning platform"
          keywords="Learning, Courses, Interactive, Online"
        />
        <HomeScreenBanner images={bannerImages} />
        <Container maxWidth="lg" classes={{ root: classes.container }}>
          <>
            <Box mt={4}>
              {user &&
                user.authenticated === true &&
                upcomingCourses.length > 0 && (
                  <CustomCarousel
                    heading={
                      <Typography
                        variant="body1"
                        classes={{ root: classes.sectionHeading }}
                      >
                        Upcoming Courses
                      </Typography>
                    }
                    path="/my-learning/upcoming"
                    itemsToDisplay={3}
                    dataLength={upcomingCourses.length}
                    noDataMsg="No Courses Available"
                  >
                    {upcomingCourses.map((item) => (
                      <Box pr={2} key={item.id}>
                        <UpComingCourseCard
                          title={item.session_title}
                          tagline={item.tag_line}
                          instructor_id={item.instructor_id}
                          instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                          rating={item.course_rating}
                          total_rating={item.total_course_rating}
                          dateAndTime={getDateTimeStr(item)}
                          handleJoinCourse={() => handleJoinCourse({ ...item })}
                          image_url={item.image_url}
                          thumbnail_image_url={item.thumbnail_image_url}
                          courseObj={{ ...item }}
                          isDisabled={item.disableJoin}
                          joinSession={joinSession}
                          learner_id={user.id}
                          duration={item.session_duration}
                          session_start_time={item.session_start_time}
                          session_end_time={item.session_end_time}
                        />
                      </Box>
                    ))}
                  </CustomCarousel>
                )}
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
                path="/explore"
                itemsToDisplay={5}
              >
                {categories.map((item) => (
                  <Category
                    id={item.id}
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
                    Starting In Next 3 Days
                  </Typography>
                }
                itemsToDisplay={4}
                path="/starts-in-x-days"
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
                      is_favorite={item.is_favourite}
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
              // itemsToDisplay={5}
              >
                {trendingSkills.map((item) => (
                  <Skill
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    skillCount={item.skill_count}
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
            </Box>
          </>
        </Container>

        <Box mt={4}>
          <Achievement />
        </Box>

        <Container>
          <Box mt={4} mb={6}>
            <Feedback />
          </Box>
        </Container>
      </div>
    </AppWrapper>
  );
};

export default HomeScreen;
