import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Truncate from "react-truncate";
import Pluralize from "react-pluralize";
import { useHistory } from "react-router-dom"
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 86,
    width: 86,
    borderRadius: "5px",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
  },
  courseName: {
    color: "#393A45",
    fontSize: "16px",
    fontWeight: 600,
  },
  courseDescription: {
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 500,
  },
  date: {
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
  },
  orderId: {
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
  },
  ctaContainer: {
    padding: "10px 16px",
    borderTop: "1px solid #E7E7EA",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingContainer: {
    padding: "10px 16px",
    borderBottom: "1px solid #E7E7EA",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaText: {
    color: "#F05E23",
    fontSize: "14px",
    fontWeight: 500,
  },
  slotsText: {
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
  },
  discountedPriceContainer: {
    display: "inline-block",
    backgroundColor: "#E2EAFA",
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  discountedPrice: {
    color: "#03579C",
    fontSize: "16px",
    fontWeight: 600,
  },
  statusText: {
    color: "#479b00",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "capitalize",
  },
}));

const OrderCard = ({ order }) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    transaction_time,
    course_type,
    slot_course_session,
    amount,
    status,
    transaction_id,
    id,
    learner_profile_url
  } = order;

  var image_url = "";
  var title = "";
  var purchasing_amount = "";
  var tag_line = "";
  console.log(order)
  if (course_type === "slot_course" && order && order.slot_course_session[0].slot_course && order.slot_course_session[0].slot_course) {
    image_url = order.slot_course_session[0].slot_course.image_url;
    title = order.slot_course_session[0].slot_course.title;
    purchasing_amount = order.slot_course_session[0].slot_course.purchasing_amount;
    tag_line = order.slot_course_session[0].slot_course.tag_line
  }
  else if (course_type === "structured_course" && order && order.structured_course_cadence && order.structured_course_cadence.structured_course) {
    image_url = order.structured_course_cadence.structured_course.image_url;
    title = order.structured_course_cadence.structured_course.title;
    purchasing_amount = order.structured_course_cadence.structured_course.purchasing_amount;
    tag_line = order.structured_course_cadence.structured_course.tag_line
  }

  const dateAndTime = transaction_time
    ? format(new Date(transaction_time * 1000), "MMM dd, yyyy hh:mm a")
    : "";
  const slotsBooked =
    course_type === "slot_course" ? slot_course_session.length : 0;

  return (
    <Card>
      <CardActionArea>
        <CardContent classes={{ root: classes.headingContainer }}>
          <Typography classes={{ root: classes.date }}>
            {dateAndTime}
          </Typography>
          {slotsBooked > 1 && (
            <Typography classes={{ root: classes.slotsText }}>
              <Pluralize singular={"Slot"} count={slotsBooked} />
            </Typography>
          )}
        </CardContent>
        <CardContent classes={{ root: classes.cardContent }}>
          <Box>
            <img
              src={image_url}
              alt="Course Image"
              className={classes.media}
            />
          </Box>
          <Box ml={2} width="100%">
            <Typography classes={{ root: classes.courseName }}>
              <Truncate lines={1} ellipsis={<span>...</span>}>
                {title}
              </Truncate>
            </Typography>
            <Typography classes={{ root: classes.courseDescription }}>
              <Truncate lines={1} ellipsis={<span>...</span>}>
                {tag_line}
              </Truncate>
            </Typography>
            <Box
              mt={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box className={classes.discountedPriceContainer}>
                <Typography
                  varaint="body2"
                  classes={{ root: classes.discountedPrice }}
                >
                { purchasing_amount ? (
                  <span>&#x20B9; {purchasing_amount || ""}</span>
                ) : ("Free")
                }
                </Typography>
              </Box>
              <Typography className={classes.statusText}>
                {status || ""}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <CardContent classes={{ root: classes.ctaContainer }}>
          <Typography classes={{ root: classes.orderId }}>
            {id || ""}
          </Typography>
          {console.log(slotsBooked)}
          {slotsBooked > 1 && (
            <Typography onClick={() => {
              history.push("/orders/view", {
                slots: slotsBooked,
                sessions: order.slot_course_session,
                transaction_time: transaction_time,
                transaction_id: transaction_id,
                id: id,
                status: status
              })
            }} className={classes.ctaText}>
              View All
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCard;
