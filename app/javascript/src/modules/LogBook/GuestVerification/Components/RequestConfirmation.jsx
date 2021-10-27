import React, { useContext } from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Video from '../../../../shared/Video';
import { EntryRequestContext } from '../Context';

export default function RequestConfirmation() {
  const requestContext = useContext(EntryRequestContext);
  const req = requestContext.request
  function checkUserInformation() {
    const info = req.name || req.email || req.phoneNumber
    if (info) {
      return true
    }
    return false
  }
  return (
    <>
      <Grid container style={{padding: '20px'}}>
        <Grid item xs={12} sm={12} style={{marginBottom: '20px'}}>
          <Typography variant='h6' style={{fontWeight: 500}}>Review and Confirmation</Typography>
          <Typography>Please review and press submit to complete</Typography>
        </Grid>
        {
          checkUserInformation() && (
            <>
              <Grid item xs={6}>
                <Typography>User Information</Typography>
              </Grid>
              <Grid item xs={6} style={{textAlign: 'right'}}>
                <Button>edit</Button>
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
              <Grid item xs={6}>
                <Typography>Photo ID</Typography>
              </Grid>
              <Grid item xs={6} style={{textAlign: 'right'}}>
                <Button>edit</Button>
              </Grid>
              {/* image area goes here */}
              {/* <Grid>ImageArea</Grid> */}
            </>
          )
        }

        {
          requestContext.request?.videoUrl && (
            <>
              <Grid item xs={6}>
                <Typography>Video ID</Typography>
              </Grid>
              <Grid item xs={6} style={{textAlign: 'right'}}>
                <Button>edit</Button>
              </Grid>
              <Grid item xs={12}>
                <Video src={requestContext.request?.videoUrl} />
              </Grid>
            </>
          )
        }
      </Grid>
      {console.log(requestContext)}
    </>
  )
}