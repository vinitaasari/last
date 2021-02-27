import React, { useEffect, useLocation } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import {
  Route,
  // Switch,
  NavLink,
  // useParams,
  // useHistory,
  useRouteMatch,
  Redirect,
} from "react-router-dom";
// import { useSnackbar } from "notistack";
// import * as dateFns from "date-fns";

// import ChooseDateDialog from "./choose-date-dialog";
import AppWrapper from "../../components/app-wrapper";
import Upcoming from "./Upcoming";
import MyCourses from "./MyCourses";
import MyFavourite from "./MyFavourite";

// import { apiClient } from "../../utils/api-client";
// import useCallbackStatus from "../../hooks/use-callback-status";
// import useCancelRequest from "../../hooks/useCancelRequest";
// import { useUser } from "../../contexts/user-context";

import { useStyles } from "./styles";
import { useUser } from "./../../contexts/user-context";
import SEO from "../../components/seo";

const myLearningRoutes = {
  upcoming: "upcoming",
  myCourses: "my-courses",
  myFavourite: "my-favourite",
};

function MyLearnings() {
  const match = useRouteMatch();
  const classes = useStyles();
  const [filter, setFilter] = React.useState("All");
  const { setFilters } = useUser();
  const { filters } = useUser();

  const { setNoti } = useUser();
  const handleChange = (event) => {
    setFilter(event.target.value);
    setFilters(event.target.value);
  };

  useEffect(() => {
    setNoti(Math.random());
    // eslint-disable-next-line
  }, []);

  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - My Learning"
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
              My Learning
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.mainPageDescription}
            >
              You’ll find all your sessions and courses here
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Box className={classes.navLinksContainer}>
                <NavLink
                  to={`${match.url}/${myLearningRoutes.upcoming}`}
                  className={classes.navLink}
                  activeClassName={classes.navLinkActive}
                  style={{ textDecoration: "none" }}
                >
                  Upcoming
                </NavLink>
                <NavLink
                  to={{
                    pathname: `${match.url}/${myLearningRoutes.myCourses}`,
                    state: {
                      name: filter,
                    },
                  }}
                  className={classes.navLink}
                  activeClassName={classes.navLinkActive}
                  style={{ textDecoration: "none" }}
                >
                  My Courses
                </NavLink>
                <NavLink
                  to={`${match.url}/${myLearningRoutes.myFavourite}`}
                  className={classes.navLink}
                  activeClassName={classes.navLinkActive}
                  style={{ textDecoration: "none" }}
                >
                  My Favourite
                </NavLink>
              </Box>
              {filters && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography
                    style={{
                      fontSize: "16px",
                      color: "#7e7e7e",
                      marginTop: "15px",
                    }}
                  >
                    Filter
                  </Typography>
                  <FormControl
                    variant="outlined"
                    size="small"
                    className={classes.formControl}
                  >
                    <Select value={filter} onChange={handleChange} size="sm">
                      {/* <MenuItem value="All">
                        <em>None</em>
                      </MenuItem> */}
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Upcoming">Upcoming</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Ongoing">Ongoing</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                      <MenuItem value="Missed">Missed</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>
          </Grid>
          <Grid
            container
            item
            xs={12}
            spacing={2}
            style={{ marginTop: "12px" }}
          >
            <Route exact path={`${match.path}`}>
              <Redirect to={`${match.path}/${myLearningRoutes.upcoming}`} />
            </Route>
            <Route path={`${match.path}/${myLearningRoutes.upcoming}`}>
              <Upcoming />
            </Route>
            <Route path={`${match.path}/${myLearningRoutes.myCourses}`}>
              <MyCourses />
            </Route>
            <Route path={`${match.path}/${myLearningRoutes.myFavourite}`}>
              <MyFavourite />
            </Route>
          </Grid>
        </Grid>
      </Container>
    </AppWrapper>
  );
}

export default MyLearnings;
