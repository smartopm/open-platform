import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

export default function ButtonComponent({ variant, color, buttonText, handleClick}) {
  return (
    <>
      <Button variant={variant} color={color} onClick={() => handleClick()}>
        {buttonText}
      </Button>
    </>
  )
}

ButtonComponent.propTypes = {
  variant: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}