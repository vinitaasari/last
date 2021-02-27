import React, { useEffect } from "react";
import { Container, Grid, Box, Typography } from "@material-ui/core";
import { Route, NavLink, useRouteMatch, Redirect } from "react-router-dom";
import AppWrapper from "../../components/app-wrapper";
import { useStyles } from "./styles";
import { useUser } from "../../contexts/user-context"
import AllOrders from "./AllOrders";
import PaidOrders from "./PaidOrders";
import RefundOrders from "./RefundOrders";
import FailedOrders from "./FailedOrders";

const orderHistoryRoutes = {
  all: "all",
  paid: "paid",
  refund: "refund",
  failed: "failed",
};

function OrderHistory() {
  const match = useRouteMatch();
  const classes = useStyles();
  const { setNoti } = useUser();
  useEffect(() => {
    setNoti(Math.random())
    // eslint-disable-next-line
  }, []);
  return (
    <AppWrapper>
      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              component="h1"
              className={classes.mainPageTitle}
            >
              Orders
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.mainPageDescription}
            >
              You’ll find all your orders and refund history
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.navLinksContainer}>
              <NavLink
                to={`${match.url}/${orderHistoryRoutes.all}`}
                className={classes.navLink}
                activeClassName={classes.navLinkActive}
              >
                All
              </NavLink>
              <NavLink
                to={`${match.url}/${orderHistoryRoutes.paid}`}
                className={classes.navLink}
                activeClassName={classes.navLinkActive}
              >
                Paid
              </NavLink>
              <NavLink
                to={`${match.url}/${orderHistoryRoutes.refund}`}
                className={classes.navLink}
                activeClassName={classes.navLinkActive}
              >
                Refund
              </NavLink>
              <NavLink
                to={`${match.url}/${orderHistoryRoutes.failed}`}
                className={classes.navLink}
                activeClassName={classes.navLinkActive}
              >
                Failed
              </NavLink>
            </Box>
          </Grid>
          <Grid
            container
            item
            xs={12}
            spacing={2}
            style={{ marginTop: "12px" }}
          >
            <Route exact path={`${match.path}`}>
              <Redirect to={`${match.path}/${orderHistoryRoutes.all}`} />
            </Route>
            <Route path={`${match.path}/${orderHistoryRoutes.all}`}>
              <AllOrders />
            </Route>
            <Route path={`${match.path}/${orderHistoryRoutes.paid}`}>
              <PaidOrders />
            </Route>
            <Route path={`${match.path}/${orderHistoryRoutes.refund}`}>
              <RefundOrders />
            </Route>
            <Route path={`${match.path}/${orderHistoryRoutes.failed}`}>
              <FailedOrders />
            </Route>
          </Grid>
        </Grid>
      </Container>
    </AppWrapper>
  );
}

export default OrderHistory;
