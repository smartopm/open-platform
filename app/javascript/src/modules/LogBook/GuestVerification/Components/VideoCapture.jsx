import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography } from '@mui/material';
import VideoRecorder from 'react-video-recorder';
import makeStyles from '@mui/styles/makeStyles';
import { useApolloClient, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import LeftArrow from '../../../../../../assets/images/left-arrow.svg';
import RightArrow from '../../../../../../assets/images/right-arrow.svg';
import Person from '../../../../../../assets/images/default_avatar.svg';
import useFileUpload from '../../../../graphql/useFileUpload';
import { EntryRequestUpdateMutation } from '../../graphql/logbook_mutations';
import MessageAlert from '../../../../components/MessageAlert';
import { EntryRequestContext } from '../Context';
import Video from '../../../../shared/Video';
import { Spinner } from '../../../../shared/Loading';
import CenteredContent from '../../../../components/CenteredContent';
import AccessCheck from '../../../Permissions/Components/AccessCheck';

export default function VideoCapture() {
  const [counter, setCounter] = useState(0);
  const [recordingBegin, setRecordingBegin] = useState(false);
  const [retakeVideo, setRetakeVideo] = useState(false);
  const [recordingCompleted, setRecordingCompleted] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation(['common', 'logbook']);
  const requestContext = useContext(EntryRequestContext);
  const [recordingInstruction, setRecordingInstruction] = useState(videoDirection(t).left);
  const [updateRequest] = useMutation(EntryRequestUpdateMutation);
  const [errorDetails, setDetails] = useState({
    isError: false,
    message: ''
  });

  const { onChange, signedBlobId, status } = useFileUpload({
    client: useApolloClient()
  });

  function onVideoComplete(videoBlob) {
    setRecordingBegin(false);
    onChange(videoBlob);
  }

  function onStartAgain() {
    setCounter(0);
    setRecordingInstruction(videoDirection(t).left);
    setRecordingBegin(false);
    setRecordingCompleted(false);
  }

  function beep() {
    const audio = new Audio(
      'https://doublegdp-import-files.s3.eu-central-1.amazonaws.com/beep.mp3'
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
      setRecordingInstruction(videoDirection(t).forward);
    } else if (counter === 4) {
      beep();
      setRecordingInstruction(videoDirection(t).right);
    } else if (counter === 6) {
      beep();
      setRecordingInstruction(videoDirection(t).done);
      setRecordingCompleted(true);
    }
  }, [counter, recordingBegin]);

  function onContinue() {
    if (!signedBlobId) {
      return;
    }
    updateRequest({ variables: { id: requestContext.request.id, videoBlobId: signedBlobId } })
      .then(() => {
        setDetails({
          ...errorDetails,
          message: t('logbook:video_recording.video_recorded'),
          isError: false
        });
        requestContext.updateRequest({ ...requestContext.request, videoBlobId: signedBlobId });
      })
      .catch(error => {
        setDetails({ ...errorDetails, isError: true, message: error.message });
      });
  }

  return (
    <div className={classes.root}>
      <MessageAlert
        type={!errorDetails.isError ? 'success' : 'error'}
        message={errorDetails.message}
        open={!!errorDetails.message}
        handleClose={() => setDetails({ ...errorDetails, message: '' })}
      />
      <Typography variant="h6">{t('logbook:video_recording.add_video_text')}</Typography>
      <Typography className={classes.title}>
        {t('logbook:video_recording.create_video_text')}
      </Typography>
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
          {`0${counter} ${t('common:misc.seconds')}`}
        </Typography>
        {recordingInstruction}
      </div>
      {requestContext.request?.videoUrl && !retakeVideo ? (
        <Video src={requestContext.request?.videoUrl} />
      ) : (
        <div className={classes.videoArea} data-testid="video_recorder">
          <VideoRecorder
            onRecordingComplete={onVideoComplete}
            onStartRecording={() => setRecordingBegin(true)}
            onStopReplaying={onStartAgain}
            timeLimit={6000}
            mimeType="video/webm"
            showReplayControls
            countdownTime={0}
            isReplayVideoMuted
            replayVideoAutoplayAndLoopOff
          />
        </div>
      )}

      <div className={classes.continueButton}>
        {status === 'FILE_UPLOAD' && <Spinner />}
        <CenteredContent>
          {recordingCompleted && status === 'DONE' && (
            <Button onClick={onContinue} color="primary" data-testid="continue-btn">
              {t('logbook:video_recording.save_video')}
            </Button>
          )}
          {!requestContext.isGuestRequest && !requestContext.request.isEdit && (
            <AccessCheck module="entry_request" allowedPermissions={['can_grant_entry']} show404ForUnauthorized={false}>
              <Button
                onClick={requestContext.grantAccess}
                color="primary"
                data-testid="grant_btn"
                disabled={!requestContext.request.id}
                startIcon={requestContext.request.isLoading && <Spinner />}
              >
                {t('logbook:logbook.grant')}
              </Button>
            </AccessCheck>
          )}
          {requestContext.request.isEdit && (
            <AccessCheck module="entry_request" allowedPermissions={['can_update_entry_request']} show404ForUnauthorized={false}>
              <Button
                onClick={() => setRetakeVideo(true)}
                color="primary"
                data-testid="retake_video_btn"
                disabled={!requestContext.request.id}
              >
                {t('logbook:video_recording.retake')}
              </Button>
            </AccessCheck>
          )}
        </CenteredContent>
      </div>
    </div>
  );
}

export function videoDirection(t) {
  return {
    left: (
      <>
        <Typography variant="h5" data-testid="face-left-txt">
          {t('logbook:video_recording.face_left')}
        </Typography>
        <img
          src={LeftArrow}
          alt="left-arrow"
          style={{ width: '20px', height: '20px' }}
          data-testid="face-left-img"
        />
      </>
    ),
    right: (
      <>
        <Typography variant="h5" data-testid="face-right-txt">
          {t('logbook:video_recording.face_right')}
        </Typography>
        <img
          src={RightArrow}
          alt="right-arrow"
          style={{ width: '20px', height: '20px' }}
          data-testid="face-right-img"
        />
      </>
    ),
    forward: (
      <>
        <Typography variant="h5" data-testid="face-forward-txt">
          {t('logbook:video_recording.face_forward')}
        </Typography>
        <img
          src={Person}
          alt="person"
          style={{ width: '24px', height: '24px' }}
          data-testid="face-forward-img"
        />
      </>
    ),
    done: (
      <Typography variant="h5" data-testid="done-txt">
        {t('common:misc.done')}
      </Typography>
    )
  };
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
