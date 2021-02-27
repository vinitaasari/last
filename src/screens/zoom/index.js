import React, { useEffect } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import { useAuth } from "../../contexts/auth-context";
import { useHistory } from "react-router-dom"

const ZoomComponent = (props) => {
  const { getUserName, getUserEmail } = useAuth();
  const userName = getUserName();
  const userEmail = getUserEmail();
  const history = useHistory();
  console.log("My Objecttttttttttttttt")
  console.log(history.location.state.courseObj)
  let myUrl = `${window.location.origin.toString()}/home`
  if (history.location.state.courseObj && history.location.state.courseObj.course_type === "structured_course") {
    let courseObj = history.location.state.courseObj;
    if (courseObj.no_of_sessions === courseObj.structured_course_session_sequence) {
      myUrl = `${window.location.origin.toString()}/review/structured_course/${courseObj.structured_course_timing_id}/${courseObj.structured_course_session_id}/${courseObj.instructor_id}/${courseObj.id}/1/${courseObj.structured_course_cadence_id}`
    }
    else {
      myUrl = `${window.location.origin.toString()}/review/structured_course/${courseObj.structured_course_timing_id}/${courseObj.structured_course_session_id}/${courseObj.instructor_id}/${courseObj.id}/0/9`
    }
  }
  else if (history.location.state.courseObj && history.location.state.courseObj.course_type === "slot_course") {
    let courseObj = history.location.state.courseObj;
    myUrl = `${window.location.origin.toString()}/review/slot_course/${courseObj.slot_course_session_id}/${courseObj.id}/${courseObj.instructor_id}/0/0/0`

  }
  function joinMeeting(signature, meetConfig) {
    document.getElementById("zmmtg-root").style.display = "block";
    ZoomMtg.init({
      leaveUrl: myUrl,
      isSupportAV: true,
      showMeetingHeader: true,
      disableInvite: true,
      success: function (success) {
        ZoomMtg.join({
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          signature: signature,
          apiKey: meetConfig.apiKey,
          passWord: meetConfig.passWord,

          success: (success) => {
            console.log(success);
            ZoomMtg.showInviteFunction({ show: false });
          },

          error: (error) => {
            console.log(error);
          },
        });
      },
    });
  }

  useEffect(() => {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.8.1/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
  }, []);

  useEffect(() => {
    const {
      meetingId,
      meetingPassword,
      meetingSignature,
      displayName,
    } = props.location.state;
    let meetingConfig;

    if (meetingId && meetingPassword && meetingSignature) {
      meetingConfig = {
        apiKey: "znIOn7IrRpaYqh4CNiPTKg",
        meetingNumber: meetingId,
        userName: displayName || userName,
        userEmail: userEmail, // must be the attendee email address
        passWord: meetingPassword,
        role: 0,
      };
      joinMeeting(meetingSignature, meetingConfig);
    }
  }, []);

  return <div></div>;
};

export default ZoomComponent;
