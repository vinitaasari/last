import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import AppWrapper from "../../components/app-wrapper";
import CategoryCard from "../home/category-card";

import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: "#2C516C",
    fontSize: "32px",
    fontWeight: 600,
  },
  subHeading: {
    color: "#2C516C",
    fontSize: "24px",
    fontWeight: 400,
  },
  categoriesContainer: {
    marginTop: theme.spacing(4),
  },
}));

const Explore = () => {
  const classes = useStyles();

  const [categories, setCategories] = useState([]);
  const { logout } = useAuth();

  const getCategoriesApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { setNoti } = useUser();

  const getCourseCategory = async (apiBody) => {
    try {
      const res = await getCategoriesApiStatus.run(
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
    setNoti(Math.random())

    getCourseCategory({ page_size: 100, page_number: 1, is_admin: false });

    // eslint-disable-next-line
  }, []);

  return (
    <AppWrapper>
      <SEO
        title="Categories"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />
      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Typography classes={{ root: classes.heading }}>Explore</Typography>
        <Typography classes={{ root: classes.subHeading }}>
          Explore all categories & skills here
        </Typography>

        <Grid container spacing={2} className={classes.categoriesContainer}>
          {getCategoriesApiStatus.isPending ? (
            <Grid item container xs={12} justify="center">
              <CircularProgress color="primary" size={28} />
            </Grid>
          ) : (
              categories.map((item) => {
                return (
                  <Grid key={item.id} item xs={6} sm={4} md={2}>
                    <CategoryCard
                      id={item.id}
                      name={item.name}
                      imgUrl={item.image_url}
                      count={item.skill_count}
                    />
                  </Grid>
                );
              })
            )}
        </Grid>
      </Container>
    </AppWrapper>
  );
};

export default Explore;
