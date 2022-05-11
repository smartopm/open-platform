import React from 'react';
import { Button, IconButton } from '@mui/material';
import PropTypes from 'prop-types';

export default function ImageUploader({ handleChange, buttonText, style, icon, useDefaultIcon }) {
  return (
    <>
      {!useDefaultIcon ? (
        <>
          <IconButton component="label" data-testid="upload_button_icon" size="large">
            {icon}
            <input
              type="file"
              hidden
              onChange={event => handleChange(event.target.files[0])}
              accept="image/*"
            />
          </IconButton>
        </>
      ) : (
        <Button
          data-testid="upload_button"
          color="primary"
          variant="outlined"
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
      )}
    </>
  );
}

ImageUploader.defaultProps = {
  style: {},
  icon: <div />,
  useDefaultIcon: false
};

ImageUploader.propTypes = {
  handleChange: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  icon: PropTypes.node,
  useDefaultIcon: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object
};
