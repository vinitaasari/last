import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { format } from "date-fns";

import { courseDetail as useStyles } from "./styles";
import { getThemeProps } from "@material-ui/styles";
import { useHistory } from "react-router-dom";
import ErrorIcon from "@material-ui/icons/Error";
import JoinNowActiveIcon from "../../assets/images/join-now-active.svg";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import ActiveCheckIcon from "../../assets/images/green-check-icon.svg";
import DisabledCheckIcon from "../../assets/images/grey-check-icon.svg";

import MissedSessionIcon from "../../assets/images/missed-session-icon.svg";
import CancelSessionIcon from "../../assets/images/cancel-session-icon.svg";

const playRecording = (url) => {
  window.open(url, "_blank");
};

const DateWiseDetails = ({ sessionDetails = {} }) => {
  const classes = useStyles();
  const history = useHistory();

  const getSessionStatusIcon = (item) => {
    if (item.is_attended) {
      return ActiveCheckIcon;
    }

    if (item.is_cancelled) {
      return CancelSessionIcon;
    }

    if (item.status.toLowerCase() === "missed") {
      return MissedSessionIcon;
    }

    return DisabledCheckIcon;
  };

  return (
    <>
      <Box mt={4} display="flex" alignItems="flex-start">
        <Box>
          <Typography classes={{ root: classes.dateText }}>
            {format(sessionDetails.startDate, "dd")}
          </Typography>
          <Typography classes={{ root: classes.monthText }}>
            {format(sessionDetails.startDate, "MMM")}
          </Typography>
        </Box>

        <Box ml={3} className={classes.eventDetailsContainer}>
          <Typography className={classes.sessionNumber}>
            Session {sessionDetails.sequence || ""}
          </Typography>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography classes={{ root: classes.eventHeading }}>
              {sessionDetails.title}
            </Typography>
            {
              history.location && history.location.state && history.location.state.details ? (
                <img
                  src={getSessionStatusIcon(sessionDetails)}
                  alt="Session status"
                />
              ) : null
            }
          </div>

          <Typography classes={{ root: classes.eventDescription }}>
            {sessionDetails.description}
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography classes={{ root: classes.eventStats }}>
              {format(sessionDetails.startDate, "hh:mm a")} &middot;{" "}
              {sessionDetails.duration} mins
            </Typography>
            {history.location.state && history.location.state.details && (
              <>
                {sessionDetails.video_play_url && (
                  <Button
                    variant="text"
                    color="secondary"
                    style={{
                      paddingLeft: 0,
                      textTransform: "none",
                    }}
                    onClick={() => playRecording(sessionDetails.video_play_url)}
                  >
                    <img src={JoinNowActiveIcon} alt="View recording button" />
                    <span style={{ marginLeft: "8px" }}>Session Recording</span>
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DateWiseDetails;
