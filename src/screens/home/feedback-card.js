import React from "react";
import { Avatar, Box, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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

export default FeedbackCard;
