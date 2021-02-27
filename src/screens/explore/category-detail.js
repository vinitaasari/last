import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Chip,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppWrapper from "../../components/app-wrapper";
import CourseCard from "../courses/course-card";
import EmptyState from "../../components/empty-state";
import SEO from "../../components/seo";
import MoreSkillsModal from "./more-skills";
import CourseFilterModal from "./course-filter";
import NoCoursesImage from "../../assets/images/no-reviews.svg";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";
import { useHistory } from "react-router-dom";

const NUMBER_OF_SKILLS_TO_BE_SHOWN = 3;

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: "#52534f",
    fontSize: "22px",
    fontWeight: 600,
  },
  coursesContainer: {
    marginTop: theme.spacing(2),
  },
  skillChipsContainer: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  activeChipOutlined: {
    backgroundColor: "#E2EAFA",
    border: "1px solid #05589C",
  },
  activeChipLabel: {
    color: "#05589C",
  },
}));

const CategoryDetail = (props) => {
  const classes = useStyles();

  const { categoryId } = props.match.params;

  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const { logout } = useAuth();

  const getCourseApiStatus = useCallbackStatus();
  const getCourseSkillApiStatus = useCallbackStatus();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const history = useHistory();

  const getCoursesOfCategory = async (apiBody) => {
    try {
      const res = await getCourseApiStatus.run(
        apiClient("POST", "course_setting", "getallcourses", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );
      console.log(res.content.data);
      setCourses(res.content.data);
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

  const getCourseSkills = async (apiBody) => {
    try {
      const res = await getCourseSkillApiStatus.run(
        apiClient("POST", "course_setting", "getcourseskill", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      setSkills(res.content.data);
      console.log(res.content.data);
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
    getCoursesOfCategory({
      course_category_id: [categoryId],
    });

    getCourseSkills({
      course_category_id: [categoryId],
      page_number: 1,
      page_size: 100,
      is_admin: false,
    });

    // eslint-disable-next-line
  }, []);

  const handleChipClick = (skillId) => {
    let apiBody = {
      course_category_id: [categoryId],
    };

    if (!skillId) {
      setSelectedSkill(null);
    } else {
      if (selectedSkill == skillId) {
        setSelectedSkill(null);
      } else {
        setSelectedSkill(skillId);
        apiBody = {
          course_skill_id: [skillId],
          course_category_id: [categoryId],
        };
      }
    }

    getCoursesOfCategory(apiBody);
  };

  let skillsToBeShown = [];
  let skillsNotShownCount = 0;

  if (skills.length > NUMBER_OF_SKILLS_TO_BE_SHOWN) {
    skillsToBeShown = skills.slice(0, NUMBER_OF_SKILLS_TO_BE_SHOWN);
    skillsNotShownCount = skills.length - NUMBER_OF_SKILLS_TO_BE_SHOWN;
  } else {
    skillsToBeShown = skills;
    skillsNotShownCount = 0;
  }

  const filterCourses = (chosenFilterValues) => {
    console.log("chosenFilterValues", chosenFilterValues);
    const courseSkillId = selectedSkill || [];
    getCoursesOfCategory({
      course_category_id: [categoryId],
      course_skill_id: courseSkillId,
      ...chosenFilterValues,
    });
  };

  return (
    <AppWrapper>
      <SEO
        title={
          history.location.state && history.location.state.name
            ? history.location.state.name
            : ""
        }
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />
      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Typography classes={{ root: classes.heading }}>
          All {history.location.state ? history.location.state.name : ""}{" "}
          Courses
        </Typography>

        <Box mt={2} className={classes.skillChipsContainer}>
          {skillsToBeShown.map((skill) => {
            return (
              <Chip
                key={skill.id}
                label={skill.name}
                clickable
                variant="outlined"
                onClick={() => handleChipClick(skill.id)}
                classes={{
                  outlined:
                    skill.id === selectedSkill
                      ? classes.activeChipOutlined
                      : undefined,
                  label:
                    skill.id === selectedSkill
                      ? classes.activeChipLabel
                      : undefined,
                }}
              />
            );
          })}
          {skillsNotShownCount > 0 && (
            <MoreSkillsModal
              skills={skills}
              skillsNotShownCount={skillsNotShownCount}
              selectedSkill={selectedSkill}
              handleChipClick={handleChipClick}
            />
          )}
          <CourseFilterModal filterCourses={filterCourses} />
        </Box>

        <Grid container spacing={2} className={classes.coursesContainer}>
          {getCourseApiStatus.isPending ? (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CircularProgress color="primary" size={28} />
            </Box>
          ) : courses.length > 0 ? (
            courses.map((item) => {
              return (
                <Grid key={item.id} item xs={12} sm={6} md={3}>
                  <CourseCard
                    id={item.id}
                    rating={item.course_rating}
                    title={item.title}
                    tagline={item.tag_line}
                    price={item.price}
                    discounted_price={item.discounted_price}
                    image_url={item.image_url}
                    thumbnail_image_url={item.image_url}
                    is_favorite={item.is_favourite}
                    instructor_name={`${item.instructor_first_name} ${item.instructor_last_name}`}
                    no_of_slots={item.no_of_available_slots}
                    course_type={item.course_type}
                    total_course_rating={item.total_course_rating}
                    offered_price={item.offered_price}
                    suggested_price={item.suggested_price}
                    is_favorite={item.is_favourite}
                    no_of_enrolled={item.no_of_enrolled}
                    no_of_sessions={item.no_of_sessions}
                    instructor_id={item.instructor_id}
                    isWebinar={item.is_webinar ? true : false}
                  />
                </Grid>
              );
            })
          ) : (
            <Box
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <EmptyState image={NoCoursesImage} text="No course found" />
            </Box>
          )}
        </Grid>
      </Container>
    </AppWrapper>
  );
};

export default CategoryDetail;
