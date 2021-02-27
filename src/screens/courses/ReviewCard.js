import React from "react";
import { Paper, Box, Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import { courseDetail as useStyles } from "./styles";
import { format } from "date-fns";

const ReviewCard = ({ review }) => {
  const classes = useStyles();

  const reviewDate = review.created_at
    ? format(new Date(review.created_at * 1000), "d/MM/yyyy")
    : "";

  return (
    <Box pr={1}>
      <Paper
        variant="outlined"
        elevation={0}
        classes={{ root: classes.reviewCardContainer }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              varaint="caption"
              classes={{ root: classes.reviewerName }}
            >
              {review.learner_name || ""}
            </Typography>
            <Typography
              varaint="caption"
              classes={{ root: classes.reviewDate }}
            >
              {reviewDate}
            </Typography>
          </Box>
          <Box>
            <Rating
              // name="read-only"
              // value={review.rating}
              value={4}
              precision={0.5}
              // readOnly
              size="small"
            />
          </Box>
        </Box>
        <Box mt={1}>
          <Typography classes={{ root: classes.reviewDescription }}>
            {review.feedback || ""}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReviewCard;
