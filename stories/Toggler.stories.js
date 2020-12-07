import React from 'react';
import Toggler from '../app/javascript/src/components/Campaign/ToggleButton';

export default {
  title: 'Components/Toggler',
  component: Toggler,
};

const Template = (args) => <Toggler {...args} />;

export const TogglerButtons = Template.bind({});
TogglerButtons.args = {
  type: 'draft',
  handleType: () => {},
  data: {
      type: 'draft',
      antiType: 'scheduled'
  }
};
