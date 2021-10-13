/* eslint-disable no-unused-vars */
/* eslint-disable max-statements */
import React, { useState, useEffect, useContext } from 'react';
import { useApolloClient } from 'react-apollo';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, Grid, Typography, makeStyles, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types'
import { Context as AuthStateContext } from '../../../../containers/Provider/AuthStateProvider';
import ImageUploader from '../../../../shared/imageUpload/ImageUploader'
import ImageUploadPreview from '../../../../shared/imageUpload/ImageUploadPreview'
import { useFileUpload } from '../../../../graphql/useFileUpload';

export default function IDCapture({ handleNext }) {
  const [frontImageUrl, setFrontImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [frontBlobId, setFrontBlobId] = useState('');
  const [backBlobId, setBackBlobId] = useState('');
  const authState = useContext(AuthStateContext);
  const matches = useMediaQuery('(max-width:600px)');

  const { onChange, signedBlobId, url } = useFileUpload({
    client: useApolloClient()
  });

  function handleContinue() {
    // const blobIds = [frontBlobId, backBlobId]
    handleNext()
  }

  useEffect(() => {
    if (url) {
      if (uploadType === 'front') {
        setFrontImageUrl(url)
      }
      if (uploadType === 'back') {
        setBackImageUrl(url)
      }
    }
    if (signedBlobId) {
      if (uploadType === 'front') {
        setFrontBlobId(signedBlobId)
      }
      if (uploadType === 'back') {
        setBackBlobId(signedBlobId)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, signedBlobId]);
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12} className={classes.body}>
        <Typography variant='h6' className={classes.header} data-testid='add_photo'>Add a photo of your ID with your phone</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          {!matches && (
            <Grid sm={4} />
          )}
          <Grid item xs={6} sm={2} data-testid='instructions'>
            <ul>
              <li><Typography>Use portrait orientation</Typography></li>
              <li><Typography>Turn off your camera flash</Typography></li>
            </ul>
          </Grid>
          <Grid item xs={6} sm={6}>
            <ul>
              <li><Typography>Use a dark background</Typography></li>
              <li><Typography>Take photo on a flat surface</Typography></li>
            </ul>
          </Grid>
        </Grid>
      </Grid>
      <Grid container alignItems="center" justifyContent="center" direction="row" data-testid='upload_area'>
        <ImageArea 
          handleClick={() => setUploadType('front')} 
          handleChange={(img) => onChange(img)} 
          token={authState.token}
          imageUrl={frontImageUrl}
          type='Front'
        />
        <ImageArea 
          handleClick={() => setUploadType('back')} 
          handleChange={(img) => onChange(img)} 
          token={authState.token}
          imageUrl={backImageUrl}
          type='Back' 
        />
      </Grid>
      <Grid item xs={12} className={classes.body} data-testid='next_button'>
        <Button variant='contained' color='primary' onClick={handleContinue}>continue</Button>
      </Grid>
    </Grid>
  );
}

export function ImageArea({ handleClick, handleChange, imageUrl, token, type }) {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} className={classes.imageGrid} data-testid='image_area'>
      <Paper elevation={0} className={classes.imageArea} style={{height: '300px'}}>
        <Grid container alignItems="center" justifyContent="center" direction="row">
          {imageUrl && (
            <ImageUploadPreview
              imageUrls={[imageUrl]}
              token={token}
              imgHeight={250}
              style={{textAlign: 'center'}}
            />
          )}
          {!imageUrl && (
            <Grid style={{height: 250}} />
          )}
          <Grid item xs={12} onClick={handleClick} style={{textAlign: 'center'}}>
            <Grid container>
              <Grid item xs={6} style={{textAlign: 'right', paddingTop: '8px'}}>
                <Typography variant='h6'>{type}</Typography>
              </Grid>
              <Grid item xs={6} style={{textAlign: 'left'}}>
                <ImageUploader icon={<AddIcon />} handleChange={handleChange} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

const useStyles = makeStyles(() => ({ 
  body: {
    textAlign: 'center'
  },
  header: {
    fontWeight: 'bold'
  },
  imageArea: {
    border: '1px dotted #D0D0D0'
  },
  imageGrid: {
    padding: '20px 30px'
  }
}))

IDCapture.propTypes = {
  /**
   * This if invoked in the Horizontal stepper, it will move to next step
   * This component is a placeholder
   */
  handleNext: PropTypes.func.isRequired
}

ImageArea.propTypes = {
  handleClick: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  imageUrl: PropTypes.func.isRequired,
  token: PropTypes.func.isRequired,
  type: PropTypes.func.isRequired,
}