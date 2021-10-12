/* eslint-disable max-statements */
import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import VideoRecorder from 'react-video-recorder';
import { makeStyles } from '@material-ui/core/styles';
import { useApolloClient } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import LeftArrow from '../../../../../../assets/images/left-arrow.svg';
import RightArrow from '../../../../../../assets/images/right-arrow.svg';
import Person from '../../../../../../assets/images/default_avatar.svg';
import { useFileUpload } from '../../../../graphql/useFileUpload';

export default function VideoCapture({ handleNext }) {
  const [counter, setCounter] = useState(0);
  const [recordingBegin, setRecordingBegin] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation(['common', 'logbook']);
  const [recordingInstruction, setRecordingInstruction] = useState(faceToTheLeft());

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
        <Typography variant="h5">{t('logbook:video_recording.face_left')}</Typography>
        <img src={LeftArrow} alt="left-arrow" style={{ width: '20px', height: '20px' }} />
      </>
    );
  }

  function faceToTheRight() {
    return (
      <>
        <Typography variant="h5">{t('logbook:video_recording.face_right')}</Typography>
        <img src={RightArrow} alt="right-arrow" style={{ width: '20px', height: '20px' }} />
      </>
    );
  }

  function faceForward() {
    return (
      <>
        <Typography variant="h5">{t('logbook:video_recording.face_forward')}</Typography>
        <img src={Person} alt="person" style={{ width: '24px', height: '24px' }} />
      </>
    );
  }

  function recordingDone() {
    return <Typography variant="h5">{t('common:misc.done')}</Typography>;
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
      <Typography variant="h6">{t('logbook:video_recording.add_video_text')}</Typography>
      <Typography className={classes.title}>
        {t('logbook:video_recording.create_video_text')}
      </Typography>
      <div className={classes.greyText} data-testid="be-sure-txt">
        {t('logbook:video_recording.sure')}
        :
      </div>
      <div className={classes.greyText} data-testid="well-lit-txt">
        1. 
        {' '}
        {t('logbook:video_recording.well_lit_area')}
      </div>
      <div className={classes.greyText} data-testid="listen-to-counter-txt">
        2. 
        {' '}
        {t('logbook:video_recording.listen_to_counter')}
      </div>
      <div className={classes.greyText} data-testid="direction-txt">
        3. 
        {' '}
        {t('logbook:video_recording.instruction_on_direction')}
      </div>

      <div className={classes.counter}>
        <Typography variant="h5" data-testid="seconds-txt">
          {`0${counter} ${t(
          'common:misc.seconds'
        )}`}
        </Typography>
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
          <Button onClick={onContinue} color="primary" data-testid="continue-btn">
            {t('common:menu.continue')}
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
