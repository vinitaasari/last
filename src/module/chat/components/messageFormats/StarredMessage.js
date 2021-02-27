import { Avatar, Box, ListItem, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import moment from "moment";
import { AiFillStar } from "react-icons/ai";
import { IconButton } from "@material-ui/core";
import { GiPin } from "react-icons/gi";
import ChatMedia from "../ChatMedia";
import _ from "lodash";
import ChatMessage from "../ChatMessage";

const useStyles = makeStyles(() => ({
  avatarRoot: {
    width: "25px",
    margin: "4px",
    height: "25px",
  },
  senderMessage: {
    backgroundColor: "#22589c",
    color: "white",
    padding: "5px",
    fontSize: "12px",
    margin: "0px 24px",
  },
  messageDetails: {
    textAlign: "right",
  },
  replay: {
    borderRadius: "5px",
    backgroundColor: "white",
    color: "black",
    padding: "2px",
    fontSize: "11px",
  },
  replayName: {
    fontWeight: 600,
  },
}));

function StarredMessage(props) {
  const classes = useStyles();
  const [message, setMessage] = useState({
    user: {},
    media: [{ type: null }],
  });
  const { chatToken, userId } = useSelector((state) => {
    return {
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
    };
  });

  useEffect(() => { 
    setMessage(props.message);
  });

  return (
    <ListItem disableGutters={true} button>
      <Grid container>
        <Grid item xs={12}>
          <Box
            alignItems="center"
            display="flex"
            style={{ fontSize: "13px", width: "100%" }}
          >
            <Box>
              <Avatar className={classes.avatarRoot} />
            </Box>
            <Box
              flexGrow={1}
              style={{
                fontSize: "14px",
                fontWeight: "500",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {message.user.id === userId
                ? "You"
                : message.user.first_name + " " + message.user.last_name}{" "}
              .{" "}
              {message.user.id !== userId
                ? "You"
                : message.user.first_name + " " + message.user.last_name}{" "}
            </Box>
            <Box style={{ paddingRight: "10px" }}>
              {!_.isNull(message)
                ? moment(message.created_date).format(
                    "h:mm a"
                  )
                : ""}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} style={{ paddingLeft: "32px" }}>
          <ChatMessage
            messageType="star"
            getmore={false}
            profileImgVisible={false}
            fromSender={userId === message.user.id}
            message={message}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
}

export default StarredMessage;
