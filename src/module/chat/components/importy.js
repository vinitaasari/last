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
  import React, { useEffect, useState } from "react";
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
  import { ChatTextField } from "./Theme/MuiComponents";
  import { BsFillMicFill } from "react-icons/bs";
  import store from "../../../store";
  import { replayMessageObject } from "../chatContainer/actions";
  
  const useStyles = makeStyles({
    root: {
      backgroundColor: "#f5f4f4",
      border: "1px solid #e7e7e7",
      // padding: "5px 20px",
      float: "left",
      borderRadius: "5px",
      margin: "7px 0px 7px 0px",
      maxWidth: "40%",
      padding: "5px",
    },
    time: {
      // position: "absolute",
      // margin: "0px",
      // bottom: "0px",
      // left: "10px",
      // color: "#888997",
      // fontSize: "11px",
    },
    rootSender: {
      color: "white",
      float: "right",
      backgroundColor: "#21579c",
      borderRadius: "5px",
    },
    timeSender: {
      textAlign: "end",
      fontSize: "11px",
    },
    menuRoot: {
      height: "25px",
      fontSize: "14px",
      color: "#52534f",
    },
    leftMessage: {
      color: "white",
      fontSize: "14px",
    },
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
  
    const { chatToken, userId } = useSelector((state) => {
      return {
        chatToken: state.chatContainer.chatToken.token,
        userId: state.chatContainer.userData.id,
      };
    });
  
    const pinMessage = (message_id, status) => {
      const PIN_MESSAGE = gql(appSync.mutations.pinMessage());
      gqlClient
        .mutate(PIN_MESSAGE, {
          token: chatToken,
          message_id: message_id,
          action: !status,
        })
        .then(({ data: { pinMessage } }) => {
          if (pinMessage)
            setMessage({
              ...message,
              is_pinned: !message.is_pinned,
            });
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
      console.log("MESSAGE TYPE:", props.message);
    }, [props.message]);
  
    let { activeConversation } = useSelector((state) => ({
      activeConversation: state.chatContainer.chatData.retrieveConversation,
    }));
  
    const editMessage = (message_id) => {
      setEditMessageData({
        ...editMessageData,
        message_id: message_id,
      });
      handleClose();
      setEditMesageModal(!editMesageModal);
    };
  
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
        });
  
      handleClose();
    };
  
    const replayMessage=(message_id)=>{
      store.dispatch(replayMessageObject(message))
      handleClose();
    }
  
    const editMessageHandler = () => {
      const EDIT_MESSAGE = gql(appSync.mutations.editMessage());
      gqlClient
        .mutate(EDIT_MESSAGE, {
          token: chatToken,
          user_id: userId,
          message_id: editMessageData.message_id,
          content: editMessageData.content,
          type: "text",
        })
        .then(({ data: { editMessage } }) => {
          setMessage({
            ...message,
            content: editMessage.content,
          });
          console.log("editMessageData: ", editMessage);
        });
  
      setEditMesageModal(false);
    };
  
    if (_.isUndefined(message)) {
      return "loading...";
    }
  
    return (
      <Box style={{ position: "relative", margin: "0px" }}>
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
            value={editMessageData.content}
            startAdornment={<BsFillMicFill />}
          />
        </Modal>
        {!message.is_deleted ? (
          <Box
            className={clsx(classes.root, {
              [classes.rootSender]: props.fromSender,
            })}
            component="span"
          >
            <Box component="span" style={{ padding: "0px 9px" }}>
              {_.isNull(message.media) ? (
                message.content
              ) : (
                <ChatMedia type={message.media[0].type} media={message.media} />
              )}
            </Box>
            <IconButton
              className={clsx({
                [classes.leftMessage]: props.fromSender,
              })}
              size="small"
              onClick={moreOptions}
            >
              <MdKeyboardArrowDown />
            </IconButton>
            <Box
              component="div"
              className={clsx(classes.timeSender, {
                [classes.time]: !props.fromSender,
              })}
            >
              {message.is_starred ? (
                <IconButton
                  className={clsx({
                    [classes.leftMessage]: props.fromSender,
                  })}
                  size="small"
                  // onClick={moreOptions}
                >
                  <AiFillStar />
                </IconButton>
              ) : (
                ""
              )}
  
              {message.is_pinned ? (
                <IconButton
                  className={clsx({
                    [classes.leftMessage]: props.fromSender,
                  })}
                  size="small"
                >
                  <GiPin />
                </IconButton>
              ) : (
                ""
              )}
              {moment(message.created_date).format("h:mm a")}
            </Box>
            <Menu
              id="simple-menu"
              anchorEl={more}
              keepMounted
              open={Boolean(more)}
              onClose={handleClose}
            >
              <MenuItem
                className={classes.menuRoot}
                onClick={() => editMessage(message.id)}
              >
                Edit message
              </MenuItem>
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
              <MenuItem
                className={classes.menuRoot}
                onClick={() => deleteMessage(message.id, "everyone")}
              >
                Delete message
              </MenuItem>
              <MenuItem
                className={classes.menuRoot}
                onClick={() => pinMessage(message.id, message.is_pinned)}
              >
                {message.is_pinned ? "Unpin message" : "Pin message"}
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box
            className={clsx(classes.root, {
              [classes.rootSender]: props.fromSender,
            })}
            component="span"
          >
            <Box component="span" style={{ padding: "0px 9px" }}>
              <i>
                <b>this message is deleted</b>
              </i>
            </Box>
          </Box>
        )}
      </Box>
    );
  
    // return (
    //   <Box style={{ position: "relative", margin: "0px" }}>
    //     <Box
    //       className={clsx(classes.root, {
    //         [classes.rootSender]: props.fromSender,
    //       })}
    //       component="span"
    //     >
    //       <Box component="span" style={{ padding: "0px 9px" }}>
    //         {props.message.content}
    //       </Box>
    //       <IconButton
    //         style={{ color: "white" }}
    //         size="small"
    //         onClick={moreOptions}
    //       >
    //         <MdKeyboardArrowDown />
    //       </IconButton>
    //       <Box
    //         component="div"
    //         className={clsx(classes.timeSender, {
    //           [classes.time]: !props.fromSender,
    //         })}
    //       >
    //         {message.is_pinned ? (
    //           <IconButton
    //             style={{ color: "white", fontSize: "14px" }}
    //             size="small"
    //             onClick={moreOptions}
    //           >
    //             <GiPin />
    //           </IconButton>
    //         ) : (
    //           ""
    //         )}
    //         {moment(props.message.created_date).format("h:mm a")}
    //       </Box>
    //       <Menu
    //         id="simple-menu"
    //         anchorEl={more}
    //         keepMounted
    //         open={Boolean(more)}
    //         onClose={handleClose}
    //       >
    //         <MenuItem
    //           className={classes.menuRoot}
    //           onClick={() => editMessage(message.id)}
    //         >
    //           Edit message
    //         </MenuItem>
    //         <MenuItem className={classes.menuRoot}>Reply message</MenuItem>
    //         <MenuItem
    //           className={classes.menuRoot}
    //           onClick={() => starMessage(message.id, message.is_starred)}
    //         >
    //           {message.is_starred ? "Unstar Message" : "Star Message"}
    //         </MenuItem>
    //         <MenuItem
    //           className={classes.menuRoot}
    //           onClick={() => deleteMessage(message.id, message.is_deleted)}
    //         >
    //           Delete message
    //         </MenuItem>
    //         <MenuItem
    //           className={classes.menuRoot}
    //           onClick={() => pinMessage(message.id, message.is_pinned)}
    //         >
    //           {message.is_pinned ? "Unpin message" : "Pin message"}
    //         </MenuItem>
    //       </Menu>
    //     </Box>
    //   </Box>
    // );
  }
  
  export default ChatMessage;
  