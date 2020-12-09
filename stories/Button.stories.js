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

export const FloatingButton = FloatBtnTemplate.bind({});
FloatingButton.args = {
  title: 'I am a fab',
  handleClick: () => {},
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
