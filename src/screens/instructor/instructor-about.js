import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close as CloseIcon, Star as StarIcon } from "@material-ui/icons";
import Loader from "../../components/loader";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({
  publicProfileLink: {
    marginTop: theme.spacing(0.5),
    color: "#f05e23",
    fontWeight: 500,
    textDecoration: "underline",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  mainDetailsContainer: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    display: "block",
    height: theme.spacing(9),
    width: theme.spacing(9),
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: theme.spacing(2),
  },
  fullName: {
    color: "#52534F",
    fontSize: "18px",
    fontWeight: 600,
  },
  about: {
    color: "#848282",
    fontSize: "14px",
    fontWeight: 400,
    maxWidth: "320px",
  },
  tabContainer: {
    borderBottom: "1px solid rgba(95,95,95, 0.16)",
  },
  tabs: {
    "& .MuiTab-wrapper": {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#05589c",
    },
  },
  tab: {
    color: "#7e7e7e",
    minWidth: 75,
    width: 75,
    "&$selected": {
      color: "#05589c",
      fontWeight: 500,
    },
  },
  sectionHeading: {
    color: "#52534F",
    fontSize: "18px",
    fontWeight: 600,
  },
  statValue: {
    color: "#52534f",
    fontSize: "16px",
    fontWeight: 600,
  },
  statName: {
    color: "#393a45",
    fontSize: "12px",
    fontWeight: 400,
  },
  aboutText: {
    color: "#393a45",
    fontSize: "14px",
    fontWeight: 400,
  },
  playerWrapper: {
    position: "relative",
    borderRadius: "5px",
    height: "220px",
    // paddingTop: "10%",
  },
}));

const InstructorAbout = (props) => {
  const classes = useStyles();
  const { profile, isLoading } = props;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={2}>
      <SEO
        title="Midigiworld - Instructor"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />
      <Grid container item xs={12} md={7}>
        <Grid item xs={12} style={{ marginBottom: "8px" }}>
          <Typography variant="subtitle1" className={classes.sectionHeading}>
            Meet your Instructor, {profile.first_name || ""}
          </Typography>
        </Grid>
        <Grid item xs={6} md={3} className={classes.stats}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <StarIcon
              style={{
                height: "18px",
                width: "18px",
                color: "#FFD700",
              }}
            />
            <Typography
              className={classes.statValue}
              style={{ marginLeft: "4px" }}
            >
              {profile.instructor_rating || "New"}
            </Typography>
          </Box>
          <Typography className={classes.statName}>Rating</Typography>
        </Grid>
        <Grid item xs={6} md={3} className={classes.stats}>
          <Typography className={classes.statValue}>
            {profile.total_courses || "-"}
          </Typography>
          <Typography className={classes.statName}>Courses</Typography>
        </Grid>
        <Grid item xs={6} md={3} className={classes.stats}>
          <Typography className={classes.statValue}>
            {profile.total_learners || "-"}
          </Typography>
          <Typography className={classes.statName}>Taught Learners</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography className={classes.statValue}>
            {profile.total_instructor_rating || "-"}
          </Typography>
          <Typography className={classes.statName}>Reviews Received</Typography>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "16px" }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            className={classes.sectionHeading}
          >
            About
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            className={classes.aboutText}
          >
            {profile.about_me || ""}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} md={5}>
        <Box className={classes.playerWrapper}>
          {profile.introductory_video_url && (
            <video
              poster={profile.introductory_video_url_thumbnail}
              style={{
                width: "100%",
                height: "100%",
                outline: "none",
              }}
              controls
            >
              <source
                src={profile.introductory_video_url}
                type="video/mp4"
              ></source>
            </video>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default InstructorAbout;
