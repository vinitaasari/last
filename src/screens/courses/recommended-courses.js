import React from "react";
import { Box, Chip, Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Tune } from "@material-ui/icons";
import CourseCard from "./course-card";
import AppWrapper from "../../components/app-wrapper";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: "#52534F",
    fontSize: "30px",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "28px",
    },
  },
  filtersContainer: {
    width: "60%",
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  activeChipOutlined: {
    backgroundColor: "#E2EAFA",
    border: "1px solid #05589C",
  },
  activeChipLabel: {
    color: "#05589C",
  },
  coursesContainer: {
    marginTop: theme.spacing(1),
  },
}));

const RecommendedCourses = (props) => {
  const classes = useStyles();

  return (
    <AppWrapper>
      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              component="h2"
              classes={{ root: classes.heading }}
            >
              All Recommended Courses
            </Typography>
            <Box mt={3} className={classes.filtersContainer}>
              <Chip
                icon={<Tune style={{ fontSize: 18, color: "#05589C" }} />}
                label="Filter"
                clickable
                variant="outlined"
                classes={{
                  outlined: classes.activeChipOutlined,
                  label: classes.activeChipLabel,
                }}
              />
              <Chip label="Choose Date" clickable variant="outlined" />
              <Chip
                label="Price"
                clickable
                variant="outlined"
                classes={{
                  outlined: classes.activeChipOutlined,
                  label: classes.activeChipLabel,
                }}
              />
              <Chip label="4+ Rating" clickable variant="outlined" />
            </Box>
          </Grid>

          <Grid
            container
            item
            xs={12}
            spacing={3}
            classes={{ root: classes.coursesContainer }}
          >
            <Grid item xs={12} md={3}>
              <CourseCard />
            </Grid>
            <Grid item xs={12} md={3}>
              <CourseCard />
            </Grid>
            <Grid item xs={12} md={3}>
              <CourseCard />
            </Grid>
            <Grid item xs={12} md={3}>
              <CourseCard />
            </Grid>
            <Grid item xs={12} md={3}>
              <CourseCard />
            </Grid>
            <Grid item xs={12} md={3}>
              <CourseCard />
            </Grid>
            <Grid item xs={12} md={3}>
              <CourseCard />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AppWrapper>
  );
};

export default RecommendedCourses;
