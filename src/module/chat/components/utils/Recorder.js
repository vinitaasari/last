import { Box, Grid } from "@material-ui/core";
import React, { useState } from "react";
import { ReactMic } from "react-mic";
import { MdMic } from "react-icons/md";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { FiStopCircle } from "react-icons/fi";
import Timer from "react-compound-timer";
import playButton from "../../icons/Group 19578.svg";

const styles = {
  startButton: {
    backgroundColor: "green",
    outline: "none",
    border: "none",
    color: "white",
    fontWeight: 600,
    padding: "10px",
  },
  stopButton: {
    backgroundColor: "red",
    outline: "none",
    border: "none",
    color: "white",
    fontWeight: 600,
    padding: "10px",
  },
  timer: {
    fontSize: "35px",
    padding: "0px 16px",
  },
};
function Recorder(props) {
  const [record, setRecord] = useState(false);
  const [isRecording, setRecording] = useState(true);
  const [recorderData, setRecordedBlob] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState(false);

  const startRecording = () => {
    setRecord(true);
    // this.setState({ record: true });
    setRecordingStatus(true);
  };

  const stopRecording = () => {
    setRecord(false);
    setRecordingStatus(false);
    // this.setState({ record: false });
  };

  const onData = (recordedBlob) => {
    console.log("chunk of real-time data is: ", recordedBlob);
  };

  const timer = () => {
    setInterval(() => {}, 100);
  };

  const onStop = (recordedBlob) => {
    props.fileHandler(recordedBlob.blob, "audio");
    setRecordedBlob(recordedBlob);
    setRecording(false);
  };

  const customizevalue = (value) => {
    if (parseInt(value) < 10) {
      console.log('value: ',value)
      return "0" + value;
    } else return value;
  };
  
  return (
    <>
      {isRecording ? (
        <>
          <Box style={{ display: "none" }}>
            <ReactMic
              record={record}
              onStop={onStop}
              onData={onData}
              strokeColor="#000000"
              backgroundColor="#ffffff"
            />
          </Box>

          <Grid container style={{ textAlign: "center" }}>
            <Grid xs={12} style={{ lineHeight: 1.2 }}>
              <MdMic style={{ fontSize: "60px" }} />
            </Grid>
            <Grid xs={12}>
              <Timer
                initialTime={0}
                startImmediately={false}
                formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}
                // onStart={() => console.log("onStart hook")}
                // onResume={() => console.log("onResume hook")}
                // onPause={() => console.log("onPause hook")}
                // onStop={() => console.log("onStop hook")}
                // onReset={() => console.log("onReset hook")}
              >
                {({ start, resume, pause, stop, reset, timerState }) => (
                  <React.Fragment>
                    <div style={{ fontSize: "33px" }}>
                      <Timer.Minutes />:<Timer.Seconds />
                    </div>
                    {recordingStatus ? (
                      <FiStopCircle
                        onClick={() => {
                          setRecord(false);
                          setRecordingStatus(false);
                          stop();
                        }}
                        style={{ fontSize: "45px", marginTop: "10px" }}
                      />
                    ) : (
                      <img
                        src={playButton}
                        style={{ marginTop: "10px" }}
                        onClick={() => {
                          setRecord(true);
                          setRecordingStatus(true);
                          start();
                        }}
                      />
                      // <AiOutlinePlayCircle
                      // onClick={() => {
                      //   setRecord(true);
                      //   setRecordingStatus(true);
                      //   start();
                      // }}
                      //   style={{ fontSize: "45px" }}
                      // />
                    )}
                  </React.Fragment>
                )}
              </Timer>
            </Grid>
            {/* <Grid xs={12}>
              {recordingStatus ? (
                <FiStopCircle
                  onClick={stopRecording}
                  style={{ fontSize: "45px" }}
                />
              ) : (
                <AiOutlinePlayCircle
                  onClick={startRecording}
                  style={{ fontSize: "45px" }}
                />
              )}
            </Grid> */}
          </Grid>
          {/* <Box display="flex" flexDirection="row">
            <button
              onClick={startRecording}
              style={styles.startButton}
              type="button"
            >
              Start
            </button>

            <Box style={styles.timer}>
              {recordingStatus? <FaMicrophoneAlt/> :<FaMicrophoneAltSlash/>}
            </Box>

            <button
              onClick={stopRecording}
              style={styles.stopButton}
              type="button"
            >
              Stop
            </button>
          </Box> */}
        </>
      ) : (
        "Processing..."
      )}
    </>
  );
}

export default Recorder;
