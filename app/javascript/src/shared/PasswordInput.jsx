import React from 'react';
import { InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PropTypes from 'prop-types';
import { objectAccessor } from '../utils/helpers';

export default function PasswordInput({ label, passwordValue, type, setPasswordValue }) {
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={passwordValue.showPassword ? 'text' : 'password'}
        value={objectAccessor(passwordValue, type)}
        onChange={event => setPasswordValue({ ...passwordValue, [type]: event.target.value })}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() =>
                setPasswordValue({
                  ...passwordValue,
                  showPassword: !passwordValue.showPassword,
                })
              }
              edge="end"
            >
              {passwordValue.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )}
        label={label}
        fullWidth
      />
    </FormControl>
  );
}

PasswordInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setPasswordValue: PropTypes.func.isRequired,
  passwordValue: PropTypes.shape({
    showPassword: PropTypes.bool,
    password: PropTypes.string,
  }).isRequired,
};
