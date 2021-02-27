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
import PinnedMessagesList from "./list-types/PinnedMessagesList";
import { gqlClient } from "../config/request-client";
import store from "../../../store";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

const LIST_CONVERSATION = gql(appSync.queries.ListConversation());

export default function SwipableDrawer(props) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [conversationList, setConversationList] = useState();
  const [listType, setListType] = useState("conversation");
  const [more, setMore] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(null);
  const [isListSubscribed,setIsListSubscribed]=useState(false);

  const { chatToken, userId, activeConversation } = useSelector((state) => {
    return {
      activeConversation: state.chatContainer.chatData.retrieveConversation,
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
    };
  });

  useEffect(() => {
    if (props.pinnedTabStatus) setListType("pinned");
    else setListType("conversation");
  }, [props.pinnedTabStatus]);

  useEffect(() => {
    let subscription = [];
    const SUBSCRIBE_TO_ADD_MESSAGE = gql(
      appSync.subscriptions.subscribeToAddMessage()
    );
   
    if (!_.isUndefined(conversationList) && isListSubscribed==false)
    {
    console.log('NEW MESSAGE conversationList: ',conversationList)
   
    conversationList.items.map((conversationHead, index) => {

      console.log(index+'Converastion is subscribe with id : ',conversationHead.id)
        subscription[index] = gqlClient
          .subscribe(SUBSCRIBE_TO_ADD_MESSAGE, {
            variables: { conversation_id: conversationHead.id },
          })
          .subscribe({
            next({ data: { subscribeToAddMessage } }) {
              console.log('NEW MESSAGE SUBSCRIPTION: ',subscribeToAddMessage)
              loadConversation(subscribeToAddMessage);
            },
            error(err) {
              console.error("ERROR IN CONVERSATION", err);
            },
          });
      });

      setIsListSubscribed(true)
    }
    
    // if (!_.isUndefined(subscription)) {
    //   return () => {
    //     subscription.map((subsribedConversation) => {
    //       subsribedConversation.unsubscribe();
    //     });
    //   };
    // }
  }, [conversationList]);

  const moreOptions = (event) => {
    setMore(event.currentTarget);
  };

  const loadConversationList = () => {
    switch (listType) {
      case "conversation":
        return (
          <ConversationList
            update={loadConversation}
            conversationList={conversationList}
          />
        );
      case "archived":
        return <ArchivedConversationList update={loadConversation} />;
      case "starred":
        return <StarredList search={search} />;
      case "pinned":
        return <PinnedMessagesList search={search} />;
    }
  };

  const txtListType = (type) => {
    switch (type) {
      case "archived":
        return "Archived Conversation";
      case "starred":
        return (
          <ChatTextField
            inputProps={{ value: search }}
            placeholder="Search"
            onChange={searchHandler}
            startAdornment={
              <BiSearchAlt2 style={{ height: "18px", margin: "0px 7px" }} />
            }
          />
        );
      case "pinned":
        return (
          <ChatTextField
            inputProps={{ value: search }}
            placeholder="Search"
            onChange={searchHandler}
            startAdornment={
              <BiSearchAlt2 style={{ height: "18px", margin: "0px 7px" }} />
            }
          />
        );
      default:
        return null;
    }
  };

  const loadConversation = () => {
    setLoading(true);

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

  const handleClose = () => {
    setMore(null);
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

  useEffect(() => {
    setOpen(props.status);
  }, [props.status]);

  const list = () => "asd";

  return (
    <div>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => {
          props.handleDrawerClose();
          setOpen(false);
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
              {!_.isUndefined(activeConversation.id) ? (
                <MenuItem
                  className={classes.menuRoot}
                  onClick={() => {
                    setListType("pinned");
                    setMore(false);
                  }}
                >
                  Pinned Messages
                </MenuItem>
              ) : (
                ""
              )}
            </Menu>
          </Toolbar>
        ) : (
          <Toolbar className={classes.gutter}>
            <IconButton
              size="small"
              onClick={() => setListType("conversation")}
            >
              <BiArrowBack onClick={loadConversation} />
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
    </div>
  );
}
