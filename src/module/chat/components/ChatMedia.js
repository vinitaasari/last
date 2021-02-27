import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import { FcDocument } from "react-icons/fc";
import Modal from "./utils/Modal";
import _ from "lodash";
import { Box,DialogContentText,CardContent } from "@material-ui/core";

const useStyles = () => ({
  root: {
    float: "left",
  },
});

function ChatMedia({ type, media, messageType }) {
  const [modal, setModal] = useState(false);
  const classes = useStyles();
  const [src, setSrc] = useState(null);

  const viewImage = (e) => {
    setSrc(e.target.src);
    setModal(true);
  };

  const getStyles= () => {
    if(messageType=='star')
    return { height: "46px", width: "214px" , outline:"none"};
    else
    return { height: "46px", outline:"none"};
  }

  const mediaRender = (type, classes, media) => {
    switch (type) {
      case "image":
        return (
          <img
            style={{ cursor: "pointer" }}
            onClick={viewImage}
            src={media[0].presigned_url}
            width="210px"
            height="210px"
          />
          // <Card className={classes.root}>
          //   <CardActionArea>
          //     <CardMedia
          //       component="img"
          //       alt="Contemplative Reptile"
          //       height="140"
          //       image={media[0].presigned_url}
          //       title="Image"
          //     />
          //   </CardActionArea>
          // </Card>
        );

      case "video":
        return (
          <video
            width="210px"
            poster={media[0].thumbnail_presigned_url}
            controls
            controlsList="nodownload"
          >
            <source src={media[0].presigned_url} type="video/mp4" />
          </video>
        );
      case "document":
        return (
          <Card style={{padding:"10px"}}>
             <CardContent style={{padding:"0px"}}>
                <Box display="flex" alignItems="center"> 
                  <FcDocument size={20}/>{" "}
                  <a style={{textDecoration:"none",marginRight:"21px",padding:"0px 9px"}} href={media[0].presigned_url} target="_blank">
                    Document
                  </a>
                </Box>
             </CardContent>
          </Card>
          // <Card>
          //   <FcDocument />{" "}
          //   <a href={media[0].presigned_url} target="_blank">
          //     Document
          //   </a>
          // </Card>
        );
      case "audio":
        return (
          <>
            {console.log("messageType Audio: ", messageType)}
            <audio
              style={getStyles()}
              controls
              controlsList="nodownload"
            >
              <source src={media[0].presigned_url} type="audio/mpeg" />
            </audio>
          </>
        );
    }
  };

  return (
    <>
      <Modal
        statusUpdated={() => setModal(false)}
        status={modal}
        type="default"
        title="Preview"
      >
        <DialogContentText>
          <img src={src} width="100%" />
        </DialogContentText>
      </Modal>
      {mediaRender(type, classes, media)}
    </>
  );
}

export default ChatMedia;
