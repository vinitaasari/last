import { Box, CircularProgress, Divider, List } from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { gqlClient } from "../../config/request-client";
import { appSync } from "../../GraphQL/schema";
import StarredMessage from "../messageFormats/StarredMessage";
import _ from "lodash";
import emptyStateIcon from '../../assets/images/messaging.svg'

const LIST_PIN_MESSAGES = gql(appSync.queries.ListPinMessages());

function PinnedMessagesList(props) {
  const { chatToken, userId, hardReloadStaredComponent,activeConversation} = useSelector(
    (state) => {
      return {
        activeConversation: state.chatContainer.chatData.retrieveConversation,
        chatToken: state.chatContainer.chatToken.token,
        userId: state.chatContainer.userData.id,
        hardReloadStaredComponent:
          state.chatContainer.chatData.hardReloadStaredComponent,
      };
    }
  );

  const [starredMessages, setStarredMessages] = useState({
    items: [],
    next_token: {
      id: null,
      created_date: null,
    },
  });

  const conversationBox = useRef();

  const loadMoreStarMessages = () => {
    const a = conversationBox.current.scrollTop;
    const b =
      conversationBox.current.scrollHeight -
      conversationBox.current.clientHeight;
    const c = a / b;

    if (c === 1) {
      if (
        !_.isNull(starredMessages.next_token) &&
        !_.isNull(starredMessages.next_token.created_date)
      ) {
        const { id, created_date } = starredMessages.next_token;
        gqlClient
          .query(LIST_PIN_MESSAGES, {
            user_id: userId,
            token: chatToken,
            conversation_id:activeConversation.id,
            next_token: {
              id,
              created_date,
            },
          })
          .then(({ data: { listPinnedMessages } }) => {
            if (!_.isNull(listPinnedMessages.next_token))
              setStarredMessages({
                items: [...starredMessages.items, ...listPinnedMessages.items],
                next_token: listPinnedMessages.next_token,
              });
          });
      }
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gqlClient
      .query(LIST_PIN_MESSAGES, {
        token: chatToken,
        user_id: userId,
        conversation_id:activeConversation.id,
        next_token: null,
        search_text:props.search
      })
      .then(({ data: { listPinnedMessages } }) => {
        if (!_.isNull(listPinnedMessages.items))
          setStarredMessages(listPinnedMessages);
        setLoading(false);
      });
  }, [hardReloadStaredComponent,props.search]);

  if (loading) {
    return (
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
      );
  }


  return (
    (starredMessages.items.length)
      ? 
    (<List
      onScroll={loadMoreStarMessages}
      ref={conversationBox}
      style={{ paddingTop: "0px", overflow: "auto" }}
    >
      {starredMessages.items.map((message, index) => {
            return (
              <>
                <StarredMessage key={index} message={message} key={index} />
                <Divider />
              </>
            );
          })}
    </List>)
    : ( <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "88%",
        flexDirection:"column"
      }}
    >
      <img src={emptyStateIcon}/>
      <Box>No Message Found</Box>
    </Box>)
  );
}

export default PinnedMessagesList;