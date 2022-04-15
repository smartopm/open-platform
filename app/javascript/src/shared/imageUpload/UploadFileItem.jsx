import React from 'react';
import { Grid, IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { Spinner } from '../Loading';
import { convertUploadSize } from '../../modules/Forms/utils';


// TODO: Clean up files and truncate them to manage space
export default function UploadFileItem({
  file,
  formState,
  handleUpload,
  handleRemoveFile,
  formPropertyId,
  isUploaded
}) {
  return (
    <Grid container style={{ marginLeft: 31, height: 40 }}>
      <Grid item xs={4}>
        {file.name}
      </Grid>
      <Grid item xs={2}>
        {convertUploadSize(file.size)}
      </Grid>
      <Grid item xs={2}>
        {file.type}
      </Grid>
      <Grid item xs={2}>
        <IconButton
          onClick={() => handleUpload(file, formPropertyId)}
          disabled={formState.isUploading}
          size="small"
        >
          {formState.isUploading && formState.currentFileNames.includes(file.name) ? (
            <Spinner />
          ) : !isUploaded ? (
            <FileUploadIcon />
          ) : null}
        </IconButton>
      </Grid>
      {/* disable removing files after uploaded for now */}
      <Grid item xs={2}>
        {!isUploaded && (
          <IconButton
            onClick={() => handleRemoveFile(file, isUploaded, formPropertyId)}
            disabled={formState.isUploading}
          >
            <CloseIcon />
          </IconButton>
        )}
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
    currentFileNames: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  handleUpload: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  isUploaded: PropTypes.bool.isRequired,
  formPropertyId: PropTypes.string.isRequired
};
