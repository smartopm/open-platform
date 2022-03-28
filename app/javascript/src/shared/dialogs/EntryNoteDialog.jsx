import React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useDialogStyles from './dialogStyles';
import ImageUploader from '../imageUpload/ImageUploader';
import ImageUploadPreview from '../imageUpload/ImageUploadPreview';
import { Spinner } from '../Loading';

export default function EntryNoteDialog({
  open,
  handleDialogStatus,
  observationHandler,
  imageOnchange,
  imageUrls,
  children,
  status,
  closeButtonData
}) {
  const classes = useDialogStyles();
  const styles = useStyles();
  const { t } = useTranslation('logbook');
  return (
    <>
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
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>{t('observations.observation_title')}</Box>
            <Box>
              <IconButton
                data-testid="entry-dialog-close-icon"
                onClick={handleDialogStatus}
                size="large"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{t('observations.add_your_observation')}</Typography>
          <TextField
            id="outlined-multiline-static"
            rows={6}
            variant="outlined"
            label={t('logbook.add_observation')}
            value={observationHandler.value}
            onChange={event => observationHandler.handleChange(event.target.value)}
            inputProps={{
            'data-testid': 'entry-dialog-field'
          }}
            multiline
            fullWidth
          />
          <Grid container className={styles.upload}>
            <Grid item sm={8} data-testid='upload_label'>{t('observations.upload_label')}</Grid>
            <Grid item sm={4} className={styles.uploadButton} data-testid='upload_button'>
              <ImageUploader
                handleChange={imageOnchange}
                buttonText={t('observations.upload_image')}
                style={{background: '#CACACA'}}
                useDefaultIcon
              />
            </Grid>
            {imageUrls.length > 0 && (
            <ImageUploadPreview
              imageUrls={imageUrls}
              sm={6}
              xs={12}
              style={{padding: '10px'}}
              imgHeight='300px'
              closeButtonData={closeButtonData}
            />
          )}
            {status !== 'INIT' && status !== 'DONE' && <Spinner />}
          </Grid>
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
}));

EntryNoteDialog.defaultProps = {
  closeButtonData: {
    closeButton: false,
    handleCloseButton: () => {}
  },
  status: 'INIT'
};

EntryNoteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  observationHandler: PropTypes.shape({
    value: PropTypes.string,
    handleChange: PropTypes.func
  }).isRequired,
  handleDialogStatus: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  imageOnchange: PropTypes.func.isRequired,
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  status: PropTypes.string,
  closeButtonData: PropTypes.shape({
    closeButton: PropTypes.bool,
    handleCloseButton: PropTypes.func
  })
};
