import React, { useContext, useEffect, useState } from "react";
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
import _, { isNull } from "lodash";
import clsx from "clsx";
import {
  AppBar,
  Box,
  CircularProgress,
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
import PinnedMessagesList from "./list-types/PinnedMessagesList";
import { useChatContext } from "../contexts/chat-context";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  gutter: {
    padding: "0px 10px",
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

function ChatDrawerXl(props) {
  const classes = useStyles();
  const [conversationList, setConversationList] = useState();
  const [listType, setListType] = useState("conversation");
  const [more, setMore] = React.useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(null);
  const chatCtx = useChatContext()
  const [isListSubscribed, setIsListSubscribed] = useState(false);

  const { chatToken, userId, activeConversation } = useSelector((state) => {
    return {
      activeConversation: state.chatContainer.chatData.retrieveConversation,
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
      // isListSubscribed:state.chatContainer.conversationListSubsc.id,
    };
  });

  useEffect(() => {
    let subscription = [];
    const SUBSCRIBE_TO_ADD_MESSAGE = gql(
      appSync.subscriptions.subscribeToAddMessage()
    );

    if (!_.isUndefined(conversationList) && isListSubscribed == false) {
      // console.log('NEW MESSAGE conversationList: ', conversationList)

      conversationList.items.map((conversationHead, index) => {
          if(index==20){
            // console.log(index + 'Converastion is subscribe with id : ', conversationHead.id)
            subscription[index] = gqlClient
            .subscribe(SUBSCRIBE_TO_ADD_MESSAGE, {
              variables: { conversation_id: conversationHead.id },
            })
            .subscribe({
              next({ data: { subscribeToAddMessage } }) {
                // console.log('NEW MESSAGE SUBSCRIPTION: ', subscribeToAddMessage)
                loadConversation(subscribeToAddMessage);
              },
              error(err) {
                console.error("ERROR IN CONVERSATION", err);
              },
            }); 
          }
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
    // }, [conversationList,activeConversation.id]);
  }, [conversationList]);

  const handleClose = () => {
    setMore(null);
  };

  useEffect(() => {
    if (props.listTypePinned) {
      setListType("pinned");
    }
  });

  const moreOptions = (event) => {
    setMore(event.currentTarget);
  };

  const loadConversationList = () => {
    switch (listType) {
      case "conversation":
        return (
          <ConversationList
            update={(conversation_id) => {
              getListOfConversation()
              updateUnread(conversation_id)
            }}
            // update={()=>{
            //   console.log('THIS IS FOR UPDATING MESSGAE UREAD COURNT TO ZERO')
            // }}
            conversationList={conversationList}
          />
        );
      case "archived":
        return <ArchivedConversationList update={getListOfConversation} />;
      case "pinned":
        return <PinnedMessagesList search={search} />;
      case "starred":
        return <StarredList search={search} />;
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

  const updateConversatonList = () => {
    props.togglePinned();
    if (!_.isUndefined(chatToken)) {
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
    }
  };

  chatCtx.deleteMessageConversationList=()=>{
    // loadConversation(editedMessageObject) 
    let updateInConversation = conversationList.items.filter((conversation) => {
      if (conversation.id === activeConversation.id)
        return conversation;
    });

    let remainingConversation = conversationList.items.filter(
      (conversation) => {
        if (conversation.id !== activeConversation.id)
          return conversation;
      }
    );

    updateInConversation[0].messages[0].is_deleted=true 
    
    remainingConversation.unshift(updateInConversation[0]);
    console.log('updateInConversationupdateInConversationupdateInConversation: ',updateInConversation)
    setConversationList({ items: remainingConversation });
  }

  chatCtx.updateLastEditedMessageConversationList=(editedMessageObject)=>{
    loadConversation(editedMessageObject) 
  }

  const loadConversation = (conversationInstance) => {
    // setLoading(true);

    console.log('conversationInstance in chatDrawer XL: ', conversationInstance.conversation_id)
    console.log('conversationInstance in activeConversation.id XL: ', chatCtx.activeConversationId)
    console.log('UPDATED IN CONVERSATION: ', conversationInstance.conversation_id)

    //filter conversation in which get the new message
    let updateInConversation = conversationList.items.filter((conversation) => {
      if (conversation.id === conversationInstance.conversation_id)
        return conversation;
    });

    //other conversations
    let remainingConversation = conversationList.items.filter(
      (conversation) => {
        if (conversation.id !== conversationInstance.conversation_id)
          return conversation;
      }
    );

    //update unread message when recieved message user_id is not mine
    if (userId != conversationInstance.user.id && chatCtx.activeConversationId != conversationInstance.conversation_id)
      updateInConversation[0].unread = updateInConversation[0].unread + 1;
    else
      updateInConversation[0].unread = null;

    updateInConversation[0].messages = [conversationInstance];

    remainingConversation.unshift(updateInConversation[0]);
    setConversationList({ items: remainingConversation });
    // setLoading(false);
  };

  const searchHandler = (event) => {
    if (event.target.value == "") {
      setSearch(null);
    } else setSearch(event.target.value);
    console.log("searchHandler: ", event.target.value);
  };

  const updateUnread = (conversation_id) => {
    let updateIndex = 0;

    let updateInConversation = conversationList.items.filter((conversation, index) => {
      if (conversation.id === conversation_id) {
        updateIndex = index
        return conversation;
      }
    });

    let remainingConversation = conversationList.items.filter(
      (conversation) => {
        if (conversation.id !== conversation_id)
          return conversation;
      }
    );

    updateInConversation[0].unread = 0
    remainingConversation[updateIndex]=updateInConversation[0];

    // setConversationList({ items: remainingConversation });

    // let updatedListWithZeroUnread=conversationList.items.map(conversation=>{
    //     if (conversation.id === conversation_id)
    //     {
    //       return {
    //         ...conversation,
    //         unread:0
    //       };
    //     }else
    //       return conversation
    // })

    // setConversationList({
    //   items:{...updatedListWithZeroUnread}
    // })

    // console.log('UPDATE UNREAD TO ZERO FOR CONVERSATION_ID', conversation_id)
    // console.log('HERE IS CONVERSATION LIST DATA', conversationList)
    // console.log('HERE IS CONVERSATION UPDATED WITH ZERO', updatedListWithZeroUnread)

  }

  const getListOfConversation = () => {
    // console.log('Update Conversation List on Click Chat Head')
    setLoading(true);
    if (!_.isUndefined(chatToken)) {
      // console.log('Fetch Conversation List')
      gqlClient
        .query(LIST_CONVERSATION, {
          token: chatToken,
          userId: userId,
          search_text: search,
        })
        .then(({ data: { listConversations }, loading }) => {
          console.log('FNew DATAt')

          setConversationList(listConversations);
          setLoading(false);
        })
        .catch((er) => {
          setConversationList()
          setLoading(false);
        });
    }
  };



  useEffect(() => {
    getListOfConversation();
  }, [search,props.refreshState]);

  return (
    <>
      {listType == "conversation" ? (
        <Toolbar className={classes.gutter}>
          <ChatTextField
            inputProps={{ value: search }}
            placeholder="Search"
            onChange={searchHandler}
            startAdornment={
              <BiSearchAlt2 style={{ height: "18px", margin: "0px 7px",fontSize:"16px" }} />
            }
          />
          <IconButton size="small" onClick={moreOptions}>
            <FiMoreVertical />
          </IconButton>
          <Menu
            style={{marginTop:"40px"}}
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
            {/* {!_.isUndefined(activeConversation.id) ? (
                <MenuItem
                  className={classes.menuRoot}
                  onClick={() => {
                    setListType("pinned");
                    setMore(false);
                  }}
                >
                  Pinned Messages jhb
                </MenuItem>
              ) : (
                ""
              )} */}
          </Menu>
        </Toolbar>
      ) : (
          <Toolbar className={classes.gutter}>
            <IconButton size="small" onClick={() => setListType("conversation")}>
              <BiArrowBack onClick={updateConversatonList} />
            </IconButton>
            <Box
              style={{
                fontSize: "18px",
                marginLeft: "10px",
                color: "rgb(82, 83, 79)",
                fontWeight: 500,
                width: "100%",
              }}
            >
              {txtListType(listType)}
            </Box>
          </Toolbar>
        )}
      <Divider />
      <Box
        style={{
          height: "100%",
          alignItems: "center",
          width: "100%",
          position: "relative",
          textAlign: "center",
        }}
      >
        {loading ? (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "88%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
            loadConversationList()
          )}
      </Box>
    </>
  );
}

export default React.memo(ChatDrawerXl);
