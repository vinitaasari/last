import React from "react";
import { Box, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { courseDetail as useStyles } from "./styles";

const AboutStats = ({ label = "", value = "", icon, width = "33%" }) => {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:600px)");

  if (matches) {
    width = "50%";
  }

  return (
    <Box display="flex" mt={2} alignItems="flex-start" width={width}>
      {icon}
      <Box ml={2}>
        <Typography classes={{ root: classes.aboutStatsTitle }}>
          {
            label === "Delivered In" ? (
              <div style={{ marginLeft: '8px' }}>
                {label}
              </div>
            ) : (
                <>
                  {label}
                </>
              )
          }
        </Typography>
        <Typography classes={{ root: classes.aboutStatsSubTitle }}>
          {
            label === "Delivered In" ? (
              <div style={{ marginLeft: '8px' }}>
                {value}
              </div>
            ) : (
                <>
                  {value}
                </>
              )
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default AboutStats;
