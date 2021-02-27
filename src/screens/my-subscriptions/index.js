import React, { useEffect } from "react";
import { Container, Grid, Box, Typography } from "@material-ui/core";
import { Route, NavLink, useRouteMatch, Redirect } from "react-router-dom";
import AppWrapper from "../../components/app-wrapper";
import { useStyles } from "./styles";
import { useUser } from "../../contexts/user-context";
import ActiveSubscriptions from "./ActiveSubscriptions";
import ExpiredSubscriptions from "./ExpiredSubscriptions";
import SEO from "../../components/seo";

const mySubscriptionRoutes = {
  active: "active",
  expired: "expired",
};

function MySubscriptions() {
  const match = useRouteMatch();
  const classes = useStyles();
  const { setNoti } = useUser();
  useEffect(() => {
    setNoti(Math.random());
    // eslint-disable-next-line
  }, []);
  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - My Subscription"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              component="h1"
              className={classes.mainPageTitle}
            >
              Subscription
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.mainPageDescription}
            >
              You’ll find all your subscription details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box className={classes.navLinksContainer}>
              <NavLink
                to={`${match.url}/${mySubscriptionRoutes.active}`}
                className={classes.navLink}
                activeClassName={classes.navLinkActive}
              >
                Active
              </NavLink>
              <NavLink
                to={`${match.url}/${mySubscriptionRoutes.expired}`}
                className={classes.navLink}
                activeClassName={classes.navLinkActive}
              >
                Expired
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
              <Redirect to={`${match.path}/${mySubscriptionRoutes.active}`} />
            </Route>
            <Route path={`${match.path}/${mySubscriptionRoutes.active}`}>
              <ActiveSubscriptions />
            </Route>
            <Route path={`${match.path}/${mySubscriptionRoutes.expired}`}>
              <ExpiredSubscriptions />
            </Route>
          </Grid>
        </Grid>
      </Container>
    </AppWrapper>
  );
}

export default MySubscriptions;
