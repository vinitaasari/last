import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  rootContainer: {
    height: "100%",
  },
  headerContentContainer: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    position: "relative",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginRight: theme.spacing(4),

    "& > img": {
      cursor: "pointer",
    },
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  formInputField: {
    width: "450px",

    "&.MuiFormControl-root": {
      margin: 0,
    },

    "& .MuiInputBase-root": {
      fontSize: "16px",
    },

    "& .MuiOutlinedInput-input": {
      padding: theme.spacing(1.2),
    },
  },
  inputFieldIcon: {
    width: "20px",
    height: "20px",
  },
  linksContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  iconBtnWithLabel: {
    marginRight: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "50px",
    justifyContent: "center",

    "& .MuiIconButton-label": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },

    "& .MuiIconButton-label > span:last-of-type": {
      display: "none",
      color: "#2C516C",
      fontSize: "12px",
      fontWeight: 600,
    },
  },
  navLinkActive: {
    borderBottom: `3px solid ${theme.palette.primary.main}`,
  },
  profileBtn: {
    marginRight: theme.spacing(2),
    border: `1px solid ${theme.palette.custom.border}`,
    borderRadius: "30px",

    "&.MuiButton-text": {
      padding: "4px",
    },

    "& img": {
      marginLeft: theme.spacing(1),
      padding: "8px 8px",
      borderRadius: "50%",
      backgroundColor: "#E7E8EA",
    },
  },
  notificationsListWrapper: {
    zIndex: 10000000,
  },
  notificationsList: {
    width: "400px",
    maxHeight: "350px",
    overflowY: "scroll",
    padding: theme.spacing(1.5),
  },
  notificationsListItem: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #e6e6e6",
    borderRadius: "9px",
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  notificationsListItemMedia: {
    height: 53,
    width: 53,
    borderRadius: "9px",
  },
  notificationsListItemText: {
    color: "#2c2c2c",
    fontSize: "13px",
    fontWeight: 400,
  },
  notificationsListItemTime: {
    color: "#8d8d8d",
    fontSize: "10px",
    fontWeight: 400,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: 240,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 240,
  },
  listItemText: {
    color: "#2c516c",
    fontSize: "13px",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  list: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  active: {
    "& $primary": {
      color: theme.palette.primary.main,
    },
    "& $listItemText": {
      color: theme.palette.primary.main,
      textTransform: "uppercase",
      fontWeight: 600,
    },
    "& $icon": {
      color: theme.palette.primary.main,
    },
    "& $icon2": {
      color: theme.palette.primary.main,
    },
    width: "110px",
    paddingLeft: "0px",
    paddingRight: "0px",
    borderBottom: `3px solid ${theme.palette.primary.main}`,
  },
  notActive: {
    width: "110px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "12px",
    paddingBottom: "5px",
    paddingLeft: "0px",
    paddingRight: "0px",
  },
  profileMenu: {
    padding: theme.spacing(1.5),
  },
  profileMenuItem: {
    color: "#23242c",
    fontSize: "14px",
    fontWeight: 500,
    // paddingLeft: theme.spacing(0.5),
  },
  profileMenuItemBorder: {
    borderBottom: "1px solid #e5e2e2",
    margin: theme.spacing(0.8, 0),
  },
}));
