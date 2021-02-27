import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  List,
  CircularProgress,
  ListItem,
} from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import { NotificationsNone as NotificationsNoneIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import moment from "moment";

import { useAuth } from "../../contexts/auth-context";
import { useUser } from "../../contexts/user-context";
import TimeAgo from "react-timeago";
import { apiClient } from "../../utils/api-client";
import useCallbackStatus from "../../hooks/use-callback-status";
import Badge from "@material-ui/core/Badge";
import useCancelRequest from "../../hooks/useCancelRequest";
import { useStyles } from "./styles";
import notificationImage from "../../assets/images/notification.png";
import EmptyState from "../../components/empty-state";
import NoNotificationsImage from "../../assets/images/no-notifications.svg";
import default_profile from "./../../assets/images/default_profile.png";

const NotificationItem = ({
  notification_type,
  meta_data,
  image_url,
  created_at,
  notification,
}) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <ListItem
      button
      className={classes.notificationsListItem}
      onClick={() => {
        if (
          notification_type === "session_reschedule_request_accepted_learner" ||
          notification_type === "session_cancel_request_accepted_learner"
        ) {
          // history.push("/my-learning/my-courses")
          window.location.href = "/my-learning/my-courses";
        } else if (notification_type === "session_scheduled_reminder") {
          // history.push("my-learning/upcoming")
          window.location.href = "/my-learning/upcoming";
        } else if (notification_type === "course_enrolled") {
          const course_type = JSON.parse(meta_data).course_type;
          const course_id = JSON.parse(meta_data).course_id;
          if (course_type === "slot_course") {
            // history.push("/course-detail/slot" + "/" + course_id, {
            //   details: true
            // })
            // window.location.reload();
            window.location.href = "/my-learning/my-courses";
          } else {
            // history.push("/course-detail/structured" + "/" + course_id, {
            //   details: true
            // })
            // window.location.reload();
            window.location.href = "/my-learning/my-courses";
          }
        } else if (
          notification_type === "session_complete" ||
          notification_type === "course_complete_certificate"
        ) {
          const course_type = JSON.parse(meta_data).course_type;
          const course_id = JSON.parse(meta_data).course_id;
          if (course_type === "slot_course") {
            // history.push("/course-detail/slot" + "/" + course_id, {
            //   details: true
            // })
            // window.location.reload();
            window.location.href = "/my-learning/my-courses";
          } else {
            // history.push("/course-detail/structured" + "/" + course_id, {
            //   details: true
            // })
            // window.location.reload();
            window.location.href = "/my-learning/my-courses";
          }
        } else if (notification_type === "course_complete") {
          // history.push("/my-learning/my-courses")
          window.location.href = "/my-learning/my-courses";
        } else if (notification_type === "session_missed") {
          // history.push("/my-learning/my-courses")
          window.location.href = "/my-learning/my-courses";
        } else if (notification_type === "submit_assignment") {
          const course_type = JSON.parse(meta_data).course_type;
          const course_id = JSON.parse(meta_data).course_id;
          if (course_type === "slot_course") {
            // history.push("/course-detail/slot" + "/" + course_id, {
            //   details: true
            // })
            // window.location.reload();
            window.location.href = "/my-learning/my-courses";
          } else {
            // history.push("/course-detail/structured" + "/" + course_id, {
            //   details: true
            // })
            // window.location.reload();
            window.location.href = "/my-learning/my-courses";
          }
        } else if (notification_type === "subscription_expiry") {
          history.push("/my-subscriptions/expired");
          window.location.reload();
        } else if (notification_type === "group_new_message") {
          const conversation_id = JSON.parse(meta_data).conversation_id;
          window.location.href = `/messages/${conversation_id}?type=group`;
          // history.push(`/messages/${conversation_id}?type=group`)
        } else if (notification_type === "user_new_message") {
          const conversation_id = JSON.parse(meta_data).conversation_id;
          window.location.href = `/messages/${conversation_id}?type=notification`;
          // history.push(`/messages/${conversation_id}?type=notification`)
        }
      }}
    >
      {
        console.log(image_url)
      }
      {
        console.log(notification)
      }
      {
        image_url == "undefined" ? (
          <img
            src={default_profile}
            className={classes.notificationsListItemMedia}
          />
        ) : (
            <img
              src={image_url}
              className={classes.notificationsListItemMedia}
            />
          )
      }

      <Box ml={1.5}>
        <Typography className={classes.notificationsListItemText}>
          {notification}
        </Typography>
        <Typography className={classes.notificationsListItemTime}>
          <TimeAgo
            date={moment(new Date(created_at * 1000)).format(
              "MMM DD, YYYY hh:mm:ss A"
            )}
          />
        </Typography>
      </Box>
    </ListItem>
  );
};

const Notifications = (props) => {
  const notification = useSnackbar();
  const classes = useStyles();
  const { user } = useUser();
  const { noti } = useUser();
  const searchApiStatus = useCallbackStatus();
  const searchApiSource = useCancelRequest();
  const history = useHistory();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationList, setNotificationList] = useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(notificationAnchorEl);

  const openNotificationsMenu = (event) => {
    if (user.authenticated) {
      getNotifications({
        user_id: user.id,
        entity_type: "learner",
        page_size: 100,
        page_number: 1,
      });
      setNotificationAnchorEl(event.currentTarget);
    } else {
      history.push("/login");
    }
  };

  const closeNotificationsMenu = () => {
    getNotificationsCount({ user_id: user.id, entity_type: "learner" });
    setNotificationAnchorEl(null);
  };

  const getNotifications = async (apiBody) => {
    try {
      const res = await searchApiStatus.run(
        apiClient("POST", "common", "getnotificationsbyuserid", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: false,
          cancelToken: searchApiSource.token,
        })
      );

      setNotificationList(res.content.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      // getNotificationsCount({ user_id: user.id, entity_type: "learner" });
    }
  }, [noti]);

  const getNotificationsCount = async (apiBody) => {
    try {
      const res = await searchApiStatus.run(
        apiClient("POST", "common", "getnotificationscountbyuserid", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: false,
          cancelToken: searchApiSource.token,
        })
      );

      setNotificationCount(res.content.data);
    } catch (error) {
      console.log(error);
    }
  };
  const notificationMenuId = "notification-menu";
  const renderNotificationMenu = (
    <Popover
      id={notificationMenuId}
      open={isMenuOpen}
      anchorEl={notificationAnchorEl}
      onClose={closeNotificationsMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      className={classes.notificationsListWrapper}
    >
      <List className={classes.notificationsList}>
        {searchApiStatus.isPending ? (
          <CircularProgress
            style={{ marginLeft: "50%" }}
            size={20}
          />
        ) : (
            notificationList.length > 0 ?
              notificationList.map((val, index) => (
                <NotificationItem
                  notification_type={val.notification_type}
                  meta_data={val.meta_data}
                  image_url={val.image_url}
                  created_at={val.created_at}
                  notification={val.notification}
                />
              )) :
              <Box style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState image={NoNotificationsImage} text="No Notification!" />
              </Box>
          )}
      </List>
    </Popover>
  );

  return (
    <>
      {renderNotificationMenu}
      {!props.star && (
        <IconButton
          onClick={openNotificationsMenu}
          className={classes.notificationsBtn}
        >
          <Badge badgeContent={notificationCount} color="primary">
            <NotificationsNoneIcon color="primary" />
          </Badge>
        </IconButton>
      )}
      {
        props.star && (
          <Typography onClick={openNotificationsMenu}>
            Notifications
          </Typography>
        )
      }
    </>
  );
};

export default Notifications;
