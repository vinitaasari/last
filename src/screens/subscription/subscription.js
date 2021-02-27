import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Box,
  Container,
  Paper,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TickIcon from "../../assets/images/tick-icon.svg";
import CouponIcon from "../../assets/images/coupon-icon.svg";

import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import Loader from "../../components/loader";
import SEO from "../../components/seo";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  heading: {
    color: "#494B47",
    fontSize: "26px",
    fontWeight: 600,
    textAlign: "center",
  },
  pricingContainer: {
    marginTop: theme.spacing(2),
  },
  subscriptionCard: {
    position: "relative",
    border: "1px solid #D9DFE5",
    borderRadius: theme.spacing(1.5),
    height: "350px",
    display: "flex",
    flexDirection: "column",
  },
  recommendedBadge: {
    position: "absolute",
    top: -15,
    left: "38%",
    zIndex: 100,
    display: "inline-block",
    backgroundColor: "#fff",
    border: "0.3px solid #F05E23",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
  },
  recommendedBadgeText: {
    color: "#F05E23",
    fontSize: "12px",
    fontWeight: 600,
  },
  topSection: {
    borderBottom: "1px solid #E7E7EA",
    padding: theme.spacing(2, 1, 1, 1),
    textAlign: "center",
  },
  planDuration: {
    color: "#7C7C7C",
    fontSize: "18px",
    fontWeight: 500,
  },
  rupeeSymbol: {
    color: "#9B9B9B",
    fontSize: "18px",
    fontWeight: 500,
  },
  price: {
    color: "#334856",
    fontSize: "34px",
    fontWeight: 500,
  },
  perUserText: {
    color: "#747572",
    fontSize: "14px",
    fontWeight: 400,
  },
  featureList: {
    padding: "0px",
  },
  featureText: {
    color: "#747572",
    fontSize: "18px",
    fontWeight: 400,
  },
  buyButton: {
    fontSize: "16px",
    fontWeight: 600,
  },
  dividerContainer: {
    width: "60px",
    height: "2px",
    margin: "16px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#494B47",
  },
  dividerText: {
    color: "#494B47",
    fontSize: "18px",
    fontWeight: 600,
    paddingLeft: "8px",
    paddingRight: "8px",
    textTransform: "uppercase",
    backgroundColor: "#ffffff",
  },
  inputField: {
    marginTop: theme.spacing(2),
    maxWidth: "400px",
  },
  notchedOutline: {
    borderColor: `#D9DFE5 !important`,
  },
  icon: {
    color: "#C3C3C3",
  },
  verifyButton: {
    textTransform: "none",
    fontSize: "14px",
    padding: "0px",
  },
}));

const PricingCard = (props) => {
  const classes = useStyles();
  const { recommended, planDuration, buttonType } = props;

  return (
    <Paper variant="outlined" classes={{ root: classes.subscriptionCard }}>
      {recommended ? (
        <Box className={classes.recommendedBadge}>
          <Typography classes={{ root: classes.recommendedBadgeText }}>
            Recommended
          </Typography>
        </Box>
      ) : null}

      <Box className={classes.topSection}>
        <Typography classes={{ root: classes.planDuration }}>
          {planDuration}
        </Typography>
        <Box>
          <Typography classes={{ root: classes.price }}>
            <sup className={classes.rupeeSymbol}>&#x20B9; </sup>
            2,000<span className={classes.perUserText}>/user</span>
          </Typography>
        </Box>
      </Box>
      <Box
        p={2}
        display="flex"
        flex={2}
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <List dense={true} classes={{ root: classes.featureList }}>
          <ListItem>
            <ListItemIcon>
              <img src={TickIcon} alt="Tick icon" />
            </ListItemIcon>
            <ListItemText
              primary="Attend 3 sessions/day"
              classes={{ dense: classes.featureText }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <img src={TickIcon} alt="Tick icon" />
            </ListItemIcon>
            <ListItemText
              primary="Enrol unlimited courses"
              classes={{ dense: classes.featureText }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <img src={TickIcon} alt="Tick icon" />
            </ListItemIcon>
            <ListItemText
              primary="Validity till 1 year"
              classes={{ dense: classes.featureText }}
            />
          </ListItem>
        </List>
        <Button
          variant={buttonType || "outlined"}
          fullWidth
          color="secondary"
          classes={{ root: classes.buyButton }}
        >
          Buy
        </Button>
      </Box>
    </Paper>
  );
};

const Subscription = (props) => {
  const classes = useStyles();

  const { getUserId } = useAuth();
  const learner_id = getUserId();
  const [subscriptions, setSubscriptions] = useState([]);
  const subscriptionApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const getSubscriptionPlans = useCallback(async (apiBody) => {
    try {
      const res = await subscriptionApiStatus.run(
        apiClient("POST", "stripe_payment", "fetchallsubscriptionplans", {
          body: { ...apiBody },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;

      setSubscriptions(data);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      console.log("error", error);
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, []);

  useEffect(() => {
    getSubscriptionPlans({ entity_type: "learner", user_id: window.localStorage.getItem('user_id') });
  }, [getSubscriptionPlans]);

  if (subscriptionApiStatus.isPending) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg" classes={{ root: classes.container }}>
      <Typography classes={{ root: classes.heading }}>
        Buy subscription
      </Typography>

      <Grid
        item
        container
        spacing={4}
        justify="center"
        classes={{ root: classes.pricingContainer }}
      >
        {subscriptions.map((subscription) => {
          return (
            <Grid key={subscription.id} item xs={12} sm={4}>
              <PricingCard subscription={subscription} />
            </Grid>
          );
        })}
      </Grid>

      <Box mt={2} display="flex" flexDirection="column" alignItems="center">
        <div className={classes.dividerContainer}>
          <span className={classes.dividerText}>OR</span>
        </div>
        <TextField
          variant="outlined"
          margin="dense"
          fullWidth
          placeholder="Apply coupon code"
          classes={{ root: classes.inputField }}
          InputProps={{
            classes: { notchedOutline: classes.notchedOutline },
            startAdornment: (
              <InputAdornment position="start">
                <img
                  src={CouponIcon}
                  alt="Coupon Icon"
                  className={classes.icon}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="text"
                  color="secondary"
                  classes={{ root: classes.verifyButton }}
                >
                  Apply
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <SEO
        title="Midigiworld - Subscription"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />
    </Container>
  );
};

export default Subscription;
