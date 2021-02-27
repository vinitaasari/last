import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
  CardActionArea,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { AiFillStar } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import moment from "moment";
import _, { ceil } from "lodash";
import { BiChevronRight } from "react-icons/bi";
import { BiChevronLeft } from "react-icons/bi";
import { useSelector } from "react-redux";
import { gqlClient } from "../config/request-client";
import { appSync } from "../GraphQL/schema";
import gql from "graphql-tag";
import useCallbackStatus from "../../../hooks/use-callback-status";
import useCancelRequest from "../../../hooks/useCancelRequest";
import { apiClient } from "../../../utils/api-client";
import CustomCarousel from "../../../components/carousel/CarouselChat";
import { Link, useHistory } from "react-router-dom";
import Modal from "./utils/Modal";

const useStyles = makeStyles((theme) => ({
  heading: {
    fontFamily: "Work Sans, sans-serif",
    fontSize: "16px",
    fontWeight: "600",
  },
  info: {
    lineHeight: "1.75",
    fontSize: "14px",
    color: "#8d9091",
  },
  rootList: {
    height: "213px",
    overflow: "auto",
  },
  infoDetails: {
    fontWeight: 500,
    color:"#47484a"
  },
  sliderBtn: {
    width: "34px",
    height: "34px",
    marginRight: "10px",
    border: "solid 1px #b2b2b2",
  },
  sectionHeading: {
    color: "#3F3F3F",
    fontSize: "26px",
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "22px",
    },
  },
  header: {
    fontSize: "14px",
    fontWeight: 600,
    color: "black",
    padding: "12px 0px",
  },
  carousel: {
    maxWidth: "1190px",
    // [theme.breakpoints.down('sm')]: {
    //     maxWidth:"348px"
    // },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "604px",
    },
  },
}));

function ChatInfo(props) {
  const [conversation, setConversation] = useState();
  const [type, setType] = useState();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [chatCourses, setCourses] = useState([]);
  const getCourses = useCallbackStatus();
  const apiSource = useCancelRequest();
  const history = useHistory();
  const notification = useSnackbar();
  const [chatConversationLoader,setChatConversationLoader]=useState(true);

  useEffect(() => {
    setConversation(props.conversationInfo);

    setType(props.type);
  }, [props.type, props.conversationInfo]);

  const {
    chatToken,
    userId,
    replayMessageObject,
    retrieveConversation,
  } = useSelector((state) => {
    return {
      retrieveConversation: state.chatContainer.chatData.retrieveConversation,
      chatToken: state.chatContainer.chatToken.token,
      userId: state.chatContainer.userData.id,
      replayMessageObject: state.chatContainer.replayMessageObject,
    };
  });

  const getChatCourses = async () => {
    if (retrieveConversation.type == "group") {
      try {
        const res = await getCourses.run(
          apiClient("POST", "course_management", "getconversationmoredetails", {
            body: {
              conversation_id: retrieveConversation.id,
              // instructor_id: userId
            },
            shouldUseDefaultToken: false,
            cancelToken: apiSource.token,
          })
        );

        const {
          content: { data },
        } = res;

      

        setCourses([data]);
        if(res){
          setChatConversationLoader(false)
        }
        console.log("CHAT INFO Courses DATA: ", data);
      } catch (error) {
        console.log("Something went Wrong: ", error);
        setChatConversationLoader(false)
        // notification.enqueueSnackbar(error.message, {
        //   variant: "error",
        //   autoHideDuration: 2000,
        // });
      }
    } else {
      // console.log(
      //   "CHAT COnversation INfo  retrieveConversation: ",
      //   retrieveConversation
      // );
      // console.log(
      //   "CHAT COnversation INfo  lEarner ID ONe to One: ",
      //   conversation
      // );
      console.log("CHAT COnversation INfo Instructor ID ONe to One: ", 
              {
                learner_id:userId,
                instructor_id: retrieveConversation.user.id,
              });
      try {
        const res = await getCourses.run(
          apiClient(
            "POST",
            "course_management",
            "getconversationallcoursedetails",
            {
              body: {
                learner_id:userId,
                // learner_id: retrieveConversation.members[0].id,
                instructor_id: retrieveConversation.user.id,
              },
              shouldUseDefaultToken: false,
              cancelToken: apiSource.token,
            }
          )
        );

        const {
          content: { data },
        } = res;

        setCourses(data);
        
        if(res){
          setChatConversationLoader(false)
        }
        
        console.log("CHAT INFO Courses DATA ONe to One: ", data);
      } catch (error) {
       
        setChatConversationLoader(false)
        console.log("Something went Wrong: ", error);
        // notification.enqueueSnackbar(error.message, {
        //   variant: "error",
        //   autoHideDuration: 2000,
        // });
      }
    }
  };

  useEffect(() => {
    if (!_.isUndefined(conversation)) {
      getChatCourses();
      setLoading(false);
    }
  }, [conversation]);

  const loadCourseDetails = () => {
    return (
      <CustomCarousel
        heading={<Box className={classes.heading}>Course Details</Box>}
        itemsToDisplay={2}
        dataLength={ceil(chatCourses.length / 2)}
        chatConversationLoader={chatConversationLoader}
        noDataMsg="No Courses Available"
      >
        {chatCourses.map((course, index) => {
          {
            
            console.log("retrieveConversation.type Data: ", retrieveConversation.type);
            console.log("course Data: ", course);
          }
          return (
            <Box>
               {/* {retrieveConversation.type == "group" ? (
                  <Card
                  variant="outlined"
                  style={{
                    boxShadow: "none",
                    marginRight: "10px",
                  }}
                >
                  <CardActionArea
                    style={{ display: "flex" }}
                    onClick={() => {
                      console.log("Card Course: ", course);
                      let link=''

                      if(course.type=="slot_course"){
                        link = `/course-detail/slot/${course.course_id}`;
                      }else
                        link = `/course-detail/structured/${course.course_id}`;
                      
                      history.push(link);
                    }}
                  >
                    <Box style={{height:"100%"}}>
                      <img
                        style={{ height: "100%", width: "110px" }}
                        src={course.course_image_url}
                      />
                    </Box>
                    <Box display="flex" flexDirection="column" flexGrow="1">
                      <Box style={{ color: "#393a45", padding: "15px" }}>
                        <Box style={{ fontSize: "15px", fontWeight: 600,padding:"6px 0px" }}>
                          {course.course_title}
                        </Box>
                        <Box style={{ fontSize: "14px" }}>
                          {course.course_tag_line}
                        </Box>
                        <Box style={{ fontSize: "13px",paddingTop:"6px" }}>
                          <Box alignItems="center" style={{ display:"flex",fontSize: "13px" }}>
                            <Box
                              style={{
                                paddingTop: "3px",
                              }}
                            >
                              <AiFillStar style={{ color: "#ffb833" }} />&nbsp;
                            </Box>
                            <Box>{course.instructor_rating==0?` New`:`${course.instructor_rating}/5`} </Box>
                          </Box>
                        </Box>
                      </Box>
                      <CardActions
                        style={{
                          display: "flex",
                          paddingLeft: "14px",
                          alignItems: "center",
                          paddingBottom: "8px",
                          borderTop: "1px solid #e0e0e0",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        <Box style={{ textTransform: "uppercase" }}>
                          {moment.unix(course.start_time).format("D MMM H:mm")}{" "}
                          - {moment.unix(course.end_time).format("H:mm A")}{" "}
                        </Box>
                      </CardActions>
                    </Box>
                  </CardActionArea>
                </Card>
              ) : (
                <Card
                  variant="outlined"
                  style={{
                    boxShadow: "none",
                    marginRight: "10px",
                  }}
                >
                  <CardActionArea
                    style={{ display: "flex" }}
                    onClick={() => {
                      let link=''

                      if(course.type=="slot_course"){
                        link = `/course-detail/slot/${course.id}`;
                      }else
                        link = `/course-detail/structured/${course.id}`;
                      
                      history.push(link);
                    }}
                  >
                    <Box style={{height:"100%"}}>
                      <img
                        style={{ height: "100%", width: "110px" }}
                        src={course.image_url}
                      />
                    </Box>
                    <Box display="flex" flexDirection="column" flexGrow="1">
                      <Box style={{ color: "#393a45", padding: "15px" }}>
                        <Box style={{ fontSize: "15px", fontWeight: 600,padding:"6px 0px" }}>
                          {course.title}
                        </Box>
                        <Box style={{ fontSize: "14px" }}>
                          {course.tag_line}
                        </Box>
                        <Box style={{ fontSize: "13px",paddingTop:"6px" }}>
                          <Box alignItems="center" style={{ display:"flex",fontSize: "13px" }}>
                            <Box
                              style={{
                                paddingTop: "3px",
                              }}
                            >
                              <AiFillStar style={{ color: "#ffb833" }} />&nbsp;
                            </Box>
                            <Box>{course.instructor_rating==0?` New`:`${course.instructor_rating}/5`} </Box>
                          </Box>
                        </Box>
                      </Box>
                      <CardActions
                        style={{
                          display: "flex",
                          paddingLeft: "14px",
                          alignItems: "center",
                          paddingBottom: "8px",
                          borderTop: "1px solid #e0e0e0",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        <Box style={{ textTransform: "uppercase" }}>
                          {moment.unix(course.course_start_time).format("D MMM H:mm")}{" "}
                          - {moment.unix(course.course_end_time).format("H:mm A")}{" "}
                        </Box>
                      </CardActions>
                    </Box>
                  </CardActionArea>
                </Card>
                )} */}
              {retrieveConversation.type == "group" ? (
                <Card
                  variant="outlined"
                  style={{
                    boxShadow: "none",
                    marginRight: "10px",
                  }}
                >
                  <CardActionArea
                    style={{ display: "flex" }}
                    onClick={() => {
                      console.log("Card Course: ", course);
                      let link=''

                      if(course.type=="slot_course"){
                        link = `/course-detail/slot/${course.course_id}`;
                      }else
                        link = `/course-detail/structured/${course.course_id}`;
                      
                      history.push(link);
                    }}
                  >
                    <Box>
                      <img
                        style={{ height: "100%", width: "110px" }}
                        src={course.course_image_url}
                      />
                    </Box>
                    <Box display="flex" flexDirection="column" flexGrow="1">
                      <Box style={{ color: "#393a45", padding: "15px" }}>
                        <Box style={{ fontSize: "15px", fontWeight: 600 }}>
                          {course.course_title}
                        </Box>
                        <Box style={{ fontSize: "14px" }}>
                          {course.course_tag_line}
                        </Box>
                        <Box style={{ fontSize: "13px",paddingTop:"6px"}}>
                          <Box
                            style={{
                              display: "inline",
                              float: "left",
                              paddingTop: "3px",
                              paddingRight: "6px",
                            }}
                          >
                            <AiFillStar style={{ color: "#ffb833" }} />
                          </Box>
                          <Box>{course.instructor_rating==0?` New`:`${course.instructor_rating}/5`} </Box>
                        </Box>
                      </Box>
                      <CardActions
                        style={{
                          display: "flex",
                          paddingLeft: "14px",
                          alignItems: "center",
                          paddingBottom: "8px",
                          borderTop: "1px solid #e0e0e0",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        <Box style={{ textTransform: "uppercase" }}>
                          {moment.unix(course.course_start_time).format("D MMM H:mm")}{" "}
                          - {moment.unix(course.course_end_time).format("H:mm A")}{" "}
                        </Box>
                      </CardActions>
                    </Box>
                  </CardActionArea>
                </Card>
              ) : (
                <Card
                  variant="outlined"
                  style={{
                    display: "flex",
                    boxShadow: "none",
                    marginRight: "10px",
                  }}
                >
                  <CardActionArea style={{display:"flex"}} onClick={() => {
                     let link=''

                     if(course.type=="slot_course"){
                       link = `/course-detail/slot/${course.id}`;
                     }else
                       link = `/course-detail/structured/${course.id}`;
                     
                     history.push(link);
                    }}>
                  <Box>
                    <img
                      style={{ height: "100%", width: "110px" }}
                      src={course.image_url}
                    />
                  </Box>
                  <Box display="flex" flexDirection="column" flexGrow="1">
                    <Box style={{ color: "#393a45", padding: "15px" }}>
                      <Box style={{ fontSize: "15px", fontWeight: 600 }}>
                        {course.title}
                      </Box>
                      <Box style={{ fontSize: "14px" }}>{course.tag_line}</Box>
                      <Box style={{ fontSize: "13px" }}>
                        <Box
                          style={{
                            display: "inline",
                            float: "left",
                            paddingTop: "3px",
                            paddingRight: "6px",
                          }}
                        >
                          <AiFillStar style={{ color: "#ffb833" }} />
                        </Box>
                        <Box>{course.instructor_rating==0?` New`:`${course.instructor_rating}/5`} </Box>
                      </Box>
                    </Box>
                    <CardActions
                      style={{
                        display: "flex",
                        paddingLeft: "14px",
                        alignItems: "center",
                        paddingBottom: "8px",
                        borderTop: "1px solid #e0e0e0",
                        fontWeight: 600,
                        fontSize: "14px",
                      }}
                    >
                      <Box style={{ textTransform: "uppercase" }}>
                        {moment
                          .unix(course.course_start_time)
                          .format("D MMM H:mm")}{" "}
                        - {moment.unix(course.course_end_time).format("H:mm A")}{" "}
                      </Box>
                    </CardActions>
                  </Box>
                  </CardActionArea>
                </Card>
              )}
            </Box>
          );
        })}
      </CustomCarousel>
    );
  };

  const leaveGroup = () => {
    const REMOVE_MEMBER = gql(appSync.mutations.removeMember());
    gqlClient
      .mutate(REMOVE_MEMBER, {
        token: chatToken,
        conversation_id: retrieveConversation.id,
        member_id: userId,
        user_id: userId,
      })
      .then(({ data: { subscribeToRemoveMember } }) => {
        console.log("REMOVE MEMBER: ", subscribeToRemoveMember);
        props.leaveGroup();
      });
  };

  const [learnerData, setLearnerData] = useState({});

  const viewProfile = async (learner_id) => {
    // alert('id: '+learner_id)
    try {
      const res = await getCourses.run(
        apiClient("POST", "learner", "getlearnerbyid", {
          body: {
            id: learner_id,
            // instructor_id: userId
          },
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
        })
      );

      const {
        content: { data },
      } = res;

      setLearnerData(data);
      console.log("Something DATA: ", _.map(data.interests, "name").join());
    } catch (error) {
      console.log("Something went Wrong: ", error);
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }

    viewProfileToggler();
  };

  const [viewProfileModal, setProfileModal] = useState(false);

  const viewProfileToggler = () => {
    setProfileModal(!viewProfileModal);
  };

  if (loading) return "loading...";

  return (
    <>
      <Modal
        disableTitle={true}
        status={viewProfileModal}
        statusUpdated={viewProfileToggler}
        enableTopClose={true}
      >
        <Grid container>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={learnerData.profile_url}
                style={{ height: "100px", width: "100px" }}
              />
              <Box
                style={{
                  fontSize: "15px",
                  paddingTop: "12px",
                  fontWeight: 500,
                }}
              >
                {learnerData.first_name} {learnerData.last_name} |{" "}
                {learnerData.age} yrs
              </Box>
            </Box>
            <br />
            <Divider />
          </Grid>
          <Grid item xs={12} className={classes.header}>
            PERSONAL DETAILS
            <Box
              component="span"
              style={{
                display: "flex",
                background: "#03579c",
                width: "115px",
                color: "#03579c",
                fontSize: "2px",
                paddingTop: "1px",
                marginTop: "4px",
              }}
            >
              aa
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Box className={classes.info}>First Name</Box>
                <Box className={classes.infoDetails}>
                  {learnerData.first_name}
                </Box>
              </Box>
              <Box>
                <Box className={classes.info}>Last Name</Box>
                <Box className={classes.infoDetails}>
                  {learnerData.last_name}
                </Box>
              </Box>
              <Box>
                <Box className={classes.info}>Age</Box>
                <Box className={classes.infoDetails}>{learnerData.age}</Box>
              </Box>
              <Box>
                <Box className={classes.info}>Gender</Box>
                <Box className={classes.infoDetails}>{learnerData.gender}</Box>
              </Box>
              <Box>
                <Box className={classes.info}>Country</Box>
                <Box className={classes.infoDetails}>{learnerData.country}</Box>
              </Box>
            </Box>
            <br />
            <Divider />
          </Grid>

          <Grid item xs={12} className={classes.header}>
            INTEREST
            <Box
              component="span"
              style={{
                display: "flex",
                background: "#03579c",
                width: "58px",
                color: "#03579c",
                fontSize: "2px",
                paddingTop: "1px",
                marginTop: "4px",
              }}
            >
              aa
            </Box>
          </Grid>
          <Grid item xs={12} className={classes.infoDetails}>
            {_.map(learnerData.interests, "name").join(", ")}
          </Grid>
        </Grid>
      </Modal>
      <Box style={{ overflowX: "hidden", overflowY: "hidden", height: "113%" }}>
        <Container className={classes.carousel}>
          <Box mt={4}>{loadCourseDetails()}</Box>
        </Container>
        {/*<Box display="flex">*/}
        {/*    <Box>*/}
        {/*        <Card*/}
        {/*            variant="outlined"*/}
        {/*            style={{ display: "flex", boxShadow: "none" }}*/}
        {/*        >*/}
        {/*            <Box>*/}
        {/*                <img*/}
        {/*                    style={{ height: "100%", width: "110px" }}*/}
        {/*                    src="https://images.newindianexpress.com/uploads/user/imagelibrary/2020/3/29/w1200X800/cxvxcv.jpg"*/}
        {/*                />*/}
        {/*            </Box>*/}
        {/*            <Box display="flex" flexDirection="column" flexGrow="1">*/}
        {/*                <Box style={{ color: "#393a45", padding: "15px" }}>*/}
        {/*                    <Box style={{ fontSize: "15px", fontWeight: 600 }}>Yoga</Box>*/}
        {/*                    <Box style={{fontSize:"14px"}}>Get Stronger Body</Box>*/}
        {/*                    <Box style={{fontSize:"13px"}}>*/}
        {/*                        <Box*/}
        {/*                            style={{*/}
        {/*                                display: "inline",*/}
        {/*                                float: "left",*/}
        {/*                                paddingTop: "3px",*/}
        {/*                                paddingRight: "6px",*/}
        {/*                            }}*/}
        {/*                        >*/}
        {/*                            <AiFillStar style={{ color: "#ffb833" }} />*/}
        {/*                        </Box>*/}
        {/*                        <Box>4.5/5 (123)</Box>*/}
        {/*                    </Box>*/}
        {/*                </Box>*/}
        {/*                <CardActions*/}
        {/*                    style={{*/}
        {/*                        display: "flex",*/}
        {/*                        paddingLeft: "14px",*/}
        {/*                        alignItems: "center",*/}
        {/*                        paddingBottom: "8px",*/}
        {/*                        borderTop: "1px solid #e0e0e0",*/}
        {/*                        fontWeight: 600,*/}
        {/*                        fontSize:"14px"*/}
        {/*                    }}*/}
        {/*                >*/}
        {/*                    18 OCT 6:30 AM-7:30 PM*/}
        {/*                </CardActions>*/}
        {/*            </Box>*/}
        {/*        </Card>*/}
        {/*    </Box>*/}
        {/*    <Box>*/}
        {/*        <Card*/}
        {/*            variant="outlined"*/}
        {/*            style={{ display: "flex", boxShadow: "none" }}*/}
        {/*        >*/}
        {/*            <Box>*/}
        {/*                <img*/}
        {/*                    style={{ height: "100%", width: "110px" }}*/}
        {/*                    src="https://images.newindianexpress.com/uploads/user/imagelibrary/2020/3/29/w1200X800/cxvxcv.jpg"*/}
        {/*                />*/}
        {/*            </Box>*/}
        {/*            <Box display="flex" flexDirection="column" flexGrow="1">*/}
        {/*                <Box style={{ color: "#393a45", padding: "15px" }}>*/}
        {/*                    <Box style={{ fontSize: "15px", fontWeight: 600 }}>Yoga</Box>*/}
        {/*                    <Box style={{fontSize:"14px"}}>Get Stronger Body</Box>*/}
        {/*                    <Box style={{fontSize:"13px"}}>*/}
        {/*                        <Box*/}
        {/*                            style={{*/}
        {/*                                display: "inline",*/}
        {/*                                float: "left",*/}
        {/*                                paddingTop: "3px",*/}
        {/*                                paddingRight: "6px",*/}
        {/*                            }}*/}
        {/*                        >*/}
        {/*                            <AiFillStar style={{ color: "#ffb833" }} />*/}
        {/*                        </Box>*/}
        {/*                        <Box>4.5/5 (123)</Box>*/}
        {/*                    </Box>*/}
        {/*                </Box>*/}
        {/*                <CardActions*/}
        {/*                    style={{*/}
        {/*                        display: "flex",*/}
        {/*                        paddingLeft: "14px",*/}
        {/*                        alignItems: "center",*/}
        {/*                        paddingBottom: "8px",*/}
        {/*                        borderTop: "1px solid #e0e0e0",*/}
        {/*                        fontWeight: 600,*/}
        {/*                        fontSize:"14px"*/}
        {/*                    }}*/}
        {/*                >*/}
        {/*                    18 OCT 6:30 AM-7:30 PM*/}
        {/*                </CardActions>*/}
        {/*            </Box>*/}
        {/*        </Card>*/}
        {/*    </Box>*/}
        {/*</Box>*/}
        <Grid
          style={{ padding: "14px", textAlign: "left" }}
          container
          spacing={3}
        >
          {/*{console.log('retrieveConversation ID CHAT INFO: ',retrieveConversation.id)}*/}
          {/*<Grid item xs={12} style={{ display: "flex", alignItems: "flex-end" }}>*/}
          {/*  <Box className={classes.heading}>Course Details</Box>*/}
          {/*  <Box style={{ flex: 1, textAlign: "end" }}>*/}
          {/*    <Box component="span" style={{ margin: "0px 14px" }}>*/}
          {/*      1/3*/}
          {/*    </Box>*/}
          {/*    <IconButton size="small" className={classes.sliderBtn}>*/}
          {/*      <BiChevronLeft />*/}
          {/*    </IconButton>*/}
          {/*    <IconButton size="small" className={classes.sliderBtn}>*/}
          {/*      <BiChevronRight />*/}
          {/*    </IconButton>*/}
          {/*  </Box>*/}
          {/*</Grid>*/}

          {/*<Grid*/}
          {/*  container*/}
          {/*  item*/}
          {/*  display="flex"*/}
          {/*  flexDirection="row"*/}
          {/*  spacing={2}*/}
          {/*  xs={12}*/}
          {/*>*/}
          {/*    <Grid item xs={12} sm={6}>*/}
          {/*      <Card*/}
          {/*        variant="outlined"*/}
          {/*        style={{ display: "flex", boxShadow: "none" }}*/}
          {/*      >*/}
          {/*        <Box>*/}
          {/*          <img*/}
          {/*            style={{ height: "100%", width: "110px" }}*/}
          {/*            src="https://images.newindianexpress.com/uploads/user/imagelibrary/2020/3/29/w1200X800/cxvxcv.jpg"*/}
          {/*          />*/}
          {/*        </Box>*/}
          {/*        <Box display="flex" flexDirection="column" flexGrow="1">*/}
          {/*          <Box style={{ color: "#393a45", padding: "15px" }}>*/}
          {/*            <Box style={{ fontSize: "15px", fontWeight: 600 }}>Yoga</Box>*/}
          {/*            <Box style={{fontSize:"14px"}}>Get Stronger Body</Box>*/}
          {/*            <Box style={{fontSize:"13px"}}>*/}
          {/*              <Box*/}
          {/*                style={{*/}
          {/*                  display: "inline",*/}
          {/*                  float: "left",*/}
          {/*                  paddingTop: "3px",*/}
          {/*                  paddingRight: "6px",*/}
          {/*                }}*/}
          {/*              >*/}
          {/*                <AiFillStar style={{ color: "#ffb833" }} />*/}
          {/*              </Box>*/}
          {/*              <Box>4.5/5 (123)</Box>*/}
          {/*            </Box>*/}
          {/*          </Box>*/}
          {/*          <CardActions*/}
          {/*            style={{*/}
          {/*              display: "flex",*/}
          {/*              paddingLeft: "14px",*/}
          {/*              alignItems: "center",*/}
          {/*              paddingBottom: "8px",*/}
          {/*              borderTop: "1px solid #e0e0e0",*/}
          {/*              fontWeight: 600,*/}
          {/*              fontSize:"14px"*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            18 OCT 6:30 AM-7:30 PM*/}
          {/*          </CardActions>*/}
          {/*        </Box>*/}
          {/*      </Card>*/}
          {/*    </Grid>*/}

          {/*    <Grid item xs={12} sm={6}>*/}
          {/*      <Card*/}
          {/*        variant="outlined"*/}
          {/*        style={{ display: "flex", boxShadow: "none" }}*/}
          {/*      >*/}
          {/*        <Box>*/}
          {/*          <img*/}
          {/*            style={{ height: "100%", width: "110px" }}*/}
          {/*            src="https://images.newindianexpress.com/uploads/user/imagelibrary/2020/3/29/w1200X800/cxvxcv.jpg"*/}
          {/*          />*/}
          {/*        </Box>*/}
          {/*        <Box display="flex" flexDirection="column" flexGrow="1">*/}
          {/*          <Box style={{ color: "#393a45", padding: "15px" }}>*/}
          {/*            <Box style={{ fontSize: "15px", fontWeight: 600 }}>Yoga</Box>*/}
          {/*            <Box style={{fontSize:"14px"}}>Get Stronger Body</Box>*/}
          {/*            <Box style={{fontSize:"13px"}}>*/}
          {/*              <Box*/}
          {/*                style={{*/}
          {/*                  display: "inline",*/}
          {/*                  float: "left",*/}
          {/*                  paddingTop: "3px",*/}
          {/*                  paddingRight: "6px",*/}
          {/*                }}*/}
          {/*              >*/}
          {/*                <AiFillStar style={{ color: "#ffb833" }} />*/}
          {/*              </Box>*/}
          {/*              <Box>4.5/5 (123)</Box>*/}
          {/*            </Box>*/}
          {/*          </Box>*/}
          {/*          <CardActions*/}
          {/*            style={{*/}
          {/*              display: "flex",*/}
          {/*              paddingLeft: "14px",*/}
          {/*              alignItems: "center",*/}
          {/*              paddingBottom: "8px",*/}
          {/*              borderTop: "1px solid #e0e0e0",*/}
          {/*              fontWeight: 600,*/}
          {/*              fontSize:"14px"*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            18 OCT 6:30 AM-7:30 PM*/}
          {/*          </CardActions>*/}
          {/*        </Box>*/}
          {/*      </Card>*/}
          {/*    </Grid>*/}
          {/*</Grid>*/}

          {conversation.type == "user" ? (
            <>
              <Grid
                item
                xs={12}
                style={{ alignItems: "flex-end", paddingBottom: "0px" }}
              >
                <Box className={classes.heading} style={{paddingTop:"13px"}}>Personal Details</Box>
                <Box
              component="span"
              style={{
                display: "flex",
                background: "#03579c",
                width: "115px",
                color: "#03579c",
                fontSize: "2px",
                paddingTop: "1px",
                marginTop: "4px",
              }}
            >
              aa
            </Box>
              </Grid>
              <Grid item xs={12} style={{ fontSize: "14px" }}>
                <Box display="flex" flexDirection="row">
                  <Box className={classes.info} flexGrow={1}>
                    <Box>Name</Box>
                    <Box className={classes.infoDetails}>
                      {conversation.name}
                    </Box>
                  </Box>
                  <Box className={classes.info} flexGrow={1}>
                    <Box>Age</Box>
                    <Box className={classes.infoDetails}>28</Box>
                  </Box>
                  <Box className={classes.info} flexGrow={1}>
                    <Box>Gender</Box>
                    <Box className={classes.infoDetails}>Female</Box>
                  </Box>
                  <Box className={classes.info} flexGrow={1}>
                    <Box>Country</Box>
                    <Box className={classes.infoDetails}>india</Box>
                  </Box>
                </Box>
              </Grid>
            </>
          ) : (
            ""
          )}

          {conversation.type == "group" ? (
            <>
              <Grid style={{}} item xs={6}>
                <Typography className={classes.heading}>
                  Participants
                </Typography>
                <Box
              component="span"
              style={{
                display: "flex",
                background: "#03579c",
                width: "115px",
                color: "#03579c",
                fontSize: "2px",
                paddingTop: "1px",
                marginTop: "4px",
              }}
            >
              aa
            </Box>
              </Grid>
              <Grid style={{ textAlign: "right" }} item xs={6}>
                <Typography
                  className={classes.heading}
                  style={{ color: "#898989" }}
                >
                  {conversation.members.length} Learners
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <List className={classes.rootList}>
                  {conversation.members.map((member, index) => {
                    {
                      console.log("member: ", member);
                    }
                    return (
                      <ListItem style={{ borderBottom: "1px solid #e7e8ea" }}>
                        <ListItemAvatar>
                          <Avatar src={member.profile_url}></Avatar>
                        </ListItemAvatar>
                        <Link
                          style={{ color: "black", textDecoration: "none" }}
                          onClick={() => viewProfile(member.id)}
                        >
                          {member.first_name} {member.last_name}
                        </Link>
                        {userId === member.id && !props.isGroupLeaved ? (
                          <ListItemSecondaryAction>
                            <Button onClick={leaveGroup} variant="outlined">
                              Leave Group
                            </Button>
                          </ListItemSecondaryAction>
                        ) : (
                          ""
                        )}
                      </ListItem>
                    );
                  })}

                  <Divider />
                </List>
              </Grid>
            </>
          ) : (
            ""
          )}
        </Grid>
      </Box>
    </>
  );
}

export default React.memo(ChatInfo);
