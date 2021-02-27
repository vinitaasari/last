import React, { useCallback, useEffect, useRef, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import axios from 'axios'
import TextField from "@material-ui/core/TextField";
import ClearIcon from "@material-ui/icons/Clear";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import GetAppIcon from "@material-ui/icons/GetApp";
import { InputAdornment } from "@material-ui/core";
import { useUser } from "../../contexts/user-context";

import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import AttachFileIcon from "../../assets/images/attachment-icon.svg";

// import { assignmentSchema } from "../../schema";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useAuth } from "../../contexts/auth-context";
import useCallbackStatus from "../../hooks/use-callback-status";
import useCancelRequest from "../../hooks/useCancelRequest";
import { apiClient } from "../../utils/api-client";

const useStyles = makeStyles((theme) => ({
  label: {
    color: "#334856",
    fontWeight: 500,
  },
  textInput: {
    maxWidth: "562px",
    backgroundColor: "#fff",
  },
  notchedOutline: {
    borderColor: `${theme.palette.custom.inputBorder} !important`,
  },
  uploadFileText: {
    marginLeft: theme.spacing(0.5),
    fontSize: "14px",
    textTransform: "none",
    fontWeight: 500,
  },
  imageInput: {
    display: "none",
  },
  assignmentTitle: {
    color: "#3f3f3f",
    fontSize: "20px",
    fontWeight: 600,
    textAlign: "center",
  },
  assignmentSubtitle: {
    color: "#484747",
    fontSize: "15px",
    fontWeight: 400,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    zIndex: 10000,
    left: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function UploadAssignment(props) {
  const classes = useStyles();
  const { callback } = props;
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [ansError, setAnsError] = useState("");
  const [name, setName] = useState("");
  const [submitted_assignment, setSubmitted] = useState([]);

  const fileRef = useRef();
  const [attachment_url, setAttachmentUrl] = useState([]);
  const [myUrls, setUrls] = useState([]);

  const { user } = useUser();
  const { logout } = useAuth();

  const assignmentApiStatus = useCallbackStatus();

  const uploadApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const viewAttachment = (attachmentUrl) => {
    const apiBody = { file_key: attachmentUrl };
    getAssignmentURL(apiBody);
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  const getAssignmentURL = async (apiBody) => {
    try {
      const res = await apiClient("POST", "common", "getsignedgetobjecturl", {
        body: { ...apiBody },
        shouldUseDefaultToken: false,
        cancelToken: apiSource.token,
        enableLogging: true,
      });
      console.log(res);
      const url = res.content.data.s3signedGetUrl;
      openInNewTab(url);
    } catch (error) {
      if (error && error.code === 401) {
        logout();
      }
    }
  };
  useEffect(() => {
    if (uploadedFileName) {
      setAttachmentUrl([...attachment_url, uploadedFileName]);
    }
  }, [uploadedFileName]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const getUrl = useCallback(async (apiBody, bFile) => {
    try {
      const res = await uploadApiStatus.run(
        apiClient("POST", "common", "getsignedputobjecturl", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
        })
      );
      const {
        content: { data },
      } = res;
      const s3url = data.s3signedPutUrl;
      setUploadedFileName(apiBody.file_key);
      await axios.put(s3url, bFile)
      var url = s3url.split("?", 1);
      console.log("Uploadeddd")
      // const ress = await axios.put(s3url, bFile);
      // setFieldValue("attachment_url", url[0]);
    } catch (error) {
      if (error && error.code === 401) {
        logout();
      }
      notification.enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, []);

  const handleImage = async (e) => {
    e.preventDefault();
    var fileObj = e.target.files[0];
    const fileName = fileObj.name;
    const fileExtString = fileObj.name.split(".");
    const fileExt = fileExtString.pop();
    const fileType = fileObj.type;
    setSubmitted([...submitted_assignment, fileName]);
    var key;
    if (
      fileExt === "jpg" ||
      fileExt === "JPG" ||
      fileExt === "jpeg" ||
      fileExt === "JPEG" ||
      fileExt === "png" ||
      fileExt === "PNG"
    ) {
      key = `assignments/learner/images/${Math.floor(
        new Date().getTime() / 1000
      )}.${fileExt}`;
    } else {
      key = `assignments/learner/documents/${Math.floor(
        new Date().getTime() / 1000
      )}.${fileExt}`;
    }
    getUrl({ file_key: key, file_type: fileType }, fileObj);
  };

  const handleCloseIconClick = (index) => {
    const sa = [...submitted_assignment];
    const sb = [...attachment_url]
    sa.splice(index, 1);
    sb.splice(index, 1)
    setAttachmentUrl(sb)
    setSubmitted(sa);
  };

  return (
    <div>
      <div
        onClick={handleOpen}
        style={{ display: "flex", alignItems: "center" }}
      >
        <CloudUploadIcon
          color="#c3c3c3"
          style={{ marginRight: "10px", color: "grey" }}
        />
        <Typography component="label" className={classes.inputLabel}>
          Drop .pdf or .txt document here or
          <span style={{ color: "#f05e23", cursor: "pointer" }}>
            {"  choose file "}
          </span>
          to upload
        </Typography>
      </div>
      <Dialog
        onClose={handleClose}
        open={open}
        maxWidth="sm"
        fullWidth
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogContent style={{ position: "relative" }}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <form>
            <Box>
              <Typography className={classes.assignmentTitle}>
                {props.item.title}
              </Typography>
              {/* <Typography
                className={classes.assignmentSubtitle}
              >{`${props.item.session_title}. ${props.item.question}`}</Typography> */}
            </Box>
            <Box mt={1.5}>
              <Typography
                style={{
                  color: "#2c2c2c",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                Download Assignment
              </Typography>
              {props.item.attachment_url ? (
                <Box
                  fullWidth
                  borderRadius={5}
                  display="flex"
                  alignItems="center"
                  style={{
                    height: "35px",
                    background: "#fce8e0",
                    color: "#f05e23",
                    paddingLeft: "16px",
                  }}
                >
                  <Typography
                    style={{
                      color: "#f05e23",
                      fontWeight: 500,
                    }}
                    component="a"
                    onClick={() => viewAttachment(props.item.attachment_url)}
                  >
                    {props.item.attachment_url
                      ? props.item.attachment_url.split("/").pop().split("?")[0]
                      : null}
                  </Typography>
                </Box>
              ) : null}
            </Box>
            <Box mt={2}>
              <Typography variant="body2" className={classes.label}>
                {props.item.question}?
              </Typography>
              <TextField
                name="assignment_question"
                onChange={(e) => {
                  setAnsError("");
                  setAnswer(e.target.value);
                }}
                value={answer}
                variant="outlined"
                margin="dense"
                multiline
                rows={6}
                fullWidth
                placeholder="Write here"
                classes={{ root: classes.textInput }}
              />
              {ansError ? (
                <FormHelperText error>{ansError}</FormHelperText>
              ) : null}
            </Box>

            {submitted_assignment.map((item, index) => (
              <Box
                fullWidth
                borderRadius={5}
                style={{
                  margin: "8px 0px",
                  height: "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fce8e0",
                  color: "#f05e23",
                  padding: "0px 16px",
                }}
              >
                <Typography
                  style={{
                    color: "#f05e23",
                    fontWeight: 500,
                  }}
                  component="a"
                  href={props.item.attachment_url}
                  download
                >
                  {item}
                </Typography>
                <ClearIcon
                  onClick={(index) => {
                    handleCloseIconClick(index);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Box>
            ))}

            <Box mt={2} display="flex" alignItems="center">
              <img src={AttachFileIcon} alt="Attach file" />
              <input
                className={classes.imageInput}
                onChange={handleImage}
                type="file"
                style={{ display: "none" }}
                ref={fileRef}
                onClick={(event) => {
                  event.target.value = "";
                }}
              />
              <Button
                color="secondary"
                variant="text"
                className={classes.uploadFileText}
                onClick={() => fileRef.current.click()}
                disabled={uploadApiStatus.isPending}
              >
                {uploadApiStatus.isPending ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                    "Upload files"
                  )}
              </Button>
            </Box>

            <Box mt={1} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  if (!answer) {
                    setAnsError("Please write Answer");
                  } else {

                    var b = {
                      learner_id: props.learner_id,
                      attachment_url: attachment_url,
                      assignment_id: props.item.id,
                      answer: answer,
                    }
                    console.log(submitted_assignment)
                    console.log(b.attachment_url);
                    props.submitAssignment(b);

                  }
                }}
                disabled={assignmentApiStatus.isPending}
              >
                {props.submitAssignmentStatus.isPending ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                    "Save"
                  )}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
