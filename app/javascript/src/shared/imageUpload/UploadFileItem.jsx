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
    <Grid container style={{ marginLeft: 31}} spacing={2}>
      <Grid item xs>
        {!isUploaded ? (
          <Button
            disabled={formState.isUploading}
            onClick={() => handleUpload(file, formPropertyId)}
            variant="outlined"
            color="primary"
            size="small"
          >
            {
              formState.isUploading &&
              formState.currentFileNames.includes(file.name) &&
              formPropertyId === formState.currentPropId ?  (
                <CircularProgress size={24} color="primary" />
              ) : 'Upload'
            }
          </Button>
        ) : (
          <CheckCircleIcon color="primary" />
        )}
      </Grid>
      <Grid item md={4} xs>
        {cleanFileName(file.name)}
      </Grid>
      <Grid item md={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
        {convertUploadSize(file.size)}
      </Grid>
      <Grid item md={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
        {objectAccessor(fileTypes(translate), file.type) || '-'}
      </Grid>
      <Grid item xs>
        <IconButton
          onClick={() => handleRemoveFile(file, isUploaded, formPropertyId)}
          disabled={formState.isUploading}
          style={{ marginTop: -7 }}
        >
          <CloseIcon />
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
