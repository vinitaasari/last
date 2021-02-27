import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FeedbackCard from "./feedback-card";

const useStyles = makeStyles((theme) => ({
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
}));

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

export default Feedback;
