import React from 'react';
import { Paper, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { colorPallete } from '../../../utils/constants';

export default function ColorPicker({ color, handleColor }) {
  const isValidColor = /^#[0-9A-F]{6}$/i.test(color);
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Paper
          variant="outlined"
          style={{ height: '40px', width: '40px', margin: '5px', backgroundColor: `${color}` }}
        />
        <TextField
          margin="dense"
          id={`color-${color}`}
          label="Background color"
          type="text"
          fullWidth
          value={color}
          onChange={e => handleColor(e.target.value)}
          inputProps={{
            'data-testid': 'color'
          }}
          helperText={!isValidColor && 'Color code should be hexadecimal and start with #e.g: #AABB0F'}
          error={!isValidColor}
        />
      </div>
      <div style={{ display: 'flex' }}>
        {colorPallete.map(colorHex => (
          <Paper
            variant="outlined"
            key={colorHex}
            style={{
              height: '40px',
              width: '40px',
              margin: '5px',
              cursor: 'pointer',
              backgroundColor: `${colorHex}`
            }}
            onClick={() => handleColor(colorHex)}
            data-testid="col"
          />
        ))}
      </div>
    </>
  );
}

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  handleColor: PropTypes.func.isRequired
};
