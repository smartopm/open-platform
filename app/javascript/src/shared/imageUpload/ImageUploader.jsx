import React from 'react'
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function ImageUploader({ handleChange, buttonText, style }) {
  return (
    <>
      <Button
        variant="contained"
        data-testid="upload_button"
        style={style}
        component="label"
      >
        {buttonText}
        <input
          type="file"
          hidden
          onChange={event => handleChange(event.target.files[0])}
          accept="image/*"
        />
      </Button>
    </>
  )
}

ImageUploader.defaultProps = {
  style: {}
}

ImageUploader.propTypes = {
  handleChange: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object
};