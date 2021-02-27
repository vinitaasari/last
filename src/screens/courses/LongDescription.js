import React from "react";
import { Box, Typography } from "@material-ui/core";

import { courseDetail as useStyles } from "./styles";

const LongDescription = ({ description = "" }) => {
  const classes = useStyles();

  return (
    <Box mt={2} className={classes.shortDescriptionContainer}>
      <Typography gutterBottom classes={{ root: classes.aboutHeading }}>
        Description
      </Typography>
      <Typography classes={{ root: classes.shortDescriptionText }}>
        {/* Join 400,000+ students in the bestselling digital marketing course on
        Mi-Lifestyle! With over 20 hours of training, quizzes and practical
        steps you can follow. This is one of the most comprehensive digital
        marketing courses available. We’ll cover SEO, YouTube Marketing,
        Facebook Marketing, Google Adwords, Google Analytics and…
        <span className={classes.knowMoreText}>KNOW MORE</span> */}
        {description || ""}
      </Typography>
    </Box>
  );
};

export default LongDescription;
