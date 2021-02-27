import React from "react";
import { Box, Typography } from "@material-ui/core";
import {
  BarChart,
  People,
  AccessibilityNew,
  Chat,
  Timer,
  Event,
} from "@material-ui/icons";

import AboutStats from "./AboutStats";
import { courseDetail as useStyles } from "./styles";

const About = ({ level, language, total_seats, slots, duration, ageRange, booked = 0 }) => {
  const classes = useStyles();

  return (
    <Box mt={2} className={classes.aboutContainer}>
      <Typography classes={{ root: classes.aboutHeading }}>About</Typography>
      <Box mt={2} display="flex" alignItems="flex-start" flexWrap="wrap">
        <AboutStats
          label="Level"
          value={level}
          icon={<BarChart fontSize="large" style={{ color: "#05589C" }} />}
        />
        <AboutStats
          label="Up To"
          value={total_seats}
          icon={<People style={{ color: "#05589C" }} />}
        />
        <AboutStats
          label="Suitable For"
          value={ageRange}
          icon={<AccessibilityNew style={{ color: "#05589C" }} />}
        />
        <AboutStats
          label="Delivered In"
          value={language}
          icon={<Chat style={{ color: "#05589C" }} />}
        />
        <AboutStats
          label="Duration"
          value={duration}
          icon={<Timer style={{ color: "#05589C" }} />}
        />
        <AboutStats
          label="Registered Till Date"
          value={booked}
          icon={<Event style={{ color: "#05589C" }} />}
        />
      </Box>
    </Box>
  );
};

export default About;
