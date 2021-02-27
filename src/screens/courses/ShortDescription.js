import React from "react";
import { Box, Typography } from "@material-ui/core";

import { courseDetail as useStyles } from "./styles";

const ShortDescription = ({ description = "" }) => {
  const classes = useStyles();

  return (
    <Box mt={2} className={classes.shortDescriptionContainer}>
      <Typography gutterBottom classes={{ root: classes.aboutHeading }}>
        After class you will be able to
      </Typography>
      <Typography classes={{ root: classes.shortDescriptionText }}>
        {description}
        {/* 1. 23.5 hours on-demand video <br />
        2. 38 articles <br />
        3. 4 downloadable resources <br />
        4. Full lifetime Access <br />
        5. Access on mobile and TV <br />6 Certificate of completion */}
      </Typography>
    </Box>
  );
};

export default ShortDescription;
