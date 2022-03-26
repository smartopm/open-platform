/* eslint-disable no-nested-ternary */
// we should migrate this file to individual file in a directory called Text or Typography

import React from 'react';
import { Grid, Hidden, Typography } from '@mui/material';
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

export function HiddenText({ title ,...props }){
  return (
    <Hidden {...props} data-testid="hidden_text">
      <Typography variant='caption' style={{fontWeight: 'bold'}}>{title}</Typography>
      <br />
    </Hidden>
  )
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


HiddenText.propTypes = {
  title: string.isRequired
}