import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDropzone } from "react-dropzone";
import AssignmentDialog from "./asssign";
import shortid from "shortid";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";

import DeleteIcon from "@material-ui/icons/Delete";

import { useAuth } from "../../contexts/auth-context";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";
import { useUser } from "../../contexts/user-context";
import { useHistory } from "react-router-dom";
import SubmittedDialog from "./submitted";

const useStyles = makeStyles((theme) => ({
  container: {
    // padding: theme.spacing(1),
    border: "1px solid #e4e4e4",
    marginTop: theme.spacing(2),
  },
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  assignmentDetailsContainer: {
    padding: theme.spacing(2),
  },
  nameAndDate: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#05589c",

    "& span": {
      fontSize: "18px",
      fontWeight: 600,
    },
  },
  description: {
    marginTop: "1rem",
    color: "484747",
    fontSize: "16px",
  },
  dropzone: {
    padding: theme.spacing(2),
  },
  inputLabel: {
    display: "flex",
    alignItems: "center",

    "& svg": {
      marginRight: "1rem",
      fill: "#c3c3c3",
    },
  },
  title: {
    marginBottom: "2rem",
    color: "#1c1a1a",
    fontSize: "20px",
    fontWeight: 600,
  },
}));

function Assignments({
  id = shortid.generate(),
  assignments = [],
  viewType = "show",
  hideTitle,
  handleSubmit,
}) {
  const [activeAssignment, setActive] = useState(null);
  const classes = useStyles();
  const submitAssignmentStatus = useCallbackStatus();
  const s3SignedURLApiStatus = useCallbackStatus();
  const uploadFileApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();
  const { logout } = useAuth();
  const { user } = useUser();

  const history = useHistory();

  const { getRootProps, getInputProps, inputRef } = useDropzone({ onDrop });

  function onDrop(acceptedFiles) {
    // handleSubmit(acceptedFiles, inputRef.current.dataset.assignmentid);
    handleFileUpload(acceptedFiles[0], inputRef.current.dataset.assignmentid);
  }
  const submitAssignment = async (apiBody) => {
    console.log(apiBody);
    try {
      const res = await submitAssignmentStatus.run(
        apiClient("POST", "course_manage", "addassignmentsubmission", {
          body: { ...apiBody },
          enableLogging: true,
        })
      );
      history.push(
        "/course-detail/" +
          history.location.pathname.split("/")[2] +
          "/" +
          history.location.pathname.split("/")[3],
        {
          details: true,
        }
      );
      notification.enqueueSnackbar(res.message, {
        variant: "success",
        autoHideDuration: 3000,
      });

      setActive(null);
    } catch (error) {
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const getS3SignedURL = async (apiBody, fileObj, assignmentId) => {
    setActive(assignmentId);
    try {
      const res = await s3SignedURLApiStatus.run(
        apiClient("POST", "common", "getsignedputobjecturl", {
          body: { ...apiBody },
          enableLogging: true,
        })
      );

      if (res.content.data) {
        const url = res.content.data.s3signedPutUrl;
        const uploadRes = await axios.put(url, fileObj);
        // uploadFile(url, fileObj);
        var mainUrl = url.split("?", 1);
        // setImage(mainUrl[0])
        // setProfile(mainUrl[0]);

        submitAssignment({
          learner_id: user.id,
          assignment_id: assignmentId,
          attachment_url: mainUrl,
        });
        // if (uploadRes.status >= 200 && uploadRes.status < 300) {
        //   notification.enqueueSnackbar("Assignment uploaded", {
        //     variant: "success",
        //     autoHideDuration: 3000,
        //   });
        // }
      }
    } catch (error) {
      if (error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  };

  const handleFileUpload = (fileObj, assignmentId) => {
    const fileExtString = fileObj.name.split(".");
    const fileExt = fileExtString.pop();
    const fileType = fileObj.type;
    const key = `/assignments/learner/documents/${Math.random()}.${fileExt}`;
    getS3SignedURL(
      {
        file_key: `/assignments/learner/documents/${Math.random()}.${fileExt}`,
        file_type: fileType,
      },
      fileObj,
      assignmentId
    );
  };

  const handleAssignmentDelete = (id) => {
    // TODO: delete api
  };

  const handleSubmissionDownload = () => {
    // TODO: programmatically download
  };

  console.log("Assignmentsssssssssssssssssss", assignments);

  return (
    <div>
      {!hideTitle && (
        <Typography variant="h5" component="h3" className={classes.title}>
          Assignments
        </Typography>
      )}
      {assignments.map((item) => (
        <div className={classes.container}>
          <Box className={classes.assignmentDetailsContainer}>
            <Typography className={classes.nameAndDate}>
              <Typography>{item.title}</Typography>
              <Typography>
                {moment(new Date(item.created_at * 1000)).format(
                  "DD MMM, YYYY"
                )}
              </Typography>
              {/* <Typography component="span">12 OCT, 2020</Typography> */}
            </Typography>
            <Typography className={classes.description}>
              {item.question}
            </Typography>
          </Box>
          <Divider />
          {item.is_submitted === 0 && viewType === "submit" ? (
            <>
              {activeAssignment &&
              item.id === activeAssignment &&
              (s3SignedURLApiStatus.isPending ||
                submitAssignmentStatus.isPending) ? (
                <CircularProgress size={20} />
              ) : (
                <Box className={classes.dropzone} {...getRootProps()}>
                  {/* <input
                      type="file"
                      name="assignment"
                      id={id}
                      style={{ width: 0 }}
                      data-assignmentid={item.id}
                      {...getInputProps()}
                    // ref={inputRef}
                    /> */}
                  <AssignmentDialog
                    item={item}
                    submitAssignmentStatus={submitAssignmentStatus}
                    learner_id={user.id}
                    submitAssignment={submitAssignment}
                  />
                </Box>
              )}
            </>
          ) : item.is_submitted === 1 && viewType === "submit" ? (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              style={{ padding: "0.5rem 1rem" }}
            >
              <SubmittedDialog item={item}></SubmittedDialog>
            </Box>
          ) : null}
        </div>
      ))}
      <Divider />
    </div>
  );
}

export default Assignments;
