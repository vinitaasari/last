import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Button,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { Star } from "@material-ui/icons";
import * as dateFns from "date-fns";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";

import AppWrapper from "../../components/app-wrapper";
import { PaymentProvider, usePayment } from "./payment-context";
import CardSetup from "./card-setup";
import { confirmPayStyles as useStyles } from "./styles";
import SEO from "../../components/seo";
import Truncate from "react-truncate";
import { format } from "date-fns";

function ConfirmAndPay() {
  // eslint-disable-next-line
  const [paymentDetails, setDetails] = useState(null);

  const history = useHistory();
  const { status, setStatus, handlePurchaseClick, constants } = usePayment();
  const classes = useStyles();

  useEffect(() => {
    const {
      location: { state },
    } = history;
    if (state !== undefined && paymentDetails === null) {
      var s = JSON.stringify(state)
      window.localStorage.setItem('paymentDetails', s)
      setDetails({ ...state });
      setStatus({
        type: null,
        loading: false,
        msg: "",
      });
    }
    else {
      var details = JSON.parse(window.localStorage.getItem("paymentDetails"));
      if (details) {
        setDetails({ ...details })
        setStatus({
          type: null,
          loading: false,
          msg: "",
        });
      }
      else {
        if (state === undefined) {
          setStatus({
            type: constants.error,
            loading: false,
            msg: "Could not find payment details",
          });
        }
      }
    }


  }, []);

  // useEffect(() => {
  //   const {
  //     location: { state },
  //   } = history;

  //   if (state !== undefined && paymentDetails === null) {
  //     setDetails({ ...state });
  //     setStatus({
  //       type: null,
  //       loading: false,
  //       msg: "",
  //     });
  //   }

  //   if (state === undefined) {
  //     setStatus({
  //       type: constants.error,
  //       loading: false,
  //       msg: "Could not find payment details",
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, []);

  if (
    status.type === constants.initial_loading &&
    status.loading &&
    paymentDetails === null
  ) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress size={20} />
        <Typography className={classes.loadingMsg}>{status.msg}</Typography>
      </Box>
    );
  }

  if (!status.loading && paymentDetails === null) {
    return (
      <Box className={classes.errorContainer}>
        <Typography className={classes.errMsg}>{status.msg}</Typography>
        <Button
          type="button"
          className={classes.goBackBtn}
          onClick={() => history.replace("/subscription")}
        >
          Go Back to Subscriptions
        </Button>
      </Box>
    );
  }

  console.log("paymentDetails", paymentDetails);

  return (
    <Box className={classes.container}>
      <SEO
        title="Midigiworld - Payment"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg">
        <Typography component="h1" variant="h4" className={classes.pageTitle}>
          {paymentDetails.payment_type === "order"
            ? "Course Details"
            : "Subscription Details"}
        </Typography>
        <Box>
          <Grid container className={classes.root}>
            {paymentDetails.payment_type === "order" ? (
              <OrderInfo paymentDetails={paymentDetails} />
            ) : (
                <SubscriptionInfo paymentDetails={paymentDetails} />
              )}
            <Grid item xs={12} sm={4} className={classes.finalAmountContainer}>
              <Box
                w={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                className={classes.actualAmountContainer}
              >
                <Typography className={classes.finalAmount}>
                  {
                    paymentDetails.unit_amount === 0 ? (
                      <>
                        Free
                    </>
                    ) : (
                        <>
                          <span className={classes.currencySymbol}>₹</span>
                          {paymentDetails.unit_amount}
                        </>
                      )
                  }
                </Typography>
                <Typography className={classes.actualAmount}>
                  Rs {paymentDetails.actual_amount}
                </Typography>
              </Box>

              <Typography className={classes.totalAmount}>
                <span>Total(INR)</span>{" "}
                {
                  paymentDetails.unit_amount === 0 ? (
                    <>
                      Free
                    </>
                  ) : (
                      <>
                        <span>&#x20B9; {paymentDetails.unit_amount}</span>

                      </>
                    )
                }
              </Typography>
              <Button
                color="secondary"
                variant="contained"
                className={classes.payNowBtn}
                onClick={(e) => handlePurchaseClick(e, { ...paymentDetails })}
                disabled={status.loading}
              >
                {status.loading && status.type !== constants.initial_loading ? (
                  <CircularProgress size={20} />
                ) : (
                    <>
                      {
                        paymentDetails.unit_amount === 0 ? (
                          <>
                            Enroll Now
                        </>
                        ) : (
                            <>
                              Pay Now
                        </>
                          )
                      }
                    </>
                  )}
              </Button>
            </Grid>
            {
              paymentDetails.unit_amount != 0 ? (
                <Grid item xs={12} sm={7} className={classes.cardSetupContainer}>
                  <CardSetup />
                </Grid>
              ) : null
            }
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function WithPayment() {
  return (
    <PaymentProvider>
      <AppWrapper>
        <ConfirmAndPay />
      </AppWrapper>
    </PaymentProvider>
  );
}

function OrderInfo({ paymentDetails }) {
  const classes = useStyles();

  const getSlotCourseDates = (courses) => {
    const firstSlot =
      courses.length > 0 ? courses[0]["slot_course_session"] : "";

    if (firstSlot) {
      const startDate = firstSlot.session_start_time
        ? format(new Date(firstSlot.session_start_time * 1000), "dd MMM")
        : "";
      const sessionStartTime = firstSlot.session_start_time
        ? format(new Date(firstSlot.session_start_time * 1000), "HH:mm a")
        : "";
      const sessionEndTime = firstSlot.session_end_time
        ? format(new Date(firstSlot.session_end_time * 1000), "HH:mm a")
        : "";

      return `${startDate} ${sessionStartTime} - ${sessionEndTime}`;
    }

    return "";
  };

  const getStructuredCourseDates = (courses) => {
    const firstSlot =
      courses.length > 0 ? courses[0]["structured_course_cadence"] : "";

    if (firstSlot) {
      const startDate = firstSlot.cadence_start_time
        ? format(new Date(firstSlot.cadence_start_time * 1000), "dd MMM yyyy")
        : "";
      const endDate = firstSlot.cadence_end_time
        ? format(new Date(firstSlot.cadence_end_time * 1000), "dd MMM yyyy")
        : "";

      return `${startDate} - ${endDate}`;
    }

    return "";
  };

  return (
    <Grid item container xs={12} sm={7} className={classes.courseInfoCard}>
      <Grid item xs={8} className={classes.courseDetailsContainer}>
        {paymentDetails.image && (
          <div>
            <img
              src={paymentDetails.image}
              className={classes.courseThumbnail}
              alt="Course Thumbnail"
            />
          </div>
        )}

        <div>
          <Typography className={classes.planTitle}>
            {/* <Truncate lines={1} ellipsis={<span>...</span>}> */}
            {
              paymentDetails.nickname.length > 30 ? (
                <>
                  {paymentDetails.nickname}...
                 </>
              ) : (
                  <>
                    {paymentDetails.nickname}
                  </>
                )
            }
            {/* </Truncate> */}
          </Typography>
          <Typography>
            <Truncate lines={1} ellipsis={<span>...</span>}>
              {paymentDetails.description}
            </Truncate>
          </Typography>
          <Box mt={2.5} display="flex" alignItems="center">
            <Star style={{ fontSize: 16, color: "#FFB833" }} />
            <Typography
              varaint="caption"
              classes={{ root: classes.ratingText }}
            >
              {paymentDetails.rating <= 0 ? "New" : `${paymentDetails.rating}`}
            </Typography>
          </Box>
        </div>
      </Grid>
      <Grid item xs={4} className={classes.courseAmountContainer}>
        <Box className={classes.mainPriceContainer}>
          <Typography className={classes.mainPrice}>

            {
              paymentDetails.unit_amount === 0 ? (
                <>
                  Free
                    </>
              ) : (
                  <>
                    <span className={classes.currencySymbol}>₹</span>
                    {paymentDetails.unit_amount}
                  </>
                )
            }
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {paymentDetails.course_type === "slot_course" && (
          <Typography className={classes.courseMsg}>
            {getSlotCourseDates(paymentDetails.course_content)}
          </Typography>
        )}

        {paymentDetails.course_type === "structured_course" && (
          <Typography className={classes.courseMsg}>
            {getStructuredCourseDates(paymentDetails.course_content)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

function SubscriptionInfo({ paymentDetails }) {
  const classes = useStyles();
  return (
    <Grid item container xs={12} sm={7} className={classes.courseInfoCard}>
      <Grid item xs={8} className={classes.courseDetailsContainer}>
        <Typography className={classes.planTitle}>
          {paymentDetails.nickname}
        </Typography>
        <div className={classes.list}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem button>
              <ListItemIcon>
                <CheckCircleRoundedIcon style={{ color: "#87CEFA" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  Attend {paymentDetails.sessions_per_day} sessions/day
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CheckCircleRoundedIcon style={{ color: "#87CEFA" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography>Enroll Unlimited Courses</Typography>
              </ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CheckCircleRoundedIcon style={{ color: "#87CEFA" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  Validity till {paymentDetails.recurring_interval_count}{" "}
                  {paymentDetails.recurring_interval}
                </Typography>
              </ListItemText>{" "}
            </ListItem>
          </List>
        </div>
      </Grid>
      <Grid item xs={4} className={classes.courseAmountContainer}>
        <Box className={classes.mainPriceContainer}>
          <Typography className={classes.mainPrice}>

            {
              paymentDetails.unit_amount === 0 ? (
                <>
                  Free
                    </>
              ) : (
                  <>
                    <span className={classes.currencySymbol}>₹</span>
                    {paymentDetails.unit_amount}

                  </>
                )
            }
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography component="p" variant="body1" className={classes.courseMsg}>
          {(() => {
            let d = Date.now();
            d = dateFns.add(d, { years: 1 });

            return (
              <Typography style={{ fontWeight: "14px", fontWeight: 600 }}>
                Expires on {dateFns.format(d, "PPP p")}
              </Typography>
            );
          })()}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default WithPayment;
