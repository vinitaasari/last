import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Grid,
  Hidden,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageIcon from "@material-ui/icons/Image";
import AvatarEditIcon from "../../assets/images/avatar-edit-icon.svg";

import InstructorAbout from "./instructor-about";
import InstructorCourses from "./instructor-courses";
import InstructorReviews from "./instructor-reviews";

import { useSnackbar } from "notistack";

import AppWrapper from "../../components/app-wrapper";
import { useAuth } from "../../contexts/auth-context";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useUser } from "../../contexts/user-context";
import {
  Route,
  Redirect,
  useHistory,
  useRouteMatch,
  NavLink,
} from "react-router-dom";
import default_profile from "./../../assets/images/default_profile.png";
// import Loader from "../../components/loader";

const profileRoutes = {
  about: "about",
  courses: "courses",
  reviews: "reviews",
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  submit: {
    alignSelf: "center",
    backgroundColor: theme.palette.secondary.main,
    fontSize: "14px",
    fontWeight: 600,
    textTransform: "uppercase",
  },
  tools: {
    flexGrow: 1,
    alignSelf: "center",
    marginTop: "20px",
  },
  avatar: {
    display: "block",
    marginTop: theme.spacing(3),
    height: theme.spacing(12),
    width: theme.spacing(12),
  },
  avatarEditIcon: {
    cursor: "pointer",
    position: "absolute",
    right: -12,
    bottom: 0,
  },
  fullName: {
    color: "#52534F",
    fontSize: "20px",
    fontWeight: 600,
  },
  email: {
    color: "#848282",
    fontSize: "16px",
    fontWeight: 400,
  },
  tabContainer: {
    borderBottom: "1px solid rgba(95,95,95, 0.16)",
  },
  tab: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const match = useRouteMatch();
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState({});
  const [profile_url, setImage] = useState("");
  const [temp_url, setTemp] = useState("");
  const [open, setOpen] = React.useState(false);
  const [url, setProfile] = useState("");
  const { logout } = useAuth();
  const history = useHistory();

  const profileApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const instructorId = match.params.id;

  const getProfileData = useCallback(async (apiBody) => {
    try {
      const res = await profileApiStatus.run(
        apiClient("POST", "instructor", "getinstructorbyid", {
          body: { ...apiBody },
          shouldUseDefaultToken: true,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;
      setUser(data);
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (instructorId) {
      getProfileData({ instructor_id: instructorId });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AppWrapper>
      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Grid container alignItems="center">
          <Grid item>
            <Box display="inline-block" position="relative">
              {profileApiStatus.isPending ? (
                <CircularProgress size={20} />
              ) : (
                <Avatar
                  alt="Mi Life User"
                  src={user.profile_url || default_profile}
                  className={classes.avatar}
                />
              )}
            </Box>
          </Grid>
          <Grid>
            <Box ml={4}>
              <Typography variant="body1" classes={{ root: classes.fullName }}>
                {`${user.first_name || ""} ${user.last_name || ""}`}
              </Typography>
              <Typography variant="body2" classes={{ root: classes.email }}>
                {user.designation || ""}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} className={classes.tabContainer}>
          <Tabs
            value={history.location.pathname}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.about}`}
              label="About"
              value={`${match.url}/${profileRoutes.about}`}
            />
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.courses}`}
              label="Course"
              value={`${match.url}/${profileRoutes.courses}`}
            />
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.reviews}`}
              label="Reviews"
              value={`${match.url}/${profileRoutes.reviews}`}
            />
          </Tabs>
        </Box>

        <Box mt={4}>
          <Route exact path={`${match.url}`}>
            <Redirect to={`${match.url}/${profileRoutes.about}`} />
          </Route>
          <Route path={`${match.url}/${profileRoutes.about}`}>
            <InstructorAbout
              profile={user}
              isLoading={profileApiStatus.isPending}
            />
          </Route>
          <Route path={`${match.url}/${profileRoutes.courses}`}>
            <InstructorCourses instructorId={instructorId} />
          </Route>
          <Route path={`${match.url}/${profileRoutes.reviews}`}>
            <InstructorReviews
              instructorId={instructorId}
              instructorRating={user.instructor_rating}
              totalInstructorRating={user.total_instructor_rating}
            />
          </Route>
        </Box>
      </Container>
    </AppWrapper>
  );
};

export default Profile;
