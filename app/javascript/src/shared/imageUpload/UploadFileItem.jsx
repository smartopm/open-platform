import React from 'react';
import { Grid, IconButton, Button, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PropTypes from 'prop-types';
import { cleanFileName, convertUploadSize, fileTypes } from '../../modules/Forms/utils';
import { objectAccessor } from '../../utils/helpers';

export default function UploadFileItem({
  file,
  formState,
  handleUpload,
  handleRemoveFile,
  formPropertyId,
  isUploaded,
  translate
}) {
  return (
    <Grid container style={{ marginLeft: 31, marginBottom: 8}} spacing={2}>
      <Grid item xs>
        {!isUploaded ? (
          <Button
            disabled={formState.isUploading}
            onClick={() => handleUpload(file, formPropertyId)}
            variant="outlined"
            color="primary"
            size="small"
            data-testid="upload_btn"
          >
            {
              formState.isUploading &&
              formState.currentFileNames.includes(file.name) &&
              formPropertyId === formState.currentPropId ?  (
                <CircularProgress size={24} color="primary" data-testid="upload_loader" />
              ) : translate('common:misc.upload')
            }
          </Button>
        ) : (
          <CheckCircleIcon color="primary" data-testid="file_uploaded"  />
        )}
      </Grid>
      <Grid item md={4} xs data-testid="file_name">
        {cleanFileName(file.name)}
      </Grid>
      <Grid item md={2} sx={{ display: { xs: 'none', sm: 'block' } }} data-testid="file_size">
        {convertUploadSize(file.size)}
      </Grid>
      <Grid item md={2} sx={{ display: { xs: 'none', sm: 'block' } }} data-testid="file_type">
        {objectAccessor(fileTypes(translate), file.type) || '-'}
      </Grid>
      <Grid item xs>
        <IconButton
          onClick={() => handleRemoveFile(file, isUploaded, formPropertyId)}
          disabled={formState.isUploading}
          style={{ marginTop: -7 }}
          data-testid="remove_upload_btn"
        >
          <CloseIcon data-testid="remove_upload_icon" />
        </IconButton>
      </Grid>
    </Grid>
  );
}

UploadFileItem.propTypes = {
  file: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.number
  }).isRequired,
  formState: PropTypes.shape({
    isUploading: PropTypes.bool,
    currentPropId: PropTypes.string,
    currentFileNames: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  handleUpload: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  isUploaded: PropTypes.bool.isRequired,
  formPropertyId: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
};