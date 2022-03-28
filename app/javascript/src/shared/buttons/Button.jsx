import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

export default function ButtonComponent({ variant, color, buttonText, handleClick, size, ...otherProps}) {
  return (
    <>
      <Button {...otherProps} variant={variant} color={color} size={size} role="button" onClick={() => handleClick()}>
        {buttonText}
      </Button>
    </>
  )
}

ButtonComponent.defaultProps = {
  variant: 'text',
  size: 'medium',
  color: 'default'
 }

ButtonComponent.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  size: PropTypes.string
}