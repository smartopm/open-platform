import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';

export default function ProgressBar({ status }) {
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (status === 'FILE_RESIZE') {
      setUploadProgress(20)
    }
    if (status === 'FILE_CHECKSUM') {
      setUploadProgress(40)
    }
    if (status === 'FILE_META_UPLOAD') {
      setUploadProgress(60)
    }
    if (status === 'FILE_UPLOAD') {
      setUploadProgress(80)
    }
    if (status === 'DONE') {
      setUploadProgress(100)
    }
  }, [status])
  return (
    <>
      {status !== 'INIT' && status !== 'DONE' && (
        <LinearProgress variant="determinate" value={uploadProgress} data-testid='progress' />
      )}
    </>
  );
}

ProgressBar.propTypes = {
  status: PropTypes.string.isRequired
};
