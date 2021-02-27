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
import PlayColorIcon from "../../assets/images/play-color-icon.svg";
import CustomCarousel from "../../components/carousel";

// import { useSnackbar } from "notistack";
// import { useAuth } from "../../contexts/auth-context";
// import useCallbackStatus from "../../hooks/use-callback-status";
// import useCancelRequest from "../../hooks/useCancelRequest";

const useStyles = makeStyles((theme) => ({
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
}));

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
              // title="Course Name"
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

const UpcomingCourses = (props) => {
  const classes = useStyles();

  // const [courses, setCourses] = useState([]);

  // const { getUserId } = useAuth();
  // const learner_id = getUserId();
  // const coursesApiStatus = useCallbackStatus();
  // const apiSource = useCancelRequest();
  // const notification = useSnackbar();

  // const getUpcomingCourses = useCallback(async () => {
  //   try {
  //     const res = await coursesApiStatus.run(
  //       apiClient("POST", "", "getupcomingenrolledcourse", {
  //         body: { learner_id: learner_id, page_number: 1, page_size: 100 },
  //         shouldUseDefaultToken: false,
  //         cancelToken: apiSource.token,
  //         enableLogging: true,
  //       })
  //     );

  //     const {
  //       content: { data },
  //     } = res;

  //     setCourses(data);
  //   } catch (error) {
  //     notification.enqueueSnackbar(error.message, {
  //       variant: "error",
  //       autoHideDuration: 2000,
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   getUpcomingCourses();
  // }, [getUpcomingCourses]);

  return (
    <CustomCarousel
      heading={
        <Typography variant="body1" classes={{ root: classes.sectionHeading }}>
          Upcoming Courses
        </Typography>
      }
      itemsToDisplay={3}
    >
      <UpcomingCourse />
      <UpcomingCourse />
      <UpcomingCourse />
      <UpcomingCourse />
    </CustomCarousel>
  );
};

export default UpcomingCourses;
