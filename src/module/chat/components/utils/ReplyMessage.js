import { Box, IconButton, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import store from "../../../../store";
import { replayMessageDisable } from "../../chatContainer/actions";
import { BsFillMicFill, BsImageFill } from "react-icons/bs";
import videoIcon from "../../icons/noun_Video_966159.svg";
import { FcDocument } from "react-icons/fc";
import { Replay } from "@material-ui/icons";
import Reply from "./Reply";

const useStyles = makeStyles(() => ({
  replayBox: {
    position: "relative",
    color: "black",
    fontSize:"14px",
    left: "0px",
    padding: "13px 25px",
    width: "100%",
    background: "white",
  },
  iconButton:{
    '&:hover':{
      backgroundColor:'transparent'
    }
  }
}));

function ReplyMessage(props) {
  const classes = useStyles();
  const [replayMessageObject, setReplayMessageObject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setReplayMessageObject(props.message);
    setLoading(false);
  });

  if (loading) {
    return "loading...";
  }

  return (
    <>
      {replayMessageObject.replayStatus ? (
        <Box display="flex" item className={classes.replayBox}>
          <Box
            style={{
              flexGrow: 1,
              backgroundColor: "lightgray",
              textAlign: "left",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Reply message={replayMessageObject.message} />
          </Box>
          <IconButton
            disableRipple
            className={classes.iconButton}
            onClick={() => store.dispatch(replayMessageDisable(false))}
            style={{ paddingRight: "35px", paddingLeft: "22px" }}
            color="inherit"
            size="small"
          >
            <AiFillCloseCircle />
          </IconButton>
        </Box>
      ) : (
        ""
      )}
    </>
  );
}

export default ReplyMessage;
