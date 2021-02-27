import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Box, Typography, Button, Divider } from "@material-ui/core";
import { Star } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import MessageIcon from "../../assets/images/message-icon.svg";
import DiscussionIcon from "../../assets/images/discussion-forum-icon.svg";
import CancelIcon from "../../assets/images/cancel-icon.svg";
import { useHistory } from "react-router-dom";
import CancelSession from "./cancelSession";
import _ from "lodash";
import default_profile from "./../../assets/images/default_profile.png";

const useStyles = makeStyles((theme) => ({
  instructorInfoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    borderBottom: "1px solid #e7e7ea",
  },
  name: {
    color: "#1c1a1a",
    fontSize: "18px",
    fontWeight: 600,
  },
  designation: {
    color: "#6e6c6c",
    fontSize: "18px",
    fontWeight: 500,
  },
  instructorInteractionBtns: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  interactionBtn: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,

    "& span": {
      display: "block",
    },

    "& p": {
      color: "#52534f",
      fontSize: "16px",
      fontWeight: 500,
      textAlign: "center",
    },
  },
  instructorImage: {
    height: "68px",
    width: "68px",
    borderRadius: "5px",
  },
}));

function InstructorCard({
  conversationId,
  instructorId = "",
  name = "",
  designation = "",
  rating = 0,
  courseDetail,
  cadenceDetails,
  status,
  slotDetails,
  activeCadence,
  instructorImage = "",
}) {
  const classes = useStyles();
  const history = useHistory();
  console.log(status);
  // console.log(location.state.status)
  return (
    <Card>
      <Box className={classes.instructorInfoContainer}>
        {/*{instructorImage && (*/}
        <Box mb={1.5}>
          <img
            src={instructorImage || default_profile}
            alt="Instructor"
            className={classes.instructorImage}
          />
        </Box>

        <Link to={`/instructor/${instructorId}`} style={{ cursor: "pointer" }}>
          <Typography
            className={classes.name}
          >

            {name.length > 15 ? (
              `Instructed by ${name.substring(0, 15)}...`
            ) : (`Instructed by ${name}`)}
          </Typography>
        </Link>

        <Box display="flex" alignItems="center" mt={1.5}>
          {designation ? (
            <>
              <Typography className={classes.designation}>
                {designation}
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
            </>
          ) : null}
          <Star style={{ fontSize: 20, color: "#FFB833" }} /> &nbsp;
          <Typography>{rating === 0 ? " New" : rating}</Typography>
        </Box>
      </Box>
      {status != "Cancelled" ? (
        <Box className={classes.instructorInteractionBtns}>
          <Button
            onClick={() => {
              history.push(`/messages/${courseDetail.instructor_id}?type=user`);
            }}
            className={classes.interactionBtn}
          >
            <img src={MessageIcon} alt="Message" />
            <Typography>Message Instructor</Typography>
          </Button>
          {!_.isNull(conversationId) ? (
            <Button
              onClick={() => {
                history.push(`/messages/${conversationId}?type=group`);
              }}
              className={classes.interactionBtn}
            >
              <img src={DiscussionIcon} alt="Discussion" />
              <Typography>Discussion Forum</Typography>
            </Button>
          ) : (
              ""
            )}
          {status != ("Missed" || "Completed") ? (
            status != "Completed" ? (
            <CancelSession
              courseDetail={courseDetail}
              cadenceDetails={cadenceDetails}
              slotDetails={slotDetails}
            />
          ) : (
              <></>
            )) : (<></>)}
          {/* <Button className={classes.interactionBtn}>
          <img src={CancelIcon} alt="Cancel" />
          <Typography>Cancel Session</Typography>
        </Button> */}
        </Box>
      ) : (
          <Box></Box>
        )}
    </Card>
  );
}

export default InstructorCard;
