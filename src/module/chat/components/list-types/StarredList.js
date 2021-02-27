import { Box, CircularProgress, Divider, List } from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { gqlClient } from "../../config/request-client";
import { appSync } from "../../GraphQL/schema";
import StarredMessage from "../messageFormats/StarredMessage";
import _ from "lodash";

const LIST_STAR_MESSAGES = gql(appSync.queries.ListStarMessages());

function StarredList(props) {
  const { chatToken, userId, hardReloadStaredComponent } = useSelector(
    (state) => {
      return {
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
          .query(LIST_STAR_MESSAGES, {
            user_id: userId,
            token: chatToken,
            next_token: {
              id,
              created_date,
            },
          })
          .then(({ data: { listStarredMessages } }) => {
            if (!_.isNull(listStarredMessages.next_token))
              setStarredMessages({
                items: [...starredMessages.items, ...listStarredMessages.items],
                next_token: listStarredMessages.next_token,
              });
          });
      }
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gqlClient
      .query(LIST_STAR_MESSAGES, {
        token: chatToken,
        user_id: userId,
        next_token: null,
        search_text:props.search
      })
      .then(({ data: { listStarredMessages } }) => {
        if (!_.isNull(listStarredMessages.items))
          setStarredMessages(listStarredMessages);
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
    <List
      onScroll={loadMoreStarMessages}
      ref={conversationBox}
      style={{ paddingTop: "0px", overflow: "auto",height:"515px" }}
    >
      {(starredMessages.items.length)
        ? starredMessages.items.map((message, index) => {
            return (
              <>
                <StarredMessage key={index} message={message} key={index} />
                <Divider />
              </>
            );
          })
        : "NO MESSAGE FOUND"}
    </List>
  );
}

export default StarredList;
