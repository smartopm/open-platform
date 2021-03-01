/* eslint-disable no-nested-ternary */
import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { oneOfType, number, bool, string, node  } from 'prop-types';
import { textProps } from './types/text';

export default function Text({ content, color, align, ...otherProps }) {
  return (
    <Typography variant='caption' color={color} align={align} gutterBottom {...otherProps}>
      {content}
    </Typography>
  );
}

export function GridText({ content, col, statusColor, ...otherProps }) {
  return (
    <Grid xs={col || true} md={2} style={statusColor ? {color: statusColor} : null} item>
      <Text content={content} {...otherProps} />
    </Grid>
  );
}

Text.defaultProps = {
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
