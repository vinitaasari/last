import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChatDrawer from "./ChatDrawer";
import { Box, Button, makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { CgNotes } from "react-icons/cg";
import { ChatTextField } from "./Theme/MuiComponents";
import clsx from "clsx";
import ChatMessage from "./ChatMessage";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(1),
      // necessary for content to be below app bar
      // ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
  
    toolbarRoot: {
      backgroundColor: "white",
      color: "black",
    },
    avatarRoot: {
      float: "left",
    },
    conversationDetail: {
      paddingLeft: "10px",
      fontSize: "15px",
      display: "flex",
      flexDirection: "column",
    },
  
    showDetailsRoot: {
      border: "2px solid #e0e0e0",
      fontSize: "11px",
      color: "#888997",
      borderRadius: "30px",
      padding: "5px 13px",
      textTransform: "none",
    },
  
    appBarBottom: {
      top: "auto",
      bottom: 0,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShiftBottom: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }));
  

function ChatDispatcher(props) {
  const classes = useStyles();
  
  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: "white" }}
      className={clsx(classes.appBarBottom, {
        [classes.appBarShiftBottom]: props.open,
      })}
    >
      <Toolbar>
        <ChatTextField
          placeholder="Type Something"
          inputProps={{ style: { paddingLeft: 10 } }}
        />
        <Button
          variant="contained"
          style={{
            backgroundColor: "#e65d29",
            padding: "3px",
            marginLeft: "10px",
            color: "white",
          }}
        >
          SEND
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default ChatDispatcher;
