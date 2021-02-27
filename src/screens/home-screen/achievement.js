import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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
}));

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

export default Achievement;
