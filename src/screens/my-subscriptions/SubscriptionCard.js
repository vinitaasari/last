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
import moment from "moment"

import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 86,
    width: 86,
    borderRadius: "5px",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
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
  expiryDate: {
    color: "#393A45",
    fontSize: "14px",
    fontWeight: 400,
    fontStyle: "italic",
  },
  ctaContainer: {
    padding: "10px 16px",
    borderTop: "1px solid #E7E7EA",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    textAlign: "right",
  },
  cardType: {
    color: "#393a45",
    fontSize: "12px",
    fontWeight: 400,
    fontStyle: "italic",
  },
}));

const SubscriptionCard = ({ subs }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardActionArea>
        <CardContent classes={{ root: classes.headingContainer }}>
          <Typography classes={{ root: classes.date }}>
            Date - {moment(new Date((subs.current_period_start) * 1000)).format('MMM DD, YYYY hh:mm A')}
          </Typography>
          <Typography classes={{ root: classes.slotsText }}>
            ID-{subs.subscription_id}
          </Typography>
        </CardContent>
        <CardContent classes={{ root: classes.cardContent }}>
          <Box>
            <Typography classes={{ root: classes.courseName }}>
              <Truncate lines={1} ellipsis={<span>...</span>}>
                {subs.plan_name}
              </Truncate>
            </Typography>
            <Typography classes={{ root: classes.courseDescription }}>
              <Truncate lines={1} ellipsis={<span>...</span>}>
                {subs.description}
              </Truncate>
            </Typography>
          </Box>

          <Box className={classes.discountedPriceContainer}>
            <Typography
              varaint="body2"
              classes={{ root: classes.discountedPrice }}
            >
              <span>&#x20B9; {subs.amount || ""}</span>
            </Typography>
          </Box>
        </CardContent>
        <CardContent classes={{ root: classes.ctaContainer }}>
          <Typography classes={{ root: classes.expiryDate }}>
            Expires on {moment(new Date((subs.current_period_end) * 1000)).format('MMM DD, YYYY hh:mm A')}
          </Typography>
          <Box>
            <Typography className={classes.statusText}>Paid</Typography>
            <Typography className={classes.cardType}>
              {subs.payment_method_details &&
                JSON.parse(subs.payment_method_details) &&
                JSON.parse(subs.payment_method_details).card &&
                JSON.parse(subs.payment_method_details).card.funding
                ? `Via ${JSON.parse(subs.payment_method_details)
                  .card.funding.charAt(0)
                  .toUpperCase() +
                JSON.parse(
                  subs.payment_method_details
                ).card.funding.slice(1)
                } Card`
                : "Via Card"}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SubscriptionCard;
