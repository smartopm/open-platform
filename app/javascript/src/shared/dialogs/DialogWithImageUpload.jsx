import React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageUploader from '../imageUpload/ImageUploader';
import ImageUploadPreview from '../imageUpload/ImageUploadPreview';
import { Spinner } from '../Loading';

export default function DialogWithImageUpload({
  open,
  handleDialogStatus,
  observationHandler,
  imageOnchange,
  imageUrls,
  children,
  status,
  closeButtonData,
  modalDetails
}) {
  const styles = useStyles();

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleDialogStatus}
        aria-labelledby="entry-dialog-title"
        data-testid="entry-dialog"
      >
        <DialogTitle id="entry-dialog-title" data-testid="entry-dialog-title">
          <Box display="flex" alignItems="center">
            <Box flexGrow={1} style={{ color: '#575757' }}>
              {modalDetails.title}
            </Box>
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
        <DialogContent>
          {modalDetails.subTitle && <Typography gutterBottom>{modalDetails.subTitle}</Typography>}
          <TextField
            id="outlined-multiline-static"
            rows={6}
            variant="outlined"
            label={modalDetails.inputPlaceholder}
            value={observationHandler.value}
            onChange={event => observationHandler.handleChange(event.target.value)}
            inputProps={{
              'data-testid': 'entry-dialog-field'
            }}
            multiline
            fullWidth
          />
          <Grid container className={styles.upload}>
            {modalDetails.uploadInstruction && (
              <Grid item sm={8} data-testid="upload_label">
                {modalDetails.uploadInstruction}
              </Grid>
            )}
            <Grid
              item
              sm={4}
              className={modalDetails.uploadInstruction ? styles.uploadButton : ''}
              data-testid="upload_button"
            >
              <ImageUploader
                handleChange={imageOnchange}
                buttonText={modalDetails.uploadBtnText}
                useDefaultIcon
              />
            </Grid>
            {imageUrls.length > 0 && (
              <ImageUploadPreview
                imageUrls={imageUrls}
                sm={6}
                xs={12}
                style={{ padding: '10px' }}
                imgHeight="auto"
                imgWidth="100%"
                closeButtonData={closeButtonData}
              />
            )}
            {status !== 'INIT' && status !== 'DONE' && <Spinner />}
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions style={{ padding: '20px 24px' }}>{children}</DialogActions>
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

DialogWithImageUpload.defaultProps = {
  closeButtonData: {
    closeButton: false,
    handleCloseButton: () => {}
  },
  status: 'INIT',
  modalDetails: {
    subTitle: null,
    uploadInstruction: null
  }
};

DialogWithImageUpload.propTypes = {
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
  }),
  modalDetails: PropTypes.shape({
    title: PropTypes.string.isRequired,
    inputPlaceholder: PropTypes.string.isRequired,
    uploadBtnText: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    uploadInstruction: PropTypes.string
  })
};
