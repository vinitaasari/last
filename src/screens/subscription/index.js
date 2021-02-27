import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  SvgIcon,
  Button,
  InputBase,
  CircularProgress,
  FormHelperText,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import { ConfirmationNumber as ConfirmationNumberIcon } from "@material-ui/icons";
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

import AppWrapper from "../../components/app-wrapper";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import useCallbackStatus from "../../hooks/use-callback-status";
import { useSnackbar } from "notistack";

import { useStyles } from "./styles";
import { useAuth } from "../../contexts/auth-context";


function Subscription() {
  const [subscriptions, setData] = useState([]);
  const [coupon_code, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const { logout } = useAuth();


  const { user } = useUser();
  const history = useHistory();
  const notification = useSnackbar();

  const classes = useStyles();

  const getSubscriptionStatus = useCallbackStatus();
  const couponStatus = useCallbackStatus();


  const getSubscriptions = async () => {
    try {
      const res = await getSubscriptionStatus.run(
        apiClient("POST", "subscription", "fetchallsubscriptionplans", {
          body: {
            entity_type: "learner",
            user_id: window.localStorage.getItem('user_id'),
          },
          shouldUseDefaultToken: true,
          enableLogging: true,
        })
      );

      setData([...res.content.data]);
      console.log(res.content.data)
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      if (error.code === 401) {
        logout()
      }
      console.error(error);
    }
  };

  const subscribeByCoupon = async () => {
    try {
      const res = await couponStatus.run(
        apiClient("POST", "subscription", "createsubscriptionviavoucher", {
          body: {
            voucher_code: coupon_code,
            learner_id: user.id,
            is_logged_in: Boolean(window.localStorage.getItem('is_logged_in') === 1)
          },
          shouldUseDefaultToken: true,
          enableLogging: true,
        })
      );
      var userData = JSON.parse(window.localStorage.getItem("user_details"));
      userData.is_subscription_purchased = 1;
      window.localStorage.setItem("user_details", JSON.stringify(userData));
      console.log("voucherrrrrrrrrrrrrrrrrrr")
      console.log(res)
      if (res.content.data.learner) {
        window.localStorage.setItem('user_token', res.content.data.learner.secret)
      }
      // history.push("/home");
      window.location.href = "/home"
      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });

    } catch (error) {
      if (error.code === 401) {
        logout()
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleCoupon = () => {
    if (coupon_code) {
      subscribeByCoupon()
    }
    else {
      setCouponError("Please Enter Coupon!")
    }
  }




  useEffect(() => {
    if (user) {
      getSubscriptions();
    }
    // eslint-disable-next-line
  }, [user]);

  const handleBuySubscription = (planDetails) => {
    const plan = { ...planDetails, payment_type: "subscription" };
    console.log(plan);
    history.push("/confirm-pay", plan);
  };

  return (
    <AppWrapper>
      <Box className={classes.container}>
        <Container maxWidth="lg">
          <Grid container className={classes.root} spacing={4}>
            <Grid item xs={12}>
              <Typography
                component="h1"
                variant="h4"
                className={classes.pageTitle}
              >
                Buy subscription
              </Typography>
            </Grid>
            {getSubscriptionStatus.isPending && <CircularProgress />}
            {subscriptions.map((item) => (
              <Grid item xs={12} sm={12} md={4} key={item.id}>
                {/* {item.is_recommended ? (
                  <Box className={classes.recommendedBadge}>
                    <Typography classes={{ root: classes.recommendedBadgeText }}>
                      Recommended
          </Typography>
                  </Box>
                ) : null} */}

                <Box className={classes.subscriptionCard}>
                  <Typography
                    component="h5"
                    variant="h5"
                    className={classes.planTitle}
                  >
                    {item.nickname}
                  </Typography>
                  <Typography className={classes.planAmount}>
                    <span className={classes.currencySymbol}>₹</span>
                    {item.unit_amount}
                    <span>/user</span>

                  </Typography>
                  <Typography>{item.description}</Typography>

                  <div className={classes.list}>
                    <List component="nav" aria-label="main mailbox folders">
                      <ListItem button>
                        <ListItemIcon>
                          <CheckCircleRoundedIcon style={{ color: '#87CEFA' }} />
                        </ListItemIcon>
                        <ListItemText >
                          <Typography>
                            Attend {item.sessions_per_day} sessions/day
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <CheckCircleRoundedIcon style={{ color: '#87CEFA' }} />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography>
                            Enroll Unlimited Courses
                          </Typography>
                        </ListItemText>
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <CheckCircleRoundedIcon style={{ color: '#87CEFA' }} />
                        </ListItemIcon>
                        <ListItemText>
                          <Typography>
                            Validity till {item.recurring_interval_count} {item.recurring_interval}
                          </Typography>
                        </ListItemText>                      </ListItem>
                    </List>
                  </div>
                  <Button
                    type="button"
                    variant="outlined"
                    // className={`${classes.buyBtn} ${item.highlighted === 1 && classes.btnHighlight
                    //   }`}
                    className={item.highlighted ? classes.btnHighlight : classes.buyBtn}
                    onClick={() => handleBuySubscription(item)}
                  >
                    Buy
                  </Button>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                component="p"
                className={classes.separaterText}
              >
                - Or -
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.promoCodeContainer}>
              <Box component="form" className={classes.promoCodeBox}>
                <SvgIcon component={ConfirmationNumberIcon}></SvgIcon>
                <InputBase
                  className={classes.formInputField}
                  placeholder="Apply coupon code"
                  onChange={(event) => {
                    setCouponCode(event.target.value)
                    setCouponError("")
                  }}
                  value={coupon_code}
                />
                <Button onClick={handleCoupon} color="secondary">
                  {
                    couponStatus.isPending ? (
                      <CircularProgress style={{ color: 'red' }} size={15} ></CircularProgress>
                    ) : (
                        "Apply"
                      )
                  }
                </Button>

              </Box>
              <br></br>

              {/* <TextField
                type="text"
                variant="outlined"
                className={classes.formInputField}
                placeholder="Apply coupon code"
              /> */}
            </Grid>
            {
              couponError && (
                <FormHelperText error>
                  {couponError}
                </FormHelperText>
              )
            }
          </Grid>
        </Container>
      </Box>
    </AppWrapper>
  );
}

export default Subscription;
