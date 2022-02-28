import React from 'react'
import Tag  from '../app/javascript/src/modules/News/Components/Tag'

export default {
    title: 'Components/Tag',
    component: Tag,
  };

const Template = (args) => <Tag {...args} />;

export const SimpleTag = Template.bind({});
SimpleTag.args = {
  tag: 'Artist',
};
