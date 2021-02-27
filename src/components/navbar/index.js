import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import BrandLogo from "../../assets/images/brand-logo-navbar.svg";

import HomeFilledIcon from "../../assets/images/home-filled.svg";
import ExploreOutlinedIcon from "../../assets/images/explore-outlined.svg";
import LearningOutlinedIcon from "../../assets/images/learning-outlined.svg";
import MessageOutlinedIcon from "../../assets/images/message-outlined.svg";
import NotificationOutlinedIcon from "../../assets/images/notification-outlined.svg";
import HamburgerIcon from "../../assets/images/hamburger-icon.svg";
import UserFilledIcon from "../../assets/images/user-filled.svg";
import Searchbar from "../searchbar";

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: "#FFF",
  },
  brandLogo: {
    [theme.breakpoints.down("sm")]: {
      height: "64px",
      width: "64px",
    },
  },
  search: {
    marginLeft: theme.spacing(3),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "40%",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      marginLeft: "auto",
      alignItems: "center",
      alignSelf: "flex-end",
    },
  },
  sectionMobile: {
    display: "flex",
    marginLeft: "auto",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  iconContainer: {
    paddingBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
  selectedIcon: {
    borderBottom: `4px solid ${theme.palette.primary.main}`,
  },
  avatarContainer: {
    border: "1px solid #E7E7EA",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
    borderBottomRightRadius: "24px",
    borderBottomLeftRadius: "24px",
    display: "flex",
    alignItems: "center",
  },
  userAvatar: {
    height: "32px",
    width: "32px",
    padding: "2px",
    marginLeft: "8px",
    paddingRight: "4px",
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Login</MenuItem>
      <MenuItem onClick={handleMenuClose}>Register</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="Home" color="primary">
          <img src={HomeFilledIcon} />
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Explore" color="primary">
          <img src={ExploreOutlinedIcon} />
        </IconButton>
        <p>Explore</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Learn" color="primary">
          <img src={LearningOutlinedIcon} />
        </IconButton>
        <p>Learn</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="Message" color="primary">
          <img src={MessageOutlinedIcon} />
        </IconButton>
        <p>Message</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="primary"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed" className={classes.appbar}>
        <Container>
          <Toolbar style={{ padding: "0px" }}>
            <img src={BrandLogo} className={classes.brandLogo} />
            <div className={classes.search}>
              <Searchbar />
            </div>
            <div className={classes.sectionDesktop}>
              <div
                className={clsx(classes.iconContainer, classes.selectedIcon)}
              >
                <IconButton aria-label="Home" color="primary">
                  <img src={HomeFilledIcon} />
                </IconButton>
              </div>

              <div className={clsx(classes.iconContainer)}>
                <IconButton aria-label="Explore" color="primary">
                  <img src={ExploreOutlinedIcon} />
                </IconButton>
              </div>
              <div className={clsx(classes.iconContainer)}>
                <IconButton aria-label="Learn" color="primary">
                  <img src={LearningOutlinedIcon} />
                </IconButton>
              </div>
              <div className={clsx(classes.iconContainer)}>
                <IconButton aria-label="Message" color="primary">
                  <img src={MessageOutlinedIcon} />
                </IconButton>
              </div>
              <div className={clsx(classes.iconContainer)}>
                <div className={classes.avatarContainer}>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="primary"
                    style={{ padding: "10px" }}
                  >
                    <img src={HamburgerIcon} />
                  </IconButton>
                  <img src={UserFilledIcon} className={classes.userAvatar} />
                </div>
              </div>
              <div className={clsx(classes.iconContainer)}>
                <IconButton aria-label="Notifications" color="primary">
                  <img src={NotificationOutlinedIcon} />
                </IconButton>
              </div>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="primary"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
