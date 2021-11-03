import React from 'react';
import FloatButton from '../app/javascript/src/components/FloatButton';

import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  subcomponents: { FloatButton },
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Button {...args} />;

const FloatBtnTemplate = (args) => <FloatButton {...args} />

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};
Primary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/oUdEdIbcdU4XXeroWiquw4/Design-System-Repo?node-id=2%3A4'
  }
};

export const FloatingButton = FloatBtnTemplate.bind({});
FloatingButton.args = {
  title: 'I am a fab',
  handleClick: () => {},
};
FloatingButton.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/oUdEdIbcdU4XXeroWiquw4/Design-System-Repo?node-id=2%3A4'
  }
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};
Secondary.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/oUdEdIbcdU4XXeroWiquw4/Design-System-Repo?node-id=2%3A4'
  }
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};
Large.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/oUdEdIbcdU4XXeroWiquw4/Design-System-Repo?node-id=2%3A4'
  }
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
Small.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/oUdEdIbcdU4XXeroWiquw4/Design-System-Repo?node-id=2%3A4'
  }
};