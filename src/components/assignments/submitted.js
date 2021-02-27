import React, { useCallback, useEffect, useRef, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import GetAppIcon from "@material-ui/icons/GetApp";
import { InputAdornment } from "@material-ui/core";

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
    color: "#2c2c2c",
    fontWeight: 500,
  },
  answer: {
    marginTop: "4px",
    color: "#8e8c8c",
    fontSize: "14px",
    fontWeight: 400,
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
  const [myAssignments, setMyAssignments] = useState([])

  const fileRef = useRef();
  const [attachment_url, setAttachmentUrl] = useState([]);

  const { getUserId } = useAuth();
  const { logout } = useAuth();

  const assignmentApiStatus = useCallbackStatus();

  const uploadApiStatus = useCallbackStatus();
  const apiSource = useCancelRequest();
  const notification = useSnackbar();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  console.log("props", props);

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

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };
  const getDocs = useCallback(async (apiBody) => {
    try {
      const res = await uploadApiStatus.run(
        apiClient("POST", "common", "getsignedgetobjecturl", {
          body: { ...apiBody },
          enableLogging: true,
          shouldUseDefaultToken: false,
          cancelToken: apiSource.token,
        })
      );
      const {
        content: { data },
      } = res;
      console.log("helo")
      console.log(res.content.data)
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
  // useEffect(() => {
  //   props.item.submitted_attachment.split(",").map((item, index) => {
  //     getDocs({
  //       file_key: item
  //     })
  //   })
  // }, []);

  const viewAttachment = (attachmentUrl) => {
    const apiBody = { file_key: attachmentUrl };
    getAssignmentURL(apiBody);
  };

  return (
    <div>
      <div onClick={handleOpen}>
        <Button
          variant="text"
          color="secondary"
          className={classes.button}
          startIcon={<InsertDriveFileIcon />}
        >
          {/* TODO: create anchor tag and add href of submitted_attachment */}
          {/* {props.item.title} */}
          {props.item.submitted_attachment
            ? props.item.submitted_attachment.split("/").pop().split("?")[0]
            : null}
        </Button>
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
                style={{ color: "#2c2c2c", fontSize: "14px", fontWeight: 600 }}
              >
                Submitted Date
              </Typography>
              <Typography
                style={{ color: "#8e8c8c", fontSize: "14px", fontWeight: 400 }}
              >
                {moment(new Date(props.item.submission_time * 1000)).format(
                  "DD MMM, YYYY"
                )}
              </Typography>
            </Box>
            <Box
              mt={2}
              style={{ borderTop: "1px solid #e7e7ea", paddingTop: "12px" }}
            >
              <Typography variant="body2" className={classes.label}>
                {props.item.question}?
              </Typography>

              <Typography variant="body2" className={classes.answer}>
                {props.item.answer || "No Answer Submitted."}
              </Typography>
            </Box>
            <div style={{ marginTop: "30px" }}>
              {props.item.submitted_attachment.split(",").map((item) => {
                return (
                  <Box
                    key={item}
                    w={1}
                    borderRadius={5}
                    display="flex"
                    alignItems="center"
                    style={{
                      height: "35px",
                      background: "#fce8e0",
                      color: "#f05e23",
                      paddingLeft: "16px",
                      margin: "8px 0px",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#f05e23",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={() => viewAttachment(item)}
                    >
                      {item ? item.split("/").pop().split("?")[0] : null}
                    </Typography>
                  </Box>
                );
              })}
            </div>

            <div style={{ display: "flex", marginTop: "30px" }}>
              <CheckCircleIcon style={{ color: "green" }}> </CheckCircleIcon>
              <Typography
                style={{ color: "#52534f", fontWeight: 500, fontSize: "15px" }}
              >
                &nbsp; Submitted
              </Typography>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
