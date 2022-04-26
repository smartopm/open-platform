import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

export default function ButtonComponent({
  variant,
  color,
  buttonText,
  handleClick,
  disabled,
  disableElevation,
  size,
  ...otherProps
}) {
  return (
    <>
      <Button
        {...otherProps}
        variant={variant}
        color={color}
        size={size}
        disabled={disabled}
        disableElevation={disableElevation}
        role="button"
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </>
  );
}

ButtonComponent.defaultProps = {
  variant: 'text',
  size: 'medium',
  color: 'default',
  disabled: false,
  disableElevation: true
};

ButtonComponent.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  disableElevation: PropTypes.bool
};
