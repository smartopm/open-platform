import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '../app/javascript/src/modules/Payments/Components/PaymentActionMenu'

export default {
  title: 'Components/Payments/ActionMenu',
  component: MenuList
}

const MenuListTemplate = args => (
  <MenuList {...args}>
    <MenuItem>Item one</MenuItem>
    <MenuItem>Item Two</MenuItem>
    <MenuItem>Item Three</MenuItem>
  </MenuList>
)

export const ActionMenu = MenuListTemplate.bind({})
ActionMenu.args = {
  open: true,
  handleClose: () => {},
  anchorEl: {}
}
