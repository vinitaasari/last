import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Hidden,
  Menu,
  MenuItem,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import { NavLink, useHistory, Link } from "react-router-dom";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsNone as NotificationsNoneIcon,
} from "@material-ui/icons";
import * as _ from "lodash";
import { useSnackbar } from "notistack";

import SearchResultView from "./SearchResultView";
import ShowNotification from "./NotificationMenu";

import { useAuth } from "../../contexts/auth-context";
import { useUser } from "../../contexts/user-context";
import { apiClient } from "../../utils/api-client";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useStyles } from "./styles";
import Logo from "../../assets/images/header-logo.svg";
import HamburgerIcon from "../../assets/images/hamburger-icon.svg";
import default_profile from "./../../assets/images/default_profile.png";

import HomeActive from "./icons/home.svg";
import ExploreIcon from "./icons/explore.svg";
import ExploreActive from "../../assets/images/learning_active.png";
import MylearningIcon from "./icons/my-learnings.svg";
import LearningActive from "../../assets/images/explore_active.png";

import MessageOutlinedIcon from "../../assets/images/message-outlined.svg";
import HomeIcon from "../../assets/images/home_active.png";

import MessageActive from "../../assets/images/message_active.png";

import { drawerRoutes } from "../../constants/drawerRoutes";
import { drawerRoutess } from "../../constants/drawerRoutes2";
import { drawerRoutes3 } from "../../constants/drawerRoutes3";



function Header() {
  const [anchorElm, setAnchorElm] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState([]);
  const [isOptionsLoading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [profile, setProfile] = useState({});
  // const { user } = useUser();
  const { setProfileImage } = useUser();
  const { getUserId } = useAuth();
  const learner_id = getUserId();

  const history = useHistory();
  const { logout } = useAuth();
  const { profile_image } = useUser();
  const searchApiStatus = useCallbackStatus();
  const searchApiSource = useCancelRequest();
  const profileApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useUser();
  const { pathname } = useLocation();



  const getSearchResults = async (apiBody) => {
    try {
      const res = await searchApiStatus.run(
        apiClient("POST", "learner", "home/search", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: true,
          cancelToken: searchApiSource.token,
        })
      );

      const options = res.content.data.map((item) => item);

      setSearchOptions(options);
      setLoading(false);
      // * : Course, Category, Instructor, Skill
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      setLoading(false);
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const debouncedApiCall = useMemo(
    () => _.debounce(getSearchResults, 1000),

    // eslint-disable-next-line
    []
  );

  const handleSearch = useCallback((e) => {
    const val = e.target.value;
    setSearchVal(val);

    if (isOptionsLoading === false) {
      setLoading(true);
    }

    if (val.length >= 1) {
      debouncedApiCall({ search_string: val });
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line
  }, []);

  const handleMenuBtnClick = (e) => {
    setAnchorElm(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElm(null);
  };

  const redirectToRoute = (route) => {
    history.push(route);
  };

  const handleBlur = () => {
    if (searchVal.length >= 1) {
      return;
    } else {
      setOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        {user && user.authenticated && !user.is_mi_user && drawerRoutes.map((item) => (
          <ListItem key={item.name} component={Link} to={item.route} button>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        {user && user.authenticated && user.is_mi_user === 1 && user.is_subscription_purchased === 1 && drawerRoutes3.map((item) => (
          <ListItem key={item.name} component={Link} to={item.route} button>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}

        {user && user.authenticated && user.is_mi_user && !user.is_subscription_purchased && (
          <ListItem button onClick={() => {
            window.localStorage.clear();
            window.location.href("/login");
          }
          }>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
        {user && user.authenticated && !user.is_mi_user && (
          <ListItem button onClick={() => {
            logout();
          }
          }>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
        {user && user.authenticated && user.is_mi_user && user.is_subscription_purchased && (
          <ListItem button onClick={() => {
            logout();
          }
          }>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
        {!user || !user.authenticated && drawerRoutess.map((item) => (
          <ListItem key={item.name} component={Link} to={item.route} button>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        {!user || !user.authenticated && (
          <>
            <ListItem button component={Link} to="/login"
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register?currentStep=email">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}

        <ListItem button >
          <ShowNotification star={true} />
        </ListItem>


      </List>
    </div>
  );

  const getProfileData = useCallback(async (apiBody) => {
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

      setProfile(data);
      setProfileImage(data.profile_url);
      // setUserName(data.first_name);
    } catch (error) {
      if (error && error.code === 401) {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (user && learner_id) {
      getProfileData({ id: learner_id });
    }
    console.log(user);
  }, [user]);

  return (
    <Container maxWidth="lg" className={classes.rootContainer}>
      <Box className={classes.headerContentContainer}>
        <Box>
          <Hidden smUp implementation="css">
            <IconButton
              edge="end"
              aria-label="side drawer"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="primary"
              style={{ marginRight: "8px" }}
            >
              <img src={HamburgerIcon} />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={drawerOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </Box>
        <Box className={classes.logoContainer}>
          <img
            src={Logo}
            alt="Midigiorld"
            onClick={() => history.push("/home")}
          />
        </Box>
        <Box className={classes.inputContainer}>
          <TextField
            variant="outlined"
            margin="normal"
            type="text"
            name="searchInput"
            value={searchVal}
            onChange={handleSearch}
            onBlur={handleBlur}
            onFocus={() => setOpen(true)}
            placeholder="Search course, categories"
            className={classes.formInputField}
            // disabled={user && user.authenticated === false}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    style={{ color: "#c3c3c3" }}
                    className={classes.inputFieldIcon}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {Boolean(searchVal) && (
                    <Button
                      style={{
                        textTransform: "none",
                        color: "#393a45",
                        fontSize: "14px",
                      }}
                      size="small"
                      // disabled={user && user.authenticated === false}
                      onClick={() => {
                        setSearchVal("");
                        setSearchOptions([]);
                        setOpen(false);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <SearchResultView
            isOpen={isOpen}
            isLoading={isOptionsLoading}
            options={searchOptions}
            callback={() => setOpen(false)}
          />
        </Box>
        <Box className={classes.linksContainer}>
          <List className={classes.list}>
            <ListItem
              button
              activeClassName={classes.active}
              className={classes.notActive}
              component={NavLink}
              to="/home"
            >
              <img
                src={pathname == "/home" ? HomeActive : HomeIcon}
                alt="home"
              />
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Home"
              />
            </ListItem>
            <ListItem
              button
              activeClassName={classes.active}
              className={classes.notActive}
              component={NavLink}
              to="/explore"
            >
              <img
                src={pathname != "/explore" ? ExploreIcon : ExploreActive}
                alt="explore"
              />
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Explore"
              />
            </ListItem>
            <ListItem
              button
              activeClassName={classes.active}
              className={classes.notActive}
              component={NavLink}
              to="/my-learning"
            >
              <img
                src={
                  pathname === "/my-learning/upcoming" || pathname === "/my-learning/my-courses" || pathname === "/my-learning/my-favourite"
                    ? LearningActive
                    : MylearningIcon
                }
                alt="learning"
              />
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="My Learning"
              />
            </ListItem>
            <ListItem
              button
              activeClassName={classes.active}
              className={classes.notActive}
              component={NavLink}
              to="/messages"
            >
              <img
                src={
                  pathname != "/messages" ? MessageOutlinedIcon : MessageActive
                }
                alt="chat"
              />
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Message"
              />
            </ListItem>
          </List>

          <Button
            type="button"
            className={classes.profileBtn}
            onClick={handleMenuBtnClick}
            disableRipple
          >
            <MenuIcon color="primary" />
            {profile_image && (
              <img
                src={profile_image}
                alt="profile"
                style={{
                  height: "25px",
                  width: "25px",
                  borderRadius: 16,
                  padding: "2px",
                  marginLeft: "8px",
                  paddingRight: "4px",
                }}
              />
            )}
            {!profile_image && (
              <img
                src={default_profile}
                alt="profile"
                style={{
                  height: "25px",
                  width: "25px",
                  borderRadius: 16,
                  padding: "2px",
                  marginLeft: "8px",
                  paddingRight: "4px",
                }}
              />
            )}{" "}
          </Button>
          {user && user.authenticated ? (
            <Menu
              id="user-actions-menu"
              anchorEl={anchorElm}
              keepMounted
              open={Boolean(anchorElm)}
              onClose={handleMenuClose}
              classes={{ list: classes.profileMenu }}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {
                !JSON.parse(window.localStorage.getItem("user_details")).is_mi_user || (JSON.parse(window.localStorage.getItem("user_details")).is_mi_user && JSON.parse(window.localStorage.getItem("user_details")).is_subscription_purchased) ? (
                  <>
                    <MenuItem
                      className={classes.profileMenuItem}
                      onClick={() => {
                        redirectToRoute("/profile");
                      }}
                    >
                      {" "}
                My Profile
              </MenuItem>
                    <MenuItem
                      className={classes.profileMenuItem}
                      onClick={() => {
                        redirectToRoute("/profile/change-password");
                      }}
                    >
                      {" "}
                Change Password
              </MenuItem>
                    <MenuItem
                      className={classes.profileMenuItem}
                      onClick={() => {
                        redirectToRoute("/profile/edit-interests");
                      }}
                    >
                      {" "}
                Edit Interests
              </MenuItem>
                    <MenuItem
                      className={classes.profileMenuItem}
                      onClick={() => {
                        redirectToRoute("/profile/course-language-preference");
                      }}
                    >
                      {" "}
                Language Preferences
              </MenuItem>
                    <div className={classes.profileMenuItemBorder}></div>
                    {user !== null && user.is_mi_user === 0 && (
                      <MenuItem
                        className={classes.profileMenuItem}
                        onClick={() => redirectToRoute("/order-history")}
                      >
                        Order History
                      </MenuItem>
                    )}
                    {user !== null && user.is_mi_user === 1 && (
                      <MenuItem
                        className={classes.profileMenuItem}
                        onClick={() => redirectToRoute("/my-subscriptions")}
                      >
                        Subscription History
                      </MenuItem>
                    )}

                    <MenuItem className={classes.profileMenuItem}
                      onClick={() => redirectToRoute("/profile/card-details")}
                    >
                      Card Details
              </MenuItem>
                    <div className={classes.profileMenuItemBorder}></div>

                    <MenuItem className={classes.profileMenuItem}
                      onClick={() => redirectToRoute("/faq")}
                    >FAQs</MenuItem>

                    <MenuItem className={classes.profileMenuItem} onClick={() => redirectToRoute("/report-an-issue")}>
                      Report an Issue
              </MenuItem>

                  </>
                ) : null
              }
              <MenuItem className={classes.profileMenuItem} onClick={() => {
                if (user.is_mi_user && !user.is_subscription_purchased) {
                  alert("here")
                  window.localStorage.clear();
                  window.location.href = "/login"
                }
                else {
                  logout();
                }
              }}>
                Logout
              </MenuItem>
            </Menu>
          ) : (
              <Menu
                id="user-actions-menu"
                anchorEl={anchorElm}
                keepMounted
                open={Boolean(anchorElm)}
                onClose={handleMenuClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuItem
                  className={classes.profileMenuItem}
                  onClick={() => redirectToRoute("/login")}
                >
                  Login
              </MenuItem>
                <MenuItem
                  className={classes.profileMenuItem}
                  onClick={() => redirectToRoute("/register")}
                >
                  Register
              </MenuItem>
              </Menu>
            )}

          <ShowNotification />
        </Box>
      </Box>
    </Container>
  );
}

export default Header;
