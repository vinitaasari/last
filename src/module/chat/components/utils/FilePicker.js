import { Box, Button, IconButton, makeStyles } from "@material-ui/core";
import React, { useRef } from "react";
import { ImAttachment } from "react-icons/im";
import micIcon from "../../icons/Group 18056.svg";
import videoIcon from "../../icons/Group 18054.svg";
import documentIcon from "../../icons/Group 18055.svg";
import imageIcon from "../../icons/Group 18053.svg";
import clsx from "clsx";
import attachmentIcon from "../../icons/Path 66771.svg";

const useStyles = makeStyles(() => ({
  root: {
    color: "black",
  },
  SpeedDialRoot: {
    position: "relative",
    margin: "0px",
    left: "43px",
    bottom: "141px",
  },
  SpeedDialToogle: {
    display: "none",
  },
}));

const actions = [
  { icon: videoIcon, type: "video" },
  { icon: imageIcon, type: "image" },
  { icon: documentIcon, type: "document" },
  { icon: micIcon, type: "audio" },
];

function FilePicker(props) {
  const classes = useStyles();
  const fileInput = useRef({
    current: {
      files: [],
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleOpenClose = () => {
    setOpen(!open);
  };


  const fileSelectorNormal = (filetype="*") => {
    fileInput.current.alt = filetype;
    fileInput.current.accept = `${filetype}/*`;
    fileInput.current.click();
  };

  const fileSelector = (filetype="*") => {
    fileInput.current.alt = filetype;
    fileInput.current.accept = `${filetype}/*`;
    handleOpenClose();
    fileInput.current.click();
  };

  const FileHandler = (e) => {
    props.fileHandler(e.target.files[0], e.target.alt);
  };

  return (
    <>
      <Box className={clsx({ [classes.SpeedDialToogle]: !open })}>
        <Box
          className={classes.SpeedDialRoot}
          display="flex"
          flexDirection="column"
        >
          <input
            onChange={FileHandler}
            style={{ display: "none" }}
            type="file"
            ref={fileInput}
          />
          {actions.map((actions, index) => {
            return (
              <Box key={index}>
                <IconButton
                  style={{ padding: "5px" }}
                  onClick={() => fileSelector(actions.type)}
                >
                  <img src={actions.icon} />
                  {/* {actions.icon} */}
                </IconButton>
              </Box>
            );
          })}
        </Box>
      </Box>
      {props.type == "button" ? (
        <Button onClick={() => fileSelectorNormal(props.fileType)} style={{color:'#f05e23',borderColor:"#f05e23"}} variant="outlined">UPLOAD</Button>
      ) : (
        <IconButton onClick={handleOpenClose} color="inherit" size="small">
          <img src={attachmentIcon} />
        </IconButton>
      )}
    </>
  );
}

export default FilePicker;
