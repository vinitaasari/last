import {
  Avatar,
  Badge,
  Box,
  ListItem,
  ListItemSecondaryAction,
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { compose, graphql } from "react-apollo";
import { replayMessageDisable, replayMessageObject, retrieveConversation } from "../chatContainer/actions";
import store from "../../../store";
import { appSync } from "../GraphQL/schema";
import client from "../config/client";
import { useSelector } from "react-redux";
import { FiChevronDown } from "react-icons/fi";
import { GiPin } from "react-icons/gi";
import videoIcon from "../icons/noun_Video_966159.svg";
import audioIcon from "../icons/Group 19580.svg";
import imageIcon from "../icons/noun_Video_966159.svg";
import documentIcon from "../icons/noun_Document_1773653 (1).svg";

import {
  Button,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { gqlClient } from "../config/request-client";
import _ from "lodash";
import moment from "moment";
import pinConversationIcon from "../icons/Pin_Conversation18028.svg";
import { useChatContext } from "../contexts/chat-context";
import { decryptMesg } from "../config/encrypter-decrypter";

const RETRIEVE_CONVERSATION = gql(appSync.queries.retrieveConversation());

const useStyles = makeStyles(() => ({
  badgeCounter: {
    fontSize: "10px",
    borderRadius: "50%",
    backgroundColor: "#03579c",
    color: "white",
  },
  badge: {
    backgroundColor: "#52534f",
    color: "white",
    borderRadius: "50%",
    height: "80%",
    width: "80%",
    fontSize: "10px",
    border: "2px solid white",
  },
  lastMessage: {
    width: "129px",
    color: "#484945",
    fontSize: "12px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  avatar: {
    margin: "12px",
  },
  archived: {
    border: "1px solid gray",
    padding: "2px",
    fontSize: "10px",
    lineHeight: "1.1",
    borderRadius: "5px",
  },
  listItem: {
    "&:hover $listItemSecondaryAction": {
      visibility: "visible",
    },
  },
  listItemSecondaryAction: {
    top: "53px",
    visibility: "hidden",
  },
}));

const styles = {
  conversationHead: {
    fontWeight: 500,
    lineHeight: 1.33,
    color: "#52534f",
    width: "128px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

function ChatHead(props) {
  const classes = useStyles();
  const chatCtx = useChatContext();
  const { chatToken, userId, activeConversation, replayObject } = useSelector((state) => {
    return {
      activeConversation: state.chatContainer.chatData.retrieveConversation,
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
      replayObject: state.chatContainer.replayMessageObject,
    };
  });

  const [conversationData, setConversationData] = useState();

  useEffect(() => {
    setConversationData(props.data);
  }, [props.data]);

  const loadConversation = (conversation_id, type) => {
    chatCtx.loading(true);
    // console.log("replayMessageObjectreplayMessageObject: ",_.isUndefined(replayObject.message_id))
    // if(_.isUndefined(replayObject.message_id))
    //   store.dispatch(replayMessageObject({
    //     message_id: null,
    //     replayStatus: false,
    //   }))

    gqlClient
      .query(RETRIEVE_CONVERSATION, {
        token: chatToken,
        conversation_id: conversation_id,
        type: type,
        user_id: userId,
      })
      .then((data) => {
        if (!_.isNull(data.data.listMessages.items)) {
          setConversationData({
            ...conversationData, 
            unread: null,
          });

          chatCtx.activeConversationId = conversation_id

          data.data.listMessages.items.sort((a, b) => {
            return b.created_date - a.created_date;
          });
          store.dispatch(retrieveConversation(data.data));
          props.updateConversation(conversation_id);
          chatCtx.loading(false);
        } else {
          store.dispatch(
            retrieveConversation({
              ...data.data,
              listMessages: { items: [], next_token: null },
            })
          );
          chatCtx.loading(false);
        }
      });
  };

  const [more, setMore] = React.useState(null);

  const moreOptions = (event) => {
    setMore(event.currentTarget);
  };

  const handleClose = () => {
    setMore(null);
  };

  const pinConversation = (conversation_id, status) => {
    handleClose();
    const PIN_CONVERSATION = gql(appSync.mutations.pinConversation());
    gqlClient
      .mutate(PIN_CONVERSATION, {
        token: chatToken,
        conversation_id: conversation_id,
        user_id: userId,
        action: !status,
      })
      .then(({ data: { pinConversation } }) => {
        if (pinConversation)
          setConversationData({
            ...conversationData,
            is_pinned: !conversationData.is_pinned,
          });

        props.updateConversation();
      });
  };

  const archiveConversation = (conversation_id) => {
    handleClose();
    const ARCHIVE_CONVERSATION = gql(appSync.mutations.archiveConversation());
    gqlClient
      .mutate(ARCHIVE_CONVERSATION, {
        token: chatToken,
        conversation_id: conversation_id,
        user_id: userId,
      })
      .then(({ data: { archiveConversation } }) => {
        if (archiveConversation) props.archiveHandler(conversation_id);
      });
  };

  useEffect(() => {
    switch (props.type) {
      case "AllConversations":
        setMenuText({
          archive: "Archive",
          pin: "pin",
        });
        break;
      case "ArchiveConversations":
        setMenuText({
          archive: "Unarchive",
          pin: "pin",
        });
        break;
    }
  }, [props.type]);

  const unArchiveConversation = (conversation_id) => {
    handleClose();
    const UNARCHIVE_CONVERSATION = gql(
      appSync.mutations.unarchiveConversation()
    );
    gqlClient
      .mutate(UNARCHIVE_CONVERSATION, {
        token: chatToken,
        conversation_id: conversation_id,
        user_id: userId,
      })
      .then(({ data: { unarchiveConversation } }) => {
        if (unarchiveConversation) props.unarchiveHandler(conversation_id);
      });
  };

  const [menuText, setMenuText] = useState({
    archive: "Archive",
    pin: "Pin",
  });

  const renderLastMessageChatHead=(messages)=>{   
    if(!_.isNull(messages)){
        if(messages[0].is_deleted){
          return "this message was deleted"
        }else
        {
          if(_.isNull(messages[0].media)){
            return decryptMesg(messages[0].content)
          }else
          {
            return renderLastMessage(messages)
          }
        }
    }else
    {
        return ""
    }
    // {!_.isNull(conversationData.messages)
    //   ? _.isNull(conversationData.messages[0].media)
    //     ? conversationData.messages[0].content
    //     : renderLastMessage(conversationData.messages)
    //   : ""}
  }

  const renderLastMessage = (messsage) => {
    switch (messsage[0].media[0].type) {
      case "audio":
        return (
          <>
            {/* <img src={audioIcon} style={{ height: "8px" }} />{" "} */}
            {messsage[0].media[0].type}
          </>
        );
      case "video":
        return (
          <>
            <img src={videoIcon} style={{ height: "8px" }} />{" "}
            {messsage[0].media[0].type}
          </>
        );

      case "image":
        return (
          <>
            {/* <img src={imageIcon} style={{ height: "8px" }} />{" "} */}
            {messsage[0].media[0].type}
          </>
        );

      default:
        return (
          <>
            {/* <img src={documentIcon} style={{ height: "8px" }} />{" "} */}
            {messsage[0].media[0].type}
          </>
        );
    }
  };

  const dayStatus = (created_date) => {
    // let daytag=localStorage.getItem('dayTag')

    let output = moment(created_date).calendar(null, {
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      nextWeek: "DD/MM/YYYY",
      lastDay: "[Yesterday]",
      lastWeek: "DD/MM/YYYY",
      sameElse: "DD/MM/YYYY",
    });

    return output;
  };

  if (_.isUndefined(conversationData)) {
    return "Loading...";
  }

  const renderAvatar = () => {
    return (
      <>
        {conversationData.type == "group" &&
          props.type !== "ArchiveConversations" ? (
            <Badge
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              classes={{
                badge: classes.badge,
              }}
              // color="secondary"
              badgeContent={conversationData.total_member}
            >
              <Avatar src={conversationData.profile_url}></Avatar>
            </Badge>
          ) : (
            <Avatar src={conversationData.profile_url}></Avatar>
          )}
      </>
    );
  };

  return (
    <ListItem
      selected={activeConversation.id === conversationData.id}
      disableGutters={true}
      style={{ height: "85px" }}
      button
      className={classes.listItem}
      onClick={() => loadConversation(props.data.id, props.data.type)}
    >
      <Box
        display="flex"
        alignItems="center"
        flexDirection="row"
        style={{ width: "100%", height: "100%" }}
      >
        <Box className={classes.avatar}>{renderAvatar()}</Box>
        <Box flexGrow={1} style={{ paddingLeft: "16px" }}>
          <Box style={styles.conversationHead}>{conversationData.name}</Box>
          <Box className={classes.lastMessage}>
            {renderLastMessageChatHead(conversationData.messages)}
            {console.log('conversationData.messagesconversationData.messagesconversationData.messages:',conversationData.messages)}
          </Box>
        </Box>
        <Box style={{
          color: "#8d8c8c",
          // paddingRight: "20px",
          textAlign: "center",
          fontSize: "11px",
        }}>
          <Box flexGrow={1}>
            {!_.isNull(conversationData.messages)
              ? dayStatus(conversationData.messages[0].created_date)
              : ""}
          </Box>
          <Box flexGrow={1} style={{ paddingTop: "5px" }}>
            {menuText.archive !== "Archive" ? (
              <>
                <Badge className={classes.archived}>Archived</Badge>
              </>
            ) : (
                ""
              )}
            <Badge
              style={{ color: "#21579c" }}
              // color="#21579c"
              classes={{
                badge: classes.badgeCounter,
              }}
              badgeContent={conversationData.unread}
            ></Badge>
          </Box>
        </Box>
        {/* <Box
          style={{
            color: "#8d8c8c",
            paddingRight: "20px",
            textAlign: "center",
            fontSize: "11px",
          }}
        >
          <Box component="div" style={{ padding: "5px 0px" }}>
            {!_.isNull(conversationData.messages)
              ? dayStatus(conversationData.messages[0].created_date)
              : ""}
          </Box>

          {menuText.archive !== "Archive" ? (
            <>
              <Badge className={classes.archived}>Archived</Badge>
            </>
          ) : (
            ""
          )}

          {menuText.archive === "Archive" ? (
            <Box display="flex">
              {conversationData.is_pinned ? (
                <Box item>
                  {" "}
                  <img
                    src={pinConversationIcon}
                    style={{ marginRight: "13px" }}
                  />{" "}
                </Box>
              ) : (
                ""
              )}

              <Box item>
                {" "}
                <Badge
                  style={{color:"#21579c"}}
                  // color="#21579c"
                  classes={{
                    badge: classes.badgeCounter,
                  }}
                  badgeContent={conversationData.unread}
                ></Badge>
              </Box>
            </Box>
          ) : (
            ""
          )}
        </Box> */}
      </Box>
      <ListItemSecondaryAction>
        <IconButton style={{ marginTop: "20px" }} onClick={moreOptions} size="small" edge="end" aria-label="comments">
          <FiChevronDown />
        </IconButton>

        <Menu
          id="simple-menu"
          anchorEl={more}
          keepMounted
          open={Boolean(more)}
          onClose={handleClose}
        >
          {menuText.archive === "Archive" ? (
            <MenuItem onClick={() => archiveConversation(props.data.id)}>
              {menuText.archive}
            </MenuItem>
          ) : (
              <MenuItem onClick={() => unArchiveConversation(props.data.id)}>
                {menuText.archive}
              </MenuItem>
            )}
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ChatHead;
