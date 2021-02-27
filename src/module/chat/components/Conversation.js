import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import { appSync } from "../GraphQL/schema";
import { useSelector } from "react-redux";
import { gqlClient } from "../config/request-client";
import {
  addOnlineUser,
  deleteMessageFromConversation,
  loadOldConversation,
} from "../chatContainer/actions";
import store from "../../../store";
import _ from "lodash";
import moment from "moment";
import { GiConsoleController } from "react-icons/gi";
import { useChatContext } from "../contexts/chat-context";

const useStyles = makeStyles({
  conversationContainer: {
    overflow: "auto",
    padding: "0px 20px",
    height: "100%",
    fontSize: "14px",
    "&::-webkit-scrollbar": {
      width: "10px"
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#f5f4f4",
      borderRadius: "10px"
    }
  },
});

const SUBSCRIBE_TO_ADD_MESSAGE = gql(
  appSync.subscriptions.subscribeToAddMessageConversation()
);

const SUBSCRIBE_TO_DELETE_MESSAGE = gql(
  appSync.subscriptions.subscribeToDeleteMessage()
);

const LIST_MESSAGE = gql(appSync.queries.ListMessges());

function Conversation(props) {
  const classes = useStyles();
  const conversationBox = useRef();
  const down = useRef();
  const paginationToken = useSelector((state) => {
    const {
      created_date,
      id,
    } = state.chatContainer.chatData.listMessages.next_token;
    return { created_date, id };
  });
  const { chatToken, userId, activeConversation } = useSelector((state) => {
    return {
      activeConversation: state.chatContainer.chatData.retrieveConversation,
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
    };
  });

  const onlineUsers = [];
  const [hasOldConversation, setHasOldConversation] = useState(false);

  const getMoreConversation = () => {
    const a = conversationBox.current.scrollTop;
    const b =
      conversationBox.current.scrollHeight -
      conversationBox.current.clientHeight;
    const c = a / b;
    if (c === 0) {
      console.log("paginationToken: ", paginationToken);
      if (!_.isNull(paginationToken) && !_.isNull(paginationToken.created_date))
        gqlClient
          .query(LIST_MESSAGE, {
            user_id: userId,
            token: chatToken,
            conversation_id: activeConversation.id,
            next_token: paginationToken,
          })
          .then(({ data: { listMessages } }) => {
            setHasOldConversation(true)
            console.log("DAATA", listMessages);
            let previousConversation = {
              ...listMessages,
              items: listMessages.items.reverse()
            }

            console.log("container.scrollHeight: ", conversationBox)
            store.dispatch(loadOldConversation(previousConversation));
            setTimeout(() => {
              conversationBox.current.scrollTop = conversationBox.current.scrollHeight * 0.30
            }, 2000)

            // container.scrollTo(0,container.scrollHeight)
          });
    }
  };

  // useEffect(()=>{
  //   let container;
  //   container=document.getElementById('chatContainer')
  //   setTimeout(() => {
  //     if(container){
  //       // console.log('Scroll TOp: ', conversationBox.current.scrollTop)
  //       console.log('Scroll Percentage: ', (conversationBox.current.scrollHeight*10)/100)
  //       container.scrollTo(152)
  //     }
  //   }, 1000);
  // })

  const [conversationMessages, setConversationMessages] = useState({
    items: [],
  });

  const deletedMessage = (message) => {
    let data = { ...conversationMessages };

    data.items.map((item) => {
      if (item.id == message.message_id) item.is_deleted = true;
      return item;
    });

    setConversationMessages(data);
  };

  useEffect(() => {
    console.log('props.conversation:', props.conversation)
    console.log('paginationToken TOKEN UPDATE:', paginationToken)
    setConversationMessages(props.conversation);
  }, [props.conversation]);

  useEffect(() => {
    let container;
    container = document.getElementById('chatContainer')

    if (conversationMessages.items.length <= 12 && hasOldConversation == false) {
      setTimeout(() => {
        if (container) {
          container.scrollTo(0, container.scrollHeight)
        }
      }, 1000);
    }

    if (!_.isNull(container)) {
      const a = container.scrollTop;
      const b = container.scrollHeight - container.clientHeight;
      const c = a / b;

      if (parseInt(c * 100) > 90) {
        setTimeout(() => {
          if (container) {
            container.scrollTo(0, container.scrollHeight)
          }
        }, 1000);
      }
    }
  });

  // useEffect(() => {
  // down.current.scrollTop=down.current.scrollHeight;
  // setTimeout(() => {
  //   down.current.scrollIntoView({ behavior: "smooth" });
  // }, 1000);
  // }, [down.current]);

  // useEffect(() => {

  //   down.current.scrollTop = down.current.scrollHeight;
  // }, [down.current]);

  const updateMessageSeen = () => {
    let updatedMessageStatus = props.conversation.items.map((message) => {
      return {
        ...message,
        status: "seen",
      };
    });

    console.log("updatedMessageStatus: ", updatedMessageStatus);
    // setConversationMessages({...props.Conversation,items:updatedMessageStatus})
    // console.log(
    //   "conversationMessages updateMessageSeen: ",
    //   conversationMessages
    // );
  };


  useEffect(() => {
    const SUBSCRIBE_TO_UPDATE_USER_STATUS = gql(
      appSync.subscriptions.subscribeToUpdateUserStatus()
    );

    console.log("subscribe on user status update: ");

    let subscriptionUpdateUserStatus;

    if (!_.isUndefined(activeConversation.id)) {
      subscriptionUpdateUserStatus = gqlClient
        .subscribe(SUBSCRIBE_TO_UPDATE_USER_STATUS, {
          variables: { conversation_id: activeConversation.id },
        })
        .subscribe({
          next({ data: { subscribeToUpdateUserStatus } }) {
            if (subscribeToUpdateUserStatus.status == "online") {
              if (onlineUsers.length <= 1) {
                console.log(
                  "SubscribeToUpdateUserStatus Online: ",
                  subscribeToUpdateUserStatus
                );

                // setTimeout(updateMessageSeen(),2000)

                if (
                  !_.includes(onlineUsers, subscribeToUpdateUserStatus.user_id)
                ) {
                  onlineUsers.push(subscribeToUpdateUserStatus.user_id);
                  if (subscribeToUpdateUserStatus.user_id != userId)
                    if (onlineUsers.length == 2) {
                      updateStatus("online");
                      props.changeStatus("online");
                    }
                }
              } else {
                props.updateMessageSeen()
                console.log('Both Online Update Tick: ')
              }
            } else {
              console.log(
                "SubscribeToUpdateUserStatus Offline: ",
                subscribeToUpdateUserStatus
              );

              var index = onlineUsers.indexOf(
                subscribeToUpdateUserStatus.user_id
              );

              if (index !== -1) {
                onlineUsers.splice(index, 1);
              }

              if (onlineUsers.length < 2) {
                props.changeStatus("offline");
              }
            }

            if (onlineUsers.length == 2) {
              console.log("TEST FOR conversationMessages: ", conversationMessages);
            }

            console.log("onlineUsers: ", onlineUsers);
          },
          error(err) {
            console.error("ERROR in CONVERSATION", err);
          },
        });
    }

    if (!_.isUndefined(subscriptionUpdateUserStatus)) {
      return () => {
        updateStatus("offline");
        subscriptionUpdateUserStatus.unsubscribe();
        console.log("unsubscribe on user status update: offline ");
      };
    }
  }, [activeConversation.id]);

  const reload = () => {
    updateStatus("offline");
  }

  // useEffect(()=>{
  //   window.onbeforeunload = function(){
  //     reload()
  //     return 'Are you sure you want to leave?';
  //   };

  //   // if (window.performance) {
  //   //   if (performance.navigation.type == 1) {
  //   //     alert( "This page is reloaded" );
  //   //   } else {
  //   //     alert( "This page is not reloaded");
  //   //   }
  //   // }

  //   // return ()=>{
  //   //   console.log('activeConversation.id: ',activeConversation.id)
  //   // }
  // },[activeConversation.id])

  useEffect(() => {
    // window.onbeforeunload = function(){
    //   reload()
    //   return 'Are you sure you want to leave?';
    // };
    return () => {
      reload()
    }
  }, [activeConversation.id])


  const updateSeenForGroup = (newMessage) => {
    let UPDATE_MESSAGE_STATUS = gql(appSync.mutations.updateMessageStatus())

    console.log("USer ID: ", userId);

    if (newMessage.user.id !== userId)
      gqlClient
        .mutate(UPDATE_MESSAGE_STATUS, {
          message_id: newMessage.id,
          token: chatToken,
          conversation_id: activeConversation.id,
          user_id: userId,
          status: 'seen',
        })
        .then(({ data: { updateMessageStatus } }) => {

        });
  }

  useEffect(() => {
    let subscription;

    if (!_.isUndefined(activeConversation.id)) {
      subscription = gqlClient
        .subscribe(SUBSCRIBE_TO_ADD_MESSAGE, {
          variables: { conversation_id: activeConversation.id },
        })
        .subscribe({
          next({ data: { subscribeToAddMessage } }) {
            console.log("NEW MESSAGE DATA HERE: ", subscribeToAddMessage);
            console.log("NEW MESSAGE activeConversation: ", activeConversation);
            if (activeConversation.type == 'group') {
              updateSeenForGroup(subscribeToAddMessage)
            }

            props.status(subscribeToAddMessage);
          },
          error(err) {
            console.error("ERROR IN CONVERSATION", err);
          },
        });
    }

    if (!_.isUndefined(subscription)) {
      const timer = setTimeout(() => {
        updateStatus("online");
      }, 2000);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [activeConversation.id]);

  useEffect(() => {
    let subscriptionDeleteMessage;
    if (!_.isUndefined(activeConversation.id)) {
      subscriptionDeleteMessage = gqlClient
        .subscribe(SUBSCRIBE_TO_DELETE_MESSAGE, {
          variables: { conversation_id: activeConversation.id },
        })
        .subscribe({
          next({ data: { subscribeToDeleteMessage } }) {
            deletedMessage(subscribeToDeleteMessage);
          },
          error(err) {
            console.error("ERROR in CONVERSATION", err);
          },
        });

      if (subscriptionDeleteMessage) {
        return () => {
          subscriptionDeleteMessage.unsubscribe();
        };
      }
    }
  }, [activeConversation.id, conversationMessages]);

  useEffect(() => {
    const SUBSCRIBE_TO_REMOVE_MEMBER = gql(
      appSync.subscriptions.subscribeToRemoveMember()
    );

    if (!_.isUndefined(activeConversation.id)) {
      gqlClient
        .subscribe(SUBSCRIBE_TO_REMOVE_MEMBER, {
          variables: { conversation_id: activeConversation.id },
        })
        .subscribe({
          next({ data: { subscribeToRemoveMember } }) {
            console.log("subscribeToRemoveMember: ", subscribeToRemoveMember);
          },
          error(err) {
            console.error("ERROR in CONVERSATION", err);
          },
        });
    }
  }, []);

  
  const chatCtx=useChatContext()

  useEffect(() => {
    const SUBSCRIBE_TO_EDIT_MESSAGE = gql(
      appSync.subscriptions.subscribeToEditMessage()
    );

    let subscription;

    if (!_.isUndefined(activeConversation.id)) {
      subscription = gqlClient
        .subscribe(SUBSCRIBE_TO_EDIT_MESSAGE, {
          variables: { conversation_id: activeConversation.id },
        })
        .subscribe({
          next({ data: { subscribeToEditMessage } }) {
            let data = { ...conversationMessages };

            conversationMessages.items.map((item) => {
              if (item.id == subscribeToEditMessage.id)
                item.content = subscribeToEditMessage.content;
              return item;
            });

            setConversationMessages(data);
            chatCtx.updateLastEditedMessageConversationList(subscribeToEditMessage)
          },
          error(err) {
            console.error("ERROR in CONVERSATION", err);
          },
        });
    }

    if (subscription) {
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [activeConversation.id, conversationMessages]);

  useEffect(() => {
    const SUBSCRIBE_TO_PIN_MESSAGE = gql(
      appSync.subscriptions.subscribeToPinMessage()
    );

    let subscription;

    if (!_.isUndefined(activeConversation.id)) {
      subscription = gqlClient
        .subscribe(SUBSCRIBE_TO_PIN_MESSAGE, {
          variables: { conversation_id: activeConversation.id },
        })
        .subscribe({
          next({ data: { subscribeToPinMessage } }) {
            let data = { ...conversationMessages };

            conversationMessages.items.map((item) => {
              if (item.id == subscribeToPinMessage.message_id)
                item.is_pinned = subscribeToPinMessage.action;
              return item;
            });

            setConversationMessages(data);
          },
          error(err) {
            console.error("ERROR in CONVERSATION", err);
          },
        });
    }

    if (subscription) {
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [activeConversation.id, conversationMessages]);

  useEffect(() => {
    // let data = { ...conversationMessages };
    console.log('LOAD DARAR HERE')

    let container;
    container = document.getElementById('chatContainer')

    if (conversationMessages.items.length <= 12 && hasOldConversation == false) {
      setTimeout(() => {
        if (container) {
          container.scrollTo(0, container.scrollHeight)
        }
      }, 1000);
    }

    // conversationMessages.items.map((item) => {
    //   item.status = 'seen';
    //   return item;
    // });

    // setConversationMessages(data);
  }, [props.loading]);

  const updateStatus = (status = "online") => {
    const UPDATE_USER_STATUS = gql(appSync.mutations.updateUserStatus());

    gqlClient
      .mutate(UPDATE_USER_STATUS, {
        token: chatToken,
        conversation_id: activeConversation.id,
        user_id: userId,
        status: status,
      })
      .then(({ data: { updateUserStatus } }) => {

      });
  };

  const dayStatus = (msg_created_date) => {
    let daytag = localStorage.getItem("dayTag");

    let output = moment(msg_created_date).calendar(null, {
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      nextWeek: "DD/MM/YYYY",
      lastDay: "[Yesterday]",
      lastWeek: "DD/MM/YYYY",
      sameElse: "DD/MM/YYYY",
    });

    localStorage.setItem("dayTag", output);

    if (daytag !== output) {
      return (
        <Box
          alignSelf="center"
          style={{
            marginTop: "10px",
            backgroundColor: "#e2eafa",
            color: "#22589c",
            borderRadius: "30px",
            padding: "4px 13px",
            fontSize: "12px",
          }}
        >
          {output}
        </Box>
      );
    } else return "";
  };

  if (props.loading) {
    return <Box style={{ textAlign: "center", height: "100%", display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center" }}>
      <CircularProgress />
    </Box>
  }

  return (
    <Box
      id="chatContainer"
      flexDirection="column"
      display="flex"
      className={classes.conversationContainer}
      onScroll={getMoreConversation}
      ref={conversationBox}
    >
      {conversationMessages.items.length === 0 ? (
        <>
          {/* <Box>"Welcome To chat Application"</Box> */}
          <Box item ref={down}></Box>
        </>
      ) : (
          <Box display="flex" flexDirection="column" style={{ paddingBottom: "12px" }}>
            {conversationMessages.items.map((message, index) => (
              <React.Fragment key={index}>
                {dayStatus(message.created_date)}
                <Box style={{ padding: "8px" }} />

                <ChatMessage

                  fromSender={userId === message.user.id}
                  message={message}
                  profileImgVisible={true}
                  getmore={true}
                />
              </React.Fragment>
            ))}
            <Box item ref={down}></Box>
          </Box>
        )}
    </Box>
  );
}

export default React.memo(Conversation);
