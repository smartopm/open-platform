// TODO @Nurudeen: Make this work
import React from 'react'
import Search  from '../app/javascript/src/modules/Search/Components/Search'

export default {
    title: 'Components/Search',
    component: Search,
  };

const Template = (args) => <Search {...args} />;

export const SimpleSearch = Template.bind({});
SimpleSearch.args = {
  location: {}
};
