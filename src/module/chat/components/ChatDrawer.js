import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { ChatTextField } from "./Theme/MuiComponents";
import { BiSearchAlt2, BiArrowBack } from "react-icons/bi";
import gql from "graphql-tag";
import { useSelector } from "react-redux";
import { compose, graphql } from "react-apollo";
import { appSync } from "../GraphQL/schema";
import _ from "lodash";
import clsx from "clsx";
import {
  AppBar,
  Box,
  IconButton,
  ListItem,
  Menu,
  MenuItem,
} from "@material-ui/core";
import ConversationList from "./list-types/ConversationList";
import ArchivedConversationList from "./list-types/ArchivedConversationList";
import { FiMoreVertical } from "react-icons/fi";
import StarredList from "./list-types/StarredList";
import { gqlClient } from "../config/request-client";
import store from "../../../store";
import { useChatContext } from "../contexts/chat-context";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  gutter: {
    padding: "10px",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflow: "hidden",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },

  // font-weight: 500;
  // text-overflow: ellipsis;
  // color: rgb(82, 83, 79);
  // white-space: nowrap;
  // width: 131px;
  // overflow: hidden;
}));

const LIST_CONVERSATION = gql(appSync.queries.ListConversation());

function ChatDrawer(props) {
  const classes = useStyles();
  const [conversationList, setConversationList] = useState();
  const [listType, setListType] = useState("conversation");
  const [more, setMore] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(null);

  const { chatToken, userId } = useSelector((state) => {
    return {
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
    };
  });

  useEffect(() => {
    let subscription;
    const SUBSCRIBE_TO_ADD_MESSAGE = gql(
      appSync.subscriptions.subscribeToAddMessage()
    );

    if (!_.isUndefined(conversationList))
      conversationList.items.map((conversationHead) => {
        console.log("Conversation Subscriber: ", conversationHead.id);
        subscription = gqlClient
          .subscribe(SUBSCRIBE_TO_ADD_MESSAGE, {
            variables: { conversation_id: conversationHead.id },
          })
          .subscribe({
            next({ data: { subscribeToAddMessage } }) {
              loadConversation()
            },
            error(err) {
              console.error("ERROR IN CONVERSATION", err);
            },
          });
      });
  }, [conversationList]);

  const handleClose = () => {
    setMore(null);
  };

  useEffect(() => {
    console.log("Chat Drawer Component");
  });

  const moreOptions = (event) => {
    setMore(event.currentTarget);
  };

  const loadConversationList = () => {
    switch (listType) {
      case "conversation":
        return <ConversationList update={loadConversation} conversationList={conversationList} />;
      case "archived":
        return <ArchivedConversationList update={loadConversation}/>;
      case "starred":
        return <StarredList />;
    }
  }; 

  const txtListType = (type) => {
    switch (type) {
      case "archived":
        return "Archived Conversation";
      case "starred":
        return "Starred Messages";
      default:
        return null;
    }
  };

  const loadConversation = () => {
    setLoading(true)
    
    gqlClient
      .query(LIST_CONVERSATION, {
        token: chatToken,
        userId: userId,
        search_text: search,
      })
      .then(({ data: { listConversations }, loading }) => {
        setConversationList(listConversations);
        setLoading(false);
      })
      .catch((er) => {
        setLoading(false);
      });
  };

  const searchHandler = (event) => {
    if (event.target.value == "") {
      setSearch(null);
    } else setSearch(event.target.value);
    console.log("searchHandler: ", event.target.value);
  };

  useEffect(() => {
    if (!_.isUndefined(chatToken)) {
      loadConversation();
    }
  }, [search]);

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={props.status}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      {listType == "conversation" ? (
        <Toolbar className={classes.gutter}>
          <ChatTextField
            inputProps={{ value: search }}
            placeholder="Search"
            onChange={searchHandler}
            startAdornment={
              <BiSearchAlt2 style={{ height: "18px", margin: "0px 7px" }} />
            }
          />
          <IconButton size="small" onClick={moreOptions}>
            <FiMoreVertical />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={more}
            keepMounted
            open={Boolean(more)}
            onClose={handleClose}
          >
            {/* <MenuItem
              className={classes.menuRoot}
              onClick={() => {setListType("conversation"); setMore(false)}}
            >
              View Conversations
            </MenuItem> */}
            <MenuItem
              className={classes.menuRoot}
              onClick={() => {
                setListType("archived");
                setMore(false);
              }}
            >
              View Archives
            </MenuItem>
            <MenuItem
              className={classes.menuRoot}
              onClick={() => {
                setListType("starred");
                setMore(false);
              }}
            >
              Starred Messages
            </MenuItem>
          </Menu>
        </Toolbar>
      ) : (
        <Toolbar className={classes.gutter}>
          <IconButton size="small" onClick={() => setListType("conversation")}>
            <BiArrowBack onClick={loadConversation}/>
          </IconButton>
          <Box
            style={{
              fontSize: "18px",
              marginLeft: "10px",
              color: "rgb(82, 83, 79)",
              fontWeight: 500,
            }}
          >
            {txtListType(listType)}
          </Box>
        </Toolbar>
      )}
      <Divider />
      {loading ? "loading..." : loadConversationList()}
    </Drawer>
  );
}

export default React.memo(ChatDrawer);
