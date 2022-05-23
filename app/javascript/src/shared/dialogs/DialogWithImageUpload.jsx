import React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Select, SvgIcon, MenuItem, OutlinedInput, Box, IconButton } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
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
  modalDetails,
  editModal
}) {
  const styles = useStyles();
  const matches = useMediaQuery('(max-width:450px)');

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleDialogStatus}
        aria-labelledby="entry-dialog-title"
        data-testid="entry-dialog"
        className={styles.root}
      >
        <DialogTitle id="entry-dialog-title" data-testid="entry-dialog-title">
          <Box display="flex" alignItems="center">
            <Box flexGrow={1} style={{ color: '#575757', fontSize: '24px' }}>
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
        <DialogContent style={{ paddingTop: '10px' }}>
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
          {open && !editModal && (
            <Grid container className={styles.upload}>
              {modalDetails.uploadInstruction && (
                <Grid item sm={8} data-testid="upload_label">
                  {modalDetails.uploadInstruction}
                </Grid>
              )}

              {!matches && (
                <Grid
                  item
                  sm={4}
                  data-testid="upload_button"
                  style={modalDetails?.actionVisibilityOptions ? {} : { textAlign: 'right' }}
                >
                  <ImageUploader
                    handleChange={imageOnchange}
                    buttonText={modalDetails.uploadBtnText}
                    useDefaultIcon
                  />
                </Grid>
              )}
              {!!modalDetails?.actionVisibilityOptions && (
                <Grid item sm={8} style={matches ? { marginBottom: '15px' } : {}}>
                  <FormControl variant="outlined" data-testid="visibilty-select">
                    <InputLabel shrink>{modalDetails.actionVisibilityLabel}</InputLabel>
                    <Box>
                      <Select
                        style={{ width: '180px', height: '42px' }}
                        value={modalDetails.visibilityValue}
                        onChange={e => modalDetails.handleVisibilityOptions(e.target.value)}
                        input={(
                          <OutlinedInput
                            notched
                            label={modalDetails.actionVisibilityLabel}
                            className={styles.selectOutlinedInput}
                          />
                        )}
                        renderValue={value => {
                          return (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <SvgIcon style={{ color: '#000000', opacity: 0.5 }}>
                                <VisibilityIcon />
                              </SvgIcon>
                              {value}
                            </Box>
                          );
                        }}
                      >
                        {Object.entries(modalDetails.actionVisibilityOptions).map(([key, val]) => (
                          <MenuItem key={key} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>
                </Grid>
              )}
              {matches && (
                <Grid
                  item
                  sm={4}
                  data-testid="upload_button"
                  style={modalDetails?.actionVisibilityOptions ? {} : { textAlign: 'right' }}
                >
                  <ImageUploader
                    handleChange={imageOnchange}
                    buttonText={modalDetails.uploadBtnText}
                    useDefaultIcon
                  />
                </Grid>
              )}
              {imageUrls?.length > 0 && (
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
          )}
        </DialogContent>
        <Divider />
        <DialogActions style={{ padding: '20px 24px' }}>{children}</DialogActions>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles(() => ({
  upload: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between'
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
    uploadInstruction: null,
    actionVisibilityOptions: null,
    actionVisibilityLabel: null,
    visibilityValue: null,
    PropTypes: null
  },
  editModal: false,
  imageUrls: [],
  imageOnchange: () => {}
};

DialogWithImageUpload.propTypes = {
  open: PropTypes.bool.isRequired,
  observationHandler: PropTypes.shape({
    value: PropTypes.string,
    handleChange: PropTypes.func
  }).isRequired,
  handleDialogStatus: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  imageOnchange: PropTypes.func,
  imageUrls: PropTypes.arrayOf(PropTypes.string),
  status: PropTypes.string,
  closeButtonData: PropTypes.shape({
    closeButton: PropTypes.bool,
    handleCloseButton: PropTypes.func
  }),
  modalDetails: PropTypes.shape({
    title: PropTypes.string.isRequired,
    inputPlaceholder: PropTypes.string.isRequired,
    uploadBtnText: PropTypes.string,
    subTitle: PropTypes.string,
    uploadInstruction: PropTypes.string,
    actionVisibilityLabel: PropTypes.string,
    visibilityValue: PropTypes.string,
    handleVisibilityOptions: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    actionVisibilityOptions: PropTypes.object
  }),
  editModal: PropTypes.bool
};
