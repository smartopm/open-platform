import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Video from '../../../../shared/Video';
import { EntryRequestContext } from '../Context';
import CenteredContent from '../../../../components/CenteredContent'
import ImageUploadPreview from '../../../../shared/imageUpload/ImageUploadPreview';

export default function RequestConfirmation({ handleGotoStep }) {
  const requestContext = useContext(EntryRequestContext);
  const req = requestContext.request
  const matches = useMediaQuery('(max-width:800px)');
  function checkUserInformation() {
    const info = req.name || req.email || req.phoneNumber
    if (info) {
      return true
    }
    return false
  }

  function checkInfo() {
    const info = req.name || req.email || req.phoneNumber || req.imageUrls || req.videoUrl 
    if (info) {
      return true
    }
    return false
  }
  return (
    <>
      <Grid container style={!matches ? {padding: '0 300px'} : {padding: '20px'}}>
        {checkInfo() ? (
          <Grid item xs={12} sm={12} style={{marginBottom: '20px'}}>
            <Typography variant='h6' style={{fontWeight: 'bold'}}>Review and Confirmation</Typography>
            <Typography>Please review and press submit to complete</Typography>
          </Grid>
        ) : (
          <CenteredContent>Please fill out the previous steps</CenteredContent>
        )}
        {
          checkUserInformation() && (
            <>
              <Grid item xs={6} data-testid='user-info'>
                <Typography style={{fontWeight: 600}}>User Information</Typography>
              </Grid>
              <Grid item xs={6} style={{textAlign: 'right'}} data-testid='edit-info'>
                <Button onClick={() => handleGotoStep(0)}>edit</Button>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={5}>
                    <Typography>Name:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{req.name}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography>Email:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{req.email}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography>Primary Phone:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography>{req.phoneNumber}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )
        }
        
        {
          // @olivier Please we need imageUrls here
          requestContext.request?.imageUrls && (
            <>
              <Grid item xs={6} style={{marginTop: '20px'}}>
                <Typography style={{fontWeight: 600}}>Photo ID</Typography>
              </Grid>
              <Grid item xs={6} style={{textAlign: 'right', marginTop: '20px'}}>
                <Button onClick={() => handleGotoStep(1)}>edit</Button>
              </Grid>
              <Grid item xs={6}>
                <ImageUploadPreview
                  imageUrls={[requestContext.request?.imageUrls[0]]}
                  imgHeight='200px'
                  xs={12}
                  sm={6}
                  style={{ textAlign: 'center' }}
                />
              </Grid>
              <Grid item xs={6}>
                <ImageUploadPreview
                  imageUrls={[requestContext.request?.imageUrls[1]]}
                  imgHeight='200px'
                  xs={12}
                  sm={6}
                  style={{ textAlign: 'center' }}
                />
              </Grid>
              <Grid item xs={6} style={!matches ? {} : {textAlign: "center"}}>
                <Typography>ID FRONT</Typography>
              </Grid>
              <Grid item xs={6} style={!matches ? {} : {textAlign: "center"}}>
                <Typography>ID BACK</Typography>
              </Grid>
            </>
          )
        }

        {
          requestContext.request?.videoUrl && (
            <>
              <Grid item xs={6} style={{marginTop: '20px'}}>
                <Typography style={{fontWeight: 600}}>Video ID</Typography>
              </Grid>
              <Grid item xs={6} onClick={() => handleGotoStep(2)} style={{textAlign: 'right', marginTop: '20px'}}>
                <Button>edit</Button>
              </Grid>
              <Grid item xs={12}>
                <Video src={requestContext.request?.videoUrl} />
              </Grid>
            </>
          )
        }
        {checkInfo() && (
          <Grid item xs={12} style={{textAlign: 'center', marginTop: '40px'}}>
            <Button color='primary' variant='contained'>Submit</Button>
          </Grid>
        )}
      </Grid>
      {console.log(requestContext)}
    </>
  )
}

RequestConfirmation.propTypes = {
  handleGotoStep: PropTypes.func.isRequired
};