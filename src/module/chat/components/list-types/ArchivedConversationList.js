import { Divider, ListItem, List, Box, CircularProgress } from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { gqlClient } from "../../config/request-client";
import { appSync } from "../../GraphQL/schema";
import ChatHead from "../ChatHead";
import emptyStateIcon from '../../assets/images/messaging.svg'

function ConversationList(props) {
  const { chatToken, userId } = useSelector((state) => {
    return {
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
    };
  });

  const [loading, setLoading] = useState(true);

  const [conversationList, setConversationList] = useState({
    items: [],
  });

  useEffect(() => {
    const LIST_CONVERSATION = gql(appSync.queries.ListArchievedConversations());

    gqlClient
      .query(LIST_CONVERSATION, {
        token: chatToken,
        user_id: userId,
      })
      .then(({ data: { listArchivedConversations } }) => {
        console.log("listConversations", listArchivedConversations);
        setConversationList(listArchivedConversations);
        setLoading(false);
      })
      .catch((er) => {
        console.log("NO CONVERSATION FOUND");
        setLoading(false);
      });
  }, [chatToken, userId]);

  const unarchiveConversationHandler = (conversation_id) => {
    let conversations = conversationList.items.filter(
      (conversation) => conversation.id != conversation_id
    );
    setConversationList({
      ...conversationList,
      items: conversations,
    });
  };


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
    <React.Fragment>
       {conversationList.items.length
          ?
          (<List style={{ paddingTop: "0px", overflow: "hidden auto" }}>
            {conversationList.items.map((conversationHead, index) => (
                <React.Fragment key={index}>
                  <ChatHead
                    updateConversation={props.update}
                    unarchiveHandler={unarchiveConversationHandler}
                    type="ArchiveConversations"
                    data={conversationHead}
                  />
                  <Divider />
                </React.Fragment>
              ))}
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
          <Box>No Conversation Found</Box>
        </Box>)}
      
    </React.Fragment>
  );
}

export default ConversationList;
