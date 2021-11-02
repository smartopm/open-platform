import React from 'react';
import { withDesign } from 'storybook-addon-designs';
import { Typography } from '@material-ui/core';

export default {
  title: 'Components',
  component: Typography,
  decorators: [withDesign]
};

export const Grids = () => <Typography>Grids</Typography>;

Grids.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/oUdEdIbcdU4XXeroWiquw4/?node-id=9%3A269'
  }
};
