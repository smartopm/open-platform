import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { oneOfType, number, bool  } from 'prop-types';
import { textProps } from './types/text';

export default function Text({ content, otherProps }) {
  return (
    <Typography gutterBottom {...otherProps}>
      {content}
    </Typography>
  );
}

export function GridText({ content, otherProps, col }) {
  return (
    <Grid xs={col || true} md={2} item>
      <Text content={content} {...otherProps} />
    </Grid>
  );
}

Text.defaultProps = {
  otherProps: {}
};

GridText.defaultProps = {
  col: true
};

Text.propTypes = textProps;
GridText.propTypes = {
  ...textProps,
  col: oneOfType([number, bool])
};
