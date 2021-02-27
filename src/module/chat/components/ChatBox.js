import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import { IconButton, Grid, Menu, MenuItem } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChatDrawer from "./ChatDrawer";
import { Box, Button, DialogContentText } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { CgNotes } from "react-icons/cg";
import { ChatTextField } from "./Theme/MuiComponents";
import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { useState } from "react";
import { appSync } from "../GraphQL/schema";
import gql from "graphql-tag";
import { BsFillMicFill } from "react-icons/bs";
import Card from "@material-ui/core/Card";
import { FcDocument } from "react-icons/fc";
import { awsFileUpload, awsLinkGenerate } from "../../../utils/file-uploader";
import axios from "axios";
import {
  addMessageToConversation,
  retrieveConversation,
  setConversationList,
  updateMessageStatus,
} from "../chatContainer/actions";
import store from "../../../store";
import _ from "lodash";
import { gqlClient } from "../config/request-client";
import Modal from "./utils/Modal";
import FilePicker from "./utils/FilePicker";
import Recorder from "./utils/Recorder";
import query from 'query-string'
import ChatInfo from "./ChatInfo";
import ProgressBar from "./utils/ProgressBar";
import ReplyMessage from "./utils/ReplyMessage";
import defaultImage from "../assets/images/Group 19583.svg";
import micIcon from "../icons/Group 17565.svg";
import ChatDrawerXl from "./ChatDrawerXl";
import SwipableDrawer from "./SwipableDrawer";
import { FiMoreVertical } from "react-icons/fi";
import { useChatContext } from "../contexts/chat-context";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { encryptMessage,decryptMesg } from "../config/encrypter-decrypter";


const drawerWidth = 0;

const useStyles = makeStyles((theme) => ({
  absoluteFooter: {
    top: "unset",
    bottom: "0px",
  },
  drawer: {
    position: "relative",
    width: `${drawerWidth}px`,
    float: "left",
    backgroundColor: "blue",
    height: "494px",
  },
  container: {
    height: "450px",
  },
  defaultText: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#03579c",
  },
  root: {
    display: "flex",
    marginTop: "29px",
  },
  appBar: {
    zIndex: 0,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  content: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "white",
    height: "507px",
    marginTop: "37px",
    overflow: "hidden",
    marginLeft: -drawerWidth,
    width: "100%",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginTop: "37px",
    marginLeft: 0,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },

  toolbarRoot: {
    backgroundColor: "white",
    color: "black",
  },
  avatarRoot: {
    float: "left",
  },
  conversationDetail: {
    paddingLeft: "10px",
    fontSize: "15px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },

  showDetailsRoot: {
    border: "2px solid #e0e0e0",
    fontSize: "11px",
    color: "#888997",
    borderRadius: "30px",
    padding: "5px 13px",
    textTransform: "none",
  },

  appBarBottom: {
    top: "auto",
    bottom: 0,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShiftBottom: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  content2: {
    backgroundColor: "white",
    alignItems: "center",
    display: "flex",
    height: "628px",
    justifyContent: "center",
    position: "relative",
    marginTop: "0px",
  },
  modalClass: {
    // width:"624px"
    // padding: "0px 164px",
  },
  reponsiveSideBar: {
    display: "block",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  buttonText: {
    display: "block",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  menuIcon: {
    display: "none",
    // [theme.breakpoints.down('xs')]: {
    //   display:"block"
    // },
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
}));

const ADD_MESSAGE = gql(appSync.mutations.addMessage());
const LIST_CONVERSATION = gql(appSync.queries.ListConversation());

function ChatBox(props) {
  const chatCtx=useChatContext()
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [conversationloading,setConversationLoading]=useState(false);

  // const listConversations = useSelector(
  //   (state) => state.chatContainer.conversationList
  // );
  const [status, setStatus] = useState("offline");

  const [activeUser, setActiveUser] = useState({});

  const { chatToken, userId, replayMessageObject } = useSelector((state) => {
    return {
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
      replayMessageObject: state.chatContainer.replayMessageObject,
    };
  });
  
  chatCtx.refreshConversationList = () => {
    setRefreshConversation(true)

    gqlClient
      .query(LIST_CONVERSATION, {
        token: chatToken,
        userId: userId,
      })
      .then(({ data: { listConversations }, loading }) => {
        store.dispatch(setConversationList(listConversations));
        setRefreshConversation(false)
      })
  }
  const history=useHistory()
  
  useEffect(()=>{
    const CREATE_CONVERSATION=gql(appSync.mutations.createConversation());
      let instructor=history.location.pathname.split('/')[2]
      let type=query.parse(history.location.search).type
      
      console.log('CONVERSATION TYPE: ',type)
      console.log('CONVERSATION INSTRUCTOR ID: ',instructor)
      
      if(!_.isUndefined(type) && type=='user'){
        gqlClient.mutate(CREATE_CONVERSATION,{
          token: chatToken,
          user_id: userId,
          profile_url:null, 
          type:type,
          member_ids:[
            instructor
          ],
        })
        .then(({ data: { createConversation } }) => {
          console.log('CREATE CONVERSATION MUTATION DATA: ',createConversation)
          loadConversation(createConversation.id,type)
        })
      }else
      if(!_.isUndefined(type) && type=='group'){
        loadConversation(instructor,type)
      }else
      if(!_.isUndefined(type) && type=='notification'){
        loadConversation(instructor,'user')
      }
  },[])

  const loadConversation = (conversation_id, type) => {
    chatCtx.loading(true);
    const RETRIEVE_CONVERSATION = gql(appSync.queries.retrieveConversation());

    gqlClient
      .query(RETRIEVE_CONVERSATION, {
        token: chatToken,
        conversation_id: conversation_id,
        type: type,
        user_id: userId,
      })
      .then((data) => {
        if (!_.isNull(data.data.listMessages.items)) {
          chatCtx.activeConversationId=conversation_id

          data.data.listMessages.items.sort((a, b) => {
            return b.created_date - a.created_date;
          });
          store.dispatch(retrieveConversation(data.data));
          // props.updateConversation();
          chatCtx.loading(false);
        } else {
          store.dispatch(
            retrieveConversation({
              ...data.data,
              listMessages: { items: [], next_token: null },
            })
          );
          chatCtx.loading(false);
        }
      });
  };

  chatCtx.loading=(loading)=>{
    setConversationLoading(loading)
  }

  const changeStatus = (mode) => {
    setStatus(mode);
  };

  // useEffect(() => {
  // if (!_.isUndefined(chatToken)) {
  //   gqlClient
  //     .query(LIST_CONVERSATION, {
  //       token: chatToken,
  //       userId: userId,
  //     })
  //     .then(({ data: { listConversations }, loading }) => {
  //       store.dispatch(setConversationList(listConversations));
  //       setLoading(loading);
  //     })
  //     .catch((er) => {
  //       setLoading(false);
  //     });
  // }
  // }, [userId, chatToken]);

  let state = useSelector((state) => ({
    listofMessages: state.chatContainer.chatData.listMessages,
    retrieveConversation: state.chatContainer.chatData.retrieveConversation,
    listMessages: state.chatContainer.chatData.listMessages,
    chatDataloading: state.chatContainer.chatDataloading,
  }));
  
  const notification = useSnackbar();

  useEffect(() => {
    if (!_.isUndefined(state.retrieveConversation.members))
      state.retrieveConversation.members.filter((item) => {
        if (item.id === userId) {
          setActiveUser(item);
        }
      });
  }, [state.retrieveConversation]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log('chatCtx: ',chatCtx)
    setChatInfoToogler(false)
    console.log("Chat Box Compoent Render");
  },[state.retrieveConversation.id]);

  const [message, setMessage] = useState("");
  const [isSending, setSendingProcess] = useState(false);

  const messageHandler = (event) => {
    setMessage(event.target.value);
  };

  const getMediaForQuery = (selectedFile) => {
    switch (selectedFile.type) {
      case "image":
        return [
          {
            type: selectedFile.type,
            file_path: selectedFile.path,
          },
        ];

      case "video":
        awsFileUpload(
          selectedFile.thumbnail.signedUrl,
          selectedFile.thumbnail.file
        );
        return [
          {
            type: selectedFile.type,
            thumbnail_path: selectedFile.thumbnail.path,
            file_path: selectedFile.path,
          },
        ];

      case "document":
        return [
          {
            type: selectedFile.type,
            file_path: selectedFile.path,
          },
        ];

      case "audio":
        return [
          {
            type: selectedFile.type,
            file_path: selectedFile.path,
          },
        ];

      default:
        return null;
    }
  };

  const isSendSuccessfully = (newMessageData) => {
    console.log("Message Send Successfully: ", newMessageData);
    store.dispatch(addMessageToConversation(newMessageData));
  };

  const sendMessage = ({ messageType, hasMedia }) => {
    let replay_id = null;
    setSendingProcess(true);
    setMessage("");

    if (replayMessageObject.replayStatus) {
      replay_id = replayMessageObject.message.id;
    }

    replayMessageObject.replayStatus = false;

    let media = null;
    console.log("listofMessages.items.length: ",state.listofMessages.items.length)
      
    if (hasMedia) { 
       axios
        .put(selectedFile.signedUrl, selectedFile.file, {
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          },
        })
        .then((data) => {
          media = getMediaForQuery(selectedFile);
          gqlClient
            .mutate(ADD_MESSAGE, {
              message: null,
              token: chatToken,
              user_id: userId,
              conversation_id: state.retrieveConversation.id,
              type: messageType,
              reply_message_id: replay_id,
              media: media,
              status: status,
            })
            .then((data) => {
              if(state.listofMessages.items.length==0)
                chatCtx.refreshConversationList()
              console.log("SET MEDJ: ", message);
              setModal(false);
              setUploadPercentage(0);
            })
            .catch((er) => {
              console.log("Message Not Sent: ", er);
            });
        })
        .catch((er) => {
          setSendingProcess(false);
          notification.enqueueSnackbar(er.message, {
            variant: "error",
            autoHideDuration: 2000,
          });
          console.log("Exception: ", er);
        });
    } else {
      if(message)
        gqlClient
          .mutate(ADD_MESSAGE, {
            message: encryptMessage(message),
            token: chatToken,
            user_id: userId,
            conversation_id: state.retrieveConversation.id,
            reply_message_id: replay_id,
            type: messageType,
            media: media,
            status: status,
          })
          .then((data) => {
            setMessage("");
            setModal(false);
            setUploadPercentage(0);
            
            if(state.listofMessages.items.length==0)
              chatCtx.refreshConversationList()
          })
          .catch((er) => {
            notification.enqueueSnackbar(er.message, {
              variant: "error",
              autoHideDuration: 2000,
            });
            console.log("Message Not Sent: ", er);
          });
    }
  };

  const [modal, setModal] = useState(false);
  const [modaltype, setModalType] = useState("loader");
  const [recordModal, setRecordModal] = useState(false);

  const modalStatusUpdated = () => {
    setSrc(null);
    setModal(false);
    setRecordModal(false);
  };

  const inputRef=useRef({focus:()=>{}});

  useEffect(()=>{
    if(inputRef.current)
      inputRef.current.focus()
  })

  const mediaPreview = useRef();
  const [src, setSrc] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [selectedFile, setSelectedFile] = useState({
    file: {},
    mime: null,
    name: null,
    path: null,
    signedUrl: null,
    thumbnail: {},
    type: null,
  });
  const [more, setMore] = React.useState(null);
  const [chatInfoToogler, setChatInfoToogler] = useState(false);
  const [pinnedTabStatus, setPinnedTabStatus] = useState(false);
  const [refreshConversation,setRefreshConversation]=useState(false);

  const filesHandler = async (file, type) => {
    setSrc(null);
    setModalType("loader");
    if (!_.isUndefined(file)) {
      setRecordModal(false);
      setModal(!modal);
      let link = await awsLinkGenerate(file, type, userId);
      setSrc(URL.createObjectURL(file));
      setFileType(type);
      setSelectedFile(link);
      setModalType("default");
    }
  };

  const leaveGroup = () => {
    setActiveUser({
      ...activeUser,
      is_deleted: true,
    });
  };

  const updateMessageSeen = () => {
    // let updatedMessageStatus =

    // state.listMessages.items.map((message) => {
    //   return {
    //     ...message,
    //     status: "seen",
    //   };
    // });

    // console.log("updatedMessageStatus: ",state.listMessages);

    // setConversationMessages({...props.Conversation,items:updatedMessageStatus})
    // console.log(
    //   "conversationMessages updateMessageSeen: ",
    //   conversationMessages
    // );

    store.dispatch(updateMessageStatus());
  };

  const moreOptions = (event) => {
    setMore(event.currentTarget);
  };

  const handleClose = () => {
    setMore(null);
  };

  const MediaRender = () => { 
    if (_.isNull(src)) {
      return "loading...";
    }

    switch (fileType) {
      case "image":
        return (
          <img
            alt={src}
            ref={mediaPreview}
            src={src}
            style={{ width: "100%" }}
          />
        );
      case "video":
        return (
          <video width="100%" height="100%" controls>
            <source src={src} type="video/mp4" />
          </video>
        );
      case "document":
        return (
          <Card>
            <FcDocument />{" "}
            <a style={{textDecoration:"none",marginRight:"21px",padding:"0px 9px"}} href={src} target="_blank">
              Document
            </a>
          </Card>
        );
      case "audio":
        return (
          <audio style={{ width: "340px", height: "46px" }} controls>
            <source src={src} type="audio/mpeg" />
          </audio>
        );
      default:
        return (
          <Card>
            <FcDocument />{" "}
            <a href={src} target="_blank">
              Document
            </a>
          </Card>
        );
    }
  };

  
  // useEffect(()=>{
  //   let encryptMsg=encryptMessage('HI');
  //   console.log("ENABLE ENCPRY MESSSH",encryptMsg)
  //   console.log("ENABLE Decrypt MESSSH",decryptMesg(encryptMsg))
  // },[])

  const keyPressEvent=(event)=>{
    var code = event.keyCode || event.which;
    if(code === 13) { 
      sendMessage({
        messageType: "text",
        hasMedia: false,
      })
    } 
  }

  if (loading) {
    return "loading...";
  }

  return (
    <>
      <Modal
        title="Preview"
        statusUpdated={modalStatusUpdated}
        successButton={() =>
          sendMessage({ messageType: "media", hasMedia: true })
        }
        modaltype={modaltype}
        status={modal}
      >
        <DialogContentText>
          {!_.isNull(src) && isSending ? (
            <>
              {" "}
              <ProgressBar percentage={uploadPercentage} /> <br />
            </>
          ) : (
            ""
          )}

          {MediaRender()}
        </DialogContentText>
      </Modal>

      <Modal
        title="Recorder"
        statusUpdated={modalStatusUpdated}
        successButton={
          () => //alert("ok")
          sendMessage({ messageType: "media", hasMedia: true })
        }
        status={recordModal}
        style={{ minWidth: "450px" }}
      >
        <DialogContentText className={classes.modalClass}>
          <Recorder fileHandler={(file, type) => filesHandler(file, type)} />
        </DialogContentText>
      </Modal>

      {/* <ChatDrawer status={open} handleDrawerClose={handleDrawerClose} /> */}
      {/* <SwipableDrawer
        isPinnedShow={pinnedTabStatus}
        status={open}
        handleDrawerClose={handleDrawerClose}
      /> */}

      <Grid
        container
        style={{
          padding: "30px 30px 50px 30px",
          // bottom: "0px",
          // left:"0px",
          // right:"0px",
          // position: "absolute",
          // height: "100%",
          // overflowX: "hidden",
        }}
      >
        <Grid
          item
          sm={3}
          style={{
            border: "1px solid #d7dae2",
            boxSizing: "border-box",
          }}
          className={classes.reponsiveSideBar}
        >
          <ChatDrawerXl refreshState={refreshConversation} togglePinned={()=>setPinnedTabStatus(false)} listTypePinned={pinnedTabStatus} />
        </Grid>
        <Grid item sm={9} style={{borderBottom:"1px solid #d7dae2",borderTop:"1px solid #d7dae2",borderRight:"1px solid #d7dae2"}}>
        {state.chatDataloading ? (
              <>
                <AppBar
                  position="relative"
                  elevation={0}
                  className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                  })}
                >
                  <Toolbar className={classes.toolbarRoot}>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerToggle}
                      edge="start"
                      className={clsx(classes.menuIcon, classes.menuButton)}
                    >
                      <MenuIcon />
                    </IconButton>
                    <div style={{ width: "100%" }}>
                      <Box display="flex">
                        {/* <Box flexGrow={1}>
                          <Avatar
                            className={classes.avatarRoot}
                            src={state.retrieveConversation.profile_url}
                          />
                          <Box className={classes.conversationDetail}>
                            <Box
                              component="span"
                              style={{ fontWeight: 600, fontSize: "13px" }}
                            >
                              {state.retrieveConversation.name}
                            </Box>
                            <Box component="span" style={{ fontSize: "12px" }}>
                              Yoga Expert
                            </Box>
                          </Box>
                        </Box> */}
                        {state.chatDataloading ? (
                          ""
                        ) : (
                          <>
                            <Box>
                              <Button
                                className={classes.showDetailsRoot}
                                startIcon={<CgNotes />}
                                variant="text"
                                color="primary"
                                onClick={() =>
                                  setChatInfoToogler(!chatInfoToogler)
                                }
                              >
                                {chatInfoToogler ? "Hide" : "Show"} Details Not Working
                              </Button>
                            </Box>
                            <Box>
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
                                <MenuItem
                                  className={classes.menuRoot}
                                >
                                 Pinned message Not Working
                                </MenuItem>
                              </Menu>
                            </Box>
                          </>
                        )}
                      </Box>
                    </div>
                  </Toolbar>
                  <Divider style={{ backgroundColor: "#e0e0e0" }} />
                </AppBar>
                <main
                  style={{ backgroundColor: "white",height:"515px",textAlign:"center"}}
                  className={clsx(classes.content, classes.content2, {
                    [classes.contentShift]: open,
                  })}
                >
                  <Box>
                    <img src={defaultImage} />
                    <Box className={classes.defaultText}>
                      You can chat with instructor here
                    </Box>
                  </Box>
                </main>
              </>
            ) : (
              <>
                <AppBar
                  position="relative"
                  elevation={0}
                  className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                  })}
                >
                  <Toolbar className={classes.toolbarRoot}>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerToggle}
                      edge="start"
                      className={clsx(classes.menuIcon, classes.menuButton)}
                    >
                      <MenuIcon />
                    </IconButton>
                    <div style={{ width: "100%" }}>
                      <Box display="flex">
                      <Box style={{ alignSelf: "center" }}>
                        <Avatar
                            className={classes.avatarRoot}
                            src={state.retrieveConversation.profile_url}
                          />
                         
                        </Box>
                        <Box flexGrow={1} style={{ alignSelf: "center", fontWeight: 600, fontSize: "13px",paddingLeft:"10px"  }}>
                        {state.retrieveConversation.name}
                        </Box>
                        {/* <Box flexGrow={1}>
                          <Avatar
                            className={classes.avatarRoot}
                            src={state.retrieveConversation.profile_url}
                          />
                          <Box alignContent="center" className={classes.conversationDetail}>
                            <Box
                              component="span"
                              style={{ fontWeight: 600, fontSize: "13px" }}
                            >
                              {state.retrieveConversation.name}
                            </Box>
                            <Box component="span" style={{ fontSize: "12px" }}>
                              Yoga Expert
                            </Box>
                          </Box>
                        </Box> */}
                        {state.chatDataloading ? (
                          ""
                        ) : (
                          <>
                            <Box style={{ alignSelf: "center" }}>
                              <Button
                                className={classes.showDetailsRoot}
                                startIcon={<CgNotes />}
                                variant="text"
                                color="primary"
                                onClick={() =>
                                  setChatInfoToogler(!chatInfoToogler)
                                }
                              >
                                <Box component="span" className={classes.buttonText}>{chatInfoToogler ? "Hide" : "Show"} Details </Box>
                              </Button>
                            </Box>
                            <Box style={{alignSelf:"center"}}>
                              <IconButton size="small" onClick={moreOptions}>
                                <FiMoreVertical />
                              </IconButton>
                              <Menu
                                style={{marginTop:"40px",marginLeft:"-40px"}}
                                id="simple-menu"
                                anchorEl={more}
                                keepMounted
                                open={Boolean(more)}
                                onClose={handleClose}
                              >
                                <MenuItem
                                  className={classes.menuRoot}
                                  onClick={() => {
                                    console.log('pinnedTabStatus: ',pinnedTabStatus)
                                    setPinnedTabStatus(!pinnedTabStatus)
                                    setMore(false);
                                  }}
                                >
                                  Pinned messages
                                </MenuItem>
                              </Menu>
                            </Box>
                          </>
                        )}
                      </Box>
                    </div>
                  </Toolbar>
                  <Divider style={{ backgroundColor: "#e0e0e0" }} />
                </AppBar>
                <Box
                  className={clsx(classes.container, classes.appBar, {
                    [classes.appBarShift]: open,
                  })}
                >
                  {chatInfoToogler ? (
                    <ChatInfo
                      isGroupLeaved={activeUser.is_deleted}
                      leaveGroup={leaveGroup}
                      type={state.retrieveConversation.type}
                      conversationInfo={state.retrieveConversation}
                    />
                  ) : (
                    <Conversation
                      loading={conversationloading}
                      updateMessageSeen={updateMessageSeen}
                      pinnedChangeStatus={()=>setPinnedTabStatus(!pinnedTabStatus)}
                      changeStatus={(mode) => changeStatus(mode)}
                      conversation={state.listMessages}
                      status={isSendSuccessfully}
                    />
                  )}
                </Box>
                {!chatInfoToogler ? (
                  <AppBar
                    position="relative"
                    style={{
                      backgroundColor: "white",
                      boxShadow: "none",
                      borderTop: "1px solid #e0e0e0",
                    }}
                    className={clsx(classes.appBarBottom, {
                      [classes.appBarShiftBottom]: open,
                    })}
                  >
                    <Toolbar>
                      <Box
                        display="flex"
                        flexDirection="column"
                        style={{ width: "100%" }}
                      >
                        <ReplyMessage message={replayMessageObject} />

                        {activeUser.is_deleted ? (
                          <Box style={{ color: "#52534f" }}>
                            You can't send message to this group because you're
                            no longer a participant
                          </Box>
                        ) : (
                          <Box display="flex">
                            <ChatTextField
                              placeholder="Type Something"
                              inputProps={{
                                style: { paddingLeft: 10 },
                                value: message,
                                ref:inputRef
                              }}

                              onKeyPress={keyPressEvent}
                              endAdornment={
                                <>
                                  <FilePicker
                                    fileHandler={(file, type) =>
                                      filesHandler(file, type)
                                    }
                                  />
                                  <IconButton
                                    onClick={() => setRecordModal(true)}
                                    color="inherit"
                                    size="small"
                                  >
                                    <img
                                      src={micIcon}
                                      style={{ padding: "0px 4px" }}
                                    />
                                  </IconButton>
                                </>
                              }
                              onChange={messageHandler}
                            />
                            <Button
                              variant="contained"
                              onClick={() =>
                                sendMessage({
                                  messageType: "text",
                                  hasMedia: false,
                                })
                              }
                              style={{
                                backgroundColor: "#e65d29",
                                padding: "3px",
                                marginLeft: "10px",
                                color: "white",
                              }}
                            >
                              SEND
                            </Button>
                          </Box>
                        )}
                      </Box>
                      {/* </Box> */}
                    </Toolbar>
                  </AppBar>
                ) : (
                  ""
                )}
              </>
            )}
        </Grid>
      </Grid>
    </>
  );
}

export default ChatBox;
