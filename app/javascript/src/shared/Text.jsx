import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { oneOfType, number, bool, string, node  } from 'prop-types';
import { textProps } from './types/text';

export default function Text({ content, color, otherProps }) {
  return (
    <Typography variant='caption' color={color} gutterBottom {...otherProps}>
      {content}
    </Typography>
  );
}

export function GridText({ content, otherProps, col, statusColor }) {
  return (
    <Grid xs={col || true} md={2} style={statusColor ? {color: statusColor} : null} item>
      <Text content={content} {...otherProps} />
    </Grid>
  );
}

Text.defaultProps = {
  otherProps: {},
  content: null
};

GridText.defaultProps = {
  col: true,
  content: null
};

Text.propTypes = textProps;
GridText.propTypes = {
  ...textProps,
  col: oneOfType([number, bool]),
  content: oneOfType([number, string, node]) 
};
