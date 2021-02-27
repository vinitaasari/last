import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ChatHead from "../ChatHead";
import _ from "lodash";
import emptyStateIcon from '../../assets/images/messaging.svg'

const useStyles = makeStyles({
  list: {
    height: "515px",
    paddingTop: "0px",
    overflow: "auto",
    fontSize: "14px",
    overflowX: "hidden",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
}); 

function ConversationList(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [pagination,setPagination]=useState(20)                  //number of cards

  const [conversationList, setConversationList] = useState({
    items: [],
  });

  let [update, setUpdate] = useState(0);

  useEffect(() => {
    setConversationList(props.conversationList);
    setLoading(false);
  }, [props.conversationList]);

  const archiveConversationHandler = (conversation_id) => {
    let conversations = conversationList.items.filter(
      (conversation) => conversation.id !== conversation_id
    );

    setConversationList({
      ...conversationList,
      items: conversations,
    });
  };

  const newUpdate = (message = null) => {
    console.log("conversationList newMessage: ", conversationList);
    console.log(
      "New MEssage newMessage method in Subscription from Chat HEasd",
      message
    );
    let newval = parseInt(update) + 1;
    console.log("newval to update Compoentn: ", newval);
    setUpdate(newval);
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
      {!_.isUndefined(conversationList) ? (
        <List className={classes.list}>
          {conversationList.items.length
            ? conversationList.items.map((conversationHead, index) => {
                return (
                  <React.Fragment key={index}>
                    {pagination>index ? (
                      <>
                        <ChatHead
                          updateConversation={props.update}
                          updatedValue={update}
                          archiveHandler={archiveConversationHandler}
                          type="AllConversations"
                          data={conversationHead}
                        />
                        <Divider />
                      </>
                    ):(
                      <>
                      {pagination==index && (
                        <Button onClick={()=>setPagination(pagination+20)}>Load More</Button>
                      )}
                      </>
                    )}
                  </React.Fragment>
                )
              })
            : (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "88%",
                  flexDirection: "column"
                }}
              >
                <img src={emptyStateIcon} />
                <Box>No Conversation Found</Box>
              </Box>
            )}
        </List>
      ) : (<Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "88%",
          flexDirection: "column"
        }}
      >
        <img src={emptyStateIcon} />
        <Box>No Conversation Found</Box>
      </Box>)}
    </React.Fragment>
  );
}

export default ConversationList;