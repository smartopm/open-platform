import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { useApolloClient } from 'react-apollo';
import useDialogStyles from './dialogStyles';
import ImageUploader from '../imageUpload/ImageUploader';
import ImageUploadPreview from '../imageUpload/ImageUploadPreview';
import { useFileUpload } from '../../graphql/useFileUpload';

export default function EntryNoteDialog({
  open,
  handleDialogStatus,
  observationHandler,
  token,
  children
}) {
  const classes = useDialogStyles();
  const styles = useStyles();
  const { t } = useTranslation('logbook');
  const [imageUrls, setImageUrls] = useState([])
  const [blobIds, setBlobIds] = useState([])

  const { onChange, signedBlobId, url } = useFileUpload({
    client: useApolloClient()
  });
  

  function handleChange(img) {
    onChange(img)
  }

  useEffect(() => {
    if (url) {
      setImageUrls([...imageUrls, url])
    }
    if (signedBlobId) {
      setBlobIds([...blobIds, signedBlobId])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, signedBlobId]);

  return (
    <>
      {console.log(blobIds)}
      <Dialog
        fullWidth
        open={open}
        onClose={handleDialogStatus}
        aria-labelledby="entry-dialog-title"
        data-testid="entry-dialog"
      >
        <DialogTitle
          id="entry-dialog-title"
          className={classes.title}
          data-testid="entry-dialog-title"
        >
          {t('observations.observation_title')}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{t('observations.add_your_observation')}</Typography>
          <TextField
            id="outlined-multiline-static"
            rows={6}
            variant="outlined"
            value={observationHandler.value}
            onChange={event => observationHandler.handleChange(event.target.value)}
            inputProps={{
              'data-testid': 'entry-dialog-field'
            }}
            multiline
            fullWidth
          />
          {/* <Grid container className={styles.upload}>
            <Grid item sm={8}>Do you have any images you will like to add?</Grid>
            <Grid item sm={4} className={styles.uploadButton}>
              <ImageUploader 
                handleChange={handleChange}
                buttonText='Upload Image'
                style={{background: '#CACACA'}}
              />
            </Grid>
            {imageUrls.length > 0 && (
              <ImageUploadPreview 
                imageUrls={imageUrls} 
                token={token}
                sm={6}
                xs={12}
                style={{padding: '10px'}}
              />
            )}
          </Grid> */}
        </DialogContent>
        <DialogActions>{children}</DialogActions>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles(() => ({ 
  upload: {
    marginTop: '20px'
  },
  uploadButton: {
    textAlign: 'right'
  }
}))

EntryNoteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  observationHandler: PropTypes.shape({
    value: PropTypes.string,
    handleChange: PropTypes.func
  }).isRequired,
  handleDialogStatus: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};
