import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core";
import clsx from "clsx";
import gql from "graphql-tag";
import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { GiPin } from "react-icons/gi";
import { useSelector } from "react-redux";
import { gqlClient } from "../config/request-client";
import { appSync } from "../GraphQL/schema";
import _ from "lodash";
import moment from "moment";
import Modal from "./utils/Modal";
import ChatMedia from "./ChatMedia";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { ChatTextField } from "./Theme/MuiComponents";
import { BsBoxArrowDownRight, BsFillMicFill } from "react-icons/bs";
import store from "../../../store";
import {
  hardReloadStaredComponent,
  replayMessageObject,
} from "../chatContainer/actions";
import Grid from "@material-ui/core/Grid";
import { Avatar, Divider, ListItem } from "@material-ui/core";
import { TiTick } from "react-icons/ti";
import { FaEye } from "react-icons/fa";
import doubleTickIcon from "../icons/Group 19380.svg";
import seenTickIcon from "../icons/Group 18047.svg";
import CheckIcon from "@material-ui/icons/Check";
import Reply from "./utils/Reply";
import { decryptMesg, encryptMessage } from "../config/encrypter-decrypter";
import { useChatContext } from "../contexts/chat-context";

const styles = {
  moreicon: {
    position: "absolute",
    margin: "0px",
    top: "0px",
    right: "2px",
  },
};

const useStyles = makeStyles({
  isText: {
    padding: "5px"
    // padding: "10.5px 8.6px 7.4px 19px",
  },
  isMedia: {
    padding: "3px 2.4px 2.7px 3px",
  },
  from: {
    backgroundColor: "#03579c !important",
    borderRadius: "5px 5px 0px 5px !important",
    color: "white",
    maxWidth: "60%",
    display: "inline-block",
  },
  common: {
    // padding: "10px",
  },
  message: {
    "&:hover $getMore": {
      visibility: "visible",
      backgroundColor: "lightgrey"
    },
  },
  to: {
    backgroundColor: "#f5f4f4",
    border: "1px solid #e2e2e2",
    display: "inline-block",
    borderRadius: "5px 5px 5px 0px",
    maxWidth: "60%",
    position: "relative",
    "&:hover $getMore": {
      backgroundColor: "lightgrey",
      visibility: "visible",
    },
  },
  messageDetails: {
    justifyContent: "flex-end",
    fontSize: "10px",
    textAlign: "right",
    paddingTop: "2px",
  },
  name: {
    fontSize: "12px",
    fontWeight: "600",
    position: "relative",
    bottom: "1px",
    minWidth: "61px"
  },
  toColor: {
    color: "white",
    backgroundColor: "#21579c",
  },
  replay: {
    borderRadius: "5px",
    backgroundColor: "white",
    color: "black",
    padding: "3px 3px",
    margin: "-1px",
    fontSize: "11px",
  },
  replayName: {
    fontWeight: 600,
  },
  getMore: {
    zIndex: 2,
    visibility: "hidden",
    position: "absolute",
    margin: "0px",
    right: "0px",
    top: "0px",
  },
  whiteGetMore: {
    color: "white"
  }
});

function ChatMessage(props) {
  const classes = useStyles();
  const [more, setMore] = React.useState(null);

  const moreOptions = (event) => {
    setMore(event.currentTarget);
  };

  const handleClose = () => {
    setMore(null);
  };

  const [editMesageModal, setEditMesageModal] = useState(false);
  const editInputRef = useRef({ focus: () => { } })
  const { chatToken, userId } = useSelector((state) => {
    return {
      activeConversation: state.chatContainer.chatData.retrieveConversation,
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
    };
  });

  const pinMessage = (message_id, status) => {
    const PIN_MESSAGE = gql(appSync.mutations.pinMessage());
    let pinnedStatus = message.is_pinned

    setMessage({
      ...message,
      is_pinned: !message.is_pinned,
    });

    gqlClient
      .mutate(PIN_MESSAGE, {
        token: chatToken,
        message_id: message_id,
        action: !status,
        conversation_id: activeConversation.id
      })
      .then(({ data: { pinMessage } }) => {
        // if (pinMessage)
        //   setMessage({
        //     ...message,
        //     is_pinned: !message.is_pinned
        //   });
      }).catch(er => {
        setMessage({
          ...message,
          is_pinned: pinnedStatus,
        })
      });

    handleClose();
  };

  const [message, setMessage] = useState();
  const [editMessageData, setEditMessageData] = useState({
    message_id: null,
    content: null,
  });

  useEffect(() => {
    setMessage(props.message);
  }, [props.message]);

  let { activeConversation } = useSelector((state) => ({
    // hardReloadStaredComponent:state.chatContainer.chatData.hardReloadStaredComponent,
    activeConversation: state.chatContainer.chatData.retrieveConversation,
  }));

  const editMessage = (message_id, message) => {
    // alert('ok');
    setEditMessageData({
      ...editMessageData,
      content: decryptMesg(message.content),
      message_id: message_id,
    });
    handleClose();
    setEditMesageModal(!editMesageModal);
    setTimeout(() => {
      editInputRef.current.focus()
    }, 1000)
  };

  const chatCtx=useChatContext()
  
  const deleteMessage = (message_id, delete_for) => {
    const DELETE_MESSAGE = gql(appSync.mutations.deleteMessage());

    gqlClient
      .mutate(DELETE_MESSAGE, {
        token: chatToken,
        user_id: userId,
        message_id: message_id,
        conversation_id: activeConversation.id,
        delete_for: delete_for,
      })
      .then(
        ({
          data: {
            deleteMessage: { is_deleted },
          },
        }) => {
          if (is_deleted)
            setMessage({
              ...message,
              is_deleted: is_deleted,
            });

            chatCtx.deleteMessageConversationList()
        }
      );

    handleClose();
  };

  const starMessage = (message_id, status) => {
    const STAR_MESSAGE = gql(appSync.mutations.starMessage());

    gqlClient
      .mutate(STAR_MESSAGE, {
        token: chatToken,
        message_id: message_id,
        user_id: userId,
        action: !status,
      })
      .then(({ data: { starMessage } }) => {
        if (starMessage)
          setMessage({
            ...message,
            is_starred: !message.is_starred,
          });

        store.dispatch(hardReloadStaredComponent());
      });

    handleClose();
  };

  const replayMessage = (message_id) => {
    console.log('Message REplied: ', message)
    store.dispatch(replayMessageObject(message));
    handleClose();
  };

  const editMessageHandler = () => {
    const EDIT_MESSAGE = gql(appSync.mutations.editMessage());
    gqlClient
      .mutate(EDIT_MESSAGE, {
        token: chatToken,
        user_id: userId,
        message_id: editMessageData.message_id,
        content: encryptMessage(editMessageData.content),
        type: "text",
      })
      .then(({ data: { editMessage } }) => {
        setMessage({
          ...message,
          content: editMessage.content,
        });
      });

    setEditMesageModal(false);
  };

  const messageStatus = (status) => {
    switch (status) {
      case "sent":
        return <CheckIcon />;
      case "seen":
        return <img src={seenTickIcon} />;
      case "delivered":
        return <img src={doubleTickIcon} />;
    }
  };

  if (_.isUndefined(message)) {
    return "loading...";
  }

  const getAlignment = (isFromSender) => {
    if (isFromSender && _.isUndefined(props.messageType)) return "right";
    else return "left";
  };

  const getStyles = () => {
    if (!_.isUndefined(props.messageType)) return { maxWidth: "100%" };
  };
  
  return (
    <>
      <Modal
        title="Edit Message"
        successButton={editMessageHandler}
        statusUpdated={() => setEditMesageModal(false)}
        status={editMesageModal}
      >
        <ChatTextField

          onChange={(e) =>
            setEditMessageData({ ...editMessageData, content: e.target.value })
          }
          value={ editMessageData.content}
          inputProps={{
            style: { paddingLeft: 10 },
            ref: editInputRef
          }}
        // startAdornment={<BsFillMicFill />}
        />
      </Modal>
      <Grid container style={{ display: "inline" }}>
        <Grid item xs={12} style={{ textAlign: getAlignment(props.fromSender) }}>
          {!message.is_deleted ? (
            <Box
              className={clsx({
                [classes.to]: true,
                [classes.from]: props.fromSender,
                [classes.isText]: _.isNull(message.media),
                [classes.isMedia]: !_.isNull(message.media),
              })}
              style={getStyles()}
            >
              {message.user.id === userId || activeConversation.type == "user" ? (
                ""
              ) : (
                  <Box className={classes.name} item>
                    {message.user.first_name + " " + message.user.last_name}
                  </Box>
                )}
              {props.messageType !== 'star' ?
                <Box>
                  <IconButton
                    className={clsx({ [classes.getMore]: true, [classes.whiteGetMore]: props.fromSender })}
                    size="small"
                    onClick={moreOptions}
                  >
                    <MdKeyboardArrowDown />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={more}
                    keepMounted
                    open={Boolean(more)}
                    onClose={handleClose}
                  >
                    {message.user.id !== userId || message.type === "media" ? (
                      ""
                    ) : (
                        <MenuItem
                          className={classes.menuRoot}
                          onClick={() => editMessage(message.id, message)}
                        >
                          Edit message
                          {/* <Box>{message.type}</Box> */}
                        </MenuItem>
                      )}

                    <MenuItem
                      className={classes.menuRoot}
                      onClick={() => replayMessage(message.id)}
                    >
                      Reply message
                       </MenuItem>
                    <MenuItem
                      className={classes.menuRoot}
                      onClick={() => starMessage(message.id, message.is_starred)}
                    >
                      {message.is_starred ? "Unstar Message" : "Star Message"}
                    </MenuItem>
                    {message.user.id !== userId ? (
                      ""
                    ) : (
                        <>
                          <MenuItem
                            className={classes.menuRoot}
                            onClick={() => deleteMessage(message.id, "me")}
                          >
                            Delete for me
                         </MenuItem>
                          <MenuItem
                            className={classes.menuRoot}
                            onClick={() => deleteMessage(message.id, "everyone")}
                          >
                            Delete for everyone
                       </MenuItem>
                        </>
                      )}
                    {/* <MenuItem
                         className={classes.menuRoot}
                         onClick={() => pinMessage(message.id, message.is_pinned)}
                       >
                         {message.is_pinned ? "Unpin message" : "Pin message"}
                       </MenuItem> */}
                  </Menu>
                </Box>
                : ""}
              <Box>
                {message.reply_message ? (
                  <Box className={classes.replay}>
                    <Reply message={message.reply_message} />
                  </Box>
                ) : (
                    ""
                  )}

                {_.isNull(message.media) ? (
                  <Box
                    style={{
                      minWidth: "80px",
                      textAlign: "initial",
                      fontSize: "13px"
                    }}
                  >
                    {decryptMesg(message.content)}
                  </Box>
                ) : (
                    <Box>
                      <ChatMedia
                        type={message.media[0].type}
                        media={message.media}
                        messageType={props.messageType}
                      />
                    </Box>
                  )}
                <Box
                  style={{
                    fontSize: "11px",
                    lineHeight: "1.18",
                    textAlign: "right",
                    display: "flex",
                    marginTop: "2px",
                    justifyContent: "flex-end",
                  }}
                >
                  {message.is_starred ? (
                    <Box item>
                      {/* <IconButton style={{ fontSize: "12px" }} size="small"> */}
                      <AiFillStar
                        color={message.user.id === userId ? "white" : ""}
                      />
                      {/* </IconButton> */}
                    </Box>
                  ) : (
                      ""
                    )}

                  {message.is_pinned ? (
                    <Box item style={{ padding: "0px 2px" }} >
                      {/* <IconButton style={{ fontSize: "12px" }} size="small"> */}
                      <GiPin
                        color={message.user.id === userId ? "white" : ""}
                      />
                      {/* </IconButton> */}
                    </Box>
                  ) : (
                      ""
                    )}

                  <Box item style={{ fontSize: "11px", padding: "0px 3px" }}>
                    {moment(message.created_date).format("h:mm a")}
                  </Box>

                  {message.user.id !== userId ? (
                    ""
                  ) : (
                      <Box item style={{ fontSize: "11px", paddingTop: "0px" }}>
                        {messageStatus(message.status)}
                      </Box>
                    )}
                </Box>
              </Box>
            </Box>
          ) : (
              <Box
                className={clsx({
                  [classes.to]: true,
                  [classes.from]: props.fromSender,
                  [classes.isText]: _.isNull(message.media),
                  [classes.isMedia]: !_.isNull(message.media),
                })}
              >
                <Box style={{ padding: "4px" }}>
                  <i>
                    <b>this message was deleted</b>
                  </i>
                </Box>
              </Box>
            )}
        </Grid>
      </Grid>
    </>
  );
}

export default ChatMessage;
