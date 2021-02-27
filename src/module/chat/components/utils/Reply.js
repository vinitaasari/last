import React, { useEffect, useState } from "react";
import { Box, IconButton, makeStyles } from "@material-ui/core";
import { BsFillMicFill, BsImageFill } from "react-icons/bs";
import videoIcon from "../../icons/noun_Video_966159.svg";
import { FcDocument } from "react-icons/fc";
import { useSelector } from "react-redux";
import _ from 'lodash'
function Reply(props) {
  const [message, setMessage] = useState({
    media:[  {
      type:null,
      presigned_url:null
    }  ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMessage(props.message);
    setLoading(false);
  });

  const { chatToken, userId, replayMessageObject } = useSelector((state) => {
    return {
      userId: state.chatContainer.userData.id,
    };
  });

  const loadMessage = (type) => {
    switch (type) {
      case "text":
        return (
          <>
            <Box style={{textAlign:"left",fontWeight: 500 }}>
              {message.user.id === userId
                ? "You"
                : message.user.first_name + " " + message.user.last_name}
            </Box>
            <Box style={{textAlign:"left"}}>{message.content}</Box>
          </>
        );

      case "audio":
        return (
          <>
            <Box style={{textAlign:"left",fontWeight: 500 }}>
              {message.user.first_name + " " + message.user.last_name}
            </Box>
            <Box display="flex">
              <Box style={{ margin: "3px" }}>
                <BsFillMicFill />
              </Box>
              <Box>audio</Box>
            </Box>
          </>
        );
      case "video":
        return (
          <>
            <Box style={{textAlign:"left",fontWeight: 500, flexGrow: 1 }}>
              <Box>
                {message.user.first_name + " " + message.user.last_name}
              </Box>
              <Box style={{ margin: "3px" }}>
                <img src={videoIcon} /> video
              </Box>
            </Box>
          </>
        );
      case "image":
        return (
          <>
            <Box display="flex">
              <Box style={{textAlign:"left",fontWeight: 500, flexGrow: 1 }}>
                <Box>
                  {message.user.first_name + " " + message.user.last_name}
                </Box>
                <Box style={{ margin: "3px" }}>
                  <BsImageFill /> image
                </Box>
              </Box>
              <Box style={{paddingLeft: "30px"}}>
                <img src={message.media[0].presigned_url} style={{maxHeight:"60px"}} />
              </Box>
            </Box>
          </>
        );
      default:
        return (
          <>
            <Box style={{textAlign:"left",fontWeight: 500 }}>
              {message.user.first_name + " " + message.user.last_name}
            </Box>
            <Box display="flex">
              <Box style={{ margin: "3px" }}>
                <FcDocument />
              </Box>
              <Box>document</Box>
            </Box>
          </>
        );
    }
  };

  if (loading) {
    return "loading...";
  }

  //  console.log('Replied Message Type: ',message.media[0].type)
  //  console.log('Replied Message Data: ',message)

  return message.type == "text"
    ? loadMessage(message.type)
    : !_.isNull(message.media)?loadMessage(message.media[0].type):"";
}

export default Reply;
