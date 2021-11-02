import React from 'react';
import { withDesign } from 'storybook-addon-designs';
import { Typography } from '@material-ui/core';

export default {
  title: 'Components',
  component: Typography,
  decorators: [withDesign]
};

export const Colors = () => <Typography>Colors</Typography>;

Colors.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/oUdEdIbcdU4XXeroWiquw4/Design-System-Repo?node-id=19%3A3092'
  }
};
