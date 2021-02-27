import { apiClient } from "./api-client";
import moment from "moment";
// import useCancelRequest from "../hooks/useCancelRequest";
import axios from "axios";

export const fileNameGenrator = (file, user_id) => {
  //   console.log("file mime", file.type);
  //   console.log("file NAME", file.name);
  //   console.log("USER ID", user_id);
  //   console.log("Time in milliseconds", moment().valueOf());
  // userid-milliseconds_fileorginalname.extension
  console.log(file)
  if(file.name == undefined){
    console.log(`${user_id}-${moment().valueOf()}_`+`Voice note.mp3`)
    return `${user_id}-${moment().valueOf()}_`+`Voice note.mp3`;
  }else{
    console.log(`${user_id}-${moment().valueOf()}_${file.name}`)
    return `${user_id}-${moment().valueOf()}_${file.name}`;
  }
};

export const awsFileUpload = (s3Url, file) => {
  console.log("LINK TO UPLOAD", s3Url);
  console.log("FILE TO UPLOAD", file);
  console.log("file mime", file.type);

  return axios.put(s3Url, file, {
    onUploadProgress: (progressEvent) =>
      console.log(
        "Loading.. ",
        Math.round((progressEvent.loaded / progressEvent.total) * 100)
      ),
  });
  // .then(({config:{url}})=>{
  // console.log('OK UPLOADED',url)
  // })
  // var url = s3Url.split("?", 1);
  // console.log('OK URL',url)
  // await apiClient("PUT", "common", "getsignedputobjecturl", {
  //   body: {
  //     file_key: `${path}/${fileNameToStore}`,
  //     file_type: file.type,
  //   },
  //   shouldUseDefaultToken: false,
  //   // cancelToken: axios.CancelToken.source().token,
  // }).then(
  //   ({
  //     content: {
  //       data: { s3signedPutUrl },
  //     },
  //   }) => {
  //     signedUrl = s3signedPutUrl;
  //   }
  // );
};

export const getVideoCover=(file, seekTo = 0.0)=>{
  console.log("getting video cover for file: ", file);
  return new Promise((resolve, reject) => {
    // load the file to a video player
    const videoPlayer = document.createElement("video");
    videoPlayer.setAttribute("src", URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener("error", (ex) => {
      reject("error when loading video file", ex);
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener("loadedmetadata", () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener("seeked", () => {
        console.log("video is now paused at %ss.", seekTo);
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        // return the canvas image as a blob
        ctx.canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.75 /* quality */
        );
      });
    });
  });
}

export const awsLinkGenerate = async (file, type, user_id) => {
  // const apiSource = useCancelRequest();
  let signedUrl = "";
  let fileNameToStore = await fileNameGenrator(file, user_id);
  let path = "";
  let ThumbLink = {};

  switch (type) {
    case "image":
      path = "mediaAttachments/images";
      break;
    case "video":
      try {
        const cover = await getVideoCover(file, 1.5);
        cover.name = file.name.split(".")[0];

        ThumbLink = await awsLinkGenerate(cover, "thumbnail", user_id);
        // let coverUrl=URL.createObjectURL(cover);
        console.log("THUMBNAIL: ", ThumbLink);

        console.log("covercover: ", cover);
        console.log("covercover FILE Name: ");
      } catch (ex) {
        console.log("ERROR: ", ex);
      }
      path = "mediaAttachments/videos";
      break;
    case "document":
      path = "mediaAttachments/documents";
      break;
    case "audio":
      path = "mediaAttachments/audios";
      break;
    case "thumbnail":
      path = "mediaAttachments/thumbnails";
      break;
    default:
      path = "mediaAttachments/documents";
  }

  await apiClient("POST", "common", "getsignedputobjecturl", {
    body: {
      file_key: `${path}/${fileNameToStore}`,
      file_type: file.type,
    },
    shouldUseDefaultToken: false,
    // cancelToken: axios.CancelToken.source().token,
  }).then(
    ({
      content: {
        data: { s3signedPutUrl },
      },
    }) => {
      signedUrl = s3signedPutUrl;
    }
  );

  return {
    file: file,
    signedUrl: signedUrl,
    mime: file.type,
    type: type,
    name: fileNameToStore,
    path: `${path}/${fileNameToStore}`,
    thumbnail: ThumbLink,
  };
};

export const awsCourseFileUpload = async (file, type, user_id) => {
  // const apiSource = useCancelRequest();
  let signedUrl = "";
  let fileNameToStore = await fileNameGenrator(file, user_id);
  let path = "";
  let ThumbLink = {};

  switch (type) {
    case "image":
      path = "courseMedia/images";
      break;
    case "video":
      try {
        const cover = await getVideoCover(file, 1.5);
        cover.name = file.name.split(".")[0];

        ThumbLink = await awsCourseFileUpload(cover, "thumbnail", user_id);
        // let coverUrl=URL.createObjectURL(cover);
        console.log("THUMBNAIL: ", ThumbLink);

        console.log("covercover: ", cover);
        console.log("covercover FILE Name: ");
      } catch (ex) {
        console.log("ERROR: ", ex);
      }
      path = "courseMedia/videos";
      break;
    case "thumbnail":
      path = "courseMedia/videoThumbnail";
      break;
    default:
      path = "courseMedia/images";
  }

  await apiClient("POST", "common", "getsignedputobjecturl", {
    body: {
      file_key: `${path}/${fileNameToStore}`,
      file_type: file.type,
    },
    shouldUseDefaultToken: false,
    // cancelToken: axios.CancelToken.source().token,
  }).then(
    ({
      content: {
        data: { s3signedPutUrl },
      },
    }) => {
      signedUrl = s3signedPutUrl;
    }
  );

  return {
    file: file,
    signedUrl: signedUrl,
    mime: file.type,
    type: type,
    name: fileNameToStore,
    path: `${path}/${fileNameToStore}`,
    thumbnail: ThumbLink,
  };
};
