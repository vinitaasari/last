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
import Deletes from "./deletes";
import { makeStyles } from "@material-ui/core/styles";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageIcon from "@material-ui/icons/Image";
import AvatarEditIcon from "../../assets/images/avatar-edit-icon.svg";
import EditProfile from "./edit-profile";
import EditInterest from "./edit-interest";
import ChangePassword from "./change-password";
import CourseLanguagePreference from "./course-language-preference";
import NotificationSettings from "./notification-settings";
import CardDetails from "../confirm-pay/all-cards-listing";

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
  useLocation,
} from "react-router-dom";
import default_profile from "./../../assets/images/default_profile.png";
import SEO from "../../components/seo";
// import Loader from "../../components/loader";

const profileRoutes = {
  editProfile: "edit-profile",
  editInterests: "edit-interests",
  changePassword: "change-password",
  courseLanguagePreference: "course-language-preference",
  notificationSettings: "notification-settings",
  cardDetails: "card-details",
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

  const { getUserId } = useAuth();
  const learner_id = getUserId();
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState({});
  const [profile_url, setImage] = useState("");
  const [temp_url, setTemp] = useState("");
  const [open, setOpen] = React.useState(false);
  const [url, setProfile] = useState("");
  const { logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const profileApiStatus = useCallbackStatus();
  const imageApiStatus = useCallbackStatus();

  const s3SignedURLApiStatus = useCallbackStatus();
  const uploadFileApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { setProfileImage } = useUser();
  const { setNoti } = useUser();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // setTemp(profile_url);
    // setProfile("")             src={url || temp_url || default_profile}
    console.log(user)
    setProfile(user.profile_url);
    setTemp(user.profile_url);
    setImage(user.profile_url);
  };
  const handleDelete = () => {
    // setOpen(false);
    setProfile("");
    setTemp("");
  };
  const handleDone = () => {
    if (url) {
      updateLearnerProfile({ profile_url: url });
    } else {
      updateLearnerProfile({ profile_url: "" });
      setProfile("");
      setImage("");
      setTemp("");
    }
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getLearnerProfile = useCallback(async (apiBody) => {
    try {
      const res = await profileApiStatus.run(
        apiClient("POST", "learner", "getlearnerbyid", {
          body: { ...apiBody },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;
      console.log("getLearner");
      console.log(data);
      setUser(data);
      setProfileImage(data.profile_url);
      setTemp(data.profile_url);
      setImage(data.profile_url);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }

    // eslint-disable-next-line
  }, []);

  const updateLearnerProfile = useCallback(async (apiBody) => {
    try {
      const res = await imageApiStatus.run(
        apiClient("POST", "learner", "updatelearnerprofile", {
          body: { ...apiBody, learner_id },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
          enableLogging: true,
        })
      );

      const {
        content: { data },
      } = res;

      setUser(data);
      console.log(data);
      setProfileImage(data.profile_url);
      setTemp(data.profile_url);
      setImage(data.profile_url);
      // history.push(location.pathname)
      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 2000,
      });
      window.location.href = location.pathname

    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
    // eslint-disable-next-line
  }, []);

  // get object using presigned url
  // eslint-disable-next-line
  const getObject = async (url) => {
    try {
      const res = await axios.get(url);
      // need to convert the data into readable format so we can pass it to image source
      console.log(res);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  // get the object url by key
  // eslint-disable-next-line
  const getObjectURL = async () => {
    try {
      const res = await apiClient("POST", "common", "getsignedgetobjecturl", {
        body: {
          file_key:
            "learner/profilePictures/5fbcc044-f0d7-484e-adb0-ad7dd82871d0.jpg",
        },
      });

      getObject(res.content.data.s3signedGetUrl);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  useEffect(() => {
    setNoti(Math.random());
    getLearnerProfile({ id: learner_id });
    // eslint-disable-next-line
  }, []);

  // if (profileApiStatus.isPending) {
  //   return <Loader />;
  // }

  const uploadFile = async (url, fileObj) => {
    try {
      const formData = new FormData();
      formData.append("file", fileObj);
      const res = await axios.put(url, fileObj);
      console.log(res);
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const getS3SignedURL = async (apiBody, fileObj) => {
    try {
      const res = await s3SignedURLApiStatus.run(
        apiClient("POST", "common", "getsignedputobjecturl", {
          body: { ...apiBody },
          enableLogging: true,
        })
      );

      if (res.content.data) {
        const url = res.content.data.s3signedPutUrl;
        const ress = await axios.put(url, fileObj);
        // uploadFile(url, fileObj);
        var mainUrl = url.split("?", 1);
        // setImage(mainUrl[0])
        setProfile(mainUrl[0]);
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleFileUpload = async (fileObj) => {
    const fileExtString = fileObj.name.split(".");
    const fileExt = fileExtString.pop();
    const fileType = fileObj.type;
    const key = `learner/profilePictures/${Math.floor(
      new Date().getTime() / 1000
    )}.${fileExt}`;
    getS3SignedURL({ file_key: key, file_type: fileType }, fileObj);
  };

  return (
    <AppWrapper>
      <SEO
        title="Midigiworld - Profile"
        description="Explore and enrol to hundreds of online interactive live courses"
        keywords="Midigiworld, Learning, Courses, Interactive, Online"
      />

      <Container maxWidth="lg" classes={{ root: classes.container }}>
        <Grid container alignItems="center">
          <Grid item>
            <Box display="inline-block" position="relative">
              {profileApiStatus.isPending ? (
                <CircularProgress size={20} />
              ) : (
                  <>
                    {!profile_url && (
                      <Avatar
                        alt="Mi Life User"
                        src={default_profile}
                        className={classes.avatar}
                      />
                    )}
                    {profile_url && (
                      <Avatar
                        alt="Mi Life User"
                        src={profile_url}
                        className={classes.avatar}
                      />
                    )}
                    <img
                      onClick={handleClickOpen}
                      src={AvatarEditIcon}
                      className={classes.avatarEditIcon}
                      alt="Edit icon"
                    />
                  </>
                )}
            </Box>
          </Grid>
          <Grid>
            <Box ml={4}>
              <Typography variant="body1" classes={{ root: classes.fullName }}>
                {`${user.first_name || ""} ${user.last_name || ""}`}
              </Typography>
              <Typography variant="body2" classes={{ root: classes.email }}>
                {user.email}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} className={classes.tabContainer}>
          <Tabs
            value={history.location.pathname}
            // onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.editProfile}`}
              label="Edit Profile"
              value={`${match.url}/${profileRoutes.editProfile}`}
            />
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.editInterests}`}
              label="Edit Interest"
              value={`${match.url}/${profileRoutes.editInterests}`}
            />
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.changePassword}`}
              label="Change Password"
              value={`${match.url}/${profileRoutes.changePassword}`}
            />
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.courseLanguagePreference}`}
              label="Course Language Preference"
              value={`${match.url}/${profileRoutes.courseLanguagePreference}`}
            />
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.notificationSettings}`}
              label="Notification Settings"
              value={`${match.url}/${profileRoutes.notificationSettings}`}
            />
            <Tab
              component={NavLink}
              style={{ textDecoration: "none" }}
              to={`${match.url}/${profileRoutes.cardDetails}`}
              label="Card Details"
              value={`${match.url}/${profileRoutes.cardDetails}`}
            />
          </Tabs>
        </Box>

        <Box mt={2}>
          <Route exact path={`${match.path}`}>
            <Redirect to={`${match.path}/${profileRoutes.editProfile}`} />
          </Route>
          <Route path={`${match.path}/${profileRoutes.editProfile}`}>
            <EditProfile
              updateLearnerProfile={updateLearnerProfile}
              imageApiStatus={imageApiStatus}
              user={{
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone_number: user.phone_number || "",
                age: user.age || "",
                gender: user.gender || "",
                email: user.email || "",
                country: user.country || "",
                state: user.state || "",
                city: user.city || "",
                isPhoneNumberVerified: user.is_phone_number_verified,
              }}
            />
          </Route>
          <Route path={`${match.path}/${profileRoutes.editInterests}`}>
            <EditInterest
              updateLearnerProfile={updateLearnerProfile}
              currentInterests={user.userInterest || user.interests || []}
              imageApiStatus={imageApiStatus}
            />
          </Route>
          <Route path={`${match.path}/${profileRoutes.changePassword}`}>
            <ChangePassword />
          </Route>
          <Route
            path={`${match.path}/${profileRoutes.courseLanguagePreference}`}
          >
            <CourseLanguagePreference
              updateLearnerProfile={updateLearnerProfile}
              currentLanguagePreferences={user.userLanguage || []}
              imageApiStatus={imageApiStatus}
            />
          </Route>
          <Route path={`${match.path}/${profileRoutes.notificationSettings}`}>
            <NotificationSettings
              updateLearnerProfile={updateLearnerProfile}
              preferences={{
                is_preference_email: Boolean(user.is_preference_email),
                is_preference_push_notification: Boolean(
                  user.is_preference_push_notification
                ),
                is_preference_sms: Boolean(user.is_preference_sms),
              }}
              imageApiStatus={imageApiStatus}
            />
          </Route>
          <Route path={`${match.path}/${profileRoutes.cardDetails}`}>
            <CardDetails />
          </Route>
        </Box>
      </Container>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle
          id="max-width-dialog-title"
          style={{ alignSelf: "center" }}
        >
          <Typography variant="body1">
            <strong>Profile Picture</strong>
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent style={{ alignSelf: "center" }}>
          {/* <Box display="inline-block" position="relative" > */}
          <Avatar
            alt="Mi Life User"
            src={url || temp_url || default_profile}
            className={classes.avatar}
          />
        </DialogContent>
        <div className={classes.tools}>
          <Grid container spacing={1}>
            <Grid item xs>
              {url || temp_url ? (
                <Deletes handleDelete={handleDelete} />
              ) : (
                  <DeleteIcon style={{ color: "#03579c" }} />
                )}
            </Grid>
            <Grid item xs>
              <div className={classes.line}></div>
            </Grid>
            <Grid item xs>
              {/* <CameraAltIcon style={{ color: "blue" }} /> */}
            </Grid>
            <Grid item xs>
              <div className={classes.line}></div>
            </Grid>
            <Grid item xs>
              <label htmlFor="avatar-input">
                <ImageIcon style={{ color: "#03579c" }} />

                <Hidden
                  implementation="css"
                  only={["xs", "sm", "md", "lg", "xl"]}
                >
                  <input
                    name="avatar-input"
                    type="file"
                    accept="image/jpg,image/png,image/jpeg"
                    id="avatar-input"
                    onChange={(e) => {
                      handleFileUpload(e.target.files[0]);
                    }}
                  />
                </Hidden>
              </label>
            </Grid>
          </Grid>
        </div>
        <DialogActions>
          <Button
            type="submit"
            variant="outlined"
            disableElevation
            size="small"
            onClick={handleClose}
          >
            <div style={{ color: "grey" }}>CANCEL</div>
          </Button>
          <Button
            type="submit"
            variant="contained"
            style={{ background: "#F05E23", color: "white" }}
            onClick={handleDone}
            size="small"
            disableElevation
          >
            {imageApiStatus.isPending ? (
              <CircularProgress size={18} className={classes.loader} />
            ) : (
                "DONE"
              )}
          </Button>
        </DialogActions>
      </Dialog>
    </AppWrapper>
  );
};

export default Profile;
