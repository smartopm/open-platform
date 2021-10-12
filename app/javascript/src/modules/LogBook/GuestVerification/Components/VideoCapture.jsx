/* eslint-disable max-statements */
import React, { useState, useEffect } from 'react';
import { Button , Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import VideoRecorder from 'react-video-recorder';
import { makeStyles } from '@material-ui/core/styles';
import { useApolloClient } from 'react-apollo';
import LeftArrow from '../../../../../../assets/images/left-arrow.svg';
import RightArrow from '../../../../../../assets/images/right-arrow.svg';
import Person from '../../../../../../assets/images/default_avatar.svg';
import { useFileUpload } from '../../../../graphql/useFileUpload';



export default function VideoCapture({ handleNext }) {
  const [counter, setCounter] = useState(0);
  const [recordingBegin, setRecordingBegin] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const [recordingInstruction, setRecordingInstruction] = useState(faceToTheLeft());
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { onChange, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });

  function onVideoComplete(videoBlob) {
    onChange(videoBlob);
    setRecordingBegin(false);
  }

  function onStartAgain() {
    setCounter(0);
    setRecordingInstruction(faceToTheLeft());
  }

  function faceToTheLeft() {
    return (
      <>
        <Typography variant="h5">Face to the left</Typography>
        <img src={LeftArrow} alt="left-arrow" style={{ width: '20px', height: '20px' }} />
      </>
    );
  }

  function faceToTheRight() {
    return (
      <>
        <Typography variant="h5">Face to the right</Typography>
        <img src={RightArrow} alt="right-arrow" style={{ width: '20px', height: '20px' }} />
      </>
    );
  }

  function faceForward() {
    return (
      <>
        <Typography variant="h5">Face forward</Typography>
        <img src={Person} alt="person" style={{ width: '24px', height: '24px' }} />
      </>
    );
  }

  function recordingDone() {
    return <Typography variant="h5">Done</Typography>;
  }

  function beep() {
    // maybe we can put this in our on wordpress site?
    const audio = new Audio(
      'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3'
    );
    audio.play();
  }

  useEffect(() => {
    if (recordingBegin) {
      // eslint-disable-next-line no-unused-expressions
      counter < 6 && setTimeout(() => setCounter(counter + 1), 1000);
    }

    if (counter === 2) {
      beep();
      setRecordingInstruction(faceForward());
    } else if (counter === 4) {
      beep();
      setRecordingInstruction(faceToTheRight());
    } else if (counter === 6) {
      beep();
      setRecordingInstruction(recordingDone());
      setRecordingCompleted(true);
    }
  }, [counter, recordingBegin]);

  function onContinue() {
    // Send a mutation request to attach the signedBlobId to the entry-request,
    // then move to the next step
    handleNext();
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6">Add a Video with your phone</Typography>
      <Typography className={classes.title}>Create a video to your profile</Typography>
      <div className={classes.greyText}>Be sure:</div>
      <div className={classes.greyText}>
        1. You are in a well lit area and your face is clearly visible
      </div>
      <div className={classes.greyText}>2. Listen to the counter for a chime on when to turn </div>
      <div className={classes.greyText}>
        3. You will be facing forward for 10 seconds, then turn to the left and then to the right.
        The counter will chime each time.
      </div>

      <div className={classes.counter}>
        <Typography variant="h5">{`0${counter} seconds`}</Typography>
        {recordingInstruction}
      </div>
      <div className={classes.videoArea}>
        <VideoRecorder
          onRecordingComplete={onVideoComplete}
          onStartRecording={() => setRecordingBegin(true)}
          onStopReplaying={onStartAgain}
          timeLimit={6000}
          showReplayControls
          countdownTime={0}
          isReplayVideoMuted
          replayVideoAutoplayAndLoopOff
        />
      </div>
      <div className={classes.continueButton}>
        {recordingCompleted && (
          <Button onClick={onContinue} color="primary">
            continue
          </Button>
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    margin: '20px'
  },
  greyText: {
    color: '#8B8B8B'
  },
  title: {
    marginBottom: '15px',
    color: '#8B8B8B'
  },
  counter: {
    textAlign: 'center',
    margin: '18px 0'
  },
  videoArea: {
    width: '76%',
    height: '350px',
    border: '2px dashed #8B8B8B',
    margin: '0 auto'
  },
  continueButton: {
    textAlign: 'center',
    marginTop: '40px'
  }
}));

VideoCapture.propTypes = {
  handleNext: PropTypes.func.isRequired
};
